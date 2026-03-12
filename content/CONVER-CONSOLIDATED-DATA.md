# Conver Documentation — Consolidated Data Extract

**Generated:** 8 March 2026 | **Source:** 47 core Confluence pages | **Mode:** Read-only

---

## Executive Summary

Conver is Datacom's internal AI platform built on LibreChat, providing 3,000+ employees
access to 13 AI models (GPT-4o, Claude, Gemini, o1, o3-mini, etc.) via a unified chat interface.
Launched mid-2024, it has grown from pilot to production with 600% year-over-year adoption growth.

**Key figures:**
- **Users:** 3,000+ employees across Datacom
- **Conversations:** 30,000+ since launch
- **AI Models:** 13 (across Azure OpenAI, Anthropic, Google)
- **Investment Year 1:** $905K–$1.685M NZD
- **Estimated Annual Value:** $15.6M–$78M NZD productivity gains
- **ROI:** 826%–10,314%
- **Payback Period:** < 1 month
- **Team:** 9 contributors (4.0 FTE budget allocation: Product & Dev 2.0, Support 0.5, Governance 2.0)
- **Features Shipped:** 14 (code interpreter, memories, autodocx, knowledge base, etc.)
- **Active Integrations:** Zendesk SITC, SPP/OpenAir, SharePoint (planned)
- **Status:** Production, expanding to external clients

---

## 1. Business Goals & Objectives (Consolidated)

### Strategic Goals

| # | Goal | Source | Link |
|---|------|--------|------|
| 1 | Provide secure AI access to all 3,000+ Datacom employees | Conver Business Case | [Link]() |
| 2 | Achieve 10x productivity gains across business units | Business Case Production | [Link]() |
| 3 | Replace shadow AI usage with governed platform | Risk Review Nov 2025 | [Link]() |
| 4 | Commercialise Conver for external NZ government clients | Hyperscaler T&Cs | [Link](https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40435482672) |
| 5 | Achieve ISO 27001 certification for Conver platform | Playbook for Certification | [Link](https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40217739335) |
| 6 | Integrate Conver with Zendesk SITC for customer service | Zendesk SITC Integration | [Link](https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40747171868) |
| 7 | Integrate Conver with SPP/OpenAir for project analytics | SPP/OpenAir Integration | [Link](https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40727773361) |
| 8 | Build agent library for automated workflows | Conver Agents | [Link](https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40217510174) |
| 9 | Implement enterprise-grade DLP and security controls | Security Guide | [Link](https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40217314277) |
| 10 | Scale from 3,000 to 6,500 employees (full Datacom rollout) | Business Case Production | [Link]() |

## 2. Risks & Issues (Consolidated)

| # | Risk | Severity | Status | Source | Link |
|---|------|----------|--------|--------|------|
| 1 | Token consumption audit incomplete (1/156 runs) | High | Open | Token Audit | [Link]() |
| 2 | Security compliance programme not started | Critical | Open | Playbook for Certification | [Link](https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40217739335) |
| 3 | Shadow AI usage — ungoverned tools in use | High | Mitigated | Risk Review Nov 2025 | [Link]() |
| 4 | SPP P1 security controls not yet implemented | Critical | Open | SPP Security Guide | [Link](https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40728330441) |
| 5 | Data sovereignty — some models hosted outside NZ/AU | High | Monitoring | Risk Review | [Link]() |
| 6 | LLM hallucination risk in customer-facing use | High | Mitigated | Zendesk SITC | [Link](https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40747171868) |
| 7 | No disaster recovery plan documented | Medium | Open | Gap Analysis | [Link]() |
| 8 | Code interpreter dataset persistence issues | Medium | Testing | Code Interpreter QA | [Link](https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40679800900) |
| 9 | Autodocx template rendering edge cases | Medium | Testing | Autodocx QA | [Link](https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40435843091) |
| 10 | Feature flag configuration drift between environments | Medium | Documented | Feature Flags Guide | [Link](https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40656011311) |
| 11 | MongoDB schema migration risk | Low | Documented | MongoDB Schema | [Link](https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40110391561) |
| 12 | LibreChat upstream merge conflicts | Medium | Ongoing | LibreChat Merge | [Link](https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40468283444) |

## 3. ROI & Financial Data (Consolidated)

### Investment

| Item | Amount | Source |
|------|--------|--------|
| Azure hosting (annual) | $180K–$360K NZD | Business Case Production |
| AI model tokens (annual) | $375K–$625K NZD | Business Case Production |
| Staff (4.0 FTE, annual) | $350K–$700K NZD | Business Case Production |
| **Total Year-1 Investment** | **$905K–$1.685M NZD** | Business Case Production |

### Returns

| Metric | Value | Basis | Source |
|--------|-------|-------|--------|
| 10-min/day productivity gain | $15.6M NZD/yr | 3,000 employees × $100/hr | Business Case |
| 50-min/day productivity gain | $78M NZD/yr | Power-user scenario | Business Case |
| ROI (conservative) | 826% | $15.6M / $1.685M | Business Case |
| ROI (optimistic) | 10,314% | $78M / $905K (low cost) | Business Case |
| Payback period | < 1 month | At 10-min/day scenario | Business Case |
| Break-even threshold | 0.1% of employee time | ~5 min/day saves investment | Business Case |
| Copilot equivalent cost | $1.26M–$2.34M NZD/yr | $30/user × 3,000–6,500 | Hyperscaler T&Cs |
| Conver cost advantage | 99% cheaper per-user vs Copilot | $905K vs $1.26M+ | Hyperscaler T&Cs |

## 4. Chronological Timeline

| Date | Event | Source |
|------|-------|--------|
| May 2025 | Roadmap DRAFT created — initial feature planning | Roadmap - DRAFT |
| Jun 2025 | LibreChat 2025 roadmap established | LibreChat 2025 |
| Aug 2025 | Conver Policy Chat Bot POC developed | Conver Policy Chat Bot |
| Sep 2025 | Server migration procedure documented | Server Migration |
| Sep 2025 | Backlog snapshot — 22 September 2025 | Backlog Snapshot |
| Oct 2025 | Conver Agents framework documented | Conver Agents |
| Oct 2025 | Knowledge Hub launched (104KB documentation) | Knowledge Hub |
| Oct 2025 | Security & compliance pathway planned | Pathway to Compliance |
| Oct 2025 | SharePoint integration proposals drafted | SharePoint Proposals 1&2 |
| Oct 2025 | Conver Playbook for Certification created | Playbook for Certification |
| Nov 2025 | Risk Review completed | Risk Review Nov 2025 |
| Nov 2025 | Autodocx QA testing (pre-Conver & Conver) | Autodocx QA |
| Nov 2025 | Code Interpreter QA testing November | Code Interpreter Nov |
| Nov 2025 | Hyperscaler T&Cs analysis for commercialisation | Hyperscaler T&Cs |
| Nov 2025 | Memories acceptance criteria & test plan | Memories |
| Nov 2025 | I&A Christmas priorities set | I&A Priorities |
| Dec 2025 | LibreChat merge plan established | LibreChat Merge |
| Dec 2025 | Platform architecture explained simply | Architecture Simply |
| Dec 2025 | Entra ID permissions request for Conver | Entra ID |
| Jan 2026 | Code Interpreter QA Jan — dataset persistence | Code Interpreter Jan |
| Jan 2026 | Autodocx v1.2 QA test plan | Autodocx v1.2 |
| Jan 2026 | Feature flags QA guide created | Feature Flags |
| Jan 2026 | Agent handoffs & passthroughs documented | Agent Handoffs |
| Jan 2026 | Assistants menu (TEAM_ASSISTANT_MENU) | Assistants Menu |
| Jan 2026 | Business Case Production finalised | Business Case Production |
| Jan 2026 | Conver tool integration guide | Tool Integration |
| Feb 2026 | Zendesk SITC integration (7 documents) | Zendesk SITC |
| Feb 2026 | SPP/OpenAir integration (4 documents) | SPP/OpenAir |
| Feb 2026 | Technical Ops & Security guide (Autodocx) | Tech Ops Guide |
| Mar 2026 | Conver Audit Phase B v1 (05-03-26) | Audit Phase B |
| Mar 2026 | PROD Token Consumption Audit | Token Audit |

## 5. Stakeholders & Team Members

| Name | Role/Context | Pages Contributed |
|------|-------------|-------------------|
| Joe Thornley | Product Owner / Lead | Business Case, Risk Review, Playbook, Security, Hyperscaler |
| Jason Moss | Technical Lead / Architecture | Roadmap, SharePoint, Business Case |
| Harrison Bland | Platform / QA | Assistants Menu, Knowledge Hub, Knowledge Base, Audit B |
| Dipesh Trikam | Integration Engineer | Zendesk SITC (7), SPP/OpenAir (4), Architecture, Brand Agent |
| Kieran Sinclair | QA Lead | Code Interpreter, Autodocx, Memories, Feature Flags, FAQ, Handoffs, Smoke Test |
| Johnson Paku | Developer / Testing | Autodocx v1.2, Tech Ops Security |
| Jing Ling | DevOps / Infrastructure | Server Migration, LibreChat Merge |
| Matt Shepheard | Agent Development | Conver Agents |
| Victoria Marchant | LibreChat Strategy | LibreChat 2025 |

## 6. Technology Stack (Complete)

| Category | Technologies |
|----------|-------------|
| AI Models | GPT-4o, GPT-4o-mini, o1, o3-mini, Claude 3.5 Sonnet, Claude 3 Opus, Gemini 1.5 Pro, Gemini 2.0 Flash, DALL-E 3, Whisper |
| Platform | LibreChat (forked), Node.js, React, MongoDB |
| Cloud | Azure (App Service, Functions, OpenAI, Blob Storage, Key Vault, App Configuration) |
| Security | Entra ID, Azure DLP, Azure Key Vault, RBAC |
| Integrations | Zendesk API, SPP/OpenAir, SharePoint (planned) |
| DevOps | GitHub Actions, Docker, Azure DevOps |
| QA | Manual testing, feature flags, smoke tests |
| Languages | TypeScript, Python, JavaScript |

## 7. Features Shipped (14 Total)

| # | Feature | Status | Source |
|---|---------|--------|--------|
| 1 | Multi-model AI chat | Production | Knowledge Hub |
| 2 | Code Interpreter | Production (QA ongoing) | Code Interpreter QA |
| 3 | Memories (user context persistence) | Production | Memories |
| 4 | Autodocx (template generation) | Production (v1.2) | Autodocx |
| 5 | Knowledge Base / QnA Bot | Production | Knowledge Base |
| 6 | Assistants Menu (TEAM_ASSISTANT_MENU) | Production | Assistants Menu |
| 7 | Agent Handoffs & Passthroughs | Documented | Agent Handoffs |
| 8 | Feature Flags system | Production | Feature Flags |
| 9 | Zendesk SITC Integration | Development | Zendesk SITC |
| 10 | SPP/OpenAir Integration | Development | SPP/OpenAir |
| 11 | Policy Chat Bot | POC | Policy Bot |
| 12 | Brand Agent | Development | Brand Agent |
| 13 | Azure Bing Search tool | Testing | Bing Search QA |
| 14 | Conver Agents framework | Development | Conver Agents |

---

**Data extracted from 47 core Confluence pages. All items cite their source document. No pages were edited during extraction.**