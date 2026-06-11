# MVP-1 书库服务

> **结论先行**:书库服务是平台的"内容源"——一个 Spring Boot + JPA 的微服务,把公版书按"书→章→段"结构化存进 MySQL,对外提供 4 个只读 REST 接口。它不管登录、不管前端,只干一件事:**把书的内容可靠地存好、查得出来**。

仓库:[br-library-service](https://github.com/wohuishuo/br-library-service)(独立公开仓)。

## 一、它在平台里的位置

**结论:书库是被依赖方,只对外暴露内容接口,不依赖任何其他 MVP。**

**根据**:按 [P5 领域模型](/platform/p5-domain) 的 BC 划分,书库 BC 的职责边界是"内容",登录归用户 BC、阅读进度归统计 BC。边界清晰才能独立开发、独立部署。

**例子**:阅读 App 启动后调 `GET /api/books` 拿书单——App 不知道书库内部用 JPA 还是 MyBatis,只认这个接口。哪天换实现,App 一行不用改。

## 二、数据模型:书→章→段

**结论:四张表,一对多到底——一本书有多个章,一章有多个段,书可打多个标签。**

```
Book 1───* Chapter 1───* Paragraph        Book *───* Tag
```

**根据**:实体设计直接来自上一个 Android 项目的 Room 实体,**砍掉了网文专属字段**(投票数、排名、签约状态),只留公版书需要的核心字段。每张表沿用用户中心的"三原则":自增主键、逻辑删除、时间戳。

**例子**:《西游记》= 1 条 Book + 3 条 Chapter + 多条 Paragraph + 标签「名著/古典/神魔」。段落单独成表(而不是把整章塞一个大字段),是为了支撑后续 [AI 服务](/project/ai) 按段落做向量检索。

## 三、4 个只读接口

**结论:接口覆盖"搜书 → 看详情 → 读章节"一条线,统一返回 `{code,data,message}`。**

| 接口 | 用途 |
| --- | --- |
| `GET /api/books?q=&tag=&page=&size=` | 分页 + 书名模糊 + 标签过滤 |
| `GET /api/books/{id}` | 书籍详情(简介 + 标签 + 章节目录) |
| `GET /api/books/{id}/chapters` | 章节目录 |
| `GET /api/chapters/{id}` | 章节内容(全部段落) |

**根据**:返回结构、错误码、全局异常处理全部照抄用户中心的公共件——平台内所有服务返回格式一致,客户端一套解析逻辑通吃。

## 四、种子数据:为什么重要

**结论:启动时若库空,自动导入《西游记》前 3 回 + 《朝花夕拾》前 2 篇,共 61 段真实公版原文。**

**根据**:没有数据的接口没法演示也没法测。用真实公版书(而非"测试书1/测试书2")做种子,后面 App 的书架、阅读器、AI 问答全都有真东西可跑——演示时说服力完全不同。

**例子**:克隆仓库 → 起服务 → 立刻能 `GET /api/books?q=西游` 拿到结果,无需手动造数据。这是"开箱即用"在后端的体现。

## 五、本章的真实代码

| 内容 | 文件 |
| --- | --- |
| 四个 JPA 实体 | [entity/](https://github.com/wohuishuo/br-library-service/tree/main/src/main/java/com/bookrealm/library/entity) |
| 查询业务 | [service/BookService.java](https://github.com/wohuishuo/br-library-service/blob/main/src/main/java/com/bookrealm/library/service/BookService.java) |
| REST 接口 | [controller/BookController.java](https://github.com/wohuishuo/br-library-service/blob/main/src/main/java/com/bookrealm/library/controller/BookController.java) |
| 种子数据导入 | [config/DataSeeder.java](https://github.com/wohuishuo/br-library-service/blob/main/src/main/java/com/bookrealm/library/config/DataSeeder.java) · [seed/books.json](https://github.com/wohuishuo/br-library-service/blob/main/src/main/resources/seed/books.json) |
| 测试(6 条) | [src/test/](https://github.com/wohuishuo/br-library-service/tree/main/src/test/java/com/bookrealm/library) |
| 服务自带文档 | [README](https://github.com/wohuishuo/br-library-service/blob/main/README.md) · [design.md](https://github.com/wohuishuo/br-library-service/blob/main/docs/design.md) |

## 本章小结

- **结论**:书库服务 = 4 实体 + 4 只读接口 + 真实种子数据,平台的内容底座;
- **根据**:BC 边界清晰(只管内容)、实体从旧 Room 精简、公共件照抄用户中心;
- **例子**:`?q=西游` 命中、章节返回 13 段真实原文、克隆即可跑——被 App 和 AI 服务共同依赖。

## 对应资源

- 准备:[P5 领域模型](/platform/p5-domain)(BC-2)· [P7 架构](/platform/p7-architecture)
- 下游:[MVP-2 阅读 App](/project/reader)(消费本服务)· [MVP-4 AI 服务](/project/ai)(对段落做向量化)
