# ADR-001:统一鉴权层

> **结论先行**:三个后端服务必须用共享的 JWT 验签过滤器还原调用者身份,客户端不得再传 `userId`。本 ADR 状态为**提案**,等架构会话出工单后实施。

**状态:** Proposed
**日期:** 2026-06-16
**决策人:** 架构会话(Claude)+ 用户拍板
**关联:** [P7 架构](/platform/p7-architecture) · [API 参考](/platform/api-reference)

## 背景

**结论**:当前实现与 P 阶段裁决①("JWT 本地验签")矛盾——下游服务一个验签都没做。

**根据**:

- 三个服务 grep 不到任何 JWT 校验;`ReadingMarkController` 等把 `userId` 作 `@RequestParam` 接收并完全信任。
- 后果是越权(IDOR):改 URL 里的 `userId` 即可读/删他人划线、笔记、进度、段评。
- `WebConfig` 还配了 `allowedOriginPatterns("*") + allowCredentials(true)`,CORS 全开放大了暴露面。

**例子**:`DELETE /marks/3?userId=2` —— 服务端不校验"调用者是不是 2",直接删 2 号用户的划线。

## 决策

**结论**:建共享模块 `br-auth-starter`,每个服务自带验签;身份从 token 来,不从参数来。

- 新建 `br-auth-starter`(共享 jar):`JwtAuthFilter`(HS256 本地验签)+ `@CurrentUser` 参数解析 + 可配白名单。
- 三服务引入该 starter;Controller 把涉及用户的 `@RequestParam Long userId` 改为 `@CurrentUser Long userId`。
- 密钥与 claim 字段名**对齐 user-center 的 `JwtUtils`**(落地前必须核对,这是唯一高风险点)。
- 收紧 CORS:`allowedOriginPatterns("*")` 换成显式来源。

## 选项对比

### 选项 A:共享 starter,服务各自验签(推荐)

| 维度 | 评估 |
| --- | --- |
| 复杂度 | 低(一个 Filter + ArgumentResolver) |
| 安全模型 | 零信任,内网直连也防得住 |
| 漂移风险 | 低(一份代码,三处引用) |
| 团队熟悉度 | 高(可抄 user-center) |

**优点**:防住内网越权;逻辑不拷贝。**缺点**:多一个共享模块要维护。

### 选项 B:只在 API 网关验签

| 维度 | 评估 |
| --- | --- |
| 复杂度 | 中(要先有网关) |
| 安全模型 | 弱(绕过网关直连服务即裸奔) |
| 漂移风险 | 低 |

**优点**:集中。**缺点**:服务不自验,违反零信任;且当前还没网关。

### 选项 C:每服务各写一份过滤器

**优点**:无新模块。**缺点**:三份拷贝必然漂移,正是要避免的债。

## 取舍分析

**结论**:选 A。安全性(零信任)和抗漂移(单份代码)同时拿到,代价只是一个小 starter。网关(选 B 的前提)是可选的、排在后面的事,不应成为鉴权的前置依赖。

## 后果

- ✅ 越权被堵死;CORS 收紧;文档与裁决①恢复一致。
- ⚠️ 变难:所有涉及用户的接口签名变化,App 端要改为携带 `Authorization` 头(登录已拿到 token,改动小)。
- 🔁 需复查:公开读接口(段评列表的"我是否点赞")要支持"有 token 用 uid、无 token 匿名"两态。

## 行动项

1. [ ] 核对 user-center `JwtUtils`:算法、密钥来源、claim 字段名
2. [ ] 建 `br-auth-starter`(JwtAuthFilter + @CurrentUser + 白名单)
3. [ ] 三服务接入,Controller 去客户端 `userId`,收紧 CORS
4. [ ] 补越权负向测试(错 token 删他人 mark → 期望 403)
5. [ ] 落地后回填 TODO 裁决①措辞,本 ADR 状态改 Accepted
