import { supabase } from './supabase'
import { DEMO_ORG, DEMO_PRESTATAIRES } from './premium-constants'

// Peuple le compte courant avec une organisation de démo + des prestataires de tous types.
// Respecte la RLS : l'utilisateur ne peut écrire que sur ses propres données.
export async function seedDemoAccount(userId: string): Promise<{ error: string | null }> {
  const { data: org, error: orgErr } = await supabase
    .from('organisations')
    .upsert({ ...DEMO_ORG, user_id: userId }, { onConflict: 'user_id' })
    .select('id')
    .single()
  if (orgErr || !org) return { error: orgErr?.message ?? 'Organisation non créée' }

  const orgId = (org as { id: string }).id
  // Évite les doublons : on n'ajoute les prestataires démo que s'il n'y en a pas déjà.
  const { count } = await supabase
    .from('prestataires')
    .select('*', { count: 'exact', head: true })
    .eq('organisation_id', orgId)

  if (!count) {
    const { error: presErr } = await supabase
      .from('prestataires')
      .insert(DEMO_PRESTATAIRES.map(p => ({ ...p, organisation_id: orgId })))
    if (presErr) return { error: presErr.message }
  }
  return { error: null }
}
