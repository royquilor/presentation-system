# DMI Tool Integrations Status
> Status of tool integrations required for the Datacom Managing Instance

**Author:** Jessie Gisler
**Date:** 19 February 2026
**Source:** https://datacomgroup.atlassian.net/wiki/spaces/GITTSP/pages/40632287350

---

## 🎯 Context

This document tracks the status of tool integrations required for the DMI (Datacom Managing Instance). It links to the formal ServiceNow Platform Architecture Integration Register (owned by Greg Burns, SN Platform Architect) and includes plugin and story/release set comparison spreadsheets.

---

## 🔍 Problem

DMI must integrate with multiple internal and external tools for continuity. Integration requirements, ownership, and next steps must be clearly tracked to ensure readiness for go-live.

---

## 📋 Observations

**1. Activate Connector**
DMI Integration Required: Yes. Business Owner: Valerie. Next Step: Activate Connector. Critical for self-service and request fulfilment.

**2. xMatters Connector**
DMI Integration Required: Yes. Used for alerting and incident notification. Next step to be confirmed.

**3. BTS Automated Patching Big Fix**
DMI Integration Required: Yes. Business Owner: Ronel. Flexera integration to be understood with Ronel.

**4. Science Logic Connector**
DMI Integration Required: No. None required. N/A.

**5. DEMNZ AD Password Notification**
DMI Integration Required: No. Not required. N/A.

**6. AutoID and Service Alliance integrations**
AutoID (CL M SAPI), Service Alliance/Astea (CL), MyServiceAPI, Service Alliance Track-n-Trace, AutoID Custom API via Jitterbit to ServiceNow—all require validation. Check with CL (Customer/Client).

**7. OOS and Zeus integrations**
OOS SD Survey Manager, AU Zeus, NZ Zeus—all via MyServiceAPI. Check with CL. NZ DNA MyServiceAPI—Nigel McLennan. Big Fix, DCS Portal, Genesys Cloud—MyServiceAPI. Check with CL.

**8. Event management integrations**
MNS xMatters, NZ Spectrum, AU Spectrum, Apollo, Event Management Core, Datacom AWS Alerting—all via MyServiceEventAPI. Check with CL. CrowdStrike—Check with CL.

**9. Integration patterns**
MyServiceAPI and MyServiceEventAPI are key integration patterns. Multiple applications require validation with CL (Customer/Client) or business owners.

**10. Reference documents**
Formal Integration Register: EASAAD space. Plugin comparison: Prod Plugin reconciliation 061225.xlsx. Story/Release Set comparison: sys_update_set_Prod Comparison 21012026.xlsx.

---

## 💡 Proposal

Validate and prioritise integrations required for DMI go-live. Confirm ownership and next steps for each integration.

- Validate Activate Connector with Valerie
- Confirm xMatters, BTS Big Fix, and Flexera with Ronel
- Complete CL validation for AutoID, Service Alliance, MyServiceAPI, and MyServiceEventAPI integrations
- Reference formal Integration Register and comparison spreadsheets for alignment

*Integration readiness is critical for continuity of service and automation.*

---

## ⚠️ Risks

- **CL validation pending:** Multiple integrations require "Check with CL"—delays could impact go-live.
- **Flexera understanding:** BTS Automated Patching Big Fix integration with Flexera needs clarification with Ronel.

---

## ✅ Next Steps

1. **Activate Connector** — Confirm activation with Valerie.
2. **CL validation** — Complete validation for AutoID, Service Alliance, MyServiceAPI, and event management integrations.
3. **Ronel alignment** — Understand Flexera and BTS Big Fix integration requirements.
4. **Integration Register alignment** — Ensure DMI status aligns with formal Platform Architecture Integration Register.

---

## 🔑 Close

> Integration readiness ensures continuity of service and automation for DMI go-live.

Complete validation of tool integrations—especially those pending CL or business owner confirmation—is essential for March 2026 transition readiness.

https://datacomgroup.atlassian.net/wiki/spaces/GITTSP/pages/40632287350
