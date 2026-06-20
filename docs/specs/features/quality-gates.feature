@prd-018 @manual @platform-github @level-manual
Feature: Pull Request 质量门

  Scenario: 代码检查失败
    Given Pull Request 包含代码改动
    When 任一必需的 test lint 或 build 检查失败
    Then Pull Request 不允许合并

  Scenario: 跨服务接口发生变化
    Given Pull Request 修改跨服务 API
    When 契约测试或平台冒烟未通过
    Then Pull Request 不允许合并
