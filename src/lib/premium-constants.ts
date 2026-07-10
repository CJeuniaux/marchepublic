// Constantes partagées MP Premium : clause RGPD type, suggestions d'objet, jeu de démo.
import type { OrganisationInput, PrestataireInput, TypeAchat } from './premium-types'

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

export const DEMO_PRESTATAIRES: PrestataireInput[] = [
  { categorie: 'Informatique', nom_entreprise: 'DigitalWave SPRL', contact_nom: 'Marc Lefèvre', email: 'marc@digitalwave.be', adresse: 'Rue du Web 12, 5000 Namur', numero_bce_tva: 'BE0111.111.111', notes: '' },
  { categorie: 'Formation', nom_entreprise: 'FormaPro ASBL', contact_nom: 'Sophie Dubois', email: 'sophie@formapro.be', adresse: 'Chaussée de Liège 8, 5100 Jambes', numero_bce_tva: 'BE0222.222.222', notes: '' },
  { categorie: 'Nettoyage', nom_entreprise: 'CleanNet SA', contact_nom: 'Ahmed Ben Ali', email: 'contact@cleannet.be', adresse: 'Rue Propre 3, 5000 Namur', numero_bce_tva: 'BE0333.333.333', notes: '' },
  { categorie: 'Traiteur', nom_entreprise: 'Les Saveurs du Namurois', contact_nom: 'Julie Martin', email: 'julie@saveurs.be', adresse: 'Place du Marché 5, 5000 Namur', numero_bce_tva: 'BE0444.444.444', notes: '' },
  { categorie: 'Travaux', nom_entreprise: 'BâtiRénov SPRL', contact_nom: 'Pierre Lambert', email: 'pierre@batirenov.be', adresse: 'Rue des Artisans 20, 5300 Andenne', numero_bce_tva: 'BE0555.555.555', notes: '' },
  { categorie: 'Communication', nom_entreprise: 'Studio Kréa', contact_nom: 'Emma Verhoeven', email: 'hello@studiokrea.be', adresse: 'Rue Créative 7, 5000 Namur', numero_bce_tva: 'BE0666.666.666', notes: '' },
  { categorie: 'Autre', nom_entreprise: 'ConsultPlus', contact_nom: 'David Renard', email: 'david@consultplus.be', adresse: 'Boulevard du Nord 14, 5000 Namur', numero_bce_tva: 'BE0777.777.777', notes: '' },
]

// Compte(s) autorisé(s) à voir le bouton de démo / accès premium gratuit de test.
export const DEMO_EMAILS = ['hello@nomadimpact.org', 'marchepublic@nomadimpact.org']
