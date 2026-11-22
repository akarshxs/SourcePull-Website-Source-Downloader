import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans:    ['"Inter"', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
        mono:    ['"IBM Plex Mono"', 'monospace'],
        display: ['"Inter"', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
      },
      colors: {
        accent: {
          DEFAULT: '#da291c', // Rosso Corsa
          dim:     '#b01e0a',
          dark:    '#9d2211',
          glow:    'rgba(218,41,28,0.25)',
        },
        rosso: {
          DEFAULT: '#da291c',
          active:  '#b01e0a',
          dark:    '#9d2211',
        },
        canvas: {
          DEFAULT:  '#181818',
          elevated: '#303030',
          light:    '#ffffff',
        },
        hairline: {
          DEFAULT: '#303030',
          light:   '#d2d2d2',
        },
        neutral: {
          950: '#181818',
          900: '#222222',
          800: '#303030',
          700: '#444444',
          600: '#666666',
          500: '#808080',
          400: '#969696',
          300: '#b8b8b8',
          200: '#dcdcdc',
          100: '#ffffff',
        }
      },
      letterSpacing: {
        cta: '1.4px',
        nav: '0.65px',
        heading: '-1.12px',
        mega: '-1.6px',
      },
      borderRadius: {
        none: '0px',
      }
    },
  },
  plugins: [],
}
export default config
