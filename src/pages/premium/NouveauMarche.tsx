import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Check } from 'lucide-react'
import { LogoMark } from '../../components/Graphics'
import { useOrganisation } from '../../hooks/useOrganisation'
import { usePrestataires } from '../../hooks/usePrestataires'
import { useMarches } from '../../hooks/useMarches'
import { useProcedure } from '../../hooks/useProcedure'
import { DOCUMENTS_OPTIONNELS, libelleDocument, PRIX_MARCHE_PUBLIC_EUR } from '../../lib/documents'
import type { TypeAchat } from '../../lib/premium-types'

const STEPS = ['Identification', 'Dates & prestataires', 'Contenu', 'Documents & récap']

export function NouveauMarche() {
  const navigate = useNavigate()
  const { organisation, loading: orgLoading } = useOrganisation()
  const { prestataires } = usePrestataires(organisation?.id)
  const { create } = useMarches(organisation?.id)

  const [step, setStep] = useState(1)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  // Étape 1
  const [objet, setObjet] = useState('')
  const [typeAchat, setTypeAchat] = useState<TypeAchat>('services')
  const [montant, setMontant] = useState('')
  const montantNum = Number(montant) || 0
  const proc = useProcedure(montantNum, typeAchat)

  // Étape 2
  const [dateLancement, setDateLancement] = useState('')
  const [dateLimite, setDateLimite] = useState('')
  const [dateDebut, setDateDebut] = useState('')
  const [duree, setDuree] = useState('')
  const [prestaSel, setPrestaSel] = useState<string[]>([])
  const [filtreCat, setFiltreCat] = useState('Toutes')
  const categoriesDispo = ['Toutes', ...Array.from(new Set(prestataires.map(p => p.categorie)))]
  const prestatairesFiltres = filtreCat === 'Toutes' ? prestataires : prestataires.filter(p => p.categorie === filtreCat)

  // Étape 3
  const [description, setDescription] = useState('')
  const [inclureRgpd, setInclureRgpd] = useState(false)
  const [inclureRecours, setInclureRecours] = useState(false)

  // Étape 4 — documents cochés (par défaut : tous ceux de la procédure)
  const [docsSel, setDocsSel] = useState<string[] | null>(null)
  const docs = docsSel ?? proc.documents

  const toggle = (arr: string[], v: string) => arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v]

  const canNext = useMemo(() => {
    if (step === 1) return objet.trim() && montantNum > 0
    return true
  }, [step, objet, montantNum])

  const finish = async () => {
    if (!organisation) return
    setSaving(true); setError('')
    const { id, error } = await create({
      organisation_id: organisation.id,
      objet, type_achat: typeAchat, montant_estime_htva: montantNum,
      procedure: proc.procedure, seuil: proc.seuil,
      date_lancement: dateLancement || null, date_limite_offres: dateLimite || null,
      date_debut_execution: dateDebut || null, duree_marche: duree || null,
      description_besoin: description || null,
      prestataires_selectionnes: prestaSel, documents_selectionnes: docs,
      inclure_rgpd: inclureRgpd, inclure_voies_recours: inclureRecours,
    })
    setSaving(false)
    if (error || !id) { setError(error ?? 'Erreur inconnue'); return }
    navigate(`/compte/marches/${id}`)
  }

  const field = 'w-full px-3.5 py-2.5 rounded-lg border border-line bg-white text-navy text-sm focus:outline-none focus:border-navy/40 transition-colors'
  const lbl = 'block text-xs font-semibold text-navy mb-1.5'

  if (!orgLoading && !organisation) {
    return (
      <Shell>
        <div className="bg-white rounded-2xl border border-line p-8 text-center shadow-card max-w-md mx-auto">
          <p className="text-navy font-semibold mb-1">Complétez d'abord votre profil</p>
          <p className="text-slate text-sm mb-4">Un marché public est rattaché à votre organisation.</p>
          <Link to="/compte/profil" className="inline-block px-5 py-2.5 rounded-lg bg-navy text-white text-sm font-semibold hover:brightness-105">Compléter mon profil</Link>
        </div>
      </Shell>
    )
  }

  return (
    <Shell>
      <h1 className="font-display text-3xl font-bold text-navy mb-1">Nouveau marché public</h1>
      <p className="text-slate text-sm mb-6">Étape {step} sur 4 · {STEPS[step - 1]}</p>

      <div className="flex gap-1.5 mb-8">
        {STEPS.map((_, i) => (
          <div key={i} className={`h-1.5 flex-1 rounded-full ${i < step ? 'bg-coral' : 'bg-line'}`} />
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-line p-6 shadow-card space-y-5">
        {step === 1 && (
          <>
            <div>
              <label className={lbl}>Type d'achat *</label>
              <select className={field} value={typeAchat} onChange={e => setTypeAchat(e.target.value as TypeAchat)}>
                <option value="fournitures">Fournitures</option>
                <option value="services">Services</option>
                <option value="travaux">Travaux</option>
              </select>
            </div>
            <div><label className={lbl}>Objet du marché public *</label><input className={field} value={objet} onChange={e => setObjet(e.target.value)} placeholder="Ex. Refonte du site web de l'association" /></div>
            <div><label className={lbl}>Montant estimé (EUR HTVA) *</label><input type="number" min={0} className={field} value={montant} onChange={e => setMontant(e.target.value)} placeholder="Ex. 45000" /></div>
            {montantNum > 0 && (
              <div className="bg-sable rounded-xl border border-line p-4 text-sm">
                <p className="text-navy"><strong>Procédure applicable :</strong> {proc.libelle}</p>
                <p className="text-slate text-xs mt-1">{proc.documents.length} documents proposés. Seuils au 1er janvier 2026.</p>
              </div>
            )}
          </>
        )}

        {step === 2 && (
          <>
            <div className="grid sm:grid-cols-2 gap-4">
              <div><label className={lbl}>Date de lancement</label><input type="date" className={field} value={dateLancement} onChange={e => setDateLancement(e.target.value)} /></div>
              <div><label className={lbl}>Date limite des offres</label><input type="date" className={field} value={dateLimite} onChange={e => setDateLimite(e.target.value)} /></div>
              <div><label className={lbl}>Date de début d'exécution</label><input type="date" className={field} value={dateDebut} onChange={e => setDateDebut(e.target.value)} /></div>
              <div><label className={lbl}>Durée du marché</label><input className={field} value={duree} onChange={e => setDuree(e.target.value)} placeholder="Ex. 12 mois" /></div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-navy">Prestataires à consulter</label>
                {prestataires.length > 0 && (
                  <select value={filtreCat} onChange={e => setFiltreCat(e.target.value)} className="text-xs border border-line rounded-lg px-2 py-1 bg-white text-navy focus:outline-none">
                    {categoriesDispo.map(c => <option key={c} value={c}>{c === 'Toutes' ? 'Toutes catégories' : c}</option>)}
                  </select>
                )}
              </div>
              {prestataires.length === 0 ? (
                <p className="text-xs text-slate">Aucun prestataire. <Link to="/compte/prestataires" className="text-coral hover:underline">Ajoutez-en</Link> (optionnel).</p>
              ) : prestatairesFiltres.length === 0 ? (
                <p className="text-xs text-slate">Aucun prestataire dans cette catégorie.</p>
              ) : (
                <div className="space-y-1.5">
                  {prestatairesFiltres.map(p => (
                    <label key={p.id} className="flex items-center gap-2 text-sm text-navy cursor-pointer">
                      <input type="checkbox" checked={prestaSel.includes(p.id)} onChange={() => setPrestaSel(prev => toggle(prev, p.id))} />
                      {p.nom_entreprise} <span className="text-slate text-xs">· {p.categorie}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div><label className={lbl}>Description du besoin</label><textarea rows={5} className={`${field} resize-none`} value={description} onChange={e => setDescription(e.target.value)} placeholder="Complète l'introduction standard de votre organisation." /></div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm text-navy cursor-pointer"><input type="checkbox" checked={inclureRgpd} onChange={e => setInclureRgpd(e.target.checked)} /> Inclure les clauses RGPD</label>
              <label className="flex items-center gap-2 text-sm text-navy cursor-pointer"><input type="checkbox" checked={inclureRecours} onChange={e => setInclureRecours(e.target.checked)} /> Inclure les voies de recours</label>
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <p className="text-sm font-semibold text-navy">Documents à générer</p>
            <div className="space-y-1.5">
              {proc.documents.map(slug => (
                <label key={slug} className="flex items-center gap-2 text-sm text-navy cursor-pointer">
                  <input type="checkbox" checked={docs.includes(slug)} onChange={() => setDocsSel(toggle(docs, slug))} />
                  {libelleDocument(slug)}
                </label>
              ))}
            </div>
            <p className="text-xs font-semibold text-slate uppercase tracking-wide pt-2">Documents optionnels</p>
            <div className="space-y-1.5">
              {DOCUMENTS_OPTIONNELS.map(slug => (
                <label key={slug} className="flex items-center gap-2 text-sm text-navy cursor-pointer">
                  <input type="checkbox" checked={docs.includes(slug)} onChange={() => setDocsSel(toggle(docs, slug))} />
                  {libelleDocument(slug)}
                </label>
              ))}
            </div>
            <div className="bg-sable rounded-xl border border-line p-4 flex items-center justify-between">
              <span className="text-sm text-navy">Marché public complet ({docs.length} document{docs.length > 1 ? 's' : ''})</span>
              <span className="font-display font-bold text-navy text-lg">{PRIX_MARCHE_PUBLIC_EUR} EUR</span>
            </div>
            <p className="text-[11px] text-slate">9 EUR TVA incluse, tous les documents du marché public compris. Le paiement sera demandé à l'étape suivante.</p>
            {error && <p className="text-xs text-coral bg-coral/8 rounded-lg px-3 py-2">{error}</p>}
          </>
        )}
      </div>

      <div className="flex items-center justify-between mt-6">
        <button onClick={() => step > 1 ? setStep(step - 1) : navigate('/compte')} className="text-sm font-medium text-slate hover:text-navy flex items-center gap-1.5"><ArrowLeft className="w-4 h-4" /> {step > 1 ? 'Précédent' : 'Annuler'}</button>
        {step < 4 ? (
          <button onClick={() => canNext && setStep(step + 1)} disabled={!canNext} className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${canNext ? 'bg-navy text-white hover:brightness-105' : 'bg-line text-slate/50 cursor-not-allowed'}`}>Continuer</button>
        ) : (
          <button onClick={finish} disabled={saving || docs.length === 0} className="px-5 py-2.5 rounded-lg bg-coral text-white text-sm font-semibold hover:brightness-105 transition-all disabled:opacity-60 inline-flex items-center gap-1.5">
            {saving ? 'Enregistrement…' : <>Valider le marché public <Check className="w-4 h-4" /></>}
          </button>
        )}
      </div>
    </Shell>
  )
}

function Shell({ children }: { children: React.ReactNode }) {
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
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">{children}</main>
    </div>
  )
}
