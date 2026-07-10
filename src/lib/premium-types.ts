// Types partagés MP Premium (miroir des colonnes Supabase).

export type TypeOrganisation = 'asbl' | 'commune' | 'intercommunale' | 'cpas' | 'autre'

export interface Organisation {
  id: string
  user_id: string
  nom: string
  type_organisation: TypeOrganisation
  adresse: string | null
  numero_bce: string | null
  pouvoir_adjudicateur: string | null
  representant_legal_nom: string | null
  representant_legal_fonction: string | null
  email_contact: string | null
  introduction_standard: string | null
  clause_rgpd_standard: string | null
  coordonnees_bancaires: string | null
}

// Champs éditables du profil (sans les colonnes techniques).
export type OrganisationInput = Omit<Organisation, 'id' | 'user_id'>

export interface Prestataire {
  id: string
  organisation_id: string
  categorie: string
  nom_entreprise: string
  contact_nom: string | null
  email: string | null
  adresse: string | null
  numero_bce_tva: string | null
  notes: string | null
}

export type PrestataireInput = Omit<Prestataire, 'id' | 'organisation_id'>

export type TypeAchat = 'fournitures' | 'services' | 'travaux'
export type StatutMarche = 'brouillon' | 'paye' | 'archive'

// Cycle de vie du marché public (Phase 9, SPEC_MP_WORKFLOW).
export type WorkflowEtape =
  | 'preparation'
  | 'consultation'
  | 'reception_offres'
  | 'comparatif'
  | 'attribution'
  | 'archive'

export const WORKFLOW_ETAPES: WorkflowEtape[] = [
  'preparation', 'consultation', 'reception_offres', 'comparatif', 'attribution', 'archive',
]

export const LIBELLE_ETAPE: Record<WorkflowEtape, string> = {
  preparation: 'Préparation',
  consultation: 'Consultation',
  reception_offres: 'Réception des offres',
  comparatif: 'Comparatif',
  attribution: 'Attribution',
  archive: 'Archives',
}

export interface CritereAttribution { critere: string; ponderation: number }

export interface Offre {
  id: string
  marche_id: string
  prestataire_id: string | null
  created_at: string
  nom_operateur: string
  montant_htva: number | null
  montant_tvac: number | null
  delai_execution: string | null
  date_reception: string | null
  conforme: boolean | null
  motif_non_retenu: string | null
  notes: string | null
  scores: Record<string, number> | null
  score_total: number | null
  preuve_storage_path: string | null
}

export type OffreInput = Omit<Offre, 'id' | 'created_at'>

export type CanalEnvoi = 'email' | 'courrier' | 'main_propre' | 'autre'
export type StatutEnvoi = 'a_envoyer' | 'envoye' | 'relance' | 'repondu' | 'sans_reponse'

export interface ConsultationEnvoi {
  id: string
  marche_id: string
  prestataire_id: string | null
  created_at: string
  destinataire_email: string | null
  destinataire_nom: string | null
  date_envoi: string | null
  canal: CanalEnvoi
  statut: StatutEnvoi
  notes: string | null
}

export type ConsultationEnvoiInput = Omit<ConsultationEnvoi, 'id' | 'created_at'>

export interface Marche {
  id: string
  organisation_id: string
  created_at: string
  statut: StatutMarche
  objet: string
  type_achat: TypeAchat
  montant_estime_htva: number
  procedure: string
  seuil: string | null
  nb_phases: number
  est_accord_cadre: boolean
  date_lancement: string | null
  date_limite_offres: string | null
  date_debut_execution: string | null
  duree_marche: string | null
  description_besoin: string | null
  criteres_attribution: CritereAttribution[] | null
  prestataires_selectionnes: string[] | null
  documents_selectionnes: string[] | null
  annexes_info: string | null
  stripe_payment_status: string | null
  montant_paye: number | null
  inclure_rgpd: boolean
  inclure_voies_recours: boolean
  // Phase 9 — cycle de vie
  workflow_etape: WorkflowEtape
  nb_offres_attendues: number | null
  prestataire_retenu_id: string | null
  justification_choix: string | null
  date_attribution: string | null
  lieu_decision: string | null
  dma_paye: boolean
  dma_stripe_payment_intent_id: string | null
  checklist_archives: Record<string, boolean> | null
}

// Champs fournis à la création (le reste a des valeurs par défaut en base).
export interface MarcheInput {
  organisation_id: string
  objet: string
  type_achat: TypeAchat
  montant_estime_htva: number
  procedure: string
  seuil: string | null
  date_lancement?: string | null
  date_limite_offres?: string | null
  date_debut_execution?: string | null
  duree_marche?: string | null
  description_besoin?: string | null
  criteres_attribution?: CritereAttribution[] | null
  prestataires_selectionnes?: string[] | null
  documents_selectionnes?: string[] | null
  inclure_rgpd?: boolean
  inclure_voies_recours?: boolean
}
