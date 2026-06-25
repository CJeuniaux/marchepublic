/**
 * Lead capture — stockage Supabase via REST direct (sans SDK).
 *
 * Setup requis :
 * 1. Créer un projet Supabase sur https://supabase.com (gratuit)
 * 2. Exécuter ce SQL dans l'éditeur Supabase :
 *
 *   create table leads (
 *     id uuid default gen_random_uuid() primary key,
 *     email text not null,
 *     organization text,
 *     document_id text,
 *     document_title text,
 *     score integer,
 *     band text,
 *     consent boolean default true,
 *     source text,
 *     page_url text,
 *     user_agent text,
 *     created_at timestamptz default now()
 *   );
 *   -- Autoriser les INSERT anonymes (RLS)
 *   alter table leads enable row level security;
 *   create policy "insert_leads" on leads for insert with check (true);
 *
 * 3. Ajouter dans Vercel > Settings > Environment Variables :
 *   VITE_SUPABASE_URL = https://[votre-projet].supabase.co
 *   VITE_SUPABASE_ANON_KEY = [votre clé anon publique]
 *
 * 4. Pour exporter les leads : Supabase dashboard > Table Editor > leads > Export CSV
 */

export interface LeadPayload {
  email: string
  organization?: string   // matches Supabase column name exactly
  document_id?: string
  document_title?: string
  score?: number
  band?: string
  consent: boolean
  source?: string
  page_url?: string
  user_agent?: string
}

export async function saveLead(payload: LeadPayload): Promise<{ ok: boolean; error?: string }> {
  const url = import.meta.env.VITE_SUPABASE_URL
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY

  if (!url || !key) {
    return { ok: false, error: 'configuration_missing' }
  }

  try {
    // Normalize URL: strip trailing slash and any /rest/v1 suffix the user may have included
    const baseUrl = url.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '')
    const endpoint = `${baseUrl}/rest/v1/leads`
    console.log('[leads] POST', endpoint)
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': key,
        'Authorization': `Bearer ${key}`,
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify(payload),
    })
    if (!res.ok) {
      const text = await res.text()
      console.error('[leads] Supabase insert failed:', res.status, text)
      return { ok: false, error: text }
    }
    return { ok: true }
  } catch (e) {
    console.error('[leads] Network error:', e)
    return { ok: false, error: String(e) }
  }
}
