import { Link, useNavigate } from 'react-router-dom'
import { FileText, Users, Mail, Building2, ArrowRight } from 'lucide-react'
import { LogoMark } from '../../components/Graphics'
import { useAuth } from '../../context/AuthContext'
import { useOrganisation } from '../../hooks/useOrganisation'
import { useMarches } from '../../hooks/useMarches'
import { LIBELLE_PROCEDURE, type Procedure } from '../../lib/documents'

const SECTIONS = [
  { to: '/compte/marches/nouveau', icon: FileText, titre: 'Marchés publics', desc: 'Créez et générez vos marchés publics.' },
  { to: '/compte/prestataires', icon: Users, titre: 'Mes prestataires', desc: 'Votre carnet réutilisable.' },
  { to: '/compte/courriers', icon: Mail, titre: 'Mes courriers types', desc: 'Lettres et mails, gratuits.' },
  { to: '/compte/profil', icon: Building2, titre: 'Profil organisation', desc: 'Vos informations réutilisées.' },
]

export function Compte() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const { organisation } = useOrganisation()
  const { marches, loading } = useMarches(organisation?.id)

  const handleSignOut = async () => { await signOut(); navigate('/') }

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
        <h1 className="font-display text-3xl font-bold text-navy">Mon espace</h1>
        <p className="text-slate text-sm mt-1 mb-8">{user?.email}</p>

        {!organisation && (
          <div className="bg-sun/20 border border-sun/50 rounded-2xl p-5 mb-8 flex items-center justify-between gap-4">
            <p className="text-navy text-sm">Complétez votre profil organisation pour créer un marché public.</p>
            <Link to="/compte/profil" className="shrink-0 px-4 py-2 rounded-lg bg-navy text-white text-sm font-semibold hover:brightness-105">Compléter</Link>
          </div>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {SECTIONS.map(({ to, icon: Icon, titre, desc }) => (
            <Link key={to} to={to} className="group bg-white rounded-2xl border border-line p-5 shadow-card hover:border-coral/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-sable border border-line flex items-center justify-center mb-3">
                <Icon className="w-5 h-5 text-navy" />
              </div>
              <p className="font-semibold text-navy text-sm flex items-center gap-1">{titre} <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" /></p>
              <p className="text-xs text-slate mt-1 leading-snug">{desc}</p>
            </Link>
          ))}
        </div>

        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-bold text-navy">Vos marchés publics</h2>
          <Link to="/compte/marches/nouveau" className="px-4 py-2 rounded-lg bg-coral text-white text-sm font-semibold hover:brightness-105 transition-all shadow-coral">Nouveau marché public</Link>
        </div>

        {loading ? (
          <p className="text-slate text-sm">Chargement…</p>
        ) : marches.length === 0 ? (
          <div className="bg-white rounded-2xl border border-line p-10 text-center shadow-card">
            <p className="text-navy font-semibold mb-1">Aucun marché public pour l'instant</p>
            <p className="text-slate text-sm">Créez votre premier marché public pour générer vos documents.</p>
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
