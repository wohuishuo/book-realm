# Claude Code Design 契约

Claude 可以探索布局和交互，但不能建立第二套设计系统。原型必须读取 `design-system/tokens.json` 或生成的 `br-tokens.css`。

## 输入顺序

1. 提供对应模块的 PRD 与 Feature。
2. 提供微信读书参考图；只有微信读书缺失的能力才提供起点图。
3. 提供本契约、UI Rules 和令牌文件。
4. 一次只设计一个模块，不一次生成整个 App。

## 强制约束

- 禁止行内样式、裸十六进制颜色和页面私有尺寸。
- 页面只能使用 `--br-*` 令牌和已批准组件。
- 顶部栏 `56px`，主底部导航 `64px + safe-area`，阅读工具栏 `56px + safe-area`。
- 触控目标不得小于 `48px`；图标默认 `24px`。
- 每页最多一个主按钮；阅读页不显示主底部导航。
- 必须设计 Loading、Content、Empty、Error、Offline，以及 disabled/selected/pressed 状态。
- Web 原型不能依赖 hover 才能完成核心操作。
- 不复制微信读书或起点的品牌标识、插画和商业内容。

## 交付格式

每个模块交付：页面清单、组件清单、状态矩阵、交互说明、移动端截图和令牌使用清单。原型验收后，再映射为 Compose `Br*` 组件。

## 推荐提示词

```text
为 Book Realm 设计【模块名】交互原型。
以所附微信读书截图为主要模式参考；仅在该截图未覆盖能力时参考起点。
严格读取 design-system/tokens.json，不新增颜色、字号、间距、圆角或栏高。
页面只能由批准的 Br* 组件组成，禁止 inline style。
覆盖 Loading、Content、Empty、Error、Offline 和长中文文本。
输出组件树、状态矩阵、交互路径和 360x800 / 412x915 两种移动视口截图。
所有结构必须可以直接映射到 Jetpack Compose，不以 hover 为核心交互。
```
