# Business Requirements - End User Portal
> Business and non-functional requirements for the DMI Employee Service Portal

**Author:** Jessie Gisler
**Date:** 15 February 2026
**Source:** https://datacomgroup.atlassian.net/wiki/spaces/GITTSP/pages/40771813873

---

## 🎯 Context

This document defines the business requirements (BR) and non-functional requirements (NFR) for the DMI Employee Service Portal. Requirements are categorised by area (Branding, Access, Usability, Taxonomy, Process, Integration, Notifications, Reporting) and prioritised using MoSCoW (Must, Should, Could).

---

## 🔍 Problem

The Employee Service Portal must meet specific business and non-functional requirements to deliver a usable, accessible, and scalable self-service experience for Datacom staff. Requirements must be clearly defined for build, test, and acceptance.

---

## 📋 Observations

**1. Branding requirements**
BR-01: Portal branded with Datacom-approved logos, colours, visual standards (Must). BR-02: Simple, clean, usable MVP even if not highly customised (Must).

**2. Access requirements**
BR-03: All Datacom employees access from Unity or web/mobile without VPN (Must). BR-04: Portal used solely for request initiation and visibility—not fulfilment (Must). BR-05: Users only view/access requests, incidents, catalog items, knowledge for which authorised (Must).

**3. Usability requirements**
BR-06: Authenticate and route to end-user portal—no redirect to Service Operations Workspace (Must). BR-07: Configurable global search across catalog, knowledge, AI-generated content (Must). BR-08: Surface knowledge articles during search to deflect requests (Must). BR-09: Catalog items with mandatory/optional fields, dropdowns, multi-selects, attachments (Must). BR-10: Favourites for frequently used catalog items (Must). BR-11: Quick Links for hard-to-discover services (Should). BR-12: Popular Topics and Recommended sections (Should). BR-13: Responsive layout across devices and browsers (Must).

**4. Taxonomy requirements**
BR-14: Universal taxonomy across catalog items, incident record producers, knowledge articles (Must). BR-15: Taxonomy categorises consistently, improves search relevance, usability, adoption (Must). BR-16: Get IT Support in discoverable location (Should).

**5. Process requirements**
BR-17: Single primary landing page for support and services (Must). BR-18: Log IT issues/requests directly without email or phone (Must). BR-19: Incident submissions auto-assign to correct assignment group (Must). BR-20: Change Requests via Service Catalog (Must). BR-21: Approval workflows for Incident, Service Catalog, catalog items (Must). BR-22: Catalog items for recurring manual tasks with future automation potential (Must). BR-23: Third-party approval and fulfilment integration (Could).

**6. Integration requirements**
BR-24: Virtual Agent integration (Must). BR-25: Redirect to Activate where services fulfilled there—no duplication (Must).

**7. Notifications and reporting**
BR-26: Notifications redirect to Employee Service Portal consistently (Should). BR-27: Knowledge and catalog suggestions via email (Should). BR-28: Survey support when enabled (Could). BR-29: My Requests view for status (Must). BR-30: Analytics for adoption tracking (Should).

**8. Non-functional requirements**
NFR1: Catalog expansion without re-architecture (Scalability). NFR2: Future migration to ESC Pro, microsites (Scalability). NFR3: AI/chat assistant for knowledge search, subject to future confirmation (Scalability). NFR4: Accessibility standards, colour contrast (Accessibility). NFR5: Self-manage portal configuration without vendor dependency (Governance).

---

## 💡 Proposal

Implement the Employee Service Portal to meet all Must-have business requirements and prioritise Should-have where feasible. Ensure non-functional requirements for scalability, accessibility, and governance are addressed.

- Deliver all Must requirements for branding, access, usability, taxonomy, process, integration
- Prioritise Should requirements (Quick Links, Popular Topics, Get IT Support placement, notifications)
- Design for NFR scalability (ESC Pro, microsites) and self-management

*Requirements provide a clear specification for build, test, and acceptance.*

---

## ⚠️ Risks

- **Scope creep:** Could requirements may expand scope if not carefully managed.
- **Activate integration:** BR-25 requires clear redirect logic—duplication risk if not implemented correctly.

---

## ✅ Next Steps

1. **Requirement traceability** — Map requirements to build items and test cases.
2. **MoSCoW validation** — Confirm Must/Should/Could prioritisation with stakeholders.
3. **NFR validation** — Validate scalability, accessibility, and governance requirements with architecture.

---

## 🔑 Close

> The portal shall be the single primary landing page for Datacom end users to request support and services.

The Business Requirements document provides a comprehensive specification for the DMI Employee Service Portal, ensuring usability, accessibility, and integration with Activate and Virtual Agent.

https://datacomgroup.atlassian.net/wiki/spaces/GITTSP/pages/40771813873
