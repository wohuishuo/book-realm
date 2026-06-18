# PRD-016 阅读进度统计

status: Done / Security pending  
owner: Reader + Stats

## Why
平台需要保存用户最近阅读位置并支持基础统计。

## Problem
事件队列不适合由移动端直接连接,客户端身份也不能被信任。

## Goal
通过受鉴权的 HTTP API 上报和查询阅读进度。

## Journey
阅读章节 -> 上报进度 -> 服务端 upsert -> 查询最近阅读记录

## Non-goals
不做复杂时长推断和行为推荐。

## Acceptance
- App 不连接 RabbitMQ。
- 同一用户/书/章重复上报执行更新。
- 用户不能读写他人的进度。

