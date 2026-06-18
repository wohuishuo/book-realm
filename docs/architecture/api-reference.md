# 平台 API 参考(现状快照)

> **结论先行**:三个后端服务对外暴露 REST 接口,统一返回 `{code, data, message}`,`code=0` 为成功。本页照**真实代码**记录,与 P7 总图若有出入以本页和源码为准。

::: warning 鉴权现状
书库、统计和 AI 服务的用户数据接口必须统一验证 JWT,不能信任客户端传入的 `userId`。目标方案见 [ADR-011 统一 JWT 验证](/architecture/adr/adr-011-unified-jwt-validation)。本页"鉴权"列标注目标状态。
:::

## 一、通用约定

**结论**:所有接口同构,先记住三件事,后面只看差异。

- **响应体**:`BaseResponse<T> = { code:int, data:T, message:string }`;成功 `code=0`。
- **错误码**:`40000` 参数错误 / `40400` 数据不存在 / `50000` 系统异常(由 `GlobalExceptionHandler` 统一兜底)。
- **分页**:`page` 从 **0** 开始。

## 二、书库服务 :8082(context-path `/api`)

**结论**:公开读 + 个人写两类;读书不需登录,划线/段评需身份。

| 方法 | 路径 | 说明 | 鉴权(目标) |
| --- | --- | --- | --- |
| GET | `/books?q=&tag=&page=0&size=10` | 书籍列表(分页+搜索) | 公开 |
| GET | `/books/{id}` | 书籍详情 | 公开 |
| GET | `/books/{id}/chapters` | 章节目录 | 公开 |
| GET | `/chapters/{id}` | 章节详情(含段落) | 公开 |
| POST | `/marks` | 保存划线/笔记 | 需 token |
| GET | `/chapters/{chapterId}/marks?userId=` | 某章我的划线 | 需 token |
| GET | `/users/{userId}/marks` | 我的全部划线 | 需 token |
| DELETE | `/marks/{id}?userId=` | 删除划线 | 需 token(只能删自己的) |
| POST | `/comments` | 发布段评 | 需 token |
| GET | `/paragraphs/{id}/comments?userId=` | 某段段评 | 公开(登录则带"我是否点赞") |
| POST | `/comments/{id}/like` | 点赞段评 | 需 token |
| DELETE | `/comments/{id}/like?userId=` | 取消点赞 | 需 token |

> 整改后:上表所有 `?userId=` 参数删除,身份从 `Authorization: Bearer <jwt>` 解析。

## 三、统计服务 :8083(context-path `/api`)

**结论**:登录统计来自 MQ 事件,阅读进度由 App 走 HTTP 上报(**App 不直连 MQ**)。

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/stats/logins?from=&to=` | 登录统计(默认近 7 天) |
| POST | `/stats/progress` | 阅读进度上报(请求体 `ReadingProgressRequest`) |
| GET | `/stats/reading?from=&to=` | 阅读统计(默认近 7 天) |

`from/to` 为 ISO 日期(`yyyy-MM-dd`),缺省时 `to=今天`、`from=今天-6 天`。

## 四、AI 服务 :8084(context-path `/api`)

**结论**:摘要/索引/问答三接口;**无 `DEEPSEEK_API_KEY` 也能调**,自动降级为本地截断摘要或返回检索依据。

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| POST | `/ai/summary` | 章节摘要(体含 `chapterText`) |
| POST | `/ai/embed` | 为一本书建 RAG 索引(体含 `bookId`) |
| POST | `/ai/ask` | 基于原文问答(体含 `bookId/chapterId/question/selectedText`) |

> 索引为**单机内存态、关键词打分**(非真向量),重启即丢、不可多实例。属已知 MVP 占位,演进见架构文档。

## 五、健康检查

三个服务均有 `GET /api/health`(AI 服务额外报告 `llmKeyConfigured`)。用于 `start-platform.ps1` 的 6/6 绿检查。
