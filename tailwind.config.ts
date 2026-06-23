import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy:  '#082B4C',
        ink:   '#061F36',
        teal:  '#27C7C9',
        aqua:  '#D8F5F5',
        coral: '#FF6B57',
        sun:   '#FFD66B',
        cream: '#F7F3EA',
        slate: '#607086',
        line:  '#DCE5EE',
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Space Grotesk', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        card:  '0 1px 3px rgba(8,43,76,0.05), 0 4px 12px rgba(8,43,76,0.07)',
        float: '0 8px 32px rgba(8,43,76,0.14)',
        coral: '0 4px 14px rgba(255,107,87,0.30)',
        teal:  '0 4px 14px rgba(39,199,201,0.25)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
}

export default config
