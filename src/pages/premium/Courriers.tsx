import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, FileDown, Copy, Check, ChevronDown, Mail } from 'lucide-react'
import { LogoMark } from '../../components/Graphics'
import { COURRIERS_TYPES } from '../../lib/courriers'
import { COURRIERS_TEXTES } from '../../lib/courriers-textes'

const ORDRE = ['Faible montant', 'Belge', 'Européen', 'DMA', 'RGPD', 'Divers']

export function Courriers() {
  const [ouvert, setOuvert] = useState<string | null>(null)
  const [copie, setCopie] = useState<string | null>(null)

  const parCategorie = ORDRE
    .map(cat => ({ cat, items: COURRIERS_TYPES.filter(c => c.categorie === cat) }))
    .filter(g => g.items.length > 0)

  const copier = async (slug: string) => {
    const texte = COURRIERS_TEXTES[slug]
    if (!texte) return
    await navigator.clipboard.writeText(texte)
    setCopie(slug); setTimeout(() => setCopie(c => (c === slug ? null : c)), 2000)
  }

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
        <p className="text-slate text-sm mb-8">Lettres et mails prêts à l'emploi. Ouvrez un modèle pour copier son texte (mise en page conservée) et le coller dans votre messagerie, ou téléchargez le .docx. Gratuit. Une version pré-remplie avec votre profil sera proposée à 1 EUR par fichier.</p>

        <div className="space-y-8">
          {parCategorie.map(({ cat, items }) => (
            <section key={cat}>
              <h2 className="text-[11px] font-bold uppercase tracking-widest text-slate mb-3">{cat}</h2>
              <div className="space-y-3">
                {items.map(c => {
                  const texte = COURRIERS_TEXTES[c.slug]
                  const estOuvert = ouvert === c.slug
                  return (
                    <div key={c.slug} className="bg-white rounded-xl border border-line shadow-card overflow-hidden">
                      <div className="flex items-center gap-3 p-4">
                        <div className="w-9 h-9 rounded-lg bg-sable border border-line flex items-center justify-center shrink-0">
                          {texte ? <Mail className="w-4 h-4 text-navy" /> : <FileDown className="w-4 h-4 text-navy" />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-navy leading-snug">{c.label}</p>
                          <p className="text-[11px] text-slate mt-0.5">Gratuit{texte ? ' · mail à copier · .docx' : ' · .docx'}</p>
                        </div>
                        {texte && (
                          <button
                            onClick={() => setOuvert(estOuvert ? null : c.slug)}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-navy border border-line rounded-lg px-3 py-1.5 hover:border-coral/50 hover:text-coral transition-colors"
                          >
                            {estOuvert ? 'Fermer' : 'Voir le texte'} <ChevronDown className={`w-3.5 h-3.5 transition-transform ${estOuvert ? 'rotate-180' : ''}`} />
                          </button>
                        )}
                        <a href={c.file} download className="inline-flex items-center gap-1 text-xs font-semibold text-slate hover:text-navy transition-colors" title="Télécharger le .docx">
                          <FileDown className="w-4 h-4" />
                        </a>
                      </div>

                      {texte && estOuvert && (
                        <div className="border-t border-line p-4 bg-sable/40">
                          <div className="flex justify-end mb-2">
                            <button onClick={() => copier(c.slug)} className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-navy rounded-lg px-3 py-1.5 hover:brightness-110 transition-all">
                              {copie === c.slug ? <><Check className="w-3.5 h-3.5" /> Copié</> : <><Copy className="w-3.5 h-3.5" /> Copier le texte</>}
                            </button>
                          </div>
                          <pre className="text-xs text-navy whitespace-pre-wrap font-sans bg-white border border-line rounded-lg p-4 leading-relaxed max-h-96 overflow-y-auto">{texte}</pre>
                          <p className="text-[11px] text-slate mt-2">Modèle à relire et adapter avant envoi. Les champs [entre crochets] sont à compléter.</p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  )
}
