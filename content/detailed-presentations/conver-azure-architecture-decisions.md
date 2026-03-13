# Azure Architecture Decisions Record
> Three approved ADRs shaping the Conver Azure redesign — VM-to-Container Apps migration, hub-spoke network topology, and Phase 2 timeline extension

**Author:** Jason Moss — Insights & Analytics
**Date:** March 2026
**Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40881258497/Architecture+Decisions+Record

---

## 🎯 Context

The Buckley/Millar CAF/WAF assessment and a comprehensive Dev subscription audit exposed significant security and architectural gaps across the Conver Azure platform.
Three strategic architecture decisions were approved by Jason Moss on 2026-03-11 to set the direction for the remediation programme spanning 700+ resources across three subscriptions.

---

## 🔍 Problem

The original implementation plan proposed extensive VM hardening (~30 SP), lacked a coherent network topology for Private Endpoint rollout, and compressed Phase 2 into an aggressive 4-week window.
Without these foundational decisions, ~46 SP of Phase 2 work was blocked and the project risked investing in throwaway effort.

---

## 📋 Observations

**1. ADR-001 — Migrate VMs to Container Apps**
The assessment found both production VMs with password auth, missing disk encryption, secrets on disk, and MongoDB exposed on a public IP. Rather than harden VMs that will be decommissioned, the decision is to migrate to Azure Container Apps — a platform the team already runs (9 apps in Dev). Interim lockdown in Phase 1 provides equivalent protection during the transition.

**2. Cost case for Container Apps**
VMs are the second-largest cost driver in Dev at $648/month. Container Apps cost $17/month in Dev — a 97% reduction. Containerised workloads are also inherently more portable for customer replication, directly addressing the assessment's strategic concern.

**3. ADR-002 — Hub-spoke network topology**
Nearly every PaaS service has a public endpoint (DF-02, DF-03). Private Endpoints require a coherent subnet and DNS zone strategy. Hub-spoke with a shared hub VNet (DNS, firewall, monitoring) and per-environment spoke VNets (Prod, Dev, UAT) is the CAF-recommended Landing Zone model and the prerequisite for ~46 SP of Phase 2 PE work.

**4. Cross-subscription connectivity**
The environment spans four subscriptions: Conver Production, I&A Azure Dev, I&A Azure UAT, and DCU_Networking. Hub-spoke with VNet peering provides the standard approach for cross-subscription interoperability and centralised Private DNS Zones.

**5. ADR-003 — Phase 2 extended to 6 weeks**
Phase 2 scope grew from ~59 SP to ~85 SP after the peer review added Private Endpoints for AI services (50 Cognitive Services accounts, AI Hubs, APIM, Function Apps). The original 4-week window was assessed as "TIGHT" — 6 weeks reduces delivery risk without impacting Phase 1 or Phase 3.

**6. Decisions still pending**
Four decisions remain open: hub VNet location (DCU_Networking vs dedicated hub, Story 0.2), UAT management group placement (Story 6.1), per-customer isolation model (shared APIM vs per-customer subscription, Story 6.2), and which VMs cannot be containerised (Story 4.5).

---

## 💡 Proposal

Execute the three approved ADRs as the architectural foundation for the Conver Azure redesign.

- Phase 1: Interim VM lockdown and containerisation assessment (Stories 4.1–4.5)
- Phase 1: Complete hub-spoke network design document (Story 0.2) before Phase 2 begins
- Phase 2: Private Endpoint rollout and MongoDB-to-Cosmos DB migration over 6 weeks
- Phase 3: Migrate application VMs to Container Apps and decommission legacy VMs

*These decisions avoid ~30 SP of throwaway VM hardening, unblock ~46 SP of Phase 2 work, and set a realistic delivery timeline.*

---

## ⚠️ Risks

**Containerisation blockers:** Story 4.5 may identify VMs that cannot be containerised. If so, deferred hardening stories would need to be re-added to the backlog.

**Hub VNet location unresolved:** Whether to use DCU_Networking or a dedicated Conver hub affects firewall/NVA approach and cost. Story 0.2 must resolve this before Phase 2 execution.

**Phase 2 delay if design slips:** The hub-spoke network design (Story 0.2) is the critical path item — if delayed, ~46 SP of Phase 2 PE work is blocked.

**Application connectivity breakage:** Private Endpoint rollout changes how developers, CI/CD pipelines, and monitoring tools connect to services. A rushed rollout could break application connectivity.

---

## ✅ Next Steps

1. **Complete Story 0.2** — Produce the hub-spoke network design document, resolving the DCU_Networking vs dedicated hub question
2. **Phase 1 interim lockdown** — Close SSH/RDP, close MongoDB port, remediate secrets on disk, enable backup
3. **VM containerisation assessment** — Story 4.5 identifies which VMs can migrate and which need hardening
4. **Phase 2 PE rollout** — Deploy Private Endpoints for Storage, Key Vault, AI Services, APIM, and Function Apps across all environments
5. **MongoDB migration** — Migrate to Cosmos DB for MongoDB vCore (Story 4.6) during Phase 2

---

## 🔑 Close

> Three approved ADRs — Container Apps migration, hub-spoke networking, 6-week Phase 2 — set the architectural direction for the Conver Azure redesign.

These decisions avoid throwaway work, unblock the critical Private Endpoint rollout, and establish a realistic timeline. Four pending decisions will be resolved during execution through their assigned stories.
