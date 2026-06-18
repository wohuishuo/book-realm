# Skill: Test

1. 从 PRD Acceptance 和 Feature 场景选最小测试层级。
2. 领域规则写单元测试，Controller/数据库写集成测试，跨服务 Journey 写 `@api` Cucumber，设备交互写 `@android` 场景。
3. 测试必须验证结果，不只验证函数被调用或 HTTP 200。
4. 修复缺陷时先增加能复现缺陷的测试。
5. 执行仓库 `verify`；跨仓改动启动平台后执行 `npm run bdd:api`。
6. 不删除、跳过或放宽失败测试来获得绿色结果。
