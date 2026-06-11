# 实战篇

> **结论先行**:每个 MVP 一章,讲清"它是怎么做出来的",章末「本章的真实代码」直链对应仓库的真实文件。教学集中在这一本平台书里,各 MVP 仓只留开发用的 README/design/notes。

## 本篇章节

| 章 | MVP | 仓库 | 状态 |
| --- | --- | --- | --- |
| [MVP-0 用户中心](/project/user-center) | 统一登录(JWT) | [user-center-team-project](https://github.com/wohuishuo/user-center-team-project) | ✅ 已完成(前作复用) |
| [MVP-1 书库服务](/project/library) | 图书/章节内容 API | [br-library-service](https://github.com/wohuishuo/br-library-service) | ✅ 已完成 |
| [MVP-2 阅读 App](/project/reader) | Compose 客户端 | br-reader-app(开发中) | ⬜ |
| [MVP-3 事件统计](/project/event-stats) | RabbitMQ 日志/统计 | br-event-stats | ⬜ |
| [MVP-4 AI 服务](/project/ai) | Spring AI + RAG | br-ai-service | ⬜ |

::: tip 这一篇的承诺:读完就懂,不用翻代码
每一章都把**真实代码片段嵌进正文**、把"为什么这么做"和"踩过的坑"讲透。目标是:你**只读这本书**就能讲清整个平台是怎么搭起来的;想往下挖,再点章末「本章的真实代码」去对应仓库。各 MVP 的代码物理上在各自仓库(独立可部署),但**理解平台只需读这一本书**——仓库在哪只是代码存放的细节,不是阅读的负担。
:::

::: warning 章节质量标准(写新章前先看)
对标 [MVP-1 书库章](/project/library) 的深度:结论先行 → 嵌真实代码 → 讲清为什么 → 记真实的坑 → 链真实文件。达不到这个深度的章不算完成(架构会话终审把关)。
:::
