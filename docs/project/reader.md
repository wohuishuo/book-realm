# MVP-2 阅读 App

> **结论先行**:阅读 App 是书域的第一条端到端产品链路。它不自己造用户、不自己造书,而是把 MVP-0 用户中心和 MVP-1 书库服务接到手机上,再用 Room 与 DataStore 把体验留在本地。

仓库:[br-reader-app](https://github.com/wohuishuo/br-reader-app)。本章代码片段来自真实工程。

## 一、它在平台里干什么

**结论:App 是"使用入口",不是"万能后端"。** 登录找用户中心,内容找书库,后续统计和 AI 也都走 HTTP 服务。

```
手机 App
  ├─ 登录:POST /api/user/login  ─────────▶ MVP-0 用户中心
  ├─ 搜书:GET  /api/books?q=西游 ───────▶ MVP-1 书库服务
  ├─ 读章:GET  /api/chapters/{id} ─────▶ MVP-1 书库服务
  ├─ 进度:POST /api/stats/progress ────▶ MVP-3 统计服务(下一步)
  └─ 问答:POST /api/ai/ask ────────────▶ MVP-4 AI 服务(下一步)
```

**根据**:手机端最怕边界混乱。App 一旦直连数据库、直连 RabbitMQ,后续安全、升级、排错都会变难。所以本项目裁决很明确:**App 只面对 HTTP API,不直连 MQ**。MQ 是后端服务间设施,用户登录事件由用户中心发布,阅读进度由 App 通过 HTTP 上报给统计服务。

## 二、地址怎么配:真机不是模拟器

**结论:真机 USB 调试默认用 `adb reverse`,让手机的 localhost 转到电脑后端。**

```kotlin
object ApiConfig {
    private const val HOST = "127.0.0.1"

    const val USER_CENTER_BASE_URL = "http://$HOST:8080/api/"
    const val LIBRARY_BASE_URL = "http://$HOST:8082/api/"
    const val STATS_BASE_URL = "http://$HOST:8083/api/"
    const val AI_BASE_URL = "http://$HOST:8084/api/"
}
```

电脑上执行:

```powershell
adb reverse tcp:8080 tcp:80
adb reverse tcp:8082 tcp:8082
```

**为什么用户中心是 8080 转 80?** 因为手机不能稳定绑定低端口 80,所以 App 访问手机自己的 `127.0.0.1:8080`,adb 再把它转到电脑的 Nginx `:80`。书库服务本来就在电脑 `:8082`,所以直接转 `8082 → 8082`。

::: tip 模拟器和真机别混
模拟器访问电脑用 `10.0.2.2`;真机不能用它。真机要么用局域网 IP,要么像本章这样用 USB `adb reverse`。
:::

## 三、网络层:两套 Retrofit,一个统一返回

**结论:用户中心和书库是两个后端,所以 App 里也保留两个 Retrofit 实例。**

```kotlin
interface UserCenterApi {
    @POST("user/login")
    suspend fun login(@Body request: UserLoginRequest): BaseResponse<LoginUserResponse>
}

interface LibraryApi {
    @GET("books")
    suspend fun listBooks(
        @Query("q") query: String? = null,
        @Query("page") page: Int = 0,
        @Query("size") size: Int = 20,
    ): BaseResponse<BookListResponse>

    @GET("books/{id}")
    suspend fun bookDetail(@Path("id") id: Long): BaseResponse<BookDetailDto>

    @GET("chapters/{id}")
    suspend fun chapterDetail(@Path("id") id: Long): BaseResponse<ChapterDetailDto>
}
```

**根据**:后端统一返回 `{code,data,message}`,App 不能把这个结构散落在每个页面里解。Repository 统一拆包,页面只拿成功数据或错误消息。

```kotlin
private fun <T> BaseResponse<T>.requireData(): T {
    if (code != 0 || data == null) {
        throw IllegalStateException(message.ifBlank { "请求失败: code=$code" })
    }
    return data
}
```

这样页面不会关心 `code` 是什么,只关心"拿到书"还是"显示错误"。

## 四、Repository:把网络和本地缓存包起来

**结论:Repository 是 App 的业务边界。** 页面不直接调用 Retrofit,也不直接写 Room/DataStore。

真实代码节选:

```kotlin
@Singleton
class ReaderRepository @Inject constructor(
    private val userCenterApi: UserCenterApi,
    private val libraryApi: LibraryApi,
    private val bookCacheDao: BookCacheDao,
    private val sessionStore: SessionStore,
) {
    val session = sessionStore.session
    val shelfBooks: Flow<List<BookCacheEntity>> = bookCacheDao.shelfBooks()

    suspend fun login(account: String, password: String) {
        val body = userCenterApi.login(
            UserLoginRequest(
                userAccount = account.trim(),
                userPassword = password,
                loginType = "App",
            )
        ).requireData()

        sessionStore.saveLogin(
            token = body.token,
            account = body.user.userAccount.ifBlank { account.trim() },
            username = body.user.username ?: body.user.userAccount,
        )
    }

    suspend fun searchBooks(query: String?): List<BookItemDto> {
        val books = libraryApi.listBooks(query = query?.takeIf { it.isNotBlank() })
            .requireData()
            .items
        bookCacheDao.upsert(books.map { it.toCacheEntity(inShelf = false) })
        return books
    }
}
```

这段代码讲了三个重要设计:

- 登录成功后保存 token,不是让页面自己保存。
- 搜书成功后顺手写入本地缓存,后面书架和离线体验才有基础。
- `loginType = "App"` 会进入用户中心事件源,给 MVP-3 统计服务使用。

## 五、ViewModel:界面只看状态

**结论:Compose 页面不应该猜"现在是加载、成功还是失败",它只观察一个状态。**

```kotlin
data class ReaderUiState(
    val session: SessionSnapshot = SessionSnapshot(),
    val books: UiState<List<BookItemDto>> = UiState.Loading,
    val shelf: List<BookCacheEntity> = emptyList(),
    val selectedBook: UiState<BookDetailDto>? = null,
    val selectedChapter: UiState<ChapterDetailDto>? = null,
    val query: String = "",
    val notice: String? = null,
)
```

ViewModel 把三份信息合成一个状态:

```kotlin
val uiState: StateFlow<ReaderUiState> = combine(
    mutable,
    repository.session,
    repository.shelfBooks,
) { state, session, shelf ->
    state.copy(session = session, shelf = shelf)
}.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), ReaderUiState())
```

**根据**:手机界面会频繁重组。状态集中后,登录、书城、书架、阅读器都从同一份 `ReaderUiState` 渲染,不会出现"页面 A 以为登录了,页面 B 还以为没登录"这种割裂。

## 六、真实踩坑:能登录,但搜不到书

**结论:这次 bug 不是网络问题,而是分页契约没对齐。书库 `page` 从 0 开始,App 最初传了 1。**

现象:

- 手机能登录,说明用户中心链路是通的。
- 电脑访问 `http://127.0.0.1:8082/api/books?q=西游` 有《西游记》。
- App 搜索没有书。

定位后发现:书库服务默认第一页是 `page=0`,而 Android 端最初写成 `page=1`。种子书只有 2 本,查第二页当然是空。

修复就是把 Retrofit 默认值改回 0:

```kotlin
@GET("books")
suspend fun listBooks(
    @Query("q") query: String? = null,
    @Query("page") page: Int = 0,
    @Query("size") size: Int = 20,
): BaseResponse<BookListResponse>
```

**这个坑值得写进书**:前后端联调时,不要先怀疑"是不是我手机坏了"。按链路查:登录通不通、服务接口通不通、App 参数和后端契约是否一致。大部分问题都能这样拆开。

## 七、本章的真实代码

| 内容 | 文件 |
| --- | --- |
| 后端地址配置 | [ApiConfig.kt](https://github.com/wohuishuo/br-reader-app/blob/main/app/src/main/java/com/bookrealm/reader/data/remote/ApiConfig.kt) |
| Retrofit 接口 | [ReaderApis.kt](https://github.com/wohuishuo/br-reader-app/blob/main/app/src/main/java/com/bookrealm/reader/data/remote/ReaderApis.kt) |
| 统一 DTO | [ApiDtos.kt](https://github.com/wohuishuo/br-reader-app/blob/main/app/src/main/java/com/bookrealm/reader/data/remote/dto/ApiDtos.kt) |
| Repository | [ReaderRepository.kt](https://github.com/wohuishuo/br-reader-app/blob/main/app/src/main/java/com/bookrealm/reader/data/repository/ReaderRepository.kt) |
| ViewModel 状态机 | [ReaderViewModel.kt](https://github.com/wohuishuo/br-reader-app/blob/main/app/src/main/java/com/bookrealm/reader/viewmodel/ReaderViewModel.kt) |
| Room 书架缓存 | [ReaderDatabase.kt](https://github.com/wohuishuo/br-reader-app/blob/main/app/src/main/java/com/bookrealm/reader/data/local/ReaderDatabase.kt) |
| DataStore 登录/偏好 | [SessionStore.kt](https://github.com/wohuishuo/br-reader-app/blob/main/app/src/main/java/com/bookrealm/reader/data/local/SessionStore.kt) |
| Compose 页面入口 | [AppRoot.kt](https://github.com/wohuishuo/br-reader-app/blob/main/app/src/main/java/com/bookrealm/reader/navigation/AppRoot.kt) |

## 本章小结

- **结论**:MVP-2 把 MVP-0 和 MVP-1 接到手机上,形成第一条真实产品链路。
- **根据**:App 只面对 HTTP API;网络、本地缓存、页面状态分别放在 Retrofit/Repository/ViewModel 里。
- **例子**:登录 `root/12345678`,搜索 `西游`,打开《西游记》章节阅读;分页 bug 用 `page=0` 修复。

## 下一步

下一章应该先做 [MVP-3 事件统计](/project/event-stats):用户中心已经能发布 `UserLogin` 事件,App 后续补 `POST /api/stats/progress`。统计服务完成后,阅读 App 就不只是"能读",还能记录"谁在读、读到哪、读了多少"。
