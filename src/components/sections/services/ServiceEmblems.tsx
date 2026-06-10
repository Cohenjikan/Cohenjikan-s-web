// Lightweight geometric emblems for each service row — sized at 40px and stroked
// with the accent palette. Keeping them as inline SVG (no external assets) so they
// inherit currentColor and react instantly to theme switches.
import type { SVGProps } from 'react';

export type EmblemId =
  | 'echo'
  | 'chronicle'
  | 'fortune'
  | 'continuum'
  | 'archive'
  | 'relay'
  | 'bazi'
  | 'psyche'
  | 'poetry'
  | 'suite';

interface EmblemProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

const base = (size: number, extra?: string) => ({
  width: size,
  height: size,
  viewBox: '0 0 48 48',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.4,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  className: extra
});

// Echo — concentric ripple rings + center dot. Reads as "broadcast / interaction".
const EchoEmblem = ({ size = 40, className, ...rest }: EmblemProps) => (
  <svg {...base(size, className)} {...rest}>
    <circle cx="24" cy="24" r="3.5" fill="currentColor" stroke="none" />
    <circle cx="24" cy="24" r="8" opacity="0.85" />
    <circle cx="24" cy="24" r="14" opacity="0.55" />
    <circle cx="24" cy="24" r="20" opacity="0.28" />
  </svg>
);

// Chronicle — flowing line of varying heights with a single highlighted peak.
// Mirrors the 时光长河 mockup at icon scale.
const ChronicleEmblem = ({ size = 40, className, ...rest }: EmblemProps) => (
  <svg {...base(size, className)} {...rest}>
    <polyline
      points="6,32 10,28 13,30 16,22 19,26 22,18 25,12 28,20 31,26 34,21 37,28 41,30"
      opacity="0.9"
    />
    <circle cx="25" cy="12" r="2" fill="currentColor" stroke="none" />
    <line x1="6" y1="38" x2="42" y2="38" opacity="0.35" />
  </svg>
);

// Tides of Fortune — zodiac-style ring with 12 tick marks + a single transit dot.
const FortuneEmblem = ({ size = 40, className, ...rest }: EmblemProps) => {
  const ticks = Array.from({ length: 12 }).map((_, i) => {
    const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
    const x1 = 24 + Math.cos(a) * 18;
    const y1 = 24 + Math.sin(a) * 18;
    const x2 = 24 + Math.cos(a) * (i % 3 === 0 ? 14 : 16);
    const y2 = 24 + Math.sin(a) * (i % 3 === 0 ? 14 : 16);
    return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} opacity={i % 3 === 0 ? 0.9 : 0.45} />;
  });
  return (
    <svg {...base(size, className)} {...rest}>
      <circle cx="24" cy="24" r="20" opacity="0.6" />
      <circle cx="24" cy="24" r="11" opacity="0.35" />
      {ticks}
      {/* transit marker */}
      <circle cx={24 + Math.cos(-Math.PI / 3) * 20} cy={24 + Math.sin(-Math.PI / 3) * 20} r="1.8" fill="currentColor" stroke="none" />
    </svg>
  );
};

// Continuum — two overlapping speech bubbles with a tiny spark, hinting at
// "two voices sharing one mind".
const ContinuumEmblem = ({ size = 40, className, ...rest }: EmblemProps) => (
  <svg {...base(size, className)} {...rest}>
    {/* outer bubble */}
    <path d="M9 14 a4 4 0 0 1 4 -4 h17 a4 4 0 0 1 4 4 v9 a4 4 0 0 1 -4 4 h-3 l-4 4 v-4 h-10 a4 4 0 0 1 -4 -4 z" opacity="0.85" />
    {/* inner bubble */}
    <path d="M19 24 a3 3 0 0 1 3 -3 h13 a3 3 0 0 1 3 3 v7 a3 3 0 0 1 -3 3 h-7 l-3 3 v-3 h-3 a3 3 0 0 1 -3 -3 z" opacity="0.5" />
    {/* spark */}
    <path d="M30 18 l1.4 -2.8 l1.4 2.8 l2.8 1.4 l-2.8 1.4 l-1.4 2.8 l-1.4 -2.8 l-2.8 -1.4 z" opacity="0.95" />
  </svg>
);

// Archive — three stacked cards with a small magnifier, reading as "search + file".
const ArchiveEmblem = ({ size = 40, className, ...rest }: EmblemProps) => (
  <svg {...base(size, className)} {...rest}>
    <rect x="8" y="14" width="22" height="6" rx="1.5" opacity="0.45" />
    <rect x="8" y="22" width="22" height="6" rx="1.5" opacity="0.7" />
    <rect x="8" y="30" width="22" height="6" rx="1.5" opacity="0.95" />
    {/* magnifier */}
    <circle cx="35" cy="34" r="5" />
    <line x1="38.7" y1="37.5" x2="42" y2="41" />
  </svg>
);

// Relay (ai) — a central hub dot fanning out to three model nodes. Reads as
// "one endpoint, routed to many models".
const RelayEmblem = ({ size = 40, className, ...rest }: EmblemProps) => (
  <svg {...base(size, className)} {...rest}>
    {/* incoming request node */}
    <circle cx="9" cy="24" r="2.4" fill="currentColor" stroke="none" />
    {/* central relay hub */}
    <circle cx="22" cy="24" r="4.5" opacity="0.9" />
    <line x1="11.4" y1="24" x2="17.5" y2="24" opacity="0.8" />
    {/* fan-out to three model nodes */}
    <line x1="26.5" y1="24" x2="38" y2="13" opacity="0.55" />
    <line x1="26.5" y1="24" x2="38" y2="24" opacity="0.7" />
    <line x1="26.5" y1="24" x2="38" y2="35" opacity="0.55" />
    <circle cx="40" cy="13" r="2.2" fill="currentColor" stroke="none" opacity="0.85" />
    <circle cx="41" cy="24" r="2.2" fill="currentColor" stroke="none" />
    <circle cx="40" cy="35" r="2.2" fill="currentColor" stroke="none" opacity="0.85" />
  </svg>
);

// Bazi (ming) — a single 卦 trigram (three lines, middle broken) inside a ring.
// The most legible shorthand for 命理 / 八卦 at icon scale.
const BaziEmblem = ({ size = 40, className, ...rest }: EmblemProps) => (
  <svg {...base(size, className)} {...rest}>
    <circle cx="24" cy="24" r="19" opacity="0.5" />
    {/* top — solid (yang) */}
    <line x1="14" y1="17" x2="34" y2="17" />
    {/* middle — broken (yin) */}
    <line x1="14" y1="24" x2="21" y2="24" />
    <line x1="27" y1="24" x2="34" y2="24" />
    {/* bottom — solid (yang) */}
    <line x1="14" y1="31" x2="34" y2="31" />
  </svg>
);

// Psyche (for) — a pentagon radar outline with spokes + a small plotted point,
// mirroring the personality-radar demo.
const PsycheEmblem = ({ size = 40, className, ...rest }: EmblemProps) => {
  const pts = Array.from({ length: 5 }).map((_, i) => {
    const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
    return [24 + Math.cos(a) * 17, 24 + Math.sin(a) * 17];
  });
  const poly = pts.map((p) => p.join(',')).join(' ');
  return (
    <svg {...base(size, className)} {...rest}>
      <polygon points={poly} opacity="0.6" />
      {pts.map(([x, y], i) => (
        <line key={i} x1="24" y1="24" x2={x} y2={y} opacity="0.3" />
      ))}
      {/* a plotted sample profile */}
      <polygon points="24,12 38,21 32,36 16,34 11,20" opacity="0.85" />
    </svg>
  );
};

// Poetry (诗云) — a luminous galactic core (4-point sparkle) ringed by a faint
// dynastic shell, with scattered "real-poem" stars wired by dedication arcs.
const PoetryEmblem = ({ size = 40, className, ...rest }: EmblemProps) => (
  <svg {...base(size, className)} {...rest}>
    {/* faint outer shell — a dynasty ring */}
    <circle cx="24" cy="24" r="19" opacity="0.22" />
    {/* dedication arcs threading the core to outer stars */}
    <polyline points="11,13 24,24 39,15" opacity="0.3" />
    <polyline points="13,37 24,24 38,34" opacity="0.3" />
    {/* scattered real-poem stars */}
    <circle cx="11" cy="13" r="1.5" fill="currentColor" stroke="none" opacity="0.85" />
    <circle cx="39" cy="15" r="1.3" fill="currentColor" stroke="none" opacity="0.7" />
    <circle cx="13" cy="37" r="1.4" fill="currentColor" stroke="none" opacity="0.7" />
    <circle cx="38" cy="34" r="1.6" fill="currentColor" stroke="none" opacity="0.85" />
    <circle cx="33" cy="9" r="1" fill="currentColor" stroke="none" opacity="0.5" />
    <circle cx="9" cy="27" r="1" fill="currentColor" stroke="none" opacity="0.5" />
    {/* bright galactic core — 4-point sparkle */}
    <path
      d="M24 14 L25.8 22.2 L34 24 L25.8 25.8 L24 34 L22.2 25.8 L14 24 L22.2 22.2 Z"
      fill="currentColor"
      stroke="none"
      opacity="0.95"
    />
  </svg>
);

// Suite (group) — a small 2×2 stack of rounded tiles, reading as "a collection".
const SuiteEmblem = ({ size = 40, className, ...rest }: EmblemProps) => (
  <svg {...base(size, className)} {...rest}>
    <rect x="11" y="11" width="11" height="11" rx="2" opacity="0.95" />
    <rect x="26" y="11" width="11" height="11" rx="2" opacity="0.6" />
    <rect x="11" y="26" width="11" height="11" rx="2" opacity="0.6" />
    <rect x="26" y="26" width="11" height="11" rx="2" opacity="0.35" />
  </svg>
);

const REGISTRY: Record<EmblemId, (p: EmblemProps) => JSX.Element> = {
  echo: EchoEmblem,
  chronicle: ChronicleEmblem,
  fortune: FortuneEmblem,
  continuum: ContinuumEmblem,
  archive: ArchiveEmblem,
  relay: RelayEmblem,
  bazi: BaziEmblem,
  psyche: PsycheEmblem,
  poetry: PoetryEmblem,
  suite: SuiteEmblem
};

export const ServiceEmblem = ({ id, ...rest }: { id: EmblemId } & EmblemProps) => {
  const C = REGISTRY[id];
  return <C {...rest} />;
};
