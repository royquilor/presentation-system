# DMI CSM Playbooks
> Customer Success Management playbooks for DMI onboarding and transition

**Author:** Sophia Black
**Date:** 26 February 2026
**Source:** https://datacomgroup.atlassian.net/wiki/spaces/GITTSP/pages/40817819687

---

## 🎯 Context

This document defines the DMI CSM (Customer Success Management) playbooks used for onboarding customers onto ServiceNow and transitioning FSD Cherwell customers. Playbooks cover bulk transition, net-new customer onboarding, and ad-hoc task selection.

---

## 🔍 Problem

Standardised playbooks are needed to ensure consistent, repeatable onboarding and transition of customers onto the DMI ServiceNow instance. Without playbooks, each transition risks inconsistency, delays, and missed configuration steps.

---

## 📋 Observations

**1. Bulk Transition playbook**
Use case: FSD Cherwell to ServiceNow Transition customers. Standard playbook for migrating existing Cherwell customers to ServiceNow.

**2. Bulk Transition - Child Customer playbook**
Use case: FSD Cherwell to ServiceNow Transition customers with child customers. Handles parent-child customer hierarchy during bulk transition.

**3. Net New Customer playbook**
Use case: Onboarding new customers onto ServiceNow. For customers not transitioning from Cherwell.

**4. Net New - Child Customer playbook**
Use case: Onboarding new customers' subsidiaries onto ServiceNow. Handles subsidiary onboarding under parent accounts.

**5. Ad-hoc playbook**
Use case: Select task(s) from the net-new onboarding playbook. Allows partial or selective execution of onboarding tasks.

**6. Ad-hoc configuration tasks**
Tasks available for ad-hoc selection: Configure Portal Branding; Configure Email Branding; Import customer users and contacts; Load location data; Load Sold Products; Configure 3 Non Response Process; Configure standard SLAs; Configure Incident Management; Configure Change Management.

**7. Playbook coverage**
Four main playbooks cover bulk transition (with and without child customers) and net-new (with and without child customers). Ad-hoc enables flexible task selection.

**8. FSD alignment**
Playbooks align with FSD (Future State Delivery) programme for Cherwell to ServiceNow transition and net-new customer onboarding.

---

## 💡 Proposal

Use standardised CSM playbooks for all DMI customer onboarding and transition activities. Select the appropriate playbook based on customer type (bulk transition vs net-new) and structure (with or without child customers).

- Apply Bulk Transition playbook for FSD Cherwell customers
- Apply Net New playbook for new customers
- Use Ad-hoc playbook for selective task execution when full playbook not required

*Standardised playbooks ensure consistent, repeatable onboarding and reduce transition risk.*

---

## ⚠️ Risks

- **Child customer complexity:** Bulk Transition - Child Customer and Net New - Child Customer require careful handling of hierarchy and data.
- **Ad-hoc misuse:** Overuse of ad-hoc without full playbook execution could leave gaps in configuration.

---

## ✅ Next Steps

1. **Playbook validation** — Validate playbooks against current FSD transition experience and update as needed.
2. **Training** — Ensure CSM team and implementers are trained on playbook selection and execution.
3. **Documentation** — Maintain playbook documentation with lessons learned from transitions.

---

## 🔑 Close

> Standardised playbooks ensure consistent, repeatable onboarding for DMI customers.

The DMI CSM playbooks provide a structured approach for bulk transition and net-new customer onboarding, supporting the FSD programme and DMI scale-out.

https://datacomgroup.atlassian.net/wiki/spaces/GITTSP/pages/40817819687
