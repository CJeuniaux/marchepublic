# Fiche technique — marchépublic.be

_Mise à jour : 2026-07-14 · Version projet : 0.9.0 (MP Premium + workflow + paiement)_

## 1. Identité

- **Produit** : deux volets.
  1. **Diagnostic gratuit** : pré-diagnostic indépendant qui aide une ASBL belge à repérer si la question des marchés publics se pose pour un achat.
  2. **MP Premium** : espace compte payant pour préparer, piloter et documenter un marché public de bout en bout (CSC → consultation → offres → comparatif → attribution → archives).
- **Positionnement** : repère pédagogique et outil de préparation, **pas un avis juridique**.
- **Éditeur** : Nomad Impact.
- **Domaine** : marchepublic.be · **Langue** : fr-BE

## 2. Stack technique

| Couche | Choix |
|--------|-------|
| Build | Vite 5 (`tsc -b && vite build`) |
| UI | React 18 + TypeScript 5 |
| Routing | react-router-dom v7 (BrowserRouter) |
| CSS | Tailwind 3 |
| Animation | Framer Motion 11 |
| Icônes | lucide-react |
| Génération .docx | `docx` v9 (client-side, lazy-loaded) |
| Auth + données | Supabase (Auth email/mot de passe, Postgres + RLS, Storage, Edge Functions) |
| E-mails transactionnels | Brevo (API) |
| Paiement | Stripe Checkout (Live) + webhook |
| Hébergement front | Vercel (SPA, rewrites → index.html) |

## 3. Architecture applicative

SPA React avec react-router. Le diagnostic gratuit reste en état interne sur `/`, l'espace payant vit sous `/compte/*`.

### Routes principales
```
/                         Accueil + intro + diagnostic (état)
/login  /register         Auth Supabase
/compte                   Hub espace (profil, prestataires, courriers, marchés)
/compte/profil            Profil organisation (1 par utilisateur)
/compte/prestataires      Carnet de prestataires
/compte/courriers         Courriers/mails types (copiables + .docx)
/compte/marches/nouveau   Wizard de création (4 étapes)
/compte/marches/:id       Détail + cycle de vie (timeline)
/mentions-legales /confidentialite /cgu /cookies
```

### Zones protégées (ne pas modifier)
Diagnostic (`Diagnostic.tsx` : scoring, questions, flux, résultat), capture de leads (table `leads`, webhook Brevo), SEO (dossier `public/`, JSON-LD, sitemap, robots, redirections), ressources téléchargeables.

## 4. MP Premium — modèle fonctionnel

### Cycle de vie d'un marché public (6 étapes)
`preparation → consultation → reception_offres → comparatif → attribution → archive`

- **Préparation** : documents du marché + paiement (9 €).
- **Consultation** : modèle de demande d'offre + suivi des envois (canal/statut).
- **Réception des offres** : saisie des offres (HTVA, TVAC, délai, conformité) + dépôt de preuve (bucket privé `preuves`).
- **Comparatif** : notation /100 par critère, score global pondéré (ou classement au prix).
- **Attribution** : choix de l'adjudicataire, motivation, motifs de non-attribution, génération de la DMA.
- **Archives** : checklist de conservation + clôture (`statut = archive`).

### Tarification
- **Marché public complet** : 9 € TVA incluse, forfait (tous documents compris).
- **Document sur mesure / DMA** : 1 € TVA incluse par fichier.
- **Courriers/mails types « tels quels »** : gratuits.

### Génération de documents (client-side, `docx`)
- `generateMarcheDocx.ts` — récapitulatif CSC.
- `generateDmaDocx.ts` — Décision Motivée d'Attribution complète : pouvoir adjudicateur (BCE, contact), objet/procédure/dates/durée, critères + pondération (tableau), tableau des offres (HTVA/TVAC/délai/date/scores par critère), retenu + montants, motifs de non-attribution, bloc signature (lieu/date).

## 5. Base de données (Postgres / Supabase, RLS par utilisateur)

| Table | Rôle |
|-------|------|
| `organisations` | 1 par utilisateur (profil, RGPD type, coordonnées) |
| `prestataires` | carnet réutilisable (catégorie, contact, adresse, BCE/TVA) |
| `marches` | marché public : montant, procédure, dates, critères, documents, workflow_etape, attribution, checklist, champs Stripe |
| `offres` | offres reçues (HTVA, TVAC, délai, conformité, scores, motif non-retenu, preuve) |
| `consultations_envois` | trace des demandes d'offre (canal, statut) |
| `telechargements` | journal de téléchargement |
| `leads` | capture diagnostic (zone protégée) |

Storage : bucket privé **`preuves`** (chemin `organisation_id/marche_id/…`, policies par organisation).

Migrations SQL : `supabase/migrations/` (schéma premium, workflow, champs DMA, durcissement RLS leads).

### Hooks d'accès (src/hooks/)
`useOrganisation` · `usePrestataires` · `useMarches` / `useMarche` · `useOffres` · `useConsultationsEnvois` · `useProcedure`.

## 6. Paiement Stripe

- **`create-checkout`** (Edge Function) : crée une Checkout Session (mode `payment`, EUR), vérifie la propriété du marché sous RLS, métadonnées `marche_id` + `type` (`marche_public` | `dma`). JWT **activé**.
- **`stripe-webhook`** (Edge Function) : vérifie la signature Stripe, met à jour via service role (`statut='paye'` + passage en `consultation`, ou `dma_paye=true`). JWT **désactivé**.
- Secrets Supabase : `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, (optionnel) `STRIPE_PRICE_MARCHE_COMPLET` / `STRIPE_PRICE_DOC_PERSO`, `SITE_URL`.
- Retour front `?paye=1` → rechargement automatique du statut.
- Runbook : `docs/stripe-SETUP.md`.

## 7. Edge Functions (Deno)

| Fonction | Déclencheur | Rôle | JWT |
|----------|-------------|------|-----|
| `lead-notify` | Database Webhook INSERT `leads` | notification équipe + livraison ressource (Brevo) | OFF |
| `create-checkout` | appel front | crée la session de paiement Stripe | ON |
| `stripe-webhook` | webhook Stripe | enregistre le paiement | OFF |

## 8. Seuils & procédures (officiels 01/01/2026, Guide MP Wallonie)

| Seuil | Montant HTVA |
|-------|--------------|
| Faible montant | < 30 000 € |
| Publicité belge | ≥ 140 000 € |
| Européen fournitures/services | 216 000 € |
| Européen travaux | 5 404 000 € |

Procédures : `faible_montant`, `pnspp_belge`, `po_europeen` (mapping documents par procédure × type d'achat).

## 9. Design system

**Couleurs** : navy `#2E2348` · ink `#1C1534` · teal `#415338` · bleu `#2E5C8A` · aqua `#C8BEF5` (texte fond sombre seulement) · coral `#E63948` (CTA/sélection) · sun `#F4C48F` · cream `#FBF7F1` (fond) · sable `#F4E9D8` (cartes) · slate `#5E6B7D` · line `#E4D9CC`.

**Typo** : DM Serif Display (titres) · DM Sans (UI).
**Ombres** : card · float · coral · teal · elevated.
**Interdits marque** : pas de coq, symbole wallon, emblème régional/fédéral, ni couleurs évoquant un site officiel.

## 10. SEO (zone protégée)

Pages statiques `public/` servies avant le rewrite SPA. 8 URLs canoniques dans `sitemap.xml`, `robots.txt` `Allow: /`. JSON-LD : WebApplication, Organization, FAQPage, Article. Redirections 301 anti-cannibalisation dans `vercel.json`. Titre/description/canonical uniques, un seul H1, pas de tirets longs en prose, sources officielles citées.

## 11. Variables d'environnement

**Front (Vercel)**
```
VITE_SUPABASE_URL       = https://[projet].supabase.co
VITE_SUPABASE_ANON_KEY  = [clé anon publique]
```
**Edge Functions (secrets Supabase)** : `BREVO_API_KEY`, `SENDER_EMAIL`, `LEAD_NOTIFY_TO`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, (optionnel) price IDs, `SITE_URL`. La clé secrète Stripe ne doit jamais être exposée côté front.

## 12. Contraintes permanentes

- Ne pas toucher : diagnostic (scoring/questions/flux/résultat), leads, SEO, ressources téléchargeables.
- Ton : humain, prudent, pratique, pédagogique, non-juridique, vouvoiement.
- Jamais promettre un avis juridique ; toujours citer les sources officielles.
- Pas de tirets longs (—) en prose.
- Dire « marché public » en toutes lettres.

## 13. Build

`tsc -b && vite build` — passe sans erreur. Le module `docx` est lazy-loaded (chunk séparé, chargé uniquement à la génération de document).
