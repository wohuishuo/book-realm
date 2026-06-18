# ADR-005 管理端与用户端权限分离

status: Accepted
owner: Identity

## Context
查询和删除用户属于管理操作,普通读者不应获得对应权限。

## Decision
后端使用角色强制校验管理员权限;前端隐藏无权入口只能作为辅助体验。

## Consequences
优点:权限边界由服务端保证。  
代价:每个管理接口必须维护鉴权测试。
