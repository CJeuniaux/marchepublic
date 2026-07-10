// Manifeste des courriers / mails / modèles types (gratuits, téléchargeables tels quels).
// Générés depuis les documents de référence. Version « sur mesure » (pré-remplie) : 1 EUR/fichier (à venir).
export interface CourrierType { slug: string; label: string; categorie: string; file: string }
export const COURRIERS_TYPES: CourrierType[] = [
  { slug: "email-invitation-offre-pnspp", label: "Email d'invitation à déposer une offre (PNSPP e-Proc)", categorie: "Belge", file: "/courriers-types/email-invitation-offre-pnspp.docx" },
  { slug: "faible-montant-invitation-offre", label: "Invitation à déposer offre (faible montant)", categorie: "Faible montant", file: "/courriers-types/faible-montant-invitation-offre.docx" },
  { slug: "faible-montant-lettre-notification", label: "Lettre de notification (faible montant)", categorie: "Faible montant", file: "/courriers-types/faible-montant-lettre-notification.docx" },
  { slug: "faible-montant-info-non-retenus", label: "Information aux soumissionnaires non retenus (faible montant)", categorie: "Faible montant", file: "/courriers-types/faible-montant-info-non-retenus.docx" },
  { slug: "faible-montant-descriptif", label: "Descriptif de marché de faible montant", categorie: "Faible montant", file: "/courriers-types/faible-montant-descriptif.docx" },
  { slug: "lettre-notification", label: "Lettre de notification d'attribution", categorie: "Divers", file: "/courriers-types/lettre-notification.docx" },
  { slug: "info-belge-inf-140k", label: "Lettre d'information (marchés belges < 140.000 EUR)", categorie: "Belge", file: "/courriers-types/info-belge-inf-140k.docx" },
  { slug: "info-belge-sup-140k", label: "Lettre d'information (marchés belges > 140.000 EUR)", categorie: "Belge", file: "/courriers-types/info-belge-sup-140k.docx" },
  { slug: "info-europeens", label: "Lettre d'information (marchés européens)", categorie: "Européen", file: "/courriers-types/info-europeens.docx" },
  { slug: "dma-belge-1phase", label: "Modèle DMA (marchés belges, 1 phase)", categorie: "DMA", file: "/courriers-types/dma-belge-1phase.docx" },
  { slug: "dma-europeen-1phase", label: "Modèle DMA (marchés européens, 1 phase)", categorie: "DMA", file: "/courriers-types/dma-europeen-1phase.docx" },
  { slug: "dma-pnspp", label: "Modèle DMA (procédure négociée sans publication)", categorie: "DMA", file: "/courriers-types/dma-pnspp.docx" },
  { slug: "dma-faible-montant-avec-offre", label: "Modèle DMA (faible montant, avec offre)", categorie: "DMA", file: "/courriers-types/dma-faible-montant-avec-offre.docx" },
  { slug: "dma-faible-montant-sans-offre", label: "Modèle DMA (faible montant, sans offre)", categorie: "DMA", file: "/courriers-types/dma-faible-montant-sans-offre.docx" },
  { slug: "lettre-justification-prix", label: "Lettre de demande de justification de prix", categorie: "Divers", file: "/courriers-types/lettre-justification-prix.docx" },
  { slug: "lettre-prolongation-delai", label: "Lettre de prolongation du délai d'engagement", categorie: "Divers", file: "/courriers-types/lettre-prolongation-delai.docx" },
  { slug: "lettre-demande-completude", label: "Lettre de demande de complétude de l'offre", categorie: "Divers", file: "/courriers-types/lettre-demande-completude.docx" },
  { slug: "annexe-voies-recours", label: "Annexe voies de recours", categorie: "Divers", file: "/courriers-types/annexe-voies-recours.docx" },
  { slug: "rgpd-clauses-contractuelles", label: "Clauses contractuelles types RGPD", categorie: "RGPD", file: "/courriers-types/rgpd-clauses-contractuelles.docx" },
  { slug: "rgpd-formulaire-incident", label: "Formulaire de déclaration d'incident RGPD", categorie: "RGPD", file: "/courriers-types/rgpd-formulaire-incident.docx" },
  { slug: "rgpd-contrat-sous-traitance", label: "Contrat de sous-traitance RGPD", categorie: "RGPD", file: "/courriers-types/rgpd-contrat-sous-traitance.docx" },
]
