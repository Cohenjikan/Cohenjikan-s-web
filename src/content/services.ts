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
  | 'psyche';

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
   * (ai / ming / for); when set, the expanded drawer shows a "visit site" button.
   * The older side-projects are demo + inquiry only, so they leave this undefined.
   */
  visitUrl?: string;
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
    subtitle: { zh: '人格模型 · 接入微信', en: 'Persona Model' },
    tagline: {
      zh: '用 ta 全部的对话和朋友圈训练一个本地模型,接入微信。语气、用词、说话节奏都保留 —— 数据全程不出本机。',
      en: "Train a local model on someone's full chat & Moments history, then connect it back to WeChat. Tone, word choice and cadence preserved — data never leaves your machine."
    },
    features: {
      zh: ['本地训练 · 数据不出机', '微信账号无缝接入', '可继续对话的「她 / 他」'],
      en: ['Local-only training, data never leaves', 'Seamless WeChat integration', '"Her" / "him", still in conversation']
    },
    tags: ['LLM', 'On-device', 'WeChat Bridge'],
    emblem: 'continuum',
    demo: 'continuum',
    sampleImage: null, // no public artifact — the demo is the deliverable preview
    accentRgba: 'rgba(167, 139, 250, 0.65)'
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
    subtitle: { zh: 'API 中转站 · 多模型聚合', en: 'API Relay Station' },
    tagline: {
      zh: '一个 API 中转站:Claude / ChatGPT / DeepSeek 一站接入,支持 API 分发,直连最新 Opus 4.7、GPT-5.5、DeepSeek V4 Pro 与 Image2。',
      en: 'An API relay: Claude / ChatGPT / DeepSeek behind one endpoint, API reselling supported, with the latest Opus 4.7, GPT-5.5, DeepSeek V4 Pro and Image2.'
    },
    features: {
      zh: ['Claude · ChatGPT · DeepSeek 一键聚合', '支持 API 分发 / 二次售卖', '直连 Opus 4.7 · GPT-5.5 · DeepSeek V4 Pro · Image2'],
      en: ['Claude · ChatGPT · DeepSeek under one key', 'API reselling / distribution', 'Direct: Opus 4.7 · GPT-5.5 · DeepSeek V4 Pro · Image2']
    },
    tags: ['API Gateway', 'Multi-model', 'Reseller'],
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
    visitUrl: 'https://ming.cohenjikan.com'
  },
  {
    slug: 'for',
    name: 'For',
    subtitle: { zh: '心理学分析 · 人格画像', en: 'Psychology Analysis' },
    tagline: {
      zh: '一个心理学分析网站:基于五维人格模型,把性格倾向、情绪与行为模式翻译成可读的画像与建议。',
      en: 'A psychology analysis site: a five-factor model turning personality, emotion and behavior patterns into a readable profile with guidance.'
    },
    features: {
      zh: ['五维人格雷达画像', '情绪与行为模式解读', '可读结论 + 个性化建议'],
      en: ['Five-factor personality radar', 'Emotion & behavior pattern read-out', 'Readable conclusions + tailored advice']
    },
    tags: ['Psychology', 'Profiling', 'Insight'],
    emblem: 'psyche',
    demo: 'psyche',
    sampleImage: null,
    accentRgba: 'rgba(165, 180, 252, 0.55)',
    visitUrl: 'https://for.cohenjikan.com',
    prank: true
  }
];

// ── Section layout ──────────────────────────────────────────────────────────
// The Services list is a two-level fold. Top level is the order the owner asked
// for: ai → (the older chat-record suite, collapsed into one group) → ming → for.
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
  { kind: 'item', slug: 'ming' },
  { kind: 'item', slug: 'for' }
];

/** slug → ServiceItem, for the layout renderer to resolve entries. */
export const serviceBySlug: Record<string, ServiceItem> = Object.fromEntries(
  services.map((s) => [s.slug, s])
);
