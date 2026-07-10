import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, FileDown } from 'lucide-react'
import { LogoMark } from '../../components/Graphics'
import { useMarche } from '../../hooks/useMarches'
import { useOrganisation } from '../../hooks/useOrganisation'
import { usePrestataires } from '../../hooks/usePrestataires'
import { libelleDocument, LIBELLE_PROCEDURE, PRIX_MARCHE_PUBLIC_EUR } from '../../lib/documents'
import type { Procedure } from '../../lib/documents'
import { WORKFLOW_ETAPES, LIBELLE_ETAPE, type WorkflowEtape } from '../../lib/premium-types'
import { TimelineMarche } from './TimelineMarche'

export function DetailMarche() {
  const { id } = useParams()
  const { marche, loading, update } = useMarche(id)
  const { organisation } = useOrganisation()
  const { prestataires } = usePrestataires(organisation?.id)
  const [generating, setGenerating] = useState(false)
  // Étape affichée : par défaut celle du marché, mais navigable via la timeline.
  const [vue, setVue] = useState<WorkflowEtape | null>(null)

  const docs = marche?.documents_selectionnes ?? []
  const etape = marche?.workflow_etape ?? 'preparation'
  const etapeVue = vue ?? etape

  const handleExport = async () => {
    if (!marche || !organisation) return
    setGenerating(true)
    try {
      const ids = marche.prestataires_selectionnes ?? []
      const presSel = prestataires.filter(p => ids.includes(p.id))
      const { downloadMarcheDocx } = await import('../../lib/generateMarcheDocx')
      await downloadMarcheDocx(marche, organisation, presSel)
    } catch (e) {
      alert('Erreur de génération : ' + String(e))
    } finally {
      setGenerating(false)
    }
  }

  const avancer = async () => {
    const idx = WORKFLOW_ETAPES.indexOf(etape)
    const next = WORKFLOW_ETAPES[idx + 1]
    if (!next) return
    await update({ workflow_etape: next })
    setVue(next)
  }

  const idxCourant = WORKFLOW_ETAPES.indexOf(etape)
  const prochaine = WORKFLOW_ETAPES[idxCourant + 1]

  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-white border-b border-line">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <LogoMark className="h-6 w-auto" nodeColor="#2E2348" />
            <span className="font-display font-bold text-navy text-[15px]">marchépublic<span className="text-coral">.be</span></span>
          </Link>
          <Link to="/compte" className="flex items-center gap-2 text-sm font-medium text-slate hover:text-navy"><ArrowLeft className="w-4 h-4" /> Mon espace</Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        {loading ? (
          <p className="text-slate text-sm">Chargement…</p>
        ) : !marche ? (
          <p className="text-slate text-sm">Marché public introuvable.</p>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-6">
              <h1 className="font-display text-3xl font-bold text-navy">{marche.objet}</h1>
              <span className={`text-[11px] font-bold uppercase tracking-wide px-2 py-0.5 rounded ${marche.statut === 'paye' ? 'bg-teal/10 text-teal' : 'bg-sun/30 text-navy'}`}>{marche.statut}</span>
            </div>

            {/* Timeline du cycle de vie */}
            <div className="bg-white rounded-2xl border border-line p-5 shadow-card mb-6">
              <TimelineMarche etape={etape} onSelect={setVue} />
            </div>

            {/* Rendu conditionnel par étape */}
            {etapeVue === 'preparation' ? (
              <>
                <div className="bg-white rounded-2xl border border-line p-6 shadow-card space-y-2 text-sm mb-6">
                  <p><span className="text-slate">Type :</span> <span className="text-navy font-medium">{marche.type_achat}</span></p>
                  <p><span className="text-slate">Montant estimé :</span> <span className="text-navy font-medium">{marche.montant_estime_htva.toLocaleString('fr-BE')} EUR HTVA</span></p>
                  <p><span className="text-slate">Procédure :</span> <span className="text-navy font-medium">{LIBELLE_PROCEDURE[marche.procedure as Procedure] ?? marche.procedure}</span></p>
                </div>

                <div className="bg-white rounded-2xl border border-line p-6 shadow-card mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-semibold text-navy text-sm">Documents ({docs.length})</p>
                    <button onClick={handleExport} disabled={generating || !organisation} className="inline-flex items-center gap-1.5 text-xs font-semibold text-navy border border-line rounded-lg px-3 py-1.5 hover:border-coral/50 hover:text-coral transition-colors disabled:opacity-50">
                      <FileDown className="w-3.5 h-3.5" /> {generating ? 'Génération…' : 'Aperçu .docx (gratuit)'}
                    </button>
                  </div>
                  <ul className="space-y-1 text-sm text-slate list-disc list-inside">
                    {docs.map(slug => <li key={slug}>{libelleDocument(slug)}</li>)}
                  </ul>
                  <p className="text-[11px] text-slate mt-3">Aperçu temporaire du récapitulatif rempli avec vos données. La génération complète des documents officiels sera disponible après paiement (Phase 6).</p>
                </div>

                {marche.statut === 'paye' ? (
                  <div className="bg-teal/10 border border-teal/30 rounded-2xl p-6 text-sm text-navy">
                    Paiement confirmé. La génération et le téléchargement des documents seront disponibles ici (Phase 6).
                  </div>
                ) : (
                  <div className="bg-sable rounded-2xl border border-line p-6 flex items-center justify-between">
                    <div>
                      <p className="text-navy font-semibold">{PRIX_MARCHE_PUBLIC_EUR} EUR TVA incluse</p>
                      <p className="text-slate text-xs">Marché public complet · {docs.length} document{docs.length > 1 ? 's' : ''}</p>
                    </div>
                    <Link to={`/compte/marches/${marche.id}/paiement`} className="px-5 py-2.5 rounded-lg bg-coral text-white text-sm font-semibold hover:brightness-105 transition-all shadow-coral">
                      Payer et générer
                    </Link>
                  </div>
                )}
              </>
            ) : (
              // Étapes Consultation → Archives : interfaces livrées aux Phases 11 et 12.
              <div className="bg-white rounded-2xl border border-line p-6 shadow-card">
                <p className="font-semibold text-navy text-sm mb-1">{LIBELLE_ETAPE[etapeVue]}</p>
                <p className="text-sm text-slate">
                  Cette étape sera pilotable ici prochainement (suivi des envois, saisie des offres,
                  comparatif, décision motivée d'attribution et archives).
                </p>
              </div>
            )}

            {/* Avancer d'étape (visible tant qu'on est sur l'étape courante et qu'il en reste une) */}
            {etapeVue === etape && prochaine && (
              <div className="mt-6 flex justify-end">
                <button
                  onClick={avancer}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-navy text-white text-sm font-semibold hover:brightness-110 transition-all"
                >
                  Passer à « {LIBELLE_ETAPE[prochaine]} » <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
