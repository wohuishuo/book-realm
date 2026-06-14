# DataStore

> **结论先行**:DataStore 用来保存轻量偏好。书域把 token、账号、字号、阅读进度放在这里,不用为这些小数据单独建表。

## 一句话

DataStore = Android 新一代偏好存储,用协程和 Flow 替代旧的 SharedPreferences。

| 项 | 值 |
| --- | --- |
| 定位 | 轻量键值存储 |
| 适合 | token、设置项、小型状态 |
| 书域位置 | MVP-2 阅读 App |
| 真实文件 | `SessionStore.kt` |

## 解决什么问题

登录 token、字号、最后阅读位置都需要持久化,但它们不是复杂关系数据。用 Room 有点重,用内存又会丢。

DataStore 正好处理这种小状态:

```kotlin
data class SessionSnapshot(
    val token: String = "",
    val account: String = "",
    val username: String = "",
    val fontScale: Float = 1.0f,
    val lastBookId: Long = 0,
    val lastChapterId: Long = 0,
    val lastParagraphIndex: Int = 0,
)
```

## 依赖关系

```
DataStore
  ├─ 保存登录 token
  ├─ 保存字号 fontScale
  └─ 保存阅读进度 lastChapterId / lastParagraphIndex
        │
        ▼
SessionStore 暴露 Flow<SessionSnapshot>
        │
        ▼
ReaderViewModel 合并到 ReaderUiState
```

## 在书域里的角色

MVP-2 登录成功后:

```kotlin
sessionStore.saveLogin(
    token = body.token,
    account = body.user.userAccount,
    username = body.user.username ?: body.user.userAccount,
)
```

阅读器滚动时:

```kotlin
repository.saveProgress(bookId, chapterId, paragraphIndex)
```

真实代码:[SessionStore.kt](https://github.com/wohuishuo/br-reader-app/blob/main/app/src/main/java/com/bookrealm/reader/data/local/SessionStore.kt)

## 真实踩坑

token 放 DataStore 方便开发,但正式产品要考虑更高安全等级,例如加密存储、过期刷新、退出登录清理。MVP 阶段先把链路跑通,再逐步加安全细节。

## 对应资源

- 实战:[MVP-2 阅读 App](/project/reader)
- 相关卡:[Room](/stack/room) · [Jetpack Compose](/stack/jetpack-compose)
