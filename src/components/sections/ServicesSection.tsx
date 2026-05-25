import { useState, type CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { services, type Locale, type DemoId } from '../../content/services';
import { SectionLabel } from './SectionLabel';
import { ServiceEmblem } from './services/ServiceEmblems';
import { ContinuumChat } from './services/ContinuumChat';
import { EchoDemo } from './services/EchoDemo';
import { ChronicleDemo } from './services/ChronicleDemo';
import { FortuneDemo } from './services/FortuneDemo';
import { ArchiveDemo } from './services/ArchiveDemo';
import { ImageLightbox } from './services/ImageLightbox';

// Services sits between About and Projects in the page rhythm, but its visual
// weight is intentionally LOWER than Projects: a single-column compact list,
// no hero images by default, each row unfolds an inline drawer with a small
// scripted demo + (optionally) a clickable sample screenshot.

// Map demo IDs to their components. Kept here rather than in services.ts so the
// data layer stays string-typed and the component imports are colocated.
const DEMO_REGISTRY: Record<DemoId, () => JSX.Element> = {
  echo: EchoDemo,
  chronicle: ChronicleDemo,
  fortune: FortuneDemo,
  continuum: ContinuumChat,
  archive: ArchiveDemo
};

export const ServicesSection = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const locale = (i18n.language.startsWith('zh') ? 'zh' : 'en') as Locale;

  // Track which row is open. null = all collapsed. Only one open at a time so the
  // section stays compact even when users are browsing.
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  // Lightbox state — null = closed
  const [lightboxImg, setLightboxImg] = useState<{ src: string; alt: string } | null>(null);

  const goContact = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault();
    if (location.pathname === '/') {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.replaceState(null, '', '/#contact');
    } else {
      navigate('/#contact');
    }
  };

  return (
    <section id="services" className="mx-auto max-w-4xl px-6 py-14 md:px-12 md:py-16 scroll-mt-28">
      <SectionLabel number="">
        <span className="text-xl font-bold text-text md:text-2xl">{t('section.services')}</span>
      </SectionLabel>

      <p className="mb-8 max-w-2xl text-sm leading-relaxed text-text/60">{t('services.intro')}</p>

      <ul className="divide-y divide-white/5 overflow-hidden rounded-2xl border border-white/8 bg-surface/30 backdrop-blur-sm">
        {services.map((s) => {
          const isOpen = openSlug === s.slug;
          const Demo = DEMO_REGISTRY[s.demo];
          return (
            <li key={s.slug}>
              <button
                type="button"
                onClick={() => setOpenSlug(isOpen ? null : s.slug)}
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
                      onClick={() => setLightboxImg({ src: s.sampleImage!, alt: `${s.name} sample` })}
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

                  <a
                    href="/#contact"
                    onClick={goContact}
                    className="group/cta inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.22em] text-muted transition-colors hover:text-accent2"
                  >
                    {t('services.inquire')}
                    <span className="transition-transform group-hover/cta:translate-x-0.5">→</span>
                  </a>
                </div>
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
