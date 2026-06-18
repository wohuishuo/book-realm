# ADR-011 业务服务统一验证 JWT

status: Proposed
owner: Platform

## Context
书库、统计和 AI 的用户数据接口仍可能信任客户端传入的 userId,存在越权风险。

## Decision
三个业务服务使用统一 JWT 验签逻辑,从令牌取得用户 ID;受保护接口不再接受客户端声明身份。

## Consequences
优点:用户数据边界可信,可统一返回 401/403。  
代价:需要共享密钥/公钥策略、公共模块和跨仓迁移。
