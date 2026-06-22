import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: '#10284A',
        ink: '#183E6F',
        teal: '#45C7C7',
        aqua: '#DDF7F4',
        coral: '#FF735C',
        sun: '#FFD66B',
        cream: '#F8F6F0',
        slate: '#607086',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Space Grotesk', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 4px rgba(16,40,74,0.04), 0 8px 24px rgba(16,40,74,0.06)',
        float: '0 12px 40px rgba(16,40,74,0.16)',
        coral: '0 8px 24px rgba(255,115,92,0.35)',
        teal: '0 8px 24px rgba(69,199,199,0.30)',
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
    },
  },
  plugins: [],
}

export default config
