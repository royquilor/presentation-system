# Current State Assessment Summary
> Security posture rated MODERATE — 6 formal findings across Production, parallel risks at larger scale in Dev, and compliance gaps against Essential Eight, ISO 27001, and NIST CSF

**Author:** Julian Buckley & Gavin Millar — Insights & Analytics
**Date:** March 2026
**Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40881225729/Current+State+Assessment+Summary

---

## 🎯 Context

Two independent assessments were conducted against the Conver Azure platform. The Buckley/Millar CAF/WAF assessment (AZ-CAF-PillarsAlignment-001, Feb 2026) covered the Production subscription. A Dev subscription audit (Mar 2026) covered 667 resources across 56 resource groups.
Foundational controls are in place — RBAC, Bastion, centralised logging, Defender for Cloud, and CI/CD automation — but significant gaps remain in network isolation, backup, policy enforcement, and environment separation.

---

## 🔍 Problem

The overall security posture is rated MODERATE. The platform is not yet suitable for safe replication as a customer-facing pattern.
Four HIGH-severity findings and two MEDIUM-severity findings were identified in Production, with parallel issues confirmed at significantly larger scale in the Dev subscription.

---

## 📋 Observations

**1. DF-01 — Backups not consistently enabled (HIGH)**
Azure Backup is not enabled for VMs or stateful services. No RPO/RTO/SLA values applied at resource level. All storage on LRS with no zone redundancy. A single incident — ransomware, operator error, or AZ outage — could cause irreversible data loss.

**2. DF-02 — Public storage accounts and SAS exposure (HIGH)**
Several production storage accounts have public network access and rely on SAS tokens with no private endpoints. This creates direct internet-reachable paths to data that bypass the WAF, increasing the likelihood of undetected data breaches.

**3. DF-03 — Key Vaults exposed via public endpoints (HIGH)**
Production Key Vaults are accessible via public endpoints, some from all networks. Publicly reachable Key Vaults increase risk of key, secret, or certificate exposure. Compromise of a vault may lead to compromise of applications, encrypted data, and identities.

**4. DF-04 — VM hardening and direct internet exposure (HIGH)**
Both production VMs have password auth enabled, pending OS updates, no disk encryption at host, and secrets on disk. The MongoDB VM exposes port 27017 on a public IP. This is the single highest-risk item in the environment.

**5. DF-05 — Policy-driven governance at 39% compliance (MEDIUM)**
Management groups and policy initiatives are assigned, but overall compliance is approximately 39%. NSG configuration and log routing are handled per-resource rather than enforced via policy, leading to configuration drift and inconsistent controls.

**6. DF-06 — No environment separation or AI landing zones (MEDIUM)**
No clear pattern for separating Prod, Non-Prod, and Sandbox environments. No dedicated AI/ML landing zones. Production data could be used in test/training environments with uncontrolled data flows to AI services.

**7. Dev subscription mirrors Production risks at larger scale**
The Dev subscription (667 resources, 56 resource groups) has SSH open to 0.0.0.0/0 on 3 NSGs, RDP open to 0.0.0.0/0 on 2 NSGs, all 12 Key Vaults without purge protection or private endpoints, and projected costs of ~$11,500 NZD/month. Remediating Production while leaving Dev exposed would create lateral-movement vectors.

---

## 💡 Proposal

Execute a three-phase remediation plan that addresses all findings across Production, Dev, and UAT simultaneously.

- Phase 1 (2 weeks): Eliminate critical exposures — secrets on disk, SSH/RDP, MongoDB port
- Phase 2 (6 weeks): Network isolation with Private Endpoints across all PaaS services, MongoDB migration
- Phase 3 (8–12 weeks): Governance uplift, IaC templates, VM migration to Container Apps, AI landing zone

*The peer review validated the plan as "strong, needs targeted rework before execution" and identified the actual scope at 28 stories and 188 SP — a 25% increase from the original estimate.*

---

## ⚠️ Risks

**Lateral movement from Dev:** The Dev subscription has the same categories of risk as Production but at significantly larger scale (667 resources vs Production's smaller footprint). All three environments must be remediated together.

**Compliance gaps across four frameworks:** Patch management, application control, backups, and AI data protection are all rated GAP against Essential Eight, ISO 27001, and NIST CSF. Network security, data protection, and identity management are rated PARTIAL.

**Replication danger:** Conver is being positioned as a reusable customer building block. Any unaddressed vulnerabilities would be replicated at scale across multiple customer environments.

**Scope undercount:** The original plan claimed 31 stories and ~150 SP. The peer review corrected this to 28 stories and 188 SP — material for resourcing and timeline planning.

---

## ✅ Next Steps

1. **Phase 1 immediate action** — Close SSH/RDP access, close MongoDB public port, remediate secrets on disk, enable Azure Backup
2. **UAT audit** — Complete Story 0.1 to establish full inventory of UAT subscription resources
3. **Network topology design** — Complete Story 0.2 hub-spoke design before Phase 2 begins
4. **Private Endpoint rollout** — Deploy PEs for Storage, Key Vault, AI Services, APIM, and Function Apps across all environments in Phase 2
5. **Policy compliance uplift** — Target >90% Azure Policy compliance across all subscriptions in Phase 3

---

## 🔑 Close

> Security posture MODERATE. Four HIGH findings in Production. Dev mirrors the same risks at 10x scale. Three-phase remediation plan validated by peer review.

The platform has strong foundational controls but critical gaps in network isolation, backup, and governance. The implementation roadmap translates these findings into 28 stories across 188 SP, delivered over three phases.
