// Edge Function : lead-notify
// Appelée par le front juste après l'INSERT dans public.leads (et/ou par un Database Webhook).
//
// Sécurité (06/10/2026) : la fonction ne fait PLUS confiance au contenu envoyé.
// Elle relit le lead dans la base (service role) : seul un lead réellement inséré
// il y a moins de 15 min et pas encore synchronisé est traité. Empêche quiconque
// possédant la clé anon publique d'envoyer des emails ou d'ajouter des contacts Brevo.
//
// Traçabilité : chaque lead reçoit brevo_synced_at (succès) ou brevo_error (échec).
// Rattrapage : POST avec l'en-tête x-reconcile-key = RECONCILE_KEY → repousse dans la
// liste Brevo tous les leads non synchronisés (30 derniers jours) et renvoie un bilan JSON.
// Aucun email n'est renvoyé aux prospects lors d'un rattrapage.
// Envoie via l'API transactionnelle Brevo :
//   (a) un email de NOTIFICATION à l'équipe (LEAD_NOTIFY_TO)
//   (b) un email de LIVRAISON au prospect (lien de téléchargement direct de la ressource)
//
// Robustesse : le webhook est POST-COMMIT et ASYNCHRONE. L'insertion du lead
// est déjà committée quand cette fonction s'exécute : un échec Brevo ne peut
// donc JAMAIS faire échouer l'insertion. On renvoie toujours 200 et on logge
// les échecs (consultables dans Supabase > Edge Functions > lead-notify > Logs).
//
// Secrets (Supabase > Edge Functions > Secrets) :
//   BREVO_API_KEY   : clé API transactionnelle Brevo (jamais côté front)
//   LEAD_NOTIFY_TO  : destinataire des notifications (ex. marchepublic@nomadimpact.org)
//   SENDER_EMAIL    : expéditeur validé dans Brevo (ex. marchepublic@nomadimpact.org)
//   SUPABASE_TABLE_URL (optionnel) : lien direct vers la table dans le dashboard
//   RECONCILE_KEY   : secret long et aléatoire pour le mode rattrapage
//   SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY : fournis automatiquement par Supabase

const BREVO_API_KEY = Deno.env.get("BREVO_API_KEY") ?? "";
const LEAD_NOTIFY_TO = Deno.env.get("LEAD_NOTIFY_TO") ?? "marchepublic@nomadimpact.org";
const SENDER_EMAIL = Deno.env.get("SENDER_EMAIL") ?? "marchepublic@nomadimpact.org";
const SENDER_NAME = "marchépublic.be";
const SUPABASE_TABLE_URL = Deno.env.get("SUPABASE_TABLE_URL") ?? "https://supabase.com/dashboard/project/_/editor";

const SITE = "https://marchepublic.be";

const SUPABASE_URL = (Deno.env.get("SUPABASE_URL") ?? "").replace(/\/$/, "");
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const RECONCILE_KEY = Deno.env.get("RECONCILE_KEY") ?? "";
const FRESH_MINUTES = 15;
const RECONCILE_DAYS = 30;

// CORS : la fonction est appelée directement depuis le front (marchepublic.be)
// juste après l'insertion du lead, en plus (ou à la place) d'un Database Webhook.
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-reconcile-key",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// Mapping document_id -> fichier (miroir de DOCS dans src/pages/Diagnostic.tsx)
const DOC_FILES: Record<string, string> = {
  sous30k: "/resources/acheter-sous-30000.docx",
  comparer: "/resources/comparer-prestataires.docx",
  cadrer_digital: "/resources/cadrer-projet-digital.docx",
  over30k: "/resources/au-dela-de-30000.docx",
  asbl_subsidiee: "/resources/asbl-subsidiee-obligations.docx",
  template_prix: "/resources/template-demande-de-prix.docx",
};

interface LeadRecord {
  id?: string;
  email: string;
  organization?: string | null;
  document_id?: string | null;
  document_title?: string | null;
  score?: number | null;
  band?: string | null;
  consent?: boolean | null;
  source?: string | null;
  created_at?: string | null;
}

function esc(s: unknown): string {
  return String(s ?? "").replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c]!));
}

// --- Accès base (service role, côté serveur uniquement) -------------------
async function db(path: string, init: RequestInit = {}): Promise<Response> {
  return await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      "content-type": "application/json",
      ...(init.headers ?? {}),
    },
  });
}

// Retrouve le lead réellement inséré (récent, non synchronisé) pour cet email.
async function findFreshLead(email: string): Promise<LeadRecord | null> {
  const since = new Date(Date.now() - FRESH_MINUTES * 60_000).toISOString();
  const base = `leads?select=*&email=eq.${encodeURIComponent(email)}` +
    `&created_at=gte.${encodeURIComponent(since)}&order=created_at.desc&limit=1`;
  let res = await db(`${base}&brevo_synced_at=is.null`);
  if (!res.ok) {
    // Filet de sécurité : si la migration 20261006 n'est pas encore appliquée
    // (colonne absente), on retombe sur la vérification d'existence seule.
    console.warn("[lead-notify] filtre brevo_synced_at indisponible, repli :", res.status);
    res = await db(base);
  }
  if (!res.ok) throw new Error(`lecture leads ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const rows = (await res.json()) as LeadRecord[];
  return rows[0] ?? null;
}

async function markLead(id: string | undefined, error: string | null): Promise<void> {
  if (!id) return;
  const body = error
    ? { brevo_error: error.slice(0, 500) }
    : { brevo_synced_at: new Date().toISOString(), brevo_error: null };
  const res = await db(`leads?id=eq.${id}`, { method: "PATCH", body: JSON.stringify(body), headers: { Prefer: "return=minimal" } });
  if (!res.ok) console.error("[lead-notify] échec mise à jour statut lead:", res.status, await res.text());
}

// Ajoute (ou met à jour) le lead comme contact Brevo dans la liste 8 ("Leads MP").
// Déclenche l'automation d'onboarding côté Brevo. Non bloquant : toute erreur est loggée.
const BREVO_LIST_ID = Number(Deno.env.get("BREVO_LEADS_LIST_ID") ?? "8");
async function addBrevoContact(email: string, prenom = "", nom = ""): Promise<void> {
  const res = await fetch("https://api.brevo.com/v3/contacts", {
    method: "POST",
    headers: {
      "api-key": BREVO_API_KEY,
      "content-type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify({
      email,
      attributes: { PRENOM: prenom, NOM: nom },
      listIds: [BREVO_LIST_ID],
      updateEnabled: true,
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Brevo contacts ${res.status}: ${body.slice(0, 300)}`);
  }
}

async function sendBrevo(to: string, subject: string, htmlContent: string): Promise<void> {
  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": BREVO_API_KEY,
      "content-type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify({
      sender: { name: SENDER_NAME, email: SENDER_EMAIL },
      to: [{ email: to }],
      subject,
      htmlContent,
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Brevo ${res.status}: ${body.slice(0, 300)}`);
  }
}

// Traite un lead : notification interne + livraison au prospect + ajout liste Brevo.
// Le statut (brevo_synced_at / brevo_error) dépend de l'ajout à la liste, qui est
// l'étape critique pour l'onboarding.
async function processLead(record: LeadRecord): Promise<boolean> {
  console.log(`[lead-notify] traitement lead ${record.id ?? "?"} (doc: ${record.document_id ?? "?"})`);

  const filePath = record.document_id ? DOC_FILES[record.document_id] : undefined;
  const downloadUrl = filePath ? `${SITE}${filePath}` : SITE;

  // (a) NOTIFICATION interne
  try {
    const notif = `
      <p>Nouveau lead capturé sur marchépublic.be.</p>
      <ul>
        <li><strong>Email :</strong> ${esc(record.email)}</li>
        <li><strong>Organisation :</strong> ${esc(record.organization) || "(non renseignée)"}</li>
        <li><strong>Document demandé :</strong> ${esc(record.document_title) || esc(record.document_id) || "(inconnu)"}</li>
        <li><strong>Score :</strong> ${esc(record.score)}</li>
        <li><strong>Band :</strong> ${esc(record.band)}</li>
        <li><strong>Date :</strong> ${esc(record.created_at) || new Date().toISOString()}</li>
      </ul>
      <p><a href="${SUPABASE_TABLE_URL}">Ouvrir la table leads dans Supabase</a></p>`;
    await sendBrevo(LEAD_NOTIFY_TO, `Nouveau lead MarchéPublic.be — ${record.band ?? "?"}`, notif);
  } catch (e) {
    console.error("[lead-notify] échec email NOTIFICATION:", String(e));
  }

  // (b) LIVRAISON au prospect
  if (record.document_id === "diagnostic") {
    try {
      const resultat = `
      <p>Bonjour,</p>
      <p>Merci d'avoir réalisé le diagnostic marchépublic.be.</p>
      <p><strong>Votre score indicatif : ${esc(record.score)} %</strong> de probabilité que les règles des marchés publics s'appliquent à votre achat.</p>
      <p>Pour aller plus loin : <a href="${SITE}">refaire le diagnostic</a>, consulter les <a href="${SITE}/seuils-marche-public-asbl/">seuils 2025-2026</a>, ou télécharger nos modèles gratuits (demande de prix, comparaison de prestataires) depuis votre page de résultat.</p>
      <p style="color:#5E6B7D;font-size:14px">Pour rappel, marchépublic.be est un premier repère pédagogique, ce n'est pas un avis juridique.</p>
      <hr style="border:none;border-top:1px solid #E4D9CC;margin:20px 0">
      <p style="color:#5E6B7D;font-size:12px">
        Vous recevez cet email car vous avez réalisé le diagnostic sur marchépublic.be et accepté que nous conservions votre adresse.
        Vous pouvez demander la suppression de vos données à tout moment en écrivant à
        <a href="mailto:marchepublic@nomadimpact.org">marchepublic@nomadimpact.org</a>.
        Détails : <a href="${SITE}/confidentialite">politique de confidentialité</a>.
      </p>`;
      await sendBrevo(record.email, "Votre résultat MarchéPublic.be", resultat);
    } catch (e) {
      console.error("[lead-notify] échec email RÉSULTAT:", String(e));
    }
  } else try {
    const livraison = `
      <p>Bonjour,</p>
      <p>Merci d'avoir utilisé marchépublic.be. Voici la ressource que vous avez demandée :</p>
      <p><a href="${downloadUrl}">Télécharger : ${esc(record.document_title) || "votre ressource"}</a></p>
      <p style="color:#5E6B7D;font-size:14px">Pour rappel, marchépublic.be est un premier repère pédagogique, ce n'est pas un avis juridique.</p>
      <hr style="border:none;border-top:1px solid #E4D9CC;margin:20px 0">
      <p style="color:#5E6B7D;font-size:12px">
        Vous recevez cet email car vous avez demandé cette ressource sur marchépublic.be et accepté que nous conservions votre adresse.
        Vous pouvez demander la suppression de vos données à tout moment en écrivant à
        <a href="mailto:marchepublic@nomadimpact.org">marchepublic@nomadimpact.org</a>.
        Détails : <a href="${SITE}/confidentialite">politique de confidentialité</a>.
      </p>`;
    await sendBrevo(record.email, "Votre ressource MarchéPublic.be", livraison);
  } catch (e) {
    console.error("[lead-notify] échec email LIVRAISON:", String(e));
  }

  // (c) AJOUT À LA LISTE BREVO -> déclenche l'automation d'onboarding.
  try {
    await addBrevoContact(record.email);
    await markLead(record.id, null);
    console.log(`[lead-notify] lead ${record.id ?? "?"} ajouté à la liste Brevo ${BREVO_LIST_ID}`);
    return true;
  } catch (e) {
    console.error("[lead-notify] échec ajout contact Brevo (liste " + BREVO_LIST_ID + "):", String(e));
    await markLead(record.id, String(e));
    return false;
  }
}

// Rattrapage : repousse dans Brevo les leads non synchronisés (sans email au prospect).
async function reconcile(): Promise<Response> {
  const since = new Date(Date.now() - RECONCILE_DAYS * 86_400_000).toISOString();
  const res = await db(
    `leads?select=id,email,consent,created_at&brevo_synced_at=is.null&created_at=gte.${encodeURIComponent(since)}&order=created_at.asc&limit=200`,
  );
  if (!res.ok) return json({ ok: false, error: `lecture leads ${res.status}` }, 500);
  const rows = (await res.json()) as LeadRecord[];
  let synced = 0;
  const failed: string[] = [];
  for (const r of rows) {
    if (r.consent === false) { await markLead(r.id, "consentement absent : non ajouté"); continue; }
    try {
      await addBrevoContact(r.email);
      await markLead(r.id, null);
      synced++;
    } catch (e) {
      await markLead(r.id, String(e));
      failed.push(r.id ?? "?");
    }
  }
  if (rows.length > 0) {
    try {
      await sendBrevo(
        LEAD_NOTIFY_TO,
        `Rattrapage leads MarchéPublic.be : ${synced} synchronisé(s), ${failed.length} en échec`,
        `<p>Contrôle automatique Supabase → Brevo.</p><ul><li>Leads en attente trouvés : ${rows.length}</li>` +
          `<li>Ajoutés à la liste Brevo ${BREVO_LIST_ID} : ${synced}</li><li>En échec : ${failed.length}</li></ul>` +
          `<p><a href="${SUPABASE_TABLE_URL}">Ouvrir la table leads</a> (colonnes brevo_synced_at / brevo_error)</p>`,
      );
    } catch (e) {
      console.error("[lead-notify] échec email bilan rattrapage:", String(e));
    }
  }
  console.log(`[lead-notify] rattrapage : ${rows.length} en attente, ${synced} ok, ${failed.length} échec`);
  return json({ ok: true, pending: rows.length, synced, failed: failed.length });
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { ...CORS, "content-type": "application/json" } });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });

  if (!BREVO_API_KEY || !SUPABASE_URL || !SERVICE_KEY) {
    console.error("[lead-notify] configuration incomplète (BREVO_API_KEY / SUPABASE_URL / SERVICE_ROLE)");
    return new Response("missing config", { status: 200, headers: CORS });
  }

  // Mode rattrapage / contrôle (appel planifié)
  const rk = req.headers.get("x-reconcile-key");
  if (rk !== null) {
    if (!RECONCILE_KEY || rk !== RECONCILE_KEY) return new Response("forbidden", { status: 403, headers: CORS });
    return await reconcile();
  }

  let email = "";
  try {
    const payload = await req.json();
    // Format Database Webhook ({record}) ou appel direct front ({record} / {...lead}).
    email = String((payload?.record ?? payload)?.email ?? "").trim();
  } catch (e) {
    console.error("[lead-notify] payload invalide:", String(e));
    return new Response("bad payload", { status: 200, headers: CORS }); // 200 : pas de retry storm
  }
  if (!email) return new Response("no email", { status: 200, headers: CORS });

  // On ne fait confiance qu'à la base : le lead doit exister, être récent et non traité.
  let record: LeadRecord | null = null;
  try {
    record = await findFreshLead(email);
  } catch (e) {
    console.error("[lead-notify] lecture du lead impossible:", String(e));
    return new Response("lookup failed", { status: 200, headers: CORS }); // le rattrapage s'en chargera
  }
  if (!record) {
    console.warn("[lead-notify] aucun lead récent non traité pour cet email : ignoré");
    return new Response("ignored", { status: 200, headers: CORS });
  }

  await processLead(record);
  // Toujours 200 : l'insertion est déjà committée, le rattrapage gère les échecs.
  return new Response("ok", { status: 200, headers: CORS });
});
