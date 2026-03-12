# Getting Started (Local and Azure Dev)

> A comprehensive developer onboarding guide covering prerequisites, environment setup, database connectivity, local development workflow, and enterprise troubleshooting for the Datacom Agent Library.

**Author:** [Dipesh Trikam](https://datacomgroup.atlassian.net/wiki/people/712020:06f04ec7-5f4c-4e03-a2a3-3e46b413e073)
**Date:** 13 September 2025
**Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40061763856

---

## 🎯 Context

This guide is aimed at developers — both new and experienced — joining the Datacom Agent Library project within the Insights & Analytics team. It covers both **local development** (running all three apps on localhost) and **enterprise Azure development** (connecting to the live UAT environment). The guide reflects the project's multi-VNet Azure architecture, meaning some setup steps require Azure network access or CLI permissions beyond standard developer onboarding.

---

## 🔍 Problem

Setting up a development environment for an enterprise serverless system with private network connectivity is significantly more complex than a standard web project. Developers need to configure Azure AD authentication, connect to databases accessible only via VNet peering or private endpoints, and manage CORS and JWT bypass settings correctly — all before writing a single line of feature code.

---

## 📋 Observations

- **Three concurrent applications** must run simultaneously: API on port 7071 (Azure Functions), Client App on port 5174 (Vite), and Admin App on port 3000 (Vite); `npm run dev:all` starts all three
- Prerequisites include Node.js 18+, Azure Functions Core Tools v4, Azure CLI, and VS Code with a defined set of Azure + MongoDB extensions
- Environment configuration requires copying three example files (`env.dev.example`, `local.settings.example.json`) and populating Azure AD tenant/client IDs and database credentials from the EAS team
- MongoDB is accessible only via VNet peering (private IP); local developers either connect via Azure VPN/Bastion or run a local Docker MongoDB instance for development
- CosmosDB is only accessible via private endpoint — local development against UAT CosmosDB requires VNet connectivity; a Windows-only CosmosDB emulator is the alternative
- JWT validation can be bypassed locally via `BYPASS_JWT_VALIDATION=true` in `local.settings.json` — this must never be enabled in production
- A health check script and `watch` command are documented for monitoring API response time and database connectivity during development
- Key Azure permissions required: Contributor, Network Contributor, Private DNS Zone Contributor, and Key Vault Contributor on the relevant resource groups

---

## 💡 Proposal

The guide establishes a **tiered development approach**: developers can work entirely locally with Docker-based databases and JWT bypass for rapid iteration, or connect directly to the UAT environment for integration testing against live data and real Azure AD authentication. The comprehensive troubleshooting section (VNet peering verification, CORS configuration, JWT validation errors, CosmosDB DNS resolution) is designed to unblock common setup failures without requiring team support.

---

## ⚠️ Risks

- Local development with `BYPASS_JWT_VALIDATION=true` means authentication bugs will only surface when testing against UAT, increasing the risk of auth regressions reaching integration environments
- The Docker MongoDB option is disconnected from the UAT data model and migration state, meaning locally developed features may behave differently against the real database schema
- Requiring VPN/Bastion for full-fidelity development creates an access barrier for contractors or remote developers without corporate network access
- Azure CLI permissions (Network Contributor, Private DNS Zone Contributor) are elevated and may not be available to all developers, blocking some setup verification steps

---

## ✅ Next Steps

- Obtain Azure AD app registration credentials from the EAS team before starting environment setup
- Request Azure VPN or Bastion access if full UAT database connectivity is required
- Run the provided health check script (`dev-health-check.sh`) to validate the full stack before beginning feature work
- Review the architecture (`02-architecture.md`) and authentication docs (`04-authentication.md`) to understand the system before making changes

---

## 🔑 Close

The most critical setup step is correctly configuring Azure AD credentials and database connectivity — once the health check reports MongoDB and CosmosDB as connected and response time at ~12ms, the development environment is fully operational.

---

📌 **Document Type:** Developer Onboarding / Setup Guide
📅 **Last Updated:** 13 September 2025
🔗 **Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40061763856
