# TODO-总进度(超级项目「书域」的唯一权威进度文件)

> **这个文件是什么**:整个超级项目的"存档点"。每完成一步就更新它。
> **如果对话历史丢了**:开新对话,让 AI 依次读这三个文件,即可完整恢复上下文继续干活:
> 1. 本文件(进度与下一步)
> 2. 《行动计划-电子书App重构与写书.md》(完整蓝图)
> 3. 《方法论-从用户中心项目提炼.md》(工作哲学)
>
> 一句话喂给 AI:**"读 C:\Users\艾莉\知识数据库\起点-安卓项目 下的 TODO-总进度、行动计划、方法论三个 md,按进度继续推进超级项目。"**
>
> **双模型分工(2026-06-11 起生效)**:
> - **码农会话(DeepSeek 等)**:开在 `book-realm` 仓目录,喂这句:**"读本仓 CLAUDE.md 和 工单-P阶段.md,从第一个未完成工单开始执行。"** 它只许按工单干活,红线与卡住协议都在 CLAUDE.md 里;
> - **架构会话(Claude)**:负责标了【架构会话】的事——P5 BC 终审、P7 架构终审、P 阶段 RC、建 MVP 仓。码农干完 P1–P8 后**必须停下等架构终审**。

---

## 一、项目一句话

超级项目「书域」= 5 个互相咬合的完整 MVP(电子书平台)+ 每 MVP 一本书,星系结构(1 枢纽仓 + N 个 MVP 仓),方法照搬已成功的用户中心项目。

## 二、进度看板

### ✅ 已完成

- [x] **前置项目「用户中心」全部完成**(可直接复用为 MVP-0):
  - 仓库 <https://github.com/wohuishuo/user-center-team-project>(公开)
  - 网页书在线:<https://wohuishuo.github.io/user-center-team-project/>
  - 全栈实现 + 9 测试 + CI + `docker compose up` 实跑验证 ✅
  - 演示账号:root / 12345678(管理员)、demo / 12345678
- [x] 方法论提炼 →《方法论-从用户中心项目提炼.md》
- [x] 行动计划 v2(多 MVP 星系结构版)→《行动计划-电子书App重构与写书.md》
- [x] RC 重读流程 →《书的重读整理清单.md》
- [x] 官方要求研读:《结课设计说明》《专业训练课题》(在 Spring 课件目录)
- [x] 参考项目评估:鱼皮四项目 → 各 MVP 的思路来源(见行动计划 一·五)

### 🔜 下一步(按顺序执行,做完打勾并更新本文件)

- [x] **建枢纽仓 book-realm** ✅ 2026-06-11:<https://github.com/wohuishuo/book-realm>(公开),本地 `起点-安卓项目\book-realm`
- [x] 搬书骨架 ✅:平台书可构建(开始篇 4 页 + P1–P8 占位 + MVP 地图);方法论/RC清单/行动计划已入仓
- [ ] **(需手动)** GitHub 仓库 Settings → Pages 把 Source 设为 GitHub Actions → 平台书自动上线 `https://wohuishuo.github.io/book-realm/`
- [x] **P 阶段 P1–P8 全部写实** ✅ 2026-06-12(DeepSeek 码农会话完成,含两轮 RC 自修)
- [x] **P 阶段架构终审** ✅ 2026-06-12(Claude 架构会话):整体合格。三条裁决——①接口以 user-center 真实代码为准(`/api/user/*`,JWT 本地验签,无 validate 接口);②**App 不直连 RabbitMQ**,ReadingProgress 走 HTTP `POST /api/stats/progress`,MQ 仅用于后端服务间(UserLogin);③SimpleVectorStore 作 MVP 向量库予以批准(接口可换)。已修订 P5。
- [ ] **建 MVP 仓**(第 2 周):br-library-service(书库,JPA+种子数据)→ br-reader-app(Compose 骨架);按行动计划第三节推进
- [ ] 各 MVP 重复"工单→执行→终审"模式:架构会话出工单,码农会话执行

### 📋 各 MVP 状态

| MVP | 仓库 | 代码 | 书 | RC |
| --- | --- | --- | --- | --- |
| 0 用户中心 | user-center-team-project | ✅ | ✅ | ✅ |
| 枢纽(平台书) | [book-realm](https://github.com/wohuishuo/book-realm) ✅ | — | 🔄 P1-P8 写实,待架构终审 | ⬜ |
| 1 书库服务 | [br-library-service](https://github.com/wohuishuo/br-library-service) ✅ | 🔄 L0 建仓完成 | ⬜ | ⬜ |
| 2 阅读 App | br-reader-app(未建) | ⬜ | ⬜ | ⬜ |
| 3 事件统计 | br-event-stats(未建) | ⬜ | ⬜ | ⬜ |
| 4 AI 服务 | br-ai-service(未建) | ⬜ | ⬜ | ⬜ |
| 5 书友匹配(可选) | 未定 | ⬜ | ⬜ | ⬜ |

## 三、资源地图(所有东西在哪)

| 资源 | 位置 |
| --- | --- |
| 本计划三件套 | `C:\Users\艾莉\知识数据库\起点-安卓项目\`(TODO/行动计划/方法论/RC清单) |
| Android 课件 + 旧电子书代码 | 同目录 `android 课件\`、`android 项目\MyApplication`(Room 实体可迁移) |
| Spring 课件 + **结课设计说明/训练课题** | `C:\Users\艾莉\知识数据库\java 到 spring boot 详细全面课件\` |
| 参考项目(鱼皮四件套) | `C:\Users\艾莉\知识数据库\多个项目知识库\`(云图库→MVP1 / 智能BI→MVP3 / AI智能体→MVP4 / 伙伴匹配→MVP5) |
| 可复用书骨架与一切资产 | user-center 仓库(资产清单见《方法论》第四节) |
| GitHub 账号 | wohuishuo(gh CLI 已登录) |

## 四、环境备忘(踩坑速查)

- 本机:Java 21 / Maven / Node 24 / Docker Desktop ✅;MySQL+Redis 经 scoop 装(MySQL 数据目录在 `C:\mysql-data`,因中文用户名路径问题,详见 user-center 仓 `DEV-SETUP.md`)
- npm 遇 EPERM:加 `--cache C:\temp\npmcache`
- docker pull 偶发 EOF:重试同一命令即可
- 待装:Android Studio、`scoop install rabbitmq`

## 五、工作约定(不变量)

- 写作:金字塔(结论→根据→例子),写完查逻辑链;规范正本在平台书
- 节奏:每步"实现→真实验证→commit→push→写进书";每书必过 RC 才 v1.0
- 七成准备三成代码;砍单顺序:MVP5 → AI → 进度事件 → 书城搜索
- AI 出力,人验证守门

> **更新纪律**:每个工作小节结束,更新"进度看板"勾选与"下一步"列表——本文件过期=存档点失效。

