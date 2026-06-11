# P5 领域模型与 BC 映射

> **结论先行**:书域划分为五个 Bounded Context——用户 BC(认证)、书库 BC(内容 API)、阅读 BC(App 侧缓存)、统计 BC(事件消费)、AI BC(RAG 问答)。各 BC 拥有独立实体,只通过 API 或领域事件通信,实体不跨 BC 重叠。

## 一、五个 BC 分述

### BC-1:用户 BC(MVP-0,复用 user-center)

**实体**:User(id, username, password, role, createdAt)
> 用户 BC 位于 user-center-team-project 独立仓库,此处仅列接口契约。

**Service**:AuthService(注册/登录/Token 校验/发布 UserLogin 事件)

**对外接口**:
- `POST /api/auth/register` → 注册
- `POST /api/auth/login` → 返回 JWT
- `GET /api/auth/validate` → Token 校验

**发布事件**:`UserLogin` → RabbitMQ fanout → 统计 BC

### BC-2:书库 BC(MVP-1)

**实体**:

```
Book                                 Chapter
├─ bookId: Long (PK)                 ├─ chapterId: Long (PK)
├─ title: String                     ├─ bookId: Long (FK → Book)
├─ authorName: String                ├─ title: String
├─ coverUrl: String                  ├─ chapterOrder: Int
├─ intro: String                     └─ wordCount: Int
├─ status: BookStatus
└─ createdAt: DateTime               Paragraph
                                     ├─ id: Long (PK)
Tag                                  ├─ chapterId: Long (FK → Chapter)
├─ id: Long (PK)                     ├─ paragraphOrder: Int
├─ name: String                      └─ text: String
└─ count: Int
```

> 设计来源:旧 Android 项目 Room 实体简化——去掉了网文专属字段(votes、rank、signStatus 等),只保留公版书核心字段。

**Service**:BookService(CRUD/搜索)、ChapterService(目录+段落)、FileService(封面存取)

**对外接口**:
- `GET /api/books` → 列表(?q=&tag=)
- `GET /api/books/{id}` → 详情
- `POST/PUT/DELETE /api/books/{id}` → 管理员 CRUD
- `GET /api/books/{id}/chapters` → 章节目录
- `GET /api/chapters/{id}` → 章节内容(含段落)

### BC-3:阅读 BC(MVP-2,App 侧 Room 本地)

**实体**(仅在 Android 本地):

```
BookCache             ChapterCache          ReadingProgress
├─ bookId             ├─ chapterId          ├─ id (PK)
├─ title              ├─ bookId             ├─ bookId
├─ authorName         ├─ title              ├─ chapterId
├─ coverUrl           └─ chapterOrder       ├─ paragraphIndex
├─ intro                                    └─ updatedAt
└─ lastReadTime
```

**说明**:这三个实体只存在 Room 本地,不暴露为服务端 API。进度同步通过 ReadingProgress 事件异步上报。

### BC-4:统计 BC(MVP-3)

**实体**:

```
LoginLog                 LoginStats              ReadingStats
├─ id (PK)               ├─ date (PK)            ├─ date (PK)
├─ userId                ├─ totalLogins          ├─ totalChaptersRead
├─ loginType(App/Web)    ├─ appLogins            └─ uniqueReaders
├─ loginTime             └─ webLogins
└─ ipAddress
```

**Service**:LoginEventConsumer、ReadingEventConsumer、StatsQueryService

**对外接口**:
- `GET /api/stats/logins?from=&to=`
- `GET /api/stats/reading?from=&to=`

### BC-5:AI BC(MVP-4)

**实体**:

```
ChapterVector
├─ id: Long (PK)
├─ chapterId: Long
├─ bookId: Long
├─ chunkText: String
├─ chunkOrder: Int
└─ embedding: Vector(存于向量库)
```

**Service**:EmbeddingService(分段→向量化→入库)、AskService(RAG 问答)、SummaryService(章节摘要)

**对外接口**:
- `POST /api/ai/ask` → 读书问答({selectedText, chapterId, question})
- `POST /api/ai/summary` → 章节摘要({chapterText})
- `POST /api/ai/embed` → 管理员触发向量化({bookId})

## 二、领域事件表

| 事件 | 载荷 | 生产者 | 消费者 |
| --- | --- | --- | --- |
| **UserLogin** | userId, loginType(App/Web), loginTime, ipAddress | 用户 BC(AuthService) | 统计 BC(日志服务+统计服务) |
| **ReadingProgress** | userId, bookId, chapterId, paragraphIndex, timestamp | 阅读 BC(App 退出阅读器时) | 统计 BC(统计服务聚合) |

## 三、BC 映射图

```
                        发布 UserLogin 事件
     ┌───────────┐      (userId, loginType)     ┌───────────┐
     │ 用户 BC   │ ───────────────────────────> │ 统计 BC   │
     │ MVP-0     │                               │ MVP-3     │
     └─────┬─────┘                               └─────┬─────┘
           │ JWT                                       │ ReadingProgress
           │                                           │ 事件
           ▼                                           │
     ┌───────────┐                                     │
     │ 阅读 BC   │ ─────── GET /api/books/* ──────> ┌──┴────────┐
     │ MVP-2 App │ <────── 章节 JSON ────────────── │ 书库 BC   │
     └─────┬─────┘                                   │ MVP-1     │
           │                                         └───────────┘
           │ POST /api/ai/ask
           ▼
     ┌───────────┐
     │ AI BC     │
     │ MVP-4     │
     └───────────┘
```

**通信约定**:用户 BC ↔ 阅读 BC(HTTP+JWT) / 阅读 BC ↔ 书库 BC(HTTP+JWT) / 阅读 BC → AI BC(HTTP+JWT) / 用户 BC → 统计 BC(RabbitMQ) / 阅读 BC → 统计 BC(HTTP 上报,由书库服务中转发布事件)

## 四、包图

```
com.bookrealm.user              com.bookrealm.library
├── controller/AuthController   ├── controller/BookController, ChapterController
├── service/AuthService         ├── service/BookService, ChapterService, FileService
├── entity/User                 ├── entity/Book, Chapter, Paragraph, Tag
├── event/UserLoginEvent        ├── repository/BookRepo, ChapterRepo, ParagraphRepo
└── config/SecurityConfig       └── config/JpaConfig

com.bookrealm.reader (Android)  com.bookrealm.stats
├── ui/阅读器/书架/书城          ├── controller/StatsController
├── viewmodel/ReaderViewModel   ├── service/StatsQueryService
├── data/local/Room             ├── consumer/LoginEventConsumer, ReadingEventConsumer
├── data/remote/Retrofit        ├── entity/LoginLog, LoginStats, ReadingStats
├── di/HiltModule               ├── repository/*
└── domain/(App 内领域模型)      └── config/RabbitMQConfig

                                com.bookrealm.ai
                                ├── controller/AiController
                                ├── service/AskService, SummaryService, EmbeddingService
                                ├── config/SpringAiConfig
                                └── document/ChapterChunk(DTO)
```

**说明**:每个 BC = 一个独立 Maven/Gradle 模块或独立仓库,包之间不直接 import,只通过 HTTP API 或 RabbitMQ 事件通信。

## 五、类图

### 书库 BC

```
Book 1───* Chapter 1───* Paragraph
│              │
└──*───* Tag   └── bookId(FK)
```

### 统计 BC

```
LoginLog            LoginStats            ReadingStats
├─ userId           ├─ date(PK)           ├─ date(PK)
├─ loginType        ├─ totalLogins        ├─ totalChaptersRead
├─ loginTime        ├─ appLogins          └─ uniqueReaders
└─ ipAddress        └─ webLogins
```

## 对应结课文档

本页对应《移动互联系统分析与设计结课设计说明》"领域模型设计:业务实体、Service、领域事件、Bounded Context 划分与映射图"。
