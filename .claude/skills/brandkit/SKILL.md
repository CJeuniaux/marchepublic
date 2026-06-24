# Skill: Brandkit

## Purpose

Enforce brand consistency on every implementation.
Make the brandkit and approved visual references the non-negotiable source of truth.
Prevent visual drift, brand mixing and free interpretation of the design direction.

## When to invoke this skill

Invoke this skill:
- at the start of every design implementation session;
- before choosing any color, font, spacing value or component style;
- when something feels visually inconsistent with the approved references;
- when the current implementation drifts from the brandkit;
- when reviewing a PR for brand compliance.

## Brandkit location

The active brandkit for this project is located at:

```
.claude/brandkits/marchepublic/BRAND.md
```

Reference images are located at:

```
.claude/brandkits/marchepublic/references/
```

Read BRAND.md before any design implementation. If it has not been read in this session, read it now.

## Hierarchy of truth

When there is a conflict between sources, apply this hierarchy strictly:

1. Approved reference images in `references/` — highest authority
2. BRAND.md — written specification of the approved DA
3. Current Tailwind/CSS token values — implementation state
4. Current JSX/component code — current approximation
5. Generic conventions, SaaS defaults or Claude's own interpretation — lowest authority, always loses

If the reference images say one thing and the code says another, the reference images win.
If BRAND.md says one thing and Claude's interpretation suggests another, BRAND.md wins.

## Checklist before implementing

Before writing any design code, confirm:

- [ ] BRAND.md has been read in this session
- [ ] Reference images have been checked (ask user if missing)
- [ ] Active color tokens match BRAND.md exactly
- [ ] Display font matches BRAND.md
- [ ] Body font matches BRAND.md
- [ ] No colors are being invented or approximated
- [ ] No fonts are being mixed outside the defined system
- [ ] No brand symbols are being used that BRAND.md prohibits

## Drift detection

Flag the following as brand drift and correct immediately:

- A color tone that doesn't match any token in BRAND.md
- A font family not listed in BRAND.md
- A layout section that feels more like another brand's identity
- A dark background section where BRAND.md prescribes light
- A blue/violet/indigo palette when BRAND.md uses warm cream + rouge
- Any prohibited symbol (see BRAND.md Symbol warning section)
- Any element that makes the site look like an official government service

## Anti-mixing rule

This project has its own identity. Do not allow visual conventions or patterns from other projects to bleed in. Specifically:

- Do not import layout patterns from generic SaaS templates
- Do not apply conventions from MaitrisezLeDigital or any other brand in scope
- Each brand must feel like itself, not like a cousin of another product

## Output format when reviewing brand compliance

```
TOKEN          EXPECTED         ACTUAL           STATUS
----------------------------------------------------------
Primary color  #E63948          ...              PASS/FAIL
Background     #FBF7F1          ...              PASS/FAIL
Display font   DM Serif Display ...              PASS/FAIL
Body font      DM Sans          ...              PASS/FAIL
...

BRAND COMPLIANCE: PASS / DRIFT DETECTED / FAIL

Corrections needed:
1. ...
2. ...
```

## Non-negotiable rules

- Never implement a design session without reading BRAND.md first.
- Never invent a color that isn't in the approved token set.
- Never use a font not defined in BRAND.md.
- Never override the reference images with personal interpretation.
- Always flag drift immediately rather than approximating.
