import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { credits, specialThanks, type CreditCategory } from '../content/credits';

const CATEGORY_ORDER: CreditCategory[] = ['foundations', 'routing', 'animation', 'webgl', 'ui', 'fonts'];

export const CreditsPage = () => {
  const { t } = useTranslation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  return (
    <article className="relative mx-auto max-w-5xl px-6 pb-32 pt-32 md:px-12">
      <div className="mb-12">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-surface/40 px-4 py-2 text-sm text-muted backdrop-blur transition-colors hover:border-accent/40 hover:text-accent"
        >
          {t('credits.backHome')}
        </Link>
      </div>

      <header className="mb-16">
        <p className="font-mono text-xs uppercase tracking-[0.28em] text-accent">{t('credits.subtitle')}</p>
        <h1 className="mt-3 bg-accent-gradient bg-clip-text text-[clamp(2.75rem,8vw,5rem)] font-bold leading-[1.02] tracking-tight text-transparent">
          {t('credits.title')}
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-text/80 md:text-lg">
          {t('credits.intro')}
        </p>
      </header>

      <section className="space-y-14">
        {CATEGORY_ORDER.map((cat) => (
          <div key={cat}>
            <h2 className="mb-6 font-mono text-sm uppercase tracking-[0.22em] text-accent">
              {t(`credits.categories.${cat}`)}
            </h2>

            <ul className="grid gap-3 sm:grid-cols-2">
              {credits[cat].map((dep) => (
                <li key={dep.name}>
                  <a
                    href={dep.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex h-full flex-col gap-2 rounded-xl border border-white/10 bg-surface/50 p-5 backdrop-blur-md transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:bg-surface/70"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="text-sm font-bold text-text group-hover:text-accent">{dep.name}</span>
                      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted/80">{dep.license}</span>
                    </div>
                    <p className="text-sm leading-relaxed text-muted">{dep.role}</p>
                    <span className="mt-auto inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-[0.18em] text-muted transition-colors group-hover:text-accent2">
                      visit
                      <span className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5">↗</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section className="mt-24">
        <h2 className="mb-3 bg-accent-gradient bg-clip-text text-3xl font-bold tracking-tight text-transparent md:text-4xl">
          {t('credits.specialThanksTitle')}
        </h2>
        <p className="mb-10 max-w-2xl text-sm leading-relaxed text-text/80 md:text-base">
          {t('credits.specialThanksIntro')}
        </p>

        <ul className="grid gap-5 md:grid-cols-3">
          {specialThanks.map((thanks) => {
            const card = (
              <div
                className="group relative h-full overflow-hidden rounded-2xl border border-white/10 bg-surface/50 p-6 backdrop-blur-md transition-all hover:-translate-y-1 hover:border-white/20"
                style={{ ['--thanks-glow' as string]: thanks.accent }}
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-30"
                  style={{ background: `radial-gradient(circle at 30% 0%, var(--thanks-glow), transparent 60%)` }}
                />

                <div className="relative">
                  <p className="font-mono text-[11px] uppercase tracking-[0.22em]" style={{ color: thanks.accent }}>
                    {t(`credits.thanks.${thanks.key}.role`)}
                  </p>
                  <h3 className="mt-3 text-2xl font-bold text-text">{t(`credits.thanks.${thanks.key}.name`)}</h3>
                  <p className="mt-4 text-sm leading-relaxed text-text/75">{t(`credits.thanks.${thanks.key}.note`)}</p>
                </div>
              </div>
            );

            return (
              <li key={thanks.key}>
                {thanks.url ? (
                  <a href={thanks.url} target="_blank" rel="noreferrer" className="block h-full">
                    {card}
                  </a>
                ) : (
                  card
                )}
              </li>
            );
          })}
        </ul>
      </section>

      <p className="mt-16 max-w-2xl text-xs leading-relaxed text-muted/70">
        {t('credits.license')}
      </p>
    </article>
  );
};
