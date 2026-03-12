# Problem Statement: Datacom in DMI ServiceNow
> DMI Corporate Entity and Operating Model Definition for Datacom

**Author:** Greg Burns
**Date:** 2 March 2026
**Source:** https://datacomgroup.atlassian.net/wiki/spaces/GITTSP/pages/40675704883

---

## 🎯 Context

Datacom operates across multiple regions, subsidiaries, and service models, but there is no single, unified definition of how Datacom as a corporate group will be structured, represented, and governed within the DMI (Datacom Managed Instance) platform. This document articulates the problem and the role of DMI, architectural principles, core capabilities, and governance.

---

## 🔍 Problem

Existing environments such as Cherwell contain 84+ organisational entities spanning countries, business lines, and operational teams. This has resulted in fragmented data models, inconsistent operational processes, uncertainty about whether subsidiaries should be ringfenced or consolidated, and challenges aligning to the DMI dual-instance architecture (MSP vs internal). Without a clear definition, Datacom risks carrying forward legacy structures, duplications, and inefficiencies into DMI.

---

## 📋 Observations

**1. Scale of fragmentation**
84+ organisational entities in Cherwell spanning countries, business lines, and operational teams. Fragmented data models, inconsistent processes, uncertainty on subsidiary treatment (ringfenced vs consolidated).

**2. Role of DMI**
DMI is Datacom's enterprise ServiceNow platform for Corporate/Group IT functions and support processes; internal services and operations (Infrastructure Products LoB); acting as "customer" to MSP instance for certain managed services; hosting internal CMDB, Service Catalogue, Knowledge base, Case/Incident/Request management, Change management; sandbox and capability development for innovation and best-practice demonstration—"customer zero" and showcase instance.

**3. Horizon 1 FSD objective**
Replace Cherwell for Corporate IT services; implement ITOM Discovery internally; apply ServiceNow best-practice patterns.

**4. Instance boundaries**
DMI is separate from MSP. Holds Datacom internal organisational data: employees as users, corporate accounts, services, offerings, SLAs, internal workflows, cases, requests, incidents. Integrates with MSP where Datacom is both provider and consumer (Service Bridge). DMI treated as "Customer" instance with respect to MSP.

**5. Data segregation**
Customer Security Domain (CSD), aka Internal Business Location, is logical container controlling access to data related to internal or external account within DMI. Originally built for data segregation in non-Domain separated instance. Intent for CSD should have been limited to CSM product—confirmation of further impact into non-CSM products needs to be addressed.

**6. Core process capabilities**
Case Management (entry point, SLAs at Case level); Incident/Problem/Change/Service Request Management; Service Catalogue Management; Knowledge Management; CMDB/Asset Management (ITOM Discovery, Integration Hub ETL, manual load; Asset Table separated from CIs); Service Level Management and OLAs; Integrations (EDW, EntraID, monitoring tools); Portals and Workspaces (DMI Employee Centre, CSM Portal); Orchestration and Automation; Analytics and Reporting.

**7. Governance**
Platform Owner role has day-to-day accountability for instance health, configuration baselines, upgrades, guardrails. Design Authority ensures adherence to ServiceNow best-practice and FSD design principles. Minimise customisation; favour configuration. Maintain single source of truth CMDB internally; federate customer CI data from MSP only where necessary.

**8. Next steps required**
Identify appropriate grouping and representation of Datacom's legal entities; ensure consistency, compliance, operational efficiency; support scalable onboarding, reporting, financial alignment, customer engagement.

---

## 💡 Proposal

Define a clear, agreed architectural definition for how Datacom's corporate structure, subsidiaries, teams, and geographies will be modelled, governed, and operated within DMI. Address CSD scope and dual-instance governance.

- Define corporate entity and operating model for DMI
- Confirm CSD scope and impact on non-CSM products
- Publish integration and governance pattern for DMI-MSP relationship
- Establish Platform Owner and Design Authority governance

*Without this definition, Datacom risks compromising the strategic value and cohesion of the new platform.*

---

## ⚠️ Risks

- **Legacy carry-forward:** 84+ entities could be carried forward without rationalisation, perpetuating fragmentation.
- **CSD scope:** CSD impact on non-CSM products not yet confirmed—could affect access and data segregation design.
- **Dual-instance complexity:** DMI as "customer" to MSP requires clear integration and governance patterns.

---

## ✅ Next Steps

1. **Entity definition** — Identify appropriate grouping and representation of Datacom's legal entities.
2. **CSD confirmation** — Confirm CSD impact on non-CSM products.
3. **Governance pattern** — Publish integration and governance pattern for DMI-MSP.
4. **Subsidiary decision** — Decide ringfenced vs consolidated approach for subsidiaries.

---

## 🔑 Close

> "Without this definition, Datacom risks carrying forward legacy structures, duplications, and inefficiencies into DMI—compromising the strategic value and cohesion of the new platform."

A clear corporate entity and operating model definition is foundational for DMI success and scalability.

https://datacomgroup.atlassian.net/wiki/spaces/GITTSP/pages/40675704883
