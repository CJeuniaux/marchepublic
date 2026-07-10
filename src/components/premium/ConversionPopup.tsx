import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

// Encart de conversion à afficher après le résultat du diagnostic (pour visiteurs non connectés).
// NON branché dans le diagnostic pour l'instant : câbler dans le composant résultat
// nécessite de modifier Diagnostic.tsx (zone protégée) — à faire sur accord explicite.
export function ConversionPopup() {
  return (
    <div className="max-w-2xl mx-auto mt-8 rounded-2xl border border-line bg-white p-6 shadow-card">
      <p className="font-display text-xl font-bold text-navy mb-1.5">Passez du diagnostic aux documents</p>
      <p className="text-slate text-sm mb-4">
        Créez votre compte pour générer vos documents de marché public pré-remplis à partir de votre situation, à 9 EUR par document.
      </p>
      <Link to="/register" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-coral text-white text-sm font-semibold hover:brightness-105 transition-all shadow-coral">
        Créer mon compte <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  )
}
