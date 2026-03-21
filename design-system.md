# Design System — Datacom Presentation System

This document describes the **actual** design system implemented in this codebase (tokens, components, presentation layout, and markdown authoring contract). It is derived from the current repository state — not a generic Endeavour spec.

## Overview

- **Product identity**: dark-first, presentation-focused, developer-oriented (slide decks from markdown, code blocks, citations, interactive quiz/study mode).
- **Core stack**: Next.js App Router, Tailwind CSS v4, shadcn/ui (Radix Nova), Framer Motion, `next-themes`, Hugeicons.
- **Token source of truth**: `app/globals.css` (semantic CSS variables in OKLCH + Tailwind `@theme inline` mappings).

## Repository map (where key modules live)

- **Routes (App Router)**: `app/`
  - **Static deck**: `app/page.tsx` → `components/presentation.tsx` (content from `content/report.ts`)
  - **Gallery + markdown decks**: `app/p/page.tsx`, `app/p/[slug]/page.tsx`
  - **Quiz route**: `app/p/[slug]/quiz/page.tsx` (JSON-driven quiz)
- **Parser**: `lib/parse-markdown.ts` (custom, line-based parser → `content/types.ts::Report`)
- **Presentation renderers**:
  - `components/dynamic-presentation.tsx` (markdown decks)
  - `components/presentation.tsx` (static deck)
  - `components/quiz-presentation.tsx` + `components/quiz-questions.tsx` (quiz UI)
- **UI primitives**: `components/ui/*` (shadcn-style components)
- **Tokens / global styles**: `app/globals.css`
- **Utilities**: `lib/utils.ts` (class merging), `content/author-map.ts` (slug→author)

## Design tokens

### Token model

`app/globals.css` defines semantic CSS variables in `:root` (light) and `.dark` (dark). Tailwind v4 consumes these via:

- `@theme inline { --color-*: var(--*) }` to generate classes like `bg-background`, `text-foreground`, `border-border`, etc.
- `@custom-variant dark (&:is(.dark *));` to enable `dark:*` variants.

Theme switching is handled by `next-themes` in `app/layout.tsx` (default theme is **dark**).

### Colors

The table below lists every semantic color token and its OKLCH value (source of truth) plus a computed sRGB hex approximation.

| Token | Light (OKLCH) | Light (hex*) | Dark (OKLCH) | Dark (hex*) | Role | Common usage |
|---|---|---|---|---|---|---|
| `--background` | `oklch(1 0 0)` | `#FFFFFF` | `oklch(0.13 0.02 250)` | `#03080F` | Primary app background | `bg-background` |
| `--foreground` | `oklch(0.13 0.02 250)` | `#03080F` | `oklch(0.97 0 0)` | `#F5F5F5` | Primary text color | `text-foreground` |
| `--card` | `oklch(1 0 0)` | `#FFFFFF` | `oklch(0.20 0.02 250)` | `#0F171F` | Card / surface background | `bg-card` |
| `--card-foreground` | `oklch(0.13 0.02 250)` | `#03080F` | `oklch(0.97 0 0)` | `#F5F5F5` | Text on card | `text-card-foreground` |
| `--popover` | `oklch(1 0 0)` | `#FFFFFF` | `oklch(0.20 0.02 250)` | `#0F171F` | Popover / menu surface background | `bg-popover` |
| `--popover-foreground` | `oklch(0.13 0.02 250)` | `#03080F` | `oklch(0.97 0 0)` | `#F5F5F5` | Text on popover | `text-popover-foreground` |
| `--primary` | `oklch(0.46 0.27 264)` | `#0032EB` | `oklch(0.72 0.12 264)` | `#7EA3F0` | Primary interactive (buttons, links) | `bg-primary` / `text-primary` |
| `--primary-foreground` | `oklch(1 0 0)` | `#FFFFFF` | `oklch(0.13 0.02 250)` | `#03080F` | Text/icon on primary | `text-primary-foreground` |
| `--secondary` | `oklch(0.96 0.005 264)` | `#F0F2F5` | `oklch(0.22 0.02 250)` | `#141B24` | Secondary surface / subtle fill | `bg-secondary` |
| `--secondary-foreground` | `oklch(0.13 0.02 250)` | `#03080F` | `oklch(0.97 0 0)` | `#F5F5F5` | Text on secondary | `text-secondary-foreground` |
| `--muted` | `oklch(0.955 0 0)` | `#F0F0F0` | `oklch(0.22 0.02 250)` | `#141B24` | Muted surface fill | `bg-muted` |
| `--muted-foreground` | `oklch(0.50 0 0)` | `#636363` | `oklch(0.65 0 0)` | `#8F8F8F` | Muted text | `text-muted-foreground` |
| `--accent` | `oklch(0.96 0.005 264)` | `#F0F2F5` | `oklch(0.22 0.02 250)` | `#141B24` | Accent surface fill (selected/hover) | `bg-accent` |
| `--accent-foreground` | `oklch(0.13 0.02 250)` | `#03080F` | `oklch(0.97 0 0)` | `#F5F5F5` | Text on accent | `text-accent-foreground` |
| `--destructive` | `oklch(0.53 0.24 27)` | `#D40000` | `oklch(0.60 0.24 27)` | `#EE0F1F` | Error / destructive foreground | `text-destructive` / `bg-destructive/..` |
| `--border` | `oklch(0.88 0 0)` | `#D7D7D7` | `oklch(1 0 0 / 10%)` | `#FFFFFF1A` | Default border color | `border-border` |
| `--input` | `oklch(0.88 0 0)` | `#D7D7D7` | `oklch(1 0 0 / 15%)` | `#FFFFFF26` | Default input border/fill | `border-input` |
| `--ring` | `oklch(0.46 0.27 264)` | `#0032EB` | `oklch(0.72 0.12 264)` | `#7EA3F0` | Focus ring color | `ring-ring` |
| `--chart-1` | `oklch(0.46 0.27 264)` | `#0032EB` | `oklch(0.72 0.12 264)` | `#7EA3F0` | Chart series 1 | `fill-[--color-chart-1]` |
| `--chart-2` | `oklch(0.62 0.30 3)` | `#FF0075` | `oklch(0.62 0.30 3)` | `#FF0075` | Chart series 2 | `fill-[--color-chart-2]` |
| `--chart-3` | `oklch(0.32 0.18 264)` | `#011E8C` | `oklch(0.46 0.27 264)` | `#0032EB` | Chart series 3 | `fill-[--color-chart-3]` |
| `--chart-4` | `oklch(0.78 0.14 84)` | `#E1AF3B` | `oklch(0.78 0.14 84)` | `#E1AF3B` | Chart series 4 | `fill-[--color-chart-4]` |
| `--chart-5` | `oklch(0.72 0.12 264)` | `#7EA3F0` | `oklch(0.96 0.005 264)` | `#F0F2F5` | Chart series 5 | `fill-[--color-chart-5]` |
| `--sidebar` | `oklch(0.985 0 0)` | `#FAFAFA` | `oklch(0.20 0.02 250)` | `#0F171F` | Sidebar surface background | `bg-[--color-sidebar]` |
| `--sidebar-foreground` | `oklch(0.13 0.02 250)` | `#03080F` | `oklch(0.97 0 0)` | `#F5F5F5` | Sidebar text | `text-[--color-sidebar-foreground]` |
| `--sidebar-primary` | `oklch(0.46 0.27 264)` | `#0032EB` | `oklch(0.72 0.12 264)` | `#7EA3F0` | Sidebar primary interactive | `bg-[--color-sidebar-primary]` |
| `--sidebar-primary-foreground` | `oklch(1 0 0)` | `#FFFFFF` | `oklch(0.97 0 0)` | `#F5F5F5` | Text on sidebar primary | `text-[--color-sidebar-primary-foreground]` |
| `--sidebar-accent` | `oklch(0.96 0.005 264)` | `#F0F2F5` | `oklch(0.22 0.02 250)` | `#141B24` | Sidebar accent surface | `bg-[--color-sidebar-accent]` |
| `--sidebar-accent-foreground` | `oklch(0.13 0.02 250)` | `#03080F` | `oklch(0.97 0 0)` | `#F5F5F5` | Text on sidebar accent | `text-[--color-sidebar-accent-foreground]` |
| `--sidebar-border` | `oklch(0.88 0 0)` | `#D7D7D7` | `oklch(1 0 0 / 10%)` | `#FFFFFF1A` | Sidebar border color | `border-[--color-sidebar-border]` |
| `--sidebar-ring` | `oklch(0.46 0.27 264)` | `#0032EB` | `oklch(0.72 0.12 264)` | `#7EA3F0` | Sidebar focus ring | `ring-[--color-sidebar-ring]` |

*Hex values are computed from the OKLCH literals in `app/globals.css` (the OKLCH is the source of truth).*

#### Non-token literal colors (found in code)

This codebase also contains hard-coded colors outside the token system (not exhaustive; see “Known inconsistencies / tech debt” for what to fix first):

- `app/globals.css`: scrollbars and study highlight use `rgba(...)` literals (e.g. `rgba(250, 204, 21, 0.2)`).
- `components/charts.tsx`: chart palette is hard-coded as hex constants (e.g. `#002BFE`, `#00167F`, `#FF0070`, `#DE350B`).
- `components/presentation-gallery.tsx`: category/status pills use Tailwind arbitrary hex colors (e.g. `bg-[#FF0070]/10`).
- Markdown content: authoring uses `<!-- bg: gradient #... #... -->` in several decks (raw hex).

### Radius

Radius is defined in `app/globals.css`:

- `--radius`: `0.5rem` (base)
- Tailwind radius scale is derived in `@theme inline`:
  - `--radius-sm`: `calc(--radius - 4px)` (≈ 4px)
  - `--radius-md`: `calc(--radius - 2px)` (≈ 6px)
  - `--radius-lg`: `--radius` (≈ 8px)
  - `--radius-xl`: `calc(--radius + 4px)` (≈ 12px)
  - `--radius-2xl`: `calc(--radius + 8px)` (≈ 16px)
  - `--radius-3xl`: `calc(--radius + 12px)` (≈ 20px)
  - `--radius-4xl`: `calc(--radius + 16px)` (≈ 24px)

In practice most components use `rounded-lg` and occasionally clamp to `var(--radius-md)` (see `components/ui/button.tsx`).

### Typography

**Font family**:

- `Montserrat` is loaded via `next/font/google` in `app/layout.tsx`.
- Tailwind `font-sans` and `font-mono` are both mapped to the same CSS variable (`--font-geist-sans`) in `app/globals.css`. That means **code blocks are not truly monospaced**; they only use mono-like styling (tracking/uppercase/size), not a mono font.

**Weights declared**: `300`, `400`, `500`, `600`, `700`.

**Role patterns used in presentation slides** (from `components/dynamic-presentation.tsx` and `components/presentation.tsx`):

- **Section label**: `text-sm font-semibold uppercase tracking-widest text-foreground/40`
- **Section heading**: `text-2xl md:text-3xl lg:text-4xl font-bold`
- **Body**: `text-base md:text-lg leading-relaxed text-foreground/60`
- **Title slide**: `text-3xl md:text-5xl lg:text-6xl font-bold`
- **Captions/metadata**: `text-xs`–`text-sm` with `text-foreground/30`–`/50`
- **Code blocks**: `text-[13px]` with line-number gutter (in markdown deck) and `rounded-lg bg-foreground/[0.04] border border-foreground/10`

## Spacing & layout

### Slide layout (presentation core)

Both the static deck and the markdown deck are **full-viewport slides**:

- **Slide container**: `h-screen overflow-y-scroll` with `scrollSnapType: "y mandatory"`.
- **Slide**: `h-screen` (or `min-h-screen` for some quiz slides) with `scrollSnapAlign: "start"`.
- **Aspect ratio**: there is **no fixed 16:9**; the deck uses the browser viewport size.

**Key dimensions/patterns**:

- **Horizontal slide padding**: `px-6 md:px-16`
- **Text column width**: `max-w-2xl`
- **Media split layout** (static deck): `max-w-4xl` with `md:flex-row` and `gap-8 md:gap-12`
- **Gallery page width**: outer `max-w-5xl`, entries `max-w-4xl`

### Spacing scale

There is no explicit, shared spacing token scale. Spacing is mostly Tailwind utilities, with occasional arbitrary values (e.g. `gap-[2px]` in `components/theme-toggle.tsx`).

### Breakpoints

No `tailwind.config.*` exists in this repo. Responsive behavior uses Tailwind defaults (`md:`, `lg:`).

### Shadows

There are no dedicated shadow tokens. Components use Tailwind defaults sparingly (e.g. `shadow-sm` for selected pills, elevated menus/popovers).

## Motion, layering, and theming

### Motion

- Static deck (`components/presentation.tsx`) uses per-slide Framer Motion variants (`fade-in`, `slide-up`, `slide-left`, `scale-in`) and respects `useReducedMotion`.
- Markdown deck (`components/dynamic-presentation.tsx`) uses Framer Motion mainly for small UI flourishes (nav indicator) and respects reduced motion.

### Layering (z-index)

Common layers:

- `components/theme-toggle.tsx`: fixed top-right, `z-50`
- `components/comments-panel.tsx`: fixed right panel, `z-50`
- Several popovers/menus in `components/ui/*`: `z-50`

### Theme switching

- `next-themes` provider in `app/layout.tsx` sets `attribute="class"` and `defaultTheme="dark"`.
- Tokens swap via `.dark { ... }` variable overrides in `app/globals.css`.

## Components

### Presentation system components

- **`DynamicPresentation`** (`components/dynamic-presentation.tsx`): renders a `Report` (from markdown) into one full-screen slide per section/item; includes keyboard navigation and right-rail slide jump UI.
- **`Presentation`** (`components/presentation.tsx`): renders the static `content/report.ts` deck with optional per-slide motion and richer media positioning (`left|right|above|below|background`).
- **`PresentationGallery`** (`components/presentation-gallery.tsx`): filter pills + list entries; uses a mix of token colors and hard-coded category colors.
- **Study mode** (`components/study-mode-context.tsx`, `components/comments-panel.tsx`): toggles focus/highlighting and per-slide notes via keyboard shortcuts.
- **Quiz UI** (`components/quiz-presentation.tsx`, `components/quiz-questions.tsx`): scroll-snap quiz experience for decks with `*.quiz.json`.
- **Charts** (`components/charts.tsx`): a library of inline SVG charts used by bespoke pages.

### Reusable UI primitives (`components/ui/*`)

shadcn-style primitives built with Tailwind + Base UI / Radix patterns:

- **Buttons** (`components/ui/button.tsx`): variants `default|outline|secondary|ghost|destructive|link`, multiple sizes, `focus-visible` ring wired to `--ring`, `rounded-lg`.
- **Badge** (`components/ui/badge.tsx`): compact status labels, `rounded-4xl`.
- **Card** (`components/ui/card.tsx`): structured card layout.
- **Inputs** (`input.tsx`, `textarea.tsx`, `label.tsx`, `field.tsx`, `input-group.tsx`): consistent borders/rings via tokens.
- **Select/Combobox/Dropdown** (`select.tsx`, `combobox.tsx`, `dropdown-menu.tsx`): overlay menus with `z-50`.
- **Tooltip / Alert Dialog / Avatar / Separator**: standard primitives.

## Presentation-specific authoring contract (markdown)

Markdown decks are loaded and parsed at **server/build time** and rendered as client-side slide UI:

- **Read from disk**: `app/p/[slug]/page.tsx` reads `content/**` via `fs.readFileSync` and parses via `lib/parse-markdown.ts`.
- **Intermediate representation**: `content/types.ts::Report`.
- **Output**: React slides in `components/dynamic-presentation.tsx`.

### Content discovery

Directories scanned for `.md` files (`app/p/[slug]/page.tsx`, `app/p/page.tsx`):

- `content/presentations/`
- `content/detailed-presentations/`
- `content/agent-library-presentations/`
- `content/servicenow-presentations/`
- `content/product-hub-presentations/`
- `content/products/`
- `content/external-reports/`

**Note:** `/p/[slug]` additionally checks `content/capability/`, but `/p` (gallery) currently does not.

### Supported markdown structure (parser)

The parser is **custom** (no `remark`, `unified`, `markdown-it`, etc.). It is a line-based state machine.

**Metadata (no YAML frontmatter):**

- `# Title` → `report.title`
- `> Subtitle` (blockquote immediately after title) → `report.subtitle`
- `**Author:** Name` or `**Author:** [Name](url)` → `report.author`
- `**Date:** ...` → `report.date`
- `**Source:** ...` → used as `closer.reportUrl` fallback

**Section boundaries:**

- `## 🎯` or `## ...Context...` → Context
- `## 🔍` or `## ...Problem...` → Problem
- `## 📋` or `## ...Observation...` → Observations
- `## 💡` or `## ...Proposal...` → Proposal
- `## ⚠️` or `## ...Risk...` → Risks
- `## ✅` or `## ...Next Step...` → Next Steps
- `## 🔑` or `## ...Clos...` → Close
- Any other `## ...` heading becomes a **Flex Section** (custom slide type).

**Slide counting / slide splitting:**

- Observations: each `**<n>. Title**` becomes a slide.
- Flex sections: each `**<n>. Title**` inside a flex section becomes its own slide; otherwise the flex section renders as a single slide.
- Proposal, Risks, Next Steps, Close: each maps to a slide (subject to whether content exists).

**Horizontal rules**:

- Lines that are exactly `---` are ignored by the parser (they are not slide delimiters).

### Styling directives (HTML comments)

Placed as standalone lines:

- `<!-- bg: solid <color> -->`
- `<!-- bg: gradient <from> <to> [angle] -->`
- `<!-- bg: image <src> [overlay] -->`
- `<!-- text: <color> -->` (overrides text color)
- `<!-- label: <color> -->` (overrides the section label color)
- `<!-- media-position: above|below|left|right|center|background -->`

**Important nuance:** `media-position` only applies if media already exists for that slide (i.e. after an image line has been parsed).

### Media

One-line markdown image syntax is supported:

- `![alt](src)` attaches media to the current slide.

Rendering uses `<img>` with `object-contain` and a height cap (`40vh` or `50vh` when centered).

### Inline markup in slides

`DynamicPresentation` implements a small subset of inline markup:

- `**bold**`
- `*italic*`
- `` `inline code` ``
- `[label](url)` links
- `==highlight==` (study highlight)
- raw `http(s)://...` URLs auto-link

### Quizzes

If a `*.quiz.json` exists alongside a markdown deck (same slug), `/p/[slug]` sets `hasQuiz`, and `/p/[slug]/quiz` renders a quiz deck (see `content/types.ts::Quiz`).

## Do’s and Don’ts

### Do

- **Use semantic token classes**: `bg-background`, `text-foreground`, `border-border`, `ring-ring` instead of raw colors in app UI.
- **Keep headings short**: slide headings render at `text-2xl`–`text-4xl`; long headings wrap and reduce legibility.
- **Use code fences for code**: fenced blocks are preserved and rendered with a code block UI; inline code uses backticks.
- **Put `media-position` after the image line** when you need left/right/centered media.
- **Prefer flex sections for custom structures**: any non-reserved `##` heading becomes a flex section (and numbered items become slides).

### Don’t

- **Don’t rely on YAML frontmatter** — it is not parsed.
- **Don’t assume `---` creates slides** — it is ignored by the parser (use `##` headings and numbered items).
- **Don’t add more hard-coded hex colors in components** — charts and category pills already contain many; treat these as exceptions to reduce further drift.
- **Don’t expect full markdown support** — the parser and renderer intentionally support a limited subset.
- **Don’t add new directories of markdown decks without updating both** `app/p/page.tsx` and `app/p/[slug]/page.tsx` (they currently differ).

## Tokens reference table (quick lookup)

These are the token-backed Tailwind classes you should reach for first:

| Intent | Use | Backed by |
|---|---|---|
| Page background | `bg-background` | `--background` |
| Default text | `text-foreground` | `--foreground` |
| Card surface | `bg-card` | `--card` |
| Card text | `text-card-foreground` | `--card-foreground` |
| Primary action | `bg-primary text-primary-foreground` | `--primary`, `--primary-foreground` |
| Secondary surface | `bg-secondary text-secondary-foreground` | `--secondary`, `--secondary-foreground` |
| Muted surface | `bg-muted text-muted-foreground` | `--muted`, `--muted-foreground` |
| Accent surface | `bg-accent text-accent-foreground` | `--accent`, `--accent-foreground` |
| Destructive text | `text-destructive` | `--destructive` |
| Borders | `border-border` | `--border` |
| Input border | `border-input` | `--input` |
| Focus ring | `ring-ring` / `focus-visible:ring-ring/50` | `--ring` |

## Accessibility and contrast

The token set supports strong contrast for primary reading pairs. Using the computed hex approximations above:

- Light `foreground` on `background`: **20.09:1** (AA pass)
- Light `muted-foreground` on `muted`: **5.27:1** (AA pass)
- Light `primary-foreground` on `primary`: **7.91:1** (AA pass)
- Dark `foreground` on `background`: **18.42:1** (AA pass)
- Dark `muted-foreground` on `card`: **5.59:1** (AA pass)
- Dark `destructive` on `background`: **4.52:1** (AA pass; close to threshold)

## Known inconsistencies / tech debt (with recommendations)

- **Hard-coded palette in charts** (`components/charts.tsx`): chart colors are duplicated as hex constants rather than referencing `--chart-*`.
  - Recommendation: migrate charts to use `var(--chart-*)` or `--color-chart-*` so light/dark can diverge safely.
- **Hard-coded palette in gallery pills** (`components/presentation-gallery.tsx`): category/status colors are hex literals.
  - Recommendation: define category tokens or map to `--chart-*` / existing semantic tokens.
- **Docs drift**: `docs/presentation-as-system-architecture.md` documents a warm “Geist” theme that does not match the current Montserrat + OKLCH Endeavour tokens.
  - Recommendation: either update/retire that doc or clearly mark it historical.
- **Directory mismatch**: `/p/[slug]` checks `content/capability`, but `/p` does not.
  - Recommendation: unify `PRESENTATIONS_DIRS` in one shared module to avoid divergence.
- **Parser is untested**: no unit tests for `lib/parse-markdown.ts`.
  - Recommendation: add snapshot tests for representative markdown inputs (built-in sections, flex sections, code fences, media, directives).
- **Sync file IO in routes**: `fs.readFileSync` is used in App Router server code.
  - Recommendation: switch to async fs APIs where possible, especially if moving away from pure SSG.
- **Study highlight and scrollbar colors are not tokenized** (`app/globals.css`): several `rgba(...)` literals exist.
  - Recommendation: define tokens for highlight + scrollbar, or accept them explicitly as non-semantic styling.
- **Turbopack dev edge case**: if you see `Can't resolve 'tailwindcss'`, run `pnpm exec next dev --webpack` as a workaround.

