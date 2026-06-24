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

The reference folder should receive:

- `design-system-1890.png`
- `landing-1890.png`
- `form-result-1890.png`

These files govern:

### design-system-1890.png
- colors;
- typography;
- icons;
- UI components;
- cards;
- badges;
- buttons;
- stepper;
- result score;
- document cards.

### landing-1890.png
- homepage layout;
- hero;
- section rhythm;
- human illustration direction;
- reassurance blocks;
- FAQ;
- CTA sections.

### form-result-1890.png
- diagnostic/questionnaire UI;
- result page;
- progress stepper;
- option cards;
- score block;
- recommended steps;
- downloadable documents;
- official sources section.

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

| Token | Hex | Role |
|-------|-----|------|
| `coral` | `#E63948` | Primary action, CTA, urgency, selected state |
| `sun` | `#F4C28F` | Pedagogy badges, attention, guidance |
| `teal` | `#415338` | Validation, done states, reassurance |
| `bleu` | `#2E5C8A` | Trust, links, secondary confidence |
| `navy` | `#2E2348` | Body text, headings, dark UI elements |
| `cream` | `#FBF7F1` | Page background |
| `sable` | `#F4E9D8` | Card surfaces, soft section backgrounds |
| `line` | `#E4D9CC` | Borders, dividers |
| `slate` | `#5E6B7D` | Secondary text, labels |
| `gris` | `#A8A096` | Quiet details, muted borders |
| `aqua` | `#C8BEF5` | Text on dark backgrounds only |
| `ink` | `#1C1534` | Footer, deepest dark |

### Avoid

- Overuse of dark purple as the dominant surface color.
- Generic violet / indigo SaaS design.
- Cold legal-tech blue as the primary brand color.
- Official-looking institutional blue.
- Any palette drift away from the references.

---

## Typography

| Role | Family | Weight |
|------|--------|--------|
| Display / Titles | DM Serif Display | Regular (400), Italic |
| Body / UI | DM Sans | 400, 500, 600, 700 |

### Type scale

| Level | Size | Line height |
|-------|------|-------------|
| H1 | 48px / 3rem | 110% |
| H2 | 32px / 2rem | 120% |
| H3 | 24px / 1.5rem | 130% |
| Body | 16px / 1rem | 16px |
| Caption | 12px / 0.75rem | 14px |

### Rules
- DM Serif Display for all H1–H3 and card titles.
- DM Sans for all body text, labels, badges, captions, buttons, navigation.
- Never mix additional font families.
- Accessibility AA is the minimum standard.

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
