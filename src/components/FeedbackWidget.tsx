import { useState } from 'react'
import { MessageCircle, X, Check, Bug, Sparkles } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

type FeedbackType = 'bug' | 'ux'

// Bouton flottant + modale de feedback beta (bug ou retour UX).
export function FeedbackWidget() {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [type, setType] = useState<FeedbackType>('ux')
  const [sending, setSending] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  // Champs bug
  const [pageUrl, setPageUrl] = useState('')
  const [bugQuoi, setBugQuoi] = useState('')
  const [bugAttendu, setBugAttendu] = useState('')
  // Champs UX
  const [uxAvis, setUxAvis] = useState('')
  const [uxFacile, setUxFacile] = useState('')
  const [uxBloque, setUxBloque] = useState('')
  const [reco, setReco] = useState(0)
  const [recoComment, setRecoComment] = useState('')
  // Commun
  const [email, setEmail] = useState('')

  const openModal = () => {
    setPageUrl(typeof window !== 'undefined' ? window.location.href : '')
    setEmail(user?.email ?? '')
    setDone(false); setError('')
    setOpen(true)
  }

  const reset = () => {
    setBugQuoi(''); setBugAttendu(''); setUxAvis(''); setUxFacile(''); setUxBloque('')
    setReco(0); setRecoComment('')
  }

  const submit = async () => {
    setError('')
    if (type === 'bug' && !bugQuoi.trim()) { setError('Décrivez ce qui s\'est passé.'); return }
    if (type === 'ux' && !uxAvis.trim()) { setError('Partagez au moins votre avis sur la fonctionnalité.'); return }
    setSending(true)
    const content = type === 'bug'
      ? { que_sest_il_passe: bugQuoi.trim(), qu_attendiez_vous: bugAttendu.trim() || null }
      : {
          avis_fonctionnalite: uxAvis.trim(),
          facile_agreable: uxFacile.trim() || null,
          bloque_frustre: uxBloque.trim() || null,
          recommandation: reco || null,
          recommandation_commentaire: recoComment.trim() || null,
        }
    const { error: err } = await supabase.from('feedback').insert({
      type,
      page_url: pageUrl.trim() || null,
      user_email: email.trim() || null,
      user_id: user?.id ?? null,
      content,
    })
    setSending(false)
    if (err) { setError('Envoi impossible : ' + err.message); return }
    reset(); setDone(true)
  }

  const field = 'w-full px-3 py-2 rounded-lg border border-line bg-white text-navy text-sm focus:outline-none focus:border-navy/40 transition-colors'
  const lbl = 'block text-xs font-semibold text-navy mb-1'

  return (
    <>
      {/* Bouton flottant */}
      <button
        onClick={openModal}
        className="fixed bottom-4 right-4 z-[9999] inline-flex items-center gap-2 px-4 py-3 rounded-full text-white text-sm font-semibold shadow-lg hover:brightness-110 active:scale-95 transition-all print:hidden"
        style={{ backgroundColor: '#2E2348' }}
        aria-label="Donner votre avis"
      >
        <MessageCircle className="w-4 h-4" /> Votre avis
      </button>

      {open && (
        <div className="fixed inset-0 z-[10000] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="relative bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-line px-5 py-3 flex items-center justify-between">
              <p className="font-display font-bold text-navy text-sm">Votre avis compte</p>
              <button onClick={() => setOpen(false)} className="text-slate hover:text-navy p-1"><X className="w-5 h-5" /></button>
            </div>

            {done ? (
              <div className="p-8 text-center">
                <div className="w-12 h-12 rounded-full mx-auto flex items-center justify-center mb-3" style={{ backgroundColor: '#2E2348' }}>
                  <Check className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
                <p className="font-semibold text-navy">Merci ! Votre retour nous aide à améliorer la plateforme 🙏</p>
                <button onClick={() => setOpen(false)} className="mt-5 px-5 py-2.5 rounded-lg text-white text-sm font-semibold" style={{ backgroundColor: '#2E2348' }}>Fermer</button>
              </div>
            ) : (
              <div className="p-5 space-y-4">
                {/* Toggle type */}
                <div className="grid grid-cols-2 gap-2 p-1 bg-sable rounded-xl">
                  <button onClick={() => setType('ux')} className={`inline-flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-semibold transition-colors ${type === 'ux' ? 'bg-white text-navy shadow-sm' : 'text-slate'}`}>
                    <Sparkles className="w-4 h-4" /> Partager un retour
                  </button>
                  <button onClick={() => setType('bug')} className={`inline-flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-semibold transition-colors ${type === 'bug' ? 'bg-white text-navy shadow-sm' : 'text-slate'}`}>
                    <Bug className="w-4 h-4" /> Signaler un problème
                  </button>
                </div>

                {type === 'bug' ? (
                  <>
                    <div>
                      <label className={lbl}>Sur quelle page étiez-vous ?</label>
                      <input className={field} value={pageUrl} onChange={e => setPageUrl(e.target.value)} />
                    </div>
                    <div>
                      <label className={lbl}>Que s'est-il passé ? *</label>
                      <textarea rows={3} className={`${field} resize-none`} value={bugQuoi} onChange={e => setBugQuoi(e.target.value)} placeholder="Décrivez le problème rencontré…" />
                    </div>
                    <div>
                      <label className={lbl}>Qu'est-ce que vous attendiez ?</label>
                      <textarea rows={2} className={`${field} resize-none`} value={bugAttendu} onChange={e => setBugAttendu(e.target.value)} placeholder="Le comportement attendu (optionnel)" />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className={lbl}>Qu'avez-vous pensé de cette fonctionnalité ? *</label>
                      <textarea rows={3} className={`${field} resize-none`} value={uxAvis} onChange={e => setUxAvis(e.target.value)} placeholder="Votre ressenti général…" />
                    </div>
                    <div>
                      <label className={lbl}>Qu'est-ce qui vous a semblé facile ou agréable ?</label>
                      <textarea rows={2} className={`${field} resize-none`} value={uxFacile} onChange={e => setUxFacile(e.target.value)} placeholder="Optionnel" />
                    </div>
                    <div>
                      <label className={lbl}>Qu'est-ce qui vous a bloqué ou frustré ?</label>
                      <textarea rows={2} className={`${field} resize-none`} value={uxBloque} onChange={e => setUxBloque(e.target.value)} placeholder="Optionnel" />
                    </div>
                    <div>
                      <label className={lbl}>Recommanderiez-vous MarchéPublic.be à une autre ASBL ?</label>
                      <div className="flex items-center gap-1.5 mt-1">
                        {[1, 2, 3, 4, 5].map(n => (
                          <button key={n} onClick={() => setReco(n)} className={`w-9 h-9 rounded-lg text-sm font-bold border transition-colors ${reco >= n ? 'text-white border-transparent' : 'text-slate border-line bg-white'}`} style={reco >= n ? { backgroundColor: '#2E2348' } : undefined}>{n}</button>
                        ))}
                        <span className="text-[11px] text-slate ml-2">1 = non · 5 = vivement</span>
                      </div>
                      <input className={`${field} mt-2`} value={recoComment} onChange={e => setRecoComment(e.target.value)} placeholder="Commentaire (optionnel)" />
                    </div>
                  </>
                )}

                <div>
                  <label className={lbl}>Email {user ? '' : '(optionnel)'}</label>
                  <input type="email" className={field} value={email} onChange={e => setEmail(e.target.value)} placeholder="votre@email.be" />
                </div>

                {error && <p className="text-xs text-coral bg-coral/8 rounded-lg px-3 py-2">{error}</p>}

                <button onClick={submit} disabled={sending} className="w-full py-2.5 rounded-lg text-white text-sm font-semibold hover:brightness-110 transition-all disabled:opacity-60" style={{ backgroundColor: '#2E2348' }}>
                  {sending ? 'Envoi…' : 'Envoyer'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
