# ADR-013 REST API 版本兼容

status: Proposed  
owner: Platform

## Context
Android 发布后不能与后端同时升级，破坏性接口修改会导致旧客户端不可用。

## Decision
兼容修改保持现有路径；破坏性修改进入 `/api/v2`，旧版本经过公告期后移除。契约变更必须有 Cucumber 或 Controller 契约测试。

## Consequences
移动端可渐进升级；服务端在迁移期需同时维护两个契约。
