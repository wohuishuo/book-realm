# ADR-016 UI Token 与组件强制使用

status: Accepted  
owner: Reader UI

## Context
AI 生成页面容易产生随机颜色、间距、栏高和重复组件，导致同一产品缺少一致性。

## Decision
产品 UI 只能使用设计系统 token 和批准组件；禁止行内样式、裸颜色值、任意 dp/sp 与页面私有按钮实现。新视觉需求先扩展 token 或模式库并预览，再用于页面。

## Consequences
Agent 可像搭积木一样稳定实现页面，Review 可机器检查；初期需要整理旧代码并维护组件预览。
