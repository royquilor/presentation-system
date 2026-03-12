# Architecture

> A detailed technical architecture document covering the system components, data layer design, security model, data flows, and deployment strategy of the Datacom Agent Library.

**Author:** [Dipesh Trikam](https://datacomgroup.atlassian.net/wiki/people/712020:06f04ec7-5f4c-4e03-a2a3-3e46b413e073)
**Date:** 17 September 2025
**Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40061796638

---

## 🎯 Context

This document describes the technical architecture of the Datacom Agent Library — an Azure-hosted, enterprise-grade serverless system within the Insights & Analytics space. It targets architects, senior developers, and operations engineers who need a deep understanding of how the system is structured. The architecture achieves **8.5/10 WAF compliance** and is maintained by Dipesh Trikam and the EAS team.

---

## 🔍 Problem

Enterprise AI management platforms require careful architectural decisions across security, data strategy, scalability, and operational excellence — all simultaneously. A naive implementation risks poor performance, weak security boundaries, high operational cost, or difficulty scaling. This document captures the deliberate design choices made to achieve production-grade quality across all these dimensions.

---

## 📋 Observations

- **Frontend** consists of two React 18 + TypeScript + Tailwind CSS apps (Client App on port 5174, Admin App on port 3000) sharing a common `shared/` component library with Radix UI primitives
- **Backend** is Azure Functions v4 (Node.js 18+, TypeScript) organised into discrete modules: agents, prompts, users, approvals, public-agents, public-prompts, email, health, and swagger
- **Data layer** uses a **dual database strategy**: MongoDB (VM-hosted, private VNet, ~12ms) for personal/private data, CosmosDB serverless (private endpoint, ~5ms) for public directory, and Azure Blob Storage for files and legacy data
- Authentication follows a full OAuth 2.0 PKCE flow via MSAL.js → Azure AD → JWT, with RS256 validation on every API request; RBAC enforced via `requireRole` and `requireOwnership` middleware
- Key data flows include: agent submission → MongoDB save → email notification → admin review → status update → user notification; and public agent access → CosmosDB query with filters and pagination
- Architecture patterns used: Module Pattern, Middleware Pattern, Repository Pattern, Service Pattern, and Factory Pattern in the API layer
- MongoDB collections include: users, agents, prompts, promptgroups, approvals, aclentries, accessroles, categories, ratings, projects
- Monitoring via Application Insights with structured JSON logging, health endpoints per module, and performance/error alerting

---

## 💡 Proposal

The architecture is a **purpose-built multi-tier serverless design** where each layer has a clearly bounded responsibility: presentation (React SWAs), API gateway (Azure Functions), and data (dual databases + blob). The dual-database strategy is the centrepiece — MongoDB handles mutable, personal, access-controlled data while CosmosDB handles high-read, globally consistent public content. Security is enforced at the network layer (VNet peering, private endpoints, NSGs) and application layer (JWT, RBAC, CORS, input validation) in parallel.

---

## ⚠️ Risks

- The dual-database strategy adds synchronisation complexity — approved items must be promoted from MongoDB to CosmosDB correctly, and any failure in that promotion pipeline could cause stale public content
- MongoDB is VM-hosted rather than a managed service, introducing manual patching, scaling, and HA responsibilities not present with fully managed alternatives
- CosmosDB serverless pricing can spike unpredictably under heavy read workloads given the public-directory access pattern
- The shared component library (`shared/`) creates a coupling point between the two frontend apps; breaking changes require coordinated deployments

---

## ✅ Next Steps

- Document and test the MongoDB → CosmosDB approval promotion pipeline to ensure data consistency
- Evaluate migrating VM-hosted MongoDB to MongoDB Atlas or Azure Cosmos DB for MongoDB API for reduced operational burden
- Define and test auto-scaling behaviour for Azure Functions under the 1000+ concurrent user target
- Establish a versioning and backward-compatibility policy for the `shared/` package

---

## 🔑 Close

The architecture's most important decision is the **dual database strategy** — routing personal data through MongoDB and public content through CosmosDB — which enables both strong access control and high-performance public browsing within a single serverless platform.

---

📌 **Document Type:** Architecture Doc
📅 **Last Updated:** 17 September 2025
🔗 **Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40061796638
