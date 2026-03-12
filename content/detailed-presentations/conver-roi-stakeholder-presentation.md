# Conver — Return on Investment & Strategic Value
> Enterprise AI platform for 6,500 employees: estimated $15.6M–$78M annual value against sub-$2M investment

**Author:** [Joe Thornley](https://datacomgroup.atlassian.net/wiki/people/62a65fd8188d08006fe06fc2)
**Date:** March 2026
**Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/39929380876

---

## 🎯 Context

Conver is Datacom's enterprise AI platform — a secure, governed chatbot providing all 6,500 employees with access to 13 AI models across 4 hyperscaler providers (Azure OpenAI, Google Gemini, Anthropic, AWS Bedrock). Following a successful beta phase with strong user adoption and measurable productivity gains, this analysis presents the financial case for full company-wide rollout. All figures are sourced directly from Confluence documentation reviewed read-only on 8 March 2026, covering 117 pages (47 core documentation).

---

## 🔍 Problem

Employees currently lack approved, powerful generative AI tools to drive productivity across knowledge tasks — from content creation and data analysis to software development and internal support. Without Conver, the alternative is Microsoft Copilot at $50/user/month ($3.9M/year for 6,500 users) or the security risk of uncontrolled Shadow AI usage. Significant employee time is spent searching for internal information across disparate systems or waiting for responses from overloaded support teams.

---

## 📋 Observations

**1. Annual productivity value: $15.6M to $78M NZD**
Based on 6,500 employees working 48 weeks/year at a $50 NZD average loaded cost per hour, three scenarios quantify the annual value of Conver:
- Conservative (1 hour saved per employee per week): 312,000 hours = $15,600,000 NZD
- Moderate (3 hours saved per employee per week): 936,000 hours = $46,800,000 NZD
- Optimistic (5 hours saved per employee per week): 1,560,000 hours = $78,000,000 NZD
Source: Datacom Chat Business Case Production (Joe Thornley, 13 January 2026)

**2. Year-1 investment: $905K to $1.685M NZD**
Total Year-1 costs comprise fixed infrastructure (~$35K/year for 6,500 users), a 4.0 FTE operations team (Product Management & Development 2.0, Support & Monitoring 0.5, Product Management & Governance 2.0), and variable token consumption ($390K–$1,170K charged back to business units).
Source: Datacom Chat Business Case Production

**3. ROI: 826% to 10,314% with sub-1-month payback**
The ROI matrix projects net benefit and return across all cost and productivity scenarios. Even the most conservative combination (highest costs $1.685M + lowest savings 1 hr/week = $15.6M) delivers 826% ROI. The optimistic scenario (low costs $749K + 5 hrs/week = $78M) delivers 10,314% ROI. Payback period is less than one month in all scenarios.
Source: Datacom Chat Business Case Production

**4. Infrastructure is 99% cheaper than Microsoft Copilot**
Conver's fixed infrastructure cost is ~$35,000/year for 6,500 users. Microsoft Copilot for the same user base would cost ~$3,900,000/year ($50/user/month × 6,500 × 12). The pilot validated an operational cost of just ~$5 NZD per user per month — a 90% cost saving over licensed alternatives. Users who have tried both report Conver provides a better experience overall.
Source: Datacom Chat Business Case Production, Conver Knowledge Hub

**5. Break-even requires only 0.1% of employee time**
At a cost of $10/user/month, the productivity gain of just one employee (saving $10,000/month) covers the variable cost of 1,000 users. The tool only needs to save 0.1% of an employee's time (based on a $10,000/month salary cost) to pay for itself. The business case projects time savings far in excess of this threshold.
Source: Datacom Chat Business Case Production

**6. Adoption is accelerating: 600% year-over-year conversation growth**
Platform adoption has been exceptional. Conversation volume in the first five months of 2025 eclipsed the entire volume of 2024 by nearly 600%. Totals: 2024 Nov–Dec: 1,217 conversations; 2025 Q1: 3,700; 2025 Q2: 10,090; 2025 Q3 (first 8 days): 1,455. Grand total: 16,462 conversations. Of 195 analysed users, 54 are power users (>2 interactions/day), 73 are core adopters.
Source: Datacom Chat Business Case Production

**7. Hiring avoidance: productivity uplift absorbs workload growth**
The primary realisable benefit strategy is to use productivity gains to absorb increased workload without additional hiring. Phase 1 targets departments with high measurable gains (IT Support, HR, Software Development). Key metrics: tickets resolved per person, code commits, project velocity. This creates direct cost savings against forward hiring plans.
Source: Datacom Chat Business Case Production

**8. 14 features shipped, serving real business workflows**
The platform has shipped Zendesk integration (7 tools), Stock in the Channel (9 tools), Code Interpreter, Autodocx V1 & V2, Memories, FAQ/QnA Bot, Agent Handoffs, Brand Agent, SOW Generator, Feature Flags, and Assistants Menu. 10 more features are planned including SharePoint integration, Admin Panel, and Agent Marketplace. 115+ DataScape agents are planned for integration.
Source: Multiple Confluence documents across the Insights & Analytics space

---

## 💡 Proposal

Secure budget approval for the full production rollout to all 6,500 employees, based on documented ROI of 826%–10,314% and validated infrastructure costs two orders of magnitude below alternatives.

- Approve Year-1 budget of $905K–$1.685M NZD for full rollout (3–6 months from approval)
- Target >70% active user adoption across the organisation
- Measure productivity gains by department: tickets resolved, code commits, project velocity, hiring avoidance
- Complete the 90-day ISO 27001 compliance programme — prerequisite for commercialisation
- Resolve the two highest-impact production risks (TLS automation, public Azure exposure)

*The financial model demonstrates an overwhelmingly positive return on investment across all scenarios, with a payback period of less than one month.*

---

## ⚠️ Risks

- **Token audit incomplete:** Only 1 of 156 planned audit runs completed. Cost projections need validation before full rollout. 155 runs outstanding across 13 models × 6 scenarios.
- **Production security gaps:** 7 active risks identified (November 2025), with 4 blocked on Group Tech. The two highest-impact items are TLS certificate automation and public Azure exposure bypassing Cloudflare.
- **Compliance not yet certified:** ISO 27001 and SOC 2 are required for external commercialisation and government deployments. A 90-day programme has been documented but not started.
- **QA issues in production features:** Code Interpreter shows multi-turn data fabrication, Memories has context isolation failures, and SPP Insights has all P1 security controls unimplemented.

---

## ✅ Next Steps

1. **Approve full rollout budget** — $905K–$1.685M NZD Year 1; projected return $15.6M–$78M
2. **Phase 1 departmental rollout** — IT Support, HR, Software Development for measurable gains
3. **Complete token consumption audit** — 155 of 156 runs outstanding; validate cost model
4. **Resolve Group Tech blockers** — TLS automation and Azure exposure are highest-impact risks
5. **Begin 90-day compliance programme** — ISO 27001 certification enables commercialisation
6. **Establish measurement framework** — Track hours saved, hiring avoidance, tickets per person, code velocity

---

## 🔑 Close

> Conver delivers 826%–10,314% ROI with infrastructure costs 99% below alternatives — the question is not whether to invest, but how quickly.

With $15.6M–$78M in estimated annual productivity gains against sub-$2M investment, 600% adoption growth, and validated per-user costs of ~$5/month versus Copilot's $50/month, the financial case is exceptionally strong. The tool pays for itself when it saves just 0.1% of an employee's time. Full rollout to 6,500 users requires resolving key production risks, completing the token audit, and beginning the compliance pathway — all achievable within 2026.

All figures sourced from Datacom Confluence documentation (117 pages reviewed read-only, 8 March 2026).
https://datacomgroup.atlassian.net/wiki/spaces/IA
