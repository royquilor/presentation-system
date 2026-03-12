# Agent Library Admin Panel – Reports Dashboard Test Plan

> A Tier 3 smoke test plan verifying data accuracy, access control, and responsive layout for the five report sections (Submissions, Users, Categories, Ratings, Approvals) on the Agent Library Reports Dashboard.

**Author:** [Kieran Sinclair](https://datacomgroup.atlassian.net/wiki/people/712020:d27c0be8-1ddb-42c4-bb80-4fc81b65bb0d)
**Date:** 28 November 2025
**Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40468283393

---

## 🎯 Context

The Agent Library admin panel (Insights & Analytics, QA & Testing workstream) includes a Reports Dashboard that surfaces real-time analytics across agents, prompts, users, categories, ratings, and approval workflows. This plan, linked to Jira ticket DAAAT-126 and authored by Kieran Sinclair, validates that each report section correctly reflects live data changes and is accessible only to administrators.

---

## 🔍 Problem

Aggregate statistics dashboards can silently display stale or incorrect counts if the underlying data queries are not wired correctly to creation, approval, rejection, and deletion events. This test plan establishes baseline data accuracy by performing controlled create/approve/reject/delete actions and verifying that each report section updates on refresh.

---

## 📋 Observations

- **Access control verified:** Admins can access `/reports`; regular users receive "Access denied" when navigating directly to the URL.
- **Submissions report behaviour:** Total agent/prompt counts increment when a new item is submitted and decrement only when a pending item is withdrawn (not when it is rejected — rejections increase the rejected count but do not reduce the total). This counter logic was documented as a nuance rather than a defect.
- **Users report:** Total Users and Regular Users counts increment and decrement correctly in response to user creation and deletion.
- **Categories report:** Creating a category increments "Approved"; deleting it moves the count from "Approved" to "Deleted" — both verified as correct.
- **Ratings report:** Total Ratings and Average Rating update correctly when ratings are added; the distribution bar chart responds to mixed ratings (5-star and 1-star tested). The tester flagged that a combined agent+prompt ratings report is of limited value and recommended splitting into two separate reports.
- **Approvals report:** Approved/Pending/Rejected counts and average processing times update correctly on approval and rejection actions.
- **Responsive layout:** Multi-column grid layout works correctly on both 1080p and 1440p desktops; cards stack vertically on mobile (iPhone viewport ~375px) — both confirmed working.
- **Error handling:** Throttling to "Offline" in DevTools Network tab produced no concerning behaviour.

---

## 💡 Proposal

Execute a data-driven smoke test that performs concrete create/approve/reject/delete actions across all five report domains, refreshes the dashboard after each action, and verifies that the relevant counters change by exactly ±1. Each section is tested independently in sequence, with the full test estimated to take under 10 minutes. Responsive layout and basic error handling are verified as quick spot-checks at the end.

---

## ⚠️ Risks

- **Combined Ratings report:** Merging agent and prompt ratings into a single report reduces actionability for admins — this is a design gap identified during testing that should be addressed in a future iteration.
- **Withdrawal-only total reduction:** The total agent/prompt count never decreases for rejected items, only for withdrawals — this may be unintuitive to admins expecting a "current active submissions" count.
- **No loading/skeleton state testing:** Loading states and empty state UX are explicitly out of scope for Tier 3 but could affect perceived reliability.
- **Partial API failure behaviour not tested:** If one of the five report sections fails to load data, the dashboard's degraded state is unknown.
- **Performance benchmarking skipped:** With large datasets, aggregation queries could be slow; no performance baseline was established.

---

## ✅ Next Steps

- **Enhancement:** Split the Ratings report into separate Agent Ratings and Prompt Ratings sections to improve analytical utility.
- **Documentation:** Clarify in the UI (e.g., tooltip) that the total count decreases only on withdrawal, not on rejection, to avoid admin confusion.
- **Test:** Conduct an empty-state test pass (fresh environment with no data) to verify that each report section renders gracefully with zero counts.
- **Test:** Simulate a partial API failure (mock one report endpoint failing) to understand and improve the degraded-state experience.
- **Performance:** Establish a performance baseline for the Reports Dashboard with a realistic data volume (e.g., 1,000+ agents, 500+ users).

---

## 🔑 Close

All five report sections accurately reflect live data changes and the dashboard is properly access-controlled — the main actionable finding is the recommendation to split the combined Ratings report for improved admin utility.

---

📌 **Document Type:** Test Plan (Tier 3 Smoke Test)
📅 **Last Updated:** 28 November 2025
🔗 **Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40468283393
