import { useState } from 'react'
import { ArrowRight, Shield, ChevronDown } from 'lucide-react'

const USE_CASES = [
  { icon: '🌐', title: 'Refaire votre site web', desc: "Refonte, CMS, développement sur mesure — les règles peuvent s'appliquer selon votre financement." },
  { icon: '💻', title: 'Acheter un logiciel ou SaaS', desc: "CRM, gestion de membres, plateforme de formation — même un abonnement peut être concerné." },
  { icon: '🎨', title: 'Engager un graphiste ou une agence', desc: "Charte graphique, rapport annuel, campagne — la mise en concurrence peut être requise." },
  { icon: '🤝', title: 'Lancer une mission de consultance', desc: "Accompagnement, audit, évaluation de projet — une prestation intellectuelle peut déclencher des obligations." },
  { icon: '🏗️', title: 'Réaliser des travaux', desc: "Aménagement, rénovation, construction — les seuils pour les travaux sont spécifiques." },
  { icon: '📚', title: 'Organiser une formation', desc: "Formation, e-learning, certification — selon le montant et le type de prestation." },
  { icon: '📱', title: 'Développer un outil digital', desc: "Application, plateforme collaborative, outil de gestion sur mesure." },
  { icon: '🫶', title: 'Sous-traiter un projet subsié', desc: "Les règles de votre convention de subvention peuvent s'appliquer." },
]

const AUDIENCES = [
  'ASBL', 'Fondations', 'ONG', 'Fédérations',
  'Associations culturelles', 'Associations sociales', 'Clubs sportifs',
  'Associations éducatives', 'Porteurs de projets européens', 'PME subsiées',
]

const FAQS = [
  {
    q: 'Une ASBL peut-elle être soumise aux marchés publics ?',
    a: "Oui, dans certains cas. Une ASBL peut être considérée comme « pouvoir adjudicateur » si elle est majoritairement financée par des pouvoirs publics, contrôlée par une autorité publique, ou si son CA est composé majoritairement de représentants publics.",
  },
  {
    q: 'Est-ce uniquement pour les organismes publics ?',
    a: "Non. La loi belge du 17 juin 2016 peut s'appliquer à des organisations privées, y compris des ASBL, si elles répondent à certains critères.",
  },
  {
    q: 'Si je reçois un subside, dois-je faire un marché public ?',
    a: "Pas automatiquement. Recevoir un subside ne suffit pas. Mais si ce subside dépasse 50 % de votre budget, ou si votre convention impose des règles de mise en concurrence, la situation peut changer.",
  },
  {
    q: 'Puis-je simplement demander trois devis ?',
    a: "Oui, et c'est souvent recommandé. Demander trois devis est une bonne pratique pour tout achat. Mais selon les montants et votre statut, une procédure plus formelle peut être requise.",
  },
  {
    q: 'Puis-je choisir un prestataire que je connais déjà ?',
    a: "Si vous êtes soumis aux marchés publics, le principe est d'assurer une mise en concurrence équitable. Si vous n'êtes pas soumis, vous restez libre de choisir votre prestataire.",
  },
  {
    q: 'Que faire si mon projet est urgent ?',
    a: "L'urgence peut justifier une procédure accélérée, mais ne dispense pas des règles. Documentez toujours la raison de l'urgence.",
  },
  {
    q: 'Quelle différence entre devis et marché public ?',
    a: "Un devis est une simple demande de prix. Un marché public est une procédure formalisée par la loi, avec des étapes obligatoires, des délais et des publications.",
  },
  {
    q: 'Cet outil remplace-t-il un avis juridique ?',
    a: "Non. Cet outil est un pré-diagnostic pédagogique et indépendant. Pour toute situation complexe, consultez un juriste spécialisé ou votre pouvoir subsidiant.",
  },
]

function Header({ onStart }: { onStart: () => void }) {
  const [open, setOpen] = useState(false)
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-black/[0.07]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#1B3A6B] flex items-center justify-center">
            <span className="text-white text-[10px] font-black tracking-tight">MP</span>
          </div>
          <span className="font-bold text-[#1A1F2E] text-sm">marchepublic<span className="text-[#1B3A6B]">.be</span></span>
        </div>
        <nav className="hidden md:flex items-center gap-7">
          {[['#how', 'Comment ça marche'], ['#cases', 'Cas fréquents'], ['#faq', 'FAQ']].map(([href, label]) => (
            <a key={href} href={href} className="text-[#5A6272] hover:text-[#1B3A6B] transition-colors text-sm font-medium">{label}</a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button onClick={onStart} className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1B3A6B] text-white font-semibold text-sm hover:bg-[#2A5298] transition-colors shadow-sm">
            Faire le diagnostic
          </button>
          <button onClick={() => setOpen(v => !v)} className="md:hidden p-2 rounded-lg hover:bg-[#F5F4F0]" aria-label="Menu">
            <div className="space-y-[5px]">
              <div className="w-5 h-[1.5px] bg-[#1A1F2E]" />
              <div className="w-5 h-[1.5px] bg-[#1A1F2E]" />
              <div className="w-5 h-[1.5px] bg-[#1A1F2E]" />
            </div>
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden border-t border-black/[0.07] bg-white px-4 py-3 space-y-1">
          {[['#how', 'Comment ça marche'], ['#cases', 'Cas fréquents'], ['#faq', 'FAQ']].map(([href, label]) => (
            <a key={href} href={href} onClick={() => setOpen(false)} className="block px-3 py-2 rounded-lg text-[#5A6272] hover:bg-[#F5F4F0] text-sm font-medium">{label}</a>
          ))}
          <button onClick={onStart} className="w-full mt-2 py-3 rounded-xl bg-[#1B3A6B] text-white font-semibold text-sm">Faire le diagnostic</button>
        </div>
      )}
    </header>
  )
}

function Hero({ onStart }: { onStart: () => void }) {
  return (
    <section className="bg-[#FAFAF8] pt-16 pb-20 sm:pt-24 sm:pb-28 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#1B3A6B]/[0.03] rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-[#1C6B45]/[0.03] rounded-full blur-3xl" />
      </div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EBF0F8] border border-[#C5D4EA] text-[#1B3A6B] text-xs font-semibold mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1B3A6B]" />
              Outil indépendant · Gratuit · Pédagogique
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-[#1A1F2E] tracking-tight leading-[1.05] mb-5">
              Votre ASBL doit-elle passer par un marché public ?
            </h1>
            <p className="text-lg text-[#5A6272] leading-relaxed mb-8 max-w-lg">
              Répondez à quelques questions et identifiez en moins de 5 minutes votre niveau de risque avant de lancer un projet, commander une prestation ou choisir un prestataire.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <button onClick={onStart} className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#1B3A6B] text-white font-semibold text-sm hover:bg-[#2A5298] transition-all shadow-sm hover:shadow-brand active:scale-[0.98]">
                Faire le diagnostic <ArrowRight className="w-4 h-4" />
              </button>
              <a href="#how" className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white text-[#1A1F2E] font-semibold text-sm border border-black/[0.12] hover:border-[#1B3A6B] hover:text-[#1B3A6B] hover:bg-[#EBF0F8] transition-all">
                Comprendre le principe
              </a>
            </div>
            <p className="text-xs text-[#8E95A0] flex items-start gap-1.5">
              <Shield className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              Outil de pré-diagnostic indépendant. Ne remplace pas un avis juridique ou l’avis de votre pouvoir subsidiant.
            </p>
          </div>
          <div className="hidden lg:block">
            <div className="relative">
              <div className="absolute -inset-4 bg-[radial-gradient(circle,rgba(27,58,107,0.06),transparent_60%)]" />
              <div className="space-y-4 relative">
                <div className="bg-white rounded-xl border border-black/[0.08] shadow-elevated p-6 rotate-1 hover:rotate-0 transition-transform duration-500">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#FEF3C7] flex items-center justify-center text-xl shrink-0">⚠️</div>
                    <div className="flex-1">
                      <p className="text-[10px] text-[#8E95A0] font-medium uppercase tracking-widest">Résultat du diagnostic</p>
                      <p className="font-bold text-[#1A1F2E] text-sm">Zone d’attention</p>
                    </div>
                    <div className="px-2.5 py-1 rounded-full bg-[#FEF3C7] border border-amber-200">
                      <span className="text-xs font-bold text-[#B45309]">Moyen</span>
                    </div>
                  </div>
                  <p className="text-sm text-[#5A6272] mb-4 leading-relaxed">Certains indices suggèrent que votre situation mérite une vérification avant de choisir un prestataire.</p>
                  <div className="space-y-2">
                    {['Financement public à vérifier', 'Montant dans la zone intermédiaire'].map(t => (
                      <div key={t} className="flex items-center gap-2 text-xs text-[#5A6272]">
                        <div className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />{t}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white rounded-xl border border-black/[0.08] shadow-elevated p-5 -rotate-1 hover:rotate-0 transition-transform duration-500 ml-10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex gap-1">
                      {[1,2,3,4,5].map(i => (
                        <div key={i} className={`h-1 w-7 rounded-full ${i <= 3 ? 'bg-[#1B3A6B]' : 'bg-[#F5F4F0]'}`} />
                      ))}
                    </div>
                    <span className="text-xs text-[#8E95A0]">3 / 5</span>
                  </div>
                  <p className="text-xs text-[#1B3A6B] font-bold uppercase tracking-widest mb-1">Votre projet</p>
                  <p className="text-sm font-semibold text-[#1A1F2E] mb-3">Quel type de prestation ?</p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {['Site web / digital', 'Consultance', 'Travaux', 'Formation'].map((t, i) => (
                      <div key={t} className={`text-xs px-3 py-2 rounded-lg border text-center ${i === 0 ? 'border-[#1B3A6B] bg-[#EBF0F8] text-[#1B3A6B] font-semibold' : 'border-black/[0.08] text-[#5A6272]'}`}>{t}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-14 pt-8 border-t border-black/[0.07] grid grid-cols-3 gap-8 max-w-md">
          {[['< 5 min', 'Pour un premier résultat'], ['Gratuit', 'Outil indépendant'], ['Non juridique', '100 % pédagogique']].map(([num, label]) => (
            <div key={num}>
              <p className="font-bold text-[#1A1F2E] text-base">{num}</p>
              <p className="text-xs text-[#8E95A0] mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function WhySection() {
  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="max-w-2xl mb-12">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#1B3A6B] mb-3">Pourquoi cet outil ?</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1A1F2E] tracking-tight mb-4">Un doute qui bloque trop souvent les projets</h2>
          <p className="text-[#5A6272] text-lg leading-relaxed">
            Les ASBL doivent souvent commander un service, un outil digital ou une mission externe. Mais une question revient : <em>« Est-ce que je dois faire un marché public pour ça ? »</em>
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: '💰', title: 'Vous êtes subsié·e ?', desc: "Recevoir des fonds publics peut modifier vos obligations d'achat — mais pas systématiquement. Tout dépend du type de subside, de son montant et de votre statut." },
            { icon: '🤝', title: 'Vous voulez choisir un prestataire ?', desc: "Choisir librement un graphiste, un développeur ou un consultant est possible — mais selon votre situation, une mise en concurrence préalable peut être requise." },
            { icon: '📋', title: 'Quelle procédure appliquer ?', desc: "Devis simple, négociation directe, publication d'un avis — les règles varient selon votre statut, le montant et le type d'achat." },
          ].map(c => (
            <div key={c.title} className="bg-[#FAFAF8] rounded-xl border border-black/[0.07] p-6 hover:shadow-elevated transition-shadow">
              <div className="text-3xl mb-4">{c.icon}</div>
              <h3 className="font-bold text-[#1A1F2E] mb-2">{c.title}</h3>
              <p className="text-[#5A6272] text-sm leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function HowSection({ onStart }: { onStart: () => void }) {
  return (
    <section id="how" className="bg-[#FAFAF8] py-20 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-14">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#1B3A6B] mb-3">Comment ça marche</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1A1F2E] tracking-tight mb-4">Un diagnostic en 3 temps</h2>
          <p className="text-[#5A6272]">Pas de jargon, pas de formulaire intimidant. Quelques questions simples pour clarifier votre situation.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-10 lg:gap-16">
          {[
            { num: '01', icon: '🏗️', title: 'Votre structure', desc: "Décrivez votre type d'organisation, votre mode de financement et votre gouvernance." },
            { num: '02', icon: '\ud83d�', title: 'Votre projet', desc: "Précisez le type de prestation ou d'achat, le montant estimé et le contexte." },
            { num: '03', icon: '📊', title: 'Votre niveau de risque', desc: "Recevez une analyse personnalisée avec des recommandations pratiques et des ressources." },
          ].map(s => (
            <div key={s.num}>
              <span className="text-5xl font-black text-[#C5D4EA] leading-none block mb-4">{s.num}</span>
              <div className="text-3xl mb-3">{s.icon}</div>
              <h3 className="font-bold text-[#1A1F2E] text-lg mb-2">{s.title}</h3>
              <p className="text-[#5A6272] text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <button onClick={onStart} className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#1B3A6B] text-white font-semibold text-sm hover:bg-[#2A5298] transition-all shadow-sm hover:shadow-brand active:scale-[0.98]">
            Commencer le diagnostic <ArrowRight className="w-4 h-4" />
          </button>
          <p className="text-xs text-[#8E95A0] mt-3">Moins de 5 minutes · Aucune inscription requise</p>
        </div>
      </div>
    </section>
  )
}

function UseCasesSection({ onStart }: { onStart: () => void }) {
  return (
    <section id="cases" className="bg-white py-20 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="max-w-2xl mb-12">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#1B3A6B] mb-3">Cas fréquents</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1A1F2E] tracking-tight mb-4">Situations concrètes</h2>
          <p className="text-[#5A6272] text-lg">Ces projets sont souvent concernés. Vérifiez votre situation avant de contacter un prestataire.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {USE_CASES.map(c => (
            <button key={c.title} onClick={onStart} className="bg-white rounded-xl border border-black/[0.08] shadow-card p-5 text-left hover:shadow-elevated hover:border-[#C5D4EA] transition-all group">
              <div className="text-2xl mb-3">{c.icon}</div>
              <h3 className="font-semibold text-[#1A1F2E] text-sm mb-1.5 group-hover:text-[#1B3A6B] transition-colors">{c.title}</h3>
              <p className="text-xs text-[#8E95A0] leading-relaxed">{c.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

function ForWhoSection({ onStart }: { onStart: () => void }) {
  return (
    <section className="bg-[#1B3A6B] py-16 sm:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
        <p className="text-[#C5D4EA] text-xs font-bold uppercase tracking-[0.12em] mb-4">Pour qui ?</p>
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-3">Cet outil est fait pour vous si…</h2>
        <p className="text-[#C5D4EA] mb-10 max-w-xl mx-auto">Vous gérez une structure qui reçoit des fonds publics ou qui travaille avec des organismes publics.</p>
        <div className="flex flex-wrap gap-3 justify-center mb-10">
          {AUDIENCES.map(a => (
            <div key={a} className="px-4 py-2 rounded-xl bg-white/10 border border-white/15 text-white font-medium text-sm">{a}</div>
          ))}
        </div>
        <button onClick={onStart} className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white text-[#1B3A6B] font-semibold text-sm hover:bg-[#EBF0F8] transition-colors">
          Vérifier ma situation <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  )
}

function FAQSection() {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <section id="faq" className="bg-[#FAFAF8] py-20 sm:py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#1B3A6B] mb-3">Questions fréquentes</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1A1F2E] tracking-tight">Les réponses aux questions qui reviennent</h2>
        </div>
        <div className="space-y-2">
          {FAQS.map((f, i) => (
            <div key={i} className="bg-white rounded-xl border border-black/[0.08] shadow-card overflow-hidden">
              <button onClick={() => setOpen(open === i ? null : i)} className="w-full text-left px-6 py-4 flex items-center justify-between gap-4">
                <span className="font-semibold text-[#1A1F2E] text-sm">{f.q}</span>
                <ChevronDown className={`w-4 h-4 text-[#1B3A6B] shrink-0 transition-transform duration-200 ${open === i ? 'rotate-180' : ''}`} />
              </button>
              {open === i && (
                <div className="px-6 pb-5 border-t border-black/[0.05] pt-3">
                  <p className="text-[#5A6272] text-sm leading-relaxed">{f.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-[#8E95A0] mt-8">
          ⚠️ Les réponses sont données à titre pédagogique. Elles ne constituent pas un avis juridique.
        </p>
      </div>
    </section>
  )
}

function FinalCTA({ onStart }: { onStart: () => void }) {
  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
        <div className="bg-[#FAFAF8] rounded-2xl border border-black/[0.08] p-10 sm:p-14">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#1B3A6B] mb-4">Prêt·e à vérifier ?</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1A1F2E] tracking-tight mb-4">Vous avez un projet en tête ?</h2>
          <p className="text-[#5A6272] mb-8 leading-relaxed">Commencez par vérifier votre niveau de risque avant de demander un devis ou de choisir un prestataire.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={onStart} className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#1B3A6B] text-white font-semibold text-sm hover:bg-[#2A5298] transition-all shadow-sm hover:shadow-brand active:scale-[0.98]">
              Faire le diagnostic <ArrowRight className="w-4 h-4" />
            </button>
            <a href="#how" className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white text-[#1A1F2E] font-semibold text-sm border border-black/[0.12] hover:border-[#1B3A6B] hover:text-[#1B3A6B] transition-all">
              Comprendre les étapes
            </a>
          </div>
          <p className="text-xs text-[#8E95A0] mt-5">Gratuit · Moins de 5 min · Aucune inscription</p>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="bg-[#1A1F2E] text-white/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid sm:grid-cols-3 gap-8 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-[#1B3A6B] flex items-center justify-center">
                <span className="text-white text-[10px] font-black">MP</span>
              </div>
              <span className="font-bold text-white text-sm">marchepublic<span className="text-[#9DB8D9]">.be</span></span>
            </div>
            <p className="text-xs leading-relaxed">Outil indépendant de pré-diagnostic pour ASBL et associations. Ne remplace pas un avis juridique.</p>
          </div>
          <div>
            <p className="text-white text-xs font-bold uppercase tracking-[0.12em] mb-4">Navigation</p>
            <ul className="space-y-2 text-xs">
              {['Diagnostic', 'Comment ça marche', 'Cas fréquents', 'FAQ'].map(l => (
                <li key={l}><a href="#" className="hover:text-white transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-white text-xs font-bold uppercase tracking-[0.12em] mb-4">Légal</p>
            <ul className="space-y-2 text-xs">
              {['À propos', 'Mentions légales', 'Confidentialité', 'Contact'].map(l => (
                <li key={l}><a href="#" className="hover:text-white transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-xs leading-relaxed max-w-lg">Ce diagnostic est fourni à titre informatif. Il ne constitue pas un avis juridique et ne remplace pas l’analyse d’un·e juriste ou de votre pouvoir subsidiant.</p>
          <p className="text-xs whitespace-nowrap shrink-0">Un outil développé par <span className="text-white font-medium">Nomadic Impact</span></p>
        </div>
      </div>
    </footer>
  )
}

export function Home({ onStart }: { onStart: () => void }) {
  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <Header onStart={onStart} />
      <main>
        <Hero onStart={onStart} />
        <WhySection />
        <HowSection onStart={onStart} />
        <UseCasesSection onStart={onStart} />
        <ForWhoSection onStart={onStart} />
        <FAQSection />
        <FinalCTA onStart={onStart} />
      </main>
      <Footer />
    </div>
  )
}
