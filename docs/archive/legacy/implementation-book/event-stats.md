# MVP-3 事件统计

> **结论先行**:事件统计服务把"用户做了什么"从主流程里拆出来。用户登录不等待统计,阅读进度不直连消息队列;统计作为旁路独立消费、独立查询。

仓库:[br-event-stats](https://github.com/wohuishuo/br-event-stats)。本章代码片段来自真实工程。

## 一、它在平台里干什么

**结论:它只管行为数据,不管登录、不管书籍内容。**

```
用户中心登录成功
   │ 发布 UserLogin
   ▼
RabbitMQ fanout: user.events
   ├─ login.log   → 保存原始登录日志
   └─ login.stats → 聚合每日登录统计

阅读 App
   └─ POST /api/stats/progress → 保存阅读进度
```

**根据**:登录和阅读是用户正在做的事,统计是系统后面要知道的事。后者不能拖慢前者。RabbitMQ 让用户中心只负责"宣布登录发生了",统计服务慢了也不影响用户登录。

## 二、为什么 App 不直连 RabbitMQ

**结论:手机端只走 HTTP。** RabbitMQ 是后端服务间设施,不是移动端依赖。

阅读进度采用:

```http
POST /api/stats/progress
```

这样 App 不需要知道 MQ 地址、账号、队列、重试策略。后端也能统一鉴权、限流、校验参数。这个裁决已经写进 [v1 范围](/platform/v1-scope)。

## 三、RabbitMQ 拓扑

**结论:一个 fanout exchange,两个队列。** 同一个 UserLogin 事件会被复制到两个消费者。

```java
public static final String EXCHANGE_USER_EVENTS = "user.events";
public static final String QUEUE_LOGIN_LOG = "login.log";
public static final String QUEUE_LOGIN_STATS = "login.stats";

@Bean
public FanoutExchange userEventsExchange() {
    return new FanoutExchange(EXCHANGE_USER_EVENTS, true, false);
}

@Bean
public Binding bindLog(FanoutExchange userEventsExchange, Queue loginLogQueue) {
    return BindingBuilder.bind(loginLogQueue).to(userEventsExchange);
}
```

fanout 的价值是解耦:日志消费者保存原始记录,统计消费者更新聚合表。后面如果要加"风控消费者",也可以再绑一个队列,不用改用户中心。

## 四、事件契约

**结论:统计服务只依赖字段,不依赖用户中心的 Java 类。**

```java
public record UserLoginEvent(
        Long userId,
        String loginType,
        LocalDateTime loginTime,
        String ipAddress
) {}
```

用户中心发送 JSON,统计服务接 JSON。两个仓库不需要共享一个 jar。字段名就是契约。

::: tip 这里的重点不是"会用 MQ"
真正重要的是服务边界:用户中心发布领域事件,统计服务消费领域事件。它们通过事件契约合作,不是互相调用内部代码。
:::

## 五、数据怎么存

**结论:三张表,分别对应原始事实、登录聚合、阅读进度。**

| 表 | 作用 |
| --- | --- |
| `login_logs` | 每次登录原始记录 |
| `login_stats` | 按天统计 App/Web/Desktop 登录数 |
| `reading_stats` | 按 user+book+day 保存阅读进度 |

阅读进度不是每滚动一次就无限插入,而是同一天同一本书更新同一行:

```java
public void updateProgress(Long chapterId, int paragraphIndex) {
    this.chapterId = chapterId;
    this.paragraphIndex = Math.max(this.paragraphIndex, paragraphIndex);
    this.reportCount++;
    this.lastReportTime = LocalDateTime.now();
}
```

这样既能保留"读到哪里",也不会把表刷爆。

## 六、消费者怎么写

**结论:消费者只接事件,业务交给 Service。**

```java
@Component
public class LoginStatsConsumer {
    private final StatsService statsService;

    @RabbitListener(queues = RabbitMQConfig.QUEUE_LOGIN_STATS)
    public void handle(UserLoginEvent event) {
        statsService.increaseLoginStats(event);
    }
}
```

Service 负责真正的聚合:

```java
@Transactional
public void increaseLoginStats(UserLoginEvent event) {
    LocalDate date = event.loginTime().toLocalDate();
    LoginStats stats = loginStatsRepository.findByStatsDate(date)
        .orElseGet(() -> new LoginStats(date));
    stats.increase(event.loginType());
    loginStatsRepository.save(stats);
}
```

这种分层让 MQ 更换、HTTP 调用、测试都更容易。

## 七、接口长什么样

**结论:对外只暴露三个统计接口。**

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/api/stats/logins?from=&to=` | 查登录统计 |
| POST | `/api/stats/progress` | App 上报阅读进度 |
| GET | `/api/stats/reading?from=&to=` | 查阅读统计 |

阅读进度请求:

```json
{
  "userId": 2,
  "bookId": 1,
  "chapterId": 1,
  "paragraphIndex": 7
}
```

## 八、真实验证

**结论:MVP-3 已经通过真实联调,不是只写了代码。**

验证结果:

- `mvn test`:4 条测试全绿;
- `GET /api/health`:返回 `br-event-stats is up`;
- RabbitMQ 可见 `user.events`、`login.log`、`login.stats`;
- `POST /api/stats/progress`:写入阅读进度;
- 用户中心真实登录 `root / 12345678`:发布 UserLogin;
- `GET /api/stats/logins`:返回当天 `appLogins=1,total=1`。

这说明 MVP-0 → RabbitMQ → MVP-3 的事件链已经通了。

## 九、本章的真实代码

| 内容 | 文件 |
| --- | --- |
| RabbitMQ 拓扑 | [RabbitMQConfig.java](https://github.com/wohuishuo/br-event-stats/blob/main/src/main/java/com/bookrealm/stats/config/RabbitMQConfig.java) |
| 登录事件 DTO | [UserLoginEvent.java](https://github.com/wohuishuo/br-event-stats/blob/main/src/main/java/com/bookrealm/stats/event/UserLoginEvent.java) |
| 两个消费者 | [event/](https://github.com/wohuishuo/br-event-stats/tree/main/src/main/java/com/bookrealm/stats/event) |
| 三张表实体 | [entity/](https://github.com/wohuishuo/br-event-stats/tree/main/src/main/java/com/bookrealm/stats/entity) |
| 统计业务 | [StatsService.java](https://github.com/wohuishuo/br-event-stats/blob/main/src/main/java/com/bookrealm/stats/service/StatsService.java) |
| HTTP 接口 | [StatsController.java](https://github.com/wohuishuo/br-event-stats/blob/main/src/main/java/com/bookrealm/stats/controller/StatsController.java) |
| 测试 | [src/test/](https://github.com/wohuishuo/br-event-stats/tree/main/src/test/java/com/bookrealm/stats) |

## 本章小结

- **结论**:统计是旁路,不能拖慢登录和阅读;
- **根据**:登录事件走 RabbitMQ fanout,阅读进度走 HTTP,服务边界清楚;
- **例子**:用户中心真实登录后,统计服务查询到 `appLogins=1`。

## 下一步

下一步做 [MVP-4 AI 服务](/project/ai)。MVP-3 已经能记录"用户在读什么",MVP-4 要回答"用户读不懂时,系统怎么基于原文帮他理解"。
