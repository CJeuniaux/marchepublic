-- MP — feedback beta-testeurs (bugs + retours UX)
-- Additif et isolé. À exécuter dans Supabase > SQL Editor.

create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  type text not null check (type in ('bug', 'ux')),
  page_url text,
  user_email text,
  user_id uuid references auth.users(id) on delete set null,
  content jsonb not null default '{}'::jsonb,
  status text not null default 'nouveau' check (status in ('nouveau', 'vu', 'traité'))
);

alter table public.feedback enable row level security;

-- Tout visiteur (anonyme ou connecté) peut DÉPOSER un feedback.
create policy "Dépôt de feedback ouvert"
  on public.feedback for insert
  with check (true);

-- Seuls les administrateurs (par e-mail) peuvent LIRE les feedbacks.
create policy "Admins lisent les feedbacks"
  on public.feedback for select
  using (
    (auth.jwt() ->> 'email') in (
      'charshow@gmail.com',
      'marchepublic@nomadimpact.org',
      'hello@nomadimpact.org',
      'info@nomadimpact.org'
    )
  );

-- Seuls les administrateurs peuvent METTRE À JOUR le statut.
create policy "Admins mettent à jour les feedbacks"
  on public.feedback for update
  using (
    (auth.jwt() ->> 'email') in (
      'charshow@gmail.com',
      'marchepublic@nomadimpact.org',
      'hello@nomadimpact.org',
      'info@nomadimpact.org'
    )
  );

create index if not exists feedback_created_idx on public.feedback (created_at desc);
