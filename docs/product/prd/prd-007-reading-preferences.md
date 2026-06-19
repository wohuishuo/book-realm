# PRD-007 阅读样式设置

status: Partial
owner: Reader App

## Why
不同读者需要可调整的字号、行距和背景主题。

## Problem
临时设置在退出后丢失会增加重复操作。

## Goal
提供可持久化的阅读样式设置。

## Journey
打开阅读设置 -> 调整字号/行距/主题 -> 继续阅读 -> 重启后保留

## Non-goals
不导入任意字体文件和高级排版模板。

## Acceptance
- 字号、行距和主题均可调整。
- 设置变化立即作用于正文。
- 重启 App 后设置保持。
