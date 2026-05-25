import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Locale } from '../../../content/services';

// A mock full-text search field: the cursor blinks, a query is auto-typed one
// character at a time, then three result rows fade in (highlighted on the matched
// substring), pause, fade out and replay. Loops a short 2-query cycle so the demo
// shows what "search inside an archived conversation" actually feels like.

interface Hit {
  zhDate: string;
  enDate: string;
  zhFull: string;
  enFull: string;
}

interface Query {
  zh: string;
  en: string;
  hits: Hit[];
}

const QUERIES: Query[] = [
  {
    zh: '看海',
    en: 'the sea',
    hits: [
      {
        zhDate: '2019 · 07 · 14',
        enDate: 'Jul 14, 2019',
        zhFull: '说好下个夏天一起去看海。',
        enFull: 'We said next summer we would see the sea together.'
      },
      {
        zhDate: '2021 · 08 · 02',
        enDate: 'Aug 02, 2021',
        zhFull: '今天去看海了,可惜你不在。',
        enFull: 'Went to see the sea today. You should have been there.'
      },
      {
        zhDate: '2024 · 06 · 28',
        enDate: 'Jun 28, 2024',
        zhFull: '又是一个想去看海的下午。',
        enFull: 'Another afternoon when I just wanted to see the sea.'
      }
    ]
  },
  {
    zh: '生日',
    en: 'birthday',
    hits: [
      {
        zhDate: '2020 · 11 · 03',
        enDate: 'Nov 03, 2020',
        zhFull: '生日快乐 · 第七年了。',
        enFull: 'Happy birthday — seventh year now.'
      },
      {
        zhDate: '2022 · 11 · 03',
        enDate: 'Nov 03, 2022',
        zhFull: '今年的生日很安静。',
        enFull: 'Quiet birthday this year.'
      },
      {
        zhDate: '2025 · 11 · 03',
        enDate: 'Nov 03, 2025',
        zhFull: '十二年,记得在朋友圈写下「生日快乐」。',
        enFull: 'Twelve years. Still wrote "happy birthday" on Moments.'
      }
    ]
  }
];

type Stage = 'typing' | 'reveal' | 'hold' | 'fade';

const STAGE_HOLD: Record<Stage, number> = {
  typing: 0, // computed per-character
  reveal: 0, // computed per-hit
  hold: 2600,
  fade: 500
};

const TYPE_MS_PER_CHAR = 110;
const REVEAL_MS_PER_HIT = 280;

const highlight = (full: string, q: string) => {
  if (!q) return [{ text: full, hit: false }];
  const i = full.indexOf(q);
  if (i < 0) return [{ text: full, hit: false }];
  return [
    { text: full.slice(0, i), hit: false },
    { text: q, hit: true },
    { text: full.slice(i + q.length), hit: false }
  ];
};

export const ArchiveDemo = () => {
  const { i18n } = useTranslation();
  const locale = (i18n.language.startsWith('zh') ? 'zh' : 'en') as Locale;

  const [queryIdx, setQueryIdx] = useState(0);
  const [typed, setTyped] = useState(0); // characters revealed of the current query
  const [revealed, setRevealed] = useState(0); // hits visible (0..3)
  const [stage, setStage] = useState<Stage>('typing');

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setTyped(QUERIES[0][locale].length);
      setRevealed(QUERIES[0].hits.length);
      setStage('hold');
      return;
    }
    let cancelled = false;
    const timers: number[] = [];
    const schedule = (ms: number, fn: () => void) => {
      const id = window.setTimeout(() => {
        if (!cancelled) fn();
      }, ms);
      timers.push(id);
    };

    const run = (qIdx: number) => {
      const q = QUERIES[qIdx][locale];
      setQueryIdx(qIdx);
      setTyped(0);
      setRevealed(0);
      setStage('typing');

      // type one character at a time
      for (let i = 1; i <= q.length; i++) {
        schedule(i * TYPE_MS_PER_CHAR, () => setTyped(i));
      }
      const typingDuration = q.length * TYPE_MS_PER_CHAR + 400;

      // reveal hits
      schedule(typingDuration, () => setStage('reveal'));
      for (let i = 1; i <= 3; i++) {
        schedule(typingDuration + i * REVEAL_MS_PER_HIT, () => setRevealed(i));
      }
      const revealDuration = typingDuration + 3 * REVEAL_MS_PER_HIT + 200;

      // hold
      schedule(revealDuration, () => setStage('hold'));
      const holdEnd = revealDuration + STAGE_HOLD.hold;

      // fade
      schedule(holdEnd, () => setStage('fade'));
      const fadeEnd = holdEnd + STAGE_HOLD.fade;

      // restart with next query
      schedule(fadeEnd, () => run((qIdx + 1) % QUERIES.length));
    };
    run(0);

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [locale]);

  const q = QUERIES[queryIdx];
  const queryStr = q[locale];
  const shownQuery = queryStr.slice(0, typed);
  const fading = stage === 'fade';

  return (
    <div
      className="w-full overflow-hidden rounded-2xl border border-white/10 bg-black/40 p-4 backdrop-blur-sm"
      aria-label="Archive search demo"
    >
      {/* search bar */}
      <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-black/40 px-3 py-2 font-mono text-xs">
        <span className="text-muted" aria-hidden>
          ⌕
        </span>
        <span className="min-w-0 flex-1 text-text">
          {shownQuery}
          <span className="archive-caret ml-0.5 inline-block h-3.5 w-[2px] -translate-y-px bg-accent2 align-middle" />
        </span>
        <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted">
          {stage === 'typing' ? (locale === 'zh' ? '检索中' : 'searching') : '14,165'}
        </span>
      </div>

      {/* hits */}
      <ul className={`mt-3 space-y-2 transition-opacity duration-300 ${fading ? 'opacity-0' : 'opacity-100'}`}>
        {q.hits.map((hit, i) => {
          const visible = i < revealed;
          const parts = highlight(locale === 'zh' ? hit.zhFull : hit.enFull, queryStr);
          return (
            <li
              key={i}
              className="archive-hit rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-[12px]"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(4px)',
                transition: 'opacity 320ms ease-out, transform 320ms ease-out',
                transitionDelay: `${i * 60}ms`
              }}
            >
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted">
                {locale === 'zh' ? hit.zhDate : hit.enDate}
              </p>
              <p className="mt-1 text-text/90">
                {parts.map((p, j) =>
                  p.hit ? (
                    <mark key={j} className="rounded bg-accent2/30 px-0.5 text-accent2">
                      {p.text}
                    </mark>
                  ) : (
                    <span key={j}>{p.text}</span>
                  )
                )}
              </p>
            </li>
          );
        })}
      </ul>

      <style>{`
        @keyframes archiveCaret { 0%, 50%, 100% { opacity: 1; } 25%, 75% { opacity: 0; } }
        .archive-caret { animation: archiveCaret 1.1s steps(1) infinite; }
        @media (prefers-reduced-motion: reduce) {
          .archive-caret { animation: none; opacity: 1; }
        }
      `}</style>
    </div>
  );
};
