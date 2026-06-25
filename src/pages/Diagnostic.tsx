import { useState, useEffect, type ReactNode, type ComponentType } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft, RotateCcw, Copy, Printer, Check,
  ChevronDown, ShieldCheck, FileDown, FileText,
  Target, Sparkles, Landmark, ExternalLink, BadgeCheck, ArrowUpRight,
  Users, Globe, Network, Boxes, Building2, Briefcase, Shapes,
  Code2, Lightbulb, PenTool, GraduationCap, HardHat, Package, Wrench,
  ClipboardList, PenLine,
} from 'lucide-react'
import { LogoMark } from '../components/Graphics'
import { LeadGateModal } from '../components/LeadGateModal'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type LucideIcon = ComponentType<any>

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
  step: 1, structureType: null, financementPct: null, controlCA: null, controlGestion: null,
  prestationType: null, montant: null, subsidieSpecifique: null, reglesSubsidiant: null,
}

function computeScore(s: DiagState): number {
  let score = 0
  const st = s.structureType ?? ''
  if (st === 'organisme_public') score += 50
  else if (['asbl', 'fondation', 'ong', 'federation'].includes(st)) score += 8
  else if (st === 'autre') score += 5
  else score += 2

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
  key: string; min: number; max: number; label: string; verdict: string
  color: string; tint: string; ring: string; phrase: string; meaning: string; steps: string[]
}

const BANDS: Band[] = [
  {
    key: 'tres_faible', min: 0, max: 20, label: 'Risque très faible', verdict: 'Votre parcours indique un risque très faible', color: '#138A6E', tint: '#E6F6F0', ring: '#9DDCC7',
    phrase: "Probabilité très faible que les règles des marchés publics s'appliquent à ce projet.",
    meaning: "Votre organisation ne présente quasiment aucun des critères qui rendent un acheteur soumis aux marchés publics, et le montant en jeu reste limité. Vous pouvez avancer sereinement, en gardant une trace écrite de votre raisonnement.",
    steps: ['Gardez une trace écrite de ce parcours dans votre dossier de décision.', "Demandez tout de même 2 à 3 offres comparatives : c'est une bonne pratique de saine gestion.", "Si votre projet dépend d'une convention de subvention spécifique, vérifiez aussi les règles imposées par ce financement.", 'Refaites le parcours si votre financement ou votre montant évolue.'],
  },
  {
    key: 'faible', min: 21, max: 40, label: 'Vigilance à documenter', verdict: 'Votre parcours indique une vigilance à documenter', color: '#2F9E6F', tint: '#EAF6EE', ring: '#A7DCBE',
    phrase: "Probabilité faible, mais quelques éléments méritent d'être documentés avant d'avancer.",
    meaning: "Les règles ont peu de chances de s'appliquer. Une mise en concurrence légère et quelques justificatifs suffisent généralement à sécuriser votre décision et à la rendre défendable.",
    steps: ['Sollicitez plusieurs prestataires et comparez-les sur des critères clairs et écrits.', 'Conservez les offres reçues et la justification de votre choix.', "Vérifiez les clauses d'achat de votre convention de subvention si le projet est subsidié.", 'Documentez votre analyse : en cas de contrôle, vous montrez une démarche sérieuse.'],
  },
  {
    key: 'grise', min: 41, max: 60, label: "Zone d'attention", verdict: "Votre parcours indique une zone d'attention", color: '#C97A18', tint: '#FDF3E1', ring: '#F4D69A',
    phrase: "Situation ambiguë : l'application des règles ne peut être ni écartée ni confirmée avec certitude.",
    meaning: "Plusieurs critères se compensent ou restent incertains. Le réflexe le plus sûr est de préparer votre achat comme s'il pouvait être soumis, puis de lever les doutes restants sur les points précis identifiés ci-dessous.",
    steps: ["Adoptez le scénario prudent : préparez votre achat comme s'il pouvait être soumis.", 'Formalisez une mise en concurrence : besoin écrit, critères, plusieurs offres comparées.', 'Levez les incertitudes sur les critères clés (financement public, contrôle, montant).', "Si le projet est subsidié, confrontez votre convention de subvention à ses obligations d'achat."],
  },
  {
    key: 'forte', min: 61, max: 80, label: 'Forte probabilité', verdict: 'Votre parcours indique une forte probabilité', color: '#E2603C', tint: '#FCEAE3', ring: '#F5C0AB',
    phrase: "Votre projet présente de forts indices d'assujettissement aux règles des marchés publics.",
    meaning: "La majorité des critères pointent vers un assujettissement. Le plus prudent est de traiter ce projet comme probablement soumis : structurez une mise en concurrence traçable et choisissez la procédure adaptée à votre montant.",
    steps: ['Traitez ce projet comme probablement soumis aux règles des marchés publics.', 'Choisissez la procédure adaptée à votre montant (de la simple facture acceptée à la procédure négociée).', 'Rédigez un cahier des charges et mettez en concurrence de façon traçable.', 'Faites valider votre approche par une personne compétente avant de signer.', 'Vérifiez aussi les exigences propres à votre convention de subvention.'],
  },
  {
    key: 'tres_forte', min: 81, max: 100, label: 'Très forte probabilité', verdict: 'Votre parcours indique une très forte probabilité', color: '#D6473C', tint: '#FCE9E7', ring: '#F4B3AC',
    phrase: "Votre projet présente une très forte probabilité d'être soumis aux règles des marchés publics.",
    meaning: "Presque tous les critères convergent. Le plus prudent est de structurer dès maintenant votre achat comme un marché public et de faire sécuriser la procédure avant tout engagement.",
    steps: ['Structurez votre achat comme un marché public dès maintenant.', 'Déterminez la procédure exacte selon votre montant et publiez si requis.', "Préparez les documents : cahier des charges, critères de sélection et d'attribution.", 'Faites sécuriser la procédure par un·e juriste ou un service marchés publics avant tout engagement.', 'Vérifiez les obligations complémentaires de votre convention de subvention.'],
  },
]

function bandFor(pct: number): Band { return BANDS.find(b => pct >= b.min && pct <= b.max) ?? BANDS[0] }

function explain(s: DiagState): { positives: string[]; protective: string[] } {
  const pos: string[] = []; const pro: string[] = []
  if (s.structureType === 'organisme_public') pos.push("Vous êtes un organisme public : vous êtes en principe directement visé·e par la réglementation des marchés publics.")
  if (s.reglesSubsidiant === 'oui') pos.push("Votre convention de subvention impose explicitement le respect des marchés publics : cette obligation contractuelle prime.")
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
  if (nspCount >= 2) pos.push("Plusieurs éléments restent incertains (réponses « je ne sais pas ») : par prudence, le risque est rehaussé.")
  if (pos.length === 0) pos.push("Aucun indice fort d'assujettissement n'a été détecté dans vos réponses.")
  return { positives: pos, protective: pro }
}

interface Doc { id: string; title: string; summary: string; level: string; file: string }
const DOCS: Record<string, Doc> = {
  sous30k: { id: 'sous30k', title: 'Acheter ou commander une prestation sous 30.000 € HTVA', summary: "Les bons réflexes pour commander en règle quand le montant reste sous le seuil.", level: 'Idéal sous 30.000 € HTVA', file: '/resources/acheter-sous-30000.docx' },
  comparer: { id: 'comparer', title: 'Comparer plusieurs prestataires simplement', summary: "Une méthode claire pour mettre en concurrence sans alourdir votre projet.", level: 'Bonne pratique à tout niveau', file: '/resources/comparer-prestataires.docx' },
  cadrer_digital: { id: 'cadrer_digital', title: 'Cadrer un projet digital avant de demander des prix', summary: "Définir votre besoin web ou logiciel pour obtenir des offres comparables.", level: 'Projets digitaux', file: '/resources/cadrer-projet-digital.docx' },
  over30k: { id: 'over30k', title: 'Que faire si votre projet dépasse 30.000 € HTVA ?', summary: "Les procédures qui se déclenchent au-delà du seuil et comment les aborder.", level: 'Dès 30.000 € HTVA ou risque élevé', file: '/resources/au-dela-de-30000.docx' },
  asbl_subsidiee: { id: 'asbl_subsidiee', title: "ASBL subsidiée : quelles obligations d'achat vérifier ?", summary: "Les points à contrôler dans vos conventions de subvention avant d'acheter.", level: 'ASBL & structures subsidiées', file: '/resources/asbl-subsidiee-obligations.docx' },
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
  if (under30k) add('bosa_faible')
  if (pct < 40) { add('spf_procedures'); add('bosa_regles'); add('wal_faq') }
  else if (pct <= 60) { add('bosa_regles'); add('spf_choisir'); add('wal_faq'); add('wal_modeles') }
  else { add('bosa_regles'); add('spf_choisir'); add('eproc'); add('wal_modeles') }
  if (under30k) { add('spf_procedures'); add('wal_modeles') }
  return ids.slice(0, 4).map(id => SOURCES[id])
}

const NOMAD_URL = 'https://nomadimpact.org'
interface NomadTier { title: string; text: string; cta: string }
function nomadTier(pct: number): NomadTier {
  if (pct <= 40) return { title: 'Vous pouvez avancer avec une consultation simple', text: "Besoin de cadrer votre projet digital avant de demander des devis ? Nomad Impact peut vous aider à structurer votre besoin et comparer les prestataires.", cta: 'Préparer mon projet avec Nomad Impact' }
  if (pct <= 60) return { title: 'Votre situation mérite un cadrage clair', text: 'Avant de choisir un prestataire, clarifiez votre besoin, votre budget, vos critères et les pièces à conserver.', cta: 'Être accompagné·e dans le cadrage' }
  return { title: 'Ne lancez pas votre projet sans cadrage', text: 'Nomad Impact peut vous aider à transformer votre besoin digital en brief clair, grille de comparaison, cahier des charges simplifié et dossier de décision.', cta: 'Demander un accompagnement' }
}
const NOMAD_OFFERS: { icon: LucideIcon; title: string; desc: string }[] = [
  { icon: Target, title: 'Cadrer mon besoin digital', desc: 'Clarifier ce que vous voulez vraiment, avant de demander des prix.' },
  { icon: ClipboardList, title: 'Préparer une demande de devis', desc: 'Une demande structurée pour des offres comparables.' },
  { icon: PenLine, title: 'Structurer un cahier des charges léger', desc: 'Un document clair pour cadrer et comparer sereinement.' },
]

const STRUCT_ICON: Record<string, LucideIcon> = { asbl: Users, fondation: Landmark, ong: Globe, federation: Network, cooperative: Boxes, pme: Briefcase, organisme_public: Building2, autre: Shapes }
const PRESTA_ICON: Record<string, LucideIcon> = { digital: Code2, consultance: Lightbulb, communication: PenTool, formation: GraduationCap, travaux: HardHat, fournitures: Package, services: Wrench, autre: Shapes }

function StepperBar({ current, total, labels }: { current: number; total: number; labels: string[] }) {
  return (
    <div className="flex items-start">
      {Array.from({ length: total }, (_, i) => {
        const n = i + 1
        const done = n < current
        const active = n === current
        return (
          <div key={n} className="flex items-start flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5 flex-1">
              <div className={[
                'w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all',
                done   ? 'bg-navy border-navy text-white' :
                active ? 'bg-coral border-coral text-white' :
                         'bg-white border-line text-gris',
              ].join(' ')}>
                {done ? <Check className="w-4 h-4" strokeWidth={3} /> : n}
              </div>
              <span className={['text-[10px] font-semibold text-center hidden sm:block',
                active ? 'text-coral' : done ? 'text-navy' : 'text-gris'].join(' ')}>
                {labels[i]}
              </span>
            </div>
            {n < total && (
              <div className="flex-1 mt-[18px] mx-1" style={{ borderTop: `2px dashed ${done ? '#2E2348' : '#E4D9CC'}` }} />
            )}
          </div>
        )
      })}
    </div>
  )
}

function OptionCard({ value, label, description, selected, onSelect, Icon }: {
  value: string; label: string; description?: string; selected: boolean; onSelect: (v: string) => void; Icon?: LucideIcon
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.985 }} onClick={() => onSelect(value)}
      className={[
        'group relative w-full text-left px-4 py-3.5 rounded-xl transition-all duration-150',
        selected
          ? 'bg-coral/[0.05] border-2 border-coral shadow-sm'
          : 'bg-white border border-line hover:border-coral/40',
      ].join(' ')}
    >
      <div className="flex items-start gap-3.5">
        {Icon ? (
          <span className={['w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors', selected ? 'bg-coral text-white' : 'bg-sable text-slate'].join(' ')}><Icon className="w-5 h-5" /></span>
        ) : (
          <span className={['mt-0.5 w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors', selected ? 'border-coral bg-coral' : 'border-line'].join(' ')}>{selected && <Check className="w-3 h-3 text-white" strokeWidth={3.5} />}</span>
        )}
        <span className="min-w-0">
          <span className={['block text-sm font-semibold', selected ? 'text-navy' : 'text-navy/90'].join(' ')}>{label}</span>
          {description && <span className="block text-xs text-slate mt-0.5 leading-relaxed">{description}</span>}
        </span>
        {Icon && selected && <span className="ml-auto w-5 h-5 rounded-full bg-coral flex items-center justify-center shrink-0"><Check className="w-3 h-3 text-white" strokeWidth={3.5} /></span>}
      </div>
    </motion.button>
  )
}

function WhyThis({ text }: { text: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="mt-5">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className={['flex items-center gap-1.5 text-xs font-semibold px-3 py-2.5 rounded-lg border transition-colors', open ? 'bg-navy/8 border-navy/20 text-navy' : 'border-line text-slate hover:border-navy/20 hover:text-navy'].join(' ')}
      >
        <ShieldCheck size={13} className="text-slate" />
        Base juridique de cette question
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}><ChevronDown size={13} /></motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }} className="overflow-hidden">
            <p className="mt-2 px-4 py-3 border-l-2 border-navy/20 bg-navy/[0.03] rounded-r-lg text-xs text-navy/80 leading-relaxed">{text}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function StepShell({ eyebrow, title, subtitle, children, stepN }: { eyebrow: string; title: string; subtitle: string; children: ReactNode; stepN?: number }) {
  return (
    <div>
      {stepN != null ? (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sun/20 text-navy text-[11px] font-bold mb-3 border border-sun/40">
          <span className="w-4 h-4 rounded-full bg-sun flex items-center justify-center text-navy text-[9px] font-black leading-none shrink-0">{stepN}</span>
          Question {stepN}
        </span>
      ) : (
        <p className="text-[11px] font-bold uppercase tracking-widest text-coral mb-2">{eyebrow}</p>
      )}
      <h2 className="font-display text-xl sm:text-2xl font-bold text-navy mb-1.5">{title}</h2>
      <p className="text-sm text-slate mb-6 leading-relaxed">{subtitle}</p>
      {children}
    </div>
  )
}

function useCountUp(target: number, duration = 1100) {
  const [v, setV] = useState(0)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setV(target); return }
    let raf = 0; const start = performance.now()
    const tick = (t: number) => { const p = Math.min(1, (t - start) / duration); const e = 1 - Math.pow(1 - p, 3); setV(Math.round(e * target)); if (p < 1) raf = requestAnimationFrame(tick) }
    raf = requestAnimationFrame(tick); return () => cancelAnimationFrame(raf)
  }, [target, duration])
  return v
}

function BigScore({ pct, color, band }: { pct: number; color: string; band: Band }) {
  const display = useCountUp(pct)
  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-widest text-slate mb-3">Niveau d'obligation estimé</p>
      <div className="flex flex-col sm:flex-row sm:items-end gap-3 mb-6">
        <motion.p
          className="font-display leading-none shrink-0 text-[56px] sm:text-[80px]"
          style={{ fontWeight: 700, color }}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {display}%
        </motion.p>
        <div className="pb-1">
          <h2 className="font-display text-lg font-bold text-navy leading-snug">{band.verdict.replace('Votre parcours indique ', '')}</h2>
          <p className="text-sm text-slate mt-1 leading-relaxed">{band.phrase}</p>
        </div>
      </div>

      {/* Segmented band bar with animated position marker */}
      <div className="relative pt-4">
        <motion.div
          className="absolute top-0 w-0 h-0"
          style={{
            left: `clamp(4px, ${pct}%, calc(100% - 4px))`,
            transform: 'translateX(-50%)',
            borderLeft: '5px solid transparent',
            borderRight: '5px solid transparent',
            borderTop: `7px solid ${color}`,
          }}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        />
        <div className="band-bar">
          <div className="band-bar__tres-faible" />
          <div className="band-bar__faible" />
          <div className="band-bar__grise" />
          <div className="band-bar__forte" />
          <div className="band-bar__tres-forte" />
        </div>
      </div>

      {/* Band legend */}
      <div className="flex flex-wrap gap-x-3 gap-y-1.5 mt-3">
        {BANDS.map(b => (
          <span key={b.key} className="flex items-center gap-1.5 text-[10px] font-semibold transition-colors"
            style={{ color: b.key === band.key ? b.color : '#A8A096' }}>
            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: b.color }} />
            {b.min}–{b.max}%
          </span>
        ))}
      </div>
    </div>
  )
}


const block = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } }
function Stagger({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div className={className} variants={{ show: { transition: { staggerChildren: 0.08 } } }} initial="hidden" animate="show">{children}</motion.div>
  )
}
function Item({ children, className }: { children: ReactNode; className?: string }) {
  return <motion.div className={className} variants={block} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>
}

function ResultScreen({ state, onRestart }: { state: DiagState; onRestart: () => void }) {
  const pct = computeScore(state)
  const band = bandFor(pct)
  const { positives, protective } = explain(state)
  const docs = recommendDocs(state, band.key)
  const sources = selectSources(pct, state.montant)
  const tier = nomadTier(pct)
  const [copied, setCopied] = useState(false)
  const [gateDoc, setGateDoc] = useState<Doc | null>(null)

  const summaryText = [
    'Résultat du parcours — marchépublic.be', '',
    "Probabilité estimée que les règles de marchés publics s'appliquent : " + pct + '%',
    band.verdict, '', band.phrase, '', 'Ce que cela signifie :', band.meaning, '',
    'Ce qui a influencé votre score :', ...positives.map(p => '• ' + p), ...protective.map(p => '– ' + p), '',
    'Chemin recommandé :', ...band.steps.map((s, i) => (i + 1) + '. ' + s), '',
    'Documents utiles :', ...docs.map(d => '• ' + d.title), '',
    'Sources officielles à vérifier :', ...sources.map(s => '• ' + s.title + ' — ' + s.url), '',
    'Estimation indicative et non contractuelle. Ce parcours ne constitue pas un avis juridique.',
  ].join('\n')

  const handleCopy = () => navigator.clipboard.writeText(summaryText).then(() => { setCopied(true); window.setTimeout(() => setCopied(false), 2000) })
  const handleDownload = () => {
    const blob = new Blob([summaryText], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob); const a = document.createElement('a')
    a.href = url; a.download = 'parcours-marchepublic.txt'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url)
  }

  return (
    <div>
      {gateDoc && (
        <LeadGateModal
          documentId={gateDoc.id}
          documentTitle={gateDoc.title}
          documentFile={gateDoc.file}
          score={pct}
          band={band.key}
          onClose={() => setGateDoc(null)}
        />
      )}

      {/* Score */}
      <section className="bg-cream py-10 sm:py-16">
        <Stagger className="max-w-4xl mx-auto px-4 sm:px-6 space-y-5">
          <Item>
            <div className="rounded-2xl overflow-hidden shadow-card border" style={{ borderColor: band.ring }}>
              <div className="h-1.5" style={{ background: band.color }} />
              <div className="px-6 py-8 bg-white">
                <BigScore pct={pct} color={band.color} band={band} />
              </div>
            </div>
          </Item>
          <Item>
            <div className="bg-white rounded-2xl shadow-card border border-line px-6 py-5">
              <h3 className="flex items-center gap-2 text-sm font-bold text-navy mb-3">
                <span className="w-5 h-5 rounded-full bg-sun flex items-center justify-center shrink-0 text-[10px] font-black text-navy leading-none">1</span>
                Ce que cela veut dire, simplement
              </h3>
              <p className="text-sm text-navy/90 leading-relaxed">{band.meaning}</p>
            </div>
          </Item>
        </Stagger>
      </section>

      {/* Pourquoi ce résultat */}
      <section className="bg-sable py-10 sm:py-16 border-t border-line">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div variants={block} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
            <div className="bg-white rounded-2xl shadow-card border border-line px-6 py-6">
              <h3 className="flex items-center gap-2 text-sm font-bold text-navy mb-4">
                <span className="w-5 h-5 rounded-full bg-sun flex items-center justify-center shrink-0 text-[10px] font-black text-navy leading-none">2</span>
                Pourquoi ce résultat ?
              </h3>
              <ul className="space-y-2.5">
                {positives.map((p, i) => (<li key={'p' + i} className="flex items-start gap-2.5 text-sm text-navy/90"><span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: band.color }} />{p}</li>))}
                {protective.map((p, i) => (<li key={'q' + i} className="flex items-start gap-2.5 text-sm text-slate"><Check className="w-4 h-4 shrink-0 mt-0.5 text-slate" strokeWidth={2.5} />{p}</li>))}
              </ul>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Étapes recommandées */}
      <section className="bg-white py-10 sm:py-16 border-t border-line">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div variants={block} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
            <div className="mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded text-[11px] font-bold tracking-widest uppercase bg-sun/30 border border-sun/60 text-navy">
                <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
                Chemin recommandé
              </span>
              <h2 className="mt-3 font-display text-2xl sm:text-3xl font-bold text-navy">Les étapes à suivre</h2>
            </div>
            <ol className="space-y-3">
              {band.steps.map((step, i) => (
                <li key={i} className="flex items-start gap-4 bg-white rounded-xl border border-line p-4 shadow-sm">
                  <span className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: band.color }}>{i + 1}</span>
                  <span className="text-sm text-navy/90 leading-relaxed pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
          </motion.div>
        </div>
      </section>

      {/* Documents utiles */}
      <section className="bg-cream py-10 sm:py-16 border-t border-line">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div variants={block} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
            <div className="mb-8">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded text-[11px] font-bold tracking-widest uppercase bg-sun/30 border border-sun/60 text-navy">
                <FileText className="w-3 h-3" /> Documents
              </span>
              <h2 className="mt-3 font-display text-2xl sm:text-3xl font-bold text-navy">Ressources pour avancer</h2>
              <p className="mt-2 text-sm text-slate">Fiches pratiques sélectionnées selon votre résultat. Téléchargement gratuit.</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {docs.map(d => (
                <div key={d.id} className="bg-white rounded-2xl border border-line p-5 hover:border-navy/15 hover:shadow-card transition-all flex flex-col shadow-sm">
                  <div className="flex items-start gap-3 flex-1">
                    <span className="w-10 h-10 rounded-xl bg-sable flex items-center justify-center shrink-0"><FileText className="w-5 h-5 text-bleu" /></span>
                    <div className="min-w-0 flex-1">
                      <p className="font-display font-semibold text-navy text-sm leading-snug">{d.title}</p>
                      <p className="text-xs text-slate mt-1 leading-relaxed">{d.summary}</p>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                    <span className="inline-block text-[10px] font-semibold uppercase tracking-wide text-slate bg-sable border border-line px-2 py-0.5 rounded">{d.level}</span>
                    <span className="inline-block text-[10px] font-bold uppercase tracking-wide text-bleu bg-bleu/10 border border-bleu/20 px-2 py-0.5 rounded">.docx éditable</span>
                  </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setGateDoc(d)}
                    className="mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-navy text-white text-sm font-semibold hover:brightness-110 transition-all"
                  >
                    <FileDown className="w-4 h-4" /> Télécharger la fiche
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Sources officielles */}
      <section className="bg-white py-10 sm:py-16 border-t border-line">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div variants={block} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
            <div className="mb-7">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded text-[11px] font-bold tracking-widest uppercase bg-sun/30 border border-sun/60 text-navy">
                <Landmark className="w-3 h-3" /> Sources officielles
              </span>
              <h2 className="mt-3 font-display text-2xl sm:text-3xl font-bold text-navy">Vérifiez les sources de référence</h2>
              <p className="mt-2 text-sm text-slate">Pour confirmer la procédure applicable avant d'agir.</p>
            </div>
            <div className="space-y-3">
              {sources.map(s => (
                <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer" className="block rounded-xl border border-line p-4 hover:border-bleu/20 hover:bg-bleu/[0.02] transition-colors group bg-white shadow-sm">
                  <div className="flex items-start gap-3">
                    <span className="w-9 h-9 rounded-lg bg-sable flex items-center justify-center shrink-0"><Landmark className="w-4 h-4 text-bleu" /></span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <p className="font-display font-semibold text-navy text-sm leading-snug">{s.title}</p>
                        <ExternalLink className="w-3.5 h-3.5 text-slate shrink-0" />
                      </div>
                      <p className="text-xs text-slate mt-1 leading-relaxed">{s.desc}</p>
                      <span className="inline-flex items-center gap-1 mt-2 text-[10px] font-semibold uppercase tracking-wide text-bleu bg-bleu/10 px-2 py-0.5 rounded border border-bleu/20">
                        <BadgeCheck className="w-3 h-3" /> Source officielle
                      </span>
                    </div>
                    <span className="ml-auto self-center text-xs font-semibold text-bleu hidden sm:inline shrink-0">Consulter →</span>
                  </div>
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Nomad Impact */}
      <section className="bg-navy py-12 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div variants={block} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-2xl relative overflow-hidden"
          >
            <div className="absolute inset-0 dotgrid-light opacity-20" />
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-coral" />
            <div className="relative px-6 sm:px-10 py-8 sm:py-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded text-[11px] font-semibold uppercase tracking-wide bg-white/10 text-aqua">Préparer la suite</span>
              <h3 className="mt-3 font-display text-xl sm:text-2xl font-bold tracking-tight text-white">{tier.title}</h3>
              <p className="mt-2 text-sm text-aqua/85 leading-relaxed max-w-xl">{tier.text}</p>
              <div className="mt-6 grid sm:grid-cols-3 gap-3">
                {NOMAD_OFFERS.map(o => (
                  <div key={o.title} className="rounded-xl bg-white/[0.06] border border-white/10 p-4">
                    <span className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center mb-3"><o.icon className="w-4 h-4 text-white/70" /></span>
                    <p className="font-display font-semibold text-sm leading-snug text-white">{o.title}</p>
                    <p className="text-xs text-aqua/70 mt-1 leading-relaxed">{o.desc}</p>
                  </div>
                ))}
              </div>
              <a href={NOMAD_URL} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-coral text-white text-sm font-semibold hover:brightness-105 transition-all shadow-coral">{tier.cta} <ArrowUpRight className="w-4 h-4" /></a>
              <p className="mt-3 text-[11px] text-aqua/50">Nomad Impact accompagne les ASBL pour reprendre le contrôle de leurs outils digitaux. Cet outil est indépendant et gratuit.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Actions bar + disclaimer */}
      <section className="bg-white py-10 border-t border-line print:hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-4">
          <div className="rounded-2xl bg-white shadow-card border border-line overflow-hidden">
            <div className="px-6 pt-5 pb-4">
              <h3 className="flex items-center gap-2 font-display font-bold text-navy text-sm mb-0.5">
                <Sparkles className="w-4 h-4 text-slate" /> Gardez une trace de votre parcours
              </h3>
              <p className="text-xs text-slate">Pour votre dossier de décision ou pour en discuter avec une personne compétente.</p>
            </div>
            <div className="border-t border-line flex flex-wrap">
              <button onClick={handleDownload} className="flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-navy border-r border-line hover:bg-cream transition-colors">
                <FileDown className="w-4 h-4 text-navy" /> Télécharger (.txt)
              </button>
              <button onClick={() => window.print()} className="flex-1 min-w-[120px] inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-navy border-r border-line hover:bg-cream transition-colors">
                <Printer className="w-4 h-4 text-slate" /> Imprimer
              </button>
              <button onClick={handleCopy} className="flex-1 min-w-[100px] inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-navy border-r border-line hover:bg-cream transition-colors">
                {copied ? <><Check className="w-4 h-4 text-navy" /> Copié</> : <><Copy className="w-4 h-4 text-slate" /> Copier</>}
              </button>
              <button onClick={onRestart} className="flex-1 min-w-[130px] inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-slate hover:bg-cream hover:text-navy transition-colors">
                <RotateCcw className="w-4 h-4" /> Recommencer
              </button>
            </div>
          </div>
          <div className="rounded-xl bg-sable border border-line px-5 py-4 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-slate shrink-0 mt-0.5" />
            <p className="text-xs text-slate leading-relaxed">Ce score est une estimation indicative basée sur vos réponses. Il vous aide à identifier le niveau de vigilance à adopter, mais ne constitue pas un avis juridique. Les liens officiels ci-dessus permettent de vérifier la procédure applicable.</p>
          </div>
        </div>
      </section>
    </div>
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
        <div className="bg-white border-b border-line px-4 py-3 flex items-center justify-between print:hidden sticky top-0 z-10">
          <button onClick={() => setShowResult(false)} className="flex items-center gap-2 text-slate hover:text-navy transition-colors text-sm font-medium p-1"><ChevronLeft size={16} /> Retour</button>
          <button onClick={onBack} className="flex items-center gap-2">
            <LogoMark className="h-5 w-auto" nodeColor="#2E2348" />
            <span className="font-display font-bold text-navy text-[13px]">marchépublic<span className="text-coral">.be</span></span>
          </button>
          <span className="text-sm font-semibold text-navy pr-1">Votre résultat</span>
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
    enter: (d: number) => ({ opacity: 0, x: d > 0 ? 44 : -44 }),
    center: { opacity: 1, x: 0 },
    exit: (d: number) => ({ opacity: 0, x: d > 0 ? -44 : 44 }),
  }

  return (
    <div className="min-h-screen bg-cream relative">
      <div className="absolute inset-0 dotgrid opacity-30 pointer-events-none" />

      {/* Header */}
      <div className="relative print:hidden bg-white border-b border-line sticky top-0 z-20">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={goBack} className="flex items-center gap-2 text-slate hover:text-navy transition-colors text-sm font-medium"><ChevronLeft size={16} /> Retour</button>
          <button onClick={onBack} className="flex items-center gap-2">
            <LogoMark className="h-5 w-auto" nodeColor="#2E2348" />
            <span className="font-display font-bold text-navy text-[13px]">marchépublic<span className="text-coral">.be</span></span>
          </button>
          <span className="text-xs text-gris font-medium">Étape {state.step} sur {TOTAL_STEPS}</span>
        </div>
      </div>

      {/* Stepper */}
      <div className="relative print:hidden bg-sable border-b border-line">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <StepperBar current={state.step} total={TOTAL_STEPS} labels={STEP_LABELS} />
        </div>
      </div>

      {/* Contenu */}
      <div className="relative max-w-2xl mx-auto px-4 py-6">
        <div className="bg-white text-navy rounded-2xl shadow-card border border-line p-6 sm:p-8 overflow-hidden">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div key={state.step} custom={dir} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}>

              {state.step === 1 && (
                <StepShell stepN={1} eyebrow={`Étape 1 / 5 · ${STEP_LABELS[0]}`} title="Quel type de structure représentez-vous ?" subtitle="Choisissez la forme juridique la plus proche de la vôtre. Vous pourrez revenir en arrière.">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {[
                      { value: 'asbl', label: 'ASBL', description: 'Association sans but lucratif' },
                      { value: 'fondation', label: 'Fondation', description: "Privée ou d'utilité publique" },
                      { value: 'ong', label: 'ONG', description: 'Organisation non gouvernementale' },
                      { value: 'federation', label: 'Fédération', description: "Fédération d'associations" },
                      { value: 'cooperative', label: 'Coöpérative', description: 'SC, SCRL...' },
                      { value: 'pme', label: 'PME / Entreprise', description: 'SRL, SA, SNC...' },
                      { value: 'organisme_public', label: 'Organisme public', description: 'Commune, CPAS, intercommunale...' },
                      { value: 'autre', label: 'Autre', description: 'Autre forme juridique' },
                    ].map(opt => <OptionCard key={opt.value} {...opt} Icon={STRUCT_ICON[opt.value]} selected={state.structureType === opt.value} onSelect={v => set('structureType', v)} />)}
                  </div>
                  <WhyThis text="La loi belge sur les marchés publics s'applique aux 'pouvoirs adjudicateurs'. Votre forme juridique est un premier indice pour situer votre organisation." />
                </StepShell>
              )}

              {state.step === 2 && (
                <StepShell stepN={2} eyebrow={`Étape 2 / 5 · ${STEP_LABELS[1]}`} title="Quelle part de votre budget vient de fonds publics ?" subtitle="Incluez toutes les sources publiques : subsides, conventions, fonds européens...">
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
                <StepShell stepN={3} eyebrow={`Étape 3 / 5 · ${STEP_LABELS[2]}`} title="Gouvernance et contrôle public" subtitle="Ces deux questions portent sur l'influence d'autorités publiques dans votre organisation.">
                  <h3 className="text-sm font-semibold text-navy mb-2.5">Un organe public contrôle-t-il plus de la moitié de votre conseil d'administration ?</h3>
                  <div className="space-y-2.5">
                    {[
                      { value: 'oui', label: 'Oui', description: 'Une autorité publique nomme/contrôle la majorité du CA' },
                      { value: 'non', label: 'Non', description: 'Le CA est indépendant des pouvoirs publics' },
                      { value: 'nsp', label: 'Je ne sais pas', description: 'Difficile à évaluer' },
                    ].map(opt => <OptionCard key={opt.value} {...opt} selected={state.controlCA === opt.value} onSelect={v => set('controlCA', v)} />)}
                  </div>
                  <h3 className="text-sm font-semibold text-navy mb-2.5 mt-7">Votre gestion est-elle soumise au contrôle d'une autorité publique ?</h3>
                  <div className="space-y-2.5">
                    {[
                      { value: 'oui', label: 'Oui', description: 'Tutelle administrative, audit public obligatoire...' },
                      { value: 'non', label: 'Non', description: 'Gestion autonome et indépendante' },
                      { value: 'nsp', label: 'Je ne sais pas', description: 'Difficile à déterminer' },
                    ].map(opt => <OptionCard key={opt.value} {...opt} selected={state.controlGestion === opt.value} onSelect={v => set('controlGestion', v)} />)}
                  </div>
                  <WhyThis text="Le contrôle de la gouvernance ou de la gestion par les pouvoirs publics est un critère clé pour qualifier un 'organisme de droit public' soumis aux marchés publics." />
                </StepShell>
              )}

              {state.step === 4 && (
                <StepShell stepN={4} eyebrow={`Étape 4 / 5 · ${STEP_LABELS[3]}`} title="Quel type de prestation souhaitez-vous commander ?" subtitle="Choisissez la catégorie la plus proche de votre projet.">
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
                    ].map(opt => <OptionCard key={opt.value} {...opt} Icon={PRESTA_ICON[opt.value]} selected={state.prestationType === opt.value} onSelect={v => set('prestationType', v)} />)}
                  </div>
                  <WhyThis text="Le type de prestation détermine la catégorie de marché (travaux, fournitures ou services) et donc les seuils légaux applicables — les travaux ont des seuils spécifiques." />
                </StepShell>
              )}

              {state.step === 5 && (
                <StepShell stepN={5} eyebrow={`Étape 5 / 5 · ${STEP_LABELS[4]}`} title="Montant et conditions de la subvention" subtitle="Dernières questions : le montant prévu et les conditions imposées par votre subvention.">
                  <h3 className="text-sm font-semibold text-navy mb-2.5">Quel est le montant estimé de la dépense ?</h3>
                  <div className="space-y-2.5">
                    {montantOptions.map(opt => <OptionCard key={opt.value} {...opt} selected={state.montant === opt.value} onSelect={v => set('montant', v)} />)}
                  </div>
                  <h3 className="text-sm font-semibold text-navy mb-2.5 mt-7">Cette dépense est-elle financée par une subvention spécifique à ce projet ?</h3>
                  <div className="space-y-2.5">
                    {[
                      { value: 'oui', label: 'Oui', description: 'Un subside est dédié à cette dépense' },
                      { value: 'non', label: 'Non', description: 'Budget général ou non subsidié directement' },
                      { value: 'nsp', label: 'Je ne sais pas', description: 'À clarifier avec le bailleur' },
                    ].map(opt => <OptionCard key={opt.value} {...opt} selected={state.subsidieSpecifique === opt.value} onSelect={v => set('subsidieSpecifique', v)} />)}
                  </div>
                  <h3 className="text-sm font-semibold text-navy mb-2.5 mt-7">Votre pouvoir subsidiant impose-t-il explicitement le respect des marchés publics ?</h3>
                  <div className="space-y-2.5">
                    {[
                      { value: 'oui', label: 'Oui', description: 'Mentionné dans la convention ou le règlement' },
                      { value: 'non', label: 'Non', description: 'Aucune obligation explicite' },
                      { value: 'nsp', label: 'Je ne sais pas', description: 'Convention non vérifiée ou ambiguë' },
                    ].map(opt => <OptionCard key={opt.value} {...opt} selected={state.reglesSubsidiant === opt.value} onSelect={v => set('reglesSubsidiant', v)} />)}
                  </div>
                  <WhyThis text="Certains bailleurs imposent contractuellement le respect des règles de marchés publics, même quand la loi ne l'exige pas. Ne pas respecter cette clause peut faire perdre la subvention." />
                </StepShell>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="mt-6 flex items-center justify-between print:hidden">
          <button onClick={goBack} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-line bg-white text-navy text-sm font-semibold hover:bg-cream transition-colors shadow-sm">
            <ChevronLeft size={16} /> {state.step === 1 ? 'Accueil' : 'Retour'}
          </button>
          <span className="text-xs text-gris hidden sm:block">Aucune donnée n'est conservée.</span>
          <button onClick={advance} disabled={!canProceed()}
            className={['inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold transition-all', canProceed() ? 'bg-coral text-white hover:brightness-105 shadow-coral active:scale-[0.98]' : 'bg-line text-gris cursor-not-allowed'].join(' ')}>
            {state.step === TOTAL_STEPS ? 'Voir mon résultat' : 'Continuer →'}
          </button>
        </div>
      </div>
    </div>
  )
}
