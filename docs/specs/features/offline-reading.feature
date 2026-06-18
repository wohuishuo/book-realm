@prd-009 @manual
Feature: 离线章节阅读

  Scenario: 用户离线打开已缓存章节
    Given 用户在线打开过西游记第一回
    And 第一回已经写入本地缓存
    When 网络不可用
    And 用户再次打开第一回
    Then 阅读器显示缓存正文
    And 不因网络错误退出
