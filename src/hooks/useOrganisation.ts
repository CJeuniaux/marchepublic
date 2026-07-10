import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import type { Organisation, OrganisationInput } from '../lib/premium-types'

// CRUD du profil organisation de l'utilisateur courant (1 organisation par user).
export function useOrganisation() {
  const { user } = useAuth()
  const [organisation, setOrganisation] = useState<Organisation | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const reload = useCallback(async () => {
    if (!user) { setOrganisation(null); setLoading(false); return }
    setLoading(true)
    const { data, error } = await supabase
      .from('organisations')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()
    if (error) setError(error.message)
    setOrganisation((data as Organisation | null) ?? null)
    setLoading(false)
  }, [user])

  useEffect(() => { reload() }, [reload])

  const save = useCallback(async (input: OrganisationInput): Promise<{ error: string | null }> => {
    if (!user) return { error: 'Non authentifié' }
    const payload = { ...input, user_id: user.id }
    const { data, error } = await supabase
      .from('organisations')
      .upsert(payload, { onConflict: 'user_id' })
      .select()
      .maybeSingle()
    if (error) { setError(error.message); return { error: error.message } }
    setOrganisation((data as Organisation | null) ?? null)
    return { error: null }
  }, [user])

  return { organisation, loading, error, save, reload }
}
