import {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle,
} from 'docx'
import type { Marche, Organisation, Prestataire } from './premium-types'
import { LIBELLE_PROCEDURE, type Procedure } from './documents'

const DISCLAIMER = "Ce document est un modèle préparatoire généré automatiquement sur base des informations fournies. Il ne constitue pas un avis juridique et ne remplace pas une consultation spécialisée en marchés publics. Il doit être relu, adapté et validé par le pouvoir adjudicateur ou son conseil avant toute publication ou communication aux opérateurs économiques. MarchéPublic.be décline toute responsabilité quant à l'utilisation de ce document."

function h(text: string) {
  return new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 240, after: 120 }, children: [new TextRun({ text, bold: true })] })
}
function p(text: string) {
  return new Paragraph({ spacing: { after: 120 }, children: [new TextRun(text)] })
}
function kv(label: string, value: string) {
  return new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: label + ' : ', bold: true }), new TextRun(value)] })
}

export async function downloadMarcheDocx(marche: Marche, org: Organisation, prestataires: Prestataire[]) {
  const dateJour = new Date().toLocaleDateString('fr-BE')
  const procedure = LIBELLE_PROCEDURE[marche.procedure as Procedure] ?? marche.procedure

  const children: Paragraph[] = [
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: 'CAHIER SPÉCIAL DES CHARGES', bold: true, size: 32 })] }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 240 }, children: [new TextRun({ text: marche.objet, italics: true, size: 24 })] }),

    h('1. Pouvoir adjudicateur'),
    kv('Organisation', org.nom),
    ...(org.adresse ? [kv('Adresse', org.adresse)] : []),
    ...(org.numero_bce ? [kv('Numéro BCE', org.numero_bce)] : []),
    ...(org.pouvoir_adjudicateur ? [kv('Pouvoir adjudicateur', org.pouvoir_adjudicateur)] : []),
    ...(org.representant_legal_nom ? [kv('Représentant légal', `${org.representant_legal_nom}${org.representant_legal_fonction ? ', ' + org.representant_legal_fonction : ''}`)] : []),
    ...(org.email_contact ? [kv('Contact', org.email_contact)] : []),

    h('2. Objet du marché'),
    kv('Objet', marche.objet),
    kv('Type', marche.type_achat),
    kv('Montant estimé', `${marche.montant_estime_htva.toLocaleString('fr-BE')} EUR HTVA`),
    kv('Procédure', procedure),
    ...(marche.date_lancement ? [kv('Date de lancement', marche.date_lancement)] : []),
    ...(marche.date_limite_offres ? [kv('Date limite des offres', marche.date_limite_offres)] : []),
    ...(marche.duree_marche ? [kv('Durée', marche.duree_marche)] : []),
  ]

  if (org.introduction_standard) { children.push(h('3. Introduction'), p(org.introduction_standard)) }
  if (marche.description_besoin) { children.push(h('4. Description du besoin'), p(marche.description_besoin)) }

  if (prestataires.length) {
    children.push(h('5. Opérateurs consultés'))
    prestataires.forEach(pr => children.push(p(`${pr.nom_entreprise}${pr.contact_nom ? ' (' + pr.contact_nom + ')' : ''}${pr.email ? ' — ' + pr.email : ''}`)))
  }

  if (marche.inclure_rgpd && org.clause_rgpd_standard) { children.push(h('Clause relative à la protection des données (RGPD)'), p(org.clause_rgpd_standard)) }

  children.push(
    new Paragraph({ spacing: { before: 360 }, border: { top: { style: BorderStyle.SINGLE, size: 6, color: 'CCCCCC' } }, children: [] }),
    new Paragraph({ spacing: { before: 120 }, children: [new TextRun({ text: DISCLAIMER, italics: true, size: 16, color: '666666' })] }),
    new Paragraph({ spacing: { before: 120 }, children: [new TextRun({ text: `Document généré le ${dateJour} via marchépublic.be`, size: 16, color: '999999' })] }),
  )

  const doc = new Document({ sections: [{ children }] })
  const blob = await Packer.toBlob(doc)
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `marche-public-${(marche.objet || 'document').slice(0, 40).replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.docx`
  document.body.appendChild(a); a.click(); a.remove()
  URL.revokeObjectURL(url)
}
