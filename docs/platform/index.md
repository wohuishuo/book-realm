# 平台篇 · PRD 控制台

> **结论先行**:本页是 BookRealm 的 PRD 控制台。先看 [PRD 总览](/platform/prd) 判断产品范围和验收口径,再用 P1-P8、v2 研究和工程治理文档追溯证据。

完整蓝图见 [行动计划全文](/platform/plan)。真正给开发和验收看的正本见 [BookRealm 产品需求文档(PRD)](/platform/prd)。

::: tip 产品版本和工程阶段已分开
当前 App 产品版本是 `0.3.0-alpha.20260616`;平台书中的 `v2.1/v2.2` 是内部工程阶段。具体规则见 [版本规则](/platform/versioning)。
:::

## 先读这三页

| 你要回答的问题 | 先读 |
| --- | --- |
| 产品到底给谁用、解决什么、做到哪里停 | [PRD 总览](/platform/prd) |
| 第一版完成了什么、哪些不做 | [v1 需求与验收清单](/platform/v1-scope) |
| 当前状态怎么接手、哪些坑不能再犯 | [项目记忆库](/platform/project-memory) |

## PRD 快照

| 项目 | 当前口径 |
| --- | --- |
| 产品定位 | 开源跨平台阅读平台 + 在线工程书 |
| 当前版本 | `0.3.0-alpha.20260616` |
| 主用户 | 普通读者、课程老师、团队开发者、学习者 |
| 当前主链路 | 登录 → 找书 → 加入书架 → 阅读 → 划线/段评 → AI 原文问答 → 统计 |
| 下一关键工单 | App 真机自动点击链路、ADR-001 统一鉴权 |
| 1.0 标准 | 普通读者不用说明书也能完成主流程,核心链路有自动化验收 |

## 设计证据:P1–P8 一览

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

## 工程治理(P 阶段之后的现状核对)

> **结论先行**:P1–P8 是"设计意图",代码落地后会有偏差和新决策。本组文档是 2026-06-16 起的**实现核对与治理记录**,与 P 阶段并列但分区。

| 文档 | 作用 |
| --- | --- |
| [架构现状评估与 v2 演进](/platform/architecture-review) | 代码核对 P7、已知漂移、下一步演进 |
| [ADR-001 统一鉴权](/platform/adr-001-unified-auth) | 后端鉴权缺陷的正式决策(提案) |
| [平台 API 参考](/platform/api-reference) | 三服务真实接口、错误码、鉴权现状 |
| [测试策略与覆盖缺口](/platform/testing-strategy) | 现有覆盖盘点 + 补测优先级 |
| [启动 / 运维 Runbook](/platform/runbook-platform-ops) | 一键启动、真机联调、故障排查 |
