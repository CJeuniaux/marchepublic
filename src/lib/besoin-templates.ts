// Textes types « description du besoin » insérables via boutons dans le wizard.
// Les champs `texte` sont à remplir (rédaction Cowork) — voir docs/besoin-templates-brief.md.
// `typeAchat` sert à proposer les bons boutons ; `categorie` sert à filtrer les prestataires.
import type { TypeAchat } from './premium-types'

export interface BesoinTemplate {
  slug: string
  label: string
  typeAchat: TypeAchat
  categorie: string       // aligné sur les catégories de prestataires
  texte: string           // à remplir (contient des {{variables}})
}

export const BESOIN_TEMPLATES: BesoinTemplate[] = [
  // SERVICES
  { slug: 'traiteur_evenementiel', label: 'Traiteur / événementiel', typeAchat: 'services', categorie: 'Traiteur', texte: '' },
  { slug: 'site_web', label: 'Site web', typeAchat: 'services', categorie: 'Informatique', texte: '' },
  { slug: 'application_saas', label: 'Application / SaaS', typeAchat: 'services', categorie: 'Informatique', texte: '' },
  { slug: 'formation', label: 'Formation', typeAchat: 'services', categorie: 'Formation', texte: '' },
  { slug: 'communication_graphisme', label: 'Communication / graphisme', typeAchat: 'services', categorie: 'Communication', texte: '' },
  { slug: 'consultance_audit', label: 'Consultance / audit', typeAchat: 'services', categorie: 'Autre', texte: '' },
  { slug: 'nettoyage_entretien', label: 'Nettoyage / entretien', typeAchat: 'services', categorie: 'Nettoyage', texte: '' },
  { slug: 'maintenance_support', label: 'Maintenance / support', typeAchat: 'services', categorie: 'Informatique', texte: '' },
  { slug: 'traduction_redaction', label: 'Traduction / rédaction', typeAchat: 'services', categorie: 'Communication', texte: '' },
  { slug: 'comptabilite_juridique', label: 'Comptabilité / juridique', typeAchat: 'services', categorie: 'Autre', texte: '' },
  { slug: 'transport_logistique', label: 'Transport / logistique', typeAchat: 'services', categorie: 'Autre', texte: '' },
  { slug: 'location_materiel_salle', label: 'Location matériel / salle', typeAchat: 'services', categorie: 'Autre', texte: '' },

  // FOURNITURES
  { slug: 'materiel_informatique', label: 'Matériel informatique', typeAchat: 'fournitures', categorie: 'Informatique', texte: '' },
  { slug: 'mobilier', label: 'Mobilier', typeAchat: 'fournitures', categorie: 'Autre', texte: '' },
  { slug: 'fournitures_bureau', label: 'Fournitures de bureau', typeAchat: 'fournitures', categorie: 'Autre', texte: '' },
  { slug: 'equipement_audiovisuel', label: 'Équipement audiovisuel', typeAchat: 'fournitures', categorie: 'Autre', texte: '' },
  { slug: 'vehicule', label: 'Véhicule', typeAchat: 'fournitures', categorie: 'Autre', texte: '' },

  // TRAVAUX
  { slug: 'renovation_locaux', label: 'Rénovation / aménagement', typeAchat: 'travaux', categorie: 'Travaux', texte: '' },
  { slug: 'travaux_techniques', label: 'Travaux techniques', typeAchat: 'travaux', categorie: 'Travaux', texte: '' },
  { slug: 'peinture_finitions', label: 'Peinture / finitions', typeAchat: 'travaux', categorie: 'Travaux', texte: '' },
  { slug: 'construction_gros_oeuvre', label: 'Construction / gros œuvre', typeAchat: 'travaux', categorie: 'Travaux', texte: '' },
]

export function templatesPourType(type: TypeAchat): BesoinTemplate[] {
  return BESOIN_TEMPLATES.filter(t => t.typeAchat === type)
}
