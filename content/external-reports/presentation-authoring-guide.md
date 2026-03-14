# Presentation Authoring Guide

> How to create markdown-driven presentations in the Datacom system

**Author:** Datacom Design
**Date:** March 2026
**Source:** Internal

---

## 🎯 Context

<!-- bg: gradient #0f0c29 #302b63 135deg -->
<!-- text: #f0f0f0 -->

What this system is

This presentation system turns simple markdown files into interactive, scrollable slide decks. Each `.md` file placed in the `content/` directories becomes a full presentation, accessible at `/p/your-file-name`. The system parses your markdown into structured sections, each rendered as a full-screen slide with keyboard navigation and scroll-snap behaviour. You are reading a presentation built entirely from markdown right now.

---

## 🔍 Problem

Why you need this guide

The markdown format has specific rules that aren't obvious from looking at the output. Paragraphs must be at least 30 characters long. Section headers need the right emoji prefix. Images, gradients, and background colours use a special HTML comment syntax invisible in normal markdown editors. This guide walks through every feature so you can author presentations confidently without trial and error.

---

## 📋 Observations

**1. Standard Section Types**

The system recognises seven built-in section types, each triggered by a specific emoji or keyword in the `## heading`. Context uses `## 🎯`, Problem uses `## 🔍`, Observations use `## 📋`, Proposal uses `## 💡`, Risks use `## ⚠️`, Next Steps use `## ✅`, and Close uses `## 🔑`. Each section renders with its own slide layout and label.

**2. Flex Sections for Custom Content**

Any `## heading` that doesn't match a built-in type becomes a "flex section". Use any emoji you like — `## 📈 Trends`, `## 🧪 Experiments`, `## 🎨 Design Notes` — and the system will render it as a labelled slide. Numbered items inside a flex section (using `**1. Title**` format) each become their own slide, ideal for lists of findings or trends.

**3. Paragraph Rules**

Every paragraph in your markdown must be at least 30 characters long. Separate paragraphs with a blank line (double newline). Short lines will be combined by the parser. If you have a short phrase, expand it with context or combine it with the next sentence. This ensures every slide has meaningful, readable content.

**4. Adding Images to Slides**

Place an image on its own line using standard markdown syntax: `![Description of the image](./path/to/image.png)`. The image will be rendered below the slide content. Use relative paths from the markdown file location, or absolute URLs for external images. Each image line becomes a media element on the current section's slide.

**5. Gradient and Background Styling**

You can style any slide's background using invisible HTML comments placed right after the section header. The comment `<!-- bg: gradient #0f0c29 #302b63 135deg -->` creates a purple gradient. Use `<!-- bg: solid #1a1a2e -->` for a flat colour. Use `<!-- text: #ffffff -->` to override all text on that slide to white. These comments are invisible in standard markdown editors.

**6. Folder Placement and URL Routing**

Drop your `.md` file into one of the content directories: `content/presentations/` for internal reports, or `content/external-reports/` for external content. The filename (minus `.md`) becomes the URL slug. A file named `quarterly-review.md` in `content/presentations/` is viewable at `/p/quarterly-review`. The gallery page automatically discovers and lists all presentations.

---

## 💡 Proposal

<!-- bg: gradient #000428 #004e92 135deg -->
<!-- text: #e0e8f0 -->

Create your first presentation in five steps

- Open a new `.md` file in the appropriate content directory
- Add a title with `# Your Title`, a subtitle with `> Your subtitle`, and metadata lines for Author, Date, and Source
- Write your content using `## emoji Section Name` headers, separated by `---` between sections
- Add background styles with HTML comments after any section header you want to customise
- Run `pnpm dev` and open `http://localhost:3000/p/your-file-name` to see it live — the browser refreshes on every save

*Save the file and watch the browser update instantly with your changes.*

---

## ⚠️ Risks

**Paragraphs under 30 characters** — The parser may skip or merge very short lines. Always write complete sentences and check that standalone lines meet the minimum length.

**Missing `---` separators** — Without horizontal rules between sections, the parser can merge content from adjacent sections. Always separate your `## heading` blocks with a `---` line.

**Wrong emoji for built-in types** — Using `## 🎯 My Custom Section` will be captured as a Context section, not a flex section. If you want a custom section, avoid the seven reserved emojis (🎯 🔍 📋 💡 ⚠️ ✅ 🔑) or the keywords Context, Problem, Observation, Proposal, Risk, Next Steps, Close.

**Image paths** — Relative image paths resolve from the public directory or the markdown file location. If an image doesn't appear, check the path is correct and the file exists in the expected location.

---

## ✅ Next Steps

1. **Copy the starter template** — Scroll to the Close slide for a ready-to-paste markdown template that includes all section types.

2. **Run the dev server** — Execute `pnpm dev` in the project root to start the Next.js development server with hot reload.

3. **Open your presentation** — Navigate to `http://localhost:3000/p/your-file-name` in your browser to see the live preview.

4. **Experiment with styles** — Try adding `<!-- bg: gradient #16130f #2a2318 135deg -->` and `<!-- text: #f5f0eb -->` after a section header to see warm dark styling in action.

5. **Check the gallery** — Visit `http://localhost:3000/p` to see your presentation listed alongside all others, filterable by category tab.

---

## 🔑 Close

<!-- bg: gradient #000A14 #00167F 135deg -->
<!-- text: #ffffff -->

> Start with markdown, end with a polished presentation.

Copy the template below into a new `.md` file to get started. Replace the placeholder content with your own, add background styles where you want visual emphasis, and let the system handle the rest. The title block needs `# Title`, `> Subtitle`, `**Author:**`, `**Date:**`, and `**Source:**`. Then write your sections with `## emoji Heading`, separate them with `---`, and you have a complete presentation.

