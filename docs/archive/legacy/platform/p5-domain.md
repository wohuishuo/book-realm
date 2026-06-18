# P5 领域模型与 BC 映射

> **结论先行**:书域划分为五个 Bounded Context——用户 BC(认证)、书库 BC(内容 API)、阅读 BC(App 缓存)、统计 BC(事件消费)、AI BC(RAG 问答)。各 BC 拥有独立实体,只通过 API 或事件通信,实体不跨 BC 重叠。

## 一、五个 BC 分述

### BC-1:用户 BC(MVP-0,复用 user-center)

**结论:用户 BC 只做三件事——注册、登录、发事件。**

**根据**:用户 BC 已由 user-center-team-project 独立仓库完成,书域只使用它的接口契约。注册返回用户 ID,登录返回 JWT,登录成功时发布 UserLogin 事件到 RabbitMQ。Token 校验由拦截器完成,对其他 BC 透明。

**对外接口**(以 user-center 真实代码为准):`POST /api/user/register`、`POST /api/user/login`、`GET /api/user/current`。JWT 由各后端服务**本地验签**(共享密钥),不设 validate 接口。

### BC-2:书库 BC(MVP-1)

**结论:书库 BC 管理四类实体——Book、Chapter、Paragraph、Tag,对外提供 REST API。**

**根据**:实体设计来源于旧 Android 项目 Room 实体的简化——去掉了网文专属字段(votes、rank、signStatus),只保留公版书核心字段。Book 和 Tag 多对多,Book 和 Chapter 一对多,Chapter 和 Paragraph 一对多。

**实体关系**:
```
Book 1───* Chapter 1───* Paragraph         Book *───* Tag
```

**对外接口**:`GET /api/books`(+?q=&tag=)、`GET/POST/PUT/DELETE /api/books`、`GET /api/books/{id}/chapters`、`GET /api/chapters/{id}`

**例子**:`GET /api/books?q=西游记&tag=名著` 返回一条 JSON——App 书城直接渲染,不需要二次处理。

### BC-3:阅读 BC(MVP-2,Android 本地)

**结论:阅读 BC 的三个实体只存 Room 本地,不暴露为服务端 API。**

**根据**:书架和阅读进度是 App 本地行为。BookCache 是书库数据的镜像,ChapterCache 是章节元数据的镜像,ReadingProgress 记录当前读到第几章第几段。进度同步不建服务端书架表——JWT 已标识用户,进度通过 ReadingProgress 事件异步上报即可。

**实体**(仅 Room):BookCache、ChapterCache、ReadingProgress

**例子**:读者从书库加载《西游记》第一章后,ChapterCache 存入本地。下次打开同一章直接读 Room,零网络请求。退出时 ReadingProgress 事件异步上报,不阻塞翻页。

### BC-4:统计 BC(MVP-3)

**结论:统计 BC 消费两个领域事件,维护三张表,提供一个查询 API。**

**根据**:训练课题原文要求统计"用户按设备类型的登录次数"。LoginEventConsumer 消费 UserLogin 事件,按 loginType 分别聚合到 LoginStats.appLogins 和 LoginStats.webLogins。LoginLog 保留每次登录的原始记录,LoginStats 和 ReadingStats 按天聚合。

**对外接口**:`GET /api/stats/logins?from=&to=`、`GET /api/stats/reading?from=&to=`

**例子**:管理员访问 `GET /api/stats/logins?from=2026-06-01&to=2026-06-07`,返回该周每天的总登录次数、App 登录次数、Web 登录次数。数据来自 LoginStats 表,由 LoginEventConsumer 在每次登录事件后增量更新。

### BC-5:AI BC(MVP-4)

**结论:AI BC 管理向量片段实体,提供问答、摘要和向量化三个接口。**

**根据**:ChapterVector 的 embedding 字段存于 SimpleVectorStore(Spring AI 内置内存实现,MVP 阶段零运维)。向量检索限定 chapterId 范围,避免跨章节误检。后续通过 VectorStore 接口切 PGVector/Milvus 不改业务代码。

**对外接口**:`POST /api/ai/ask`({selectedText, chapterId, question})、`POST /api/ai/summary`({chapterText})、`POST /api/ai/embed`({bookId})

**例子**:`POST /api/ai/ask` 带选中文本"灵根育孕源流出"+chapterId=3+问题"灵根指什么",AI 服务在向量库检索第 3 章内最相关的 Top-3 段落,组 prompt 发 DeepSeek,返回带段落编号引用的回答。

## 二、领域事件表

**结论:两个事件驱动平台异步解耦——UserLogin 满足训练课题,ReadingProgress 满足阅读统计。**

| 事件 | 载荷 | 生产者 | 消费者 |
| --- | --- | --- | --- |
| **UserLogin** | userId, loginType(App/Web), loginTime, ipAddress | 用户 BC(AuthService) | 统计 BC(日志落盘 + 登录聚合) |
| **ReadingProgress** | userId, bookId, chapterId, paragraphIndex, timestamp | 统计 BC 的 HTTP 入口(App 经 `POST /api/stats/progress` 上报;**App 不直连 MQ**) | 统计 BC(阅读聚合) |

**根据**:两个事件的载荷字段都足够消费者独立完成处理——UserLogin 带了 loginType 用于按设备类型聚合;ReadingProgress 带了 paragraphIndex 用于精确定位阅读位置。

## 三、BC 映射图

**结论:BC 之间只通过两条通道通信——同步 HTTP+JWT(App 到后端服务)和异步 RabbitMQ(事件发布与消费)。**

```
                   发布 UserLogin(异步)
     ┌───────────┐ ────────────────────────> ┌───────────┐
     │ 用户 BC   │                             │ 统计 BC   │
     │ MVP-0     │                             │ MVP-3     │
     └─────┬─────┘                             └─────┬─────┘
           │ JWT(同步)                               │
           ▼                                         │ ReadingProgress
     ┌───────────┐                                   │ (异步)
     │ 阅读 BC   │ ── GET /api/books/* ──────────> ┌──┴────────┐
     │ MVP-2 App │ <── 章节 JSON ───────────────── │ 书库 BC   │
     └─────┬─────┘                                  │ MVP-1     │
           │                                        └───────────┘
           │ POST /api/ai/ask(同步)
           ▼
     ┌───────────┐
     │ AI BC     │
     │ MVP-4     │
     └───────────┘
```

**通信约定**:同步走 HTTP+JWT(App→用户中心、App→书库、App→AI、**App→统计的进度上报**);异步 RabbitMQ **仅用于后端服务之间**(用户中心→统计的 UserLogin 事件)。架构裁决:移动端不直连消息队列——凭据下发到客户端不安全,弱网下也不可靠。

## 四、包图

**结论:每个 BC 一个独立包(或独立仓库),包之间不直接 import。**

```
com.bookrealm.user                    com.bookrealm.library
├── controller/AuthController         ├── controller/BookController, ChapterController
├── service/AuthService               ├── service/BookService, ChapterService, FileService
├── entity/User                       ├── entity/Book, Chapter, Paragraph, Tag
├── event/UserLoginEvent              ├── repository/*
└── config/SecurityConfig             └── config/JpaConfig

com.bookrealm.reader (Android)        com.bookrealm.stats
├── ui/阅读器, 书架, 书城              ├── controller/StatsController
├── viewmodel/                        ├── service/StatsQueryService
├── data/local/Room                   ├── consumer/LoginEventConsumer, ReadingEventConsumer
├── data/remote/Retrofit              ├── entity/LoginLog, LoginStats, ReadingStats
├── di/HiltModule                     ├── repository/*
└── domain/                           └── config/RabbitMQConfig

                                      com.bookrealm.ai
                                      ├── controller/AiController
                                      ├── service/AskService, SummaryService, EmbeddingService
                                      ├── config/SpringAiConfig
                                      └── document/ChapterChunk(DTO)
```

**例子**:书库 BC 的 `BookService` 不会 import 阅读 BC 的任何类——它只知道 `Book` 实体和自己的 API 契约。阅读 BC 通过 Retrofit 调 `GET /api/books` 拿到 JSON,自己解析为 `BookCache`,两个 BC 在代码层面完全隔离。

## 对应结课文档

本页对应《移动互联系统分析与设计结课设计说明》"领域模型设计:业务实体、Service、领域事件、Bounded Context 划分与映射图"。
