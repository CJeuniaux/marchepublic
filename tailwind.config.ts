import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(26,31,46,0.05), 0 2px 10px rgba(26,31,46,0.06)',
        elevated: '0 4px 20px rgba(26,31,46,0.10)',
        brand: '0 4px 20px rgba(27,58,107,0.28)',
      },
    },
  },
  plugins: [],
}

export default config
