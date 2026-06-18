@prd-015 @prd-016 @manual
Feature: 登录与阅读统计

  Scenario: 登录事件被异步统计
    Given 统计服务正在消费登录事件
    When 用户成功登录
    Then 登录主流程成功
    And 当天登录统计增加

  Scenario: 阅读进度重复上报
    Given 用户已经上报一本书的阅读进度
    When 用户再次上报同一本书同一章节的新位置
    Then 服务端更新原进度记录
    And 不创建重复记录
