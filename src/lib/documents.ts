// Sélection des documents selon la procédure.
// Seuils OFFICIELS au 1er janvier 2026 (Guide MP Wallonie) — décision A.
import type { TypeAchat } from './premium-types'

export const SEUILS = {
  faible_montant: 30_000,          // < 30.000 EUR HTVA : marché de faible montant
  belge: 140_000,                  // >= 140.000 EUR HTVA : publicité belge
  europeen_fournitures: 216_000,   // seuil européen fournitures/services
  europeen_services: 216_000,
  europeen_travaux: 5_404_000,     // seuil européen travaux
} as const

export type Procedure = 'faible_montant' | 'pnspp_belge' | 'po_europeen'

export const LIBELLE_PROCEDURE: Record<Procedure, string> = {
  faible_montant: 'Marché de faible montant',
  pnspp_belge: 'Procédure négociée / publicité belge',
  po_europeen: 'Procédure ouverte européenne',
}

function seuilEuropeen(type: TypeAchat): number {
  return type === 'travaux' ? SEUILS.europeen_travaux : SEUILS.europeen_fournitures
}

export function calculerProcedure(montant: number, type: TypeAchat): { procedure: Procedure; seuil: string | null } {
  if (montant < SEUILS.faible_montant) return { procedure: 'faible_montant', seuil: null }
  if (montant < seuilEuropeen(type)) return { procedure: 'pnspp_belge', seuil: 'belge' }
  return { procedure: 'po_europeen', seuil: 'europeen' }
}

// Clé de mapping documents = procedure (+ type pour les tiers belge/européen).
export function mappingKey(procedure: Procedure, type: TypeAchat): string {
  if (procedure === 'faible_montant') return 'faible_montant'
  return `${procedure}_${type}`
}

export const DOCUMENTS_PAR_PROCEDURE: Record<string, string[]> = {
  faible_montant: [
    'descriptif_faible_montant',
    'invitation_depot_offre',
    'lettre_notification_attribution',
    'lettre_info_non_retenus',
    'dma_faible_montant_avec_offre',
  ],
  pnspp_belge_fournitures: [
    'csc_1phase_belge_fournitures',
    'invitation_depot_offre',
    'lettre_notification_attribution',
    'lettre_info_belge_sous_140k',
    'dma_belge_1phase',
  ],
  pnspp_belge_services: [
    'csc_1phase_belge_services',
    'invitation_depot_offre',
    'lettre_notification_attribution',
    'lettre_info_belge_sous_140k',
    'dma_belge_1phase',
  ],
  pnspp_belge_travaux: [
    'csc_1phase_belge_travaux',
    'invitation_depot_offre',
    'lettre_notification_attribution',
    'lettre_info_belge_sous_140k',
    'dma_belge_1phase',
  ],
  po_europeen_fournitures: [
    'csc_1phase_europeen_fournitures',
    'lettre_notification_attribution',
    'lettre_info_europeens',
    'dma_europeen_1phase',
  ],
  po_europeen_services: [
    'csc_1phase_europeen_services',
    'lettre_notification_attribution',
    'lettre_info_europeens',
    'dma_europeen_1phase',
  ],
  po_europeen_travaux: [
    'csc_1phase_europeen_travaux',
    'lettre_notification_attribution',
    'lettre_info_europeens',
    'dma_europeen_1phase',
  ],
}

export const DOCUMENTS_OPTIONNELS = [
  'contrat_sous_traitance_rgpd',
  'clauses_contractuelles_rgpd',
  'lettre_justification_prix',
  'lettre_prolongation_delai',
  'lettre_demande_completude',
  'formulaire_incident_rgpd',
]

// Libellés lisibles pour l'UI (slug -> texte).
export const LIBELLE_DOCUMENT: Record<string, string> = {
  descriptif_faible_montant: 'Descriptif de faible montant',
  invitation_depot_offre: 'Invitation à déposer offre',
  lettre_notification_attribution: 'Lettre de notification d\'attribution',
  lettre_info_non_retenus: 'Lettre d\'information aux non-retenus',
  lettre_info_belge_sous_140k: 'Lettre d\'information (procédure belge)',
  lettre_info_europeens: 'Lettre d\'information (procédure européenne)',
  dma_faible_montant_avec_offre: 'Décision motivée d\'attribution (faible montant)',
  dma_belge_1phase: 'Décision motivée d\'attribution (belge, 1 phase)',
  dma_europeen_1phase: 'Décision motivée d\'attribution (européen, 1 phase)',
  csc_1phase_belge_fournitures: 'Cahier spécial des charges (fournitures, belge)',
  csc_1phase_belge_services: 'Cahier spécial des charges (services, belge)',
  csc_1phase_belge_travaux: 'Cahier spécial des charges (travaux, belge)',
  csc_1phase_europeen_fournitures: 'Cahier spécial des charges (fournitures, européen)',
  csc_1phase_europeen_services: 'Cahier spécial des charges (services, européen)',
  csc_1phase_europeen_travaux: 'Cahier spécial des charges (travaux, européen)',
  contrat_sous_traitance_rgpd: 'Contrat de sous-traitance RGPD',
  clauses_contractuelles_rgpd: 'Clauses contractuelles RGPD',
  lettre_justification_prix: 'Lettre de justification de prix',
  lettre_prolongation_delai: 'Lettre de prolongation de délai',
  lettre_demande_completude: 'Lettre de demande de complétude',
  formulaire_incident_rgpd: 'Formulaire d\'incident RGPD',
}

export function libelleDocument(slug: string): string {
  return LIBELLE_DOCUMENT[slug] ?? slug
}

// Modèle de prix :
// - Marché public généré : 9 EUR TVA incluse au FORFAIT (tous documents compris).
// - Courriers / mails types « tels quels » : gratuits.
// - Courrier / mail « sur mesure » (pré-rempli avec le profil) : 1 EUR par fichier.
export const PRIX_MARCHE_PUBLIC_EUR = 9
export const PRIX_COURRIER_SUR_MESURE_EUR = 1
