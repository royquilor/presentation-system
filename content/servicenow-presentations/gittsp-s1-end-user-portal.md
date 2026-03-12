# S1. End User Portal
> DMI internal-branded Employee Center portal for Datacom staff

**Author:** Jessie Gisler
**Date:** 4 March 2026
**Source:** https://datacomgroup.atlassian.net/wiki/spaces/GITTSP/pages/40750055696

---

## 🎯 Context

S1 (CGIDTTS-107) delivers a branded, configured employee portal for Datacom staff with DMI ITSM processes, service catalogue, permissions, training, comms, and adoption metrics in BAU. The portal acts as the front end for Activate and independent requests.

---

## 🔍 Problem

Heavy customisation of Employee Service Center (ESC) creates maintenance strain on every upgrade. Keeping the portal out-of-the-box where possible (branding separate) is ideal. Incident creation is not mapped to taxonomy and is only found by searching "Get IT Support"—positioning and discoverability need design decisions.

---

## 📋 Observations

**1. Portal Principles**
Keep it simple, prioritise user needs, leverage existing widgets before custom builds, ensure accessibility, and test across devices.

**2. Taxonomy**
Universal categorisation applies to catalog items, incident creation (record producer), and knowledge articles. Well-organised taxonomy improves search and adoption. Design for scalability—ESC Pro microsites use the same taxonomy.

**3. Incident Creation**
Record producer is not mapped to taxonomy; users must search "Get IT Support." Design choice: position prominently on ESC or keep portal minimal and rely on search.

**4. Catalog Items**
Decide link vs integration: link to external form, design form in DMI ESC with workflow triggers, or create SN workflows for fulfillers. Consider state sync (e.g. awaiting approval). Prioritise highest-priority catalog items for day one.

**5. Notifications**
Approval requests and record updates are inconsistent—some go to platform view, some to ESC. Alignment recommended for consistent experience.

**6. Future Transformation**
Shift from email to portal logging across internal domains; integrate Virtual Agent; standardise inputs. Impact: reduced ticket volumes, improved time to resolution.

**7. Design Roles**
UI/UX team for layout and design; architectural design to reflect UI/UX; developer to implement workshop requirements.

**8. Widget Review**
Review current ESC widgets—retain needed ones, add others as required.

---

## 💡 Proposal

Deliver a complete build-out with taxonomy population, catalog item creation (growing over time), and Activate integration for redirects. Workshops with UI/UX and taxonomy review will drive design.

- Review and confirm taxonomy (and topics) on DMI ESC
- Revise incident creation positioning for discoverability
- Align notifications to redirect to portal consistently
- Identify highest-priority catalog items and dependencies for day one

*Minimise customisation to reduce upgrade maintenance; maximise OOTB configuration.*

---

## ⚠️ Risks

- **Risk:** Heavy ESC customisation increases maintenance burden on each ServiceNow upgrade.

---

## ✅ Next Steps

1. **Taxonomy** — Review and confirm taxonomy and topics on DMI ESC.
2. **Incident UX** — Decide placement of Get IT Support (prominent vs search-only).
3. **Catalog Items** — Define link vs integration approach and prioritise day-one items.
4. **Notifications** — Align approval and update notifications to portal.

---

## 🔑 Close

> Keep it OOTB where possible; design taxonomy for scalability and adoption.

The portal enables automation, categorisation, and downstream efficiencies. Well-organised taxonomy drives higher adoption and satisfaction. Requirements will be reviewed with the Portal Uplift once live.

https://datacomgroup.atlassian.net/wiki/spaces/GITTSP/pages/40750055696
