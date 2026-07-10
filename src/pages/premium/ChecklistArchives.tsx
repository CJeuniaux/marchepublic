import type { Marche } from '../../lib/premium-types'

// Points de conservation à cocher en fin de procédure.
const POINTS: { slug: string; label: string }[] = [
  { slug: 'csc', label: 'Cahier spécial des charges et avis conservés' },
  { slug: 'consultation', label: 'Preuves d\'envoi des demandes d\'offre archivées' },
  { slug: 'offres', label: 'Offres reçues conservées (avec pièces jointes)' },
  { slug: 'comparatif', label: 'Tableau comparatif / rapport d\'analyse documenté' },
  { slug: 'dma', label: 'Décision motivée d\'attribution signée' },
  { slug: 'notif_retenu', label: 'Notification d\'attribution envoyée à l\'adjudicataire' },
  { slug: 'notif_non_retenus', label: 'Information des soumissionnaires non retenus' },
  { slug: 'conservation', label: 'Dossier conservé selon les délais légaux applicables' },
]

// Étape Archives : checklist de conservation persistée dans marche.checklist_archives.
export function ChecklistArchives({ marche, onUpdate }: {
  marche: Marche
  onUpdate: (patch: Partial<Marche>) => Promise<{ error: string | null }>
}) {
  const etat = marche.checklist_archives ?? {}
  const faits = POINTS.filter(pt => etat[pt.slug]).length

  const toggle = async (slug: string, val: boolean) => {
    await onUpdate({ checklist_archives: { ...etat, [slug]: val } })
  }

  const cloturer = async () => {
    await onUpdate({ statut: 'archive' })
  }

  return (
    <div className="bg-white rounded-2xl border border-line p-6 shadow-card space-y-4">
      <div>
        <p className="font-semibold text-navy text-sm">Checklist d'archivage</p>
        <p className="text-xs text-slate">{faits} / {POINTS.length} points validés. Conservez l'ensemble du dossier selon les délais légaux applicables.</p>
      </div>

      <ul className="space-y-2">
        {POINTS.map(pt => (
          <li key={pt.slug}>
            <label className="flex items-start gap-2.5 text-sm text-navy cursor-pointer">
              <input type="checkbox" checked={!!etat[pt.slug]} onChange={e => toggle(pt.slug, e.target.checked)} className="mt-0.5 accent-teal" />
              <span className={etat[pt.slug] ? 'line-through text-slate' : ''}>{pt.label}</span>
            </label>
          </li>
        ))}
      </ul>

      {marche.statut !== 'archive' ? (
        <button onClick={cloturer} disabled={faits < POINTS.length} className="inline-flex items-center gap-1.5 text-sm font-semibold text-white bg-teal rounded-lg px-4 py-2 hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
          Clôturer et archiver le marché public
        </button>
      ) : (
        <p className="text-sm text-teal font-medium">Marché public archivé.</p>
      )}
      {marche.statut !== 'archive' && faits < POINTS.length && (
        <p className="text-[11px] text-slate">Cochez tous les points pour pouvoir clôturer.</p>
      )}
    </div>
  )
}
