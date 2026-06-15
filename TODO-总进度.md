> ⚠️ 本文件是镜像。**主文件在工作区根目录** `起点-安卓项目/TODO-总进度.md`,以那份为准。

# TODO-总进度(BookRealm 的唯一权威进度文件)

> **这个文件是什么**:BookRealm 的"存档点"。每完成一步就更新它。
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

BookRealm = 开源跨平台阅读平台 + 在线工程书。平台由用户中心、书库服务、Android 阅读 App、事件统计、AI 阅读助手组成;每个代码仓都能独立运行,平台书集中讲清需求、架构、技术栈和集成过程。

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
- [x] **GitHub Pages 已开启** ✅:平台书自动上线 `https://wohuishuo.github.io/book-realm/`
- [x] **P 阶段 P1–P8 全部写实** ✅ 2026-06-12(DeepSeek 码农会话完成,含两轮 RC 自修)
- [x] **P 阶段架构终审** ✅ 2026-06-12(Claude 架构会话):整体合格。三条裁决——①接口以 user-center 真实代码为准(`/api/user/*`,JWT 本地验签,无 validate 接口);②**App 不直连 RabbitMQ**,ReadingProgress 走 HTTP `POST /api/stats/progress`,MQ 仅用于后端服务间(UserLogin);③SimpleVectorStore 作 MVP 向量库予以批准(接口可换)。已修订 P5。
- [x] **MVP-1 书库服务** ✅ 2026-06-12:<https://github.com/wohuishuo/br-library-service>(公开)。6 测试绿、5 接口实测通过、61 段真实公版书种子、design.md 金字塔合格。架构终审通过(A-)。
- [x] **平台书实战篇建立** ✅ 2026-06-13:MVP-0 用户中心章 + MVP-1 书库章(嵌真实代码/讲透为什么/记真实坑,质量对标 user-center 书);确立章节质量标准(达不到不算完成)。教学集中平台书,MVP 仓只留 3 个轻文档——**"一仓一书"旧提法作废**
- [x] **门面修缮** ✅:br-library-service README 重写(徽章/定位图/文档区);平台书首页按读者中心重写(去黑话)
- [x] **一致性体检** ✅ 2026-06-13(Fable 架构会话):修复 6 处矛盾——MVP 地图星系树过期状态、咬合关系违反"App 不直连 MQ"裁决、P1-P8 状态未勾、"小书"旧措辞、CLAUDE.md 必读硬编码 P 阶段工单、首页 MVP-2 状态失实
- [x] **门面终检** ✅ 2026-06-13:三仓 README + 两本书首页全部去黑话、过"陌生人三问"、互链成网;两本在线书均 200 可访问;实战篇排版升级(全景图+阅读引导);三仓工作树干净。**生态当前状态:全部一致、无欠账**
- [x] **三个 MVP 仓骨架由架构会话代建** ✅ 2026-06-12(防 DS 翻车,出生即可编译):
  - [br-event-stats](https://github.com/wohuishuo/br-event-stats):SB3+amqp+jpa,8083,MQ fanout 拓扑 Bean 就绪;**验证:编译+启动+health ✅**
  - [br-ai-service](https://github.com/wohuishuo/br-ai-service):Spring AI(OpenAI 兼容→DeepSeek),8084,**无 key 可启动**,health 报告 llmKeyConfigured;**验证 ✅**
  - [br-reader-app](https://github.com/wohuishuo/br-reader-app):Compose+Hilt+Room+Retrofit 全配;**MVP-2 业务闭环 ✅ 2026-06-14**:登录用户中心、书城/详情/章节读书库、Room 书架、DataStore token/字号/进度;真机 APK 已安装启动。⚠️ 本地在 `C:\dev\br-reader-app`(AGP 不吃中文路径)
- [x] **用户中心接入事件源** ✅ 2026-06-13(Fable 架构会话,跨仓改 user-center):登录成功**异步发布 UserLogin 事件**到 fanout `user.events`(loginType/userId/loginTime/ip;失败只记日志不影响登录);9 测试仍全绿;契约与 br-event-stats 的 RabbitMQConfig 对齐。**MVP-3 联调时已有真实事件源,不再只靠测试生产者**。已 push user-center 仓
- [x] **MVP-2 阅读 App 业务开发** ✅ 2026-06-14(Fable 架构会话):真机联调完成;`assembleDebug` 通过;adb reverse 已打通 `8080→80`、`8082→8082`;APK 已安装并启动;README 已补运行说明。
- [x] **MVP-2 搜索空结果修复** ✅ 2026-06-14:原因是书库分页从 `page=0` 开始,App 误传 `page=1`;已改为 `page=0`,Android 重新构建通过并重新安装到真机。
- [x] **平台书 MVP-2 实战章终稿 + 技术图鉴第一版** ✅ 2026-06-14:阅读 App 章已补真实代码、链路、分页坑复盘;技术图鉴新增 Compose/Retrofit/Room/DataStore/Spring Boot/RabbitMQ/Spring AI/RAG/Docker+adb。
- [x] **书域 v1 需求与验收清单** ✅ 2026-06-14:明确 v1 只做登录、找书、阅读、统计、AI 辅助阅读;砍掉支付/社交/推荐/复杂大屏等扩展。
- [x] **MVP-3 事件统计服务** ✅ 2026-06-14:UserLogin 事件消费、登录日志、登录聚合、阅读进度上报、查询 API、4 测试、文档、真实联调均完成;用户中心真实登录后 `/api/stats/logins` 返回 `appLogins=1,total=1`。
- [x] **MVP-4 AI 服务** ✅ 2026-06-14:摘要、embed、ask 三接口完成;无 key 可启动并返回检索依据;`bookId=1` embed 得到 39 段;问"仙石是什么"命中第 12 段仙石原文;2 测试绿;README 和平台实战章已补。
- [x] **Android App 集成 MVP-3/MVP-4 代码** ✅ 2026-06-14:阅读器已接 `POST /api/stats/progress`;新增摘要/问答入口调用 MVP-4;`assembleDebug` 通过。⚠️ 真机安装未完成:用户吃饭期间手机离线,adb 返回 `no devices/emulators found`;回来后需重新插手机安装验证。
- [x] **书域 v1 真机终验** ✅ 2026-06-14:手机重新连接后已执行 adb reverse 8080/8082/8083/8084;新版 APK 安装并启动成功;AI 服务用 `deepseek-v4-flash` 和用户 key 跑通真实摘要与 RAG 问答(`llmUsed=true`);统计服务可查到阅读进度。提示:该 key 已出现在聊天记录中,演示后建议轮换。
- [x] **v2 需求收束** ✅ 2026-06-14:已把外观、朗读、推荐、PDF/EPUB、控制台、跨平台、小游戏等想法收束为 `docs/platform/v2-scope.md`;裁决为先做 v2.1 阅读体验,再做笔记、朗读、控制台、导入。
- [x] **v2 参考项目与 TTS 裁决** ✅ 2026-06-14:新增 `docs/platform/reference-projects.md` 和 `docs/platform/tts-service-plan.md`;参考 Legado/ReadAny/Hoshi Reader 的阅读体验、笔记、TTS、词典、竖排阅读、知识管理能力;TTS 定为独立 `br-tts-service`,Spring Boot 管任务/缓存/API,Python Qwen Worker 管推理。
- [x] **v2 UI 参考台账** ✅ 2026-06-15:本地 `C:\Users\艾莉\知识数据库\ui 参考` 已整理 61 张起点/微信读书截图;新增 `docs/platform/ui-reference.md`,只提交分析结论,不提交商业 App 截图。
- [x] **能力野心地图** ✅ 2026-06-15:新增 `docs/platform/ambition-map.md`;长期目标从“功能越多越好”收束成阅读体验、AI、导入、TTS、社区、推荐、商业、企业级工程 8 个能力层,以后全部按小 MVP 交付。
- [x] **br-design-book 终审** ✅ 2026-06-15:检查本地 `br-design-book`;裁决为“高价值设计草稿,暂不独立建仓公开”;已把技术栈、许可证、复用边界、下一步工单写入 `docs/platform/design-book-audit.md`。
- [x] **v2.1 第二轮阅读体验工单** ✅ 2026-06-15:已拆 `AppRoot.kt` 为 `ui/screen`、`ui/component`、`ui/reader`;新增 `Tokens`、`ReadStyle`、`StateBox`;书城/详情错误态支持重试;`assembleDebug` 通过并已安装启动到真机。
- [x] **v2.1 阅读手感修复** ✅ 2026-06-15:阅读页隐藏手机顶部通知栏;AI 提问改为右下角圆形入口,点击展开;Android 返回键改成“阅读→详情→书架,书架二次退出”;`assembleDebug` 通过并已安装启动到真机。
- [x] **v2.1 阅读器二次手感修复** ✅ 2026-06-15:顶部工具条增加状态栏/刘海避让;底部工具条改成轻量系统感工具带;AI 展开面板支持关闭按钮和返回键收起;修复打开书后底部 tab 不能切换;顶部标题按当前页显示,退出只在“我的”页出现,书架找书移动到顶部。
- [x] **v2.2 划线/笔记最小闭环** ✅ 2026-06-15:在 `br-library-service` 增加 `reading_marks`、保存/查询/删除接口和 1 个 MockMvc 测试;App 长按段落可划线、写笔记、问 AI;已划线段落高亮;后端 `mvn test` 7 绿,App `assembleDebug` 通过并安装到真机。注意:中文路径下 `mvn spring-boot:run` 类加载失败,当前用 `mvn package` + `java -jar target/br-library-service-0.1.0-SNAPSHOT.jar` 启动。
- [x] **v2.2 划线交互修正** ✅ 2026-06-15:长按段落不再弹底部大 sheet,改为蓝色选中态 + 黑色浮动工具条;修复旧登录态 userId=0 导致“已登录但不能划线”;修复搜书覆盖 Room `inShelf=false` 导致书架丢书;摘要会打开 AI 面板显示。
- [x] **v2.2 AI 临时窗口与范围选择** ✅ 2026-06-15:AI 问书改成类似微信读书的黑色临时全屏窗口;摘要不再插入正文;长按段落后可点另一段扩展为段落范围选择;复制会写入剪贴板并 Toast 提示。`assembleDebug` 通过。⚠️ 真机安装被手机拒绝权限确认,需用户允许后重装。
- [x] **v2.2 本地离线阅读** ✅ 2026-06-15:新增 Room `chapter_cache`;在线打开章节会写缓存;加入书架时预缓存前 8 章;网络失败时从本地章节缓存回退;`assembleDebug` 通过并已成功安装启动到真机。
- [x] **v2.x 设计系统地基** ✅ 2026-06-16:查阅 Material 3 / Compose 官方文档;新增 `ui/design` 单一真相来源(`BrTheme`,`BrColors`,`BrDimens`,`BrShapes`,`BrMotion`,`BrTopBar`,`BrNavBar`,`BrReaderTopSurface/BottomSurface`);AppRoot 顶栏/底栏和阅读器 chrome 已接入;旧 `ReaderTokens` 降级为兼容层;`assembleDebug` 通过。
- [ ] **v2.2 AI 引用跳转 + 笔记列表入口**:AI 回答引用段落后点击跳回原文段落;我的/详情页补笔记列表入口。复杂分页、字体导入、竖排阅读进入 Spike。

**工单队列(全部已写好,在 book-realm 仓):**
- [x] 工单-MVP1书库.md — 已执行完成 ✅
- [x] 工单-MVP2阅读App.md — 业务闭环完成 ✅;实战章待终稿
- [x] 工单-MVP3事件统计.md — 已执行完成 ✅
- [x] 工单-MVP4-AI服务.md — 已执行完成 ✅;DeepSeek key 可选,无 key 返回检索依据
- 【架构会话待办】各 MVP 的 Docker 化与平台级 compose;各 MVP 完成后的 RC 终审 + MVP 地图登记

**仓库创建原则**:不预建纯空仓;每个 MVP 仓出生时必须至少可编译、可启动或有明确骨架质量门。

### 📋 各 MVP 状态

| MVP | 仓库 | 代码 | 书 | RC |
| --- | --- | --- | --- | --- |
| 0 用户中心 | user-center-team-project | ✅ | ✅ | ✅ |
| 枢纽(平台书) | [book-realm](https://github.com/wohuishuo/book-realm) ✅ | — | ✅ P 阶段完成,实战篇持续更新 | 🔄 |
| 1 书库服务 | [br-library-service](https://github.com/wohuishuo/br-library-service) ✅ | ✅ 6 测试绿,5 接口实测 | ✅ 实战章已写 | ✅ |
| 2 阅读 App | [br-reader-app](https://github.com/wohuishuo/br-reader-app) ✅ | ✅ v1 集成并安装启动 | ✅ 实战章已补 | ✅ |
| 3 事件统计 | [br-event-stats](https://github.com/wohuishuo/br-event-stats) ✅ | ✅ 登录事件+阅读进度统计 | ✅ 实战章已补 | ✅ |
| 4 AI 服务 | [br-ai-service](https://github.com/wohuishuo/br-ai-service) ✅ | ✅ 摘要+embed+RAG问答 | ✅ 实战章已补 | ✅ |
| 5 书友匹配(可选) | 未定 | 暂不进入 v1 | 暂不进入 v1 | 暂不进入 v1 |

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
- RabbitMQ ✅ 已装(4.3.1 + Erlang 28;数据目录 `C:\rabbitmq-data`,`ERLANG_HOME`/`RABBITMQ_BASE` 已设用户环境变量;管理台 15672,guest/guest)
- **平台一键启动**:`book-realm/start-platform.ps1`(MySQL+Redis+MQ+用户中心+书库,健康检查+打印手机用局域网 IP;已实测 6/6 绿)
- Android:可编译(SDK/build-tools 齐),无模拟器,走真机方案(USB 调试)
- **MVP-4 需要**:用户设置环境变量 `DEEPSEEK_API_KEY`(唯一未就绪项,DS 做到 A1 前设好即可)

## 五、工作约定(不变量)

- 写作:金字塔(结论→根据→例子),写完查逻辑链;规范正本在平台书
- 节奏:每步"实现→真实验证→commit→push→写进书";每书必过 RC 才 v1.0
- 七成准备三成代码;砍单顺序:MVP5 → AI → 进度事件 → 书城搜索
- AI 出力,人验证守门

> **更新纪律**:每个工作小节结束,更新"进度看板"勾选与"下一步"列表——本文件过期=存档点失效。

