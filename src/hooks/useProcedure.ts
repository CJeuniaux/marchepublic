import { useMemo } from 'react'
import type { TypeAchat } from '../lib/premium-types'
import {
  calculerProcedure, mappingKey, DOCUMENTS_PAR_PROCEDURE, LIBELLE_PROCEDURE,
} from '../lib/documents'

// Détermine la procédure applicable et les documents associés à partir du montant + type.
export function useProcedure(montant: number, type: TypeAchat) {
  return useMemo(() => {
    const { procedure, seuil } = calculerProcedure(montant, type)
    const key = mappingKey(procedure, type)
    const documents = DOCUMENTS_PAR_PROCEDURE[key] ?? []
    return {
      procedure,
      seuil,
      key,
      libelle: LIBELLE_PROCEDURE[procedure],
      documents,
    }
  }, [montant, type])
}
