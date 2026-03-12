# Conver Backlog Snapshot 22 September 2025
> Roadmap summary of Conver features, tools, integrations, and platform enablers across three horizons (NOW, SOON, LATER)

**Author:** [Joe Thornley](https://datacomgroup.atlassian.net/wiki/people/62a65fd8188d08006fe06fc2)
**Date:** 22 September 2025
**Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40166228081

---

## 🎯 Context

The Conver Backlog Roadmap organises features, tools, and integrations into three horizons: **Horizon 1 (NOW)**, **Horizon 2 (SOON)**, and **Horizon 3 (LATER)**. The snapshot captures the state as of 22 September 2025, including platform enablers, guardrails, complex agents, and MCP integrations. GPT-5 migration is complete; MCP orchestration and several integrations are blocked by governance and security guardrails.

---

## 🔍 Problem

Conver must balance rapid feature delivery with governance, security, and compliance. Multiple Horizon 1 items (SharePoint, MCP Tools, Agent & Prompt Marketplace, Code Interpreter, Google Gemini) are built or in UAT but blocked by security clearance, guardrails, or governance. The backlog reflects the tension between technical readiness and organisational readiness for rollout.

---

## 📋 Observations

**1. Horizon 1 (NOW) — 12 items**
| Title | Status | Blocker |
|-------|--------|---------|
| SharePoint Integration (via MCP) | Running in dev | Compliance/security review; lack of governance over SharePoint file storage |
| Chatbot Memory | In UAT | Ready for production |
| Code Interpreter Tool (GitHub) | Validated, in UAT | Awaiting security clearance |
| Google Gemini Models | Complete in UAT | Pending licensing/security |
| GPT-5 Model Rollout | **DONE** — migrated all workloads, decommissioned GPT-4 | Monitoring in production |
| Token Cost Controls | Live in production | — |
| SOWgen Agent | Framework running | Needs scaling and MCP integration |
| MCP Tools Integration | In UAT | **Blocked** by governance/security guardrails |
| Adoption Dashboard (Power BI) | — | Daily team-level adoption for leaders |
| Agent & Prompt Marketplace | Built | Needs governance/security before release |

**2. Horizon 2 (SOON) — 8 items**
| Title | Status | Blocker |
|-------|--------|---------|
| Confluence & JIRA Integration (via MCP) | Built/validated | Needs guardrails & pilot |
| Internet Access Tools (Bing via Azure) | Dev in progress | Needs security/DLP approval |
| Datacom-Hosted OSS Models (incl. GPT-OSS) | Running in UAT | Needs sandbox testing + DLP guardrails |
| DataScape Agent Builder Integration | APIs available | **115+ agents** to bring into Conver; working on integration approach |
| Input/Output Content Safety & Scanning Guardrails | — | To be integrated with MCP |
| Security Certification & Compliance | — | SOC 2, controls, audits, documentation |
| Platform Reskin (Brand Alignment) | — | Fonts, colours, icons; design & accessibility testing |

**3. Horizon 3 (LATER) — 4 items**
| Title | Status |
|-------|--------|
| Conver Developer Program | Support advanced builders (AutoGen, Semantic Kernel); frameworks & publishing paths |
| Vibe Code Sharing Platform | In UAT with small teams; needs security review |
| Magentic-One General Agent (Microsoft Research) | Multi-agent (Orchestrator + WebSurfer, FileSurfer, Coder, ComputerTerminal); assess feasibility |
| DeepWiki_MCP | Query GitHub repo wikis via MCP; assess integration |

**4. DataScape integration — 115+ agents**
DataScape Agent Builder Integration brings **115+ existing agents** from the DataScape platform into Conver. APIs are available; integration approach is in progress. Likely to be part of Agent Marketplace rollout. Value: jumpstarts Marketplace with trusted agents; demonstrates Conver's ability to integrate with existing ecosystems.

**5. Datacom-hosted OSS models**
Datacom-hosted open-source models include large LLMs (e.g., **GPT-OSS 120B**) and smaller ones (e.g., Gemma, Phi). Inference stays within Datacom infrastructure. Models already stood up in UAT. Next: sandbox GPT-OSS 120B, validate performance, implement DLP and ethical guardrails. Will onboard smaller models for niche use cases.

**6. MCP orchestration — governance bottleneck**
MCP Tools Integration is the core back-end agent orchestration framework. Already running in UAT. Hold-up: establishing clear policy, guardrails, and security controls. Next: progressively roll out integrations with authenticated tools. Goal: establish approved marketplace for MCP and make available as "Tool" on Conver. Existing work focused on core integrations and essential tools.

**7. Platform enablers (Horizon 1)**
| Item | Purpose |
|------|---------|
| Token Cost Controls | Daily per-user token limits; live in production |
| LiteLLM | Cost control gateway; 100+ LLM providers; budgeting, spend tracking, rate limits, fallback, observability |
| Aikido (Continuous Code Review) | Static analysis, secret detection, dependency scanning, IaC/container checks; evaluate fit, integrate with pipelines |

**8. Complex agents**
| Agent | Horizon | Status |
|-------|---------|--------|
| SOWgen | 1 (NOW) | Framework running; needs scaling, MCP integration |
| RFPgen | 1 (NOW) | Build orchestration, templates, MCP agent, pilot with bid management |
| GPT_Researcher | 2 (SOON) | Evaluate, adapt to Conver UI, enable exporting, pilot with analysts |
| Magentic-One | 3 (LATER) | Assess feasibility; test specialised agents in UAT; validate guardrails |
| DeepWiki_MCP | 2 (SOON) | Integrate for GitHub repo wiki queries; assess private repo support |

---

## 💡 Proposal

Execute the roadmap in horizon order, prioritising unblocking governance and security for MCP and marketplace items.

- **Horizon 1:** Complete security clearance for Code Interpreter, Google Gemini; establish MCP governance/guardrails; release Chatbot Memory to production; resolve SharePoint governance
- **Horizon 2:** Finalise Confluence/JIRA guardrails and pilot; secure Bing/DLP approval; sandbox GPT-OSS 120B; integrate DataScape 115+ agents; achieve SOC 2; complete Platform Reskin
- **Horizon 3:** Launch Conver Developer Program; scale Vibe Code Sharing; assess Magentic-One and DeepWiki_MCP

*Technical build is ahead of governance; the primary lever is establishing clear policy and security controls for MCP and marketplace rollout.*

---

## ⚠️ Risks

- **Governance bottleneck:** MCP Tools, Agent & Prompt Marketplace, and several integrations are blocked by governance/security—delays adoption and value realisation.
- **SharePoint governance:** Lack of governance over how files are stored in SharePoint blocks SharePoint MCP connector; new methodology under consideration.
- **Internet access complexity:** Bing integration introduces DLP complexity; security approval required for platform-wide rollout.
- **OSS model guardrails:** GPT-OSS 120B and smaller models need DLP and ethical guardrails before production use.

---

## ✅ Next Steps

1. **Establish MCP governance** — Define policy, guardrails, and security controls to unblock MCP Tools Integration rollout.
2. **Complete security clearance** — Code Interpreter and Google Gemini for controlled release.
3. **SharePoint governance** — Develop methodology for file storage governance to unblock connector.
4. **DataScape integration** — Define integration approach for 115+ agents; align with Agent Marketplace rollout.
5. **Sandbox GPT-OSS 120B** — Validate performance; implement DLP and ethical guardrails.
6. **Platform Reskin** — Redesign UI components; validate accessibility; roll out in phases.

---

## 🔑 Close

> Conver's technical capabilities (GPT-5, MCP, Code Interpreter, 115+ DataScape agents, OSS models) outpace governance readiness—establishing clear policy and security controls is the critical path to unlocking value.

The backlog shows strong build momentum: GPT-5 migration complete, multiple items in UAT, and a clear three-horizon structure. The primary constraint is governance and security sign-off for MCP, marketplace, and integrations. Platform Reskin (Horizon 2) will align UI with new company branding.
