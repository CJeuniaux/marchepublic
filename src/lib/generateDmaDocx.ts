import {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle,
} from 'docx'
import type { Marche, Organisation, Offre } from './premium-types'
import { LIBELLE_PROCEDURE, type Procedure } from './documents'

const DISCLAIMER = "Ce document est un modèle préparatoire généré automatiquement sur base des informations fournies. Il ne constitue pas un avis juridique et ne remplace pas une consultation spécialisée en marchés publics. Il doit être relu, adapté et validé par le pouvoir adjudicateur ou son conseil avant toute notification aux opérateurs économiques. MarchéPublic.be décline toute responsabilité quant à l'utilisation de ce document."

function h(text: string) {
  return new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 240, after: 120 }, children: [new TextRun({ text, bold: true })] })
}
function p(text: string) {
  return new Paragraph({ spacing: { after: 120 }, children: [new TextRun(text)] })
}
function kv(label: string, value: string) {
  return new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: label + ' : ', bold: true }), new TextRun(value)] })
}

// Décision Motivée d'Attribution : justifie le choix de l'adjudicataire.
export async function downloadDmaDocx(marche: Marche, org: Organisation, offres: Offre[], retenu: Offre | null) {
  const dateJour = new Date().toLocaleDateString('fr-BE')
  const procedure = LIBELLE_PROCEDURE[marche.procedure as Procedure] ?? marche.procedure
  const conformes = offres.filter(o => o.conforme)
  const surCriteres = (marche.criteres_attribution ?? []).length > 0
  const classees = [...conformes].sort((a, b) =>
    surCriteres ? (b.score_total ?? 0) - (a.score_total ?? 0) : (a.montant_htva ?? Infinity) - (b.montant_htva ?? Infinity),
  )

  const children: Paragraph[] = [
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: "DÉCISION MOTIVÉE D'ATTRIBUTION", bold: true, size: 32 })] }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 240 }, children: [new TextRun({ text: marche.objet, italics: true, size: 24 })] }),

    h('1. Pouvoir adjudicateur'),
    kv('Organisation', org.nom),
    ...(org.adresse ? [kv('Adresse', org.adresse)] : []),
    ...(org.pouvoir_adjudicateur ? [kv('Pouvoir adjudicateur', org.pouvoir_adjudicateur)] : []),
    ...(org.representant_legal_nom ? [kv('Représentant légal', `${org.representant_legal_nom}${org.representant_legal_fonction ? ', ' + org.representant_legal_fonction : ''}`)] : []),

    h('2. Objet et procédure'),
    kv('Objet du marché', marche.objet),
    kv('Type', marche.type_achat),
    kv('Montant estimé', `${marche.montant_estime_htva.toLocaleString('fr-BE')} EUR HTVA`),
    kv('Procédure', procedure),
    ...(marche.date_attribution ? [kv("Date de la décision", new Date(marche.date_attribution).toLocaleDateString('fr-BE'))] : [kv('Date de la décision', dateJour)]),

    h('3. Offres reçues et analyse'),
    p(`${offres.length} offre(s) reçue(s), dont ${conformes.length} conforme(s) à l'examen de recevabilité.`),
  ]

  classees.forEach((o, i) => {
    const detail = surCriteres
      ? `score global ${o.score_total != null ? o.score_total.toFixed(1) + '/100' : 'non calculé'}`
      : `${o.montant_htva != null ? o.montant_htva.toLocaleString('fr-BE') + ' EUR HTVA' : 'montant non renseigné'}`
    children.push(p(`${i + 1}. ${o.nom_operateur} — ${detail}`))
  })

  children.push(h('4. Choix de l\'adjudicataire'))
  if (retenu) {
    children.push(kv('Adjudicataire retenu', retenu.nom_operateur))
    if (retenu.montant_htva != null) children.push(kv('Montant de l\'offre', `${retenu.montant_htva.toLocaleString('fr-BE')} EUR HTVA`))
  }
  children.push(h('5. Motivation'))
  children.push(p(marche.justification_choix?.trim() || 'À compléter : exposer les motifs de fait et de droit ayant conduit au choix de l\'adjudicataire (offre régulière, économiquement la plus avantageuse au regard des critères annoncés, etc.).'))

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
  a.download = `decision-attribution-${(marche.objet || 'document').slice(0, 40).replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.docx`
  document.body.appendChild(a); a.click(); a.remove()
  URL.revokeObjectURL(url)
}
