import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { LogoMark } from '../../components/Graphics'
import { useAuth } from '../../context/AuthContext'

export function Register() {
  const { signUp } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [consent, setConsent] = useState(false)
  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'done'>('idle')
  const [error, setError] = useState('')

  const isValid = email.includes('@') && password.length >= 8 && consent

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!isValid) return
    setStatus('loading')
    setError('')
    const { error } = await signUp(email, password)
    if (error) {
      setError(error)
      setStatus('error')
      return
    }
    // Selon la configuration Supabase, une confirmation par email peut être requise.
    setStatus('done')
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <header className="bg-white border-b border-line">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center">
          <Link to="/" className="flex items-center gap-2.5">
            <LogoMark className="h-6 w-auto" nodeColor="#2E2348" />
            <span className="font-display font-bold text-navy text-[15px]">marchépublic<span className="text-coral">.be</span></span>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-sm">
          {status === 'done' ? (
            <div className="text-center">
              <h1 className="font-display text-2xl font-bold text-navy mb-2">Compte créé</h1>
              <p className="text-slate text-sm mb-6">Si une confirmation par email est demandée, vérifiez votre boîte de réception avant de vous connecter.</p>
              <Link to="/login" className="inline-block px-5 py-2.5 rounded-lg bg-navy text-white text-sm font-semibold hover:brightness-105 transition-all">Aller à la connexion</Link>
            </div>
          ) : (
            <>
              <h1 className="font-display text-2xl font-bold text-navy mb-1">Créer un compte</h1>
              <p className="text-slate text-sm mb-6">Générez vos documents de marché public à partir de votre diagnostic.</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-navy mb-1.5">Email</label>
                  <input
                    type="email" required value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="votre@email.be"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-line bg-white text-navy text-sm focus:outline-none focus:border-navy/40 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-navy mb-1.5">Mot de passe <span className="text-slate font-normal">(8 caractères min.)</span></label>
                  <input
                    type="password" required minLength={8} value={password} onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-line bg-white text-navy text-sm focus:outline-none focus:border-navy/40 transition-colors"
                  />
                </div>

                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} className="mt-0.5" />
                  <span className="text-xs text-slate leading-relaxed">
                    J'accepte la <Link to="/confidentialite" className="text-coral hover:underline">politique de confidentialité</Link> et les <Link to="/cgu" className="text-coral hover:underline">conditions d'utilisation</Link>.
                  </span>
                </label>

                {status === 'error' && (
                  <p className="text-xs text-coral bg-coral/8 rounded-lg px-3 py-2">{error}</p>
                )}
                <button
                  type="submit" disabled={!isValid || status === 'loading'}
                  className={`w-full px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${isValid && status !== 'loading' ? 'bg-navy text-white hover:brightness-105' : 'bg-line text-slate/50 cursor-not-allowed'}`}
                >
                  {status === 'loading' ? 'Création…' : 'Créer mon compte'}
                </button>
              </form>

              <p className="text-xs text-slate mt-5 text-center">
                Déjà un compte ? <Link to="/login" className="text-coral hover:underline font-medium">Se connecter</Link>
              </p>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
