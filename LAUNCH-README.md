# Datacom Presentation Server — Launch & Run Guide

## Prerequisites

- **Node.js 18+** — [nodejs.org](https://nodejs.org)
- **pnpm** — Install globally if not present: `npm install -g pnpm`

## Quick Start

```bash
cd /Users/ben/Desktop/DATACOM/Design/PRESENTATION-SYSTEM-DATACOM-REBRAND
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Routes

| URL | Description |
|-----|-------------|
| `/` | Default presentation (from `content/report.ts`) |
| `/p` | Gallery — lists all markdown-based presentations |
| `/p/[slug]` | Individual presentation rendered from markdown |
| `/analysis` | Conver comprehensive analysis (18 slides, charts, 47 citations) |
| `/conver-value` | Conver $15.6M value case (16 slides, charts) |
| `/conver-data` | Conver data visualisation showcase (20 slides, imaginative charts) |
| `/agent-library` | Agent Library analysis (charts, citations) |

## Presentation Sources

Markdown files are loaded from these directories:

| Directory | Content |
|-----------|---------|
| `content/presentations/` | Symlink → Conver Confluence summaries |
| `content/detailed-presentations/` | Conver detailed presentations, ROI, value case |
| `content/agent-library-presentations/` | Agent Library Confluence summaries |

Each `.md` file in these directories becomes a slide deck at `/p/[filename-without-extension]`.

## Creating a New Presentation

### Option A: Markdown file (automatic rendering)

1. Create a `.md` file in `content/detailed-presentations/` (or any configured directory)
2. Follow this structure:

```markdown
# Title
> Subtitle

**Author:** [Name](https://confluence-profile-url)
**Date:** March 2026
**Source:** https://confluence-page-url

---

## 🎯 Context

First paragraph becomes the heading. Remaining paragraphs become the body.

---

## 🔍 Problem

First paragraph = heading. Rest = body.

---

## 📋 Observations

**1. First observation title**
Body text for observation 1.

**2. Second observation title**
Body text for observation 2.

---

## 💡 Proposal

Opening sentence becomes the heading.

- Bullet point 1
- Bullet point 2

*Summary in italics becomes the footer.*

---

## ⚠️ Risks

- **Risk title:** Risk description
- **Another risk:** Description

---

## ✅ Next Steps

1. **Step label** — Description
2. **Step label** — Description

---

## 🔑 Close

> Key takeaway quote (becomes the heading)

Closing paragraph.

https://link-to-full-report (becomes the "Full report" link)
```

3. Visit `/p/your-filename` or find it in the gallery at `/p`

### Option B: Custom React page (for charts, interactive content, clickable links)

1. Create a directory under `app/` (e.g., `app/my-presentation/`)
2. Create `page.tsx` using the analysis page as a template
3. Import chart components from `@/components/charts`
4. Use the standard `Cite` component for consistent citation styling:

```tsx
const CL = "underline decoration-foreground/0 hover:decoration-foreground/40 transition-all duration-200";

function Cite({ href, children }) {
  return <a href={href} target="_blank" rel="noopener noreferrer" className={`text-foreground/40 text-sm ${CL}`}>{children}</a>;
}
```

## Navigation

- **Scroll** — snap between slides
- **Arrow keys** (↑↓←→) — navigate slides
- **Right-side dots** — click to jump to any slide

## Stopping the Server

Press `Ctrl+C` in the terminal, or:

```bash
lsof -ti:3000 | xargs kill -9
```

## Restarting (if port 3000 is stuck)

```bash
lsof -ti:3000 | xargs kill -9 2>/dev/null
sleep 1
rm -f .next/dev/lock
pnpm dev
```

## Tech Stack

- Next.js 16 (Turbopack)
- Tailwind CSS v4
- Framer Motion
- Montserrat (Datacom Endeavour typeface)
- Custom SVG charts (`components/charts.tsx`)

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Port 3000 in use | `lsof -ti:3000 \| xargs kill -9` then restart |
| Lock file error | `rm -f .next/dev/lock` then restart |
| pnpm not found | `npm install -g pnpm` |
| Markdown not appearing at `/p` | Ensure file is in a configured directory and ends with `.md` |
| Author shows "Datacom" | Add `**Author:** [Name](url)` to your markdown header |
