# 02 建立产品规格

规格的目的不是写得像大厂，而是让团队对“为什么做、做到什么程度、怎样算成功”拥有同一个答案。

## 四层规格

1. PRD 定义用户结果和范围。
2. ADR 记录长期技术选择。
3. Feature 用人类可读场景描述行为。
4. Linear Issue 把行为拆成可交付任务。

从 [PRD-008 阅读进度](/product/prd/prd-008-reading-progress) 开始，沿着 [ADR-004](/architecture/adr/adr-004-reading-progress-table) 和对应 Feature 阅读这条链路。

## 练习

选择一个 Proposed PRD。不要先写代码，先补一个失败场景、一个 Non-goal 和可观察 Acceptance，再拆出按仓库归属的 Issue。

## 完成证据

Feature 带 `@prd-NNN` 标签；Issue 能在一个 PR 内完成；PRD 不包含具体类名或数据库实现。
