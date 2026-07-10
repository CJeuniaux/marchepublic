// Edge Function : create-checkout
// Crée une Stripe Checkout Session (paiement unique) pour un marché public.
//
// Appelée depuis le front via supabase.functions.invoke('create-checkout', { body }).
// Le JWT de l'utilisateur est transmis automatiquement : on l'utilise pour vérifier,
// sous RLS, que l'utilisateur est bien propriétaire du marché public concerné.
//
// Body attendu : { marche_id: string, type: "marche_public" | "dma" }
// Réponse : { url } (URL de la page de paiement hébergée Stripe) ou { error }.
//
// Secrets (Supabase > Edge Functions > Secrets) :
//   STRIPE_SECRET_KEY            : clé secrète Stripe (sk_live_... ou sk_test_...)
//   STRIPE_PRICE_MARCHE_PUBLIC   : (optionnel) price_... pour le marché public (9 EUR)
//   STRIPE_PRICE_DMA             : (optionnel) price_... pour la DMA (1 EUR)
//   SITE_URL                     : (optionnel) base des URLs de retour (def. https://marchepublic.be)
// SUPABASE_URL et SUPABASE_ANON_KEY sont injectés automatiquement.

import Stripe from "https://esm.sh/stripe@14.21.0?target=deno&deno-std=0.177.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY") ?? "";
const PRICE_MARCHE = Deno.env.get("STRIPE_PRICE_MARCHE_PUBLIC") ?? "";
const PRICE_DMA = Deno.env.get("STRIPE_PRICE_DMA") ?? "";
const SITE_URL = (Deno.env.get("SITE_URL") ?? "https://marchepublic.be").replace(/\/$/, "");

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  httpClient: Stripe.createFetchHttpClient(),
  apiVersion: "2024-06-20",
});

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...CORS, "content-type": "application/json" } });
}

// Montants (centimes) et libellés par type de paiement.
const CONFIG: Record<string, { amount: number; label: string; priceId: string }> = {
  marche_public: { amount: 900, label: "Marché public complet", priceId: PRICE_MARCHE },
  dma: { amount: 100, label: "Décision motivée d'attribution (sur mesure)", priceId: PRICE_DMA },
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (!STRIPE_SECRET_KEY) return json({ error: "STRIPE_SECRET_KEY absente" }, 500);

  let marcheId = "";
  let type = "";
  try {
    const body = await req.json();
    marcheId = String(body?.marche_id ?? "");
    type = String(body?.type ?? "");
  } catch {
    return json({ error: "payload invalide" }, 400);
  }
  const conf = CONFIG[type];
  if (!marcheId || !conf) return json({ error: "marche_id ou type invalide" }, 400);

  // Vérifie la propriété du marché sous RLS, avec le JWT de l'appelant.
  const authHeader = req.headers.get("Authorization") ?? "";
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? "",
    { global: { headers: { Authorization: authHeader } } },
  );
  const { data: marche, error } = await supabase
    .from("marches")
    .select("id, objet")
    .eq("id", marcheId)
    .maybeSingle();
  if (error || !marche) return json({ error: "marché introuvable ou accès refusé" }, 403);

  // Ligne de paiement : price configuré si fourni, sinon price_data en secours.
  const line_item = conf.priceId
    ? { price: conf.priceId, quantity: 1 }
    : {
        quantity: 1,
        price_data: {
          currency: "eur",
          unit_amount: conf.amount,
          product_data: { name: `${conf.label} — ${(marche as { objet: string }).objet}` },
        },
      };

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [line_item],
      metadata: { marche_id: marcheId, type },
      success_url: `${SITE_URL}/compte/marches/${marcheId}?paye=1`,
      cancel_url: `${SITE_URL}/compte/marches/${marcheId}?paye=0`,
    });
    return json({ url: session.url });
  } catch (e) {
    console.error("[create-checkout] Stripe:", String(e));
    return json({ error: "création de la session de paiement impossible" }, 500);
  }
});
