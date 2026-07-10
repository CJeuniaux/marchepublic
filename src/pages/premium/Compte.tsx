import { Link, useNavigate } from 'react-router-dom'
import { LogoMark } from '../../components/Graphics'
import { useAuth } from '../../context/AuthContext'
import { useOrganisation } from '../../hooks/useOrganisation'
import { useMarches } from '../../hooks/useMarches'
import { LIBELLE_PROCEDURE, type Procedure } from '../../lib/documents'

export function Compte() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const { organisation } = useOrganisation()
  const { marches, loading } = useMarches(organisation?.id)

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

        {!organisation ? (
          <div className="bg-white rounded-2xl border border-line p-10 text-center shadow-card">
            <p className="text-navy font-semibold mb-1">Commencez par votre profil</p>
            <p className="text-slate text-sm mb-4">Complétez votre profil organisation avant de créer un marché.</p>
            <Link to="/compte/profil" className="inline-block px-5 py-2.5 rounded-lg bg-navy text-white text-sm font-semibold hover:brightness-105">Compléter mon profil</Link>
          </div>
        ) : loading ? (
          <p className="text-slate text-sm">Chargement…</p>
        ) : marches.length === 0 ? (
          <div className="bg-white rounded-2xl border border-line p-10 text-center shadow-card">
            <p className="text-navy font-semibold mb-1">Aucun marché pour l'instant</p>
            <p className="text-slate text-sm">Créez votre premier marché pour générer vos documents.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {marches.map(m => (
              <Link key={m.id} to={`/compte/marches/${m.id}`} className="block bg-white rounded-xl border border-line p-4 shadow-card hover:border-navy/30 transition-colors">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-navy text-sm">{m.objet}</p>
                    <p className="text-xs text-slate mt-0.5">{LIBELLE_PROCEDURE[m.procedure as Procedure] ?? m.procedure} · {m.montant_estime_htva.toLocaleString('fr-BE')} EUR HTVA</p>
                  </div>
                  <span className={`text-[11px] font-bold uppercase tracking-wide px-2 py-0.5 rounded shrink-0 ${m.statut === 'paye' ? 'bg-teal/10 text-teal' : 'bg-sun/30 text-navy'}`}>{m.statut}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
