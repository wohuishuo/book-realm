# Unified JWT Validation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement P-21 so library, stats, AI, and Android stop trusting client-supplied `userId` and use the JWT issued by user-center.

**Architecture:** Keep user-center as the JWT issuer and source of the token contract: `subject=userId`, `claim("role")`, JJWT `0.12.6`, shared `jwt.secret`. Add a service-local auth slice to each business service for P-21 instead of creating a new shared module; extraction can happen later after P-21 proves the pattern. Android sends `Authorization: Bearer <token>` automatically, while protected backend controllers read identity from `@CurrentUser`.

**Tech Stack:** Spring Boot 3.3.5, Spring Security, JJWT 0.12.6, MockMvc, H2, Kotlin, OkHttp, Retrofit, DataStore, Cucumber BDD.

---

## Scope Check

P-21 touches multiple repositories. Execute it as child Issues or subagent tasks, but keep one invariant: every protected endpoint must reject missing/invalid tokens before implementation is called, and every personal write/read must derive `userId` from JWT.

## File Map

**book-realm**

- Modify: `docs/specs/features/platform-api.feature` for 401/403 security scenarios.
- Modify: `tests/bdd/platform-api.mjs` to store token and send `Authorization` headers.
- Modify: `docs/architecture/adr/adr-011-unified-jwt-validation.md` after implementation evidence exists.
- Modify: `docs/architecture/api-reference.md` to remove client-owned `userId` from protected API docs.

**br-library-service**

- Modify: `pom.xml` to add Spring Security and JJWT.
- Create: `src/main/java/com/bookrealm/library/auth/AuthenticatedUser.java`
- Create: `src/main/java/com/bookrealm/library/auth/CurrentUser.java`
- Create: `src/main/java/com/bookrealm/library/auth/CurrentUserArgumentResolver.java`
- Create: `src/main/java/com/bookrealm/library/auth/JwtUtils.java`
- Create: `src/main/java/com/bookrealm/library/auth/JwtAuthenticationFilter.java`
- Create: `src/main/java/com/bookrealm/library/config/SecurityConfig.java`
- Modify: `src/main/java/com/bookrealm/library/common/ErrorCode.java`
- Modify: `src/main/java/com/bookrealm/library/controller/ReadingMarkController.java`
- Modify: `src/main/java/com/bookrealm/library/dto/ReadingMarkDtos.java`
- Modify: `src/main/java/com/bookrealm/library/repository/ReadingMarkRepository.java`
- Modify: `src/main/java/com/bookrealm/library/repository/ReadingCommentRepository.java`
- Modify: `src/main/java/com/bookrealm/library/service/ReadingMarkService.java`
- Modify: `src/test/java/com/bookrealm/library/controller/ReadingMarkControllerTest.java`

**br-event-stats**

- Modify: `pom.xml` to add Spring Security and JJWT.
- Create auth files under `src/main/java/com/bookrealm/stats/auth/`.
- Create: `src/main/java/com/bookrealm/stats/config/SecurityConfig.java`
- Modify: `src/main/java/com/bookrealm/stats/common/ErrorCode.java`
- Modify: `src/main/java/com/bookrealm/stats/controller/StatsController.java`
- Modify: `src/main/java/com/bookrealm/stats/dto/ReadingProgressRequest.java`
- Modify: `src/main/java/com/bookrealm/stats/service/StatsService.java`
- Modify: `src/test/java/com/bookrealm/stats/StatsControllerTest.java`

**br-ai-service**

- Modify: `pom.xml` to add Spring Security and JJWT.
- Create auth files under `src/main/java/com/bookrealm/ai/auth/`.
- Create: `src/main/java/com/bookrealm/ai/config/SecurityConfig.java`
- Modify: `src/main/java/com/bookrealm/ai/common/ErrorCode.java`
- Modify: `src/test/java/com/bookrealm/ai/AiControllerTest.java`

**br-reader-app**

- Modify: `app/src/main/java/com/bookrealm/reader/di/NetworkModule.kt`
- Modify: `app/src/main/java/com/bookrealm/reader/data/remote/ReaderApis.kt`
- Modify: `app/src/main/java/com/bookrealm/reader/data/remote/dto/ApiDtos.kt`
- Modify: `app/src/main/java/com/bookrealm/reader/data/repository/ReaderRepository.kt`
- Modify: `app/build.gradle.kts` only if adding MockWebServer unit tests.

## JWT Contract

The implementation must match user-center:

```java
Jwts.builder()
    .subject(String.valueOf(userId))
    .claim("role", role)
    .issuedAt(now)
    .expiration(exp)
    .signWith(key)
    .compact();
```

`role == 1` means `ROLE_ADMIN`; every other role means `ROLE_USER`. Use environment variable fallback `JWT_SECRET` with the current dev value only for local development.

## Task 1: BookRealm acceptance scenarios

**Files:**

- Modify: `book-realm/docs/specs/features/platform-api.feature`
- Modify: `book-realm/tests/bdd/platform-api.mjs`
- Test: `book-realm/tests/bdd/platform-api.mjs`

- [ ] **Step 1: Add failing security scenarios**

Append to `platform-api.feature`:

```gherkin
  @prd-002 @prd-010 @security
  Scenario: 未登录用户不能保存划线笔记
    Given 平台服务已经启动
    And 用户搜索一本书并打开第一章
    When 未登录用户尝试保存划线笔记
    Then 服务应返回未登录错误

  @prd-002 @prd-010 @security
  Scenario: 用户不能删除他人的划线
    Given 平台服务已经启动
    And 用户使用测试账号登录
    And 用户搜索一本书并打开第一章
    And 用户为当前段落保存划线和笔记
    When 另一个用户尝试删除该划线
    Then 服务应返回无权操作错误
```

- [ ] **Step 2: Update BDD helper to support auth headers**

Change the helper signature in `platform-api.mjs`:

```js
async function json(method, url, body, options = {}) {
  activeWorld.actualHttpCalls += 1
  let response, lastError
  const headers = { ...(body ? { 'content-type': 'application/json' } : {}) }
  if (options.token) headers.Authorization = `Bearer ${options.token}`
  for (let attempt = 1; attempt <= 120; attempt += 1) {
    try {
      response = await fetch(url, {
        method,
        headers: Object.keys(headers).length ? headers : undefined,
        body: body ? JSON.stringify(body) : undefined
      })
      break
    } catch (error) {
      lastError = error
      await new Promise((resolve) => setTimeout(resolve, 1_000))
    }
  }
  if (!response) throw new Error(`${method} ${url} could not connect`, { cause: lastError })
  if (options.expectedStatus) {
    assert.equal(response.status, options.expectedStatus, `${method} ${url} returned ${response.status}`)
    return response
  }
  assert.equal(response.ok, true, `${method} ${url} returned ${response.status}`)
  const payload = await response.json()
  assert.equal(payload.code, 0, payload.message ?? `${url} failed`)
  return payload.data
}
```

- [ ] **Step 3: Save token on login and use it in protected calls**

In `用户使用测试账号登录`:

```js
this.token = data.token
this.userId = data.user.id
assert.ok(this.token)
assert.ok(this.userId)
```

In progress, mark, comment, like, and AI calls, pass `{ token: this.token }` and remove body/query `userId` after backend tasks land.

- [ ] **Step 4: Add failure step definitions**

```js
When('未登录用户尝试保存划线笔记', async function () {
  const paragraph = this.chapter.paragraphs[0]
  this.securityResponse = await json('POST', `${urls.library}/marks`, {
    bookId: this.book.id,
    chapterId: this.chapter.id,
    paragraphId: paragraph.id,
    paragraphSeq: paragraph.seq,
    markType: 'NOTE',
    note: `unauthenticated ${Date.now()}`
  }, { expectedStatus: 401 })
})

When('另一个用户尝试删除该划线', async function () {
  const forged = process.env.BDD_OTHER_TOKEN
  assert.ok(forged, 'BDD_OTHER_TOKEN must be set for forbidden-delete scenario')
  this.securityResponse = await json('DELETE', `${urls.library}/marks/${this.mark.id}`, undefined, {
    token: forged,
    expectedStatus: 403
  })
})

Then('服务应返回未登录错误', function () {
  assert.equal(this.securityResponse.status, 401)
})

Then('服务应返回无权操作错误', function () {
  assert.equal(this.securityResponse.status, 403)
})
```

- [ ] **Step 5: Verify scenarios fail before backend implementation**

Run:

```powershell
cd C:\Users\艾莉\知识数据库\起点-安卓项目\book-realm
npm run bdd:dry
```

Expected: dry-run passes. `npm run bdd:api` may fail until backend tasks implement 401/403 and `BDD_OTHER_TOKEN` is configured.

- [ ] **Step 6: Commit**

```powershell
git add docs/specs/features/platform-api.feature tests/bdd/platform-api.mjs
git commit -m "test(bdd): specify jwt auth boundaries"
```

## Task 2: Shared backend auth slice pattern

**Files:**

- Modify each backend `pom.xml`
- Create each backend `auth/*`
- Create each backend `config/SecurityConfig.java`

- [ ] **Step 1: Add dependencies to each backend**

In each service `pom.xml`, add:

```xml
<properties>
    <java.version>21</java.version>
    <jjwt.version>0.12.6</jjwt.version>
</properties>
```

Add dependencies:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>${jjwt.version}</version>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-impl</artifactId>
    <version>${jjwt.version}</version>
    <scope>runtime</scope>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-jackson</artifactId>
    <version>${jjwt.version}</version>
    <scope>runtime</scope>
</dependency>
```

- [ ] **Step 2: Create `AuthenticatedUser`**

Library package example; stats and AI use their own package prefix:

```java
package com.bookrealm.library.auth;

public record AuthenticatedUser(Long userId, Integer role) {
    public boolean isAdmin() {
        return role != null && role == 1;
    }
}
```

- [ ] **Step 3: Create `CurrentUser`**

```java
package com.bookrealm.library.auth;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.PARAMETER)
@Retention(RetentionPolicy.RUNTIME)
public @interface CurrentUser {
    boolean required() default true;
}
```

- [ ] **Step 4: Create `JwtUtils`**

```java
package com.bookrealm.library.auth;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;

@Component
public class JwtUtils {
    private final SecretKey key;

    public JwtUtils(@Value("${jwt.secret:${JWT_SECRET:dev-only-secret-please-change-in-production-0123456789abcdef}}") String secret) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    public AuthenticatedUser parseUser(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
        return new AuthenticatedUser(Long.valueOf(claims.getSubject()), claims.get("role", Integer.class));
    }
}
```

- [ ] **Step 5: Create `JwtAuthenticationFilter`**

```java
package com.bookrealm.library.auth;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtUtils jwtUtils;

    public JwtAuthenticationFilter(JwtUtils jwtUtils) {
        this.jwtUtils = jwtUtils;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            try {
                AuthenticatedUser user = jwtUtils.parseUser(header.substring(7));
                String role = user.isAdmin() ? "ROLE_ADMIN" : "ROLE_USER";
                SecurityContextHolder.getContext().setAuthentication(
                        new UsernamePasswordAuthenticationToken(user, null, List.of(new SimpleGrantedAuthority(role))));
            } catch (Exception ignored) {
                SecurityContextHolder.clearContext();
            }
        }
        chain.doFilter(request, response);
    }
}
```

- [ ] **Step 6: Create `CurrentUserArgumentResolver`**

```java
package com.bookrealm.library.auth;

import org.springframework.core.MethodParameter;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

@Component
public class CurrentUserArgumentResolver implements HandlerMethodArgumentResolver {
    @Override
    public boolean supportsParameter(MethodParameter parameter) {
        return parameter.hasParameterAnnotation(CurrentUser.class)
                && parameter.getParameterType().equals(AuthenticatedUser.class);
    }

    @Override
    public Object resolveArgument(MethodParameter parameter, ModelAndViewContainer mavContainer,
                                  NativeWebRequest webRequest, WebDataBinderFactory binderFactory) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof AuthenticatedUser user) {
            return user;
        }
        return null;
    }
}
```

- [ ] **Step 7: Register argument resolver**

If service already has `WebConfig`, add:

```java
private final CurrentUserArgumentResolver currentUserArgumentResolver;

public WebConfig(CurrentUserArgumentResolver currentUserArgumentResolver) {
    this.currentUserArgumentResolver = currentUserArgumentResolver;
}

@Override
public void addArgumentResolvers(List<HandlerMethodArgumentResolver> resolvers) {
    resolvers.add(currentUserArgumentResolver);
}
```

If service does not have `WebConfig`, create one under `config`.

- [ ] **Step 8: Create JSON 401/403 responses in `SecurityConfig`**

Library example:

```java
package com.bookrealm.library.config;

import com.bookrealm.library.auth.JwtAuthenticationFilter;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .exceptionHandling(e -> e
                        .authenticationEntryPoint((req, res, ex) -> write(res, 401, 40100, "未登录或令牌无效"))
                        .accessDeniedHandler((req, res, ex) -> write(res, 403, 40300, "无权访问")))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/health", "/swagger-ui.html", "/swagger-ui/**", "/v3/api-docs/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/books/**", "/chapters/*").permitAll()
                        .requestMatchers(HttpMethod.GET, "/paragraphs/*/comments", "/books/*/comments", "/paragraphs/*/interactions").permitAll()
                        .anyRequest().authenticated())
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    private static void write(HttpServletResponse response, int status, int code, String message) throws java.io.IOException {
        response.setStatus(status);
        response.setContentType("application/json;charset=UTF-8");
        response.getWriter().write("{\"code\":" + code + ",\"data\":null,\"message\":\"" + message + "\"}");
    }
}
```

- [ ] **Step 9: Compile each service**

Run in each service:

```powershell
mvn test
```

Expected: current tests may fail because controllers still expect client `userId`. Continue to service-specific tasks.

- [ ] **Step 10: Commit auth slice per service after tests pass**

Use service-specific commit messages:

```powershell
git commit -m "feat(auth): add jwt validation boundary"
```

## Task 3: br-library-service protected user data

**Files:**

- Modify controller, DTOs, repositories, service, tests listed in File Map.

- [ ] **Step 1: Write failing MockMvc tests**

Add tests to `ReadingMarkControllerTest`:

```java
private static final String JWT_SECRET = "dev-only-secret-please-change-in-production-0123456789abcdef";

private String bearer(Long userId, int role) {
    var key = io.jsonwebtoken.security.Keys.hmacShaKeyFor(JWT_SECRET.getBytes(java.nio.charset.StandardCharsets.UTF_8));
    String token = io.jsonwebtoken.Jwts.builder()
            .subject(String.valueOf(userId))
            .claim("role", role)
            .issuedAt(new java.util.Date())
            .expiration(new java.util.Date(System.currentTimeMillis() + 3600_000))
            .signWith(key)
            .compact();
    return "Bearer " + token;
}

@Test
void saveMarkWithoutToken_shouldReturn401() throws Exception {
    mockMvc.perform(post("/marks")
            .contentType(MediaType.APPLICATION_JSON)
            .content("""
                {"bookId":1,"chapterId":1,"paragraphId":1,"paragraphSeq":1,"markType":"highlight","note":"x"}
                """))
        .andExpect(status().isUnauthorized());
}

@Test
void deleteOthersMark_shouldReturn403() throws Exception {
    Long owner = 30001L;
    Long other = 30002L;
    Long id = createMark(owner);
    mockMvc.perform(delete("/marks/" + id).header("Authorization", bearer(other, 0)))
        .andExpect(status().isForbidden());
}
```

- [ ] **Step 2: Run library test and verify red**

```powershell
cd C:\Users\艾莉\知识数据库\起点-安卓项目\br-library-service
mvn -Dtest=ReadingMarkControllerTest test
```

Expected before implementation: 200/404 or validation failure, not the expected 401/403.

- [ ] **Step 3: Remove `userId` from request DTOs**

Change records:

```java
public record SaveMarkRequest(
    @NotNull Long bookId,
    @NotNull Long chapterId,
    @NotNull Long paragraphId,
    @NotNull Integer paragraphSeq,
    String markType,
    String note
) {}

public record SaveCommentRequest(
    @NotNull Long bookId,
    @NotNull Long chapterId,
    @NotNull Long paragraphId,
    String content
) {}
```

- [ ] **Step 4: Update controller to use `@CurrentUser`**

Example signatures:

```java
@PostMapping("/marks")
public BaseResponse<ReadingMarkDtos.MarkItem> save(
        @CurrentUser AuthenticatedUser user,
        @Valid @RequestBody ReadingMarkDtos.SaveMarkRequest request) {
    return ResultUtils.success(markService.save(user.userId(), request));
}

@GetMapping("/chapters/{chapterId}/marks")
public BaseResponse<List<ReadingMarkDtos.MarkItem>> listChapter(
        @CurrentUser AuthenticatedUser user,
        @PathVariable Long chapterId) {
    return ResultUtils.success(markService.listChapter(user.userId(), chapterId));
}

@DeleteMapping("/marks/{id}")
public BaseResponse<Boolean> delete(@CurrentUser AuthenticatedUser user, @PathVariable Long id) {
    markService.delete(user.userId(), id);
    return ResultUtils.success(true);
}
```

- [ ] **Step 5: Keep public comment/interactions optional**

For optional user context:

```java
@GetMapping("/paragraphs/{paragraphId}/interactions")
public BaseResponse<ReadingMarkDtos.ParagraphInteraction> paragraphInteraction(
        @CurrentUser(required = false) AuthenticatedUser user,
        @PathVariable Long paragraphId) {
    Long userId = user == null ? null : user.userId();
    return ResultUtils.success(markService.paragraphInteraction(paragraphId, userId));
}
```

- [ ] **Step 6: Add repository methods for ownership checks**

```java
Optional<ReadingMark> findByIdAndIsDelete(Long id, Integer isDelete);
Optional<ReadingComment> findByIdAndIsDelete(Long id, Integer isDelete);
```

- [ ] **Step 7: Make service throw forbidden for existing non-owner resources**

```java
public void delete(Long userId, Long id) {
    ReadingMark mark = markRepo.findByIdAndIsDelete(id, 0)
        .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND, "标记不存在"));
    if (!mark.getUserId().equals(userId)) {
        throw new BusinessException(ErrorCode.FORBIDDEN, "不能删除他人的标记");
    }
    mark.setIsDelete(1);
    markRepo.save(mark);
}
```

Apply the same pattern to `deleteComment`.

- [ ] **Step 8: Add `FORBIDDEN` to `ErrorCode` and HTTP status mapping**

```java
UNAUTHORIZED(40100, "未登录或令牌无效"),
FORBIDDEN(40300, "无权访问"),
```

Update `GlobalExceptionHandler` to return `ResponseEntity<BaseResponse<?>>` and map `FORBIDDEN` to HTTP 403.

- [ ] **Step 9: Run library tests**

```powershell
mvn test
```

Expected: all library tests pass; protected endpoints require tokens; public book/chapter endpoints remain anonymous.

- [ ] **Step 10: Commit**

```powershell
git add pom.xml src/main src/test
git commit -m "feat(auth): derive library user identity from jwt"
```

## Task 4: br-event-stats progress identity

**Files:**

- Modify `StatsController`, `ReadingProgressRequest`, `StatsService`, `StatsControllerTest`.

- [ ] **Step 1: Write failing tests**

Add to `StatsControllerTest`:

```java
@Test
void progressWithoutToken_shouldReturn401() throws Exception {
    mockMvc.perform(post("/stats/progress")
            .contentType(MediaType.APPLICATION_JSON)
            .content("""
                {"bookId":1,"chapterId":1,"paragraphIndex":5}
                """))
        .andExpect(status().isUnauthorized());
}
```

- [ ] **Step 2: Remove client `userId` from request DTO**

```java
public class ReadingProgressRequest {
    @NotNull
    private Long bookId;
    @NotNull
    private Long chapterId;
    @Min(0)
    private int paragraphIndex;
    // getters/setters for bookId/chapterId/paragraphIndex only
}
```

- [ ] **Step 3: Inject `@CurrentUser` in controller**

```java
@PostMapping("/progress")
public BaseResponse<ReadingStatsResponse> reportProgress(
        @CurrentUser AuthenticatedUser user,
        @Valid @RequestBody ReadingProgressRequest request) {
    return ResultUtils.success(statsService.reportReadingProgress(user.userId(), request));
}
```

- [ ] **Step 4: Change service signature**

```java
public ReadingStatsResponse reportReadingProgress(Long userId, ReadingProgressRequest req) {
    LocalDate today = LocalDate.now();
    ReadingStats stats = readingStatsRepository
            .findByUserIdAndBookIdAndStatsDate(userId, req.getBookId(), today)
            .orElseGet(() -> new ReadingStats(userId, req.getBookId(), req.getChapterId(), req.getParagraphIndex(), today));
    if (stats.getId() != null) stats.updateProgress(req.getChapterId(), req.getParagraphIndex());
    return ReadingStatsResponse.from(readingStatsRepository.save(stats));
}
```

- [ ] **Step 5: Admin-protect stats query endpoints**

In stats `SecurityConfig`:

```java
.requestMatchers(HttpMethod.GET, "/stats/logins", "/stats/reading").hasRole("ADMIN")
.requestMatchers(HttpMethod.POST, "/stats/progress").authenticated()
```

- [ ] **Step 6: Update service tests**

Change calls from `reportReadingProgress(request)` to:

```java
statsService.reportReadingProgress(2L, request);
```

- [ ] **Step 7: Run stats tests**

```powershell
cd C:\Users\艾莉\知识数据库\起点-安卓项目\br-event-stats
mvn test
```

- [ ] **Step 8: Commit**

```powershell
git add pom.xml src/main src/test
git commit -m "feat(auth): derive stats user identity from jwt"
```

## Task 5: br-ai-service JWT boundary

**Files:**

- Modify `AiControllerTest`, add auth slice and `SecurityConfig`.

- [ ] **Step 1: Write failing tests**

Add to `AiControllerTest`:

```java
@Test
void askWithoutToken_shouldReturn401() throws Exception {
    mockMvc.perform(post("/ai/ask")
            .contentType(MediaType.APPLICATION_JSON)
            .content("""
                {"bookId":1,"question":"仙石是什么"}
                """))
        .andExpect(status().isUnauthorized());
}
```

- [ ] **Step 2: Protect AI endpoints**

In AI `SecurityConfig`:

```java
.requestMatchers("/health", "/swagger-ui.html", "/swagger-ui/**", "/v3/api-docs/**").permitAll()
.requestMatchers(HttpMethod.POST, "/ai/**").authenticated()
.anyRequest().authenticated()
```

- [ ] **Step 3: Add bearer token to existing AI tests**

```java
mockMvc.perform(post("/ai/summary")
        .header("Authorization", bearer(2L, 0))
        .contentType(MediaType.APPLICATION_JSON)
        .content("""
            {"chapterText":"灵根育孕源流出，心性修持大道生。这里是一段很长很长的章节文本，用来验证没有 key 时服务仍然能给出友好摘要。"}
            """))
```

- [ ] **Step 4: Run AI tests**

```powershell
cd C:\Users\艾莉\知识数据库\起点-安卓项目\br-ai-service
mvn test
```

- [ ] **Step 5: Commit**

```powershell
git add pom.xml src/main src/test
git commit -m "feat(auth): protect ai reading endpoints with jwt"
```

## Task 6: Android token propagation and DTO cleanup

**Files:**

- Modify Android files listed in File Map.

- [ ] **Step 1: Add token interceptor**

Change `NetworkModule.okHttpClient`:

```kotlin
@Provides
@Singleton
fun okHttpClient(sessionStore: SessionStore): OkHttpClient = OkHttpClient.Builder()
    .addInterceptor { chain ->
        val token = kotlinx.coroutines.runBlocking {
            sessionStore.session.first().token
        }
        val request = if (token.isNotBlank()) {
            chain.request().newBuilder()
                .header("Authorization", "Bearer $token")
                .build()
        } else {
            chain.request()
        }
        chain.proceed(request)
    }
    .addInterceptor(HttpLoggingInterceptor().apply { level = HttpLoggingInterceptor.Level.BASIC })
    .build()
```

Add imports:

```kotlin
import com.bookrealm.reader.data.local.SessionStore
import kotlinx.coroutines.flow.first
```

- [ ] **Step 2: Remove `userId` from protected Retrofit signatures**

```kotlin
@GET("chapters/{id}/marks")
suspend fun chapterMarks(@Path("id") chapterId: Long): BaseResponse<List<MarkItemDto>>

@DELETE("marks/{id}")
suspend fun deleteMark(@Path("id") id: Long): BaseResponse<Boolean>

@POST("comments/{id}/like")
suspend fun likeComment(@Path("id") id: Long): BaseResponse<CommentItemDto>

@DELETE("comments/{id}/like")
suspend fun unlikeComment(@Path("id") id: Long): BaseResponse<CommentItemDto>
```

- [ ] **Step 3: Remove `userId` from request DTOs**

```kotlin
@Serializable
data class SaveMarkRequest(
    val bookId: Long,
    val chapterId: Long,
    val paragraphId: Long,
    val paragraphSeq: Int,
    val markType: String = "highlight",
    val note: String? = null,
)

@Serializable
data class ReadingProgressRequest(
    val bookId: Long,
    val chapterId: Long,
    val paragraphIndex: Int,
)
```

- [ ] **Step 4: Update repository calls**

Examples:

```kotlin
return libraryApi.chapterMarks(chapterId).requireData()
```

```kotlin
statsApi.reportProgress(
    ReadingProgressRequest(
        bookId = bookId,
        chapterId = chapterId,
        paragraphIndex = paragraphIndex,
    )
).requireData()
```

- [ ] **Step 5: Build Android**

```powershell
cd C:\dev\br-reader-app
.\gradlew.bat testDebugUnitTest assembleDebug
```

- [ ] **Step 6: Commit**

```powershell
git add app/src/main app/build.gradle.kts
git commit -m "feat(auth): send jwt to business services"
```

## Task 7: Platform verification and docs

**Files:**

- Modify `book-realm/docs/architecture/adr/adr-011-unified-jwt-validation.md`
- Modify `book-realm/docs/architecture/api-reference.md`
- Modify `book-realm/docs/product/capability-inventory.md` if status evidence changes.

- [ ] **Step 1: Update ADR-011 only after all code tasks pass**

Set status:

```md
status: Implemented
```

Add evidence:

```md
## Evidence
- br-library-service: `mvn test`
- br-event-stats: `mvn test`
- br-ai-service: `mvn test`
- br-reader-app: `gradlew.bat testDebugUnitTest assembleDebug`
- book-realm: `npm run bdd:api`
```

- [ ] **Step 2: Update API reference**

Document:

```md
Protected endpoints require `Authorization: Bearer <token>`.
Protected requests no longer accept `userId`; services derive it from the JWT subject.
```

- [ ] **Step 3: Run platform checks**

```powershell
cd C:\Users\艾莉\知识数据库\起点-安卓项目\book-realm
npm run docs:build
npm run verify:fast
npm run bdd:api
```

- [ ] **Step 4: Commit docs evidence**

```powershell
git add docs/architecture docs/product docs/specs tests/bdd
git commit -m "docs(auth): record jwt validation evidence"
```

## Task 8: Review gate

**Files:**

- No code files; use PR/Linear evidence.

- [ ] **Step 1: Confirm no protected endpoint still accepts client `userId`**

Run:

```powershell
rg -n "@RequestParam.*userId|PathVariable Long userId|setUserId\\(|userId\\s*:" br-library-service br-event-stats br-ai-service C:\dev\br-reader-app\app\src\main
```

Expected: no client request path/body sets `userId` for protected endpoints. Entity/response/user-session occurrences may remain.

- [ ] **Step 2: Confirm missing/invalid token behavior**

Run curl/manual checks:

```powershell
curl -i -X POST http://localhost:8082/api/marks -H "content-type: application/json" -d "{\"bookId\":1,\"chapterId\":1,\"paragraphId\":1,\"paragraphSeq\":1}"
curl -i -X POST http://localhost:8083/api/stats/progress -H "content-type: application/json" -d "{\"bookId\":1,\"chapterId\":1,\"paragraphIndex\":1}"
curl -i -X POST http://localhost:8084/api/ai/ask -H "content-type: application/json" -d "{\"bookId\":1,\"question\":\"x\"}"
```

Expected: HTTP 401 for all three.

- [ ] **Step 3: Update Linear P-21**

Move P-21 to In Review and paste:

```md
## Evidence
- library: mvn test
- stats: mvn test
- ai: mvn test
- Android: gradlew testDebugUnitTest assembleDebug
- Platform: npm run bdd:api
- PR links:
```

## Self-Review

**Spec coverage:** P-21 requires consistent JWT validation, server-derived identity, and forged/expired/unauthorized tests. Tasks 2–5 implement backend auth, Task 6 updates Android token propagation, Tasks 1 and 7 add platform acceptance, and Task 8 adds review evidence.

**Placeholder scan:** The plan contains concrete commands, file paths, and code examples; no deferred-fill markers remain.

**Type consistency:** The plan consistently uses `AuthenticatedUser(Long userId, Integer role)`, `@CurrentUser AuthenticatedUser user`, `JWT subject=userId`, and `role==1` for admin.
