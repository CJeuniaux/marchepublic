-- Suivi de la synchronisation leads -> Brevo (additif, non destructif)
-- Permet de savoir pour chaque lead s'il est bien arrivé dans Brevo,
-- et de rattraper automatiquement ceux qui ont échoué (mode "reconcile"
-- de l'Edge Function lead-notify).

alter table public.leads add column if not exists brevo_synced_at timestamptz;
alter table public.leads add column if not exists brevo_error text;

create index if not exists leads_brevo_pending_idx
  on public.leads (created_at)
  where brevo_synced_at is null;

-- Les leads historiques déjà présents ne sont PAS marqués comme synchronisés :
-- le premier passage du mode "reconcile" les (re)poussera dans la liste Brevo
-- (opération idempotente côté Brevo grâce à updateEnabled: true, sans renvoyer d'email au prospect).

-- Contrôle rapide (à lancer dans le SQL Editor) :
--   select count(*) filter (where brevo_synced_at is null) as en_attente,
--          count(*) filter (where brevo_error is not null) as en_erreur,
--          count(*) as total
--   from public.leads;
