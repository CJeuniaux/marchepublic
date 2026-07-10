-- MP Premium — cycle de vie du marché public (Phase 9, SPEC_MP_WORKFLOW)
-- Additif et isolé : ne touche NI la table leads, NI le diagnostic, NI le SEO.
-- Prérequis : migration 20260706_mp_premium_schema.sql déjà appliquée.
-- À exécuter dans Supabase > SQL Editor.

-- ============================================================
-- 9.1 Colonnes de workflow sur marches
-- ============================================================
alter table public.marches
  add column if not exists workflow_etape text not null default 'preparation'
    check (workflow_etape in (
      'preparation', 'consultation', 'reception_offres',
      'comparatif', 'attribution', 'archive'
    )),
  add column if not exists nb_offres_attendues integer,
  add column if not exists prestataire_retenu_id uuid references public.prestataires(id) on delete set null,
  add column if not exists justification_choix text,
  add column if not exists date_attribution date,
  add column if not exists dma_paye boolean not null default false,
  add column if not exists dma_stripe_payment_intent_id text,
  add column if not exists checklist_archives jsonb;

-- ============================================================
-- 9.2 offres — les offres reçues des opérateurs consultés
-- ============================================================
create table if not exists public.offres (
  id uuid primary key default gen_random_uuid(),
  marche_id uuid not null references public.marches(id) on delete cascade,
  prestataire_id uuid references public.prestataires(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Identité de l'offrant (recopiée : une offre peut venir d'un opérateur hors carnet)
  nom_operateur text not null,

  montant_htva numeric(12,2),
  date_reception date,
  conforme boolean,                       -- recevabilité / conformité administrative
  notes text,
  scores jsonb,                           -- { "critere_slug": note } aligné sur criteres_attribution
  score_total numeric(6,2),
  preuve_storage_path text                -- fichier déposé dans le bucket 'preuves'
);

alter table public.offres enable row level security;

create policy "Utilisateur voit les offres de ses marchés"
  on public.offres for select
  using (
    marche_id in (
      select m.id from public.marches m
      join public.organisations o on o.id = m.organisation_id
      where o.user_id = auth.uid()
    )
  );

create policy "Utilisateur gère les offres de ses marchés"
  on public.offres for all
  using (
    marche_id in (
      select m.id from public.marches m
      join public.organisations o on o.id = m.organisation_id
      where o.user_id = auth.uid()
    )
  );

create trigger offres_updated_at
  before update on public.offres
  for each row execute function update_updated_at();

-- ============================================================
-- 9.3 consultations_envois — trace des demandes d'offre envoyées
-- ============================================================
create table if not exists public.consultations_envois (
  id uuid primary key default gen_random_uuid(),
  marche_id uuid not null references public.marches(id) on delete cascade,
  prestataire_id uuid references public.prestataires(id) on delete set null,
  created_at timestamptz not null default now(),

  destinataire_email text,
  destinataire_nom text,
  date_envoi date,
  canal text default 'email' check (canal in ('email', 'courrier', 'main_propre', 'autre')),
  statut text default 'envoye' check (statut in ('a_envoyer', 'envoye', 'relance', 'repondu', 'sans_reponse')),
  notes text
);

alter table public.consultations_envois enable row level security;

create policy "Utilisateur voit les envois de ses marchés"
  on public.consultations_envois for select
  using (
    marche_id in (
      select m.id from public.marches m
      join public.organisations o on o.id = m.organisation_id
      where o.user_id = auth.uid()
    )
  );

create policy "Utilisateur gère les envois de ses marchés"
  on public.consultations_envois for all
  using (
    marche_id in (
      select m.id from public.marches m
      join public.organisations o on o.id = m.organisation_id
      where o.user_id = auth.uid()
    )
  );

-- ============================================================
-- 9.4 Bucket privé 'preuves' + policies (pièces jointes des offres)
-- ============================================================
-- Créer le bucket (privé) s'il n'existe pas.
insert into storage.buckets (id, name, public)
values ('preuves', 'preuves', false)
on conflict (id) do nothing;

-- Convention de chemin : preuves/<organisation_id>/<marche_id>/<fichier>
-- L'accès est restreint au propriétaire de l'organisation (1er segment du path).
create policy "Utilisateur lit ses preuves"
  on storage.objects for select
  using (
    bucket_id = 'preuves'
    and (storage.foldername(name))[1] in (
      select id::text from public.organisations where user_id = auth.uid()
    )
  );

create policy "Utilisateur dépose ses preuves"
  on storage.objects for insert
  with check (
    bucket_id = 'preuves'
    and (storage.foldername(name))[1] in (
      select id::text from public.organisations where user_id = auth.uid()
    )
  );

create policy "Utilisateur supprime ses preuves"
  on storage.objects for delete
  using (
    bucket_id = 'preuves'
    and (storage.foldername(name))[1] in (
      select id::text from public.organisations where user_id = auth.uid()
    )
  );

-- ============================================================
-- VÉRIFICATION (à lancer après) :
--   select tablename, policyname, cmd, roles from pg_policies
--   where schemaname='public' and tablename in ('offres','consultations_envois');
-- Aucune policy ne doit cibler {anon}.
-- ============================================================
