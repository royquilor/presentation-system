# Conver Analysis — Presentation Guide & Speaker Notes

## How to Navigate

- **URL:** `http://localhost:3000/analysis`
- **Keyboard:** Arrow keys (Up/Down or Left/Right) to move between slides
- **Scroll:** Scroll to snap between slides
- **Navigation dots:** Click the dots on the right side to jump to any slide
- **15 slides total** — approximately 20–30 minutes at presentation pace

---

## Slide-by-Slide Notes

### 1. Title Slide
**Key talking points:**
- This analysis is based on a read-only review of 48 Confluence documents
- Covers business case, architecture, security, compliance, QA, and integrations
- All data is cited to specific source documents

### 2. Context
**Key talking points:**
- Conver is Datacom's own AI platform — not a third-party SaaS product
- Access to 13 models across 4 providers gives users the right tool for each task
- The Shadow AI problem is real — employees are using ChatGPT, Gemini etc. without controls
- Conver solves this by being "powerful enough to replace, secure enough to trust"

### 3. Key Metrics
**Key talking points:**
- 6,500 target users = entire Datacom workforce
- >800% ROI is the headline documented figure
- 13 AI models across Azure OpenAI, Google Gemini, Anthropic, AWS Bedrock
- 26 total features (shipped + planned + blocked + POC)
- $35K annual infrastructure is remarkably low
- 115+ DataScape agents are in the pipeline for integration

**Potential questions:**
- "How is the >800% ROI calculated?" → Based on productivity gains ($15.6M–$78M) vs Year-1 costs ($905K–$1.7M)
- "Why so many AI models?" → Different models excel at different tasks. Lightweight for quick queries, frontier for deep analysis.

### 4. ROI Analysis (Bar Chart)
**Key talking points:**
- The bar chart shows the dramatic gap between investment and potential return
- Even the conservative scenario ($15.6M) dwarfs the maximum Year-1 cost ($1.7M)
- Microsoft Copilot at $3.9M/year is shown for comparison
- ROI range: 826% (conservative) to 10,314% (optimistic)

**Data source:** datacom-chat-business-case-production.md (13 January 2026)

**Potential questions:**
- "Are these projections realistic?" → Based on documented pilot data (Apr–Jun 2025). The $15.6M figure is the conservative floor.
- "What drives the wide range?" → Depends on adoption rate and depth of usage across the 6,500-person workforce
- "How many people?" → 9 documented contributors across the Confluence documentation (budgeted as 4.0 FTE: Product Mgmt & Dev 2.0, Support & Monitoring 0.5, Product Mgmt & Governance 2.0)

### 5. Cost Comparison (Horizontal Bar Chart)
**Key talking points:**
- Infrastructure costs for 6,500 users: just $35K/year
- Conver Year-1 total (including team, tokens): $905K–$1.7M
- Microsoft Copilot for the same 6,500 users would cost ~$3.9M/year
- Token costs are charged back to business units — transparent, usage-based model
- 9 contributors, budgeted as 4.0 FTE: Product Mgmt & Dev 2.0, Support & Monitoring 0.5, Product Mgmt & Governance 2.0

**Potential questions:**
- "Why is infrastructure so cheap?" → Azure Container Apps with scale-to-zero. Only pay for what you use.
- "What's in the variable costs?" → Token consumption: $390K–$1.17M charged to business units based on usage

### 6. Platform Maturity (Donut Chart)
**Key talking points:**
- 14 of 26 features are shipped (54%)
- 10 features are planned on the roadmap
- Only 1 integration is blocked (SPP Insights — security gates)
- 1 POC (PolicyBot)
- Key shipped features: Zendesk + SITC (16 MCP tools), Code Interpreter, Autodocx, Memories, Agent Handoffs

**Potential questions:**
- "What's blocking SPP Insights?" → All P1 security controls unimplemented: Row-Level Security, Managed Identity, Key Vault, Private Endpoints
- "When will planned features ship?" → Depends on LibreChat partnership roadmap and internal prioritisation

### 7. AI Model Portfolio (Bar Chart)
**Key talking points:**
- Azure OpenAI dominates with 7 models (GPT-5, GPT-5.2, GPT-5-nano, GPT-4o, gpt-4.1, o3-mini)
- Google Gemini: 3 models (2.5 Flash, 2.5 Pro + 1 other)
- Anthropic: 1 direct model (Claude Sonnet 4)
- AWS Bedrock: 2 models
- Strategy: lightweight models for quick tasks, frontier for deep work

### 8. Risk Matrix (Scatter Plot)
**Key talking points:**
- 7 active production risks identified in November 2025 review
- 2 critical risks in the top-right zone: TLS certificates and public Azure exposure
- Dashed borders indicate risks blocked on Group Tech (4 of 7)
- "No Logging" is high-likelihood AND high-impact — significant blind spot
- The red-shaded zone represents the critical danger area

**Data source:** conver-risk-review-nov-2025.md (18 November 2025)

### 9. Risk Detail
**Key talking points:**
- Walk through each critical/high risk in order
- TLS: Manual renewal = outage risk. Must automate.
- Public Azure: Direct access bypasses WAF. Must close.
- No Logging: Can't detect or investigate incidents without centralised logging.
- Prod Access: Developers shouldn't have direct production access with full permissions.
- 4 of 7 risks are blocked on Group Tech — external dependency

**Potential questions:**
- "What's the mitigation for the public Azure exposure?" → Route all traffic through Cloudflare/Azure Front Door WAF. Requires Group Tech to close the public endpoint.
- "When will these be resolved?" → Blocked on Group Tech. No timeline provided in documentation.

### 10. Compliance Pathway
**Key talking points:**
- 90-day structured programme: Foundation → Implementation → Audit Readiness
- ISO 27001 first, then SOC 2 Type 1 and Type 2
- 9 core policies required (ISMS Manual through Privacy)
- AI-specific overlays: OWASP Top 10 for LLM Apps, ISO/IEC 23894
- Vanta integration for automated evidence collection
- Compliance is the key enabler for commercialisation and government deployment

**Potential questions:**
- "Is 90 days realistic?" → Documented as achievable with dedicated effort. Foundation is weeks 1–4, implementation weeks 5–8, audit readiness weeks 9–12.
- "What about NZ Privacy Act?" → Applicable if PII is processed. DPIA required. Mapped to ISO/SOC 2 controls.

### 11. Architecture
**Key talking points:**
- Current state is monolithic: single point of failure, no API gateway, basic auth, no network isolation
- Target state: microservices on Azure Container Apps with scale-to-zero
- Azure Front Door WAF v2 with OWASP 3.2 rules
- Zero Trust model, Entra ID SSO/2FA
- Private VNet with geo-filtering (AU/NZ only) for data sovereignty
- Trunk-based development, daily deployments, feature flags

**Potential questions:**
- "What's the migration timeline?" → Four-phase roadmap documented: Foundation → API Management → Integration → Production
- "Why not Kubernetes?" → Serverless Azure Container Apps provides automatic scaling without the operational overhead

### 12. Timeline
**Key talking points:**
- Walk through the timeline from pilot (April 2025) to present
- All past milestones achieved (shown with checkmarks)
- Full rollout Q2 2026 — depends on budget approval
- ISO 27001 Q3 2026 — the 90-day programme
- External commercialisation 2027 — requires certification first

### 13. QA Findings
**Key talking points:**
- 28+ issues identified across the platform
- Code Interpreter: data fabrication in multi-turn conversations is the most concerning
- Memories: context isolation failure means project data can bleed into unrelated chats
- SPP Insights has critical unimplemented security controls
- Testing infrastructure is comprehensive (smoke tests, QA test plans, acceptance criteria) — but issues persist

**Potential questions:**
- "Is Code Interpreter safe to use?" → For single-turn analysis, yes. Multi-turn sessions with data recall should be verified manually.
- "What about the authentication bypass?" → LibreChat email case-sensitivity issue. Fix is in the merge plan.

### 14. Next Steps
**Key talking points:**
- Walk through the 6 priority actions in order
- 1 and 2 are immediate (risks + budget)
- 3 is in progress (token audit, 155 runs outstanding)
- 4 is the strategic enabler (compliance)
- 5 and 6 are quality gates (QA bugs, SPP security)

### 15. Close
**Key talking points:**
- High-ROI platform with strong foundations
- Three gates to full potential: risk resolution, compliance, QA maturity
- The analysis is comprehensive — 48 documents reviewed
- Full notes available in content/conver-analysis-notes.md

---

## Supporting Data Not in Presentation

### Token Consumption Audit
- 156 planned runs: 13 models × 6 scenarios × 2 repeats
- Only 1 of 156 completed at time of writing (6 March 2026)
- 6 investigation areas mapped to Jira
- Ticket: DAAAT-485

### Integration Details
- Zendesk: 7 read-only endpoints (ticket, comments, search, recent, user, org, org tickets)
- SITC: 8 read-only endpoints (quotes, products, accounts, sales orders) with OData filtering
- MCP server: POST /mcp (Streamable HTTP), GET /healthz, GET /readyz
- Stack: Python 3.12, FastMCP, Docker, port 8003

### Delivery Transformation Targets
- PR merge time < 24 hours
- Zero long-lived branches
- Feature flag cleanup within 8 weeks
- Daily deployment frequency
- Change failure rate < 5%

### Models Used in QA Testing
- GPT-5.2: Code Interpreter dataset persistence
- GPT-5: Multi-file merge (good performance)
- Gemini 2.5 Flash: Data cleaning (missed column)
- Gemini 2.5 Pro: Failed merge tool initiation
- Claude Sonnet 4: 3 tool calls for merge

---

## Files Reference

| File | Description |
|------|-------------|
| `content/conver-analysis-notes.md` | Complete master notes with all findings and citations |
| `content/conver-analysis-speaker-notes.md` | This file — presentation guide |
| `app/analysis/page.tsx` | Analysis presentation page |
| `components/charts.tsx` | SVG chart components (bar, pie, scatter, timeline) |
