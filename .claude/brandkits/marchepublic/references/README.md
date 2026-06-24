# MarchéPublic.be — Reference Images

This folder contains the approved visual references for MarchéPublic.be.

These files are the primary source of truth for all design decisions.
They override the current implementation, generic conventions, and Claude's interpretation.

## Expected files

| File | Contents |
|------|----------|
| `design-system-1890.png` | Full design system: palette, typography, components, badges, buttons, stepper, score |
| `landing-1890.png` | Homepage: hero, sections, illustration direction, FAQ, CTA |
| `form-result-1890.png` | Diagnostic flow, option cards, stepper, result screen, document cards, sources |

## How to add references

Place the approved PNG exports in this folder.
File names must match exactly as listed above.

Once files are present, run the `extract-design-system` skill to produce a structured specification before implementing.

## Usage

These images are read by Claude during design sessions.
They must be present before any design implementation work begins.

If a file is missing, Claude will stop and ask for it before proceeding.
