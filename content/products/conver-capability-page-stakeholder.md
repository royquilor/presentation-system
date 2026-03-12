# Conver, Detailed Assessment
> AI Platform/Enabler (Foundations). Governed multi-model AI access for 6,500 employees at an estimated $5/user/month.

**Author:** Joe Thornley & Jason Moss, Insights & Analytics
**Date:** March 2026
**Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA

---

## 🎯 Context

Conver is Datacom's internal AI platform, built on a forked and hardened version of LibreChat. It provides 3,000+ employees access to 13 AI models (GPT-4o, Claude, Gemini, and others) through a unified chat interface hosted in Azure Australia East. This assessment draws from 47 core Confluence pages and 117 total pages, all reviewed read-only on 8 March 2026.

**Status:** Production
**Owner:** joe.thornley@datacom.com

---

## 🔍 Problem

Employees needed AI access but Microsoft Copilot costs $3.9M/year for 6,500 staff and locks the organisation into a single vendor. The alternative was ungoverned public AI tools creating data exposure risk and IP leakage. The Insights & Analytics team built Conver to offer multi-vendor model access under Datacom governance. Business case finalised by Joe Thornley, 13 January 2026.

---

## 📋 Observations

**1. Platform capability**
Built on LibreChat (forked). 13 AI models across Azure OpenAI, Anthropic, and Google: GPT-4o, GPT-4o-mini, o1, o3-mini, Claude 3.5 Sonnet, Claude 3 Opus, Gemini 1.5 Pro, Gemini 2.0 Flash, DALL-E 3, Whisper, and others. 14 features shipped to production: Code Interpreter, Memories, Autodocx, Knowledge Base, Agent Handoffs, Assistants Menu, Feature Flags, and more. Tech stack: Node.js, React, MongoDB, Azure (App Service, Functions, OpenAI, Blob Storage, Key Vault, App Configuration). Source: Knowledge Hub, Conver Agents documentation.

**2. Measured outcomes**
Estimated annual productivity value: $15.6M NZD. Calculated as 6,500 employees saving 1 hour/week at $50/hr loaded cost across 48 weeks. This is an estimate, not an audited figure. Conservative ROI: 826% ($15.6M / $1.685M). Optimistic: 10,314% ($78M / $905K at low cost). Break-even threshold: 0.1% of employee time (5 minutes/day).

Two documented user outcomes. Janet Williams: 4 developer-ready Jira tickets in 40 minutes using chained agents, previously approximately 3 hours. Pubudu Nuwan: automated AWS invoice PDF extraction to CSV, replacing a manual process. Current adoption: 30,000+ conversations from 3,000+ active users with 600% year-over-year growth, all organic. Source: Business Case Production, Joe Thornley, 13 January 2026.

**3. Team and resourcing**
9 contributors maintain the platform. 4.0 FTE budget allocation: Product and Development at 2.0, Support at 0.5, Governance at 2.0. Key contributors: Joe Thornley (Product Owner), Jason Moss (Technical Lead), Harrison Bland (Platform/QA), Dipesh Trikam (Integration), Kieran Sinclair (QA Lead), Johnson Paku (Developer), Jing Ling (DevOps), Matt Shepheard (Agent Development), Victoria Marchant (LibreChat Strategy). Source: Consolidated Data Extract, 8 March 2026.

**4. Investment and cost**
Year-1 investment: $905K to $1.685M NZD. Breakdown: Azure hosting $180K to $360K, AI model tokens $375K to $625K, staff 4.0 FTE at $350K to $700K. Infrastructure alone: $35K/year for 6,500 users. Copilot equivalent: $3.9M/year at $50/user/month for 6,500 staff. Conver runs at roughly $5/user/month, making it 99% cheaper per-user. Source: Business Case Production, Hyperscaler T&Cs analysis.

**5. Security and compliance**
Hosted in Azure Australia East. Conversations encrypted at rest, never used for model training. Full penetration test completed. Entra ID SSO. Real-time DLP guardrails. Network-level controls. Key Vault for secrets management. Source: Security Guide, Risk Review November 2025.

**6. Known limitations and risks**
Token consumption audit: 1 of 156 runs complete (HIGH severity, open). Security compliance programme (ISO 27001): not started, playbook ready (CRITICAL severity, open). Data sovereignty: some models hosted outside NZ/AU (HIGH severity, monitoring). No disaster recovery plan documented (MEDIUM severity, open). Code interpreter dataset persistence issues (MEDIUM, testing). Autodocx template rendering edge cases (MEDIUM, testing). Feature flag configuration drift between environments (MEDIUM, documented). LibreChat upstream merge conflicts (MEDIUM, ongoing). Source: Consolidated Risk Register, 8 March 2026.

Productivity figures are estimated, not audited. Departmental validation across IT Support, HR, and Development is recommended. Only two named user outcomes are documented. Additional testimonials should be collected during expansion.

**7. Roadmap**
Zendesk SITC integration (7 documents in development). SPP/OpenAir integration (4 documents in development). Agent Library launch. SharePoint integration (proposals drafted October 2025). ISO 27001 certification programme (90-day playbook ready, not started). Scale from 3,000+ to 6,500 employees (full Datacom rollout). External commercialisation for NZ government clients. Source: Roadmap DRAFT, strategic goals documentation.

---

## 💡 Proposal

Recommended next step: 15-minute walkthrough with Joe Thornley to review capabilities and discuss departmental productivity measurement. Contact joe.thornley@datacom.com.

---

## 🔑 Close

> 13 models, $5/user/month, 3,000+ active users scaling to 6,500. Productivity estimates need departmental validation. Token audit and ISO 27001 are the near-term priorities.

conver.datacom.com
**Owner:** joe.thornley@datacom.com

*Metrics current as of March 2026. Next quarterly refresh: June 2026.*
