import { useState, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft, ChevronRight, RotateCcw, Copy, Printer, Check,
  HelpCircle, ChevronDown, ChevronUp, ShieldCheck, Compass,
  ListChecks, FileDown, FileText, Target, Sparkles, Info,
  Landmark, ExternalLink, BadgeCheck,
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

/**
 * Score de probabilité (0–100) que les règles des marchés publics s'appliquent.
 * Additif et pondéré, avec planchers pour les cas déterministes forts.
 */
function computeScore(s: DiagState): number {
  let score = 0
  const st = s.structureType ?? ''
  if (st === 'organisme_public') score += 50
  else if (['asbl', 'fondation', 'ong', 'federation'].includes(st)) score += 8
  else if (st === 'autre') score += 5
  else score += 2 // pme, cooperative

  if (s.financementPct === 'plus_50') score += 22
  else if (s.financementPct === 'entre_10_50') score += 10
  else if (s.financementPct === 'nsp') score += 8

  if (s.controlCA === 'oui') score += 20
  else if (s.controlCA === 'nsp') score += 5

  if (s.controlGestion === 'oui') score += 16
  else if (s.controlGestion === 'nsp') score += 4

  if (s.reglesSubsidiant === 'oui') score += 45
  else if (s.reglesSubsidiant === 'nsp') score += 6

  if (s.subsidieSpecifique === 'oui') score += 8
  else if (s.subsidieSpecifique === 'nsp') score += 4

  if (s.montant === '3k_30k') score += 3
  else if (s.montant === '30k_seuil') score += 8
  else if (s.montant === 'sup_seuil') score += 12
  else if (s.montant === 'nsp') score += 5

  let pct = Math.min(100, score)
  if (st === 'organisme_public') pct = Math.max(pct, 88)
  if (s.reglesSubsidiant === 'oui') pct = Math.max(pct, 82)
  return Math.round(pct)
}

interface Band {
  key: string
  min: number
  max: number
  label: string
  color: string
  tint: string
  ring: string
  phrase: string
  meaning: string
  steps: string[]
}

const BANDS: Band[] = [
  {
    key: 'tres_faible', min: 0, max: 20, label: 'Risque très faible', color: '#138A6E', tint: '#E6F6F0', ring: '#9DDCC7',
    phrase: "Probabilité très faible que les règles des marchés publics s'appliquent à ce projet.",
    meaning: "Votre organisation ne présente quasiment aucun des critères qui rendent un acheteur soumis aux marchés publics, et le montant en jeu reste limité. Vous pouvez avancer sereinement, en gardant une trace écrite de votre raisonnement.",
    steps: [
      'Gardez une trace écrite de ce diagnostic dans votre dossier de décision.',
      "Demandez tout de même 2 à 3 offres comparatives : c'est une bonne pratique de saine gestion.",
      'Si votre projet est financé par un subside spécifique, vérifiez aussi les règles imposées par votre convention de subvention.',
      'Refaites le diagnostic si votre financement ou votre montant évolue.',
    ],
  },
  {
    key: 'faible', min: 21, max: 40, label: 'Risque faible à documenter', color: '#2F9E6F', tint: '#EAF6EE', ring: '#A7DCBE',
    phrase: "Probabilité faible, mais quelques éléments méritent d'être documentés avant d'avancer.",
    meaning: "Les règles ont peu de chances de s'appliquer. Une mise en concurrence légère et quelques justificatifs suffisent généralement à sécuriser votre décision et à la rendre défendable.",
    steps: [
      'Sollicitez plusieurs prestataires et comparez-les sur des critères clairs et écrits.',
      'Conservez les offres reçues et la justification de votre choix.',
      'Vérifiez les clauses d\'achat de votre convention de subvention si le projet est subsidié.',
      'Documentez votre analyse : en cas de contrôle, vous montrez une démarche sérieuse.',
    ],
  },
  {
    key: 'grise', min: 41, max: 60, label: 'Zone grise', color: '#C97A18', tint: '#FDF3E1', ring: '#F4D69A',
    phrase: "Situation ambiguë : l'application des règles ne peut être ni écartée ni confirmée avec certitude.",
    meaning: "Plusieurs critères se compensent ou restent incertains. Le réflexe le plus sûr est de préparer votre achat comme s'il pouvait être soumis, puis de lever les doutes restants sur les points précis identifiés ci-dessous.",
    steps: [
      "Adoptez le scénario prudent : préparez votre achat comme s'il pouvait être soumis.",
      'Formalisez une mise en concurrence : besoin écrit, critères, plusieurs offres comparées.',
      'Levez les incertitudes sur les critères clés (financement public, contrôle, montant).',
      'Si le projet est subsidié, confrontez votre convention de subvention à ses obligations d\'achat.',
    ],
  },
  {
    key: 'forte', min: 61, max: 80, label: 'Forte probabilité', color: '#E2603C', tint: '#FCEAE3', ring: '#F5C0AB',
    phrase: "Votre projet présente de forts indices d'assujettissement aux règles des marchés publics.",
    meaning: "La majorité des critères pointent vers un assujettissement. Le plus prudent est de traiter ce projet comme probablement soumis : structurez une mise en concurrence traçable et choisissez la procédure adaptée à votre montant.",
    steps: [
      'Traitez ce projet comme probablement soumis aux règles des marchés publics.',
      'Choisissez la procédure adaptée à votre montant (de la simple facture acceptée à la procédure négociée).',
      'Rédigez un cahier des charges et mettez en concurrence de façon traçable.',
      'Faites valider votre approche par une personne compétente avant de signer.',
      'Vérifiez aussi les exigences propres à votre convention de subvention.',
    ],
  },
  {
    key: 'tres_forte', min: 81, max: 100, label: 'Très forte probabilité', color: '#D6473C', tint: '#FCE9E7', ring: '#F4B3AC',
    phrase: "Votre projet présente une très forte probabilité d'être soumis aux règles des marchés publics.",
    meaning: "Presque tous les critères convergent. Le plus prudent est de structurer dès maintenant votre achat comme un marché public et de faire sécuriser la procédure avant tout engagement.",
    steps: [
      'Structurez votre achat comme un marché public dès maintenant.',
      'Déterminez la procédure exacte selon votre montant et publiez si requis.',
      "Préparez les documents : cahier des charges, critères de sélection et d'attribution.",
      'Faites sécuriser la procédure par un·e juriste ou un service marchés publics avant tout engagement.',
      'Vérifiez les obligations complémentaires de votre convention de subvention.',
    ],
  },
]

function bandFor(pct: number): Band {
  return BANDS.find(b => pct >= b.min && pct <= b.max) ?? BANDS[0]
}

function explain(s: DiagState): { positives: string[]; protective: string[] } {
  const pos: string[] = []
  const pro: string[] = []
  if (s.structureType === 'organisme_public') pos.push("Vous êtes un organisme public : vous êtes en principe directement visé·e par la réglementation des marchés publics.")
  if (s.reglesSubsidiant === 'oui') pos.push("Votre pouvoir subsidiant impose explicitement le respect des marchés publics : cette obligation contractuelle prime.")
  if (s.financementPct === 'plus_50') pos.push("Plus de la moitié de votre budget provient de fonds publics — un critère central de la qualification de pouvoir adjudicateur.")
  else if (s.financementPct === 'entre_10_50') pos.push("Une part significative de votre financement est publique.")
  else if (s.financementPct === 'moins_10') pro.push("Votre financement public paraît marginal.")
  if (s.controlCA === 'oui') pos.push("Une autorité publique contrôle la majorité de votre conseil d'administration.")
  if (s.controlGestion === 'oui') pos.push("Votre gestion est soumise au contrôle d'une autorité publique.")
  if (s.controlCA === 'non' && s.controlGestion === 'non') pro.push("Aucun contrôle public de votre gouvernance n'a été identifié.")
  if (s.subsidieSpecifique === 'oui') pos.push("La dépense est financée par une subvention dédiée à ce projet.")
  if (s.montant === '30k_seuil') pos.push("Le montant estimé dépasse 30.000 € HTVA, seuil à partir duquel les procédures se formalisent.")
  if (s.montant === 'sup_seuil') pos.push("Le montant atteint le seuil européen, déclenchant les procédures les plus encadrées.")
  if (s.montant === 'moins_3k') pro.push("Le montant envisagé est faible.")
  const nspCount = [s.financementPct, s.controlCA, s.controlGestion, s.subsidieSpecifique, s.reglesSubsidiant, s.montant].filter(v => v === 'nsp').length
  if (nspCount >= 2) pos.push("Plusieurs éléments restent incertains (réponses « je ne sais pas ») : par prudence, le risque est rehaussé.")
  if (pos.length === 0) pos.push("Aucun indice fort d'assujettissement n'a été détecté dans vos réponses.")
  return { positives: pos, protective: pro }
}

interface Doc { id: string; title: string; summary: string; level: string; file: string }

const DOCS: Record<string, Doc> = {
  sous30k: { id: 'sous30k', title: 'Acheter ou commander une prestation sous 30.000 € HTVA', summary: "Les bons réflexes pour commander en règle quand le montant reste sous le seuil.", level: 'Idéal sous 30.000 € HTVA', file: '/resources/acheter-sous-30000.pdf' },
  comparer: { id: 'comparer', title: 'Comparer plusieurs prestataires simplement', summary: "Une méthode claire pour mettre en concurrence sans alourdir votre projet.", level: 'Bonne pratique à tout niveau', file: '/resources/comparer-prestataires.pdf' },
  cadrer_digital: { id: 'cadrer_digital', title: 'Cadrer un projet digital avant de demander des prix', summary: "Définir votre besoin web ou logiciel pour obtenir des offres comparables.", level: 'Projets digitaux', file: '/resources/cadrer-projet-digital.pdf' },
  over30k: { id: 'over30k', title: 'Que faire si votre projet dépasse 30.000 € HTVA ?', summary: "Les procédures qui se déclenchent au-delà du seuil et comment les aborder.", level: 'Dès 30.000 € HTVA ou risque élevé', file: '/resources/au-dela-de-30000.pdf' },
  asbl_subsidiee: { id: 'asbl_subsidiee', title: "ASBL subsidiée : quelles obligations d'achat vérifier ?", summary: "Les points à contrôler dans vos conventions de subvention avant d'acheter.", level: 'ASBL & structures subsidiées', file: '/resources/asbl-subsidiee-obligations.pdf' },
}

function recommendDocs(s: DiagState, bandKey: string): Doc[] {
  const ids = new Set<string>()
  const high = bandKey === 'forte' || bandKey === 'tres_forte'
  const under30k = ['moins_3k', '3k_30k'].includes(s.montant ?? '')
  const over30k = ['30k_seuil', 'sup_seuil'].includes(s.montant ?? '')
  const assocType = ['asbl', 'fondation', 'ong', 'federation'].includes(s.structureType ?? '')

  ids.add('comparer')
  if (under30k || s.montant === 'nsp' || !high) ids.add('sous30k')
  if (over30k || high) ids.add('over30k')
  if (s.prestationType === 'digital') ids.add('cadrer_digital')
  if (assocType && (s.subsidieSpecifique !== 'non' || s.financementPct !== 'moins_10' || high)) ids.add('asbl_subsidiee')

  const order = ['sous30k', 'comparer', 'cadrer_digital', 'over30k', 'asbl_subsidiee']
  return order.filter(id => ids.has(id)).map(id => DOCS[id])
}

interface Source { id: string; title: string; desc: string; url: string }

const SOURCES: Record<string, Source> = {
  bosa_regles: { id: 'bosa_regles', title: 'BOSA — Règles et procédures des marchés publics', desc: "Vue d'ensemble officielle des procédures, seuils et règles applicables aux marchés publics en Belgique.", url: 'https://bosa.belgium.be/fr/marche-publics-regles-et-procedures' },
  bosa_faible: { id: 'bosa_faible', title: 'BOSA — Marchés publics de faible montant', desc: 'Fiche officielle sur les marchés estimés à moins de 30.000 € HTVA dans les secteurs classiques.', url: 'https://bosa.belgium.be/fr/themes/marches-publics/centre-de-connaissances-des-marches/marches-publics-de-faible-montant' },
  spf_choisir: { id: 'spf_choisir', title: 'SPF Économie — Quelle procédure choisir ?', desc: "Les critères qui orientent le choix d'une procédure, notamment le montant estimé du marché.", url: 'https://economie.fgov.be/fr/themes/marches-publics/procedures/quelle-procedure-de-marche' },
  spf_procedures: { id: 'spf_procedures', title: 'SPF Économie — Procédures de marchés publics', desc: 'Présentation des principales procédures et du régime des marchés de faible montant.', url: 'https://economie.fgov.be/fr/themes/marches-publics/procedures-de-marches-publics' },
  eproc: { id: 'eproc', title: 'e-Procurement — Plateforme fédérale', desc: 'Plateforme belge officielle pour la publication, la gestion et la consultation des marchés publics.', url: 'https://www.publicprocurement.be/' },
  wal_choisir: { id: 'wal_choisir', title: 'Portail Wallonie — Choisir la procédure', desc: 'Portail wallon officiel pour comprendre les procédures et consulter des fiches pratiques.', url: 'https://marchespublics.wallonie.be/pouvoirs-adjudicateurs/passer-un-marche/concevoir-un-marche/choisir-la-procedure.html' },
  wal_modeles: { id: 'wal_modeles', title: 'Portail Wallonie — Modèles de documents', desc: 'Modèles officiels de documents, dont des canevas pour les marchés de faible montant.', url: 'https://marchespublics.wallonie.be/pouvoirs-adjudicateurs/outils/modeles-de-documents.html' },
  wal_faq: { id: 'wal_faq', title: 'Portail Wallonie — FAQ marchés publics', desc: 'Réponses pratiques sur la passation et la gestion des marchés publics.', url: 'https://marchespublics.wallonie.be/pouvoirs-adjudicateurs/outils/faq-1.html' },
}

function selectSources(pct: number, montant: string | null): Source[] {
  const under30k = ['moins_3k', '3k_30k'].includes(montant ?? '')
  const ids: string[] = []
  const add = (id: string) => { if (!ids.includes(id)) ids.push(id) }

  // Les marchés de faible montant priment dans l'affichage
  if (under30k) add('bosa_faible')

  if (pct < 40) { add('spf_procedures'); add('bosa_regles'); add('wal_faq') }
  else if (pct <= 60) { add('bosa_regles'); add('spf_choisir'); add('wal_faq'); add('wal_modeles') }
  else { add('bosa_regles'); add('spf_choisir'); add('eproc'); add('wal_modeles') }

  if (under30k) { add('spf_procedures'); add('wal_modeles') }

  return ids.slice(0, 4).map(id => SOURCES[id])
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

function ScoreDial({ pct, color }: { pct: number; color: string }) {
  const r = 52
  const c = 2 * Math.PI * r
  const off = c * (1 - pct / 100)
  return (
    <svg viewBox="0 0 140 140" className="w-36 h-36 shrink-0">
      <circle cx={70} cy={70} r={r} stroke="#E4E7EC" strokeWidth={12} fill="none" />
      <motion.circle
        cx={70} cy={70} r={r} stroke={color} strokeWidth={12} fill="none" strokeLinecap="round"
        strokeDasharray={c} transform="rotate(-90 70 70)"
        initial={{ strokeDashoffset: c }} animate={{ strokeDashoffset: off }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      />
      <text x={70} y={66} textAnchor="middle" className="font-display" fontSize={30} fontWeight={700} fill={color}>{pct}%</text>
      <text x={70} y={88} textAnchor="middle" fontSize={9} fill="#98A2B3" letterSpacing={1}>PROBABILITÉ</text>
    </svg>
  )
}

function BandStrip({ activeKey }: { activeKey: string }) {
  return (
    <div className="flex gap-1.5">
      {BANDS.map(b => {
        const on = b.key === activeKey
        return (
          <div key={b.key} className="flex-1">
            <div className="h-2 rounded-full transition-all" style={{ background: on ? b.color : '#E4E7EC' }} />
            <p className="mt-1.5 text-[9px] sm:text-[10px] font-semibold text-center leading-tight" style={{ color: on ? b.color : '#B4BCC8' }}>{b.min}–{b.max}%</p>
          </div>
        )
      })}
    </div>
  )
}

function ResultScreen({ state, onRestart }: { state: DiagState; onRestart: () => void }) {
  const pct = computeScore(state)
  const band = bandFor(pct)
  const { positives, protective } = explain(state)
  const docs = recommendDocs(state, band.key)
  const sources = selectSources(pct, state.montant)
  const [copied, setCopied] = useState(false)

  const summaryLines = [
    'Résultat du pré-diagnostic — marchepublic.be',
    '',
    'Probabilité estimée que les règles de marchés publics s\'appliquent : ' + pct + '%',
    'Niveau d\'obligation estimé : ' + band.label,
    '',
    band.phrase,
    '',
    'Ce que cela signifie :',
    band.meaning,
    '',
    'Pourquoi ce résultat :',
    ...positives.map(p => '• ' + p),
    ...protective.map(p => '– ' + p),
    '',
    'Ce que vous devriez faire maintenant :',
    ...band.steps.map((s, i) => (i + 1) + '. ' + s),
    '',
    'Documents recommandés :',
    ...docs.map(d => '• ' + d.title),
    '',
    'Sources officielles utiles :',
    ...sources.map(s => '• ' + s.title + ' — ' + s.url),
    '',
    'Estimation indicative et non contractuelle. Ce diagnostic ne constitue pas un avis juridique.',
  ]
  const summaryText = summaryLines.join('\n')

  const handleCopy = () => {
    navigator.clipboard.writeText(summaryText).then(() => { setCopied(true); window.setTimeout(() => setCopied(false), 2000) })
  }
  const handleDownload = () => {
    const blob = new Blob([summaryText], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'diagnostic-marchepublic.txt'
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-2xl mx-auto px-4 py-8 space-y-5">
      {/* 1. Votre score */}
      <div className="rounded-3xl overflow-hidden shadow-card border" style={{ borderColor: band.ring }}>
        <div className="px-6 py-7" style={{ background: band.tint }}>
          <p className="text-[11px] font-semibold uppercase tracking-widest mb-4" style={{ color: band.color }}>Probabilité estimée que les règles de marchés publics s'appliquent</p>
          <div className="flex flex-col sm:flex-row items-center gap-5">
            <ScoreDial pct={pct} color={band.color} />
            <div className="text-center sm:text-left">
              <p className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: band.color }}>Niveau d'obligation estimé</p>
              <h2 className="font-display text-2xl font-bold mt-0.5" style={{ color: band.color }}>{band.label}</h2>
              <p className="mt-2 text-sm text-navy/80 leading-relaxed">{band.phrase}</p>
            </div>
          </div>
          <div className="mt-6"><BandStrip activeKey={band.key} /></div>
        </div>
      </div>

      {/* 2. Ce que cela signifie */}
      <div className="bg-white rounded-2xl shadow-card border border-navy/[0.07] px-6 py-5">
        <h3 className="flex items-center gap-2 text-xs font-bold text-slate uppercase tracking-widest mb-3"><Info className="w-4 h-4" /> Ce que cela signifie</h3>
        <p className="text-sm text-navy/90 leading-relaxed">{band.meaning}</p>
      </div>

      {/* 3. Pourquoi ce résultat */}
      <div className="bg-white rounded-2xl shadow-card border border-navy/[0.07] px-6 py-5">
        <h3 className="flex items-center gap-2 text-xs font-bold text-slate uppercase tracking-widest mb-4"><Target className="w-4 h-4" /> Pourquoi ce résultat ?</h3>
        <ul className="space-y-2.5">
          {positives.map((p, i) => (
            <li key={'p' + i} className="flex items-start gap-2.5 text-sm text-navy/90"><span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: band.color }} />{p}</li>
          ))}
          {protective.map((p, i) => (
            <li key={'q' + i} className="flex items-start gap-2.5 text-sm text-slate"><Check className="w-4 h-4 shrink-0 mt-0.5 text-[#2F9E6F]" strokeWidth={2.5} />{p}</li>
          ))}
        </ul>
      </div>

      {/* 4. Ce que vous devriez faire maintenant */}
      <div className="bg-white rounded-2xl shadow-card border border-navy/[0.07] px-6 py-5">
        <h3 className="flex items-center gap-2 text-xs font-bold text-slate uppercase tracking-widest mb-4"><ListChecks className="w-4 h-4" /> Ce que vous devriez faire maintenant</h3>
        <ol className="space-y-3">
          {band.steps.map((step, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-navy/90">
              <span className="shrink-0 w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold text-white" style={{ background: band.color }}>{i + 1}</span>{step}
            </li>
          ))}
        </ol>
      </div>

      {/* 5. Documents recommandés */}
      <div className="bg-white rounded-2xl shadow-card border border-navy/[0.07] px-6 py-5">
        <h3 className="flex items-center gap-2 text-xs font-bold text-slate uppercase tracking-widest mb-4"><FileText className="w-4 h-4" /> Documents recommandés</h3>
        <div className="space-y-3">
          {docs.map(d => (
            <div key={d.id} className="rounded-2xl border border-navy/10 p-4 hover:border-teal/50 transition-colors">
              <div className="flex items-start gap-3">
                <span className="w-10 h-10 rounded-xl bg-aqua flex items-center justify-center shrink-0"><FileText className="w-5 h-5 text-ink" /></span>
                <div className="min-w-0 flex-1">
                  <p className="font-display font-semibold text-navy text-sm leading-snug">{d.title}</p>
                  <p className="text-xs text-slate mt-1 leading-relaxed">{d.summary}</p>
                  <span className="inline-block mt-2 text-[10px] font-semibold uppercase tracking-wide text-ink bg-aqua px-2 py-0.5 rounded-full">{d.level}</span>
                </div>
              </div>
              <a href={d.file} download className="mt-3 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-navy text-white text-sm font-semibold hover:brightness-110 transition-all">
                <FileDown className="w-4 h-4" /> Télécharger la fiche
              </a>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-slate/70 mt-3">Fiches pratiques au format PDF. Contenu en cours de finalisation.</p>
      </div>

      {/* 6. Sources officielles utiles */}
      <div className="bg-white rounded-2xl shadow-card border border-navy/[0.07] px-6 py-5">
        <h3 className="flex items-center gap-2 text-xs font-bold text-slate uppercase tracking-widest mb-1"><Landmark className="w-4 h-4" /> Sources officielles utiles</h3>
        <p className="text-xs text-slate mb-4">Pour vérifier par vous-même auprès des sources de référence.</p>
        <div className="space-y-2.5">
          {sources.map(s => (
            <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer" className="block rounded-2xl border border-navy/10 p-4 hover:border-teal/50 hover:bg-aqua/20 transition-colors">
              <div className="flex items-start gap-3">
                <span className="w-9 h-9 rounded-xl bg-aqua flex items-center justify-center shrink-0"><Landmark className="w-4 h-4 text-ink" /></span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="font-display font-semibold text-navy text-sm leading-snug">{s.title}</p>
                    <ExternalLink className="w-3.5 h-3.5 text-slate shrink-0" />
                  </div>
                  <p className="text-xs text-slate mt-1 leading-relaxed">{s.desc}</p>
                  <span className="inline-flex items-center gap-1 mt-2 text-[10px] font-semibold uppercase tracking-wide text-teal"><BadgeCheck className="w-3.5 h-3.5" /> Source officielle</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* 7. Télécharger mon résumé */}
      <div className="rounded-2xl bg-navy text-white px-6 py-6 relative overflow-hidden">
        <div className="absolute inset-0 dotgrid-light opacity-30" />
        <div className="relative">
          <h3 className="flex items-center gap-2 font-display font-bold text-lg mb-1"><Sparkles className="w-4 h-4 text-teal" /> Télécharger mon résumé</h3>
          <p className="text-sm text-aqua/80 mb-4">Gardez une trace de ce résultat pour votre dossier de décision ou pour en discuter avec une personne compétente.</p>
          <div className="flex flex-wrap gap-2.5 print:hidden">
            <button onClick={handleDownload} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-coral text-white text-sm font-semibold hover:brightness-105 transition-all">
              <FileDown className="w-4 h-4" /> Télécharger (.txt)
            </button>
            <button onClick={() => window.print()} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-sm font-semibold hover:bg-white/15 transition-colors">
              <Printer className="w-4 h-4" /> Imprimer / PDF
            </button>
            <button onClick={handleCopy} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-sm font-semibold hover:bg-white/15 transition-colors">
              {copied ? <><Check className="w-4 h-4 text-teal" /> Copié</> : <><Copy className="w-4 h-4" /> Copier</>}
            </button>
          </div>
        </div>
      </div>

      {/* 8. Recommencer */}
      <div className="text-center print:hidden">
        <button onClick={onRestart} className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-navy/15 bg-white text-sm font-semibold text-navy hover:border-navy/30 transition-colors">
          <RotateCcw className="w-4 h-4" /> Recommencer le diagnostic
        </button>
      </div>

      {/* Disclaimer discret */}
      <div className="rounded-2xl bg-white/60 border border-navy/[0.07] px-5 py-4 flex items-start gap-2.5">
        <ShieldCheck className="w-4 h-4 text-slate shrink-0 mt-0.5" />
        <p className="text-xs text-slate leading-relaxed">Estimation indicative et non contractuelle, calculée à partir de vos seules réponses. Elle ne constitue pas un avis juridique définitif et ne remplace pas l'analyse d'un·e juriste ou d'un service compétent. Si votre projet est financé par un subside spécifique, vérifiez aussi les règles imposées par votre convention de subvention.</p>
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
