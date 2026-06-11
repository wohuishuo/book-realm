# MVP-0 用户中心(认证)

> **结论先行**:用户中心是平台的"门卫"——所有客户端先来这里登录拿 JWT,再凭它访问其他服务。它是「书域」的第一块积木,而且**已经完整做好了**:它本身是另一门课的独立项目,有自己的全栈实现、9 个测试、Docker 部署和一本完整网页书,我们在平台里直接复用它,不重写。

- 仓库:[user-center-team-project](https://github.com/wohuishuo/user-center-team-project)(独立公开仓)
- 它自己的完整网页书:<https://wohuishuo.github.io/user-center-team-project/>
- 演示账号:`root / 12345678`(管理员)、`demo / 12345678`(普通用户)

## 一、它在平台里的角色

**结论:用户中心只做一件事——确认"你是谁",然后发一张通行证(JWT)。**

**根据**:按 [P5 领域模型](/platform/p5-domain) 的 BC 划分,"用户/认证"是一个独立的 Bounded Context。把它抽成独立服务,整个平台才能"一次登录、各处通行"——阅读 App、书库、AI 服务都不必各自实现登录。

**例子**:阅读 App 用 `root/12345678` 登录用户中心,拿到 JWT 存进手机;之后调书库、调 AI 服务,请求头都带这张 JWT,各服务本地验签即可,不用再回头问用户中心。

## 二、它给平台贡献了什么

**结论:三样直接复用的东西——登录接口、JWT 方案、以及"怎么做一个项目"的全套方法。**

| 贡献 | 平台怎么用 |
| --- | --- |
| `POST /api/user/login` 等接口 | 阅读 App 的登录页直接对接 |
| BCrypt 存密码 + JWT 无状态登录态 | 平台的安全基线,其他服务照此鉴权 |
| 登录事件(待接入) | [MVP-3 事件统计](/project/event-stats) 的 UserLogin 事件源头 |
| 整套工程方法与网页书范式 | 本平台的 [方法论](/guide/methodology) 正是从它提炼 |

## 三、为什么不重写、不搬进本仓

**结论:它是另一门课的独立交付物,保持独立仓最干净;平台只"引用"它。**

**根据**:重复就是债。它已经跑通、测过、部署过,再抄一遍只会制造两份要同步的代码。星系结构的精髓就是"各 MVP 独立成仓,平台书负责把它们串成故事"——用户中心是这条故事线的起点。

**例子**:平台级的 `docker-compose` 会把用户中心的镜像和书库、AI 等一起编排起来(架构会话后续工单);但它的源码始终住在自己的仓里。

## 四、本章的真实代码

| 内容 | 位置 |
| --- | --- |
| 完整网页书(实战篇/认证模块讲 BCrypt+JWT) | <https://wohuishuo.github.io/user-center-team-project/> |
| 后端实现 | [user-center 仓 backend](https://github.com/wohuishuo/user-center-team-project/tree/main/user-center/backend) |
| 一键起全栈 | 该仓 `user-center/docker-compose.yml` |

## 本章小结

- **结论**:用户中心是平台门卫,登录发 JWT,已完整复用;
- **根据**:认证独立成 BC,一次登录各处通行;它也是平台方法论的来源;
- **例子**:App 用 `root/12345678` 登录拿 JWT,通行书库与 AI 服务。

## 对应资源

- 准备:[P5 领域模型](/platform/p5-domain)(用户 BC)
- 下游:[MVP-2 阅读 App](/project/reader)(对接登录)· [MVP-3 事件统计](/project/event-stats)(消费登录事件)
- 方法:[方法论](/guide/methodology)(从本项目提炼)
