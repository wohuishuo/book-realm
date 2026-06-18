# PRD-001 项目规格重构

status: Active  
owner: Product Engineering

## Why
项目需要一套可直接指导开发、测试和求职展示的规格体系。

## Problem
旧文档把模块、MVP、版本、研究过程和当前计划混在一起,入口过多。

## Goal
建立 PRD、ADR、Feature、UI Rules、Harness 和 Linear 六类正本。

## Journey
提出需求 -> 查 PRD -> 查 ADR/UI Rules -> 创建 Issue -> 实现 -> 自动验收

## Non-goals
不重写已经正常运行的业务代码。不删除历史材料。

## Acceptance
- 旧材料集中到 `docs/archive/legacy/`。
- 已实现功能都有独立 PRD。
- 主导航不展示过程性研究和旧计划。

