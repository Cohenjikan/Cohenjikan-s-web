import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Locale } from '../../../content/services';

// 12-segment ring with a single slow-orbiting pointer. The center caption updates
// as the pointer crosses each segment, hinting at "transit through houses". One
// full rotation = 24s, so the demo reads as "ambient motion" rather than a busy loop.

const HOUSES_ZH = ['命', '财', '兄', '田', '子', '奴', '夫', '疾', '迁', '官', '友', '相'];
const HOUSES_EN = ['Self', 'Wealth', 'Sib.', 'Home', 'Joy', 'Work', 'Bond', 'Trial', 'Path', 'Honor', 'Kin', 'Soul'];

const SIZE = 200;
const CENTER = SIZE / 2;
const R_OUTER = 88;
const R_INNER = 64;
const R_LABEL = 76;

// One full rotation in ms
const ROTATION_MS = 24000;

export const FortuneDemo = () => {
  const { i18n } = useTranslation();
  const locale = (i18n.language.startsWith('zh') ? 'zh' : 'en') as Locale;
  const labels = locale === 'zh' ? HOUSES_ZH : HOUSES_EN;

  const [angle, setAngle] = useState(0); // degrees, 0 = top (12 o'clock)
  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // pause at a non-zero angle so the layout still feels alive
      setAngle(60);
      return;
    }
    // setInterval-based ticker so rotation continues on visibility-hidden tabs
    // and in preview iframes (rAF is paused there).
    let cancelled = false;
    const start = Date.now();
    const id = window.setInterval(() => {
      if (cancelled) return;
      const elapsed = (Date.now() - start) % ROTATION_MS;
      setAngle((elapsed / ROTATION_MS) * 360);
    }, 60);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  // segment dividers (12 lines at 30° steps)
  const dividers = Array.from({ length: 12 }, (_, i) => {
    const a = ((i / 12) * 360 - 90) * (Math.PI / 180);
    return {
      x1: CENTER + Math.cos(a) * R_INNER,
      y1: CENTER + Math.sin(a) * R_INNER,
      x2: CENTER + Math.cos(a) * R_OUTER,
      y2: CENTER + Math.sin(a) * R_OUTER
    };
  });

  const houseLabels = labels.map((label, i) => {
    // place label at the middle of each segment (i+0.5)
    const a = (((i + 0.5) / 12) * 360 - 90) * (Math.PI / 180);
    const x = CENTER + Math.cos(a) * R_LABEL;
    const y = CENTER + Math.sin(a) * R_LABEL;
    return { label, x, y };
  });

  // active house = whichever segment the pointer is currently inside
  const houseIdx = Math.floor((angle / 360) * 12) % 12;
  const activeLabel = labels[houseIdx];

  const pointerA = (angle - 90) * (Math.PI / 180);
  const pointerOuter = {
    x: CENTER + Math.cos(pointerA) * (R_OUTER - 2),
    y: CENTER + Math.sin(pointerA) * (R_OUTER - 2)
  };
  const pointerInner = {
    x: CENTER + Math.cos(pointerA) * (R_INNER - 6),
    y: CENTER + Math.sin(pointerA) * (R_INNER - 6)
  };

  return (
    <div
      className="flex w-full items-center justify-center rounded-2xl border border-white/10 bg-black/40 p-4 backdrop-blur-sm"
      aria-label="Fortune wheel demo"
    >
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="block h-[200px] w-[200px] text-accent" aria-hidden>
        {/* outer + inner ring */}
        <circle cx={CENTER} cy={CENTER} r={R_OUTER} fill="none" stroke="currentColor" strokeOpacity="0.45" />
        <circle cx={CENTER} cy={CENTER} r={R_INNER} fill="none" stroke="currentColor" strokeOpacity="0.22" />

        {/* segment dividers — major (i%3==0) heavier */}
        {dividers.map((d, i) => (
          <line
            key={i}
            x1={d.x1}
            y1={d.y1}
            x2={d.x2}
            y2={d.y2}
            stroke="currentColor"
            strokeOpacity={i % 3 === 0 ? 0.6 : 0.25}
          />
        ))}

        {/* house labels */}
        {houseLabels.map((h, i) => (
          <text
            key={h.label}
            x={h.x}
            y={h.y}
            fontSize="8"
            fontFamily="'JetBrains Mono', monospace"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="currentColor"
            opacity={i === houseIdx ? 1 : 0.45}
          >
            {h.label}
          </text>
        ))}

        {/* pointer — line + dot at the outer tip */}
        <line
          x1={pointerInner.x}
          y1={pointerInner.y}
          x2={pointerOuter.x}
          y2={pointerOuter.y}
          stroke="rgb(var(--color-accent-2))"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <circle cx={pointerOuter.x} cy={pointerOuter.y} r="2.6" fill="rgb(var(--color-accent-2))" />

        {/* center label */}
        <text
          x={CENTER}
          y={CENTER - 4}
          fontSize="8"
          fontFamily="'JetBrains Mono', monospace"
          textAnchor="middle"
          fill="currentColor"
          opacity="0.55"
          letterSpacing="2"
        >
          {locale === 'zh' ? '现行' : 'TRANSIT'}
        </text>
        <text
          x={CENTER}
          y={CENTER + 12}
          fontSize="16"
          fontFamily="'JetBrains Mono', monospace"
          fontWeight="700"
          textAnchor="middle"
          fill="rgb(var(--color-accent-2))"
        >
          {activeLabel}
        </text>
      </svg>
    </div>
  );
};
