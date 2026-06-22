/** Motifs graphiques réutilisables : parcours de décision, panneaux, illustrations. */

/**
 * LogoMark — le zigzag de l'écran de chargement, en version compacte.
 */
export function LogoMark({ className = '', nodeColor = '#FFFFFF' }: { className?: string; nodeColor?: string }) {
  const nodes = [
    { x: 10, y: 40 },
    { x: 34, y: 22 },
    { x: 60, y: 36 },
    { x: 86, y: 18 },
    { x: 110, y: 30 },
  ]
  const path = 'M10 40 L34 22 L60 36 L86 18 L110 30'
  return (
    <svg viewBox="0 0 120 48" className={className} fill="none" aria-hidden>
      <path d={path} stroke="#45C7C7" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
      {nodes.map((n, i) => (
        <circle key={i} cx={n.x} cy={n.y} r={i === nodes.length - 1 ? 6.5 : 5} fill={i === nodes.length - 1 ? '#FF735C' : nodeColor} />
      ))}
    </svg>
  )
}

/**
 * RisingPath — un parcours ascendant ponctué d'étapes, vers une flèche.
 * « De l'incertitude à la décision. »
 */
export function RisingPath({ className = '', stroke = '#10284A', hollow = '#F8F6F0' }: { className?: string; stroke?: string; hollow?: string }) {
  return (
    <svg viewBox="0 0 220 180" className={className} fill="none" aria-hidden>
      <path
        d="M18 162 C 46 162, 42 126, 66 120 S 96 104, 104 84 C 112 66, 138 66, 150 50 S 178 28, 198 20"
        stroke={stroke} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round"
      />
      {/* flèche */}
      <path d="M198 20 l-18 1 M198 20 l-2 18" stroke={stroke} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
      {/* départ plein */}
      <circle cx="18" cy="162" r="9" fill={stroke} />
      {/* étapes creuses */}
      <circle cx="66" cy="120" r="11" fill={hollow} stroke={stroke} strokeWidth={6} />
      <circle cx="139" cy="58" r="14" fill={hollow} stroke={stroke} strokeWidth={6} />
    </svg>
  )
}

/**
 * ChecklistCard — une carte de diagnostic légèrement inclinée :
 * barre de progression en haut, points validés, lignes de contenu.
 */
export function ChecklistCard({ className = '' }: { className?: string }) {
  const navy = '#10284A'
  const cream = '#F8F6F0'
  const rows = [
    { y: 96, lineEnd: 214 },
    { y: 134, lineEnd: 198 },
    { y: 172, lineEnd: 184 },
  ]
  return (
    <svg viewBox="0 0 300 215" className={className} fill="none" aria-hidden>
      <g transform="rotate(-4 150 107)">
        <rect x="14" y="14" width="272" height="187" rx="18" fill={cream} stroke={navy} strokeWidth={4} />
        {/* barre de progression */}
        <line x1="46" y1="50" x2="150" y2="50" stroke={navy} strokeWidth={4} strokeLinecap="round" />
        <circle cx="46" cy="50" r="7" fill={navy} />
        <circle cx="100" cy="50" r="7" fill={navy} />
        <circle cx="150" cy="50" r="8" fill={cream} stroke={navy} strokeWidth={4} />
        <line x1="164" y1="50" x2="244" y2="50" stroke={navy} strokeWidth={3} strokeLinecap="round" strokeDasharray="1 9" />
        <circle cx="210" cy="50" r="4" fill={navy} />
        <circle cx="252" cy="50" r="8" fill={cream} stroke={navy} strokeWidth={4} />
        {/* lignes validées */}
        {rows.map((r, i) => (
          <g key={i}>
            <circle cx="56" cy={r.y} r="15" fill={navy} />
            <path d={`M49 ${r.y} l5 5 l9 -10`} stroke="#fff" strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" />
            <line x1="84" y1={r.y} x2={r.lineEnd} y2={r.y} stroke={navy} strokeWidth={4} strokeLinecap="round" />
          </g>
        ))}
        {/* groupes de points à droite */}
        <g fill={navy}>
          <circle cx="244" cy="96" r="4" /><circle cx="262" cy="96" r="4" />
          <circle cx="244" cy="134" r="4" /><circle cx="262" cy="134" r="4" />
          <circle cx="244" cy="172" r="4" />
        </g>
      </g>
    </svg>
  )
}

/**
 * TangleToArrow — un enchevêtrement qui se dénoue en une flèche droite.
 * « Le labyrinthe juridique, transformé en parcours clair. »
 */
export function TangleToArrow({ className = '', stroke = '#10284A' }: { className?: string; stroke?: string }) {
  return (
    <svg viewBox="0 0 310 120" className={className} fill="none" aria-hidden>
      <path
        d="M16 90 C 38 92, 24 56, 54 50 C 84 44, 94 86, 64 92 C 40 97, 48 54, 84 48 C 122 41, 130 84, 96 90 C 64 96, 74 50, 112 52 C 150 54, 140 96, 104 98 C 78 100, 86 68, 68 64 C 48 59, 58 84, 80 80 C 118 100, 150 56, 170 68 L 286 68"
        stroke={stroke} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round"
      />
      <path d="M286 68 l-16 -8 M286 68 l-16 8" stroke={stroke} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="16" cy="90" r="7" fill={stroke} />
    </svg>
  )
}

/**
 * Constellation — un réseau de points reliés formant un parcours,
 * orbites en pointillés et repères satellites. Motif d'ambiance.
 */
export function Constellation({ className = '', hollow = '#10284A' }: { className?: string; hollow?: string }) {
  return (
    <svg viewBox="0 0 320 250" className={className} fill="none" aria-hidden>
      <g stroke="currentColor">
        {/* orbite */}
        <ellipse cx="160" cy="110" rx="145" ry="72" strokeWidth={1.5} transform="rotate(-18 160 110)" />
        <path d="M40 158 C 70 200, 130 210, 175 196" strokeWidth={1.5} strokeLinecap="round" strokeDasharray="1 8" />
        {/* liaisons principales (le V du parcours) */}
        <path d="M80 72 L162 150 L245 72" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
        {/* tiges verticales */}
        <line x1="80" y1="72" x2="80" y2="208" strokeWidth={4} strokeLinecap="round" />
        <line x1="245" y1="72" x2="245" y2="206" strokeWidth={4} strokeLinecap="round" />
        <line x1="162" y1="150" x2="162" y2="226" strokeWidth={2} strokeLinecap="round" strokeDasharray="1 7" />
      </g>
      <g fill="currentColor">
        {/* nœuds planètes (anneaux) */}
        <circle cx="80" cy="72" r="14" fill={hollow} stroke="currentColor" strokeWidth={3} />
        <circle cx="80" cy="72" r="5" opacity={0.35} />
        <circle cx="245" cy="72" r="14" fill={hollow} stroke="currentColor" strokeWidth={3} />
        <circle cx="245" cy="72" r="5" opacity={0.35} />
        {/* nœud central */}
        <circle cx="162" cy="150" r="10" />
        {/* points des tiges */}
        <circle cx="80" cy="122" r="6" />
        <circle cx="80" cy="208" r="9" />
        <circle cx="245" cy="128" r="6" />
        <circle cx="245" cy="206" r="6" fill={hollow} stroke="currentColor" strokeWidth={3} />
        {/* satellites */}
        <circle cx="298" cy="96" r="4" />
        <circle cx="178" cy="30" r="5" fill={hollow} stroke="currentColor" strokeWidth={2.5} />
        <circle cx="34" cy="150" r="4" />
        {/* étoile */}
        <path d="M162 224 l4 9 l-4 9 l-4 -9 z" />
        <path d="M153 233 l9 4 l9 -4 -9 -4 z" />
      </g>
    </svg>
  )
}

export function HeroPathScene({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 420 380" className={className} fill="none" aria-hidden>
      <path d="M40 340 C 80 260, 60 210, 140 190 S 250 150, 230 90 S 320 40, 380 60"
        stroke="#DDF7F4" strokeWidth={2.5} strokeLinecap="round" strokeDasharray="2 10" opacity={0.7} />
      <path d="M40 340 C 80 260, 60 210, 140 190 S 250 150, 230 90 S 320 40, 380 60"
        stroke="#45C7C7" strokeWidth={3} strokeLinecap="round" />
      <path d="M140 190 C 180 210, 240 230, 300 215" stroke="#FFD66B" strokeWidth={2.5} strokeLinecap="round" strokeDasharray="6 8" />
      <circle cx="40" cy="340" r="8" fill="#FFFFFF" stroke="#45C7C7" strokeWidth={3} />
      <circle cx="140" cy="190" r="7" fill="#10284A" />
      <circle cx="230" cy="90" r="7" fill="#10284A" />
      <circle cx="300" cy="215" r="6" fill="#FFD66B" />
      <circle cx="380" cy="60" r="14" fill="#FF735C" />
      <path d="M380 60 l-3 -3 l3 -3 l3 3 z" fill="#fff" transform="translate(0,1)" />
      <path d="M375 56 h10 v6 h-10 z" fill="#fff" />
    </svg>
  )
}

export function Signpost({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" aria-hidden>
      <rect x="30" y="14" width="4" height="40" rx="2" fill="#607086" />
      <path d="M14 18 h26 l8 6 l-8 6 H14 z" fill="#45C7C7" />
      <path d="M50 32 H24 l-8 6 l8 6 h26 z" fill="#FF735C" />
    </svg>
  )
}
