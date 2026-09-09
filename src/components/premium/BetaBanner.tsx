import { useState } from 'react'
import { BETA_BANNER_TEXT } from '../../lib/beta'

// Bannière beta persistante et fermable, à afficher en haut des pages de l'espace compte.
export function BetaBanner() {
  const [dismissed, setDismissed] = useState(() => {
    try { return !!window.localStorage.getItem('mp_beta_banner_dismissed') } catch { return false }
  })
  if (dismissed) return null
  const close = () => {
    try { window.localStorage.setItem('mp_beta_banner_dismissed', '1') } catch { /* ignore */ }
    setDismissed(true)
  }
  return (
    <div className="text-white" style={{ backgroundColor: '#2E2348' }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
        <p className="text-xs sm:text-sm leading-snug">{BETA_BANNER_TEXT}</p>
        <button onClick={close} aria-label="Fermer" className="shrink-0 text-white/70 hover:text-white text-lg leading-none">×</button>
      </div>
    </div>
  )
}

// Petit badge "BETA" à placer à côté d'un titre ou dans la navigation.
export function BetaBadge({ className = '' }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white ${className}`}
      style={{ backgroundColor: '#2E2348' }}
    >
      Beta
    </span>
  )
}
