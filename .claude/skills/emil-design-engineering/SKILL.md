# Skill: Emil Design Engineering

## Purpose

Improve UI polish, interaction quality, motion, spacing rhythm and component craft.
Close the gap between a functional implementation and a considered, felt interface.
Avoid bland, mechanical, SaaS-default output.

Named after the discipline of treating frontend code as a design medium — not just a rendering layer.

## When to invoke this skill

Invoke this skill:
- when an implementation is technically correct but feels flat or lifeless;
- when motion and transitions are missing or feel mechanical;
- when spacing feels inconsistent or unrhythmic;
- when components look functional but not designed;
- when the UI looks like a template rather than a crafted product;
- when asking for a polish pass before shipping.

## What this skill covers

### 1. Motion and transitions

Every state change should feel intentional:
- page transitions: fade + slide in the direction of navigation;
- modal / drawer: ease-in from the edge or center, ease-out on close;
- list items: stagger children on mount for visual rhythm;
- hover states: fast (150ms) with easing, never instant;
- loading states: skeleton or spinner, never blank;
- accordion / expand: animate height, never jump;
- score counters: count up from zero on mount;
- progress bars: animate from 0 to value on mount.

Easing defaults:
- entrance: `[0.22, 1, 0.36, 1]` (fast out, settle)
- exit: `[0.4, 0, 1, 1]` (fast out)
- hover: `ease-out 150ms`
- expand: `[0.22, 1, 0.36, 1] 280ms`

Duration defaults:
- micro (hover, focus): 120–150ms
- component (appear, expand): 280–350ms
- page (route transition): 400–500ms
- decorative (float, pulse): 4–9s infinite

Never animate for its own sake. Every animation must reduce cognitive friction or communicate state.

### 2. Spacing rhythm

Spacing creates visual music. Audit every screen for:
- consistent vertical rhythm between sections (use multiples of 4 or 8);
- card internal padding consistent across the design system;
- gap between grid items consistent within a section;
- breathing room inside buttons (never tight);
- section-level padding that scales with breakpoint;
- no orphaned spacing (a margin that exists for no visual reason).

### 3. Typography craft

Beyond font and size, polish includes:
- `text-balance` on headings to prevent awkward line breaks;
- `leading-tight` on large display text, `leading-relaxed` on body;
- `-tracking-tight` on large display headlines;
- `tracking-widest` + uppercase on eyebrow labels and captions;
- optical sizing on large serif display text where supported;
- `max-w-prose` or equivalent on long body text blocks.

### 4. Surface and depth

Depth communicates hierarchy:
- floating elements (modals, tooltips, floating cards) use `shadow-float`;
- elevated cards use `shadow-card`;
- flat surfaces use no shadow or `shadow-sm`;
- dark sections use no shadow (shadows are invisible on dark);
- layering must be consistent: background → surface → float → overlay.

### 5. Color as interaction feedback

Color changes must communicate state clearly:
- selected state must be unambiguous (border + background + icon change);
- hover state must be perceptible but subtle;
- active/pressed state: `scale-[0.98]` + brightness drop;
- disabled state: opacity 40%, `cursor-not-allowed`;
- focus state: visible ring in a color that contrasts the background.

### 6. Component micro-craft

Details that make a component feel designed:
- buttons: rounded, correct padding, icon at trailing position, `active:scale-[0.98]`;
- badges: pill shape for status, square corners for labels/categories;
- cards: consistent internal padding, deliberate border-radius, hover lift if interactive;
- inputs: clear focus ring, visible label, error state;
- icons: sized consistently (16px for inline, 20px for standalone, 24px for illustrative);
- avatars: consistent size, fallback initial, rounded-full.

### 7. Responsive craft

Polish extends to every breakpoint:
- typography scale adjusts at each breakpoint (not just desktop);
- grid collapses gracefully (never content overflow);
- touch targets are 44px minimum on mobile;
- mobile navigation is a distinct, considered pattern;
- padding scales down on mobile (not just 50% of desktop).

### 8. Quiet UI details

The details that experienced designers notice:
- section dividers that use gradient-to-transparent instead of hard lines;
- dot-grid patterns as subtle background texture;
- brand color accent on top edge of serious cards;
- trailing arrow on external links;
- truncated text always gets a tooltip;
- empty states have an icon, a heading and an action — never just nothing;
- skeleton loaders that match the shape of real content.

## Polish pass checklist

When performing a polish pass, evaluate:

```
DIMENSION               STATUS    NOTES
Motion / transitions    OK/NEEDS  ...
Spacing rhythm          OK/NEEDS  ...
Typography craft        OK/NEEDS  ...
Surface and depth       OK/NEEDS  ...
Color feedback          OK/NEEDS  ...
Component micro-craft   OK/NEEDS  ...
Responsive craft        OK/NEEDS  ...
Quiet details           OK/NEEDS  ...

POLISH SCORE: SHIPPED / NEEDS WORK / ROUGH
```

## Non-negotiable rules

- Never ship a component with no hover state.
- Never ship an animated element that jumps (no transition).
- Never ship a page with orphaned spacing or inconsistent rhythm.
- Never use `transition-all` in production — it causes repaints; target specific properties.
- Never animate layout properties (width, height in px) — animate transforms and opacity.
- Always use `will-change: transform` on elements with framer-motion entrance animations.
- Motion must respect `prefers-reduced-motion` — all animations must have a reduced variant.
