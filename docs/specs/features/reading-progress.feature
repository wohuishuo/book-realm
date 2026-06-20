@prd-007 @prd-008 @manual @platform-android @level-manual
Feature: 阅读进度恢复

  Scenario: 用户重新打开一本读过的书
    Given 用户已经登录
    And 用户阅读西游记到第一回第 8 段
    When 用户关闭阅读器后再次打开该书
    Then 系统自动恢复到第一回第 8 段

  Scenario: 阅读样式在重启后保留
    Given 用户把字号设为大
    And 用户把行距设为宽
    When 用户重新打开 App
    Then 阅读器仍使用大字号和宽行距
