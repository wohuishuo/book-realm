# 技术图鉴

> **结论先行**:技术图鉴不是百科,而是书域的"名词翻译器"。读者在实战篇遇到 Compose、Retrofit、RabbitMQ、RAG 这些词时,能在这里用 3 分钟知道它是什么、解决什么问题、在本项目里放在哪里。

## 怎么读

先读实战篇,卡住再回来看图鉴。不要从第一张卡硬背到最后一张卡;技术只有放回项目链路里才有意义。

```
MVP-0 用户中心 ── Spring Boot / JWT / Docker
MVP-1 书库服务 ── Spring Boot / JPA / MySQL
MVP-2 阅读 App ── Compose / Retrofit / Room / DataStore
MVP-3 统计服务 ── RabbitMQ / 事件消费者
MVP-4 AI 服务 ── Spring AI / RAG / 向量检索
```

## 卡片清单

| 技术 | 先解决哪类疑惑 | 对应 MVP |
| --- | --- | --- |
| [Jetpack Compose](/stack/jetpack-compose) | Android 页面为什么不用 XML | MVP-2 |
| [Retrofit](/stack/retrofit) | App 怎么调用后端接口 | MVP-2 |
| [Room](/stack/room) | 书架为什么能本地保存 | MVP-2 |
| [DataStore](/stack/datastore) | token、字号、进度放哪里 | MVP-2 |
| [Spring Boot](/stack/spring-boot) | 后端服务怎么启动和暴露 API | MVP-0/1/3/4 |
| [RabbitMQ](/stack/rabbitmq) | 登录事件为什么不直接同步写统计 | MVP-3 |
| [Spring AI 与 RAG](/stack/spring-ai-rag) | AI 问答为什么要先检索原文 | MVP-4 |
| [Docker 与 adb 调试](/stack/docker-adb) | 后端和手机怎么在本机联调 | 全平台 |

## 写作标准

每张卡只回答五个问题:

1. 它一句话是什么?
2. 没有它会痛在哪里?
3. 它依赖谁,谁又依赖它?
4. 它在书域哪个文件里出现?
5. 我们踩过什么坑?

能回答这五个问题,读者就能带着理解去看代码。
