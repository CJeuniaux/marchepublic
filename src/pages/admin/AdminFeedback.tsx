import { useCallback, useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { ArrowLeft, Bug, Sparkles } from 'lucide-react'
import { LogoMark } from '../../components/Graphics'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import { isAdmin } from '../../lib/admin'

interface FeedbackRow {
  id: string
  created_at: string
  type: 'bug' | 'ux'
  page_url: string | null
  user_email: string | null
  content: Record<string, unknown>
  status: 'nouveau' | 'vu' | 'traité'
}

const STATUTS: FeedbackRow['status'][] = ['nouveau', 'vu', 'traité']

const LIBELLES: Record<string, string> = {
  que_sest_il_passe: "Que s'est-il passé",
  qu_attendiez_vous: 'Attendu',
  avis_fonctionnalite: 'Avis',
  facile_agreable: 'Facile / agréable',
  bloque_frustre: 'Bloqué / frustré',
  recommandation: 'Recommandation (/5)',
  recommandation_commentaire: 'Commentaire reco',
}

export function AdminFeedback() {
  const { user, loading: authLoading } = useAuth()
  const [rows, setRows] = useState<FeedbackRow[]>([])
  const [loading, setLoading] = useState(true)
  const [filtreType, setFiltreType] = useState<'tous' | 'bug' | 'ux'>('tous')
  const [filtreStatut, setFiltreStatut] = useState<'tous' | FeedbackRow['status']>('tous')

  const reload = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from('feedback').select('*').order('created_at', { ascending: false })
    setRows((data as FeedbackRow[] | null) ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { reload() }, [reload])

  const setStatus = async (id: string, status: FeedbackRow['status']) => {
    setRows(rs => rs.map(r => r.id === id ? { ...r, status } : r))
    await supabase.from('feedback').update({ status }).eq('id', id)
  }

  if (authLoading) return null
  if (!isAdmin(user?.email)) return <Navigate to="/" replace />

  const filtered = rows.filter(r =>
    (filtreType === 'tous' || r.type === filtreType) &&
    (filtreStatut === 'tous' || r.status === filtreStatut))

  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-white border-b border-line">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <LogoMark className="h-6 w-auto" nodeColor="#2E2348" />
            <span className="font-display font-bold text-navy text-[15px]">marchépublic<span className="text-coral">.be</span></span>
          </Link>
          <Link to="/compte" className="flex items-center gap-2 text-sm font-medium text-slate hover:text-navy"><ArrowLeft className="w-4 h-4" /> Mon espace</Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <h1 className="font-display text-2xl font-bold text-navy">Feedbacks beta ({filtered.length})</h1>
          <div className="flex items-center gap-2">
            <select value={filtreType} onChange={e => setFiltreType(e.target.value as typeof filtreType)} className="text-xs border border-line rounded-lg px-2 py-1.5 bg-white text-navy">
              <option value="tous">Tous les types</option>
              <option value="ux">Retours UX</option>
              <option value="bug">Bugs</option>
            </select>
            <select value={filtreStatut} onChange={e => setFiltreStatut(e.target.value as typeof filtreStatut)} className="text-xs border border-line rounded-lg px-2 py-1.5 bg-white text-navy">
              <option value="tous">Tous les statuts</option>
              {STATUTS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {loading ? (
          <p className="text-slate text-sm">Chargement…</p>
        ) : filtered.length === 0 ? (
          <p className="text-slate text-sm">Aucun feedback.</p>
        ) : (
          <div className="space-y-3">
            {filtered.map(r => (
              <div key={r.id} className="bg-white rounded-xl border border-line p-4 shadow-card">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className={`inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wide px-2 py-0.5 rounded ${r.type === 'bug' ? 'bg-coral/10 text-coral' : 'bg-navy/10 text-navy'}`}>
                    {r.type === 'bug' ? <><Bug className="w-3 h-3" /> Bug</> : <><Sparkles className="w-3 h-3" /> UX</>}
                  </span>
                  <span className="text-xs text-slate">{new Date(r.created_at).toLocaleString('fr-BE')}</span>
                  {r.user_email && <span className="text-xs text-navy font-medium">· {r.user_email}</span>}
                  <select value={r.status} onChange={e => setStatus(r.id, e.target.value as FeedbackRow['status'])} className="ml-auto text-xs border border-line rounded-lg px-2 py-1 bg-white text-navy">
                    {STATUTS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                {r.page_url && <p className="text-[11px] text-slate mb-2 break-all">📍 {r.page_url}</p>}
                <dl className="space-y-1.5">
                  {Object.entries(r.content).filter(([, v]) => v != null && v !== '').map(([k, v]) => (
                    <div key={k} className="text-sm">
                      <dt className="text-[11px] font-semibold text-slate uppercase tracking-wide">{LIBELLES[k] ?? k}</dt>
                      <dd className="text-navy">{String(v)}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
