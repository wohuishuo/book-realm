# 功能与实现证据台账

这张表是 Book Realm 当前产品边界的事实来源。状态以代码、可运行旅程和测试证据为准，不以页面存在或接口存在单独判定完成。

## 状态定义

- `Done`：核心 Journey 已贯通，并存在自动测试或可重复的人工验收证据。
- `Partial`：已有真实代码，但端到端旅程、安全、异常状态或证据仍缺失。
- `Proposed`：已有产品目标，尚未进入可验收实现。
- `Active`：治理类工作正在持续执行。

## 当前能力

| PRD | 能力 | 状态 | 已有实现证据 | 仍缺少 |
| --- | --- | --- | --- | --- |
| PRD-001 | 项目规格重构 | Active | PRD、ADR、Feature、UI Rules、Harness 和网页书已建立 | 持续校准代码与规格 |
| PRD-002 | 账号与会话 | Partial | 用户中心提供注册、登录和会话接口；认证集成测试通过 | 跨服务 JWT 统一验证和越权测试 |
| PRD-003 | 管理员用户管理 | Done | 用户中心包含管理员查询和删除流程 | 发布前保留最终验收证据 |
| PRD-004 | 书库与搜索 | Done | Library 提供书籍搜索、详情、目录和章节接口；平台 BDD 覆盖搜索和打开章节 | 扩充搜索排序与空态验收 |
| PRD-005 | 个人书架 | Partial | Android 存在本地书籍数据与书架界面 | 登录用户跨设备书架和端到端证据 |
| PRD-006 | 章节阅读器 | Done | Android 阅读器可展示章节与段落，平台 BDD 可取得章节内容 | 真机无障碍和长章节性能证据 |
| PRD-007 | 阅读样式设置 | Partial | Android 已有阅读设置入口 | 设置持久化、主题组合和截图回归 |
| PRD-008 | 阅读进度同步 | Partial | Stats 提供保存与查询进度接口；平台 BDD 已贯通保存和恢复查询 | 从可信身份取得 userId，Android 恢复旅程证据 |
| PRD-009 | 离线阅读 | Partial | Android 使用 Room 保存书籍、章节和段落 | 下载状态、失败恢复和离线主旅程自动化 |
| PRD-010 | 段落选择与划线 | Partial | Library 提供 mark 创建、查询和删除接口 | Android 连续范围选择、重开恢复和删除旅程证据 |
| PRD-011 | 阅读笔记 | Partial | mark 模型支持 note，服务端可按用户和书籍查询 | “我的笔记”入口、编辑流程和身份校验 |
| PRD-012 | 段评与点赞 | Partial | Library 提供评论、点赞、取消点赞和查询接口 | Android 完整互动流程与真实身份校验 |
| PRD-013 | AI 章节摘要 | Partial | AI 服务提供 summary 接口 | Android 完整入口、真实模型 CI 和降级验收 |
| PRD-014 | AI 原文问答 | Partial | AI 服务提供 ask/embed 接口 | 可验证引用、跳回原文和授权模型测试 |
| PRD-015 | 登录事件统计 | Partial | Stats 提供登录统计查询 | 事件来源可信性、权限和跨服务契约测试 |
| PRD-016 | 阅读进度统计 | Partial | Stats 提供进度写入与阅读统计查询 | 身份校验、统计口径和用户端可视化验收 |
| PRD-017 | UI 设计系统 | Partial | UI Rules 和模式文档已存在 | 同源设计令牌、组件预览和禁止行内样式的自动检查 |
| PRD-018 | 自动化质量门 | Partial | 六仓库分支保护、CI、hooks、Docker Cucumber 和 artifact 已建立 | Android UI/截图测试、契约测试和长期发布证据 |
| PRD-019 | 听书与 TTS | Proposed | 产品目标和边界已记录 | 服务边界、播放器状态机和可访问性验收 |
| PRD-020 | 本地书籍导入 | Proposed | 产品目标和导入 ADR 已记录 | 格式解析、失败报告和版权边界实现 |
| PRD-021 | 词典与翻译 | Proposed | 产品目标已记录 | Provider 决策、缓存和离线降级 |
| PRD-022 | 内容管理 | Proposed | 管理端目标已记录 | 内容 CRUD、导入校验、权限和审计日志 |
| PRD-023 | 阅读发现与推荐 | Proposed | 产品目标已记录 | 推荐信号、解释与隐私约束 |
| PRD-024 | 阅读记录与个人资料 | Proposed | 产品目标已记录 | 聚合接口、Android 页面和数据删除能力 |

## 代码边界

| 仓库 | 当前职责 |
| --- | --- |
| `user-center-team-project` | 注册、登录、会话、管理员用户管理 |
| `br-library-service` | 书籍、章节、段落、划线、笔记、评论与点赞 |
| `br-event-stats` | 登录事件、阅读进度和阅读统计 |
| `br-ai-service` | 摘要、向量化和原文问答 |
| `br-reader-app` | Android 书架、阅读器、本地数据和用户交互 |
| `book-realm` | PRD、ADR、Feature、UI Rules、Harness 和平台级 BDD |

## 下一步

1. 为所有 `Partial` 项补齐对应 Feature 和缺失验收证据。
2. 优先解决身份可信性，再扩展统计与互动功能。
3. 完成设计令牌和组件库后，再批量重构 Android 页面。
4. `Proposed` 项进入开发前必须先接受相关 ADR，并拆成独立 Linear Issue。
