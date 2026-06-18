# ADR-004 阅读进度独立建表

status: Accepted
owner: Stats

## Context
阅读进度需要按 userId、bookId、chapterId、position 保存并重复更新。

## Decision
阅读进度使用独立表,不放入用户表或书籍表;同一用户/书/章执行 upsert。

## Consequences
优点:数据职责清晰,支持多书和统计扩展。  
代价:打开书籍时需要额外查询进度。
