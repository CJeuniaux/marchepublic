// Client Supabase partagé (MP Premium — auth + données compte).
// Réutilise les variables d'environnement déjà en place pour le front.
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const rawUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

// Normalise l'URL (retire un éventuel /rest/v1 ou slash final).
const url = (rawUrl ?? '').replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '')

// Un seul client pour toute l'app.
export const supabase: SupabaseClient = createClient(url, anonKey ?? '', {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})

export const isSupabaseConfigured = Boolean(url && anonKey)
