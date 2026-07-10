// Constantes partagées MP Premium : clause RGPD type, suggestions d'objet, jeu de démo.
import type {
  OrganisationInput, PrestataireInput, TypeAchat, WorkflowEtape,
  StatutMarche, CritereAttribution, StatutEnvoi, CanalEnvoi,
} from './premium-types'

export const RGPD_STANDARD = `Dans le cadre de l'exécution du présent marché, l'adjudicataire s'engage à traiter les données à caractère personnel conformément au Règlement (UE) 2016/679 (RGPD) et à la loi du 30 juillet 2018 relative à la protection des personnes physiques à l'égard des traitements de données à caractère personnel. L'adjudicataire agit en qualité de sous-traitant au sens de l'article 28 du RGPD et ne traite les données que sur instruction documentée du pouvoir adjudicateur, pour les seules finalités liées à l'exécution du marché. Il met en œuvre les mesures techniques et organisationnelles appropriées afin de garantir la sécurité et la confidentialité des données, veille à ce que les personnes autorisées à traiter les données soient soumises à une obligation de confidentialité, et ne recourt à aucun sous-traitant ultérieur sans autorisation écrite préalable du pouvoir adjudicateur. À l'issue de la prestation, l'adjudicataire restitue ou détruit les données selon les instructions du pouvoir adjudicateur et notifie à ce dernier, sans délai, toute violation de données à caractère personnel.`

// Suggestions d'objet de marché public par type d'achat.
export const SUGGESTIONS_OBJET: Record<TypeAchat, string[]> = {
  services: [
    "Refonte du site web de l'organisation",
    "Prestation de traiteur pour événements",
    "Mission de consultance et d'accompagnement",
    "Formation du personnel",
    "Nettoyage et entretien des locaux",
    "Prestations de communication et de graphisme",
  ],
  fournitures: [
    "Acquisition de matériel informatique",
    "Fourniture de mobilier de bureau",
    "Acquisition d'équipement audiovisuel",
    "Fourniture de consommables de bureau",
  ],
  travaux: [
    "Rénovation et aménagement de locaux",
    "Travaux de peinture et finitions",
    "Travaux techniques (électricité, HVAC)",
  ],
}

// Jeu de données de démonstration (pour peupler un compte de test).
export const DEMO_ORG: OrganisationInput = {
  nom: 'ASBL Nomad Impact (démo)',
  type_organisation: 'asbl',
  adresse: 'Avenue Cardinal Mercier 50, 5000 Namur',
  numero_bce: '1033.998.026',
  pouvoir_adjudicateur: "Le Conseil d'Administration de l'ASBL Nomad Impact",
  representant_legal_nom: 'Charlotte Jeuniaux',
  representant_legal_fonction: 'Administratrice déléguée',
  email_contact: 'marchepublic@nomadimpact.org',
  introduction_standard: "L'ASBL Nomad Impact, capacity builder digital au service des associations, lance le présent marché public afin de répondre à ses besoins opérationnels dans le respect de la réglementation applicable.",
  clause_rgpd_standard: RGPD_STANDARD,
  coordonnees_bancaires: 'BE00 0000 0000 0000',
}

// 3 prestataires par type d'activité (7 catégories).
export const DEMO_PRESTATAIRES: PrestataireInput[] = [
  // Informatique
  { categorie: 'Informatique', nom_entreprise: 'DigitalWave SPRL', contact_nom: 'Marc Lefèvre', email: 'marc@digitalwave.be', adresse: 'Rue du Web 12, 5000 Namur', numero_bce_tva: 'BE0111.111.111', notes: '' },
  { categorie: 'Informatique', nom_entreprise: 'WebNamur', contact_nom: 'Claire Dupont', email: 'claire@webnamur.be', adresse: 'Rue de Fer 30, 5000 Namur', numero_bce_tva: 'BE0111.222.333', notes: '' },
  { categorie: 'Informatique', nom_entreprise: 'CodeFactory SRL', contact_nom: 'Youssef Haddad', email: 'y.haddad@codefactory.be', adresse: 'Avenue de la Gare 4, 5100 Jambes', numero_bce_tva: 'BE0111.444.555', notes: '' },
  // Formation
  { categorie: 'Formation', nom_entreprise: 'FormaPro ASBL', contact_nom: 'Sophie Dubois', email: 'sophie@formapro.be', adresse: 'Chaussée de Liège 8, 5100 Jambes', numero_bce_tva: 'BE0222.222.222', notes: '' },
  { categorie: 'Formation', nom_entreprise: 'SkillUp', contact_nom: 'Thomas Girard', email: 'thomas@skillup.be', adresse: 'Rue Godefroid 22, 5000 Namur', numero_bce_tva: 'BE0222.333.444', notes: '' },
  { categorie: 'Formation', nom_entreprise: 'Académie Wallonie', contact_nom: 'Nathalie Piret', email: 'contact@academiewallonie.be', adresse: 'Boulevard d\'Herbatte 40, 5000 Namur', numero_bce_tva: 'BE0222.555.666', notes: '' },
  // Nettoyage
  { categorie: 'Nettoyage', nom_entreprise: 'CleanNet SA', contact_nom: 'Ahmed Ben Ali', email: 'contact@cleannet.be', adresse: 'Rue Propre 3, 5000 Namur', numero_bce_tva: 'BE0333.333.333', notes: '' },
  { categorie: 'Nettoyage', nom_entreprise: 'PropreService', contact_nom: 'Isabelle Renaud', email: 'i.renaud@propreservice.be', adresse: 'Rue des Bruyères 11, 5100 Wépion', numero_bce_tva: 'BE0333.444.555', notes: '' },
  { categorie: 'Nettoyage', nom_entreprise: 'Netstar SPRL', contact_nom: 'Marek Nowak', email: 'marek@netstar.be', adresse: 'Chaussée de Waterloo 88, 5000 Namur', numero_bce_tva: 'BE0333.666.777', notes: '' },
  // Traiteur
  { categorie: 'Traiteur', nom_entreprise: 'Les Saveurs du Namurois', contact_nom: 'Julie Martin', email: 'julie@saveurs.be', adresse: 'Place du Marché 5, 5000 Namur', numero_bce_tva: 'BE0444.444.444', notes: '' },
  { categorie: 'Traiteur', nom_entreprise: 'TableFine', contact_nom: 'Gérard Colin', email: 'gerard@tablefine.be', adresse: 'Rue Basse Marcelle 14, 5000 Namur', numero_bce_tva: 'BE0444.555.666', notes: '' },
  { categorie: 'Traiteur', nom_entreprise: 'BioTraiteur', contact_nom: 'Amélie Fontaine', email: 'amelie@biotraiteur.be', adresse: 'Rue de Bruxelles 60, 5000 Namur', numero_bce_tva: 'BE0444.777.888', notes: '' },
  // Travaux
  { categorie: 'Travaux', nom_entreprise: 'BâtiRénov SPRL', contact_nom: 'Pierre Lambert', email: 'pierre@batirenov.be', adresse: 'Rue des Artisans 20, 5300 Andenne', numero_bce_tva: 'BE0555.555.555', notes: '' },
  { categorie: 'Travaux', nom_entreprise: 'ConstruWal SA', contact_nom: 'Fabrice Léonard', email: 'f.leonard@construwal.be', adresse: 'Zoning industriel 3, 5100 Naninne', numero_bce_tva: 'BE0555.666.777', notes: '' },
  { categorie: 'Travaux', nom_entreprise: 'RénoPlus', contact_nom: 'Sarah Wauters', email: 'sarah@renoplus.be', adresse: 'Rue de la Croix 9, 5000 Namur', numero_bce_tva: 'BE0555.888.999', notes: '' },
  // Communication
  { categorie: 'Communication', nom_entreprise: 'Studio Kréa', contact_nom: 'Emma Verhoeven', email: 'hello@studiokrea.be', adresse: 'Rue Créative 7, 5000 Namur', numero_bce_tva: 'BE0666.666.666', notes: '' },
  { categorie: 'Communication', nom_entreprise: 'PixelCom', contact_nom: 'Lucas Moreau', email: 'lucas@pixelcom.be', adresse: 'Rue Saint-Nicolas 25, 5000 Namur', numero_bce_tva: 'BE0666.777.888', notes: '' },
  { categorie: 'Communication', nom_entreprise: 'Agence Mosane', contact_nom: 'Céline Delvaux', email: 'celine@agencemosane.be', adresse: 'Quai de Meuse 18, 5000 Namur', numero_bce_tva: 'BE0666.999.000', notes: '' },
  // Autre
  { categorie: 'Autre', nom_entreprise: 'ConsultPlus', contact_nom: 'David Renard', email: 'david@consultplus.be', adresse: 'Boulevard du Nord 14, 5000 Namur', numero_bce_tva: 'BE0777.777.777', notes: '' },
  { categorie: 'Autre', nom_entreprise: 'Expert Bénévolat', contact_nom: 'Martine Close', email: 'martine@expertbenevolat.be', adresse: 'Rue Rogier 5, 5000 Namur', numero_bce_tva: 'BE0777.888.999', notes: '' },
  { categorie: 'Autre', nom_entreprise: 'Gestion ASBL Services', contact_nom: 'Olivier Berger', email: 'olivier@gestionasbl.be', adresse: 'Avenue Golenvaux 2, 5000 Namur', numero_bce_tva: 'BE0777.111.222', notes: '' },
]

// ============================================================
// Jeu de marchés publics de démonstration (couvre toutes les étapes).
// Les prestataires sont référencés par index au sein de leur catégorie.
// ============================================================
export interface DemoOffre {
  presIndex: number | null   // index dans les prestataires de la catégorie, ou null = saisie libre
  nomLibre?: string
  montant_htva: number
  conforme: boolean
  joursDepuisReception: number
  scores?: Record<string, number>
  score_total?: number
}
export interface DemoEnvoi {
  presIndex: number
  statut: StatutEnvoi
  canal?: CanalEnvoi
}
export interface DemoMarche {
  objet: string
  type_achat: TypeAchat
  categorie: string          // pour piocher les prestataires
  montant: number
  description: string
  workflow_etape: WorkflowEtape
  statut?: StatutMarche
  limiteJours: number        // date_limite_offres = aujourd'hui + limiteJours (négatif = échue)
  criteres?: CritereAttribution[]
  envois?: DemoEnvoi[]
  offres?: DemoOffre[]
  retenuIndex?: number       // index du prestataire retenu
  justification?: string
  checklistComplete?: boolean
}

const CRIT_STD: CritereAttribution[] = [
  { critere: 'Prix', ponderation: 50 },
  { critere: 'Qualité technique', ponderation: 30 },
  { critere: 'Délai', ponderation: 20 },
]

export const DEMO_MARCHES: DemoMarche[] = [
  // 1. Services — faible montant — en PRÉPARATION (brouillon tout juste créé)
  {
    objet: 'Prestation de traiteur pour l\'assemblée générale',
    type_achat: 'services', categorie: 'Traiteur', montant: 4200,
    description: 'Fourniture d\'un service traiteur pour environ 80 personnes lors de l\'assemblée générale annuelle : accueil café, lunch sandwichs et boissons.',
    workflow_etape: 'preparation', limiteJours: 21,
  },
  // 2. Fournitures — faible montant — en CONSULTATION (envois partis, délai à venir)
  {
    objet: 'Acquisition de matériel informatique pour l\'équipe',
    type_achat: 'fournitures', categorie: 'Informatique', montant: 9800,
    description: 'Acquisition de 6 ordinateurs portables et 2 écrans externes pour l\'équipe permanente, avec garantie et installation.',
    workflow_etape: 'consultation', limiteJours: 12,
    envois: [
      { presIndex: 0, statut: 'envoye' },
      { presIndex: 1, statut: 'envoye' },
      { presIndex: 2, statut: 'relance' },
    ],
  },
  // 3. Services — faible montant — RÉCEPTION DES OFFRES (délai échu, 3 offres reçues)
  {
    objet: 'Refonte du site web de l\'organisation',
    type_achat: 'services', categorie: 'Informatique', montant: 14500,
    description: 'Refonte complète du site web : nouvelle charte graphique, CMS, version mobile, accessibilité et hébergement pour 1 an.',
    workflow_etape: 'reception_offres', limiteJours: -4,
    offres: [
      { presIndex: 0, montant_htva: 13800, conforme: true, joursDepuisReception: 8 },
      { presIndex: 1, montant_htva: 12200, conforme: true, joursDepuisReception: 6 },
      { presIndex: 2, montant_htva: 15900, conforme: false, joursDepuisReception: 3 },
    ],
  },
  // 4. Services — belge — COMPARATIF (critères + scores)
  {
    objet: 'Formation du personnel aux outils numériques',
    type_achat: 'services', categorie: 'Formation', montant: 46000,
    description: 'Programme de formation sur 6 mois : bureautique avancée, cybersécurité, outils collaboratifs. 4 sessions par thème pour 25 personnes.',
    workflow_etape: 'comparatif', limiteJours: -10,
    criteres: CRIT_STD,
    offres: [
      { presIndex: 0, montant_htva: 44500, conforme: true, joursDepuisReception: 14, scores: { 'Prix': 80, 'Qualité technique': 85, 'Délai': 70 }, score_total: 79.5 },
      { presIndex: 1, montant_htva: 41000, conforme: true, joursDepuisReception: 12, scores: { 'Prix': 90, 'Qualité technique': 70, 'Délai': 80 }, score_total: 82 },
      { presIndex: 2, montant_htva: 48000, conforme: true, joursDepuisReception: 11, scores: { 'Prix': 65, 'Qualité technique': 90, 'Délai': 75 }, score_total: 74.5 },
    ],
  },
  // 5. Travaux — belge — ATTRIBUTION (offre retenue + justification)
  {
    objet: 'Rénovation et aménagement des bureaux',
    type_achat: 'travaux', categorie: 'Travaux', montant: 88000,
    description: 'Rénovation de 200 m² de bureaux : cloisons, peinture, sol, électricité et éclairage LED. Chantier à réaliser hors périodes d\'occupation.',
    workflow_etape: 'attribution', limiteJours: -20,
    criteres: CRIT_STD,
    offres: [
      { presIndex: 0, montant_htva: 84000, conforme: true, joursDepuisReception: 25, scores: { 'Prix': 78, 'Qualité technique': 88, 'Délai': 80 }, score_total: 81.4 },
      { presIndex: 1, montant_htva: 91500, conforme: true, joursDepuisReception: 24, scores: { 'Prix': 62, 'Qualité technique': 82, 'Délai': 78 }, score_total: 71.2 },
      { presIndex: 2, montant_htva: 86500, conforme: true, joursDepuisReception: 22, scores: { 'Prix': 72, 'Qualité technique': 75, 'Délai': 70 }, score_total: 72.5 },
    ],
    retenuIndex: 0,
    justification: 'L\'offre de BâtiRénov SPRL est régulière et obtient le meilleur score global (81,4/100). Elle présente le meilleur équilibre entre le prix, la qualité technique proposée (matériaux et références de chantiers comparables) et le respect du délai imposé hors périodes d\'occupation.',
  },
  // 6. Services — belge — ARCHIVÉ (cycle terminé, checklist complète)
  {
    objet: 'Prestations de communication et campagne de sensibilisation',
    type_achat: 'services', categorie: 'Communication', montant: 32000,
    description: 'Conception et déploiement d\'une campagne de sensibilisation : identité visuelle, supports print et digitaux, animation des réseaux sociaux sur 3 mois.',
    workflow_etape: 'archive', statut: 'archive', limiteJours: -60,
    criteres: CRIT_STD,
    offres: [
      { presIndex: 0, montant_htva: 30500, conforme: true, joursDepuisReception: 55, scores: { 'Prix': 85, 'Qualité technique': 88, 'Délai': 82 }, score_total: 85.3 },
      { presIndex: 1, montant_htva: 33000, conforme: true, joursDepuisReception: 54, scores: { 'Prix': 72, 'Qualité technique': 80, 'Délai': 75 }, score_total: 75 },
    ],
    retenuIndex: 0,
    justification: 'L\'offre de Studio Kréa est économiquement la plus avantageuse au regard des critères annoncés (score global 85,3/100), avec une proposition créative aboutie et un planning conforme.',
    checklistComplete: true,
  },
]

// Compte(s) autorisé(s) à voir le bouton de démo / accès premium gratuit de test.
export const DEMO_EMAILS = ['hello@nomadimpact.org', 'marchepublic@nomadimpact.org', 'info@nomadimpact.org', 'charshow@gmail.com']
