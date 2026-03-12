# TACO, Detailed Assessment
> AI Use Case (Business Value). AI classification at 97.5% accuracy, approved for production by Group Security.

**Author:** Victoria Marchant, Jason Moss & Harrison Bland, Insights & Analytics
**Date:** March 2026
**Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40301527151

---

## 🎯 Context

TACO (Timesheet Analysis and Classification Oracle) automates timesheet analysis for line managers at taco.datacom.com. It classifies every OpenAir entry as T&M, BAU, or Unknown using a multi-layered AI pipeline. Group Security reviewed 7 risks (R01 through R07) and approved the platform for production. This assessment draws from the TACO Business Case, Security Architecture, Personas and JTBD research, and AI Classification documentation.

**Status:** Production
**Owner:** victoria.marchant@datacom.com

---

## 🔍 Problem

Line managers spend 20-30 minutes per person extracting and interpreting OpenAir data before each 1:1. The process varies by manager with subjective conclusions, no standardised format, and no audit trail. Revenue leakage from misclassified entries (T&M logged as BAU or vice versa) goes undetected because manual review cannot systematically process thousands of entries at $135/hour. Source: TACO Business Case, Victoria Marchant, October 2025. Personas and JTBD research.

---

## 📋 Observations

**1. Platform capability**
TACO pulls timesheet data from OpenAir through a data pipeline. A multi-layered AI classification pipeline processes each entry through 4 classification layers, categorising as T&M (billable), BAU (internal), or Unknown (needs human review). About 2.5% of entries come back as "Not Clearly Defined" and get flagged for manual review. Managers interact through natural language chat and saved report templates. Reports export as PDF with timestamp and user identity for audit. Infrastructure: Standard_D4s_v3 VM (4 vCPUs, 16 GB), SQL Server Hyperscale, Azure OpenAI S0, Python 3.11. Source: AI Classification and Model Tuning documentation.

**2. Accuracy and validation**
97.5% classification accuracy across T&M, BAU, and Unknown categories. Validated against a manual review baseline. Confidence threshold for billing-impacting recommendations: 85%+. Entries below that threshold get flagged for human review rather than auto-classified. LoRA fine-tuning experiments conducted (120 training steps) with ongoing model performance tuning planned. Source: TACO AI Classification documentation.

These figures are from the current classification model. Validation method: comparison against manual classification by domain experts.

**3. Validated user personas**
Two personas developed through formal JTBD research by Victoria Marchant, October 2025.

Line managers: "As a people leader, when I prepare for a 1:1, I want a concise, trustworthy last-month summary of what this person worked on so I can coach effectively, rebalance workload, and ensure accurate T&M capture." Success metrics: prep time under 2 minutes, actionable insights per person, improved accuracy trending down on Unknowns.

P&C advisors: consistent cross-manager reporting for compliance, development, wellbeing, and policy adherence with evidence rather than subjective interpretation.

Secondary users: finance and delivery leads for T&M monitoring.

**4. Security and operational status**
Group Security assessed 7 risks (R01 through R07) and approved for production. SSO and MFA enforced. Customer restriction capability for data segregation. No AI training on user data. Azure Australia East deployment with Key Vault, DDoS protection, Application Insights monitoring with metric alerts. Source: Security Review and Production Architecture documentation.

Penetration testing underway with Application Security but not yet complete. Access currently limited to allow-listed managers.

**5. Adoption targets and measurement**
Manager adoption target: 80% within 6 months. Satisfaction target: above 4 out of 5. Accuracy target: above 85% through integrated evaluations. Pilot success criteria: 3+ managers generating reports without support, under 10% classification errors, generation time below 30 seconds, zero access violations.

Leading indicators: report adoption, median prep time, data coverage, satisfaction scores. Lagging indicators: reduction in timesheeting anomalies, zero unauthorised access incidents. Baseline: current time spent by 5 managers doing manual analysis.

No named user testimonials available yet. Feedback collection planned for expansion.

**6. Known limitations**
Penetration testing in progress. Data scope limited to 30 days per person, extension planned. Access limited to allow-listed managers, expanding based on results. Classification model validated but continues to be tuned. No named user quotes collected yet.

**7. Roadmap**
Expand to all NZ line managers. Extend beyond 30-day data window. Complete penetration testing. Advanced analytics: trend analysis, team dashboards, cross-business-unit comparison. LLM tuning. P&C compliance suite. Future considerations: Datacom Australia expansion, real-time alerting, finance system integration. Source: TACO roadmap documentation.

---

## 💡 Proposal

Recommended next step: 15-minute walkthrough with Victoria Marchant to review classification accuracy, pilot results, and expansion criteria. Contact victoria.marchant@datacom.com.

---

## 🔑 Close

> 97.5% accuracy validated against manual baseline. Group Security approved. Penetration testing and pilot expansion are the near-term priorities.

taco.datacom.com
**Owner:** victoria.marchant@datacom.com

*Metrics current as of March 2026. Next quarterly refresh: June 2026.*
