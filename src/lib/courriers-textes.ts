// Corps de texte (brut, prêt à copier/coller dans un mail) des courriers de type lettre/mail.
// Les champs à personnaliser sont [entre crochets]. À relire et adapter avant envoi.
// Les modèles longs et structurés (DMA, contrats RGPD, descriptif) restent en .docx uniquement.

export const COURRIERS_TEXTES: Record<string, string> = {
  'email-invitation-offre-pnspp': `Objet : Invitation à remettre offre — [Objet du marché]

Madame, Monsieur,

Dans le cadre d'une procédure négociée sans publication préalable, [Nom du pouvoir adjudicateur] vous invite à remettre une offre pour le marché suivant :

Objet : [Objet du marché]
Montant estimé : à titre indicatif
Délai de remise des offres : le [date] à [heure] au plus tard

Votre offre est à déposer via la plateforme e-Procurement (https://www.publicprocurement.be). Le cahier spécial des charges et ses annexes y sont disponibles.

Nous restons à votre disposition pour toute question relative au présent marché.

Nous vous prions d'agréer, Madame, Monsieur, l'expression de nos salutations distinguées.

[Prénom Nom]
[Fonction]
[Nom de l'organisation]
[Coordonnées]`,

  'faible-montant-invitation-offre': `Objet : Demande d'offre — [Objet du marché]

Madame, Monsieur,

[Nom du pouvoir adjudicateur] souhaite recueillir une offre pour le marché de faible montant suivant :

Objet : [Objet du marché]
Description : [Description succincte du besoin]
Délai de remise : le [date] au plus tard

Votre offre peut nous être adressée par courriel à l'adresse [adresse e-mail]. Elle devra préciser le prix (HTVA et TVAC), le délai d'exécution et, le cas échéant, les références utiles.

Nous vous remercions de l'attention portée à la présente et restons à votre disposition.

Cordialement,

[Prénom Nom]
[Fonction]
[Nom de l'organisation]`,

  'faible-montant-lettre-notification': `Objet : Notification d'attribution — [Objet du marché]

Madame, Monsieur,

Nous avons le plaisir de vous informer que le marché de faible montant relatif à [Objet du marché] vous a été attribué.

Montant retenu : [montant] EUR HTVA
Délai d'exécution : [délai]

Nous vous invitons à prendre contact avec [personne de contact] afin de convenir des modalités pratiques de démarrage de la prestation.

Nous vous prions d'agréer, Madame, Monsieur, l'expression de nos salutations distinguées.

[Prénom Nom]
[Fonction]
[Nom de l'organisation]`,

  'faible-montant-info-non-retenus': `Objet : Résultat de la consultation — [Objet du marché]

Madame, Monsieur,

Nous vous remercions pour l'offre que vous nous avez transmise dans le cadre du marché de faible montant relatif à [Objet du marché].

Après analyse des offres reçues, nous vous informons que votre offre n'a pas été retenue. Le marché a été attribué à l'opérateur ayant remis l'offre la plus avantageuse au regard de nos besoins.

Nous vous remercions de l'intérêt porté à notre consultation et espérons avoir l'occasion de collaborer à l'avenir.

Nous vous prions d'agréer, Madame, Monsieur, l'expression de nos salutations distinguées.

[Prénom Nom]
[Fonction]
[Nom de l'organisation]`,

  'lettre-notification': `Objet : Notification d'attribution — [Objet du marché]

Madame, Monsieur,

Par la présente, [Nom du pouvoir adjudicateur] vous notifie l'attribution du marché relatif à [Objet du marché], conformément à la décision d'attribution du [date].

Montant de l'offre retenue : [montant] EUR HTVA
Procédure : [procédure]

La conclusion du marché prend effet à la date de la présente notification. Nous vous invitons à prendre contact avec nos services pour la mise en œuvre.

Nous vous prions d'agréer, Madame, Monsieur, l'expression de nos salutations distinguées.

[Prénom Nom]
[Fonction]
[Nom de l'organisation]`,

  'info-belge-inf-140k': `Objet : Information sur la décision d'attribution — [Objet du marché]

Madame, Monsieur,

Dans le cadre du marché relatif à [Objet du marché], nous vous informons de la décision d'attribution intervenue le [date].

Votre offre n'a pas été retenue. Le marché a été attribué à [nom de l'adjudicataire].

Les motifs du rejet de votre offre sont les suivants : [motifs synthétiques].

Conformément à la réglementation applicable, vous disposez des voies de recours rappelées en annexe. Vous pouvez, sur demande écrite, obtenir des informations complémentaires sur les motifs de la décision.

Nous vous prions d'agréer, Madame, Monsieur, l'expression de nos salutations distinguées.

[Prénom Nom]
[Fonction]
[Nom de l'organisation]`,

  'info-belge-sup-140k': `Objet : Information sur la décision d'attribution — [Objet du marché]

Madame, Monsieur,

Dans le cadre du marché relatif à [Objet du marché], nous vous communiquons la décision d'attribution motivée intervenue le [date].

Votre offre n'a pas été retenue. Le marché a été attribué à [nom de l'adjudicataire] pour un montant de [montant] EUR HTVA.

Les motifs détaillés figurent dans la décision motivée jointe à la présente.

Un délai d'attente (standstill) de 15 jours court à compter de l'envoi de la présente information avant la conclusion du marché. Durant ce délai, vous pouvez introduire un recours selon les modalités rappelées en annexe.

Nous vous prions d'agréer, Madame, Monsieur, l'expression de nos salutations distinguées.

[Prénom Nom]
[Fonction]
[Nom de l'organisation]`,

  'info-europeens': `Objet : Information sur la décision d'attribution — [Objet du marché]

Madame, Monsieur,

Dans le cadre du marché européen relatif à [Objet du marché], nous vous informons de la décision d'attribution motivée intervenue le [date].

Votre offre n'a pas été retenue. Le marché a été attribué à [nom de l'adjudicataire] pour un montant de [montant] EUR HTVA.

Les motifs détaillés du rejet de votre offre et du choix de l'adjudicataire figurent dans la décision motivée jointe.

Un délai d'attente (standstill) de 15 jours court à compter de l'envoi de la présente information avant la conclusion du marché. Les voies de recours sont rappelées en annexe.

Nous vous prions d'agréer, Madame, Monsieur, l'expression de nos salutations distinguées.

[Prénom Nom]
[Fonction]
[Nom de l'organisation]`,

  'lettre-justification-prix': `Objet : Demande de justification de prix — [Objet du marché]

Madame, Monsieur,

Après examen de votre offre relative au marché [Objet du marché], le prix proposé apparaît anormalement bas au regard de la prestation demandée.

Conformément à la réglementation applicable, nous vous invitons à nous transmettre, dans un délai de [nombre] jours à compter de la présente, les justifications utiles portant notamment sur :
- le mode d'exécution retenu ;
- les solutions techniques adoptées ;
- les conditions particulièrement favorables dont vous bénéficiez ;
- le respect des obligations en matière de droit environnemental, social et du travail.

À défaut de justification satisfaisante dans le délai imparti, votre offre pourra être écartée.

Nous vous prions d'agréer, Madame, Monsieur, l'expression de nos salutations distinguées.

[Prénom Nom]
[Fonction]
[Nom de l'organisation]`,

  'lettre-prolongation-delai': `Objet : Prolongation du délai d'engagement — [Objet du marché]

Madame, Monsieur,

Dans le cadre du marché relatif à [Objet du marché], le délai de validité des offres arrive à échéance le [date].

L'analyse des offres n'étant pas encore finalisée, nous vous invitons à prolonger la validité de votre offre jusqu'au [nouvelle date].

Nous vous remercions de bien vouloir nous confirmer votre accord par retour de courriel avant le [date limite de réponse].

Nous vous prions d'agréer, Madame, Monsieur, l'expression de nos salutations distinguées.

[Prénom Nom]
[Fonction]
[Nom de l'organisation]`,

  'lettre-demande-completude': `Objet : Demande de complément d'offre — [Objet du marché]

Madame, Monsieur,

Après examen de votre offre relative au marché [Objet du marché], nous constatons qu'il manque les éléments suivants :
- [élément manquant 1]
- [élément manquant 2]

Nous vous invitons à nous transmettre ces éléments dans un délai de [nombre] jours à compter de la présente, à l'adresse [adresse e-mail].

À défaut de réponse complète dans le délai imparti, votre offre sera examinée en l'état.

Nous vous prions d'agréer, Madame, Monsieur, l'expression de nos salutations distinguées.

[Prénom Nom]
[Fonction]
[Nom de l'organisation]`,
}
