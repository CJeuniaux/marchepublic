// Edge Function : stripe-webhook
// Reçoit les événements Stripe et met à jour le marché public après paiement.
//
// Événement clé : checkout.session.completed
//   metadata.type = "marche_public" -> marches.statut = 'paye' (+ montant/intent)
//   metadata.type = "dma"           -> marches.dma_paye = true (+ intent)
//
// La vérification de signature garantit que l'appel vient bien de Stripe.
// L'écriture se fait avec la clé service_role (pas de session utilisateur ici).
//
// IMPORTANT : cette fonction doit être déployée SANS vérification du JWT
//   (Supabase > Edge Functions > stripe-webhook > Details > "Verify JWT" = OFF),
//   car Stripe n'envoie pas de JWT Supabase.
//
// Secrets :
//   STRIPE_SECRET_KEY        : clé secrète Stripe
//   STRIPE_WEBHOOK_SECRET    : secret de signature du webhook (whsec_...)
//   SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY : injectés automatiquement.

import Stripe from "https://esm.sh/stripe@14.21.0?target=deno&deno-std=0.177.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY") ?? "";
const WEBHOOK_SECRET = Deno.env.get("STRIPE_WEBHOOK_SECRET") ?? "";

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  httpClient: Stripe.createFetchHttpClient(),
  apiVersion: "2024-06-20",
});
const cryptoProvider = Stripe.createSubtleCryptoProvider();

const admin = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
);

Deno.serve(async (req) => {
  const sig = req.headers.get("stripe-signature");
  const body = await req.text();
  if (!sig || !WEBHOOK_SECRET) {
    console.error("[stripe-webhook] signature ou secret manquant");
    return new Response("missing signature", { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(body, sig, WEBHOOK_SECRET, undefined, cryptoProvider);
  } catch (e) {
    console.error("[stripe-webhook] signature invalide:", String(e));
    return new Response("invalid signature", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const marcheId = session.metadata?.marche_id;
    const type = session.metadata?.type;
    const paymentIntent = typeof session.payment_intent === "string" ? session.payment_intent : null;

    if (marcheId && type) {
      try {
        if (type === "marche_public") {
          await admin.from("marches").update({
            statut: "paye",
            stripe_payment_intent_id: paymentIntent,
            stripe_payment_status: "paye",
            montant_paye: (session.amount_total ?? 0) / 100,
            workflow_etape: "consultation",
          }).eq("id", marcheId);
        } else if (type === "dma") {
          await admin.from("marches").update({
            dma_paye: true,
            dma_stripe_payment_intent_id: paymentIntent,
          }).eq("id", marcheId);
        }
      } catch (e) {
        console.error("[stripe-webhook] échec mise à jour:", String(e));
        return new Response("db error", { status: 500 }); // 500 -> Stripe réessaiera
      }
    }
  }

  return new Response("ok", { status: 200 });
});
