import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'zh-CN',
  title: 'BookRealm · 产品与工程规格',
  description: 'BookRealm 阅读平台的 PRD、ADR、验收规格、UI Rules 与工程质量门。',
  base: '/book-realm/',
  srcExclude: ['archive/legacy/**'],
  ignoreDeadLinks: true,
  lastUpdated: true,
  cleanUrls: true,

  head: [['meta', { name: 'theme-color', content: '#6c63ff' }]],

  themeConfig: {
    nav: [
      { text: '实战书', link: '/workbook/' },
      { text: '项目管理台', link: '/product/' },
      { text: '产品', link: '/product/' },
      { text: 'PRD', link: '/product/prd/' },
      { text: '架构', link: '/architecture/' },
      { text: 'ADR', link: '/architecture/adr/' },
      { text: '验收', link: '/specs/' },
      { text: 'UI Rules', link: '/ui/' },
      { text: '质量', link: '/quality/' },
      { text: '交付', link: '/delivery/' },
      { text: 'Agent', link: '/agent/' }
    ],

    sidebar: {
      '/workbook/': [
        {
          text: 'BookRealm 实战书',
          items: [
            { text: '开始阅读', link: '/workbook/' },
            { text: '01 项目地图', link: '/workbook/01-project-map' },
            { text: '02 产品规格', link: '/workbook/02-product-specification' },
            { text: '03 账号与身份', link: '/workbook/03-identity' },
            { text: '04 书库与书架', link: '/workbook/04-library' },
            { text: '05 Android 阅读器', link: '/workbook/05-reader' },
            { text: '06 连续阅读', link: '/workbook/06-continuity' },
            { text: '07 阅读互动', link: '/workbook/07-interactions' },
            { text: '08 事件与统计', link: '/workbook/08-events' },
            { text: '09 阅读 AI', link: '/workbook/09-ai' },
            { text: '10 设计系统', link: '/workbook/10-design-system' },
            { text: '11 可执行 BDD', link: '/workbook/11-bdd' },
            { text: '12 工程 Harness', link: '/workbook/12-harness' },
            { text: '13 交付与发布', link: '/workbook/13-delivery' }
          ]
        }
      ],
      '/product/': [
        {
          text: '产品规格',
          items: [
            { text: '产品入口', link: '/product/' },
            { text: '产品愿景', link: '/product/vision' },
            { text: '产品路线图', link: '/product/roadmap' },
            { text: '功能与实现证据', link: '/product/capability-inventory' },
            { text: 'PRD 索引', link: '/product/prd/' }
          ]
        },
        {
          text: '核心功能 PRD',
          collapsed: false,
          items: [
            { text: '001 项目规格重构', link: '/product/prd/prd-001-specification-refactor' },
            { text: '002 账号与会话', link: '/product/prd/prd-002-account-session' },
            { text: '003 管理员用户管理', link: '/product/prd/prd-003-admin-user-management' },
            { text: '004 书库与搜索', link: '/product/prd/prd-004-book-catalog' },
            { text: '005 个人书架', link: '/product/prd/prd-005-bookshelf' },
            { text: '006 章节阅读器', link: '/product/prd/prd-006-reader' },
            { text: '007 阅读样式设置', link: '/product/prd/prd-007-reading-preferences' },
            { text: '008 阅读进度同步', link: '/product/prd/prd-008-reading-progress' },
            { text: '009 离线阅读', link: '/product/prd/prd-009-offline-reading' },
            { text: '010 段落选择与划线', link: '/product/prd/prd-010-highlights' },
            { text: '011 阅读笔记', link: '/product/prd/prd-011-notes' },
            { text: '012 段评与点赞', link: '/product/prd/prd-012-comments-likes' },
            { text: '013 AI 章节摘要', link: '/product/prd/prd-013-ai-summary' },
            { text: '014 AI 原文问答', link: '/product/prd/prd-014-grounded-qa' },
            { text: '015 登录事件统计', link: '/product/prd/prd-015-login-statistics' },
            { text: '016 阅读进度统计', link: '/product/prd/prd-016-reading-statistics' },
            { text: '017 UI 设计系统', link: '/product/prd/prd-017-design-system' },
            { text: '018 自动化质量门', link: '/product/prd/prd-018-automated-quality' }
          ]
        }
      ],
      '/architecture/': [
        {
          text: '架构规格',
          items: [
            { text: '架构入口', link: '/architecture/' },
            { text: '仓库与能力地图', link: '/architecture/repositories' },
            { text: '平台 API', link: '/architecture/api-reference' },
            { text: 'ADR 索引', link: '/architecture/adr/' }
          ]
        },
        {
          text: 'ADR',
          collapsed: false,
          items: [
            { text: '001 Spring 分层', link: '/architecture/adr/adr-001-spring-layered-architecture' },
            { text: '002 JWT 认证', link: '/architecture/adr/adr-002-jwt-authentication' },
            { text: '003 共用 REST API', link: '/architecture/adr/adr-003-shared-rest-api' },
            { text: '004 阅读进度表', link: '/architecture/adr/adr-004-reading-progress-table' },
            { text: '005 管理权限', link: '/architecture/adr/adr-005-admin-permissions' },
            { text: '006 UI 设计系统', link: '/architecture/adr/adr-006-ui-design-system' },
            { text: '007 多仓边界', link: '/architecture/adr/adr-007-multi-repository' },
            { text: '008 后端事件', link: '/architecture/adr/adr-008-backend-events-only' },
            { text: '009 Android 本地存储', link: '/architecture/adr/adr-009-room-local-storage' },
            { text: '010 原文 RAG', link: '/architecture/adr/adr-010-grounded-rag' },
            { text: '011 统一 JWT 验证', link: '/architecture/adr/adr-011-unified-jwt-validation' }
          ]
        }
      ],
      '/specs/': [
        { text: '验收规格', items: [{ text: 'Feature 索引', link: '/specs/' }] }
      ],
      '/ui/': [
        {
          text: 'UI Rules',
          items: [
            { text: 'UI 入口', link: '/ui/' },
            { text: '全局规则', link: '/ui/global-rules' },
            { text: 'Android 规则', link: '/ui/android-rules' },
            { text: 'Web 管理端规则', link: '/ui/web-admin-rules' },
            { text: '组件规则', link: '/ui/component-rules' },
            { text: '设计系统', link: '/ui/design-system' },
            { text: '模式库', link: '/ui/patterns' }
          ]
        }
      ],
      '/quality/': [
        {
          text: '质量',
          items: [
            { text: '质量入口', link: '/quality/' },
            { text: 'Harness', link: '/quality/harness' },
            { text: '测试运行环境', link: '/quality/test-environments' },
            { text: '测试证据', link: '/quality/test-evidence' },
            { text: '平台 Runbook', link: '/quality/runbook-platform-ops' }
          ]
        }
      ],
      '/delivery/': [
        {
          text: '交付',
          items: [
            { text: '交付入口', link: '/delivery/' },
            { text: '标准流程', link: '/delivery/workflow' },
            { text: 'Linear 工作模型', link: '/delivery/linear' }
          ]
        }
      ],
      '/agent/': [
        {
          text: 'Agent Skills',
          items: [
            { text: '入口', link: '/agent/' },
            { text: 'PRD', link: '/agent/skill-prd' },
            { text: 'ADR', link: '/agent/skill-adr' },
            { text: 'UI Loop', link: '/agent/skill-ui-loop' },
            { text: 'Test', link: '/agent/skill-test' },
            { text: 'Review', link: '/agent/skill-review' },
            { text: 'Delivery', link: '/agent/skill-delivery' }
          ]
        }
      ]
    },

    search: { provider: 'local' },
    socialLinks: [{ icon: 'github', link: 'https://github.com/wohuishuo/book-realm' }],
    docFooter: { prev: '上一页', next: '下一页' },
    outline: { label: '本页目录', level: [2, 3] },
    footer: {
      message: 'BookRealm 产品与工程规格',
      copyright: '书域团队'
    }
  }
})
