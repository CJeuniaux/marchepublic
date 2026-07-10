import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { LogoMark } from '../../components/Graphics'
import { useAuth } from '../../context/AuthContext'

export function Login() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? '/compte'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [error, setError] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setError('')
    const { error } = await signIn(email, password)
    if (error) {
      setError(error)
      setStatus('error')
      return
    }
    navigate(from, { replace: true })
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
          <h1 className="font-display text-2xl font-bold text-navy mb-1">Se connecter</h1>
          <p className="text-slate text-sm mb-6">Accédez à votre espace MarchéPublic Premium.</p>

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
              <label className="block text-xs font-semibold text-navy mb-1.5">Mot de passe</label>
              <input
                type="password" required value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-lg border border-line bg-white text-navy text-sm focus:outline-none focus:border-navy/40 transition-colors"
              />
            </div>
            {status === 'error' && (
              <p className="text-xs text-coral bg-coral/8 rounded-lg px-3 py-2">{error}</p>
            )}
            <button
              type="submit" disabled={status === 'loading'}
              className="w-full px-5 py-2.5 rounded-lg bg-navy text-white text-sm font-semibold hover:brightness-105 transition-all disabled:opacity-60"
            >
              {status === 'loading' ? 'Connexion…' : 'Se connecter'}
            </button>
          </form>

          <p className="text-xs text-slate mt-5 text-center">
            Pas encore de compte ? <Link to="/register" className="text-coral hover:underline font-medium">Créer un compte</Link>
          </p>
        </div>
      </main>
    </div>
  )
}
