# br-design-book 架构终审

> **结论先行**:`br-design-book` 有价值,但不建议立刻独立建 GitHub 仓库。它更适合作为 BookRealm 的“设计知识库草稿”:先保留本地,把经过裁剪的结论并入 `book-realm` 平台书,再把可执行部分翻成 `br-reader-app` 工单。

## 一、它是什么

本地位置:

```text
C:\Users\艾莉\知识数据库\起点-安卓项目\br-design-book
```

它不是代码仓,当前没有 `.git`。它包含:

- `docs/00-导读.md`:说明这本设计书怎么读;
- `docs/01-能力对标地图.md`:微信读书、起点、Legado、Hoshi、ReadAny 的能力矩阵;
- `docs/02-阅读器设计.md`:阅读器交互、ReadStyle、底部面板、AI、TTS;
- `docs/03-页面地图与设计系统.md`:页面地图、组件库、导航结构;
- `research/`:参考项目和截图拆解底稿;
- `UI全景图.html` / `线框图.html`:可视化页面图;
- `工单-v2.2-笔记与AI.md`:给 Android App 的执行工单。

## 二、价值判断

**结论:它最大的价值不是“又一本书”,而是把零散参考材料变成可执行设计。**

没有它的痛点:

- 参考资料散在 GitHub、截图目录、平台书台账里,每次都要重新解释;
- DeepSeek 这类执行模型容易只看一张图就乱改 UI;
- v2.2 之后功能变多,没有页面地图和组件契约会继续变乱;
- “别人有的我们也要,别人没有的我们也有”如果不落到矩阵,会变成口号。

有它的价值:

- 给 App 开发提供页面地图;
- 给 UI 改造提供组件清单;
- 给 AI 编程助手提供上下文;
- 给 v2.2 笔记/AI 提供可执行工单;
- 给长期路线提供“跟/超/创”的能力矩阵。

## 三、主要问题

### 1. 公开表达风险

**结论:文档里“抄”“照搬”等词不适合公开仓库。**

这些词适合内部快速沟通,但公开时容易显得不尊重参考项目,也容易混淆“借鉴交互”与“复制实现”。平台书应统一改成:

| 原词 | 建议改法 |
| --- | --- |
| 抄微信 | 借鉴微信读书的交互范式 |
| 抄起点 | 参考起点的信息组织 |
| 照搬 legado | 学习 Legado 的实现思路,用 BookRealm 架构重写 |
| 复制/搬 | 复用设计结论,不复用代码 |

### 2. 许可证风险

**结论:不能直接复制参考项目代码。**

Hoshi Reader、ReadAny、Legado 系项目使用 GPL-3.0 系许可证。GPL-3.0 允许学习、研究、修改和分发,但如果把其代码纳入我们的 App 并分发,会带来对应的开源义务。BookRealm 当前策略应保持:

- 可以学习架构和交互;
- 可以引用项目链接;
- 可以写“我们学到什么”;
- 不复制源代码;
- 不复制图标、图片、品牌视觉;
- 不做像素级复刻商业 App。

参考:

- [Hoshi Reader Android LICENSE](https://raw.githubusercontent.com/Manhhao/Hoshi-Reader-Android/main/LICENSE)
- [ReadAny LICENSE](https://raw.githubusercontent.com/codedogQBY/ReadAny/main/LICENSE)
- [Legado LICENSE](https://raw.githubusercontent.com/refgd/legado/own/LICENSE)

### 3. 技术栈基本合理,但有几个要降级

**结论:大方向和我们兼容,但不能一次性上“自绘分页 + 字体导入 + 翻页动画 + 分块 AI”。**

合理:

- Kotlin + Jetpack Compose + Material 3;
- MVVM + StateFlow + UiState;
- Hilt + Retrofit + Room + DataStore + Coil;
- App 只走 HTTP API,不直连 MQ;
- AI 走 `br-ai-service`;
- TTS 走独立 `br-tts-service`;
- 不做盗版书源聚合。

需要降级:

| 设计书建议 | 终审裁决 |
| --- | --- |
| v2.2 就做自绘分页 | 暂缓。先把连续阅读和设置层做好,自绘分页单独开技术 Spike |
| 字体导入 ttf | 可做,但排在划线/笔记之后 |
| 翻页动画 | 先做滚动/覆盖两种,仿真翻页后置 |
| 阅读器代码仍在 AppRoot 单文件 | 必须在 v2.1 第二轮拆成 `screen/component` |
| `ReadStyle` 设计很完整 | 应落到 DataStore,替代当前零散 `fontScale` |
| AI 分块渲染 | 合理,但需要后端响应结构配合;先从 Citation 可点跳开始 |

### 4. 与现有平台书有重复

**结论:不要把整本 `br-design-book` 原样并入,否则平台书会膨胀和重复。**

已有平台书已经有:

- [能力野心地图](/platform/ambition-map);
- [v2 参考项目](/platform/reference-projects);
- [v2 UI 参考台账](/platform/ui-reference);
- [参考复用策略](/platform/reference-reuse-policy);
- [v2.1 阅读体验 MVP](/platform/v2-1-reader-experience)。

因此 `br-design-book` 应该并入的不是全部正文,而是三类内容:

1. **能力矩阵**:从 `docs/01` 提炼成平台书一页;
2. **阅读器设计**:从 `docs/02` 提炼成 v2.1/v2.2 工单;
3. **页面地图/组件库**:从 `docs/03` 提炼成 Android 代码拆分计划。

## 四、怎么利用

### 当前不建议

- 不建议立刻建独立 GitHub 仓库;
- 不建议把 `research/` 全部公开;
- 不建议让执行模型直接按 `工单-v2.2` 全量开干;
- 不建议把“抄/照搬”字样放到公开文档。

### 建议做法

1. 把 `br-design-book` 保留为本地知识库;
2. 在 `book-realm` 增加“设计书终审”记录,即本页;
3. 把 `docs/01` 提炼为公开版“能力对标矩阵”;
4. 把 `docs/02/03` 翻成 v2.1 第二轮工单;
5. 等 App 代码结构稳定后,再决定是否新建 `br-design-book` 仓库;
6. 如果公开,必须先做措辞清洗和许可证说明。

## 五、下一步工单建议

**结论:先别做 v2.2,先补 v2.1 第二轮。**

v2.1 第二轮应该做:

1. `AppRoot.kt` 拆分:
   - `screen/ShelfScreen.kt`;
   - `screen/StoreScreen.kt`;
   - `screen/BookDetailScreen.kt`;
   - `screen/ReaderScreen.kt`;
   - `component/BookCover.kt`;
   - `component/StateBox.kt`;
2. 建 `ui/theme/Tokens.kt`,统一深色、紫色、文字、圆角、间距;
3. 建 `ReadStyle`,用 DataStore 保存主题、字号、行距;
4. 所有数据页接入 `StateBox`:加载、空、错误可重试、正常;
5. 书城/详情错误页加“重试”按钮;
6. 我的页加阅读统计、导入、设置入口占位;
7. 平台书 `project/reader.md` 继续同步。

v2.1 第二轮完成后,再开 `br-design-book/工单-v2.2-笔记与AI.md`。

## 六、最终裁决

**结论:保留,但降权。**

`br-design-book` 不是新的权威仓,而是高价值研究草稿。权威仍然是:

1. `book-realm` 平台书;
2. `br-reader-app` 真实代码;
3. 每一轮小 MVP 工单。

执行模型可以读 `br-design-book`,但必须以本页裁决为准:学习设计结论,不用外部代码;先做 v2.1 第二轮,再进入 v2.2。
