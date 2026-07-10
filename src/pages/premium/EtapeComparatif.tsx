import { useMemo } from 'react'
import { Trophy } from 'lucide-react'
import { useOffres } from '../../hooks/useOffres'
import type { Marche } from '../../lib/premium-types'

// Étape Comparatif : notation des offres conformes.
// - Si des critères d'attribution sont définis : note pondérée par critère (0 à 100).
// - Sinon : classement au prix le plus bas (offre conforme la moins chère = meilleure).
export function EtapeComparatif({ marche }: { marche: Marche }) {
  const { offres, update } = useOffres(marche.id)
  const criteres = marche.criteres_attribution ?? []
  const surCriteres = criteres.length > 0

  const conformes = offres.filter(o => o.conforme)

  // Recalcule le score pondéré d'une offre à partir de ses notes par critère.
  const setScore = async (offreId: string, critereSlug: string, note: number) => {
    const offre = offres.find(o => o.id === offreId)
    if (!offre) return
    const scores = { ...(offre.scores ?? {}), [critereSlug]: note }
    const totalPond = criteres.reduce((s, c) => s + c.ponderation, 0) || 1
    const score_total = criteres.reduce((s, c) => s + (scores[c.critere] ?? 0) * c.ponderation, 0) / totalPond
    await update(offreId, { scores, score_total: Math.round(score_total * 100) / 100 })
  }

  // Classement.
  const classees = useMemo(() => {
    const arr = [...conformes]
    if (surCriteres) {
      arr.sort((a, b) => (b.score_total ?? 0) - (a.score_total ?? 0))
    } else {
      arr.sort((a, b) => (a.montant_htva ?? Infinity) - (b.montant_htva ?? Infinity))
    }
    return arr
  }, [conformes, surCriteres])

  const meilleurId = classees[0]?.id

  if (conformes.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-line p-6 shadow-card">
        <p className="text-sm text-slate">Aucune offre conforme à comparer. Reviens à l'étape « Réception des offres » pour marquer les offres conformes.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-line p-6 shadow-card">
      <p className="font-semibold text-navy text-sm mb-1">Comparatif des offres conformes ({conformes.length})</p>
      <p className="text-xs text-slate mb-4">
        {surCriteres
          ? 'Attribue une note de 0 à 100 par critère. Le score global est pondéré automatiquement.'
          : 'Aucun critère d\'attribution défini : classement au prix le plus bas.'}
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="text-left text-slate border-b border-line">
              <th className="py-2 pr-3 font-medium">Rang</th>
              <th className="py-2 pr-3 font-medium">Opérateur</th>
              <th className="py-2 pr-3 font-medium">Montant HTVA</th>
              {surCriteres && criteres.map(c => (
                <th key={c.critere} className="py-2 pr-3 font-medium whitespace-nowrap">{c.critere} <span className="text-slate/60">({c.ponderation}%)</span></th>
              ))}
              <th className="py-2 pr-3 font-medium">{surCriteres ? 'Score' : ''}</th>
            </tr>
          </thead>
          <tbody>
            {classees.map((o, i) => (
              <tr key={o.id} className={`border-b border-line/60 ${o.id === meilleurId ? 'bg-teal/5' : ''}`}>
                <td className="py-2 pr-3">
                  {o.id === meilleurId ? <Trophy className="w-4 h-4 text-teal inline" /> : <span className="text-slate">{i + 1}</span>}
                </td>
                <td className="py-2 pr-3 font-medium text-navy">{o.nom_operateur}</td>
                <td className="py-2 pr-3 text-navy">{o.montant_htva != null ? `${o.montant_htva.toLocaleString('fr-BE')} €` : '—'}</td>
                {surCriteres && criteres.map(c => (
                  <td key={c.critere} className="py-2 pr-3">
                    <input
                      type="number" min={0} max={100}
                      value={o.scores?.[c.critere] ?? ''}
                      onChange={e => setScore(o.id, c.critere, Number(e.target.value))}
                      className="w-16 text-sm border border-line rounded-lg px-2 py-1"
                    />
                  </td>
                ))}
                <td className="py-2 pr-3 font-semibold text-navy">{surCriteres ? (o.score_total != null ? o.score_total.toFixed(1) : '—') : ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-[11px] text-slate mt-4">
        L'offre en tête ({classees[0]?.nom_operateur}) est mise en évidence. La décision d'attribution motivée se fait à l'étape suivante.
      </p>
    </div>
  )
}
