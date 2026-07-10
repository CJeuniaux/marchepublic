import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Prestataire, PrestataireInput } from '../lib/premium-types'

// CRUD du carnet de prestataires, rattaché à une organisation.
export function usePrestataires(organisationId: string | null | undefined) {
  const [prestataires, setPrestataires] = useState<Prestataire[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const reload = useCallback(async () => {
    if (!organisationId) { setPrestataires([]); setLoading(false); return }
    setLoading(true)
    const { data, error } = await supabase
      .from('prestataires')
      .select('*')
      .eq('organisation_id', organisationId)
      .order('created_at', { ascending: false })
    if (error) setError(error.message)
    setPrestataires((data as Prestataire[] | null) ?? [])
    setLoading(false)
  }, [organisationId])

  useEffect(() => { reload() }, [reload])

  const add = useCallback(async (input: PrestataireInput): Promise<{ error: string | null }> => {
    if (!organisationId) return { error: 'Aucune organisation' }
    const { error } = await supabase
      .from('prestataires')
      .insert({ ...input, organisation_id: organisationId })
    if (error) return { error: error.message }
    await reload()
    return { error: null }
  }, [organisationId, reload])

  const update = useCallback(async (id: string, input: PrestataireInput): Promise<{ error: string | null }> => {
    const { error } = await supabase.from('prestataires').update(input).eq('id', id)
    if (error) return { error: error.message }
    await reload()
    return { error: null }
  }, [reload])

  const remove = useCallback(async (id: string): Promise<{ error: string | null }> => {
    const { error } = await supabase.from('prestataires').delete().eq('id', id)
    if (error) return { error: error.message }
    await reload()
    return { error: null }
  }, [reload])

  return { prestataires, loading, error, add, update, remove, reload }
}
