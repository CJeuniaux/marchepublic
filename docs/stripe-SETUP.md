# Stripe — mise en service (runbook)

Deux Edge Functions Supabase gèrent le paiement :

- `create-checkout` — crée la session de paiement Stripe (appelée par le front).
- `stripe-webhook` — reçoit la confirmation de Stripe et met à jour le marché public.

## 1. Secrets à déclarer (Supabase > Edge Functions > Secrets)

| Secret | Valeur | Utilisé par |
|---|---|---|
| `STRIPE_SECRET_KEY` | `sk_live_...` | les 2 fonctions |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` (secret de signature du webhook) | `stripe-webhook` |
| `STRIPE_PRICE_MARCHE_PUBLIC` | `price_...` (9 EUR) — optionnel | `create-checkout` |
| `STRIPE_PRICE_DMA` | `price_...` (1 EUR) — optionnel | `create-checkout` |
| `SITE_URL` | `https://marchepublic.be` — optionnel | `create-checkout` |

`SUPABASE_URL`, `SUPABASE_ANON_KEY` et `SUPABASE_SERVICE_ROLE_KEY` sont fournis automatiquement.

> Les `PRICE_*` sont optionnels : sans eux, la fonction crée la ligne de paiement à la
> volée (9 EUR / 1 EUR). Les renseigner permet un reporting plus propre dans Stripe.

## 2. Déploiement des fonctions

Via le dashboard Supabase (Edge Functions > Deploy a new function), coller le contenu de :
- `supabase/functions/create-checkout/index.ts`
- `supabase/functions/stripe-webhook/index.ts`

Ou en CLI : `supabase functions deploy create-checkout` puis `supabase functions deploy stripe-webhook`.

## 3. Réglage JWT

- `create-checkout` : laisser la vérification JWT **activée** (l'appel vient du front авторisé).
- `stripe-webhook` : **désactiver** la vérification JWT (Details > "Verify JWT" = OFF).
  Stripe n'envoie pas de JWT Supabase ; la sécurité est assurée par la **signature Stripe**.

## 4. URL du webhook (à vérifier côté Stripe)

L'endpoint webhook Stripe doit pointer vers :
```
https://<PROJECT_REF>.supabase.co/functions/v1/stripe-webhook
```
Événement écouté : `checkout.session.completed`.

## 5. Test de bout en bout (en Live = vrai débit)

1. Créer un marché public, aller sur son détail, cliquer **« Payer et générer »** (9 EUR).
2. Payer sur la page Stripe. Retour sur `/compte/marches/:id?paye=1`.
3. Le webhook passe `statut = 'paye'` et `workflow_etape = 'consultation'` (la page se
   rafraîchit automatiquement quelques secondes).
4. Vérifier dans Stripe > Paiements que le paiement apparaît, puis **rembourser** le test.

En cas de souci : Supabase > Edge Functions > `stripe-webhook` > Logs (signature,
erreurs DB) et Stripe > Developers > Webhooks (statut des livraisons, "Resend").
