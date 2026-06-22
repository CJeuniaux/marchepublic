import { useState } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

type Answer = string | null

interface State {
  step: number
  financementPublic: Answer
  controlCA: Answer
  controlGestion: Answer
  typeAchat: Answer
  montant: Answer
}

type Verdict =
  | 'pas_pa'
  | 'bon_commande'
  | 'simplifie'
  | 'negocie'
  | 'europeen'

// ─── Logic ───────────────────────────────────────────────────────────────────

function isPouvoirAdjudicateur(s: State): boolean {
  return (
    s.financementPublic === 'oui_maj' ||
    s.controlCA === 'oui' ||
    s.controlGestion === 'oui'
  )
}

function getVerdict(s: State): Verdict | null {
  if (!isPouvoirAdjudicateur(s)) return 'pas_pa'
  if (!s.typeAchat || !s.montant) return null

  switch (s.montant) {
    case 'moins_3k':  return 'bon_commande'
    case '3k_30k':    return 'simplifie'
    case '30k_seuil': return 'negocie'
    case 'sup_seuil': return 'europeen'
    default:          return null
  }
}

// ─── Step helpers ─────────────────────────────────────────────────────────────

function nextStep(s: State): number {
  switch (s.step) {
    case 1: return 2
    case 2: return 3
    case 3:
      if (!isPouvoirAdjudicateur(s)) return 99
      return 4
    case 4: return 5
    case 5: return 99
    default: return 99
  }
}

function canAdvance(step: number, s: State): boolean {
  switch (step) {
    case 1: return s.financementPublic !== null
    case 2: return s.controlCA !== null
    case 3: return s.controlGestion !== null
    case 4: return s.typeAchat !== null
    case 5: return s.montant !== null
    default: return false
  }
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function OptionBtn({
  label,
  sub,
  selected,
  onClick,
}: {
  label: string
  sub?: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-xl border-2 px-5 py-4 transition-all ${
        selected
          ? 'border-[#1a3c6e] bg-[#1a3c6e] text-white'
          : 'border-gray-200 bg-white hover:border-[#1a3c6e] hover:bg-blue-50'
      }`}
    >
      <span className="block font-semibold">{label}</span>
      {sub && (
        <span className={`block text-sm mt-0.5 ${selected ? 'text-blue-200' : 'text-gray-500'}`}>
          {sub}
        </span>
      )}
    </button>
  )
}

function StepBar({ step }: { step: number }) {
  const total = 5
  const current = Math.min(step, total)
  return (
    <div className="flex gap-1.5 mb-8">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-1.5 flex-1 rounded-full transition-all ${
            i < current ? 'bg-[#1a3c6e]' : 'bg-gray-200'
          }`}
        />
      ))}
    </div>
  )
}

// ─── Verdict screen ──────────────────────────────────────────────────────────

const VERDICTS: Record<
  Verdict,
  { emoji: string; titre: string; couleur: string; bg: string; explication: string; etapes: string[]; ressources: { label: string; url: string }[] }
> = {
  pas_pa: {
    emoji: '✅',
    titre: 'Pas de marché public obligatoire',
    couleur: 'text-green-700',
    bg: 'bg-green-50 border-green-200',
    explication:
      "Votre ASBL n'est pas considérée comme « pouvoir adjudicateur » au sens de la loi belge du 17 juin 2016. Vous n'êtes donc pas soumise à l'obligation de faire des marchés publics.",
    etapes: [
      'Restez vigilant·e si votre situation évolue (augmentation des subsides publics, changement de CA…)',
      "Certains subsides peuvent imposer contractuellement des règles de mise en concurrence même sans obligation légale",
      "Bonne pratique : demander 3 offres comparatives pour tout achat > 5 000 €",
    ],
    ressources: [
      { label: 'Loi du 17 juin 2016 sur les marchés publics', url: 'https://www.ejustice.just.fgov.be/eli/loi/2016/06/17/2016A20592/justel' },
    ],
  },
  bon_commande: {
    emoji: '📋',
    titre: 'Bon de commande simple',
    couleur: 'text-blue-700',
    bg: 'bg-blue-50 border-blue-200',
    explication:
      'En dessous de 3 000 € HTVA, vous pouvez passer une commande directe sans formalité particulière. Un simple bon de commande suffit.',
    etapes: [
      'Établissez un bon de commande ou une facture pro forma',
      'Conservez la trace de l\'achat dans votre comptabilité',
      'Vérifiez que le fournisseur est en règle (TVA, ONSS) si vous le souhaitez',
    ],
    ressources: [
      { label: 'Guide pratique SPW – petits marchés', url: 'https://marchespublics.wallonie.be' },
    ],
  },
  simplifie: {
    emoji: '🔍',
    titre: 'Procédure négociée simplifiée',
    couleur: 'text-orange-700',
    bg: 'bg-orange-50 border-orange-200',
    explication:
      'Entre 3 000 € et 30 000 € HTVA, vous pouvez utiliser la procédure négociée sans publication préalable. Vous devez consulter au moins 3 fournisseurs et choisir l\'offre la plus avantageuse.',
    etapes: [
      'Rédigez un cahier des charges (même simplifié) décrivant vos besoins',
      'Contactez au minimum 3 fournisseurs/prestataires et demandez une offre écrite',
      'Comparez les offres selon des critères objectifs (prix, qualité, délai…)',
      'Conservez toutes les offres reçues dans votre dossier',
      'Notifiez l\'adjudicataire choisi par écrit',
    ],
    ressources: [
      { label: 'Modèle de cahier des charges simplifié – SPW', url: 'https://marchespublics.wallonie.be' },
      { label: 'Portail e-Procurement Belgique', url: 'https://enot.publicprocurement.be' },
    ],
  },
  negocie: {
    emoji: '📢',
    titre: 'Procédure négociée avec publication',
    couleur: 'text-amber-700',
    bg: 'bg-amber-50 border-amber-200',
    explication:
      'Au-delà de 30 000 € HTVA (et en dessous du seuil européen), vous devez publier un avis de marché et organiser une mise en concurrence formelle.',
    etapes: [
      'Rédigez un cahier des charges complet (clauses techniques et administratives)',
      'Publiez un avis de marché sur le Bulletin des Adjudications et/ou e-Notification',
      'Respectez un délai de réception des offres (min. 10 jours)',
      'Évaluez les offres selon des critères préalablement définis',
      'Notifiez le choix et respectez le délai de standstill (8 jours)',
      'Conservez le dossier complet pendant 5 ans',
    ],
    ressources: [
      { label: 'e-Notification – publication d\'avis', url: 'https://enot.publicprocurement.be' },
      { label: 'Bulletin des Adjudications', url: 'https://www.bulletinadjudications.be' },
      { label: 'Guide SPW Wallonie', url: 'https://marchespublics.wallonie.be' },
    ],
  },
  europeen: {
    emoji: '🇪🇺',
    titre: 'Procédure européenne obligatoire',
    couleur: 'text-red-700',
    bg: 'bg-red-50 border-red-200',
    explication:
      'Vous dépassez les seuils européens (143 000 € pour fournitures/services, 5 538 000 € pour travaux). La procédure ouverte avec publication au Journal Officiel de l\'UE est obligatoire.',
    etapes: [
      'Publication obligatoire au Journal Officiel de l\'Union Européenne (JOUE)',
      'Délai de réception des offres : minimum 35 jours (procédure ouverte)',
      'Cahier des charges très détaillé avec spécifications techniques précises',
      "Commission d'évaluation des offres obligatoire",
      'Respect strict du délai de standstill (15 jours avant signature)',
      "Avis d'attribution à publier dans les 30 jours après signature",
      'Fortement conseillé : faire appel à un juriste spécialisé',
    ],
    ressources: [
      { label: 'TED – Tenders Electronic Daily (JOUE)', url: 'https://ted.europa.eu' },
      { label: 'e-Notification BE', url: 'https://enot.publicprocurement.be' },
      { label: 'Guide complet SPW', url: 'https://marchespublics.wallonie.be' },
    ],
  },
}

function VerdictScreen({ verdict, onRestart }: { verdict: Verdict; onRestart: () => void }) {
  const v = VERDICTS[verdict]
  return (
    <div className={`rounded-2xl border-2 p-6 ${v.bg}`}>
      <div className="text-4xl mb-3">{v.emoji}</div>
      <h2 className={`text-xl font-bold mb-3 ${v.couleur}`}>{v.titre}</h2>
      <p className="text-gray-700 mb-5 leading-relaxed">{v.explication}</p>

      <div className="mb-5">
        <h3 className="font-semibold text-gray-800 mb-2">Prochaines étapes</h3>
        <ol className="space-y-2">
          {v.etapes.map((e, i) => (
            <li key={i} className="flex gap-3 text-sm text-gray-700">
              <span className={`font-bold shrink-0 ${v.couleur}`}>{i + 1}.</span>
              <span>{e}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="mb-6">
        <h3 className="font-semibold text-gray-800 mb-2">Ressources utiles</h3>
        <ul className="space-y-1.5">
          {v.ressources.map((r, i) => (
            <li key={i}>
              <a
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-sm underline underline-offset-2 ${v.couleur} hover:opacity-75`}
              >
                → {r.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="pt-4 border-t border-current/10 space-y-3">
        <p className="text-xs text-gray-500">
          ⚠️ Cet outil fournit une orientation générale. Pour toute situation complexe, consultez un juriste spécialisé en marchés publics.
        </p>
        <button
          onClick={onRestart}
          className="text-sm font-semibold text-gray-600 underline underline-offset-2 hover:text-gray-900"
        >
          ← Recommencer le diagnostic
        </button>
      </div>
    </div>
  )
}

// ─── Steps ────────────────────────────────────────────────────────────────────

function Step1({ state, setState }: { state: State; setState: (s: State) => void }) {
  const set = (v: string) => setState({ ...state, financementPublic: v })
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-[#1a3c6e] mb-1">Question 1 / 3 — Financement</p>
      <h2 className="text-xl font-bold text-gray-900 mb-2">
        Quelle part de votre budget annuel provient de pouvoirs publics ?
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        Subsides de la Région, communes, CPAS, SPF, fonds européens structurels…
      </p>
      <div className="space-y-3">
        <OptionBtn label="Plus de 50 %" sub="Financement public majoritaire" selected={state.financementPublic === 'oui_maj'} onClick={() => set('oui_maj')} />
        <OptionBtn label="50 % ou moins" sub="Financement public minoritaire ou nul" selected={state.financementPublic === 'oui_min'} onClick={() => set('oui_min')} />
        <OptionBtn label="Je ne sais pas" selected={state.financementPublic === 'nsp'} onClick={() => set('nsp')} />
      </div>
    </div>
  )
}

function Step2({ state, setState }: { state: State; setState: (s: State) => void }) {
  const set = (v: string) => setState({ ...state, controlCA: v })
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-[#1a3c6e] mb-1">Question 2 / 3 — Gouvernance</p>
      <h2 className="text-xl font-bold text-gray-900 mb-2">
        Des représentants d'autorités publiques sont-ils majoritaires dans votre conseil d'administration ?
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        Mandataires communaux, agents régionaux, représentants d'un SPF désignés d'office…
      </p>
      <div className="space-y-3">
        <OptionBtn label="Oui, ils sont majoritaires" sub="Plus de la moitié des administrateurs" selected={state.controlCA === 'oui'} onClick={() => set('oui')} />
        <OptionBtn label="Non" sub="Pas de représentants publics, ou minoritaires" selected={state.controlCA === 'non'} onClick={() => set('non')} />
      </div>
    </div>
  )
}

function Step3({ state, setState }: { state: State; setState: (s: State) => void }) {
  const set = (v: string) => setState({ ...state, controlGestion: v })
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-[#1a3c6e] mb-1">Question 3 / 3 — Contrôle</p>
      <h2 className="text-xl font-bold text-gray-900 mb-2">
        Votre ASBL est-elle soumise au contrôle de gestion d'une autorité publique ?
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        Ex. : une autorité publique doit approuver vos comptes, votre budget ou vos décisions stratégiques.
      </p>
      <div className="space-y-3">
        <OptionBtn label="Oui" sub="Une autorité publique contrôle ou approuve notre gestion" selected={state.controlGestion === 'oui'} onClick={() => set('oui')} />
        <OptionBtn label="Non" sub="Aucun contrôle de gestion public" selected={state.controlGestion === 'non'} onClick={() => set('non')} />
        <OptionBtn label="Je ne sais pas" selected={state.controlGestion === 'nsp'} onClick={() => set('nsp')} />
      </div>
    </div>
  )
}

function Step4({ state, setState }: { state: State; setState: (s: State) => void }) {
  const set = (v: string) => setState({ ...state, typeAchat: v })
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-[#1a3c6e] mb-1">Votre achat — Type</p>
      <h2 className="text-xl font-bold text-gray-900 mb-2">De quel type d'achat s'agit-il ?</h2>
      <p className="text-sm text-gray-500 mb-6">Les seuils légaux varient selon la nature du marché.</p>
      <div className="space-y-3">
        <OptionBtn
          label="Fournitures ou services"
          sub="Matériel informatique, mobilier, traiteur, consultant, graphiste, logiciel…"
          selected={state.typeAchat === 'fournitures_services'}
          onClick={() => set('fournitures_services')}
        />
        <OptionBtn
          label="Travaux"
          sub="Construction, rénovation, aménagement de locaux…"
          selected={state.typeAchat === 'travaux'}
          onClick={() => set('travaux')}
        />
      </div>
    </div>
  )
}

function Step5({ state, setState }: { state: State; setState: (s: State) => void }) {
  const set = (v: string) => setState({ ...state, montant: v })
  const isT = state.typeAchat === 'travaux'
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-[#1a3c6e] mb-1">Votre achat — Montant</p>
      <h2 className="text-xl font-bold text-gray-900 mb-2">Quel est le montant estimé (HTVA) ?</h2>
      <p className="text-sm text-gray-500 mb-6">Estimez le montant total du marché, frais compris.</p>
      <div className="space-y-3">
        <OptionBtn label="Moins de 3 000 €" selected={state.montant === 'moins_3k'} onClick={() => set('moins_3k')} />
        <OptionBtn label="Entre 3 000 € et 30 000 €" selected={state.montant === '3k_30k'} onClick={() => set('3k_30k')} />
        {isT ? (
          <>
            <OptionBtn label="Entre 30 000 € et 5 538 000 €" selected={state.montant === '30k_seuil'} onClick={() => set('30k_seuil')} />
            <OptionBtn label="Plus de 5 538 000 €" selected={state.montant === 'sup_seuil'} onClick={() => set('sup_seuil')} />
          </>
        ) : (
          <>
            <OptionBtn label="Entre 30 000 € et 143 000 €" selected={state.montant === '30k_seuil'} onClick={() => set('30k_seuil')} />
            <OptionBtn label="Plus de 143 000 €" selected={state.montant === 'sup_seuil'} onClick={() => set('sup_seuil')} />
          </>
        )}
      </div>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const INITIAL: State = {
  step: 1,
  financementPublic: null,
  controlCA: null,
  controlGestion: null,
  typeAchat: null,
  montant: null,
}

export function MarchePublic() {
  const [state, setState] = useState<State>(INITIAL)

  const verdict = state.step === 99 ? getVerdict(state) : null

  function advance() {
    setState((s) => ({ ...s, step: nextStep(s) }))
  }

  function back() {
    setState((s) => ({
      ...s,
      step: s.step > 1 ? s.step - 1 : 1,
    }))
  }

  return (
    <div className="min-h-screen bg-[#f0f4fa] flex flex-col">
      <header className="bg-[#1a3c6e] text-white px-6 py-5 flex items-center gap-3">
        <div>
          <div className="text-xl font-black tracking-tight leading-none">marchepublic.be</div>
          <div className="text-xs text-blue-200 mt-0.5">Outil de diagnostic pour ASBL · Wallonie</div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-start px-4 py-8">
        <div className="w-full max-w-lg">

          {state.step === 1 && verdict === null && (
            <div className="mb-8">
              <h1 className="text-2xl font-black text-gray-900 mb-2">
                Mon ASBL doit-elle faire un marché public ?
              </h1>
              <p className="text-gray-500 text-sm leading-relaxed">
                Répondez à quelques questions pour savoir si vous êtes soumis·e à la loi sur les marchés publics, et quelle procédure s'applique à votre achat.
              </p>
            </div>
          )}

          {verdict ? (
            <VerdictScreen verdict={verdict} onRestart={() => setState(INITIAL)} />
          ) : (
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <StepBar step={state.step} />

              {state.step === 1 && <Step1 state={state} setState={setState} />}
              {state.step === 2 && <Step2 state={state} setState={setState} />}
              {state.step === 3 && <Step3 state={state} setState={setState} />}
              {state.step === 4 && <Step4 state={state} setState={setState} />}
              {state.step === 5 && <Step5 state={state} setState={setState} />}

              <div className="flex gap-3 mt-8">
                {state.step > 1 && (
                  <button
                    onClick={back}
                    className="px-5 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold hover:border-gray-300 transition-colors"
                  >
                    ← Retour
                  </button>
                )}
                <button
                  onClick={advance}
                  disabled={!canAdvance(state.step, state)}
                  className="flex-1 px-5 py-3 rounded-xl bg-[#1a3c6e] text-white font-semibold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#15305a] transition-colors"
                >
                  {state.step === 5 || (state.step === 3 && !isPouvoirAdjudicateur(state))
                    ? 'Voir le résultat →'
                    : 'Continuer →'}
                </button>
              </div>
            </div>
          )}

          <p className="text-center text-xs text-gray-400 mt-6">
            Basé sur la loi belge du 17 juin 2016 · Seuils 2024–2025
          </p>
        </div>
      </main>
    </div>
  )
}
