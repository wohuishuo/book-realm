# PRD 索引

> **结论先行**:五份 PRD 按用户结果拆分,共同组成 BookRealm 阅读主旅程;PRD 不按仓库拆,也不记录每日进度。

| PRD | 用户结果 | 状态 | 主要缺口 |
| --- | --- | --- | --- |
| [PRD-001 身份与会话](/product/prd/prd-001-identity-session) | 安全登录并保持会话 | 已实现,待加固 | 服务端统一验 JWT |
| [PRD-002 找书与书架](/product/prd/prd-002-discovery-shelf) | 找到书并管理个人书架 | 已实现 | 主旅程自动验收 |
| [PRD-003 阅读连续性](/product/prd/prd-003-reading-continuity) | 顺畅阅读并恢复位置 | 已实现,持续优化 | 真实点击回归 |
| [PRD-004 阅读标记与互动](/product/prd/prd-004-annotations-social) | 留下并管理阅读痕迹 | 部分产品化 | 个人列表、越权保护 |
| [PRD-005 AI 原文理解](/product/prd/prd-005-grounded-ai) | 获得有原文依据的帮助 | 已实现,待完善 | 引用跳转、历史记录 |

## PRD 使用规则

1. 一个 PRD描述一个稳定用户结果,可以跨多个仓库。
2. 需求变化先更新 PRD验收标准,再创建 Linear Issue。
3. 技术取舍写 ADR,接口形状写 OpenAPI,每日进度写 Linear。
4. PRD 状态只能依据代码、测试或真实演示证据更新。

