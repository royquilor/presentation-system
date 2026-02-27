# presentation-as-system
## Site Architecture & Component Spec

**Stack:** Next.js, Tailwind CSS, shadcn/ui
**Mode:** Dark only
**Font:** Geist (sans) + Geist Mono (code/labels)
**Format:** Single scrollable report page, shareable via URL

---

## Colour Tokens

Warm dark — not pure black. Think charcoal with a slight brown undertone.

| Token | Value | Usage |
|---|---|---|
| `background` | `#16130f` | Page background |
| `surface` | `#1e1a15` | Cards, sections |
| `surface-raised` | `#252019` | Hover states, elevated cards |
| `border` | `#2e2820` | Dividers, card borders |
| `text-primary` | `#f0ebe4` | Headlines, body copy |
| `text-secondary` | `#9e9488` | Subheadings, captions, metadata |
| `text-muted` | `#5c5449` | Placeholders, disabled |
| `accent` | `#c9a96e` | Links, highlights, active states |
| `accent-subtle` | `#2a2318` | Accent backgrounds, tag fills |
| `severity-critical` | `#c0614a` | Critical severity label |
| `severity-high` | `#c08a4a` | High severity label |
| `severity-medium` | `#8a9a6a` | Medium severity label |

---

## Typography Scale

Font family: `Geist` for all text. `Geist Mono` for labels, tags, and code references.

| Name | Size | Weight | Usage |
|---|---|---|---|
| `display` | 48px / 3rem | 600 | Cover title only |
| `heading-1` | 32px / 2rem | 600 | Section titles |
| `heading-2` | 22px / 1.375rem | 500 | Card titles, sub-sections |
| `heading-3` | 16px / 1rem | 500 | List item labels |
| `body` | 15px / 0.9375rem | 400 | Body copy |
| `body-sm` | 13px / 0.8125rem | 400 | Captions, secondary text |
| `label` | 11px / 0.6875rem | 500 | Tags, metadata — Geist Mono, uppercase, tracked |

Line height: `1.6` for body. `1.2` for headings.

---

## Layout

- Max content width: `720px`, centred
- Page padding: `24px` horizontal on mobile, `48px` on desktop
- Section spacing: `80px` between major sections
- Card internal padding: `24px`

---

## Site Navigation

Sticky top bar. Minimal. No logo on the left for now — just section anchors.

```
[ Findings ]  [ Patterns ]  [ Solutions ]  [ Context ]  [ Full Report ↗ ]
```

**Behaviour:**
- Sticks to top on scroll
- Active section highlighted with `accent` underline
- Background: `background` with `border-b border`
- On mobile: collapses to a single `≡` icon with drawer

**Component:** `<SiteNav sections={[]} reportUrl="" />`

---

## Page Sections

### 1. Cover
- Full-width, generous top padding (`120px`)
- Display title: the report name
- Subtitle: one-line description
- Metadata row: date, number of conversations (Geist Mono, `text-secondary`)
- No hero image — typography only

---

### 2. What I'm Seeing
- Section label: `FINDINGS` (label style, `text-muted`)
- Short intro paragraph
- 3 pattern cards in a vertical stack

**PatternCard component:**
```
┌─────────────────────────────────────┐
│  PATTERN 1               [tag]      │
│  Heading                            │
│                                     │
│  Body copy paragraph                │
│                                     │
│  Compounding effect line            │
└─────────────────────────────────────┘
```
- Border: `border` colour
- Background: `surface`
- Tag: pattern number in Geist Mono

---

### 3. Solutions
- Section label: `WHAT'S POSSIBLE`
- Intro line: *"Three areas worth considering — no pressure to act on all of them."*
- 3 solution cards in vertical stack

**SolutionCard component:**
```
┌─────────────────────────────────────┐
│  SOLUTION 1                         │
│  Heading                            │
│                                     │
│  Body copy                          │
│  • Bullet                           │
│  • Bullet                           │
│                                     │
│  [ Low risk. Auditable. ]           │
└─────────────────────────────────────┘
```
- Footer line: small, `text-secondary`, italic — the one-line summary

---

### 4. Strategic Context
- Section label: `BIGGER PICTURE`
- 4–5 subsections, each with a heading and short paragraph
- No cards — clean prose with `heading-2` + body
- Subtle `border-l-2 border-accent` left rule on each subsection

---

### 5. Sequencing
- Section label: `WHAT TO DO FIRST`
- Numbered vertical list, not a table
- Each step: number (large, `text-muted`, Geist Mono) + label + one-line description
- Active/recommended step could be highlighted with `accent`

**SequenceStep component:**
```
  01   CLAUDE.md guardrails
       Immediate impact. Every AI session inherits consistent rules.

  02   Component audit
       Cleans the foundation everything else builds on.
```

---

### 6. Closer
- Short paragraph — the non-pushy close
- The platform velocity observation
- Link to full report: `button` variant, `accent` colour, opens in new tab

---

## Shared Components

### SectionLabel
`FINDINGS`, `SOLUTIONS` etc. — Geist Mono, uppercase, `text-muted`, `tracking-widest`, `text-xs`. Sits above each section heading.

### Divider
Thin `border-t border` line. Full width. `my-16`.

### Tag / SeverityBadge
Used in the full report table. Geist Mono, small, rounded, filled background.

| Severity | Background | Text |
|---|---|---|
| Critical | `severity-critical` at 15% opacity | `severity-critical` |
| High | `severity-high` at 15% opacity | `severity-high` |
| Medium | `severity-medium` at 15% opacity | `severity-medium` |

### CalloutBlock
Left border accent, slightly raised background. Used for pull quotes or key observations.

```
│ "None of these are fires. But they create friction
│  that compounds quietly."
```

### ReportLink
Last slide CTA. Text + arrow icon. `text-accent`, underline on hover.

---

## Responsive Behaviour

- **Mobile** (`< 640px`): single column, reduced headings, nav collapses
- **Tablet** (`640–1024px`): same as mobile layout, slightly more padding
- **Desktop** (`> 1024px`): centred column, full nav visible

No grid layouts needed — this is a document, not a dashboard.

---

## File Structure

```
/app
  page.tsx              ← main report page
  layout.tsx            ← font loading, dark background
/components
  SiteNav.tsx
  PatternCard.tsx
  SolutionCard.tsx
  SequenceStep.tsx
  SectionLabel.tsx
  CalloutBlock.tsx
  SeverityBadge.tsx
  Divider.tsx
/content
  report.ts             ← all copy lives here, not in components
/lib
  fonts.ts              ← Geist font config
```

All copy lives in `/content/report.ts` so the structure can be reused for any client by swapping the content file.

---

## Content Structure (report.ts shape)

```ts
export const report = {
  title: string
  subtitle: string
  date: string
  conversations: number
  patterns: Array<{
    number: number
    title: string
    body: string
    compounding: string
  }>
  solutions: Array<{
    number: number
    title: string
    body: string
    bullets: string[]
    summary: string
  }>
  context: Array<{
    heading: string
    body: string
  }>
  sequence: Array<{
    step: number
    label: string
    description: string
  }>
  closer: {
    observation: string
    body: string
    reportUrl: string
  }
}
```

This is the key reusability pattern — swap `report.ts`, keep everything else.
