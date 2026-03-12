# Agent Library Admin Panel – Audit Dashboard Test Plan

> A Tier 3 smoke test plan verifying the Audit Dashboard's access control, data display, filter functionality, pagination, CSV export, mobile responsiveness, and real-time log accuracy.

**Author:** [Kieran Sinclair](https://datacomgroup.atlassian.net/wiki/people/712020:d27c0be8-1ddb-42c4-bb80-4fc81b65bb0d)
**Date:** 3 December 2025
**Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40469921930

---

## 🎯 Context

The Agent Library admin panel (Insights & Analytics, QA & Testing workstream) includes an Audit Dashboard that records admin actions such as agent approvals and rejections. This test plan, linked to Jira ticket DAAAT-124 and authored by Kieran Sinclair, covers smoke testing of the dashboard against both desktop and mobile viewports using one admin and one regular user account.

---

## 🔍 Problem

The Audit Dashboard is a critical governance tool — it must accurately reflect all admin actions, be accessible only to administrators, and provide reliable filtering and export capabilities. Any defects in date handling, filter logic, or access control could undermine audit integrity and compliance.

---

## 📋 Observations

- **Access control verified:** Admin users can access the dashboard; regular users see "Access denied" — both behaviours confirmed as expected.
- **Default state:** The dashboard loads with the last 30 days of logs, displays a total record count, and renders all six columns (Timestamp, Action, Admin User, Target, Result, Reason) with colour-coded action badges.
- **All filters passed:** Action filter, Target Type filter, Admin User combobox (with search), and Date Range pickers (with calendar UI) all work correctly in isolation and in combination. The "Clear Filters" button resets all filters as expected. Future dates are greyed out in the date picker.
- **Known issue — timezone mismatch:** When testing real-time log creation, a prompt rejection did not appear in filtered results because the admin panel's default date range did not include "today" due to a timezone discrepancy between the admin panel clock and the NZ local time — flagged as a defect.
- **Known issue — date range persistence:** The dashboard resets to the same default date range on every page refresh rather than persisting the last-used range.
- **CSV export works correctly:** Filtered results are exported, all columns are present, and exported data matches the table display.
- **Pagination works:** Next/Previous navigation and page number updates function correctly.
- **Mobile responsiveness:** The table converts to a card-based layout on mobile (375×667), cards stack vertically with all fields visible, and no horizontal page scrolling occurs.

---

## 💡 Proposal

Conduct a structured 7-section smoke test covering access control, default state verification, all four filter types, pagination, CSV export, mobile responsiveness, and a live data verification test (perform an action that generates an audit log, then confirm it appears in the dashboard). The test is designed to take approximately 10–15 minutes with pre-seeded audit log data and two user accounts available.

---

## ⚠️ Risks

- **Timezone defect:** The admin panel time not aligning with NZ local time prevents "today's" logs from being visible under the default 30-day date range — this is a data integrity risk for auditors who expect to see recent actions immediately.
- **JSON export not tested:** Only CSV export was verified; JSON export behaviour is assumed similar but unconfirmed.
- **No edge-case testing:** Empty states, very large date ranges, and performance with 1,000+ log entries are explicitly out of scope for Tier 3.
- **Exact mobile breakpoints not tested:** The plan validates visual behaviour at 375px but does not test intermediate breakpoints.
- **No deep accessibility testing:** Screen reader behaviour and colour contrast of action badges (green/red) are out of scope.

---

## ✅ Next Steps

- **Fix:** Investigate and resolve the timezone discrepancy between the admin panel and NZ local time so that actions performed today are immediately visible under the default date range.
- **Fix/Enhancement:** Consider persisting the last-used date range across page refreshes rather than always resetting to the last 30 days.
- **Test:** Verify JSON export functionality in a follow-up test pass.
- **Test:** Conduct an edge-case pass covering empty states and large dataset performance when sufficient test data is available.
- **Monitor:** After the timezone fix, re-run the data verification test (Section 7) to confirm end-to-end log accuracy.

---

## 🔑 Close

The Audit Dashboard is functionally sound across filtering, pagination, CSV export, and mobile layout — however, the timezone mismatch causing "today's" actions to be invisible by default is a significant audit integrity issue that must be resolved before the dashboard can be relied upon for real-time governance.

---

📌 **Document Type:** Test Plan (Tier 3 Smoke Test)
📅 **Last Updated:** 3 December 2025
🔗 **Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40469921930
