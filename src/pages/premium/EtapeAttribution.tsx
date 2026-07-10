import { useState } from 'react'
import { FileDown, Check, CreditCard } from 'lucide-react'
import { useOffres } from '../../hooks/useOffres'
import type { Marche, Organisation } from '../../lib/premium-types'
import { PRIX_COURRIER_SUR_MESURE_EUR } from '../../lib/documents'
import { startCheckout } from '../../lib/checkout'

// Étape Attribution : choix de l'adjudicataire, motivation, et génération de la DMA.
export function EtapeAttribution({ marche, organisation, onUpdate }: {
  marche: Marche
  organisation: Organisation
  onUpdate: (patch: Partial<Marche>) => Promise<{ error: string | null }>
}) {
  const { offres, update: updateOffre } = useOffres(marche.id)
  const conformes = offres.filter(o => o.conforme)

  const [retenuId, setRetenuId] = useState<string>(marche.prestataire_retenu_id ?? '')
  const [justif, setJustif] = useState(marche.justification_choix ?? '')
  const [lieu, setLieu] = useState(marche.lieu_decision ?? '')
  const [date, setDate] = useState(marche.date_attribution ?? new Date().toISOString().slice(0, 10))
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [paying, setPaying] = useState(false)

  const payerDma = async () => {
    setPaying(true)
    try {
      await startCheckout(marche.id, 'dma')
    } catch (e) {
      alert('Paiement indisponible : ' + String(e))
      setPaying(false)
    }
  }

  // L'offre retenue est identifiée par son prestataire_id (offres du carnet).
  const offreRetenue = conformes.find(o => o.prestataire_id === retenuId) ?? null

  const enregistrer = async () => {
    setSaving(true)
    await onUpdate({
      prestataire_retenu_id: retenuId || null,
      justification_choix: justif || null,
      lieu_decision: lieu.trim() || null,
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

        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-slate">Lieu de la décision</label>
            <input value={lieu} onChange={e => setLieu(e.target.value)} placeholder="ex. Namur" className="w-full mt-1 text-sm border border-line rounded-lg px-3 py-2" />
          </div>
          <div>
            <label className="text-xs text-slate">Date de la décision</label>
            <input value={date} onChange={e => setDate(e.target.value)} type="date" className="w-full mt-1 text-sm border border-line rounded-lg px-3 py-2" />
          </div>
        </div>

        <button onClick={enregistrer} disabled={saving} className="inline-flex items-center gap-1.5 text-sm font-semibold text-white bg-navy rounded-lg px-4 py-2 hover:brightness-110 transition-all disabled:opacity-50">
          {saved ? <><Check className="w-4 h-4" /> Enregistré</> : saving ? 'Enregistrement…' : 'Enregistrer la décision'}
        </button>
      </div>

      {/* Motifs de non-attribution (requis pour chaque offre conforme écartée) */}
      {retenuId && conformes.some(o => o.prestataire_id !== retenuId) && (
        <div className="bg-white rounded-2xl border border-line p-6 shadow-card space-y-3">
          <div>
            <p className="font-semibold text-navy text-sm">Motifs de non-attribution</p>
            <p className="text-xs text-slate">Motivez le rejet de chaque offre écartée — cette information est requise et figurera dans la décision.</p>
          </div>
          {conformes.filter(o => o.prestataire_id !== retenuId).map(o => (
            <div key={o.id}>
              <label className="text-xs font-medium text-navy">{o.nom_operateur}</label>
              <textarea
                defaultValue={o.motif_non_retenu ?? ''}
                onBlur={e => updateOffre(o.id, { motif_non_retenu: e.target.value.trim() || null })}
                rows={2}
                placeholder="ex. Offre régulière mais score global inférieur au regard des critères annoncés."
                className="w-full mt-1 text-sm border border-line rounded-lg px-3 py-2 leading-relaxed"
              />
            </div>
          ))}
        </div>
      )}

      {/* Génération de la DMA */}
      <div className="bg-sable rounded-2xl border border-line p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-semibold text-navy text-sm">Décision Motivée d'Attribution (.docx)</p>
            <p className="text-xs text-slate">Document officiel notifiant le choix de l'adjudicataire.</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={genererDma} disabled={generating} className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy border border-line bg-white rounded-lg px-4 py-2 hover:border-coral/50 hover:text-coral transition-colors disabled:opacity-50">
              <FileDown className="w-4 h-4" /> {generating ? 'Génération…' : 'Aperçu (gratuit)'}
            </button>
            {marche.dma_paye ? (
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal"><Check className="w-4 h-4" /> Payé</span>
            ) : (
              <button onClick={payerDma} disabled={paying} className="inline-flex items-center gap-1.5 text-sm font-semibold text-white bg-coral rounded-lg px-4 py-2 hover:brightness-105 transition-all shadow-coral disabled:opacity-60">
                <CreditCard className="w-4 h-4" /> {paying ? 'Redirection…' : `Version définitive · ${PRIX_COURRIER_SUR_MESURE_EUR} EUR`}
              </button>
            )}
          </div>
        </div>
        <p className="text-[11px] text-slate mt-3">
          L'aperçu est gratuit et rempli avec vos données. La version définitive de la DMA est facturée {PRIX_COURRIER_SUR_MESURE_EUR} EUR TVA incluse.
        </p>
      </div>
    </div>
  )
}
