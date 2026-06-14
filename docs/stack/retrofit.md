# Retrofit

> **结论先行**:Retrofit 是 Android 调后端 API 的标准工具。它把 HTTP 请求写成 Kotlin 接口,让 App 像调用函数一样调用用户中心和书库服务。

## 一句话

Retrofit = HTTP API 的类型安全客户端。

| 项 | 值 |
| --- | --- |
| 定位 | Android 网络请求库 |
| 配合 | OkHttp + kotlinx-serialization |
| 书域位置 | MVP-2 阅读 App |
| 真实文件 | `ReaderApis.kt`、`NetworkModule.kt` |

## 解决什么问题

不用 Retrofit 时,我们要手写 URL、拼参数、处理 JSON、判断错误。代码很快会散在页面里。

Retrofit 把接口声明集中起来:

```kotlin
interface LibraryApi {
    @GET("books")
    suspend fun listBooks(
        @Query("q") query: String? = null,
        @Query("page") page: Int = 0,
        @Query("size") size: Int = 20,
    ): BaseResponse<BookListResponse>
}
```

调用时就是:

```kotlin
val books = libraryApi.listBooks(query = "西游").requireData().items
```

## 依赖关系

```
ApiConfig(baseUrl)
      │
Retrofit + OkHttp + JSON Converter
      │ create()
      ▼
UserCenterApi / LibraryApi
      │
ReaderRepository
```

本项目有两个后端,所以有两个 Retrofit 实例:用户中心和书库服务。

## 在书域里的角色

MVP-2 用 Retrofit 做三件事:

- 登录: `POST /api/user/login`;
- 搜书/详情: `GET /api/books`;
- 读章节: `GET /api/chapters/{id}`。

真实代码:

- [ReaderApis.kt](https://github.com/wohuishuo/br-reader-app/blob/main/app/src/main/java/com/bookrealm/reader/data/remote/ReaderApis.kt)
- [NetworkModule.kt](https://github.com/wohuishuo/br-reader-app/blob/main/app/src/main/java/com/bookrealm/reader/di/NetworkModule.kt)

## 真实踩坑

这次"手机能登录但搜不到书"就是 Retrofit 参数默认值和后端契约没对齐。书库第一页是 `page=0`,App 最初传了 `page=1`,等于查第二页。

结论:接口参数不是小事。前后端契约要写在代码里,也要写进文档。

## 对应资源

- 实战:[MVP-2 阅读 App](/project/reader)
- 相关卡:[Jetpack Compose](/stack/jetpack-compose) · [Docker 与 adb 调试](/stack/docker-adb)
