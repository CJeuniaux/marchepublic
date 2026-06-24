# Skill: Extract Design System

## Purpose

Extract a reusable, implementation-ready design system from screenshots or reference images.
Treat the screenshots as the primary source of truth, not as loose inspiration.
Produce a structured specification that can be directly applied to code tokens and components.

## When to invoke this skill

Invoke this skill:
- when given one or more reference screenshots and asked to implement a design;
- when a design system document has been shared and needs to be translated into tokens;
- when the existing token set needs to be audited against reference images;
- when implementing a new page that must match a visual reference exactly.

## Required inputs

To run this skill you need at minimum:
- one or more reference images (screenshots, mockups, design exports);
- a declaration of which image is the primary source of truth.

If no images are provided, ask for them before proceeding.

## Extraction protocol

### Step 1: Read the images

Look at every reference image carefully before writing any code or tokens. Do not approximate from memory.

For each image, identify and document:

#### Colors
- Primary action color (buttons, CTAs, highlights)
- Background colors (page, card, section variants)
- Text colors (heading, body, caption, muted)
- Border and divider colors
- Badge and state colors (success, warning, error, info)
- Accent colors

Record exact hex values. Do not round or approximate.

#### Typography
- Display / heading font family and weight
- Body / UI font family and weight
- Type scale: H1, H2, H3, body, caption, label, badge
- Line heights and letter spacing where observable
- Font sizing in px or rem

#### Spacing
- Base unit (4px, 8px, etc.)
- Common padding values used in cards, sections, buttons
- Gap values in grids and stacks
- Section vertical rhythm

#### Components
For each visible component, extract:
- Border radius values
- Shadow levels (none, soft, elevated, float)
- Border width and color
- Internal padding
- State variants (default, hover, selected, disabled)
- Size variants if applicable

#### Layout
- Max content width
- Column count at desktop / tablet / mobile
- Grid gap
- Section padding horizontal and vertical

#### Imagery and illustration
- Illustration style (flat, semi-realistic, geometric, human scenes)
- Color palette of illustrations
- Icon style (outline, filled, rounded, sharp)

### Step 2: Output the extracted specification

Format the output as a structured document:

```
## Extracted Design System

### Colors
Primary action: #...
Background: #...
Card surface: #...
Text primary: #...
Text secondary: #...
Border: #...
[continue for all extracted colors]

### Typography
Display font: [name] [weight]
Body font: [name] [weight]
H1: [size] / [line-height]
H2: [size] / [line-height]
H3: [size] / [line-height]
Body: [size] / [line-height]
Caption: [size] / [line-height]

### Spacing scale
Base unit: [value]
Card padding: [value]
Section padding: [value]
Grid gap: [value]
[continue]

### Components
Button primary: [spec]
Button secondary: [spec]
Card: [spec]
Badge: [spec]
Input: [spec]
[continue]

### Layout
Max width: [value]
Columns: [value]
Grid gap: [value]
```

### Step 3: Validate against BRAND.md

Compare the extracted values against BRAND.md (if it exists):
- Flag any discrepancy between the extraction and the written spec
- Where the reference image differs from BRAND.md, the reference image wins
- Propose BRAND.md updates where needed

### Step 4: Propose token updates

Translate the extracted values into the project's token format:

For Tailwind CSS projects, output:
```ts
// Proposed tailwind.config.ts changes
colors: {
  [tokenName]: '[hex]', // [role]
}
fontFamily: {
  display: ['[font]', ...],
  sans: ['[font]', ...],
}
```

### Step 5: Wait for approval before implementing

After producing the extraction and token proposal:
- Present the full spec
- List any conflicts found
- Ask for approval before modifying any code

## Non-negotiable rules

- Never skip the image reading step.
- Never approximate colors from memory — read them from the image.
- Never implement before producing the extracted spec.
- Never implement before approval.
- When in doubt about a value, flag it as uncertain and ask.
- Reference images always outrank memory, convention or assumption.
