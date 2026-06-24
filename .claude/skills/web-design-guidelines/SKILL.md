# Skill: Web Design Guidelines

## Purpose

Enforce strong web design quality on every implementation.
Prevent generic, AI-generated, SaaS-template-looking interfaces.
Ensure every screen is intentional, considered and craft-driven.

## When to invoke this skill

Invoke this skill:
- before implementing any new page or component;
- when reviewing an existing implementation for quality;
- when a screen feels flat, generic or unresolved;
- when spacing, hierarchy or typography feel off;
- when a component looks inconsistent with the rest of the UI.

## Evaluation framework

When reviewing or implementing any screen, evaluate against all of the following dimensions.

### 1. Visual hierarchy

Every screen must have a clear reading order:
- one dominant element per section (H1, number, illustration or CTA);
- secondary elements clearly subordinate in size, weight or contrast;
- no competition between two elements at the same visual level.

Ask: where does the eye go first? Is that the right answer?

### 2. Spacing and rhythm

Spacing must be intentional and consistent:
- use the spacing scale defined in the design system;
- never add margin or padding by feel — align to the token grid;
- sections must breathe — no crowded blocks;
- vertical rhythm between headings, body, captions and CTAs must be harmonious.

Ask: does the spacing feel considered or random?

### 3. Typography

Typography must be disciplined:
- display font for headings only (H1–H3);
- body font for UI text, labels, descriptions, captions;
- never mix font families beyond the design system;
- font sizes must follow the defined scale (H1–Caption);
- line height must be appropriate to font size (tighter for headings, looser for body);
- letter spacing must match the design system tokens.

Ask: does the type feel designed or default?

### 4. Color discipline

Color must be intentional:
- use only the tokens defined in the brandkit;
- every color usage must serve a purpose (action, state, hierarchy, brand);
- never use color for decoration alone;
- background/foreground contrast must pass AA at minimum;
- never invent new tones or ad-hoc opacity variants not in the system.

Ask: could any color be removed without losing meaning?

### 5. Component consistency

Every component must look like it belongs to the same system:
- border-radius must be consistent across similar components;
- shadow levels must follow the defined scale (card, float, elevated);
- icon sizes must be consistent within their context;
- button variants (primary, secondary, ghost) must be visually coherent;
- selected, hover, disabled, focus states must all be defined and distinct.

Ask: does every component feel like part of the same family?

### 6. Responsive behavior

Every implementation must work across breakpoints:
- mobile-first layout decisions;
- no horizontal overflow on any viewport;
- touch targets minimum 44×44px on mobile;
- typography scales appropriately (not too small on mobile, not too large on desktop);
- grid columns collapse gracefully;
- no content disappears or truncates unintentionally.

Ask: does this work on a 375px screen?

### 7. Accessibility

Every implementation must meet baseline accessibility standards:
- all interactive elements are keyboard-navigable;
- focus states are visible;
- color is never the sole conveyor of meaning;
- images and icons have appropriate alt text or aria-hidden;
- heading levels are logical and not skipped;
- form elements have labels.

Ask: could someone use this without a mouse? Without color?

### 8. Emptiness and negative space

Negative space is a design element, not a mistake:
- white space separates content into digestible blocks;
- sections have distinct visual identities without requiring borders;
- cards have internal breathing room;
- CTAs are not crowded by surrounding content.

Ask: does the layout feel spacious and confident, or cramped and uncertain?

### 9. Human warmth and brand fit

The implementation must feel human, not mechanical:
- refer to the brandkit for the expected tone and feel;
- avoid default SaaS grids that look like every other product;
- illustration direction must match the approved references;
- the brand personality must be legible at a glance.

Ask: does this look like the brand, or like a template?

## Output format when reviewing

When reviewing a screen using this skill, output:

```
DIMENSION       STATUS    NOTE
Hierarchy       PASS/FAIL ...
Spacing         PASS/FAIL ...
Typography      PASS/FAIL ...
Color           PASS/FAIL ...
Components      PASS/FAIL ...
Responsive      PASS/FAIL ...
Accessibility   PASS/FAIL ...
Negative space  PASS/FAIL ...
Brand fit       PASS/FAIL ...

OVERALL: PASS / NEEDS WORK / FAIL

Priority fixes:
1. ...
2. ...
3. ...
```

## Non-negotiable rules

- Never ship a screen that fails Hierarchy, Typography or Color.
- Never ship a screen with horizontal overflow.
- Never ship a screen where buttons have no hover or focus state.
- Never approximate spacing — align to the token grid.
- Never use a generic layout when the brandkit specifies a direction.
