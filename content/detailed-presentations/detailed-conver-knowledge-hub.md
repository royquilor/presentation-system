# Conver Knowledge Hub

> Comprehensive user guide and knowledge base for Conver, Datacom's secure internal AI platform (customized LibreChat fork on Azure).

**Author:** [Harrison Bland](https://datacomgroup.atlassian.net/wiki/people/712020:f8283e50-5198-4bc0-b519-63b9e88649fd)
**Date:** 16 October 2025
**Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40110391561

---

## 🎯 Context

Conver (formerly Datacom Chat) is Datacom's secure, company-approved AI platform — a customized fork of LibreChat hosted on Azure. It provides staff with enterprise-grade access to multiple leading AI models through a ChatGPT-like interface with advanced collaboration features. The Knowledge Hub serves as the central resource for learning how to use Conver effectively, follow best practices, and understand secure, responsible AI use across the organisation.

---

## 🔍 Problem

Employees need clear guidance on: which models to use for which tasks; how to build agents and chained workflows; how to use artifacts, file attachments, and bookmarks; and how to comply with data classification and secure use policies. Without structured documentation, adoption, consistency, and compliance would be inconsistent across 6,500+ users.

---

## 📋 Observations

**1. Model selection is task-based across four tiers**

**Quick & Simple:** gpt-5-nano, gpt-5-mini, claude-3-5-haiku — brainstorming, lists, reformatting, definitions, quick calculations. **Everyday writing:** gpt-5-chat, claude-3-5-sonnet — emails, marketing copy, translation, meeting prep, rephrasing. **Reasoning and logic:** gpt-5 — complex spreadsheets, logistical problems, cause-effect analysis, process optimisation. **Deep-dives:** gpt-5, claude-3-7-sonnet — large report summaries, business cases, strategic plans, industry analysis, frameworks.

**2. Document size limits vary by model tier**

Light models (nano, mini, haiku) handle **8–16k tokens** (~6–12 pages). For large PDFs or reports, **gpt-5** is required. One page of text ≈ 750 tokens.

**3. Conver scales beyond Datascape — 6,500 vs ~200 users**

Datascape has been used by around **200 people**; Conver has gone through security, compliance, and scaling requirements to reach **6,500 people**. All existing Datascape agents will be integrated into Conver; Datascape remains a UAT base for new capabilities.

**4. Conver vs Copilot: different use cases and pricing**

Conver is available to everyone at a "far better price point"; Copilot licensing is more restricted. Teams Pro at **$10/user/month** is a better alternative than Copilot at **$50/user/month** for Teams summaries. Both tools run in parallel; Copilot is not disabled.

**5. Mandatory AI compliance module required for all users**

All Conver users must complete the [Datacom AI Compliance module](https://datacom.docebosaas.com/learn/course/12716/secure-use-of-generative-ai) by **Thursday 16 October**. This applies to **all users**, including pilot participants. Failure to complete by deadline results in access revocation.

**6. Supported file types for attachments**

PDF (.pdf), text (.txt), Word (.docx), Excel (.xlsx, .csv), PowerPoint (.pptx), images (.png, .jpg). For spreadsheet analysis, **gpt-5** is recommended; alternatively convert to CSV or break sheets into separate files.

**7. GCSE prompt formula for effective prompting**

**G**oal: What response do you want? **C**ontext: Why do you need it and who is involved? **S**ource: Which information sources or samples should it use? **E**xpectations: How should the tool respond? Example progression: "Summarise agile" → "Provide overview for new team, beginner-friendly" → "Detailed yet concise overview for developers transitioning to agile, use Agile Manifesto, include 1–2 real-world examples."

**8. Top 10 use cases with model recommendations**

| Use Case | Example Prompt | Model |
|----------|----------------|-------|
| Summarise | Summarise attached file for executive, highlight key ideas | gpt-5-mini |
| Ideate | Generate 10 creative names for IT project with energy customer | gpt-5-nano |
| Rephrase | Rewrite paragraph more formal for business report | claude-3-5-sonnet |
| Explain | Explain blockchain in simple terms for beginner | gpt-5-chat |
| Analyse | Analyse stack-trace and suggest fixes | gpt-5 |
| Research | Trends in AI-powered healthcare in NZ and Australia | gpt-5 |
| Compare | Features, pros/cons of iOS vs Android | claude-3-5-haiku |
| Identify | Emerging tech trends 2025 and next 5 years | gpt-5 |
| Suggest | Ways to engage new business customers in Australian market | gpt-5-mini |
| Drafting | User-friendly guide for onboarding developers to React | claude-3-7-sonnet |

**9. Data classification: customer data vs Datacom data**

**Customer data:** Any information from or about a customer (tickets, logs, configs, contracts). If a document contains one piece of customer data, the entire thing is customer data. **Datacom data:** Internal policies, anonymised templates, internal meeting notes. If unsure, assume confidential customer data. **No-go:** Unredacted PII, financial credentials, SPI, government-classified data, data not allowed to be processed in Australia.

**10. Conver limitations and constraints**

Conver can make mistakes or provide inaccurate information — always verify. It is **not connected to the live internet** and may not have recent events. It is **not connected to internal Datacom systems** (ServiceNow, HR platform). SharePoint access is via MCP and **currently in pilot**; OneDrive and Teams are not yet integrated. Hosted in **Australia** within Azure and AWS; local Datacom-hosted models on roadmap.

---

## 💡 Proposal

The Knowledge Hub serves as the central reference for Conver users, covering model selection, prompting, agents, artifacts, file attachments, bookmarks, and secure use.

- **Model selection** — Use task-based tier (Quick, Everyday, Reasoning, Deep-dive) with specific model recommendations
- **Effective prompting** — Apply GCSE formula and role/meta-prompting techniques
- **Agents and chained agents** — Build specialised agents and link them in sequence for automated workflows
- **Artifacts** — Enable Artifacts UI for HTML, Mermaid, React outputs; use for mockups, diagrams, dashboards
- **Secure use** — Follow data classification, complete mandatory training, apply "human in the loop" and email test
- **Support** — IT Service Desk for technical issues; conver@datacom.com for functional support

*The Hub is supplementary to the official Datacom Group Generative AI Secure Use Policy, Information Classification Handling Policy, and Code of Conduct.*

---

## ⚠️ Risks

- **Hallucinations:** AI can produce plausible but false information; users must verify outputs
- **PII exposure:** Never input unredacted PII; use placeholders like [Customer Name]
- **Customer data:** Only use with anonymisation, for that customer's work, and in compliance with customer data controls

---

## ✅ Next Steps

1. **Complete mandatory AI module** — All users by Thursday 16 October
2. **Explore model tiers** — Match tasks to Quick/Everyday/Reasoning/Deep-dive models
3. **Apply GCSE prompting** — Structure prompts with Goal, Context, Source, Expectations
4. **Build agents** — Create specialised agents and chains for repeatable workflows
5. **Enable Artifacts** — Use for mockups, diagrams, and interactive content
6. **Bookmark and organise** — Use bookmarks to filter conversations by project/topic

---

## 🔑 Close

> Conver is the foundation of Datacom's AI strategy, giving every employee access to powerful, secure AI tools. The Knowledge Hub provides the structure to use it effectively: task-based model selection, GCSE prompting, agents, artifacts, and strict data governance.

Conver is internally owned by Datacom's EASA (Enterprise Application Services) AI Team. Access requires mandatory AI compliance training, a Datacom device, and manager approval. For technical issues contact the IT Service Desk; for functional support email conver@datacom.com or consult this Hub.
