import { ArrowLeft } from 'lucide-react'
import { LogoMark } from '../components/Graphics'
import { ContactForm } from '../components/ContactForm'

export function CGU({ onBack }: { onBack: () => void }) {
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
            Conditions d'utilisation
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-navy mt-3">Conditions générales d'utilisation</h1>
          <p className="mt-3 text-slate">Applicables à marchépublic.be — outil gratuit développé par Nomad Impact ASBL</p>
        </div>

        <div className="space-y-10 text-slate leading-relaxed text-sm">

          <section>
            <h2 className="font-display font-bold text-navy text-xl mb-3">1. Éditeur du service</h2>
            <div className="bg-white rounded-2xl border border-line p-6 shadow-card space-y-1.5">
              <p><strong className="text-navy">Nomad Impact ASBL</strong></p>
              <p>Responsable : Charlotte Jeuniaux</p>
              <p>ASBL de droit belge — BCE 1033.998.026</p>
              <p>Avenue Cardinal Mercier 50, 5000 Namur — Belgique</p>
              <p>Contact : <a href="mailto:hello@nomadimpact.org" className="text-coral hover:underline">hello@nomadimpact.org</a></p>
            </div>
          </section>

          <section>
            <h2 className="font-display font-bold text-navy text-xl mb-3">2. Objet du service</h2>
            <p>marchépublic.be est un outil de pré-diagnostic pédagogique gratuit. Il aide les ASBL et structures à impact belges à repérer si la question des marchés publics peut se poser pour un achat donné.</p>
            <p className="mt-3">Le service est fourni gratuitement, sans contrepartie financière, et ne donne lieu à aucune vente. Aucune transaction commerciale n'a lieu sur le site.</p>
          </section>

          <section>
            <h2 className="font-display font-bold text-navy text-xl mb-3">3. Nature du service</h2>
            <div className="bg-sable rounded-2xl border border-line p-6 space-y-3">
              <p>marchépublic.be est un outil <strong>indépendant et non officiel</strong>. Il n'est pas édité par une autorité publique belge, ni associé à un service gouvernemental ou à une autorité de régulation des marchés publics.</p>
              <p>Les résultats produits sont <strong>indicatifs et non contractuels</strong>. Ils ne constituent pas un avis juridique et ne remplacent pas l'analyse d'un·e juriste ou d'un service compétent en marchés publics.</p>
            </div>
          </section>

          <section>
            <h2 className="font-display font-bold text-navy text-xl mb-3">4. Utilisation du service</h2>
            <p>L'utilisateur s'engage à utiliser le service de bonne foi et conformément à sa finalité pédagogique. Il reste seul responsable des décisions prises sur la base des résultats du diagnostic.</p>
            <p className="mt-3">Pour toute situation engageante, il est recommandé de consulter une source officielle (BOSA, SPF Économie) ou un service compétent en marchés publics.</p>
          </section>

          <section>
            <h2 className="font-display font-bold text-navy text-xl mb-3">5. Propriété intellectuelle</h2>
            <p>L'ensemble des contenus du site (textes, structure, code, documents téléchargeables) sont la propriété de Nomad Impact ASBL, sauf mention contraire. Toute reproduction sans autorisation est interdite.</p>
          </section>

          <section>
            <h2 className="font-display font-bold text-navy text-xl mb-3">6. Limitation de responsabilité</h2>
            <p>Nomad Impact ASBL ne garantit pas l'exactitude, l'exhaustivité ou la mise à jour permanente des informations. Les seuils légaux, procédures et réglementations peuvent évoluer.</p>
            <p className="mt-3">La responsabilité de Nomad Impact ASBL ne saurait être engagée pour l'usage fait des résultats du diagnostic ou pour une indisponibilité temporaire du service.</p>
          </section>

          <section>
            <h2 className="font-display font-bold text-navy text-xl mb-3">7. Données personnelles</h2>
            <p>Le traitement des données personnelles est décrit dans notre <button onClick={onBack} className="text-coral hover:underline">Politique de confidentialité</button>. Le diagnostic lui-même ne collecte aucune donnée : vos réponses restent sur votre appareil.</p>
          </section>

          <section>
            <h2 className="font-display font-bold text-navy text-xl mb-3">8. Droit applicable</h2>
            <p>Les présentes conditions sont régies par le droit belge. Tout litige relève de la compétence des tribunaux de l'arrondissement de Namur.</p>
          </section>

          <section>
            <h2 className="font-display font-bold text-navy text-xl mb-3">9. Contact</h2>
            <p className="mb-5">Pour toute question relative aux présentes conditions, écrivez à <a href="mailto:hello@nomadimpact.org" className="text-coral hover:underline">hello@nomadimpact.org</a> ou utilisez le formulaire ci-dessous :</p>
            <ContactForm />
          </section>

        </div>

        <div className="mt-12 pt-6 border-t border-line text-xs text-slate/60">
          Dernière mise à jour : juin 2026 · marchépublic.be est un outil de Nomad Impact ASBL — Avenue Cardinal Mercier 50, 5000 Namur — BCE 1033.998.026
        </div>
      </main>
    </div>
  )
}
