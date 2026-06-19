# PRD-002 账号与会话

status: Partial
owner: Identity

## Why
读者需要登录并在 App 重启后继续使用个人数据。

## Problem
没有统一身份时,书架、进度和笔记无法可靠归属用户。

## Goal
支持注册、登录、退出、当前用户和会话持久化。

## Journey
注册账号 -> 登录 -> 保存 JWT -> 重启 App -> 恢复会话

## Non-goals
不做 OAuth、多因素认证和找回密码。

## Acceptance
- 密码使用 BCrypt 保存。
- 错误凭据不暴露账号是否存在。
- 受保护接口最终统一验证 JWT。
