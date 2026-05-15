import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { StaggeredMenu } from '../reactbits/Components/StaggeredMenu/StaggeredMenu';
import { useBackground } from '../BackgroundSwitcher';

const ACCENT = '#A78BFA';

export const SiteNav = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { next: nextBg } = useBackground();

  const isZh = i18n.language.startsWith('zh');

  const items = [
    { label: 'Home', ariaLabel: 'Home', link: '/#hero' },
    { label: t('section.projects'), ariaLabel: t('section.projects'), link: '/#projects' },
    { label: t('section.contact'), ariaLabel: t('section.contact'), link: '/#contact' },
    { label: t('section.credits'), ariaLabel: t('section.credits'), link: '/credits' }
  ];

  // socialItems slot becomes our utility row: language, background switch, GitHub
  const socialItems = [
    { label: isZh ? 'English' : '中文', link: '#action:lang' },
    { label: t('dock.bg'), link: '#action:bg' },
    { label: 'GitHub', link: 'https://github.com/Cohenjikan' }
  ];

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const a = target.closest('a');
    if (!a) return;
    const href = a.getAttribute('href') ?? '';

    if (href === '#action:bg') {
      e.preventDefault();
      nextBg();
      return;
    }

    if (href === '#action:lang') {
      e.preventDefault();
      void i18n.changeLanguage(isZh ? 'en' : 'zh');
      return;
    }

    if (href.startsWith('/#')) {
      e.preventDefault();
      const hash = href.slice(1);
      if (location.pathname === '/') {
        const el = document.querySelector(hash);
        el?.scrollIntoView({ behavior: 'smooth' });
      } else {
        navigate('/' + hash);
      }
      return;
    }

    // Regular in-app routes (e.g. /credits, /projects/<slug>) — use the router
    // so we don't reload the page and lose the background / menu state.
    if (href.startsWith('/') && !href.startsWith('//')) {
      e.preventDefault();
      navigate(href);
    }
  };

  return (
    <div className="staggered-menu-host fixed inset-0 pointer-events-none z-50" onClickCapture={handleClick}>
      <div className="pointer-events-none h-full">
        <StaggeredMenu
          position="right"
          isFixed
          items={items}
          socialItems={socialItems}
          displaySocials
          accentColor={ACCENT}
          menuButtonColor="#fff"
          openMenuButtonColor="#0f0a1f"
          colors={['#241B3B', '#5227FF']}
          logoUrl="/logo.svg"
          displayItemNumbering={false}
          changeMenuColorOnOpen
        />
      </div>
    </div>
  );
};
