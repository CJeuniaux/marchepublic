/** Système graphique du M : points, lignes, traçés, glyphes et progression. */
import { motion } from 'framer-motion'

/**
 * LogoMark — le zigzag de l'écran de chargement, en version compacte.
 */
export function LogoMark({ className = '', nodeColor = '#FFFFFF' }: { className?: string; nodeColor?: string }) {
  const nodes = [
    { x: 10, y: 40 }, { x: 34, y: 22 }, { x: 60, y: 36 }, { x: 86, y: 18 }, { x: 110, y: 30 },
  ]
  const path = 'M10 40 L34 22 L60 36 L86 18 L110 30'
  return (
    <svg viewBox="0 0 120 48" className={className} fill="none" aria-hidden>
      <path d={path} stroke="#415338" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
      {nodes.map((n, i) => (
        <circle key={i} cx={n.x} cy={n.y} r={i === nodes.length - 1 ? 6.5 : 5} fill={i === nodes.length - 1 ? '#E63948' : nodeColor} />
      ))}
    </svg>
  )
}

/**
 * ParcoursProgress — le traçé du M comme barre de progression à 5 étapes.
 * La ligne colorée se dessine jusqu'à l'étape courante ; les nœuds s'activent.
 */
export function ParcoursProgress({ current, total = 5 }: { current: number; total?: number }) {
  const nodes = [
    { x: 10, y: 40 }, { x: 34, y: 22 }, { x: 60, y: 36 }, { x: 86, y: 18 }, { x: 110, y: 30 },
  ]
  const path = 'M10 40 L34 22 L60 36 L86 18 L110 30'
  const frac = total > 1 ? Math.max(0, Math.min(1, (current - 1) / (total - 1))) : 0
  return (
    <svg viewBox="0 0 120 48" className="w-full" fill="none" aria-hidden>
      <path d={path} stroke="rgba(255,255,255,0.16)" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
      <motion.path
        d={path} stroke="#415338" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: frac }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      />
      {nodes.map((n, i) => {
        const done = i < current - 1
        const cur = i === current - 1
        return (
          <g key={i}>
            {cur && <motion.circle cx={n.x} cy={n.y} r={9} fill="#E63948" opacity={0.25} initial={{ scale: 0.6 }} animate={{ scale: [0.8, 1.15, 0.9] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }} style={{ transformOrigin: `${n.x}px ${n.y}px` }} />}
            <circle cx={n.x} cy={n.y} r={cur ? 5.5 : 4.5} fill={done ? '#415338' : cur ? '#E63948' : '#2E2348'} stroke={done || cur ? 'none' : 'rgba(255,255,255,0.4)'} strokeWidth={1.5} />
          </g>
        )
      })}
    </svg>
  )
}

/** StepGlyph — mini-illustrations monochromes par étape (langage du traçé). */
export function StepGlyph({ name, className = '' }: { name: string; className?: string }) {
  const s = { fill: 'none', stroke: 'currentColor', strokeWidth: 2.4, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  const dot = (x: number, y: number, r = 2.4) => <circle cx={x} cy={y} r={r} fill="currentColor" />
  let body
  if (name === 'structure') body = (<>
    <path d="M12 26 L32 14 L52 26" {...s} />
    <path d="M12 50 H52" {...s} />
    <path d="M20 30 V48 M32 30 V48 M44 30 V48" {...s} />
    {dot(32, 14, 3)}
  </>)
  else if (name === 'financement') body = (<>
    <circle cx={32} cy={32} r={18} {...s} />
    <path d="M23 38 L29 31 L35 35 L42 25" {...s} />
    <path d="M42 25 l-5 0 M42 25 l0 5" {...s} />
    {dot(23, 38, 2.6)}
  </>)
  else if (name === 'gouvernance') body = (<>
    <path d="M32 34 L16 20 M32 34 L48 20 M32 34 L32 52" {...s} />
    {dot(32, 34, 4)}
    <circle cx={16} cy={20} r={4} {...s} />
    <circle cx={48} cy={20} r={4} {...s} />
    <circle cx={32} cy={52} r={4} {...s} />
  </>)
  else if (name === 'projet') body = (<>
    <rect x={14} y={16} width={36} height={32} rx={4} {...s} />
    <path d="M14 25 H50" {...s} />
    <path d="M20 40 L28 32 L36 38 L44 28" {...s} />
    {dot(20, 21, 1.6)} {dot(25, 21, 1.6)}
  </>)
  else body = (<>
    <path d="M14 44 A18 18 0 0 1 50 44" {...s} />
    <path d="M32 44 L43 30" {...s} />
    {dot(32, 44, 3)}
    <path d="M18 41 l3 -1 M46 41 l-3 -1 M32 26 v3" {...s} />
  </>)
  return <svg viewBox="0 0 64 64" className={className} aria-hidden>{body}</svg>
}

/** TangleToArrow — enchevêtrement qui se dénoue en une flèche droite. */
export function TangleToArrow({ className = '', stroke = '#2E2348' }: { className?: string; stroke?: string }) {
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

/** ChecklistCard — carte de diagnostic légèrement inclinée. */
export function ChecklistCard({ className = '' }: { className?: string }) {
  const navy = '#2E2348'
  const cream = '#FBF7F1'
  const rows = [{ y: 96, lineEnd: 214 }, { y: 134, lineEnd: 198 }, { y: 172, lineEnd: 184 }]
  return (
    <svg viewBox="0 0 300 215" className={className} fill="none" aria-hidden>
      <g transform="rotate(-4 150 107)">
        <rect x="14" y="14" width="272" height="187" rx="18" fill={cream} stroke={navy} strokeWidth={4} />
        <line x1="46" y1="50" x2="150" y2="50" stroke={navy} strokeWidth={4} strokeLinecap="round" />
        <circle cx="46" cy="50" r="7" fill={navy} />
        <circle cx="100" cy="50" r="7" fill={navy} />
        <circle cx="150" cy="50" r="8" fill={cream} stroke={navy} strokeWidth={4} />
        <line x1="164" y1="50" x2="244" y2="50" stroke={navy} strokeWidth={3} strokeLinecap="round" strokeDasharray="1 9" />
        <circle cx="210" cy="50" r="4" fill={navy} />
        <circle cx="252" cy="50" r="8" fill={cream} stroke={navy} strokeWidth={4} />
        {rows.map((r, i) => (
          <g key={i}>
            <circle cx="56" cy={r.y} r="15" fill={navy} />
            <path d={`M49 ${r.y} l5 5 l9 -10`} stroke="#fff" strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" />
            <line x1="84" y1={r.y} x2={r.lineEnd} y2={r.y} stroke={navy} strokeWidth={4} strokeLinecap="round" />
          </g>
        ))}
        <g fill={navy}>
          <circle cx="244" cy="96" r="4" /><circle cx="262" cy="96" r="4" />
          <circle cx="244" cy="134" r="4" /><circle cx="262" cy="134" r="4" />
          <circle cx="244" cy="172" r="4" />
        </g>
      </g>
    </svg>
  )
}

/** RisingPath — parcours ascendant ponctué d'étapes, vers une flèche. */
export function RisingPath({ className = '', stroke = '#2E2348', hollow = '#FBF7F1' }: { className?: string; stroke?: string; hollow?: string }) {
  return (
    <svg viewBox="0 0 220 180" className={className} fill="none" aria-hidden>
      <path d="M18 162 C 46 162, 42 126, 66 120 S 96 104, 104 84 C 112 66, 138 66, 150 50 S 178 28, 198 20" stroke={stroke} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M198 20 l-18 1 M198 20 l-2 18" stroke={stroke} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="18" cy="162" r="9" fill={stroke} />
      <circle cx="66" cy="120" r="11" fill={hollow} stroke={stroke} strokeWidth={6} />
      <circle cx="139" cy="58" r="14" fill={hollow} stroke={stroke} strokeWidth={6} />
    </svg>
  )
}

/** Constellation — réseau de points reliés formant un parcours. Motif d'ambiance. */
export function Constellation({ className = '', hollow = '#2E2348' }: { className?: string; hollow?: string }) {
  return (
    <svg viewBox="0 0 320 250" className={className} fill="none" aria-hidden>
      <g stroke="currentColor">
        <ellipse cx="160" cy="110" rx="145" ry="72" strokeWidth={1.5} transform="rotate(-18 160 110)" />
        <path d="M40 158 C 70 200, 130 210, 175 196" strokeWidth={1.5} strokeLinecap="round" strokeDasharray="1 8" />
        <path d="M80 72 L162 150 L245 72" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
        <line x1="80" y1="72" x2="80" y2="208" strokeWidth={4} strokeLinecap="round" />
        <line x1="245" y1="72" x2="245" y2="206" strokeWidth={4} strokeLinecap="round" />
        <line x1="162" y1="150" x2="162" y2="226" strokeWidth={2} strokeLinecap="round" strokeDasharray="1 7" />
      </g>
      <g fill="currentColor">
        <circle cx="80" cy="72" r="14" fill={hollow} stroke="currentColor" strokeWidth={3} />
        <circle cx="80" cy="72" r="5" opacity={0.35} />
        <circle cx="245" cy="72" r="14" fill={hollow} stroke="currentColor" strokeWidth={3} />
        <circle cx="245" cy="72" r="5" opacity={0.35} />
        <circle cx="162" cy="150" r="10" />
        <circle cx="80" cy="122" r="6" />
        <circle cx="80" cy="208" r="9" />
        <circle cx="245" cy="128" r="6" />
        <circle cx="245" cy="206" r="6" fill={hollow} stroke="currentColor" strokeWidth={3} />
        <circle cx="298" cy="96" r="4" />
        <circle cx="178" cy="30" r="5" fill={hollow} stroke="currentColor" strokeWidth={2.5} />
        <circle cx="34" cy="150" r="4" />
        <path d="M162 224 l4 9 l-4 9 l-4 -9 z" />
        <path d="M153 233 l9 4 l9 -4 -9 -4 z" />
      </g>
    </svg>
  )
}

export function HeroPathScene({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 420 380" className={className} fill="none" aria-hidden>
      <path d="M40 340 C 80 260, 60 210, 140 190 S 250 150, 230 90 S 320 40, 380 60" stroke="#DDF7F4" strokeWidth={2.5} strokeLinecap="round" strokeDasharray="2 10" opacity={0.7} />
      <path d="M40 340 C 80 260, 60 210, 140 190 S 250 150, 230 90 S 320 40, 380 60" stroke="#415338" strokeWidth={3} strokeLinecap="round" />
      <path d="M140 190 C 180 210, 240 230, 300 215" stroke="#F4C28F" strokeWidth={2.5} strokeLinecap="round" strokeDasharray="6 8" />
      <circle cx="40" cy="340" r="8" fill="#FFFFFF" stroke="#415338" strokeWidth={3} />
      <circle cx="140" cy="190" r="7" fill="#2E2348" />
      <circle cx="230" cy="90" r="7" fill="#2E2348" />
      <circle cx="300" cy="215" r="6" fill="#F4C28F" />
      <circle cx="380" cy="60" r="14" fill="#E63948" />
      <path d="M380 60 l-3 -3 l3 -3 l3 3 z" fill="#fff" transform="translate(0,1)" />
      <path d="M375 56 h10 v6 h-10 z" fill="#fff" />
    </svg>
  )
}

export function Signpost({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" aria-hidden>
      <rect x="30" y="14" width="4" height="40" rx="2" fill="#607086" />
      <path d="M14 18 h26 l8 6 l-8 6 H14 z" fill="#415338" />
      <path d="M50 32 H24 l-8 6 l8 6 h26 z" fill="#E63948" />
    </svg>
  )
}

/** BuildingScene — éditoriale: bâtiment belge, arbres, chemin, palette chaude. */
export function BuildingScene({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 480 360" className={className} fill="none" aria-hidden>
      {/* Sky */}
      <rect width="480" height="360" fill="#FBF7F1" />
      {/* Ground */}
      <rect x="0" y="306" width="480" height="54" fill="#F4E9D8" />
      <ellipse cx="240" cy="316" rx="230" ry="16" fill="#EDE0CC" />
      {/* Cloud left */}
      <ellipse cx="52" cy="72" rx="28" ry="14" fill="#F4E9D8" />
      <ellipse cx="34" cy="76" rx="20" ry="12" fill="#F4E9D8" />
      <ellipse cx="72" cy="78" rx="22" ry="11" fill="#F4E9D8" />
      {/* Cloud right */}
      <ellipse cx="428" cy="64" rx="26" ry="13" fill="#F4E9D8" />
      <ellipse cx="410" cy="68" rx="18" ry="11" fill="#F4E9D8" />
      <ellipse cx="446" cy="70" rx="20" ry="10" fill="#F4E9D8" />
      {/* Far-left tree */}
      <rect x="29" y="250" width="10" height="60" rx="4" fill="#354a2c" />
      <ellipse cx="34" cy="228" rx="26" ry="34" fill="#415338" />
      <ellipse cx="30" cy="218" rx="18" ry="24" fill="#4e6640" opacity="0.7" />
      {/* Left mid tree */}
      <rect x="80" y="260" width="8" height="50" rx="3" fill="#354a2c" />
      <ellipse cx="84" cy="244" rx="20" ry="26" fill="#415338" opacity="0.85" />
      {/* Main building — side wings */}
      <rect x="108" y="182" width="80" height="130" rx="4" fill="#EDE0CC" stroke="#E4D9CC" strokeWidth="1.5" />
      <rect x="292" y="182" width="80" height="130" rx="4" fill="#EDE0CC" stroke="#E4D9CC" strokeWidth="1.5" />
      {/* Main building — central body */}
      <rect x="152" y="142" width="176" height="170" rx="4" fill="#F4E9D8" stroke="#E4D9CC" strokeWidth="2" />
      {/* Wing roofs */}
      <path d="M96 186 L148 148 L200 186 Z" fill="#E63948" opacity="0.85" />
      <path d="M280 186 L332 148 L384 186 Z" fill="#E63948" opacity="0.85" />
      {/* Main roof */}
      <path d="M136 146 L240 56 L344 146 Z" fill="#E63948" />
      <path d="M140 146 L240 60 L340 146" fill="none" stroke="#c42535" strokeWidth="1" opacity="0.3" />
      {/* Chimney */}
      <rect x="290" y="78" width="16" height="52" rx="2" fill="#2E2348" />
      <rect x="286" y="74" width="24" height="10" rx="2" fill="#1C1534" />
      {/* Wing windows */}
      <rect x="125" y="208" width="28" height="36" rx="4" fill="#2E5C8A" opacity="0.22" stroke="#2E2348" strokeWidth="1.5" />
      <path d="M125 220 Q139 208 153 220" fill="none" stroke="#2E2348" strokeWidth="1" opacity="0.6" />
      <rect x="327" y="208" width="28" height="36" rx="4" fill="#2E5C8A" opacity="0.22" stroke="#2E2348" strokeWidth="1.5" />
      <path d="M327 220 Q341 208 355 220" fill="none" stroke="#2E2348" strokeWidth="1" opacity="0.6" />
      {/* Center top windows */}
      <rect x="184" y="162" width="28" height="36" rx="4" fill="#F4C48F" opacity="0.38" stroke="#2E2348" strokeWidth="1.5" />
      <path d="M184 174 Q198 162 212 174" fill="none" stroke="#2E2348" strokeWidth="1" opacity="0.5" />
      <rect x="268" y="162" width="28" height="36" rx="4" fill="#F4C48F" opacity="0.38" stroke="#2E2348" strokeWidth="1.5" />
      <path d="M268 174 Q282 162 296 174" fill="none" stroke="#2E2348" strokeWidth="1" opacity="0.5" />
      {/* Center lower windows */}
      <rect x="184" y="214" width="28" height="36" rx="4" fill="#2E5C8A" opacity="0.2" stroke="#2E2348" strokeWidth="1.5" />
      <rect x="268" y="214" width="28" height="36" rx="4" fill="#2E5C8A" opacity="0.2" stroke="#2E2348" strokeWidth="1.5" />
      {/* Main door — arched */}
      <rect x="214" y="246" width="52" height="66" rx="26" fill="#2E2348" />
      <rect x="218" y="250" width="44" height="48" rx="22" fill="#2E5C8A" opacity="0.45" />
      <circle cx="258" cy="282" r="3" fill="#F4C48F" />
      {/* Door step */}
      <rect x="200" y="308" width="80" height="7" rx="2" fill="#E4D9CC" />
      {/* Path */}
      <path d="M222 312 L206 360 L274 360 L258 312 Z" fill="#EDE0CC" opacity="0.9" />
      {/* Right mid tree */}
      <rect x="390" y="260" width="8" height="50" rx="3" fill="#354a2c" />
      <ellipse cx="394" cy="244" rx="20" ry="26" fill="#415338" opacity="0.85" />
      {/* Far-right tree */}
      <rect x="438" y="248" width="10" height="62" rx="4" fill="#354a2c" />
      <ellipse cx="443" cy="226" rx="26" ry="34" fill="#415338" />
      <ellipse cx="448" cy="216" rx="18" ry="24" fill="#4e6640" opacity="0.7" />
      {/* Bushes */}
      <ellipse cx="118" cy="310" rx="24" ry="10" fill="#415338" opacity="0.55" />
      <ellipse cx="362" cy="310" rx="22" ry="10" fill="#415338" opacity="0.55" />
      <ellipse cx="192" cy="314" rx="14" ry="7" fill="#415338" opacity="0.4" />
      <ellipse cx="288" cy="314" rx="14" ry="7" fill="#415338" opacity="0.4" />
      {/* Sun accent */}
      <circle cx="406" cy="46" r="18" fill="#F4C48F" opacity="0.55" />
      <circle cx="406" cy="46" r="12" fill="#F4C48F" opacity="0.4" />
    </svg>
  )
}
