# 平台篇 · 先想清楚再写代码

> **结论先行**:平台篇回答一个问题——BookRealm 为什么这样设计。我们先把业务定位、用例、领域模型、架构和计划想清楚,再进入实战篇写代码。

完整蓝图见 [行动计划全文](/platform/plan)。

::: tip 产品版本和工程阶段已分开
当前 App 产品版本是 `0.3.0-alpha.20260616`;平台书中的 `v2.1/v2.2` 是内部工程阶段。具体规则见 [版本规则](/platform/versioning)。
:::

::: tip 进入 MVP-3 前先读 v1 范围
P1-P8 解决"平台怎么设计", [v1 需求与验收清单](/platform/v1-scope) 解决"第一版到底做到哪里停"。后续加功能前,先判断它属于 v1 必须项,还是 v1.1/v2。
:::

## P1–P8 一览

| 步 | 产出 | 对应结课要求 | 状态 |
| --- | --- | --- | --- |
| [P1](/platform/p1-positioning) | 业务领域、开发目标、用户画像 | 可行性与需求分析 | ✅ |
| [P2](/platform/p2-competitors) | 起点读书/微信读书/番茄 竞品对比 | 竞品分析 | ✅ |
| [P3](/platform/p3-features) | 功能分解层次树(每 MVP 一棵子树) | 功能分解层次图 | ✅ |
| [P4](/platform/p4-usecases) | UML 用例图 + 用户类型与权限 + 核心用例规约 | 用例分析 | ✅ |
| [P5](/platform/p5-domain) | 实体/Service/领域事件、类图、包图、**BC 划分与映射图** | 领域模型设计 | ✅ |
| [P6](/platform/p6-dynamics) | 顺序图/活动图(登录事件流、打开一本书、AI 问答) | 系统动态特性 | ✅ |
| [P7](/platform/p7-architecture) | 架构总图、技术选型表、部署图 | 系统设计文档 | ✅ |
| [P8](/platform/p8-schedule) | 分工表、五周时间轴、风险与砍单顺序 | 流程管理 | ✅ |
| [版本规则](/platform/versioning) | 产品版本与工程阶段分离 | 版本管理 | ✅ |
| [项目记忆库](/platform/project-memory) | 记录反复踩坑、交互裁决和接手前检查 | 工程记忆 | ✅ |
| [v1](/platform/v1-scope) | 第一版需求边界、验收清单、执行顺序 | 版本范围管理 | ✅ |

::: tip P 阶段已完成并通过架构终审(2026-06-12)
八步全部写实并经两轮 RC 自修 + 架构终审。三条终审裁决已并入 P5:①接口以 user-center 真实代码为准;②App 不直连 MQ,进度走 HTTP 上报;③SimpleVectorStore 批准为 MVP 向量库。
:::

## ⑥ 工程治理(P 阶段之后的现状核对)

> **结论先行**:P1–P8 是"设计意图",代码落地后会有偏差和新决策。本组文档是 2026-06-16 起的**实现核对与治理记录**,与 P 阶段并列但分区。

| 文档 | 作用 |
| --- | --- |
| [架构现状评估与 v2 演进](/platform/architecture-review) | 代码核对 P7、已知漂移、下一步演进 |
| [ADR-001 统一鉴权](/platform/adr-001-unified-auth) | 后端鉴权缺陷的正式决策(提案) |
| [平台 API 参考](/platform/api-reference) | 三服务真实接口、错误码、鉴权现状 |
| [测试策略与覆盖缺口](/platform/testing-strategy) | 现有覆盖盘点 + 补测优先级 |
| [启动 / 运维 Runbook](/platform/runbook-platform-ops) | 一键启动、真机联调、故障排查 |
