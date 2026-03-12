# MCP Server Integration

> A technical integration guide for migrating the SOWGen MCP (Model Context Protocol) server from AWS API Gateway to Azure API Management, including updated authentication, API definitions, deployment options, and testing procedures.

**Author:** [Dipesh Trikam](https://datacomgroup.atlassian.net/wiki/people/712020:06f04ec7-5f4c-4e03-a2a3-3e46b413e073)
**Date:** 27 October 2025
**Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40283635932

---

## 🎯 Context

The SOWGen platform — which generates Statements of Work (SOW) for Datacom — is being migrated from AWS to Azure as part of the SoWGen Azure Migration project (Insights & Analytics). This document targets Integration Engineers and API Developers responsible for updating the Python-based MCP server (`app/mcp/sowgen_mcp_server.py`) to communicate with the new Azure-hosted backend.

---

## 🔍 Problem

The existing MCP server is hardcoded to an AWS API Gateway endpoint with a single API key authentication method. The Azure migration requires the server to target a new Azure API Management (APIM) endpoint and support dual authentication (API key via `Ocp-Apim-Subscription-Key` header, or Azure AD OAuth2 client credentials), while maintaining the same MCP tool interface consumed by DatacomChat and automated pipelines.

---

## 📋 Observations

- **Four MCP tools are exposed:** `generate_sow_document` (POST /generate), `check_document_status` (GET /documents/{id}), `get_document_files` (GET /documents/{id}/files with pre-signed download URLs for DOCX/PDF/CSV), and `list_recent_documents` (GET /documents/history).
- **Dual auth support:** The server prefers Azure AD (`ClientSecretCredential` with `api://sowgen/.default` scope) and falls back to API key (`Ocp-Apim-Subscription-Key`) if AD credentials are absent or fail.
- **Azure API Management enforces:** Rate limiting (1,000 calls/hour per subscription), JWT validation for Bearer tokens, API key validation, request size limits (100 KB), and correlation ID injection on every request and response.
- **Response caching** is set at 60 seconds on the APIM outbound policy, reducing duplicate load for repeated status checks.
- **Two deployment options are documented:** Azure Container Instances (simpler, recommended for the MCP server) and Azure Container Apps (with autoscaling from 1–5 replicas, preferred for production scale).
- **The migration checklist** covers 10 tasks including updating `SOWGEN_API_URL`, configuring Azure AD credentials, testing all four MCP tools, deploying to ACI/ACA, and updating DNS.
- **Integration tests** cover document generation (asserting `document_id` and `PENDING` status), status polling, and file retrieval (asserting `download_url` presence).

---

## 💡 Proposal

Update `sowgen_mcp_server.py` to target the Azure APIM endpoint (`apim-sowgen-prod.azure-api.net`) with a `_get_auth_headers()` helper that transparently handles Azure AD token acquisition (preferred) or API key fallback. Package the server as a Docker container and deploy to Azure Container Instances or Azure Container Apps, configured via environment variables (`SOWGEN_API_URL`, `AZURE_TENANT_ID`, `AZURE_CLIENT_ID`, `AZURE_CLIENT_SECRET` or `SOWGEN_API_KEY`). The MCP tool interface remains unchanged, ensuring zero breaking changes for DatacomChat and any automated pipeline integrations.

---

## ⚠️ Risks

- **Authentication fallback gap:** If both Azure AD credentials and the API key are misconfigured, the server raises a `ValueError` at startup and will not serve any requests — appropriate but requires clear runbook documentation.
- **30-second request timeout:** SOW generation may take longer for complex documents; if the Azure backend is slow, clients will receive timeout errors and need to implement polling via `check_document_status`.
- **Pre-signed URL expiry:** Download URLs expire (default "1 hour") — consumers must retrieve and use them promptly; caching URLs beyond their TTL will cause broken downloads.
- **APIM rate limit (1,000/hour):** High-volume automated pipeline use cases could exhaust the per-subscription limit; separate subscriptions or limit increases may be required.
- **Azure AD token refresh:** The current implementation fetches a new token on every request; there is no token caching, which adds latency and unnecessary token requests at scale.

---

## ✅ Next Steps

- Update `SOWGEN_API_URL` in the MCP server and all dependent environment configurations to the Azure APIM endpoint.
- Configure and validate Azure AD app registration (`AZURE_TENANT_ID`, `AZURE_CLIENT_ID`, `AZURE_CLIENT_SECRET`) in the target environment.
- Run the integration test suite (`tests/test_mcp_integration.py`) against the Azure dev environment to verify all four MCP tools.
- Build and push the Docker image to Azure Container Registry, then deploy to Container Instances or Container Apps.
- Update DatacomChat and any CI/CD pipelines with the new MCP server URL, and monitor API usage via Azure API Management analytics.

---

## 🔑 Close

The migration is largely a configuration and authentication update — the MCP tool interface is unchanged — making it low-risk provided Azure AD credentials and APIM policies are correctly validated before switching production traffic.

---

📌 **Document Type:** Architecture Doc / Integration Guide
📅 **Last Updated:** 27 October 2025
🔗 **Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40283635932
