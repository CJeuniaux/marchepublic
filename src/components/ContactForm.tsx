import { useState } from 'react'
import { Send, Check } from 'lucide-react'
import { supabase } from '../lib/supabase'

export function ContactForm() {
  const [name, setName]       = useState('')
  const [email, setEmail]     = useState('')
  const [message, setMessage] = useState('')
  const [consent, setConsent] = useState(false)
  const [status, setStatus]   = useState<'idle' | 'loading' | 'done' | 'error'>('idle')

  const isValid = name.trim() && email.includes('@') && message.trim() && consent

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid) return
    setStatus('loading')
    try {
      // Envoi via l'edge function Brevo -> marchepublic@nomadimpact.org
      const { data, error } = await supabase.functions.invoke('contact-send', {
        body: { name, email, message },
      })
      if (error || (data as { error?: string } | null)?.error) setStatus('error')
      else setStatus('done')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'done') {
    return (
      <div className="flex items-center gap-3 p-5 bg-navy/5 rounded-2xl border border-line">
        <div className="w-9 h-9 rounded-full bg-navy flex items-center justify-center shrink-0">
          <Check className="w-4 h-4 text-white" strokeWidth={2.5} />
        </div>
        <div>
          <p className="font-semibold text-navy text-sm">Message envoyé</p>
          <p className="text-xs text-slate mt-0.5">Nous vous répondrons dans les meilleurs délais.</p>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-navy mb-1.5">
            Nom <span className="text-coral">*</span>
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Votre nom"
            className="w-full px-3.5 py-2.5 rounded-lg border border-line bg-cream text-navy text-sm placeholder:text-slate/40 focus:outline-none focus:border-navy/40 focus:bg-white transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-navy mb-1.5">
            Email <span className="text-coral">*</span>
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="votre@email.be"
            className="w-full px-3.5 py-2.5 rounded-lg border border-line bg-cream text-navy text-sm placeholder:text-slate/40 focus:outline-none focus:border-navy/40 focus:bg-white transition-colors"
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold text-navy mb-1.5">
          Message <span className="text-coral">*</span>
        </label>
        <textarea
          required
          rows={5}
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Votre question ou demande…"
          className="w-full px-3.5 py-2.5 rounded-lg border border-line bg-cream text-navy text-sm placeholder:text-slate/40 focus:outline-none focus:border-navy/40 focus:bg-white transition-colors resize-none"
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
            J'accepte que Nomad Impact ASBL traite les données de ce formulaire afin de répondre à ma demande, conformément à la <a href="https://marchepublic.be/" className="text-coral hover:underline">politique de confidentialité</a>. Je peux demander la suppression de mes données à tout moment. <span className="text-coral">*</span>
          </p>
        </label>
      </div>
      {status === 'error' && (
        <p className="text-xs text-coral bg-coral/8 rounded-lg px-3 py-2">
          Une erreur est survenue. Veuillez réessayer.
        </p>
      )}
      <button
        type="submit"
        disabled={!isValid || status === 'loading'}
        className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${isValid && status !== 'loading' ? 'bg-navy text-white hover:brightness-105' : 'bg-line text-slate/50 cursor-not-allowed'}`}
      >
        <Send className="w-4 h-4" />
        {status === 'loading' ? 'Envoi…' : 'Envoyer le message'}
      </button>
    </form>
  )
}
