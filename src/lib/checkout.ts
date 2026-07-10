import { supabase } from './supabase'

// Lance un paiement Stripe Checkout pour un marché public.
// Redirige vers la page de paiement hébergée Stripe en cas de succès.
export async function startCheckout(marcheId: string, type: 'marche_public' | 'dma'): Promise<void> {
  const { data, error } = await supabase.functions.invoke('create-checkout', {
    body: { marche_id: marcheId, type },
  })
  if (error) throw new Error(error.message)
  const url = (data as { url?: string; error?: string } | null)?.url
  if (!url) throw new Error((data as { error?: string } | null)?.error ?? 'Session de paiement non créée')
  window.location.href = url
}
