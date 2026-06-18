# PRD-020 本地书籍导入

status: Proposed  
owner: Library + Reader

## Why
用户需要在统一阅读器中阅读自己拥有的内容。

## Problem
平台目前只支持服务端预置书籍。

## Goal
用户可导入 EPUB 或 TXT，看到书名、目录和正文，并加入个人书架。

## Journey
选择文件 -> 解析书籍 -> 确认信息 -> 加入书架 -> 打开阅读

## Non-goals
首版不支持 DRM、PDF 重排和云端公开分享。

## Acceptance
- 不支持或损坏的文件给出明确错误。
- 导入后目录顺序和正文可离线读取。
- 删除导入书籍时一并清理本地缓存。
