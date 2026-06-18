# Skill: ADR

## 何时使用

当决策会长期影响多个模块、数据结构、接口、安全、部署或团队边界时使用。局部变量名、普通组件选择和可逆实现不写 ADR。

## 步骤

1. 查重并链接相关 PRD。
2. 在 Context 只写约束和冲突，不写经历或弯路。
3. 在 Decision 写一个明确选择及适用边界。
4. 在 Consequences 同时写收益、代价和迁移影响。
5. 未决定用 Proposed；团队采用后改 Accepted；被替代用 Superseded 并链接新 ADR。

## 输出检查

每个 ADR 必须有 `status`、`owner`、Context、Decision、Consequences，且能指导后续代码评审。
