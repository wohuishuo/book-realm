@prd-013 @prd-014 @manual @platform-android @level-manual
Feature: 基于原文的 AI 阅读帮助

  Scenario: 用户围绕原文提问
    Given 西游记段落已经建立索引
    When 用户询问仙石是什么
    Then 回答包含相关原文依据
    And 回答标记引用段落

  Scenario: AI 服务没有模型密钥
    Given AI 服务没有配置模型密钥
    When 用户请求章节摘要
    Then 服务返回明确降级状态
    And 阅读器仍可继续阅读
