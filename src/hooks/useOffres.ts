import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Offre, OffreInput } from '../lib/premium-types'

// CRUD des offres reçues pour un marché public.
export function useOffres(marcheId: string | null | undefined) {
  const [offres, setOffres] = useState<Offre[]>([])
  const [loading, setLoading] = useState(true)

  const reload = useCallback(async () => {
    if (!marcheId) { setOffres([]); setLoading(false); return }
    setLoading(true)
    const { data } = await supabase
      .from('offres')
      .select('*')
      .eq('marche_id', marcheId)
      .order('created_at', { ascending: true })
    setOffres((data as Offre[] | null) ?? [])
    setLoading(false)
  }, [marcheId])

  useEffect(() => { reload() }, [reload])

  const create = useCallback(async (input: OffreInput): Promise<{ error: string | null }> => {
    const { error } = await supabase.from('offres').insert(input)
    if (error) return { error: error.message }
    await reload()
    return { error: null }
  }, [reload])

  const update = useCallback(async (id: string, patch: Partial<Offre>): Promise<{ error: string | null }> => {
    const { error } = await supabase.from('offres').update(patch).eq('id', id)
    if (error) return { error: error.message }
    await reload()
    return { error: null }
  }, [reload])

  const remove = useCallback(async (id: string): Promise<{ error: string | null }> => {
    const { error } = await supabase.from('offres').delete().eq('id', id)
    if (error) return { error: error.message }
    await reload()
    return { error: null }
  }, [reload])

  return { offres, loading, create, update, remove, reload }
}
