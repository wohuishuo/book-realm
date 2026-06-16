---
layout: home

hero:
  name: "书域 BookRealm"
  text: "开源跨平台阅读平台"
  tagline: Android 阅读 App + Spring Boot 服务 + RabbitMQ 统计 + DeepSeek RAG 原文问答。先用 PRD 讲清产品,再用实战篇讲清代码。
  actions:
    - theme: brand
      text: 看产品 PRD →
      link: /platform/prd
    - theme: alt
      text: 进入实战篇
      link: /project/
    - theme: alt
      text: 看技术图鉴
      link: /stack/
    - theme: alt
      text: 看平台设计证据
      link: /platform/

features:
  - icon: 🔐
    title: 用户中心
    details: 注册、登录、当前用户、JWT 登录态,并在登录成功后发布 UserLogin 事件。
    link: /project/user-center
    linkText: 查看实战章
  - icon: 📚
    title: 书库服务
    details: 把公版书按书、章、段、标签结构化,给 App 和 AI 服务提供统一内容 API。
    link: /project/library
    linkText: 查看实战章
  - icon: 📱
    title: 阅读 App
    details: Jetpack Compose 客户端:登录、书城、书架、阅读器、进度保存、AI 摘要和问答入口。
    link: /project/reader
    linkText: 查看实战章
  - icon: 📊
    title: 事件统计
    details: RabbitMQ 消费登录事件,HTTP 接收阅读进度,把旁路统计从主链路里拆出来。
    link: /project/event-stats
    linkText: 查看实战章
  - icon: 🤖
    title: AI 阅读助手
    details: 从书库拉取段落建立索引,用 DeepSeek 做摘要和基于原文引用的 RAG 问答。
    link: /project/ai
    linkText: 查看实战章
  - icon: 🧭
    title: 工程方法
    details: 用金字塔表达、RC 重读、真实验证和 commit 闭环,把项目做成可复盘的工程。
    link: /guide/methodology
    linkText: 学方法
---

## 一分钟理解

**结论:BookRealm 是一个已经跑通 v1 主链路的 AI 辅助阅读平台,也是一份可继续执行的产品 PRD。**

读者在 Android App 登录后,可以搜索公版书、加入书架、打开章节阅读;系统会记录登录和阅读进度;读到不懂的段落时,可以请求摘要或提问,AI 会先检索书中原文,再生成带依据的回答。

如果只想知道“这个产品要做什么、做到哪、怎么验收”,先读 [产品 PRD](/platform/prd)。如果想知道“为什么这样设计”,再读平台篇 P1-P8 和工程治理文档。

## 平台长什么样

**结论:一个 Android 客户端 + 四个后端服务,各自独立,组合成完整阅读体验。**

```mermaid
flowchart LR
  App["Android 阅读 App\nCompose / Room / DataStore"] --> Auth["用户中心\nJWT 登录"]
  App --> Library["书库服务\n书 / 章 / 段 / 标签"]
  App --> Stats["事件统计\n阅读进度 API"]
  App --> Ai["AI 服务\n摘要 / RAG 问答"]
  Auth --> MQ["RabbitMQ\nUserLogin fanout"]
  MQ --> Stats
  Ai --> Library
```

每个服务仓库都能独立运行。平台书负责把这些模块的边界、接口、依赖和生命周期讲清楚。

## 三条阅读线

| 你现在想做什么 | 建议路径 |
| --- | --- |
| **先跑起来** | 读 [实战篇](/project/),按用户中心 → 书库 → App → 统计 → AI 顺序走 |
| **先判断产品** | 读 [产品 PRD](/platform/prd),看用户、范围、功能、验收和风险 |
| **先想清楚** | 读 [平台设计证据](/platform/),看 P1-P8、架构治理和技术裁决 |
| **先补技术** | 读 [技术图鉴](/stack/),每个依赖一张卡,先知道它解决什么问题 |

> 这本书遵守同一条写作规则:先给结论,再给根据和例子。读者不用陪作者绕路,应该直接走到结果。
