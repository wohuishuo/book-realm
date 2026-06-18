---
layout: home

hero:
  name: "BookRealm"
  text: "阅读平台产品与工程规格"
  tagline: PRD 定义功能,ADR 固化决策,Feature 描述验收,UI Rules 统一体验,Harness 保证交付。
  actions:
    - theme: brand
      text: 查看 PRD
      link: /product/prd/
    - theme: alt
      text: 查看 ADR
      link: /architecture/adr/
    - theme: alt
      text: 查看验收规格
      link: /specs/
    - theme: alt
      text: 查看 UI Rules
      link: /ui/

features:
  - title: 账号与权限
    details: 注册、JWT 会话、管理员权限和统一鉴权目标。
    link: /product/prd/prd-002-account-session
    linkText: 查看 PRD
  - title: 内容与书架
    details: 书籍、章节、搜索、详情和个人书架。
    link: /product/prd/prd-004-book-catalog
    linkText: 查看 PRD
  - title: 阅读体验
    details: 章节阅读、样式设置、进度恢复和离线缓存。
    link: /product/prd/prd-006-reader
    linkText: 查看 PRD
  - title: 标记与互动
    details: 划线、笔记、段评、点赞和回到原文。
    link: /product/prd/prd-010-highlights
    linkText: 查看 PRD
  - title: AI 原文理解
    details: 章节摘要、原文检索、带引用问答和降级处理。
    link: /product/prd/prd-014-grounded-qa
    linkText: 查看 PRD
  - title: 工程质量
    details: 多仓 CI、平台冒烟、Android 主旅程和合并门禁。
    link: /quality/
    linkText: 查看 Harness
---

## 平台边界

```text
Android Reader
├─ Identity API
├─ Library API
├─ Statistics API
└─ Grounded AI API
```

## 规格关系

```text
Product Roadmap
  -> PRD
  -> ADR / UI Rules
  -> Feature
  -> Linear Issue
  -> Pull Request
  -> Harness
```

旧分析、旧工单和旧计划统一归档,不参与当前开发决策。

