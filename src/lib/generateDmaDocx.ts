import {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle,
  Table, TableRow, TableCell, WidthType,
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
function eur(n: number | null | undefined): string {
  return n != null ? `${n.toLocaleString('fr-BE')} EUR` : '—'
}
function frDate(d: string | null | undefined): string {
  return d ? new Date(d).toLocaleDateString('fr-BE') : '—'
}
// TVAC : valeur saisie, sinon estimation à 21 %.
function tvac(o: Offre): number | null {
  if (o.montant_tvac != null) return o.montant_tvac
  if (o.montant_htva != null) return Math.round(o.montant_htva * 1.21 * 100) / 100
  return null
}

function cell(text: string, opts: { bold?: boolean; header?: boolean } = {}) {
  return new TableCell({
    margins: { top: 40, bottom: 40, left: 80, right: 80 },
    shading: opts.header ? { fill: 'F0EDE8' } : undefined,
    children: [new Paragraph({ children: [new TextRun({ text, bold: opts.bold || opts.header, size: 18 })] })],
  })
}

// Décision Motivée d'Attribution : justifie le choix de l'adjudicataire.
export async function downloadDmaDocx(marche: Marche, org: Organisation, offres: Offre[], retenu: Offre | null) {
  const dateJour = new Date().toLocaleDateString('fr-BE')
  const procedure = LIBELLE_PROCEDURE[marche.procedure as Procedure] ?? marche.procedure
  const criteres = marche.criteres_attribution ?? []
  const surCriteres = criteres.length > 0
  const conformes = offres.filter(o => o.conforme)
  const nonConformes = offres.filter(o => o.conforme === false)
  const classees = [...conformes].sort((a, b) =>
    surCriteres ? (b.score_total ?? 0) - (a.score_total ?? 0) : (a.montant_htva ?? Infinity) - (b.montant_htva ?? Infinity),
  )

  const children: (Paragraph | Table)[] = [
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: "DÉCISION MOTIVÉE D'ATTRIBUTION", bold: true, size: 32 })] }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 240 }, children: [new TextRun({ text: marche.objet, italics: true, size: 24 })] }),

    // 1. Pouvoir adjudicateur
    h('1. Pouvoir adjudicateur'),
    kv('Organisation', org.nom),
    ...(org.adresse ? [kv('Adresse', org.adresse)] : []),
    ...(org.numero_bce ? [kv('Numéro BCE', org.numero_bce)] : []),
    ...(org.pouvoir_adjudicateur ? [kv('Pouvoir adjudicateur', org.pouvoir_adjudicateur)] : []),
    ...(org.representant_legal_nom ? [kv('Représentant légal', `${org.representant_legal_nom}${org.representant_legal_fonction ? ', ' + org.representant_legal_fonction : ''}`)] : []),
    ...(org.email_contact ? [kv('Courriel de contact', org.email_contact)] : []),

    // 2. Objet et procédure
    h('2. Objet et procédure'),
    kv('Objet du marché', marche.objet),
    kv('Type', marche.type_achat),
    kv('Montant estimé', `${eur(marche.montant_estime_htva)} HTVA`),
    kv('Procédure', procedure),
    kv('Date de lancement', frDate(marche.date_lancement)),
    kv('Date limite de remise des offres', frDate(marche.date_limite_offres)),
    kv('Durée du marché', marche.duree_marche || '—'),
  ]

  // 3. Critères d'attribution et pondération
  if (surCriteres) {
    children.push(h("3. Critères d'attribution et pondération"))
    children.push(new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({ children: [cell('Critère', { header: true }), cell('Pondération', { header: true })] }),
        ...criteres.map(c => new TableRow({ children: [cell(c.critere), cell(`${c.ponderation} %`)] })),
      ],
    }))
  }

  // 4. Offres reçues et analyse (tableau détaillé)
  children.push(h(`${surCriteres ? '4' : '3'}. Offres reçues et analyse`))
  children.push(p(`${offres.length} offre(s) reçue(s), dont ${conformes.length} conforme(s) et ${nonConformes.length} non conforme(s) à l'examen de recevabilité.`))

  const enTete = [
    cell('Rang', { header: true }), cell('Opérateur', { header: true }),
    cell('Montant HTVA', { header: true }), cell('Montant TVAC', { header: true }),
    cell("Délai d'exécution", { header: true }), cell('Reçue le', { header: true }),
    ...(surCriteres ? criteres.map(c => cell(`${c.critere} (${c.ponderation}%)`, { header: true })) : []),
    cell(surCriteres ? 'Score' : 'Conforme', { header: true }),
  ]
  const lignes = classees.map((o, i) => new TableRow({
    children: [
      cell(String(i + 1)), cell(o.nom_operateur),
      cell(eur(o.montant_htva)), cell(eur(tvac(o))),
      cell(o.delai_execution || '—'), cell(frDate(o.date_reception)),
      ...(surCriteres ? criteres.map(c => cell(o.scores?.[c.critere] != null ? String(o.scores[c.critere]) : '—')) : []),
      cell(surCriteres ? (o.score_total != null ? o.score_total.toFixed(1) : '—') : (o.conforme ? 'Oui' : 'Non'), { bold: i === 0 }),
    ],
  }))
  children.push(new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: [new TableRow({ children: enTete }), ...lignes] }))

  // Offres non conformes (le cas échéant)
  if (nonConformes.length) {
    children.push(p('Offres écartées pour non-conformité : ' + nonConformes.map(o => o.nom_operateur).join(', ') + '.'))
  }

  // 5. Choix de l'adjudicataire
  children.push(h(`${surCriteres ? '5' : '4'}. Choix de l'adjudicataire`))
  if (retenu) {
    children.push(kv('Adjudicataire retenu', retenu.nom_operateur))
    children.push(kv("Montant de l'offre", `${eur(retenu.montant_htva)} HTVA — ${eur(tvac(retenu))} TVAC`))
    if (retenu.delai_execution) children.push(kv("Délai d'exécution proposé", retenu.delai_execution))
  } else {
    children.push(p('Adjudicataire à désigner.'))
  }

  // 6. Motivation
  children.push(h(`${surCriteres ? '6' : '5'}. Motivation du choix`))
  children.push(p(marche.justification_choix?.trim() || 'À compléter : exposer les motifs de fait et de droit ayant conduit au choix de l\'adjudicataire (offre régulière, économiquement la plus avantageuse au regard des critères annoncés, etc.).'))

  // 7. Motifs de non-attribution des offres écartées
  const ecartees = classees.filter(o => retenu ? o.id !== retenu.id : true)
  if (retenu && ecartees.length) {
    children.push(h(`${surCriteres ? '7' : '6'}. Motifs de non-attribution`))
    ecartees.forEach(o => {
      children.push(new Paragraph({
        spacing: { after: 80 },
        children: [
          new TextRun({ text: `${o.nom_operateur} : `, bold: true }),
          new TextRun(o.motif_non_retenu?.trim() || 'À compléter : motif du rejet de cette offre.'),
        ],
      }))
    })
  }

  // Bloc signature
  const lieu = marche.lieu_decision?.trim() || '[Lieu]'
  const dateDecision = marche.date_attribution ? frDate(marche.date_attribution) : dateJour
  children.push(
    new Paragraph({ spacing: { before: 360, after: 120 }, children: [new TextRun({ text: `Fait à ${lieu}, le ${dateDecision}.`, bold: true })] }),
    p('Pour le pouvoir adjudicateur,'),
    new Paragraph({ spacing: { before: 240 }, children: [new TextRun({ text: '_______________________________', color: '999999' })] }),
    ...(org.representant_legal_nom ? [p(`${org.representant_legal_nom}${org.representant_legal_fonction ? ', ' + org.representant_legal_fonction : ''}`)] : [p('[Représentant légal, fonction]')]),
  )

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
