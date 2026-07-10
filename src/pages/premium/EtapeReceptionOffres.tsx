import { useState } from 'react'
import { Plus, Trash2, Upload, Paperclip } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useOffres } from '../../hooks/useOffres'
import type { Marche, Organisation, Prestataire } from '../../lib/premium-types'

// Étape Réception des offres : saisie des offres reçues + dépôt de la preuve (fichier).
export function EtapeReceptionOffres({ marche, organisation, prestataires }: {
  marche: Marche
  organisation: Organisation
  prestataires: Prestataire[]
}) {
  const { offres, create, update, remove } = useOffres(marche.id)
  const [nom, setNom] = useState('')
  const [prestId, setPrestId] = useState('')
  const [montant, setMontant] = useState('')
  const [tvac, setTvac] = useState('')
  const [delai, setDelai] = useState('')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [saving, setSaving] = useState(false)
  const [uploadId, setUploadId] = useState<string | null>(null)
  const [error, setError] = useState('')

  const attendues = marche.nb_offres_attendues
  const conformes = offres.filter(o => o.conforme).length

  const ajouter = async () => {
    const p = prestataires.find(x => x.id === prestId)
    const nomOp = p?.nom_entreprise ?? nom.trim()
    if (!nomOp) { setError("Indique le nom de l'opérateur."); return }
    setSaving(true); setError('')
    const { error } = await create({
      marche_id: marche.id, prestataire_id: p?.id ?? null,
      nom_operateur: nomOp,
      montant_htva: montant ? Number(montant) : null,
      montant_tvac: tvac ? Number(tvac) : null,
      delai_execution: delai.trim() || null,
      date_reception: date || null,
      conforme: null, motif_non_retenu: null, notes: null, scores: null, score_total: null, preuve_storage_path: null,
    })
    setSaving(false)
    if (error) { setError(error); return }
    setNom(''); setPrestId(''); setMontant(''); setTvac(''); setDelai('')
  }

  const uploaderPreuve = async (offreId: string, file: File) => {
    setUploadId(offreId); setError('')
    const ext = file.name.split('.').pop() ?? 'bin'
    const path = `${organisation.id}/${marche.id}/${offreId}.${ext}`
    const { error: upErr } = await supabase.storage.from('preuves').upload(path, file, { upsert: true })
    if (upErr) { setError('Upload : ' + upErr.message); setUploadId(null); return }
    await update(offreId, { preuve_storage_path: path })
    setUploadId(null)
  }

  return (
    <div className="space-y-6">
      {/* Formulaire d'ajout */}
      <div className="bg-white rounded-2xl border border-line p-6 shadow-card">
        <p className="font-semibold text-navy text-sm mb-4">Enregistrer une offre reçue</p>
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-slate">Opérateur (carnet)</label>
            <select value={prestId} onChange={e => setPrestId(e.target.value)} className="w-full mt-1 text-sm border border-line rounded-lg px-3 py-2 bg-white text-navy">
              <option value="">— Saisie libre ci-dessous —</option>
              {prestataires.map(p => <option key={p.id} value={p.id}>{p.nom_entreprise}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-slate">…ou nom libre</label>
            <input value={nom} onChange={e => setNom(e.target.value)} disabled={!!prestId} placeholder="Nom de l'opérateur" className="w-full mt-1 text-sm border border-line rounded-lg px-3 py-2 disabled:bg-sable" />
          </div>
          <div>
            <label className="text-xs text-slate">Montant HTVA (EUR)</label>
            <input value={montant} onChange={e => setMontant(e.target.value)} type="number" inputMode="decimal" placeholder="0.00" className="w-full mt-1 text-sm border border-line rounded-lg px-3 py-2" />
          </div>
          <div>
            <label className="text-xs text-slate">Montant TVAC (EUR)</label>
            <input value={tvac} onChange={e => setTvac(e.target.value)} type="number" inputMode="decimal" placeholder="0.00" className="w-full mt-1 text-sm border border-line rounded-lg px-3 py-2" />
          </div>
          <div>
            <label className="text-xs text-slate">Délai d'exécution proposé</label>
            <input value={delai} onChange={e => setDelai(e.target.value)} placeholder="ex. 30 jours ouvrables" className="w-full mt-1 text-sm border border-line rounded-lg px-3 py-2" />
          </div>
          <div>
            <label className="text-xs text-slate">Date de réception</label>
            <input value={date} onChange={e => setDate(e.target.value)} type="date" className="w-full mt-1 text-sm border border-line rounded-lg px-3 py-2" />
          </div>
        </div>
        {error && <p className="text-xs text-coral bg-coral/8 rounded-lg px-3 py-2 mt-3">{error}</p>}
        <button onClick={ajouter} disabled={saving} className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-white bg-navy rounded-lg px-4 py-2 hover:brightness-110 transition-all disabled:opacity-50">
          <Plus className="w-4 h-4" /> {saving ? 'Ajout…' : 'Ajouter l\'offre'}
        </button>
      </div>

      {/* Liste des offres */}
      <div className="bg-white rounded-2xl border border-line p-6 shadow-card">
        <p className="font-semibold text-navy text-sm mb-1">Offres reçues ({offres.length}{attendues ? ` / ${attendues} attendues` : ''})</p>
        <p className="text-xs text-slate mb-4">{conformes} conforme{conformes > 1 ? 's' : ''} sur {offres.length}.</p>

        {offres.length === 0 ? (
          <p className="text-sm text-slate">Aucune offre enregistrée.</p>
        ) : (
          <ul className="space-y-3">
            {offres.map(o => (
              <li key={o.id} className="border border-line rounded-lg p-3">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex-1 min-w-[140px]">
                    <p className="text-sm font-medium text-navy">{o.nom_operateur}</p>
                    <p className="text-xs text-slate">
                      {o.montant_htva != null ? `${o.montant_htva.toLocaleString('fr-BE')} € HTVA` : 'HTVA non renseigné'}
                      {o.montant_tvac != null ? ` · ${o.montant_tvac.toLocaleString('fr-BE')} € TVAC` : ''}
                      {o.delai_execution ? ` · délai ${o.delai_execution}` : ''}
                      {o.date_reception ? ` · reçue le ${new Date(o.date_reception).toLocaleDateString('fr-BE')}` : ''}
                    </p>
                  </div>
                  <label className="inline-flex items-center gap-1.5 text-xs font-medium text-navy cursor-pointer">
                    <input type="checkbox" checked={!!o.conforme} onChange={e => update(o.id, { conforme: e.target.checked })} className="accent-teal" />
                    Conforme
                  </label>
                  <label className="inline-flex items-center gap-1.5 text-xs font-semibold text-navy border border-line rounded-lg px-3 py-1.5 hover:border-coral/50 hover:text-coral transition-colors cursor-pointer">
                    {o.preuve_storage_path ? <Paperclip className="w-3.5 h-3.5 text-teal" /> : <Upload className="w-3.5 h-3.5" />}
                    {uploadId === o.id ? 'Envoi…' : o.preuve_storage_path ? 'Pièce jointe' : 'Joindre'}
                    <input type="file" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) uploaderPreuve(o.id, f) }} />
                  </label>
                  <button onClick={() => remove(o.id)} className="text-slate hover:text-coral p-1"><Trash2 className="w-4 h-4" /></button>
                </div>
                {/* Complément TVAC / délai (éditable en ligne) */}
                <div className="flex flex-wrap items-center gap-2 mt-2 pt-2 border-t border-line/60">
                  <label className="text-[11px] text-slate">TVAC
                    <input type="number" defaultValue={o.montant_tvac ?? ''} onBlur={e => { const v = e.target.value; update(o.id, { montant_tvac: v ? Number(v) : null }) }} placeholder="EUR" className="ml-1 w-24 text-xs border border-line rounded px-2 py-1" />
                  </label>
                  <label className="text-[11px] text-slate">Délai
                    <input defaultValue={o.delai_execution ?? ''} onBlur={e => update(o.id, { delai_execution: e.target.value.trim() || null })} placeholder="ex. 30 jours" className="ml-1 w-36 text-xs border border-line rounded px-2 py-1" />
                  </label>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
