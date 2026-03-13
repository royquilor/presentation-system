# TACO
> AI-powered timesheet intelligence — 2-minute 1:1 prep instead of 30 minutes, with revenue leakage detection at 97.5% accuracy

**Author:** Victoria Marchant, Jason Moss & Harrison Bland
**Date:** March 2026
**Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40301527151

---

## 🎯 Context

TACO connects to OpenAir, classifies every timesheet entry using AI, and gives managers a natural language interface to query their team's work.
Ask a question. Get a data-grounded answer in seconds. Approved for production by Group Security.

---

## 🔍 Problem

Managers manually extract OpenAir data and spend 20–30 minutes per person preparing for 1:1s.
Revenue leakage goes undetected — T&M work logged as BAU, overbilling logged as T&M.
Every manager interprets the same data differently. No consistency, no audit trail, no governed platform.

---

## 📋 Observations

**1. What It Is**
An AI timesheet intelligence platform at taco.datacom.com.
Classifies every entry as T&M, BAU, or Unknown — at 97.5% accuracy.
Natural language chat: "How much T&M time did Sarah log last month?"
Automated staff insights: work activities, billable splits, anomalies, K-code mismatches.

**2. Who It's For**
Line Managers — fast, trustworthy summaries for weekly 1:1s and reviews.
People & Culture Advisors — consistent, auditable reporting across teams.
Finance & Delivery Leads — T&M accuracy monitoring and revenue leakage detection.
Employees — a clear view of how their own time has been classified.

**3. Why It Matters — time, accuracy, consistency**
1:1 prep drops from 30 minutes to under 2 minutes — a 75% reduction.
AI classification at 97.5% catches mismatches humans miss.
Every manager sees the same data model — no more subjective interpretations.
Target: 80% manager adoption within 6 months. Satisfaction target: >4/5.

**4. How to use TACO**
Step 1 — Log in at taco.datacom.com (Entra ID SSO).
Step 2 — Select a person from your allow-listed direct reports.
Step 3 — View the last 30 days: time split, billable vs non-billable, anomalies.
Step 4 — Ask a question in natural language.
Step 5 — Run a saved report (T&M split, anomalies, Unknowns, compliance).
Step 6 — Export as PDF with timestamp and your identity for audit.

**5. Example — 1:1 prep in 2 minutes**
Select a direct report. TACO loads: 28 hrs billable, 4 hrs internal, 3 Unknown entries.
Ask: "What were the Unknown entries about?"
TACO explains each one and suggests recategorisation.
Total prep time: under 2 minutes. Previously: 20–30 minutes.

**6. Example — revenue leakage detection**
Delivery lead asks: "Any K-code mismatches on Project X this month?"
TACO returns 3 flagged entries with descriptions, timestamps, and corrections.
At $135/hr default rate, each flagged entry directly impacts billing accuracy.
Confidence threshold: 85%+ for billing recommendations.

**7. Example — P&C compliance review**
P&C advisor filters across all managers in a business unit.
Reviews after-hours patterns and timesheet compliance scores for the quarter.
Consistent, auditable data — same view for every advisor, every time.

**8. Security — Group Security approved**
7 risks assessed (R01–R07). All addressed to Group Security's satisfaction.
SSO + MFA enforced. Access via approval and allow-listing.
Customer restriction capability implemented. No AI training on any data.
Azure Australia East. Key Vault for secrets. DDoS protection. Log Analytics.

**9. Production architecture**
Azure East: VM Standard_D4s_v3 (4 vCPUs, 16 GB).
SQL Server Hyperscale. Azure OpenAI (S0). Python 3.11 web app.
Application Insights monitoring. Metric alerts for CPU, memory, network, IOPS.
Penetration tests in progress with Application Security.

---

## 💡 Proposal

Log in at taco.datacom.com. Select a person. See their last 30 days. Ask a question. Export with audit trail.

---

## 🔑 Close

> 2 minutes instead of 30. Every manager. Same data. Full audit trail.

taco.datacom.com — Entra ID SSO. Contact the IA team for access.
