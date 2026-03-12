# Services Led Model Discovery Approach
> Define Services Portfolio, Service Catalog, Ownership and Priority before process and resolver mapping

**Author:** Jessie Gisler
**Date:** 8 February 2026
**Source:** https://datacomgroup.atlassian.net/wiki/spaces/GITTSP/pages/40468218122

---

## 🎯 Context

On 28/11 the project shifted from Current State data-driven Discovery to a Services Led Model Discovery Approach. A strong ServiceNow Platform starts with a strong Services Model—CSDM provides the structure, but Business Services must be clearly identified and agreed. The first step is to agree on Services Portfolio, Service Category, Service Model/Product Model, and Ownership and Priority.

---

## 🔍 Problem

Without a defined services model, process mapping and resolver design lack context. CSDM benefits—Virtual Agent deflection, MTTR reduction, standard changes, event management, reporting—depend on accurate CI-Service mapping. Gartner recommends starting with a strong set of 12 Services and building out from there.

---

## 📋 Observations

**1. Foundational step**
Agree on: Services Portfolio; Service Category; Service Model / Product Model; Ownership and Priority. Current State Approach is paused in favour of this services-first approach.

**2. MSP vs DMI context**
In March 2025, FSD decided not to re-design Services Taxonomy for External Customers; existing Services, Sold Products, CIs and owners would be transitioned from Cherwell, not transformed. For DMI, we can ensure strong CSDM to transform as we migrate; draft modelling was undertaken in early 2025 by ServiceNow, Group Data, and FSD Team.

**3. CSDM benefits enabled**
Service Desk Efficiency (CI-Service mapping for Virtual Agent); MTTR Reduction (auto-assignment to resolver groups); First-Call Resolution (known errors by service/application); Standard Changes (change impact analysis); Asset Utilisation; Event Management; Knowledge Management; Catalogue Management; Reporting & Analytics; Proactive Problem Management; Maintenance Planning; Change Conflict Detection; Service Availability; Customer Business Reporting.

**4. Gartner recommendation**
Start with strong set of 12 Services; use Group Technology and EASA Services as starting point; not necessarily Go-Live with 12—focus on accurate detailed subset for Datacom to model.

**5. Data modelling mapping**
ServiceNow Service Portfolio → Datacom Line of Business; Service Category → Business Group; Service Type → determinable from Service Line; Service/Product Model → determinable from Service; Service Offering → determinable from Customer Resource Unit (Mertle); Product Model Attribute → determinable from Resource Unit (Mertle/EDW).

**6. Next steps**
Existing data modelling informs Drafted/Proposed Services; circulate ahead of "Services Model Workshop"; sample data in SharePoint: Services-Led Discovery folder.

**7. Sample data sources**
All applications; Mertle for Service Offering and Product Model Attribute; EDW for Product Model Attribute; Business Group "All not in Mertle / WIP."

**8. Replacement of Current State**
Current State Discovery Approach replaced by Services Led Model; ensures Services Portfolio, Service Catalog, Ownership and Priority drive discovery before resolver and process detail.

---

## 💡 Proposal

Execute Services Led Model Discovery as the primary discovery approach, with Services Model Workshop to validate proposed services.

- Use existing data modelling to draft proposed Services
- Conduct Services Model Workshop to agree Services Portfolio, Category, Model, Ownership
- Focus on Group Technology and EASA Services as showcase subset
- Align with CSDM Run State definition and Top-Down/Bottom-Up streams
- Feed validated services into resolver mapping and process design

*A strong services model enables all downstream benefits—Virtual Agent, MTTR, standard changes, reporting, and automation.*

---

## ⚠️ Risks

- **Data quality:** Source data (Mertle, EDW, spreadsheets) may have gaps or inconsistencies affecting service definition.
- **Stakeholder alignment:** Agreement on 12 (or subset) services requires cross-team engagement.

---

## ✅ Next Steps

1. **Draft proposed Services** — From existing data modelling; circulate to stakeholders.
2. **Conduct Services Model Workshop** — Agree Services Portfolio, Category, Model, Ownership and Priority.
3. **Validate with Group Technology and EASA** — Use as showcase for accurate detailed subset.
4. **Link to CSDM delivery** — Align with Top-Down and Bottom-Up streams (see CSDM and Services Modelling).

---

## 🔑 Close

> A strong, successful Datacom ServiceNow Platform starts with a strong Services Model—our Business Services must be clearly identified and agreed upon.

Services Led Discovery ensures the model drives design, not the reverse.
https://datacomgroup.atlassian.net/wiki/spaces/GITTSP/pages/40468218122
