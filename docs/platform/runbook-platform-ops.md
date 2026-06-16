# Runbook:平台启动与真机联调

> **结论先行**:一条命令 `start-platform.ps1` 起全栈并做 8 项健康检查;真机联调靠 `adb reverse` 把手机的 4 个端口转回本机。本页是操作手册,出问题按"故障排查"对号入座。

## 何时用本页

- 要在本机起整套书域(演示、联调、验收)前;
- 真机装了 APK 但连不上后端时;
- 某个健康检查变红、需要定位时。

## 一、前置(一次性)

**结论**:本机已装齐,缺哪个对照补。

- Java 21 / Maven / Docker Desktop;
- scoop 装的 MySQL(数据目录 `C:\mysql-data`)、Redis;
- RabbitMQ 4.x + Erlang(`ERLANG_HOME`/`RABBITMQ_BASE` 已设用户环境变量,数据目录 `C:\rabbitmq-data`);
- AI 要真实出力:设环境变量 `DEEPSEEK_API_KEY`(不设也能起,降级返回检索依据)。

## 二、启动全栈

```powershell
cd book-realm
./start-platform.ps1
```

**脚本做了什么**(按序):

1. 起基础设施:MySQL `:3306`、Redis `:6379`、RabbitMQ `:5672/:15672`(已在监听则跳过);
2. `docker compose up -d` 起用户中心(`http://localhost/api`);
3. 建库 `book_realm_library`、`book_realm_stats`;
4. 起三个 jar:书库 `:8082`、统计 `:8083`、AI `:8084`(jar 缺失会自动 `mvn package`);
5. 等 20s,打印 8 项健康表,**任一为 false 即 throw**。

**期望结果**:8 行全 OK。`platform is ready` 即可联调。

## 三、真机联调(USB)

**结论**:手机用 USB 连本机,`adb reverse` 把这 4 个端口转回来,App 即可访问本机后端。

```powershell
adb reverse tcp:8080 tcp:80     # 用户中心(本机 80)
adb reverse tcp:8082 tcp:8082   # 书库
adb reverse tcp:8083 tcp:8083   # 统计
adb reverse tcp:8084 tcp:8084   # AI
adb install -r <app-debug.apk>  # br-reader-app(本地在 C:\dev\br-reader-app)
```

> Android 工程在 `C:\dev\br-reader-app`,不在本工作区——AGP 不吃中文路径,勿移回。

## 四、故障排查

| 症状 | 可能原因 | 处置 |
| --- | --- | --- |
| 某 jar 健康检查 false | 端口没起来/启动慢 | 看对应 `target\*.jar` 是否生成;手动 `java -jar` 看报错 |
| user-center 检查 false | docker 没起/80 被占 | `docker compose ps`;`docker compose logs` |
| rabbitmq 不监听 | Erlang 环境变量缺 | 确认 `ERLANG_HOME`;手动跑 `rabbitmq-server.bat` |
| AI 答非真实 LLM | 没设 key | `$env:DEEPSEEK_API_KEY` 后重启 AI;`/api/health` 看 `llmKeyConfigured` |
| 真机连不上后端 | reverse 没打/掉线 | 重跑四条 `adb reverse`;`adb devices` 确认设备在线 |
| 搜索空结果 | App 分页传错 | 分页从 `page=0` 开始(历史坑,已修) |
| docker pull EOF | 偶发网络 | 重试同一命令 |
| npm EPERM | 中文用户名缓存 | 加 `--cache C:\temp\npmcache` |

## 五、回滚

**结论**:本平台无破坏性迁移,回滚 = 停进程 + 可选清库。

- 停 jar:结束对应 `java` 进程(`Get-Process java`);
- 停基础设施:`docker compose down`(用户中心);MySQL/Redis/RabbitMQ 为本机进程,按需停;
- 数据回滚:删库 `book_realm_library/stats` 后重启脚本会重建(书库带种子数据自动回灌)。

## 六、安全提醒

::: warning 演示 key 需轮换
历史演示用的 `DEEPSEEK_API_KEY` 曾出现在聊天记录中,演示后请在 DeepSeek 控制台轮换,并只经环境变量注入,勿写进任何文件或文档。
:::
