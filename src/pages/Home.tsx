import { useEffect, useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowRight, ArrowUpRight, Compass, Route, Gauge, Menu, X,
  Globe, Cloud, Users, PenTool, Code2, Boxes, GraduationCap, Server,
  ChevronDown, Check, Target, ClipboardList, PenLine,
  ShieldCheck, Clock, Lock,
} from 'lucide-react'
import { HeroPathScene, LogoMark, TangleToArrow, ChecklistCard, RisingPath, Constellation, Signpost } from '../components/Graphics'

const NOMAD_URL = 'https://nomadimpact.org'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
}

function Reveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div className={className} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }} transition={{ delay }}>
      {children}
    </motion.div>
  )
}

function Eyebrow({ children, tone = 'teal' }: { children: ReactNode; tone?: 'teal' | 'cream' | 'coral' }) {
  const cls: Record<string, string> = {
    teal:  'text-teal bg-teal/10 border border-teal/20',
    cream: 'text-aqua/80 bg-white/10 border border-white/15',
    coral: 'text-white bg-coral border border-coral/80',
  }
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded text-[11px] font-bold tracking-widest uppercase ${cls[tone]}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      {children}
    </span>
  )
}

const USE_CASES = [
  { icon: Globe,        title: 'Refaire votre site web',         desc: 'Refonte, CMS, développement sur mesure.' },
  { icon: Cloud,        title: 'Acheter un SaaS',                desc: 'CRM, gestion de membres, plateforme.' },
  { icon: Users,        title: 'Une mission de consultance',     desc: 'Audit, accompagnement, évaluation.' },
  { icon: PenTool,      title: 'Engager un graphiste',           desc: 'Identité, campagne, rapport annuel.' },
  { icon: Code2,        title: 'Un outil sur mesure',            desc: 'Application, plateforme, automatisation.' },
  { icon: Boxes,        title: 'Sous-traiter un projet subsidié', desc: 'Prestation financée par un subside.' },
  { icon: GraduationCap, title: 'Organiser une formation',      desc: 'Cycle, e-learning, certification.' },
  { icon: Server,       title: 'Louer des services techniques',  desc: 'Hébergement, maintenance, support.' },
]

const AUDIENCES = ['ASBL', 'Fondations', 'ONG', 'Fédérations', 'Associations culturelles', 'Acteurs sociaux', 'Clubs sportifs', 'Projets éducatifs', 'Porteurs de projets européens', 'Petites structures subsidiées']

const FAQS = [
  { q: 'Une ASBL peut-elle vraiment être soumise aux marchés publics ?', a: "Oui. Une ASBL peut être qualifiée de « pouvoir adjudicateur » si elle est majoritairement financée par des fonds publics, contrôlée par une autorité publique, ou si sa gouvernance est dominée par des représentants publics. Le statut associatif ne protège pas automatiquement." },
  { q: "Recevoir un subside m'oblige-t-il à faire un marché public ?", a: "Pas mécaniquement. Recevoir un subside ne suffit pas. Mais si le financement public dépasse certains seuils, ou si votre convention impose une mise en concurrence, vos obligations changent." },
  { q: 'Trois devis suffisent-ils ?', a: "Souvent c'est une bonne pratique — parfois c'est insuffisant. Selon votre statut et le montant, une procédure formalisée peut être exigée. Demander trois devis ne vous met pas automatiquement en règle." },
  { q: 'Puis-je choisir un prestataire que je connais déjà ?', a: "Si vous êtes soumis aux règles, le principe est la mise en concurrence équitable. Si vous ne l'êtes pas, vous gardez la liberté de choix. C'est précisément ce que le parcours aide à clarifier." },
  { q: 'Quelle différence entre un devis et un marché public ?', a: "Un devis est une simple demande de prix. Un marché public est une procédure encadrée par la loi : étapes obligatoires, délais, transparence, parfois publication." },
  { q: 'Cet outil remplace-t-il un juriste ?', a: "Non, et il ne le prétend pas. C'est un pré-diagnostic pédagogique et indépendant : il trace un chemin clair et renvoie aux sources officielles. Pour une situation engageante ou complexe, faites valider votre procédure par une personne compétente." },
]

type TrustItem = { Icon: typeof Clock; label: string }
const TRUST_ITEMS: TrustItem[] = [
  { Icon: Clock, label: 'Environ 5 minutes' },
  { Icon: ShieldCheck, label: 'Sources officielles belges' },
  { Icon: Lock, label: 'Sans inscription' },
  { Icon: Check, label: 'Estimation indicative' },
]

function Header({ onStart }: { onStart: () => void }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8)
    fn(); window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])
  const links: [string, string][] = [['#pourquoi', 'Pourquoi'], ['#comment', 'Comment ça marche'], ['#cas', 'Cas fréquents'], ['#faq', 'FAQ']]
  return (
    <header className={`sticky top-0 z-50 transition-all duration-200 ${scrolled ? 'bg-white border-b border-line shadow-[0_1px_8px_rgba(8,43,76,0.06)]' : 'bg-transparent'}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2.5">
          <LogoMark className="h-6 w-auto" nodeColor="#082B4C" />
          <span className="font-display font-bold text-navy text-[15px]">marchépublic<span className="text-teal">.be</span></span>
        </a>
        <nav className="hidden md:flex items-center gap-7">
          {links.map(([href, label]) => (
            <a key={href} href={href} className="text-sm font-medium text-slate hover:text-navy transition-colors">{label}</a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button onClick={onStart} className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-coral text-white font-semibold text-sm hover:brightness-105 transition-all shadow-coral active:scale-[0.98]">
            Faire le diagnostic <ArrowRight className="w-4 h-4" />
          </button>
          <button onClick={() => setOpen(v => !v)} className="md:hidden p-2 rounded-lg text-navy hover:bg-navy/5">
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden border-t border-line bg-white px-4 py-3 space-y-1">
          {links.map(([href, label]) => (
            <a key={href} href={href} onClick={() => setOpen(false)} className="block px-3 py-2.5 rounded-lg text-slate hover:bg-cream text-sm font-medium">{label}</a>
          ))}
          <button onClick={onStart} className="w-full mt-2 py-3 rounded-lg bg-coral text-white font-semibold text-sm">Faire le diagnostic</button>
        </div>
      )}
    </header>
  )
}

function Hero({ onStart }: { onStart: () => void }) {
  return (
    <section id="top" className="relative overflow-hidden bg-cream">
      <div className="absolute inset-0 dotgrid opacity-40" />
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-coral via-coral/60 to-transparent" />
      <Constellation className="hidden lg:block absolute top-16 right-8 w-64 text-navy opacity-[0.06] pointer-events-none" />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-20 sm:pt-24 sm:pb-28">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-16 items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}>
            <div className="inline-flex items-center gap-2 border border-teal/40 text-teal text-[11px] font-bold uppercase tracking-widest px-3 py-1.5 rounded mb-6 bg-teal/5">
              <ShieldCheck className="w-3.5 h-3.5" />
              Outil pédagogique indépendant · Belgique
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.2rem] font-bold leading-[1.06] tracking-tight text-balance text-navy">
              Votre ASBL doit-elle passer par un <span className="text-coral">marché public ?</span>
            </h1>
            <p className="mt-5 text-lg text-slate leading-relaxed max-w-xl">
              En 5 minutes, identifiez les indices qui déterminent vos obligations : structure, financement, gouvernance, projet et montant. Vous obtenez un score indicatif, un chemin recommandé et les sources officielles à vérifier.
            </p>
            <div className="mt-7 flex flex-col sm:flex-row gap-3">
              <button onClick={onStart} className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-lg bg-coral text-white font-semibold hover:brightness-105 transition-all shadow-coral active:scale-[0.98]">
                Faire le diagnostic <ArrowRight className="w-4 h-4" />
              </button>
              <a href="#comment" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-lg border border-navy/20 text-navy font-semibold text-sm hover:bg-navy/5 transition-all">
                Comprendre les critères
              </a>
            </div>
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 border-t border-line pt-5">
              {TRUST_ITEMS.map(({ Icon, label }) => (
                <span key={label} className="flex items-center gap-1.5 text-xs text-slate font-medium">
                  <Icon className="w-3.5 h-3.5 text-teal/80" />
                  {label}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div className="relative" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}>
            <HeroPathScene className="absolute -inset-6 w-[calc(100%+3rem)] opacity-40 hidden sm:block pointer-events-none" />
            <div className="relative animate-floaty">
              <div className="bg-white text-navy rounded-2xl shadow-float p-6 sm:p-7 border border-line">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate">marchépublic.be</span>
                  <span className="flex items-center gap-1.5 text-[10px] font-semibold text-slate"><Gauge className="w-3 h-3" /> Étape 3 ⁄ 5</span>
                </div>
                <div className="w-full bg-line rounded-full h-1 mb-5">
                  <div className="bg-coral h-1 rounded-full" style={{ width: '60%' }} />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-coral mb-1">Votre projet</p>
                <p className="font-display font-bold text-base mb-4 leading-snug">Quel type de prestation souhaitez-vous commander ?</p>
                <div className="space-y-2">
                  {([['Site web ou application', true], ['Mission de consultance', false], ['Formation ou coaching', false]] as [string, boolean][]).map(([t, active]) => (
                    <div key={t} className={`text-xs font-medium px-3.5 py-2.5 rounded-lg border-2 flex items-center gap-2.5 ${active ? 'border-coral bg-coral/[0.05] text-navy' : 'border-line text-slate'}`}>
                      <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${active ? 'border-coral bg-coral' : 'border-line'}`}>
                        {active && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
                      </span>
                      {t}
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute -bottom-5 -left-5 bg-navy text-white rounded-xl shadow-float px-4 py-3 flex items-center gap-2.5 animate-floaty-slow border border-white/10">
                <span className="w-8 h-8 rounded-lg bg-coral/20 flex items-center justify-center text-coral text-sm font-bold shrink-0">74%</span>
                <div>
                  <p className="text-[9px] uppercase tracking-widest text-aqua/60 font-semibold">Score indicatif</p>
                  <p className="text-xs font-bold">Forte probabilité</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="mt-16 pt-8 border-t border-line grid grid-cols-3 gap-4 sm:gap-8 max-w-2xl">
          {([['5 min', 'Pour tracer votre réponse'], ['8 questions', 'Guidées, sans jargon'], ['100 %', 'Indépendant & gratuit']] as [string, string][]).map(([n, l]) => (
            <div key={n}>
              <p className="font-display font-bold text-xl sm:text-2xl text-coral">{n}</p>
              <p className="text-xs text-slate/70 mt-1 leading-snug">{l}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="h-8 bg-gradient-to-b from-transparent to-sable" />
    </section>
  )
}

function WhySection() {
  const items = [
    { icon: Compass, title: 'Votre structure compte', desc: "Financement public, gouvernance, contrôle ou mission d'intérêt général peuvent influencer vos obligations." },
    { icon: Route,   title: 'Votre projet compte',   desc: "Site web, logiciel, consultance, formation ou prestation externe : chaque achat doit être qualifié correctement." },
    { icon: Gauge,   title: 'Le montant compte',      desc: "Le montant estimé HTVA oriente la procédure, les documents à préparer et le niveau de mise en concurrence." },
  ]
  return (
    <section id="pourquoi" className="bg-cream py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-16 items-center mb-16">
          <Reveal className="max-w-2xl">
            <Eyebrow>Pourquoi cet outil</Eyebrow>
            <h2 className="mt-4 font-display text-3xl sm:text-4xl font-bold text-navy tracking-tight text-balance">Quand le chemin n'est pas clair, les projets ralentissent.</h2>
            <p className="mt-4 text-slate leading-relaxed">Une ASBL peut vite se retrouver face à une question simple en apparence : peut-on choisir librement un prestataire ou faut-il passer par une procédure de marché public ? marchépublic.be vous aide à identifier les points clés, estimer votre niveau d'obligation et avancer avec méthode.</p>
          </Reveal>
          <Reveal delay={0.1} className="text-navy">
            <TangleToArrow className="w-full max-w-sm mx-auto" />
            <p className="mt-3 text-center text-xs font-bold uppercase tracking-widest text-slate">Du doute à un chemin clair</p>
          </Reveal>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {items.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.08}>
              <div className="h-full bg-white rounded-2xl border border-line p-6 shadow-card">
                <div className="w-10 h-10 rounded-xl bg-navy flex items-center justify-center mb-5">
                  <c.icon className="w-5 h-5 text-teal" />
                </div>
                <h3 className="font-display font-bold text-navy mb-2">{c.title}</h3>
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
    { n: '01', icon: Compass, title: 'Situer votre structure', desc: "ASBL, fondation, organisme subsidié ou structure hybride : on identifie les premiers indices." },
    { n: '02', icon: Route,   title: 'Qualifier votre projet', desc: "Service, fourniture, développement digital, consultance ou formation : on précise ce que vous achetez." },
    { n: '03', icon: Gauge,   title: "Obtenir votre estimation", desc: "Vous recevez un score 0–100 %, un chemin recommandé et les sources officielles à vérifier." },
  ]
  return (
    <section id="comment" className="relative bg-ink text-white py-20 sm:py-28 overflow-hidden">
      <div className="absolute inset-0 dotgrid-light opacity-20" />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        <Reveal className="max-w-xl mb-14">
          <Eyebrow tone="cream">Comment ça marche</Eyebrow>
          <h2 className="mt-4 font-display text-3xl sm:text-4xl font-bold tracking-tight text-balance">Un diagnostic structuré en trois temps</h2>
          <p className="mt-3 text-aqua/75">Le parcours suit une logique progressive : structure, projet, montant. À chaque réponse, le score se précise.</p>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-6 relative">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.1} className="relative">
              <div className="bg-white/[0.05] border border-white/10 rounded-2xl p-6 h-full">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-8 h-8 rounded-lg bg-coral flex items-center justify-center text-white text-xs font-bold shrink-0">{s.n}</span>
                  <s.icon className="w-5 h-5 text-teal" />
                </div>
                <h3 className="font-display font-bold text-lg mb-2">{s.title}</h3>
                <p className="text-aqua/70 text-sm leading-relaxed">{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-12 grid sm:grid-cols-[1.2fr_0.8fr] gap-8 items-center bg-white/[0.04] border border-white/10 rounded-2xl p-6 sm:p-8">
          <ChecklistCard className="w-full max-w-sm mx-auto" />
          <div className="text-center sm:text-left">
            <RisingPath className="w-32 mx-auto sm:mx-0 mb-4" stroke="#27C7C9" hollow="#061F36" />
            <h3 className="font-display font-bold text-lg mb-2">Un chemin recommandé, pas un verdict</h3>
            <p className="text-aqua/70 text-sm leading-relaxed">À la fin, vous obtenez un score indicatif, le chemin recommandé, des documents utiles et les sources officielles à vérifier.</p>
          </div>
        </Reveal>
        <Reveal className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <button onClick={onStart} className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-coral text-white font-semibold text-sm hover:brightness-105 transition-all shadow-coral active:scale-[0.98]">
            Démarrer le diagnostic <ArrowRight className="w-4 h-4" />
          </button>
          <p className="text-xs text-aqua/40">Aucune inscription · Vos réponses restent sur votre appareil</p>
        </Reveal>
      </div>
    </section>
  )
}

function ClarifySection() {
  const can = [
    'Si votre structure peut être qualifiée de « pouvoir adjudicateur »',
    'Si votre dépense entre dans le champ des marchés publics',
    'Quels seuils de montant peuvent déclencher une procédure',
    'Quels points vérifier dans votre convention de subvention',
    'Quelle direction prendre avant de contacter un prestataire',
  ]
  const cannot = [
    'Rendre un avis juridique définitif sur votre situation',
    'Remplacer un·e juriste ou un service marchés publics',
    'Lancer ou rédiger une procédure à votre place',
    'Garantir une conformité légale',
  ]
  return (
    <section className="bg-cream py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <Reveal className="mb-10">
          <Eyebrow>Périmètre de l'outil</Eyebrow>
          <h2 className="mt-3 font-display text-3xl font-bold text-navy tracking-tight">Ce que le diagnostic peut faire pour vous</h2>
        </Reveal>
        <div className="grid lg:grid-cols-2 gap-5">
          <Reveal>
            <div className="h-full bg-white rounded-2xl border border-line p-7 shadow-card">
              <div className="flex items-center gap-2.5 mb-5">
                <Signpost className="w-9 h-9 shrink-0" />
                <h3 className="font-display font-bold text-navy text-lg">Ce que le tracé peut clarifier</h3>
              </div>
              <ul className="space-y-3">
                {can.map(t => (
                  <li key={t} className="flex items-start gap-3 text-sm text-navy/85">
                    <span className="mt-0.5 w-5 h-5 rounded-full bg-teal/15 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-teal" strokeWidth={3} />
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="h-full bg-navy text-white rounded-2xl p-7 shadow-card relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-coral" />
              <Eyebrow tone="coral">Limites</Eyebrow>
              <h3 className="mt-4 font-display font-bold text-lg mb-5">Ce qu'il ne remplace pas</h3>
              <ul className="space-y-3">
                {cannot.map(t => (
                  <li key={t} className="flex items-start gap-3 text-sm text-aqua/80">
                    <span className="mt-0.5 w-5 h-5 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                      <X className="w-3 h-3 text-coral" strokeWidth={3} />
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function UseCasesSection({ onStart }: { onStart: () => void }) {
  return (
    <section id="cas" className="bg-white py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <Reveal className="max-w-2xl mb-10">
          <Eyebrow>Cas fréquents</Eyebrow>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl font-bold text-navy tracking-tight text-balance">Dans quels cas la question se pose</h2>
          <p className="mt-3 text-slate">Ces achats du quotidien associatif déclenchent souvent la question. Cliquez sur le vôtre pour commencer le diagnostic.</p>
        </Reveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {USE_CASES.map((c, i) => (
            <Reveal key={c.title} delay={(i % 4) * 0.05}>
              <button onClick={onStart} className="group w-full h-full text-left bg-cream rounded-2xl border border-line p-5 hover:bg-navy hover:border-navy transition-all duration-300 shadow-card">
                <div className="w-10 h-10 rounded-xl bg-white group-hover:bg-teal flex items-center justify-center mb-4 transition-colors border border-line group-hover:border-teal">
                  <c.icon className="w-5 h-5 text-slate group-hover:text-navy transition-colors" />
                </div>
                <h3 className="font-display font-semibold text-navy group-hover:text-white text-[14px] mb-1 transition-colors flex items-center gap-1">
                  {c.title}<ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all text-teal" />
                </h3>
                <p className="text-xs text-slate group-hover:text-aqua/60 leading-relaxed transition-colors">{c.desc}</p>
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
      <div className="absolute inset-0 dotgrid-dark opacity-50" />
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center">
        <Reveal>
          <div className="inline-flex items-center gap-1.5 border border-navy/20 text-navy text-[11px] font-bold uppercase tracking-widest px-3 py-1.5 rounded mb-4">
            Pour qui
          </div>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold tracking-tight text-balance">Conçu pour celles et ceux qui font tourner le secteur</h2>
          <p className="mt-3 text-navy/65 max-w-xl mx-auto">Si vous gérez une structure qui reçoit des fonds publics ou collabore avec des organismes publics, ce diagnostic est fait pour vous.</p>
        </Reveal>
        <Reveal delay={0.08} className="mt-8 flex flex-wrap gap-2 justify-center">
          {AUDIENCES.map(a => (
            <span key={a} className="px-3.5 py-1.5 rounded-lg bg-navy text-white font-medium text-sm">{a}</span>
          ))}
        </Reveal>
        <Reveal delay={0.12} className="mt-8">
          <button onClick={onStart} className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-navy text-white font-semibold text-sm hover:brightness-110 transition-all">
            Faire le diagnostic <ArrowRight className="w-4 h-4" />
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
        <Reveal className="mb-10">
          <Eyebrow>FAQ</Eyebrow>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl font-bold text-navy tracking-tight">Les réponses, sans le jargon</h2>
        </Reveal>
        <div className="space-y-2">
          {FAQS.map((f, i) => (
            <Reveal key={i} delay={(i % 3) * 0.04}>
              <div className={`rounded-xl border overflow-hidden transition-all ${open === i ? 'bg-white border-teal/40 shadow-card' : 'bg-white border-line'}`}>
                <button onClick={() => setOpen(open === i ? null : i)} className="w-full text-left px-5 py-4 flex items-center justify-between gap-4">
                  <span className="font-display font-semibold text-navy text-[14px] leading-snug text-balance">{f.q}</span>
                  <span className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all ${open === i ? 'bg-teal text-navy rotate-180' : 'bg-aqua text-slate'}`}>
                    <ChevronDown className="w-3.5 h-3.5" />
                  </span>
                </button>
                {open === i && (
                  <div className="px-5 pb-4 border-t border-line">
                    <p className="text-slate text-sm leading-relaxed pt-3">{f.a}</p>
                  </div>
                )}
              </div>
            </Reveal>
          ))}
        </div>
        <p className="text-center text-xs text-slate/60 mt-7">Réponses fournies à titre pédagogique. Elles ne constituent pas un avis juridique.</p>
      </div>
    </section>
  )
}

const NOMAD_OFFERS = [
  { icon: Target,        title: 'Cadrer votre projet',          desc: 'Ateliers de définition, cahier des charges, stratégie digitale.' },
  { icon: ClipboardList, title: 'Préparer le devis',            desc: 'Spécifications techniques, critères, comparaison d\'offres.' },
  { icon: PenLine,       title: 'Rédiger le cahier des charges', desc: 'Document structuré pour un appel à prestataires dans les règles.' },
]

function NomadImpactSection({ onStart }: { onStart: () => void }) {
  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-2xl bg-navy text-white border border-white/5 shadow-float">
            <div className="absolute inset-0 dotgrid-light opacity-20" />
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-teal to-teal/30" />
            <Constellation className="absolute top-4 right-4 w-36 text-teal opacity-[0.12] pointer-events-none" />
            <div className="relative px-6 py-10 sm:px-10 sm:py-12">
              <div className="mb-8">
                <div className="inline-flex items-center gap-1.5 border border-teal/30 text-teal text-[11px] font-bold uppercase tracking-widest px-3 py-1.5 rounded mb-5">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal" />
                  Vous avez un projet digital à cadrer ?
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-bold leading-tight max-w-lg">
                  marchépublic.be identifie vos obligations.<br />
                  <span className="text-teal">Nomad Impact</span> vous aide à préparer la suite.
                </h2>
                <p className="mt-3 text-aqua/70 text-sm leading-relaxed max-w-md">
                  Une fois votre situation clarifiée, passer à l'action demande méthode. Nomad Impact accompagne les ASBL et organisations belges dans la définition et la mise en œuvre de leurs projets digitaux.
                </p>
              </div>
              <div className="grid sm:grid-cols-3 gap-3 mb-8">
                {NOMAD_OFFERS.map((offer, i) => (
                  <motion.div
                    key={offer.title}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, duration: 0.45 }}
                    className="bg-white/[0.06] border border-white/10 rounded-xl p-5"
                  >
                    <div className="w-9 h-9 rounded-lg bg-teal/15 flex items-center justify-center mb-3">
                      <offer.icon className="w-4 h-4 text-teal" />
                    </div>
                    <h3 className="font-display font-semibold text-sm mb-1.5 leading-snug">{offer.title}</h3>
                    <p className="text-aqua/60 text-xs leading-relaxed">{offer.desc}</p>
                  </motion.div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={onStart} className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-coral text-white font-semibold text-sm hover:brightness-105 transition-all shadow-coral active:scale-[0.98]">
                  Faire le diagnostic <ArrowRight className="w-4 h-4" />
                </button>
                <a href={NOMAD_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-white/20 text-white font-semibold text-sm hover:bg-white/8 transition-all">
                  Découvrir Nomad Impact <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function FinalCTA({ onStart }: { onStart: () => void }) {
  return (
    <section className="bg-cream pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-2xl bg-navy text-white px-6 py-14 sm:px-12 sm:py-16 text-center border border-white/5 shadow-float">
            <div className="absolute inset-0 dotgrid-light opacity-20" />
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-teal" />
            <div className="relative">
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-balance max-w-2xl mx-auto">Un projet en tête ? Clarifions d'abord vos obligations.</h2>
              <p className="mt-4 text-aqua/70 max-w-xl mx-auto text-sm leading-relaxed">Cinq minutes pour obtenir un score, un chemin recommandé et les sources officielles belges à vérifier.</p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                <button onClick={onStart} className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-lg bg-coral text-white font-semibold hover:brightness-105 transition-all shadow-coral active:scale-[0.98]">
                  Faire le diagnostic <ArrowRight className="w-4 h-4" />
                </button>
                <a href="#cas" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-lg border border-white/20 text-white font-semibold text-sm hover:bg-white/8 transition-all">Voir des exemples</a>
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
    <footer className="bg-ink text-aqua/50 border-t border-white/5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-3">
              <LogoMark className="h-6 w-auto" />
              <span className="font-display font-bold text-white text-[14px]">marchépublic<span className="text-teal">.be</span></span>
            </div>
            <p className="text-xs leading-relaxed">Outil de pré-diagnostic indépendant pour aider les ASBL belges à comprendre leurs obligations avant de choisir un prestataire.</p>
            <button onClick={onStart} className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-teal hover:text-white transition-colors">
              Faire le diagnostic <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div>
            <p className="text-white text-[10px] font-bold uppercase tracking-widest mb-4">Naviguer</p>
            <ul className="space-y-2.5 text-sm">
              {([['#pourquoi', 'Pourquoi cet outil'], ['#comment', 'Comment ça marche'], ['#cas', 'Cas fréquents'], ['#faq', 'FAQ']] as [string, string][]).map(([h, l]) => (
                <li key={l}><a href={h} className="hover:text-white transition-colors text-xs">{l}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-white text-[10px] font-bold uppercase tracking-widest mb-4">Informations</p>
            <ul className="space-y-2.5">
              {['Mentions légales', 'Confidentialité', 'Contact'].map(l => (
                <li key={l}><a href="#" className="hover:text-white transition-colors text-xs">{l}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-white text-[10px] font-bold uppercase tracking-widest mb-4">Avertissement</p>
            <p className="text-xs leading-relaxed">Ce parcours est fourni à titre informatif. Il ne constitue pas un avis juridique et ne remplace pas l'analyse d'un·e juriste ou d'un service compétent.</p>
          </div>
        </div>
        <div className="border-t border-white/8 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-[11px]">© {new Date().getFullYear()} marchépublic.be — Tous droits réservés.</p>
          <p className="text-[11px]">Un outil développé par <a href="https://nomadimpact.org" target="_blank" rel="noopener noreferrer" className="text-white font-semibold hover:text-teal transition-colors">Nomad Impact</a></p>
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
        <NomadImpactSection onStart={onStart} />
        <FinalCTA onStart={onStart} />
      </main>
      <Footer onStart={onStart} />
    </div>
  )
}
