@prd-003 @manual
Feature: 管理员用户管理

  Scenario: 管理员搜索并删除用户
    Given 管理员已经登录
    When 管理员按账号搜索用户
    And 管理员删除目标用户
    Then 目标用户被逻辑删除

  Scenario: 普通用户访问管理接口
    Given 普通用户已经登录
    When 普通用户访问用户管理接口
    Then 系统拒绝访问
