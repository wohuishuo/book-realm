# MVP 地图:星系总览

> **结论先行**:1 个枢纽仓(本仓,放平台书与设计文档)+ 每个 MVP 一个独立代码仓。**仓库边界 = BC 边界**;教学讲解集中在本书[实战篇](/project/),各 MVP 仓只带 README/design/notes 三个轻文档。本页是全平台的"电话簿"。

## 星系结构

```
book-realm(本仓:平台书 + P 阶段文档 + 平台 docker-compose)
 ├── user-center-team-project   MVP-0 用户中心(认证)      ✅ 已完成
 ├── br-library-service         MVP-1 书库服务(JPA)        ✅ 已完成
 ├── br-reader-app              MVP-2 阅读 App(Compose)    ⬜ 工单就绪,待开工
 ├── br-event-stats             MVP-3 事件统计(RabbitMQ)   ⬜ 工单就绪
 └── br-ai-service              MVP-4 AI 服务(RAG)         ⬜ 工单就绪
```

## 各仓登记表

| MVP | 仓库 | 讲解(实战章) | 接口契约 | RC |
| --- | --- | --- | --- | --- |
| 0 用户中心 | [GitHub](https://github.com/wohuishuo/user-center-team-project) | [本书章](/project/user-center) · [它自己的书](https://wohuishuo.github.io/user-center-team-project/) | `/api/user/register`、`/api/user/login`、`/api/user/current` | ✅ |
| 1 书库服务 | [GitHub](https://github.com/wohuishuo/br-library-service) | [本书章](/project/library) | `GET /api/books`、`/books/{id}`、`/books/{id}/chapters`、`/chapters/{id}` | ✅ |
| 2 阅读 App | 待建(工单就绪) | [占位](/project/reader) | (客户端,消费 0/1/4 的接口) | ⬜ |
| 3 事件统计 | 待建(工单就绪) | [占位](/project/event-stats) | UserLogin 事件;`POST /api/stats/progress`;`GET /api/stats/*` | ⬜ |
| 4 AI 服务 | 待建(工单就绪) | [占位](/project/ai) | `/ai/summary`、`/ai/ask`、`/ai/embed` | ⬜ |

## 咬合关系(谁调谁,按已定架构裁决)

- 阅读 App →(HTTP+JWT)用户中心(登录)、书库(内容)、AI(问答)、**统计的 `POST /api/stats/progress`(进度上报)**;
- 用户中心 →(RabbitMQ)发布 UserLogin 事件;
- 日志/统计服务 ←(RabbitMQ)订阅消费;
- **裁决**:RabbitMQ 仅用于后端服务之间,**App 不直连 MQ**(详见 [P5 通信约定](/platform/p5-domain))。

::: tip 跨书一致性
各 MVP 小书描述接口时,以**代码为准**;本页和小书的契约描述在每次 RC 的"跨书检查"层核对(见 [RC 清单](/guide/rc-checklist) 第三层)。
:::
