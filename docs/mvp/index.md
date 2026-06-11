# MVP 地图:星系总览

> **结论先行**:1 个枢纽仓(本仓)+ 每 MVP 一仓一书。**仓库边界 = BC 边界 = 书的边界**。各仓建立后,本页登记链接——这里是全平台的"电话簿"。

## 星系结构

```
book-realm(本仓:平台书 + P 阶段文档 + 平台 docker-compose)
 ├── user-center-team-project   MVP-0 用户中心(认证)      ✅ 已完成
 ├── br-library-service         MVP-1 书库服务(JPA+文件)   ⬜ 第 2 周建
 ├── br-reader-app              MVP-2 阅读 App(Compose)    ⬜ 第 2 周建
 ├── br-event-stats             MVP-3 事件统计(RabbitMQ)   ⬜ 第 4 周建
 └── br-ai-service              MVP-4 AI 服务(RAG)         ⬜ 第 4 周建
```

## 各仓登记表

| MVP | 仓库 | 书 | 接口契约页 | RC |
| --- | --- | --- | --- | --- |
| 0 用户中心 | [GitHub](https://github.com/wohuishuo/user-center-team-project) | [在线书](https://wohuishuo.github.io/user-center-team-project/) | `/api/user/login` 等,见其 Swagger | ✅ |
| 1 书库服务 | 待建 | 待建 | 待定 | ⬜ |
| 2 阅读 App | 待建 | 待建 | (客户端,消费 0/1/4 的接口) | ⬜ |
| 3 事件统计 | 待建 | 待建 | UserLogin / ReadingProgress 事件 | ⬜ |
| 4 AI 服务 | 待建 | 待建 | `/ai/summary`、`/ai/ask` | ⬜ |

## 咬合关系(谁调谁)

- 阅读 App → 用户中心(登录拿 JWT)、书库(拉内容)、AI(摘要/问答);
- 用户中心 → RabbitMQ(发布 UserLogin 事件);
- 阅读 App → RabbitMQ(发布 ReadingProgress 事件,经书库或直连待 P7 定);
- 日志/统计服务 ← RabbitMQ(订阅消费)。

::: tip 跨书一致性
各 MVP 小书描述接口时,以**代码为准**;本页和小书的契约描述在每次 RC 的"跨书检查"层核对(见 [RC 清单](/guide/rc-checklist) 第三层)。
:::
