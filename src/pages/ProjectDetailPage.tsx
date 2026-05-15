import { useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import TiltedCard from '../components/reactbits/Components/TiltedCard/TiltedCard';
import Magnet from '../components/reactbits/Animations/Magnet/Magnet';
import StarBorder from '../components/reactbits/Animations/StarBorder/StarBorder';
import { getProjectBySlug, type Locale } from '../content/projects';

const Placeholder = ({ label }: { label: string }) => (
  <div className="flex aspect-video w-full items-center justify-center rounded-2xl border border-dashed border-white/10 bg-surface/40 text-sm uppercase tracking-[0.2em] text-muted">
    {label}
  </div>
);

const SmartImage = ({
  src,
  alt,
  fallbackLabel,
  className
}: {
  src: string;
  alt: string;
  fallbackLabel: string;
  className?: string;
}) => {
  const [failed, setFailed] = useState(false);
  if (failed) return <Placeholder label={fallbackLabel} />;
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={className}
    />
  );
};

export const ProjectDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t, i18n } = useTranslation();
  const locale = (i18n.language.startsWith('zh') ? 'zh' : 'en') as Locale;
  const project = slug ? getProjectBySlug(slug) : undefined;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [slug]);

  if (!project) return <Navigate to="/" replace />;

  return (
    <article className="relative mx-auto max-w-5xl px-6 pb-32 pt-32 md:px-12">
      {/* Back button — magnetic on hover */}
      <div className="mb-12">
        <Magnet padding={80} magnetStrength={3} wrapperClassName="inline-block">
          <Link
            to="/#projects"
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-surface/40 px-4 py-2 text-sm text-muted backdrop-blur transition-colors hover:border-accent/40 hover:text-accent"
          >
            {t('project.backToProjects')}
          </Link>
        </Magnet>
      </div>

      {/* Hero */}
      <header className="mb-16">
        <h1 className="bg-accent-gradient bg-clip-text text-[clamp(2.5rem,6vw,4rem)] font-bold leading-[1.05] tracking-tight text-transparent">
          {project.name}
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted md:text-lg">
          {project.tagline[locale]}
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-surface/40 px-5 py-3 text-sm text-text transition-colors hover:border-accent/40 hover:text-accent"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
            </svg>
            {t('project.github')}
          </a>
          {project.liveUrl && (
            <StarBorder
              as="a"
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              color="rgb(34 211 238)"
              speed="5s"
              thickness={2}
              className="inline-flex items-center gap-2 bg-bg/80 px-5 py-3 text-sm font-bold text-text backdrop-blur"
            >
              {t('project.liveDemo')} →
            </StarBorder>
          )}
        </div>
      </header>

      {/* Hero image — tilted */}
      <section className="mb-24">
        <div className="mx-auto max-w-4xl">
          <TiltedCard
            imageSrc={project.heroImage}
            altText={`${project.name} hero screenshot`}
            captionText={project.name}
            containerHeight="auto"
            containerWidth="100%"
            imageHeight="auto"
            imageWidth="100%"
            scaleOnHover={1.04}
            rotateAmplitude={8}
            showMobileWarning={false}
            showTooltip={false}
          />
        </div>
      </section>

      {/* Features — alternating */}
      <section className="mb-24">
        <h2 className="mb-12 font-mono text-sm uppercase tracking-[0.2em] text-accent">
          {t('project.features')}
        </h2>
        <div className="space-y-20">
          {project.features.map((feature, i) => (
            <div
              key={feature.title.en}
              className={`grid gap-10 md:grid-cols-2 md:items-center ${
                i % 2 === 1 ? 'md:[&>div:first-child]:order-2' : ''
              }`}
            >
              <div>
                <SmartImage
                  src={feature.image}
                  alt={feature.title[locale]}
                  fallbackLabel={t('project.screenshotComingSoon')}
                  className="aspect-video w-full rounded-2xl border border-white/10 bg-surface/40 object-cover shadow-2xl"
                />
              </div>
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent2">
                  0{i + 1}
                </p>
                <h3 className="mt-3 text-2xl font-bold text-text md:text-3xl">
                  {feature.title[locale]}
                </h3>
                <p className="mt-4 leading-relaxed text-muted">{feature.description[locale]}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tech stack */}
      <section className="mb-12">
        <h2 className="mb-6 font-mono text-sm uppercase tracking-[0.2em] text-accent">
          {t('project.techStack')}
        </h2>
        <div className="flex flex-wrap gap-3">
          {project.techStack.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-sm text-accent"
            >
              {tech}
            </span>
          ))}
        </div>
      </section>
    </article>
  );
};
