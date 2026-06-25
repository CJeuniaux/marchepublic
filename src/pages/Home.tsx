import { useEffect, useState, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight, ArrowUpRight, Menu, X,
  Globe, Cloud, Users, PenTool, Code2, Boxes, GraduationCap, Server,
  ChevronDown, Check, Clock, ShieldCheck, Lock, BookOpen, Briefcase, Building2, ClipboardList,
} from 'lucide-react'
import { LogoMark, StepGlyph, Signpost } from '../components/Graphics'

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

function Eyebrow({ children, tone = 'sun' }: { children: ReactNode; tone?: 'sun' | 'teal' | 'cream' | 'coral' }) {
  const cls: Record<string, string> = {
    sun:   'text-navy bg-sun/30 border border-sun/60',
    teal:  'text-teal bg-teal/10 border border-teal/20',
    cream: 'text-white/70 bg-white/10 border border-white/15',
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
  { icon: Globe,        title: 'Refaire votre site web',          desc: 'Refonte, CMS, développement sur mesure.' },
  { icon: Cloud,        title: 'Acheter un SaaS',                 desc: 'CRM, gestion de membres, plateforme.' },
  { icon: Users,        title: 'Une mission de consultance',      desc: 'Audit, accompagnement, évaluation.' },
  { icon: PenTool,      title: 'Engager un graphiste',            desc: 'Identité, campagne, rapport annuel.' },
  { icon: Code2,        title: 'Un outil sur mesure',             desc: 'Application, plateforme, automatisation.' },
  { icon: Boxes,        title: 'Sous-traiter un projet subsidié', desc: 'Prestation financée par un subside.' },
  { icon: GraduationCap, title: 'Organiser une formation',       desc: 'Cycle, e-learning, certification.' },
  { icon: Server,       title: 'Louer des services techniques',   desc: 'Hébergement, maintenance, support.' },
]

const FAQS = [
  { q: 'Une ASBL peut-elle vraiment être soumise aux marchés publics ?', a: "Oui. Une ASBL peut être qualifiée de « pouvoir adjudicateur » si elle est majoritairement financée par des fonds publics, contrôlée par une autorité publique, ou si sa gouvernance est dominée par des représentants publics. Le statut associatif ne protège pas automatiquement." },
  { q: "Recevoir un subside m'oblige-t-il à faire un marché public ?", a: "Pas mécaniquement. Recevoir un subside ne suffit pas. Mais si le financement public dépasse certains seuils, ou si votre convention impose une mise en concurrence, vos obligations changent." },
  { q: 'Trois devis suffisent-ils ?', a: "Souvent c'est une bonne pratique — parfois c'est insuffisant. Selon votre statut et le montant, une procédure formalisée peut être exigée. Demander trois devis ne vous met pas automatiquement en règle." },
  { q: 'Puis-je choisir un prestataire que je connais déjà ?', a: "Si vous êtes soumis aux règles, le principe est la mise en concurrence équitable. Si vous ne l'êtes pas, vous gardez la liberté de choix. C'est précisément ce que le parcours aide à clarifier." },
  { q: 'Quelle différence entre un devis et un marché public ?', a: "Un devis est une simple demande de prix. Un marché public est une procédure encadrée par la loi : étapes obligatoires, délais, transparence, parfois publication." },
  { q: 'Cet outil remplace-t-il un juriste ?', a: "Non, et il ne le prétend pas. C'est un pré-diagnostic pédagogique et indépendant : il trace un chemin clair et renvoie aux sources officielles. Pour une situation engageante ou complexe, faites valider votre procédure par une personne compétente." },
  { q: "Quel est le seuil à partir duquel un marché public est obligatoire pour une ASBL ?", a: "Il n'existe pas de seuil unique universel. Le premier critère est votre qualité de pouvoir adjudicateur : si vous l'êtes, tous vos marchés sont en principe soumis à la loi du 17 juin 2016, quel que soit le montant. Des procédures allégées s'appliquent en dessous de certains seuils (30 000 € HTVA pour des achats courants, 143 000 € pour des fournitures et services, etc.). Si vous n'êtes pas pouvoir adjudicateur, c'est votre convention de subvention qui fixe les règles." },
  { q: "Ma convention de subvention parle de mise en concurrence. Est-ce équivalent à un marché public ?", a: "Pas nécessairement. Certaines conventions imposent une mise en concurrence simplifiée (ex. trois devis comparés) sans exiger le respect formel de la loi sur les marchés publics. D'autres renvoient explicitement à cette loi. Lisez attentivement votre convention et, si c'est flou, demandez à votre organisme subsidieur de clarifier par écrit." },
  { q: "Qu'est-ce qu'un pouvoir adjudicateur exactement ?", a: "C'est la notion clé de la loi belge. Est pouvoir adjudicateur : l'État, les Régions, les Communautés, les provinces, les communes — mais aussi les organismes de droit public qui réunissent trois conditions cumulatives : créé pour satisfaire un besoin d'intérêt général, doté de la personnalité juridique, et dont l'activité est financée ou contrôlée majoritairement par des autorités publiques." },
  { q: "Mon ASBL est subsidiée par la Région wallonne. Sommes-nous automatiquement soumis à la loi ?", a: "Recevoir un subside wallon est un indice sérieux, mais pas suffisant seul. Il faut aussi que la structure soit créée pour satisfaire un besoin d'intérêt général et que le financement ou le contrôle public soit majoritaire. Le diagnostic vous aide à évaluer ces trois conditions ensemble." },
  { q: "Quelle procédure utiliser pour un achat entre 30 000 € et 143 000 € HTVA ?", a: "Si vous êtes pouvoir adjudicateur, vous pouvez généralement recourir à une procédure négociée sans publication préalable pour des marchés de fournitures et services sous 143 000 € HTVA. Cela implique de consulter plusieurs prestataires, de comparer les offres sur des critères définis et de justifier votre choix. Le détail figure à l'article 42 de la loi du 17 juin 2016." },
  { q: "Faut-il publier sur e-Procurement pour tous les marchés publics ?", a: "Non. En dessous de certains seuils (typiquement 30 000 € pour des marchés simples), aucune publication n'est obligatoire. Au-delà, une publication sur l'Espace de Publication des Marchés Publics (e-Procurement) devient nécessaire. Au-delà des seuils européens (environ 143 000 € pour les services), une publication au Journal Officiel de l'UE s'ajoute." },
  { q: "Mon ASBL achète des services numériques (hébergement, SaaS, développement). Cela entre-t-il dans les marchés publics ?", a: "Oui, si vous êtes pouvoir adjudicateur. Les services numériques sont des marchés de services au sens de la loi. Le type de prestation (logiciel en mode SaaS, développement sur mesure, hébergement cloud) ne modifie pas l'obligation : c'est le montant et votre statut qui déterminent la procédure." },
  { q: "Peut-on fractionner un marché pour rester sous les seuils ?", a: "Non. Le fractionnement artificiel d'un marché pour contourner les seuils est explicitement interdit par la loi (article 2, §8 de la loi du 17 juin 2016). La valeur estimée d'un marché doit prendre en compte l'ensemble de la commande ou de la période de prestation." },
  { q: "Que risque-t-on si on ne respecte pas les règles sur les marchés publics ?", a: "Les risques sont multiples : récupération des subsides par l'organisme financeur, annulation du contrat, sanctions administratives, voire pénales dans les cas les plus graves. Par ailleurs, un prestataire écarté irrégulièrement peut introduire un recours et obtenir des dommages et intérêts." },
  { q: "Y a-t-il des exemptions pour les ASBL du secteur culturel ou social ?", a: "La loi prévoit certaines exemptions sectorielles (notamment pour certains marchés de services à la personne, services sociaux ou culturels sous seuils européens), mais elles sont limitées et bien précises. L'exemption ne s'applique pas automatiquement : il faut vérifier que la prestation correspond exactement aux codes CPV exemptés." },
]

type TrustItem = { Icon: typeof Clock; label: string }
const TRUST_ITEMS: TrustItem[] = [
  { Icon: Clock,       label: 'Environ 5 minutes' },
  { Icon: ShieldCheck, label: 'Sources officielles belges' },
  { Icon: Lock,        label: 'Sans inscription' },
  { Icon: Check,       label: 'Estimation indicative' },
]

function Header({ onStart }: { onStart: () => void }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8)
    fn(); window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])
  const links: [string, string][] = [['#comment', 'Comment ça marche'], ['#cas', 'Cas fréquents'], ['#faq', 'FAQ'], ['#pour-qui', 'Pour qui']]
  return (
    <header className={`sticky top-0 z-50 transition-all duration-200 ${scrolled ? 'bg-white border-b border-line shadow-[0_1px_8px_rgba(8,43,76,0.06)]' : 'bg-white/95 border-b border-line'}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2.5">
          <LogoMark className="h-6 w-auto" nodeColor="#2E2348" />
          <span className="font-display font-bold text-navy text-[15px]">marchépublic<span className="text-coral">.be</span></span>
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
          <button onClick={() => setOpen(v => !v)} className="md:hidden p-3 rounded-lg text-navy hover:bg-navy/5">
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
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-coral" />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-8 sm:pt-24 sm:pb-12">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-16 items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}>
            <div className="inline-flex items-center gap-2 border border-line text-navy/70 text-[11px] font-bold uppercase tracking-widest px-3 py-1.5 rounded mb-6 bg-sable">
              <ShieldCheck className="w-3.5 h-3.5 text-slate/70" />
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
                Voir le diagnostic
              </a>
            </div>
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 border-t border-line pt-5">
              {TRUST_ITEMS.map(({ Icon, label }) => (
                <span key={label} className="flex items-center gap-1.5 text-xs text-slate font-medium">
                  <Icon className="w-3.5 h-3.5 text-slate/70" />
                  {label}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="relative hidden lg:block"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="relative w-full aspect-[4/3] rounded-2xl bg-sable border border-line overflow-hidden">
              <img
                src="/images/hero-illustration.webp"
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover"
                onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
              />
              <div className="absolute inset-0 dotgrid opacity-40" />
            </div>
          </motion.div>
        </div>
      </div>

      <div className="bg-sable border-t border-line">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
          <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto">
            {([['5 min', 'Pour tracer votre réponse'], ['8 questions', 'Guidées, sans jargon'], ['100 %', 'Gratuit']] as [string, string][]).map(([n, l]) => (
              <div key={n} className="text-center">
                <p className="font-display font-bold text-xl sm:text-2xl text-coral">{n}</p>
                <p className="text-xs text-slate/70 mt-1 leading-snug">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function HowSection({ onStart }: { onStart: () => void }) {
  const steps = [
    {
      n: 1,
      glyph: 'structure',
      title: 'Répondez aux questions',
      desc: "Huit questions sur votre structure, votre financement, votre gouvernance et votre projet. Sans jargon.",
    },
    {
      n: 2,
      glyph: 'financement',
      title: 'Obtenez votre estimation',
      desc: "Un score indicatif 0–100 % calculé selon les critères officiels belges. Avec le détail de chaque facteur.",
    },
    {
      n: 3,
      glyph: 'projet',
      title: 'Prenez une décision éclairée',
      desc: "Un chemin recommandé, des documents utiles et les sources officielles à vérifier avant d'agir.",
    },
  ]
  return (
    <section id="comment" className="bg-sable py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <Reveal className="text-center max-w-2xl mx-auto mb-14">
          <Eyebrow>Comment ça marche</Eyebrow>
          <h2 className="mt-4 font-display text-3xl sm:text-4xl font-bold text-navy tracking-tight text-balance">Le diagnostic en 2 étapes</h2>
          <p className="mt-3 text-slate">Répondez aux questions, obtenez votre résultat. Le parcours suit une logique progressive : structure, projet, montant.</p>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.1}>
              <div className="bg-white border border-line rounded-2xl overflow-hidden h-full shadow-card flex flex-col">
                <div className="h-[3px] bg-coral" />
                <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-9 h-9 rounded-full bg-coral flex items-center justify-center text-white text-sm font-bold shrink-0">{s.n}</span>
                </div>
                <h3 className="font-display font-bold text-lg text-navy mb-2">{s.title}</h3>
                <p className="text-slate text-sm leading-relaxed flex-1">{s.desc}</p>
                <div className="mt-6 pt-5 border-t border-line flex items-center justify-center">
                  <StepGlyph name={s.glyph} className="w-14 h-14 text-navy/40" />
                </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <button onClick={onStart} className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-coral text-white font-semibold text-sm hover:brightness-105 transition-all shadow-coral active:scale-[0.98]">
            Démarrer le diagnostic <ArrowRight className="w-4 h-4" />
          </button>
          <p className="text-xs text-slate/60">Aucune inscription · Vos réponses restent sur votre appareil</p>
        </Reveal>
      </div>
    </section>
  )
}

function StructureSection() {
  const benefits = [
    {
      key: 'Équité',
      title: 'Équité',
      desc: "Toutes les structures ne sont pas logées à la même enseigne. Le diagnostic adapte ses critères à votre situation réelle.",
    },
    {
      key: 'Pertinence',
      title: 'Pertinence',
      desc: "Les questions portent sur les éléments qui comptent vraiment : financement public, gouvernance, contrôle, montant.",
    },
    {
      key: 'Sécurité',
      title: 'Sécurité',
      desc: "Chaque résultat renvoie aux sources officielles belges. Vous avancez avec méthode, pas à l'aveugle.",
    },
  ]
  return (
    <section className="bg-navy py-20 sm:py-28 relative overflow-hidden">
      <div className="absolute inset-0 dotgrid-light opacity-10" />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-12 lg:gap-16 items-center">
          <Reveal>
            <Eyebrow tone="cream">Méthode</Eyebrow>
            <h2 className="mt-4 font-display text-3xl sm:text-4xl font-bold text-white tracking-tight text-balance leading-tight">
              Un diagnostic structuré en trois temps
            </h2>
            <p className="mt-4 text-aqua/70 leading-relaxed">
              Le parcours suit la logique des critères légaux belges. Chaque question éclaire un angle. L'ensemble forme une estimation argumentée, pas un verdict arbitraire.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-coral" />
              <span className="text-sm text-aqua/60">Basé sur la loi du 17 juin 2016 et ses arrêtés d'exécution</span>
            </div>
          </Reveal>
          <div className="grid gap-4">
            {benefits.map((b, i) => (
              <Reveal key={b.key} delay={i * 0.1}>
                <div className="bg-white/[0.06] border border-white/12 rounded-xl p-5 flex items-start gap-4">
                  <span className="w-8 h-8 rounded-full bg-coral flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5">{i + 1}</span>
                  <div>
                    <h3 className="font-display font-bold text-white mb-1">{b.title}</h3>
                    <p className="text-aqua/65 text-sm leading-relaxed">{b.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
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
                <h3 className="font-display font-bold text-navy text-lg">Il vous aide à vous orienter</h3>
              </div>
              <ul className="space-y-3">
                {can.map(t => (
                  <li key={t} className="flex items-start gap-3 text-sm text-navy/85">
                    <span className="mt-0.5 w-5 h-5 rounded-full bg-navy/8 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-navy" strokeWidth={3} />
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="h-full bg-white rounded-2xl border border-line p-7 shadow-card">
              <div className="flex items-center gap-2.5 mb-5">
                <span className="w-9 h-9 rounded-full bg-coral/10 border border-coral/20 flex items-center justify-center shrink-0">
                  <X className="w-4 h-4 text-coral" />
                </span>
                <h3 className="font-display font-bold text-navy text-lg">Il ne remplace pas</h3>
              </div>
              <ul className="space-y-3">
                {cannot.map(t => (
                  <li key={t} className="flex items-start gap-3 text-sm text-navy/80">
                    <span className="mt-0.5 w-5 h-5 rounded-full bg-coral/10 flex items-center justify-center shrink-0">
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
          <p className="mt-3 text-slate">Ces achats du quotidien associatif déclenchent souvent la question.</p>
        </Reveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {USE_CASES.map((c, i) => (
            <Reveal key={c.title} delay={(i % 4) * 0.05}>
              <button onClick={onStart} className="group w-full h-full text-left bg-white rounded-2xl border border-line p-5 hover:border-coral/40 hover:shadow-card transition-all duration-200 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-sable group-hover:bg-coral/10 flex items-center justify-center mb-4 transition-colors border border-line group-hover:border-coral/20">
                  <c.icon className="w-5 h-5 text-slate group-hover:text-coral transition-colors" />
                </div>
                <h3 className="font-display font-semibold text-navy text-[14px] mb-1 flex items-center gap-1">
                  {c.title}<ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all text-coral" />
                </h3>
                <p className="text-xs text-slate leading-relaxed">{c.desc}</p>
              </button>
            </Reveal>
          ))}
        </div>
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
          <h2 className="mt-3 font-display text-3xl sm:text-4xl font-bold text-navy tracking-tight">Les réponses, dans le jargon</h2>
        </Reveal>
        <div className="space-y-2">
          {FAQS.map((f, i) => (
            <Reveal key={i} delay={(i % 3) * 0.04}>
              <div className={`rounded-xl border overflow-hidden transition-colors duration-150 ${open === i ? 'bg-white border-coral/30 shadow-card' : 'bg-white border-line'}`}>
                <button onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i} className="w-full text-left px-5 py-4 flex items-center justify-between gap-4">
                  <span className="font-display font-semibold text-navy text-[14px] leading-snug text-balance">{f.q}</span>
                  <motion.span
                    animate={{ rotate: open === i ? 180 : 0 }}
                    transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                    className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-colors ${open === i ? 'bg-navy text-white' : 'bg-sable text-slate'}`}
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {open === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-4 border-t border-line">
                        <p className="text-slate text-sm leading-relaxed pt-3">{f.a}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="text-center text-xs text-slate/60 mt-7">Réponses fournies à titre pédagogique. Elles ne constituent pas un avis juridique.</p>
      </div>
    </section>
  )
}

const AUDIENCE_PROFILES = [
  {
    key: 'asbl',
    Icon: Users,
    label: 'ASBL et collectifs',
    desc: "Associations subventionnées, fédérations sectorielles, structures culturelles, sportives ou éducatives qui reçoivent des fonds publics.",
    tags: ['ASBL', 'Fédérations', 'Associations culturelles', 'Clubs sportifs'],
  },
  {
    key: 'sociale',
    Icon: Building2,
    label: 'Entreprises sociales',
    desc: "Coopératives, entreprises à finalité sociale, structures d'insertion et organismes d'économie sociale partiellement financés.",
    tags: ['Coopératives', 'Entreprises ESS', 'Structures d\'insertion'],
  },
  {
    key: 'pro',
    Icon: Briefcase,
    label: 'Professionnels de l\'ess',
    desc: "Coordinateurs de projets, directeurs financiers et gestionnaires de subventions qui cherchent une réponse claire avant d'agir.",
    tags: ['Coordinateurs', 'Gestionnaires', 'Porteurs de projets'],
  },
]

function AudienceSection({ onStart }: { onStart: () => void }) {
  return (
    <section id="pour-qui" className="bg-sable py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <Reveal className="max-w-2xl mb-12">
          <Eyebrow>Pour qui</Eyebrow>
          <h2 className="mt-4 font-display text-3xl sm:text-4xl font-bold text-navy tracking-tight text-balance">Conçu pour celles et ceux qui font tourner le secteur</h2>
          <p className="mt-3 text-slate">Si vous gérez une structure qui reçoit des fonds publics ou collabore avec des organismes publics, ce diagnostic est fait pour vous.</p>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-5">
          {AUDIENCE_PROFILES.map((a, i) => (
            <Reveal key={a.key} delay={i * 0.1}>
              <div className="h-full bg-white rounded-2xl border border-line p-6 shadow-card flex flex-col">
                <div className="w-12 h-12 rounded-xl bg-sable border border-line flex items-center justify-center mb-5">
                  <a.Icon className="w-6 h-6 text-navy/60" />
                </div>
                <h3 className="font-display font-bold text-navy text-lg mb-2">{a.label}</h3>
                <p className="text-slate text-sm leading-relaxed flex-1">{a.desc}</p>
                <div className="mt-5 pt-4 border-t border-line flex flex-wrap gap-1.5">
                  {a.tags.map(t => (
                    <span key={t} className="px-2.5 py-1 rounded bg-sable border border-line text-navy/70 text-[11px] font-medium">{t}</span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.15} className="mt-10 text-center">
          <button onClick={onStart} className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg bg-coral text-white font-semibold hover:brightness-105 transition-all shadow-coral active:scale-[0.98]">
            Faire le diagnostic <ArrowRight className="w-4 h-4" />
          </button>
        </Reveal>
      </div>
    </section>
  )
}

function BottomCTA({ onStart }: { onStart: () => void }) {
  const offers = [
    { Icon: BookOpen,       title: 'Cadrer votre projet',   desc: 'Ateliers de définition, cahier des charges, stratégie digitale.' },
    { Icon: ClipboardList, title: 'Préparer le dossier',   desc: 'Spécifications techniques, critères, comparaison d\'offres.' },
    { Icon: Briefcase,     title: 'Rédiger les documents', desc: 'Document structuré pour un appel à prestataires dans les règles.' },
  ]
  return (
    <section className="bg-navy py-20 sm:py-28 relative overflow-hidden">
      <div className="absolute inset-0 dotgrid-light opacity-10" />
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6">
        <Reveal>
          <div className="text-center mb-12">
            <Eyebrow tone="cream">Un projet en tête ?</Eyebrow>
            <h2 className="mt-5 font-display text-3xl sm:text-4xl font-bold text-white tracking-tight text-balance max-w-2xl mx-auto">
              Clarifications d'abord vos obligations.
            </h2>
            <p className="mt-4 text-aqua/65 max-w-xl mx-auto text-sm leading-relaxed">
              Cinq minutes pour obtenir un score, un chemin recommandé et les sources officielles belges à vérifier.
            </p>
          </div>
        </Reveal>
        <div className="grid sm:grid-cols-3 gap-4 mb-10">
          {offers.map((o, i) => (
            <Reveal key={o.title} delay={i * 0.08}>
              <div className="bg-white/[0.06] border border-white/12 rounded-xl p-5">
                <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center mb-3">
                  <o.Icon className="w-4 h-4 text-white/70" />
                </div>
                <h3 className="font-display font-semibold text-white text-sm mb-1.5">{o.title}</h3>
                <p className="text-aqua/55 text-xs leading-relaxed">{o.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={onStart} className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-lg bg-coral text-white font-semibold hover:brightness-105 transition-all shadow-coral active:scale-[0.98]">
            Faire le diagnostic <ArrowRight className="w-4 h-4" />
          </button>
          <a href={NOMAD_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-lg border border-white/20 text-white font-semibold text-sm hover:bg-white/8 transition-all">
            Découvrir Nomad Impact <ArrowUpRight className="w-4 h-4" />
          </a>
        </Reveal>
      </div>
    </section>
  )
}

function Footer({ onStart, onLegal }: { onStart: () => void; onLegal: (page: 'mentions-legales' | 'confidentialite') => void }) {
  return (
    <footer className="bg-ink text-aqua/50 border-t border-white/5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-3">
              <LogoMark className="h-6 w-auto" />
              <span className="font-display font-bold text-white text-[14px]">marchépublic<span className="text-coral">.be</span></span>
            </div>
            <p className="text-xs leading-relaxed">Outil de pré-diagnostic indépendant pour aider les ASBL belges à comprendre leurs obligations avant de choisir un prestataire.</p>
            <button onClick={onStart} className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-coral hover:text-white transition-colors">
              Faire le diagnostic <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div>
            <p className="text-white text-[10px] font-bold uppercase tracking-widest mb-4">Naviguer</p>
            <ul className="space-y-2.5 text-sm">
              {([['#comment', 'Comment ça marche'], ['#cas', 'Cas fréquents'], ['#faq', 'FAQ'], ['#pour-qui', 'Pour qui']] as [string, string][]).map(([h, l]) => (
                <li key={l}><a href={h} className="hover:text-white transition-colors text-xs">{l}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-white text-[10px] font-bold uppercase tracking-widest mb-4">Informations</p>
            <ul className="space-y-2.5">
              <li><button onClick={() => onLegal('mentions-legales')} className="hover:text-white transition-colors text-xs text-left">Mentions légales</button></li>
              <li><button onClick={() => onLegal('confidentialite')} className="hover:text-white transition-colors text-xs text-left">Confidentialité</button></li>
              <li><a href="mailto:hello@nomadimpact.org" className="hover:text-white transition-colors text-xs">Contact</a></li>
            </ul>
          </div>
          <div>
            <p className="text-white text-[10px] font-bold uppercase tracking-widest mb-4">Avertissement</p>
            <p className="text-xs leading-relaxed">Ce parcours est fourni à titre informatif. Il ne constitue pas un avis juridique et ne remplace pas l'analyse d'un·e juriste ou d'un service compétent.</p>
          </div>
        </div>
        <div className="border-t border-white/8 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-[11px]">© {new Date().getFullYear()} marchépublic.be — Tous droits réservés.</p>
          <p className="text-[11px]">Un outil développé par <a href="https://nomadimpact.org" target="_blank" rel="noopener noreferrer" className="text-white font-semibold hover:text-coral transition-colors">Nomad Impact</a></p>
        </div>
      </div>
    </footer>
  )
}

export function Home({ onStart, onLegal }: { onStart: () => void; onLegal: (page: 'mentions-legales' | 'confidentialite') => void }) {
  return (
    <div className="min-h-screen bg-cream">
      <Header onStart={onStart} />
      <main>
        <Hero onStart={onStart} />
        <HowSection onStart={onStart} />
        <StructureSection />
        <ClarifySection />
        <UseCasesSection onStart={onStart} />
        <FAQSection />
        <AudienceSection onStart={onStart} />
        <BottomCTA onStart={onStart} />
      </main>
      <Footer onStart={onStart} onLegal={onLegal} />
    </div>
  )
}
