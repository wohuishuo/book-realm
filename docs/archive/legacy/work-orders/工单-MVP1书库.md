# 工单 · MVP-1 书库服务(br-library-service)

> 执行前先读本仓 `CLAUDE.md`(含新增的**质量门**)。规格以 `docs/platform/p5-domain.md`(BC-2)与 `p7-architecture.md` 为准,**不许偏离**;拿不准就标注待定并继续,不要自己发明设计。

## 工单 L0:建仓【授权建仓】

在 `起点-安卓项目` 下创建 `br-library-service`,`gh repo create br-library-service --public --source . --push`。内容:Spring Boot 3.3 + Java 21 Maven 工程(参照 user-center 仓 backend 的 pom 结构,依赖改为:web、validation、**data-jpa**、mysql、springdoc、lombok、test;**不要** security/redis/jwt)。`application.yml`:`context-path: /api`,库名 `book_realm_library`(本机 MySQL,root 空密码;先手动 `CREATE DATABASE`)。健康检查 `GET /health` 照抄 user-center 写法。
**DoD**:`mvn package` 通过;启动后 `/api/health` 返回 ok;Swagger 可开;commit 推送。

## 工单 L1:实体与建表

四个 JPA 实体,字段严格按 P5 BC-2:`Book`(id,title,author,coverUrl,intro,createTime,updateTime,isDelete)、`Chapter`(id,bookId,seq,title)、`Paragraph`(id,chapterId,seq,content TEXT)、`Tag`(id,name)+ Book↔Tag 多对多。统一:自增主键、逻辑删除字段照 user-center 三原则。Repository 用 Spring Data JPA 接口。
**DoD**:启动自动建表(ddl-auto: update 仅开发期);表结构与 P5 一致。

## 工单 L2:种子数据

`data-seeder`:启动时若库空,从 `resources/seed/` 的 JSON 导入 **2 本公版书**(《西游记》前 3 回、《朝花夕拾》前 2 篇;正文可用公开公版文本,每章 ≥10 段),打标签(名著/散文)。
**DoD**:重启不重复导入;`SELECT count(*) FROM paragraph` ≥ 50。

## 工单 L3:REST API

按 P5 契约实现:`GET /api/books?q=&tag=&page=&size=`(分页模糊)、`GET /api/books/{id}`、`GET /api/books/{id}/chapters`、`GET /api/chapters/{id}`(含段落列表)。统一返回 `{code,data,message}`(BaseResponse 照抄 user-center)+ 全局异常处理照抄。
**DoD**:Swagger 逐个实测截图记录;`?q=西游` 能命中。

## 工单 L4:测试

JUnit:Repository 层 2 条(按标签查、分页)+ MockMvc 集成 3 条(列表/详情/404)。
**DoD**:`mvn test` 全绿。

## 工单 L5:小书(轻量)

仓内 `docs/` 不建 VitePress——**只写 3 个 Markdown**:`README.md`(怎么跑+接口表)、`docs/design.md`(本服务的数据与 API 设计,金字塔写法,≤120 行)、`docs/notes.md`(实现中真实踩的坑)。平台书的 MVP 地图登记链接由架构会话做。
**DoD**:过 CLAUDE.md 质量门三问;commit 推送。

## 完成后

更新 book-realm 仓 `TODO-总进度.md`(MVP-1 行勾选)并推送;**停下等架构终审**。Dockerfile 与 compose 接入、JWT 鉴权接入为后续工单,本期不做。
