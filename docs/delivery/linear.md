# Linear 工作模型

> **结论先行**:Linear 只管理未来工作和当前状态;历史代码事实留在 GitHub,需求和决策留在 PRD/ADR,避免复制出第三套真相。

## 建议结构

| Linear 对象 | BookRealm 用法 |
| --- | --- |
| Initiative | BookRealm 产品化与求职作品集 |
| Project | 有明确完成定义的阶段,如“统一鉴权”“0.4 我的记录” |
| Cycle | 1–2 周执行窗口 |
| Issue | 一个 PR 内能验收的任务 |

## 状态流

```text
Backlog → Ready → In Progress → In Review → Done
                         ↘ Blocked
```

只有满足 Definition of Ready 才进入 Ready;PR 打开后进入 In Review;CI 和人工验收都通过后才进入 Done。

## 标签

- 能力:`identity`,`library`,`reader`,`stats`,`ai`,`platform`
- 类型:`feature`,`bug`,`security`,`quality`,`docs`,`spike`
- 执行:`agent:codex`,`agent:claude`,`human-only`
- 风险:`p0`,`p1`,`p2`

## Issue 模板

```md
## Outcome
用户或工程最终得到什么结果?

## Context
PRD、ADR、接口和相关代码链接。

## Scope
本次做什么,明确不做什么。

## Acceptance
- [ ] 可观察结果一
- [ ] 自动测试/CI
- [ ] 人工验收步骤

## Evidence
PR、测试日志、截图或演示链接。
```

## Agent 规则

Codex 和 CC 用标签表示执行来源,不冒充责任人。每个 Issue 仍由人拥有;Agent 可以更新评论、PR 和证据,但优先级、验收与 Done 状态由人确认。

