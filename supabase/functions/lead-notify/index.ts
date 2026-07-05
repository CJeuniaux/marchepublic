// Edge Function : lead-notify
// Déclenchée par un Database Webhook Supabase sur INSERT dans public.leads.
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

const BREVO_API_KEY = Deno.env.get("BREVO_API_KEY") ?? "";
const LEAD_NOTIFY_TO = Deno.env.get("LEAD_NOTIFY_TO") ?? "marchepublic@nomadimpact.org";
const SENDER_EMAIL = Deno.env.get("SENDER_EMAIL") ?? "marchepublic@nomadimpact.org";
const SENDER_NAME = "marchépublic.be";
const SUPABASE_TABLE_URL = Deno.env.get("SUPABASE_TABLE_URL") ?? "https://supabase.com/dashboard/project/_/editor";

const SITE = "https://marchepublic.be";

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

Deno.serve(async (req) => {
  let record: LeadRecord | null = null;
  try {
    const payload = await req.json();
    record = (payload?.record ?? payload) as LeadRecord;
  } catch (e) {
    console.error("[lead-notify] payload invalide:", String(e));
    return new Response("bad payload", { status: 200 }); // 200 : ne pas déclencher de retry storm
  }

  if (!record?.email) {
    console.error("[lead-notify] enregistrement sans email, ignoré");
    return new Response("no email", { status: 200 });
  }

  if (!BREVO_API_KEY) {
    console.error("[lead-notify] BREVO_API_KEY absente : envoi impossible (lead déjà stocké)");
    return new Response("missing key", { status: 200 });
  }

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
  try {
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
        Détails : <a href="${SITE}/">politique de confidentialité</a>.
      </p>`;
    await sendBrevo(record.email, "Votre ressource MarchéPublic.be", livraison);
  } catch (e) {
    console.error("[lead-notify] échec email LIVRAISON:", String(e));
  }

  // Toujours 200 : l'insertion est déjà committée, on ne veut pas de retry destructif.
  return new Response("ok", { status: 200 });
});
