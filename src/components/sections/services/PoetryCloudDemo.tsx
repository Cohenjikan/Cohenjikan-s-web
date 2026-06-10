import { useEffect, useState, type CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import type { Locale } from '../../../content/services';

// A scripted preview of 诗云 / Poetry Cloud. The core idea: a poem is never stored —
// you "click the void", an 80–200-digit catalog address streams out, and the
// index↔poem bijection `unrank`s it into a *real* poem that materializes line by
// line over a star field. The demo cycles through a few famous poems, each window
// running address-stream → unrank → reveal, then loops.
//
// Driven by a single setInterval over elapsed time (rAF is paused in hidden tabs /
// preview iframes), matching the other service demos.

interface Poem {
  form: { zh: string; en: string };
  poet: string;
  title: string;
  lines: string[];
  /** The (truncated, illustrative) catalog address — its length is the point. */
  addr: string;
}

const POEMS: Poem[] = [
  {
    form: { zh: '五绝', en: '5-char quatrain' },
    poet: '李白',
    title: '静夜思',
    lines: ['床前明月光', '疑是地上霜', '举头望明月', '低头思故乡'],
    addr:
      '8374650192837465019283746650182937465019283746501982374650192837465018273746501928374650198237465012837465019283746501'
  },
  {
    form: { zh: '五绝', en: '5-char quatrain' },
    poet: '王之涣',
    title: '登鹳雀楼',
    lines: ['白日依山尽', '黄河入海流', '欲穷千里目', '更上一层楼'],
    addr:
      '5012938476501293847665019238476501293847650192384765019283746501928374650192837465019283746501928374650192837465019237'
  },
  {
    form: { zh: '七绝', en: '7-char quatrain' },
    poet: '李白',
    title: '望庐山瀑布 · 其二',
    lines: ['日照香炉生紫烟', '遥看瀑布挂前川', '飞流直下三千尺', '疑是银河落九天'],
    addr:
      '9182736450918273645091827364509182736645091827364509182736450918273645091827364509182736450918273645091827364509182736405'
  }
];

const WINDOW_MS = 5400; // time each poem holds the stage
const TOTAL_MS = WINDOW_MS * POEMS.length;
const ADDR_PHASE = 0.34; // fraction of the window spent streaming the address
const ease = (t: number) => 1 - Math.pow(1 - t, 3);

// A handful of decorative background stars at fixed positions (deterministic so the
// layout is stable across renders). Twinkle is pure CSS.
const STARS = [
  { x: 8, y: 18, s: 1.5, d: 0 },
  { x: 22, y: 70, s: 1, d: 0.7 },
  { x: 37, y: 30, s: 2, d: 1.4 },
  { x: 52, y: 80, s: 1, d: 0.4 },
  { x: 66, y: 22, s: 1.5, d: 1.1 },
  { x: 78, y: 62, s: 1, d: 0.2 },
  { x: 90, y: 38, s: 2, d: 0.9 },
  { x: 15, y: 48, s: 1, d: 1.7 },
  { x: 84, y: 14, s: 1, d: 0.5 },
  { x: 60, y: 50, s: 1.5, d: 1.3 }
];

export const PoetryCloudDemo = () => {
  const { i18n } = useTranslation();
  const locale = (i18n.language.startsWith('zh') ? 'zh' : 'en') as Locale;

  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // settle on the first poem fully unranked
      setElapsed(WINDOW_MS - 1);
      return;
    }
    let cancelled = false;
    const start = Date.now();
    const id = window.setInterval(() => {
      if (cancelled) return;
      setElapsed((Date.now() - start) % TOTAL_MS);
    }, 60);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  const idx = Math.min(POEMS.length - 1, Math.floor(elapsed / WINDOW_MS));
  const localT = (elapsed % WINDOW_MS) / WINDOW_MS; // 0..1 within the active window
  const poem = POEMS[idx];

  // Phase 1 — stream the catalog address.
  const addrT = Math.min(1, localT / ADDR_PHASE);
  const addrShown = poem.addr.slice(0, Math.floor(ease(addrT) * poem.addr.length));
  const streaming = localT < ADDR_PHASE;

  // Phase 2 — unrank, then reveal the poem line by line.
  const revealT = Math.max(0, (localT - ADDR_PHASE) / 0.5); // lines fully out by ~0.84
  const linesShown = Math.min(poem.lines.length, Math.ceil(revealT * poem.lines.length));
  const unranked = localT >= ADDR_PHASE;
  const complete = linesShown >= poem.lines.length;

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl border border-white/10 bg-black/55 font-mono backdrop-blur-sm"
      aria-label="Poetry Cloud demo"
      style={{ '--pc-accent': 'rgb(94, 234, 212)' } as CSSProperties}
    >
      {/* status header */}
      <div className="flex items-center gap-2 border-b border-white/5 px-4 py-2.5">
        <span className="h-2 w-2 shrink-0 rounded-full bg-[color:var(--pc-accent)] [animation:pcPulse_1.8s_ease-in-out_infinite]" aria-hidden />
        <span className="truncate text-[11px] text-text/85">shiyun.cohenjikan.com</span>
        <span className="ml-auto text-[9px] uppercase tracking-[0.2em] text-muted">
          {locale === 'zh' ? '诗云 · 在线' : 'poetry cloud · live'}
        </span>
      </div>

      {/* star-field stage */}
      <div className="relative min-h-[226px] overflow-hidden px-4 py-3.5">
        {/* decorative stars + nebula glow */}
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <span className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(94,234,212,0.10),rgba(167,139,250,0.06)_45%,transparent_70%)] blur-md" />
          {STARS.map((st, i) => (
            <span
              key={i}
              className="pc-star absolute rounded-full bg-white"
              style={{
                left: `${st.x}%`,
                top: `${st.y}%`,
                width: st.s,
                height: st.s,
                animationDelay: `${st.d}s`
              }}
            />
          ))}
        </div>

        <div className="relative">
          {/* address line — the catalog address being computed */}
          <div className="mb-1 flex items-center gap-2 text-[9px] uppercase tracking-[0.18em] text-muted">
            <span className="rounded border border-[color:var(--pc-accent)]/40 bg-[color:var(--pc-accent)]/10 px-1.5 py-0.5 text-[color:var(--pc-accent)]">
              {poem.form[locale]}
            </span>
            <span>{locale === 'zh' ? '编号 · 地址' : 'index · address'}</span>
            <span className="ml-auto tabular-nums text-muted/70">
              {addrShown.length}
              {locale === 'zh' ? ' 位' : ' digits'}
            </span>
          </div>
          {/* fixed-height address box, bottom-anchored so digits scroll up as they stream */}
          <div className="flex h-[34px] items-end overflow-hidden rounded-lg border border-white/10 bg-black/40 px-2 py-1">
            <p className="break-all text-[10px] leading-[1.35] text-text/55">
              {addrShown}
              {streaming && (
                <span className="pc-caret ml-px inline-block h-2.5 w-[2px] -translate-y-px bg-[color:var(--pc-accent)] align-middle" />
              )}
            </p>
          </div>

          {/* unrank indicator */}
          <div className="my-2 flex items-center gap-2 text-[9px] uppercase tracking-[0.2em]">
            <span className={`h-px flex-1 transition-colors duration-500 ${unranked ? 'bg-[color:var(--pc-accent)]/40' : 'bg-white/10'}`} />
            <span className={`transition-colors duration-500 ${unranked ? 'text-[color:var(--pc-accent)]' : 'text-muted/50'}`}>
              {unranked ? 'unrank ↓' : 'unrank'}
            </span>
            <span className={`h-px flex-1 transition-colors duration-500 ${unranked ? 'bg-[color:var(--pc-accent)]/40' : 'bg-white/10'}`} />
          </div>

          {/* the unranked poem — real, materializing line by line */}
          <div className="min-h-[88px] text-center">
            <div className="space-y-0.5 font-serif text-[15px] leading-[1.7] tracking-[0.12em] text-amber-50/95">
              {poem.lines.map((line, i) => (
                <p
                  key={line}
                  className="transition-all duration-500"
                  style={{
                    opacity: i < linesShown ? 1 : 0,
                    transform: i < linesShown ? 'translateY(0)' : 'translateY(4px)',
                    textShadow: i < linesShown ? '0 0 12px rgba(94,234,212,0.35)' : 'none'
                  }}
                >
                  {line}
                </p>
              ))}
            </div>
            <p
              className="mt-2 text-[10px] tracking-[0.15em] text-muted transition-opacity duration-500"
              style={{ opacity: complete ? 1 : 0 }}
            >
              — {poem.poet}《{poem.title}》
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pcPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.35; } }
        @keyframes pcCaret { 0%, 50%, 100% { opacity: 1; } 25%, 75% { opacity: 0; } }
        @keyframes pcTwinkle { 0%, 100% { opacity: 0.25; } 50% { opacity: 0.9; } }
        .pc-caret { animation: pcCaret 1s steps(1) infinite; }
        .pc-star { opacity: 0.5; animation: pcTwinkle 3.2s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .pc-caret, .pc-star { animation: none; }
          [aria-label="Poetry Cloud demo"] [style*="animation"] { animation: none !important; }
        }
      `}</style>
    </div>
  );
};
