# Agent Library
> Datacom's internal App Store for AI agents — discover, deploy, and manage pre-built automations in one governed catalogue

**Author:** Dipesh Trikam & Jason Moss — Insights & Analytics
**Date:** March 2026
**Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40043905712/Agent+Library

---

## 🎯 Context

The Agent Library is a centralised catalogue where AI agents are published, discovered, and deployed.
150+ features. 50+ API endpoints. 12ms response time. 99.9% availability. Built in 34 days.

---

## 🔍 Problem

Building AI agents from scratch for every use case is expensive and slow.
Teams don't know what already exists. They rebuild identical capabilities independently.
No governance, no audit trail, no way to share proven agents across the organisation.

---

## 📋 Observations

**1. What It Is**
A governed catalogue of pre-built AI agents — like an internal App Store.
Each agent has a defined capability, documentation, usage examples, and an integration guide.
Admin panel for agent management, usage monitoring, audit logs, and analytics reporting.
Serverless on Azure Functions with MongoDB + CosmosDB and Azure APIM gateway.

**2. Who It's For**
Developers — integrate pre-approved agents into applications via the API.
Business teams — deploy AI capabilities without building from scratch.
Admins & governance leads — manage access, review audit trails, ensure compliance.
Innovation teams — explore what AI capabilities exist within Datacom's approved toolset.

**3. Why It Matters**
Weeks of build time avoided by reusing existing agents.
Database cost: ~$50/month. Incremental cost from Agent Library: $0–5/month.
70% cost reduction vs traditional deployment architecture.
All agents CISO-approved and auditable — no ungoverned AI sprawl.

**4. How to use the Agent Library**
Step 1 — Browse the catalogue. Search or filter by capability, team, or status.
Step 2 — View an agent's detail page. See purpose, inputs/outputs, examples, integration guide.
Step 3 — Request access or deploy. Follow the agent's deployment instructions.
Step 4 — Admin panel. Manage listings, review audit dashboard, pull usage reports.
Step 5 — Submit a new agent. Built something worth sharing? Submit for review.

**5. Example — Summarisation Agent**
Developer calls the Summarisation Agent API with a Confluence page body.
Returns a 3-sentence executive summary.
Ready to embed in a Teams notification or dashboard — no custom build required.

**6. Example — Compliance Audit Review**
Compliance lead opens the Audit Dashboard.
Filters by agent ID and date range.
Full trail: which users accessed which agents, when, and what they did.

**7. Example — Usage Analytics**
Manager opens the Reports Dashboard.
Top agents by call volume. Adoption trends. Error rates by agent.
Data-driven decisions about which agents to promote, retire, or improve.

**8. Performance — enterprise grade**
API response: 12ms average.
Availability: 99.9%.
Azure Well-Architected Framework: 8.5/10 (A-).
Consumption-based serverless — scales automatically, costs nothing when idle.

**9. Security — pen tested and CISO approved**
18 pen test findings. 4 HIGH severity — all fixed.
CISO approval submitted December 2025.
Azure AD SSO with RBAC (user, admin, moderator).
No PII, no sensitive data, internal users only.

---

## 💡 Proposal

Browse the catalogue. Find an agent. Deploy it. Or submit your own for the team to reuse.

---

## 🔑 Close

> Stop rebuilding. Start reusing. Every AI agent at Datacom deserves to be discovered.

150+ features. 12ms response. 99.9% uptime. Entra ID SSO.
