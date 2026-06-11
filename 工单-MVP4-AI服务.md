# 工单 · MVP-4 AI 服务(br-ai-service)

> 执行前读本仓 `CLAUDE.md`(含质量门)。规格以 `docs/platform/p5-domain.md`(BC-5)、`p6-dynamics.md`(AI 问答流)、`p7-architecture.md` 为准。**这是全平台最出彩的功能:RAG 读书问答**——把书籍章节向量化,读者划词提问,AI 引用原文回答。

## 架构裁决(已定)

- 向量库用 **SimpleVectorStore**(Spring AI 内置内存实现,MVP 阶段零运维,接口 `VectorStore` 后续可换 PGVector);
- LLM 用 **DeepSeek**(OpenAI 兼容接口,Spring AI 的 openai starter 配 base-url 指向 DeepSeek);
- 章节文本来源:调 MVP-1 书库 `GET /api/chapters/{id}` 拿段落,或由 `/ai/embed` 传入。

## 工单 A0:建仓 + 骨架 + 接通 LLM【授权建仓】

Spring Boot 3.3 + Java 21,包 `com.bookrealm.ai`;依赖:web、validation、**spring-ai-openai-starter**(用 Spring AI BOM)、springdoc、lombok、test;`context-path:/api`,端口 8084。`gh repo create br-ai-service --public --source . --push`。
- API Key 走环境变量 `DEEPSEEK_API_KEY`,**绝不写进代码/提交**(无 key 时相关测试跳过,不阻塞编译);
- `application.yml` 配 OpenAI 兼容:base-url=DeepSeek 端点、model=deepseek-chat。
**DoD**:`/api/health` ok;Swagger 开;`mvn package` 通过;commit 推送(确认 `.env`/key 不在版本库)。

## 工单 A1:摘要接口(先跑通 LLM 链路)

`POST /api/ai/summary` 入 `{chapterText}` → 调 DeepSeek 返回 ≤100 字摘要,统一返回 `{code,data,message}`。
**DoD**:有 key 时 Swagger 实测返回摘要;无 key 时接口返回友好错误不崩。

## 工单 A2:向量化(RAG 的"建索引")

`POST /api/ai/embed` 入 `{bookId}`:从书库拉该书章节段落 → 切片 → 存入 SimpleVectorStore(元数据带 bookId、chapterId、段落序号)。
**DoD**:embed 一本种子书后,VectorStore 文档数 = 段落数;持久化到本地文件(SimpleVectorStore 支持 save/load),重启不丢。

## 工单 A3:RAG 问答(核心亮点)

`POST /api/ai/ask` 入 `{bookId, chapterId, question, selectedText?}`:
1. 向量检索:在该 book(可限 chapter)范围内检索 Top-3 相关段落;
2. 组 prompt:把检索到的段落作为上下文 + 用户问题;
3. 调 DeepSeek,返回**带原文引用**的回答(回答里标注引用了第几段)。
**DoD**:对种子书《西游记》提问"灵根指什么",返回的答案包含来自第一回的原文引用;无 key 时返回"检索到的段落"+ 提示未配置 LLM(证明 RAG 检索本身工作)。

## 工单 A4:测试

- 单元测试:向量检索能按 bookId 过滤、Top-K 返回;切片逻辑;
- 集成测试:embed → ask 闭环(LLM 部分用 mock 或在无 key 时只断言检索结果)。
**DoD**:`mvn test` 全绿(不依赖真实 LLM key)。

## 工单 A5:小书(3 个 md)

`README.md`(怎么跑 + 如何配 DEEPSEEK_API_KEY)、`docs/design.md`(RAG 设计:embed→检索→组 prompt→引用回答,为什么是平台最关键点,金字塔,≤120 行)、`docs/notes.md`(真实坑:Spring AI 配 DeepSeek、向量检索范围、prompt 调试)。
**DoD**:过质量门三问;commit 推送。

## 完成后

更新 book-realm 仓 TODO(MVP-4 行)并推送;**停下等架构终审**。App 端"划词问 AI"的 UI 集成属于 MVP-2 的后续工单,本期只做 AI 服务后端。

## 红线提醒

- ❌ API Key 绝不进版本库(检查 `.gitignore` 含 `.env`、`application-local.yml`);
- ❌ 无 key 不许编造"AI 返回了 XXX"——无 key 时如实返回错误或仅检索结果;
- 切向量库实现要走 `VectorStore` 接口,不写死 SimpleVectorStore 类型到业务代码。
