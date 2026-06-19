# 验收规格

核心用户行为使用 Gherkin 描述。文件位于 `docs/specs/features/`。

| Feature | 覆盖 PRD | 执行方式 |
| --- | --- | --- |
| `platform-api.feature` | PRD-002、004、008、010、011、012、013、014、016 | Docker + Cucumber 真实 HTTP |
| `authentication.feature` | PRD-002 | Android 待自动化 |
| `admin-user-management.feature` | PRD-003 | Web 待自动化 |
| `book-discovery.feature` | PRD-004、005 | Android 待自动化 |
| `reading-progress.feature` | PRD-006、007、008 | Android 待自动化 |
| `offline-reading.feature` | PRD-009 | Android 待自动化 |
| `annotations.feature` | PRD-010、011 | Android 待自动化 |
| `comments-likes.feature` | PRD-012 | Android 待自动化 |
| `grounded-ai.feature` | PRD-013、014 | 密钥隔离 CI 待完成 |
| `statistics.feature` | PRD-015、016 | 事件消费旅程待自动化 |
| `quality-gates.feature` | PRD-018 | GitHub 分支保护已执行 |

这些文件是验收规格正本。`@api` 场景由平台 CI 真实执行，`@manual` 表示步骤已定义但自动化驱动尚未接入。新增自动化必须引用现有场景，不能复制另一套行为描述。
