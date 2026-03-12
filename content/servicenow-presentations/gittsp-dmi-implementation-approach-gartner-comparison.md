# DMI Implementation Approach Gartner Comparison
> Comparing Datacom's DMI implementation plan with Gartner best practices

**Author:** Jessie Gisler
**Date:** 5 December 2025
**Source:** https://datacomgroup.atlassian.net/wiki/spaces/GITTSP/pages/40467791928

---

## 🎯 Context

This document compares Datacom's DMI (Datacom Managing Instance) implementation approach with Gartner best practices. It identifies gaps, alignment, and recommended actions across implementation sequence, data governance, dual instance governance, ITOM automation, and services portfolio.

---

## 🔍 Problem

Ensuring the DMI implementation aligns with industry best practices reduces risk and maximises value. Gaps in alignment could lead to technical debt, governance issues, or premature automation.

---

## 📋 Observations

**1. Implementation sequence**
Datacom plan: Transition Corporate IT from Cherwell to ServiceNow by end of 2026; out-of-the-box config, parallel delivery to FSD; ITOM Discovery and CMDB clean-up pre-go-live. Gartner: Phased migration—Identity, then CMDB, Discovery, Core ITSM, Change/Problem, ITOM scale-out. Aligned. Medium priority. Recommended: Document phase objectives and success criteria (data accuracy %, process readiness) for each ServiceNow component before progressing.

**2. Data cleansing and governance**
Datacom: Process/data discovery, tenancy consolidation, CMDB cleanse, resolver mapping, formal ownership. Gartner: Migrate only operationally relevant CIs; clear CI ownership pre-migration. Aligned. High priority. Recommended: Embed CMDB Quality KPIs (confidence score, stale CI count, orphan record count) and review quarterly post-go-live.

**3. Dual instance governance (DMI vs MSP)**
Datacom: Implement DMI for internal IT, linked to MSP instance as needed. Gartner: Keep CMDB and ITOM consolidated in single authoritative instance. Partial alignment. High priority. No authoritative CMDB decision documented. Recommended: Decide whether Corporate or MSP is CMDB system of record; publish integration/governance pattern for cross-instance data consistency.

**4. ITOM deployment and automation readiness**
Datacom: ITOM Discovery, Query on Event Mgmt, proactive problem detection, service mapping. Gartner: Limited Discovery (>85% accuracy) before automation; heavy functions. Partial alignment. High priority. Automation may be premature if data/process not mature. Recommended: Introduce Automation Readiness Gates—require CMDB confidence >85%, clear event correlation patterns, and stable process ownership prior to enabling automation.

**5. Services portfolio through CSDM**
Datacom: Not currently implemented in aligned manner for MSP; DMI open for analysis and improvement. Gartner: TBC consolidate Corporate/Group IT service view into Business Services and Offerings table. Business Service, Service Catalog, Offering Owner, Technical Service, Application Service, Infrastructure CI. Low alignment. High priority. Automation will be difficult without this reset. Recommended: Jessie, Service Workshop. Define Portfolio and Catalog. Discovering everything is not necessarily required.

**6. Business value, change management, and adoption**
Datacom: Role-based training, champions network, phased migration, post go-live support. Benefits focused on operational metrics (MTTR, ticket volumes, SLA compliance). Gartner: Change comms tied to service value; adoption measured via service KPIs. Partial alignment. Medium priority. Comms largely technical. Recommended: Update training/comms to introduce changes in terms of business impact; measure adoption through value-based KPIs (e.g. faster staff onboarding via automated provisioning).

**7. High-priority gaps**
Dual instance governance, ITOM automation readiness, and Services Portfolio/CSDM are high-priority gaps requiring decisions and actions.

**8. Foundation-first sequencing**
Good foundation-first sequencing is noted. Document phase objectives and success criteria before progressing to next phases.

---

## 💡 Proposal

Address high-priority gaps before scaling automation and ensure governance decisions are documented.

- Decide CMDB system of record (Corporate vs MSP) and publish integration pattern
- Introduce Automation Readiness Gates (CMDB confidence >85%, event correlation, process ownership)
- Define Services Portfolio and Catalog via Service Workshop
- Update training and comms to emphasise business impact and value-based KPIs

*Alignment with Gartner best practices reduces risk and positions DMI for long-term success.*

---

## ⚠️ Risks

- **No authoritative CMDB decision:** Cross-instance data consistency and governance remain unclear.
- **Premature automation:** Automation before data/process maturity may create instability.
- **Services portfolio gap:** Automation and service mapping will be difficult without CSDM structure.

---

## ✅ Next Steps

1. **CMDB governance decision** — Decide Corporate vs MSP as system of record; publish integration pattern.
2. **Automation Readiness Gates** — Define and implement gates (CMDB confidence, event correlation, process ownership).
3. **Service Workshop** — Define Portfolio and Catalog; Jessie to lead.
4. **Comms refresh** — Update training and comms to emphasise business impact and value-based KPIs.

---

## 🔑 Close

> "Document phase objectives and success criteria for each ServiceNow component before progressing."

Addressing high-priority gaps—especially dual instance governance, automation readiness, and services portfolio—will align DMI with Gartner best practices and reduce implementation risk.

https://datacomgroup.atlassian.net/wiki/spaces/GITTSP/pages/40467791928
