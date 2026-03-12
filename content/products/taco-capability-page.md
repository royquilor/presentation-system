# TACO
> AI Use Case (Business Value). Classifies every timesheet entry with 97.5% accuracy, turning 30-minute 1:1 prep into 2 minutes.

**Author:** Victoria Marchant, Jason Moss & Harrison Bland, Insights & Analytics
**Date:** March 2026
**Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40301527151

---

## 🎯 Context

TACO (Timesheet Analysis and Classification Oracle) automates timesheet analysis for line managers. It connects to OpenAir, classifies every entry as T&M, BAU, or Unknown with 97.5% accuracy, and turns 30-minute 1:1 prep into 2-minute summaries. Live at taco.datacom.com with Group Security approval.

**Status:** Production
**Owner:** victoria.marchant@datacom.com

---

## 🔍 Problem

Line managers spend 20-30 minutes per person extracting and interpreting OpenAir data before each 1:1. The process varies by manager with subjective conclusions, no standard format, and no audit trail. Revenue leakage from misclassified entries at $135/hour goes undetected because manual review cannot systematically process thousands of entries.

---

## 📋 Observations

**1. What you get**
Select a direct report and TACO loads their last 30 days of timesheet data classified by AI. Time split, billable vs non-billable, flagged anomalies. Ask questions in natural language ("What were Sarah's Unknown entries about?") and get data-grounded answers. Saved report templates for T&M split, anomaly detection, Unknown entries, and compliance reviews. Everything exports as PDF with a timestamp and your identity attached for audit.

**2. Accuracy**
97.5% classification accuracy across T&M, BAU, and Unknown categories. The confidence threshold for billing-impacting recommendations is 85%+. Entries below that get flagged for human review instead of being auto-classified. About 2.5% of entries come back as "Not Clearly Defined" and require manual review. This is the top question people ask and the numbers hold up.

**3. Who it's for**
Line managers are the primary users. Anyone running weekly 1:1s or monthly reviews who needs a fast, consistent view of what their people worked on. P&C advisors use it for standardised cross-manager reporting, compliance scores, and evidence-based coaching. Finance and delivery leads use it to monitor T&M accuracy and spot revenue leakage across projects.

**4. Getting started**
Contact the IA team for access. You'll be added to the allow-list. Log in at taco.datacom.com with Entra ID SSO (MFA enforced). Select a direct report, view their last 30 days, ask a question or run a saved report. Export with an audit trail when you're done.

**5. Security and approvals**
Group Security assessed 7 risks (R01 through R07) and approved the platform for production. SSO and MFA enforced. Customer restriction capability built in for data segregation. No data used for AI training. Infrastructure in Azure Australia East with Key Vault for secrets, DDoS protection, and Log Analytics for monitoring.

**6. The numbers**
75% reduction in 1:1 prep time: from 20-30 minutes down to under 2 minutes per person. Revenue leakage flagged at $135/hour default bill rate. Adoption target: 80% of line managers within 6 months. Satisfaction target: above 4 out of 5.

**7. What's next**
Expand access to all line managers across Datacom NZ. Extend the data window beyond 30 days. Complete penetration testing with Application Security. After that: trend analysis, team-level dashboards, comparative reporting across business units, and LLM performance tuning. Eventually extends to Datacom Australia and finance system integration for automated billing corrections.

---

## 💡 Proposal

Log in at taco.datacom.com. Contact the IA team for access. Select a person. See their last 30 days. Questions go to victoria.marchant@datacom.com.

---

## 🔑 Close

> 97.5% accuracy. 30 minutes to 2 minutes. Group Security approved.

taco.datacom.com
**Owner:** victoria.marchant@datacom.com

*Metrics current as of March 2026. Next quarterly refresh: June 2026.*
