# 书域 · 超级项目枢纽(book-realm)

**多 MVP 电子书平台的总纲仓**:平台书(方法正本 + P 阶段需求与领域设计)、MVP 地图、平台编排。

## 星系结构

| 仓库 | 内容 |
| --- | --- |
| **book-realm**(本仓) | 平台书、P1–P8 文档、平台 docker-compose(后续) |
| [user-center-team-project](https://github.com/wohuishuo/user-center-team-project) | MVP-0 用户中心 ✅(认证微服务,直接复用) |
| br-library-service / br-reader-app / br-event-stats / br-ai-service | MVP 1–4,各自里程碑开工时建 |

## 平台书

```bash
npm install
npm run docs:dev    # http://localhost:5173/book-realm/
```

push 到 main 自动发布 GitHub Pages(首次需在 Settings → Pages 选 GitHub Actions)。

## 进度

唯一权威存档点:[`TODO-总进度.md`](TODO-总进度.md)。
