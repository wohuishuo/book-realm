# ADR-003 Android 与 Web 共用 REST API

status: Accepted
owner: Platform

## Context
Android App、Web 管理端和 AI 服务需要访问相同业务数据。

## Decision
业务能力通过统一 JSON REST API 暴露,响应使用 `{code,data,message}` 结构。

## Consequences
优点:客户端复用业务契约,接口可通过 Swagger 和契约测试验证。  
代价:接口演进需要兼容多个消费者。
