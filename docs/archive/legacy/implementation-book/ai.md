# MVP-4 AI 服务

> **结论先行**:AI 服务不是让模型凭空聊天,而是先从书中检索原文,再基于原文摘要和问答。回答必须回到文本现场,否则它对阅读没有帮助。

仓库:[br-ai-service](https://github.com/wohuishuo/br-ai-service)。本章代码片段来自真实工程。

## 一、它在平台里干什么

**结论:AI 服务依赖书库,服务阅读 App。**

```
MVP-1 书库服务
  └─ 书 / 章 / 段
        ▼
MVP-4 AI 服务
  ├─ embed:建立段落索引
  ├─ summary:章节摘要
  └─ ask:检索原文后问答
        ▼
MVP-2 阅读 App(后续接入)
```

MVP-1 当初把正文拆成 Paragraph,就是为了这里能按段落检索和引用。

## 二、为什么要 RAG

**结论:先检索,再生成。** 直接把问题丢给模型,它可能回答得像百科,但不一定来自当前这本书。

RAG 链路:

```
用户问题
  → 检索 Top-3 相关段落
  → 把问题 + 段落交给模型
  → 回答里带原文引用
```

无 `DEEPSEEK_API_KEY` 时,服务仍返回检索到的原文引用,不编造模型回答。

## 三、接口长什么样

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| POST | `/api/ai/summary` | 章节摘要 |
| POST | `/api/ai/embed` | 为一本书建立索引 |
| POST | `/api/ai/ask` | 基于原文问答 |

示例:

```json
{
  "bookId": 1,
  "question": "仙石是什么"
}
```

实测无 key 返回第一引用:

> 第 12 段:那座山正当顶上,有一块仙石...

## 四、书库客户端

**结论:AI 服务不存书,它从 MVP-1 拉章节和段落。**

```java
public BookDetailDto bookDetail(Long bookId) {
    String json = restClient.get().uri("/books/{id}", bookId).retrieve().body(String.class);
    JavaType type = objectMapper.getTypeFactory()
        .constructParametricType(BaseResponse.class, BookDetailDto.class);
    return readData(json, type);
}
```

这样书籍内容仍只有一个权威来源:书库服务。

## 五、轻量 RAG 索引

**结论:本 MVP 先用可替换的轻量文本检索,不假装已经接入真 embedding。**

DeepSeek 当前不提供稳定 embedding 接口。为了让 v1 能跑通,RAG 服务先按段落建立内存索引,用连续词和字符重叠做 Top-K 检索。

```java
public EmbedResponse embedBook(Long bookId) {
    BookDetailDto book = libraryClient.bookDetail(bookId);
    List<ParagraphDocument> docs = new ArrayList<>();
    for (var chapter : book.chapters()) {
        ChapterDetailDto detail = libraryClient.chapterDetail(chapter.id());
        detail.paragraphs().forEach(paragraph -> docs.add(new ParagraphDocument(
            bookId, detail.id(), paragraph.seq(), normalize(paragraph.content())
        )));
    }
    index.put(bookId, docs);
    return new EmbedResponse(bookId, docs.size());
}
```

后续要换真向量库,可以替换 `RagService` 内部实现,外部 API 不变。

## 六、真实踩坑:中文检索不能只数单字

**结论:连续词命中要比零散单字命中更重要。**

第一次问"仙石是什么"时,某个含"什么"的段落排在含"仙石"的段落前面。原因是轻量评分只看字符重叠,没有重视连续词。

修复:给连续二字命中更高权重。修复后第一引用命中:

```text
那座山正当顶上,有一块仙石。其石有三丈六尺五寸高...
```

这就是为什么 AI/RAG 不能只看"接口通了":检索质量直接决定回答质量。

## 七、真实验证

- `mvn test`:2 条测试全绿;
- `GET /api/health`:返回 `llmKeyConfigured=false`;
- `POST /api/ai/summary`:无 key 返回本地摘要;
- `POST /api/ai/embed {"bookId":1}`:返回 `documentCount=39`;
- `POST /api/ai/ask {"bookId":1,"question":"仙石是什么"}`:返回仙石原文引用。

## 八、本章的真实代码

| 内容 | 文件 |
| --- | --- |
| AI 接口 | [AiController.java](https://github.com/wohuishuo/br-ai-service/blob/main/src/main/java/com/bookrealm/ai/controller/AiController.java) |
| RAG 服务 | [RagService.java](https://github.com/wohuishuo/br-ai-service/blob/main/src/main/java/com/bookrealm/ai/service/RagService.java) |
| 书库客户端 | [LibraryClient.java](https://github.com/wohuishuo/br-ai-service/blob/main/src/main/java/com/bookrealm/ai/service/LibraryClient.java) |
| DeepSeek 客户端 | [DeepSeekClient.java](https://github.com/wohuishuo/br-ai-service/blob/main/src/main/java/com/bookrealm/ai/service/DeepSeekClient.java) |
| DTO | [AiDtos.java](https://github.com/wohuishuo/br-ai-service/blob/main/src/main/java/com/bookrealm/ai/dto/AiDtos.java) |
| 测试 | [AiControllerTest.java](https://github.com/wohuishuo/br-ai-service/blob/main/src/test/java/com/bookrealm/ai/AiControllerTest.java) |

## 本章小结

- **结论**:AI 服务的价值是基于原文帮助阅读,不是泛聊;
- **根据**:先检索段落,再调用模型;无 key 时也返回真实引用;
- **例子**:"仙石是什么"命中《西游记》第一回第 12 段。

## 下一步

MVP-4 后端已能跑。下一步回到 [MVP-2 阅读 App](/project/reader),把阅读进度上报、摘要、问答入口接进手机端,形成书域 v1 的完整应用。
