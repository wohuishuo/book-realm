# 架构现状评估与 v2 演进

> **结论先行**:书域生态**结构健康**——分层一致、依赖新、无腐烂代码;唯一架构级缺陷是后端无鉴权(ADR-001)。本页是 2026-06-16 的现状快照,补充 [P7 架构](/platform/p7-architecture)(P7 是设计意图,本页是实现核对)。

## 一、现状总图(以代码为准)

**结论**:App 直连 4 个后端;服务间只靠登录事件解耦;进度走 HTTP 不走 MQ。

```
        Android App(Compose+Hilt+Room+Retrofit)
          │ 登录        │ 找书/读书      │ 进度上报      │ AI
          ▼            ▼               ▼              ▼
     用户中心      书库 :8082       统计 :8083      AI :8084
       │  └─ 登录成功发 UserLogin ─┐    ▲              │ 回拉原文
       ▼                          ▼    │ HTTP         ▼
   RabbitMQ  exchange: user.events │  POST /stats/   书库 :8082
     ├─ login.log  ──► 统计消费    │   progress
     └─ login.stats ─► 统计消费 ───┘
```

**与 P7 的已知漂移(需回填 P7)**:

- P7 写 exchange `bookrealm.events` + 三队列含 `reading.stats`;**真实代码**是 `user.events` + 仅 `login.log/login.stats`,进度走 HTTP(符合裁决②"App 不直连 MQ")。
- P7 写"App 用 JWT 访问所有后端";**真实代码**后端不验签(见下)。

## 二、优点(先肯定)

**结论**:工程一致性是这套生态最大的资产。

- 三服务目录分层完全统一(controller/service/repository/dto/entity/common/exception),上手成本极低。
- 依赖零债:Spring Boot 3.3.5 + Java 21 三仓一致,无过期库。
- 服务边界清晰、无循环依赖;事件解耦方向正确。
- AI 服务"无 key 可启动、优雅降级"设计得当。

## 三、问题与演进

### 3.1 🔴 鉴权缺失(架构级,必修)

**结论**:后端不验 JWT、`userId` 客户端明文传,可越权。详见 [ADR-001](/platform/adr-001-unified-auth)。

### 3.2 🟠 RAG 是内存关键词索引(MVP 占位)

**结论**:`RagService` 用 `ConcurrentHashMap` + 字符打分,名为 embed 实为关键词,重启丢、不可多实例。

**演进路径(接口不变)**:抽 `BookIndex` 接口 → 演进 1 落库(MySQL 全文索引,解决持久化与多实例)→ 演进 2 接真向量(pgvector/Redis,`application.yml` 已留 embedding 开关)。

### 3.3 🟡 无 API 网关(可选)

**结论**:App 直连 4 端口,CORS/鉴权将来三处重复。规模小可不做;若做鉴权 starter,网关价值降为"单端口+限流"。详见架构评估问答。

### 3.4 🟡 写接口无幂等

**结论**:进度上报、点赞弱网重试会重复累加。MVP 可接受,书里点明生产做法即可。

## 四、落地顺序

**结论**:先清卫生项,再打鉴权战役,其余随实战章推进。

| 阶段 | 内容 | 优先级 |
| --- | --- | --- |
| 0 | 轮换演示 key、回填 P7 漂移与裁决①措辞 | 即刻(<1h) |
| 1 | ADR-001 鉴权 starter + 越权负向测试 | 高(下个工单) |
| 2 | RAG 演进 1(落库)、写接口幂等 | 随实战章 |
| 3 | API 网关、平台级 compose + 监控 | 可选/最后 |

## 五、会随成长重新审视的点

- 用户规模上千:鉴权要不要引网关集中 + 限流?
- 书量变大:内存索引必须换真向量库,冷启动要异步预热。
- 多实例部署:任何"单机内存态"(RAG 索引)都要外置。
