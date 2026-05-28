import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Locale } from '../../../content/services';

// A personality radar for for.cohenjikan.com. A 5-axis (Big-Five-style) profile is
// plotted, drawing outward from the center, holds, then morphs to the next profile.
// Each profile carries a one-line interpretation. Loops.
//
// Timer-driven (setTimeout) so it keeps animating on hidden tabs / preview iframes.

const AXES = [
  { zh: '开放', en: 'Openness' },
  { zh: '尽责', en: 'Consc.' },
  { zh: '外向', en: 'Extrav.' },
  { zh: '宜人', en: 'Agree.' },
  { zh: '稳定', en: 'Stability' }
];

interface Profile {
  values: number[]; // 0..1 per axis, same order as AXES
  insight: { zh: string; en: string };
}

const PROFILES: Profile[] = [
  {
    values: [0.92, 0.82, 0.42, 0.6, 0.72],
    insight: { zh: '高开放 · 高尽责 → 深度创造型', en: 'High openness & conscientiousness → deep creative work' }
  },
  {
    values: [0.6, 0.55, 0.88, 0.9, 0.5],
    insight: { zh: '高外向 · 高宜人 → 团队协作型', en: 'High extraversion & agreeableness → team collaborator' }
  }
];

const SIZE_W = 220;
const SIZE_H = 188;
const CX = SIZE_W / 2;
const CY = 92;
const R = 60;
const R_LABEL = R + 16;

const DRAW_MS = 1100;
const HOLD_MS = 2800;
const ease = (t: number) => 1 - Math.pow(1 - t, 3);

// unit direction per axis (top, then clockwise)
const DIRS = AXES.map((_, i) => {
  const a = (i / AXES.length) * Math.PI * 2 - Math.PI / 2;
  return { cos: Math.cos(a), sin: Math.sin(a) };
});

const ringPoints = (scale: number) =>
  DIRS.map((d) => `${CX + d.cos * R * scale},${CY + d.sin * R * scale}`).join(' ');

export const PsycheDemo = () => {
  const { i18n } = useTranslation();
  const locale = (i18n.language.startsWith('zh') ? 'zh' : 'en') as Locale;

  const [profileIdx, setProfileIdx] = useState(0);
  const [progress, setProgress] = useState(0); // 0..1 draw-in

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setProgress(1);
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
    const FRAME = 32;
    const steps = Math.ceil(DRAW_MS / FRAME);

    const runOnce = (idx: number) => {
      setProfileIdx(idx);
      setProgress(0);
      for (let i = 1; i <= steps; i++) schedule(i * FRAME, () => setProgress(i / steps));
      schedule(DRAW_MS + HOLD_MS, () => runOnce((idx + 1) % PROFILES.length));
    };
    runOnce(0);

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, []);

  const p = ease(progress);
  const profile = PROFILES[profileIdx];

  const dataPoints = DIRS.map((d, i) => {
    const v = profile.values[i] * p;
    return { x: CX + d.cos * R * v, y: CY + d.sin * R * v };
  });
  const dataPoly = dataPoints.map((pt) => `${pt.x},${pt.y}`).join(' ');

  return (
    <div
      className="w-full overflow-hidden rounded-2xl border border-white/10 bg-black/45 p-4 backdrop-blur-sm"
      aria-label="Psychology radar demo"
    >
      <div className="mb-1 flex items-baseline justify-between">
        <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted">
          {locale === 'zh' ? '人格画像' : 'Personality profile'}
        </p>
        <p className="font-mono text-[9px] text-muted">{locale === 'zh' ? '五维模型' : 'five-factor'}</p>
      </div>

      <svg viewBox={`0 0 ${SIZE_W} ${SIZE_H}`} className="block h-[188px] w-full text-accent2" aria-hidden>
        {/* grid rings */}
        {[0.5, 1].map((s) => (
          <polygon key={s} points={ringPoints(s)} fill="none" stroke="currentColor" strokeOpacity="0.16" />
        ))}
        {/* spokes */}
        {DIRS.map((d, i) => (
          <line
            key={i}
            x1={CX}
            y1={CY}
            x2={CX + d.cos * R}
            y2={CY + d.sin * R}
            stroke="currentColor"
            strokeOpacity="0.16"
          />
        ))}

        {/* data polygon */}
        <polygon points={dataPoly} fill="rgb(var(--color-accent-2) / 0.18)" stroke="rgb(var(--color-accent-2))" strokeWidth="1.5" strokeLinejoin="round" />
        {dataPoints.map((pt, i) => (
          <circle key={i} cx={pt.x} cy={pt.y} r="2.4" fill="rgb(var(--color-accent-2))" />
        ))}

        {/* axis labels */}
        {AXES.map((ax, i) => {
          const d = DIRS[i];
          const x = CX + d.cos * R_LABEL;
          const y = CY + d.sin * R_LABEL;
          const anchor = x < CX - 4 ? 'end' : x > CX + 4 ? 'start' : 'middle';
          return (
            <text
              key={ax.en}
              x={x}
              y={y}
              fontSize="8"
              fontFamily="'JetBrains Mono', monospace"
              textAnchor={anchor}
              dominantBaseline="middle"
              fill="currentColor"
              opacity="0.6"
            >
              {ax[locale]}
            </text>
          );
        })}
      </svg>

      <p className="mt-1 border-t border-white/5 pt-2.5 text-center font-mono text-[10px] tracking-wide text-accent2">
        {profile.insight[locale]}
      </p>
    </div>
  );
};
