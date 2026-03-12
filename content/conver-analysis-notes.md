# Conver Platform — Comprehensive Analysis & Findings

**Primary Authors:** Joe Thornley & Jason Moss — Insights & Analytics
**Date:** 8 March 2026
**Scope:** All Conver Confluence documentation (117 pages mentioning Conver, 47 core documentation — read-only review)
**Access date:** 8 March 2026
**Confluence Space:** [Insights & Analytics (IA)](https://datacomgroup.atlassian.net/wiki/spaces/IA)

---

## Executive Summary

Conver is Datacom's enterprise AI platform, built to provide all 6,500 employees with secure, governed access to multiple leading AI models. The platform is positioned as the foundation of Datacom's AI strategy — replacing external Shadow AI tools with a controlled internal alternative.

The business case projects annual productivity gains of **$15.6M–$78M NZD** against Year-1 costs of **$905K–$1,685K**, yielding an ROI of **826%–10,314%**. Infrastructure costs are remarkably low (~$35K/year) compared to alternatives like Microsoft Copilot ($3.9M/year for the same user base). The platform was built and is operated by 9 documented contributors (budgeted as 4.0 FTE).

The platform has shipped 14+ features and integrations (Zendesk, SITC, Code Interpreter, Autodocx, Memories, FAQ/QnA, Brand Agent, and more) with 10+ planned features on the roadmap. However, 7 active production risks were identified (2 critical), and the SPP Insights integration is blocked by unimplemented security controls.

A clear path to ISO 27001 and SOC 2 certification has been documented, with a 90-day structured programme covering foundation, implementation, and audit readiness phases.

---

## 1. Business Goals

| # | Goal | Source |
|---|------|--------|
| 1 | Provide all 6,500 employees with enterprise-grade access to multiple leading AI models through a secure, user-friendly interface | conver-knowledge-hub.md |
| 2 | Establish Conver as the foundation of Datacom's AI strategy | conver-knowledge-hub.md |
| 3 | Unlock AI productivity gains while staying within Datacom's security and compliance boundaries | conver-knowledge-hub.md |
| 4 | Replace external AI tools (Shadow AI) with a controlled internal alternative | conver-knowledge-hub.md |
| 5 | Solve brand compliance through an AI-driven brand compliance system built into the platform | conver-platform-enterprise-architecture.md |
| 6 | Achieve Azure WAF A+ grade while enabling independent scaling of each platform component | conver-platform-redevelopment-guide.md |
| 7 | Transform delivery from risky, infrequent releases to safe, daily deployments with instant rollback | conver-serverless-enterprise-architecture.md |
| 8 | Position Conver for external commercialisation and enterprise customer deployment | conver-playbook-for-certification.md |
| 9 | Enable deployment in regulated environments (government clients, ISO 27001, SOC 2) | pathway-to-security-and-compliance-for-conver.md |
| 10 | Align with Datacom's enterprise identity management via Entra ID | entra-id-permissions-request-for-conver.md |

---

## 2. Aims & Objectives

### Short-Term
- Complete mandatory AI compliance training for all users (access revoked for non-compliance) — Source: conver-knowledge-hub.md
- Achieve >70% active user adoption across 6,500 employees — Source: datacom-chat-business-case-production.md
- Full production rollout within 3–6 months of budget approval — Source: datacom-chat-business-case-production.md
- Implement trunk-based development: PR merge time <24 hours, zero long-lived branches — Source: conver-serverless-enterprise-architecture.md
- Feature flag cleanup within 8 weeks, daily deployment frequency, change failure rate <5% — Source: conver-serverless-enterprise-architecture.md

### Medium-Term
- Five-week delivery transformation: Week 1 (feature flags) → Week 2 (CI/CD) → Week 3 (branch cleanup) → Week 4 (auto-deploy) → Week 5+ (metrics) — Source: conver-serverless-enterprise-architecture.md
- 90-day compliance programme: Foundation (Weeks 1–4) → Implementation (Weeks 5–8) → Audit Readiness (Weeks 9–12) — Source: pathway-to-security-and-compliance-for-conver.md
- Integrate Conver into Vanta for automated evidence collection — Source: pathway-to-security-and-compliance-for-conver.md
- Deploy to Australia East with Azure Front Door WAF — Source: conver-platform-enterprise-architecture.md

### Long-Term
- ISO 27001 certification followed by SOC 2 Type 1 and Type 2 — Source: conver-playbook-for-certification.md
- External commercialisation for regulated industries and government — Source: conver-playbook-for-certification.md
- Integrate 115+ DataScape agents into Conver — Source: conver-backlog-snapshot-sept-2025.md

---

## 3. ROI & Financial Analysis

### Revenue/Value Projections
| Metric | Value | Source |
|--------|-------|--------|
| Annual productivity gains (conservative) | $15.6M NZD | datacom-chat-business-case-production.md |
| Annual productivity gains (optimistic) | $78M NZD | datacom-chat-business-case-production.md |
| ROI range | 826% – 10,314% | datacom-chat-business-case-production.md |
| Documented ROI (headline) | >800% | datacom-chat-business-case-production.md |

### Cost Structure
| Item | Value | Source |
|------|-------|--------|
| Year-1 total costs | $905K – $1,685K NZD | datacom-chat-business-case-production.md |
| Fixed infrastructure (6,500 users) | ~$35K/year | datacom-chat-business-case-production.md |
| Variable token consumption | $390K – $1,170K (charged back to BUs) | datacom-chat-business-case-production.md |
| Pilot infrastructure (Apr–Jun 2025) | ~$9K annualised | datacom-chat-business-case-production.md |
| Chatbot Ops team | 4.0 FTE (Product Mgmt & Dev 2.0, Support & Monitoring 0.5, Product Mgmt & Governance 2.0) | datacom-chat-business-case-production.md |

### Cost Comparison
| Platform | Annual Cost (6,500 users) | Source |
|----------|--------------------------|--------|
| Conver (Year 1) | $905K – $1,685K | datacom-chat-business-case-production.md |
| Microsoft Copilot | ~$3,900,000 ($50/user/month × 6,500) | datacom-chat-business-case-production.md |

---

## 4. Key Data Points

### Platform Scale
| Metric | Value | Source |
|--------|-------|--------|
| Organisation size | 6,500 employees | datacom-chat-business-case-production.md |
| Target user base | 6,500 (full rollout) | datacom-chat-business-case-production.md |
| Target adoption rate | >70% active users | datacom-chat-business-case-production.md |
| AI models in production | 13 (Azure OpenAI 7, Gemini 3, Anthropic 1, Bedrock 2) | conver-prod-token-consumption-audit.md |
| DataScape agents to integrate | 115+ | conver-backlog-snapshot-sept-2025.md |
| Rollout timeframe | 3–6 months from approval | datacom-chat-business-case-production.md |

### Token Consumption Audit
| Metric | Value | Source |
|--------|-------|--------|
| Planned audit runs | 156 (13 models × 6 scenarios × 2 repeats) | conver-prod-token-consumption-audit.md |
| Test scenarios | 6 (baseline, multi-turn, long prompt, tool call, streaming, abort) | conver-prod-token-consumption-audit.md |
| Investigation areas | 6 (mapped to Jira) | conver-prod-token-consumption-audit.md |
| Audit phases | 4 (B local/dev, C QA replication, D pre-prod, E remediation) | conver-prod-token-consumption-audit.md |
| Completed runs at time of writing | 1 of 156 | conver-audit-phase-b-v1.md |

### Integrations & Features
| Integration | Status | Tool Count | Source |
|------------|--------|------------|--------|
| Zendesk Support | Production | 7 tools | zendesk-sitc-conver-integration.md |
| Stock in the Channel (SITC) | Production | 9 tools | zendesk-sitc-conver-integration.md |
| SPP Insights / OpenAir | Blocked (security) | NL-to-SQL | spp-insights-governance-summary.md |
| SharePoint | Design / proposal | Scoped agent tools | sharepoint-conver-integration-design-proposal-1.md |
| Brand Agent | Shipped | 3 operations | conver-tool-integration-guide.md |
| PolicyBot | POC | RAG pipeline | conver-policy-chat-bot-poc.md |
| SOW Generator | Shipped | — | conver-assistants-menu.md |

### Feature Maturity Summary
| Status | Count | Examples |
|--------|-------|---------|
| Shipped | 14 | Zendesk, SITC, Code Interpreter, Autodocx V1 & V2, Memories, FAQ/QnA, Agent Handoffs, Brand Agent, Feature Flags, Assistants Menu, SOW Generator |
| Planned | 10 | SharePoint ×2, Admin Panel, Agent Marketplace, Teams/Groups, MCP Resources, User Memories, RAG API, Admin UI, Retention |
| Blocked | 1 | SPP Insights (all P1 security controls unimplemented) |
| POC | 1 | PolicyBot |

---

## 5. Risks & Mitigation

### Production Risks (7 active — November 2025 review)
| # | Risk | Severity | Status | Source |
|---|------|----------|--------|--------|
| 1 | TLS certificate renewal not automated | Critical | Blocked on Group Tech | conver-risk-review-nov-2025.md |
| 2 | Azure host publicly exposed, bypassing Cloudflare | Critical | Blocked on Group Tech | conver-risk-review-nov-2025.md |
| 3 | No Infrastructure-as-Code, manual deployments | Medium | Depends on platform readiness | conver-risk-review-nov-2025.md |
| 4 | Vulnerability alerts not fully actioned | High likelihood / Low impact | Actively remediating via Aikido | conver-risk-review-nov-2025.md |
| 5 | No centralised logging or monitoring | High likelihood / High impact | Blocked on Group Tech and CDOC | conver-risk-review-nov-2025.md |
| 6 | Sensitive data lacks adequate controls | Medium | Partially mitigated | conver-risk-review-nov-2025.md |
| 7 | Developers have direct production access with over-provisioned permissions | Medium likelihood / High impact | Blocked on Group Tech | conver-risk-review-nov-2025.md |

### QA/Technical Issues (Key Bugs)
| Issue | Severity | Source |
|-------|----------|--------|
| Code Interpreter: Multi-turn data drift / fabrication | High | conver-code-interpreter-qa-jan-2026.md |
| Code Interpreter: Generated dataset recall fails (structure preserved, content fabricated) | High | conver-code-interpreter-qa-jan-2026.md |
| Autodocx V2: Approval loop inconsistently triggered; skips gap-filling | High | autodocx-v1-2-conver-qa-test-plan.md |
| Memories: Context isolation failure — project memory bleeds into unrelated conversations | High | conver-memories-acceptance-criteria-test-plan.md |
| SPP Insights: All P1 security controls unimplemented (RLS, Managed Identity, Key Vault, Private Endpoints) | Critical | spp-insights-governance-summary.md |
| Code Interpreter: CSV download link generation broken | P1 blocker | conver-code-interpreter-qa-nov-2025.md |
| LibreChat: Email case-sensitivity authentication bypass | Security | librechat-changes-merge-plan-for-conver.md |

### Architectural Risks
| Risk | Source |
|------|--------|
| LLM-specific controls gap — ISO/SOC frameworks don't address prompt injection, model supply chain | conver-playbook-for-certification.md |
| Privacy exposure — PII in prompts/logs without DPIA | conver-playbook-for-certification.md |
| Current monolithic architecture: single point of failure, no API gateway, basic auth only, no network isolation | conver-platform-redevelopment-guide.md |
| Container cold start latency (5–30 seconds) | conver-platform-enterprise-architecture.md |
| Cultural resistance to trunk-based development | conver-serverless-enterprise-architecture.md |

---

## 6. Security & Compliance

### Compliance Targets
| Standard | Status | Source |
|----------|--------|--------|
| ISO 27001 (formal ISMS) | Planned — 90-day programme | conver-playbook-for-certification.md |
| SOC 2 Type 1 & Type 2 | Planned — follows ISO 27001 | conver-playbook-for-certification.md |
| Azure WAF A+ Grade | Target | conver-platform-enterprise-architecture.md |
| NZ Privacy Act 2020 | Applicable (DPIA required) | conver-playbook-for-certification.md |
| OWASP Top 10 for LLM Apps | AI-specific overlay | conver-playbook-for-certification.md |
| ISO/IEC 23894 | AI risk management | conver-playbook-for-certification.md |

### Nine Core Policies Required
1. ISMS Manual
2. Access Control
3. Secure SDLC
4. Logging & Incident Response
5. Vendor Due Diligence
6. Data Governance
7. Cryptography
8. Business Continuity Plan
9. Privacy

Source: conver-playbook-for-certification.md

### Security Architecture Decisions
| Decision | Rationale | Source |
|----------|-----------|--------|
| Zero Trust model throughout | Enterprise security standard | conver-platform-enterprise-architecture.md |
| Network isolation (private VNet 10.0.0.0/16) | No backend publicly accessible | conver-platform-enterprise-architecture.md |
| Geo-filtering AU/NZ only | Data sovereignty | conver-platform-enterprise-architecture.md |
| Managed Identity (eliminates secrets from code) | Secret rotation risk | conver-platform-enterprise-architecture.md |
| Azure Front Door WAF v2 as sole public entry point | Defence in depth | conver-platform-enterprise-architecture.md |
| Build-once, promote-the-same-image strategy | Dev → QA → UAT → Prod | conver-serverless-enterprise-architecture.md |
| Blob lifecycle 24-hour retention | Data minimisation | technical-operations-security-guide.md |
| Least-privilege Entra ID (read-only) | Minimal attack surface | entra-id-permissions-request-for-conver.md |

---

## 7. Architecture Overview

### Current State (Monolithic)
- Single point of failure
- No API gateway
- Basic auth only
- No network isolation
- Source: conver-platform-redevelopment-guide.md

### Target State (Microservices)
- **Frontend:** React UI in Azure Container Apps
- **API Gateway:** Node.js with OAuth 2.0/JWT validation, rate limiting, logging
- **AI Services:** Python Brand Agent MCP, Azure OpenAI, multi-model access
- **Storage:** Azure Blob Storage, MongoDB, VectorDB
- **Security:** Azure Front Door WAF v2, Entra ID SSO/2FA, private VNet
- **Deployment:** Serverless Azure Container Apps, scale-to-zero, trunk-based dev, feature flags
- Source: conver-platform-enterprise-architecture.md, conver-platform-redevelopment-guide.md, conver-serverless-enterprise-architecture.md

### AI Model Portfolio
| Provider | Models | Count | Source |
|----------|--------|-------|--------|
| Azure OpenAI | GPT-5, GPT-5.2, GPT-5-nano, GPT-4o, gpt-4.1, o3-mini + others | 7 | conver-prod-token-consumption-audit.md |
| Google | Gemini 2.5 Flash, Gemini 2.5 Pro + 1 other | 3 | conver-prod-token-consumption-audit.md |
| Anthropic | Claude Sonnet 4 (+ claude-3-5-haiku, claude-3-7-sonnet in KB guidance) | 1 direct | conver-prod-token-consumption-audit.md |
| AWS Bedrock | 2 models | 2 | conver-prod-token-consumption-audit.md |

---

## 8. Timeline & Milestones

| Date | Milestone | Source |
|------|-----------|--------|
| Apr–Jun 2025 | Pilot period (Azure billing data captured) | datacom-chat-business-case-production.md |
| 30 May 2025 | Roadmap draft published | roadmap-draft.md |
| 8 Sep 2025 | Pilot → production server migration | conver-pilot-production-server-migration.md |
| 22 Sep 2025 | Backlog snapshot captured | conver-backlog-snapshot-sept-2025.md |
| 18 Nov 2025 | Production risk review (7 active risks) | conver-risk-review-nov-2025.md |
| 21 Nov 2025 | Hyperscaler T&Cs overview | overview-hyperscaler-tcs-commercialising-conver.md |
| 13 Jan 2026 | Business case for production documented | datacom-chat-business-case-production.md |
| 4 Mar 2026 | Token consumption audit initiated | conver-prod-token-consumption-audit.md |
| 6 Mar 2026 | Audit Phase B commenced | conver-audit-phase-b-v1.md |
| TBD (3–6 months after approval) | Full production rollout to 6,500 users | datacom-chat-business-case-production.md |

---

## 9. Additional Insights

### Shadow AI Problem
The business case identifies Shadow AI as a critical risk — employees using uncontrolled external AI tools. Conver solves this by being "powerful enough to replace external tools, secure enough to trust with company data." This is both a productivity play and a risk mitigation strategy.

### Cost Efficiency
Conver's infrastructure cost (~$35K/year for 6,500 users) is two orders of magnitude cheaper than Microsoft Copilot (~$3.9M/year). The variable cost (token consumption) is charged back to business units, creating a transparent, usage-based model.

### Compliance as Enabler
The compliance programme (ISO 27001, SOC 2) is not just defensive — it's the key enabler for commercialisation. Without certification, Conver cannot be sold to government clients or used in regulated industries.

### Technical Debt
The platform is transitioning from a monolithic architecture to microservices. 3 of 7 production risks are blocked on Group Tech, indicating external dependencies that could slow resolution. The token consumption audit (156 planned runs, 1 completed) suggests significant validation work remains.

### QA Maturity
28+ bugs/issues identified across the platform, with several high-severity items in Code Interpreter (data fabrication, multi-turn drift) and Memories (context isolation failure). The testing infrastructure is comprehensive (smoke tests, acceptance criteria, QA test plans) but issues persist in production features.

---

## 10. Source Document Index (47 Core Pages)

| # | Document | Author | Key Topics | Confluence URL |
|---|----------|--------|-----------|----------------|
| 1 | Datacom Chat Business Case Production | Joe Thornley | ROI, costs, user metrics, business case | [Link](https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/39929380876) |
| 2 | Conver PROD Token Consumption Audit | Harrison Bland | Token costs, model audit, investigation areas | [Link](https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40842133509) |
| 3 | Conver Backlog Snapshot Sept 2025 | Joe Thornley | Backlog priorities, DataScape agents | [Link](https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40166228081) |
| 4 | Conver Audit Phase B v1 | Harrison Bland | Audit methodology, variance data | [Link](https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40850227234) |
| 5 | Overview Hyperscaler T&Cs Commercialising Conver | Joe Thornley | Commercialisation, hyperscaler terms | [Link](https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40435482672) |
| 6 | Conver Risk Review November 2025 | Joe Thornley | 7 production risks, severity, blockers | [Link](https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40415953243) |
| 7 | Roadmap Draft | Jason Moss | Feature roadmap, timeline | [Link](https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/39636010283) |
| 8 | Conver Pilot Production Server Migration | Jing Ling | Migration procedure, staging | [Link](https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40087617783) |
| 9 | Conver Knowledge Hub | Harrison Bland | Platform overview, adoption goals | [Link](https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40110391561) |
| 10 | Conver Platform Enterprise Architecture | Dipesh Trikam | Architecture, security, Azure WAF | [Link](https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40533983331) |
| 11 | Conver Platform Architecture Explained Simply | Dipesh Trikam | Non-technical architecture guide | [Link](https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40533950601) |
| 12 | Conver Platform Redevelopment Guide | Dipesh Trikam | Monolith → microservices, API management | [Link](https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40533688413) |
| 13 | Conver Serverless Enterprise Architecture | Dipesh Trikam | Serverless, trunk-based dev, feature flags | [Link](https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40486469753) |
| 14 | Conver Playbook for Certification | Joe Thornley | ISO 27001, SOC 2, compliance programme | [Link](https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40217739335) |
| 15 | Pathway to Security and Compliance for Conver | Joe Thornley | 90-day compliance programme | [Link](https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40217313800) |
| 16 | A Practical Guide to Using Conver Securely | Joe Thornley | User security guide, GCSE framework | [Link](https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40217314277) |
| 17 | Technical Operations and Security Guide | Johnson Paku | DevOps security, blob lifecycle | [Link](https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40777154594) |
| 18 | Entra ID Permissions Request for Conver | Dipesh Trikam | Entra ID, permissions, group sync | [Link](https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40549122066) |
| 19 | Zendesk SITC Conver Integration | Dipesh Trikam | Zendesk + SITC integration | [Link](https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40747171868) |
| 20 | Architecture Conver Zendesk SITC Integration | Dipesh Trikam | Integration architecture | [Link](https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40745926879) |
| 21 | API Reference Zendesk SITC | Dipesh Trikam | API endpoints, auth methods | [Link](https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40746975437) |
| 22 | Zendesk SITC Access Control Security | Dipesh Trikam | Access control, limitations | [Link](https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40747270215) |
| 23 | Available Tools & Capabilities | Dipesh Trikam | 16 tools (7 Zendesk + 9 SITC) | [Link](https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40745730458) |
| 24 | Zendesk SITC Azure Well-Architected Deployment | Dipesh Trikam | WAF deployment plan | [Link](https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40745730525) |
| 25 | Zendesk SITC Technical Details | Dipesh Trikam | Python 3.12, FastMCP, Docker | [Link](https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40746713265) |
| 26 | SPP/Open Air Conver Integration | Dipesh Trikam | SPP/OpenAir integration | [Link](https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40727773361) |
| 27 | SPP Insights Governance Summary | Dipesh Trikam | Governance blockers, P1 controls | [Link](https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40727839006) |
| 28 | SPP Insights Production Architecture | Dipesh Trikam | Production architecture | [Link](https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40728133732) |
| 29 | Security Implementation Guide | Dipesh Trikam | Security implementation | [Link](https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40728330441) |
| 30 | SharePoint Conver Integration Proposal 1 | Jason Moss | SharePoint proposal 1 | [Link](https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40217935933) |
| 31 | SharePoint Integration for Conver Proposal 2 | Jason Moss | SharePoint proposal 2 | [Link](https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40217281205) |
| 32 | Conver Code Interpreter QA Jan 2026 | Kieran Sinclair | QA findings, data fabrication | [Link](https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40679800900) |
| 33 | Conver Code Interpreter QA Nov 2025 | Kieran Sinclair | QA findings, bugs | [Link](https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40359264428) |
| 34 | Autodocx Conver QA Test Plan | Kieran Sinclair | Autodocx V1 testing | [Link](https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40435843091) |
| 35 | Autodocx v1.2 Conver QA Test Plan | Johnson Paku | Autodocx V2 testing | [Link](https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40512061751) |
| 36 | Conver Memories Acceptance Criteria Test Plan | Kieran Sinclair | Memory isolation, testing | [Link](https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40398749884) |
| 37 | Conver FAQ/QnA Bot Testing | Kieran Sinclair | FAQ bot testing | [Link](https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40323022916) |
| 38 | Conver Quick Smoke Test Checklist | Kieran Sinclair | Smoke test checklist | [Link](https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40115503162) |
| 39 | Conver Agents | Matt Shepheard | Agent documentation | [Link](https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40217510174) |
| 40 | Conver Assistants Menu | Harrison Bland | Assistants menu feature | [Link](https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40648441901) |
| 41 | Conver Intro Agent Handoffs & Passthroughs | Kieran Sinclair | Agent handoff architecture | [Link](https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40653521063) |
| 42 | Conver Tool Integration Guide | Dipesh Trikam | Tool integration guide | [Link](https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40533295251) |
| 43 | Conver Policy Chat Bot (POC) | Johnson Paku | PolicyBot POC | [Link](https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/39820984356) |
| 44 | Conver Knowledge Base Test QnA Sets | Harrison Bland | KB test sets, model guidance | [Link](https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40255848492) |
| 45 | Conver Feature Flags QA Environment | Kieran Sinclair | Feature flag management | [Link](https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40656011311) |
| 46 | LibreChat Changes Merge Plan for Conver | Jing Ling | LibreChat merge plan | [Link](https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40468283444) |
| 47 | Roadmap LibreChat 2025 | Victoria Marchant | LibreChat roadmap features | [Link](https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/39888749091) |

### Additional 70 pages mentioning Conver

An additional 70 Confluence pages across the IA and GEA spaces mention Conver. These include standup notes, meeting minutes, planning documents, Azure infrastructure audits, agent optimisation reports, and ecosystem tools (SOW Studio, Vanta AI, Atlassian Rovo). These peripheral pages were reviewed but contribute primarily operational context rather than core platform data.
