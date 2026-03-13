# TACO — Business Case
> 75% reduction in 1:1 prep time, revenue leakage detection at $135/hr, 80% adoption target — the case for AI-powered timesheet intelligence

**Author:** Victoria Marchant & Jason Moss — Insights & Analytics
**Date:** March 2026
**Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40301527151

---

## 🎯 Context

TACO replaces a 30-minute manual process with a 2-minute AI-powered insight for every 1:1 and performance review.
It also detects revenue leakage — T&M work incorrectly logged as BAU — that manual processes miss entirely.

---

## 🔍 Problem

Every line manager at Datacom spends 20–30 minutes per person before each 1:1.
Multiply that across hundreds of managers and thousands of reviews per year.
Meanwhile, revenue leakage from miscategorised timesheets compounds silently — invisible without AI classification.

---

## 📋 Observations

**1. Time saved — the headline value**
Target: 1:1 prep drops from 20–30 minutes to under 2 minutes per person.
That is a 75% reduction in prep time for every manager, every review.
Compound across all managers and review cycles — the time savings are significant.

**2. Revenue leakage detection**
AI classification catches T&M work logged as BAU — potential missed revenue.
Also catches BAU work logged as T&M — potential customer overbilling.
Default rate: $135/hour. Each flagged entry directly impacts billing accuracy.
Confidence threshold: 85%+ for billing recommendations.

**3. Adoption targets**
Manager adoption: 80% within 6 months.
Quality score: manager satisfaction >4/5.
Accuracy: >85% as validated by integrated evaluations.
Monthly tracking: number of insights reports generated.

**4. Consistency eliminates subjectivity**
Every manager sees the same data model.
Same classifications. Same anomaly detection. Same format.
No more subjective interpretations of the same timesheet data.
P&C advisors get consistent cross-manager reporting for the first time.

**5. Pilot approach — start small, prove value**
MVP: lightweight HR-focused interface for 1–2 months of data.
Pilot with 2–3 teams. Structured feedback checkpoints.
Success criteria: 3+ managers generate reports without support, <10% classification errors, avg generation time <30 seconds, zero access violations.

**6. Infrastructure cost**
Azure East deployment: VM Standard_D4s_v3, SQL Hyperscale, Azure OpenAI S0.
Group Security approved — no additional security investment required for production.
Hosted at taco.datacom.com with Entra ID SSO.

**7. MVP priorities**
P0 (must-have): stakeholder alignment, hosting, data pipeline from OpenAir, core interface with reports and logging.
P1 (important): LLM performance tuning, data validation, query optimisation.
P2 (post-MVP): expand to all line managers, extend timeframes, advanced features, production hardening.

**8. Success measurement**
Leading: common report adoption, median prep time, data coverage, satisfaction scores.
Lagging: reduction in timesheeting anomalies, zero unauthorised access incidents.
Baseline: measure current time spent by 5 managers doing manual analysis.

---

## 💡 Proposal

Approve the MVP pilot. Measure time savings and leakage detection. Expand to all managers based on pilot results.

---

## 🔑 Close

> 75% less prep time. Revenue leakage caught automatically. Consistent data for every manager. Approved for production.

Start with the pilot. Prove the value. Scale across the organisation.
