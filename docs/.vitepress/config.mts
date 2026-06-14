import { defineConfig } from 'vitepress'

// BookRealm platform book
export default defineConfig({
  lang: 'zh-CN',
  title: 'BookRealm · 跨平台阅读平台',
  description: 'BookRealm 开源跨平台阅读平台:Android App、Spring Boot 服务、事件统计、AI 原文问答与工程书。',
  base: '/book-realm/',
  ignoreDeadLinks: true,
  lastUpdated: true,
  cleanUrls: true,

  head: [['meta', { name: 'theme-color', content: '#6c63ff' }]],

  themeConfig: {
    nav: [
      { text: '开始', link: '/guide/preface' },
      { text: '平台篇(P 阶段)', link: '/platform/' },
      { text: '实战篇', link: '/project/' },
      { text: '技术图鉴', link: '/stack/' },
      { text: '仓库地图', link: '/mvp/' },
      { text: '用户中心(前作)', link: 'https://wohuishuo.github.io/user-center-team-project/' }
    ],

    sidebar: {
      '/guide/': [
        {
          text: '① 开始(方法正本)',
          items: [
            { text: '序言:BookRealm 是什么', link: '/guide/preface' },
            { text: '方法论(从用户中心提炼)', link: '/guide/methodology' },
            { text: '金字塔写作方法', link: '/guide/writing-style' },
            { text: 'RC 重读整理清单', link: '/guide/rc-checklist' }
          ]
        }
      ],
      '/platform/': [
        {
          text: '② 平台篇 · P 阶段(七成准备)',
          items: [
            { text: '本篇导读 + 行动计划', link: '/platform/' },
            { text: '行动计划全文', link: '/platform/plan' },
            { text: 'P1 业务定位', link: '/platform/p1-positioning' },
            { text: 'P2 竞品分析', link: '/platform/p2-competitors' },
            { text: 'P3 功能分解树', link: '/platform/p3-features' },
            { text: 'P4 用例分析', link: '/platform/p4-usecases' },
            { text: 'P5 领域模型与 BC 映射', link: '/platform/p5-domain' },
            { text: 'P6 动态建模', link: '/platform/p6-dynamics' },
            { text: 'P7 架构与技术选型', link: '/platform/p7-architecture' },
            { text: 'P8 分工与计划', link: '/platform/p8-schedule' },
            { text: 'v1 需求与验收清单', link: '/platform/v1-scope' },
            { text: 'v2 需求与执行计划', link: '/platform/v2-scope' },
            { text: 'v2 参考项目', link: '/platform/reference-projects' },
            { text: 'TTS 服务计划', link: '/platform/tts-service-plan' }
          ]
        }
      ],
      '/project/': [
        {
          text: '③ 实战篇(每个模块一章)',
          items: [
            { text: '本篇导读', link: '/project/' },
            { text: 'MVP-0 用户中心(认证)', link: '/project/user-center' },
            { text: 'MVP-1 书库服务', link: '/project/library' },
            { text: 'MVP-2 阅读 App', link: '/project/reader' },
            { text: 'MVP-3 事件统计', link: '/project/event-stats' },
            { text: 'MVP-4 AI 服务', link: '/project/ai' }
          ]
        }
      ],
      '/stack/': [
        {
          text: '④ 技术图鉴',
          items: [
            { text: '图鉴导读', link: '/stack/' },
            { text: 'Jetpack Compose', link: '/stack/jetpack-compose' },
            { text: 'Retrofit', link: '/stack/retrofit' },
            { text: 'Room', link: '/stack/room' },
            { text: 'DataStore', link: '/stack/datastore' },
            { text: 'Spring Boot', link: '/stack/spring-boot' },
            { text: 'RabbitMQ', link: '/stack/rabbitmq' },
            { text: 'Spring AI 与 RAG', link: '/stack/spring-ai-rag' },
            { text: 'Docker 与 adb 调试', link: '/stack/docker-adb' }
          ]
        }
      ],
      '/mvp/': [
        {
          text: '⑤ 仓库地图',
          items: [
            { text: '平台模块与各仓链接', link: '/mvp/' }
          ]
        }
      ]
    },

    search: { provider: 'local' },
    socialLinks: [{ icon: 'github', link: 'https://github.com/wohuishuo/book-realm' }],
    docFooter: { prev: '上一页', next: '下一页' },
    outline: { label: '本页目录', level: [2, 3] },
    footer: {
      message: 'BookRealm 开源跨平台阅读平台 · 七成准备,三成代码',
      copyright: '书域团队 · 移动互联系统分析与设计课程项目'
    }
  }
})
