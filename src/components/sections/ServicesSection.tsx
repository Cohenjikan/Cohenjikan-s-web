import { useState, type CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  serviceLayout,
  serviceBySlug,
  type Locale,
  type DemoId,
  type ServiceItem
} from '../../content/services';
import { SectionLabel } from './SectionLabel';
import { ServiceEmblem } from './services/ServiceEmblems';
import { ContinuumChat } from './services/ContinuumChat';
import { EchoDemo } from './services/EchoDemo';
import { ChronicleDemo } from './services/ChronicleDemo';
import { FortuneDemo } from './services/FortuneDemo';
import { ArchiveDemo } from './services/ArchiveDemo';
import { RelayDemo } from './services/RelayDemo';
import { BaziDemo } from './services/BaziDemo';
import { PoetryCloudDemo } from './services/PoetryCloudDemo';
import { ImageLightbox } from './services/ImageLightbox';

// Services sits between About and Projects in the page rhythm, but its visual
// weight is intentionally LOWER than Projects: a single-column compact list,
// no hero images by default, each row unfolds an inline drawer with a small
// scripted demo + (optionally) a clickable sample screenshot.
//
// The list is a TWO-LEVEL fold (二级折叠): the shipped subdomain products
// (ai / ming / for) sit at the top level, while the older chat-record projects are
// collapsed into one "suite" group that expands to reveal them — and each of those
// then expands to its own demo. Order is driven by `serviceLayout`.

// Map demo IDs to their components. Kept here rather than in services.ts so the
// data layer stays string-typed and the component imports are colocated.
const DEMO_REGISTRY: Record<DemoId, () => JSX.Element> = {
  echo: EchoDemo,
  chronicle: ChronicleDemo,
  fortune: FortuneDemo,
  continuum: ContinuumChat,
  archive: ArchiveDemo,
  relay: RelayDemo,
  bazi: BaziDemo,
  poetry: PoetryCloudDemo
};

interface RowProps {
  s: ServiceItem;
  isOpen: boolean;
  onToggle: () => void;
  onOpenLightbox: (img: { src: string; alt: string }) => void;
  onInquire: (e: React.MouseEvent | React.KeyboardEvent) => void;
  locale: Locale;
}

// A single collapsible service row + its inline drawer. Reused for both the
// top-level product rows and the nested children inside the suite group.
const ServiceRow = ({ s, isOpen, onToggle, onOpenLightbox, onInquire, locale }: RowProps) => {
  const { t } = useTranslation();
  const Demo = DEMO_REGISTRY[s.demo];
  return (
    <li>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`service-panel-${s.slug}`}
        className="group flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-white/[0.03] focus:outline-none focus-visible:bg-white/[0.04] md:px-6 md:py-5"
        style={{ '--service-accent': s.accentRgba } as CSSProperties}
      >
        <span
          className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-text/85 transition-all group-hover:border-[color:var(--service-accent)] group-hover:text-text"
          aria-hidden
        >
          <ServiceEmblem id={s.emblem} size={26} />
        </span>

        <span className="min-w-0 flex-1">
          <span className="flex items-baseline gap-3">
            <span className="text-base font-bold text-text md:text-lg">{s.name}</span>
            <span className="hidden font-mono text-[10px] uppercase tracking-[0.22em] text-muted sm:inline">
              {s.subtitle[locale]}
            </span>
          </span>
          <span className="mt-1 block text-xs text-muted sm:hidden">{s.subtitle[locale]}</span>
        </span>

        {s.prank && (
          <span className="shrink-0 rounded border border-amber-400/40 bg-amber-400/10 px-2 py-0.5 font-mono text-[10px] tracking-[0.12em] text-amber-300">
            {locale === 'zh' ? '整蛊' : 'Prank'}
          </span>
        )}

        {s.visitUrl && (
          <span className="hidden shrink-0 rounded border border-emerald-400/30 bg-emerald-400/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.18em] text-emerald-300/90 sm:inline">
            live
          </span>
        )}

        <span
          className={`shrink-0 font-mono text-xs text-muted transition-all ${isOpen ? 'rotate-90 text-accent' : 'group-hover:translate-x-0.5 group-hover:text-text/80'}`}
          aria-hidden
        >
          →
        </span>
      </button>

      {/* Inline drawer — only mounted when open so demo intervals & rAF
          loops are torn down as soon as the row closes. */}
      {isOpen && (
        <div
          id={`service-panel-${s.slug}`}
          className="animate-fade-in border-t border-white/5 bg-black/20 px-5 pb-6 pt-5 md:px-6"
          style={{ '--service-accent': s.accentRgba } as CSSProperties}
        >
          <p className="mb-4 max-w-2xl text-sm leading-relaxed text-text/80">{s.tagline[locale]}</p>

          <ul className="mb-5 space-y-1.5 text-xs leading-relaxed text-text/70 md:text-sm">
            {s.features[locale].map((f) => (
              <li key={f} className="flex items-start gap-2.5">
                <span
                  className="mt-1.5 inline-block h-1 w-1 shrink-0 rounded-full"
                  style={{ background: 'var(--service-accent)' }}
                  aria-hidden
                />
                <span>{f}</span>
              </li>
            ))}
          </ul>

          {s.disclaimer && (
            <p className="mb-5 flex gap-2 rounded-lg border border-amber-400/25 bg-amber-400/[0.06] px-3 py-2 text-[11px] leading-relaxed text-amber-200/85">
              <span aria-hidden className="mt-px shrink-0">⚠</span>
              <span>{s.disclaimer[locale]}</span>
            </p>
          )}

          <div className="mb-5 flex flex-wrap gap-2">
            {s.tags.map((tag) => (
              <span
                key={tag}
                className="rounded border border-white/10 bg-white/[0.03] px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-muted"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Scripted function demo */}
          <div className="mb-4">
            <Demo />
          </div>

          {/* Real deliverable thumbnail — click to view in lightbox */}
          {s.sampleImage && (
            <button
              type="button"
              onClick={() => onOpenLightbox({ src: s.sampleImage!, alt: `${s.name} sample` })}
              className="group/sample mb-4 flex w-full items-center gap-3 rounded-xl border border-white/10 bg-black/40 p-2 text-left transition-all hover:border-[color:var(--service-accent)] hover:bg-black/55"
            >
              <span className="relative block h-16 w-28 shrink-0 overflow-hidden rounded-lg bg-black/60">
                <img
                  src={s.sampleImage}
                  alt=""
                  loading="lazy"
                  aria-hidden
                  className="absolute inset-0 h-full w-full object-cover opacity-85 transition-transform duration-500 group-hover/sample:scale-105"
                />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
                  {locale === 'zh' ? '实际项目截图' : 'real deliverable'}
                </span>
                <span className="mt-0.5 block text-xs text-text/85">
                  {locale === 'zh' ? '点击查看完整大图' : 'click to view full size'}
                </span>
              </span>
              <span className="font-mono text-xs text-muted transition-transform group-hover/sample:translate-x-0.5">⤢</span>
            </button>
          )}

          {/* Actions — visit (live products only) + inquire */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            {s.visitUrl && (
              <a
                href={s.visitUrl}
                target="_blank"
                rel="noreferrer"
                className="group/visit inline-flex items-center gap-2 rounded-lg border border-[color:var(--service-accent)] bg-white/[0.03] px-3.5 py-2 font-mono text-xs uppercase tracking-[0.18em] text-text transition-colors hover:bg-white/[0.07]"
              >
                {t('services.visit')}
                <span className="transition-transform group-hover/visit:translate-x-0.5">→</span>
              </a>
            )}
            <a
              href="/#contact"
              onClick={onInquire}
              className="group/cta inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.22em] text-muted transition-colors hover:text-accent2"
            >
              {t('services.inquire')}
              <span className="transition-transform group-hover/cta:translate-x-0.5">→</span>
            </a>
          </div>
        </div>
      )}
    </li>
  );
};

export const ServicesSection = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const locale = (i18n.language.startsWith('zh') ? 'zh' : 'en') as Locale;

  // A 整蛊 / prank product is hidden entirely when the UI is in English.
  const isHidden = (s: ServiceItem) => locale === 'en' && Boolean(s.prank);

  // Which demo row is open. null = all collapsed. Only one open at a time so the
  // section stays compact — shared across top-level rows and nested children.
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  // Which group is expanded (the second level of folding). Independent of openSlug.
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  // Lightbox state — null = closed
  const [lightboxImg, setLightboxImg] = useState<{ src: string; alt: string } | null>(null);

  const toggleSlug = (slug: string) => setOpenSlug((cur) => (cur === slug ? null : slug));

  const goContact = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault();
    if (location.pathname === '/') {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.replaceState(null, '', '/#contact');
    } else {
      navigate('/#contact');
    }
  };

  const renderRow = (s: ServiceItem) => (
    <ServiceRow
      key={s.slug}
      s={s}
      isOpen={openSlug === s.slug}
      onToggle={() => toggleSlug(s.slug)}
      onOpenLightbox={setLightboxImg}
      onInquire={goContact}
      locale={locale}
    />
  );

  return (
    <section id="services" className="mx-auto max-w-4xl px-6 py-14 md:px-12 md:py-16 scroll-mt-28">
      <SectionLabel number="">
        <span className="text-xl font-bold text-text md:text-2xl">{t('section.services')}</span>
      </SectionLabel>

      <p className="mb-8 max-w-2xl text-sm leading-relaxed text-text/60">{t('services.intro')}</p>

      <ul className="divide-y divide-white/5 overflow-hidden rounded-2xl border border-white/8 bg-surface/30 backdrop-blur-sm">
        {serviceLayout.map((entry) => {
          if (entry.kind === 'item') {
            const s = serviceBySlug[entry.slug];
            return s && !isHidden(s) ? renderRow(s) : null;
          }

          // group entry — a fold that reveals its child rows
          const isGroupOpen = openGroup === entry.id;
          const visibleChildren = entry.children
            .map((slug) => serviceBySlug[slug])
            .filter((s): s is ServiceItem => Boolean(s) && !isHidden(s));
          if (visibleChildren.length === 0) return null;
          return (
            <li key={entry.id}>
              <button
                type="button"
                onClick={() => setOpenGroup((cur) => (cur === entry.id ? null : entry.id))}
                aria-expanded={isGroupOpen}
                aria-controls={`service-group-${entry.id}`}
                className="group flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-white/[0.03] focus:outline-none focus-visible:bg-white/[0.04] md:px-6 md:py-5"
                style={{ '--service-accent': entry.accentRgba } as CSSProperties}
              >
                <span
                  className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-text/85 transition-all group-hover:border-[color:var(--service-accent)] group-hover:text-text"
                  aria-hidden
                >
                  <ServiceEmblem id={entry.emblem} size={26} />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="flex items-baseline gap-3">
                    <span className="text-base font-bold text-text md:text-lg">{entry.title[locale]}</span>
                    <span className="hidden font-mono text-[10px] uppercase tracking-[0.22em] text-muted sm:inline">
                      {entry.subtitle[locale]}
                    </span>
                  </span>
                  <span className="mt-1 block text-xs text-muted sm:hidden">{entry.subtitle[locale]}</span>
                </span>

                <span className="shrink-0 rounded-full border border-white/10 bg-white/[0.03] px-2 py-0.5 font-mono text-[10px] text-muted">
                  {visibleChildren.length}
                </span>

                <span
                  className={`shrink-0 font-mono text-xs text-muted transition-all ${isGroupOpen ? 'rotate-90 text-accent' : 'group-hover:translate-x-0.5 group-hover:text-text/80'}`}
                  aria-hidden
                >
                  →
                </span>
              </button>

              {isGroupOpen && (
                <ul
                  id={`service-group-${entry.id}`}
                  className="animate-fade-in divide-y divide-white/5 border-t border-white/5 bg-black/25 pl-4 md:pl-6"
                >
                  {visibleChildren.map((s) => renderRow(s))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>

      <p className="mt-6 text-center font-mono text-[10px] uppercase tracking-[0.22em] text-muted/70 md:text-left">
        {t('services.outro')}
      </p>

      {lightboxImg && (
        <ImageLightbox src={lightboxImg.src} alt={lightboxImg.alt} onClose={() => setLightboxImg(null)} />
      )}
    </section>
  );
};
