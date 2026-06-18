@prd-004 @prd-005 @manual
Feature: 找书并加入书架

  Scenario: 用户搜索西游记并加入书架
    Given 书库中存在西游记
    When 用户在书城搜索西游
    And 用户打开书籍详情
    And 用户将书籍加入书架
    Then 西游记出现在个人书架
    And 重新打开 App 后仍然存在

  Scenario: 书架搜索不搜索全站内容
    Given 西游记已加入书架
    And 朝花夕拾未加入书架
    When 用户在书架搜索朝花夕拾
    Then 书架不显示朝花夕拾
