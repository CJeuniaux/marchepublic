# Skill: Image to Code

## Purpose

Translate screenshots, mockups and reference images into faithful, production-ready frontend code.
Achieve pixel-fidelity where it matters: hierarchy, spacing, color, typography, interaction states.
Update shared tokens and reusable components before touching page-level code.

## When to invoke this skill

Invoke this skill:
- when given a screenshot or mockup and asked to implement it;
- when a reference image is declared as the target for a component or page;
- when an existing implementation needs to be corrected to match a reference.

## Required inputs

To run this skill:
- one or more reference images showing the target state;
- a declaration of which breakpoint the image represents (desktop / tablet / mobile);
- the existing component and token structure (read from the project before starting).

## Implementation protocol

### Step 1: Read the reference

Do not write any code until you have read the reference image thoroughly.

Identify in the image:
- layout structure (grid, stack, two-column, etc.)
- component inventory (which components are visible)
- hierarchy (what is visually dominant, secondary, tertiary)
- spacing between elements
- exact colors used (match to existing tokens if possible)
- typography (font, weight, size, color for each text element)
- interaction states if visible (selected, hover, active, disabled)
- responsive implications

### Step 2: Read the existing token system

Before writing code:
- read `tailwind.config.ts` or equivalent token file;
- map each color, font and spacing value in the reference to an existing token;
- flag any values in the reference that have no matching token.

If a value has no matching token:
- do not invent an ad-hoc value in JSX;
- propose the new token first;
- add it to the token file before using it.

### Step 3: Inventory the existing components

Before writing new components:
- search for existing components that match what the reference shows;
- reuse existing components wherever possible;
- only create a new component if nothing reusable exists.

### Step 4: Implement tokens before pages

Implementation order is always:
1. Token updates (colors, fonts, spacing) → `tailwind.config.ts`
2. Shared component updates (buttons, cards, badges, inputs) → `src/components/`
3. Page-level layout → `src/pages/`

Never jump to page code before tokens and shared components are correct.

### Step 5: Implement the layout

Translate the reference layout to code:
- match the grid structure (columns, gaps, breakpoints);
- match section vertical rhythm (padding top/bottom);
- match card internal padding;
- match the max-width container.

### Step 6: Implement typography

For every text element in the reference:
- use the correct semantic tag (h1, h2, h3, p, span, label);
- apply the correct font class (font-display, font-sans);
- apply the correct size class from the token scale;
- apply the correct weight, color and line-height.

### Step 7: Implement interaction states

For every interactive element:
- implement the default state;
- implement the hover state;
- implement the active/selected state;
- implement the disabled state;
- implement the focus state (for accessibility).

Never ship a component with only the default state.

### Step 8: Verify fidelity

After implementing, compare your output mentally against the reference:

```
ELEMENT         MATCH?   NOTE
Layout          YES/NO   ...
Typography      YES/NO   ...
Colors          YES/NO   ...
Spacing         YES/NO   ...
States          YES/NO   ...
Responsive      YES/NO   ...
```

Fix any mismatch before considering the task done.

## Fidelity rules

- Colors must match the reference within the token set. No approximations.
- Font families must match the token set. No ad-hoc families.
- Spacing must use token values, not arbitrary px or rem.
- Border-radius must match the reference, using the token scale.
- Shadows must match the reference, using the shadow token scale.
- No component is "done" until all visible states are implemented.

## What faithful does not mean

Faithful implementation does not mean:
- copying every pixel regardless of context;
- ignoring responsive behavior because the reference shows desktop only;
- hardcoding values that should be tokens;
- duplicating components instead of reusing them.

Faithful means: the visual output matches the intent of the reference, using the token system correctly, at every breakpoint.

## Non-negotiable rules

- Never skip Step 1 (reading the reference).
- Never skip Step 2 (reading the token system).
- Never add a color, font or spacing value that isn't in the token system without first proposing a token.
- Never ship a page before its tokens and shared components are correct.
- Never approximate — if you are not sure of a value, flag it and ask.
