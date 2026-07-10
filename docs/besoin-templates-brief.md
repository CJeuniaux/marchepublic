# Brief Cowork — Textes types « Description du besoin » (MP Premium)

## Objectif
Rédiger, pour chaque cas de figure ci-dessous, un **paragraphe type de « description du besoin »** destiné à un cahier spécial des charges de marché public belge (ASBL).

## Consignes de rédaction (à respecter pour tous)
- Ton : administratif, clair, précis, professionnel. Vouvoiement neutre / impersonnel (« Le pouvoir adjudicateur souhaite… »).
- Longueur : 3 à 6 phrases.
- Utiliser les **variables** indiquées entre `{{ }}` telles quelles (elles seront remplacées automatiquement ou éditées par l'utilisateur).
- Le texte doit être **éditable ensuite** : rester générique là où l'utilisateur devra préciser.
- Pas de tirets longs (—). Pas de promesse juridique.
- Terminer si pertinent par la nature attendue des offres (ex. « Les soumissionnaires détailleront… »).

## Format de retour attendu (pour chaque cas)
```
slug: <slug exact ci-dessous>
texte: |
  <le paragraphe rédigé, avec les {{variables}}>
```

---

## Cas de figure par type d'achat

### SERVICES

1. **slug: `traiteur_evenementiel`** — Traiteur / événementiel
   Variables : `{{nb_evenements}}`, `{{nb_personnes}}`, `{{type_evenement}}`, `{{date_ou_periode}}`, `{{lieu}}`, `{{regimes_alimentaires}}`
   Exemple d'amorce attendu : « Le pouvoir adjudicateur souhaite confier un service de traiteur pour {{nb_evenements}} événement(s) de type {{type_evenement}}, réunissant environ {{nb_personnes}} personnes… »

2. **slug: `site_web`** — Refonte / création de site web
   Variables : `{{type_site}}` (vitrine, e-commerce, plateforme), `{{nb_pages_estime}}`, `{{fonctionnalites}}`, `{{cms}}`, `{{migration_existant}}` (oui/non), `{{maintenance}}` (oui/non)

3. **slug: `application_saas`** — Développement d'application / outil sur mesure / SaaS
   Variables : `{{objet_outil}}`, `{{utilisateurs_cibles}}`, `{{fonctionnalites_cles}}`, `{{hebergement}}`, `{{integrations}}`

4. **slug: `formation`** — Formation
   Variables : `{{theme}}`, `{{nb_participants}}`, `{{duree}}`, `{{modalite}}` (présentiel/distanciel/hybride), `{{certification}}` (oui/non), `{{public_cible}}`

5. **slug: `communication_graphisme`** — Communication / graphisme / identité visuelle
   Variables : `{{supports}}` (logo, charte, brochure, campagne), `{{volume}}`, `{{charte_existante}}` (oui/non), `{{delais}}`

6. **slug: `consultance_audit`** — Consultance / audit / accompagnement
   Variables : `{{objet_mission}}`, `{{perimetre}}`, `{{duree_mission}}`, `{{livrables_attendus}}`

7. **slug: `nettoyage_entretien`** — Nettoyage / entretien de locaux
   Variables : `{{surface_m2}}`, `{{locaux}}`, `{{frequence}}`, `{{prestations_specifiques}}` (vitres, désinfection…)

8. **slug: `maintenance_support`** — Maintenance / support technique
   Variables : `{{equipements_ou_systemes}}`, `{{niveau_service}}` (délais d'intervention), `{{duree_contrat}}`

9. **slug: `traduction_redaction`** — Traduction / rédaction
   Variables : `{{langues}}`, `{{volume_mots_ou_pages}}`, `{{type_contenu}}`, `{{delais}}`

10. **slug: `comptabilite_juridique`** — Prestations comptables / juridiques
    Variables : `{{nature_prestation}}`, `{{perimetre}}`, `{{duree}}`

11. **slug: `transport_logistique`** — Transport / logistique
    Variables : `{{nature_transport}}`, `{{volume_ou_frequence}}`, `{{zone}}`, `{{periode}}`

12. **slug: `location_materiel_salle`** — Location de matériel ou de salle
    Variables : `{{objet_location}}`, `{{quantite}}`, `{{periode}}`, `{{lieu}}`

### FOURNITURES

13. **slug: `materiel_informatique`** — Matériel informatique
    Variables : `{{type_materiel}}` (postes, portables, serveurs), `{{quantite}}`, `{{caracteristiques_min}}`, `{{licences}}`, `{{garantie}}`

14. **slug: `mobilier`** — Mobilier
    Variables : `{{type_mobilier}}`, `{{quantite}}`, `{{contraintes}}` (dimensions, normes), `{{livraison_montage}}`

15. **slug: `fournitures_bureau`** — Fournitures de bureau / consommables
    Variables : `{{categories}}`, `{{volume_estime}}`, `{{frequence_livraison}}`

16. **slug: `equipement_audiovisuel`** — Équipement audiovisuel / technique
    Variables : `{{type_equipement}}`, `{{quantite}}`, `{{caracteristiques}}`, `{{installation}}` (oui/non)

17. **slug: `vehicule`** — Véhicule (achat ou location longue durée)
    Variables : `{{type_vehicule}}`, `{{usage}}`, `{{motorisation}}`, `{{duree_ou_achat}}`

### TRAVAUX

18. **slug: `renovation_locaux`** — Rénovation / aménagement de locaux
    Variables : `{{nature_travaux}}`, `{{surface_m2}}`, `{{lieu}}`, `{{contraintes_delai}}`, `{{normes}}`

19. **slug: `travaux_techniques`** — Travaux techniques (électricité, HVAC, plomberie)
    Variables : `{{type_technique}}`, `{{perimetre}}`, `{{mise_en_conformite}}` (oui/non)

20. **slug: `peinture_finitions`** — Peinture / finitions
    Variables : `{{surface_m2}}`, `{{locaux}}`, `{{contraintes}}` (occupation des lieux, délais)

21. **slug: `construction_gros_oeuvre`** — Construction / gros œuvre
    Variables : `{{objet}}`, `{{surface_ou_volume}}`, `{{lieu}}`, `{{phasage}}`

---

## Ce que je fais ensuite
Tu me renvoies les textes au format demandé. Je les colle dans `src/lib/besoin-templates.ts`
et j'affiche des **boutons** à l'étape « Contenu » du wizard : un clic insère le texte
(éditable) dans la description du besoin. Le tri par type d'achat sert aussi à filtrer
automatiquement les prestataires par catégorie.
