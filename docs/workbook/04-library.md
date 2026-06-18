# 04 书库、搜索与书架

找书旅程应从模糊需求开始，经过搜索、详情和加入书架，最终在重新打开应用后仍能找到该书。对应 [PRD-004](/product/prd/prd-004-book-catalog) 与 [PRD-005](/product/prd/prd-005-bookshelf)。

## 边界

Library Service 管理可阅读内容；Reader 展示目录和正文；个人书架属于用户与书的关系，不应复制整本书内容。

## 实现顺序

先稳定 Book、Chapter、Paragraph 数据模型和分页契约，再实现 Retrofit Repository，最后组合书城、详情和书架页面。列表必须处理加载、空、错误和分页结束。

## 完成证据

搜索结果可打开详情；章节顺序稳定；加入书架后重启仍存在；书架搜索只搜索已加入书籍。
