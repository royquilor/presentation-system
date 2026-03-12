# Roadmap - DRAFT

> Draft roadmap for DatacomChat (Conver) — role-based assistants, misuse monitoring, publishing, specialised assistants, and memory capabilities

**Author:** [Jason Moss](https://datacomgroup.atlassian.net/wiki/people/5ee93943b04ccf0aae6712f4)
**Date:** 30 May 2025
**Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/39636010283

---

## 🎯 Context

The DatacomChat application roadmap outlines desired functionality for configurable, role-based assistants and plug-ins. The draft covers security (misuse monitoring, temporary conversations), publishing and export, specialised analysis assistants, policy QnA, project creation, documentation sources, timesheets, data backends, SOW/RFP workflows, project management, and memory (user, agent, context). All assistants and plug-ins are role-based.

---

## 🔍 Problem

DatacomChat needs to support team- or person-specific agents with access to data and workflows that should not be accessible to others. There is a need for Datacom-specific misuse monitoring beyond standard guardrails (e.g., personal information, excluded customers). Some users require temporary conversations that are not recorded. Output must be publishable to multiple formats and locations. Specialised analysis, policy QnA, project creation, and data-backed assistants are required.

---

## 📋 Observations

**1. Role-based access and misuse monitoring**
All assistants and plug-ins are role-based. Functionality should be configurable per user to allow team- or person-specific agents with restricted data/workflow access. Monitoring for Datacom-specific misuse is required: entering personal information, discussing customers that have opted out, or other introduced policies — beyond standard guardrails.

**2. Temporary conversations**
Temporary conversations that do not get recorded; configurable per user. Some persons' usage must be monitored, so the feature cannot be universal.

**3. Publishing and export**
Output to be exported or published to: Confluence, SharePoint, MS Word, Excel, PDF, and other locations.

**4. Specialised data analysis assistants**
Assistants designed for particular analysis types: finance, ticket analysis, timesheets, etc.

**5. Policy bot — QnA over internal policies**
Questions about HR, security, and other policies able to be answered.

**6. Project create**
Uses approved templates and branding. Asks questions to build out content. Uses categorisation to identify previous similar projects to analyse results (cost etc). Content automatically created based on guidelines and pre-configured templates.

**7. Documentation sources**
Plugins or assistants pointed at Confluence, Jira, and SharePoint sources — "Question your own documentation source."

**8. Timesheets (TACO integration)**
Ability to upload timesheets (DatacomChat) or direct connection to data backend (TACO) for timesheet summaries suitable for reporting and team management.

**9. Data backends — "Ask the data"**
Various data backends: Turbo, Financials, DOME (or replacement), etc.

**10. SOW and RFP workflows**
- **SOW Reviews:** Auto review and feedback for SOWs based on criteria controlled by service line or team manager
- **RFP response assistants:** Access to all questions and answers previously provided

**11. Project manager assistant**
Able to provide updates on project status, seek updates from individuals.

**12. Memory — three scopes**
- **User memory:** Keeps a memory of key information about a user to enhance user experience
- **Agent memory:** A tool added to agents that when called creates memory specifically for that agent (e.g., project tracking — user creates agent to track their projects)
- **Memory context:** User, Company, Domain, Project

**13. Shared Integrated Prompt Library**
Enable a shared prompt library integrated into DatacomChat so that "runbooks" and specialised prompts can be easily shared.

---

## 💡 Proposal

Implement a configurable, role-based DatacomChat platform with misuse monitoring, publishing, specialised assistants, and memory capabilities.

- Enable role-based assistants and plug-ins — configurable per user, team/person-specific agents
- Implement misuse monitoring — Datacom-specific (PII, excluded customers, policies)
- Support temporary conversations — configurable per user where monitoring is required
- Enable publishing to Confluence, SharePoint, Word, Excel, PDF
- Build specialised assistants — finance, tickets, timesheets, policy QnA, project create, SOW/RFP, project manager
- Integrate documentation sources — Confluence, Jira, SharePoint
- Integrate data backends — TACO, Turbo, Financials, DOME
- Implement memory — user, agent, context (User/Company/Domain/Project)
- Create Shared Integrated Prompt Library — runbooks and specialised prompts

*The roadmap positions DatacomChat as a configurable platform for internal efficiency, knowledge access, and workflow automation.*

---

## ⚠️ Risks

- **Scope creep:** The roadmap covers many distinct capabilities; prioritisation and phasing are not defined — risk of dilution.
- **Temporary conversations and audit:** Configurable "no recording" creates audit and compliance challenges; must align with Pathway to Security and Compliance requirements.
- **Data backend integrations:** Turbo, Financials, DOME integrations require significant API and access control work; dependencies may block delivery.

---

## ✅ Next Steps

1. **Prioritise roadmap items** — Define phases and sequencing for the 15+ capability areas
2. **Role-based access design** — Define RBAC model for assistants and plug-ins
3. **Misuse monitoring specification** — Define Datacom-specific misuse rules and monitoring approach
4. **Temporary conversations policy** — Align with compliance; define configurable rules
5. **Publishing integration** — Confluence, SharePoint, Office, PDF — API and auth requirements
6. **Shared Prompt Library** — Design integration and sharing model

---

## 🔑 Close

> All assistants and plug-ins are role-based — configurable per user for team- or person-specific agents with restricted data and workflows.

The draft roadmap outlines a broad vision for DatacomChat: role-based assistants, misuse monitoring, publishing, specialised analysis (finance, tickets, timesheets), policy QnA, project creation, documentation and data backend integrations, SOW/RFP workflows, project manager assistant, and memory at user, agent, and context levels. Prioritisation and implementation sequencing are not yet defined.
