# CSDM and Services Modelling
> Establishing a sustainable CSDM Run State service model for Datacom internal services by end of March 2026

**Author:** Jessie Gisler
**Date:** 4 March 2026
**Source:** https://datacomgroup.atlassian.net/wiki/spaces/GITTSP/pages/40525693349

---

## 🎯 Context

CSDM (Common Service Data Model) provides the foundational data model underpinning ServiceNow. This initiative establishes how Datacom's internal services are structured, owned, and consumed within the DMI platform. The goal is a sustainable Run State service model for Datacom internal services by end of March 2026, clearly differentiating internal service management from external MSP customer services.

---

## 🔍 Problem

The current model within DMI does not fully reflect how Datacom operates internally or how services are delivered and consumed. Without a consistent model, disparate definitions limit reporting, automation opportunities, and the ability to manage services effectively at scale. Defining the service model will enable a consistent, accurate, and holistic view of internal services supporting operational management and strategic decision making.

---

## 📋 Observations

**1. Run State success criteria**
Run State is achieved when: Business Services and Offerings are defined and approved; applications are mapped to services; technical services and relationships are established; service ownership is assigned; Service Offerings are in the Service Portfolio; incidents and requests reference Service Offerings; SLAs are aligned; service reporting is validated; and governance processes are operational.

**2. Scope covers 8 service layers**
Enterprise Business Services, Business Service Offerings, Business Applications, Application Services, Technical Services, Technical Service Offerings, Configuration Item relationships, and service ownership/governance. External MSP customer modelling is out of scope for this phase but will follow the same taxonomy.

**3. Dual-stream delivery approach**
Top-Down Enterprise Services Modelling led by Enterprise Architecture (Ed van Beek and Anthony Miller) defines Business Capabilities, Services, and Offerings from how Datacom operates at enterprise level. Bottom-Up Application and Technical Modelling led by Josh Jacobs builds from operational systems upward through Crawl, Walk, and Run phases.

**4. Top-Down timeline (5 weeks from 23 Feb)**
Week 1: EA + CSDM Refresher Session. Week 2: Define Enterprise Service Structure and draft Business Services. Week 3: Define Business Service Offerings and validate boundaries. Week 4: Alignment with Bottom-Up — establish "Depends on" relationships. Week 5: Publish validated services to Service Portfolio and communicate to stakeholders.

**5. Bottom-Up Crawl-Walk-Run phases**
Crawl: Identify Business Applications, confirm ownership, define Application Services (PROD, TEST, DEV). Walk: Define Technical Services (backups, hosting, monitoring), Technical Service Offerings, and relationships. Run: Link Configuration Items using Discovery and Service Mapping, validate relationships, enable reporting.

**6. Nine proposed Group Technology Business Services**
Collaboration and Productivity; Customer Contact; Data and Analytics; End-User Computing (Device and Support Management); Finance; Service Management; Web and Digital Channels; Workforce, People and Payroll — each with defined capabilities and business value statements.

**7. Guiding principles**
Model services once and reuse across workflows; Service Offerings represent consumption; avoid duplication; maintain clear ownership; keep models simple and evolve incrementally; align with how the organisation actually operates; govern continuously for data integrity.

**8. Internal vs External alignment**
Internal model represents services consumed by Datacom employees. External MSP model remains separate but follows consistent naming and structural patterns to enable future reporting alignment without cross-domain complexity.

---

## 💡 Proposal

Implement CSDM through parallel Top-Down and Bottom-Up streams converging by end of March 2026 to establish a governed, scalable service model.

- Top-Down: Enterprise Architects define Business Capabilities, Services, and Offerings over 5 weeks
- Bottom-Up: Josh Jacobs leads Application Owners through Crawl-Walk-Run engagement over the same period
- Align the two streams by establishing "Depends on" and "Consumes" relationships
- Publish validated services to the Service Portfolio for use in workflows and reporting
- Establish ongoing governance to maintain data integrity post-Run State

*CSDM provides the foundation for automation, AI, reporting, and service-level decision making across Datacom's ServiceNow platform.*

---

## ⚠️ Risks

- **Application Owner engagement:** Bottom-Up modelling depends on sustained participation from Application Owners across Datacom to identify and validate service relationships within a tight 5-week window.
- **Data quality:** Existing configuration and application data may be incomplete or inconsistent, requiring cleansing effort before relationships can be accurately established.
- **Top-Down/Bottom-Up alignment:** The two streams must converge; misalignment in taxonomy or service boundaries could delay Run State achievement.

---

## ✅ Next Steps

1. **EA Refresher Session** — Introduce CSDM within ServiceNow, agree approach and scope for enterprise service definition (W/C 23 Feb).
2. **Application Owner kick-off** — Josh Jacobs to begin 1:1 sessions with Application Owners to identify Business Applications and define Application Services (W/C 2 Mar).
3. **Converge streams** — Establish cross-stream relationships linking Application Services to Business Service Offerings (W/C 16 Mar).
4. **Publish and communicate** — Validate models and publish to Service Portfolio by end of March 2026.

---

## 🔑 Close

> Establishing a sustainable CSDM Run State by end of March 2026 — the foundation for automation, AI, reporting, and scalable service management.

CSDM defines how Datacom's internal services are structured, owned, and consumed. By running Top-Down and Bottom-Up modelling in parallel, the project builds a service model that reflects operational reality and enables the ServiceNow platform to deliver its full value.
https://datacomgroup.atlassian.net/wiki/spaces/GITTSP/pages/40525693349
