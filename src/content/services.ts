import type { Locale, Localized } from './projects';
import type { EmblemId } from '../components/sections/services/ServiceEmblems';

export type { Locale };

export type DemoId =
  | 'echo'
  | 'chronicle'
  | 'fortune'
  | 'continuum'
  | 'archive'
  | 'relay'
  | 'bazi'
  | 'poetry';

export interface ServiceItem {
  slug: string;
  /** Brand-style English title — kept short so it can pair with the zh subtitle. */
  name: string;
  /** zh keeps the poetic Chinese name; en is the functional metric-style name. */
  subtitle: Localized;
  tagline: Localized;
  /** 3 short bullets surfaced only when the row is expanded. */
  features: { zh: string[]; en: string[] };
  tags: string[];
  /** Inline geometric emblem rendered in the collapsed row — see ServiceEmblems.tsx. */
  emblem: EmblemId;
  /** Which scripted demo to render at the top of the expanded panel. */
  demo: DemoId;
  /**
   * Single canonical deliverable screenshot, shown as a clickable thumbnail below
   * the demo. null for Continuum (the live demo replaces the screenshot, since there
   * is no public sample image). Click opens an <ImageLightbox>.
   */
  sampleImage: string | null;
  /** Hover/expand accent color (rgba). Sampled from the source mockup palette. */
  accentRgba: `rgba(${number}, ${number}, ${number}, ${number})`;
  /**
   * Live deployment URL. Present only for the shipped subdomain products
   * (shiyun / ai / ming); when set, the expanded drawer shows a "visit site" button.
   * The older side-projects are demo + inquiry only, so they leave this undefined.
   */
  visitUrl?: string;
  /**
   * Optional compliance / entertainment-only notice, rendered as a distinct boxed
   * line in the expanded drawer. Used where the framing needs an explicit legal or
   * "for-fun only" caveat (e.g. persona modeling, fortune-telling).
   */
  disclaimer?: Localized;
  /**
   * Marks a 整蛊 / prank product: renders a "整蛊" badge on the collapsed row, and the
   * whole entry is hidden when the UI is in English (the gag only lands in Chinese).
   */
  prank?: boolean;
}

// Five small side-projects ("做着玩的副业"). Each row collapses by default; on
// expand it shows a scripted demo of the deliverable, plus one click-to-zoom
// screenshot of the actual artifact (except Continuum, which is demo-only).
export const services: ServiceItem[] = [
  {
    slug: 'shiyun',
    name: 'Poetry Cloud',
    subtitle: { zh: '诗云 · 一切可能的诗', en: 'Every Possible Poem' },
    tagline: {
      zh: '一张可飞行的三维诗歌星图:每位诗人是一团真实星,星团之间的虚空是一切可能的近体诗。点一下虚空,就用「编号↔诗」的双射当场算出一首,地址长达 82–229 位——诗不被储存,给个编号就能算出第几首。',
      en: 'A roamable 3D star map of poetry: each poet a cluster of real stars, the void between them every possible regulated-verse poem. Click the void and an index↔poem bijection computes one on the spot — an 82–229-digit address, no poem ever stored.'
    },
    features: {
      zh: ['全朝代诗人星团 · 可飞行 / 按朝代筛选', '点虚空 unrank 出诗 + 完整长编号', '赠诗网络 4,849 弧 · 逐句搜索 / 编号反查'],
      en: ['All-dynasty poet clusters — fly & filter', 'Click the void → a poem + its full long index', '4,849 dedication arcs · search by line / reverse a number']
    },
    tags: ['three.js', 'WebGL', 'Generative'],
    emblem: 'poetry',
    demo: 'poetry',
    sampleImage: '/services/shiyun.jpg',
    accentRgba: 'rgba(94, 234, 212, 0.5)',
    visitUrl: 'https://shiyun.cohenjikan.com'
  },
  {
    slug: 'echo',
    name: 'Echo',
    subtitle: { zh: '朋友圈 · 点赞评论报表', en: 'Moments Analytics' },
    tagline: {
      zh: '把一年的朋友圈翻译成可量化的报表 —— 点赞、评论、真爱粉榜、活跃时段,一份图说清。',
      en: "A year of WeChat Moments turned into a quantified report — likes, comments, top engaged followers and active windows, all in one view."
    },
    features: {
      zh: ['点赞 / 评论 / 互动总览', '真爱粉 TOP 榜', '高光时刻自动标注'],
      en: ['Likes / comments / engagement overview', 'Top engaged followers list', 'Auto-highlighted peak moments']
    },
    tags: ['Analytics', 'WeChat', 'Visualization'],
    emblem: 'echo',
    demo: 'echo',
    // 北极星指标 dashboard (732 作品 / 8005 点赞 / 4525 评论 / 326 真爱粉)
    sampleImage: '/services/echo.png',
    accentRgba: 'rgba(167, 139, 250, 0.55)'
  },
  {
    slug: 'chronicle',
    name: 'Chronicle',
    subtitle: { zh: '时光长河 · 年度对话报告', en: 'Annual Chat Report' },
    tagline: {
      zh: '一整年 QQ / 微信对话浓缩成一份叙事报告:话量曲线、关键节点、AI 提炼的故事弧线,可定制恋爱版。',
      en: 'A year of QQ / WeChat conversations distilled into a narrative report — message volume curves, key moments, AI-extracted story arcs. Romance edition available.'
    },
    features: {
      zh: ['话量时间线 + 峰值标注', '反复出现的微小回应聚类(哈/嗯/没事/喜欢)', '恋爱报告 · 两人专属版'],
      en: ['Message timeline with peak annotations', 'Clustering of recurring micro-replies (haha / mm / it\'s ok / love)', 'Romance edition for couples']
    },
    tags: ['AI Analysis', 'Annual Report', 'Storytelling'],
    emblem: 'chronicle',
    demo: 'chronicle',
    sampleImage: '/services/chronicle.png',
    accentRgba: 'rgba(245, 200, 110, 0.55)'
  },
  {
    slug: 'fortune',
    name: 'Tides of Fortune',
    subtitle: { zh: '气运曲线 · 星盘财运', en: 'Astrology & Wealth Forecast' },
    tagline: {
      zh: '八字 + 星盘 + 行运推演,把命理翻译成可读的曲线模型。年度气运、第二宫财运 K 线、关键转折提醒。',
      en: 'Bazi + natal chart + transit modeling, rendered as readable curves. Annual fortune line, 2nd-house wealth K-line, turning-point alerts.'
    },
    features: {
      zh: ['行运相位强度模型', '财富潮汐 · 年度 K 线', '转折点预警 & 建议'],
      en: ['Transit phase strength model', 'Wealth tides — annual K-line', 'Turning-point alerts & guidance']
    },
    tags: ['Astrology', 'Bazi', 'Forecast'],
    emblem: 'fortune',
    demo: 'fortune',
    sampleImage: '/services/fortune.png',
    accentRgba: 'rgba(125, 211, 252, 0.55)'
  },
  {
    slug: 'continuum',
    name: 'Continuum',
    subtitle: { zh: '人格模型 · 亲友留存', en: 'Persona Model' },
    tagline: {
      zh: '用一个人全部的对话与朋友圈,在本地训练出贴近其语气、用词与说话节奏的人格模型,并可接入微信。留住一位亲人、挚友或爱人「说话的样子」—— 全程数据不出本机。',
      en: "Train a local model on a person's full chat & Moments history — the tone, word choice and cadence of a family member, close friend or partner — and optionally connect it back to WeChat. Everything stays on your own machine."
    },
    features: {
      zh: ['本地训练 · 数据不出机', '可接入微信 / 也可纯离线使用', '留住亲人 · 挚友 · 爱人的语气'],
      en: ['Local-only training, data never leaves', 'Optional WeChat link, or fully offline', 'Family, friends or partner — their voice, kept']
    },
    tags: ['LLM', 'On-device', 'Keepsake'],
    emblem: 'continuum',
    demo: 'continuum',
    sampleImage: null, // no public artifact — the demo is the deliverable preview
    accentRgba: 'rgba(167, 139, 250, 0.65)',
    disclaimer: {
      zh: '声明:仅限使用本人,或经当事人 / 直系亲属明确授权的数据;请遵守《个人信息保护法》等当地法律法规及相应平台条款,严禁未经同意采集或冒用他人身份。',
      en: 'Note: for your own data, or data you are explicitly authorized (by the person or immediate family) to use, only. Comply with local data-protection laws and platform terms; never collect or impersonate anyone without consent.'
    }
  },
  {
    slug: 'archive',
    name: 'The Archive',
    subtitle: { zh: '全文档案 · 留存留档', en: 'Encrypted Preservation' },
    tagline: {
      zh: '把 QQ / 微信全量聊天记录、朋友圈、点赞评论原样导出归档。本地加密保存,全文检索。多年后想找某句话,搜一下就在。',
      en: 'Export your full QQ / WeChat history, Moments, likes and comments — preserved locally with encryption and full-text search. Years later, that one line is still findable.'
    },
    features: {
      zh: ['全量原样导出', '本地加密 + PIN 锁', '全文检索 · 按时间漫游'],
      en: ['Lossless full export', 'Local encryption + PIN lock', 'Full-text search & timeline browse']
    },
    tags: ['Archive', 'Encryption', 'Search'],
    emblem: 'archive',
    demo: 'archive',
    sampleImage: '/services/archive.png',
    accentRgba: 'rgba(232, 200, 170, 0.55)'
  },
  // ── Shipped subdomain products (ai / ming / for) ──────────────────────────
  {
    slug: 'ai',
    name: 'AI Relay',
    subtitle: { zh: 'API 中转 · 多模型聚合', en: 'API Relay' },
    tagline: {
      zh: '把 Claude / ChatGPT / DeepSeek 聚合到一个自用接口的中转层:统一密钥、统一调用,按个人需求私下配置 —— 个人自用,不对外分发、不公开转售。',
      en: 'A personal relay that puts Claude / ChatGPT / DeepSeek behind one endpoint for your own use — unified key and calls, privately configured. Personal use only; not distributed or resold.'
    },
    features: {
      zh: ['Claude · ChatGPT · DeepSeek 一站聚合', '统一密钥 · 个人自用配置', '私下接入 · 不公开分发'],
      en: ['Claude · ChatGPT · DeepSeek, one endpoint', 'Unified key, personal configuration', 'Private use — not publicly distributed']
    },
    tags: ['API Gateway', 'Multi-model', 'Personal'],
    emblem: 'relay',
    demo: 'relay',
    sampleImage: null, // live site replaces the static sample
    accentRgba: 'rgba(96, 165, 250, 0.55)',
    visitUrl: 'https://ai.cohenjikan.com'
  },
  {
    slug: 'ming',
    name: 'Ming',
    subtitle: { zh: '自动算命 · 命理推演', en: 'Auto Fortune-Telling' },
    tagline: {
      zh: '自动算命的命理学网站:融合生辰八字、五行、八卦、星盘、星座与塔罗牌,一次输入生成完整命理画像。',
      en: 'An auto fortune-telling site blending Bazi, Wu Xing, the Eight Trigrams, natal charts, zodiac and tarot into one complete reading.'
    },
    features: {
      zh: ['生辰八字 · 五行 · 八卦排盘', '星盘 / 星座 / 塔罗牌综合', '一次输入 · 全自动出报告'],
      en: ['Bazi · Wu Xing · Eight Trigrams', 'Natal chart / zodiac / tarot combined', 'One input · fully automatic report']
    },
    tags: ['Bazi', 'Astrology', 'Tarot'],
    emblem: 'bazi',
    demo: 'bazi',
    sampleImage: null,
    accentRgba: 'rgba(196, 160, 255, 0.55)',
    visitUrl: 'https://ming.cohenjikan.com',
    disclaimer: {
      zh: '声明:本站命理 / 塔罗内容仅供娱乐与文化体验,不构成任何决策依据。请崇尚科学、相信努力,自觉抵制封建迷信,并遵守当地法律法规。',
      en: 'Note: the readings here are for entertainment and cultural curiosity only — not a basis for any decision. Respect science, value effort, reject superstition, and follow local laws.'
    }
  }
];

// ── Section layout ──────────────────────────────────────────────────────────
// The Services list is a two-level fold. Top level is the order the owner asked
// for: shiyun → ai → (the older chat-record suite, collapsed into one group) → ming.
// A 'group' entry expands to reveal its child rows; each child then expands to its
// own demo — hence "二级折叠" (two levels of folding).
export type ServiceEntry =
  | { kind: 'item'; slug: string }
  | {
      kind: 'group';
      id: string;
      title: Localized;
      subtitle: Localized;
      emblem: EmblemId;
      accentRgba: `rgba(${number}, ${number}, ${number}, ${number})`;
      children: string[];
    };

export const serviceLayout: ServiceEntry[] = [
  { kind: 'item', slug: 'shiyun' },
  { kind: 'item', slug: 'ai' },
  {
    kind: 'group',
    id: 'chat-suite',
    title: { zh: '聊天记录系列', en: 'Chat-Record Suite' },
    subtitle: { zh: 'QQ · 微信 · 朋友圈 · 既有副业', en: 'QQ · WeChat · Moments · earlier projects' },
    emblem: 'suite',
    accentRgba: 'rgba(167, 139, 250, 0.5)',
    children: ['echo', 'chronicle', 'fortune', 'continuum', 'archive']
  },
  { kind: 'item', slug: 'ming' }
];

/** slug → ServiceItem, for the layout renderer to resolve entries. */
export const serviceBySlug: Record<string, ServiceItem> = Object.fromEntries(
  services.map((s) => [s.slug, s])
);
