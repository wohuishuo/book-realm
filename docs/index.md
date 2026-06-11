---
layout: home

hero:
  name: "书域"
  text: "多 MVP 电子书平台 · 总纲"
  tagline: 5 个互相咬合、各自完整的 MVP,组成一个超级项目。七成准备,三成代码——这里是准备的正本。
  actions:
    - theme: brand
      text: 从序言开始
      link: /guide/preface
    - theme: alt
      text: P 阶段(七成准备)
      link: /platform/
    - theme: alt
      text: MVP 地图
      link: /mvp/

features:
  - icon: 🧭
    title: 方法正本
    details: 金字塔写作、方法论、RC 重读清单——全平台唯一正本,各 MVP 小书只链接不复制。
    link: /guide/methodology
    linkText: 看方法论
  - icon: 📐
    title: P 阶段 · 七成准备
    details: 业务定位 → 竞品 → 功能树 → 用例 → 领域模型(DDD/BC)→ 架构选型。产出直接就是结课文档。
    link: /platform/
    linkText: 进入平台篇
  - icon: 🛰️
    title: 星系结构
    details: 1 个枢纽仓 + 每 MVP 一仓一书。用户中心(前作)已完成,直接当认证微服务复用。
    link: /mvp/
    linkText: 看 MVP 地图
---

## 这个超级项目是什么

**结论:用 5 个独立完整的 MVP 组成一个电子书平台,每个 MVP 一仓一书,枢纽仓(本仓)放总纲。**

| MVP | 定位 | 状态 |
| --- | --- | --- |
| 0 用户中心 | 平台统一登录(JWT) | ✅ 已完成([书](https://wohuishuo.github.io/user-center-team-project/) · [仓](https://github.com/wohuishuo/user-center-team-project)) |
| 1 书库服务 | 图书/章节内容 API + 文件 | 待建 |
| 2 阅读 App | Compose 客户端 | 待建 |
| 3 事件统计 | RabbitMQ 日志/统计微服务 | 待建 |
| 4 AI 服务 | Spring AI + RAG 读书问答 | 待建 |

完整蓝图见 [行动计划](/platform/plan),进度存档见仓库根 `TODO-总进度.md`。
