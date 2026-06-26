# SEO Checklist — Google Search Console — marchépublic.be

## URLs à inspecter et demander l'indexation

Après chaque déploiement, inspectez et demandez l'indexation de ces URLs dans GSC > Inspection d'URL :

| URL | Priorité | Statut cible |
|-----|----------|--------------|
| https://marchepublic.be/ | Critique | Indexée |
| https://marchepublic.be/asbl-et-marche-public/ | Haute | Indexée |
| https://marchepublic.be/seuils-marches-publics-asbl/ | Haute | Indexée |
| https://marchepublic.be/faq-marches-publics-asbl/ | Haute | Indexée |
| https://marchepublic.be/marche-public-asbl/ | Haute | Indexée |
| https://marchepublic.be/achat-subsidie-marche-public/ | Moyenne | Indexée |
| https://marchepublic.be/devis-ou-marche-public/ | Moyenne | Indexée |
| https://marchepublic.be/subvention-marche-public/ | Moyenne | Indexée |
| https://marchepublic.be/marche-public-site-web-asbl/ | Moyenne | Indexée |
| https://marchepublic.be/seuils-marche-public-asbl/ | Moyenne | Indexée |

Vérifiez aussi que le sitemap est soumis : GSC > Sitemaps > https://marchepublic.be/sitemap.xml

---

## Métriques à suivre chaque semaine (GSC > Performance)

| Métrique | Objectif semaine 1-4 | Objectif semaine 5-12 |
|----------|---------------------|----------------------|
| Clics totaux (28j) | Baseline établie | +20% par rapport au mois précédent |
| Impressions totales (28j) | Baseline établie | +40% (nouvelles pages indexées) |
| CTR moyen | Baseline établie | > 3% |
| Position moyenne | Baseline établie | Progression sur requêtes cibles |
| Pages indexées | 10/10 | 10/10 (surveiller les exclusions) |

Vérifiez chaque semaine dans GSC > Couverture qu'aucune page n'est exclue pour erreur 404, contenu dupliqué ou autre raison.

---

## Requêtes cibles à surveiller dans GSC > Performance > Requêtes

Filtrez par ces requêtes et notez la position chaque semaine :

### Requêtes principales (volume estimé moyen)
- `marché public ASBL`
- `ASBL marchés publics`
- `mon ASBL doit-elle faire un marché public`
- `achat subsidié marché public`
- `devis ou marché public`
- `seuils marchés publics Belgique`
- `30000 euros marché public`
- `subvention et marché public`
- `marché public association belge`

### Requêtes longue traîne à surveiller
- `ASBL soumise aux marchés publics`
- `critères pouvoir adjudicateur ASBL`
- `procédure négociée sans publication ASBL`
- `seuil marché public 2025 Belgique`
- `achat site web ASBL marché public`
- `marché public subvention Wallonie`
- `diagnostic marchés publics gratuit`
- `faq marchés publics ASBL`
- `qu'est-ce qu'un pouvoir adjudicateur ASBL`

### Requêtes branded
- `marchepublic.be`
- `marché public be`

---

## Actions à faire selon les données à J+30

### Si position moyenne > 20 sur les requêtes cibles

- Vérifiez que les pages sont correctement indexées (pas d'exclusion GSC)
- Renforcez le maillage interne : ajoutez des liens depuis la homepage vers les pages faibles
- Vérifiez la cohérence titre H1 / balise title / requête cible
- Envisagez d'enrichir le contenu des pages les moins performantes (ajouter 300-400 mots, des exemples concrets)
- Cherchez 2-3 backlinks depuis des fédérations d'ASBL belges ou des sites sectoriels (ASBL Guide, Mon Association, etc.)

### Si position moyenne entre 10 et 20

- Optimisez les balises title et meta description des pages concernées pour améliorer le CTR
- Ajoutez des données structurées si manquantes (FAQPage, BreadcrumbList)
- Vérifiez les Core Web Vitals (GSC > Expérience > Signaux web essentiels)
- Identifiez les requêtes qui génèrent des impressions sans clics et optimisez le snippet

### Si position moyenne < 10

- Comparez avec les SERPs réels pour les requêtes cibles
- Identifiez les pages en position 4-10 : elles sont les premières à optimiser pour passer en top 3
- Analysez les snippets enrichis affichés (FAQ, featured snippet) et vérifiez que vos données structurées sont correctement reconnues via GSC > Améliorations
- Envisagez d'ajouter des variantes de la requête dans les H2 des pages concernées

### Vérifications techniques à J+30

- [ ] Sitemap soumis et 10 URLs indexées
- [ ] Aucune erreur de couverture critique
- [ ] Données structurées sans erreur dans GSC > Améliorations > Données structurées
- [ ] FAQPage reconnue sur homepage, /asbl-et-marche-public/, /faq-marches-publics-asbl/
- [ ] Core Web Vitals : LCP < 2.5s, CLS < 0.1, INP < 200ms
- [ ] Pas de cannonicalisation erronée
- [ ] Mobile-friendly confirmé dans GSC > Expérience > Facilité d'utilisation sur mobile

---

## Sources officielles à mentionner dans les contenus

- Loi du 17 juin 2016 relative aux marchés publics (belglex.be)
- BOSA — Service Public Fédéral Stratégie et Appui : belgium.be/fr/economie/marches_publics
- Bulletin des adjudications : publicprocurement.be
- JOUE — Journal officiel de l'Union européenne pour les marchés européens
