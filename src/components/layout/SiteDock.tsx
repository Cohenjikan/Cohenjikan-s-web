import { useTranslation } from 'react-i18next';
import Dock from '../reactbits/Components/Dock/Dock';

const Globe = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15 15 0 0 1 0 20a15 15 0 0 1 0-20z" />
  </svg>
);

const ArrowUp = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <line x1="12" y1="19" x2="12" y2="5" />
    <polyline points="5 12 12 5 19 12" />
  </svg>
);

export const SiteDock = () => {
  const { t, i18n } = useTranslation();

  const toggleLang = () => {
    const target = i18n.language.startsWith('zh') ? 'en' : 'zh';
    void i18n.changeLanguage(target);
  };

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const items = [
    {
      icon: <Globe />,
      label: t('dock.lang'),
      onClick: toggleLang,
      className: 'text-text hover:text-accent transition-colors'
    },
    {
      icon: <ArrowUp />,
      label: t('dock.top'),
      onClick: scrollTop,
      className: 'text-text hover:text-accent transition-colors'
    }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-40 pointer-events-auto">
      <Dock items={items} panelHeight={64} baseItemSize={46} magnification={60} distance={120} />
    </div>
  );
};
