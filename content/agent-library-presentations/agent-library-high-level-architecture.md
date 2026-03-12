# Agent Library — High-Level Architecture

> A comprehensive architecture reference document covering system design decisions, component structure, security model, deployment strategy, and compliance framework for the Datacom Agent Library platform.

**Author:** [Dipesh Trikam](https://datacomgroup.atlassian.net/wiki/people/712020:06f04ec7-5f4c-4e03-a2a3-3e46b413e073)
**Date:** 21 August 2025
**Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40045674637

---

## 🎯 Context

The Agent Library is an internal Datacom platform for discovering, sharing, and managing AI agents. The architecture was designed by the Datacom development team and follows the Azure Well-Architected Framework. The system serves all Datacom employees and is managed by designated administrators responsible for the agent approval workflow.

---

## 🔍 Problem

The platform required a secure, scalable, and maintainable architecture that supports role-based access control, comprehensive audit logging, and multi-application independence — all while avoiding the complexity of monorepo structures and self-managed infrastructure.

---

## 📋 Observations

- **Non-monorepo architecture (ADR-001)** — separate repositories for client app, admin app, and API enable independent deployment, team autonomy, and technology flexibility at the cost of some code duplication.
- **Vite chosen over Next.js (ADR-002)** — no SSR needed for internal apps; Vite provides faster development cycles and simpler deployment with existing team expertise.
- **Azure Functions backend (ADR-003)** — serverless model provides automatic scaling, pay-per-use pricing, and native Azure AD integration; cold starts are mitigated via the premium plan.
- **Dual database strategy** — MongoDB (Cosmos DB API) for personal/user data and Cosmos DB for public shared agents; private endpoints keep all database traffic within the Azure network.
- **Azure API Management (ADR-005)** — centralised API gateway provides rate limiting, security policy enforcement, analytics, and developer documentation.
- **Security layers include** Entra ID SSO, JWT validation on every API call, Azure Key Vault for secrets, Cloudflare WAF (post-launch), and multi-VNet peering for network isolation.
- **Compliance targets** include GDPR data minimisation, ISO 27001 information security management, SOC 2, and quarterly access reviews with just-in-time admin access.

---

## 💡 Proposal

The architecture adopts a cloud-native, fully managed Azure PaaS approach: two React SPAs hosted on Azure Static Web Apps, a Node.js Azure Functions API, Cosmos DB for data persistence, and Azure Key Vault for credential management. This design eliminates all VM/OS patching burdens, provides automatic scaling, and enforces security at every layer through Azure-native controls and Entra ID identity.

---

## ⚠️ Risks

- **Cold start latency** — Azure Functions serverless model introduces cold start delays; mitigated by the premium plan but not fully eliminated.
- **NoSQL learning curve** — Cosmos DB introduces different query patterns and consistency trade-offs compared to relational databases.
- **Multiple repository overhead** — the non-monorepo decision requires managing separate CI/CD pipelines and dependency updates across repos.
- **Additional latency from APIM** — the API Management gateway adds a network hop; may require tuning for latency-sensitive operations.
- **Microservices and multi-region not yet implemented** — identified as future considerations; current single-region deployment may not meet future global distribution needs.

---

## ✅ Next Steps

- Configure Cloudflare WAF and Application Insights monitoring prior to production go-live.
- Evaluate and establish performance baselines under production load, particularly for cold start behaviour.
- Implement quarterly access reviews as part of the governance framework.
- Consider microservices migration and multi-region deployment as the platform scales beyond its initial Datacom audience.
- Finalise infrastructure-as-code (IaC) for all Azure resources to support repeatable environment provisioning.

---

## 🔑 Close

The Agent Library architecture is a security-first, fully managed Azure PaaS design that prioritises operational simplicity and developer productivity — with clear architectural decision records and a well-defined path to future scalability.

---

📌 **Document Type:** Architecture Doc
📅 **Last Updated:** 21 August 2025
🔗 **Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40045674637
