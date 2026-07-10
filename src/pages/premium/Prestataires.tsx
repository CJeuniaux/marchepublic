import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { LogoMark } from '../../components/Graphics'
import { useOrganisation } from '../../hooks/useOrganisation'
import { usePrestataires } from '../../hooks/usePrestataires'
import { CartePrestataire } from '../../components/premium/CartePrestataire'
import type { PrestataireInput } from '../../lib/premium-types'

const EMPTY: PrestataireInput = {
  categorie: 'Informatique', nom_entreprise: '', contact_nom: '', email: '', adresse: '', numero_bce_tva: '', notes: '',
}
const CATEGORIES = ['Informatique', 'Formation', 'Nettoyage', 'Traiteur', 'Travaux', 'Communication', 'Autre']

export function Prestataires() {
  const { organisation, loading: orgLoading } = useOrganisation()
  const { prestataires, loading, add, remove } = usePrestataires(organisation?.id)
  const [form, setForm] = useState<PrestataireInput>(EMPTY)
  const [status, setStatus] = useState<'idle' | 'saving' | 'error'>('idle')
  const [error, setError] = useState('')

  const set = (k: keyof PrestataireInput, v: string) => setForm(prev => ({ ...prev, [k]: v }))

  const handleAdd = async (e: FormEvent) => {
    e.preventDefault()
    if (!form.nom_entreprise.trim()) return
    setStatus('saving'); setError('')
    const { error } = await add(form)
    if (error) { setError(error); setStatus('error'); return }
    setForm(EMPTY); setStatus('idle')
  }

  const field = 'w-full px-3.5 py-2.5 rounded-lg border border-line bg-white text-navy text-sm focus:outline-none focus:border-navy/40 transition-colors'
  const lbl = 'block text-xs font-semibold text-navy mb-1.5'

  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-white border-b border-line">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <LogoMark className="h-6 w-auto" nodeColor="#2E2348" />
            <span className="font-display font-bold text-navy text-[15px]">marchépublic<span className="text-coral">.be</span></span>
          </Link>
          <Link to="/compte" className="flex items-center gap-2 text-sm font-medium text-slate hover:text-navy"><ArrowLeft className="w-4 h-4" /> Mon espace</Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="font-display text-3xl font-bold text-navy mb-1">Carnet de prestataires</h1>
        <p className="text-slate text-sm mb-8">Vos prestataires habituels, réutilisables dans vos marchés.</p>

        {orgLoading ? (
          <p className="text-slate text-sm">Chargement…</p>
        ) : !organisation ? (
          <div className="bg-white rounded-2xl border border-line p-8 text-center shadow-card">
            <p className="text-navy font-semibold mb-1">Complétez d'abord votre profil</p>
            <p className="text-slate text-sm mb-4">Le carnet de prestataires est rattaché à votre organisation.</p>
            <Link to="/compte/profil" className="inline-block px-5 py-2.5 rounded-lg bg-navy text-white text-sm font-semibold hover:brightness-105">Compléter mon profil</Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-[1fr_1.2fr] gap-8">
            <form onSubmit={handleAdd} className="bg-white rounded-2xl border border-line p-6 shadow-card space-y-4 h-fit">
              <p className="font-semibold text-navy text-sm">Ajouter un prestataire</p>
              <div>
                <label className={lbl}>Catégorie</label>
                <select className={field} value={form.categorie} onChange={e => set('categorie', e.target.value)}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div><label className={lbl}>Entreprise *</label><input className={field} required value={form.nom_entreprise} onChange={e => set('nom_entreprise', e.target.value)} /></div>
              <div><label className={lbl}>Contact</label><input className={field} value={form.contact_nom ?? ''} onChange={e => set('contact_nom', e.target.value)} /></div>
              <div><label className={lbl}>Email</label><input type="email" className={field} value={form.email ?? ''} onChange={e => set('email', e.target.value)} /></div>
              <div><label className={lbl}>Numéro BCE / TVA</label><input className={field} value={form.numero_bce_tva ?? ''} onChange={e => set('numero_bce_tva', e.target.value)} /></div>
              {status === 'error' && <p className="text-xs text-coral bg-coral/8 rounded-lg px-3 py-2">{error}</p>}
              <button type="submit" disabled={status === 'saving'} className="w-full px-5 py-2.5 rounded-lg bg-coral text-white text-sm font-semibold hover:brightness-105 transition-all disabled:opacity-60">
                {status === 'saving' ? 'Ajout…' : 'Ajouter'}
              </button>
            </form>

            <div className="space-y-3">
              {loading ? (
                <p className="text-slate text-sm">Chargement…</p>
              ) : prestataires.length === 0 ? (
                <div className="bg-white rounded-2xl border border-line p-8 text-center shadow-card">
                  <p className="text-slate text-sm">Aucun prestataire pour l'instant.</p>
                </div>
              ) : (
                prestataires.map(p => <CartePrestataire key={p.id} prestataire={p} onDelete={remove} />)
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
