import { Link, useNavigate } from 'react-router-dom'
import { LogoMark } from '../../components/Graphics'
import { useAuth } from '../../context/AuthContext'

export function Compte() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-white border-b border-line">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <LogoMark className="h-6 w-auto" nodeColor="#2E2348" />
            <span className="font-display font-bold text-navy text-[15px]">marchépublic<span className="text-coral">.be</span></span>
          </Link>
          <button onClick={handleSignOut} className="text-sm font-medium text-slate hover:text-navy transition-colors">Se déconnecter</button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-navy">Vos marchés</h1>
            <p className="text-slate text-sm mt-1">{user?.email}</p>
          </div>
          <Link to="/compte/marches/nouveau" className="px-5 py-2.5 rounded-lg bg-coral text-white text-sm font-semibold hover:brightness-105 transition-all shadow-coral">
            Nouveau marché
          </Link>
        </div>

        <div className="flex gap-4 mb-8 text-sm">
          <Link to="/compte/profil" className="text-coral hover:underline">Profil organisation</Link>
          <Link to="/compte/prestataires" className="text-coral hover:underline">Carnet prestataires</Link>
        </div>

        <div className="bg-white rounded-2xl border border-line p-10 text-center shadow-card">
          <p className="text-navy font-semibold mb-1">Aucun marché pour l'instant</p>
          <p className="text-slate text-sm">Commencez par compléter votre profil organisation, puis créez votre premier marché.</p>
        </div>
      </main>
    </div>
  )
}
