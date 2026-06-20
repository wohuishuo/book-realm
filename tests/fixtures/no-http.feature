@prd-999 @api @platform-api @level-integration
Feature: 禁止没有真实调用的 API 场景

  Scenario: 步骤通过但没有接触系统
    Given 一个不执行 HTTP 的空步骤
