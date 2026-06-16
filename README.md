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

**BookRealm 是一个可运行、可学习、可拆开复用的 AI 辅助阅读平台;PRD 是第一入口,代码和工程书是证据。**

读者使用 Android App 登录后,可以搜索公版书、加入书架、打开章节阅读。阅读行为会进入统计服务;章节内容会被 AI 服务检索,用于摘要和基于原文的问答。平台不是只给一堆代码,而是把每个决策写进在线书,让后来者知道为什么这样做。

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

## 仓库地图

每个代码仓都能独立运行和复用;BookRealm 仓库负责平台书、总设计和集成说明。

| 仓库 | 读者看到什么 | 工程职责 | 状态 |
| --- | --- | --- | --- |
| [book-realm](https://github.com/wohuishuo/book-realm) | 在线工程书与平台总览 | 需求、架构、技术图鉴、集成指南 | ✅ 当前仓 |
| [user-center-team-project](https://github.com/wohuishuo/user-center-team-project) | 注册、登录、当前用户 | JWT 认证、用户管理、登录事件源 | ✅ 完成 |
| [br-library-service](https://github.com/wohuishuo/br-library-service) | 搜书、看目录、读章节 | 公版书内容 API:书/章/段/标签 | ✅ 完成 |
| [br-reader-app](https://github.com/wohuishuo/br-reader-app) | 手机书架、阅读器、AI 按钮 | Jetpack Compose Android 客户端 | ✅ 完成 |
| [br-event-stats](https://github.com/wohuishuo/br-event-stats) | 登录和阅读统计可查询 | RabbitMQ 事件消费 + 阅读进度 API | ✅ 完成 |
| [br-ai-service](https://github.com/wohuishuo/br-ai-service) | 摘要、围绕原文提问 | DeepSeek + RAG 原文问答服务 | ✅ 完成 |

## 这本书讲什么

- **产品 PRD**:先讲清用户、问题、范围、功能、验收、风险和下一工单。
- **实战篇**:从用户中心、书库、Android App、统计服务到 AI 服务,逐章解释真实代码和真实取舍。
- **平台篇**:作为 PRD 的证据层,保留需求、用例、领域模型、架构和计划。
- **技术图鉴**:用短卡片解释 Compose、Retrofit、Room、DataStore、Spring Boot、RabbitMQ、RAG 等关键技术。
- **方法**:全书采用金字塔表达:结论先行,再给根据和例子,尽量让读者不用绕路。

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

当前 App 产品版本为 `0.3.0-alpha.20260616`:已接入登录、书架、阅读、AI、划线、笔记、段评和点赞,但仍属于 alpha,阅读体验和自动化 UI 验收还在产品化整理中。平台书里的 `v2.1/v2.2` 是内部工程阶段,不是对外产品版本。

BookRealm 第一条主链路已完成并通过真机验证:App 可登录、搜书、阅读、上报进度、请求 AI 摘要和原文问答。后端已补平台级一键回归脚本,用于持续验证这些链路没有被后续改动打断。

详细进度见 [`TODO-总进度.md`](TODO-总进度.md)。

---

<div align="center">

前作:[用户中心 · 软件工程实战书](https://github.com/wohuishuo/user-center-team-project)

如果这个项目帮你理解了跨平台工程,欢迎点个 Star。

</div>
