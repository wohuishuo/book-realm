# PRD-010 段落选择与划线

status: Partial
owner: Reader + Library

## Why
读者需要标记重要原文并在以后重新识别。

## Problem
只支持整段点击无法表达连续范围,标记也需要可删除。

## Goal
支持段落范围选择、划线保存、显示和删除。

## Journey
长按段落 -> 扩展范围 -> 划线 -> 重新打开 -> 点击并删除

## Non-goals
不做自由字符级 PDF 标注。

## Acceptance
- 选择范围有明确视觉状态。
- 划线持久化并在重开章节后显示。
- 用户可以删除自己的划线。
