// Textes types « Description du besoin » pour les CSC (MP Premium).
// Rédigés par Claude Cowork — Juillet 2026. Variables {{...}} éditables par l'utilisateur.
import type { TypeAchat } from './premium-types'

export interface BesoinTemplate {
  slug: string
  label: string
  typeAchat: TypeAchat
  categorie: string       // aligné sur les catégories de prestataires (filtrage)
  variables: string[]
  texte: string
}

export const BESOIN_TEMPLATES: BesoinTemplate[] = [
  // SERVICES
  {
    slug: 'traiteur_evenementiel', label: 'Traiteur / événementiel', typeAchat: 'services', categorie: 'Traiteur',
    variables: ['nb_evenements', 'type_evenement', 'nb_personnes', 'date_ou_periode', 'lieu', 'regimes_alimentaires'],
    texte: `Le pouvoir adjudicateur souhaite confier un service de traiteur pour {{nb_evenements}} événement(s) de type {{type_evenement}}, réunissant environ {{nb_personnes}} personnes, le {{date_ou_periode}}, au lieu suivant : {{lieu}}. Le prestataire assurera la fourniture, la préparation et le service des repas et boissons, en tenant compte des régimes alimentaires spécifiques suivants : {{regimes_alimentaires}}. La gestion logistique complète (mise en place, service, débarrassage) est comprise dans la prestation. Les soumissionnaires détailleront leur proposition de menu, leur organisation sur site et leurs conditions tarifaires pour la prestation complète.`,
  },
  {
    slug: 'site_web', label: 'Refonte / création de site web', typeAchat: 'services', categorie: 'Informatique',
    variables: ['type_site', 'nb_pages_estime', 'fonctionnalites', 'cms', 'migration_existant', 'maintenance'],
    texte: `Le pouvoir adjudicateur envisage la réalisation d'un site web de type {{type_site}}, comprenant environ {{nb_pages_estime}} pages. Les fonctionnalités attendues incluent notamment : {{fonctionnalites}}. Le système de gestion de contenu (CMS) retenu sera {{cms}}. La reprise du contenu existant est prévue : {{migration_existant}} ; la maintenance après mise en ligne est incluse : {{maintenance}}. Les soumissionnaires détailleront leur approche technique, leur méthodologie de projet, les délais de réalisation envisagés et leurs références en matière de réalisations comparables.`,
  },
  {
    slug: 'application_saas', label: "Développement d'application / SaaS", typeAchat: 'services', categorie: 'Informatique',
    variables: ['objet_outil', 'utilisateurs_cibles', 'fonctionnalites_cles', 'hebergement', 'integrations'],
    texte: `Le pouvoir adjudicateur souhaite faire développer {{objet_outil}}, destiné à {{utilisateurs_cibles}}. Les fonctionnalités clés attendues comprennent : {{fonctionnalites_cles}}. La solution sera hébergée sur {{hebergement}} et devra s'intégrer aux systèmes existants suivants : {{integrations}}. Les soumissionnaires présenteront leur architecture technique, leur calendrier de développement, les modalités d'accompagnement au déploiement ainsi que les conditions de maintenance et de mise à jour applicables après la réception.`,
  },
  {
    slug: 'formation', label: 'Formation', typeAchat: 'services', categorie: 'Formation',
    variables: ['theme', 'public_cible', 'nb_participants', 'modalite', 'duree', 'certification'],
    texte: `Le pouvoir adjudicateur souhaite organiser une formation portant sur {{theme}}, destinée à {{public_cible}}. La formation réunira environ {{nb_participants}} participants et se déroulera en mode {{modalite}}, pour une durée totale de {{duree}}. La délivrance d'une certification à l'issue de la formation est prévue : {{certification}}. Les soumissionnaires détailleront le programme pédagogique, les qualifications des formateurs, les supports fournis aux participants et les modalités pratiques d'organisation et d'évaluation.`,
  },
  {
    slug: 'communication_graphisme', label: 'Communication / graphisme', typeAchat: 'services', categorie: 'Communication',
    variables: ['supports', 'volume', 'charte_existante', 'delais'],
    texte: `Le pouvoir adjudicateur souhaite confier la réalisation de supports de communication comprenant : {{supports}}, pour un volume estimé à {{volume}}. Une charte graphique existante est disponible : {{charte_existante}}. Les délais de livraison attendus sont les suivants : {{delais}}. Les soumissionnaires présenteront leur démarche créative, leur processus de validation des créations avec le pouvoir adjudicateur et leurs références en matière de projets similaires menés pour des organisations de taille ou de secteur comparables.`,
  },
  {
    slug: 'consultance_audit', label: 'Consultance / audit', typeAchat: 'services', categorie: 'Autre',
    variables: ['objet_mission', 'perimetre', 'duree_mission', 'livrables_attendus'],
    texte: `Le pouvoir adjudicateur souhaite faire réaliser une mission de {{objet_mission}}, portant sur le périmètre suivant : {{perimetre}}. La mission se déroulera sur une durée de {{duree_mission}}. Les livrables attendus à l'issue de la mission comprennent : {{livrables_attendus}}. Les soumissionnaires décriront leur méthodologie d'intervention, les profils et qualifications des consultants affectés à la mission, ainsi que leurs références en matière d'interventions similaires dans des organisations comparables.`,
  },
  {
    slug: 'nettoyage_entretien', label: 'Nettoyage / entretien', typeAchat: 'services', categorie: 'Nettoyage',
    variables: ['locaux', 'surface_m2', 'frequence', 'prestations_specifiques'],
    texte: `Le pouvoir adjudicateur souhaite confier l'entretien et le nettoyage de ses locaux situés à {{locaux}}, pour une surface totale d'environ {{surface_m2}} m². Les prestations seront assurées à la fréquence suivante : {{frequence}}. Des prestations spécifiques sont également attendues : {{prestations_specifiques}}. Les soumissionnaires détailleront leur plan d'organisation, les produits et équipements utilisés, les mesures de contrôle qualité et les modalités de communication en cas d'intervention exceptionnelle ou d'aléa.`,
  },
  {
    slug: 'maintenance_support', label: 'Maintenance / support', typeAchat: 'services', categorie: 'Informatique',
    variables: ['equipements_ou_systemes', 'niveau_service', 'duree_contrat'],
    texte: `Le pouvoir adjudicateur souhaite conclure un contrat de maintenance et de support technique portant sur les équipements et systèmes suivants : {{equipements_ou_systemes}}. Le niveau de service attendu, notamment en termes de délais d'intervention et de disponibilité, est défini comme suit : {{niveau_service}}. Le contrat est prévu pour une durée de {{duree_contrat}}. Les soumissionnaires décriront leur organisation d'intervention (astreinte, hotline, déplacement sur site), les modalités de suivi des incidents et les garanties apportées en matière de continuité de service.`,
  },
  {
    slug: 'traduction_redaction', label: 'Traduction / rédaction', typeAchat: 'services', categorie: 'Communication',
    variables: ['type_contenu', 'volume_mots_ou_pages', 'langues', 'delais'],
    texte: `Le pouvoir adjudicateur souhaite confier des prestations de {{type_contenu}} portant sur un volume estimé à {{volume_mots_ou_pages}}, dans les combinaisons linguistiques suivantes : {{langues}}. Les délais de livraison attendus pour chaque type de contenu sont : {{delais}}. Les soumissionnaires préciseront les qualifications et spécialisations de leurs traducteurs ou rédacteurs, leur processus de relecture et de contrôle qualité, ainsi que leurs tarifs unitaires selon le type de contenu et la combinaison linguistique concernée.`,
  },
  {
    slug: 'comptabilite_juridique', label: 'Comptabilité / juridique', typeAchat: 'services', categorie: 'Autre',
    variables: ['nature_prestation', 'perimetre', 'duree'],
    texte: `Le pouvoir adjudicateur souhaite confier des prestations de {{nature_prestation}}, portant sur le périmètre suivant : {{perimetre}}. Ces prestations seront assurées pour une durée de {{duree}}. Les soumissionnaires indiqueront les qualifications et l'expérience des intervenants, leur méthode de travail, les outils utilisés et les modalités pratiques de collaboration avec les services du pouvoir adjudicateur, notamment en matière de confidentialité et de transmission des documents.`,
  },
  {
    slug: 'transport_logistique', label: 'Transport / logistique', typeAchat: 'services', categorie: 'Autre',
    variables: ['nature_transport', 'volume_ou_frequence', 'zone', 'periode'],
    texte: `Le pouvoir adjudicateur souhaite confier des prestations de {{nature_transport}}, pour un volume ou une fréquence estimés à {{volume_ou_frequence}}, sur la zone géographique suivante : {{zone}}, durant la période {{periode}}. Les soumissionnaires décriront les moyens humains et matériels mis à disposition, les mesures prises pour garantir la ponctualité et la sécurité des transports, les conditions d'assurance applicables ainsi que les procédures en cas d'aléa ou d'incident.`,
  },
  {
    slug: 'location_materiel_salle', label: 'Location matériel / salle', typeAchat: 'services', categorie: 'Autre',
    variables: ['objet_location', 'quantite', 'periode', 'lieu'],
    texte: `Le pouvoir adjudicateur souhaite procéder à la location de {{objet_location}}, en quantité de {{quantite}}, pour la période suivante : {{periode}}, au lieu suivant : {{lieu}}. La prestation comprend la livraison, l'installation si nécessaire et la reprise du matériel en fin de période. Les soumissionnaires préciseront l'état et l'âge du matériel proposé, les conditions de remplacement en cas de panne ou de défaillance, ainsi que la répartition des responsabilités en cas de dommages.`,
  },

  // FOURNITURES
  {
    slug: 'materiel_informatique', label: 'Matériel informatique', typeAchat: 'fournitures', categorie: 'Informatique',
    variables: ['type_materiel', 'quantite', 'caracteristiques_min', 'licences', 'garantie'],
    texte: `Le pouvoir adjudicateur souhaite acquérir {{quantite}} unité(s) de {{type_materiel}} destinée(s) à équiper ses services. Les caractéristiques techniques minimales attendues sont les suivantes : {{caracteristiques_min}}. La fourniture inclut les licences logicielles suivantes : {{licences}}. Une garantie de {{garantie}} est exigée sur l'ensemble du matériel livré. Les soumissionnaires préciseront les marques et modèles proposés, les délais de livraison, les conditions de service après-vente disponibles en Belgique et les modalités de reprise ou de recyclage en fin de vie.`,
  },
  {
    slug: 'mobilier', label: 'Mobilier', typeAchat: 'fournitures', categorie: 'Autre',
    variables: ['type_mobilier', 'quantite', 'contraintes', 'livraison_montage'],
    texte: `Le pouvoir adjudicateur souhaite acquérir du mobilier de type {{type_mobilier}}, pour une quantité de {{quantite}} unités. Les contraintes spécifiques à respecter (dimensions, normes, finitions) sont les suivantes : {{contraintes}}. La livraison et le montage sur site sont prévus : {{livraison_montage}}. Les soumissionnaires fourniront des fiches techniques détaillées des produits proposés, préciseront les matériaux utilisés, les délais de livraison et de montage, ainsi que les conditions de garantie applicables.`,
  },
  {
    slug: 'fournitures_bureau', label: 'Fournitures de bureau', typeAchat: 'fournitures', categorie: 'Autre',
    variables: ['categories', 'volume_estime', 'frequence_livraison'],
    texte: `Le pouvoir adjudicateur souhaite s'approvisionner en fournitures de bureau et consommables, comprenant notamment les catégories suivantes : {{categories}}, pour un volume annuel estimé à {{volume_estime}}. Les livraisons seront assurées à la fréquence suivante : {{frequence_livraison}}. Les soumissionnaires proposeront un catalogue de produits avec tarifs unitaires et conditions de commande, en précisant les délais de livraison garantis, les quantités minimales de commande et les modalités de gestion des ruptures de stock.`,
  },
  {
    slug: 'equipement_audiovisuel', label: 'Équipement audiovisuel', typeAchat: 'fournitures', categorie: 'Autre',
    variables: ['type_equipement', 'quantite', 'caracteristiques', 'installation'],
    texte: `Le pouvoir adjudicateur souhaite acquérir {{quantite}} unité(s) d'équipements de type {{type_equipement}}. Les caractéristiques techniques attendues sont les suivantes : {{caracteristiques}}. L'installation du matériel sur site est prévue : {{installation}}. Les soumissionnaires préciseront les marques et modèles proposés, les délais de livraison et d'installation, les conditions de garantie et les services d'assistance technique disponibles, notamment pour la prise en main et la maintenance corrective.`,
  },
  {
    slug: 'vehicule', label: 'Véhicule', typeAchat: 'fournitures', categorie: 'Autre',
    variables: ['type_vehicule', 'usage', 'motorisation', 'duree_ou_achat'],
    texte: `Le pouvoir adjudicateur souhaite procéder à l'{{duree_ou_achat}} d'un véhicule de type {{type_vehicule}}, destiné à {{usage}}. La motorisation souhaitée est {{motorisation}}. Les soumissionnaires préciseront les caractéristiques techniques complètes du véhicule proposé, les délais de disponibilité, les conditions de garantie ou de contrat selon la formule retenue, ainsi que les services associés applicables (entretien, assistance, véhicule de remplacement).`,
  },

  // TRAVAUX
  {
    slug: 'renovation_locaux', label: 'Rénovation / aménagement', typeAchat: 'travaux', categorie: 'Travaux',
    variables: ['nature_travaux', 'surface_m2', 'lieu', 'contraintes_delai', 'normes'],
    texte: `Le pouvoir adjudicateur souhaite faire réaliser des travaux de {{nature_travaux}} dans ses locaux situés au {{lieu}}, pour une surface d'environ {{surface_m2}} m². Les contraintes de délai sont les suivantes : {{contraintes_delai}}. Les normes techniques et réglementaires applicables comprennent notamment : {{normes}}. Les soumissionnaires fourniront une description détaillée de leur méthode d'exécution, un planning prévisionnel, les mesures prises pour assurer la continuité d'activité pendant les travaux, ainsi que des références de chantiers comparables réalisés dans des bâtiments occupés.`,
  },
  {
    slug: 'travaux_techniques', label: 'Travaux techniques', typeAchat: 'travaux', categorie: 'Travaux',
    variables: ['type_technique', 'perimetre', 'mise_en_conformite'],
    texte: `Le pouvoir adjudicateur souhaite faire réaliser des travaux techniques de type {{type_technique}}, portant sur le périmètre suivant : {{perimetre}}. Une mise en conformité réglementaire est comprise dans le marché : {{mise_en_conformite}}. Les soumissionnaires détailleront les qualifications et agréments de leurs équipes, les normes et certifications applicables, la méthodologie d'exécution envisagée, les délais prévisionnels ainsi que les modalités de réception et de test des installations.`,
  },
  {
    slug: 'peinture_finitions', label: 'Peinture / finitions', typeAchat: 'travaux', categorie: 'Travaux',
    variables: ['locaux', 'surface_m2', 'contraintes'],
    texte: `Le pouvoir adjudicateur souhaite faire réaliser des travaux de peinture et de finitions dans les locaux suivants : {{locaux}}, pour une surface totale d'environ {{surface_m2}} m². Les contraintes particulières à prendre en compte sont les suivantes : {{contraintes}}. Les soumissionnaires préciseront les produits et teintes proposés, la méthode de préparation des surfaces, le planning d'intervention envisagé et les mesures prises pour limiter les nuisances (odeurs, poussières, accès) pendant la durée des travaux.`,
  },
  {
    slug: 'construction_gros_oeuvre', label: 'Construction / gros œuvre', typeAchat: 'travaux', categorie: 'Travaux',
    variables: ['objet', 'surface_ou_volume', 'lieu', 'phasage'],
    texte: `Le pouvoir adjudicateur souhaite faire réaliser {{objet}}, pour une surface ou un volume d'environ {{surface_ou_volume}}, sur le site suivant : {{lieu}}. Le projet sera exécuté selon le phasage suivant : {{phasage}}. Les soumissionnaires fourniront une note méthodologique détaillant leur organisation de chantier, les qualifications et références de leur équipe d'encadrement, un planning prévisionnel d'exécution et les mesures prises en matière de sécurité, de qualité d'exécution et de limitation des nuisances pour le voisinage.`,
  },
]

export function getTemplatesByType(type: TypeAchat): BesoinTemplate[] {
  return BESOIN_TEMPLATES.filter(t => t.typeAchat === type)
}

export function getTemplateBySlug(slug: string): BesoinTemplate | undefined {
  return BESOIN_TEMPLATES.find(t => t.slug === slug)
}

export function applyVariables(template: BesoinTemplate, values: Record<string, string>): string {
  return template.texte.replace(/\{\{(\w+)\}\}/g, (_, key) => values[key] ?? `{{${key}}}`)
}
