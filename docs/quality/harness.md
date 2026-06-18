# Harness 落地方案

> **结论先行**:BookRealm 的 Harness 分三层落地:提交前跑快速检查,PR 跑仓库完整检查,合并候选版本跑跨仓主旅程。

## 检查矩阵

| 仓库 | 快速检查 | PR 必过 | 集成证据 |
| --- | --- | --- | --- |
| 用户中心 | 前端类型构建、后端单测 | `npm ci && npm run build`;`mvn test` | 登录与当前用户冒烟 |
| 书库 | Java 单测 | `mvn test && mvn package` | 搜书、章节、标记和互动冒烟 |
| Android | Kotlin 单测 | `testDebugUnitTest`,`lintDebug`,`assembleDebug` | adb 真实点击主旅程 |
| 统计 | Java 单测 | `mvn test && mvn package` | 登录事件和进度 upsert |
| AI | Java 单测 | `mvn test && mvn package` | 摘要、检索、问答和降级 |
| 总控书 | VitePress 构建 | `npm ci && npm run docs:build` | `test-platform.ps1` |

## 三道门

### Gate 1:提交前

只运行 1–2 分钟内完成的格式、类型和聚焦测试。Git hook 不跑全平台集成测试,避免开发者绕过它。

### Gate 2:Pull Request

每个代码仓建立独立 GitHub Actions。所有 test、lint 和 build 状态必须通过;main 开启分支保护,禁止直接推送。

### Gate 3:Release Candidate

在总控仓启动全部依赖,运行后端跨服务冒烟和 Android 主旅程。机器检查通过后,人再检查阅读手感、错误文案和视觉一致性。

## 落地顺序

1. H1:给书库、统计、AI、Android 增加基础 CI。
2. H2:让用户中心后端测试在 CI 使用 Testcontainers 或测试数据库,不再 `skipTests`。
3. H3:补 Spotless/Checkstyle 或 Detekt,再接轻量 Git hooks。
4. H4:补 OpenAPI 契约、鉴权负向测试和 Android 完整 adb 旅程。
5. H5:main 分支保护要求对应检查全部通过。

## 失败规则

测试失败不能由 Agent 擅自跳过或删除。偶发环境失败要保存原始日志并重跑一次;重复失败则创建 Issue,标明仓库、命令、提交和复现步骤。

