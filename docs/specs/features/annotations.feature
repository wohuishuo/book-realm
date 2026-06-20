@prd-010 @prd-011 @manual @platform-android @level-manual
Feature: 划线与笔记

  Scenario: 用户划线后重新打开章节
    Given 用户已经登录并打开一个章节
    When 用户长按第 3 段并创建划线
    And 用户重新打开该章节
    Then 第 3 段显示划线状态

  Scenario: 用户从笔记列表回到原文
    Given 用户为第 3 段写了笔记
    When 用户在我的笔记中打开该笔记
    Then 阅读器定位到对应章节第 3 段
