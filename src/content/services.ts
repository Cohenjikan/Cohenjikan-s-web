import type { Locale, Localized } from './projects';
import type { EmblemId } from '../components/sections/services/ServiceEmblems';

export type { Locale };

export type DemoId = 'echo' | 'chronicle' | 'fortune' | 'continuum' | 'archive';

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
  }
];
