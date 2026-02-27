# Presentation as a system

A reusable presentation template built with Next.js, Tailwind CSS, and Framer Motion. Designed to be forked and filled in — all content lives in a single data file, and the slides build themselves from it.

## How it works

All content is defined in one place:

```
content/report.ts
```

Edit that file. The slides, navigation indicators, and slide count all update automatically — no component changes needed.

---

## Slide structure

The presentation follows a fixed narrative outline:

| Slide | Section | Purpose |
|---|---|---|
| 1 | **Title** | Author, date, report title and subtitle |
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
  date: "Month YYYY",
  conversations: 0,           // set to 0 to hide

  author: {
    name: "Roy Quilor",
    avatarUrl: "https://avatars.githubusercontent.com/u/2366186?v=4",
    initials: "RQ",           // shown if avatarUrl fails to load
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

## Getting started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Customising the structure

The presentation is data-driven. To change what appears on screen, change `content/report.ts`.

To change how a section is laid out, edit `components/presentation.tsx`. Each section is a named block inside `buildSections()` — find the section by its `id` and update the JSX.

To add a new section type entirely, add a new `sections.push({...})` block in `buildSections()` with a unique `id`, a `label` for the nav, and your `content` JSX.

---

## Project structure

```
presentation-as-system/
├── app/
│   ├── layout.tsx          # Root layout with ThemeProvider and TooltipProvider
│   ├── page.tsx            # Renders <Presentation />
│   └── globals.css         # Design tokens and Tailwind base styles
├── components/
│   ├── presentation.tsx    # All slides and navigation — reads from report.ts
│   ├── theme-provider.tsx  # next-themes wrapper
│   ├── theme-toggle.tsx    # Light / dark / system toggle
│   └── ui/                 # shadcn/ui base components
├── content/
│   └── report.ts           # All content lives here — edit this file
└── lib/
    └── utils.ts            # cn() utility
```

---

## Tech stack

- [Next.js 16](https://nextjs.org) — framework
- [Tailwind CSS v4](https://tailwindcss.com) — styling
- [Framer Motion](https://www.framer.com/motion/) — nav indicator animations
- [shadcn/ui](https://ui.shadcn.com) — base UI components (avatar, tooltip, etc.)
- [next-themes](https://github.com/pacocoursey/next-themes) — theme support (defaults to dark)
- [Geist](https://vercel.com/font) — sans and mono typefaces
