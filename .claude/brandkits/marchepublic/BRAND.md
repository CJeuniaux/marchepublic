# MarchéPublic.be Brandkit

MarchéPublic.be is an independent, pedagogical diagnostic tool for ASBL, foundations and subsidized structures that need to understand whether public procurement rules may apply before purchasing services or goods.

It is not an official public service.
It is not legal advice.
It is a clear, educational, reassuring diagnostic tool.

---

## Visual source of truth

The approved visual references will be placed in:

```
.claude/brandkits/marchepublic/references/
```

These references are not loose inspiration.
They are the approved DA.
They must be treated as the primary visual source of truth.

If there is any conflict between:
- the current implementation;
- generic SaaS conventions;
- Claude's design interpretation;
- and the approved reference images;

**the approved reference images win.**

---

## Expected reference files

The reference folder contains four approved files:

- `design-system-1890.png` — **AUTHORITY: global tokens and all UI components**
- `landing-1890.png` — **AUTHORITY: homepage layout and section rhythm**
- `form-steps-1890.png` — **AUTHORITY: diagnostic questionnaire flow and step UI**
- `form-result-1890.png` — **AUTHORITY: result page, score block, documents, sources**

These files govern:

### design-system-1890.png
- palette: all 8 brand colors with exact hex values;
- typography: Recoleta display, DM Sans body, full type scale;
- grid: 12-col, 24px gap, 16px border, 1200px max-width;
- spacing scale: 8, 16, 24, 32, 40, 48, 56, 64px;
- UI components: buttons (primary/secondary/ghost), inputs, selects;
- cards: border, radius, shadow, padding spec;
- badges: OBLIGATOIRE/RECOMMANDÉ/FACULTATIF with color + icon;
- stepper: numbered circles, dashed connector, active/done/inactive states;
- score circles: 82%/56%/12% reference states;
- iconography: line-icon style (24px, stroke, rounded);
- illustration style: flat human scenes, warm palette;
- logo lockup: wordmark + brand symbol.

### landing-1890.png
- homepage: light cream background throughout, no dark hero;
- header: horizontal nav, wordmark, red CTA button;
- hero: large H1 left, illustrated editorial scene right, trust badges below CTAs;
- sections: card-based, warm color rhythm, cream/sable alternation;
- "Le diagnostic en 2 étapes" section: 3-column cards;
- "Un diagnostic structuré en trois temps": Équité / Pertinence / Sécurité;
- "Outil, pas conseiller": green checks + red X two-column;
- use case cards: icon + label grid;
- FAQ section;
- bottom CTA strip: red button.

### form-steps-1890.png
- diagnostic wrapper: light cream background (NOT dark navy);
- top bar: white sticky, "← Retour | Mon diagnostic | Étape N sur 5";
- stepper bar: cream/sable background, horizontal numbered circles;
  - active: red circle, white number, red label below;
  - done: green circle, white checkmark, green label;
  - inactive: white circle, grey border, grey number, grey label;
  - connector: dashed grey line;
- content card: white on cream, max-width ~600px, centered;
- question badge: sun/yellow filled circle with number + "Question N" label;
- option cards: 2-column grid, icon in light square (left), title + desc (right);
  - selected: 2px red border + green checkmark badge top-right;
- "Base juridique" collapsible: green shield icon, outlined button;
- bottom nav: "← Accueil" (outlined) | "Aucune donnée" (center, small) | "Continuer →" (red, filled).

### form-result-1890.png
- score block: cream background, "88%" in massive red display font (~96px);
- description text beside the %, horizontal segmented band bar below;
- segmented bar: green (0–25%), yellow (25–50%), orange (50–75%), red (75–100%), position marker;
- band legend below bar: colored circles + % ranges;
- section badges: yellow sun (explanations), red numbered circles (steps), green (documents/sources);
- "Ce que cela veut dire, simplement": yellow badge, explanation paragraph;
- "Pourquoi ce résultat?": yellow badge, bullet points with "Source officielle →" links;
- "Les étapes recommandées": red numbered badges (①②③), step text, "Consulter →" links;
- document cards: 2×2 grid, line icon, title, desc, teal "Télécharger la fiche →" button;
- source cards: vertical list, "SOURCE OFFICIELLE" green badge, "Consulter →";
- dark navy CTA strip: 3 benefit cards + red CTA;
- bottom actions bar: PDF download | email | print | restart.

---

## Brand personality

The brand must feel:
- warm;
- human;
- clear;
- pedagogical;
- reassuring;
- accessible;
- independent;
- useful for ASBL teams;
- serious without being cold;
- structured without being legalistic.

The design should communicate:

> **"Vous allez comprendre simplement."**

Not:

> "Voici une legal-tech compliquée."

---

## Color direction

Use the approved 1890 visual system:

| Role | Direction |
|------|-----------|
| Page background | warm cream / off-white |
| Card and soft section surfaces | sand |
| Primary action, urgency | red / coral |
| Pedagogy, attention, guidance | yellow |
| Validation, reassurance | soft green |
| Text, serious elements | dark aubergine / navy |
| Borders, secondary text, quiet UI | soft grey |

### Token reference

Extracted from `design-system-1890.png`. These are the exact approved values.

| Token | Hex | Role | Status |
|-------|-----|------|--------|
| `coral` | `#E63948` | Primary action, CTA, urgency, selected state | ✅ Confirmed |
| `sun` | `#F4C48F` | Pedagogy badges, attention, guidance | ⚠️ Correct: `#F4C48F` not `#F4C28F` |
| `teal` | `#415338` | Validation, done states, reassurance | ✅ Confirmed |
| `bleu` | `#2E5C8A` | Trust, links, secondary confidence | ✅ Confirmed |
| `navy` | `#2E2348` | Body text, headings (aubergine profond) | ⚠️ Reference suggests #3B3171 — to verify |
| `cream` | `#FBF7F1` | Page background | ✅ Confirmed |
| `sable` | `#F4E9D8` | Card surfaces, soft section backgrounds | ✅ Confirmed |
| `line` | `#E4D9CC` | Borders, dividers | ✅ Confirmed |
| `slate` | `#5E6B7D` | Secondary text, labels | ✅ Confirmed |
| `gris` | `#A8A096` | Quiet details, muted borders | ✅ Confirmed |
| `aqua` | `#C8BEF5` | Text on dark backgrounds only | ✅ Confirmed |
| `ink` | `#1C1534` | Footer, deepest dark | ✅ Confirmed |

### Avoid

- Overuse of dark purple as the dominant surface color.
- Generic violet / indigo SaaS design.
- Cold legal-tech blue as the primary brand color.
- Official-looking institutional blue.
- Any palette drift away from the references.

---

## Typography

Extracted from `design-system-1890.png`.

| Role | Family | Weight | Status |
|------|--------|--------|--------|
| Display / Titles | **Recoleta** | 700 | ⚠️ Not on Google Fonts — see note |
| Body / UI | DM Sans | 400, 500, 600, 700 | ✅ Confirmed |

> **⚠️ Recoleta note**: The design system v1.0 specifies Recoleta as the display font (visible in the large H1 "Aa" specimen with rounded, retro serifs). Recoleta is not available on Google Fonts. Current implementation uses DM Serif Display as a substitute. **Provide a `.woff2` Recoleta file to achieve exact spec, or confirm DM Serif Display is an approved substitute.**

### Type scale

| Level | Size | Line height | Usage |
|-------|------|-------------|-------|
| H1 | 48px / 3rem | 110% | Hero headings |
| H2 | 32px / 2rem | 120% | Section headings |
| H3 | 24px / 1.5rem | 130% | Card titles, sub-sections |
| Body | 16px / 1rem | 16px (100%) | All body text |
| Caption | 12px / 0.75rem | 14px | Labels, badges, fine print |

### Score display (special case)
- Score percentage (88%, 82%, etc.): display font, ~80–96px, bold, color = band color
- Never use a circular SVG dial for the primary score — use large text + horizontal segmented bar

### Rules
- Display font (Recoleta / approved substitute) for all H1–H3 and card titles only.
- DM Sans for all body text, labels, badges, captions, buttons, navigation.
- Never mix additional font families.
- Accessibility AA minimum standard.

---

## Symbol warning

**Do not use:**
- the Wallonia rooster (coq wallon);
- official-looking regional symbols;
- anything that could imply this tool is an official public service;
- Belgian federal or regional emblems.

**Use neutral guidance symbols instead:**
- compass;
- signpost;
- document with checkmark;
- checklist;
- path / route;
- marker;
- guide icon;
- magnifier;
- folder.

---

## Illustration direction

**Use:**
- warm human scenes;
- ASBL / foundation / public-interest contexts;
- documents, laptops, checklists, folders, signs;
- clear pedagogical illustrations;
- friendly but professional characters.

**Avoid:**
- generic AI cartoon people;
- cold legal-tech visuals;
- random decorative icons;
- overly corporate stock photos;
- anything that looks official or governmental.

---

## UI rules

Apply this brandkit to:
- homepage;
- diagnostic flow;
- result page;
- FAQ;
- document cards;
- source cards;
- CTA blocks;
- header;
- footer;
- buttons;
- cards;
- badges;
- stepper;
- result score blocks;
- mobile layout.

---

## Anti-drift rules

**Do not:**
- invent a new visual direction;
- turn the site into a generic SaaS landing page;
- make the homepage dark-heavy;
- overuse dark purple sections;
- create a cold legal-tech interface;
- use fake official signals;
- add fake legal guarantees;
- add fake testimonials, fake partners or fake statistics;
- make the site visually similar to MaitrisezLeDigital or any other brand.

---

## Functional caution

**Do not break:**
- diagnostic logic;
- scoring logic (`computeScore`, `BANDS`, `bandFor`, `explain`, `nomadTier`);
- result calculation;
- form flow and state transitions;
- routes (`home | diagnostic`);
- SEO metadata;
- accessibility;
- responsive behavior.

---

## Implementation protocol

Before any design implementation, Claude must:

1. Confirm the reference images exist on disk in `.claude/brandkits/marchepublic/references/`.
2. Read and extract the design system from them using the `extract-design-system` skill.
3. Update this BRAND.md if extraction reveals corrections or additions.
4. Create a phased implementation plan.
5. Wait for approval before modifying any app code.

### Implementation phases

| Phase | Scope |
|-------|-------|
| Phase 1 | Global tokens and reusable components |
| Phase 2 | Homepage |
| Phase 3 | Diagnostic / questionnaire flow |
| Phase 4 | Result page |
| Phase 5 | FAQ, resources, document and source cards |
| Phase 6 | Responsive and accessibility polish |

Each phase must be approved before the next begins.
