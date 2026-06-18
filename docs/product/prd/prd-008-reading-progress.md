# PRD-008 阅读进度同步

status: Done / Security pending  
owner: Reader + Stats

## Why
读者下次打开一本书时需要回到上次阅读位置。

## Problem
只保存页面临时状态会在退出、重启或换入口后丢失位置。

## Goal
按用户、书、章节和段落位置保存、查询、更新阅读进度。

## Journey
阅读到某段 -> 退出 -> 再次打开 -> 自动恢复到该位置

## Non-goals
不做多端实时同步和复杂阅读时长分析。

## Acceptance
- 重复上报更新同一条进度。
- 再次打开恢复章节与位置。
- 上报失败不阻断阅读。

