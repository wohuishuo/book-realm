---
layout: home

hero:
  name: "书域"
  text: "一个真实平台,从想清楚到跑起来"
  tagline: 我们把电子书平台拆成 5 个能独立跑的模块——登录、书库、App、统计、AI。每章嵌真实代码、讲透为什么、记下踩的坑。
  actions:
    - theme: brand
      text: 看它怎么搭起来 →
      link: /project/
    - theme: alt
      text: 前期设计(P 阶段)
      link: /platform/
    - theme: alt
      text: 学方法
      link: /guide/preface

features:
  - icon: 🔐
    title: MVP-0 用户中心
    details: 平台的门卫:一次登录,各处通行。BCrypt 存密码 + JWT 无状态登录态。
    link: /project/user-center
    linkText: ✅ 已完成
  - icon: 📚
    title: MVP-1 书库服务
    details: 内容底座:书→章→段结构化入库,4 个只读接口,61 段真实公版原文开箱即用。
    link: /project/library
    linkText: ✅ 已完成
  - icon: 📱
    title: MVP-2 阅读 App
    details: Jetpack Compose 客户端:登录、书架、阅读器,Room 离线缓存。
    link: /project/reader
    linkText: ⬜ 工单就绪
  - icon: 📊
    title: MVP-3 事件统计
    details: 登录事件 → RabbitMQ 广播 → 日志 + 统计两个微服务异步消费。
    link: /project/event-stats
    linkText: ⬜ 工单就绪
  - icon: 🤖
    title: MVP-4 AI 服务
    details: 读到不懂的段落,划词提问,AI 检索本书原文、带引用回答(RAG)。
    link: /project/ai
    linkText: ⬜ 工单就绪
  - icon: 🧭
    title: 方法与设计
    details: 金字塔表达、复盘清单,以及从需求到架构的全套前期设计(P1–P8)。
    link: /guide/methodology
    linkText: 学方法
---

## 平台长什么样

**结论:一个 Android 客户端 + 四个后端服务,各管一摊,拼成完整平台。**

```
                     登录(JWT)        ┌──────────────┐  发布 UserLogin 事件
        ┌──────────────────────────▶ │ ① 用户中心    │ ─────────────┐
        │                            └──────────────┘              ▼
 ┌─────────────┐   拉书/章节         ┌──────────────┐        ┌──────────────┐
 │ ② 阅读 App  │ ──────────────────▶ │ ① 书库服务    │        │   RabbitMQ   │
 │  (Compose)  │                     └──────────────┘        └──────┬───────┘
 │  Room 缓存  │   划词提问           ┌──────────────┐               │ 广播
 └─────────────┘ ──────────────────▶ │ ④ AI 服务     │        ┌──────▼───────┐
        │            进度上报(HTTP)   │  (RAG 问答)  │        │ ③ 日志+统计   │
        └──────────────────────────▶ └──────────────┘        └──────────────┘
```

每个编号模块都是独立仓库、独立可跑、独立可演示——这是有意的设计:**任何一块出问题或被砍掉,其余照常工作**。

## 三条阅读线

| 你想要什么 | 这样读 |
| --- | --- |
| **学动手**:照着搭一个真项目 | 直接进 [实战篇](/project/),按 MVP-0 → 4 顺序读,代码就嵌在章里 |
| **学想清楚**:动手前的功课怎么做 | [前期设计 P1–P8](/platform/):业务定位 → 用例 → 领域模型 → 架构 |
| **学表达**:把复杂的事一分钟讲明白 | [方法](/guide/methodology) + [金字塔写作](/guide/writing-style),全书就是活样板 |

> 这本书自己也遵守它教的方法:**每段先给结论,再讲根据和例子**。你读起来不费劲,正是因为这个。
