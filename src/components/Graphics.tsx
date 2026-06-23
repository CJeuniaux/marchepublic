/**
 * SVG illustration components for marchépublic.be
 * No official/government symbols. No regional emblems.
 */

interface SVGProps { className?: string }

// ─── LogoMark ──────────────────────────────────────────────────────────────
// A compass-style mark: a circle with a directional arrow path — orientation
export function LogoMark({ className, nodeColor = '#2E2348' }: SVGProps & { nodeColor?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="16" cy="16" r="14" stroke={nodeColor} strokeWidth="2.5" fill="none" />
      {/* North arrow — filled */}
      <polygon points="16,4 13,18 16,15 19,18" fill={nodeColor} />
      {/* South arrow — outline */}
      <polygon points="16,28 13,14 16,17 19,14" fill={nodeColor} opacity="0.30" />
      {/* Center dot */}
      <circle cx="16" cy="16" r="2" fill={nodeColor} />
    </svg>
  )
}

// ─── Constellation ─────────────────────────────────────────────────────────
// Scattered dots with connecting lines — atmospheric background decoration
export function Constellation({ className }: SVGProps) {
  return (
    <svg className={className} viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <line x1="30" y1="20" x2="80" y2="60" stroke="currentColor" strokeWidth="0.8" />
      <line x1="80" y1="60" x2="140" y2="30" stroke="currentColor" strokeWidth="0.8" />
      <line x1="140" y1="30" x2="170" y2="90" stroke="currentColor" strokeWidth="0.8" />
      <line x1="80" y1="60" x2="100" y2="120" stroke="currentColor" strokeWidth="0.8" />
      <line x1="100" y1="120" x2="170" y2="90" stroke="currentColor" strokeWidth="0.8" />
      <line x1="30" y1="20" x2="10" y2="80" stroke="currentColor" strokeWidth="0.8" />
      <line x1="10" y1="80" x2="100" y2="120" stroke="currentColor" strokeWidth="0.8" />
      <line x1="140" y1="30" x2="190" y2="20" stroke="currentColor" strokeWidth="0.8" />
      <circle cx="30"  cy="20"  r="3" fill="currentColor" />
      <circle cx="80"  cy="60"  r="4" fill="currentColor" />
      <circle cx="140" cy="30"  r="3" fill="currentColor" />
      <circle cx="170" cy="90"  r="3.5" fill="currentColor" />
      <circle cx="100" cy="120" r="3" fill="currentColor" />
      <circle cx="10"  cy="80"  r="2.5" fill="currentColor" />
      <circle cx="190" cy="20"  r="2" fill="currentColor" />
      <circle cx="60"  cy="140" r="2" fill="currentColor" />
      <circle cx="155" cy="145" r="2.5" fill="currentColor" />
    </svg>
  )
}

// ─── HeroPathScene ─────────────────────────────────────────────────────────
// Abstract path illustration for hero section background
export function HeroPathScene({ className }: SVGProps) {
  return (
    <svg className={className} viewBox="0 0 480 320" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="pathGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#58B77A" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#E85D5A" stopOpacity="0.15" />
        </linearGradient>
      </defs>
      {/* Wavy path lines — abstract orientation */}
      <path d="M20,160 C80,80 160,240 260,120 S400,60 460,100" stroke="url(#pathGrad)" strokeWidth="2" fill="none" strokeDasharray="8 4" />
      <path d="M20,200 C100,140 180,280 280,180 S420,100 460,140" stroke="url(#pathGrad)" strokeWidth="1" fill="none" opacity="0.5" />
      {/* Nodes on path */}
      <circle cx="80"  cy="120" r="6" fill="#58B77A" fillOpacity="0.5" />
      <circle cx="200" cy="160" r="8" fill="#F6C65B" fillOpacity="0.6" />
      <circle cx="340" cy="90"  r="6" fill="#58B77A" fillOpacity="0.5" />
      <circle cx="440" cy="110" r="10" fill="#E85D5A" fillOpacity="0.4" />
      {/* Arrow at end */}
      <polygon points="460,100 448,92 448,108" fill="#E85D5A" fillOpacity="0.5" />
    </svg>
  )
}

// ─── TangleToArrow ─────────────────────────────────────────────────────────
// Illustration: tangled lines on the left → clear arrow on the right
// "Du doute à un chemin clair"
export function TangleToArrow({ className }: SVGProps) {
  return (
    <svg className={className} viewBox="0 0 280 160" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Tangled left side */}
      <path d="M20,80 C30,40 60,120 50,80 S80,30 70,80 C60,130 90,50 80,80" stroke="#5E6B7D" strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.5" />
      <path d="M30,60 C50,100 40,50 55,90 S45,30 60,70" stroke="#5E6B7D" strokeWidth="1.4" fill="none" strokeLinecap="round" opacity="0.35" />
      {/* Transition zone */}
      <line x1="100" y1="20" x2="100" y2="140" stroke="#E4D9CC" strokeWidth="1" strokeDasharray="4 4" />
      {/* Clear arrow right side */}
      <path d="M120,80 L240,80" stroke="#58B77A" strokeWidth="3" strokeLinecap="round" />
      <polygon points="248,80 234,72 234,88" fill="#58B77A" />
      {/* Supporting sub-lines */}
      <path d="M120,60 Q180,55 230,65" stroke="#58B77A" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.4" />
      <path d="M120,100 Q180,105 230,95" stroke="#58B77A" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.4" />
      {/* Start node */}
      <circle cx="20" cy="80" r="7" fill="#E4D9CC" stroke="#5E6B7D" strokeWidth="1.5" />
      {/* End node */}
      <circle cx="260" cy="80" r="10" fill="#58B77A" />
      <path d="M255,80 L259,84 L266,76" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ─── ChecklistCard ─────────────────────────────────────────────────────────
// A checklist UI card illustration
export function ChecklistCard({ className }: SVGProps) {
  return (
    <svg className={className} viewBox="0 0 240 180" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Card background */}
      <rect x="10" y="10" width="220" height="160" rx="16" fill="#FBF7EC" stroke="#E4D9CC" strokeWidth="1.5" />
      {/* Header bar */}
      <rect x="10" y="10" width="220" height="36" rx="16" fill="#2E2348" />
      <rect x="10" y="32" width="220" height="14" fill="#2E2348" />
      <text x="28" y="33" fontSize="10" fontWeight="700" fill="white" fontFamily="Inter, sans-serif">marchépublic.be</text>
      {/* Checklist items */}
      {[0, 1, 2, 3].map((i) => {
        const y = 66 + i * 26
        const done = i < 3
        return (
          <g key={i}>
            <rect x="24" y={y} width="192" height="18" rx="6" fill={done ? '#F4E9D8' : 'white'} stroke={done ? '#E4D9CC' : '#E4D9CC'} strokeWidth="1" />
            <circle cx="38" cy={y + 9} r="6" fill={done ? '#58B77A' : 'white'} stroke={done ? '#58B77A' : '#E4D9CC'} strokeWidth="1.5" />
            {done && (
              <path d={`M${35},${y+9} L${37},${y+11} L${42},${y+6}`} stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            )}
            <rect x="50" y={y + 4} width={done ? 100 : 80} height="6" rx="3" fill={done ? '#5E6B7D' : '#E4D9CC'} opacity={done ? 0.5 : 0.4} />
          </g>
        )
      })}
    </svg>
  )
}

// ─── RisingPath ────────────────────────────────────────────────────────────
// An upward-trending path with a node at the top
export function RisingPath({ className, stroke = '#58B77A', hollow = '#FBF7EC' }: SVGProps & { stroke?: string; hollow?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M10,70 C30,65 40,50 60,40 S90,15 110,10" stroke={stroke} strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* Nodes along path */}
      <circle cx="10"  cy="70" r="5" fill={hollow} stroke={stroke} strokeWidth="2" />
      <circle cx="60"  cy="40" r="5" fill={hollow} stroke={stroke} strokeWidth="2" />
      <circle cx="110" cy="10" r="7" fill={stroke} />
      <path d="M107,10 L110,13 L114,6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ─── Signpost ──────────────────────────────────────────────────────────────
// A direction signpost — "Ce que le test peut clarifier"
export function Signpost({ className }: SVGProps) {
  return (
    <svg className={className} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Post */}
      <rect x="16.5" y="18" width="3" height="14" rx="1.5" fill="#2E2348" />
      {/* Upper sign */}
      <path d="M6,8 L28,8 L32,13 L28,18 L6,18 Z" fill="#58B77A" />
      {/* Lower sign */}
      <path d="M30,22 L8,22 L4,27 L8,32 L30,32 Z" fill="#F6C65B" opacity="0.85" />
      {/* Text lines on signs */}
      <line x1="10" y1="12" x2="22" y2="12" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="10" y1="15" x2="18" y2="15" stroke="white" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
      <line x1="12" y1="26" x2="24" y2="26" stroke="#2E2348" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
    </svg>
  )
}
