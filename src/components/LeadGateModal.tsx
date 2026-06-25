import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowRight, Check, FileDown } from 'lucide-react'
import { saveLead } from '../lib/leads'

interface Props {
  documentId: string
  documentTitle: string
  documentFile: string
  score?: number
  band?: string
  onClose: () => void
}

export function LeadGateModal({ documentId, documentTitle, documentFile, score, band, onClose }: Props) {
  const [email, setEmail] = useState('')
  const [organisation, setOrganisation] = useState('')
  const [consent, setConsent] = useState(false)
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [error, setError] = useState('')

  const isValid = email.includes('@') && consent

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid) return
    setStatus('loading')
    const result = await saveLead({ email, organisation: organisation || undefined, document_id: documentId, score, band, consent })
    if (!result.ok) {
      setError("Une erreur est survenue. Veuillez réessayer.")
      setStatus('error')
      return
    }
    setStatus('done')
    // Déclenche le téléchargement
    const a = document.createElement('a')
    a.href = documentFile
    a.download = documentFile.split('/').pop() ?? 'document.pdf'
    document.body.appendChild(a)
    a.click()
    a.remove()
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Overlay */}
        <motion.div
          className="absolute inset-0 bg-navy/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          className="relative w-full max-w-md bg-white rounded-2xl shadow-float border border-line overflow-hidden"
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="h-[3px] bg-coral" />

          <div className="px-6 py-6">
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-1.5 rounded-lg text-slate hover:text-navy hover:bg-sable transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {status === 'done' ? (
              <div className="text-center py-4">
                <div className="w-12 h-12 rounded-full bg-navy/8 flex items-center justify-center mx-auto mb-4">
                  <Check className="w-6 h-6 text-navy" strokeWidth={2.5} />
                </div>
                <h3 className="font-display font-bold text-navy text-lg mb-2">Document envoyé</h3>
                <p className="text-slate text-sm leading-relaxed mb-5">
                  Le téléchargement a démarré. Si rien ne s'est lancé, cliquez ci-dessous.
                </p>
                <a
                  href={documentFile}
                  download
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-navy text-white text-sm font-semibold hover:brightness-105 transition-all"
                >
                  <FileDown className="w-4 h-4" /> Télécharger à nouveau
                </a>
                <button onClick={onClose} className="block w-full mt-3 text-xs text-slate hover:text-navy transition-colors text-center">
                  Fermer
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-start gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-sable border border-line flex items-center justify-center shrink-0">
                    <FileDown className="w-5 h-5 text-bleu" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-slate mb-1">Document gratuit</p>
                    <h3 className="font-display font-bold text-navy text-base leading-snug">{documentTitle}</h3>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-navy mb-1.5">Adresse email <span className="text-coral">*</span></label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="votre@email.be"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-line bg-cream text-navy text-sm placeholder:text-gris focus:outline-none focus:border-navy/40 focus:bg-white transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-navy mb-1.5">Organisation <span className="text-slate font-normal">(facultatif)</span></label>
                    <input
                      type="text"
                      value={organisation}
                      onChange={e => setOrganisation(e.target.value)}
                      placeholder="Nom de votre ASBL ou structure"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-line bg-cream text-navy text-sm placeholder:text-gris focus:outline-none focus:border-navy/40 focus:bg-white transition-colors"
                    />
                  </div>

                  <div className="bg-sable rounded-xl p-4 border border-line">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <div className="relative shrink-0 mt-0.5">
                        <input
                          type="checkbox"
                          checked={consent}
                          onChange={e => setConsent(e.target.checked)}
                          className="sr-only"
                        />
                        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${consent ? 'bg-navy border-navy' : 'bg-white border-line'}`}>
                          {consent && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
                        </div>
                      </div>
                      <p className="text-xs text-slate leading-relaxed">
                        J'accepte que mon adresse email soit conservée pour recevoir la ressource et être recontacté·e par <strong className="text-navy">Nomad Impact</strong> à propos de mes besoins. Vous pouvez demander la suppression de vos données à tout moment.
                      </p>
                    </label>
                  </div>

                  {status === 'error' && (
                    <p className="text-xs text-coral bg-coral/8 rounded-lg px-3 py-2">{error}</p>
                  )}

                  <button
                    type="submit"
                    disabled={!isValid || status === 'loading'}
                    className={`w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-sm font-semibold transition-all ${isValid && status !== 'loading' ? 'bg-coral text-white hover:brightness-105 shadow-coral active:scale-[0.98]' : 'bg-line text-gris cursor-not-allowed'}`}
                  >
                    {status === 'loading' ? 'Envoi en cours...' : <>Télécharger la fiche <ArrowRight className="w-4 h-4" /></>}
                  </button>
                </form>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
