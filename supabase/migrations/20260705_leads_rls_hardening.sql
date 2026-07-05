-- Durcissement RLS de la table public.leads
-- Objectif : la clé anon (front) peut UNIQUEMENT insérer.
-- Aucun SELECT / UPDATE / DELETE possible avec le rôle anon.
--
-- À exécuter dans Supabase > SQL Editor.
-- Idempotent : peut être relancé sans risque.

-- 1. RLS activée (obligatoire, sinon les policies sont ignorées)
alter table public.leads enable row level security;

-- 2. On repart d'une base propre : on supprime toute policy existante sur leads
--    (évite qu'une ancienne policy SELECT/permissive traîne)
do $$
declare p record;
begin
  for p in select policyname from pg_policies
           where schemaname = 'public' and tablename = 'leads'
  loop
    execute format('drop policy if exists %I on public.leads', p.policyname);
  end loop;
end $$;

-- 3. Privilèges table : le rôle anon ne garde QUE l'INSERT
revoke all on public.leads from anon;
grant insert on public.leads to anon;

-- 4. Seule policy pour anon : INSERT autorisé, rien d'autre
--    (aucune policy SELECT/UPDATE/DELETE => ces opérations renvoient 0 ligne / sont refusées)
create policy "anon_insert_only" on public.leads
  for insert
  to anon
  with check (true);

-- 5. Le rôle service_role (backend / edge function) garde l'accès complet
--    (service_role bypasse la RLS par défaut ; ce grant est explicite et sûr)
grant all on public.leads to service_role;

-- --- VÉRIFICATION (à lancer après) ---
-- Lister les policies : doit ne montrer QUE "anon_insert_only" (cmd = INSERT)
--   select policyname, cmd, roles from pg_policies
--   where schemaname='public' and tablename='leads';
