import { Check } from 'lucide-react'
import { WORKFLOW_ETAPES, LIBELLE_ETAPE, type WorkflowEtape } from '../../lib/premium-types'

// Timeline horizontale des étapes du cycle de vie d'un marché public.
// L'utilisateur peut cliquer une étape déjà atteinte pour y revenir.
export function TimelineMarche({
  etape,
  onSelect,
}: {
  etape: WorkflowEtape
  onSelect?: (e: WorkflowEtape) => void
}) {
  const currentIdx = WORKFLOW_ETAPES.indexOf(etape)

  return (
    <ol className="flex items-start gap-1 overflow-x-auto pb-1">
      {WORKFLOW_ETAPES.map((e, i) => {
        const done = i < currentIdx
        const active = i === currentIdx
        const reachable = i <= currentIdx
        return (
          <li key={e} className="flex items-center flex-1 min-w-max">
            <button
              type="button"
              disabled={!reachable || !onSelect}
              onClick={() => reachable && onSelect?.(e)}
              className={`flex flex-col items-center gap-1.5 px-2 ${reachable && onSelect ? 'cursor-pointer' : 'cursor-default'}`}
            >
              <span
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border transition-colors ${
                  active
                    ? 'bg-coral text-white border-coral'
                    : done
                      ? 'bg-teal/15 text-teal border-teal/40'
                      : 'bg-white text-slate border-line'
                }`}
              >
                {done ? <Check className="w-4 h-4" /> : i + 1}
              </span>
              <span
                className={`text-[10px] font-medium text-center leading-tight whitespace-nowrap ${
                  active ? 'text-navy' : done ? 'text-teal' : 'text-slate'
                }`}
              >
                {LIBELLE_ETAPE[e]}
              </span>
            </button>
            {i < WORKFLOW_ETAPES.length - 1 && (
              <span className={`h-px flex-1 mx-1 mt-[-14px] ${i < currentIdx ? 'bg-teal/40' : 'bg-line'}`} />
            )}
          </li>
        )
      })}
    </ol>
  )
}
