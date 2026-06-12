# 工单 · MVP-2 阅读 App(br-reader-app)

> 执行前读本仓 `CLAUDE.md`(含质量门)。本工单是平台第一次"咬合":App 登录走 MVP-0 用户中心,内容走 MVP-1 书库。规格以 `docs/platform/p5-domain.md`(BC-3)、`p6-dynamics.md`、`p7-architecture.md` 为准。**Android UI 一律 Jetpack Compose,不用 XML 布局。**

## 技术栈(锁定,不许换)

Kotlin · Jetpack Compose + Material 3 · MVVM(ViewModel + StateFlow + UiState 密封类)· Navigation Compose · Hilt · Retrofit + kotlinx-serialization · Room(本地缓存)· DataStore(存 JWT 与阅读偏好)· Coil(封面图)。最低 SDK 26,目标 SDK 35。

## 工单 R0:建仓 + 编译【授权建仓】

> **本机环境已由架构会话探明(2026-06-12)**:Android Studio✅ / SDK✅ / platform-tools(adb)✅ / build-tools 36✅ / platform android-36✅ → **可编译打包**;但**无 emulator、无 AVD、无系统镜像** → 暂时**没有可运行的设备**。因此本工单**以"能编译"为 DoD,不要求运行截图**;运行验证延后到设备就位(见下"设备说明")。

1. SDK 路径 `C:\Users\艾莉\AppData\Local\Android\Sdk`(`adb` 在其 `platform-tools\`)。不要尝试装 Android Studio / 模拟器(留给用户)。
2. 新建 **Empty Activity (Compose)** 工程,包名 `com.bookrealm.reader`,Kotlin DSL;`local.properties` 指向上面 SDK 路径;`gh repo create br-reader-app --public --source . --push`。
3. 加依赖(Compose BOM、Hilt、Navigation、Retrofit、Room、DataStore、Coil)。
**DoD**:`gradlew assembleDebug` 通过(产出 `app-debug.apk`);commit 推送。**不要求模拟器截图**——无设备,跑 R 系列其余工单时同样以"编译通过 + 单元测试"为准,UI 实跑截图等设备到位后由用户或架构会话补。

### 设备说明:**真机**(用户已选)

运行验证用真实安卓手机(USB 调试)。执行约定:
- 编码期每单 DoD 仍以 `gradlew assembleDebug` + 单元测试 + 每个 screen 配 `@Preview` 为准(不依赖手机也能推进);
- 需要真机时:`adb devices` 认到设备 → `adb install -r app\build\outputs\apk\debug\app-debug.apk` → 手机上实操;
- **真机访问后端不能用 10.0.2.2**(那是模拟器专用)。手机要连**电脑的局域网 IP**(同一 WiFi)。所以 R2 的 baseUrl 常量要**集中可配**:模拟器用 `10.0.2.2`,真机用 `http://<电脑局域网IP>:8080/api/` 与 `:8082`。把这两套地址写成注释好切换的常量,默认留真机占位 `http://192.168.x.x`,真实 IP 由用户填(用户跑 `ipconfig` 查)。
- 手机若连不上/没插,按卡住协议:UI 用 Preview 截图、逻辑靠单元测试,真机联调标 TODO 等用户在场时做,不要卡死。

## 工单 R1:骨架(分层 + 导航 + 主题)

建包结构:`ui/`(screen 与 component)、`viewmodel/`、`data/remote/`(Retrofit + DTO)、`data/local/`(Room + DataStore)、`data/repository/`、`di/`(Hilt Module)、`model/`、`navigation/`。
- `UiState<T>` 密封类:Loading / Success(data) / Error(msg);
- Navigation:底部三 Tab(书架 / 书城 / 我的)空页面可切换;
- Material 3 主题(配色可沿用书域紫 #6c63ff)。
**DoD**:三 Tab 可切换;`gradlew assembleDebug` 过;截图。

## 工单 R2:网络层 + 两个后端对接(咬合点)

1. **Retrofit 两套 baseUrl**:用户中心(默认 `http://10.0.2.2:8080/api/`,模拟器访问宿主机)、书库(`http://10.0.2.2:8082/api/`)。地址集中在一处常量,便于改。
2. **登录拦截器**:从 DataStore 取 JWT 加到 `Authorization: Bearer`(对接 MVP-0,接口 `POST /api/user/login` 返回 `{token,user}`,以 user-center 真实代码为准);
3. DTO 严格按两个服务的真实返回(`{code,data,message}` 解包)。
**DoD**:写一个临时调试调用,模拟器内能成功调到书库 `GET /api/books` 拿到种子书(后端三件套需先 `docker compose` 或本地起好;起不动则写 BLOCKED 跳过 UI 联调部分,先做纯 UI)。

## 工单 R3:登录 + 注册页

Compose 登录页(账号/密码)、注册页;调用用户中心;登录成功把 JWT 存 DataStore,跳书架;失败 toast"账号或密码错误"。用 `root/12345678`(用户中心演示账号)可登录。
**DoD**:模拟器实操登录成功跳转、JWT 已存、重启 App 仍登录;截图。

## 工单 R4:书架 + 书城(样板功能,写成全 App 范例)

- 书城:调书库 `GET /api/books`,LazyVerticalGrid 展示封面+书名(Coil 加载),点击进详情;搜索框走 `?q=`;
- 详情页:简介 + 章节目录 + "加入书架"按钮;
- 书架:Room 存收藏的书与阅读进度,网格展示;
- 全链路:UiState 驱动 Loading/Error/Success。
**DoD**:书城显示 2 本种子书封面,搜索"西游"命中,加入书架后重启仍在;截图。

## 工单 R5:阅读器(核心)

章节内容页:调 `GET /api/chapters/{id}`,段落 LazyColumn 渲染;**阅读进度记忆**(DataStore 或 Room 存 bookId+chapterId+段落位置,退出重进回到原位);字号调节(小/中/大)。
**DoD**:打开《西游记》第一回能读 13 段;翻到某段退出再进,回到该段;字号可调;截图。

## 工单 R6:进度上报 + 测试

1. 退出阅读器时 `POST /api/stats/progress` 上报 ReadingProgress(**走 HTTP,不直连 MQ**——架构裁决;统计服务 MVP-3 未建时,接口调用失败要静默不崩溃);
2. 测试:ViewModel 单元测试 2 条(用 fake repository 测 UiState 流转)+ Compose UI 测试 1 条(书城列表渲染)。
**DoD**:`gradlew testDebugUnitTest` 绿;进度上报失败不影响阅读。

## 工单 R7:小书(轻量,3 个 md)

`README.md`(怎么跑+模拟器访问宿主机说明 10.0.2.2)、`docs/design.md`(App 架构:分层/状态/导航/两后端对接,金字塔,≤120 行)、`docs/notes.md`(真实踩的坑,如模拟器网络、Compose 重组)。
**DoD**:过 CLAUDE.md 质量门三问;commit 推送。

## 完成后

更新 book-realm 仓 `TODO-总进度.md`(MVP-2 行)并推送;**停下等架构终审**。打包签名 APK、Docker 化、CI 留作后续工单。

## 给执行者的提醒

- **后端一键起**:在 book-realm 目录跑 `./start-platform.ps1`——自动起 MySQL/Redis/RabbitMQ/用户中心(Docker)/书库,并打印健康检查与**手机要用的局域网 IP**(已实测 6/6 通过)。Docker Desktop 没开先开它。起不动的部分写 BLOCKED 跳过联调、先做纯 UI,不要卡死;
- 模拟器访问宿主机用 `10.0.2.2` 不是 `localhost`;
- 每完成一单,汇报只贴 DoD 自查结果 + 各 md 的结论句;
- **无可运行设备**:UI 一律配 `@Preview`,用 Compose Preview 截图代替模拟器截图;逻辑靠单元测试保证。别为"跑模拟器"去装东西或卡死。
