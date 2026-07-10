import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { ConsultationEnvoi, ConsultationEnvoiInput } from '../lib/premium-types'

// Trace des demandes d'offre envoyées aux opérateurs pour un marché public.
export function useConsultationsEnvois(marcheId: string | null | undefined) {
  const [envois, setEnvois] = useState<ConsultationEnvoi[]>([])
  const [loading, setLoading] = useState(true)

  const reload = useCallback(async () => {
    if (!marcheId) { setEnvois([]); setLoading(false); return }
    setLoading(true)
    const { data } = await supabase
      .from('consultations_envois')
      .select('*')
      .eq('marche_id', marcheId)
      .order('created_at', { ascending: true })
    setEnvois((data as ConsultationEnvoi[] | null) ?? [])
    setLoading(false)
  }, [marcheId])

  useEffect(() => { reload() }, [reload])

  const create = useCallback(async (input: ConsultationEnvoiInput): Promise<{ error: string | null }> => {
    const { error } = await supabase.from('consultations_envois').insert(input)
    if (error) return { error: error.message }
    await reload()
    return { error: null }
  }, [reload])

  const update = useCallback(async (id: string, patch: Partial<ConsultationEnvoi>): Promise<{ error: string | null }> => {
    const { error } = await supabase.from('consultations_envois').update(patch).eq('id', id)
    if (error) return { error: error.message }
    await reload()
    return { error: null }
  }, [reload])

  const remove = useCallback(async (id: string): Promise<{ error: string | null }> => {
    const { error } = await supabase.from('consultations_envois').delete().eq('id', id)
    if (error) return { error: error.message }
    await reload()
    return { error: null }
  }, [reload])

  return { envois, loading, create, update, remove, reload }
}
