# 质量与 Harness

> **结论先行**:Harness 把产品规则变成每次提交都能重复运行的机器检查;本地检查、仓库 CI 和平台验收共同守住主链路。

| 层级 | 作用 | 正本 |
| --- | --- | --- |
| 本地快速门 | 尽早发现格式、编译和单测问题 | [Harness 方案](/quality/harness) |
| 仓库 PR 门 | 不通过 test/build 就不能合并 | 各代码仓 GitHub Actions |
| 平台集成门 | 验证跨服务 API 和主旅程 | `test-platform.ps1` |
| 运行手册 | 启动、联调和排障 | [平台 Runbook](/quality/runbook-platform-ops) |

验收行为见 [Feature 索引](/specs/);产品完成标准见各 PRD 的 Acceptance。
