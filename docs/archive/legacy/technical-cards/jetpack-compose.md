# Jetpack Compose

> **结论先行**:Jetpack Compose 是 Android 的声明式 UI 框架。我们不再手写 XML 布局,而是用 Kotlin 函数描述"当前状态应该长什么样"。

## 一句话

Compose = Android 里的"状态驱动界面"。状态变了,界面自动重组;界面不再自己到处找数据。

| 项 | 值 |
| --- | --- |
| 定位 | Android UI 框架 |
| 语言 | Kotlin |
| 书域位置 | MVP-2 阅读 App |
| 真实入口 | `AppRoot.kt` |

## 解决什么问题

传统 Android 常见痛点是:XML 写布局、Activity/Fragment 找控件、手动更新 UI。项目一大,页面状态很容易散。

Compose 把问题改成一句话:**给定状态,画出界面**。

```kotlin
when (books) {
    UiState.Loading -> LoadingBox()
    is UiState.Error -> EmptyState("书城加载失败", books.message)
    is UiState.Success -> LazyColumn {
        items(books.data) { book ->
            BookCard(book.title, book.author, book.intro, book.tags)
        }
    }
}
```

这段代码表达的是:书籍加载中就转圈,失败就提示,成功就渲染列表。页面不用知道 Retrofit 怎么请求,也不用知道 Room 怎么缓存。

## 依赖关系

```
ViewModel(StateFlow)
      │ 暴露 ReaderUiState
      ▼
Compose 页面
      │ 用户点击
      ▼
ViewModel 调 Repository
```

Compose 依赖 ViewModel 给出的状态。Repository、Retrofit、Room 都不应该直接出现在页面里。

## 在书域里的角色

MVP-2 的三类页面都用 Compose:

- `我的`:登录 `root / 12345678`;
- `书城/书架`:显示书列表;
- `阅读器`:显示章节段落、字号按钮。

真实文件:[AppRoot.kt](https://github.com/wohuishuo/br-reader-app/blob/main/app/src/main/java/com/bookrealm/reader/navigation/AppRoot.kt)

## 真实踩坑

Compose 不是"把 XML 换成 Kotlin"这么简单。真正要守住的是状态边界:页面只渲染 `ReaderUiState`,不要在页面里直接开网络请求。否则页面一重组,请求可能重复发,状态也会乱。

## 对应资源

- 规格:[PRD-006 章节阅读器](/product/prd/prd-006-reader)
- 相关卡:[Retrofit](/stack/retrofit) · [Room](/stack/room) · [DataStore](/stack/datastore)
