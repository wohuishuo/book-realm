# 12 CI、Lint、Test 与 Hooks

Harness 让本地、Pull Request 和发布候选使用同一组命令。规则不是写在文档里提醒，而是在错误发生时阻止合并。

## 三道门

1. `pre-commit`：快速 lint 和编译检查。
2. `pre-push` / PR CI：完整 `verify`，包括单测、集成测试和构建。
3. 发布候选：启动所有服务，执行 Cucumber API Journey 和 Android 设备验收。

Java 服务运行 `scripts/verify.ps1`；Android 运行 lint、unit test、assemble；Web 运行 ESLint、TypeScript 和 Vite build；规格仓运行 metadata lint、Cucumber dry-run 和 VitePress build。

## 失败处理

不删除测试、不降低断言、不使用 `skipTests`。认证后端依赖本机 MySQL就是当前 Harness 发现的待修缺口，应建立独立测试数据库。
