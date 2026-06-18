# 11 Cucumber 可执行规格

Gherkin 把 PRD 的用户旅程变成团队和机器都能读取的行为契约。Feature 不是换一种格式写测试步骤，而是描述外部可观察结果。

```gherkin
@prd-008 @api
Scenario: 用户保存阅读位置
  Given 平台服务已经启动
  When 用户登录并打开一本书
  And 用户保存当前阅读位置
  Then 再次查询时应返回该阅读位置
```

## 运行

```powershell
npm run bdd:dry  # 校验所有 @api 步骤都有实现
npm run bdd:api  # 对已启动平台发真实 HTTP 请求
```

UI 场景先标 `@manual`，接入设备驱动后改为 `@android`。不能用空步骤把未自动化场景伪装成通过。

## 完成证据

Cucumber HTML 报告保存在 CI artifact；每个核心 Feature 有 `@prd-NNN`；失败报告能定位到业务场景和步骤。
