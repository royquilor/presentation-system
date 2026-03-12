# API Guide

> A comprehensive API reference for the Datacom Agent Library's Azure Functions backend, covering all endpoints, authentication, data models, error handling, and integration patterns.

**Author:** [Dipesh Trikam](https://datacomgroup.atlassian.net/wiki/people/712020:06f04ec7-5f4c-4e03-a2a3-3e46b413e073)
**Date:** 13 September 2025
**Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40061796665

---

## 🎯 Context

The Datacom Agent Library exposes a **RESTful API** built on Azure Functions, serving as both the operational backend for the platform and an **enterprise API template** demonstrating Well-Architected Framework best practices. The UAT environment (`datacom-agent-library-fa-uat.azurewebsites.net`) is live and production-ready. This guide is intended for developers integrating with the API, building on the platform, or using it as a reference implementation.

---

## 🔍 Problem

Without a clear, centralised API reference, integrating with or extending the Agent Library becomes error-prone, particularly given the JWT authentication requirement, role-based endpoint restrictions, and the dual data source (MongoDB for personal data, CosmosDB for public directory). Developers need a single document covering authentication setup, all endpoint signatures, data models, error codes, and integration patterns.

---

## 📋 Observations

- Current API performance: **12ms average response time** (99.8% improvement over the original 5000ms+), 99.9% uptime, 8.5/10 WAF compliance
- **8 modules** are exposed: `/api/agents`, `/api/public-agents`, `/api/prompts`, `/api/public-prompts`, `/api/users`, `/api/approvals`, `/api/email`, `/api/health`
- All endpoints require a **Bearer JWT token** in the `Authorization` header; tokens are obtained from Azure AD using the `access_as_user` scope
- Three roles control access: `user` (own content + public read), `admin` (full access), `moderator` (approval and public content management)
- All list endpoints support consistent **pagination** (`page`, `limit`), **search** (`search` string), **filtering** (by category, status, author), and **sorting** (field + order)
- A **bulk approval endpoint** (`POST /api/approvals/bulk-approve`) supports efficient admin operations with an array of IDs
- Rate limiting is enforced: 100 requests/minute per user, 10 requests/second burst; rate limit headers are included in responses
- Interactive Swagger documentation is available at `/api/swagger` in both local and Azure environments
- Error responses follow a consistent schema: `{ success: false, error: { code, message, details } }` with well-defined error codes (e.g., `AUTHENTICATION_ERROR`, `VALIDATION_ERROR`, `NOT_FOUND`)

---

## 💡 Proposal

The API is designed around a **module-per-entity pattern** with clear role-based access boundaries: users manage their own content via `/api/agents` and `/api/prompts`, discover approved content via `/api/public-agents` and `/api/public-prompts`, and admins/moderators manage the approval pipeline via `/api/approvals`. All integrations should use the provided TypeScript client class pattern (`AgentLibraryAPI`) or import the OpenAPI spec from Swagger into Postman for test-driven integration.

---

## ⚠️ Risks

- Production URL is listed as `TBD` — integrations built against UAT endpoints will require a URL update at production launch, creating a deployment risk if not managed via environment configuration
- The `BYPASS_JWT_VALIDATION` development flag documented elsewhere means local development does not exercise the auth path — authentication bugs may not surface until UAT testing
- Rate limiting (100 req/min) may be insufficient for admin workflows that involve bulk operations or reporting dashboards; the bulk-approve endpoint partially mitigates this but other bulk scenarios are not addressed
- No versioning strategy is documented for the API — breaking changes to endpoint contracts could affect existing integrations without a clear migration path

---

## ✅ Next Steps

- Confirm and document the production base URL once the production environment is deployed
- Import the OpenAPI spec from `/api/swagger` into the team's Postman workspace and share with all integration teams
- Define an API versioning strategy (e.g., URL versioning `/api/v2/`) before the platform reaches wider adoption
- Review rate limits against expected admin and reporting usage patterns and adjust if needed

---

## 🔑 Close

The Agent Library API is a **high-performance, enterprise-compliant RESTful interface** — its 12ms response time, consistent error schema, and Swagger documentation make it integration-ready, but teams should lock in the production URL and establish a versioning policy before broader adoption.

---

📌 **Document Type:** API Reference
📅 **Last Updated:** 13 September 2025
🔗 **Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40061796665
