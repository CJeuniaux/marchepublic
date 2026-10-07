import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, ArrowRight, Mail } from 'lucide-react'
import { saveLead } from '../lib/leads'

/**
 * Écran affiché entre la dernière question du diagnostic et le résultat :
 * le visiteur laisse son email (obligatoire, avec consentement) pour voir son résultat.
 * Le lead est enregistré dans Supabase (table leads, document_id = 'diagnostic'),
 * puis synchronisé vers Brevo par l'Edge Function lead-notify.
 *
 * En cas de panne technique (réseau, Supabase), on n'enferme pas le visiteur :
 * le résultat s'affiche quand même (fail-open) et l'erreur est loguée.
 */
export const DIAG_EMAIL_KEY = 'mp_diag_email'

interface Props {
  score: number
  band: string
  onUnlock: () => void
}

export function ResultGate({ score, band, onUnlock }: Props) {
  const [email, setEmail] = useState('')
  const [organisation, setOrganisation] = useState('')
  const [consent, setConsent] = useState(false)
  const [loading, setLoading] = useState(false)

  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) && consent

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid || loading) return
    setLoading(true)
    const result = await saveLead({
      email: email.trim(),
      organization: organisation.trim() || undefined,
      document_id: 'diagnostic',
      document_title: 'Résultat du diagnostic',
      score,
      band,
      consent,
      source: 'marchepublic.be/diagnostic',
      page_url: window.location.href,
      user_agent: navigator.userAgent,
    })
    if (result.ok) {
      try { sessionStorage.setItem(DIAG_EMAIL_KEY, email.trim()) } catch { /* stockage indisponible */ }
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'generate_lead', { document_id: 'diagnostic', score, band })
        window.gtag('event', 'diag_email', { document_id: 'diagnostic' })
      }
    } else {
      console.error('[ResultGate] saveLead failed, résultat affiché quand même :', result.error)
    }
    onUnlock()
  }

  return (
    <section className="bg-cream py-10 sm:py-16">
      <motion.div
        className="max-w-md mx-auto px-4 sm:px-6"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="bg-white rounded-2xl shadow-card border border-line overflow-hidden">
          <div className="h-[3px] bg-coral" />
          <div className="px-6 py-7">
            <div className="w-11 h-11 rounded-xl bg-sable border border-line flex items-center justify-center mb-4">
              <Mail className="w-5 h-5 text-bleu" />
            </div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate mb-1">Votre résultat est prêt</p>
            <h2 className="font-display font-bold text-navy text-xl leading-snug mb-2">Où vous l'envoyer ?</h2>
            <p className="text-sm text-slate leading-relaxed mb-5">
              Indiquez votre email pour afficher votre résultat. Vous recevrez aussi votre score par email, pour le retrouver facilement.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label htmlFor="gate-email" className="block text-xs font-semibold text-navy mb-1.5">Adresse email <span className="text-coral">*</span></label>
                <input
                  id="gate-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="votre@email.be"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-line bg-cream text-navy text-sm placeholder:text-gris focus:outline-none focus:border-navy/40 focus:bg-white transition-colors"
                />
              </div>
              <div>
                <label htmlFor="gate-org" className="block text-xs font-semibold text-navy mb-1.5">Organisation <span className="text-slate font-normal">(facultatif)</span></label>
                <input
                  id="gate-org"
                  type="text"
                  autoComplete="organization"
                  value={organisation}
                  onChange={e => setOrganisation(e.target.value)}
                  placeholder="Nom de votre ASBL ou structure"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-line bg-cream text-navy text-sm placeholder:text-gris focus:outline-none focus:border-navy/40 focus:bg-white transition-colors"
                />
              </div>

              <div className="bg-sable rounded-xl p-4 border border-line">
                <label className="flex items-start gap-3 cursor-pointer">
                  <div className="relative shrink-0 mt-0.5">
                    <input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} className="sr-only" />
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${consent ? 'bg-navy border-navy' : 'bg-white border-line'}`}>
                      {consent && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
                    </div>
                  </div>
                  <p className="text-xs text-slate leading-relaxed">
                    J'accepte que MarchéPublic.be conserve mon adresse email pour m'envoyer mon résultat et, le cas échéant, me recontacter à propos de mon diagnostic. Je peux demander la suppression de mes données à tout moment.
                  </p>
                </label>
              </div>

              <button
                type="submit"
                disabled={!isValid || loading}
                className={`w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-sm font-semibold transition-all ${isValid && !loading ? 'bg-coral text-white hover:brightness-105 shadow-coral active:scale-[0.98]' : 'bg-line text-gris cursor-not-allowed'}`}
              >
                {loading ? 'Un instant...' : <>Voir mon résultat <ArrowRight className="w-4 h-4" /></>}
              </button>
              <p className="text-[11px] text-slate/70 text-center">Gratuit · Sans compte · Pas de spam</p>
            </form>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
