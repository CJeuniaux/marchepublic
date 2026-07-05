# Brique email transactionnelle — lead-notify (runbook)

Décision 11. Périmètre strict : notification interne + livraison au prospect à chaque
INSERT dans `leads`. Le front ne change pas (download navigateur immédiat conservé,
l'email de livraison est un filet en plus).

> ⚠️ Ces étapes nécessitent l'accès au projet Supabase + une clé Brevo. Elles ne peuvent
> pas être exécutées depuis l'agent (aucun accès infra en session). Exécute-les toi-même
> et colle les résultats (captures des 2 emails, sortie du test GET).

---

## Étape 1 — SÉCURITÉ D'ABORD : verrouiller la RLS

### 1a. Test AVANT (la clé anon doit-elle pouvoir lire ?)
Remplace `URL` et `ANON_KEY` par tes valeurs (Vercel > Env `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`) :

```bash
curl -s "https://<PROJECT_REF>.supabase.co/rest/v1/leads?select=*&limit=5" \
  -H "apikey: <ANON_KEY>" \
  -H "Authorization: Bearer <ANON_KEY>"
```

- ✅ **Attendu (sécurisé)** : `[]` (0 ligne) — RLS active, aucune policy SELECT pour anon.
- ❌ **Problème** : si des lignes reviennent → la clé anon peut lire les leads. Applique 1b.

Test écriture non autorisée (doit échouer) :
```bash
# UPDATE via anon — doit renvoyer 0 ligne modifiée / erreur
curl -s -X PATCH "https://<PROJECT_REF>.supabase.co/rest/v1/leads?email=eq.test@exemple.be" \
  -H "apikey: <ANON_KEY>" -H "Authorization: Bearer <ANON_KEY>" \
  -H "Content-Type: application/json" -d '{"band":"hack"}'
```

### 1b. Correctif RLS
Exécute `supabase/migrations/20260705_leads_rls_hardening.sql` dans **Supabase > SQL Editor**.
Il : active la RLS, supprime toute policy existante, révoque tout pour `anon` sauf `INSERT`,
recrée une unique policy `anon_insert_only`.

### 1c. Test APRÈS
Relance le GET de 1a → doit renvoyer `[]`. Vérifie les policies :
```sql
select policyname, cmd, roles from pg_policies
where schemaname='public' and tablename='leads';
-- Attendu : une seule ligne -> anon_insert_only | INSERT | {anon}
```
Vérifie que l'INSERT front marche toujours (fais un vrai diagnostic sur le site).

---

## Étape 2 — Déployer l'Edge Function + secrets

```bash
supabase link --project-ref <PROJECT_REF>

# Secrets (jamais côté front)
supabase secrets set BREVO_API_KEY=<clé_api_brevo>
supabase secrets set LEAD_NOTIFY_TO=marchepublic@nomadimpact.org   # cf. décision ci-dessous
supabase secrets set SENDER_EMAIL=marchepublic@nomadimpact.org     # doit être un expéditeur VALIDÉ dans Brevo
supabase secrets set SUPABASE_TABLE_URL=https://supabase.com/dashboard/project/<PROJECT_REF>/editor

# Déploiement (webhook = appel externe, pas de JWT)
supabase functions deploy lead-notify --no-verify-jwt
```

> **Décision destinataire notification** : par défaut `marchepublic@nomadimpact.org`
> (adresse déjà utilisée partout sur le site). Si tu préfères `hello@nomadimpact.org`,
> change juste le secret `LEAD_NOTIFY_TO`, aucun code à modifier.

> **Brevo** : l'expéditeur `SENDER_EMAIL` doit être vérifié dans Brevo
> (Senders & IP > Senders), sinon Brevo refuse l'envoi.

URL de la fonction : `https://<PROJECT_REF>.supabase.co/functions/v1/lead-notify`

---

## Étape 3 — Database Webhook sur INSERT

Supabase > **Database > Webhooks > Create a new hook** :
- Table : `public.leads`
- Events : **Insert** uniquement
- Type : **HTTP Request** → POST
- URL : `https://<PROJECT_REF>.supabase.co/functions/v1/lead-notify`
- Header : `Authorization: Bearer <SERVICE_ROLE_KEY>` (le webhook appelle la fonction)

Le webhook est **post-commit et asynchrone** : le lead est déjà enregistré quand la
fonction tourne. Un échec Brevo ne peut donc pas annuler l'insertion (la fonction
renvoie toujours 200 et logge l'erreur).

---

## Étape 4 — Le front ne change pas
Aucune modification de `src/`. `LeadGateModal` continue de stocker le lead et de
lancer le download `.docx` immédiat. Les events GA4 (`generate_lead`, `diag_email`)
restent intacts.

---

## Étape 5 — Tests de bout en bout (à réaliser et capturer)

1. **(a) Ligne en base** : fais un diagnostic complet sur marchepublic.be avec un email
   de test → vérifie la nouvelle ligne dans Supabase > Table Editor > `leads`
   (colonnes email / band / source / created_at / consent).
2. **(b) Email de notification** : vérifie la réception sur `LEAD_NOTIFY_TO`
   (sujet « Nouveau lead MarchéPublic.be — {band} »).
3. **(c) Email de livraison** : vérifie la réception sur l'email de test
   (sujet « Votre ressource MarchéPublic.be », lien de download fonctionnel).
4. **(d) Échec Brevo simulé** : mets temporairement une `BREVO_API_KEY` invalide
   (`supabase secrets set BREVO_API_KEY=invalid`), refais un lead →
   - la ligne DOIT quand même apparaître en base (insertion non affectée) ;
   - l'erreur DOIT apparaître dans Supabase > Edge Functions > lead-notify > Logs
     (`[lead-notify] échec email ...`).
   Remets ensuite la vraie clé.

---

## Fichiers de cette brique
- `supabase/migrations/20260705_leads_rls_hardening.sql` — durcissement RLS
- `supabase/functions/lead-notify/index.ts` — Edge Function (notif + livraison, robuste)
- `docs/lead-notify-SETUP.md` — ce runbook
