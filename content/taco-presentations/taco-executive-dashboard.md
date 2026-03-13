# TACO — Executive Analytics Dashboard
> A 7-section Power BI dashboard designed for executives to assess, understand, and act on revenue leakage and billing risks

**Author:** Harrison Bland — Insights & Analytics
**Date:** July 2025
**Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/39962411150

---

## 🎯 Context

TACO's executive dashboard is a structured analytical story built in Power BI.
It moves from headline KPIs through diagnostic cross-tabs to financial impact, risk concentration, trends, and full drillthrough detail.

---

## 🔍 Problem

Executives need to rapidly assess revenue leakage and billing risks across the organisation.
Raw timesheet data is meaningless without structured analysis. Ad-hoc reports are inconsistent and hard to compare.
There is no single view that answers: how much is at stake, where should we focus, and is it getting better?

---

## 📋 Observations

**1. Section 1 — KPI Pulse**
Row of card tiles at the top of the dashboard.
Total Logged Hours. Total TACO Hours Analysed. T&M Hours. BAU Hours. Unknown Hours.
Potential Leakage Hours & Revenue. Potential Overbilled Hours & Revenue.
Instant pulse-check — are risks material enough to investigate?

**2. Section 2 — Prediction vs Reality Matrix**
Cross-tab comparing TACO predictions against actual timesheet categorisations.
Rows: Task_Category (BAU, T&M, Not Clearly Defined).
Columns: TACO prediction (T&M, Not T&M, Unknown).
Colour-formatted to highlight costly mismatches — the "X-ray" of billing accuracy.

**3. Section 3 — Financial Impact**
Waterfall/stacked bar: total leakage and overbilling by risk category.
Pareto chart: which customers or service lines account for the majority of risk.
Answers both "how much is at stake?" and "where should we focus?"

**4. Section 4 — Risk Concentration**
Clustered bar/treemap: leakage and overbilling by customer, service line, or manager.
Top-N filtering for focus on the biggest sources of loss.
A leaderboard for action — identify high-risk and low-leakage pockets.

**5. Section 5 — Trend Analysis**
Line chart: leakage and overbilling over time.
Shows whether interventions have worked and spots seasonal or project-cycle spikes.
Axis: date. Legend: BAU vs T&M. Values: leakage/overbilled hours.

**6. Section 6 — Drillthrough Detail**
Click any bar, line, or segment to see exact timesheet entries.
Full detail: date, entry ID, manager, customer, project, category, prediction, confidence, reason.
Ensures transparency — turn data into credible action stories.

**7. Section 7 — Data Quality & Model Confidence**
Histogram of model confidence scores.
Smart narrative highlighting clusters of low-confidence or unclassified entries.
Demonstrates governance and builds trust in the analysis.

**8. Executive journey flow**
Scan KPIs → See prediction effectiveness → Gauge financial risk → Drill into hotspots → View trends → Click into details → Assess confidence.
Each section builds on the previous — a guided analytical story from headline to action.

---

## 💡 Proposal

Deploy the 7-section dashboard for executive stakeholders. Start with the KPI pulse. Drill into risk. Take action on the hotspots.

---

## 🔑 Close

> Scan. Diagnose. Quantify. Focus. Trend. Drill. Trust.

Seven sections. One analytical story. From headline risk to specific drivers — ensuring focused, informed action.
