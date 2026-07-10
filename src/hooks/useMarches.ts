import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Marche, MarcheInput } from '../lib/premium-types'

// CRUD des marchés d'une organisation.
export function useMarches(organisationId: string | null | undefined) {
  const [marches, setMarches] = useState<Marche[]>([])
  const [loading, setLoading] = useState(true)

  const reload = useCallback(async () => {
    if (!organisationId) { setMarches([]); setLoading(false); return }
    setLoading(true)
    const { data } = await supabase
      .from('marches')
      .select('*')
      .eq('organisation_id', organisationId)
      .order('created_at', { ascending: false })
    setMarches((data as Marche[] | null) ?? [])
    setLoading(false)
  }, [organisationId])

  useEffect(() => { reload() }, [reload])

  const create = useCallback(async (input: MarcheInput): Promise<{ id: string | null; error: string | null }> => {
    const { data, error } = await supabase
      .from('marches')
      .insert({ ...input, statut: 'brouillon' })
      .select('id')
      .maybeSingle()
    if (error) return { id: null, error: error.message }
    await reload()
    return { id: (data as { id: string } | null)?.id ?? null, error: null }
  }, [reload])

  return { marches, loading, create, reload }
}

// Charge un marché unique par id (pour la page détail).
export function useMarche(id: string | undefined) {
  const [marche, setMarche] = useState<Marche | null>(null)
  const [loading, setLoading] = useState(true)

  const reload = useCallback(async () => {
    if (!id) { setMarche(null); setLoading(false); return }
    setLoading(true)
    const { data } = await supabase.from('marches').select('*').eq('id', id).maybeSingle()
    setMarche((data as Marche | null) ?? null)
    setLoading(false)
  }, [id])

  useEffect(() => { reload() }, [reload])

  const update = useCallback(async (patch: Partial<Marche>): Promise<{ error: string | null }> => {
    if (!id) return { error: 'Marché introuvable' }
    const { error } = await supabase.from('marches').update(patch).eq('id', id)
    if (error) return { error: error.message }
    await reload()
    return { error: null }
  }, [id, reload])

  return { marche, loading, reload, update }
}
