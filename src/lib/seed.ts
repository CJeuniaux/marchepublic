import { supabase } from './supabase'
import { DEMO_ORG, DEMO_PRESTATAIRES, DEMO_MARCHES } from './premium-constants'
import { calculerProcedure, mappingKey, DOCUMENTS_PAR_PROCEDURE } from './documents'
import type { Prestataire } from './premium-types'

// Décalage de date en YYYY-MM-DD à partir d'aujourd'hui.
function jour(offsetJours: number): string {
  const d = new Date()
  d.setDate(d.getDate() + offsetJours)
  return d.toISOString().slice(0, 10)
}

const CHECKLIST_KEYS = ['csc', 'consultation', 'offres', 'comparatif', 'dma', 'notif_retenu', 'notif_non_retenus', 'conservation']

// Peuple le compte courant avec une organisation, des prestataires (3 par type)
// et un jeu de marchés publics couvrant toutes les étapes du cycle de vie.
// Respecte la RLS : l'utilisateur ne peut écrire que sur ses propres données.
export async function seedDemoAccount(userId: string): Promise<{ error: string | null }> {
  const { data: org, error: orgErr } = await supabase
    .from('organisations')
    .upsert({ ...DEMO_ORG, user_id: userId }, { onConflict: 'user_id' })
    .select('id')
    .single()
  if (orgErr || !org) return { error: orgErr?.message ?? 'Organisation non créée' }
  const orgId = (org as { id: string }).id

  // Prestataires : ajout additif — on n'insère que ceux qui manquent (par nom d'entreprise),
  // ce qui permet de compléter un carnet déjà partiellement rempli sans créer de doublons.
  const { data: existingPres } = await supabase
    .from('prestataires')
    .select('nom_entreprise')
    .eq('organisation_id', orgId)
  const dejaLa = new Set((existingPres ?? []).map(p => (p as { nom_entreprise: string }).nom_entreprise))
  const aInserer = DEMO_PRESTATAIRES.filter(p => !dejaLa.has(p.nom_entreprise))
  if (aInserer.length) {
    const { error: presErr } = await supabase
      .from('prestataires')
      .insert(aInserer.map(p => ({ ...p, organisation_id: orgId })))
    if (presErr) return { error: presErr.message }
  }

  // Marchés : ajout additif — on n'insère que les marchés de démo dont l'objet
  // n'existe pas déjà, pour ne pas dupliquer ni écraser des marchés existants.
  const { data: existingMarches } = await supabase
    .from('marches')
    .select('objet')
    .eq('organisation_id', orgId)
  const objetsPresents = new Set((existingMarches ?? []).map(m => (m as { objet: string }).objet))

  // On recharge les prestataires pour disposer de leurs ids, groupés par catégorie.
  const { data: presData } = await supabase
    .from('prestataires')
    .select('*')
    .eq('organisation_id', orgId)
  const prestataires = (presData as Prestataire[] | null) ?? []
  const parCategorie = (cat: string) => prestataires.filter(p => p.categorie === cat)

  for (const dm of DEMO_MARCHES) {
    if (objetsPresents.has(dm.objet)) continue
    const pres = parCategorie(dm.categorie)
    const { procedure, seuil } = calculerProcedure(dm.montant, dm.type_achat)
    const documents = DOCUMENTS_PAR_PROCEDURE[mappingKey(procedure, dm.type_achat)] ?? []
    const idsSel = pres.map(p => p.id)
    const retenu = dm.retenuIndex != null ? pres[dm.retenuIndex] : null

    const checklist = dm.checklistComplete
      ? Object.fromEntries(CHECKLIST_KEYS.map(k => [k, true]))
      : null

    const { data: marche, error: mErr } = await supabase
      .from('marches')
      .insert({
        organisation_id: orgId,
        statut: dm.statut ?? 'brouillon',
        objet: dm.objet,
        type_achat: dm.type_achat,
        montant_estime_htva: dm.montant,
        procedure,
        seuil,
        date_lancement: jour(-30),
        date_limite_offres: jour(dm.limiteJours),
        description_besoin: dm.description,
        criteres_attribution: dm.criteres ?? null,
        prestataires_selectionnes: idsSel,
        documents_selectionnes: documents,
        inclure_rgpd: true,
        inclure_voies_recours: procedure !== 'faible_montant',
        workflow_etape: dm.workflow_etape,
        nb_offres_attendues: idsSel.length,
        prestataire_retenu_id: retenu?.id ?? null,
        justification_choix: dm.justification ?? null,
        date_attribution: dm.retenuIndex != null ? jour(-2) : null,
        checklist_archives: checklist,
      })
      .select('id')
      .single()
    if (mErr || !marche) return { error: mErr?.message ?? 'Marché non créé' }
    const marcheId = (marche as { id: string }).id

    // Envois de consultation.
    if (dm.envois?.length) {
      const rows = dm.envois.map(e => {
        const p = pres[e.presIndex]
        return {
          marche_id: marcheId, prestataire_id: p?.id ?? null,
          destinataire_email: p?.email ?? null, destinataire_nom: p?.nom_entreprise ?? null,
          date_envoi: jour(-8), canal: e.canal ?? 'email', statut: e.statut, notes: null,
        }
      })
      const { error: eErr } = await supabase.from('consultations_envois').insert(rows)
      if (eErr) return { error: eErr.message }
    }

    // Offres reçues.
    if (dm.offres?.length) {
      const rows = dm.offres.map(o => {
        const p = o.presIndex != null ? pres[o.presIndex] : null
        return {
          marche_id: marcheId, prestataire_id: p?.id ?? null,
          nom_operateur: p?.nom_entreprise ?? o.nomLibre ?? 'Opérateur',
          montant_htva: o.montant_htva,
          date_reception: jour(-o.joursDepuisReception),
          conforme: o.conforme,
          scores: o.scores ?? null,
          score_total: o.score_total ?? null,
          notes: null, preuve_storage_path: null,
        }
      })
      const { error: oErr } = await supabase.from('offres').insert(rows)
      if (oErr) return { error: oErr.message }
    }
  }

  return { error: null }
}
