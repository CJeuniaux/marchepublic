import { useState } from 'react'
import { FileDown, Check } from 'lucide-react'
import { useOffres } from '../../hooks/useOffres'
import type { Marche, Organisation } from '../../lib/premium-types'
import { PRIX_COURRIER_SUR_MESURE_EUR } from '../../lib/documents'

// Étape Attribution : choix de l'adjudicataire, motivation, et génération de la DMA.
export function EtapeAttribution({ marche, organisation, onUpdate }: {
  marche: Marche
  organisation: Organisation
  onUpdate: (patch: Partial<Marche>) => Promise<{ error: string | null }>
}) {
  const { offres } = useOffres(marche.id)
  const conformes = offres.filter(o => o.conforme)

  const [retenuId, setRetenuId] = useState<string>(marche.prestataire_retenu_id ?? '')
  const [justif, setJustif] = useState(marche.justification_choix ?? '')
  const [date, setDate] = useState(marche.date_attribution ?? new Date().toISOString().slice(0, 10))
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [generating, setGenerating] = useState(false)

  // L'offre retenue est identifiée par son prestataire_id (offres du carnet).
  const offreRetenue = conformes.find(o => o.prestataire_id === retenuId) ?? null

  const enregistrer = async () => {
    setSaving(true)
    await onUpdate({
      prestataire_retenu_id: retenuId || null,
      justification_choix: justif || null,
      date_attribution: date || null,
    })
    setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2000)
  }

  const genererDma = async () => {
    setGenerating(true)
    try {
      const { downloadDmaDocx } = await import('../../lib/generateDmaDocx')
      await downloadDmaDocx(marche, organisation, offres, offreRetenue)
    } catch (e) {
      alert('Erreur de génération : ' + String(e))
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-line p-6 shadow-card space-y-4">
        <p className="font-semibold text-navy text-sm">Décision d'attribution</p>

        <div>
          <label className="text-xs text-slate">Adjudicataire retenu</label>
          <select value={retenuId} onChange={e => setRetenuId(e.target.value)} className="w-full mt-1 text-sm border border-line rounded-lg px-3 py-2 bg-white text-navy">
            <option value="">— Sélectionner une offre conforme —</option>
            {conformes.map(o => (
              <option key={o.id} value={o.prestataire_id ?? ''}>
                {o.nom_operateur}{o.montant_htva != null ? ` — ${o.montant_htva.toLocaleString('fr-BE')} € HTVA` : ''}
              </option>
            ))}
          </select>
          {conformes.length === 0 && <p className="text-xs text-coral mt-1">Aucune offre conforme. Marque au moins une offre conforme à l'étape « Réception des offres ».</p>}
        </div>

        <div>
          <label className="text-xs text-slate">Motivation du choix</label>
          <textarea value={justif} onChange={e => setJustif(e.target.value)} rows={5} placeholder="Exposez les motifs de fait et de droit : offre régulière, économiquement la plus avantageuse au regard des critères annoncés…" className="w-full mt-1 text-sm border border-line rounded-lg px-3 py-2 leading-relaxed" />
        </div>

        <div className="max-w-xs">
          <label className="text-xs text-slate">Date de la décision</label>
          <input value={date} onChange={e => setDate(e.target.value)} type="date" className="w-full mt-1 text-sm border border-line rounded-lg px-3 py-2" />
        </div>

        <button onClick={enregistrer} disabled={saving} className="inline-flex items-center gap-1.5 text-sm font-semibold text-white bg-navy rounded-lg px-4 py-2 hover:brightness-110 transition-all disabled:opacity-50">
          {saved ? <><Check className="w-4 h-4" /> Enregistré</> : saving ? 'Enregistrement…' : 'Enregistrer la décision'}
        </button>
      </div>

      {/* Génération de la DMA */}
      <div className="bg-sable rounded-2xl border border-line p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-semibold text-navy text-sm">Décision Motivée d'Attribution (.docx)</p>
            <p className="text-xs text-slate">Document officiel notifiant le choix de l'adjudicataire.</p>
          </div>
          <button onClick={genererDma} disabled={generating} className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy border border-line bg-white rounded-lg px-4 py-2 hover:border-coral/50 hover:text-coral transition-colors disabled:opacity-50">
            <FileDown className="w-4 h-4" /> {generating ? 'Génération…' : 'Aperçu .docx (gratuit)'}
          </button>
        </div>
        <p className="text-[11px] text-slate mt-3">
          Aperçu rempli avec vos données. La version définitive de la DMA (relecture, mise en forme finale) sera facturée {PRIX_COURRIER_SUR_MESURE_EUR} EUR une fois le paiement Stripe activé.
        </p>
      </div>
    </div>
  )
}
