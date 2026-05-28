import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Locale } from '../../../content/services';

// A 八字排盘 (Four Pillars) cast for ming.cohenjikan.com. The four pillars flip in
// one at a time (年→月→日→时, 天干 over 地支), then the 五行 strength bars grow and a
// one-line verdict resolves. The whole cast replays on a loop.
//
// Timer-driven (setTimeout) so it keeps running on hidden tabs / preview iframes,
// matching the other service demos.

interface Pillar {
  label: { zh: string; en: string };
  gan: string; // 天干
  zhi: string; // 地支
}

const PILLARS: Pillar[] = [
  { label: { zh: '年', en: 'Yr' }, gan: '甲', zhi: '辰' },
  { label: { zh: '月', en: 'Mo' }, gan: '丙', zhi: '寅' },
  { label: { zh: '日', en: 'Day' }, gan: '丙', zhi: '午' }, // 日主 丙火
  { label: { zh: '时', en: 'Hr' }, gan: '戊', zhi: '戌' }
];

interface Element {
  zh: string;
  en: string;
  /** 0..1 relative strength in this chart */
  strength: number;
  color: string;
}

// 木火土偏旺, 缺金水 — drives the "favors Water & Metal" verdict below.
const ELEMENTS: Element[] = [
  { zh: '木', en: 'Wood', strength: 0.62, color: 'rgb(110 231 183)' },
  { zh: '火', en: 'Fire', strength: 0.9, color: 'rgb(248 145 130)' },
  { zh: '土', en: 'Earth', strength: 0.72, color: 'rgb(226 190 120)' },
  { zh: '金', en: 'Metal', strength: 0.2, color: 'rgb(203 213 225)' },
  { zh: '水', en: 'Water', strength: 0.16, color: 'rgb(125 211 252)' }
];

const CAST_GAP = 480; // ms between pillars
const BARS_MS = 1000; // bars grow window
const HOLD_MS = 2600;

const ease = (t: number) => 1 - Math.pow(1 - t, 3);

export const BaziDemo = () => {
  const { i18n } = useTranslation();
  const locale = (i18n.language.startsWith('zh') ? 'zh' : 'en') as Locale;

  const [cast, setCast] = useState(0); // how many pillars are revealed (0..4)
  const [bars, setBars] = useState(0); // 0..1 bar growth

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCast(PILLARS.length);
      setBars(1);
      return;
    }
    let cancelled = false;
    const timers: number[] = [];
    const schedule = (ms: number, fn: () => void) => {
      timers.push(
        window.setTimeout(() => {
          if (!cancelled) fn();
        }, ms)
      );
    };

    const runOnce = () => {
      setCast(0);
      setBars(0);
      // cast each pillar
      for (let i = 1; i <= PILLARS.length; i++) schedule(i * CAST_GAP, () => setCast(i));
      const castEnd = PILLARS.length * CAST_GAP + 200;
      // grow bars
      const FRAME = 32;
      const steps = Math.ceil(BARS_MS / FRAME);
      for (let i = 1; i <= steps; i++) schedule(castEnd + i * FRAME, () => setBars(i / steps));
      // hold then replay
      schedule(castEnd + BARS_MS + HOLD_MS, runOnce);
    };
    runOnce();

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, []);

  const barEase = ease(bars);
  const ready = cast >= PILLARS.length && bars > 0.9;

  return (
    <div
      className="w-full overflow-hidden rounded-2xl border border-white/10 bg-black/45 p-4 backdrop-blur-sm"
      aria-label="Bazi chart demo"
    >
      <div className="mb-3 flex items-baseline justify-between">
        <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted">
          {locale === 'zh' ? '八字排盘' : 'Four Pillars'}
        </p>
        <p className="font-mono text-[9px] text-muted">
          {locale === 'zh' ? '生辰八字 · 五行' : 'Bazi · Wu Xing'}
        </p>
      </div>

      {/* four pillars */}
      <div className="grid grid-cols-4 gap-2">
        {PILLARS.map((p, i) => {
          const shown = i < cast;
          const isDay = i === 2;
          return (
            <div key={p.label.en} className="text-center">
              <p className="mb-1 font-mono text-[9px] uppercase tracking-[0.15em] text-muted">{p.label[locale]}</p>
              <div
                className={`bazi-pillar rounded-lg border py-2 ${
                  isDay ? 'border-accent2/50 bg-accent2/[0.08]' : 'border-white/10 bg-white/[0.02]'
                }`}
                style={{
                  opacity: shown ? 1 : 0,
                  transform: shown ? 'rotateX(0deg)' : 'rotateX(-90deg)',
                  transition: 'opacity 360ms ease-out, transform 420ms cubic-bezier(0.25,1,0.5,1)'
                }}
              >
                <span className={`block text-lg font-bold leading-none ${isDay ? 'text-accent2' : 'text-text'}`}>{p.gan}</span>
                <span className="mt-1 block text-base leading-none text-text/75">{p.zhi}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* five-element strength bars */}
      <div className="mt-4 flex h-[72px] items-end justify-between gap-2">
        {ELEMENTS.map((el) => {
          const h = 8 + el.strength * barEase * 56; // px
          return (
            <div key={el.zh} className="flex flex-1 flex-col items-center justify-end gap-1">
              <span
                className="w-full max-w-[26px] rounded-t-sm transition-[height] duration-100"
                style={{ height: `${h}px`, background: el.color, opacity: 0.85 }}
                aria-hidden
              />
              <span className="font-mono text-[10px] text-text/70">{locale === 'zh' ? el.zh : el.en}</span>
            </div>
          );
        })}
      </div>

      {/* verdict */}
      <p
        className="mt-3 border-t border-white/5 pt-2.5 text-center font-mono text-[10px] tracking-wide text-accent2 transition-opacity duration-500"
        style={{ opacity: ready ? 1 : 0.25 }}
      >
        {locale === 'zh' ? '日主 丙火 · 身旺 · 喜用 水 / 金' : 'Day Master Bing-Fire · strong · favors Water / Metal'}
      </p>

      <style>{`
        @media (prefers-reduced-motion: reduce) {
          .bazi-pillar { transition: none !important; transform: none !important; opacity: 1 !important; }
        }
      `}</style>
    </div>
  );
};
