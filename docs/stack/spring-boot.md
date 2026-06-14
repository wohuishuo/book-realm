# Spring Boot

> **结论先行**:Spring Boot 是书域所有后端 MVP 的应用骨架。用户中心、书库、统计、AI 都靠它启动服务、暴露接口、接入数据库或消息队列。

## 一句话

Spring Boot = Java 后端应用的启动器和集成框架。

| 项 | 值 |
| --- | --- |
| 定位 | 后端应用框架 |
| 语言 | Java 21 |
| 书域版本 | Spring Boot 3.x |
| 出现场景 | MVP-0/1/3/4 |

## 解决什么问题

没有 Spring Boot,我们要自己装 Web 容器、配 JSON、配数据源、配各种框架。Spring Boot 用 starter 和自动配置把这些工作收拢起来。

最小入口:

```java
@SpringBootApplication
public class LibraryApplication {
    public static void main(String[] args) {
        SpringApplication.run(LibraryApplication.class, args);
    }
}
```

接口控制器:

```java
@RestController
public class BookController {
    @GetMapping("/books")
    public BaseResponse<BookListResponse> listBooks(...) {
        return ResultUtils.success(bookService.list(...));
    }
}
```

## 依赖关系

```
Spring Boot
  ├─ Spring MVC       → REST API
  ├─ Spring Data JPA  → MySQL 数据访问
  ├─ Spring AMQP      → RabbitMQ
  └─ Spring AI        → AI/RAG 服务
```

Spring Boot 是后端"主板",其他能力是插在它上面的模块。

## 在书域里的角色

- MVP-0 用户中心:登录、JWT、用户管理;
- MVP-1 书库服务:书/章/段/标签 API;
- MVP-3 统计服务:消费 RabbitMQ 事件、提供统计接口;
- MVP-4 AI 服务:接 DeepSeek、做摘要和问答。

## 真实踩坑

Spring Boot 3 使用 Jakarta 命名空间。旧项目或 2022 教程里的 `javax.*` 很多要变成 `jakarta.*`。所以书域选择按 2026 方案重建,不是照旧代码硬升级。

## 对应资源

- 实战:[MVP-1 书库服务](/project/library) · [MVP-3 事件统计](/project/event-stats) · [MVP-4 AI 服务](/project/ai)
