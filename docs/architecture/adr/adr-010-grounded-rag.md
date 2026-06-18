# ADR-010 AI 回答基于原文检索

status: Accepted
owner: AI

## Context
通用模型可能生成与当前书籍无关或无法核查的答案。

## Decision
AI 问答先检索书籍段落,再把问题和引用原文交给模型;回答返回引用依据。

## Consequences
优点:答案可核查,与阅读场景相关。  
代价:需要维护索引、检索质量和引用定位。
