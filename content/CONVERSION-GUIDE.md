# Markdown → report.ts Conversion Guide

## Overview

This guide explains how to convert a markdown document (e.g. a Confluence page export or summarised report) into the `report.ts` format that powers the presentation system.

Each `report.ts` file produces a complete, scrollable presentation with keyboard navigation, light/dark mode, and Datacom branding.

---

## Section Mapping

| Markdown Pattern | report.ts Field | Slide Type |
|---|---|---|
| `# Title` | `title` | Title slide |
| `> subtitle text` | `subtitle` | Title slide |
| `## 🎯 Context` heading + body | `context.heading`, `context.body` | Context slide |
| `## 🔍 Problem` heading + body | `problem.heading`, `problem.body` | Problem slide |
| `**1. Observation title**` + body + note | `observations[]` → `{ number, title, body, note }` | One slide per observation |
| `## 💡 Proposal` + body + bullet list + summary | `proposal.heading`, `.body`, `.bullets[]`, `.summary` | Proposal slide |
| `## ⚠️ Risks` + numbered items | `risks[]` → `{ title, body }` | Risks slide |
| `## ✅ Next Steps` + numbered items | `nextSteps[]` → `{ step, label, description }` | Next Steps slide |
| `## 🔑 Close` + observation + body + link | `closer.observation`, `.body`, `.reportUrl` | Closer slide |

---

## Step-by-Step Conversion

### 1. Create report file

Copy `content/report.ts` as a template, or create a new file (e.g. `content/conver-report.ts`).

### 2. Fill in metadata

```typescript
export const report = {
  title: "Your Presentation Title",
  subtitle: "A one-line summary of the topic.",
  date: "2026",
  conversations: 0,
  author: {
    name: "Ben Schaumkel",
    avatarUrl: "",
    initials: "BS",
  },
```

### 3. Convert Context section

From markdown:
```markdown
## 🎯 Context
### The heading you want displayed
The body paragraph text goes here.
```

To report.ts:
```typescript
context: {
  heading: "The heading you want displayed",
  body: "The body paragraph text goes here.",
},
```

### 4. Convert Problem section

Same pattern as Context:
```typescript
problem: {
  heading: "What the core problem is",
  body: "Detailed explanation of the problem.",
},
```

### 5. Convert Observations

Each observation becomes its own slide. From markdown:
```markdown
**1. First observation**
Body text explaining the observation.
_Note: optional contextual note_
```

To report.ts:
```typescript
observations: [
  {
    number: 1,
    title: "First observation",
    body: "Body text explaining the observation.",
    note: "Optional contextual note",
  },
  // ... up to 6 observations recommended
],
```

### 6. Convert Proposal

```typescript
proposal: {
  heading: "What you're proposing",
  body: "Detailed explanation of the proposal.",
  bullets: [
    "Key benefit one",
    "Key benefit two",
    "Key benefit three",
  ],
  summary: "One-line summary statement.",
},
```

### 7. Convert Risks

```typescript
risks: [
  {
    title: "Risk title",
    body: "Explanation of the risk and mitigation.",
  },
  // ... 3-5 risks recommended
],
```

### 8. Convert Next Steps

```typescript
nextSteps: [
  {
    step: 1,
    label: "Action item label",
    description: "What this step involves.",
  },
  // ... 3-5 steps recommended
],
```

### 9. Convert Closer

```typescript
closer: {
  observation: "The key takeaway statement.",
  body: "Final thoughts and context for what comes next.",
  reportUrl: "https://link-to-full-report.com",
},
```

---

## Tips

- **Keep headings concise** — they display as large text on each slide
- **Body text should be 1-3 sentences** — longer content hurts readability at presentation scale
- **Notes are optional** — only use them when extra context adds value
- **6 observations is the sweet spot** — fewer is fine, more than 8 makes navigation heavy
- **Test as you go** — run `pnpm dev` and check each slide renders correctly

---

## Switching Content

To use a different report, update the import in `components/presentation.tsx`:

```typescript
import { report } from "@/content/your-new-report";
```

Or set up dynamic routing to support multiple presentations.

---

## Example: Converting a Confluence Summary

**Input** (markdown export):
```markdown
# Conver Platform Review
> Strategic analysis of Datacom's AI platform capabilities

## 🎯 Context
### Growing demand for enterprise AI tools
Teams across Datacom need secure, scalable AI...

## 🔍 Problem
### Current tools lack centralised governance
Multiple teams using different AI tools creates...
```

**Output** (`content/conver-report.ts`):
```typescript
export const report = {
  title: "Conver Platform Review",
  subtitle: "Strategic analysis of Datacom's AI platform capabilities",
  date: "2026",
  author: { name: "Ben Schaumkel", avatarUrl: "", initials: "BS" },
  context: {
    heading: "Growing demand for enterprise AI tools",
    body: "Teams across Datacom need secure, scalable AI...",
  },
  problem: {
    heading: "Current tools lack centralised governance",
    body: "Multiple teams using different AI tools creates...",
  },
  // ... remaining sections
} as const;
```
