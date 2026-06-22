/** Motifs graphiques réutilisables : parcours de décision, panneaux, repères. */

export function HeroPathScene({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 420 380" className={className} fill="none" aria-hidden>
      {/* trajectoire principale */}
      <path d="M40 340 C 80 260, 60 210, 140 190 S 250 150, 230 90 S 320 40, 380 60"
        stroke="#DDF7F4" strokeWidth={2.5} strokeLinecap="round" strokeDasharray="2 10" opacity={0.7} />
      <path d="M40 340 C 80 260, 60 210, 140 190 S 250 150, 230 90 S 320 40, 380 60"
        stroke="#45C7C7" strokeWidth={3} strokeLinecap="round" />
      {/* bifurcation */}
      <path d="M140 190 C 180 210, 240 230, 300 215" stroke="#FFD66B" strokeWidth={2.5} strokeLinecap="round" strokeDasharray="6 8" />
      {/* noeuds */}
      <circle cx="40" cy="340" r="8" fill="#FFFFFF" stroke="#45C7C7" strokeWidth={3} />
      <circle cx="140" cy="190" r="7" fill="#10284A" />
      <circle cx="230" cy="90" r="7" fill="#10284A" />
      <circle cx="300" cy="215" r="6" fill="#FFD66B" />
      {/* drapeau d'arrivée */}
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
