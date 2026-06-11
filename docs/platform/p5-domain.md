# P5 领域模型与 BC 映射

> **结论先行**:实体/Service/领域事件清单,UML 类图与包图,Bounded Context 划分与映射图。标注【待架构终审】的条目为初稿,最终边界由架构会话裁量。

## 一句话结论

**书域划分为五个 Bounded Context——用户 BC(认证与登录事件)、书库 BC(书籍/章节内容 API)、阅读 BC(App 侧书架与进度)、统计 BC(事件消费与聚合)、AI BC(RAG 问答与摘要)——各 BC 拥有独立实体,之间只通过 API 或领域事件通信,实体不跨 BC 重叠。**

## 一、五个 BC 分述

### BC-1:用户 BC(MVP-0,复用 user-center)

**实体**:User(id, username, password, role, created_at)
> 用户 BC 位于独立仓库 user-center-team-project,此处仅列出接口契约。完整实体定义见该仓库 `src/main/java/.../entity/User.java`。

**Service 职责**:AuthService(注册/登录/Token 校验/发布 UserLogin 事件)

**对外接口**:
- `POST /api/auth/register` → 注册
- `POST /api/auth/login` → 返回 JWT
- `GET /api/auth/validate` → Token 校验(网关/拦截器用)

**发布事件**:`UserLogin` → RabbitMQ fanout → 统计 BC

### BC-2:书库 BC(MVP-1)

**实体**:

```
Book
├─ bookId: Long (PK)
├─ title: String
├─ authorId: Long
├─ authorName: String
├─ coverUrl: String
├─ intro: String
├─ tags: List<Tag>   【待架构终审】:Tag 是独立实体还是 Book 的属性?
├─ status: BookStatus (完结/连载)
└─ createdAt: DateTime

Chapter
├─ chapterId: Long (PK)
├─ bookId: Long (FK → Book)
├─ title: String
├─ chapterOrder: Int
└─ wordCount: Int

Paragraph
├─ id: Long (PK)
├─ chapterId: Long (FK → Chapter)
├─ paragraphOrder: Int
├─ text: String
└─ isBookmarked: Boolean (MVP 阶段不做书签,保留字段)

Tag
├─ id: Long (PK)
├─ name: String
└─ count: Int
```

**设计来源**:旧 Android 项目 Room 实体(BookEntity / ChapterEntity / ParagraphEntity / TagEntity)简化而来——去掉网文专属字段(votes、rewardPoints、rank、volume、latestChapterLink 等),只保留公版书所需核心字段。

**Service 职责**:
- BookService:书籍 CRUD、搜索、按标签过滤
- ChapterService:按书查章节目录、获取单章内容(含段落)
- FileService:封面文件上传与存取【待架构终审】:文件存储方案(本地/OSS/MinIO)

**对外接口**:
- `GET /api/books` → 书籍列表(支持 ?q=书名&tag=标签)
- `GET /api/books/{id}` → 书籍详情
- `POST /api/books` → 管理员上传书籍
- `PUT /api/books/{id}` → 编辑书籍
- `DELETE /api/books/{id}` → 下架书籍
- `GET /api/books/{id}/chapters` → 章节目录
- `GET /api/chapters/{id}` → 章节内容(含段落)

### BC-3:阅读 BC(MVP-2 App 侧)

**实体**(Room 本地数据库):

```
BookCache            (书库数据的本地镜像)
├─ bookId: Long
├─ title: String
├─ authorName: String
├─ coverUrl: String
├─ intro: String
└─ lastReadTime: Long

ChapterCache         (章节元数据的本地镜像)
├─ chapterId: Long
├─ bookId: Long
├─ title: String
└─ chapterOrder: Int

ReadingProgress      (阅读进度,与书库服务的书架表分离)
├─ id: Long (PK)
├─ bookId: Long
├─ chapterId: Long
├─ paragraphIndex: Int    (读到该章第几段)
└─ updatedAt: Long
```

**边界说明**:阅读 BC 的实体只存本地 Room 缓存,不发布为服务端 API;服务端进度同步通过 ReadingProgress 事件驱动。

**Service 职责**(App 侧 Repository):
- BookRepository:书架管理(收藏/最近阅读)、从书库 API 同步数据到 Room
- ReadingRepository:进度读写、离线缓存、上报 ReadingProgress 事件

### BC-4:统计 BC(MVP-3)

**实体**:

```
LoginLog
├─ id: Long (PK)
├─ userId: Long
├─ loginType: String (App/Web)
├─ loginTime: DateTime
└─ ipAddress: String

LoginStats
├─ date: Date (PK)
├─ totalLogins: Int
├─ appLogins: Int
└─ webLogins: Int

ReadingStats
├─ date: Date (PK)
├─ totalChaptersRead: Int
└─ uniqueReaders: Int
```

**Service 职责**:
- LoginEventConsumer:消费 UserLogin 事件 → 写 LoginLog + 更新 LoginStats
- ReadingEventConsumer:消费 ReadingProgress 事件 → 更新 ReadingStats
- StatsQueryService:提供统计查询 API

**对外接口**:
- `GET /api/stats/logins?from=&to=` → 登录统计
- `GET /api/stats/reading?from=&to=` → 阅读统计

### BC-5:AI BC(MVP-4)

**实体**:

```
ChapterVector            (向量化后的章节片段)
├─ id: Long (PK)
├─ chapterId: Long
├─ bookId: Long
├─ chunkText: String      (分段文本)
├─ chunkOrder: Int
└─ embedding: Vector      (向量,存储于向量库)

【待架构终审】:向量库选型(Chroma/Milvus/PGVector)影响实体定义
```

**Service 职责**:
- EmbeddingService:章节文本分段 → 向量化 → 入库
- AskService:接收提问 → 向量检索 → 组装 prompt → 调用 LLM → 返回回答
- SummaryService:接收章节文本 → 调用 LLM 返回摘要

**对外接口**:
- `POST /api/ai/ask` → 读书问答(参数:选中文本/章节 ID/问题)
- `POST /api/ai/summary` → 章节摘要(参数:章节文本)
- `POST /api/ai/embed` → 管理员触发的向量化(参数:bookId)【待架构终审】:向量化时机——上传时自动触发还是管理员手动触发?

## 二、领域事件表

| 事件 | 载荷字段 | 生产者 | 消费者 |
| --- | --- | --- | --- |
| **UserLogin** | userId: Long, loginType: String(App/Web), loginTime: DateTime, ipAddress: String | 用户 BC(AuthService,登录成功后发布) | 统计 BC(日志服务落盘 + 统计服务聚合) |
| **ReadingProgress** | userId: Long, bookId: Long, chapterId: Long, paragraphIndex: Int, timestamp: DateTime | 阅读 BC(App 退出阅读器时上报) | 统计 BC(统计服务聚合"读了多少章") |

## 三、BC 映射图

BC 之间只通过 API 或事件交换信息(箭头上标明传什么):

```
                        发布 UserLogin 事件
     ┌───────────┐      (userId, loginType)     ┌───────────┐
     │ 用户 BC   │ ───────────────────────────> │ 统计 BC   │
     │ MVP-0     │                               │ MVP-3     │
     └─────┬─────┘                               └─────┬─────┘
           │ JWT                                       │
           │                                           │ 发布
           │ POST /api/auth/*                          │ ReadingProgress
           ▼                                           │ 事件
     ┌───────────┐                                     │
     │ 阅读 BC   │ ─────── GET /api/books/* ──────> ┌──┴────────┐
     │ MVP-2 App │ <────── 章节内容 JSON ────────── │ 书库 BC   │
     └─────┬─────┘                                   │ MVP-1     │
           │                                         └───────────┘
           │ POST /api/ai/ask
           │ (选中文本 + 章节ID + 问题)
           ▼
     ┌───────────┐
     │ AI BC     │
     │ MVP-4     │
     └───────────┘
```

**通信约定**:
- 用户 BC ↔ 阅读 BC:HTTP REST(JWT 认证)
- 阅读 BC ↔ 书库 BC:HTTP REST(JWT 认证)
- 阅读 BC → AI BC:HTTP REST(JWT 认证)
- 用户 BC → 统计 BC:RabbitMQ(异步事件)
- 阅读 BC → 统计 BC:HTTP REST(上报 ReadingProgress,由书库服务或 App 直接发布事件)【待架构终审】:ReadingProgress 走 HTTP 由书库服务中转发布事件,还是 App 直连 RabbitMQ?

## 四、包图(各 BC 的 Java 包结构)

每个 BC 内部按 Spring Boot 标准分层(Controller → Service → Repository),包名以 MVP 名称命名:

```
com.bookrealm.user              (用户 BC,复用 user-center 仓)
├── controller/    AuthController
├── service/       AuthService(注册/登录/Token校验)
├── entity/        User
├── event/         UserLoginEvent(生产者)
└── config/        SecurityConfig, JwtConfig

com.bookrealm.library           (书库 BC,br-library-service)
├── controller/    BookController, ChapterController
├── service/       BookService, ChapterService, FileService
├── entity/        Book, Chapter, Paragraph, Tag
├── repository/    BookRepo, ChapterRepo, ParagraphRepo, TagRepo
└── config/        JpaConfig

com.bookrealm.reader            (阅读 BC,br-reader-app Android 侧)
├── ui/            阅读器/书架/书城/Navigation
├── viewmodel/     ReaderViewModel, BookshelfViewModel
├── data/
│   ├── local/     Room(BookCache, ChapterCache, ReadingProgress)
│   ├── remote/    Retrofit(BookApi, AuthApi, AiApi)
│   └── repository/ BookRepository, ReadingRepository
├── di/            Hilt Module
└── domain/        领域模型(仅用于 App 内)

com.bookrealm.stats             (统计 BC,br-event-stats)
├── controller/    StatsController
├── service/       StatsQueryService
├── consumer/      LoginEventConsumer, ReadingEventConsumer
├── entity/        LoginLog, LoginStats, ReadingStats
├── repository/    LoginLogRepo, LoginStatsRepo, ReadingStatsRepo
└── config/        RabbitMQConfig

com.bookrealm.ai                (AI BC,br-ai-service)
├── controller/    AiController
├── service/       AskService, SummaryService, EmbeddingService
├── config/        SpringAiConfig, VectorStoreConfig
└── document/      ChapterChunk(DTO)
```

**包图说明**:每个 BC = 一个独立的 Maven/Gradle 模块(或独立仓库),包之间不直接 import,只通过 HTTP API 或 RabbitMQ 事件通信。阅读 BC 位于 Android 项目,包结构使用 Android + Hilt 惯例而非 Spring Boot 分层。

## 五、各 BC 内类图(ASCII)

### 书库 BC

```
┌──────────────┐       ┌──────────────────┐       ┌──────────────────┐
│    Book      │ 1───* │    Chapter       │ 1───* │   Paragraph      │
├──────────────┤       ├──────────────────┤       ├──────────────────┤
│ bookId       │       │ chapterId        │       │ id               │
│ title        │       │ bookId (FK)      │       │ chapterId (FK)   │
│ authorName   │       │ title            │       │ paragraphOrder   │
│ coverUrl     │       │ chapterOrder     │       │ text             │
│ intro        │       │ wordCount        │       │ isBookmarked     │
│ status       │       └──────────────────┘       └──────────────────┘
│ createdAt    │
└──────┬───────┘
       │ *───*
┌──────┴───────┐
│    Tag       │
├──────────────┤
│ id           │
│ name         │
│ count        │
└──────────────┘
```

### 统计 BC

```
┌──────────────────┐       ┌──────────────────┐
│   LoginLog       │       │  LoginStats      │
├──────────────────┤       ├──────────────────┤
│ id               │       │ date (PK)        │
│ userId           │       │ totalLogins      │
│ loginType        │       │ appLogins        │
│ loginTime        │       │ webLogins        │
│ ipAddress        │       └──────────────────┘
└──────────────────┘

┌──────────────────┐
│  ReadingStats    │
├──────────────────┤
│ date (PK)        │
│ totalChaptersRead│
│ uniqueReaders    │
└──────────────────┘
```

## 对应结课文档

本页内容对应《移动互联系统分析与设计结课设计说明》的"领域模型设计:业务实体、Service、领域事件、Bounded Context 划分与映射图"。
