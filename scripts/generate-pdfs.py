#!/usr/bin/env python3
"""Génère les fiches pratiques PDF pour marchépublic.be."""
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import cm
import os

W, H = A4
MARGIN = 2.2 * cm
COL = W - 2 * MARGIN

NAVY   = colors.HexColor('#2E2348')
CORAL  = colors.HexColor('#E63948')
CREAM  = colors.HexColor('#FBF7F1')
SABLE  = colors.HexColor('#F4E9D8')
SLATE  = colors.HexColor('#5E6B7D')
LINE   = colors.HexColor('#E4D9CC')
SUN    = colors.HexColor('#F4C48F')

OUT = os.path.join(os.path.dirname(__file__), '..', 'public', 'resources')


def page_header(c, title, subtitle, y_start=None):
    if y_start is None:
        y_start = H - 1.4 * cm
    # Coral top stripe
    c.setFillColor(CORAL)
    c.rect(0, H - 0.45 * cm, W, 0.45 * cm, fill=1, stroke=0)
    # Cream background strip for header
    c.setFillColor(CREAM)
    c.rect(0, H - 3.8 * cm, W, 3.35 * cm, fill=1, stroke=0)
    # Logo wordmark
    c.setFillColor(NAVY)
    c.setFont('Helvetica-Bold', 9)
    c.drawString(MARGIN, H - 1.2 * cm, 'marchépublic')
    c.setFillColor(CORAL)
    c.drawString(MARGIN + 62, H - 1.2 * cm, '.be')
    c.setFillColor(SLATE)
    c.setFont('Helvetica', 7)
    c.drawString(MARGIN, H - 1.65 * cm, 'Outil pédagogique indépendant · Belgique')
    # Title
    c.setFillColor(NAVY)
    c.setFont('Helvetica-Bold', 15)
    # Wrap title if needed
    _draw_text(c, title, MARGIN, H - 2.6 * cm, COL, 'Helvetica-Bold', 15, NAVY, line_h=20)
    # Line under header
    c.setStrokeColor(LINE)
    c.setLineWidth(0.5)
    c.line(MARGIN, H - 3.85 * cm, W - MARGIN, H - 3.85 * cm)
    return H - 4.3 * cm


def _draw_text(c, text, x, y, max_w, font, size, col, line_h=14, align='left'):
    c.setFillColor(col)
    c.setFont(font, size)
    words = text.split()
    line = ''
    lines = []
    for w in words:
        test = (line + ' ' + w).strip()
        if c.stringWidth(test, font, size) <= max_w:
            line = test
        else:
            if line:
                lines.append(line)
            line = w
    if line:
        lines.append(line)
    for l in lines:
        if align == 'center':
            c.drawCentredString(x, y, l)
        else:
            c.drawString(x, y, l)
        y -= line_h
    return y


def section_title(c, text, y):
    c.setFillColor(CORAL)
    c.rect(MARGIN, y - 1, 3, 13, fill=1, stroke=0)
    c.setFillColor(NAVY)
    c.setFont('Helvetica-Bold', 11)
    c.drawString(MARGIN + 8, y, text)
    return y - 20


def bullet(c, text, y, indent=0, col=None):
    if col is None:
        col = SLATE
    bx = MARGIN + indent
    c.setFillColor(CORAL)
    c.circle(bx + 3, y + 3.5, 2, fill=1, stroke=0)
    c.setFillColor(col)
    c.setFont('Helvetica', 9.5)
    y2 = _draw_text(c, text, bx + 10, y, COL - indent - 10, 'Helvetica', 9.5, col, line_h=13)
    return y2 - 3


def checkbox(c, text, y, bold=False):
    font = 'Helvetica-Bold' if bold else 'Helvetica'
    c.setStrokeColor(LINE)
    c.setFillColor(colors.white)
    c.rect(MARGIN, y, 10, 10, fill=1, stroke=1)
    c.setFillColor(NAVY)
    c.setFont(font, 9.5)
    y2 = _draw_text(c, text, MARGIN + 16, y + 7, COL - 16, font, 9.5, NAVY, line_h=13)
    return y2 - 3


def disclaimer_footer(c):
    c.setFillColor(SABLE)
    c.rect(0, 0, W, 1.4 * cm, fill=1, stroke=0)
    c.setStrokeColor(LINE)
    c.setLineWidth(0.5)
    c.line(0, 1.4 * cm, W, 1.4 * cm)
    c.setFillColor(SLATE)
    c.setFont('Helvetica-Oblique', 7)
    c.drawString(MARGIN, 0.85 * cm, "Ce document est fourni à titre pédagogique uniquement. Il ne constitue pas un avis juridique et ne remplace pas")
    c.drawString(MARGIN, 0.55 * cm, "l'analyse d'un·e juriste ou d'un service compétent. Les seuils sont indicatifs et doivent être vérifiés auprès des sources officielles belges.")
    c.setFillColor(NAVY)
    c.setFont('Helvetica-Bold', 7)
    c.drawString(MARGIN, 0.25 * cm, "marchépublic.be")
    c.setFillColor(SLATE)
    c.setFont('Helvetica', 7)
    c.drawString(MARGIN + 58, 0.25 * cm, "— Un outil développé par Nomad Impact ASBL.")


def info_box(c, text, y, bg=None):
    if bg is None:
        bg = SABLE
    lines_est = max(1, len(text) // 80 + text.count('\n'))
    box_h = lines_est * 13 + 16
    c.setFillColor(bg)
    c.roundRect(MARGIN, y - box_h + 8, COL, box_h, 4, fill=1, stroke=0)
    c.setFillColor(SLATE)
    c.setFont('Helvetica-Oblique', 9)
    y_text = y - 2
    for line in text.split('\n'):
        y_text = _draw_text(c, line.strip(), MARGIN + 8, y_text, COL - 16, 'Helvetica-Oblique', 9, SLATE, line_h=13)
    return y - box_h - 6


# ─────────────────────────────────────────────
# DOC 1: acheter-sous-30000
# ─────────────────────────────────────────────
def doc_acheter_sous_30k(path):
    c = canvas.Canvas(path, pagesize=A4)
    c.setTitle("Acheter ou commander une prestation sous 30 000 € HTVA")
    y = page_header(c, "Acheter ou commander une prestation sous 30 000 € HTVA", "")
    y -= 8

    c.setFillColor(SLATE)
    c.setFont('Helvetica', 10)
    y = _draw_text(c, "Cette fiche vous guide pour commander un service ou une fourniture dont le montant estimé ne dépasse pas 30 000 € HTVA, dans le respect des bonnes pratiques de gestion et des obligations éventuelles liées à votre statut.", MARGIN, y, COL, 'Helvetica', 10, SLATE, line_h=14)
    y -= 12

    y = section_title(c, "Quand utiliser cette fiche ?", y)
    for item in [
        "Votre dépense estimée est inférieure à 30 000 € HTVA.",
        "Vous achetez un service, une fourniture ou une prestation simple.",
        "Vous voulez vous assurer de respecter les bonnes pratiques même si vous n'êtes pas soumis aux marchés publics.",
    ]:
        y = bullet(c, item, y)
    y -= 10

    y = section_title(c, "Ce que vous pouvez faire sous 30 000 € HTVA", y)
    y = _draw_text(c, "Si votre structure n'est pas qualifiée de 'pouvoir adjudicateur', vous restez libre de choisir votre prestataire. Mais adopter quelques réflexes de base protège votre organisation en cas de contrôle.", MARGIN, y, COL, 'Helvetica', 9.5, SLATE, line_h=13)
    y -= 10

    y = section_title(c, "Checklist : les bons réflexes", y)
    checks = [
        "Définir clairement le besoin avant de contacter des prestataires",
        "Contacter au moins 2 à 3 prestataires pour obtenir des offres comparatives",
        "Évaluer les offres sur des critères identiques (prix, délai, qualité, références)",
        "Consigner par écrit la raison du choix final",
        "Conserver les offres reçues dans le dossier de décision",
        "Vérifier que la convention de subvention n'impose pas de règles spécifiques",
        "Rédiger un bon de commande ou une lettre de mission",
    ]
    for ch in checks:
        y = checkbox(c, ch, y)
        y -= 2
    y -= 10

    y = section_title(c, "Tableau comparatif à compléter", y)
    headers = ['Critère', 'Prestataire A', 'Prestataire B', 'Prestataire C']
    rows = [
        ['Prix HTVA', '', '', ''],
        ['Délai proposé', '', '', ''],
        ['Références pertinentes', '', '', ''],
        ['Note globale /10', '', '', ''],
    ]
    col_w = COL / 4
    row_h = 18
    table_y = y
    c.setFillColor(NAVY)
    c.rect(MARGIN, table_y - row_h, COL, row_h, fill=1, stroke=0)
    c.setFillColor(colors.white)
    c.setFont('Helvetica-Bold', 8.5)
    for i, h in enumerate(headers):
        c.drawString(MARGIN + i * col_w + 4, table_y - row_h + 5, h)
    table_y -= row_h
    for ri, row in enumerate(rows):
        bg = CREAM if ri % 2 == 0 else colors.white
        c.setFillColor(bg)
        c.rect(MARGIN, table_y - row_h, COL, row_h, fill=1, stroke=0)
        c.setFillColor(SLATE)
        c.setFont('Helvetica', 8.5)
        for i, cell in enumerate(row):
            c.drawString(MARGIN + i * col_w + 4, table_y - row_h + 5, cell)
        c.setStrokeColor(LINE)
        c.setLineWidth(0.3)
        c.line(MARGIN, table_y - row_h, W - MARGIN, table_y - row_h)
        table_y -= row_h
    y = table_y - 12

    y = info_box(c, "Bon à savoir : en dessous de 3 000 € HTVA, une simple facture acceptée suffit généralement. Entre 3 000 € et 30 000 €, documenter votre mise en concurrence est une bonne pratique qui sécurise votre décision.", y)

    disclaimer_footer(c)
    c.save()


# ─────────────────────────────────────────────
# DOC 2: comparer-prestataires
# ─────────────────────────────────────────────
def doc_comparer(path):
    c = canvas.Canvas(path, pagesize=A4)
    c.setTitle("Comparer plusieurs prestataires simplement")
    y = page_header(c, "Comparer plusieurs prestataires simplement", "")
    y -= 8

    c.setFillColor(SLATE)
    y = _draw_text(c, "Comparer des prestataires sur des bases claires et écrites est une bonne pratique, que vous soyez ou non soumis aux marchés publics. Cette fiche vous propose une méthode simple et une grille prête à l'emploi.", MARGIN, y, COL, 'Helvetica', 10, SLATE, line_h=14)
    y -= 12

    y = section_title(c, "Pourquoi comparer plusieurs prestataires ?", y)
    for item in [
        "Pour obtenir le meilleur rapport qualité/prix pour votre organisation.",
        "Pour justifier votre choix en cas de contrôle par un bailleur ou auditeur.",
        "Pour respecter votre devoir de bonne gestion, indépendamment des marchés publics.",
        "Pour documenter une décision défendable si votre convention l'exige.",
    ]:
        y = bullet(c, item, y)
    y -= 10

    y = section_title(c, "Les 4 étapes d'une comparaison simple", y)
    steps = [
        ("1. Définir votre besoin", "Rédigez une courte description de ce que vous attendez : nature de la prestation, résultat attendu, délai, contraintes particulières."),
        ("2. Contacter plusieurs prestataires", "Envoyez la même demande à 2 ou 3 prestataires. Plus le montant est élevé, plus le nombre de consultations est important."),
        ("3. Évaluer les offres", "Utilisez la grille ci-dessous pour comparer les offres sur des critères identiques."),
        ("4. Documenter votre choix", "Conservez les offres reçues, votre grille remplie, et une note courte expliquant pourquoi vous avez retenu un prestataire."),
    ]
    for title, desc in steps:
        c.setFillColor(CORAL)
        c.setFont('Helvetica-Bold', 9.5)
        c.drawString(MARGIN, y, title)
        y -= 13
        y = _draw_text(c, desc, MARGIN + 8, y, COL - 8, 'Helvetica', 9, SLATE, line_h=13)
        y -= 8
    y -= 4

    y = section_title(c, "Grille de comparaison", y)
    headers = ['Critère', 'Poids', 'Prestataire A', 'Prestataire B', 'Prestataire C']
    rows = [
        ['Prix HTVA', '40 %', '', '', ''],
        ['Adéquation au besoin', '30 %', '', '', ''],
        ['Délai de livraison', '15 %', '', '', ''],
        ['Références / expérience', '15 %', '', '', ''],
        ['TOTAL pondéré', '100 %', '', '', ''],
    ]
    col_w = COL / 5
    row_h = 18
    table_y = y
    c.setFillColor(NAVY)
    c.rect(MARGIN, table_y - row_h, COL, row_h, fill=1, stroke=0)
    c.setFillColor(colors.white)
    c.setFont('Helvetica-Bold', 8)
    for i, h in enumerate(headers):
        c.drawString(MARGIN + i * col_w + 3, table_y - row_h + 5, h)
    table_y -= row_h
    for ri, row in enumerate(rows):
        bg = CREAM if ri % 2 == 0 else colors.white
        last = ri == len(rows) - 1
        if last:
            bg = SABLE
        c.setFillColor(bg)
        c.rect(MARGIN, table_y - row_h, COL, row_h, fill=1, stroke=0)
        c.setFillColor(NAVY if last else SLATE)
        c.setFont('Helvetica-Bold' if last else 'Helvetica', 8.5)
        for i, cell in enumerate(row):
            c.drawString(MARGIN + i * col_w + 3, table_y - row_h + 5, cell)
        c.setStrokeColor(LINE)
        c.setLineWidth(0.3)
        c.line(MARGIN, table_y - row_h, W - MARGIN, table_y - row_h)
        table_y -= row_h
    y = table_y - 12

    y = info_box(c, "Conseil : le poids de chaque critère peut être adapté à votre situation. L'essentiel est que les critères soient définis AVANT de recevoir les offres, et appliqués de façon identique à tous les prestataires.", y)

    disclaimer_footer(c)
    c.save()


# ─────────────────────────────────────────────
# DOC 3: cadrer-projet-digital
# ─────────────────────────────────────────────
def doc_cadrer_digital(path):
    c = canvas.Canvas(path, pagesize=A4)
    c.setTitle("Cadrer un projet digital avant de demander des prix")
    y = page_header(c, "Cadrer un projet digital avant de demander des prix", "")
    y -= 8

    c.setFillColor(SLATE)
    y = _draw_text(c, "Avant de demander des offres pour un site web, une application ou un logiciel, cadrer votre besoin vous permet d'obtenir des devis comparables et de choisir un prestataire adapté. Cette fiche vous guide pas à pas.", MARGIN, y, COL, 'Helvetica', 10, SLATE, line_h=14)
    y -= 12

    y = section_title(c, "Pourquoi cadrer avant de demander des prix ?", y)
    for item in [
        "Des offres non comparables rendent le choix arbitraire.",
        "Un besoin mal défini entraîne des coûts supplémentaires en cours de projet.",
        "Un document de cadrage vous protège en cas de litige ou de contrôle.",
    ]:
        y = bullet(c, item, y)
    y -= 10

    y = section_title(c, "Les 6 éléments clés d'un bon cadrage", y)
    elements = [
        ("Contexte et objectif", "Qui êtes-vous ? Pourquoi ce projet ? Quel problème résout-il ?"),
        ("Public cible", "Qui sont les utilisateurs finaux ? Quels sont leurs besoins ?"),
        ("Fonctionnalités attendues", "Liste des fonctions principales (ex : formulaire de contact, espace membres...)."),
        ("Contraintes techniques", "Hébergement, CMS, intégration avec d'autres outils, accessibilité..."),
        ("Budget indicatif", "Même une fourchette aide les prestataires à calibrer leur offre."),
        ("Délais", "Date de mise en ligne souhaitée, jalons intermédiaires."),
    ]
    for title, desc in elements:
        c.setFillColor(NAVY)
        c.setFont('Helvetica-Bold', 9.5)
        c.drawString(MARGIN, y, title)
        y -= 12
        y = _draw_text(c, desc, MARGIN + 8, y, COL - 8, 'Helvetica', 9, SLATE, line_h=13)
        y -= 7
    y -= 4

    y = section_title(c, "Checklist avant d'envoyer votre demande de devis", y)
    checks = [
        "J'ai rédigé une description du projet en 5 à 10 lignes",
        "J'ai listé les fonctionnalités indispensables et celles qui sont optionnelles",
        "J'ai précisé mes contraintes techniques ou d'hébergement",
        "J'ai indiqué un budget indicatif ou une fourchette",
        "J'ai précisé les délais souhaités",
        "J'ai préparé des exemples de sites ou d'outils qui m'inspirent",
        "J'ai identifié qui dans mon équipe validera les livrables",
    ]
    for ch in checks:
        y = checkbox(c, ch, y)
        y -= 2

    disclaimer_footer(c)
    c.save()


# ─────────────────────────────────────────────
# DOC 4: au-dela-de-30000
# ─────────────────────────────────────────────
def doc_au_dela_30k(path):
    c = canvas.Canvas(path, pagesize=A4)
    c.setTitle("Que faire si votre projet dépasse 30 000 € HTVA ?")
    y = page_header(c, "Que faire si votre projet dépasse 30 000 € HTVA ?", "")
    y -= 8

    c.setFillColor(SLATE)
    y = _draw_text(c, "Lorsqu'une dépense dépasse 30 000 € HTVA et que votre organisation peut être qualifiée de 'pouvoir adjudicateur', des procédures plus formalisées s'appliquent. Cette fiche vous aide à comprendre les prochaines étapes.", MARGIN, y, COL, 'Helvetica', 10, SLATE, line_h=14)
    y -= 12

    y = section_title(c, "Seuils de référence (services et fournitures)", y)
    headers = ['Tranche de montant', 'Régime applicable', 'Procédure typique']
    rows = [
        ['< 3 000 € HTVA', 'Marché de faible montant', 'Facture acceptée'],
        ['3 000 – 30 000 € HTVA', 'Marché simplifié', 'Mise en concurrence légère'],
        ['30 000 – 221 000 € HTVA', 'Procédure négociée', 'Plusieurs offres formalisées'],
        ['> 221 000 € HTVA', 'Seuil européen', 'Publication obligatoire'],
    ]
    col_w = [COL * 0.3, COL * 0.35, COL * 0.35]
    row_h = 18
    table_y = y
    c.setFillColor(NAVY)
    c.rect(MARGIN, table_y - row_h, COL, row_h, fill=1, stroke=0)
    c.setFillColor(colors.white)
    c.setFont('Helvetica-Bold', 8.5)
    x_pos = MARGIN
    for i, h in enumerate(headers):
        c.drawString(x_pos + 4, table_y - row_h + 5, h)
        x_pos += col_w[i]
    table_y -= row_h
    for ri, row in enumerate(rows):
        bg = CREAM if ri % 2 == 0 else colors.white
        c.setFillColor(bg)
        c.rect(MARGIN, table_y - row_h, COL, row_h, fill=1, stroke=0)
        c.setFillColor(SLATE)
        c.setFont('Helvetica', 8.5)
        x_pos = MARGIN
        for i, cell in enumerate(row):
            c.drawString(x_pos + 4, table_y - row_h + 5, cell)
            x_pos += col_w[i]
        c.setStrokeColor(LINE)
        c.setLineWidth(0.3)
        c.line(MARGIN, table_y - row_h, W - MARGIN, table_y - row_h)
        table_y -= row_h
    y = table_y - 10
    c.setFillColor(SLATE)
    c.setFont('Helvetica-Oblique', 7.5)
    c.drawString(MARGIN, y, "Seuils indicatifs pour les secteurs classiques. Les travaux ont des seuils différents. À vérifier auprès des sources officielles belges.")
    y -= 16

    y = section_title(c, "Les étapes d'une procédure négociée simplifiée", y)
    steps = [
        "Définir précisément le besoin (cahier des charges simplifié)",
        "Identifier au moins 3 candidats potentiels",
        "Envoyer une invitation à soumissionner identique à tous",
        "Recevoir les offres selon un délai raisonnable (10 à 15 jours minimum)",
        "Évaluer les offres sur des critères prédéfinis et documentés",
        "Informer les candidats non retenus",
        "Conserver tous les documents dans le dossier de marché",
    ]
    for i, step in enumerate(steps):
        y = bullet(c, f"{i+1}. {step}", y)
        y -= 2
    y -= 10

    y = section_title(c, "Ce qu'il faut absolument conserver", y)
    checks = [
        "Invitation à soumissionner envoyée à chaque prestataire",
        "Offres reçues (même les refus)",
        "Grille d'évaluation remplie",
        "Procès-verbal ou note de choix motivée",
        "Contrat ou bon de commande signé",
        "Tout échange important avec le prestataire choisi",
    ]
    for ch in checks:
        y = checkbox(c, ch, y)
        y -= 2
    y -= 8

    y = info_box(c, "Important : si votre dossier est financé par une subvention, les exigences de votre convention peuvent être plus strictes que la loi. Vérifiez toujours les deux.", y, bg=SUN)

    disclaimer_footer(c)
    c.save()


# ─────────────────────────────────────────────
# DOC 5: asbl-subsidiee-obligations
# ─────────────────────────────────────────────
def doc_asbl_subsidiee(path):
    c = canvas.Canvas(path, pagesize=A4)
    c.setTitle("ASBL subsidiée : quelles obligations d'achat vérifier ?")
    y = page_header(c, "ASBL subsidiée : quelles obligations d'achat vérifier ?", "")
    y -= 8

    c.setFillColor(SLATE)
    y = _draw_text(c, "Une ASBL qui reçoit des subsides n'est pas automatiquement soumise aux marchés publics. Mais certaines conditions peuvent créer des obligations. Cette fiche vous aide à identifier les points à vérifier avant tout achat important.", MARGIN, y, COL, 'Helvetica', 10, SLATE, line_h=14)
    y -= 12

    y = section_title(c, "Les 3 sources d'obligation à vérifier", y)
    sources = [
        ("1. La loi", "Êtes-vous un 'pouvoir adjudicateur' au sens de la loi du 17 juin 2016 ? Cela dépend de votre financement, de votre gouvernance et de votre mission."),
        ("2. Votre convention de subvention", "Certains bailleurs imposent contractuellement le respect des règles de marchés publics, même si la loi ne l'exige pas."),
        ("3. Votre règlement interne", "Certaines ASBL ont adopté des procédures internes d'achat. Vérifiez si les vôtres existent et s'appliquent."),
    ]
    for title, desc in sources:
        c.setFillColor(CORAL)
        c.setFont('Helvetica-Bold', 10)
        c.drawString(MARGIN, y, title)
        y -= 13
        y = _draw_text(c, desc, MARGIN + 8, y, COL - 8, 'Helvetica', 9, SLATE, line_h=13)
        y -= 9
    y -= 6

    y = section_title(c, "Checklist : vérifiez votre situation", y)
    checks = [
        ("Est-ce que plus de 50 % de mon budget provient de fonds publics ?", True),
        ("Est-ce qu'une autorité publique contrôle mon CA ou ma gestion ?", True),
        ("Ma convention de subvention mentionne-t-elle les marchés publics ?", True),
        ("Mon règlement interne impose-t-il une procédure d'achat ?", False),
        ("Le montant de ma dépense dépasse-t-il 30 000 € HTVA ?", True),
        ("Cette dépense est-elle financée par une subvention dédiée ?", False),
    ]
    for text, important in checks:
        y = checkbox(c, text, y, bold=important)
        y -= 3
    y -= 8

    y = section_title(c, "Ce que dit votre convention : points à chercher", y)
    for item in [
        "Les mots 'marché public', 'mise en concurrence' ou 'procédure d'achat'",
        "Une obligation de solliciter plusieurs offres comparatives",
        "Un seuil de montant à partir duquel une procédure est exigée",
        "Une liste de prestataires approuvés ou exclus",
        "Une obligation de conserver les justificatifs d'achat",
    ]:
        y = bullet(c, item, y)
        y -= 2
    y -= 8

    y = section_title(c, "Que faire si vous n'êtes pas sûr·e ?", y)
    for item in [
        "Utilisez le diagnostic marchépublic.be pour estimer votre niveau d'obligation.",
        "Contactez votre bailleur de fonds pour clarifier les exigences de la convention.",
        "Consultez un·e juriste ou le service marchés publics de votre institution de tutelle.",
        "Vérifiez les sources officielles : BOSA, SPF Économie, Portail Wallonie.",
    ]:
        y = bullet(c, item, y)
        y -= 2

    disclaimer_footer(c)
    c.save()


if __name__ == '__main__':
    os.makedirs(OUT, exist_ok=True)
    doc_acheter_sous_30k(os.path.join(OUT, 'acheter-sous-30000.pdf'))
    print("✓ acheter-sous-30000.pdf")
    doc_comparer(os.path.join(OUT, 'comparer-prestataires.pdf'))
    print("✓ comparer-prestataires.pdf")
    doc_cadrer_digital(os.path.join(OUT, 'cadrer-projet-digital.pdf'))
    print("✓ cadrer-projet-digital.pdf")
    doc_au_dela_30k(os.path.join(OUT, 'au-dela-de-30000.pdf'))
    print("✓ au-dela-de-30000.pdf")
    doc_asbl_subsidiee(os.path.join(OUT, 'asbl-subsidiee-obligations.pdf'))
    print("✓ asbl-subsidiee-obligations.pdf")
    print("\nDone — 5 documents générés dans public/resources/")
