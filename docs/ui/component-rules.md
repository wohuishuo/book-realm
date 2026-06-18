# Component Rules

## Tokens

- 颜色、间距、字号、形状和动效从 `ui/design` 单一来源读取。
- 页面不得直接复制设计令牌数值。

## Components

- 按钮使用 `BrButton` 或设计系统等价组件。
- 输入使用 `BrTextField`、`SearchField`。
- 页面状态使用 `StateBox`。
- 顶部和底部导航使用 `BrTopBar`、`BrNavBar`。
- 阅读器工具面使用 `BrReaderTopSurface`、`BrReaderBottomSurface`。
- 段落操作使用 `BrActionDock`。

## Required States

每个数据组件至少定义 Loading、Content、Empty、Error。可操作组件还需要 Disabled 和 Processing 状态。

## Preview And Test

- 可复用 Compose 组件提供代表性 Preview。
- 核心交互元素提供稳定 `testTag`。
- 组件改动必须验证常规屏幕和窄屏布局。

