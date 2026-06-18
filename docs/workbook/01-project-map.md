# 01 读懂项目地图

BookRealm 是一个产品、六个交付单元，不是多个互不相关的 MVP。仓库按可独立构建和部署的能力拆分，PRD 按用户结果组织。

| 单元 | 责任 | 主要技术 |
| --- | --- | --- |
| `book-realm` | 产品规格、架构、BDD、跨仓验收 | VitePress、Cucumber |
| `user-center` | 注册、登录、管理员用户管理 | Spring Boot、React |
| `br-library-service` | 书籍、章节、标记、段评 | Spring Boot、JPA |
| `br-event-stats` | 登录事件、阅读进度和统计 | Spring Boot、RabbitMQ、JPA |
| `br-ai-service` | 摘要、向量化、原文问答 | Spring AI |
| `br-reader-app` | Android 阅读体验 | Kotlin、Compose、Room |

## 先做什么

先阅读[仓库与能力地图](/architecture/repositories)，再运行每个仓库的 `verify`。无法构建的系统不能作为可靠学习材料。

## 完成证据

- 能指出一个用户旅程跨越哪些仓库。
- 能解释为什么不为每个版本新建 Git 仓库。
- 所有仓库都有独立构建入口。
