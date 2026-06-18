# 验收规格

核心用户行为使用 Gherkin 描述。文件位于 `docs/specs/features/`。

| Feature | 覆盖 PRD |
| --- | --- |
| `authentication.feature` | PRD-002 |
| `admin-user-management.feature` | PRD-003 |
| `book-discovery.feature` | PRD-004、005 |
| `reading-progress.feature` | PRD-006、007、008 |
| `offline-reading.feature` | PRD-009 |
| `annotations.feature` | PRD-010、011 |
| `comments-likes.feature` | PRD-012 |
| `grounded-ai.feature` | PRD-013、014 |
| `statistics.feature` | PRD-015、016 |
| `quality-gates.feature` | PRD-018 |

这些场景先作为可执行规格正本。接入 Cucumber 或其他 BDD Runner 时,步骤实现必须引用这些文件,不能复制另一套场景。

