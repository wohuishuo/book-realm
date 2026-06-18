# Delivery Workflow

任何功能都沿同一条链路交付。PRD 说明为什么与什么结果，ADR 只记录有长期影响的技术选择，Feature 把用户旅程变成可执行验收；Linear 管任务，不替代规格。

1. **Idea**：记录用户问题、证据和期望结果，先不指定实现。
2. **PRD**：创建或修改轻量 PRD，写清 Why、Problem、Goal、Journey、Non-goals、Acceptance。
3. **ADR**：只有涉及架构、数据、协议、安全或跨仓边界时才创建；一般 UI 文案和局部实现不写 ADR。
4. **Feature**：为核心 Journey 写 Gherkin 场景，并用 `@prd-NNN` 建立追踪。
5. **Issue**：在 Linear 创建可独立交付的任务，链接 PRD、ADR、Feature，填写仓库和验收命令。
6. **Branch**：从最新 `main` 创建 `feature/LINEAR-ID-short-name`；一个 Issue 一个主分支，不为 MVP 新建仓库。
7. **Implement**：按仓库边界实现代码、迁移、组件和测试，禁止用 TODO 代替验收。
8. **Harness**：本地运行该仓库的 `lint`、`test`、`build`；跨服务功能再运行 `npm run bdd:api`。
9. **Review**：Codex 或 CC 检查行为回归、安全、边界和缺失测试；人检查产品结果与真实设备 UI。
10. **Merge**：CI 全绿、Feature 通过、评审意见解决后合并；Linear 标记 Done，并在 PRD 更新实际状态。

## Ready

- PRD 的 Goal、Non-goals 和 Acceptance 可观察。
- Issue 能在一个 PR 内完成；否则拆成多个 Issue，而不是拆成多个 PRD。
- 影响架构时已有 Proposed/Accepted ADR。
- 核心行为已有 `@prd-NNN` Feature。

## Done

- 代码和迁移完成，无隐藏手工步骤。
- 仓库 `verify` 与必要的跨仓 `bdd:api` 通过。
- CI 保存测试结果或 Cucumber HTML 报告。
- UI 在目标 Android 尺寸检查，无行内样式或随意尺寸。
- PR 链接 Linear Issue、PRD、ADR 和 Feature。

## 规格关系

一个产品可以分阶段发布多个版本；一个版本可包含多个 PRD，一个 PRD可拆多个 Linear Issue。PRD 不按代码仓库拆分，Issue 才按仓库和可交付改动拆分。

```text
Product -> Release -> PRD -> Feature/ADR -> Linear Issues -> Pull Requests -> CI evidence
```
