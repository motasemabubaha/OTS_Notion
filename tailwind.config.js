/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          DEFAULT: '#191919',
          50: '#2f2f2f',
          100: '#2b2b2b',
          200: '#252525',
          300: '#202020',
          400: '#1e1e1e',
          500: '#191919',
          600: '#141414',
          700: '#0f0f0f',
          800: '#0a0a0a',
          900: '#050505',
        },
        accent: {
          DEFAULT: '#2383e2',
          hover: '#1b6ec2',
          light: '#e8f0fe',
        },
        notion: {
          red: '#eb5757',
          orange: '#f2994a',
          yellow: '#f2c94c',
          green: '#27ae60',
          blue: '#2383e2',
          purple: '#9b51e0',
          pink: '#e255a1',
          gray: '#9b9a97',
          brown: '#8b6914',
        },
      },
      fontFamily: {
        sans: [
          'ui-sans-serif', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI',
          'Helvetica', 'Arial', 'sans-serif', 'Apple Color Emoji', 'Segoe UI Emoji',
        ],
        mono: ['SFMono-Regular', 'Menlo', 'Consolas', 'PT Mono', 'Liberation Mono', 'Courier New', 'monospace'],
        serif: ['Lyon-Text', 'Georgia', 'ui-serif', 'serif'],
      },
      fontSize: {
        '2xs': '0.625rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.15s ease-in-out',
        'slide-in': 'slideIn 0.2s ease-out',
        'slide-up': 'slideUp 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
