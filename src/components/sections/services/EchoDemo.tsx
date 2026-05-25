import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Locale } from '../../../content/services';

// Three metric tiles whose numbers tween from 0 up to their target every time the
// component mounts. After ~1.6s of counting we hold for ~3s, then reset and replay
// — gives the drawer a quiet, repeating "report just finished loading" feel.
//
// Driven by setInterval rather than requestAnimationFrame so the animation runs
// regardless of document visibility (rAF is paused on hidden tabs / iframes).

interface Metric {
  label: { zh: string; en: string };
  caption: { zh: string; en: string };
  target: number;
  /** Suffix shown next to the number (e.g. 次 / pts). Empty for none. */
  unit?: string;
}

const METRICS: Metric[] = [
  { label: { zh: '收到点赞', en: 'Likes' }, caption: { zh: '今年累计', en: 'this year' }, target: 8005 },
  { label: { zh: '收到评论', en: 'Comments' }, caption: { zh: '今年累计', en: 'this year' }, target: 4525 },
  { label: { zh: '真爱粉', en: 'Top fans' }, caption: { zh: '互动 ≥ 30 次', en: '≥ 30 interactions' }, target: 326 }
];

const COUNT_MS = 1600;
const HOLD_MS = 3200;

// eased ease-out-cubic
const ease = (t: number) => 1 - Math.pow(1 - t, 3);

export const EchoDemo = () => {
  const { i18n } = useTranslation();
  const locale = (i18n.language.startsWith('zh') ? 'zh' : 'en') as Locale;

  const [progress, setProgress] = useState(0); // 0..1

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setProgress(1);
      return;
    }
    let cancelled = false;
    const timers: number[] = [];
    const FRAME_MS = 32; // ~30fps, smooth enough for short tweens
    const STEPS = Math.ceil(COUNT_MS / FRAME_MS);

    const runOnce = () => {
      for (let i = 1; i <= STEPS; i++) {
        timers.push(
          window.setTimeout(() => {
            if (!cancelled) setProgress(i / STEPS);
          }, i * FRAME_MS)
        );
      }
      timers.push(
        window.setTimeout(() => {
          if (cancelled) return;
          setProgress(0);
          runOnce();
        }, COUNT_MS + HOLD_MS)
      );
    };
    runOnce();
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, []);

  const eased = ease(progress);

  return (
    <div
      className="grid w-full grid-cols-3 gap-2 rounded-2xl border border-white/10 bg-black/40 p-3 backdrop-blur-sm"
      aria-label="Echo report demo"
    >
      {METRICS.map((m) => {
        const current = Math.round(m.target * eased);
        return (
          <div
            key={m.label.en}
            className="relative overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.02] p-3"
          >
            <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted">{m.label[locale]}</p>
            <p className="mt-2 text-xl font-bold tabular-nums text-text md:text-2xl">
              {current.toLocaleString()}
              {m.unit && <span className="ml-0.5 text-[10px] font-normal text-muted">{m.unit}</span>}
            </p>
            <p className="mt-1.5 text-[10px] text-text/55">{m.caption[locale]}</p>
            {/* progress bar — fades to the metric's accent as it fills */}
            <span
              aria-hidden
              className="absolute inset-x-3 bottom-1.5 block h-px bg-accent2/70 transition-[width] duration-100"
              style={{ width: `${Math.round(eased * 100)}%`, maxWidth: 'calc(100% - 1.5rem)' }}
            />
          </div>
        );
      })}
    </div>
  );
};
