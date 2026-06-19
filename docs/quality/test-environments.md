# 测试运行环境

所有机器报告的统一入口见[测试证据](/quality/test-evidence)。

测试代码运行在宿主机或 GitHub Actions runner，真实依赖运行在临时 Docker 容器。应用不需要为了测试再套一层容器；平台 BDD 才把全部服务一起构建为容器。

| 门 | 运行内容 | Docker |
| --- | --- | --- |
| `pre-commit` | lint、编译、规格检查 | 不需要 |
| `pre-push` | 单元/集成测试、build | 认证集成测试需要 |
| Pull Request CI | 仓库完整 `verify` | runner 临时 MySQL/Redis |
| Platform BDD | 四个后端、MySQL、Redis、RabbitMQ、Cucumber | 全平台 Compose |

## 认证后端

```powershell
cd user-center
./scripts/test-backend.ps1
```

脚本启动 `docker-compose.test.yml`，Maven 连接 `localhost:3307` 的临时 MySQL 和 `localhost:6380` 的临时 Redis，结束后执行 `down -v`。测试绝不连接开发数据库。

## 平台用户旅程

```powershell
cd book-realm
./scripts/run-platform-bdd.ps1
```

脚本构建真实服务镜像并运行 `npm run bdd:api`。Cucumber 报告输出到 `reports/cucumber.html`，服务日志输出到 `reports/platform-services.log`；CI 将两者保存为 artifact。

需要真实模型密钥的场景标记 `@requires-ai`，通过 `npm run bdd:ai` 单独运行；普通 CI 不注入生产密钥，也不使用假回答伪造通过。

平台 BDD 每晚自动运行，也可在 GitHub Actions 手动触发。跨仓 PR 合并前应手动触发一次；后续可由 repository dispatch 自动触发。

## 分支保护

登录 GitHub CLI 后运行 `./scripts/configure-branch-protection.ps1`。脚本要求所有仓库通过 PR 合并、解决讨论并通过对应 `verify` 或 `specifications` 检查。
