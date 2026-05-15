import { createContext, lazy, Suspense, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

const Aurora = lazy(() => import('./reactbits/Backgrounds/Aurora/Aurora'));
const Grainient = lazy(() => import('./reactbits/Backgrounds/Grainient/Grainient'));
const ColorBends = lazy(() => import('./reactbits/Backgrounds/ColorBends/ColorBends'));
const Prism = lazy(() => import('./reactbits/Backgrounds/Prism/Prism'));
const Silk = lazy(() => import('./reactbits/Backgrounds/Silk/Silk'));
const Iridescence = lazy(() => import('./reactbits/Backgrounds/Iridescence/Iridescence'));
const Beams = lazy(() => import('./reactbits/Backgrounds/Beams/Beams'));

type Weight = 'light' | 'heavy';

interface BgEntry {
  id: string;
  weight: Weight;
  render: () => JSX.Element;
}

const ENTRIES: BgEntry[] = [
  { id: 'aurora', weight: 'light', render: () => <Aurora colorStops={['#7C3AED', '#22D3EE', '#FF50AA']} amplitude={1.1} blend={0.55} /> },
  { id: 'grainient', weight: 'light', render: () => <Grainient /> },
  { id: 'colorbends', weight: 'light', render: () => <ColorBends /> },
  { id: 'prism', weight: 'heavy', render: () => <Prism animationType="3drotate" timeScale={0.4} glow={1.2} bloom={1.0} /> },
  { id: 'silk', weight: 'heavy', render: () => <Silk color="#5B4FE1" speed={2.5} scale={1.0} noiseIntensity={1.5} /> },
  { id: 'iridescence', weight: 'heavy', render: () => <Iridescence color={[0.45, 0.35, 0.95]} speed={0.7} amplitude={0.08} /> },
  { id: 'beams', weight: 'heavy', render: () => <Beams beamWidth={2} beamHeight={20} beamNumber={14} lightColor="#A78BFA" speed={2} noiseIntensity={1.5} scale={0.2} rotation={45} /> }
];

const STORAGE_KEY = 'cohen.lastBg';
const FADE_MS = 600;
const LIGHT_BACKGROUNDS = new Set(['aurora', 'grainient', 'colorbends']);

interface BackgroundContextValue {
  current: string;
  next: () => void;
  available: string[];
}

const BackgroundContext = createContext<BackgroundContextValue | null>(null);

const pickPool = (): BgEntry[] => {
  if (typeof window === 'undefined') return ENTRIES.filter((e) => e.weight === 'light');
  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  const cores = navigator.hardwareConcurrency ?? 2;
  if (isMobile || cores < 4) return ENTRIES.filter((e) => e.weight === 'light');
  return ENTRIES;
};

const pickRandom = (pool: BgEntry[], exclude?: string): BgEntry => {
  const filtered = exclude ? pool.filter((e) => e.id !== exclude) : pool;
  const arr = filtered.length > 0 ? filtered : pool;
  return arr[Math.floor(Math.random() * arr.length)];
};

const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

interface LayerState {
  entry: BgEntry;
  visible: boolean;
}

export const BackgroundProvider = ({ children }: { children: ReactNode }) => {
  const pool = useMemo(() => pickPool(), []);
  const reduced = useMemo(() => prefersReducedMotion(), []);

  const initial = useMemo(() => {
    const last = typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEY) : null;
    return pickRandom(pool, last ?? undefined);
  }, [pool]);

  // Two layers: render both, fade the active one in and the other one out. When the
  // out layer is fully invisible we drop it (set to null) so its rAF stops.
  const [a, setA] = useState<LayerState>({ entry: initial, visible: true });
  const [b, setB] = useState<LayerState | null>(null);
  const slot = useRef<'a' | 'b'>('a'); // which slot currently owns the visible entry

  useEffect(() => {
    const visibleEntry = slot.current === 'a' ? a.entry : b?.entry;
    if (!visibleEntry) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, visibleEntry.id);
    } catch {
      /* ignore */
    }
  }, [a, b]);

  const next = useCallback(() => {
    const currentSlot = slot.current;
    const currentEntry = currentSlot === 'a' ? a.entry : b?.entry;
    if (!currentEntry) return;
    const candidate = pickRandom(pool, currentEntry.id);
    if (candidate.id === currentEntry.id) return;

    // Mount the incoming layer hidden, give React one paint to commit, then flip
    // both visibility flags so CSS transitions can interpolate.
    if (currentSlot === 'a') {
      setB({ entry: candidate, visible: false });
    } else {
      setA({ entry: candidate, visible: false });
    }

    window.setTimeout(() => {
      if (currentSlot === 'a') {
        setB({ entry: candidate, visible: true });
        setA((curr) => ({ ...curr, visible: false }));
        slot.current = 'b';
      } else {
        setA({ entry: candidate, visible: true });
        setB((curr) => (curr ? { ...curr, visible: false } : null));
        slot.current = 'a';
      }
    }, 40);
  }, [pool, a, b]);

  const current = slot.current === 'a' ? a.entry.id : (b?.entry.id ?? a.entry.id);
  const tone = LIGHT_BACKGROUNDS.has(current) ? 'light' : 'dark';

  useEffect(() => {
    document.documentElement.dataset.bgCurrent = current;
    document.documentElement.dataset.bgTone = tone;
  }, [current, tone]);

  const ctx = useMemo<BackgroundContextValue>(
    () => ({ current, next, available: pool.map((p) => p.id) }),
    [current, next, pool]
  );

  return (
    <BackgroundContext.Provider value={ctx}>
      {/* base color so there is never an unstyled flash */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-20"
        style={{ background: 'radial-gradient(circle at center, rgb(var(--color-surface)) 0%, rgb(var(--color-bg)) 100%)' }}
      />
      <BgLayer state={a} fadeMs={FADE_MS} />
      <BgLayer state={b} fadeMs={FADE_MS} />
      {children}
    </BackgroundContext.Provider>
  );
};

const BgLayer = ({ state, fadeMs }: { state: LayerState | null; fadeMs: number }) => {
  if (!state) return null;
  return (
    <div
      aria-hidden
      data-bg-id={state.entry.id}
      data-bg-visible={state.visible ? '1' : '0'}
      className="pointer-events-none fixed inset-0 -z-10"
      style={{
        opacity: state.visible ? 1 : 0,
        filter: state.visible ? 'blur(0px)' : 'blur(20px)',
        transition: `opacity ${fadeMs}ms ease, filter ${fadeMs}ms ease`
      }}
    >
      <Suspense fallback={null}>{state.entry.render()}</Suspense>
    </div>
  );
};

export const useBackground = (): BackgroundContextValue => {
  const v = useContext(BackgroundContext);
  if (!v) throw new Error('useBackground must be used inside <BackgroundProvider>');
  return v;
};
