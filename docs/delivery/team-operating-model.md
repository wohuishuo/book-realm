# BookRealm 团队交付操作模型

> **结论先行**:BookRealm 用 Git 文档保存事实,用 Linear 管当前任务,用 GitHub PR 提交证据,用 Harness/CI 阻止低级错误;任何人或 Agent 都必须从同一条轨道接活和交付。

## 一、为什么需要这个模型

**我们已经有 PRD、ADR、Feature、Runbook 和 Harness,现在要让它们变成团队执行的门禁。**

没有这个模型时,文件只是资料;Agent 或成员仍会凭功能名自由发挥。当前阶段是 `R0 规格重构末期 → R1 Harness 前夜 → R2 安全样板任务`。

## 二、正本、任务和证据的边界

**每种工具只做一件事,避免复制出第二份真相。**

| 对象 | 责任 | 不做什么 |
| --- | --- | --- |
| PRD | 定义用户结果、范围和验收 | 不拆开发任务 |
| ADR | 记录长期技术决策 | 不写临时实现细节 |
| Feature | 把用户旅程写成可验收场景 | 不替代测试代码 |
| Runbook | 记录启动、联调和排障步骤 | 不承诺产品范围 |
| Harness/CI | 自动检查编译、测试、BDD 和质量门 | 不判断需求优先级 |
| Linear | 管谁做什么、当前状态和依赖 | 不当知识库 |
| GitHub PR | 提交代码改动和证据 | 不重新定义需求 |

## 三、角色与责任

**团队按责任分工,不是按“前端/后端”粗暴分工。**

| 角色 | 责任 |
| --- | --- |
| Product Owner | 排优先级,维护 PRD 和路线图 |
| Architect | 维护 ADR、接口边界和跨仓决策 |
| Implementer | 按 Issue 实现代码、迁移和测试 |
| Harness Owner | 把验收规则接入自动检查 |
| Reviewer | 检查 PRD、ADR、Feature、代码和证据是否一致 |

一个人或 Agent 可以承担多个角色,但一次任务里不能混淆责任。Implementer 不擅自扩大范围;Reviewer 不只看代码,也看验收证据。

## 四、Linear 使用规则

**Linear 是当前工作驾驶舱,每个 Issue 都必须能追溯回 Git 正本。**

| Linear 对象 | BookRealm 用法 |
| --- | --- |
| Initiative | BookRealm 产品化与作品集 |
| Project | 路线图阶段或战役,如 R1 Harness、R2 安全 |
| Cycle | 1–2 周执行窗口 |
| Issue | 一个 PR 内能验收的最小交付 |

Issue 拆分规则:

- 一个 Issue 优先只影响一个仓库;
- 跨仓能力拆成多个 Issue,用依赖关系串起来;
- Issue 不能用“实现某功能”命名,必须写清可观察结果;
- Linear 只摘最小上下文,长说明链接到 PRD、ADR、Feature、Runbook。

## 五、任务交付包模板

**每个 Issue 都必须带交付包,否则 Agent 和成员不能开工。**

```md
## Outcome
这次完成后,用户或系统得到什么可观察结果?

## Scope
允许修改哪些仓库、模块和接口?明确不做什么?

## Source of Truth
- PRD:
- ADR:
- Feature:
- API / UI Rule:
- Runbook:

## Acceptance
- [ ] 用户行为满足指定 Feature
- [ ] 错误边界满足
- [ ] 文档状态同步
- [ ] 必要测试补齐

## Required Verification
- [ ] 本仓 test/build:
- [ ] 平台 BDD/API:
- [ ] Android 真机或截图(如需要):
- [ ] CI 或日志证据:

## Forbidden
- 不改未授权仓库
- 不新建仓库
- 不跳过测试或降低验收标准
- 不用空待办、口头说明或截图替代可运行证据
```

## 六、Ready 和 Done 标准

**Ready 保护开发入口,Done 保护合并出口。**

Ready:

- PRD 的 Goal、Non-goals 和 Acceptance 可观察;
- 影响架构、安全、协议、数据或跨仓边界时已有 ADR;
- 核心行为已有 Feature 或明确 manual evidence;
- Issue 可在一个 PR 内完成,否则先拆分;
- 交付包写清 Scope、Forbidden 和 Required Verification。

Done:

- 代码、迁移、配置和文档完成;
- PRD 目标满足,ADR 未被违反;
- Feature 通过,或 manual evidence 已上传;
- 本仓 Harness/CI 通过,跨仓能力通过平台 BDD;
- PR 链接 Linear Issue、PRD、ADR、Feature 和验证证据;
- Linear 状态更新,必要时回写 PRD 实际状态。

## 七、Agent 执行协议

**Agent 不靠自由发挥接活,只按交付包执行并用证据收尾。**

开工前复述目标、正本、允许范围、禁止事项和验证命令;完成后汇报改动、Acceptance、命令输出、证据位置、风险与未完成项。发现正本矛盾时先停止并报告,不能自行选择一边实现。

## 八、跑偏诊断表

**团队跑偏时先定位哪道门失效,不要只归因于人或模型。**

| 现象 | 优先检查 |
| --- | --- |
| 做错功能 | PRD Outcome 或 Issue 标题是否不清 |
| 做错技术方案 | ADR 是否缺失、过期或未链接 |
| 写了代码但不能验收 | Feature 或 Acceptance 是否缺失 |
| 低级错误反复出现 | Harness/CI 是否没覆盖 |
| 改了不该改的仓 | Scope 和 Forbidden 是否不硬 |
| 多人互相踩 | Issue 是否太大、依赖是否未建 |
| 做完仍不知道完成没 | Evidence 和 Review 是否缺失 |

## 九、从当前阶段开始落地

**我们先用 R2 安全作为样板任务跑完整闭环,再推广到所有功能。**

第一条样板链路:

```text
ADR-011 统一 JWT 验证 → 安全 Feature:401/403/越权场景
  → Linear Project:R2 安全 → 多个单仓 Issue
  → 每仓测试与平台 BDD → PR 证据
  → ADR 状态从 Proposed 推进到 Implemented
```

这条链路跑通后,团队再进入 R3 产品完整性。否则继续加功能只会把半成品放大。
