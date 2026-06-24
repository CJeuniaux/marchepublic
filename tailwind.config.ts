import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy:      '#2E2348', // aubergine profond — fond sombre, titres (contrast 14.7:1 sur cream — AAA)
        aubergine: '#3B3171', // aubergine moyen — ref design-system-1890 (token disponible pour phases suivantes)
        ink:       '#1C1534', // très sombre — footer
        teal:  '#415338', // vert forêt — checks, accents verts
        bleu:  '#2E5C8A', // bleu confiance — liens, variante
        aqua:  '#C8BEF5', // lavande claire — texte sur fond sombre
        coral: '#E63948', // rouge vif — CTA principal, sélection active
        sun:   '#F4C48F', // jaune soleil — badges pédagogie, attention (ref: design-system-1890)
        cream: '#FBF7F1', // crème — fond page
        sable: '#F4E9D8', // sable — fond cartes
        slate: '#5E6B7D', // gris-ardoise — texte secondaire
        gris:  '#A8A096', // gris doux — détails secondaires
        line:  '#E4D9CC', // bordure chaude
      },
      fontFamily: {
        sans:    ['DM Sans', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['DM Serif Display', 'Georgia', 'serif'],
      },
      boxShadow: {
        card:     '0 1px 4px rgba(46,35,72,0.06), 0 4px 16px rgba(46,35,72,0.08)',
        float:    '0 8px 32px rgba(46,35,72,0.18)',
        coral:    '0 4px 16px rgba(230,57,72,0.32)',
        teal:     '0 4px 16px rgba(65,83,56,0.28)',
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
