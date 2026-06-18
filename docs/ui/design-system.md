# Android Design System

设计基准以本地 `ui 参考/微信读书` 为主：书架、阅读器、文字选择、阅读设置和底部导航遵循微信读书；微信读书没有覆盖的 AI 对话、复杂目录与听书入口才参考 `ui 参考/起点`。参考图用于模式判断，不逐像素复制品牌资产。

## Token

| 类别 | Token | 值 | 用途 |
| --- | --- | --- | --- |
| 色彩 | `color.background` | `#F7F7F5` | 浅色应用背景 |
| 色彩 | `color.surface` | `#FFFFFF` | 面板、工具栏 |
| 色彩 | `color.text.primary` | `#1F2329` | 标题与正文 |
| 色彩 | `color.text.secondary` | `#7A7F87` | 辅助信息 |
| 色彩 | `color.brand` | `#2F7CF6` | 主按钮、选中状态、链接 |
| 色彩 | `color.danger` | `#D84A4A` | 破坏性操作 |
| 色彩 | `color.reader.paper` | `#F5F0E6` | 暖色阅读主题 |
| 色彩 | `color.reader.night` | `#17191C` | 夜间阅读背景 |
| 间距 | `space.1/2/3/4/6/8` | `4/8/12/16/24/32dp` | 只允许该序列 |
| 圆角 | `radius.s/m/l` | `4/8/12dp` | 控件、面板；普通卡片不超过 8dp |
| 尺寸 | `topBar.height` | `56dp` | 所有普通顶部栏 |
| 尺寸 | `bottomNav.height` | `64dp + system inset` | 主导航 |
| 尺寸 | `readerToolbar.height` | `56dp + system inset` | 阅读底栏 |
| 尺寸 | `touch.min` | `48dp` | 所有可点击目标 |
| 尺寸 | `content.maxWidth` | `720dp` | 平板阅读正文上限 |

不得新增 `17dp`、`19sp` 等页面私有值。现有 token 无法表达需求时，先在设计系统评审新增 token。

## Typography

| 样式 | 字号/行高 | 字重 | 用途 |
| --- | --- | --- | --- |
| `display` | `28/36sp` | 700 | 仅书名或主页面标题 |
| `title` | `20/28sp` | 600 | 页面标题 |
| `section` | `17/24sp` | 600 | 分区标题 |
| `body` | `16/24sp` | 400 | 普通正文 |
| `label` | `14/20sp` | 500 | 控件、列表辅助信息 |
| `caption` | `12/16sp` | 400 | 时间、状态说明 |

阅读正文独立使用 `reader.fontSize`（默认 `18sp`）、`reader.lineHeight`（默认 `1.7`）和用户设置。界面字体不得跟随正文缩放。字距固定为 `0`。

## Components

### PrimaryButton

- 每页最多一个；高度 `48dp`，水平内边距 `20dp`，圆角 `8dp`。
- 必须提供 enabled、pressed、loading、disabled 状态。
- 破坏性确认使用 DangerButton，不把红色当主品牌色。

```kotlin
BrPrimaryButton(
    text = "加入书架",
    loading = state.isSaving,
    enabled = state.canSave,
    onClick = onAddToShelf,
)
```

### TopAppBar

- 高度固定 `56dp`，左侧最多一个返回/关闭动作，右侧最多三个图标动作。
- 标题单行省略，不因加载、徽标或长书名改变高度。
- 图标按钮 `48dp` 触控区，图标 `24dp`。

### BottomNavigation

- 仅承载 3–5 个一级目的地；高度固定，不因文字换行。
- 图标 `24dp`，标签 `12sp`；选中态使用 brand 色，未选中使用 secondary。

### ReaderToolbar

- 默认隐藏，点击正文中央显示；滚动或再次点击中央隐藏。
- 顶部和底部工具栏均固定 `56dp`，不挤压正文导致阅读位置跳动。
- 设置、目录、听书、进度用图标和短标签，不创建大卡片。

### BottomSheet

- 设置、目录、字体、主题从底部出现；圆角只在顶部 `12dp`。
- 高度由明确的 collapsed/expanded 状态决定，不按内容随机变化。
- 设置项使用 segmented control、slider、swatch 或 toggle，不用文字胶囊模拟控件。

## States

每个异步页面必须实现 Loading、Content、Empty、Error、Offline。Loading 使用稳定占位尺寸；Error 保留页面上下文并提供一个重试动作；Empty 说明状态并给一个最相关动作。

## Enforcement

- Compose 页面只引用 `BrTheme`、`BrDimens`、`BrTypography` 和 `Br*` 组件。
- 禁止 `Modifier.background(Color(...))`、十六进制裸颜色、页面内 `ButtonDefaults`、任意 `dp/sp` 和重复实现 TopBar/Button。
- Detekt 自定义规则或代码搜索在 CI 拦截裸颜色与行内样式。
- 新组件必须在 Compose Preview 展示浅色、深色、禁用、加载和长中文文本。
