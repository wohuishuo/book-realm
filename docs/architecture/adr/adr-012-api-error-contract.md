# ADR-012 统一 API 错误契约

status: Proposed  
owner: Platform

## Context
Android 与 Web 同时调用多个服务；不同错误结构会产生重复解析和模糊提示。

## Decision
所有服务返回统一 envelope：`code`、`message`、`data`、`traceId`。业务错误使用稳定错误码，HTTP 状态保留协议含义，客户端不得依赖 message 判断类型。

## Consequences
客户端可统一处理失败并按 traceId 排查；服务需要迁移旧响应并维护错误码台账。
