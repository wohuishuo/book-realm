# 08 事件与阅读统计

同步命令负责当前用户请求，异步事件负责不应阻塞主流程的事实传播。用户登录不能因为统计服务不可用而失败。

## 流程

User Center 登录成功后发布登录事件，Stats Service 消费并更新统计。阅读位置需要立即恢复，因此使用同步 HTTP upsert；行为分析可以异步扩展。

## 验证

统计服务使用 H2 集成测试验证 upsert 和查询；事件测试验证重复投递的幂等性；平台 Cucumber 验证真实进度保存与查询。

相关规格：[PRD-015](/product/prd/prd-015-login-statistics)、[PRD-016](/product/prd/prd-016-reading-statistics)、[ADR-008](/architecture/adr/adr-008-backend-events-only)。
