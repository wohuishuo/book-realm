# MVP-2 阅读 App

> **结论先行**:阅读 App 是书域第一次真正"端到端"闭环:用户登录来自 MVP-0,书籍内容来自 MVP-1,本地体验由 Compose + Room + DataStore 承担。我们先把这条链跑通,再把统计与 AI 接进来。

## 这一章解决什么

我们要证明一件事:平台不是几个孤立仓库,而是能在手机上被真实使用的产品。

- 登录:App 调用户中心 `/api/user/login`,并把 `loginType=App` 写入事件源。
- 书城:App 调书库 `/api/books`,支持搜索书名。
- 详情:展示简介、标签、章节目录,并可加入书架。
- 阅读器:App 调 `/api/chapters/{id}`,按段落阅读。
- 本地状态:Room 保存书架,DataStore 保存 token、字号和阅读进度。

真实代码在 [br-reader-app](https://github.com/wohuishuo/br-reader-app)。

## 关键裁决

App 不直连 RabbitMQ。理由很简单:消息队列是后端服务间设施,手机端只应该面对 HTTP API。用户登录事件由用户中心发布,阅读进度后续走 `POST /api/stats/progress` 给 MVP-3。

真机调试默认走 USB 反向代理:

```powershell
adb reverse tcp:8080 tcp:80
adb reverse tcp:8082 tcp:8082
```

因此 App 里的调试地址是:

- 用户中心:`http://127.0.0.1:8080/api/`
- 书库服务:`http://127.0.0.1:8082/api/`

## 当前状态

MVP-2 业务闭环已经完成并安装到真机。一次真实问题也已经进入经验库:书库分页从 `page=0` 开始,Android 端最初传了 `page=1`,导致手机上能登录但搜不到书。修复后 App 查询第一页即可拿到《西游记》《朝花夕拾》。

## 下一步

本章还需要终稿化:补界面截图、关键代码讲解和真实踩坑复盘。代码上下一步是接 MVP-3:阅读器退出或滚动时上报阅读进度,失败静默,不影响阅读。
