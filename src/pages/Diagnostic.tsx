import { useState } from 'react'
import { ChevronLeft, ChevronRight, RotateCcw, Copy, Printer, CheckCircle, AlertTriangle, XCircle, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react'

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

  const amtMap: Record<string, number> = {
    moins_3k: 0,
    '3k_30k': 1,
    '30k_seuil': 2,
    sup_seuil: 3,
    nsp: 2,
  }
  const amt = amtMap[s.montant ?? ''] ?? 0

  if (paScore >= 5 && amt >= 2) return 'eleve'
  if (paScore >= 4 && amt >= 1) return 'eleve'
  if (paScore >= 3 || amt >= 2) return 'attention'
  return 'faible'
}

const RESULTS: Record<RiskLevel, {
  badge: string
  emoji: string
  color: string
  bg: string
  border: string
  title: string
  summary: string
  warning: string
  points: string[]
  steps: string[]
  resources: { label: string; url: string }[]
}> = {
  faible: {
    badge: 'Risque faible',
    emoji: '✅',
    color: '#1C6B45',
    bg: '#E8F5EE',
    border: '#86EFAC',
    title: 'Peu d\'indices d\'assujettissement',
    summary: 'Sur la base de vos réponses, votre organisation présente peu d\'indices suggérant qu\'elle serait soumise aux règles des marchés publics pour cette dépense.',
    warning: 'Ce résultat ne constitue pas une certitude juridique. Des éléments non couverts par ce diagnostic pourraient modifier la situation.',
    points: [
      'Votre structure ne semble pas être un organisme public au sens de la loi',
      'La part de financement public paraît limitée',
      'Le montant envisagé est en dessous des seuils critiques',
      'Aucun indice fort de contrôle par une autorité publique n\'a été détecté',
    ],
    steps: [
      'Conservez ce résultat à titre de trace dans votre dossier de décision',
      'Vérifiez les conditions spécifiques de vos conventions de subvention',
      'Consultez votre pouvoir subsidiant en cas de doute sur une dépense particulière',
      'Réévaluez si votre situation financière évolue significativement',
    ],
    resources: [
      { label: 'Loi belge du 17 juin 2016 sur les marchés publics', url: 'https://www.ejustice.just.fgov.be/cgi_loi/change_lg.pl?language=fr&la=F&cn=2016061701&table_name=loi' },
      { label: 'Guide ASBL et marchés publics — SPW', url: 'https://marchespublics.wallonie.be' },
    ],
  },
  attention: {
    badge: 'Zone d\'attention',
    emoji: '⚠️',
    color: '#B45309',
    bg: '#FEF3C7',
    border: '#FCD34D',
    title: 'Plusieurs indices à vérifier',
    summary: 'Votre situation présente des éléments qui méritent une attention particulière. L\'assujettissement aux marchés publics n\'est pas exclu et dépend de facteurs que ce diagnostic ne peut pas trancher seul.',
    warning: 'Une vérification approfondie est recommandée avant d\'engager la dépense. Ne pas procéder à un marché public si vous y êtes obligé·e expose votre organisation à des risques sérieux.',
    points: [
      'Un ou plusieurs indices d\'assujettissement ont été détectés',
      'Le niveau de financement public ou le montant crée une zone grise',
      'Des éléments de gouvernance ou de contrôle méritent d\'être vérifiés',
      'Le type de prestation peut déclencher des obligations spécifiques',
    ],
    steps: [
      'Consultez votre pouvoir subsidiant pour clarifier vos obligations',
      'Examinez les clauses de votre convention de subvention en détail',
      'Envisagez de consulter un·e juriste spécialisé·e en marchés publics',
      'Si doute persistant, appliquez les règles par précaution',
      'Documentez votre analyse et votre décision dans tous les cas',
    ],
    resources: [
      { label: 'Loi belge du 17 juin 2016 sur les marchés publics', url: 'https://www.ejustice.just.fgov.be/cgi_loi/change_lg.pl?language=fr&la=F&cn=2016061701&table_name=loi' },
      { label: 'Portail marchés publics Wallonie', url: 'https://marchespublics.wallonie.be' },
      { label: 'e-Procurement — Marchés publics fédéraux', url: 'https://www.publicprocurement.be' },
    ],
  },
  eleve: {
    badge: 'Risque élevé',
    emoji: '🔴',
    color: '#991B1B',
    bg: '#FEE2E2',
    border: '#FCA5A5',
    title: 'Indices forts d\'assujettissement',
    summary: 'Les informations que vous avez fournies indiquent un risque élevé que votre organisation soit soumise aux règles des marchés publics pour cette dépense.',
    warning: 'Procéder sans respecter les règles des marchés publics pourrait exposer votre organisation à des sanctions, la remise en cause de vos subventions, voire des poursuites. Consultez un·e juriste avant d\'aller plus loin.',
    points: [
      'Votre structure ou votre financement présente des caractéristiques d\'un pouvoir adjudicateur',
      'Le montant envisagé atteint ou dépasse des seuils légaux significatifs',
      'Des indices de contrôle par une autorité publique ont été identifiés',
      'Votre pouvoir subsidiant impose peut-être explicitement le respect des marchés publics',
    ],
    steps: [
      'Consultez impérativement un·e juriste spécialisé·e en marchés publics',
      'Contactez votre pouvoir subsidiant pour confirmer vos obligations',
      'Ne signez aucun contrat avant d\'avoir clarifié votre situation',
      'Si assujetti·e, lancez la procédure adaptée à votre montant (devis comparatifs, procédure négociée, appel d\'offres)',
      'Documentez toutes vos démarches et décisions',
    ],
    resources: [
      { label: 'Loi belge du 17 juin 2016 sur les marchés publics', url: 'https://www.ejustice.just.fgov.be/cgi_loi/change_lg.pl?language=fr&la=F&cn=2016061701&table_name=loi' },
      { label: 'Portail marchés publics Wallonie', url: 'https://marchespublics.wallonie.be' },
      { label: 'e-Procurement — Marchés publics fédéraux', url: 'https://www.publicprocurement.be' },
      { label: 'Seuils européens en vigueur', url: 'https://www.publicprocurement.be/fr/seuils-europeens' },
    ],
  },
}

function OptionCard({ value, label, description, selected, onSelect }: {
  value: string
  label: string
  description?: string
  selected: boolean
  onSelect: (v: string) => void
}) {
  return (
    <button
      onClick={() => onSelect(value)}
      className={[
        'w-full text-left px-4 py-3 rounded-xl border-2 transition-all duration-150',
        selected
          ? 'bg-[#EBF0F8] border-[#1B3A6B] shadow-card'
          : 'bg-white border-gray-200 hover:border-[#1B3A6B]/40 hover:bg-gray-50',
      ].join(' ')}
    >
      <div className="flex items-start gap-3">
        <div className={[
          'mt-0.5 w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center',
          selected ? 'border-[#1B3A6B] bg-[#1B3A6B]' : 'border-gray-300',
        ].join(' ')}>
          {selected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
        </div>
        <div>
          <div className={['text-sm font-medium', selected ? 'text-[#1B3A6B]' : 'text-gray-800'].join(' ')}>{label}</div>
          {description && <div className="text-xs text-gray-500 mt-0.5">{description}</div>}
        </div>
      </div>
    </button>
  )
}

function WhyThis({ text }: { text: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="mt-3">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-xs text-[#1B3A6B]/70 hover:text-[#1B3A6B] transition-colors"
      >
        <HelpCircle size={13} />
        <span>Pourquoi cette question ?</span>
        {open ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
      </button>
      {open && (
        <div className="mt-2 px-3 py-2 bg-[#EBF0F8] rounded-lg text-xs text-[#1B3A6B]/80 leading-relaxed">
          {text}
        </div>
      )}
    </div>
  )
}

function ResultScreen({ state, onRestart }: { state: DiagState; onRestart: () => void }) {
  const risk = computeRisk(state)
  const r = RESULTS[risk]
  const [copied, setCopied] = useState(false)

  const summaryLines = [
    'Résultat du pré-diagnostic Marchés Publics',
    '--- marchepublic.be ---',
    '',
    'Niveau de risque : ' + r.badge,
    '',
    r.title,
    r.summary,
    '',
    'Points clés :',
    ...r.points.map(p => '• ' + p),
    '',
    'Prochaines étapes :',
    ...r.steps.map((s, i) => (i + 1) + '. ' + s),
    '',
    '⚠️  ' + r.warning,
    '',
    'Ce diagnostic est fourni à titre informatif. Il ne constitue pas un avis juridique et ne remplace pas l\'analyse d\'un·e juriste, d\'un pouvoir subsidiant ou d\'un service compétent.',
  ]
  const summaryText = summaryLines.join('\n')

  const handleCopy = () => {
    navigator.clipboard.writeText(summaryText).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const RiskIcon = risk === 'faible' ? CheckCircle : risk === 'attention' ? AlertTriangle : XCircle

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      {/* Badge */}
      <div className="text-center">
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
          style={{ background: r.bg, color: r.color, border: '1.5px solid ' + r.border }}
        >
          <RiskIcon size={16} />
          {r.badge}
        </div>
        <h2 className="mt-3 text-2xl font-bold text-gray-900">{r.title}</h2>
      </div>

      {/* Main card */}
      <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden">
        <div className="px-6 py-5">
          <p className="text-gray-700 leading-relaxed">{r.summary}</p>
        </div>
        <div className="px-6 py-4 border-t" style={{ background: r.bg, borderColor: r.border }}>
          <p className="text-sm font-medium" style={{ color: r.color }}>⚠️  {r.warning}</p>
        </div>
      </div>

      {/* Key factors */}
      <div className="bg-white rounded-2xl shadow-card border border-gray-100 px-6 py-5">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Points clés identifiés</h3>
        <ul className="space-y-2">
          {r.points.map((p, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
              <span className="mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: r.color }} />
              {p}
            </li>
          ))}
        </ul>
      </div>

      {/* Next steps */}
      <div className="bg-white rounded-2xl shadow-card border border-gray-100 px-6 py-5">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Prochaines étapes recommandées</h3>
        <ol className="space-y-3">
          {r.steps.map((step, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
              <span
                className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                style={{ background: r.color }}
              >
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </div>

      {/* Resources */}
      <div className="bg-white rounded-2xl shadow-card border border-gray-100 px-6 py-5">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Ressources utiles</h3>
        <ul className="space-y-2">
          {r.resources.map((res, i) => (
            <li key={i}>
              <a
                href={res.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[#1B3A6B] hover:underline"
              >
                → {res.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 print:hidden">
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 text-sm text-gray-700 hover:border-[#1B3A6B] transition-colors shadow-card"
        >
          <Copy size={15} />
          {copied ? 'Copié !' : 'Copier le résumé'}
        </button>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 text-sm text-gray-700 hover:border-[#1B3A6B] transition-colors shadow-card"
        >
          <Printer size={15} />
          Imprimer / PDF
        </button>
        <button
          onClick={onRestart}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 text-sm text-gray-700 hover:border-[#1B3A6B] transition-colors shadow-card"
        >
          <RotateCcw size={15} />
          Recommencer
        </button>
      </div>

      {/* Legal disclaimer */}
      <div className="rounded-xl bg-gray-50 border border-gray-200 px-5 py-4 text-xs text-gray-500 leading-relaxed">
        Ce diagnostic est fourni à titre informatif. Il ne constitue pas un avis juridique et ne remplace pas l'analyse d'un·e juriste, d'un pouvoir subsidiant ou d'un service compétent. Les résultats dépendent exclusivement des informations que vous avez saisies.
      </div>
    </div>
  )
}

const TOTAL_STEPS = 5

export function Diagnostic({ onBack }: { onBack: () => void }) {
  const [state, setState] = useState<DiagState>(INITIAL_STATE)
  const [showResult, setShowResult] = useState(false)

  const set = (key: keyof DiagState, value: string | number | null) =>
    setState(prev => ({ ...prev, [key]: value }))

  const canProceed = () => {
    if (state.step === 1) return !!state.structureType
    if (state.step === 2) return !!state.financementPct
    if (state.step === 3) return !!state.controlCA && !!state.controlGestion
    if (state.step === 4) return !!state.prestationType
    if (state.step === 5) return !!state.montant && !!state.subsidieSpecifique && !!state.reglesSubsidiant
    return false
  }

  const advance = () => {
    if (state.step < TOTAL_STEPS) {
      set('step', state.step + 1)
    } else {
      setShowResult(true)
    }
  }

  const goBack = () => {
    if (state.step > 1) set('step', state.step - 1)
    else onBack()
  }

  if (showResult) {
    return (
      <div className="min-h-screen bg-[#FAFAF8]">
        <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3 print:hidden">
          <button onClick={() => setShowResult(false)} className="text-gray-500 hover:text-gray-800 transition-colors">
            <ChevronLeft size={20} />
          </button>
          <span className="text-sm font-medium text-gray-700">Résultat du diagnostic</span>
        </div>
        <ResultScreen state={state} onRestart={() => { setState(INITIAL_STATE); setShowResult(false) }} />
      </div>
    )
  }

  const isTravaux = state.prestationType === 'travaux'

  const montantOptions = isTravaux
    ? [
        { value: 'moins_3k', label: 'Moins de 3 000 €', description: 'Petits travaux ponctuels' },
        { value: '3k_30k', label: 'Entre 3 000 € et 30 000 €', description: 'Travaux de rénovation limités' },
        { value: '30k_seuil', label: 'Entre 30 000 € et 5 382 000 €', description: 'Travaux significatifs' },
        { value: 'sup_seuil', label: 'Plus de 5 382 000 €', description: 'Grands projets de construction' },
        { value: 'nsp', label: 'Je ne sais pas encore', description: 'Budget non encore défini' },
      ]
    : [
        { value: 'moins_3k', label: 'Moins de 3 000 €', description: 'Petites dépenses ponctuelles' },
        { value: '3k_30k', label: 'Entre 3 000 € et 30 000 €', description: 'Prestations de taille modérée' },
        { value: '30k_seuil', label: 'Entre 30 000 € et 221 000 €', description: 'Contrats importants' },
        { value: 'sup_seuil', label: 'Plus de 221 000 €', description: 'Au-dessus du seuil européen' },
        { value: 'nsp', label: 'Je ne sais pas encore', description: 'Budget non encore défini' },
      ]

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 print:hidden">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <button onClick={goBack} className="text-gray-500 hover:text-gray-800 transition-colors">
            <ChevronLeft size={20} />
          </button>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-500 font-medium">Étape {state.step} sur {TOTAL_STEPS}</span>
              <span className="text-xs text-gray-400">{Math.round((state.step / TOTAL_STEPS) * 100)}%</span>
            </div>
            <div className="flex gap-1">
              {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
                <div
                  key={i}
                  className={[
                    'h-1.5 flex-1 rounded-full transition-all duration-300',
                    i < state.step ? 'bg-[#1B3A6B]' : 'bg-gray-200',
                  ].join(' ')}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Step content */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-6">

          {/* Step 1 */}
          {state.step === 1 && (
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-1">Quel type de structure êtes-vous ?</h2>
              <p className="text-sm text-gray-500 mb-5">Sélectionnez la forme juridique la plus proche de votre organisation.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { value: 'asbl', label: 'ASBL', description: 'Association sans but lucratif' },
                  { value: 'fondation', label: 'Fondation', description: 'Fondation privée ou d\'utilité publique' },
                  { value: 'ong', label: 'ONG', description: 'Organisation non gouvernementale' },
                  { value: 'federation', label: 'Fédération', description: 'Fédération d\'associations' },
                  { value: 'cooperative', label: 'Coopérative', description: 'SCRL, SCRIS, SC...' },
                  { value: 'pme', label: 'PME / Entreprise', description: 'SRL, SA, SNC...' },
                  { value: 'organisme_public', label: 'Organisme public', description: 'Commune, CPAS, intercommunale...' },
                  { value: 'autre', label: 'Autre', description: 'Autre forme juridique' },
                ].map(opt => (
                  <OptionCard
                    key={opt.value}
                    {...opt}
                    selected={state.structureType === opt.value}
                    onSelect={v => set('structureType', v)}
                  />
                ))}
              </div>
              <WhyThis text="La loi sur les marchés publics belge s'applique aux 'pouvoirs adjudicateurs'. La forme juridique de votre organisation est un premier indice pour déterminer si vous pourriez en faire partie." />
            </div>
          )}

          {/* Step 2 */}
          {state.step === 2 && (
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-1">Quelle part de votre budget provient de fonds publics ?</h2>
              <p className="text-sm text-gray-500 mb-5">Incluez toutes les sources publiques : subsides, conventions, fonds européens...</p>
              <div className="space-y-2">
                {[
                  { value: 'plus_50', label: 'Plus de 50%', description: 'La majorité de votre budget est publique' },
                  { value: 'entre_10_50', label: 'Entre 10% et 50%', description: 'Part significative mais minoritaire' },
                  { value: 'moins_10', label: 'Moins de 10%', description: 'Financement public marginal ou nul' },
                  { value: 'nsp', label: 'Je ne sais pas', description: 'Part difficile à estimer' },
                ].map(opt => (
                  <OptionCard
                    key={opt.value}
                    {...opt}
                    selected={state.financementPct === opt.value}
                    onSelect={v => set('financementPct', v)}
                  />
                ))}
              </div>
              <WhyThis text="Un financement public supérieur à 50% est l'un des critères légaux pouvant qualifier une organisation de 'pouvoir adjudicateur' soumis aux marchés publics (art. 2, 2° de la loi du 17 juin 2016)." />
            </div>
          )}

          {/* Step 3 */}
          {state.step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-1">Gouvernance et contrôle public</h2>
                <p className="text-sm text-gray-500">Ces deux questions portent sur l'influence d'autorités publiques dans votre organisation.</p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Un organe public contrôle-t-il plus de la moitié de votre conseil d'administration ?</h3>
                <div className="space-y-2">
                  {[
                    { value: 'oui', label: 'Oui', description: 'Une autorité publique nomme ou contrôle la majorité des membres du CA' },
                    { value: 'non', label: 'Non', description: 'La composition du CA est indépendante des pouvoirs publics' },
                    { value: 'nsp', label: 'Je ne sais pas', description: 'Situation difficile à évaluer' },
                  ].map(opt => (
                    <OptionCard
                      key={opt.value}
                      {...opt}
                      selected={state.controlCA === opt.value}
                      onSelect={v => set('controlCA', v)}
                    />
                  ))}
                </div>
                <WhyThis text="Le contrôle de la gouvernance par des pouvoirs publics est un critère clé pour déterminer si une organisation doit être considérée comme un 'organisme de droit public' soumis aux marchés publics." />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Votre gestion est-elle soumise à un contrôle ou une supervision d'une autorité publique ?</h3>
                <div className="space-y-2">
                  {[
                    { value: 'oui', label: 'Oui', description: 'Tutelle administrative, audit obligatoire par un organisme public...' },
                    { value: 'non', label: 'Non', description: 'Votre gestion est autonome et indépendante' },
                    { value: 'nsp', label: 'Je ne sais pas', description: 'Difficile à déterminer sans vérification' },
                  ].map(opt => (
                    <OptionCard
                      key={opt.value}
                      {...opt}
                      selected={state.controlGestion === opt.value}
                      onSelect={v => set('controlGestion', v)}
                    />
                  ))}
                </div>
                <WhyThis text="Une supervision de gestion par les pouvoirs publics renforce l'hypothèse que votre organisation pourrait être qualifiée d'organisme de droit public au sens de la réglementation sur les marchés publics." />
              </div>
            </div>
          )}

          {/* Step 4 */}
          {state.step === 4 && (
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-1">Quel type de prestation souhaitez-vous commander ?</h2>
              <p className="text-sm text-gray-500 mb-5">Choisissez la catégorie qui correspond le mieux à votre projet.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { value: 'digital', label: 'Digital & Tech', description: 'Développement web, logiciel, app...' },
                  { value: 'consultance', label: 'Consultance', description: 'Conseil, étude, expertise...' },
                  { value: 'communication', label: 'Communication', description: 'Design, print, vidéo, événement...' },
                  { value: 'formation', label: 'Formation', description: 'Formations, coaching, facilitation...' },
                  { value: 'travaux', label: 'Travaux', description: 'Construction, rénovation, aménagement...' },
                  { value: 'fournitures', label: 'Fournitures', description: 'Achat de matériel, équipements...' },
                  { value: 'services', label: 'Autres services', description: 'Nettoyage, gardiennage, traiteur...' },
                  { value: 'autre', label: 'Autre', description: 'Catégorie non listée ici' },
                ].map(opt => (
                  <OptionCard
                    key={opt.value}
                    {...opt}
                    selected={state.prestationType === opt.value}
                    onSelect={v => set('prestationType', v)}
                  />
                ))}
              </div>
              <WhyThis text="Le type de prestation détermine la catégorie de marché (travaux, fournitures ou services) et donc les seuils légaux applicables. Les marchés de travaux ont des seuils spécifiques, plus élevés." />
            </div>
          )}

          {/* Step 5 */}
          {state.step === 5 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-1">Montant et conditions de la subvention</h2>
                <p className="text-sm text-gray-500">Ces dernières questions concernent le montant prévu et les conditions imposées par votre subvention.</p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Quel est le montant estimé de la dépense ?</h3>
                <div className="space-y-2">
                  {montantOptions.map(opt => (
                    <OptionCard
                      key={opt.value}
                      {...opt}
                      selected={state.montant === opt.value}
                      onSelect={v => set('montant', v)}
                    />
                  ))}
                </div>
                <WhyThis text="Les seuils légaux déclenchent des procédures plus formelles. En dessous de certains seuils, des procédures simplifiées (devis comparatifs) peuvent suffire — même si la loi s'applique. Au-dessus des seuils européens, les procédures sont strictement encadrées." />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Cette dépense est-elle financée par une subvention spécifique à ce projet ?</h3>
                <div className="space-y-2">
                  {[
                    { value: 'oui', label: 'Oui', description: 'Un subside est dédié spécifiquement à cette dépense' },
                    { value: 'non', label: 'Non', description: 'Dépense sur budget général ou non subsidiée directement' },
                    { value: 'nsp', label: 'Je ne sais pas', description: 'Situation à clarifier avec le bailleur' },
                  ].map(opt => (
                    <OptionCard
                      key={opt.value}
                      {...opt}
                      selected={state.subsidieSpecifique === opt.value}
                      onSelect={v => set('subsidieSpecifique', v)}
                    />
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Votre pouvoir subsidiant impose-t-il explicitement le respect des marchés publics ?</h3>
                <div className="space-y-2">
                  {[
                    { value: 'oui', label: 'Oui', description: 'Mentionné dans la convention ou le règlement de la subvention' },
                    { value: 'non', label: 'Non', description: 'Aucune obligation explicite dans les documents de la subvention' },
                    { value: 'nsp', label: 'Je ne sais pas', description: 'Convention non vérifiée ou clause ambiguë' },
                  ].map(opt => (
                    <OptionCard
                      key={opt.value}
                      {...opt}
                      selected={state.reglesSubsidiant === opt.value}
                      onSelect={v => set('reglesSubsidiant', v)}
                    />
                  ))}
                </div>
                <WhyThis text="Certains bailleurs de fonds imposent contractuellement le respect des règles de marchés publics dans leurs conventions, même lorsque la loi ne l'exige pas strictement. Ne pas respecter cette clause peut entraîner la remise en cause de la subvention." />
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="mt-6 flex items-center justify-between print:hidden">
          <button
            onClick={goBack}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm text-gray-600 hover:border-gray-300 transition-colors shadow-card"
          >
            <ChevronLeft size={16} />
            Retour
          </button>
          <button
            onClick={advance}
            disabled={!canProceed()}
            className={[
              'flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200',
              canProceed()
                ? 'bg-[#1B3A6B] text-white hover:bg-[#16305A] shadow-brand'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed',
            ].join(' ')}
          >
            {state.step === TOTAL_STEPS ? 'Voir le résultat' : 'Suivant'}
            {state.step < TOTAL_STEPS && <ChevronRight size={16} />}
          </button>
        </div>
      </div>
    </div>
  )
}
