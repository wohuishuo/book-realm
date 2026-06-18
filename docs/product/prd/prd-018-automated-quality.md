# PRD-018 自动化质量门

status: Partial  
owner: Platform Engineering

## Why
多仓项目需要在每次变更后证明功能没有被破坏。

## Problem
只靠人工记忆运行测试会漏掉跨服务和真机回归。

## Goal
建立本地检查、仓库 CI、平台冒烟和 Android 主旅程四层 Harness。

## Journey
提交代码 -> 本地检查 -> PR CI -> 平台冒烟 -> 人工验收 -> 合并

## Non-goals
不追求没有业务价值的覆盖率数字。

## Acceptance
- 每个代码仓 test/build 在 PR 自动运行。
- 后端跨服务冒烟一键执行。
- Android 核心阅读旅程可重复执行。

