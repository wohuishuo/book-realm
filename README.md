<div align="center">

# 📖 书域 BookRealm

**一个拆成 5 个独立模块的电子书平台,和一本讲清它怎么搭起来的书。**

读到不懂的段落,划词提问,AI 引用原文回答——这是这个平台最想做好的事。
而这本书,把"从想清楚到跑起来"的全过程摊开给你看:真实代码、真实决策、真实踩的坑。

<br>

### [**→ 在线阅读这本书 ←**](https://wohuishuo.github.io/book-realm/)

<br>

[![在线阅读](https://img.shields.io/badge/在线阅读-Read_Online-6c63ff?style=for-the-badge&logo=readthedocs&logoColor=white)](https://wohuishuo.github.io/book-realm/)
[![Last Commit](https://img.shields.io/github/last-commit/wohuishuo/book-realm?style=for-the-badge&color=fed766)](https://github.com/wohuishuo/book-realm/commits/main)

[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.3-6DB33F?style=flat-square&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Kotlin](https://img.shields.io/badge/Kotlin-Compose-7F52FF?style=flat-square&logo=kotlin&logoColor=white)](https://kotlinlang.org/)
[![RabbitMQ](https://img.shields.io/badge/RabbitMQ-fanout-FF6600?style=flat-square&logo=rabbitmq&logoColor=white)](https://www.rabbitmq.com/)
[![Spring AI](https://img.shields.io/badge/Spring_AI-RAG-6DB33F?style=flat-square&logo=spring&logoColor=white)](https://spring.io/projects/spring-ai)
[![VitePress](https://img.shields.io/badge/Book-VitePress-6c63ff?style=flat-square&logo=vite)](https://vitepress.dev/)

</div>

---

## 平台长什么样

一个 Android 客户端 + 四个后端服务,各管一摊、独立可跑,拼成完整平台:

```
                     登录(JWT)        ┌──────────────┐  发布登录事件
        ┌──────────────────────────▶ │ ⓪ 用户中心    │ ─────────────┐
        │                            └──────────────┘              ▼
 ┌─────────────┐   拉书/章节          ┌──────────────┐        ┌──────────────┐
 │ ② 阅读 App  │ ──────────────────▶ │ ① 书库服务    │        │   RabbitMQ   │
 │  (Compose)  │                     └──────────────┘        └──────┬───────┘
 └─────────────┘   划词提问           ┌──────────────┐               │ 广播
        └──────────────────────────▶ │ ④ AI 问答    │        ┌──────▼───────┐
                                     │   (RAG)      │        │ ③ 日志+统计  │
                                     └──────────────┘        └──────────────┘
```

## 各模块仓库(每个都能独立运行)

| 模块 | 干什么 | 仓库 | 状态 |
| --- | --- | --- | --- |
| ⓪ 用户中心 | 一次登录,各处通行(JWT) | [user-center-team-project](https://github.com/wohuishuo/user-center-team-project) | ✅ 完成 |
| ① 书库服务 | 把书的内容存好、查得出来 | [br-library-service](https://github.com/wohuishuo/br-library-service) | ✅ 完成 |
| ② 阅读 App | 手机看书:书架、阅读器 | br-reader-app | ⬜ 开发中 |
| ③ 事件统计 | 登录/阅读行为异步统计 | br-event-stats | ⬜ 计划中 |
| ④ AI 问答 | 划词提问,引用原文回答 | br-ai-service | ⬜ 计划中 |

**本仓(book-realm)是平台的"总指挥部"**:书的源文件、前期设计文档(需求 → 用例 → 领域模型 → 架构)、各模块的执行工单、以及后续把所有服务一键启动的 docker-compose 都在这里。

## 这本书里有什么

- **实战篇**:每个模块一章,真实代码嵌在正文里,讲透"为什么这么做"、记下真实踩的坑——目标是**只读书就能讲清整个平台**;
- **前期设计**:从业务定位、竞品分析到领域模型(DDD)和架构选型,"动手前的功课"完整可查;
- **方法**:金字塔表达(结论先行)、复盘清单——这本书自己就按这套方法写。

本地预览:

```bash
npm install
npm run docs:dev    # http://localhost:5173/book-realm/
```

## 项目进度

看 [`TODO-总进度.md`](TODO-总进度.md)——整个平台做到哪、下一步是什么,全记在这一个文件里。

---

<div align="center">

前作:[用户中心 · 软件工程实战书](https://github.com/wohuishuo/user-center-team-project)(本平台的方法论来源)

⭐ 如果这个项目帮到了你,欢迎点个 Star ⭐

</div>
