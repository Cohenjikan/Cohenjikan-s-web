export type Locale = 'zh' | 'en';

export interface Localized {
  zh: string;
  en: string;
}

export interface ProjectFeature {
  title: Localized;
  description: Localized;
  /** Path under /public, e.g. /projects/sync-station/feature-1.jpg. Falls back to placeholder when missing. */
  image: string;
}

export interface ProjectDetail {
  slug: string;
  name: string;
  tagline: Localized;
  description: Localized;
  tags: string[];
  githubUrl: string;
  liveUrl?: string;
  heroImage: string;
  features: ProjectFeature[];
  techStack: string[];
}

export const projects: ProjectDetail[] = [
  {
    slug: 'sync-station',
    name: 'Sync Station',
    tagline: {
      zh: '私有跨设备同步,WebSocket 实时,双视图 + PIN 锁。',
      en: 'A private cross-device sync hub — WebSocket real-time, dual-view, PIN-locked.'
    },
    description: {
      zh: '私有跨设备同步工具,支持文本与文件的实时共享,基于 WebSocket 实现即时更新,提供双视图布局与 PIN 锁保护。',
      en: 'A private cross-device sync tool that supports real-time text and file sharing via WebSocket, featuring a dual-view layout and PIN lock protection.'
    },
    tags: ['JavaScript', 'WebSocket', 'HTML', 'Open Source'],
    githubUrl: 'https://github.com/Cohenjikan/sync-station',
    heroImage: '/projects/sync-station/hero.png',
    features: [
      {
        title: { zh: '实时同步', en: 'Real-time sync' },
        description: {
          zh: 'WebSocket 长连接,文本与文件改动在毫秒级广播到所有已连接设备。',
          en: 'WebSocket-based broadcast pushes text and file changes to every connected device in milliseconds.'
        },
        image: '/projects/sync-station/feature-1.jpg'
      },
      {
        title: { zh: '双视图布局', en: 'Dual-view layout' },
        description: {
          zh: '文本编辑区与文件列表并排排布,可同时进行,无需切换上下文。',
          en: 'Side-by-side text editor and file list — work on both without switching context.'
        },
        image: '/projects/sync-station/feature-2.jpg'
      },
      {
        title: { zh: 'PIN 锁保护', en: 'PIN lock protection' },
        description: {
          zh: '通过短 PIN 加密会话,防止陌生人误连;离开页面后自动锁定。',
          en: 'Lightweight PIN gating prevents strangers from joining and auto-locks when you leave.'
        },
        image: '/projects/sync-station/feature-3.jpg'
      }
    ],
    techStack: ['JavaScript', 'WebSocket', 'Node.js', 'HTML', 'CSS']
  },
  {
    slug: 'primer-score',
    name: 'PrimerScore Web',
    tagline: {
      zh: '把 PCR 引物设计搬上 Web,BLAST + 表达感知评分。',
      en: 'A PCR primer designer on the web, with BLAST and expression-aware scoring.'
    },
    description: {
      zh: 'PCR 引物设计工具的网页化实现,支持 BLAST 校验与表达感知评分,提升了生信工具的交互体验与可访问性。',
      en: 'A web-based implementation of a PCR primer design tool with BLAST validation and expression-aware scoring, improving accessibility and UX for bioinformatics workflows.'
    },
    tags: ['Python', 'Bioinformatics', 'BLAST', 'Web'],
    githubUrl: 'https://github.com/TH-Chen-CN/PrimerScore',
    heroImage: '/projects/primer-score/hero.png',
    features: [
      {
        title: { zh: 'BLAST 校验', en: 'BLAST validation' },
        description: {
          zh: '集成 BLAST 流程,自动剔除非特异性引物候选,降低实验返工率。',
          en: 'Integrated BLAST pipeline filters non-specific candidates so you spend less bench time on rework.'
        },
        image: '/projects/primer-score/feature-1.jpg'
      },
      {
        title: { zh: '表达感知评分', en: 'Expression-aware scoring' },
        description: {
          zh: '结合表达量数据为候选引物打分,优先推荐高灵敏度组合。',
          en: 'Scores candidates against expression data, surfacing the most sensitive primer pairs first.'
        },
        image: '/projects/primer-score/feature-2.jpg'
      },
      {
        title: { zh: '浏览器直运行', en: 'Runs in the browser' },
        description: {
          zh: '无需本地 Python 环境,生信工具的可访问性大幅提升。',
          en: 'No local Python install required — drastically lowers the barrier to bioinformatics tooling.'
        },
        image: '/projects/primer-score/feature-3.jpg'
      }
    ],
    techStack: ['Python', 'BLAST', 'JavaScript', 'Web']
  },
  {
    slug: 'tiny-voice-room',
    name: 'Tiny Voice Room',
    tagline: {
      zh: '免注册的轻量 WebRTC 语音房,一个链接就能开黑。',
      en: 'A link-first WebRTC voice room — no signup, share and talk.'
    },
    description: {
      zh: '免注册、链接即用的轻量 WebRTC 语音房间。一个分享链接、无需账号、房间 24 小时自动过期,后台标签页也能稳定运行,专为开黑场景设计。',
      en: 'A no-account, link-first WebRTC voice room. One shareable link, no signup, rooms auto-expire in 24 hours, runs reliably in background tabs — built for casual gaming squads.'
    },
    tags: ['WebRTC', 'TypeScript', 'Docker', 'Self-Hosted'],
    githubUrl: 'https://github.com/Cohenjikan/tiny-voice-room',
    heroImage: '/projects/tiny-voice-room/hero.png',
    features: [
      {
        title: { zh: '一键链接', en: 'Link-first onboarding' },
        description: {
          zh: '打开链接即入房,完全无账号、无 App、无邀请流程。',
          en: 'Open the link and you are in — no account, no app, no invite flow.'
        },
        image: '/projects/tiny-voice-room/feature-1.jpg'
      },
      {
        title: { zh: '后台稳定运行', en: 'Background-stable' },
        description: {
          zh: '针对浏览器节流的连接保活策略,即使切到游戏窗口也不会掉线。',
          en: 'Custom keep-alive defeats browser throttling so the connection survives when you tab over to a game.'
        },
        image: '/projects/tiny-voice-room/feature-2.jpg'
      },
      {
        title: { zh: '24h 自动过期', en: 'Auto-expiring rooms' },
        description: {
          zh: '房间 24 小时后自动销毁,无残留状态,可 Docker 自托管。',
          en: 'Rooms self-destruct after 24h — no lingering state, ships as a single self-hostable Docker image.'
        },
        image: '/projects/tiny-voice-room/feature-3.jpg'
      }
    ],
    techStack: ['WebRTC', 'TypeScript', 'Node.js', 'Docker']
  },
  {
    slug: 'claude-usage-monitor',
    name: 'Claude Usage Monitor',
    tagline: {
      zh: '常驻任务栏的 Claude Code 用量监视器,5h/周配额 + 分项目花费一眼看清。',
      en: 'A taskbar-resident Claude Code usage monitor — 5h/weekly quota and per-project cost at a glance.'
    },
    description: {
      zh: '面向 Claude Code Pro / Max 订阅者的轻量 Windows 桌面监视器:实时显示 5 小时与每周配额、按项目折算的等效 API 花费,以及一条常驻任务栏的迷你条。复用 Claude Code 自带的 OAuth 令牌,无需单独登录。',
      en: 'A lightweight Windows desktop monitor for Claude Code Pro / Max subscribers: real-time 5-hour & weekly quota, per-project equivalent-API cost, and an always-visible mini taskbar strip. Piggybacks on Claude Code’s own OAuth token — no separate login.'
    },
    tags: ['Python', 'Windows', 'Desktop', 'Open Source'],
    githubUrl: 'https://github.com/Cohenjikan/ClaudeUsageMoniter',
    heroImage: '/projects/claude-usage-monitor/hero.png',
    features: [
      {
        title: { zh: '配额实时监控', en: 'Live quota tracking' },
        description: {
          zh: '5 小时滚动窗口与每周配额实时刷新,跨越 75% / 90% / 95% 阈值时弹出 Windows 通知。',
          en: 'Real-time 5-hour rolling window and weekly quota, with Windows notifications when usage crosses 75% / 90% / 95%.'
        },
        image: '/projects/claude-usage-monitor/feature-1.jpg'
      },
      {
        title: { zh: '分项目花费', en: 'Per-project cost' },
        description: {
          zh: '解析本地 JSONL 记录,把每个项目的用量折算成等效 API 花费,会话 / 今日 / 本月一并汇总。',
          en: 'Parses local JSONL logs to compute each project’s equivalent-API cost, rolled up by session / today / month.'
        },
        image: '/projects/claude-usage-monitor/feature-2.jpg'
      },
      {
        title: { zh: '任务栏迷你条', en: 'Taskbar mini strip' },
        description: {
          zh: '无边框迷你条常驻任务栏、可拖动并记忆位置,另有浮动详情窗与系统托盘两种模式。',
          en: 'A borderless, drag-to-reposition strip lives in the taskbar (position remembered), plus a floating detail window and system-tray mode.'
        },
        image: '/projects/claude-usage-monitor/feature-3.jpg'
      }
    ],
    techStack: ['Python', 'tkinter', 'pystray', 'Pillow', 'winotify']
  }
];

export const getProjectBySlug = (slug: string): ProjectDetail | undefined =>
  projects.find((p) => p.slug === slug);
