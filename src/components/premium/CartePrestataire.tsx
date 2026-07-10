import { Trash2 } from 'lucide-react'
import type { Prestataire } from '../../lib/premium-types'

export function CartePrestataire({ prestataire, onDelete }: { prestataire: Prestataire; onDelete: (id: string) => void }) {
  const p = prestataire
  return (
    <div className="bg-white rounded-xl border border-line p-4 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-navy text-sm">{p.nom_entreprise}</p>
          <p className="text-[11px] font-bold uppercase tracking-wide text-bleu mt-0.5">{p.categorie}</p>
        </div>
        <button onClick={() => onDelete(p.id)} aria-label="Supprimer" className="p-1.5 rounded-lg text-slate hover:text-coral hover:bg-coral/8 transition-colors">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      <div className="mt-2 space-y-0.5 text-xs text-slate">
        {p.contact_nom && <p>{p.contact_nom}</p>}
        {p.email && <p>{p.email}</p>}
        {p.numero_bce_tva && <p>BCE/TVA : {p.numero_bce_tva}</p>}
      </div>
    </div>
  )
}
