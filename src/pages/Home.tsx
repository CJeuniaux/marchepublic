import { useEffect, useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowRight, ArrowUpRight, ShieldCheck, Compass, Route, Gauge, Menu, X,
  Globe, Cloud, Users, PenTool, Code2, Boxes, GraduationCap, Server,
  ChevronDown, Check, FileSearch, ListChecks,
} from 'lucide-react'
import { HeroPathScene } from '../components/Graphics'

const fadeUp = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
}

function Reveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      className={className}
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-80px' }}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  )
}

function Eyebrow({ children, tone = 'teal' }: { children: ReactNode; tone?: 'teal' | 'cream' | 'coral' }) {
  const tones: Record<string, string> = {
    teal: 'text-ink bg-aqua',
    cream: 'text-aqua bg-white/10',
    coral: 'text-white bg-coral/90',
  }
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase ${tones[tone]}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {children}
    </span>
  )
}

const USE_CASES = [
  { icon: Globe, title: 'Refaire votre site web', desc: 'Refonte, CMS, développement sur mesure.' },
  { icon: Cloud, title: 'Acheter un SaaS', desc: 'CRM, gestion de membres, plateforme.' },
  { icon: Users, title: 'Une mission de consultance', desc: 'Audit, accompagnement, évaluation.' },
  { icon: PenTool, title: 'Engager un graphiste', desc: 'Identité, campagne, rapport annuel.' },
  { icon: Code2, title: 'Un outil sur mesure', desc: 'Application, plateforme, automatisation.' },
  { icon: Boxes, title: 'Sous-traiter un projet subsidié', desc: 'Prestation financée par un subside.' },
  { icon: GraduationCap, title: 'Organiser une formation', desc: 'Cycle, e-learning, certification.' },
  { icon: Server, title: 'Louer des services techniques', desc: 'Hébergement, maintenance, support.' },
]

const AUDIENCES = ['ASBL', 'Fondations', 'ONG', 'Fédérations', 'Associations culturelles', 'Acteurs sociaux', 'Clubs sportifs', 'Projets éducatifs', 'Porteurs de projets européens', 'Petites structures subsidiées']

const FAQS = [
  { q: 'Une ASBL peut-elle vraiment être soumise aux marchés publics ?', a: "Oui. Une ASBL peut être qualifiée de « pouvoir adjudicateur » si elle est majoritairement financée par des fonds publics, contrôlée par une autorité publique, ou si sa gouvernance est dominée par des représentants publics. Le statut associatif ne protège pas automatiquement." },
  { q: "Recevoir un subside m'oblige-t-il à faire un marché public ?", a: "Pas mécaniquement. Recevoir un subside ne suffit pas. Mais si le financement public dépasse certains seuils, ou si votre convention impose une mise en concurrence, vos obligations changent." },
  { q: 'Trois devis suffisent-ils ?', a: "Souvent c'est une bonne pratique — parfois c'est insuffisant. Selon votre statut et le montant, une procédure formalisée peut être exigée. Demander trois devis ne vous met pas automatiquement en règle." },
  { q: 'Puis-je choisir un prestataire que je connais déjà ?', a: "Si vous êtes soumis aux règles, le principe est la mise en concurrence équitable. Si vous ne l'êtes pas, vous gardez la liberté de choix. C'est précisément ce que le diagnostic aide à clarifier." },
  { q: 'Quelle différence entre un devis et un marché public ?', a: "Un devis est une simple demande de prix. Un marché public est une procédure encadrée par la loi : étapes obligatoires, délais, transparence, parfois publication." },
  { q: 'Cet outil remplace-t-il un juriste ?', a: "Non, et il ne le prétend pas. C'est un pré-diagnostic pédagogique et indépendant. Pour une situation engageante ou complexe, consultez un·e juriste ou votre pouvoir subsidiant." },
]

function Header({ onStart }: { onStart: () => void }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  const links: [string, string][] = [['#pourquoi', 'Pourquoi'], ['#comment', 'Comment ça marche'], ['#cas', 'Cas fréquents'], ['#faq', 'FAQ']]
  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-cream/90 backdrop-blur-md border-b border-navy/10 shadow-[0_2px_20px_rgba(16,40,74,0.05)]' : 'bg-transparent'}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-xl bg-navy flex items-center justify-center">
            <Compass className="w-4.5 h-4.5 text-teal" strokeWidth={2.5} />
          </span>
          <span className="font-display font-bold text-navy text-[15px]">marchepublic<span className="text-teal">.be</span></span>
        </a>
        <nav className="hidden md:flex items-center gap-8">
          {links.map(([href, label]) => (
            <a key={href} href={href} className="text-sm font-medium text-slate hover:text-navy transition-colors">{label}</a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button onClick={onStart} className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-coral text-white font-semibold text-sm hover:brightness-105 transition-all shadow-coral active:scale-[0.98]">
            Lancer le diagnostic <ArrowRight className="w-4 h-4" />
          </button>
          <button onClick={() => setOpen(v => !v)} className="md:hidden p-2 rounded-lg text-navy hover:bg-navy/5" aria-label="Menu">
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden border-t border-navy/10 bg-cream px-4 py-3 space-y-1">
          {links.map(([href, label]) => (
            <a key={href} href={href} onClick={() => setOpen(false)} className="block px-3 py-2.5 rounded-lg text-slate hover:bg-navy/5 text-sm font-medium">{label}</a>
          ))}
          <button onClick={onStart} className="w-full mt-2 py-3 rounded-xl bg-coral text-white font-semibold text-sm">Lancer le diagnostic</button>
        </div>
      )}
    </header>
  )
}

function Hero({ onStart }: { onStart: () => void }) {
  return (
    <section id="top" className="relative overflow-hidden bg-navy text-white">
      <div className="absolute inset-0 dotgrid-light opacity-40" />
      <div className="absolute -top-32 -right-24 w-[28rem] h-[28rem] rounded-full bg-teal/20 blur-3xl" />
      <div className="absolute -bottom-40 -left-24 w-96 h-96 rounded-full bg-coral/15 blur-3xl" />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-14 pb-20 sm:pt-20 sm:pb-28">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-10 items-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}>
            <Eyebrow tone="cream">Outil indépendant · Gratuit · Pédagogique</Eyebrow>
            <h1 className="mt-5 font-display text-4xl sm:text-5xl lg:text-[3.4rem] font-bold leading-[1.04] tracking-tight text-balance">
              Votre ASBL doit-elle passer par un <span className="text-teal">marché public</span> ?
            </h1>
            <p className="mt-5 text-lg text-aqua/85 leading-relaxed max-w-xl">
              Avant de lancer un projet, commander un site, choisir un prestataire ou sous-traiter une mission, identifiez en quelques minutes votre niveau de risque. On transforme un sujet juridique opaque en parcours clair.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <button onClick={onStart} className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-coral text-white font-semibold text-sm hover:brightness-105 transition-all shadow-coral active:scale-[0.98]">
                Démarrer mon diagnostic <ArrowRight className="w-4 h-4" />
              </button>
              <a href="#comment" className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 text-white font-semibold text-sm border border-white/20 hover:bg-white/15 transition-all">
                Comprendre la démarche
              </a>
            </div>
            <p className="mt-6 text-xs text-aqua/60 flex items-start gap-1.5 max-w-md">
              <ShieldCheck className="w-4 h-4 shrink-0 mt-px text-teal" />
              Outil indépendant de pré-diagnostic. Sans valeur d'avis juridique : il oriente, il ne tranche pas à votre place.
            </p>
          </motion.div>

          <motion.div className="relative" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}>
            <HeroPathScene className="absolute -inset-6 w-[calc(100%+3rem)] opacity-80 hidden sm:block" />
            <div className="relative animate-floaty">
              <div className="bg-white text-navy rounded-3xl shadow-float p-6 sm:p-7 border border-white/60">
                <div className="flex items-center justify-between mb-5">
                  <span className="text-[11px] font-semibold uppercase tracking-widest text-slate">Pré-diagnostic</span>
                  <span className="flex items-center gap-1.5 text-[11px] font-semibold text-ink"><Gauge className="w-3.5 h-3.5" /> Étape 3 / 5</span>
                </div>
                <div className="flex gap-1.5 mb-6">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= 3 ? 'bg-teal' : 'bg-navy/10'}`} />
                  ))}
                </div>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-teal mb-1">Votre projet</p>
                <p className="font-display font-semibold text-lg mb-4">Quel type de prestation ?</p>
                <div className="grid grid-cols-2 gap-2">
                  {[['Site web', true], ['Consultance', false], ['Travaux', false], ['Formation', false]].map(([t, active]) => (
                    <div key={t as string} className={`text-xs font-medium px-3 py-2.5 rounded-xl border text-center ${active ? 'border-teal bg-aqua text-ink' : 'border-navy/10 text-slate'}`}>{t as string}</div>
                  ))}
                </div>
              </div>
              <div className="absolute -bottom-6 -left-6 bg-navy text-white rounded-2xl shadow-float px-4 py-3 flex items-center gap-3 animate-floaty-slow border border-white/10">
                <span className="w-8 h-8 rounded-lg bg-sun flex items-center justify-center text-navy text-sm font-bold">!</span>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-aqua/70">Résultat</p>
                  <p className="text-sm font-semibold">Zone d'attention</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="mt-16 grid grid-cols-3 gap-4 sm:gap-8 max-w-2xl border-t border-white/10 pt-8">
          {[['~ 5 min', 'Un premier résultat'], ['8 questions', 'Guidées, sans jargon'], ['100 %', 'Indépendant & gratuit']].map(([n, l]) => (
            <div key={n}>
              <p className="font-display font-bold text-xl sm:text-2xl text-teal">{n}</p>
              <p className="text-xs text-aqua/60 mt-1">{l}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="h-10 bg-gradient-to-b from-transparent to-cream" />
    </section>
  )
}

function WhySection() {
  const items = [
    { icon: FileSearch, color: 'bg-aqua text-ink', title: 'Vous êtes subsidié·e', desc: "Des fonds publics peuvent modifier vos obligations d'achat. Pas toujours — mais parfois de façon décisive." },
    { icon: Users, color: 'bg-coral/15 text-coral', title: 'Vous voulez choisir un prestataire', desc: "Engager un graphiste ou un développeur de confiance peut exiger, selon votre cas, une mise en concurrence préalable." },
    { icon: ListChecks, color: 'bg-sun/25 text-ink', title: 'Vous ne savez pas quelle procédure suivre', desc: "Trois devis ? Procédure négociée ? Publication ? Les règles dépendent de votre statut, du montant et du type d'achat." },
  ]
  return (
    <section id="pourquoi" className="bg-cream py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <Reveal className="max-w-2xl mb-14">
          <Eyebrow>Pourquoi cet outil</Eyebrow>
          <h2 className="mt-4 font-display text-3xl sm:text-4xl font-bold text-navy tracking-tight text-balance">Un doute qui bloque, retarde et fragilise vos projets</h2>
          <p className="mt-4 text-lg text-slate leading-relaxed">La question « dois-je faire un marché public ? » revient sans cesse — et reste sans réponse claire. Résultat : des projets ralentis, ou des décisions prises à l'aveugle. marchepublic.be vous donne un point de repère fiable, en quelques minutes.</p>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-5">
          {items.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.1}>
              <div className="h-full bg-white rounded-3xl border border-navy/[0.07] p-7 shadow-card hover:shadow-float transition-shadow">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 ${c.color}`}><c.icon className="w-6 h-6" /></div>
                <h3 className="font-display font-bold text-navy text-lg mb-2">{c.title}</h3>
                <p className="text-slate text-sm leading-relaxed">{c.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function HowSection({ onStart }: { onStart: () => void }) {
  const steps = [
    { n: '01', icon: Compass, title: 'Votre structure', desc: "Statut, financement, gouvernance. On situe votre organisation sur la carte des marchés publics." },
    { n: '02', icon: Route, title: 'Votre projet', desc: "Type de prestation, montant estimé, conditions de subvention. On trace le parcours de votre dépense." },
    { n: '03', icon: Gauge, title: 'Votre niveau de risque', desc: "Un résultat clair, des points à vérifier et les prochaines étapes concrètes. Vous repartez avec un cap." },
  ]
  return (
    <section id="comment" className="relative bg-ink text-white py-20 sm:py-28 overflow-hidden">
      <div className="absolute inset-0 dotgrid-light opacity-30" />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        <Reveal className="text-center max-w-xl mx-auto mb-16">
          <Eyebrow tone="cream">Comment ça marche</Eyebrow>
          <h2 className="mt-4 font-display text-3xl sm:text-4xl font-bold tracking-tight text-balance">Trois étapes, un parcours guidé</h2>
          <p className="mt-4 text-aqua/80">Pas de formulaire intimidant. Des questions simples, expliquées au fur et à mesure.</p>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-8 lg:gap-6 relative">
          <div className="hidden md:block absolute top-9 left-[16%] right-[16%] h-px bg-gradient-to-r from-teal/40 via-teal/40 to-coral/40" />
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.12} className="relative text-center md:text-left">
              <div className="inline-flex md:flex items-center justify-center w-18 h-18 mb-5">
                <span className="relative w-16 h-16 rounded-2xl bg-white/8 border border-white/15 flex items-center justify-center">
                  <s.icon className="w-7 h-7 text-teal" />
                  <span className="absolute -top-2 -right-2 px-1.5 py-0.5 rounded-md bg-coral text-[10px] font-bold">{s.n}</span>
                </span>
              </div>
              <h3 className="font-display font-bold text-xl mb-2">{s.title}</h3>
              <p className="text-aqua/75 text-sm leading-relaxed max-w-xs mx-auto md:mx-0">{s.desc}</p>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-14 text-center">
          <button onClick={onStart} className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-coral text-white font-semibold text-sm hover:brightness-105 transition-all shadow-coral active:scale-[0.98]">
            Commencer maintenant <ArrowRight className="w-4 h-4" />
          </button>
          <p className="text-xs text-aqua/50 mt-3">Aucune inscription · Vos réponses restent sur votre appareil</p>
        </Reveal>
      </div>
    </section>
  )
}

function ClarifySection() {
  const can = ['Si votre structure peut être un « pouvoir adjudicateur »', 'Si votre dépense entre dans le champ des marchés publics', 'Quels seuils de montant peuvent déclencher une procédure', "Quels points vérifier dans votre convention de subvention", 'Quelle direction prendre avant de contacter un prestataire']
  const cannot = ["Rendre un avis juridique définitif sur votre situation", 'Remplacer votre pouvoir subsidiant ou un·e juriste', 'Lancer ou rédiger une procédure de marché public à votre place', 'Garantir une conformité légale']
  return (
    <section className="bg-cream py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-6">
        <Reveal>
          <div className="h-full bg-white rounded-3xl border border-navy/[0.07] p-8 shadow-card">
            <Eyebrow>Ce que l'outil clarifie</Eyebrow>
            <h3 className="mt-4 font-display text-2xl font-bold text-navy mb-6">Ce que le diagnostic peut vous aider à voir</h3>
            <ul className="space-y-3.5">
              {can.map(t => (
                <li key={t} className="flex items-start gap-3 text-sm text-navy/90">
                  <span className="mt-0.5 w-5 h-5 rounded-full bg-aqua flex items-center justify-center shrink-0"><Check className="w-3 h-3 text-ink" strokeWidth={3} /></span>{t}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="h-full bg-navy text-white rounded-3xl p-8 shadow-card relative overflow-hidden">
            <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-coral/15 blur-2xl" />
            <div className="relative">
              <Eyebrow tone="coral">Ce qu'il ne remplace pas</Eyebrow>
              <h3 className="mt-4 font-display text-2xl font-bold mb-6">Les limites, en toute transparence</h3>
              <ul className="space-y-3.5">
                {cannot.map(t => (
                  <li key={t} className="flex items-start gap-3 text-sm text-aqua/85">
                    <span className="mt-0.5 w-5 h-5 rounded-full bg-white/10 flex items-center justify-center shrink-0"><X className="w-3 h-3 text-coral" strokeWidth={3} /></span>{t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function UseCasesSection({ onStart }: { onStart: () => void }) {
  return (
    <section id="cas" className="bg-white py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <Reveal className="max-w-2xl mb-12">
          <Eyebrow>Cas fréquents</Eyebrow>
          <h2 className="mt-4 font-display text-3xl sm:text-4xl font-bold text-navy tracking-tight text-balance">Dans quels cas la question se pose vraiment</h2>
          <p className="mt-4 text-lg text-slate">Ces projets du quotidien associatif sont souvent concernés. Cliquez sur le vôtre pour vérifier votre situation.</p>
        </Reveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {USE_CASES.map((c, i) => (
            <Reveal key={c.title} delay={(i % 4) * 0.06}>
              <button onClick={onStart} className="group w-full h-full text-left bg-cream rounded-2xl border border-navy/[0.07] p-5 hover:bg-navy hover:border-navy transition-all duration-300 shadow-card hover:shadow-float">
                <div className="w-11 h-11 rounded-xl bg-white group-hover:bg-teal flex items-center justify-center mb-4 transition-colors">
                  <c.icon className="w-5 h-5 text-ink group-hover:text-navy transition-colors" />
                </div>
                <h3 className="font-display font-semibold text-navy group-hover:text-white text-[15px] mb-1 transition-colors flex items-center gap-1">
                  {c.title}<ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all text-teal" />
                </h3>
                <p className="text-xs text-slate group-hover:text-aqua/70 leading-relaxed transition-colors">{c.desc}</p>
              </button>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function ForWhoSection({ onStart }: { onStart: () => void }) {
  return (
    <section className="relative bg-teal text-navy py-20 sm:py-24 overflow-hidden">
      <div className="absolute inset-0 dotgrid opacity-40" />
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center">
        <Reveal>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide bg-navy text-teal">Pour qui</span>
          <h2 className="mt-4 font-display text-3xl sm:text-4xl font-bold tracking-tight text-balance">Conçu pour celles et ceux qui font tourner le secteur</h2>
          <p className="mt-4 text-navy/70 max-w-xl mx-auto">Si vous gérez une structure qui reçoit des fonds publics ou collabore avec des organismes publics, cet outil est fait pour vous.</p>
        </Reveal>
        <Reveal delay={0.1} className="mt-10 flex flex-wrap gap-2.5 justify-center">
          {AUDIENCES.map(a => (
            <span key={a} className="px-4 py-2 rounded-xl bg-navy/90 text-white font-medium text-sm">{a}</span>
          ))}
        </Reveal>
        <Reveal delay={0.15} className="mt-10">
          <button onClick={onStart} className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-navy text-white font-semibold text-sm hover:brightness-110 transition-all active:scale-[0.98]">
            Vérifier ma situation <ArrowRight className="w-4 h-4" />
          </button>
        </Reveal>
      </div>
    </section>
  )
}

function FAQSection() {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <section id="faq" className="bg-cream py-20 sm:py-28">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <Reveal className="text-center mb-12">
          <Eyebrow>Questions fréquentes</Eyebrow>
          <h2 className="mt-4 font-display text-3xl sm:text-4xl font-bold text-navy tracking-tight">Les réponses, sans le jargon</h2>
        </Reveal>
        <div className="space-y-3">
          {FAQS.map((f, i) => (
            <Reveal key={i} delay={(i % 3) * 0.05}>
              <div className={`rounded-2xl border overflow-hidden transition-colors ${open === i ? 'bg-white border-teal/40 shadow-card' : 'bg-white border-navy/[0.07]'}`}>
                <button onClick={() => setOpen(open === i ? null : i)} className="w-full text-left px-6 py-4 flex items-center justify-between gap-4">
                  <span className="font-display font-semibold text-navy text-[15px]">{f.q}</span>
                  <span className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all ${open === i ? 'bg-teal text-navy rotate-180' : 'bg-aqua text-ink'}`}><ChevronDown className="w-4 h-4" /></span>
                </button>
                {open === i && <div className="px-6 pb-5"><p className="text-slate text-sm leading-relaxed">{f.a}</p></div>}
              </div>
            </Reveal>
          ))}
        </div>
        <p className="text-center text-xs text-slate/70 mt-8">Réponses fournies à titre pédagogique. Elles ne constituent pas un avis juridique.</p>
      </div>
    </section>
  )
}

function FinalCTA({ onStart }: { onStart: () => void }) {
  return (
    <section className="bg-cream pb-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-navy text-white px-6 py-14 sm:px-14 sm:py-16 text-center shadow-float">
            <div className="absolute inset-0 dotgrid-light opacity-30" />
            <div className="absolute -top-20 -left-16 w-72 h-72 rounded-full bg-teal/20 blur-3xl" />
            <div className="absolute -bottom-24 -right-16 w-80 h-80 rounded-full bg-coral/20 blur-3xl" />
            <div className="relative">
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-balance max-w-2xl mx-auto">Un projet en tête ? Sachez où vous mettez les pieds.</h2>
              <p className="mt-4 text-aqua/80 max-w-xl mx-auto">Cinq minutes maintenant peuvent vous éviter des semaines d'incertitude — ou une décision risquée.</p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                <button onClick={onStart} className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-coral text-white font-semibold text-sm hover:brightness-105 transition-all shadow-coral active:scale-[0.98]">
                  Lancer mon diagnostic <ArrowRight className="w-4 h-4" />
                </button>
                <a href="#cas" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-white/10 text-white font-semibold text-sm border border-white/20 hover:bg-white/15 transition-all">Voir des exemples</a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function Footer({ onStart }: { onStart: () => void }) {
  return (
    <footer className="bg-navy text-aqua/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-3">
              <span className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center"><Compass className="w-4.5 h-4.5 text-teal" strokeWidth={2.5} /></span>
              <span className="font-display font-bold text-white text-[15px]">marchepublic<span className="text-teal">.be</span></span>
            </div>
            <p className="text-xs leading-relaxed">Outil indépendant de pré-diagnostic marchés publics pour les ASBL, fondations et structures subsidiées.</p>
            <button onClick={onStart} className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-teal hover:text-white transition-colors">Lancer le diagnostic <ArrowRight className="w-3.5 h-3.5" /></button>
          </div>
          <div>
            <p className="text-white text-xs font-bold uppercase tracking-widest mb-4">Naviguer</p>
            <ul className="space-y-2.5 text-sm">
              {[['#pourquoi', 'Pourquoi cet outil'], ['#comment', 'Comment ça marche'], ['#cas', 'Cas fréquents'], ['#faq', 'FAQ']].map(([h, l]) => (
                <li key={l}><a href={h} className="hover:text-white transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-white text-xs font-bold uppercase tracking-widest mb-4">Informations</p>
            <ul className="space-y-2.5 text-sm">
              {['Mentions légales', 'Confidentialité', 'Contact'].map(l => (
                <li key={l}><a href="#" className="hover:text-white transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-white text-xs font-bold uppercase tracking-widest mb-4">Avertissement</p>
            <p className="text-xs leading-relaxed">Ce diagnostic est fourni à titre informatif. Il ne constitue pas un avis juridique et ne remplace pas l'analyse d'un·e juriste, d'un pouvoir subsidiant ou d'un service compétent.</p>
          </div>
        </div>
        <div className="border-t border-white/10 pt-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-xs">© {new Date().getFullYear()} marchepublic.be — Tous droits réservés.</p>
          <p className="text-xs">Un outil développé par <span className="text-white font-semibold">Nomadic Impact</span></p>
        </div>
      </div>
    </footer>
  )
}

export function Home({ onStart }: { onStart: () => void }) {
  return (
    <div className="min-h-screen bg-cream">
      <Header onStart={onStart} />
      <main>
        <Hero onStart={onStart} />
        <WhySection />
        <HowSection onStart={onStart} />
        <ClarifySection />
        <UseCasesSection onStart={onStart} />
        <ForWhoSection onStart={onStart} />
        <FAQSection />
        <FinalCTA onStart={onStart} />
      </main>
      <Footer onStart={onStart} />
    </div>
  )
}
