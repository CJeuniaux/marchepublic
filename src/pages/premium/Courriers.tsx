import { Link } from 'react-router-dom'
import { ArrowLeft, FileDown } from 'lucide-react'
import { LogoMark } from '../../components/Graphics'
import { COURRIERS_TYPES } from '../../lib/courriers'

const ORDRE = ['Faible montant', 'Belge', 'Européen', 'DMA', 'RGPD', 'Divers']

export function Courriers() {
  const parCategorie = ORDRE
    .map(cat => ({ cat, items: COURRIERS_TYPES.filter(c => c.categorie === cat) }))
    .filter(g => g.items.length > 0)

  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-white border-b border-line">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <LogoMark className="h-6 w-auto" nodeColor="#2E2348" />
            <span className="font-display font-bold text-navy text-[15px]">marchépublic<span className="text-coral">.be</span></span>
          </Link>
          <Link to="/compte" className="flex items-center gap-2 text-sm font-medium text-slate hover:text-navy"><ArrowLeft className="w-4 h-4" /> Mon espace</Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="font-display text-3xl font-bold text-navy mb-1">Mes courriers types</h1>
        <p className="text-slate text-sm mb-8">Lettres, mails et modèles DMA prêts à l'emploi. Téléchargement gratuit. Une version pré-remplie avec votre profil sera proposée à 1 EUR par fichier.</p>

        <div className="space-y-8">
          {parCategorie.map(({ cat, items }) => (
            <section key={cat}>
              <h2 className="text-[11px] font-bold uppercase tracking-widest text-slate mb-3">{cat}</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {items.map(c => (
                  <a key={c.slug} href={c.file} download className="flex items-center gap-3 bg-white rounded-xl border border-line p-4 shadow-card hover:border-navy/30 transition-colors">
                    <div className="w-9 h-9 rounded-lg bg-sable border border-line flex items-center justify-center shrink-0">
                      <FileDown className="w-4 h-4 text-bleu" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-navy leading-snug">{c.label}</p>
                      <p className="text-[11px] text-slate mt-0.5">Gratuit · .docx</p>
                    </div>
                  </a>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  )
}
