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

::: tip 为什么不给每个 MVP 单独建一本书
那会变成 5 个网站、大量重复、维护爆炸。教学内容集中在这本平台书的实战篇,一本读完整个平台;每章用「本章的真实代码」跳到那个 MVP 仓——书与代码闭环,零重复。
:::
