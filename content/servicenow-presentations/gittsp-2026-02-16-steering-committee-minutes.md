# 2026-02-16 Steering Committee Minutes
> Group IT Transition to ServiceNow – Critical path feedback, resolver workshops, ITOM, and Zero Touch

**Author:** Jessie Gisler
**Date:** 16 February 2026
**Source:** https://datacomgroup.atlassian.net/wiki/spaces/GITTSP/pages/40771420408

---

## Context

Steering committee meeting for the Group IT Transition to ServiceNow project. Present: Shawn Sutton, Joe Thornley, Sumindre Gunawardane, Clinton Cooper, Julian Buckley, Jason Chau, Jessie Gisler, Jonathan Lim, Matt Shepheard. Absent: Taumasina Keil, Josh Jacobs. Project status Green. The meeting covered critical path feedback from FSD, resolver team discovery workshops, ITOM progress, Zero Touch Service Desk, and architectural considerations for DMI vs MSP assets.

---

## Problem

FSD Programme board raised timing and capacity risk: ensuring Datacom internal go-live does not clash with peak customer transition periods where the same support and resolver teams are required. The committee needed to address de-coupling Datacom DMI Go-Live from the May Customer Tranche, clarify ITOM gaps and cloud discovery scope, and define Zero Touch Service Desk for Datacom Corporate. Architectural questions on private cloud, data centres, and co-shared assets (DMI vs MSP) required resolution.

---

## Observations

**1. Critical Path and Indicative Delivery Timeline – FSD Feedback**
Plan socialised with Logic Monitor Implementation and FSD Team. FSD Programme board feedback: Timing and capacity risk—ensure Datacom internal go-live does not clash with peak customer transition periods where same support and resolver teams are required; intention to follow demand process, with End User Portal Initiative already raised. Early visibility of development demand—gain line-of-sight on additional configuration or development demand from internal transition (end-user portal, knowledge, reporting) so it can be planned alongside customer priorities. Service modelling—internal services model should not affect or disrupt MSP customer services or future Product-based service work; no impact; FSD will need to plan to ensure updates do not negatively impact DMI delivery. Next steps: Jessie to work with Gemma Goldsmith on a RACI for Transition to address de-coupling Datacom DMI Go-Live from the May Customer Tranche. Considerations: MSP Domain build-out with leveraged teams group set up, persona group types; readiness or leveraged team member training and onboarding as part of Tranche 10 existing activities; Hypercare; ServiceNow Platform Upgrade to Australia Release.

**2. Resolver Team Current State Discovery Workshops**
Workshops held last week; 42 Resolver Team Leads and Members attended. Focus: baselining current state across people, processes, and tools; how teams operate; which tools used within and alongside ServiceNow; current state of knowledge management including storage locations, formats, and access. Feedback highly positive; strong endorsement of interactive workshop-based approach over traditional email-based information gathering. Outputs consolidated to inform future-state design including CSDM structure, access models, and required process changes. Several areas identified for targeted deep dives: Change, Asset Management, and CMDB (most significant areas of change, highest discussion).

**3. ITOM Discovery Session**
Discovery session showcased mid-server deployment, existing agents, network device discovery, and early views of cloud discovery across Azure and AWS. Initial visibility of Datacom Corporate assets demonstrated. Gaps: current discovery does not yet provide full end-to-end visibility across all Datacom Corporate environments, limiting higher-value service mapping; configuration and asset management processes require adjustment to align with Datacom Corporate requirements rather than mirroring customer-side standards. Cloud discovery scope remains to be finalised: which cloud resources in scope, ownership responsibilities, coverage expectations. Integration of ITOM outputs with services modelling and CMDB highlighted as critical dependency for downstream service views and relationship mapping. Next steps: Integrate Zeus to populate Datacom Corporate; progress Configuration Management approach—preference for Mark Smith to align with SACM Team’s built processes; confirm cloud discovery scope—finalise list of cloud resources to be discovered (Josh Jacobs working with Sachin and team).

**4. Zero Touch Service Desk**
Shawn raised the drive toward Zero Touch Service Desk with Front-End Automation; what does this mean for this project? Joe Thornley to share existing Zero Touch/Front-End Automation materials and decks. Jessie to align with Persis and review existing definitions and use cases. Project team to develop clear definition and phased view of Zero Touch Service Desk for Datacom Corporate use.

**5. Private Cloud, Data Centres, and Co-Shared Assets (DMI vs MSP)**
Multiple members raised architectural questions. Datacom-owned assets should exist primarily in DMI. Customer visibility should be achieved via service propagation, not asset duplication where possible. For some co-shared assets, parallel CIs may exist in DMI and MSP (no sync currently). Approach must not compromise ITOM, LogicMonitor, or service mapping outcomes. Citizen developer access vs central control flagged as risk area. Jessie to feed raised architectural considerations back to Greg for inclusion in solution design.

**6. ITOM Licensing**
ITOM Pro licensing numbers inconsistent across sources (order vs CMDB vs assumptions). DCS scope may materially impact licence requirements. Licensing must align with agreed asset and discovery model. Validate licence counts against actual CI scope.

---

## Proposal

- Jessie to work with Gemma Goldsmith on RACI for Transition to de-couple Datacom DMI Go-Live from May Customer Tranche.
- Integrate Zeus for Datacom Corporate; align Configuration Management with SACM Team (Mark Smith).
- Project team to develop clear definition and phased view of Zero Touch Service Desk.
- Jessie to feed architectural considerations (DMI vs MSP, service propagation) to Greg for solution design.
- Validate ITOM Pro licence counts against actual CI scope.

---

## Risks

- **Timing and capacity:** Datacom go-live may clash with peak customer transition; RACI needed to de-couple.
- **ITOM visibility:** Full end-to-end visibility not yet achieved; cloud discovery scope to be finalised.
- **ITOM licensing:** Inconsistent numbers; DCS scope may materially impact requirements.
- **Citizen developer vs central control:** Risk area for architecture.

---

## Next Steps

1. **FSD Benefits** — Jason Chau: Share reviewed FSD Benefits when available.
2. **Mark Smith, SACM, FSD CMDB Alignment** — Jessie Gisler: Set up meeting between Mark Smith, SACM team and FSD CMDB Process SME to align on configuration and asset management approach for Datacom Corporate, including alignment with CMDB standards.
3. **Application-based Services Modelling** — Jessie Gisler: Circulate Approach to Application-based Services Modelling.
4. **Zero Touch Definitions** — Jessie Gisler: Align with Persis and review existing definitions and use cases; develop clear definition and phased view of Zero Touch Service Desk for Datacom Corporate use.
5. **Architectural Considerations** — Jessie Gisler: Feed raised architectural considerations back to Greg for inclusion in solution design.

---

## Close

> RACI for Transition to de-couple go-live; Zero Touch definition and ITOM alignment to progress.

The committee supported the resolver workshop approach and endorsed next steps for ITOM, Zero Touch, and architectural clarity. FSD feedback on timing and capacity to be addressed via RACI with Gemma Goldsmith.

https://datacomgroup.atlassian.net/wiki/spaces/GITTSP/pages/40771420408
