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
