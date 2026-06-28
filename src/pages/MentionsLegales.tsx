import { ArrowLeft } from 'lucide-react'
import { LogoMark } from '../components/Graphics'
import { ContactForm } from '../components/ContactForm'

export function MentionsLegales({ onBack }: { onBack: () => void }) {
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
            Informations légales
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-navy mt-3">Mentions légales</h1>
        </div>

        <div className="prose prose-sm max-w-none space-y-10 text-slate leading-relaxed">

          <section>
            <h2 className="font-display font-bold text-navy text-xl mb-3">Éditeur du site</h2>
            <div className="bg-white rounded-2xl border border-line p-6 shadow-card space-y-2 text-sm">
              <p><strong className="text-navy">Dénomination :</strong> Nomad Impact ASBL</p>
              <p><strong className="text-navy">Forme juridique :</strong> Association sans but lucratif (ASBL) de droit belge</p>
              <p><strong className="text-navy">Responsable de la publication :</strong> Charlotte Jeuniaux</p>
              <p><strong className="text-navy">Numéro d'entreprise :</strong> 1033.998.026</p>
              <p><strong className="text-navy">Siège social :</strong> Avenue Cardinal Mercier 50, 5000 Namur — Belgique</p>
              <p><strong className="text-navy">Contact :</strong> <a href="mailto:marchepublic@nomadimpact.org" className="text-coral hover:underline">marchepublic@nomadimpact.org</a></p>
              <p><strong className="text-navy">Site web :</strong> <a href="https://nomadimpact.org" target="_blank" rel="noopener noreferrer" className="text-coral hover:underline">nomadimpact.org</a></p>
            </div>
          </section>

          <section>
            <h2 className="font-display font-bold text-navy text-xl mb-3">À propos de marchépublic.be</h2>
            <p>
              <strong>marchépublic.be</strong> est un outil de pré-diagnostic pédagogique développé par <strong>Nomad Impact ASBL</strong>, votre capacity builder digital pensé pour les ASBL et structures à impact.
            </p>
            <p className="mt-3">
              Cet outil est <strong>indépendant</strong> et <strong>non officiel</strong>. Il n'est pas édité par une autorité publique belge, ni associé à un service gouvernemental, ni à une autorité de régulation des marchés publics.
            </p>
            <p className="mt-3">
              marchépublic.be est un <strong>outil d'orientation pédagogique</strong>. Il ne constitue pas un avis juridique et ne remplace pas l'analyse d'un·e juriste ou d'un service compétent en marchés publics.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-navy text-xl mb-3">Hébergement</h2>
            <div className="bg-white rounded-2xl border border-line p-6 shadow-card text-sm space-y-2">
              <p><strong className="text-navy">Hébergeur :</strong> Vercel Inc.</p>
              <p><strong className="text-navy">Adresse :</strong> 340 Pine Street, Suite 701, San Francisco, CA 94104, États-Unis</p>
              <p><strong className="text-navy">Site :</strong> <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-coral hover:underline">vercel.com</a></p>
            </div>
          </section>

          <section>
            <h2 className="font-display font-bold text-navy text-xl mb-3">Propriété intellectuelle</h2>
            <p>
              L'ensemble des contenus de ce site (textes, structure, code, documents téléchargeables) sont la propriété de Nomad Impact ASBL, sauf mention contraire.
            </p>
            <p className="mt-3">
              Les sources officielles référencées (BOSA, SPF Économie, Portail Wallonie, e-Procurement) sont la propriété de leurs autorités respectives. Les liens pointent vers des ressources publiques accessibles librement.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-navy text-xl mb-3">Limitation de responsabilité</h2>
            <div className="bg-sable rounded-2xl border border-line p-6 space-y-3 text-sm">
              <p>Les résultats produits par marchépublic.be sont <strong>indicatifs et non contractuels</strong>. Ils ne constituent pas un avis juridique.</p>
              <p>Nomad Impact ASBL ne garantit pas l'exactitude, l'exhaustivité ou la mise à jour permanente des informations. Les seuils légaux, procédures et réglementations peuvent évoluer.</p>
              <p>L'utilisateur est seul responsable de l'utilisation qu'il fait des résultats du diagnostic. Pour toute situation engageante, il est recommandé de consulter un·e juriste ou un service compétent en marchés publics.</p>
              <p>Les sources officielles indiquées (BOSA, SPF Économie, etc.) doivent être consultées pour vérifier la procédure applicable.</p>
            </div>
          </section>

          <section>
            <h2 className="font-display font-bold text-navy text-xl mb-3">Données personnelles</h2>
            <p>
              Les données personnelles éventuellement collectées via le formulaire de téléchargement de documents sont traitées conformément à notre <button onClick={onBack} className="text-coral hover:underline">Politique de confidentialité</button>.
            </p>
            <p className="mt-3">
              Aucune donnée n'est collectée lors du diagnostic lui-même. Vos réponses aux questions restent uniquement sur votre appareil.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-navy text-xl mb-3">Contact</h2>
            <p className="mb-5">Pour toute question relative au site ou à vos données personnelles, utilisez le formulaire ci-dessous :</p>
            <ContactForm />
          </section>

        </div>

        <div className="mt-12 pt-6 border-t border-line text-xs text-slate/60">
          Dernière mise à jour : juin 2025 · marchépublic.be est un outil de Nomad Impact ASBL — Avenue Cardinal Mercier 50, 5000 Namur — BCE 1033.998.026
        </div>
      </main>
    </div>
  )
}
