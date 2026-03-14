# Agent Library Admin Panel – Audit Dashboard Test Plan

> A Tier 3 smoke test plan verifying the Audit Dashboard's access control, data display, filter functionality, pagination, CSV export, mobile responsiveness, and real-time log accuracy.

**Author:** Kieran Sinclair
**Date:** 3 December 2025
**Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40469921930

---

## 🎯 Context

The Agent Library admin panel (Insights & Analytics, QA & Testing workstream) includes an Audit Dashboard that records admin actions such as agent approvals and rejections. This test plan, linked to Jira ticket DAAAT-124, covers smoke testing of the dashboard against both desktop and mobile viewports. The dashboard is a critical governance tool for tracking agent approve/reject and prompt approve/reject actions.

---

## 🔍 Problem

The Audit Dashboard must accurately reflect all admin actions, be accessible only to administrators, and provide reliable filtering and export capabilities. Any defects in date handling, filter logic, or access control could undermine audit integrity and compliance. A timezone mismatch was discovered during testing: actions performed today (NZ time) did not appear in the default date range because the admin panel clock differs from NZ local time.

---

## 📋 Observations

**1. Access Control Verified**

Admin users can access the dashboard; regular users see "Access denied" — both behaviours confirmed as expected. Test requires 1 Admin user (e.g. kieran.sinclair@datacom.co.nz) and 1 Regular/Agent user for access denial verification.

---

**2. Default State and Data Display**

The dashboard loads with the last 30 days of logs. Start Date is ~30 days ago, End Date is today. Total count displays "(X total)" above the table. All six columns present: Timestamp, Action, Admin User, Target, Result, Reason. Action badges display with colours (e.g. "agent approve" in green, "agent reject" in red). Timestamps display in readable format (e.g. "Nov 27, 2025, 5:16 PM"). Each page refresh defaults to the same date range.

---

**3. All Filters Passed**

Action filter, Target Type filter, Admin User combobox (with search), and Date Range pickers all work correctly in isolation and in combination. The "Clear Filters" button resets all filters. Future dates are greyed out in the date picker. Combined filters (Action + Target) work together.

---

**4. Known Issue — Timezone Mismatch**

When testing real-time log creation, a prompt rejection did not appear in filtered results. The admin panel's default date range did not include "today" due to a timezone discrepancy between the admin panel clock and NZ local time. The tester was unable to select today's date (1 Dec). Flagged as a defect.

---

**5. Known Issue — Date Range Persistence**

The dashboard resets to the same default date range on every page refresh rather than persisting the last-used range.

---

**6. CSV Export Works Correctly**

Filtered results are exported. All columns present (Timestamp, Action, Admin User, Target, Result, Reason). Exported data matches the table display.

---

**7. Pagination and Mobile Responsiveness**

Next/Previous navigation and page number updates function correctly. On mobile (375×667), the table converts to a card-based layout; cards stack vertically with all fields visible; no horizontal page scrolling. Export buttons remain accessible.

---

## 💡 Proposal

Conduct a structured 7-section smoke test covering access control, default state verification, all four filter types, pagination, CSV export, mobile responsiveness, and a live data verification test. The test is designed to take approximately 10–15 minutes with pre-seeded audit log data and two user accounts available.

---

## Test Categories (Flex Section)

**1. Access Control (30 seconds)**

- Login as Admin → Navigate to Audit Dashboard → Page loads
- Login as Regular User → Attempt to access Audit page → "Access denied" message displays

---

**2. Default State and Data Display (1 minute)**

- Page loads with audit logs in table format
- Default date range: Last 30 days (Start Date ~30 days ago, End Date today)
- Total count displayed above table
- All columns present: Timestamp, Action, Admin User, Target, Result, Reason
- Action badges display with colours
- Timestamps in readable format (e.g. "Nov 27, 2025, 5:16 PM")

---

**3. Filter Functionality (3 minutes)**

- Action dropdown: Select "agent approve" → Table shows only agent approve logs
- Target Type dropdown: Select "agent" → Table shows only agent-related logs
- Admin User combobox: Type/search (e.g. "kieran") → Select user → Table shows only that user's actions
- Date Range: Calendar icon opens date picker; select date → Table updates; future dates greyed out
- Clear Filters: All filters reset, table shows all logs again

---

**4. Pagination (1 minute)**

- Click "Next" → Table shows next page of results
- Page number updates correctly
- Click "Previous" → Returns to previous page

---

**5. CSV Export (1 minute)**

- Apply filter (e.g. Action = "agent approve")
- Click "Export CSV" → CSV file downloads
- Verify: Only filtered results exported; all columns present; data matches table

---

**6. Mobile Responsiveness (2 minutes)**

- Desktop (1920×1080): Filters horizontal; table with all columns; Export buttons (CSV & JSON) visible
- Mobile (375×667): Filters stack vertically or collapse; table converts to card-based layout; each log is a card; all info visible; no horizontal scrolling

---

**7. Data Verification Test (2 minutes)**

- Perform action that generates audit log (e.g. approve an agent)
- Return to Audit Dashboard → Refresh
- New log appears at top with: Current timestamp, Correct action badge, Your admin user name, Correct target, Correct result
- Apply filter (e.g. by username) → Log appears in filtered results

---

## Audit Event Types and Expected Results

- **agent approve** — Green badge; target = agent name/ID; result recorded
- **agent reject** — Red badge; target = agent name/ID; result recorded
- **prompt approve** — Badge displayed; target = prompt; result recorded
- **prompt reject** — Badge displayed; target = prompt; result recorded

---

## Pass/Fail Criteria

- **Pass:** Page loads, filters work, data displays correctly, export matches table, mobile layout renders, access denied for non-admin
- **Fail:** Access control bypass, missing columns, filters not applying, export data mismatch, timezone prevents today's logs from appearing, horizontal scroll on mobile

---

## Before Testing Prerequisites

- **Users:** 1 Admin user (e.g. kieran.sinclair@datacom.co.nz), 1 Regular/Agent user for access denial test
- **Browser:** Chrome with Device Toolbar for mobile testing
- **Test Viewports:** Desktop 1920×1080, Mobile 375×667
- **Data State:** Ensure some audit logs exist with varied actions (agent approve/reject, prompt approve/reject)

---

## Completeness Check — Covered

- Admin-only access
- All filters work (Action, Target Type, Admin User, Date Range)
- Date picker validation (no future dates)
- Clear Filters functionality
- Pagination
- CSV export with filters applied
- Mobile responsiveness (table → cards)
- Data accuracy (logs display correctly)
- Action badges and timestamps

---

## Completeness Check — Not Covered (Acceptable for Tier 3)

- Export JSON functionality (CSV tested, JSON assumed similar)
- All possible filter combinations (spot-checked key ones)
- Edge cases (empty states, very large date ranges, performance with 1000+ logs)
- Exact mobile breakpoints
- Deep accessibility testing

---

## Jira Reference

- **Ticket:** DAAAT-124
- **Board:** DAAAT project, board 8766
- **Space:** Insights & Analytics → AI Projects → Active → Agent Library → Agent Lib QA & testing

---

## ⚠️ Risks

**Timezone defect** — The admin panel time not aligning with NZ local time prevents "today's" logs from being visible under the default 30-day date range. This is a data integrity risk for auditors who expect to see recent actions immediately.

**JSON export not tested** — Only CSV export was verified; JSON export behaviour is assumed similar but unconfirmed.

**No edge-case testing** — Empty states, very large date ranges, and performance with 1,000+ log entries are explicitly out of scope for Tier 3.

**Exact mobile breakpoints not tested** — The plan validates visual behaviour at 375px but does not test intermediate breakpoints.

**No deep accessibility testing** — Screen reader behaviour and colour contrast of action badges (green/red) are out of scope.

---

## ✅ Next Steps

1. **Fix timezone** — Investigate and resolve the timezone discrepancy between the admin panel and NZ local time so that actions performed today are immediately visible under the default date range.

2. **Fix/Enhancement** — Consider persisting the last-used date range across page refreshes rather than always resetting to the last 30 days.

3. **Test JSON export** — Verify JSON export functionality in a follow-up test pass.

4. **Test edge cases** — Conduct an edge-case pass covering empty states and large dataset performance when sufficient test data is available.

5. **Monitor** — After the timezone fix, re-run the data verification test (Section 7) to confirm end-to-end log accuracy.

---

## 🔑 Close

> The Audit Dashboard is functionally sound across filtering, pagination, CSV export, and mobile layout — however, the timezone mismatch causing "today's" actions to be invisible by default is a significant audit integrity issue that must be resolved before the dashboard can be relied upon for real-time governance.

The test plan successfully validates core functionality and surfaces two actionable defects: timezone alignment and date range persistence. Both should be addressed before production reliance.

---

📌 **Document Type:** Test Plan (Tier 3 Smoke Test)
📅 **Last Updated:** 3 December 2025
🔗 **Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40469921930
