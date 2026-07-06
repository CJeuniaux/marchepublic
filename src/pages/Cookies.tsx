import { ArrowLeft } from 'lucide-react'
import { LogoMark } from '../components/Graphics'

export function Cookies({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-white border-b border-line sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <button onClick={onBack} className="flex items-center gap-2.5">
            <LogoMark className="h-6 w-auto" nodeColor="#2E2348" />
            <span className="font-display font-bold text-navy text-[15px]">marchépublic<span className="text-coral">.be</span></span>
          </button>
          <button onClick={onBack} className="flex items-center gap-2 text-sm font-medium text-slate hover:text-navy transition-colors">
            <ArrowLeft className="w-4 h-4" /> Retour
          </button>
        </div>
      </header>

      <div className="absolute top-16 left-0 right-0 h-[3px] bg-coral" />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <div className="mb-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded text-[11px] font-bold tracking-widest uppercase bg-sun/30 border border-sun/60 text-navy mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
            Cookies et traceurs
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-navy mt-3">Cookies et traceurs</h1>
          <p className="mt-3 text-slate">Ce que marchépublic.be dépose sur votre appareil, et pourquoi.</p>
        </div>

        <div className="space-y-10 text-slate leading-relaxed text-sm">

          <section>
            <h2 className="font-display font-bold text-navy text-xl mb-3">Responsable</h2>
            <div className="bg-white rounded-2xl border border-line p-6 shadow-card space-y-1.5">
              <p><strong className="text-navy">Nomad Impact ASBL</strong></p>
              <p>ASBL de droit belge — BCE 1033.998.026</p>
              <p>Avenue Cardinal Mercier 50, 5000 Namur — Belgique</p>
              <p>Hébergement : Vercel Inc. (340 Pine Street, Suite 701, San Francisco, CA 94104, États-Unis)</p>
              <p>Contact : <a href="mailto:marchepublic@nomadimpact.org" className="text-coral hover:underline">marchepublic@nomadimpact.org</a></p>
            </div>
          </section>

          <section>
            <h2 className="font-display font-bold text-navy text-xl mb-3">En résumé</h2>
            <p>marchépublic.be n'utilise <strong>aucun cookie publicitaire</strong> et ne revend aucune donnée. Nous utilisons uniquement une mesure d'audience (Google Analytics) et un petit indicateur technique stocké sur votre appareil. Le détail ci-dessous.</p>
          </section>

          <section>
            <h2 className="font-display font-bold text-navy text-xl mb-3">1. Mesure d'audience — Google Analytics 4</h2>
            <p>Nous utilisons Google Analytics 4 (identifiant de mesure <strong>G-08DLT3F90Q</strong>) pour comprendre comment le site est utilisé (pages vues, étapes du diagnostic) et l'améliorer. Google dépose des cookies à cette fin.</p>
            <div className="mt-4 bg-white rounded-xl border border-line overflow-hidden">
              <table className="w-full text-xs">
                <thead className="bg-sable text-navy">
                  <tr>
                    <th className="text-left font-semibold px-4 py-2.5">Cookie</th>
                    <th className="text-left font-semibold px-4 py-2.5">Finalité</th>
                    <th className="text-left font-semibold px-4 py-2.5">Durée</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-line">
                    <td className="px-4 py-2.5 font-medium text-navy">_ga</td>
                    <td className="px-4 py-2.5">Distinguer les visiteurs (mesure d'audience)</td>
                    <td className="px-4 py-2.5">13 mois</td>
                  </tr>
                  <tr className="border-t border-line">
                    <td className="px-4 py-2.5 font-medium text-navy">_ga_08DLT3F90Q</td>
                    <td className="px-4 py-2.5">Maintenir l'état de session pour la propriété GA4</td>
                    <td className="px-4 py-2.5">13 mois</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs">Vous pouvez refuser ces cookies via les réglages de votre navigateur ou l'extension <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-coral hover:underline">Google Analytics Opt-out</a>.</p>
          </section>

          <section>
            <h2 className="font-display font-bold text-navy text-xl mb-3">2. Stockage local technique</h2>
            <p>Nous conservons un petit indicateur dans le <strong>localStorage</strong> de votre navigateur. Ce n'est pas un cookie et il n'est jamais transmis à nos serveurs : il reste sur votre appareil.</p>
            <div className="mt-4 bg-white rounded-xl border border-line overflow-hidden">
              <table className="w-full text-xs">
                <thead className="bg-sable text-navy">
                  <tr>
                    <th className="text-left font-semibold px-4 py-2.5">Clé</th>
                    <th className="text-left font-semibold px-4 py-2.5">Finalité</th>
                    <th className="text-left font-semibold px-4 py-2.5">Durée</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-line">
                    <td className="px-4 py-2.5 font-medium text-navy">mp_intro_seen</td>
                    <td className="px-4 py-2.5">Ne plus réafficher l'écran d'introduction après votre première visite</td>
                    <td className="px-4 py-2.5">Jusqu'à effacement manuel</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="font-display font-bold text-navy text-xl mb-3">3. Ce que nous n'utilisons pas</h2>
            <ul className="space-y-1 list-disc list-inside">
              <li>Aucun cookie publicitaire ou de reciblage</li>
              <li>Aucun traceur de réseau social</li>
              <li>Aucune revente de données à des tiers</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display font-bold text-navy text-xl mb-3">Gérer vos préférences</h2>
            <p>Vous pouvez à tout moment supprimer les cookies et le stockage local depuis les réglages de votre navigateur. Pour toute question, écrivez à <a href="mailto:marchepublic@nomadimpact.org" className="text-coral hover:underline">marchepublic@nomadimpact.org</a>.</p>
          </section>

        </div>

        <div className="mt-12 pt-6 border-t border-line text-xs text-slate/60">
          Dernière mise à jour : juillet 2026 · marchépublic.be est un outil de Nomad Impact ASBL — Avenue Cardinal Mercier 50, 5000 Namur — BCE 1033.998.026
        </div>
      </main>
    </div>
  )
}
