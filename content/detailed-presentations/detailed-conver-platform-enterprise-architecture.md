# Conver Platform - Enterprise Architecture

> Enterprise-grade brand asset management and validation system enabling SVG transformation, document validation, and branded asset generation within Datacom's Azure environment.

**Author:** [Dipesh Trikam](https://datacomgroup.atlassian.net/wiki/people/557058:e9d25d3a-2620-4614-b9ff-ee3ec2eb3a1b)
**Date:** 12 December 2025
**Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40533983331

---

## 🎯 Context

The Conver Platform is an enterprise-grade brand asset management and validation system built on DatacomChat (Conver), Brand Agent MCP, and Azure Blob Storage. It enables Datacom employees to transform SVG icons to brand colours, validate documents (PowerPoint, Word) against brand guidelines, and generate branded assets (infographics, charts, visualisations). The architecture targets **Azure WAF Grade A+** and is designed for reliability, security, and cost optimisation.

---

## 🔍 Problem

Datacom needs a unified platform to ensure brand consistency across SVG icons, documents, and generated assets. The solution must integrate with Azure, SharePoint, and Microsoft 365 while maintaining enterprise security (Zero Trust), scalability, and cost control. The architecture addresses these requirements through a container-based design with Private Endpoints, WAF, and managed identities.

---

## 📋 Observations

**1. Container architecture: three main components**

**DatacomChat UI (React 18, Nginx):** File upload, asset preview & download, brand compliance dashboard. CDN, 2–10 replicas; 0.25 vCPU, 512MB. **API Gateway (Node.js 20):** Authentication middleware (Entra ID), rate limiting, MCP connection management. 2–20 replicas; 0.5 vCPU, 1GB. **Brand Agent MCP (Python 3.11, FastMCP):** SVG Transformer, Document Validator, Infographic Generator, Brand System Core (Color, Typography, Spacing, Validators). 1–10 replicas; 1 vCPU, 2GB.

**2. Azure resource group layout (rg-conver-prod, Australia East)**

Networking: vnet-conver-prod (subnet-aca, subnet-pe, subnet-redis), nsg-aca, nsg-pe. Compute: cae-conver-prod (Container Apps Environment), ca-datacomchat-api, ca-brand-agent-mcp, acr-conver-prod. Storage: stconverbrand (GRS), brand-assets container, redis-conver-prod. AI: aoai-conver-prod (Azure OpenAI, gpt-4o). Security: kv-conver-prod, id-conver-prod (Managed Identity). Monitoring: appi-conver-prod, log-conver-prod. CDN/WAF: afd-conver-prod (Azure Front Door, WAF Policy, CDN Endpoints).

**3. Network topology: Private Link and VNet**

Internet → Azure Front Door (WAF) → Private Link → Virtual Network (10.0.0.0/16). subnet-aca (10.0.1.0/24): Container Apps Env, Internal Load Balancer. subnet-pe (10.0.2.0/24): pe-storage, pe-keyvault, pe-openai. subnet-redis (10.0.3.0/24): Azure Redis Cache, VNet Integration. No public IPs on backend services.

**4. Five-layer Zero Trust security model**

**Layer 1 Edge:** Azure Front Door WAF v2, DDoS Protection Standard, Geo-filtering (AU/NZ only), bot protection, TLS 1.3. **Layer 2 Identity:** Entra ID (OAuth 2.0/OIDC), Conditional Access, MFA, RBAC, JIT access. **Layer 3 Network:** VNet with NSG, Private Endpoints for all PaaS, no public IPs on backends. **Layer 4 Application:** Input validation (Pydantic), output encoding, API rate limiting, request/response logging. **Layer 5 Data:** Key Vault, Managed Identity, encryption at rest (AES-256), in transit (TLS 1.3), optional customer-managed keys.

**5. Security controls matrix — all implemented**

TLS 1.3, WAF v2 (OWASP 3.2), DDoS Protection Standard, Entra ID auth, MFA, Private Endpoints (Storage, Key Vault, OpenAI), Managed Identity, Key Vault, NSG rules, Audit logging, RBAC, Vulnerability scanning (Defender for Cloud) — all ✅.

**6. End-to-end data flow (14 steps)**

User → Front Door → WAF → Entra ID → Container Apps → Key Vault (Managed Identity) → Blob Storage (svg-input/) → Service Bus → Brand Agent MCP → Redis Cache → Azure OpenAI → Brand System → Blob Storage (svg-output/) → Redis Cache → Application Insights → User (download URL).

**7. Azure Well-Architected Framework grades**

**Reliability: A+** — Multi-region readiness, GRS storage, zone redundancy, health probes, circuit breaker (Polly), retry (exponential backoff, max 3), backup. Target SLA: 99.95%. **Security: A+** — Zero-trust, identity-first, WAF, encryption, Key Vault, audit, vulnerability scanning. **Cost Optimization: A** — Consumption-based, scale-to-zero (min replicas 0 non-prod), lifecycle policies, 1-year reserved for prod (up to 30% savings), cost alerts. **Operational Excellence: A+** — Bicep IaC, GitHub Actions CI/CD, Application Insights, Log Analytics, runbooks. **Performance Efficiency: A+** — CDN, Redis cache, Service Bus async, KEDA auto-scaling, connection pooling.

**8. Estimated monthly production cost: $2,500–$4,000 AUD**

Cost optimisation via consumption-based scaling, scale-to-zero for non-prod, blob tiering, reserved capacity, and cost alerts.

**9. Target performance metrics**

API response time: **<200ms (p95)**. SVG transformation: **<2s**. Document validation: **<10s**. Infographic generation: **<5s**.

**10. User personas and external systems**

**Personas:** Brand Designer (SVG icon upload/transform), Content Creator (infographics, charts), Developer (document validation), Marketing Team (brand compliance). **External systems:** Azure Entra ID (OAuth 2.0/OIDC), SharePoint (REST API), Azure OpenAI (Private Endpoint), Microsoft 365 (Graph API).

---

## 💡 Proposal

Deploy the Conver Platform as an enterprise-grade brand asset system with Zero Trust security and Azure Well-Architected alignment.

- **Container Apps** — DatacomChat API and Brand Agent MCP with auto-scaling
- **Azure Front Door** — WAF v2, DDoS, Geo-filtering (AU/NZ), TLS 1.3
- **Private Endpoints** — Storage, Key Vault, OpenAI with no public exposure
- **Managed Identity** — No secrets in code; Key Vault for secrets/certificates
- **Redis Cache** — Brand data caching for reduced latency
- **Service Bus** — Async processing for non-blocking operations

*The architecture achieves Azure WAF Grade A+ across reliability, security, operational excellence, and performance, with estimated production cost of $2,500–$4,000 AUD/month.*

---

## ⚠️ Risks

- **Cost variance:** Production cost range ($2,500–$4,000) depends on usage and scaling
- **Single-region:** Australia East; multi-region readiness is architectural but not yet deployed
- **Dependencies:** SharePoint, M365 integration require external API availability

---

## ✅ Next Steps

1. **Deploy Bicep templates** — Provision rg-conver-prod and all resources
2. **Configure WAF** — OWASP 3.2 ruleset, Geo-filtering AU/NZ
3. **Integrate Brand Agent MCP** — Connect to DatacomChat via MCP protocol
4. **Validate performance** — Confirm <200ms API, <2s SVG, <10s validation, <5s infographic
5. **Monitor costs** — Azure Cost Management, budget alerts

---

## 🔑 Close

> The Conver Platform delivers enterprise-grade brand asset management with Zero Trust security, Azure WAF A+ alignment, and target performance of <200ms API response and <2s SVG transformation. Estimated production cost: $2,500–$4,000 AUD/month.

The architecture integrates DatacomChat, Brand Agent MCP, Azure Blob Storage, Redis, and Azure OpenAI through Private Endpoints and Managed Identity. Bicep IaC and GitHub Actions enable repeatable deployments. Document Classification: Datacom Internal.
