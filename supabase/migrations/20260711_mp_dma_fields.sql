-- MP Premium — champs complémentaires pour une DMA complète (suite Phase 9/12)
-- Additif et isolé. À exécuter dans Supabase > SQL Editor.

-- Sur les offres : montant TVAC, délai d'exécution proposé, motif de non-attribution.
alter table public.offres
  add column if not exists montant_tvac numeric(12,2),
  add column if not exists delai_execution text,
  add column if not exists motif_non_retenu text;

-- Sur le marché : lieu de la décision (bloc signature de la DMA).
alter table public.marches
  add column if not exists lieu_decision text;
