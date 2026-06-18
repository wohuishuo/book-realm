# ADR-008 RabbitMQ 只用于后端事件

status: Accepted
owner: Platform

## Context
移动端直接连接 RabbitMQ 会暴露基础设施凭据并增加网络复杂度。

## Decision
Android 只调用 HTTP API;RabbitMQ 仅用于后端服务间异步事件,阅读进度走 HTTP。

## Consequences
优点:客户端简单且不持有消息队列权限。  
代价:服务端需要提供进度和统计 API。
