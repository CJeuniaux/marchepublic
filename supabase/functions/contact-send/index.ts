// Edge Function : contact-send
// Reçoit le formulaire de contact du site et l'envoie par e-mail via Brevo
// à marchepublic@nomadimpact.org (reply-to = adresse du visiteur).
//
// Body attendu : { name: string, email: string, message: string }
//
// Secrets (Supabase > Edge Functions > Secrets) :
//   BREVO_API_KEY  : clé API transactionnelle Brevo
//   SENDER_EMAIL   : expéditeur validé dans Brevo (ex. marchepublic@nomadimpact.org)
//   CONTACT_TO     : (optionnel) destinataire (def. marchepublic@nomadimpact.org)

const BREVO_API_KEY = Deno.env.get("BREVO_API_KEY") ?? "";
const SENDER_EMAIL = Deno.env.get("SENDER_EMAIL") ?? "marchepublic@nomadimpact.org";
const CONTACT_TO = Deno.env.get("CONTACT_TO") ?? "marchepublic@nomadimpact.org";
const SENDER_NAME = "marchépublic.be";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...CORS, "content-type": "application/json" } });
}
function esc(s: unknown): string {
  return String(s ?? "").replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c]!));
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });

  let name = "", email = "", message = "";
  try {
    const b = await req.json();
    name = String(b?.name ?? "").trim();
    email = String(b?.email ?? "").trim();
    message = String(b?.message ?? "").trim();
  } catch {
    return json({ error: "payload invalide" }, 400);
  }
  if (!name || !email.includes("@") || !message) return json({ error: "champs manquants" }, 400);
  if (!BREVO_API_KEY) { console.error("[contact-send] BREVO_API_KEY absente"); return json({ error: "service indisponible" }, 500); }

  const html = `
    <p>Nouveau message via le formulaire de contact de marchépublic.be.</p>
    <ul>
      <li><strong>Nom :</strong> ${esc(name)}</li>
      <li><strong>Email :</strong> ${esc(email)}</li>
    </ul>
    <p><strong>Message :</strong></p>
    <p style="white-space:pre-wrap">${esc(message)}</p>`;

  try {
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: { "api-key": BREVO_API_KEY, "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify({
        sender: { name: SENDER_NAME, email: SENDER_EMAIL },
        to: [{ email: CONTACT_TO }],
        replyTo: { email, name },
        subject: `Contact marchépublic.be — ${name}`,
        htmlContent: html,
      }),
    });
    if (!res.ok) {
      console.error("[contact-send] Brevo", res.status, (await res.text()).slice(0, 300));
      return json({ error: "envoi impossible" }, 502);
    }
  } catch (e) {
    console.error("[contact-send]", String(e));
    return json({ error: "envoi impossible" }, 500);
  }
  return json({ ok: true });
});
