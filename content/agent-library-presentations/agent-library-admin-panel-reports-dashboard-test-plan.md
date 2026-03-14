# Agent Library Admin Panel – Reports Dashboard Test Plan

> A Tier 3 smoke test plan verifying data accuracy, access control, and responsive layout for the five report sections on the Agent Library Reports Dashboard.

**Author:** Kieran Sinclair
**Date:** 28 November 2025
**Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40468283393

---

## 🎯 Context

The Agent Library admin panel (Insights & Analytics, QA & Testing workstream) includes a Reports Dashboard that surfaces real-time analytics across agents, prompts, users, categories, ratings, and approval workflows. This plan validates that each report section correctly reflects live data changes and is accessible only to administrators. Linked to Jira ticket DAAAT-126.

---

## 🔍 Problem

Aggregate statistics dashboards can silently display stale or incorrect counts if the underlying data queries are not wired correctly to creation, approval, rejection, and deletion events. This test plan establishes baseline data accuracy by performing controlled create/approve/reject/delete actions and verifying that each report section updates on refresh.

---

## 📋 Observations

**1. Access Control**

Admin login and navigation to `/reports` loads the page correctly. Regular users attempting direct URL access receive a clear "Access denied" message.

**2. Submissions Report – Total Count Logic**

Total agent count increases when a new agent is submitted (pending). It decreases only when a pending agent is withdrawn — not when rejected. Rejected items increase the rejected count but do not reduce the total. Requesting to share a new agent increments the pending count; withdrawing that agent decrements it back.

**3. Submissions Report – Approval Flow**

Approving a pending agent decreases "Agents Pending" by 1 and increases "Agents Approved" by 1. Creating a new prompt (pending) increases "Total Prompts" by 1. Deleting that prompt decreases "Prompts Pending" by 1.

**4. Users Report**

Total Users and Regular Users counts increment and decrement correctly in response to user creation and deletion. Administrators count is tracked separately.

**5. Categories Report**

Creating a category increments "Approved" by 1. Deleting that category moves the count from "Approved" to "Deleted" — both verified as correct.

**6. Ratings Report – Distribution Chart**

Total Ratings and Average Rating update correctly when ratings are added. The distribution bar chart responds to mixed ratings (5-star and 1-star tested). The tester recommended splitting the combined agent+prompt ratings report into two separate reports for improved analytical utility.

**7. Approvals Report**

Approved, Pending, and Rejected counts update correctly on approval and rejection. Average processing times also reflect changes. Optional rejection test confirms "Rejected" increases and "Pending" decreases.

**8. Responsive Layout**

Multi-column grid layout works on 1080p and 1440p desktops. Cards stack vertically on mobile (iPhone viewport ~375px) — both confirmed working.

**9. Error Handling**

Throttling to "Offline" in DevTools Network tab produced no concerning behaviour. Error indication appears on reload when offline.

---

## 💡 Proposal

Execute a data-driven smoke test that performs concrete create/approve/reject/delete actions across all five report domains, refreshes the dashboard after each action, and verifies that the relevant counters change by exactly ±1. Each section is tested independently in sequence, with the full test estimated to take under 10 minutes.

---

## 📋 Test Categories (Flex Section)

**1. Access Control (30s)** — Admin login loads `/reports`; regular user gets "Access denied" on direct URL access.

**2. Submissions Report (2 min)** — Note initial counts; create pending Agent → Refresh → Total Agents +1; approve → Pending −1, Approved +1; create pending Prompt → Total Prompts +1; delete Prompt → Pending −1.

**3. Users Report (1 min)** — Note Total/Admin/Regular; create user → both +1; delete → both −1.

**4. Categories Report (1 min)** — Note Approved/Deleted; create category → Approved +1; delete → Deleted +1, Approved −1.

**5. Ratings Report (1 min)** — Note Total/Average; add 5-star → Total +1; add 1-star → Total +1, Average decreases; verify distribution bar chart updates.

**6. Approvals Report (1 min)** — Note Approved/Pending/Rejected; approve item → Approved +1, Pending −1; (optional) reject → Rejected +1, Pending −1.

**7. Responsive Layout (30s)** — Desktop 1920x1080: grid layout; mobile ~375px: cards stack vertically.

**8. Error Handling (1 min)** — Dev Tools → Network → Offline → Reload → error indication appears.

---

## 📋 Report Types & Data Validation (Flex Section)

**1. Submissions** — Agents Pending/Approved/Rejected; Prompts Pending/Approved/Rejected; Total Agents; Total Prompts.

**2. Users** — Total Users; Administrators; Regular Users.

**3. Categories** — Approved; Deleted.

**4. Ratings** — Total Ratings; Average Rating; distribution bar chart (verify updates on 5-star and 1-star additions).

**5. Approvals** — Approved; Pending; Rejected; Average processing times.

---

## 📋 Chart Rendering Tests (Flex Section)

**1. Ratings Distribution Bar Chart** — Verify chart updates when a new 5-star rating is added; verify chart updates when a 1-star rating is added; confirm distribution reflects mixed rating levels on both agents and prompts.

---

## 📋 Export Tests (Flex Section)

**1. Out of Scope** — The current Tier 3 smoke test does not cover export functionality (e.g., CSV/PDF export of report data). Export tests would be a future enhancement if such features are added to the Reports Dashboard.

---

## 📋 Completeness Check (Flex Section)

**Now Testing:** Access control; all reports display correctly; data accuracy and real-time refresh for all 5 reports; basic responsive design; basic error handling.

**Still Not Covered (Acceptable for Tier 3):** Loading states / skeleton loaders; empty state UX; partial API failure behaviour; exact mobile breakpoints; performance benchmarking.

---

## ⚠️ Risks

**Combined Ratings report** Merging agent and prompt ratings into a single report reduces actionability for admins — this is a design gap identified during testing that should be addressed in a future iteration.

**Withdrawal-only total reduction** The total agent/prompt count never decreases for rejected items, only for withdrawals — this may be unintuitive to admins expecting a "current active submissions" count.

**No loading/skeleton state testing** Loading states and empty state UX are explicitly out of scope for Tier 3 but could affect perceived reliability.

**Partial API failure behaviour not tested** If one of the five report sections fails to load data, the dashboard's degraded state is unknown.

**Performance benchmarking skipped** With large datasets, aggregation queries could be slow; no performance baseline was established.

---

## ✅ Next Steps

1. **Enhancement** — Split the Ratings report into separate Agent Ratings and Prompt Ratings sections to improve analytical utility.
2. **Documentation** — Clarify in the UI (e.g., tooltip) that the total count decreases only on withdrawal, not on rejection, to avoid admin confusion.
3. **Test** — Conduct an empty-state test pass (fresh environment with no data) to verify that each report section renders gracefully with zero counts.
4. **Test** — Simulate a partial API failure (mock one report endpoint failing) to understand and improve the degraded-state experience.
5. **Performance** — Establish a performance baseline for the Reports Dashboard with a realistic data volume (e.g., 1,000+ agents, 500+ users).

---

## 🔑 Close

> All five report sections accurately reflect live data changes and the dashboard is properly access-controlled — the main actionable finding is the recommendation to split the combined Ratings report for improved admin utility.

---

📌 **Document Type:** Test Plan (Tier 3 Smoke Test)
📅 **Last Updated:** 28 November 2025
🔗 **Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40468283393
