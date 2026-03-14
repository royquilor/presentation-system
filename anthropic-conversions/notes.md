# Conversion Notes — Anthropic PDFs

## Working Log

### 2026-03-14 — Initial Analysis

**Source PDFs:**
1. 2026 Agentic Coding Trends Report (17 pages, ~8,500 words)
   - URL: https://resources.anthropic.com/hubfs/2026%20Agentic%20Coding%20Trends%20Report.pdf
   - Structure: Foreword + 3 trend categories (Foundation, Capability, Impact) containing 8 trends + Priorities
   - Visual style: Clean, minimal, Anthropic brand (coral/clay tones, serif-like headings)
   - Contains 2 diagrams (SDLC before/after, single vs multi-agent architecture)
   - No extractable images from text-only source — diagrams described in prose

2. The Complete Guide to Building Skills for Claude (32 pages, ~12,000 words)
   - URL: https://resources.anthropic.com/hubfs/The-Complete-Guide-to-Building-Skill-for-Claude.pdf
   - Structure: 6 chapters + 3 reference appendices
   - Heavy on code examples, YAML snippets, file structure diagrams
   - Tables comparing MCP vs Skills, testing approaches
   - No photographs — all content is text, code, and tables

**Parser extension completed:**
- Added FlexSection type to types.ts
- Parser now catches any `## [emoji] Title` not matching the 7 known sections
- Renderer creates per-item slides for flex sections with `**N. Title**` items
- Backward-compatible — existing presentations unaffected

**Key decisions:**
- Trends Report: Each of the 8 trends becomes its own flex section slide (## 📈)
- Skills Guide: Chapters mapped to a mix of standard + flex sections
- Case studies integrated inline within trend bodies (not separate slides)
- Code examples in Skills Guide summarised rather than reproduced verbatim
- Tables converted to prose or bullet-style observations for slide readability

**Content fidelity approach:**
- Every prediction bullet from the Trends Report preserved
- Every case study company mentioned with key metric
- Skills Guide: all 5 patterns, all troubleshooting items, full checklist
- YAML frontmatter rules summarised (not reproduced as code blocks — parser strips them)

### Build & Render Verification

- `next build` compiles cleanly (179 static pages including both new ones)
- `/p/anthropic-agentic-coding-2026` — HTTP 200, 14 slides
- `/p/anthropic-skills-guide` — HTTP 200, 19 slides
- Both appear in `/p` gallery with category "external"
- Gallery slide count calculator updated to include flex sections
- `external-reports/` directory added to both `[slug]/page.tsx` and gallery `page.tsx`

### Files Modified

| File | Change |
|------|--------|
| content/types.ts | Added FlexSection type + flexSections field on Report |
| lib/parse-markdown.ts | Flex section catch-all for unrecognised `## emoji` headers |
| components/dynamic-presentation.tsx | Renders flex sections as slides |
| app/p/[slug]/page.tsx | Added external-reports to PRESENTATIONS_DIRS |
| app/p/page.tsx | Added external-reports dir, category mapping, flex slide count |

### Files Created

| File | Purpose |
|------|--------|
| content/external-reports/anthropic-agentic-coding-2026.md | Trends Report presentation (14 slides) |
| content/external-reports/anthropic-skills-guide.md | Skills Guide presentation (19 slides) |
| anthropic-conversions/notes.md | This working log |
| anthropic-conversions/validation/section-mapping.md | PDF page → section mapping |
| anthropic-conversions/validation/slide-plan.md | Planned slide breakdown |
| anthropic-conversions/validation/completeness-checklist.md | Content coverage verification |
| anthropic-conversions/validation/final-validation-summary.md | Full validation report |
