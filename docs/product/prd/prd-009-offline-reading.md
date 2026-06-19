# PRD-009 离线阅读

status: Partial
owner: Reader App

## Why
网络不稳定时读者仍需要打开已读或已缓存章节。

## Problem
完全依赖在线 API 会让阅读被网络中断。

## Goal
在线读取后缓存章节,网络失败时使用本地内容。

## Journey
在线打开章节 -> 写入缓存 -> 断网 -> 再次打开 -> 本地阅读

## Non-goals
不做整库批量下载和 DRM。

## Acceptance
- 在线章节成功写入 Room。
- 网络失败时优先读取缓存。
- 无缓存时显示明确错误和重试。
