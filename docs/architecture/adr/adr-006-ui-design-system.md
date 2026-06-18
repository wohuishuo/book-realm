# ADR-006 UI 使用统一设计系统

status: Accepted
owner: Reader UI

## Context
阅读器、书架、书城和个人页出现了重复颜色、尺寸和组件实现。

## Decision
Android UI 统一使用设计令牌和 `Br*` 组件;页面不得自行复制基础按钮、输入框和导航栏。

## Consequences
优点:视觉和状态一致,修改可以集中生效。  
代价:新增视觉模式需要先扩展设计系统。
