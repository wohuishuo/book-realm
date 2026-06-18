# ADR-014 TTS 服务边界

status: Proposed  
owner: Reader + AI

## Context
系统 TTS 延迟低且可离线，云端 TTS 声音更自然但有成本、密钥和网络依赖。

## Decision
Reader 通过统一 `SpeechEngine` 接口调用语音；首选 Android 系统 TTS，云端实现作为可替换适配器。播放队列与阅读位置留在客户端，密钥只在服务端。

## Consequences
首版可离线且成本可控；不同引擎音质不完全一致，需要统一暂停、分段和错误语义。
