<div align="center">

# 书域 BookRealm

**开源跨平台阅读平台:Android 阅读 App + Spring Boot 服务 + AI 原文问答 + 产品 PRD + 在线工程书**

BookRealm 让读者在手机上登录、找书、阅读;系统记录阅读进度;读到不懂的段落时,AI 会基于书中原文给出摘要或回答。

这个仓库是平台总览、产品 PRD 与在线书:它负责讲清楚用户、范围、架构、技术栈、实现顺序和各服务如何集成。

<br>

### [在线阅读 PRD 与工程书](https://wohuishuo.github.io/book-realm/)

<br>

[![在线阅读](https://img.shields.io/badge/在线阅读-Read_Online-6c63ff?style=for-the-badge&logo=readthedocs&logoColor=white)](https://wohuishuo.github.io/book-realm/)
[![Last Commit](https://img.shields.io/github/last-commit/wohuishuo/book-realm?style=for-the-badge&color=fed766)](https://github.com/wohuishuo/book-realm/commits/main)

[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.3-6DB33F?style=flat-square&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Kotlin](https://img.shields.io/badge/Kotlin-Compose-7F52FF?style=flat-square&logo=kotlin&logoColor=white)](https://kotlinlang.org/)
[![RabbitMQ](https://img.shields.io/badge/RabbitMQ-fanout-FF6600?style=flat-square&logo=rabbitmq&logoColor=white)](https://www.rabbitmq.com/)
[![DeepSeek](https://img.shields.io/badge/DeepSeek-RAG-48cfad?style=flat-square)](https://www.deepseek.com/)
[![VitePress](https://img.shields.io/badge/Book-VitePress-6c63ff?style=flat-square&logo=vite)](https://vitepress.dev/)

</div>

---

## 一分钟理解

**BookRealm 是一个可运行、可拆开复用的 AI 辅助阅读平台;18 份 PRD 定义功能,11 份 ADR 固化决策,Feature 和 Harness 提供验收证据。**

读者使用 Android App 登录后,可以搜索公版书、加入书架、打开章节阅读。阅读行为进入统计服务;章节内容由 AI 服务检索,用于摘要和基于原文的问答。

## 平台结构

```
                     登录(JWT)        ┌──────────────┐  发布 UserLogin 事件
        ┌──────────────────────────▶ │  用户中心     │ ─────────────┐
        │                            └──────────────┘              ▼
 ┌─────────────┐   拉书/章节          ┌──────────────┐        ┌──────────────┐
 │ Android App │ ──────────────────▶ │  书库服务     │        │   RabbitMQ   │
 │  阅读器     │                     └──────────────┘        └──────┬───────┘
 │             │   AI 摘要/问答       ┌──────────────┐               │ 广播
 └─────────────┘ ──────────────────▶ │  AI 服务      │        ┌──────▼───────┐
        │            进度上报(HTTP)   │  RAG 原文检索 │        │  事件统计     │
        └──────────────────────────▶ └──────────────┘        └──────────────┘
```

## 产品与仓库地图

每个代码仓都能独立运行和复用;BookRealm 仓库负责平台书、总设计和集成说明。

产品按“产品 → PRD → ADR/UI Rules → Feature → Issue → PR → Harness”管理。下面五个代码组件共同交付 BookRealm,不再称为五个独立 MVP。规格入口见 [`docs/product/index.md`](docs/product/index.md)。

| 仓库 | 读者看到什么 | 工程职责 | 状态 |
| --- | --- | --- | --- |
| [book-realm](https://github.com/wohuishuo/book-realm) | 产品与工程规格 | PRD、ADR、Feature、UI Rules、Harness | ✅ 当前仓 |
| [user-center-team-project](https://github.com/wohuishuo/user-center-team-project) | 注册、登录、当前用户 | JWT 认证、用户管理、登录事件源 | ✅ 完成 |
| [br-library-service](https://github.com/wohuishuo/br-library-service) | 搜书、看目录、读章节 | 公版书内容 API:书/章/段/标签 | ✅ 完成 |
| [br-reader-app](https://github.com/wohuishuo/br-reader-app) | 手机书架、阅读器、AI 按钮 | Jetpack Compose Android 客户端 | ✅ 完成 |
| [br-event-stats](https://github.com/wohuishuo/br-event-stats) | 登录和阅读统计可查询 | RabbitMQ 事件消费 + 阅读进度 API | ✅ 完成 |
| [br-ai-service](https://github.com/wohuishuo/br-ai-service) | 摘要、围绕原文提问 | DeepSeek + RAG 原文问答服务 | ✅ 完成 |

## 规格内容

- **PRD**:定义每项功能的 Why、Problem、Goal、Journey、Non-goals 和 Acceptance。
- **ADR**:记录已经采用或待决定的长期架构选择。
- **Feature**:用 Gherkin 描述关键用户行为。
- **UI Rules**:统一 Android、Web 管理端和组件规则。
- **Harness**:定义本地检查、CI、平台冒烟和真实设备验收。

## 本地预览工程书

```powershell
npm install
npm run docs:dev
```

默认地址:<http://localhost:5173/book-realm/>

## 本地启动后端

**结论:后端联调先跑 `start-platform.ps1`,验收先跑 `test-platform.ps1`。**

这两个脚本把"我感觉能跑"改成"机器替我们证明能跑"。启动脚本负责拉起依赖和四个后端服务;测试脚本负责跑单元测试、健康检查和跨服务 API 冒烟。

```powershell
powershell -ExecutionPolicy Bypass -File .\start-platform.ps1
powershell -ExecutionPolicy Bypass -File .\test-platform.ps1
```

本地端口:

| 服务 | 地址 |
| --- | --- |
| 用户中心 | <http://localhost/api/health> |
| 书库服务 | <http://localhost:8082/api/health> |
| 事件统计 | <http://localhost:8083/api/health> |
| AI 服务 | <http://localhost:8084/api/health> |
| RabbitMQ 管理台 | <http://localhost:15672> |

`test-platform.ps1` 会验证登录、搜书、书籍详情、章节读取、划线笔记、阅读进度上报、AI 摘要和 AI 问答。以后新增需求时,先把验收点写清楚,再补测试或冒烟步骤。

## 进度

当前 App 产品版本为 `0.3.0-alpha.20260616`:已接入登录、书架、阅读、AI、划线、笔记、段评和点赞。统一鉴权、完整 Android 自动验收和个人记录入口完成后进入下一发布阶段。

BookRealm 第一条主链路已完成并通过真机验证:App 可登录、搜书、阅读、上报进度、请求 AI 摘要和原文问答。后端已补平台级一键回归脚本,用于持续验证这些链路没有被后续改动打断。

当前三项工作见 [`TODO-总进度.md`](TODO-总进度.md);完整产品路线见 [`docs/product/roadmap.md`](docs/product/roadmap.md),历史材料统一存放在 `docs/archive/legacy/`。

---

<div align="center">

前作:[用户中心 · 软件工程实战书](https://github.com/wohuishuo/user-center-team-project)

如果这个项目帮你理解了跨平台工程,欢迎点个 Star。

</div>
