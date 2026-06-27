# Fiche technique — marchépublic.be

_Mise à jour : 2026-06-27 · Version projet : 0.3.0_

## 1. Identité

- **Produit** : outil de pré-diagnostic indépendant. Aide une ASBL belge à repérer si la question des marchés publics se pose pour un achat.
- **Positionnement** : premier repère pédagogique, pas avis juridique.
- **Éditeur** : Nomad Impact.
- **Domaine** : marchepublic.be
- **Langue** : fr-BE

## 2. Stack technique

| Couche | Choix |
|--------|-------|
| Build | Vite 5 |
| UI | React 18 + TypeScript 5 |
| CSS | Tailwind 3 |
| Animation | Framer Motion 11 |
| Icônes | lucide-react |
| Hébergement | Vercel |
| Capture lead | Supabase REST (fetch direct, pas de SDK) |

Scripts :
- `npm run dev` — serveur Vite
- `npm run build` — `tsc -b && vite build`
- `npm run preview` — preview build

## 3. Architecture app

SPA mono-page. Routing par état React, pas de react-router.

```
type Page = 'home' | 'diagnostic' | 'mentions-legales' | 'confidentialite'
```

Diagnostic tourne dans l'état SPA, pas d'URL dédiée.

### Fichiers source (src/, ~3000 lignes)

| Fichier | Lignes | Rôle |
|---------|--------|------|
| pages/Diagnostic.tsx | 828 | Logique diagnostic, scoring, bandes, recommandations |
| pages/Home.tsx | 641 | Page accueil, hero, FAQ, footer |
| pages/MarchePublic.tsx | 480 | Page contenu marchés publics |
| components/Graphics.tsx | 293 | SVG, illustrations, LogoMark |
| components/LeadGateModal.tsx | 189 | Modal capture lead |
| pages/Confidentialite.tsx | 133 | RGPD |
| pages/MentionsLegales.tsx | 110 | Mentions légales |
| components/ContactForm.tsx | 105 | Formulaire contact |
| components/Intro.tsx | 88 | Intro diagnostic |
| lib/leads.ts | 79 | POST lead vers Supabase |
| App.tsx | 40 | Router état |

### Logique diagnostic (ne pas modifier)

`computeScore` · `BANDS` · `bandFor` · `nomadTier` · `explain` · recommandation docs/sources. Scoring, questions, flux, calcul résultat : intouchés.

## 4. Capture lead

`src/lib/leads.ts` → POST `${baseUrl}/rest/v1/leads`.

Env :
```
VITE_SUPABASE_URL = https://[projet].supabase.co
VITE_SUPABASE_ANON_KEY = [clé anon publique]
```

URL normalisée : strip trailing slash + suffixe `/rest/v1` si présent (fix PGRST125).

## 5. Design system

### Couleurs

| Token | Hex | Usage |
|-------|-----|-------|
| navy | #2E2348 | fond sombre, titres |
| aubergine | #3B3171 | aubergine moyen (réserve) |
| ink | #1C1534 | footer |
| teal | #415338 | checks, accents verts |
| bleu | #2E5C8A | liens |
| aqua | #C8BEF5 | texte sur fond sombre uniquement |
| coral | #E63948 | CTA principal, sélection active |
| sun | #F4C48F | badges pédagogie |
| cream | #FBF7F1 | fond page |
| sable | #F4E9D8 | fond cartes |
| slate | #5E6B7D | texte secondaire |
| gris | #A8A096 | détails secondaires |
| line | #E4D9CC | bordure chaude |

### Typo

- Display/titres : DM Serif Display
- Body/UI : DM Sans

### Ombres

card · float · coral · teal · elevated

### Interdits marque

Pas de coq, symbole wallon, emblème régional/fédéral, couleurs faisant croire à site officiel. aqua = texte fond sombre seulement.

## 6. SEO

### Pages statiques (public/, servies avant rewrite SPA Vercel)

| URL | Rôle | Priorité sitemap |
|-----|------|-----------------|
| /asbl-et-marche-public/ | pilier | 0.9 |
| /seuils-marches-publics-asbl/ | seuils + tableau officiel | 0.9 |
| /faq-marches-publics-asbl/ | FAQ 15 questions | 0.8 |
| /achat-subsidie-marche-public/ | support | 0.8 |
| /devis-ou-marche-public/ | support | 0.8 |
| /subvention-marche-public/ | support | 0.7 |
| /marche-public-site-web-asbl/ | support | 0.7 |

CSS partagé : `public/seo.css`.

### Redirections 301 (vercel.json)

- /marche-public-asbl/ → /asbl-et-marche-public/
- /seuils-marche-public-asbl/ → /seuils-marches-publics-asbl/

Motif : anti-cannibalisation, paires intent identique fusionnées vers page canonique.

### Données structurées (JSON-LD)

| Schema | Où |
|--------|-----|
| WebApplication | homepage (index.html) |
| Organization | homepage |
| FAQPage | homepage + /asbl-et-marche-public/ + /seuils-marches-publics-asbl/ + /faq-marches-publics-asbl/ + pages support |
| Article | toutes pages SEO |

### Technique

- sitemap.xml : 8 URLs canoniques, homepage incluse, URLs redirigées retirées
- robots.txt : `Allow: /` + référence sitemap
- Chaque page : title unique, meta description unique, canonical self-ref, OG, Twitter card, 1 seul H1
- Pas de tirets longs (—) en prose
- Sources officielles citées : loi 17 juin 2016, BOSA belgium.be, publicprocurement.be

### Config Vercel

```json
{
  "redirects": [ ... 4 redirects 301 ... ],
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

Fichiers statiques prioritaires sur rewrite wildcard. Rewrite ne tire que si aucun fichier statique match.

## 7. Ressources téléchargeables (public/resources/)

PDF + DOCX : acheter-sous-30000 · asbl-subsidiee-obligations · au-dela-de-30000 · cadrer-projet-digital · comparer-prestataires · template-demande-de-prix.

## 8. Contraintes permanentes

- Pas toucher : logique diagnostic, scoring, questions, flux, calcul résultat, routing, copy légale
- Pas redesign, pas changement layout
- Ton : humain, prudent, pratique, pédagogique, non-juridique, vouvoiement
- Jamais promettre avis juridique
- Toujours citer sources officielles

## 9. Build

`tsc -b && vite build` — passe sans erreur.

Sortie : `dist/index.html` (~6 kB) · CSS ~30 kB (gzip 6.5 kB) · JS ~382 kB (gzip 115 kB).
