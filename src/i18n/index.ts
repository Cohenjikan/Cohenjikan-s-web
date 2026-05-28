import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

const resources = {
  zh: {
    translation: {
      nav: {
        about: 'about',
        services: 'services',
        projects: 'projects',
        social: 'social',
        contact: 'contact'
      },
      hero: {
        greeting: 'hello, world',
        cta: '发送邮件联系',
        name: "Hi, I'm Cohen."
      },
      section: {
        about: 'About',
        services: 'Services',
        projects: 'Projects',
        social: 'Social',
        contact: 'Contact',
        credits: 'Credits'
      },
      services: {
        intro: '业余顺手做的几样副业 · 点开看详情 · 数据全程本地处理',
        inquire: '聊聊定制 →',
        visit: '访问网站',
        outro: '想做的都可以聊 · 邮件直达 q63725959@gmail.com',
        cta: '聊聊定制'
      },
      project: {
        viewDetails: '查看详情',
        backToProjects: '← 返回项目列表',
        github: '查看源码',
        liveDemo: '在线 Demo',
        techStack: '技术栈',
        features: '核心特性',
        screenshotComingSoon: '截图待补充'
      },
      contact: {
        title: "What's Next?",
        desc: '虽然主要在做独立开发,但我的收件箱始终敞开。无论是合作、技术交流还是打个招呼,我都会尽量回复。',
        button: 'Say Hello',
        role: 'Developer · Melbourne',
        dragHint: '试着拖动这张卡片'
      },
      credits: {
        title: '致谢',
        subtitle: 'Credits & Acknowledgments',
        intro: '这个网站站在很多开源项目的肩膀上。下面这些工具、库和资源,是它能跑起来、看起来还像样的真正原因。再三感谢。',
        license: '所有列出的依赖都遵循各自的开源协议(多数为 MIT / Apache 2.0 / SIL OFL)。',
        backHome: '← 返回主页',
        specialThanksTitle: '特别感谢',
        specialThanksIntro: '在这趟开发过程里,有几位 / 几个的帮助远超工具范畴 —— 没有他们,这个网站不会以现在的样子存在。',
        categories: {
          foundations: '框架与构建',
          routing: '路由 与 国际化',
          animation: '动效与交互',
          webgl: '3D 与 WebGL',
          ui: '组件与样式',
          fonts: '字体'
        },
        thanks: {
          louie: { name: 'Louie', role: '朋友 · louie1.com', note: '是他一直在隔壁折腾自己的小站,把我也卷进来一起做。' },
          gpt: { name: 'GPT · OpenAI', role: 'Pair programmer', note: '复杂逻辑的拆解、SVG 排版的反复打磨,大量来自和它的对话。' },
          claude: { name: 'Claude · Anthropic', role: 'Claude Code', note: '本仓库的脚手架、React 组件层和大部分文件,直接由 Claude Code 写出。' }
        }
      },
      dock: {
        lang: '切换语言',
        bg: '切换背景',
        top: '回到顶部'
      },
      footer: 'Built with ♥ in Melbourne'
    }
  },
  en: {
    translation: {
      nav: {
        about: 'about',
        services: 'services',
        projects: 'projects',
        social: 'social',
        contact: 'contact'
      },
      hero: {
        greeting: 'hello, world',
        cta: 'Say Hello',
        name: "Hi, I'm Cohen."
      },
      section: {
        about: 'About',
        services: 'Services',
        projects: 'Projects',
        social: 'Social',
        contact: 'Contact',
        credits: 'Credits'
      },
      services: {
        intro: 'A handful of side projects I run for fun · click a row for details · everything runs on-device',
        inquire: 'Chat about it →',
        visit: 'Visit site',
        outro: 'Open to bespoke work · drop a line at q63725959@gmail.com',
        cta: 'Chat about it'
      },
      project: {
        viewDetails: 'View Details',
        backToProjects: '← Back to all projects',
        github: 'View on GitHub',
        liveDemo: 'Live Demo',
        techStack: 'Tech Stack',
        features: 'Highlights',
        screenshotComingSoon: 'Screenshot coming soon'
      },
      contact: {
        title: "What's Next?",
        desc: "While I'm mostly focused on independent development, my inbox is always open — for collaborations, tech chats, or just a hello.",
        button: 'Say Hello',
        role: 'Developer · Melbourne',
        dragHint: 'try dragging the card'
      },
      credits: {
        title: 'Credits',
        subtitle: 'Credits & Acknowledgments',
        intro: 'This site stands on the shoulders of a lot of open-source work. The libraries, tools and assets below are the real reason it runs — and looks the way it does. Thank you, sincerely.',
        license: 'All listed dependencies remain under their original open-source licenses (mostly MIT / Apache 2.0 / SIL OFL).',
        backHome: '← Back to home',
        specialThanksTitle: 'Special Thanks',
        specialThanksIntro: "A few names that went far beyond \"tooling\" during this build — without them this site wouldn't look like this.",
        categories: {
          foundations: 'Foundations & Build',
          routing: 'Routing & i18n',
          animation: 'Animation & Interaction',
          webgl: '3D & WebGL',
          ui: 'Components & Styling',
          fonts: 'Typography'
        },
        thanks: {
          louie: { name: 'Louie', role: 'Friend · louie1.com', note: 'For tinkering on his own site next door and pulling me along for the ride.' },
          gpt: { name: 'GPT · OpenAI', role: 'Pair programmer', note: 'Breaking down hairy logic and refining the SVG card design through many back-and-forths.' },
          claude: { name: 'Claude · Anthropic', role: 'Claude Code', note: 'Scaffolded the repo, wrote most of the React components and shipped the bulk of the files via Claude Code.' }
        }
      },
      dock: {
        lang: 'Toggle language',
        bg: 'Switch background',
        top: 'Back to top'
      },
      footer: 'Built with ♥ in Melbourne'
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: ['zh', 'en'],
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  });

export default i18n;

export const isLocale = (v: string): v is 'zh' | 'en' => v === 'zh' || v === 'en';
