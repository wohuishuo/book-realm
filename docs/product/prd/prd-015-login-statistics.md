# PRD-015 登录事件统计

status: Partial
owner: Identity + Stats

## Why
平台需要在不阻塞登录的前提下记录登录行为。

## Problem
把统计逻辑放进登录主事务会增加耦合和故障影响。

## Goal
登录成功后异步发布事件,统计服务保存日志并按日聚合。

## Journey
用户登录 -> 发布 UserLogin -> 消费事件 -> 查询当天登录统计

## Non-goals
不做复杂实时 BI 大屏。

## Acceptance
- 发布失败不影响登录结果。
- 消费者保存登录日志并更新聚合。
- 查询接口返回指定日期范围数据。
