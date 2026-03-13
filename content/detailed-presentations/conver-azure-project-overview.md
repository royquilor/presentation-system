# Azure Architecture Redesign — Project Overview
> 7 Epics, 37 Stories, 227 Story Points — a structured remediation and modernisation programme across 3 Azure subscriptions and 700+ resources

**Author:** Jason Moss — Insights & Analytics
**Date:** March 2026
**Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40881094658/Project+Overview

---

## 🎯 Context

The Conver platform was originally built for speed of delivery rather than alignment with enterprise cloud frameworks. It does not fully conform to WAF, CAF, the Essential Eight, ISO 27001, or NIST-aligned practices.
Two drivers make remediation urgent: Group IT Operations is assuming responsibility for the environment, and Conver is being positioned as a reusable building block for customer AI deployments — any unaddressed vulnerabilities would be replicated at scale.

---

## 🔍 Problem

An independent CAF/WAF assessment (Buckley/Millar, Feb 2026) and a Dev subscription audit (Mar 2026) identified significant security, resilience, governance, and architectural gaps.
The overall security posture is rated MODERATE with four HIGH-severity findings and Azure Policy compliance at approximately 39%.

---

## 📋 Observations

**1. Programme scope — 700+ resources across three subscriptions**
Production runs 2 VMs, 3 storage accounts, 3 Key Vaults, Cosmos DB, APIM, App Service, and AI Hubs. Dev has 667 resources across 56 resource groups including 16 VMs, 46 storage accounts, 12 Key Vaults, and 50 Cognitive Services accounts. UAT is partially inventoried with a full audit planned as Story 0.1.

**2. Six findings — four rated HIGH**
DF-01: Backups not consistently enabled. DF-02: Public storage accounts with SAS exposure. DF-03: Key Vaults on public endpoints. DF-04: VM hardening gaps and MongoDB exposed on a public IP. DF-05: Policy compliance at 39%. DF-06: No environment separation or AI landing zones.

**3. Three strategic decisions approved**
Migrate VMs to Azure Container Apps rather than harden in place. Adopt hub-spoke network topology as the target architecture. Extend Phase 2 from 4 weeks to 6 weeks to accommodate increased scope from 59 SP to 85 SP.

**4. Success criteria defined**
100% of Phase 1 critical items resolved. Private Endpoints on all PaaS services in Prod and UAT. Azure Policy compliance above 90%. All migratable VMs moved to Container Apps. IaC templates validated for reusable landing zone deployment. RPO/RTO/SLA tagging on 100% of production resources.

**5. Peer review validated and expanded the plan**
The peer review corrected the actual story count to 28 (not 31) and SP total to 188 (not ~150) — a 25% undercount material for resourcing. Coverage gaps were identified and added: Private Endpoints for AI services, disabling local auth, cost governance, and Function App auth.

**6. Dev subscription cost and sprawl**
Dev is projected at ~$11,500 NZD/month with 4 redundant Application Gateways ($868/mo), over-provisioned VMs, and a stopped Logic App still incurring charges. 57 resource groups with inconsistent naming reflect a mix of project, sandbox, legacy, and experimental resources.

---

## 💡 Proposal

Execute the programme in three phases over approximately 4–5 months.

- Phase 1 (2 weeks): Eliminate critical security exposures — secrets on disk, SSH/RDP, MongoDB port, enable backup
- Phase 2 (6 weeks): Network isolation with Private Endpoints, hub-spoke topology deployment, MongoDB-to-Cosmos DB migration
- Phase 3 (8–12 weeks): Governance uplift to >90% policy compliance, IaC landing zone templates, VM-to-Container Apps migration, AI landing zone establishment

*The programme delivers five key outcomes: critical exposure elimination, Container Apps migration, hub-spoke networking with Private Endpoints, policy compliance uplift, and a reusable landing zone pattern.*

---

## ⚠️ Risks

**Customer replication risk:** Conver is being deployed as a customer-facing pattern. Unaddressed vulnerabilities would be replicated across every customer environment.

**Dev as a lateral-movement vector:** The Dev subscription has the same risk categories as Production but at significantly larger scale. Remediating Production alone is insufficient.

**Timeline pressure:** The programme was originally estimated at ~16 weeks. With the Phase 2 extension, it is now ~18 weeks. Stakeholders expecting faster completion need to be informed.

**Scope growth:** The peer review increased the SP total by 25%. Further scope additions during execution could extend the timeline beyond 5 months.

---

## ✅ Next Steps

1. **Phase 1 critical fixes** — Remediate secrets, close SSH/RDP and MongoDB port, enable Azure Backup across all environments
2. **UAT inventory** — Complete Story 0.1 full audit of UAT subscription
3. **Network topology design** — Complete Story 0.2 hub-spoke design document before Phase 2
4. **Private Endpoint rollout** — Storage, Key Vault, AI Services, APIM, Function Apps across Prod, Dev, and UAT
5. **Landing zone templates** — Validate IaC templates (Story 5.3) that produce compliant deployments from scratch

---

## 🔑 Close

> 7 Epics. 37 Stories. 227 Story Points. Three phases over 4–5 months to transform the Conver Azure platform from speed-first to enterprise-grade.

The programme addresses security, resilience, governance, and architecture in a structured sequence — eliminating critical exposures first, then building network isolation, and finally establishing the reusable landing zone pattern that makes Conver safe to replicate.
