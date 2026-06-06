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

/** A single source repo. Projects that bundle more than one repo (e.g. the game
 *  trainers) use `repos` instead of `githubUrl` to render one link button each. */
export interface RepoLink {
  label: Localized;
  url: string;
}

export interface ProjectDetail {
  slug: string;
  name: string;
  tagline: Localized;
  description: Localized;
  tags: string[];
  /** Single-repo projects set this; multi-repo projects use `repos` instead. */
  githubUrl?: string;
  /** Multiple source repos, each rendered as its own link button on the detail page. */
  repos?: RepoLink[];
  liveUrl?: string;
  heroImage: string;
  features: ProjectFeature[];
  techStack: string[];
}

export const projects: ProjectDetail[] = [
  {
    slug: 'music-master',
    name: 'MusicMaster',
    tagline: {
      zh: '完全本地的一体化音乐处理:拆声、记谱、简谱⇄五线谱互译、修音换音色。',
      en: 'A fully-local all-in-one music workstation — stem separation, transcription, notation translation, pitch & timbre reshaping.'
    },
    description: {
      zh: '声谱坊(MusicMaster)是一个纯本地运行的一体化音乐处理工具,整合多个一线开源模型,在一个网页界面里搞定四件事:人声/伴奏分离、清唱自动记谱(带逐音可信度)、简谱与五线谱无损双向互译,以及把跑调清唱修成「在调 + 干净 + 仍是你本人音色」。全程本地,无需上传。',
      en: 'MusicMaster (声谱坊) is a fully-local, all-in-one music workstation that stitches together several state-of-the-art open-source models behind one browser UI: vocal/accompaniment separation, audio-to-score transcription with per-note confidence, lossless two-way numbered ⇄ staff notation translation, and reshaping off-key singing into something in-tune and clean that still sounds like you. Everything runs on-device — nothing is uploaded.'
    },
    tags: ['Python', 'Audio AI', 'Local-First', 'Open Source'],
    githubUrl: 'https://github.com/Cohenjikan/MusicMaster',
    heroImage: '/projects/music-master/hero.png',
    features: [
      {
        title: { zh: '拆声 · 人声伴奏分离', en: 'Stem separation' },
        description: {
          zh: '三段级联(BS-RoFormer → Karaoke RoFormer → UVR):整首歌拆成人声 / 伴奏,再去和声、降噪,得到干净的纯主唱。',
          en: 'A three-stage cascade (BS-RoFormer → Karaoke RoFormer → UVR) splits a track into vocals / accompaniment, strips backing harmonies, and denoises down to a clean lead vocal.'
        },
        image: '/projects/music-master/feature-1.jpg'
      },
      {
        title: { zh: '记谱 · 哼唱转乐谱', en: 'Audio transcription' },
        description: {
          zh: '清唱或哼唱直接转成五线谱 + 简谱,并对每个音给出可信度,不确定的地方自动标注请你复核,纯 CPU 即可运行。',
          en: 'Turns humming or singing straight into staff + numbered notation with a per-note confidence score, flagging the uncertain spots for review — runs on CPU alone.'
        },
        image: '/projects/music-master/feature-2.jpg'
      },
      {
        title: { zh: '互译 · 简谱⇄五线谱', en: 'Notation translation' },
        description: {
          zh: '简谱 .jianpu 与五线谱 MusicXML / MIDI / ABC 之间双向无损互译;简谱出图经 LilyPond,五线谱经 Verovio。',
          en: 'Lossless two-way conversion between numbered .jianpu and staff MusicXML / MIDI / ABC — numbered scores render via LilyPond, staff via Verovio.'
        },
        image: '/projects/music-master/feature-3.jpg'
      },
      {
        title: { zh: '重塑 · 修音换音色', en: 'Pitch & timbre reshape' },
        description: {
          zh: '两段式处理:先修音准、再换音色,把跑调清唱变成在调、干净、却仍保留你本人音色的演唱。',
          en: 'A two-pass pipeline — correct the pitch, then reshape the timbre — turning an off-key take into something in-tune and clean that still carries your own voice.'
        },
        image: '/projects/music-master/feature-4.jpg'
      }
    ],
    techStack: ['Python', 'FastAPI', 'PyTorch', 'CREPE', 'Verovio', 'LilyPond']
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
    slug: 'rhythm-game-trainers',
    name: 'Rhythm Game Trainers',
    tagline: {
      zh: '两款节奏游戏的内置图形修改器:Autoplay 满分自动演奏、变速、放宽判定、关卡直达。',
      en: 'In-game GUI trainers for two rhythm games — frame-perfect autoplay, speed control, relaxed judgment, level jump.'
    },
    description: {
      zh: '为《节奏医生》与《冰与火之舞》两款节奏游戏制作的内置图形修改器,均基于 BepInEx 注入,游戏内按 Insert 呼出菜单。提供引擎级 Autoplay 满分自动演奏、游戏变速(含音高)、放宽判定窗口、无敌、关卡直达与一键解锁,以及开发者 / 调试工具。仅供单机自娱与录制,完全免费开源、严禁倒卖。',
      en: 'In-game GUI trainers for the rhythm games Rhythm Doctor and A Dance of Fire and Ice. Both inject via BepInEx and pop up with the Insert key, offering engine-level frame-perfect autoplay, game-speed control (pitch included), a widened judgment window, no-fail invincibility, instant level jump / unlocks, and developer-debug tools. Built for solo play and recording — free, open-source, and never for resale.'
    },
    tags: ['C#', 'BepInEx', 'Game Modding', 'Open Source'],
    repos: [
      { label: { zh: '节奏医生', en: 'Rhythm Doctor' }, url: 'https://github.com/Cohenjikan/RhythmDoctorTrainer' },
      { label: { zh: '冰与火之舞', en: 'A Dance of Fire and Ice' }, url: 'https://github.com/Cohenjikan/ADOFAITrainer' }
    ],
    heroImage: '/projects/rhythm-game-trainers/hero.png',
    features: [
      {
        title: { zh: 'Autoplay 满分自动演奏', en: 'Frame-perfect autoplay' },
        description: {
          zh: '引擎按谱面帧级满分自动演奏,画面与真人手打无异且无水印,保留「完美 / JCI」结算标记 —— 配合隐藏 HUD 即可录制完美通关。',
          en: 'The engine plays every chart frame-perfectly and watermark-free, indistinguishable from a human run and keeping the Perfect / JCI result marks — pair it with hidden HUD to record flawless clears.'
        },
        image: '/projects/rhythm-game-trainers/feature-1.jpg'
      },
      {
        title: { zh: '变速 · 放宽判定 · 无敌', en: 'Speed, judgment & no-fail' },
        description: {
          zh: '0.1×–3× 变速(含音高)用于慢放练习或加速,放宽命中窗口让手打也能全 Perfect,外加无敌不会失败 / 被打断。',
          en: '0.1×–3× speed (pitch included) for slow practice or speed-ups, a widened hit window so manual play hits all-Perfect, plus no-fail invincibility that never breaks your run.'
        },
        image: '/projects/rhythm-game-trainers/feature-2.jpg'
      },
      {
        title: { zh: '关卡直达 · 解锁 · 开发者工具', en: 'Level jump, unlocks & dev tools' },
        description: {
          zh: '列出全部关卡一点直达、一键解锁所有关卡与成就,另含开发者 / 调试模式、跳过过场、显示 FPS、固定星球颜色等录制友好选项。',
          en: 'List every level and jump straight in, unlock all levels and achievements at once, plus developer / debug modes, cutscene skipping, FPS display and recording-friendly toggles like fixed planet colors.'
        },
        image: '/projects/rhythm-game-trainers/feature-3.jpg'
      }
    ],
    techStack: ['C#', 'BepInEx', 'Harmony', 'Unity', 'IMGUI']
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
  }
];

export const getProjectBySlug = (slug: string): ProjectDetail | undefined =>
  projects.find((p) => p.slug === slug);
