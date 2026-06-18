@prd-002 @manual
Feature: 账号登录与会话恢复

  Scenario: 用户登录后重新打开 App
    Given 用户账号 root 已存在
    When 用户使用正确密码登录
    And 用户关闭并重新打开 App
    Then 用户仍处于登录状态
    And 可以访问自己的个人数据

  Scenario: 用户使用错误密码登录
    Given 用户账号 root 已存在
    When 用户使用错误密码登录
    Then 系统提示账号或密码错误
    And 不说明账号是否存在
