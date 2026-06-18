# 仓库与能力地图

> **结论先行**:BookRealm 保持多仓结构,因为六个仓库有独立构建和复用边界;拆仓依据是部署能力,不是 MVP 编号。

| 能力 | 仓库 | 独立交付物 | 主要消费者 |
| --- | --- | --- | --- |
| 产品总控 | `book-realm` | PRD、架构、集成脚本、在线书 | 全团队 |
| 身份 | `user-center-team-project` | 用户中心服务和 Web 管理端 | Android、其他服务 |
| 内容与互动 | `br-library-service` | 书籍、章节、标记、段评 API | Android、AI |
| 阅读客户端 | `br-reader-app` | Android APK | 读者 |
| 事件与进度 | `br-event-stats` | 登录统计和阅读进度 API | Android、管理/演示 |
| 原文理解 | `br-ai-service` | 摘要、检索、问答 API | Android |

## 边界规则

1. 总控仓不复制组件源码,只保存跨仓正本和集成验收。
2. 每个代码仓必须能独立执行 test/build。
3. 跨仓接口以 OpenAPI 或契约测试为事实来源。
4. 共享安全逻辑若形成公共模块,必须由 ADR 说明版本和发布方式。
5. `br-design-book` 和旧 Android 工程属于研究/历史输入,不是运行时依赖。

## 何时才新建仓库

只有出现独立发布周期、明确复用边界或不同运行时权限时才建仓。单个 PRD、版本、Cycle 或 AI Agent 都不是建仓理由。

