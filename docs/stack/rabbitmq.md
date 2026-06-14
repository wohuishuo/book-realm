# RabbitMQ

> **结论先行**:RabbitMQ 用来把"已经发生的事"广播给关心它的服务。书域中,用户中心登录成功后发布 UserLogin 事件,统计服务异步消费,登录本身不被统计逻辑拖慢。

## 一句话

RabbitMQ = 后端服务之间传递事件的消息中间件。

| 项 | 值 |
| --- | --- |
| 定位 | 消息队列 / 事件总线 |
| 书域用途 | UserLogin 事件广播 |
| 出现场景 | MVP-0 → MVP-3 |
| 裁决 | App 不直连 RabbitMQ |

## 解决什么问题

如果用户登录时同步写统计,统计服务慢了或挂了,登录就可能受影响。用户会觉得"我只是登录,为什么卡住?"

用 RabbitMQ 后,链路变成:

```
用户登录成功
   │
用户中心发布 UserLogin 事件
   │
RabbitMQ fanout exchange: user.events
   ├─ login.log 队列   → 记录登录日志
   └─ login.stats 队列 → 聚合统计数据
```

登录只负责发布事件。统计失败只影响统计,不影响用户登录。

## 依赖关系

```
MVP-0 用户中心
    └─ Spring AMQP 发布事件
          ▼
      RabbitMQ exchange
          ▼
MVP-3 统计服务消费者
```

App 不在这条 MQ 链路里。App 只走 HTTP。

## 在书域里的角色

用户中心事件契约:

```java
public record UserLoginEvent(
    Long userId,
    String loginType,
    LocalDateTime loginTime,
    String ipAddress
) {}
```

MVP-3 统计服务已经有 fanout 拓扑骨架,下一步就是补消费者、落库、查询接口。

## 真实踩坑

RabbitMQ 4 对一些临时队列行为更严格。MVP 阶段做联调时,队列和 exchange 尽量显式声明、命名清楚、可重复创建,不要依赖"临时自动生成"的行为。

## 对应资源

- 实战:[MVP-3 事件统计](/project/event-stats)
- 相关卡:[Spring Boot](/stack/spring-boot)
