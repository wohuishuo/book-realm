# ADR-009 Android 使用 Room 与 DataStore

status: Accepted
owner: Reader

## Context
书架、章节缓存属于结构化数据;JWT 和阅读偏好属于轻量键值配置。

## Decision
结构化本地数据使用 Room;JWT、主题、字号和行距使用 DataStore。

## Consequences
优点:存储职责明确,支持离线查询和类型安全配置。  
代价:Room schema 变化需要数据库迁移。
