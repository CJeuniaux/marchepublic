import { ArrowLeft } from 'lucide-react'
import { LogoMark } from '../components/Graphics'

export function Confidentialite({ onBack }: { onBack: () => void }) {
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

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <div className="mb-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded text-[11px] font-bold tracking-widest uppercase bg-sun/30 border border-sun/60 text-navy mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
            Données personnelles
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-navy mt-3">Politique de confidentialité</h1>
          <p className="mt-3 text-slate">Applicable à marchépublic.be — outil développé par Nomad Impact ASBL</p>
        </div>

        <div className="space-y-10 text-slate leading-relaxed text-sm">

          <section>
            <h2 className="font-display font-bold text-navy text-xl mb-3">Responsable du traitement</h2>
            <div className="bg-white rounded-2xl border border-line p-6 shadow-card space-y-1.5">
              <p><strong className="text-navy">Nomad Impact ASBL</strong></p>
              <p>Responsable du traitement : Charlotte Jeuniaux</p>
              <p>ASBL de droit belge — BCE 1033.998.026</p>
              <p>Avenue Cardinal Mercier 50, 5000 Namur — Belgique</p>
              <p>Contact : <a href="mailto:marchepublic@nomadimpact.org" className="text-coral hover:underline">marchepublic@nomadimpact.org</a></p>
            </div>
          </section>

          <section>
            <h2 className="font-display font-bold text-navy text-xl mb-3">Quelles données collectons-nous ?</h2>
            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-line p-5">
                <h3 className="font-semibold text-navy mb-2">1. Diagnostic (aucune donnée collectée)</h3>
                <p>Vos réponses aux questions du diagnostic restent <strong>uniquement sur votre appareil</strong>. Elles ne sont pas transmises à nos serveurs. Aucune donnée de diagnostic n'est conservée au-delà de votre session.</p>
              </div>
              <div className="bg-white rounded-xl border border-line p-5">
                <h3 className="font-semibold text-navy mb-2">2. Téléchargement de documents</h3>
                <p>Lorsque vous demandez un document téléchargeable, nous collectons :</p>
                <ul className="mt-2 space-y-1 list-disc list-inside text-slate">
                  <li>Votre adresse email (obligatoire)</li>
                  <li>Le nom de votre organisation (facultatif)</li>
                  <li>Le document demandé</li>
                  <li>Votre score de diagnostic (si disponible)</li>
                  <li>La date et l'heure de la demande</li>
                  <li>Votre consentement explicite</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-display font-bold text-navy text-xl mb-3">Emails transactionnels</h2>
            <p>Lorsque vous demandez un document, votre adresse email sert à envoyer deux messages automatiques :</p>
            <ul className="mt-2 space-y-1 list-disc list-inside text-slate">
              <li><strong className="text-navy">Livraison</strong> : un email vous transmet le lien de téléchargement de la ressource demandée.</li>
              <li><strong className="text-navy">Notification interne</strong> : un email informe l'équipe de Nomad Impact qu'une nouvelle demande a été reçue.</li>
            </ul>
            <p className="mt-3">Ces envois sont assurés par notre sous-traitant d'emailing <strong>Brevo</strong> (Sendinblue SAS, France). Le téléchargement reste également disponible immédiatement dans votre navigateur, sans attendre l'email.</p>
          </section>

          <section>
            <h2 className="font-display font-bold text-navy text-xl mb-3">Pourquoi ces données ?</h2>
            <div className="space-y-3">
              {[
                { base: "Exécution du service", desc: "Vous transmettre le document demandé et assurer le suivi de votre demande." },
                { base: "Intérêt légitime", desc: "Vous informer des services de Nomad Impact susceptibles de répondre à vos besoins, sur la base de votre consentement." },
                { base: "Amélioration de l'outil", desc: "Comprendre les besoins des utilisateurs pour améliorer marchépublic.be." },
              ].map(({ base, desc }) => (
                <div key={base} className="flex items-start gap-3 p-4 bg-white rounded-xl border border-line">
                  <span className="w-2 h-2 rounded-full bg-coral mt-1.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-navy text-xs uppercase tracking-wide mb-1">{base}</p>
                    <p>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-display font-bold text-navy text-xl mb-3">Durée de conservation</h2>
            <p>Vos données sont conservées pendant <strong>24 mois</strong> à compter de votre demande, sauf demande de suppression anticipée de votre part.</p>
          </section>

          <section>
            <h2 className="font-display font-bold text-navy text-xl mb-3">Partage des données</h2>
            <p>Vos données ne sont <strong>jamais vendues ni cédées</strong> à des tiers à des fins commerciales.</p>
            <p className="mt-3">Elles peuvent être partagées uniquement avec :</p>
            <ul className="mt-2 space-y-1 list-disc list-inside">
              <li>Supabase (sous-traitant hébergeur des données, serveurs en Europe)</li>
              <li>Brevo / Sendinblue SAS (sous-traitant d'envoi des emails transactionnels, France)</li>
              <li>Vercel (hébergeur du site, États-Unis — avec garanties RGPD)</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display font-bold text-navy text-xl mb-3">Vos droits (RGPD)</h2>
            <div className="bg-sable rounded-2xl border border-line p-6 space-y-2">
              <p>Conformément au Règlement général sur la protection des données (RGPD) et à la loi belge du 30 juillet 2018, vous disposez des droits suivants :</p>
              <ul className="mt-3 space-y-2 list-disc list-inside">
                <li><strong className="text-navy">Droit d'accès</strong> : obtenir une copie de vos données</li>
                <li><strong className="text-navy">Droit de rectification</strong> : corriger vos données inexactes</li>
                <li><strong className="text-navy">Droit à l'effacement</strong> : demander la suppression de vos données</li>
                <li><strong className="text-navy">Droit d'opposition</strong> : vous opposer à certains traitements</li>
                <li><strong className="text-navy">Droit à la portabilité</strong> : recevoir vos données dans un format lisible</li>
              </ul>
              <p className="mt-3">Pour exercer vos droits, utilisez le formulaire de contact ci-dessous.</p>
              <p className="mt-2 text-xs">Vous pouvez également introduire une réclamation auprès de l'Autorité de protection des données belge : <a href="https://www.dataprotectionauthority.be" target="_blank" rel="noopener noreferrer" className="text-coral hover:underline">dataprotectionauthority.be</a></p>
            </div>
          </section>

          <section>
            <h2 className="font-display font-bold text-navy text-xl mb-3">Cookies et traceurs</h2>
            <p>marchépublic.be <strong>n'utilise pas de cookies publicitaires ou de suivi tiers</strong>. Aucune donnée n'est transmise à des régies publicitaires ou à des plateformes de tracking.</p>
            <p className="mt-3">Le site peut utiliser des données de session locales (sessionStorage) pour éviter de ré-afficher l'écran d'introduction. Ces données restent sur votre appareil et ne sont pas transmises.</p>
          </section>

          <section>
            <h2 className="font-display font-bold text-navy text-xl mb-3">Contact</h2>
            <p>Pour exercer vos droits ou poser toute question relative à vos données personnelles, écrivez-nous à <a href="mailto:marchepublic@nomadimpact.org" className="text-coral hover:underline">marchepublic@nomadimpact.org</a>.</p>
          </section>

        </div>

        <div className="mt-12 pt-6 border-t border-line text-xs text-slate/60">
          Dernière mise à jour : juin 2025 · marchépublic.be est un outil de Nomad Impact ASBL — Avenue Cardinal Mercier 50, 5000 Namur — BCE 1033.998.026
        </div>
      </main>
    </div>
  )
}
