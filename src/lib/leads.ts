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
 *     organisation text,
 *     document_id text,
 *     score integer,
 *     band text,
 *     consent boolean default true,
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

interface LeadPayload {
  email: string
  organisation?: string
  document_id?: string
  score?: number
  band?: string
  consent: boolean
}

export async function saveLead(payload: LeadPayload): Promise<{ ok: boolean; error?: string }> {
  const url = import.meta.env.VITE_SUPABASE_URL
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY

  if (!url || !key) {
    // Pas configuré — on continue sans stocker (degradation gracieuse)
    console.warn('[marchepublic] Supabase non configuré. Lead non enregistré.', payload)
    return { ok: true }
  }

  try {
    const res = await fetch(`${url}/rest/v1/leads`, {
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
      return { ok: false, error: text }
    }
    return { ok: true }
  } catch (e) {
    return { ok: false, error: String(e) }
  }
}
