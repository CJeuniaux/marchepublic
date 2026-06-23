import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy:  '#2E2348', // aubergine — hero, titres, UI sombre
        ink:   '#1C1534', // très sombre — footer
        teal:  '#58B77A', // vert confiance — checks, accents
        aqua:  '#C8BEF5', // lavande claire — texte sur fond sombre
        coral: '#E85D5A', // corail — CTA principal
        sun:   '#F6C65B', // jaune doux — badges
        cream: '#FBF7EC', // crème — fond page
        sable: '#F4E9D8', // sable — fond cartes
        slate: '#5E6B7D', // gris-ardoise — texte secondaire
        line:  '#E4D9CC', // bordure chaude
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Fraunces', 'Georgia', 'serif'],
      },
      boxShadow: {
        card:     '0 1px 4px rgba(46,35,72,0.06), 0 4px 16px rgba(46,35,72,0.08)',
        float:    '0 8px 32px rgba(46,35,72,0.18)',
        coral:    '0 4px 16px rgba(232,93,90,0.32)',
        teal:     '0 4px 16px rgba(88,183,122,0.28)',
        elevated: '0 4px 20px rgba(46,35,72,0.12)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      animation: {
        floaty:        'floaty 4s ease-in-out infinite',
        'floaty-slow': 'floaty 6s ease-in-out infinite',
      },
      keyframes: {
        floaty: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
