import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"JetBrains Mono"', '"PingFang SC"', '"Microsoft YaHei"', 'ui-monospace', 'monospace']
      },
      colors: {
        bg: 'rgb(var(--color-bg) / <alpha-value>)',
        surface: 'rgb(var(--color-surface) / <alpha-value>)',
        border: 'rgb(var(--color-border) / <alpha-value>)',
        text: 'rgb(var(--color-text) / <alpha-value>)',
        muted: 'rgb(var(--color-muted) / <alpha-value>)',
        accent: 'rgb(var(--color-accent) / <alpha-value>)',
        accent2: 'rgb(var(--color-accent-2) / <alpha-value>)'
      },
      backgroundImage: {
        'accent-gradient':
          'linear-gradient(90deg, rgb(var(--color-accent)) 0%, rgb(var(--color-accent-2)) 100%)'
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        shine: {
          '0%': { backgroundPosition: '0% center' },
          '100%': { backgroundPosition: '200% center' }
        },
        'star-movement-bottom': {
          '0%': { transform: 'translate(0%, 0%)', opacity: '1' },
          '100%': { transform: 'translate(-100%, 0%)', opacity: '0' }
        },
        'star-movement-top': {
          '0%': { transform: 'translate(0%, 0%)', opacity: '1' },
          '100%': { transform: 'translate(100%, 0%)', opacity: '0' }
        }
      },
      animation: {
        'fade-in': 'fade-in 0.8s cubic-bezier(0.25, 1, 0.5, 1) both',
        shine: 'shine 6s linear infinite',
        'star-movement-bottom': 'star-movement-bottom linear infinite alternate',
        'star-movement-top': 'star-movement-top linear infinite alternate'
      }
    }
  },
  plugins: []
};

export default config;
