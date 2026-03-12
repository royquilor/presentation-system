# Glossary — Technical Terms & Definitions

> A comprehensive A–Z reference of the technical terms, acronyms, Azure services, and architectural concepts used throughout the Datacom Agent Library project.

**Author:** [Dipesh Trikam](https://datacomgroup.atlassian.net/wiki/people/712020:06f04ec7-5f4c-4e03-a2a3-3e46b413e073)
**Date:** 13 September 2025
**Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40062222353

---

## 🎯 Context

The Datacom Agent Library is a WAF-compliant (8.5/10) enterprise AI agent-sharing platform built by the Datacom EASA team. The glossary was authored by Dipesh Trikam to serve as a shared vocabulary for all project contributors — developers, operators, architects, and stakeholders — ensuring consistent use of terminology across documentation, code reviews, and team communication.

---

## 🔍 Problem

Enterprise projects spanning multiple Azure services, authentication systems, and custom application concepts accumulate a significant body of specialised terminology. Without a canonical reference, team members and new contributors risk misinterpreting terms (e.g., confusing "Agent" the AI tool with other uses of the word), leading to miscommunication in design discussions and documentation.

---

## 📋 Observations

- The glossary covers the full A–Z alphabet with 60+ terms spanning application architecture, Azure services, security, performance, and development tooling.
- **Agent** is defined as an AI-powered tool/assistant that users create and share within the organisation — the core entity of the entire platform.
- **Private Endpoint** is specifically called out as a key architectural term: CosmosDB is accessed via private endpoint within the Function App VNet, eliminating public internet exposure and achieving <5ms database latency.
- **Performance** entry highlights the headline achievement: 12ms average response time, representing a 99.8% improvement from the original 5,000ms+ baseline.
- **VNet Peering** (172.21.0.0/16 ↔ 172.19.0.0/16) is defined as the secure network connectivity method that underpins the performance breakthrough.
- The glossary is grouped into categorised appendices covering Azure Services, Development Tools, Security Terms, and Performance Terms for quick lookup.
- **WAF Compliance** (8.5/10, A-grade) is cited as a key project benchmark, with definitions anchored to the five WAF pillars: Reliability, Security, Cost Optimisation, Performance Efficiency, and Operational Excellence.

---

## 💡 Proposal

The glossary serves as a living reference document maintained alongside the broader Agent Library documentation suite. It is designed to be consulted during onboarding, architecture reviews, and documentation authoring to ensure all parties are working from the same definitions, particularly for terms that have specific meanings within the project's Azure-centric architecture.

---

## ⚠️ Risks

- As a living document, the glossary risks becoming stale if architectural decisions change (e.g., VNet CIDR ranges, database choices) and updates are not applied promptly.
- Some entries (e.g., **Zero Downtime**, **Global Distribution**) describe aspirational or planned capabilities rather than fully implemented features — readers may conflate documented terms with confirmed production behaviour.
- The glossary does not define domain-specific business terms (e.g., approval workflow states, agent categories) that are relevant to non-technical stakeholders.

---

## ✅ Next Steps

- Assign ownership for quarterly glossary review to keep definitions aligned with infrastructure and feature changes.
- Expand the glossary to include business/domain terms (e.g., `Approval Workflow`, `Sharing Types`, `Agent Category`) for product and stakeholder audiences.
- Link glossary terms inline from other documentation pages where first-use disambiguation would benefit readers.
- Add a section for project-specific acronyms and abbreviations used in Jira tickets and team communication.

---

## 🔑 Close

This glossary is the authoritative vocabulary reference for the Datacom Agent Library — the definitions of **Private Endpoint**, **VNet Peering**, and **Performance** are especially important as they describe the architectural decisions that delivered the platform's headline 12ms response time.

---

📌 **Document Type:** Reference / Glossary
📅 **Last Updated:** 13 September 2025
🔗 **Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40062222353
