# 13 Linear、Review 与发布

Linear 管理正在发生的工作，GitHub 保存代码评审与机器证据，PRD/ADR 保存长期产品和架构事实。三者互相链接，但不互相复制全文。

## 一次交付

Idea -> PRD -> ADR（必要时）-> Feature -> Linear Issue -> Branch -> Implement -> Harness -> Review -> Merge。

Issue 标题描述结果，正文链接 PRD 和 Feature，并列出仓库、Acceptance 与验证命令。跨仓功能拆成多个 Issue，通过同一个 PRD 或 Project 汇总，不创建一个同时修改所有仓库的长期分支。

## Review

Codex 或 CC 先检查行为回归、安全、数据一致性和测试；人检查产品方向、真实设备手感和最终合并。Agent 不自行绕过分支保护。

## 完成证据

CI 全绿、评审意见解决、Feature 通过、PRD 状态更新、Linear Issue 关闭。完整流程见 [Delivery Workflow](/delivery/workflow)。
