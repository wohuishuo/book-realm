# 03 账号与身份系统

身份系统要保证用户能进入平台，也要为每个业务服务提供可信的用户边界。相关规格是 [PRD-002](/product/prd/prd-002-account-session)、[ADR-002](/architecture/adr/adr-002-jwt-authentication) 和 [ADR-011](/architecture/adr/adr-011-unified-jwt-validation)。

## 实现路径

注册先验证请求结构，再在 Service 校验账号唯一性和密码规则。登录成功签发会话凭证；Android 安全保存凭证，并通过 `/user/current` 恢复用户。管理员接口在服务端验证角色，不能只隐藏前端按钮。

## 测试层级

- Service 单测覆盖注册和密码规则。
- Controller 集成测试覆盖注册、登录、当前用户和越权。
- Cucumber 从真实 HTTP 登录并把 userId 传给后续阅读旅程。

## 当前缺口

认证集成测试仍依赖本机 MySQL。应使用 H2 或 Testcontainers 创建可重复测试环境，再把 `mvn verify` 设为合并必需检查。
