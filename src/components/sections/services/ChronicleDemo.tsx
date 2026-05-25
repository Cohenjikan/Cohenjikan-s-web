import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Locale } from '../../../content/services';

// A miniature "时光长河" — an SVG sparkline gets drawn out via stroke-dashoffset,
// then a peak marker fades in with a date label. Loops every ~6 seconds.
//
// The series is hand-tuned to roughly mirror the source mockup's silhouette
// (one tall summer peak, smaller spring/winter peaks).

const SERIES: number[] = [
  18, 22, 26, 21, 30, 28, 35, 42, 38, 46, 55, 58, 68, 74, 88, 96, 86, 72, 60, 52,
  48, 44, 50, 46, 42, 38, 34, 30, 26, 22, 20, 24, 30, 26, 22, 18, 20, 24, 22, 18
];

const W = 320;
const H = 110;
const PADDING_X = 8;
const PADDING_Y = 18;
const MAX = Math.max(...SERIES);

const STEP_X = (W - PADDING_X * 2) / (SERIES.length - 1);
const yFor = (v: number) => H - PADDING_Y - (v / MAX) * (H - PADDING_Y * 2);

const PATH = SERIES.map((v, i) => `${i === 0 ? 'M' : 'L'} ${PADDING_X + i * STEP_X} ${yFor(v)}`).join(' ');
const PEAK_IDX = SERIES.indexOf(Math.max(...SERIES));
const PEAK_X = PADDING_X + PEAK_IDX * STEP_X;
const PEAK_Y = yFor(SERIES[PEAK_IDX]);

const DRAW_MS = 2200;
const HOLD_MS = 3000;

export const ChronicleDemo = () => {
  const { i18n } = useTranslation();
  const locale = (i18n.language.startsWith('zh') ? 'zh' : 'en') as Locale;

  const [progress, setProgress] = useState(0);
  const [pathLen, setPathLen] = useState(0);
  const pathRef = useRef<SVGPathElement | null>(null);

  // measure the actual path length once mounted so stroke-dasharray is accurate
  useEffect(() => {
    if (pathRef.current) setPathLen(pathRef.current.getTotalLength());
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setProgress(1);
      return;
    }
    // setTimeout-based ticker so the animation runs even when document is
    // visibility-hidden (rAF is paused in that state).
    let cancelled = false;
    const timers: number[] = [];
    const FRAME_MS = 32;
    const STEPS = Math.ceil(DRAW_MS / FRAME_MS);
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
        }, DRAW_MS + HOLD_MS)
      );
    };
    runOnce();
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, []);

  const drawn = pathLen * progress;
  const peakShown = progress > 0.85;
  const date = locale === 'zh' ? '08-07 · 峰值 1,146 条' : 'Aug 07 · 1,146 msgs';

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl border border-white/10 bg-black/40 p-4 backdrop-blur-sm"
      aria-label="Chronicle demo timeline"
    >
      <div className="mb-2 flex items-baseline justify-between">
        <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted">
          {locale === 'zh' ? '话量时间线 · 2025–2026' : 'Message timeline · 2025–2026'}
        </p>
        <p className="font-mono text-[9px] text-muted">
          {locale === 'zh' ? '采样 40 天' : '40 days'}
        </p>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="block h-[130px] w-full text-accent2"
        preserveAspectRatio="none"
        aria-hidden
      >
        {/* baseline */}
        <line x1={PADDING_X} y1={H - PADDING_Y / 2} x2={W - PADDING_X} y2={H - PADDING_Y / 2} stroke="currentColor" strokeOpacity="0.18" />
        {/* drawn sparkline */}
        <path
          ref={pathRef}
          d={PATH}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={pathLen}
          strokeDashoffset={pathLen - drawn}
        />
        {/* peak marker */}
        {peakShown && (
          <g style={{ animation: 'chroniclePop 380ms ease-out both' }}>
            <circle cx={PEAK_X} cy={PEAK_Y} r="3" fill="currentColor" />
            <circle cx={PEAK_X} cy={PEAK_Y} r="7" fill="none" stroke="currentColor" strokeOpacity="0.4" />
            <line x1={PEAK_X} y1={PEAK_Y - 8} x2={PEAK_X} y2={PEAK_Y - 18} stroke="currentColor" strokeOpacity="0.6" />
          </g>
        )}
      </svg>

      {/* Date label uses the same conditional render as the peak <g> so they
          mount in lockstep — sidesteps a CSS-transition issue we hit where the
          inline opacity stayed at 0 even after peakShown flipped to true. */}
      <p
        className="mt-1 h-[14px] font-mono text-[10px] text-accent2"
        style={{ visibility: peakShown ? 'visible' : 'hidden' }}
      >
        {peakShown ? `↑ ${date}` : ' '}
      </p>

      <style>{`
        @keyframes chroniclePop {
          0%   { transform-origin: ${PEAK_X}px ${PEAK_Y}px; transform: scale(0.4); opacity: 0; }
          60%  { transform: scale(1.15); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          [aria-label="Chronicle demo timeline"] * { animation: none !important; }
        }
      `}</style>
    </div>
  );
};
