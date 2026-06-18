# 06 进度、设置与离线

连续阅读由三种状态共同保证：服务端进度、本地阅读设置、离线章节缓存。三者失败策略不同，不能放进一个模糊的“用户配置”对象。

## 数据归属

- 阅读位置按 user/book/chapter upsert 到 Stats Service。
- 字号、行距、主题和翻页方式保存在 DataStore。
- 已下载章节正文保存在 Room。

对应 [PRD-007](/product/prd/prd-007-reading-preferences)、[PRD-008](/product/prd/prd-008-reading-progress)、[PRD-009](/product/prd/prd-009-offline-reading) 与 [ADR-009](/architecture/adr/adr-009-room-local-storage)。

## 完成证据

重启恢复位置和样式；断网可打开已缓存章节；进度上报失败不让阅读器退出。
