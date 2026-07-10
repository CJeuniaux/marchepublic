import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { LogoMark } from '../../components/Graphics'
import { useOrganisation } from '../../hooks/useOrganisation'
import { RGPD_STANDARD } from '../../lib/premium-constants'
import type { OrganisationInput, TypeOrganisation } from '../../lib/premium-types'

const EMPTY: OrganisationInput = {
  nom: '', type_organisation: 'asbl', adresse: '', numero_bce: '',
  pouvoir_adjudicateur: '', representant_legal_nom: '', representant_legal_fonction: '',
  email_contact: '', introduction_standard: '', clause_rgpd_standard: '', coordonnees_bancaires: '',
}

const TYPES: { value: TypeOrganisation; label: string }[] = [
  { value: 'asbl', label: 'ASBL' },
  { value: 'commune', label: 'Commune' },
  { value: 'intercommunale', label: 'Intercommunale' },
  { value: 'cpas', label: 'CPAS' },
  { value: 'autre', label: 'Autre' },
]

export function Profil() {
  const { organisation, loading, save } = useOrganisation()
  const navigate = useNavigate()
  const [form, setForm] = useState<OrganisationInput>(EMPTY)
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [error, setError] = useState('')

  useEffect(() => {
    if (organisation) {
      setForm({
        nom: organisation.nom ?? '',
        type_organisation: organisation.type_organisation ?? 'asbl',
        adresse: organisation.adresse ?? '',
        numero_bce: organisation.numero_bce ?? '',
        pouvoir_adjudicateur: organisation.pouvoir_adjudicateur ?? '',
        representant_legal_nom: organisation.representant_legal_nom ?? '',
        representant_legal_fonction: organisation.representant_legal_fonction ?? '',
        email_contact: organisation.email_contact ?? '',
        introduction_standard: organisation.introduction_standard ?? '',
        clause_rgpd_standard: organisation.clause_rgpd_standard ?? '',
        coordonnees_bancaires: organisation.coordonnees_bancaires ?? '',
      })
    }
  }, [organisation])

  const set = (k: keyof OrganisationInput, v: string) => setForm(prev => ({ ...prev, [k]: v }))

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setStatus('saving'); setError('')
    const { error } = await save(form)
    if (error) { setError(error); setStatus('error'); return }
    setStatus('saved')
    setTimeout(() => navigate('/compte'), 700)
  }

  const field = 'w-full px-3.5 py-2.5 rounded-lg border border-line bg-white text-navy text-sm focus:outline-none focus:border-navy/40 transition-colors'
  const lbl = 'block text-xs font-semibold text-navy mb-1.5'

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
        <h1 className="font-display text-3xl font-bold text-navy mb-1">Profil organisation</h1>
        <p className="text-slate text-sm mb-8">Encodé une seule fois, réutilisé dans tous vos documents.</p>

        {loading ? (
          <p className="text-slate text-sm">Chargement…</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <div><label className={lbl}>Nom de l'organisation *</label><input className={field} required value={form.nom} onChange={e => set('nom', e.target.value)} /></div>
              <div>
                <label className={lbl}>Type *</label>
                <select className={field} value={form.type_organisation} onChange={e => set('type_organisation', e.target.value)}>
                  {TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <div><label className={lbl}>Adresse</label><input className={field} value={form.adresse ?? ''} onChange={e => set('adresse', e.target.value)} /></div>
              <div><label className={lbl}>Numéro BCE</label><input className={field} value={form.numero_bce ?? ''} onChange={e => set('numero_bce', e.target.value)} /></div>
              <div><label className={lbl}>Email de contact</label><input type="email" className={field} value={form.email_contact ?? ''} onChange={e => set('email_contact', e.target.value)} /></div>
              <div><label className={lbl}>Coordonnées bancaires</label><input className={field} value={form.coordonnees_bancaires ?? ''} onChange={e => set('coordonnees_bancaires', e.target.value)} /></div>
            </div>

            <div className="pt-2 border-t border-line" />
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2"><label className={lbl}>Pouvoir adjudicateur</label><input className={field} placeholder="Ex. Le Conseil d'Administration de l'ASBL X" value={form.pouvoir_adjudicateur ?? ''} onChange={e => set('pouvoir_adjudicateur', e.target.value)} /></div>
              <div><label className={lbl}>Représentant légal (Prénom Nom)</label><input className={field} value={form.representant_legal_nom ?? ''} onChange={e => set('representant_legal_nom', e.target.value)} /></div>
              <div><label className={lbl}>Fonction</label><input className={field} value={form.representant_legal_fonction ?? ''} onChange={e => set('representant_legal_fonction', e.target.value)} /></div>
            </div>

            <div><label className={lbl}>Introduction standard</label><textarea rows={3} className={`${field} resize-none`} placeholder="Paragraphe d'introduction repris dans vos cahiers des charges." value={form.introduction_standard ?? ''} onChange={e => set('introduction_standard', e.target.value)} /></div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-navy">Clause RGPD standard</label>
                <button type="button" onClick={() => set('clause_rgpd_standard', RGPD_STANDARD)} className="text-xs text-coral hover:underline font-medium">Insérer un texte type</button>
              </div>
              <textarea rows={4} className={`${field} resize-none`} placeholder="Cliquez sur « Insérer un texte type » ou rédigez votre clause." value={form.clause_rgpd_standard ?? ''} onChange={e => set('clause_rgpd_standard', e.target.value)} />
            </div>

            {status === 'error' && <p className="text-xs text-coral bg-coral/8 rounded-lg px-3 py-2">{error}</p>}
            {status === 'saved' && <p className="text-xs text-teal bg-teal/10 rounded-lg px-3 py-2">Profil enregistré.</p>}

            <button type="submit" disabled={status === 'saving'} className="px-5 py-2.5 rounded-lg bg-navy text-white text-sm font-semibold hover:brightness-105 transition-all disabled:opacity-60">
              {status === 'saving' ? 'Enregistrement…' : 'Enregistrer'}
            </button>
          </form>
        )}
      </main>
    </div>
  )
}
