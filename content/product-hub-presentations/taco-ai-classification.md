# TACO — AI Classification & Model Tuning
> How TACO classifies timesheet entries at 97.5% accuracy and detects revenue leakage using a multi-layered AI pipeline

**Author:** Harrison Bland & Johnson Paku — Insights & Analytics
**Date:** March 2026
**Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/39962411150

---

## 🎯 Context

TACO's core value comes from its AI classification engine — every timesheet entry is classified as T&M, BAU, or Unknown.
The classification pipeline achieves 97.5% accuracy using a multi-layered approach that combines explicit rules, fuzzy keyword matching, historical billing data, and category fallbacks.

---

## 🔍 Problem

Timesheet entries are inconsistently categorised by employees.
T&M work gets logged as BAU (revenue leakage). BAU work gets logged as T&M (customer overbilling).
Without AI classification, these mismatches compound silently across thousands of entries every month.

---

## 📋 Observations

**1. The classification matrix**
TACO prediction vs timesheet categorisation creates four outcomes:
T&M predicted + T&M categorised = correctly predicted.
T&M predicted + BAU categorised = potential revenue leakage.
BAU predicted + T&M categorised = potential customer overbilling.
Unknown = insufficient data for prediction.

**2. Multi-layered classification logic**
Layer 1 — Explicit indicators: check task description for "non-billable", "billable", "t&m", "bau".
Layer 2 — Fuzzy keyword matching: curated keyword lists for T&M (project, deployment, consulting, build, design) and BAU (daily, incident, request, backup, monitoring, helpdesk).
Layer 3 — Historical backing: cross-reference against source-of-truth billing dataset.
Layer 4 — Category fallback: use ProjectTimesheet_Category field for remaining ambiguities.

**3. Classification accuracy: 97.5%**
Of all timesheet entries processed, 97.5% are successfully classified as BAU or T&M.
2.5% remain as "Not Clearly Defined" — flagged for manual review.
Confidence threshold: 85%+ required for billing recommendations.
Default bill rate for calculations: $135/hour.

**4. Risk segments**
Correctly Predicted — TACO and timesheet agree.
Potential Leakage — TACO says T&M, timesheet says BAU. Revenue being missed.
Potential Overbilled — TACO says BAU, timesheet says T&M. Customer risk.
Unknown — no relevant contract loaded for context.
Not Clearly Defined — classification logic couldn't resolve.

**5. Key measures for analytics**
Total Logged Hours (TLH) — all hours TACO could analyse.
Total TACO Hours (TTH) — hours TACO has actually analysed.
Potential Leakage Hours/Revenue — T&M predicted but logged as BAU at ≥85% confidence.
Potential Overbilled Hours/Revenue — BAU predicted but logged as T&M at ≥85% confidence.

**6. V5 model hyperparameter tuning**
LoRA (Low-Rank Adaptation) experiment using only TACO data at 120 training steps.
Parameters tuned: lora_r, lora_alpha, learning_rate, batch_size, gradient_accumulation_steps.
Finding: structured JSON output improves classification accuracy over string extraction.
Author: Johnson Paku. Status: experimental — production model uses the multi-layered DAX logic.

**7. Data pipeline**
Source: Azure SQL Database (TACO UAT) joined with OpenAir timesheet data.
Primary key: ProjectTimesheet_TimesheetEntryID.
Development uses Excel extract (TACOMAYJUNE); production targets Fabric data model.
Schema: date, person_name, customer, project, service, task, description, hours, status, entry_id.

---

## 💡 Proposal

The multi-layered classification engine is TACO's core differentiator. It catches revenue leakage and overbilling that manual processes miss entirely.

---

## 🔑 Close

> 97.5% accuracy. Four classification layers. Every timesheet entry assessed. Revenue leakage surfaced automatically.

The AI does in seconds what would take a human hours — and it does it consistently across every entry, every person, every month.
