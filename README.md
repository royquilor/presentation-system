# Datacom Presentation System

A reusable presentation template built with Next.js, Tailwind CSS, and Framer Motion — rebranded with the Datacom Endeavour Design System. All content lives in a single data file, and the slides build themselves from it.

## Quick start

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## How it works

All content is defined in one place:

```
content/report.ts
```

Edit that file. The slides, navigation indicators, and slide count all update automatically — no component changes needed.

See `content/CONVERSION-GUIDE.md` for how to convert markdown documents into `report.ts` format.  
See `content/template.ts` for a blank starter file.

---

## Slide structure

The presentation follows a fixed narrative outline:

| Slide | Section | Purpose |
|---|---|---|
| 1 | **Title** | Datacom logo, author, date, report title and subtitle |
| 2 | **Context** | Background — the situation or environment |
| 3 | **Problem** | The core issue being addressed |
| 4–N | **Observations** | What was seen or heard — one slide per observation |
| N+1 | **Proposal** | What is being recommended |
| N+2 | **Risks** | What could go wrong |
| N+3 | **Next Steps** | Ordered list of what to do first |
| Last | **Close** | Key takeaway and optional link to full report |

Observations are an array — add or remove items and the slide count adjusts automatically.

---

## Content file reference

```ts
// content/report.ts

export const report = {
  title: "Report Title",
  subtitle: "One-line description of this report",
  date: "2026",
  conversations: 0,

  author: {
    name: "Ben Schaumkel",
    avatarUrl: "",
    initials: "BS",
  },

  context: {
    heading: "Context heading",
    body: "Background copy...",
  },

  problem: {
    heading: "Problem heading",
    body: "Problem copy...",
  },

  observations: [
    {
      number: 1,
      title: "Observation title",
      body: "What was seen...",
      note: "Supporting detail or compounding effect...",
    },
    // add or remove observations freely
  ],

  proposal: {
    heading: "Proposal heading",
    body: "What is being recommended...",
    bullets: [
      "First concrete action",
      "Second concrete action",
    ],
    summary: "One-line summary of the value.",
  },

  risks: [
    {
      title: "Risk title",
      body: "What this risk means if left unaddressed...",
    },
    // add or remove risks freely
  ],

  nextSteps: [
    {
      step: 1,
      label: "Step label",
      description: "Why this comes first...",
    },
    // add or remove steps freely
  ],

  closer: {
    observation: "One sentence capturing the key takeaway.",
    body: "Closing paragraph...",
    reportUrl: "#",           // set to "#" to hide the link
  },
} as const;
```

---

## Navigation

- **Scroll** — snap-scroll between slides
- **Arrow keys** — navigate forward and back
- **Right-side indicators** — click any dash to jump to that slide; the active slide is highlighted

---

## Datacom brand configuration

### Colors

All colors are defined in `app/globals.css` using OKLCH format:

| Token | Light Mode | Dark Mode | Hex Reference |
|---|---|---|---|
| `--background` | White | Midnight Blue | `#FFFFFF` / `#000A14` |
| `--foreground` | Midnight Blue | Near-white | `#000A14` / `#F5F5F5` |
| `--primary` | Electric Blue | Light Blue | `#002BFE` / `#80A0F8` |
| `--muted` | Light grey | Dark surface | `#F0F0F0` / `#1A232C` |
| `--border` | Grey | White 10% | `#DADADA` / `rgba(255,255,255,0.1)` |
| `--destructive` | Error red | Error red | `#C80000` / `#FA0000` |

To update colors, convert new hex values to OKLCH at [oklch.com](https://oklch.com) and replace the values in `:root` (light) and `.dark` (dark) sections.

### Typography

- **Font**: Montserrat (400, 500, 600, 700) — the only font in the Endeavour Design System
- **No monospace font** — the Endeavour system uses Montserrat exclusively

Configured in `app/layout.tsx`. Section labels use uppercase letter-spacing instead of a monospace font for visual differentiation.

### Logo

The Datacom wordmark is rendered as an inline SVG in `components/presentation.tsx`. It uses `currentColor` to automatically adapt to light/dark mode.

Static SVG files are also available in `public/`:
- `datacom-logo.svg` — Admiral Blue (#00167F) for light backgrounds
- `datacom-logo-light.svg` — White for dark backgrounds

---

## Customising the structure

The presentation is data-driven. To change what appears on screen, change `content/report.ts`.

To change how a section is laid out, edit `components/presentation.tsx`. Each section is a named block inside `buildSections()` — find the section by its `id` and update the JSX.

To add a new section type entirely, add a new `sections.push({...})` block in `buildSections()` with a unique `id`, a `label` for the nav, and your `content` JSX.

---

## Creating a new presentation

1. Duplicate `content/template.ts` → `content/my-report.ts`
2. Fill in all sections (see `content/CONVERSION-GUIDE.md` for mapping)
3. Update the import in `components/presentation.tsx`:
   ```ts
   import { report } from "@/content/my-report";
   ```
4. Run `pnpm dev` and review each slide

---

## Project structure

```
PRESENTATION-SYSTEM-DATACOM-REBRAND/
├── app/
│   ├── layout.tsx          # Root layout — Montserrat (Endeavour font)
│   ├── page.tsx            # Renders <Presentation />
│   └── globals.css         # Datacom Endeavour color tokens (OKLCH)
├── components/
│   ├── presentation.tsx    # All slides and navigation — Datacom logo + branding
│   ├── theme-provider.tsx  # next-themes wrapper
│   ├── theme-toggle.tsx    # Light / dark / system toggle
│   └── ui/                 # shadcn/ui base components
├── content/
│   ├── report.ts           # Current presentation content — edit this
│   ├── conver-business-case.ts  # Example: Conver rollout business case
│   ├── template.ts         # Blank template for new presentations
│   └── CONVERSION-GUIDE.md # Markdown → report.ts mapping guide
├── public/
│   ├── datacom-logo.svg    # Datacom wordmark (Admiral Blue)
│   └── datacom-logo-light.svg  # Datacom wordmark (White)
└── lib/
    └── utils.ts            # cn() utility
```

---

## Files changed for Datacom rebrand

| File | What changed |
|---|---|
| `app/globals.css` | Replaced all color tokens with Datacom Endeavour palette (OKLCH) |
| `app/layout.tsx` | Swapped Geist fonts for Montserrat only (per Endeavour spec); updated metadata |
| `components/presentation.tsx` | Replaced avatar with Datacom logo; dynamic author/date; bold headings (700); no mono fonts |
| `content/report.ts` | Updated author to Ben Schaumkel; updated date |
| `public/datacom-logo.svg` | New — Datacom wordmark in Admiral Blue |
| `public/datacom-logo-light.svg` | New — Datacom wordmark in white |
| `content/template.ts` | New — blank template for new presentations |
| `content/CONVERSION-GUIDE.md` | New — markdown conversion documentation |

---

## Tech stack

- [Next.js 16](https://nextjs.org) — framework
- [Tailwind CSS v4](https://tailwindcss.com) — styling
- [Framer Motion](https://www.framer.com/motion/) — nav indicator animations
- [shadcn/ui](https://ui.shadcn.com) — base UI components
- [next-themes](https://github.com/pacocoursey/next-themes) — theme support (defaults to dark)
- [Montserrat](https://fonts.google.com/specimen/Montserrat) — Datacom Endeavour typeface (400–700)
