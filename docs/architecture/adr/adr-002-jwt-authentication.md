# ADR-002 JWT 代替 Session

status: Accepted
owner: Identity

## Context
Android、Web 和多个后端服务需要共享登录身份,服务不能依赖同一浏览器 Session。

## Decision
用户中心登录后签发 JWT;客户端使用 `Authorization: Bearer` 携带令牌。

## Consequences
优点:适合移动端和多服务,服务端无需共享 Session。  
代价:必须处理过期、撤销、密钥管理和各服务验签。
