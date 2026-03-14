# Agent Library — Architecture & Performance
> Serverless Azure Functions, dual database, 12ms API response, 99.9% availability — how the Agent Library is built

**Author:** Dipesh Trikam — Insights & Analytics
**Date:** March 2026
**Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40043905712/Agent+Library

---

## 🎯 Context

The Agent Library runs on a serverless Azure architecture designed for enterprise-grade performance. The platform delivers 12ms API response time, 99.9% availability, and an 8.5/10 Azure WAF score. Consumption-based pricing means it costs nothing when idle.

The platform serves as both a functional AI agent and prompt management system for the organisation, and as a reference template for future enterprise Azure projects at Datacom.

---

## 🔍 Problem

Traditional VM-based AI platforms have always-on costs, manual scaling, and complex deployment.
A modern AI agent catalogue needs to scale automatically, cost near-zero at low usage, and still deliver sub-second response times under load.

Datacom lacked a centralised, governed platform for discovering and sharing AI agents and prompts across teams, leading to siloed usage and no quality controls. New enterprise projects repeatedly had to solve the same architecture problems without a proven, reusable reference.

---

## 📋 Observations

**1. Architecture overview**

Non-monorepo structure with independent deployment (ADR-001). React frontend (ADR-002). Azure Functions serverless backend (ADR-003). Dual database: MongoDB + CosmosDB (ADR-004). Azure APIM for API gateway (ADR-005).

**2. Performance metrics**

Average API response time: 12ms. Platform availability: 99.9%. 400x improvement from baseline. 50+ API endpoints serving 150+ features.

**3. Serverless advantages**

Consumption-based pricing — pay only when functions execute. Automatic scaling — no manual capacity planning. Zero cost when idle — perfect for a catalogue with variable access patterns. 70% cost reduction vs traditional always-on VM deployment.

**4. Dual database architecture**

MongoDB is the primary data store for agents, prompts, and metadata. CosmosDB serves as the complementary store for specific workloads. VNet peering enables secure database connectivity. Total database cost is approximately $50 per month.

**5. API gateway**

Azure APIM provides a unified API surface. Rate limiting, authentication, and monitoring are handled at the gateway level. Clean separation between frontend and backend services.

**6. Agent lifecycle features**

Versioning system provides full history for agents and prompts. Feature flagging enables controlled rollouts for new capabilities. Approval workflows require moderator review before agents are shared. Rating and duplication tracking across the catalogue.

**7. Admin panel architecture**

Three dashboards: Reports, Audit, Admin. Real-time usage statistics and adoption trends. Full audit trail with agent-level access logs. Mobile-responsive design (QA tested).

**8. Key architectural decisions (ADRs)**

ADR-001: Non-monorepo for independent service deployment. ADR-002: React for frontend — familiar ecosystem, component library. ADR-003: Azure Functions — serverless, event-driven, consumption pricing. ADR-004: Dual database — flexibility for different data patterns. ADR-005: Azure APIM — enterprise API management.

---

## 🏗️ System Architecture Components

**1. Client App (Port 5174)**

React 18+ with Vite, TypeScript, Tailwind CSS, and MSAL.js. Features include Agent Directory, Prompt Library, submission workflow, rating system, personal management, sharing controls, and user profiles. Architecture patterns: component composition, custom hooks, context providers, error boundaries, lazy loading.

**2. Admin App (Port 3000)**

React 18+ with Vite, TypeScript, Tailwind CSS, and MSAL.js with RBAC. Features include Approval Dashboard, User Management, System Monitoring, Audit Logging, Content Moderation, and Analytics. Architecture patterns: role-based UI, bulk operations, real-time updates, audit trail, responsive design.

**3. Azure Functions API (Port 7071)**

Node.js 18+ with Azure Functions v4 and TypeScript. Modules include agents, prompts, users, approvals, public-agents, public-prompts, email, health, and swagger. Features: RESTful API, JWT validation, RBAC, Joi validation, rate limiting, CORS, and health checks.

**4. Enterprise Data Layer**

MongoDB (private VNet 172.19.0.0/16) stores agents, prompts, users, approvals, ACL entries, access roles, categories, ratings, and projects. CosmosDB (private endpoint 172.21.0.0/16) holds public-agents, public-prompts, categories, ratings, and search-index. Azure Blob Storage handles attachments, images, legacy approvals, exports, and backups.

---

## 📊 Azure Well-Architected Framework Compliance

**1. WAF score and pillars**

Overall Azure Well-Architected Framework score: 8.5/10 (A-). Security pillar leads at 9/10. Performance Efficiency lowest at 7/10. Up from 7.2/10 baseline.

**2. Network and security**

Multi-VNet architecture (172.21.0.0/16 ↔ 172.19.0.0/16). VNet peering for secure database connectivity. Private endpoints, zero-trust architecture. Ready for enterprise replication.

**3. Performance targets**

API response time: less than 200ms for 95% of requests. Page load time: less than 2 seconds for initial load. Database query time: less than 100ms for 95% of queries. Availability: 99.9% uptime target.

---

## 🔐 Security Architecture

**1. Authentication flow**

User accesses the application; MSAL.js redirects to Azure AD for authentication. Azure AD returns an authorization code; MSAL.js exchanges it for an access token. The token is included in API requests; Azure Functions validates the JWT and processes the request with user context.

**2. Authorization and security features**

Role-based access control (RBAC) with granular permissions. JWT validation with issuer and audience verification. CORS configuration, rate limiting, input validation. SQL injection prevention, XSS protection, CSRF protection. Encryption at rest (AES-256) and in transit (TLS 1.3).

---

## 📈 Performance and Scaling

**1. Caching and optimisation**

CDN caching for static assets. API response caching for frequently accessed data. Database indexing for common queries. Connection pooling, lazy loading, code splitting.

**2. Scalability features**

Azure Functions auto-scale based on demand. Load balancing via Azure Application Gateway. Database sharding for horizontal scaling. Read replicas, async processing for background jobs.

**3. Cost and capacity**

Consumption-based — costs nothing when idle. ~$50/month total database cost. Supports 500+ concurrent users (target: 1000+). Less than 0.1% error rate.

---

## 💡 Proposal

The serverless architecture delivers enterprise performance at startup cost. Continue investing in the platform as the foundation for AI agent sharing across Datacom.

The platform is designed as a reusable enterprise reference architecture: proven security patterns (zero-trust network, private endpoints, JWT/RBAC), Infrastructure as Code deployment scripts, and comprehensive documentation are all structured to be lifted and adapted for new Datacom projects.

---

## ⚠️ Risks

**Production not yet deployed** — WAF score and performance metrics reflect UAT only and may differ under real production load.

**Performance Efficiency gap** — Lowest pillar at 7/10 indicates caching and multi-database strategy still have room for improvement.

**Concurrent user target** — 1000+ exceeds current validated capacity (500+), requiring further load testing before full production rollout.

**VNet peering dependency** — Coupling between separately managed resource groups could affect reliability during infrastructure changes.

**Cold start latency** — Stateless Azure Functions may experience cold starts (mitigated with premium plan).

---

## ✅ Next Steps

1. **Deploy production** — Deploy production environment (`rg-datacom-agent-library-prod`) using the validated UAT template.

2. **Address Performance Efficiency** — Improve the 7/10 pillar through caching enhancements and database query optimisation.

3. **Load testing** — Conduct load testing to validate 1000+ concurrent user target.

4. **Formalise as reference template** — Socialise the project as an official enterprise reference template with the Architecture team.

5. **Continue platform investment** — Invest in the platform as the foundation for AI agent sharing across Datacom.

---

## 🔑 Close

> 12ms. 99.9%. $50/month. Serverless. Scales to zero. Scales to thousands.

Five architectural decisions. Enterprise performance. Startup economics. The Agent Library is simultaneously a live AI resource management platform and a validated enterprise architecture template — its 8.5/10 WAF score and 12ms response time make it a credible foundation for replication across future Datacom projects.

---

📌 **Document Type:** Overview / Architecture & Performance
📅 **Last Updated:** March 2026
🔗 **Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40043905712/Agent+Library
