import { useState, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft, ChevronRight, RotateCcw, Copy, Printer, Check,
  HelpCircle, ChevronDown, ChevronUp, ShieldCheck, Compass,
  CircleCheck, TriangleAlert, OctagonAlert, ArrowRight, ListChecks, BookOpen,
} from 'lucide-react'

interface DiagState {
  step: number
  structureType: string | null
  financementPct: string | null
  controlCA: string | null
  controlGestion: string | null
  prestationType: string | null
  montant: string | null
  subsidieSpecifique: string | null
  reglesSubsidiant: string | null
}

type RiskLevel = 'faible' | 'attention' | 'eleve'

const INITIAL_STATE: DiagState = {
  step: 1,
  structureType: null,
  financementPct: null,
  controlCA: null,
  controlGestion: null,
  prestationType: null,
  montant: null,
  subsidieSpecifique: null,
  reglesSubsidiant: null,
}

// Logique de scoring inchangée — elle fonctionne, on ne la casse pas.
function computeRisk(s: DiagState): RiskLevel {
  if (s.structureType === 'organisme_public') return 'eleve'
  if (s.reglesSubsidiant === 'oui') return 'eleve'

  let paScore = 0
  if (s.financementPct === 'plus_50') paScore += 4
  else if (s.financementPct === 'nsp') paScore += 2
  else if (s.financementPct === 'entre_10_50') paScore += 1

  if (s.controlCA === 'oui') paScore += 4
  else if (s.controlCA === 'nsp') paScore += 1

  if (s.controlGestion === 'oui') paScore += 3
  else if (s.controlGestion === 'nsp') paScore += 1

  if (s.subsidieSpecifique === 'oui') paScore += 2
  else if (s.subsidieSpecifique === 'nsp') paScore += 1

  if (s.reglesSubsidiant === 'nsp') paScore += 2

  const amtMap: Record<string, number> = { moins_3k: 0, '3k_30k': 1, '30k_seuil': 2, sup_seuil: 3, nsp: 2 }
  const amt = amtMap[s.montant ?? ''] ?? 0

  if (paScore >= 5 && amt >= 2) return 'eleve'
  if (paScore >= 4 && amt >= 1) return 'eleve'
  if (paScore >= 3 || amt >= 2) return 'attention'
  return 'faible'
}

interface ResultConfig {
  badge: string
  Icon: typeof CircleCheck
  color: string
  tint: string
  ring: string
  segIndex: number
  title: string
  summary: string
  warning: string
  points: string[]
  steps: string[]
  resources: { label: string; url: string }[]
}

const RESULTS: Record<RiskLevel, ResultConfig> = {
  faible: {
    badge: 'Risque faible', Icon: CircleCheck, color: '#138A6E', tint: '#E6F6F0', ring: '#9DDcC7', segIndex: 0,
    title: "Peu d'indices d'assujettissement",
    summary: "Sur la base de vos réponses, votre organisation présente peu d'indices suggérant qu'elle serait soumise aux règles des marchés publics pour cette dépense.",
    warning: "Ce résultat n'est pas une certitude juridique. Des éléments non couverts ici pourraient modifier la situation.",
    points: ['Votre structure ne semble pas être un organisme public au sens de la loi', 'La part de financement public paraît limitée', 'Le montant envisagé reste en dessous des seuils critiques', "Aucun indice fort de contrôle public n'a été détecté"],
    steps: ['Conservez ce résultat comme trace dans votre dossier de décision', 'Vérifiez les clauses spécifiques de vos conventions de subvention', 'Consultez votre pouvoir subsidiant en cas de doute ponctuel', 'Réévaluez si votre situation financière évolue'],
    resources: [
      { label: 'Loi belge du 17 juin 2016 sur les marchés publics', url: 'https://www.ejustice.just.fgov.be/cgi_loi/change_lg.pl?language=fr&la=F&cn=2016061701&table_name=loi' },
      { label: 'Portail marchés publics — Wallonie', url: 'https://marchespublics.wallonie.be' },
    ],
  },
  attention: {
    badge: "Zone d'attention", Icon: TriangleAlert, color: '#C97A18', tint: '#FDF3E1', ring: '#F4D69A', segIndex: 1,
    title: 'Plusieurs indices à vérifier',
    summary: "Votre situation présente des éléments qui méritent une vérification. L'assujettissement n'est pas exclu et dépend de facteurs que ce diagnostic ne peut pas trancher seul.",
    warning: "Une vérification est recommandée avant d'engager la dépense. Ne pas faire de marché public alors que vous y êtes tenu·e expose votre organisation à des risques sérieux.",
    points: ["Un ou plusieurs indices d'assujettissement ont été détectés", 'Le financement public ou le montant crée une zone grise', 'Des éléments de gouvernance méritent d\'être vérifiés', 'Le type de prestation peut déclencher des obligations'],
    steps: ['Contactez votre pouvoir subsidiant pour clarifier vos obligations', 'Relisez en détail les clauses de votre convention de subvention', 'Envisagez l\'avis d\'un·e juriste spécialisé·e', 'En cas de doute persistant, appliquez les règles par précaution', 'Documentez votre analyse et votre décision'],
    resources: [
      { label: 'Loi belge du 17 juin 2016 sur les marchés publics', url: 'https://www.ejustice.just.fgov.be/cgi_loi/change_lg.pl?language=fr&la=F&cn=2016061701&table_name=loi' },
      { label: 'Portail marchés publics — Wallonie', url: 'https://marchespublics.wallonie.be' },
      { label: 'e-Procurement — Marchés publics fédéraux', url: 'https://www.publicprocurement.be' },
    ],
  },
  eleve: {
    badge: 'Risque élevé', Icon: OctagonAlert, color: '#D6473C', tint: '#FCE9E7', ring: '#F4B3AC', segIndex: 2,
    title: "Indices forts d'assujettissement",
    summary: "Les informations fournies indiquent un risque élevé que votre organisation soit soumise aux règles des marchés publics pour cette dépense.",
    warning: "Procéder sans respecter ces règles peut exposer votre organisation à des sanctions, à la remise en cause de vos subventions, voire à des poursuites. Consultez un·e juriste avant d'aller plus loin.",
    points: ["Votre structure ou financement présente des traits d'un pouvoir adjudicateur", 'Le montant atteint ou dépasse des seuils légaux significatifs', 'Des indices de contrôle public ont été identifiés', 'Votre pouvoir subsidiant impose peut-être explicitement ces règles'],
    steps: ['Consultez impérativement un·e juriste spécialisé·e en marchés publics', 'Contactez votre pouvoir subsidiant pour confirmer vos obligations', "Ne signez aucun contrat avant d'avoir clarifié votre situation", 'Si assujetti·e, lancez la procédure adaptée à votre montant', 'Documentez toutes vos démarches'],
    resources: [
      { label: 'Loi belge du 17 juin 2016 sur les marchés publics', url: 'https://www.ejustice.just.fgov.be/cgi_loi/change_lg.pl?language=fr&la=F&cn=2016061701&table_name=loi' },
      { label: 'Portail marchés publics — Wallonie', url: 'https://marchespublics.wallonie.be' },
      { label: 'e-Procurement — Marchés publics fédéraux', url: 'https://www.publicprocurement.be' },
      { label: 'Seuils européens en vigueur', url: 'https://www.publicprocurement.be' },
    ],
  },
}

function OptionCard({ value, label, description, selected, onSelect }: {
  value: string; label: string; description?: string; selected: boolean; onSelect: (v: string) => void
}) {
  return (
    <button
      onClick={() => onSelect(value)}
      className={[
        'w-full text-left px-4 py-3.5 rounded-2xl border-2 transition-all duration-150',
        selected ? 'bg-aqua border-teal shadow-teal' : 'bg-white border-navy/10 hover:border-teal/50 hover:bg-aqua/30',
      ].join(' ')}
    >
      <div className="flex items-start gap-3">
        <span className={['mt-0.5 w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors', selected ? 'border-teal bg-teal' : 'border-navy/25'].join(' ')}>
          {selected && <Check className="w-3 h-3 text-navy" strokeWidth={3.5} />}
        </span>
        <span>
          <span className={['block text-sm font-semibold', selected ? 'text-navy' : 'text-navy/90'].join(' ')}>{label}</span>
          {description && <span className="block text-xs text-slate mt-0.5">{description}</span>}
        </span>
      </div>
    </button>
  )
}

function WhyThis({ text }: { text: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="mt-4">
      <button onClick={() => setOpen(!open)} className="flex items-center gap-1.5 text-xs font-semibold text-ink hover:text-navy transition-colors">
        <HelpCircle size={14} /> Pourquoi cette question ? {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
            <p className="mt-2 px-4 py-3 bg-aqua rounded-xl text-xs text-ink/90 leading-relaxed">{text}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function StepShell({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <div>
      <h2 className="font-display text-xl sm:text-2xl font-bold text-navy mb-1.5 tracking-tight">{title}</h2>
      <p className="text-sm text-slate mb-6">{subtitle}</p>
      {children}
    </div>
  )
}

function RiskMeter({ active }: { active: number }) {
  const segs = [
    { label: 'Faible', color: '#138A6E' },
    { label: 'Attention', color: '#C97A18' },
    { label: 'Élevé', color: '#D6473C' },
  ]
  return (
    <div className="flex gap-2">
      {segs.map((s, i) => (
        <div key={s.label} className="flex-1">
          <div className="h-2.5 rounded-full transition-all" style={{ background: i === active ? s.color : '#E4E7EC' }} />
          <p className="mt-1.5 text-[11px] font-semibold text-center" style={{ color: i === active ? s.color : '#98A2B3' }}>{s.label}</p>
        </div>
      ))}
    </div>
  )
}

function ResultScreen({ state, onRestart }: { state: DiagState; onRestart: () => void }) {
  const risk = computeRisk(state)
  const r = RESULTS[risk]
  const [copied, setCopied] = useState(false)

  const summaryText = [
    'Résultat du pré-diagnostic — marchepublic.be',
    '',
    'Niveau de risque : ' + r.badge,
    r.title,
    '',
    r.summary,
    '',
    'Points clés :',
    ...r.points.map(p => '• ' + p),
    '',
    'Prochaines étapes :',
    ...r.steps.map((s, i) => (i + 1) + '. ' + s),
    '',
    'Avertissement : ' + r.warning,
    '',
    "Ce diagnostic est fourni à titre informatif. Il ne constitue pas un avis juridique et ne remplace pas l'analyse d'un·e juriste, d'un pouvoir subsidiant ou d'un service compétent.",
  ].join('\n')

  const handleCopy = () => {
    navigator.clipboard.writeText(summaryText).then(() => { setCopied(true); window.setTimeout(() => setCopied(false), 2000) })
  }

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-2xl mx-auto px-4 py-8 space-y-5">
      {/* En-tête résultat */}
      <div className="rounded-3xl overflow-hidden shadow-card border" style={{ borderColor: r.ring }}>
        <div className="px-6 py-7" style={{ background: r.tint }}>
          <div className="flex items-center gap-3 mb-4">
            <span className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: r.color }}>
              <r.Icon className="w-6 h-6 text-white" />
            </span>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: r.color }}>Niveau de risque</p>
              <h2 className="font-display text-2xl font-bold" style={{ color: r.color }}>{r.badge}</h2>
            </div>
          </div>
          <RiskMeter active={r.segIndex} />
        </div>
        <div className="bg-white px-6 py-5">
          <h3 className="font-display font-bold text-navy text-lg mb-1.5">{r.title}</h3>
          <p className="text-sm text-slate leading-relaxed">{r.summary}</p>
        </div>
      </div>

      {/* Avertissement */}
      <div className="rounded-2xl px-5 py-4 flex items-start gap-3" style={{ background: r.tint, border: `1px solid ${r.ring}` }}>
        <TriangleAlert className="w-5 h-5 shrink-0 mt-0.5" style={{ color: r.color }} />
        <p className="text-sm font-medium" style={{ color: r.color }}>{r.warning}</p>
      </div>

      {/* Points clés */}
      <div className="bg-white rounded-2xl shadow-card border border-navy/[0.07] px-6 py-5">
        <h3 className="flex items-center gap-2 text-xs font-bold text-slate uppercase tracking-widest mb-4"><Compass className="w-4 h-4" /> Points clés identifiés</h3>
        <ul className="space-y-2.5">
          {r.points.map((p, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-navy/90"><span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: r.color }} />{p}</li>
          ))}
        </ul>
      </div>

      {/* Prochaines étapes */}
      <div className="bg-white rounded-2xl shadow-card border border-navy/[0.07] px-6 py-5">
        <h3 className="flex items-center gap-2 text-xs font-bold text-slate uppercase tracking-widest mb-4"><ListChecks className="w-4 h-4" /> Prochaines étapes</h3>
        <ol className="space-y-3">
          {r.steps.map((step, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-navy/90">
              <span className="shrink-0 w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold text-white" style={{ background: r.color }}>{i + 1}</span>{step}
            </li>
          ))}
        </ol>
      </div>

      {/* Ressources */}
      <div className="bg-white rounded-2xl shadow-card border border-navy/[0.07] px-6 py-5">
        <h3 className="flex items-center gap-2 text-xs font-bold text-slate uppercase tracking-widest mb-4"><BookOpen className="w-4 h-4" /> Pour aller plus loin</h3>
        <ul className="space-y-2">
          {r.resources.map((res, i) => (
            <li key={i}><a href={res.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-ink hover:text-navy hover:underline"><ArrowRight className="w-3.5 h-3.5" /> {res.label}</a></li>
          ))}
        </ul>
      </div>

      {/* Préparer la suite */}
      <div className="rounded-2xl bg-navy text-white px-6 py-6 relative overflow-hidden">
        <div className="absolute inset-0 dotgrid-light opacity-30" />
        <div className="relative">
          <h3 className="font-display font-bold text-lg mb-1">Préparer la suite</h3>
          <p className="text-sm text-aqua/80 mb-4">Gardez une trace de ce résultat pour votre dossier ou pour en discuter avec votre pouvoir subsidiant ou un·e juriste.</p>
          <div className="flex flex-wrap gap-2.5 print:hidden">
            <button onClick={handleCopy} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-sm font-semibold hover:bg-white/15 transition-colors">
              {copied ? <><Check className="w-4 h-4 text-teal" /> Copié</> : <><Copy className="w-4 h-4" /> Copier le résumé</>}
            </button>
            <button onClick={() => window.print()} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-sm font-semibold hover:bg-white/15 transition-colors">
              <Printer className="w-4 h-4" /> Imprimer / PDF
            </button>
            <button onClick={onRestart} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-coral text-white text-sm font-semibold hover:brightness-105 transition-all">
              <RotateCcw className="w-4 h-4" /> Recommencer
            </button>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="rounded-2xl bg-white/60 border border-navy/[0.07] px-5 py-4 flex items-start gap-2.5">
        <ShieldCheck className="w-4 h-4 text-slate shrink-0 mt-0.5" />
        <p className="text-xs text-slate leading-relaxed">Ce diagnostic est fourni à titre informatif. Il ne constitue pas un avis juridique et ne remplace pas l'analyse d'un·e juriste, d'un pouvoir subsidiant ou d'un service compétent. Les résultats dépendent exclusivement des informations que vous avez saisies.</p>
      </div>
    </motion.div>
  )
}

const TOTAL_STEPS = 5
const STEP_LABELS = ['Structure', 'Financement', 'Gouvernance', 'Projet', 'Montant']

export function Diagnostic({ onBack }: { onBack: () => void }) {
  const [state, setState] = useState<DiagState>(INITIAL_STATE)
  const [showResult, setShowResult] = useState(false)
  const [dir, setDir] = useState(1)

  const set = (key: keyof DiagState, value: string | number | null) => setState(prev => ({ ...prev, [key]: value }))

  const canProceed = () => {
    if (state.step === 1) return !!state.structureType
    if (state.step === 2) return !!state.financementPct
    if (state.step === 3) return !!state.controlCA && !!state.controlGestion
    if (state.step === 4) return !!state.prestationType
    if (state.step === 5) return !!state.montant && !!state.subsidieSpecifique && !!state.reglesSubsidiant
    return false
  }

  const advance = () => { setDir(1); if (state.step < TOTAL_STEPS) set('step', state.step + 1); else setShowResult(true) }
  const goBack = () => { setDir(-1); if (state.step > 1) set('step', state.step - 1); else onBack() }

  if (showResult) {
    return (
      <div className="min-h-screen bg-cream">
        <div className="bg-white border-b border-navy/10 px-4 py-3 flex items-center gap-3 print:hidden sticky top-0 z-10">
          <button onClick={() => setShowResult(false)} className="text-slate hover:text-navy transition-colors"><ChevronLeft size={20} /></button>
          <span className="text-sm font-semibold text-navy">Votre résultat</span>
        </div>
        <ResultScreen state={state} onRestart={() => { setState(INITIAL_STATE); setShowResult(false) }} />
      </div>
    )
  }

  const isTravaux = state.prestationType === 'travaux'
  const montantOptions = isTravaux
    ? [
        { value: 'moins_3k', label: 'Moins de 3 000 €', description: 'Petits travaux ponctuels' },
        { value: '3k_30k', label: 'Entre 3 000 € et 30 000 €', description: 'Rénovation limitée' },
        { value: '30k_seuil', label: 'Entre 30 000 € et 5 382 000 €', description: 'Travaux significatifs' },
        { value: 'sup_seuil', label: 'Plus de 5 382 000 €', description: 'Grands projets de construction' },
        { value: 'nsp', label: 'Je ne sais pas encore', description: 'Budget non défini' },
      ]
    : [
        { value: 'moins_3k', label: 'Moins de 3 000 €', description: 'Petite dépense ponctuelle' },
        { value: '3k_30k', label: 'Entre 3 000 € et 30 000 €', description: 'Prestation modérée' },
        { value: '30k_seuil', label: 'Entre 30 000 € et 221 000 €', description: 'Contrat important' },
        { value: 'sup_seuil', label: 'Plus de 221 000 €', description: 'Au-dessus du seuil européen' },
        { value: 'nsp', label: 'Je ne sais pas encore', description: 'Budget non défini' },
      ]

  const variants = {
    enter: (d: number) => ({ opacity: 0, x: d > 0 ? 40 : -40 }),
    center: { opacity: 1, x: 0 },
    exit: (d: number) => ({ opacity: 0, x: d > 0 ? -40 : 40 }),
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Header + progression */}
      <div className="bg-navy text-white print:hidden">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <button onClick={goBack} className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/15 flex items-center justify-center transition-colors"><ChevronLeft size={18} /></button>
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-teal" />
              <span className="font-display font-semibold text-sm">Pré-diagnostic</span>
            </div>
            <span className="ml-auto text-xs text-aqua/70 font-medium">{state.step} / {TOTAL_STEPS}</span>
          </div>
          {/* checkpoints */}
          <div className="flex items-center gap-1.5">
            {STEP_LABELS.map((label, i) => {
              const n = i + 1
              const done = n < state.step
              const current = n === state.step
              return (
                <div key={label} className="flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className={['w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 transition-colors', done ? 'bg-teal text-navy' : current ? 'bg-coral text-white' : 'bg-white/15 text-white/60'].join(' ')}>
                      {done ? <Check className="w-3 h-3" strokeWidth={3} /> : n}
                    </span>
                    <div className={['h-1 flex-1 rounded-full transition-colors', n < state.step ? 'bg-teal' : 'bg-white/15'].join(' ')} />
                  </div>
                  <span className={['mt-1 text-[10px] font-medium hidden sm:block', current ? 'text-white' : 'text-white/45'].join(' ')}>{label}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Contenu */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-3xl shadow-card border border-navy/[0.07] p-6 sm:p-8 overflow-hidden">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div key={state.step} custom={dir} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}>

              {state.step === 1 && (
                <StepShell title="Quel type de structure êtes-vous ?" subtitle="Sélectionnez la forme juridique la plus proche de votre organisation.">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {[
                      { value: 'asbl', label: 'ASBL', description: 'Association sans but lucratif' },
                      { value: 'fondation', label: 'Fondation', description: "Privée ou d'utilité publique" },
                      { value: 'ong', label: 'ONG', description: 'Organisation non gouvernementale' },
                      { value: 'federation', label: 'Fédération', description: "Fédération d'associations" },
                      { value: 'cooperative', label: 'Coopérative', description: 'SC, SCRL...' },
                      { value: 'pme', label: 'PME / Entreprise', description: 'SRL, SA, SNC...' },
                      { value: 'organisme_public', label: 'Organisme public', description: 'Commune, CPAS, intercommunale...' },
                      { value: 'autre', label: 'Autre', description: 'Autre forme juridique' },
                    ].map(opt => <OptionCard key={opt.value} {...opt} selected={state.structureType === opt.value} onSelect={v => set('structureType', v)} />)}
                  </div>
                  <WhyThis text="La loi belge sur les marchés publics s'applique aux 'pouvoirs adjudicateurs'. Votre forme juridique est un premier indice pour situer votre organisation." />
                </StepShell>
              )}

              {state.step === 2 && (
                <StepShell title="Quelle part de votre budget vient de fonds publics ?" subtitle="Incluez toutes les sources publiques : subsides, conventions, fonds européens...">
                  <div className="space-y-2.5">
                    {[
                      { value: 'plus_50', label: 'Plus de 50 %', description: 'La majorité de votre budget est publique' },
                      { value: 'entre_10_50', label: 'Entre 10 % et 50 %', description: 'Part significative mais minoritaire' },
                      { value: 'moins_10', label: 'Moins de 10 %', description: 'Financement public marginal ou nul' },
                      { value: 'nsp', label: 'Je ne sais pas', description: 'Part difficile à estimer' },
                    ].map(opt => <OptionCard key={opt.value} {...opt} selected={state.financementPct === opt.value} onSelect={v => set('financementPct', v)} />)}
                  </div>
                  <WhyThis text="Un financement public majoritaire est l'un des critères légaux pouvant qualifier une organisation de 'pouvoir adjudicateur' (art. 2, 2° de la loi du 17 juin 2016)." />
                </StepShell>
              )}

              {state.step === 3 && (
                <div className="space-y-7">
                  <StepShell title="Gouvernance et contrôle public" subtitle="Ces deux questions portent sur l'influence d'autorités publiques dans votre organisation.">
                    <h3 className="text-sm font-semibold text-navy mb-2.5">Un organe public contrôle-t-il plus de la moitié de votre conseil d'administration ?</h3>
                    <div className="space-y-2.5">
                      {[
                        { value: 'oui', label: 'Oui', description: 'Une autorité publique nomme/contrôle la majorité du CA' },
                        { value: 'non', label: 'Non', description: 'Le CA est indépendant des pouvoirs publics' },
                        { value: 'nsp', label: 'Je ne sais pas', description: 'Difficile à évaluer' },
                      ].map(opt => <OptionCard key={opt.value} {...opt} selected={state.controlCA === opt.value} onSelect={v => set('controlCA', v)} />)}
                    </div>
                  </StepShell>
                  <div>
                    <h3 className="text-sm font-semibold text-navy mb-2.5">Votre gestion est-elle soumise au contrôle d'une autorité publique ?</h3>
                    <div className="space-y-2.5">
                      {[
                        { value: 'oui', label: 'Oui', description: 'Tutelle administrative, audit public obligatoire...' },
                        { value: 'non', label: 'Non', description: 'Gestion autonome et indépendante' },
                        { value: 'nsp', label: 'Je ne sais pas', description: 'Difficile à déterminer' },
                      ].map(opt => <OptionCard key={opt.value} {...opt} selected={state.controlGestion === opt.value} onSelect={v => set('controlGestion', v)} />)}
                    </div>
                    <WhyThis text="Le contrôle de la gouvernance ou de la gestion par les pouvoirs publics est un critère clé pour qualifier un 'organisme de droit public' soumis aux marchés publics." />
                  </div>
                </div>
              )}

              {state.step === 4 && (
                <StepShell title="Quel type de prestation souhaitez-vous commander ?" subtitle="Choisissez la catégorie la plus proche de votre projet.">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {[
                      { value: 'digital', label: 'Digital & Tech', description: 'Web, logiciel, application...' },
                      { value: 'consultance', label: 'Consultance', description: 'Conseil, étude, expertise...' },
                      { value: 'communication', label: 'Communication', description: 'Design, print, vidéo, événement...' },
                      { value: 'formation', label: 'Formation', description: 'Formation, coaching, facilitation...' },
                      { value: 'travaux', label: 'Travaux', description: 'Construction, rénovation, aménagement...' },
                      { value: 'fournitures', label: 'Fournitures', description: 'Matériel, équipements...' },
                      { value: 'services', label: 'Autres services', description: 'Nettoyage, gardiennage, traiteur...' },
                      { value: 'autre', label: 'Autre', description: 'Catégorie non listée' },
                    ].map(opt => <OptionCard key={opt.value} {...opt} selected={state.prestationType === opt.value} onSelect={v => set('prestationType', v)} />)}
                  </div>
                  <WhyThis text="Le type de prestation détermine la catégorie de marché (travaux, fournitures ou services) et donc les seuils légaux applicables — les travaux ont des seuils spécifiques." />
                </StepShell>
              )}

              {state.step === 5 && (
                <div className="space-y-7">
                  <StepShell title="Montant et conditions de la subvention" subtitle="Dernières questions : le montant prévu et les conditions imposées par votre subvention.">
                    <h3 className="text-sm font-semibold text-navy mb-2.5">Quel est le montant estimé de la dépense ?</h3>
                    <div className="space-y-2.5">
                      {montantOptions.map(opt => <OptionCard key={opt.value} {...opt} selected={state.montant === opt.value} onSelect={v => set('montant', v)} />)}
                    </div>
                    <WhyThis text="Les seuils légaux déclenchent des procédures plus formelles. Sous certains seuils, des devis comparatifs peuvent suffire ; au-dessus des seuils européens, les procédures sont strictement encadrées." />
                  </StepShell>
                  <div>
                    <h3 className="text-sm font-semibold text-navy mb-2.5">Cette dépense est-elle financée par une subvention spécifique à ce projet ?</h3>
                    <div className="space-y-2.5">
                      {[
                        { value: 'oui', label: 'Oui', description: 'Un subside est dédié à cette dépense' },
                        { value: 'non', label: 'Non', description: 'Budget général ou non subsidié directement' },
                        { value: 'nsp', label: 'Je ne sais pas', description: 'À clarifier avec le bailleur' },
                      ].map(opt => <OptionCard key={opt.value} {...opt} selected={state.subsidieSpecifique === opt.value} onSelect={v => set('subsidieSpecifique', v)} />)}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-navy mb-2.5">Votre pouvoir subsidiant impose-t-il explicitement le respect des marchés publics ?</h3>
                    <div className="space-y-2.5">
                      {[
                        { value: 'oui', label: 'Oui', description: 'Mentionné dans la convention ou le règlement' },
                        { value: 'non', label: 'Non', description: 'Aucune obligation explicite' },
                        { value: 'nsp', label: 'Je ne sais pas', description: 'Convention non vérifiée ou ambiguë' },
                      ].map(opt => <OptionCard key={opt.value} {...opt} selected={state.reglesSubsidiant === opt.value} onSelect={v => set('reglesSubsidiant', v)} />)}
                    </div>
                    <WhyThis text="Certains bailleurs imposent contractuellement le respect des règles de marchés publics, même quand la loi ne l'exige pas. Ne pas respecter cette clause peut faire perdre la subvention." />
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="mt-6 flex items-center justify-between print:hidden">
          <button onClick={goBack} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-navy/15 bg-white text-sm font-medium text-slate hover:border-navy/30 transition-colors">
            <ChevronLeft size={16} /> {state.step === 1 ? 'Accueil' : 'Retour'}
          </button>
          <button onClick={advance} disabled={!canProceed()}
            className={['inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all', canProceed() ? 'bg-coral text-white hover:brightness-105 shadow-coral active:scale-[0.98]' : 'bg-navy/10 text-navy/30 cursor-not-allowed'].join(' ')}>
            {state.step === TOTAL_STEPS ? 'Voir mon résultat' : 'Continuer'}
            {state.step < TOTAL_STEPS && <ChevronRight size={16} />}
          </button>
        </div>
      </div>
    </div>
  )
}
