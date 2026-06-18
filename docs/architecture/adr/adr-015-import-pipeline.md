# ADR-015 书籍导入流水线

status: Proposed  
owner: Library

## Context
EPUB 与 TXT 的结构、编码和资源不同，解析逻辑若进入 UI 会难以测试和复用。

## Decision
导入采用 `detect -> validate -> parse -> normalize -> persist` 流水线，输出统一 Book/Chapter/Paragraph 模型。文件访问、解析器和持久化分别实现接口。

## Consequences
可独立测试格式和失败阶段；需要处理临时文件清理、资源限制和不可信输入。
