-- MP Premium — schéma de base (Phase 1)
-- Additif et isolé : ne touche NI la table leads, NI le diagnostic, NI le SEO.
-- À exécuter dans Supabase > SQL Editor, dans cet ordre (le fichier est déjà ordonné).
--
-- Prérequis : Supabase Auth activé (auth.users existe par défaut).

-- ============================================================
-- Fonction utilitaire : updated_at automatique
-- ============================================================
create or replace function update_updated_at()
returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

-- ============================================================
-- 2.1 organisations
-- ============================================================
create table if not exists public.organisations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  nom text not null,
  type_organisation text not null check (type_organisation in ('asbl', 'commune', 'intercommunale', 'cpas', 'autre')),
  adresse text,
  numero_bce text,

  pouvoir_adjudicateur text,
  representant_legal_nom text,
  representant_legal_fonction text,
  email_contact text,

  introduction_standard text,
  clause_rgpd_standard text,

  coordonnees_bancaires text,

  unique(user_id)
);

alter table public.organisations enable row level security;

create policy "Utilisateur voit sa propre organisation"
  on public.organisations for select
  using (auth.uid() = user_id);

create policy "Utilisateur crée sa propre organisation"
  on public.organisations for insert
  with check (auth.uid() = user_id);

create policy "Utilisateur modifie sa propre organisation"
  on public.organisations for update
  using (auth.uid() = user_id);

create trigger organisations_updated_at
  before update on public.organisations
  for each row execute function update_updated_at();

-- ============================================================
-- 2.2 prestataires
-- ============================================================
create table if not exists public.prestataires (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references public.organisations(id) on delete cascade,
  created_at timestamptz not null default now(),

  categorie text not null,
  nom_entreprise text not null,
  contact_nom text,
  email text,
  adresse text,
  numero_bce_tva text,
  notes text
);

alter table public.prestataires enable row level security;

create policy "Utilisateur voit ses prestataires"
  on public.prestataires for select
  using (
    organisation_id in (
      select id from public.organisations where user_id = auth.uid()
    )
  );

create policy "Utilisateur gère ses prestataires"
  on public.prestataires for all
  using (
    organisation_id in (
      select id from public.organisations where user_id = auth.uid()
    )
  );

-- ============================================================
-- 2.3 marches
-- ============================================================
create table if not exists public.marches (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references public.organisations(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  statut text not null default 'brouillon' check (statut in ('brouillon', 'paye', 'archive')),
  objet text not null,

  type_achat text not null check (type_achat in ('fournitures', 'services', 'travaux')),
  montant_estime_htva numeric(12,2) not null,
  procedure text not null,
  seuil text,
  nb_phases integer not null default 1 check (nb_phases in (1, 2)),
  est_accord_cadre boolean not null default false,

  date_lancement date,
  date_limite_offres date,
  date_debut_execution date,
  duree_marche text,

  description_besoin text,
  criteres_attribution jsonb,
  prestataires_selectionnes uuid[],

  documents_selectionnes text[],
  annexes_info text,

  stripe_payment_intent_id text,
  stripe_payment_status text,
  montant_paye numeric(6,2),

  inclure_rgpd boolean not null default false,
  inclure_voies_recours boolean not null default false
);

alter table public.marches enable row level security;

create policy "Utilisateur voit ses marchés"
  on public.marches for select
  using (
    organisation_id in (
      select id from public.organisations where user_id = auth.uid()
    )
  );

create policy "Utilisateur gère ses marchés"
  on public.marches for all
  using (
    organisation_id in (
      select id from public.organisations where user_id = auth.uid()
    )
  );

create trigger marches_updated_at
  before update on public.marches
  for each row execute function update_updated_at();

-- ============================================================
-- 2.4 telechargements
-- ============================================================
create table if not exists public.telechargements (
  id uuid primary key default gen_random_uuid(),
  marche_id uuid not null references public.marches(id),
  user_id uuid not null references auth.users(id),
  created_at timestamptz not null default now(),

  document_slug text not null,
  storage_path text,
  email_envoye boolean default false,
  email_envoye_at timestamptz
);

alter table public.telechargements enable row level security;

create policy "Utilisateur voit ses téléchargements"
  on public.telechargements for select
  using (user_id = auth.uid());

-- ============================================================
-- VÉRIFICATION (à lancer après) : aucun accès anonyme
--   select tablename, policyname, cmd, roles from pg_policies
--   where schemaname='public'
--     and tablename in ('organisations','prestataires','marches','telechargements');
-- Aucune policy ne doit cibler {anon} : uniquement {authenticated}/{public via auth.uid()}.
-- ============================================================
