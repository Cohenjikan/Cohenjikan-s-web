import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Locale } from '../../../content/services';

// A faux API-relay console for ai.cohenjikan.com. A request enters on the left and
// is routed to one of several model backends; the active lane lights up, a progress
// bar fills as the response "streams", a token counter ticks up and a one-line reply
// types out. The active model advances every WINDOW_MS so the demo reads as
// "one endpoint, many models, load-balanced".
//
// Driven by a single setInterval computing elapsed time (rAF is paused in hidden
// tabs / preview iframes), matching the other service demos.

interface Model {
  id: string;
  label: string;
  /** equivalent-API latency shown when the response settles */
  latency: string;
  /** tokens counted up while "streaming" */
  tokens: number;
  reply: { zh: string; en: string };
}

const MODELS: Model[] = [
  {
    id: 'claude-opus-4.7',
    label: 'Claude · Opus 4.7',
    latency: '23ms',
    tokens: 1280,
    reply: { zh: '已中转 · 上下文已缓存', en: 'relayed · context cached' }
  },
  {
    id: 'gpt-5.5',
    label: 'OpenAI · GPT-5.5',
    latency: '31ms',
    tokens: 1024,
    reply: { zh: '流式响应 · 按量计费', en: 'streaming · metered billing' }
  },
  {
    id: 'deepseek-v4-pro',
    label: 'DeepSeek · V4 Pro',
    latency: '19ms',
    tokens: 896,
    reply: { zh: '命中低延迟节点', en: 'low-latency node hit' }
  },
  {
    id: 'image2',
    label: 'Image2 · 绘图',
    latency: '0.6s',
    tokens: 512,
    reply: { zh: '已生成 1024×1024 预览', en: 'rendered 1024×1024' }
  }
];

const WINDOW_MS = 2800; // time each model stays active
const TOTAL_MS = WINDOW_MS * MODELS.length;
const ease = (t: number) => 1 - Math.pow(1 - t, 3);

export const RelayDemo = () => {
  const { i18n } = useTranslation();
  const locale = (i18n.language.startsWith('zh') ? 'zh' : 'en') as Locale;

  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // settle on a fully-streamed first model
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

  const activeIdx = Math.min(MODELS.length - 1, Math.floor(elapsed / WINDOW_MS));
  const localT = (elapsed % WINDOW_MS) / WINDOW_MS; // 0..1 within the active window
  const progress = ease(Math.min(1, localT * 1.15));
  const active = MODELS[activeIdx];
  const tokens = Math.round(active.tokens * progress);
  const replyStr = active.reply[locale];
  const typed = replyStr.slice(0, Math.ceil(replyStr.length * Math.min(1, localT * 1.6)));
  const settled = localT > 0.8;

  return (
    <div
      className="w-full overflow-hidden rounded-2xl border border-white/10 bg-black/45 p-4 font-mono backdrop-blur-sm"
      aria-label="API relay demo"
    >
      {/* endpoint header */}
      <div className="mb-3 flex items-center gap-2 border-b border-white/5 pb-2.5">
        <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-400 [animation:relayPulse_1.8s_ease-in-out_infinite]" aria-hidden />
        <span className="truncate text-[11px] text-text/85">ai.cohenjikan.com</span>
        <span className="ml-auto text-[9px] uppercase tracking-[0.2em] text-muted">
          {locale === 'zh' ? 'API 中转 · 在线' : 'relay · online'}
        </span>
      </div>

      {/* request line */}
      <div className="mb-3 flex items-baseline gap-2 text-[11px]">
        <span className="rounded bg-accent2/20 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-accent2">post</span>
        <span className="text-text/70">/v1/messages</span>
        <span className="ml-auto text-muted">model:</span>
        <span className="text-accent">{active.id}</span>
      </div>

      {/* model lanes */}
      <ul className="space-y-1.5">
        {MODELS.map((m, i) => {
          const isActive = i === activeIdx;
          return (
            <li
              key={m.id}
              className={`relative overflow-hidden rounded-lg border px-3 py-2 transition-colors duration-300 ${
                isActive ? 'border-accent2/50 bg-accent2/[0.07]' : 'border-white/[0.06] bg-white/[0.015]'
              }`}
            >
              <div className="flex items-center gap-2 text-[11px]">
                <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${isActive ? 'bg-accent2' : 'bg-white/20'}`} aria-hidden />
                <span className={isActive ? 'text-text' : 'text-text/55'}>{m.label}</span>
                <span className="ml-auto tabular-nums text-[10px] text-muted">
                  {isActive ? (settled ? `${m.latency} · 200` : `${tokens} tok`) : '—'}
                </span>
              </div>
              {/* streaming progress bar — only on the active lane */}
              <span
                aria-hidden
                className="absolute inset-x-0 bottom-0 block h-[2px] bg-accent2/70 transition-[width] duration-100"
                style={{ width: isActive ? `${Math.round(progress * 100)}%` : '0%' }}
              />
            </li>
          );
        })}
      </ul>

      {/* streamed reply */}
      <p className="mt-3 flex items-center gap-2 border-t border-white/5 pt-2.5 text-[11px] text-text/80">
        <span className="text-accent2" aria-hidden>‹/›</span>
        <span className="min-w-0 flex-1 truncate">
          {typed}
          {!settled && <span className="relay-caret ml-0.5 inline-block h-3 w-[2px] -translate-y-px bg-accent2 align-middle" />}
        </span>
      </p>

      <style>{`
        @keyframes relayPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.35; } }
        @keyframes relayCaret { 0%, 50%, 100% { opacity: 1; } 25%, 75% { opacity: 0; } }
        .relay-caret { animation: relayCaret 1s steps(1) infinite; }
        @media (prefers-reduced-motion: reduce) {
          .relay-caret { animation: none; opacity: 1; }
          [aria-label="API relay demo"] [style*="animation"] { animation: none !important; }
        }
      `}</style>
    </div>
  );
};
