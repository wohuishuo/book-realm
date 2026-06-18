# ADR-007 按可部署能力拆分仓库

status: Accepted
owner: Platform

## Context
用户中心、书库、Android、统计和 AI 使用不同运行时并可独立构建。

## Decision
保留多仓结构;`book-realm` 只保存跨仓产品、架构、质量和集成规格。

## Consequences
优点:组件可独立发布和复用。  
代价:跨仓变更需要契约、版本和集成测试协调。
