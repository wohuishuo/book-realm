# 工单 · MVP-3 事件统计(br-event-stats)

> 执行前读本仓 `CLAUDE.md`(含质量门)。规格以 `docs/platform/p5-domain.md`(BC-4 + 领域事件表)、`p6-dynamics.md`(登录事件流图)、`p7-architecture.md` 为准。**这是老师《专业训练课题》的原题落地**:登录事件 → RabbitMQ fanout → 日志服务 + 统计服务。

## 架构裁决(已定,不许改)

- **UserLogin 事件**:用户中心(MVP-0)发布 → RabbitMQ fanout exchange → 两个队列(log / stats)→ 本服务两个消费者;
- **ReadingProgress**:App 走 HTTP `POST /api/stats/progress` 直接到本服务(**不经 MQ**,架构裁决:移动端不直连 MQ);
- 本期**只做统计服务侧** + 一个最小生产者验证;改用户中心发事件是【架构会话】的事,见末尾。

## 工单 S0:建仓 + 骨架【授权建仓】

`起点-安卓项目` 下建 Spring Boot 3.3 + Java 21 工程,包 `com.bookrealm.stats`;依赖:web、validation、data-jpa、mysql、**amqp(spring-boot-starter-amqp)**、springdoc、lombok、test;`context-path:/api`,库 `book_realm_stats`,端口 8083。`gh repo create br-event-stats --public --source . --push`。公共件(BaseResponse/异常)照抄 user-center。
**前置**:RabbitMQ **已安装并验证可跑**(4.3.1,数据目录 `C:\rabbitmq-data`,`ERLANG_HOME` 已设为用户环境变量)。用 book-realm 的 `./start-platform.ps1` 一键起全部后端(含 MQ,管理台 http://localhost:15672,默认 guest/guest)。起不来才写 BLOCKED。
**DoD**:`/api/health` ok;Swagger 开;连得上 RabbitMQ(启动日志无报错);commit 推送。

## 工单 S1:RabbitMQ 配置 + 实体

- `RabbitMQConfig`:声明 fanout exchange `user.events`,绑定两个队列 `login.log`、`login.stats`;
- 三实体(按 P5 BC-4):`LoginLog`(每次登录原始记录)、`LoginStats`(按天+设备类型聚合:date, appLogins, webLogins, desktopLogins, total)、`ReadingStats`(按天聚合阅读)。
**DoD**:启动自动建表 + 声明队列(RabbitMQ 管理台 15672 能看到 exchange 和队列)。

## 工单 S2:两个消费者

- `LoginLogConsumer` 监听 `login.log`:把 UserLogin 落 `LoginLog`;
- `LoginStatsConsumer` 监听 `login.stats`:按 `loginType` 增量更新当天 `LoginStats`;
- 事件 DTO 字段对齐 P5 事件表(userId, loginType, loginTime, ipAddress);消费失败重试 3 次后入死信(配置即可)。
**DoD**:见 S4 用一个测试生产者验证。

## 工单 S3:查询 API + 进度上报

- `GET /api/stats/logins?from=&to=`:返回区间内每天 total/app/web/desktop;
- `GET /api/stats/reading?from=&to=`;
- `POST /api/stats/progress`:接收 App 的 ReadingProgress(HTTP),写 ReadingStats。
统一返回 `{code,data,message}`。
**DoD**:Swagger 实测三个接口。

## 工单 S4:测试(含事件闭环验证)

- 写一个**测试用生产者**(或单元测试里直接 `rabbitTemplate.convertAndSend`)发一条 UserLogin(loginType=App)到 exchange;
- 集成测试断言:消费后 `LoginLog` +1 且 `LoginStats.appLogins` +1;
- `POST /api/stats/progress` 后 `ReadingStats` 有记录。
**DoD**:`mvn test` 全绿(需本地 RabbitMQ + MySQL);**这条是核心**——证明事件真的流通了。

## 工单 S5:小书(3 个 md)

`README.md`(怎么跑+RabbitMQ 依赖说明)、`docs/design.md`(事件驱动设计:exchange/队列/消费者/聚合表,金字塔,≤120 行)、`docs/notes.md`(真实踩的坑,如 MQ 连接、死信)。
**DoD**:过质量门三问;commit 推送。

## 完成后

更新 book-realm 仓 TODO(MVP-3 行)并推送;**停下等架构终审**。

## 【架构会话】专属(码农不要碰)

让用户中心(MVP-0)登录时真正发布 UserLogin 事件——这要改 user-center 仓(加 amqp 依赖 + 登录成功后 `convertAndSend`)。这是跨仓改动,由架构会话评估后单独下工单。本期统计服务用"测试生产者"自证闭环即可,不依赖用户中心改造。
