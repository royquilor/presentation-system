# Conver Analysis — Exhaustive Replication Guide

This document records every step taken to produce the Conver Business Analysis presentation, so the process can be replicated for any future documentation analysis project.

---

## Phase 1: Document Inventory & Access Setup

### 1.1 Locate source documents
- [x] Identified workspace path: `/Users/ben/Desktop/cursor-jira-confluence-sync/cursor-jira-sync/workspace/`
- [x] Found two document sets:
  - `conver-confluence/` — Full Confluence page exports (HTML→Markdown, includes metadata)
  - `conver-confluence-summarised/` — AI-summarised versions of each page
- [x] Counted local files: 47 markdown files + 1 INDEX.md in `conver-confluence-summarised/`
- [x] Verified each local file contains metadata: title, space, path, last updated date, author name, Confluence URL

### 1.2 Search Confluence for all pages mentioning "conver"
- [x] Used the Confluence CLI: `node bin/jira-cli.mjs conf-search "conver" --limit 300 --json`
- [x] Result: **117 pages** found across IA and GEA spaces
- [x] Saved full JSON to `/tmp/conver-confluence-pages.json`
- [x] Compared against local 47 files → 70 additional pages are peripheral (standups, meetings, infra)

### 1.3 Extract metadata from all local files
- [x] Ran Python script to extract from each `.md` file:
  - Slug (filename without .md)
  - Confluence URL (from `**Confluence URL:**` line)
  - Author name (from `**Last Updated:** ... by [name]` line)
- [x] Built a mapping: slug → {confluence_url, author, title}
- [x] Identified primary authors: Joe Thornley (business case, compliance, risks), Dipesh Trikam (architecture, integrations), Harrison Bland (knowledge hub, audit), Kieran Sinclair (QA, testing)

### 1.4 Verify read-only access
- [x] Confirmed: all Confluence access is read-only via the `conf-search` and `page-info` commands
- [x] No write commands were issued against Confluence at any point

---

## Phase 2: Data Extraction (Parallel Agents)

### 2.1 Split documents into three extraction batches
Divided 47 documents into three thematic groups for parallel processing:

**Batch A — ROI, Financial, Operational (8 files):**
- datacom-chat-business-case-production.md
- conver-prod-token-consumption-audit.md
- conver-backlog-snapshot-sept-2025.md
- conver-audit-phase-b-v1.md
- overview-hyperscaler-tcs-commercialising-conver.md
- conver-risk-review-nov-2025.md
- roadmap-draft.md
- conver-pilot-production-server-migration.md

**Batch B — Architecture, Security, Goals (10 files):**
- conver-knowledge-hub.md
- conver-platform-enterprise-architecture.md
- conver-platform-architecture-explained-simply.md
- conver-platform-redevelopment-guide.md
- conver-serverless-enterprise-architecture.md
- conver-playbook-for-certification.md
- pathway-to-security-and-compliance-for-conver.md
- practical-guide-using-conver-securely.md
- technical-operations-security-guide.md
- entra-id-permissions-request-for-conver.md

**Batch C — Integrations, QA, Features (29 files):**
- All Zendesk SITC files (7)
- All SPP/OpenAir files (4)
- All SharePoint proposals (2)
- All QA/testing files (9)
- All agent/feature files (7)

### 2.2 Extraction instructions per batch
Each batch was given structured extraction categories:
- **Batch A:** ROI & financial data, cost data, user/adoption metrics, risk severity data, timeline data
- **Batch B:** Business goals, strategic aims, architecture decisions, security findings, compliance requirements
- **Batch C:** Integrations (system, status, tool count), QA findings (bug, severity, status), features & capabilities (feature, status), model/AI data

### 2.3 Run extraction
- [x] Launched 3 parallel generalPurpose agents, each reading their batch from `conver-confluence-summarised/`
- [x] Each agent returned structured data in the prescribed format
- [x] Collected all results into working memory

---

## Phase 3: Data Verification

### 3.1 Cross-verify key figures against full Confluence exports
- [x] Read the FULL Confluence page exports (not summaries) for the 3 most critical files:
  - `datacom-chat-business-case-production.md` (full export)
  - `conver-risk-review-nov-2025.md` (full export)
  - `conver-prod-token-consumption-audit.md` (full export)
- [x] Verified each extracted data point against exact source text
- [x] Corrections found:
  - **FTE:** Was 2.5, actual is **4.0** (Product Mgmt & Dev 2.0, Support 0.5, Governance 2.0)
  - **Risk labels:** Source uses Likelihood/Impact, not "critical" severity labels
  - **All financial figures confirmed accurate:** $15.6M–$78M, $905K–$1,685K, 826%–10,314%, ~$35K infra, 6,500 users, >70% adoption, $50/user/month Copilot, $390K–$1.17M tokens, ~$9K pilot

### 3.2 Verify author attribution
- [x] Confirmed: Business case owned by Jason Moss & Joe Thornley, last updated by Joe Thornley
- [x] Set presentation author to "Joe Thornley & Jason Moss — Insights & Analytics"

### 3.3 Review newly discovered pages (70 additional)
- [x] Categorised the 70 extra pages: ~25-35% directly about Conver, ~15-20% operational (standups), ~25-30% broader ecosystem, ~15-20% peripheral
- [x] Determined: additional pages add operational context but no new quantified data
- [x] Decision: cite "117 Confluence pages mentioning Conver, 47 core documentation"

---

## Phase 4: Master Notes Document

### 4.1 Create structured notes
- [x] Created `content/conver-analysis-notes.md` with 10 sections:
  1. Executive Summary
  2. Business Goals (10 goals, each cited to source)
  3. Aims & Objectives (short/medium/long-term)
  4. ROI & Financial Analysis (revenue projections, cost structure, cost comparison table)
  5. Key Data Points (platform scale, token audit, integrations, feature maturity)
  6. Risks & Mitigation (7 production risks, QA issues, architectural risks)
  7. Security & Compliance (targets, 9 core policies, architecture decisions)
  8. Architecture Overview (current monolithic → target microservices, AI model portfolio)
  9. Timeline & Milestones (Apr 2025 → 2027 commercialisation)
  10. Source Document Index (47-row table with author, topics, Confluence URL for each)

### 4.2 Citation format
Each data point includes:
- The extracted information
- Source document name
- Confluence URL (hyperlinked in the final document)

---

## Phase 5: Data Visualizations

### 5.1 Chart design decisions
- All charts use Datacom brand colors (#002BFE Electric Blue, #00167F Admiral Blue, #000A14 Midnight)
- Charts are inline SVGs rendered in React — no external dependencies
- Responsive via SVG viewBox
- Accessible via `role="img"` and `aria-label`

### 5.2 Charts created (`components/charts.tsx`)
| Chart | Type | Data Source | Purpose |
|-------|------|-------------|---------|
| ROIBarChart | Vertical bar | Business case | Year-1 costs vs annual value (5 bars) |
| CostComparisonChart | Horizontal bar | Business case | Conver vs MS Copilot annual costs |
| FeatureMaturityPieChart | Donut | Multiple docs | Shipped/planned/blocked/POC breakdown |
| RiskSeverityScatter | Scatter plot | Risk review | 7 risks on Likelihood × Impact grid |
| TimelineChart | Timeline | Multiple docs | Milestones from pilot to commercialisation |
| ModelPortfolioChart | Horizontal bar | Token audit | 13 models across 4 providers |
| EfficiencyGainsChart | Horizontal bar | Business case | 3 productivity scenarios (1/3/5 hrs/week) |
| AdoptionGrowthChart | Vertical bar | Business case | Conversation volume growth by quarter |

### 5.3 Chart data mapping
For each chart:
1. Identified the exact data points from extracted notes
2. Verified figures against source documents
3. Chose appropriate chart type for the data relationship
4. Mapped values to pixel coordinates using scale functions
5. Applied Datacom brand colors from the design system

---

## Phase 6: Presentation Build

### 6.1 Analysis page (`app/analysis/page.tsx`)
- Created a custom Next.js page at `/analysis`
- Uses the same scroll-snap, keyboard navigation, and nav dots as the existing presentation system
- 18 slides total:
  1. Title (author, date, page count)
  2. Context (platform overview)
  3. Key Metrics (8 KPI cards)
  4. ROI (bar chart + citation)
  5. Cost Comparison (horizontal bar chart)
  6. Features (donut chart + detail)
  7. Models (bar chart + strategy)
  8. Risks (scatter plot)
  9. Risk Detail (4 highest-impact risks)
  10. Compliance (3-column programme cards)
  11. Architecture (current vs target comparison)
  12. Timeline (milestone chart + future dates)
  13. QA Findings (6 issues with severity badges)
  14. Next Steps (6 prioritised actions)
  15. Efficiency Gains (productivity scenarios chart)
  16. Adoption (growth chart + break-even + metrics)
  17. Citations (all 47 Confluence links with authors and slide references)
  18. Close (summary + source attribution)

### 6.2 Link styling
- Created `Cite` component for Confluence hyperlinks
- Style: inherits current text color, transparent underline by default
- On hover: underline becomes visible (foreground/40 opacity)
- Uses `transition-all duration-200` for smooth animation

### 6.3 Markdown presentation file
- Created `content/presentations/conver-analysis-presentation.md`
- Follows the existing markdown format (title, subtitle, date, source, sections with emoji prefixes)
- Parseable by the existing `lib/parse-markdown.ts` parser
- Available at `/p/conver-analysis-presentation`

---

## Phase 7: Speaker Notes & Documentation

### 7.1 Speaker notes (`content/conver-analysis-speaker-notes.md`)
- Slide-by-slide talking points
- Anticipated questions with prepared answers
- Supporting data not shown in the presentation
- File reference table

### 7.2 Master notes document (`content/conver-analysis-notes.md`)
- Complete findings with all citations
- 47-row source index with Confluence URLs
- Organised into 10 sections covering all extracted categories

---

## Phase 8: Quality Assurance

### 8.1 Build verification
- [x] Ran `pnpm build` — compiled successfully with 0 errors
- [x] All 53 routes generated (including `/analysis` and all `/p/[slug]` paths)

### 8.2 Visual verification
- [x] Loaded `/analysis` in browser
- [x] Verified title slide: correct author, page count, hyperlinks
- [x] Verified ROI slide: Confluence hyperlink citation, underline-on-hover
- [x] Verified Risk slide: "highest-impact" label (not "critical"), Confluence link
- [x] Verified Close slide: 117 page count with hyperlink
- [x] Verified all charts render with correct labels, data, and Datacom colors

### 8.3 Data accuracy
- [x] All financial figures verified against exact source text in full Confluence exports
- [x] FTE corrected from 2.5 to 4.0
- [x] Risk labels corrected to use source document's Likelihood/Impact terminology
- [x] All Confluence URLs tested (return HTTP 200)

---

## Tools & Commands Used

| Tool | Purpose |
|------|---------|
| `node bin/jira-cli.mjs conf-search "conver" --limit 300 --json` | Search Confluence for all pages mentioning "conver" |
| Python script (inline) | Extract metadata (URL, author) from local markdown files |
| `pnpm build` | Verify TypeScript compilation and Next.js static generation |
| `pnpm dev` | Local development server at localhost:3000 |
| `curl -s -o /dev/null -w "%{http_code}"` | Verify HTTP 200 responses |
| Browser verification agent | Visual regression testing of slides |

---

## File Manifest

| File | Purpose |
|------|---------|
| `app/analysis/page.tsx` | Analysis presentation (18 slides with charts and citations) |
| `components/charts.tsx` | 8 SVG chart components with Datacom branding |
| `content/conver-analysis-notes.md` | Master notes document with all findings and citations |
| `content/conver-analysis-speaker-notes.md` | Slide-by-slide speaker notes and Q&A guide |
| `content/presentations/conver-analysis-presentation.md` | Markdown version for the standard presentation system |
| `content/REPLICATION-GUIDE.md` | This file — step-by-step replication guide |

---

## Replication Checklist

To replicate this analysis for a different topic:

1. **Search Confluence:** `node bin/jira-cli.mjs conf-search "[topic]" --limit 300 --json`
2. **Fetch pages:** Use `scripts/fetch-conver-pages.mjs` as a template — update the PAGES array with the IDs from step 1
3. **Extract metadata:** Run the Python metadata extraction script against the downloaded `.md` files
4. **Batch extract data:** Split documents into 3 thematic batches, extract using structured categories (goals, risks, metrics, timelines)
5. **Verify figures:** Cross-check key numbers against the full Confluence page exports (not summaries)
6. **Create master notes:** Organise findings into sections with citations
7. **Design charts:** Identify 4–8 key data relationships, create SVG charts using Datacom brand colors
8. **Build presentation:** Create a Next.js page with scroll-snap slides, embed charts, add Confluence hyperlinks
9. **Create markdown version:** Write a `.md` file following the cheatsheet format for the standard presentation system
10. **QA:** Build, visual verify, cross-check data, test all links
