@prd-012 @manual
Feature: 段评与点赞

  Scenario: 用户发布段评
    Given 用户已经登录并选中一个段落
    When 用户发布段评
    Then 段落互动列表显示该段评

  Scenario: 用户重复点赞同一段评
    Given 用户已经点赞一个段评
    When 用户再次执行点赞
    Then 点赞记录不会重复创建
    And 点赞数不会重复增加
