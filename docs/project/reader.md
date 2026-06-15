# MVP-2 阅读 App

> **结论先行**:阅读 App 是书域的第一条端到端产品链路。它不自己造用户、不自己造书,而是把 MVP-0 用户中心、MVP-1 书库、MVP-3 统计、MVP-4 AI 都接到手机上,再用 Room 与 DataStore 把体验留在本地。

仓库:[br-reader-app](https://github.com/wohuishuo/br-reader-app)。本章代码片段来自真实工程。

## 一、它在平台里干什么

**结论:App 是"使用入口",不是"万能后端"。** 登录找用户中心,内容找书库,后续统计和 AI 也都走 HTTP 服务。

```
手机 App
  ├─ 登录:POST /api/user/login  ─────────▶ MVP-0 用户中心
  ├─ 搜书:GET  /api/books?q=西游 ───────▶ MVP-1 书库服务
  ├─ 读章:GET  /api/chapters/{id} ─────▶ MVP-1 书库服务
  ├─ 进度:POST /api/stats/progress ────▶ MVP-3 统计服务
  └─ 问答:POST /api/ai/ask ────────────▶ MVP-4 AI 服务
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
adb reverse tcp:8083 tcp:8083
adb reverse tcp:8084 tcp:8084
```

**为什么用户中心是 8080 转 80?** 因为手机不能稳定绑定低端口 80,所以 App 访问手机自己的 `127.0.0.1:8080`,adb 再把它转到电脑的 Nginx `:80`。书库、统计、AI 服务分别在电脑 `:8082/:8083/:8084`,所以直接同端口反代。

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
| Compose 根导航 | [AppRoot.kt](https://github.com/wohuishuo/br-reader-app/blob/main/app/src/main/java/com/bookrealm/reader/navigation/AppRoot.kt) |
| 页面层 | [ui/screen](https://github.com/wohuishuo/br-reader-app/tree/main/app/src/main/java/com/bookrealm/reader/ui/screen) |
| 组件层 | [ui/component](https://github.com/wohuishuo/br-reader-app/tree/main/app/src/main/java/com/bookrealm/reader/ui/component) |

## 本章小结

- **结论**:MVP-2 把 MVP-0 和 MVP-1 接到手机上,形成第一条真实产品链路。
- **根据**:App 只面对 HTTP API;网络、本地缓存、页面状态分别放在 Retrofit/Repository/ViewModel 里。
- **例子**:登录 `root/12345678`,搜索 `西游`,打开《西游记》章节阅读;分页 bug 用 `page=0` 修复。

## 八、v2.1 第一刀:把阅读器做成产品骨架

> **结论先行**:v2.1 的第一轮不加新后端,先把 App 的“阅读产品感”做出来。书架、详情页、阅读器工具层三块最能改变用户感受,所以先改它们。

### 1. 书架从列表变成继续阅读入口

旧版书架只是本地缓存列表。v2.1 改成两段:

- **继续阅读**:优先显示上次阅读的书和段落;
- **我的书架**:显示已加入书架的书,并保留去书城入口。

这一步学的是起点和微信读书的共同点:书架不是仓库,而是回到阅读的最短路径。

### 2. 详情页从信息块变成长页

旧版详情页只有标题、作者、简介和目录。v2.1 增加:

- 封面占位;
- 标签;
- 开始阅读/继续阅读;
- 加入书架;
- 简介卡片;
- AI 阅读入口说明;
- 目录列表。

这不是为了“好看一点”,而是为了让读者在进入正文前完成判断:这是什么书、我读到哪、现在能不能继续。

### 3. 阅读页进入沉浸模式

旧版阅读页一直显示顶部按钮和 AI 输入框。v2.1 改成:

- 进入章节后隐藏 App 顶部/底部导航;
- 点击正文显示/隐藏阅读工具层;
- 顶部工具层:返回、章节名、更多;
- 底部工具层:目录、设置、摘要、听;
- AI 提问条贴近底部,不挤在正文上方。

这一步来自微信读书参考图:阅读页默认服务正文,工具只在需要时出现。

### 4. 阅读设置先做可用闭环

v2.1 第一轮已做:

- 字号调整;
- 行距调整;
- 纸页、护眼、夜间三种主题;
- 目录底板;
- AI 摘要/提问入口保留。

竖排、分页、选区菜单、词典、划线会放到 v2.1 第二轮和 v2.2,否则第一轮会膨胀。

### 5. 本轮真实代码

第一轮核心改动曾集中在 Compose 入口,第二轮已经把它拆开:

| 改动 | 文件 |
| --- | --- |
| 根导航、Snackbar、沉浸切换 | [AppRoot.kt](https://github.com/wohuishuo/br-reader-app/blob/main/app/src/main/java/com/bookrealm/reader/navigation/AppRoot.kt) |
| 书架最近阅读与书架列表 | [ShelfScreen.kt](https://github.com/wohuishuo/br-reader-app/blob/main/app/src/main/java/com/bookrealm/reader/ui/screen/ShelfScreen.kt) |
| 详情页长页结构 | [BookDetailScreen.kt](https://github.com/wohuishuo/br-reader-app/blob/main/app/src/main/java/com/bookrealm/reader/ui/screen/BookDetailScreen.kt) |
| 阅读页沉浸工具层 | [ReaderScreen.kt](https://github.com/wohuishuo/br-reader-app/blob/main/app/src/main/java/com/bookrealm/reader/ui/screen/ReaderScreen.kt) |
| 封面、列表、状态盒 | [ui/component](https://github.com/wohuishuo/br-reader-app/tree/main/app/src/main/java/com/bookrealm/reader/ui/component) |
| 阅读主题 token | [Tokens.kt](https://github.com/wohuishuo/br-reader-app/blob/main/app/src/main/java/com/bookrealm/reader/ui/theme/Tokens.kt) |

### 6. v2.1 第二轮:先把代码拆干净

**结论:这一步不是为了“文件多一点”,而是为了让后续功能有位置可放。**

拆分前,`AppRoot.kt` 同时负责导航、书架、书城、详情、阅读器、工具栏、封面、空态。这样短期能跑,但继续加划线、笔记、TTS、词典、竖排阅读时,每个功能都会挤进同一个文件。

拆分后:

- `navigation/AppRoot.kt`:只负责根导航、Snackbar、沉浸模式切换;
- `ui/screen`:每个页面一份文件;
- `ui/component`:封面、书籍行、章节行、加载/错误/空态;
- `ui/reader/ReadStyle.kt`:阅读主题、字号、行距模型;
- `ui/theme/Tokens.kt`:颜色、圆角、间距 token。

这一轮还补了 `StateBox`:书城和详情页失败时不再只是显示错误文字,而是出现可点击的“重试”。这件事很小,但它让 App 从“Demo 页面”往“真实产品页面”走了一步。

### 7. v2.1 手感修复:先让阅读页不打架

**结论:阅读器的第一原则是正文优先。** 如果手机通知栏和阅读工具层叠在一起,或者返回键一下退出 App,用户会立刻觉得这是 Demo。

本轮补了三条交互规则:

- 阅读页进入沉浸模式,隐藏手机顶部通知栏,底部工具栏避开系统导航栏;
- AI 提问默认收成右下角圆形入口,点击后才展开输入框;
- Android 返回键按页面层级退出:阅读页回详情,详情回列表,书城/我的回书架,书架二次返回才退出 App。

这一步还不是“美化 UI”,而是把 App 的基础手感拉到能继续迭代的状态。后续做划线、批注、TTS、词典时,都要遵守这个原则:工具可以强,但不能挡住正文。

### 8. v2.1 二次手感修复:让工具层更像阅读器

**结论:阅读器 UI 不能像盖在书上的方块,它应该像系统的一部分。**

本轮继续修了几个真机体验问题:

- 顶部工具条增加状态栏和刘海/摄像头避让,避免标题被前摄挡住;
- 底部工具条改成轻量工具带,只保留一条细分隔线和图标文字,不再像一个厚方块;
- AI 展开面板增加关闭按钮,手机返回键也会先把 AI 收回圆点;
- 打开书籍详情后,底部“书架/书城/我的”可以正常切换,不会被详情页状态卡住;
- 顶部标题按当前页显示“书架/书城/我的”,“退出”只在我的页显示;
- 书架里的找书入口移动到顶部操作区。

这一步说明一个很重要的工程原则:移动端阅读体验必须靠真机反馈。桌面预览看不出摄像头、系统导航栏、返回键这些问题。

## 九、v2.2 裁决:划线笔记先放在书库服务

**结论:划线、笔记、批注先改 `br-library-service`,不新建独立 MVP 仓。**

根据是边界:划线和笔记都依赖书、章节、段落、用户。现在它们还不是独立业务域,放进书库服务最简单,也最容易和 App 联调。

v2.2 最小闭环:

- 后端新增 `reading_marks` / `reading_notes` 表;
- App 长按或选择段落后可以划线、写笔记;
- 章节中能看到自己的划线;
- 详情页或我的页能进入笔记列表;
- AI 回答引用段落时,点击能跳回原文段落。

暂缓:

- 社交评论、点赞、评论的评论;
- 复杂分页引擎;
- 字体导入;
- 竖排阅读;
- TTS 跟读高亮。

这些不是不要,而是等划线/笔记的最小闭环稳定后再进入。TTS 会单独做 `br-tts-service`:Spring Boot 管任务、缓存和 API,Python/Qwen Worker 管推理;App 负责播放、当前句高亮、自动滚动和用户手动打断后的追读恢复。

### 10. v2.2 第一版:段落级划线与笔记

**结论:先做段落级闭环,不急着做精确到字的选区。**

本轮已经完成:

- `br-library-service` 新增 `reading_marks` 表;
- 新增保存、查询章节、查询整本书、删除接口;
- App 长按段落弹出操作面板;
- 可以保存划线或笔记;
- 已划线段落会用淡黄色背景显示;
- 可以把当前段落送去问 AI。

这一步刻意没有做复杂选区。原因是当前书库本来就是按段落建模,AI 引用也是按段落返回。段落级能力先稳定后,再升级到字符范围会更稳。

### 6. 验证

```powershell
cd C:\dev\br-reader-app
./gradlew assembleDebug
```

实测结果:`assembleDebug` 通过,并已通过 adb 安装启动到真机。当前只有 Android Gradle Plugin 与 `compileSdk=35` 的兼容性警告,不影响构建。

## 下一步

下一步进入 v2.2,但要裁剪执行:

- 先做划线、笔记、批注;
- 再做 AI 引用跳转和选中文本解释;
- TTS 另开 `br-tts-service`;
- 分页、字体导入、竖排阅读先做技术 Spike,不要直接塞进主线。
