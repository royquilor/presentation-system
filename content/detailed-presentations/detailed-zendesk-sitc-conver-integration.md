# Zendesk SITC Conver Integration
> Integration layer connecting Conver AI chat to Zendesk Support and Stock in the Channel for natural language business data queries

**Author:** [Dipesh Trikam](https://datacomgroup.atlassian.net/wiki/people/557058:e9d25d3a-2620-4614-b9ff-ee3ec2eb3a1b)
**Date:** 9 February 2026
**Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40747171868

---

## 🎯 Context

The Conver MCP Server is an integration layer that connects **Conver** (Datacom's AI chat platform) to **Zendesk Support** and **Stock in the Channel (SITC)**. It enables support and sales staff to query business data using natural language without switching between multiple tools. The solution is owned by Platform Engineering and uses the Model Context Protocol (MCP) for orchestration.

---

## 🔍 Problem

Support and sales staff need to access ticket status, SITC data, and other business information quickly. Without integration, they must manually switch between Conver, Zendesk, and SITC—slowing response times and fragmenting workflows. The MCP Server solves this by allowing staff to ask questions in plain language (e.g., _"What's the status of ticket #12345?"_) and receive answers directly in Conver.

---

## 📋 Observations

**1. End-to-end query flow**
The integration follows a clear pipeline: Staff Member → Conver Chat → AI Model → MCP Server → Zendesk / SITC → Answer. The AI model determines which tool to call; the MCP Server queries Zendesk or SITC via their APIs; data is returned and formatted as natural language.

**2. Access control is AD group-based**
Access is controlled through **Active Directory group membership**. Only users in the designated AD security group (e.g., `Conver-Users`) can log into Conver and use the MCP tools. Users must contact their IT administrator to be added to the Conver-Users AD group.

**3. Technical configuration**
| Item | Details |
|------|---------|
| Platform | Conver |
| Protocol | Model Context Protocol (MCP) |
| Data Sources | Zendesk Support, Stock in the Channel |
| Access Control | Active Directory group-based |
| Server Port | 8003 |
| Health Check | `GET /healthz` |

**4. Space and status**
The integration is documented under Insights & Analytics → AI Projects → Active. Labels include `conver`, `mcp`, `zendesk`, `sitc`, `overview`. Status is Published; last updated February 2026.

**5. Single interface for multiple systems**
Staff can query both Zendesk and SITC from one interface. Example queries include ticket status checks, SITC stock levels, and related business data—all without leaving Conver.

---

## 💡 Proposal

Deploy and maintain the Conver MCP Server as the standard integration for Zendesk and SITC access via Conver.

- Enable support and sales staff to query Zendesk and SITC via natural language in Conver
- Use MCP for tool orchestration and API calls to Zendesk and SITC
- Manage access via AD group membership (Conver-Users)
- Expose health checks at `GET /healthz` on port 8003

*The integration is live and documented; ongoing work focuses on access management and operational monitoring.*

---

## ⚠️ Risks

- **Access sprawl:** AD group membership must be kept up to date to avoid unauthorised access or orphaned accounts.
- **API dependency:** Reliance on Zendesk and SITC APIs; outages or changes could affect availability.

---

## ✅ Next Steps

1. **Access requests** — Direct users to IT administrators for Conver-Users AD group membership.
2. **Health monitoring** — Use `GET /healthz` for uptime and availability checks.
3. **Documentation** — Keep Confluence and operational docs aligned with any changes.

---

## 🔑 Close

> Staff can query Zendesk and SITC in natural language from Conver, reducing context switching and speeding up support and sales workflows.

The MCP Server is the bridge between Conver and Zendesk/SITC. Access is controlled via AD groups, and the integration is documented and published for Platform Engineering and Insights & Analytics stakeholders.
