import { useState } from 'react'
import { Plus, Trash2, Copy, Check } from 'lucide-react'
import { useConsultationsEnvois } from '../../hooks/useConsultationsEnvois'
import type { Marche, Organisation, Prestataire, StatutEnvoi, CanalEnvoi } from '../../lib/premium-types'

const LIBELLE_STATUT: Record<StatutEnvoi, string> = {
  a_envoyer: 'À envoyer', envoye: 'Envoyé', relance: 'Relancé', repondu: 'A répondu', sans_reponse: 'Sans réponse',
}
const LIBELLE_CANAL: Record<CanalEnvoi, string> = {
  email: 'E-mail', courrier: 'Courrier', main_propre: 'Main propre', autre: 'Autre',
}

// Étape Consultation : suivi des demandes d'offre envoyées aux opérateurs.
export function EtapeConsultation({ marche, organisation, prestataires }: {
  marche: Marche
  organisation: Organisation
  prestataires: Prestataire[]
}) {
  const { envois, create, update, remove } = useConsultationsEnvois(marche.id)
  const [copie, setCopie] = useState(false)

  const idsSel = marche.prestataires_selectionnes ?? []
  const dejaAjoutes = new Set(envois.map(e => e.prestataire_id).filter(Boolean))
  const presSel = prestataires.filter(p => idsSel.includes(p.id))
  const aAjouter = presSel.filter(p => !dejaAjoutes.has(p.id))

  const ajouterTous = async () => {
    for (const p of aAjouter) {
      await create({
        marche_id: marche.id, prestataire_id: p.id,
        destinataire_email: p.email, destinataire_nom: p.nom_entreprise,
        date_envoi: new Date().toISOString().slice(0, 10),
        canal: 'email', statut: 'a_envoyer', notes: null,
      })
    }
  }

  const modeleEmail = `Objet : Demande d'offre — ${marche.objet}

Madame, Monsieur,

Dans le cadre d'un marché public de ${marche.type_achat}, ${organisation.nom} vous invite à remettre une offre pour : ${marche.objet}.

${marche.date_limite_offres ? `Les offres sont attendues pour le ${new Date(marche.date_limite_offres).toLocaleDateString('fr-BE')} au plus tard.` : ''}

Le cahier spécial des charges est joint au présent courriel. Nous restons à votre disposition pour toute question.

Cordialement,
${organisation.representant_legal_nom ?? organisation.nom}${organisation.representant_legal_fonction ? `\n${organisation.representant_legal_fonction}` : ''}
${organisation.email_contact ?? ''}`

  const copier = async () => {
    await navigator.clipboard.writeText(modeleEmail)
    setCopie(true); setTimeout(() => setCopie(false), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Modèle de demande d'offre */}
      <div className="bg-white rounded-2xl border border-line p-6 shadow-card">
        <div className="flex items-center justify-between mb-3">
          <p className="font-semibold text-navy text-sm">Modèle de demande d'offre</p>
          <button onClick={copier} className="inline-flex items-center gap-1.5 text-xs font-semibold text-navy border border-line rounded-lg px-3 py-1.5 hover:border-coral/50 hover:text-coral transition-colors">
            {copie ? <><Check className="w-3.5 h-3.5" /> Copié</> : <><Copy className="w-3.5 h-3.5" /> Copier le texte</>}
          </button>
        </div>
        <pre className="text-xs text-slate whitespace-pre-wrap font-sans bg-sable rounded-lg p-4 leading-relaxed">{modeleEmail}</pre>
      </div>

      {/* Suivi des envois */}
      <div className="bg-white rounded-2xl border border-line p-6 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <p className="font-semibold text-navy text-sm">Suivi des envois ({envois.length})</p>
          {aAjouter.length > 0 && (
            <button onClick={ajouterTous} className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-navy rounded-lg px-3 py-1.5 hover:brightness-110 transition-all">
              <Plus className="w-3.5 h-3.5" /> Ajouter les {aAjouter.length} opérateurs sélectionnés
            </button>
          )}
        </div>

        {envois.length === 0 ? (
          <p className="text-sm text-slate">Aucun envoi enregistré. Ajoute les opérateurs sélectionnés pour suivre tes demandes d'offre.</p>
        ) : (
          <ul className="space-y-3">
            {envois.map(e => (
              <li key={e.id} className="flex flex-wrap items-center gap-3 border border-line rounded-lg p-3">
                <div className="flex-1 min-w-[140px]">
                  <p className="text-sm font-medium text-navy">{e.destinataire_nom ?? '—'}</p>
                  {e.destinataire_email && <p className="text-xs text-slate">{e.destinataire_email}</p>}
                </div>
                <select value={e.canal} onChange={ev => update(e.id, { canal: ev.target.value as CanalEnvoi })} className="text-xs border border-line rounded-lg px-2 py-1.5 bg-white text-navy">
                  {Object.entries(LIBELLE_CANAL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
                <select value={e.statut} onChange={ev => update(e.id, { statut: ev.target.value as StatutEnvoi })} className="text-xs border border-line rounded-lg px-2 py-1.5 bg-white text-navy">
                  {Object.entries(LIBELLE_STATUT).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
                <button onClick={() => remove(e.id)} className="text-slate hover:text-coral p-1"><Trash2 className="w-4 h-4" /></button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
