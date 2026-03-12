# Current State Discovery Approach
> Structured consultation to map Cherwell workflows and prepare ServiceNow transition

**Author:** Jessie Gisler
**Date:** 27 November 2025
**Source:** https://datacomgroup.atlassian.net/wiki/spaces/GITTSP/pages/40336195957

---

## 🎯 Context

Discovery Workshops are a structured consultation process with team leads to map existing Cherwell workflows, resolver structures, and integration points. The objective is to ensure ServiceNow processes are ITIL-aligned, automation-ready, and tailored to each team's operational realities. As of 28 Nov 2025, the data-driven Discovery outlined here is on hold; focus has shifted to Services Portfolio, Service Catalog, Ownership and Priority. See Services Led Model Discovery Approach for the replacement approach.

---

## 🔍 Problem

Without a clear understanding of current-state operations, the transition from Cherwell to ServiceNow risks misaligned workflows, incorrect resolver group mappings, and missed automation opportunities. Gaps between current practice and out-of-the-box ServiceNow workflows must be identified before design and build begin.

---

## 📋 Observations

**1. Discovery timeline**
Workshops sequenced by functional area and interrelated teams, scheduled for early December. Series of 1-hour virtual sessions with agenda and generic decks distributed with invite.

**2. Purpose**
Capture how Corporate/Group IT teams operate in Cherwell; validate resolver group structures, roles, and SMEs; document processes, integrations, access requirements, and training needs; identify gaps and manual workarounds for ITIL workflows (incident, request, change, problem, knowledge, SLA/OLA, CMDB, surveys); baseline data accuracy before migration.

**3. Audience**
Team Managers and Queue Managers (resolver group owners) first, then SMEs across Service Desk, Change, Security, CI/Asset, and Integration.

**4. Session agenda**
Kick-off and context; People (validate resolver groups, membership, leadership); Process (map incidents, requests, changes, problems, knowledge, SLAs, surveys, CMDB); Technology (integration gap-check); Close and next steps.

**5. Resolver group mapping**
Collate all resolver groups from Cherwell (DONE); verify against BAU org charts and HR records (WIP); workshop validation for active groups, membership, duplicates, role definitions; map to ServiceNow Assignment Groups and persona roles.

**6. Transformation opportunities**
Capture pain points, manual workarounds, and inefficiencies; identify quick-win automations (auto-classification, pre-approved change templates, self-service catalogue items); integration rationalisation; map to ServiceNow capability.

**7. Outputs**
Current-state workflow documentation per team; resolver group mapping for Assignment Groups; gap analysis; data clean-up list; integration inventory; early automation opportunities; change impacts for OCM plan.

**8. User story confirmation**
Consolidate raw outputs into structured repository; validation loop with team managers; translate to design inputs (Assignment Group table, workflow config, interface design, RBAC); align with OCM and training; handover to implementation backlog (NowCreate methodology).

---

## 💡 Proposal

Execute discovery through 1-hour virtual sessions using Microsoft Forms or Miro boards for live input, shared templates, and Core Pack decks.

- Announce to managers with plain-language context and preparation guidance; follow up with nudge reminders.
- Validate resolver groups, process maps, and integration gaps in sequenced sessions.
- Produce master mapping document: Current Resolver Groups to BAU Team Members to Future Assignment Groups and Persona Groups.
- Feed Transformation Opportunities Register into HLS and Change Management Plan.
- Enter validated data into implementation backlog with dependency logs for Technical Architects, Integration Leads, and OCM.

*Discovery outputs form the foundation for a smooth transition, ensuring the new platform fits Datacom's business needs while meeting industry best practice.*

---

## ⚠️ Risks

- **Risk:** Current-state data-driven Discovery is on hold (28 Nov 2025); replacement approach (Services Led Model Discovery) may alter scope and timeline.
- **Risk:** Resolver group verification against BAU org charts is WIP; discrepancies may delay Assignment Group mapping.

---

## ✅ Next Steps

1. **Services Led Model** — Adopt replacement approach for Services Portfolio, Service Catalog, Ownership and Priority.
2. **Resolver verification** — Complete cross-check of group names, managers, and memberships against BAU and HR records.
3. **Workshop validation** — Confirm active groups, correct membership, overlapping groups, and role definitions in sessions.
4. **Design handover** — Translate validated outputs into Assignment Group table, workflow configuration, and RBAC settings.

---

## 🔑 Close

> Discovery sessions are the foundation for a smooth transition, ensuring the new platform fits Datacom's business needs.

Structured consultation with team leads ensures ITIL-aligned, automation-ready ServiceNow processes tailored to operational realities. Gap-free requirement sets and clear links between discovery results and configuration items enable successful build and adoption.

https://datacomgroup.atlassian.net/wiki/spaces/GITTSP/pages/40336195957
