# MVP-1 书库服务

> **结论先行**:书库服务是平台的"内容源"——一个 Spring Boot + JPA 微服务,把公版书按「书→章→段」存进 MySQL,对外开 4 个只读接口。这一章读完,你不用打开仓库就能讲清它的数据结构、接口长什么样、以及做的时候踩了哪个坑——代码细节都嵌在下面。

仓库:[br-library-service](https://github.com/wohuishuo/br-library-service)。本章所有代码片段都是该仓的**真实代码**。

## 一、它在平台里干什么

**结论:它只管"书的内容",是被别人调用的一方,自己不依赖任何其他 MVP。**

```
                 GET /api/books?q=西游
   阅读 App  ──────────────────────────▶  ┌─────────────────┐
   AI 服务   ──────────────────────────▶  │  书库服务 :8082  │ ──▶ MySQL
                 GET /api/chapters/{id}     └─────────────────┘   书 / 章 / 段 / 标签
```

**根据**:按 [P5 领域模型](/platform/p5-domain) 的 BC 划分,"内容"是独立的 Bounded Context;登录归用户 BC、阅读进度归统计 BC。边界单一,才能独立开发、被 App 和 AI 服务同时复用。

## 二、数据怎么存:书 → 章 → 段

**结论:四张表,一对多到底。一本书有多章,一章有多段;书可打多个标签。**

```
Book 1───* Chapter 1───* Paragraph         Book *───* Tag
```

看真实的实体定义(`Book.java`),三个细节值得讲:

```java
@Entity
@Table(name = "books")
public class Book {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(columnDefinition = "TEXT")          // ① 简介用 TEXT,不用默认 varchar(255)
    private String intro;

    @Column(nullable = false)
    private Integer isDelete = 0;               // ② 逻辑删除:0 有效 / 1 已删

    @ManyToMany                                 // ③ 书↔标签 多对多,中间表 book_tags
    @JoinTable(name = "book_tags",
        joinColumns = @JoinColumn(name = "book_id"),
        inverseJoinColumns = @JoinColumn(name = "tag_id"))
    private Set<Tag> tags = new HashSet<>();

    @PrePersist void onCreate() { createTime = updateTime = LocalDateTime.now(); }
}
```

- **① 为什么 intro 用 TEXT**:书籍简介常常超过 255 字,JPA 默认 `varchar(255)` 会截断;`columnDefinition = "TEXT"` 解决。章节正文段落同理。
- **② 为什么逻辑删除**:删书不真删,只把 `isDelete` 置 1——数据可恢复、可审计。沿用用户中心的"三原则"(自增主键 / 逻辑删除 / 时间戳)。
- **③ 为什么段落单独成表**:不把整章塞一个大字段,而是「段」独立。这样 [AI 服务](/project/ai) 才能按段落做向量检索、精确引用"第几段"。**数据结构是为下游功能设计的**,这就是领域建模的价值。

## 三、接口长什么样

**结论:4 个只读接口,覆盖"搜书 → 看详情 → 读章节",Controller 很薄,只负责接参数和调 Service。**

真实的 `BookController.java`(节选):

```java
@RestController
public class BookController {
    private final BookService bookService;

    @GetMapping("/books")                       // 列表:模糊 + 标签 + 分页
    public BaseResponse<BookListResponse> listBooks(
        @RequestParam(required = false) String q,
        @RequestParam(required = false) String tag,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size) {
        return ResultUtils.success(bookService.list(q, tag, page, size));
    }

    @GetMapping("/chapters/{id}")               // 章节内容(含段落)
    public BaseResponse<ChapterDetailResponse> getChapter(@PathVariable Long id) {
        return ResultUtils.success(bookService.chapterDetail(id));
    }
    // 还有 /books/{id} 详情、/books/{id}/chapters 目录
}
```

**根据**:Controller 不写业务,只接参数、调 Service、包成统一返回 `{code,data,message}`——和用户中心同一套分层规矩(对应 [后端架构](https://wohuishuo.github.io/user-center-team-project/project/backend))。配 `/api` 前缀后,真实访问是 `GET http://localhost:8082/api/books?q=西游`。

**例子**:`?q=西游` 命中《西游记》并带标签 `["神魔","古典","名著"]`;`/chapters/1` 返回第一回的 13 个段落,都是真实原文。

## 四、做的时候踩的一个真坑(最值得记的)

**结论:JPA 的 `@ManyToMany` 默认懒加载,序列化 JSON 时会炸 `LazyInitializationException`。**

**根据**:查到 Book 后,`tags` 不会立刻加载;等 Controller 把对象转 JSON 时,数据库会话(事务)已经关了,Hibernate 没法再去查标签 → 抛异常。

**怎么解的**:在 `@Transactional(readOnly = true)` 的 Service 方法里,**事务还开着的时候**主动碰一下 `book.getTags().size()` 触发加载;之后再转 JSON 就有数据了。(另一个办法是查询写 `LEFT JOIN FETCH`,但分页 + FETCH JOIN 有 Hibernate 警告,所以选了事务内触发。)

> 这种"懒加载边界"是 JPA 最常见的坑。把它写进书,下次谁做都不用再踩一遍——这正是书的价值:**别人不用盲读代码去理解,直接看这里就懂**。

## 五、开箱即用:种子数据

**结论:启动时若库空,自动导入《西游记》前 3 回 + 《朝花夕拾》前 2 篇,共 61 段真实公版原文。**

**根据**:空接口没法演示也没法测。用真实公版书(不是"测试书 1/2")做种子,后面 App 书架、阅读器、AI 问答全有真东西可跑。克隆仓库 → 起服务 → 立刻 `GET /api/books?q=西游` 有结果,无需手动造数据。

## 六、本章的真实代码(想往下挖再点)

| 内容 | 文件 |
| --- | --- |
| 四个实体(Book/Chapter/Paragraph/Tag) | [entity/](https://github.com/wohuishuo/br-library-service/tree/main/src/main/java/com/bookrealm/library/entity) |
| 查询业务(含懒加载处理) | [service/BookService.java](https://github.com/wohuishuo/br-library-service/blob/main/src/main/java/com/bookrealm/library/service/BookService.java) |
| REST 接口 | [controller/BookController.java](https://github.com/wohuishuo/br-library-service/blob/main/src/main/java/com/bookrealm/library/controller/BookController.java) |
| 种子数据 | [config/DataSeeder.java](https://github.com/wohuishuo/br-library-service/blob/main/src/main/java/com/bookrealm/library/config/DataSeeder.java) · [seed/books.json](https://github.com/wohuishuo/br-library-service/blob/main/src/main/resources/seed/books.json) |
| 测试(6 条) | [src/test/](https://github.com/wohuishuo/br-library-service/tree/main/src/test/java/com/bookrealm/library) |

## 本章小结

- **结论**:书库 = 4 实体 + 4 只读接口 + 真实种子,平台的内容底座;
- **根据**:BC 边界单一、段落独立成表为 AI 服务铺路、踩并解决了 JPA 懒加载坑;
- **例子**:`?q=西游` 命中、`/chapters/1` 返回 13 段原文、克隆即跑。

## 对应资源

- 准备:[P5 领域模型](/platform/p5-domain)(BC-2)· [P7 架构](/platform/p7-architecture)
- 下游:[MVP-2 阅读 App](/project/reader) · [MVP-4 AI 服务](/project/ai)
