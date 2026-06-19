@prd-002 @prd-004 @prd-008 @prd-013 @prd-014 @api
Feature: 平台核心接口闭环
  为了确认各服务能共同支撑阅读旅程
  系统应通过真实 HTTP 接口完成健康检查、登录、找书、进度与 AI 能力验证

  Scenario: 所有后端服务可用
    Given 平台服务已经启动
    Then 认证服务应健康
    And 书库服务应健康
    And 统计服务应健康
    And AI 服务应健康

  Scenario: 用户完成从登录到保存阅读进度的核心旅程
    Given 平台服务已经启动
    When 用户使用测试账号登录
    And 用户搜索一本书并打开第一章
    And 用户保存当前阅读位置
    Then 再次查询时应返回该阅读位置

  @prd-010 @prd-011
  Scenario: 用户保存划线笔记后可重新查询
    Given 平台服务已经启动
    And 用户使用测试账号登录
    And 用户搜索一本书并打开第一章
    When 用户为当前段落保存划线和笔记
    Then 再次查询章节标记时应返回该笔记

  @prd-012
  Scenario: 用户发布段评且重复点赞不重复计数
    Given 平台服务已经启动
    And 用户使用测试账号登录
    And 用户搜索一本书并打开第一章
    When 用户为当前段落发布段评
    And 用户连续两次点赞该段评
    Then 段评只记录一次点赞

  @prd-016
  Scenario: 用户重复上报阅读位置时更新原统计
    Given 平台服务已经启动
    And 用户使用测试账号登录
    And 用户搜索一本书并打开第一章
    When 用户连续上报两个阅读位置
    Then 阅读统计只保留该书当天的最新位置

  @requires-ai
  Scenario: AI 回答由原文支撑
    Given 平台服务已经启动
    And 用户搜索一本书并打开第一章
    When 用户针对当前章节提问
    Then AI 请求应成功并返回非空答案
