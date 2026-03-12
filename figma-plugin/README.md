# Datacom Presentation Content — Figma Plugin

Paste markdown or JSON presentation content into the plugin, select a Figma frame with named text layers, and the plugin duplicates the frame with your content replacing the text.

## How it works

1. **Paste content** — markdown (from Confluence summaries) or JSON (from `report.ts`)
2. **Parse** — the plugin extracts structured fields (title, subtitle, context.heading, etc.)
3. **Select a Figma frame** — your slide template with text layers named to match the fields
4. **Scan** — the plugin reads all text layers in the selected frame
5. **Apply** — the plugin duplicates the frame and replaces matched text layers with your content

## Setup

### Install in Figma

1. Open Figma Desktop
2. Go to **Plugins → Development → Import plugin from manifest...**
3. Select `figma-plugin/manifest.json` from this directory
4. The plugin appears under **Plugins → Development → Datacom Presentation Content**

### Build from source

```bash
cd figma-plugin
npm install
npm run build     # compiles code.ts → code.js
npm run watch     # auto-rebuild on changes
```

## Naming your Figma text layers

The plugin matches Figma text layer **names** to content fields. Name your layers using dot notation:

| Layer Name | Maps To |
|---|---|
| `title` | Report title |
| `subtitle` | Report subtitle |
| `author.name` | Author name |
| `date` | Date |
| `context.heading` | Context heading |
| `context.body` | Context body |
| `problem.heading` | Problem heading |
| `problem.body` | Problem body |
| `observations[0].title` | First observation title |
| `observations[0].body` | First observation body |
| `observations[1].title` | Second observation title |
| `proposal.heading` | Proposal heading |
| `proposal.body` | Proposal body |
| `proposal.summary` | Proposal summary |
| `risks[0].title` | First risk title |
| `risks[0].body` | First risk body |
| `nextSteps[0].label` | First next step label |
| `nextSteps[0].description` | First next step description |
| `closer.observation` | Closing observation |
| `closer.body` | Closing body |

Layer name matching is case-insensitive and ignores spaces/hyphens/underscores.

## Supported input formats

### JSON (recommended)

Paste the contents of a `report.ts` file (the object literal, without `export const report =` and `as const`):

```json
{
  "title": "Conver Business Case",
  "subtitle": "Full company-wide rollout to 6,500 employees.",
  "context": {
    "heading": "Conver completed a successful beta",
    "body": "Built on Azure with SSO and multi-model access."
  }
}
```

### Markdown

Paste markdown following the presentation structure:

```markdown
# Conver Business Case
> Full company-wide rollout to 6,500 employees.

## 🎯 Context
### Conver completed a successful beta
Built on Azure with SSO and multi-model access.

## 🔍 Problem
### Three problems demand an approved AI platform
Employees lack approved tools. Shadow AI creates risk.
```

## Creating a slide template in Figma

1. Create a Frame (e.g. 1920x1080 for presentation)
2. Add text layers and name them using the dot notation above
3. Style the text layers with your Datacom typography (Montserrat, correct weights)
4. Add any decorative elements, backgrounds, images
5. Select the frame and run the plugin
6. The plugin duplicates your template with content filled in

## Workflow for multiple slides

Each section of a presentation maps to one slide template. For a full presentation:

1. Create templates for: Title, Context, Problem, Observation, Proposal, Risks, Next Steps, Close
2. For each template, name text layers to match the corresponding section fields
3. Run the plugin on each template to generate content-filled copies
4. Arrange the copies in sequence for your presentation
