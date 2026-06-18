# Docker 与 adb 调试

> **结论先行**:Docker 负责把后端服务稳定跑在电脑上,adb reverse 负责让手机访问电脑上的后端。没有这两件事,Android 真机联调会非常混乱。

## 一句话

Docker = 后端运行环境打包;adb reverse = USB 线上的端口反向代理。

| 技术 | 在书域里解决什么 |
| --- | --- |
| Docker | 启动 MySQL、Redis、用户中心前后端 |
| adb reverse | 让真机访问电脑 localhost |
| Docker Compose | 一条命令起多容器 |

## 解决什么问题

手机上的 `127.0.0.1` 是手机自己,不是电脑。App 如果写 `http://127.0.0.1:8082`,默认会去找手机自己的 8082 端口,当然找不到电脑上的书库服务。

`adb reverse` 把手机端口转到电脑端口:

```powershell
adb reverse tcp:8080 tcp:80
adb reverse tcp:8082 tcp:8082
```

于是 App 访问手机 `127.0.0.1:8082`,实际会转到电脑 `127.0.0.1:8082`。

## 依赖关系

```
Docker / Java 进程在电脑启动后端
        │
电脑端口 80 / 8082 / 8083 / 8084
        │ adb reverse
        ▼
手机 App 访问 127.0.0.1:xxxx
```

## 在书域里的角色

当前联调方式:

- 用户中心 Docker Compose 暴露电脑 `:80`;
- 书库服务运行在电脑 `:8082`;
- App 访问 `127.0.0.1:8080` 和 `127.0.0.1:8082`;
- adb 把 `8080 → 80`,`8082 → 8082`。

## 真实踩坑

手机通常不能稳定反代低端口 80,所以我们没有让 App 访问 `127.0.0.1:80`,而是访问 `127.0.0.1:8080`,再转到电脑 `:80`。

另一个坑是 Docker Desktop 没启动时,`docker ps` 会报找不到 Docker API 管道。先启动 Docker Desktop,再跑 compose。

## 对应资源

- 规格:[PRD-018 自动化质量门](/product/prd/prd-018-automated-quality)
- 相关卡:[Retrofit](/stack/retrofit)
