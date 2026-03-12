# Datacom Chat Business Case Production

> Securing budget and development resources for a full company-wide rollout of Datacom's internal LLM-based chatbot to all 6,500 employees following a successful beta phase.

**Author:** [Joe Thornley](https://datacomgroup.atlassian.net/wiki/people/62a65fd8188d08006fe06fc2)
**Date:** 13 January 2026
**Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/39929380876

---

## 🎯 Context

Datacom Chat is a secure, internal AI-driven chatbot that provides employees with access to powerful Large Language Models (LLMs) within Datacom's secure Azure environment. A successful beta phase demonstrated significant productivity gains and strong user adoption. The business case seeks budget approval and dedicated resources for a full rollout to all 6,500 employees over the next 3–6 months, with the core platform already built and validated.

---

## 🔍 Problem

The document addresses three core problems: (1) employees lack approved, powerful generative AI tools for knowledge tasks, limiting productivity; (2) inconsistent and inefficient access to internal information across disparate systems slows work; and (3) unmanaged "Shadow AI" use exposes Datacom to security breaches, data leakage, and compliance risks. Without an approved, capability-matched tool, employees turn to unsanctioned AI solutions.

---

## 📋 Observations

**1. Investment and ROI are highly favourable across all scenarios**

Total Year-1 investment required is **$905,000 – $1,685,000 NZD** (fully costed). Annual ROI is projected between **826% and 10,314%** depending on usage and productivity gains. Even with the highest cost estimates and most conservative productivity gains, the project delivers ROI over 1,000% with a payback period of less than one month.

**2. Cost structure is dominated by variable token usage**

Total Year-1 costs break down as: **Fixed Annual Costs ~$525,000 NZD** (infrastructure + personnel) and **Variable Annual Costs ~$390,000 – $1,170,000 NZD**. Token usage constitutes over 80% of variable expenses. For FY26, FTE and infrastructure costs are already in existing budgets; unbudgeted costs are limited to variable token usage.

**3. Infrastructure costs scale non-linearly with users**

From 3-month actuals (Apr–Jun 2025): Virtual Machines $1,614.66, Storage & Backup $427.75, Microsoft Defender $167.80, Other $64.38 — **Total $2,274.59** (annualized ~$9,098.36). Projected annual cost for 6,500 users: **~$35,000 NZD** total infrastructure.

**4. Personnel support requires 4.0 FTE at ~$480K NZD**

Product Management & Development 2.0 FTE, Support & Monitoring 0.5 FTE, Product Management & Governance 2.0 FTE. Assumption: **$120,000 NZD per FTE** for budgeting.

**5. Token cost scenarios map directly to user activity**

| Scenario (Avg. Cost/User/Month) | Total Tokens per User/Month | Equivalent Pages | Total Annual Variable Cost (6,500 Users) |
|---------------------------------|-----------------------------|------------------|----------------------------------------|
| $3.00 (actual July 2025)        | 338,400                     | 452 pages        | $234,000                               |
| $5.00                           | ~564,000                    | ~752 pages       | ~$390,000                              |
| $10.00                          | ~1,128,000                  | ~1,505 pages     | ~$780,000                              |
| $15.00                          | ~1,693,000                  | ~2,257 pages     | ~$1,170,000                            |

Blended cost: **~$0.00886 NZD per 1,000 tokens** (1:3 input-to-output ratio). Usage mix: 70% GPT-4o mini, 25% GPT-4o, 5% GPT-o3.

**6. Productivity gains are valued between $15.6M and $78M annually**

| Scenario (Time Saved/Employee/Week) | Total Hours Saved Annually | Total Annual Value |
|------------------------------------|----------------------------|---------------------|
| 1 Hour/Week                        | 312,000 hours              | $15,600,000 NZD    |
| 3 Hours/Week                       | 936,000 hours              | $46,800,000 NZD    |
| 5 Hours/Week                       | 1,560,000 hours            | $78,000,000 NZD    |

Assumptions: 6,500 employees, 48 working weeks/year, **$50 NZD** average loaded cost per hour.

**7. ROI projection matrix shows net benefit across all combinations**

| Cost Scenario | 1 Hour/Week ($15.6M) | 3 Hours/Week ($46.8M) | 5 Hours/Week ($78M) |
|---------------|----------------------|------------------------|---------------------|
| Low ($749K)   | Net: $14.85M; ROI: 1,983%  | Net: $46.05M; ROI: 6,148%  | Net: $77.25M; ROI: 10,314% |
| Medium ($995K)| Net: $14.61M; ROI: 1,469%  | Net: $45.81M; ROI: 4,603%  | Net: $77.01M; ROI: 7,740%   |
| High ($1.685M)| Net: $13.92M; ROI: 826%   | Net: $45.12M; ROI: 2,677%  | Net: $76.32M; ROI: 4,530%   |

**8. Platform adoption accelerated sharply in 2025**

| Period           | Conversation Count |
|------------------|--------------------|
| 2024 (Nov–Dec)   | 1,217              |
| 2025 Q1 (Jan–Mar)| 3,700              |
| 2025 Q2 (Apr–Jun)| 10,090             |
| 2025 Q3 (Jul 1–8)| 1,455              |
| **Grand Total**  | **16,462**         |

First five months of 2025 eclipsed 2024 volume by nearly **600%**.

**9. User personas reveal 195 users across four engagement tiers (Jan–Feb 2025)**

| Usage Category | Definition                    | Number of Users |
|----------------|-------------------------------|-----------------|
| Near Zero      | <0.1 interactions/day          | 68              |
| Low Usage      | 0.1–0.5 interactions/day      | 34              |
| Medium Usage   | 0.5–2 interactions/day        | 39              |
| High Usage     | >2 interactions/day           | 54              |
| **Total**      |                               | **195**         |

54 "Power Users," 73 "Core Adopters," and 68 "Untapped Potential" users.

**10. Pilot validated ~$5 NZD per user per month — 90% cost saving vs MS Copilot**

MS Copilot is ~$50 NZD/user/month. Break-even: at $10/user/month, productivity gain of one employee ($10,000/month) covers variable cost of **1,000 users**. The tool needs to save only **0.1%** of an employee's time to pay for itself.

---

## 💡 Proposal

Secure budget and resources for a full company-wide rollout of Datacom Chat to all 6,500 employees.

- **Approve budget** in the range $905,000–$1,685,000 NZD for Year 1
- **Establish a dedicated "Chatbot Ops" team** for ongoing management
- **Execute a company-wide change and adoption plan** with phased rollout
- **Implement cost controls** (token caps, chargeback to LOBs, mandatory training)
- **Support rollout with Datacom AI Academy** for training and enablement
- **Drive monetisation** via "hiring avoidance," leadership accountability, and reinvestment of saved time

*The financial model demonstrates an overwhelmingly positive return. Even with the highest cost estimates and most conservative productivity gains, the project delivers ROI over 1,000% with a payback period of less than one month.*

---

## ⚠️ Risks

- **Parkinson's Law:** Saved time may be absorbed by lower-value tasks or administrative creep without a clear reinvestment strategy
- **Adoption shortfall:** Failure to convert "Untapped Potential" users (68 Near Zero users) limits realised value
- **Cost overrun:** Variable token costs could exceed projections if usage patterns shift toward higher-cost models

---

## ✅ Next Steps

1. **Budget approval** — Secure approval for Year-1 spend range
2. **Chatbot Ops team** — Establish dedicated team for support and governance
3. **Change management** — Execute phased communication and training plan
4. **Champions program** — Engage 54 Power Users for success stories and mentoring
5. **Re-engagement campaign** — Target 68 Near Zero users with department-specific workshops
6. **Measure baseline** — Benchmark time spent on AI-augmentable tasks before rollout

---

## 🔑 Close

> Datacom Chat is a validated success. The pilot confirmed financial viability (~$5/user/month), strong adoption (conversation volume up ~600% vs 2024), and clear user personas. The data supports a confident decision to proceed with a full, funded rollout to capture a multi-million dollar productivity opportunity.

The platform has proven self-hosting capability on DCS private cloud and validated open-source model integration, providing long-term options for cost management and data sovereignty. Implementing the proposed framework creates a direct link between time saved and financial benefits realised by the business.
