# 测试策略与覆盖缺口

> **结论先行**:现有 7 个测试覆盖了"功能跑得通",但**零安全边界、零越权负向测试**——这正是 [ADR-001](/architecture/adr/adr-001-unified-auth) 鉴权缺陷至今潜伏的原因。补测第一优先级不是提覆盖率数字,而是给鉴权装上红线网。

## 一、现有覆盖盘点

**结论**:三服务测试全是 happy-path,危险的空白集中在安全与核心算法。

| 服务 | 现有测试 | 覆盖 | 性质 |
| --- | --- | --- | --- |
| library | Book/ReadingMark/BookRepository 三测 | 列表、详情、划线 CRUD、段评点赞流 | 全 happy-path |
| stats | StatsController/StatsService | 登录聚合、进度 upsert | happy-path + 1 upsert |
| ai | AiController | **仅无-key 降级路径** | 单路径 |

**三个最危险的空白**(从现有测试直接读得出):

1. **越权零测试**:`ReadingMarkControllerTest` 删划线用的是 owner 自己的 `userId`,从没测"换个 userId 删别人的会不会被拒"。当前代码不会拒,所以即便测了也是假绿——缺陷和测试一起漏。
2. **RAG 打分 `score()` 零单测**:检索排序的心脏,纯函数最该单测,却只被一个集成用例间接覆盖。
3. **AI 仅测无-key 分支**:有-key 路径、空检索、`chapterId` 过滤全没测。

## 二、测试金字塔目标

**结论**:MVP 不追覆盖率百分比,追"每条业务关键路径 + 每条安全边界各有一个测试"。

```
        E2E(真机+全栈)        保留手动 adb,不强求自动化
       Integration(MockMvc)    ← 主战场:HTTP 层 + 鉴权边界
      Unit(纯逻辑)             ← 补 score()/聚合/降级判定
```

## 三、补测计划(按优先级)

### P0 — 安全边界(与 ADR-001 同一工单交付)

**结论**:"加过滤器"和"证明过滤器挡住越权"必须同生,否则又是无网作业。

| 用例 | 类型 | 期望(整改后) |
| --- | --- | --- |
| 无 token 调 `POST /marks` | Integration | 401 |
| 持 user=2 token 删 user=3 的 mark | Integration | 403,且 mark 仍在 |
| 持 user=2 token 调 `GET /users/3/marks` | Integration | 403 或只返回自己的 |
| 过期/篡改 token | Integration | 401 |
| 公开读 `GET /books` 无 token | Integration | 200(白名单放行) |

```java
@Test
void deleteOthersMark_shouldBeForbidden() throws Exception {
    Long markId = createMarkOwnedBy(3L);
    mockMvc.perform(delete("/marks/" + markId)
            .header("Authorization", bearerFor(2L)))   // 冒充别人
        .andExpect(status().isForbidden());
    assertTrue(markRepository.existsById(markId));      // 没被删掉
}
```

### P1 — RAG 检索正确性(纯单测,便宜高价值)

| 用例 | 类型 | 断言 |
| --- | --- | --- |
| `score()`:精确包含 query | Unit | 分数 > 仅单字命中 |
| `search()`:`chapterId` 过滤 | Unit | 只返回该章段落 |
| `ask()`:检索为空 | Integration | `hasReference=false`,不调 LLM |
| 有-key 路径(mock `DeepSeekClient.chat`) | Integration | `llmUsed=true`,prompt 含引用段 |

### P2 — 数据完整性与幂等(支撑技术债 #6)

| 用例 | 类型 | 断言 |
| --- | --- | --- |
| 同一 (user,book,chapter) 重复上报进度 | Integration | 仍 1 行(已部分覆盖✅) |
| 点赞幂等:同 user 连点两次 like | Integration | `likeCount` 不重复+1 |

> 点赞重复这条现在很可能假绿或暴露 bug,值得立刻补。

### P3 — 契约测试(服务间)

**结论**:AI 通过 `LibraryClient` 调书库,现用 `@MockBean` 假数据,没有任何测试保证 mock 形状与书库真实响应一致。建议加轻量契约测试:用书库真实 DTO 的 JSON 样本反序列化进 AI 的 DTO,防两端漂移。

## 四、明确不测

BaseResponse/ErrorCode 等 getter、框架代码、`DataSeeder` 种子、AI 真实 LLM 输出内容(不可断言,只测"是否调用 + prompt 结构")。

## 五、落地建议

**结论**:P0 安全测试塞进 ADR-001 同一工单;P1 的 `score()` 单测独立成小工单,性价比最高、码农会话可独立完成。
