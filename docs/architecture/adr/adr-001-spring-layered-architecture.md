# ADR-001 Spring Boot 分层架构

status: Accepted
owner: Backend

## Context
用户、书库、统计和 AI 服务需要清晰区分 HTTP、业务、数据和外部依赖。

## Decision
Spring Boot 服务统一采用 Controller、Service、Repository/Mapper、Model、DTO、Exception 分层。

## Consequences
优点:职责清晰,便于单元测试和替换数据实现。  
代价:简单功能需要维护更多类型和映射。
