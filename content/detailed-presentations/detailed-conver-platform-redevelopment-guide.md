# Conver Platform - Redevelopment Guide

> Comprehensive redevelopment strategy to achieve Azure WAF A+ Grade with decoupled architecture, hybrid compute, and enterprise security

**Author:** [Dipesh Trikam](https://datacomgroup.atlassian.net/wiki/people/557058:e9d25d3a-2620-4614-b9ff-ee3ec2eb3a1b)
**Date:** 11 December 2025
**Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40533688413

---

## 🎯 Context

The Conver Platform currently runs as a tightly coupled single container (dc-brand-mcp-dev) combining MCP Server, Brand System, and all tools in one Python container. The guide outlines a redevelopment strategy to achieve decoupled architecture, flexible compute (Azure Functions + Container Apps), enterprise security via API Management, network isolation, and BrandAgentBot tool integration for DatacomChat. Target: Azure WAF A+ Grade.

---

## 🔍 Problem

The current architecture has a single point of failure, no independent scaling of components, no API gateway security layer, a public endpoint with basic auth only, and no network isolation. The MCP server is tightly coupled to the FastMCP framework with all brand tools embedded in a single container.

---

## 📋 Observations

**1. Existing Azure Resources (rg-datacom-brand-agent-dev)**
| Resource | Type | Purpose |
|----------|------|---------|
| dc-brand-agent-dev | Azure OpenAI | GPT-4o model for AI processing |
| dcbrandagentdev | Container Registry | Docker images for Brand Agent |
| dc-brand-env-dev | Container Apps Environment | Hosting environment |
| dc-brand-mcp-dev | Container App | Brand Agent MCP server |
| workspace-* | Log Analytics | Logging and monitoring |

**2. Azure Functions vs Containers — Comparison Matrix**
| Criteria | Azure Functions | Container Apps | Recommendation |
|---------|-----------------|----------------|-----------------|
| Cold Start | 1-5s (Consumption), 0s (Premium) | 5-30s | Functions (Premium) |
| Scale to Zero | ✅ Native | ✅ Supported | Both viable |
| Max Execution | 10 min (Consumption), 60 min (Premium) | Unlimited | Containers for long ops |
| Cost (Low Traffic) | Very low (pay-per-execution) | Higher (min replicas) | Functions |
| Cost (High Traffic) | Can be expensive | More predictable | Containers |

**3. Hybrid architecture decision — workload split**
- **Azure Functions for:** SVG Color Transformation (< 30s), Color Validation (< 5s), Typography Spec Retrieval (< 1s), Spacing Validation (< 1s), webhook handlers
- **Container Apps for:** MCP Server (long-running, stateful sessions), Document Validation (large file processing, > 5 min), Complex Infographic Generation (AI-intensive), real-time streaming operations

**4. VNet architecture — subnet layout**
- **subnet-apim** (10.0.0.0/24): API Management (Internal mode), NSG: Allow 443 from Front Door only
- **subnet-aca** (10.0.1.0/24): Container Apps Environment, MCP Server, Document Validator
- **subnet-functions** (10.0.2.0/24): Azure Functions (Premium with VNet Integration)
- **subnet-pe** (10.0.3.0/24): Private Endpoints (pe-storage, pe-keyvault, pe-openai, pe-redis)
- VNet: vnet-brand-agent-dev (10.0.0.0/16)

**5. BrandAgentBot tool — operations and timeout**
BrandAgentBot.js supports six operations: validate_colors, transform_svg, get_typography, validate_document, generate_infographic, list_colors. Default timeout: **30 seconds**. Environment variables: BRAND_AGENT_ENDPOINT, BRAND_AGENT_USE_APIM, APIM_BRAND_AGENT_ENDPOINT, APIM_SUBSCRIPTION_KEY.

**6. APIM rate limiting and CORS**
- Rate limit: **100 calls per 60 seconds** per subscription key
- CORS allowed origins: https://conver.datacom.com, https://localhost:3080
- JWT validation via Entra ID; required claims: Brand.Read, Brand.Write

**7. Implementation roadmap — four phases**
- **Phase 1 Foundation:** VNet, subnets, NSGs; Azure Functions (Premium); Private Endpoints, DNS Zones
- **Phase 2 API Management:** APIM (Developer SKU), API definitions, JWT validation, rate limiting
- **Phase 3 Integration:** BrandAgentBot tool, DatacomChat UI updates, end-to-end testing
- **Phase 4 Production:** Azure Front Door (WAF + DDoS), App Insights, Alerts, documentation

**8. Network security — Azure Front Door**
OWASP 3.2 ruleset, Geo-filtering (AU/NZ only), Bot protection, TLS 1.3. Private Link to VNet.

---

## 💡 Proposal

Transform the Conver Platform into an enterprise-grade, WAF A+ aligned architecture with decoupled microservices, hybrid compute, API Management as AI Gateway, and network isolation.

- Decouple MCP from agent framework — separate MCP Gateway from business logic
- Implement hybrid compute — Azure Functions for stateless (< 30s), Containers for stateful (> 5 min)
- Deploy API Management as AI Gateway — OAuth 2.0/JWT, rate limiting, request/response logging
- Implement network isolation — VNets, Private Endpoints, NSGs, Private DNS Zones
- Integrate BrandAgentBot.js — seamless DatacomChat tool for brand operations

*The guide provides complete Azure CLI commands for VNet, subnets, NSGs, APIM creation, and a full BrandAgentBot.js implementation with manifest.json and index.js integration.*

---

## ⚠️ Risks

- **Migration complexity:** Decoupling MCP from the agent framework requires significant refactoring; existing integrations may break during transition.
- **Cost implications:** APIM Developer SKU and Premium Functions with VNet Integration increase baseline cost versus current single-container setup.
- **Dependency on azure-samples:** Implementation references azure-samples/remote-mcp-functions-python and azure-samples/ai-gateway — changes to these references could affect implementation.

---

## ✅ Next Steps

1. **Phase 1 Foundation** — Create VNet with subnets, deploy Azure Functions for brand services, set up Private Endpoints for storage and Key Vault
2. **Phase 2 API Management** — Deploy APIM in internal mode, import Functions and Container APIs, configure JWT validation and rate limiting
3. **Phase 3 Integration** — Implement BrandAgentBot in DatacomChat, update frontend UI, conduct end-to-end testing
4. **Phase 4 Production** — Set up Azure Front Door with WAF, configure monitoring and alerts, update documentation

---

## 🔑 Close

> Decouple MCP from business logic, use hybrid compute (Functions + Containers), and achieve WAF A+ with API Management and network isolation.

The redevelopment guide provides a comprehensive roadmap with exact resource names, subnet CIDRs, rate limits, and implementation code. The target architecture achieves single point of failure elimination, independent scaling, API gateway security, and network isolation — addressing all current state limitations.
