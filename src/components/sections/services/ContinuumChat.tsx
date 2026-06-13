import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Locale } from '../../../content/services';

// A scripted dialogue that loops on its own. Driven by a React phase machine rather
// than CSS animation-delay so bubbles render in normal flex flow (no absolute
// positioning) — the previous version overlaid an absolutely-positioned typing
// indicator on top of the message stream and pushed the header / footer out of
// view. This rewrite mounts each bubble (and the typing indicator) only when its
// phase is active, so layout is always predictable.
//
// Phase legend:
//   0 idle / reset
//   1 user 1 visible
//   2 + AI typing
//   3 + AI 1 visible (typing hidden)
//   4 + user 2 visible
//   5 + AI typing
//   6 + AI 2 visible
//   7 hold (full transcript) before loop

const SCRIPT: { phase: number; hold: number }[] = [
  { phase: 1, hold: 1400 },
  { phase: 2, hold: 1200 },
  { phase: 3, hold: 1800 },
  { phase: 4, hold: 1600 },
  { phase: 5, hold: 1200 },
  { phase: 6, hold: 2200 },
  { phase: 7, hold: 2600 },
  { phase: 0, hold: 700 }
];

const DIALOGUE = {
  zh: {
    u1: '在吗?',
    a1: '嗯,在的。',
    u2: '好像很久没说话了。',
    a2: '记得啊 —— 那些年的事,我都还记得。',
    header: '亲友 · Continuum',
    status: '本地模型 · 在线',
    footer: '本地推理 · 数据不出本机'
  },
  en: {
    u1: 'You there?',
    a1: 'Mm — always.',
    u2: "It's been a while, hasn't it.",
    a2: 'Of course — I still remember all those years.',
    header: 'Someone close · Continuum',
    status: 'local model · online',
    footer: 'on-device inference · data never leaves'
  }
};

const UserBubble = ({ children }: { children: React.ReactNode }) => (
  <div className="flex justify-end">
    <span className="continuum-fade-in max-w-[78%] rounded-2xl rounded-br-md bg-accent2/85 px-3.5 py-2 text-[13px] leading-snug text-black">
      {children}
    </span>
  </div>
);

const AiBubble = ({ children }: { children: React.ReactNode }) => (
  <div className="flex justify-start">
    <span className="continuum-fade-in max-w-[78%] rounded-2xl rounded-bl-md bg-white/10 px-3.5 py-2 text-[13px] leading-snug text-text">
      {children}
    </span>
  </div>
);

const TypingBubble = () => (
  <div className="flex justify-start">
    <span className="continuum-fade-in flex items-center gap-1 rounded-2xl rounded-bl-md bg-white/10 px-3.5 py-2.5">
      <span className="block h-1.5 w-1.5 rounded-full bg-text/60 [animation:typingPulse_1.2s_ease-in-out_infinite]" />
      <span className="block h-1.5 w-1.5 rounded-full bg-text/60 [animation:typingPulse_1.2s_ease-in-out_infinite_0.2s]" />
      <span className="block h-1.5 w-1.5 rounded-full bg-text/60 [animation:typingPulse_1.2s_ease-in-out_infinite_0.4s]" />
    </span>
  </div>
);

export const ContinuumChat = () => {
  const { i18n } = useTranslation();
  const locale = (i18n.language.startsWith('zh') ? 'zh' : 'en') as Locale;
  const d = DIALOGUE[locale];

  const [phase, setPhase] = useState(0);

  useEffect(() => {
    // honor reduced motion — settle on the full transcript with no scripted timing
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPhase(7);
      return;
    }
    let cancelled = false;
    let step = 0;
    const tick = () => {
      if (cancelled) return;
      const { phase: p, hold } = SCRIPT[step];
      setPhase(p);
      step = (step + 1) % SCRIPT.length;
      window.setTimeout(tick, hold);
    };
    // a small initial pause so users get a beat before the dialogue starts
    const id = window.setTimeout(tick, 350);
    return () => {
      cancelled = true;
      window.clearTimeout(id);
    };
  }, []);

  return (
    <div
      className="continuum-chat relative mx-auto w-full max-w-sm overflow-hidden rounded-2xl border border-white/10 bg-black/60 p-4 backdrop-blur-md"
      aria-label="Continuum demo conversation"
    >
      {/* faux header */}
      <div className="mb-4 flex items-center gap-3 border-b border-white/5 pb-3">
        <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-violet-400/70 to-sky-400/60">
          <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-black/80 bg-emerald-400" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-text">{d.header}</p>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">{d.status}</p>
        </div>
      </div>

      {/* message stream — fixed height so the layout stays put as bubbles enter/exit */}
      <div className="flex h-[240px] flex-col gap-2.5 overflow-hidden">
        {phase >= 1 && <UserBubble key="u1">{d.u1}</UserBubble>}
        {phase === 2 && <TypingBubble key="t1" />}
        {phase >= 3 && <AiBubble key="a1">{d.a1}</AiBubble>}
        {phase >= 4 && <UserBubble key="u2">{d.u2}</UserBubble>}
        {phase === 5 && <TypingBubble key="t2" />}
        {phase >= 6 && <AiBubble key="a2">{d.a2}</AiBubble>}
      </div>

      <p className="mt-3 border-t border-white/5 pt-3 text-center font-mono text-[10px] uppercase tracking-[0.22em] text-muted/70">
        {d.footer}
      </p>

      <style>{`
        @keyframes continuumFadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .continuum-fade-in {
          animation: continuumFadeIn 360ms ease-out both;
        }
        @keyframes typingPulse {
          0%, 80%, 100% { opacity: 0.3; transform: translateY(0); }
          40% { opacity: 1; transform: translateY(-2px); }
        }
        @media (prefers-reduced-motion: reduce) {
          .continuum-fade-in { animation: none !important; }
        }
      `}</style>
    </div>
  );
};
