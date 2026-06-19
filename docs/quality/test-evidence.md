# 测试证据

测试是否通过以机器报告为准，不以聊天记录或人工描述为准。每份证据必须能追溯到仓库、commit、workflow run 和执行时间。

## GitHub Actions

| 范围 | Actions | Artifact |
| --- | --- | --- |
| 平台 Cucumber | [book-realm / Platform BDD](https://github.com/wohuishuo/book-realm/actions/workflows/platform-bdd.yml) | `platform-bdd-evidence` |
| 规格与网页构建 | [book-realm / Quality](https://github.com/wohuishuo/book-realm/actions/workflows/quality.yml) | `cucumber-report` |
| 认证前后端 | [user-center / User Center Quality](https://github.com/wohuishuo/user-center-team-project/actions/workflows/user-center-quality.yml) | `user-center-test-evidence` |
| 书库服务 | [library / Quality](https://github.com/wohuishuo/br-library-service/actions/workflows/quality.yml) | workflow logs |
| 统计服务 | [stats / Quality](https://github.com/wohuishuo/br-event-stats/actions/workflows/quality.yml) | workflow logs |
| AI 服务 | [AI / Quality](https://github.com/wohuishuo/br-ai-service/actions/workflows/quality.yml) | workflow logs |
| Android | [reader / Quality](https://github.com/wohuishuo/br-reader-app/actions/workflows/quality.yml) | `android-lint` |

进入某次 workflow run 后，在页面底部下载 Artifacts。报告保留 30 天；发布版本需要把对应 run URL 附到 Linear Issue 或 GitHub Release，形成长期索引。

## 本地证据

- `book-realm/reports/cucumber.html`：平台行为报告。
- `book-realm/reports/platform-services.log`：平台服务日志。
- `user-center/backend/target/surefire-reports/`：JUnit XML 与文本报告。
- `br-reader-app/app/build/reports/lint-results-debug.html`：Android Lint。

这些目录是生成物，不提交 Git。任何人都可以用网页书中的命令重新生成。

## 判定规则

- 绿色 workflow 只证明该 commit 的检查通过，不自动证明其他 commit。
- 跳过、未定义和 `@requires-ai` 场景必须在报告中可见，不能计入普通通过数量。
- Pull Request 必须链接其 workflow run；Linear Issue 完成时链接 PR 或 run。
- 失败报告保留，不通过删除测试、日志或 artifact 改写结果。
