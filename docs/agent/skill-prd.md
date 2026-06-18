# Skill: PRD

## 何时使用

新增、改变或废弃用户能力时使用。纯重构只有在改变交付范围或验收方式时才写 PRD。

## 步骤

1. 从用户问题和现有代码确认事实。
2. 搜索 PRD 索引，优先修改已有 PRD，避免同义重复。
3. 写 Why、Problem、Goal、Journey、Non-goals、Acceptance。
4. 标记 `status` 与负责能力域 `owner`，不写虚构姓名。
5. 为核心 Journey 新增或更新带 `@prd-NNN` 的 Feature。
6. 如有长期技术选择，再调用 ADR Skill。

## 输出检查

Goal 不描述技术方案；Acceptance 可由测试或人工观察；已完成与未完成能力分别标记 Done、Active、Proposed，不删除真实状态。
