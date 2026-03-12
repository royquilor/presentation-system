# Conver
> AI Platform/Enabler (Foundations). Secure access to 13 AI models for all Datacom employees at $5/month per user.

**Author:** Joe Thornley & Jason Moss, Insights & Analytics
**Date:** March 2026
**Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA

---

## 🎯 Context

Conver gives every Datacom employee access to GPT-4o, Claude, Gemini, and 10 other AI models through one secure interface. It costs $5/user/month. Microsoft Copilot costs $50. Live at conver.datacom.com, hosted in Sydney.

**Status:** Production
**Owner:** joe.thornley@datacom.com

---

## 🔍 Problem

Employees needed AI access but Microsoft Copilot costs $3.9M/year for 6,500 staff and locks you into one vendor. The alternative was employees using public ChatGPT or Claude on their own, creating data exposure risk and IP leakage into public training datasets.

---

## 📋 Observations

**1. What you get**
One interface with 13 AI models from OpenAI, Anthropic, and Google. Upload files for analysis: PDFs, Word docs, spreadsheets, PowerPoints, images. Live web search with citations. Custom agents tailored to your workflow. Interactive artifacts generated in the browser. 14 features shipped to production including Code Interpreter, Memories, Autodocx, and Knowledge Base.

**2. Proof it works**
Janet Williams used chained agents to produce 4 developer-ready Jira tickets in 40 minutes. That previously took about 3 hours. Pubudu Nuwan automated AWS invoice PDF extraction to CSV, replacing a fully manual billing process. 30,000+ conversations from 3,000+ active users with 600% year-over-year adoption growth. Nobody was mandated to use it.

"AI doesn't just save me time, it makes that time richer." Janet Williams

**3. Who it's for**
All 6,500 Datacom employees across Australia and New Zealand. Business analysts draft tickets and requirements. Project managers summarise documents. Support teams resolve tickets faster. Developers write, debug, and explain code. Finance analyses spreadsheets and extracts invoice data. Power users build custom agents for multi-step automation. 9 contributors maintain the platform with a 4.0 FTE budget allocation.

**4. Getting started**
Request access via Activate (System Access request, takes 1-2 business days). Complete Datacom AI compliance training, approximately 2 weeks. Log in at conver.datacom.com with your SSO credentials. No new password, no new app to install.

**5. Security**
Hosted in Azure Australia East. Model inference stays in-region. Conversations encrypted at rest and never used for training. Full penetration test completed. Entra ID SSO. Real-time DLP guardrails blocking PII and sensitive data before it leaves your screen. Network-level controls and continuous monitoring.

**6. The numbers**
**$15.6M NZD** estimated annual productivity value (6,500 employees saving 1 hour/week at $50/hr loaded cost across 48 weeks). **826% ROI** at the conservative end. Year-1 investment: $905K to $1.685M. Infrastructure alone: $35K/year for 6,500 users. Break-even requires saving just 5 minutes per day, which is 0.1% of working time. 88% of NZ organisations report positive AI impact (Datacom 2025 State of AI Index).

**7. What's next**
Zendesk SITC integration for AI-assisted customer service. SPP/OpenAir integration for project and time data queries. Agent Library for discovering and reusing AI agents across the organisation. SharePoint integration for document search within conversations. ISO 27001 certification to enable offering Conver to external government clients.

---

## 💡 Proposal

Launch Conver at conver.datacom.com. Request access via Activate. Complete compliance training. Questions go to joe.thornley@datacom.com.

---

## 🔑 Close

> 13 models. $5/month. 6,500 employees. Hosted in Sydney. Zero data used for training.

conver.datacom.com
**Owner:** joe.thornley@datacom.com

*Metrics current as of March 2026. Next quarterly refresh: June 2026.*
