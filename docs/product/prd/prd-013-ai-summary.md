# PRD-013 AI 章节摘要

status: Partial
owner: AI + Reader

## Why
读者需要快速回顾章节内容。

## Problem
摘要如果插入正文会打断阅读,服务不可用也不能让阅读器崩溃。

## Goal
在临时 AI 窗口提供章节摘要和清晰降级状态。

## Journey
打开章节 -> 点击摘要 -> 获取结果 -> 关闭窗口 -> 继续阅读

## Non-goals
不自动改写原文和生成续写。

## Acceptance
- 摘要不修改正文内容。
- 无模型 Key 时返回明确状态。
- AI 失败不影响章节阅读。
