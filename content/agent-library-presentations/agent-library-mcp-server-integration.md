# MCP Server Integration

> A technical integration guide for migrating the SOWGen MCP (Model Context Protocol) server from AWS API Gateway to Azure API Management, including protocol fundamentals, server implementation, tool definitions, authentication, deployment, and testing.

**Author:** Dipesh Trikam
**Date:** 27 October 2025
**Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40283635932

---

## 🎯 Context

The Model Context Protocol (MCP) Server provides programmatic access to SOWGen's document generation capabilities for AI agents, chatbots, and automated systems. This document details how the MCP server integrates with the Azure-based SOWGen platform.


The SOWGen platform generates professional Statements of Work (SOW) for Datacom and is being migrated from AWS to Azure as part of the SoWGen Azure Migration project within Insights & Analytics. The document targets Integration Engineers and API Developers responsible for updating the Python-based MCP server.


**Space:** Insights & Analytics | **Path:** Insights & Analytics → AI Projects → Active → SoWGen Azure Migration Documentation → MCP Server Integration | **Reading Time:** 15 minutes

---

## 🔍 Problem

The existing MCP server is hardcoded to an AWS API Gateway endpoint with a single API key authentication method. The Azure migration requires the server to target a new Azure API Management (APIM) endpoint and support dual authentication.


The server must support API key via `Ocp-Apim-Subscription-Key` header or Azure AD OAuth2 client credentials, while maintaining the same MCP tool interface consumed by DatacomChat and automated pipelines. Any breaking changes would disrupt existing integrations.

---

## 📋 Observations

**1. Four MCP tools are exposed**

The server exposes four tools: `generate_sow_document` (POST /generate), `check_document_status` (GET /documents/{id}), `get_document_files` (GET /documents/{id}/files with pre-signed download URLs for DOCX/PDF/CSV), and `list_recent_documents` (GET /documents/history). Each tool maps to a specific Azure API operation.


**2. Dual authentication support**

The server prefers Azure AD (`ClientSecretCredential` with `api://sowgen/.default` scope) and falls back to API key (`Ocp-Apim-Subscription-Key`) if AD credentials are absent or fail. This provides flexibility for different deployment contexts.


**3. Azure API Management enforcement**

APIM enforces rate limiting (1,000 calls/hour per subscription), JWT validation for Bearer tokens, API key validation, request size limits (100 KB), and correlation ID injection on every request and response. Response caching is set at 60 seconds on the outbound policy.


**4. Two deployment options documented**

Azure Container Instances (simpler, recommended for the MCP server) and Azure Container Apps (with autoscaling from 1–5 replicas, preferred for production scale). Both use Docker images and environment variable configuration.


**5. Migration checklist coverage**

The checklist covers 10 tasks including updating `SOWGEN_API_URL`, configuring Azure AD credentials, testing all four MCP tools, deploying to ACI/ACA, and updating DNS. Each task is actionable and verifiable.


**6. Integration test coverage**

Tests cover document generation (asserting `document_id` and `PENDING` status), status polling, and file retrieval (asserting `download_url` presence). Tests use a dev environment and test API key.


**7. Zero breaking changes for consumers**

The MCP tool interface remains unchanged. DatacomChat and automated pipelines require no code modifications — only configuration updates for the new MCP server URL and optional Azure AD credentials.

---

## 💡 Proposal

Update `sowgen_mcp_server.py` to target the Azure APIM endpoint (`apim-sowgen-prod.azure-api.net`) with a `_get_auth_headers()` helper that transparently handles Azure AD token acquisition (preferred) or API key fallback.


Package the server as a Docker container and deploy to Azure Container Instances or Azure Container Apps, configured via environment variables (`SOWGEN_API_URL`, `AZURE_TENANT_ID`, `AZURE_CLIENT_ID`, `AZURE_CLIENT_SECRET` or `SOWGEN_API_KEY`). The MCP tool interface remains unchanged, ensuring zero breaking changes for DatacomChat and any automated pipeline integrations.

---

## ⚠️ Risks

**Authentication fallback gap** If both Azure AD credentials and the API key are misconfigured, the server raises a `ValueError` at startup and will not serve any requests — appropriate but requires clear runbook documentation.


**30-second request timeout** SOW generation may take longer for complex documents; if the Azure backend is slow, clients will receive timeout errors and need to implement polling via `check_document_status`.


**Pre-signed URL expiry** Download URLs expire (default "1 hour") — consumers must retrieve and use them promptly; caching URLs beyond their TTL will cause broken downloads.


**APIM rate limit (1,000/hour)** High-volume automated pipeline use cases could exhaust the per-subscription limit; separate subscriptions or limit increases may be required.


**Azure AD token refresh** The current implementation fetches a new token on every request; there is no token caching, which adds latency and unnecessary token requests at scale.


**Container cold starts** Azure Container Instances and Container Apps may experience cold start delays when scaling from zero; consider minimum replicas for production.

---

## ✅ Next Steps

1. **Update SOWGEN_API_URL** — Update in the MCP server and all dependent environment configurations to the Azure APIM endpoint.
2. **Configure Azure AD** — Configure and validate Azure AD app registration (`AZURE_TENANT_ID`, `AZURE_CLIENT_ID`, `AZURE_CLIENT_SECRET`) in the target environment.
3. **Run integration tests** — Run the integration test suite (`tests/test_mcp_integration.py`) against the Azure dev environment to verify all four MCP tools.
4. **Build and deploy** — Build and push the Docker image to Azure Container Registry, then deploy to Container Instances or Container Apps.
5. **Update clients** — Update DatacomChat and any CI/CD pipelines with the new MCP server URL, and monitor API usage via Azure API Management analytics.
6. **Document runbook** — Document authentication failure scenarios and recovery steps for operations teams.

---

## 🔑 Close

> The migration is largely a configuration and authentication update — the MCP tool interface is unchanged — making it low-risk provided Azure AD credentials and APIM policies are correctly validated before switching production traffic.

Key success factors: Dual authentication support for flexibility; unchanged tool interface for zero consumer impact; Docker-based deployment for portability; comprehensive integration tests for validation; clear migration checklist for execution. The SOWGen MCP server will be fully operational on Azure once the checklist is completed and clients are updated.

---

## 📑 Flex: MCP Protocol Fundamentals

**1. Model Context Protocol overview**

The Model Context Protocol (MCP) is a standard that enables AI applications to connect to external data sources and tools. MCP servers expose capabilities (tools, resources) that AI clients can discover and invoke. The protocol uses JSON-RPC 2.0 over stdio or HTTP transports.


**2. MCP server responsibilities**

Servers advertise available tools with names, descriptions, and parameter schemas. Clients send tool call requests; servers execute and return results. The protocol supports streaming for long-running operations. Authentication is transport-dependent (e.g., API keys, OAuth for HTTP).


**3. FastMCP framework**

The SOWGen server uses FastMCP, a Python framework for building MCP servers. It provides decorators (`@mcp.tool()`) for tool registration, automatic schema generation from function signatures, and built-in transport handling. The server runs via `fastmcp run sowgen_mcp_server.py`.

---

## 📑 Flex: Current AWS Architecture

**1. AWS integration configuration**

The current server targets AWS API Gateway in ap-southeast-2. Configuration uses environment variables for the API URL and key. Requests include `X-Api-Key` and `X-User-Id` headers. The integration endpoint is a single POST to `/generate` for document creation.


**2. Current AWS code pattern**

```python
# Current AWS Integration
SOWGEN_API_URL = "https://8tk1868dkj.execute-api.ap-southeast-2.amazonaws.com/prod/api/v1/integration"
SOWGEN_API_KEY = os.environ.get("SOWGEN_API_KEY")

# Makes requests to AWS API Gateway
response = requests.post(
    f"{SOWGEN_API_URL}/generate",
    json=payload,
    headers={
        "X-Api-Key": SOWGEN_API_KEY,
        "X-User-Id": DATACOMCHAT_USER_ID,
        "Content-Type": "application/json"
    }
)
```

---

## 📑 Flex: Target Azure Server Implementation

**1. Azure configuration and imports**

```python
# app/mcp/sowgen_mcp_server.py (Updated for Azure)

import os
import requests
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from azure.identity import DefaultAzureCredential, ClientSecretCredential
from fastmcp import FastMCP

# Azure Configuration
SOWGEN_API_URL = os.environ.get(
    "SOWGEN_API_URL",
    "https://apim-sowgen-prod.azure-api.net/api/v1/integration"
)

# Authentication: Support both API Key and Azure AD
SOWGEN_API_KEY = os.environ.get("SOWGEN_API_KEY")  # For API key auth
AZURE_TENANT_ID = os.environ.get("AZURE_TENANT_ID")
AZURE_CLIENT_ID = os.environ.get("AZURE_CLIENT_ID")
AZURE_CLIENT_SECRET = os.environ.get("AZURE_CLIENT_SECRET")

# MCP Server Setup
mcp = FastMCP(
    "SOWGen_Service",
    instructions="This MCP server generates professional Statements of Work (SOW). "
                 "Use the available tools to create, monitor, and retrieve documents."
)
```


**2. Authentication helper**

```python
# --- Authentication Helper ---
def _get_auth_headers() -> Dict[str, str]:
    """Returns authentication headers for Azure API Management"""

    headers = {
        "Content-Type": "application/json",
        "X-User-Id": os.environ.get("DATACOMCHAT_USER_ID", "MCP-User")
    }

    # Prefer Azure AD authentication if credentials available
    if AZURE_TENANT_ID and AZURE_CLIENT_ID and AZURE_CLIENT_SECRET:
        try:
            credential = ClientSecretCredential(
                tenant_id=AZURE_TENANT_ID,
                client_id=AZURE_CLIENT_ID,
                client_secret=AZURE_CLIENT_SECRET
            )
            token = credential.get_token("api://sowgen/.default")
            headers["Authorization"] = f"Bearer {token.token}"
        except Exception as e:
            print(f"Warning: Azure AD auth failed, falling back to API key: {e}")
            if SOWGEN_API_KEY:
                headers["Ocp-Apim-Subscription-Key"] = SOWGEN_API_KEY
    elif SOWGEN_API_KEY:
        headers["Ocp-Apim-Subscription-Key"] = SOWGEN_API_KEY
    else:
        raise ValueError(
            "Authentication not configured. Set either "
            "(AZURE_TENANT_ID, AZURE_CLIENT_ID, AZURE_CLIENT_SECRET) or SOWGEN_API_KEY"
        )
    return headers
```


**3. API request helper**

```python
def _make_api_request(method: str, endpoint: str, **kwargs) -> Dict[str, Any]:
    """Make authenticated request to Azure API Management."""
    url = f"{SOWGEN_API_URL}{endpoint}"
    headers = _get_auth_headers()
    try:
        response = requests.request(
            method=method, url=url, headers=headers, timeout=30, **kwargs
        )
        response.raise_for_status()
        if response.status_code == 204:
            return {}
        return response.json()
    except requests.exceptions.HTTPError as http_err:
        try:
            return http_err.response.json()
        except ValueError:
            return {"error": "HTTP error", "details": str(http_err)}
    except requests.exceptions.Timeout:
        return {"error": "Request timeout", "details": "Timed out after 30 seconds"}
    except requests.exceptions.RequestException as req_err:
        return {"error": "Network error", "details": str(req_err)}
```

---

## 📑 Flex: MCP Tool Definitions

**1. generate_sow_document tool**

```python
@mcp.tool()
def generate_sow_document(
    customer_name: str,
    customer_short_name: str,
    project_name: str,
    requirements: str,
    document_ref_id: str,
    company_name: str = "Datacom Systems (AU) Pty Limited",
    contract_type: str = "General",
    document_type: str = "sow",
    pricing_type: str = "fp",
    country_code: str = "AU",
    country_subdivision: str = 'VIC',
    expected_start_date: str = (datetime.now() + timedelta(days=30)).strftime('%Y-%m-%d'),
) -> Dict[str, Any]:
    """Generates a complete Statement of Work (SOW) document via Azure SOWGen."""
    payload = {
        "customer_name": customer_name,
        "customer_short_name": customer_short_name,
        "project_name": project_name,
        "company_name": company_name,
        "contract_type": contract_type,
        "document_type": document_type,
        "pricing_type": pricing_type,
        "requirements": requirements,
        "country_code": country_code,
        "country_subdivision": country_subdivision,
        "expected_start_date": expected_start_date,
        "document_ref_id": document_ref_id,
    }
    cleaned_payload = {k: v for k, v in payload.items() if v is not None}
    response = _make_api_request("POST", "/generate", json=cleaned_payload)
    if "document_id" in response:
        return {
            "document_id": response.get("document_id"),
            "status": response.get("status"),
            "message": response.get("message", "Document generation initiated"),
            "created_at": response.get("created_at")
        }
    return response
```


**2. check_document_status and get_document_files tools**

```python
@mcp.tool()
def check_document_status(document_id: str) -> Dict[str, Any]:
    """Checks the generation status of a specified document."""
    response = _make_api_request("GET", f"/documents/{document_id}")
    if "status" in response:
        return {
            "status": response["status"],
            "document_title": response.get("document_title", ""),
            "project_name": response.get("project_name", ""),
            "created_at": response.get("created_at", ""),
            "completed_at": response.get("completed_at", ""),
            "error": response.get("error", "")
        }
    return response

@mcp.tool()
def get_document_files(document_id: str) -> Dict[str, Any]:
    """Retrieves download URLs for generated documents (DOCX, PDF, CSV)."""
    response = _make_api_request("GET", f"/documents/{document_id}/files")
    if "files" in response:
        essential_extensions = ["docx", "pdf", "csv"]
        essential_files = []
        for file_info in response["files"]:
            if file_info.get("extension") in essential_extensions:
                download_response = _make_api_request(
                    "GET", f"/documents/{document_id}/download/{file_info['name']}"
                )
                if "download_url" in download_response:
                    essential_files.append({
                        "name": file_info["name"],
                        "size": file_info.get("size", 0),
                        "extension": file_info.get("extension", ""),
                        "download_url": download_response["download_url"],
                        "expires_in": download_response.get("expires_in", "1 hour")
                    })
        return {
            "document_id": document_id,
            "files": essential_files,
            "message": f"Found {len(essential_files)} files ready for download"
        }
    return response
```


**3. list_recent_documents and startup validation**

```python
@mcp.tool()
def list_recent_documents(limit: int = 10) -> Dict[str, Any]:
    """Lists recent documents for the authenticated user."""
    return _make_api_request("GET", f"/documents/history?limit={limit}")

if __name__ == "__main__":
    if not SOWGEN_API_URL:
        print("FATAL ERROR: SOWGEN_API_URL must be set.")
        exit(1)
    if not (SOWGEN_API_KEY or (AZURE_TENANT_ID and AZURE_CLIENT_ID and AZURE_CLIENT_SECRET)):
        print("FATAL ERROR: Either SOWGEN_API_KEY or Azure AD credentials must be set.")
        exit(1)
    print("✅ SOWGen MCP Server configured for Azure")
    print(f"   API URL: {SOWGEN_API_URL}")
    print(f"   Auth Method: {'Azure AD' if AZURE_TENANT_ID else 'API Key'}")
    print("Run with: fastmcp run sowgen_mcp_server.py")
```

---

## 📑 Flex: Azure API Management Configuration

**1. API operations**

- **POST /api/v1/integration/generate** — Generate document (operationId: generate-document). Security: apiKey or oauth2. Responses: 200, 400, 401, 429.
- **GET /api/v1/integration/documents/{documentId}** — Get status (operationId: get-document-status). Responses: 200, 404.
- **GET /api/v1/integration/documents/{documentId}/files** — List files (operationId: list-document-files). Responses: 200.
- **GET /api/v1/integration/documents/{documentId}/download/{filename}** — Get download URL (operationId: download-document-file). Responses: 200.


**2. Security schemes**

- **apiKey** — Type: apiKey, Name: Ocp-Apim-Subscription-Key, In: header.
- **oauth2** — Type: oauth2, clientCredentials, Token URL: https://login.microsoftonline.com/{tenant}/oauth2/v2.0/token, Scope: api://sowgen/.default.


**3. APIM policies (inbound)**

Rate limiting: 1000 calls per 3600 seconds per subscription. Validate JWT for Bearer tokens (audience api://sowgen) or API key. Input validation: max 102400 bytes, JSON content type. Add correlation ID (GUID) to X-Correlation-ID header. Log to Event Hub: timestamp, operation, correlationId, userId.


**4. APIM policies (backend, outbound, on-error)**

Backend: forward request, 300s timeout. Outbound: add X-Correlation-ID, cache successful responses 60s. On-error: set body with error, message, correlationId.

---

## 📑 Flex: Deployment and Transport Configuration

**1. Dockerfile**

```dockerfile
# Dockerfile for MCP Server
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY sowgen_mcp_server.py .
EXPOSE 8080
CMD ["fastmcp", "run", "sowgen_mcp_server.py", "--host", "0.0.0.0", "--port", "8080"]
```


**2. Azure Container Instances deployment**

```bash
az acr build --registry sowgenacr --image mcp-server:latest --file Dockerfile .

az container create \
  --resource-group rg-sowgen-prod \
  --name mcp-server-prod \
  --image sowgenacr.azurecr.io/mcp-server:latest \
  --cpu 1 --memory 1 \
  --registry-login-server sowgenacr.azurecr.io \
  --registry-username $(az acr credential show --name sowgenacr --query username -o tsv) \
  --registry-password $(az acr credential show --name sowgenacr --query passwords[0].value -o tsv) \
  --environment-variables SOWGEN_API_URL=https://apim-sowgen-prod.azure-api.net/api/v1/integration AZURE_TENANT_ID=$TENANT_ID AZURE_CLIENT_ID=$CLIENT_ID \
  --secure-environment-variables AZURE_CLIENT_SECRET=$CLIENT_SECRET \
  --dns-name-label sowgen-mcp --ports 8080
```


**3. Azure Container Apps (Bicep)**

```bicep
resource mcpServer 'Microsoft.App/containerApps@2023-05-01' = {
  name: 'ca-mcp-server'
  location: location
  properties: {
    managedEnvironmentId: containerAppEnv.id
    configuration: {
      ingress: { external: true, targetPort: 8080, transport: 'http' }
      secrets: [
        { name: 'azure-client-secret', value: clientSecret }
        { name: 'sowgen-api-key', value: sowgenApiKey }
      ]
    }
    template: {
      containers: [{
        name: 'mcp-server'
        image: '${containerRegistry.properties.loginServer}/mcp-server:latest'
        resources: { cpu: json('0.5'), memory: '1Gi' }
        env: [
          { name: 'SOWGEN_API_URL', value: 'https://apim-sowgen-prod.azure-api.net/api/v1/integration' }
          { name: 'AZURE_TENANT_ID', value: tenantId }
          { name: 'AZURE_CLIENT_ID', value: clientId }
          { name: 'AZURE_CLIENT_SECRET', secretRef: 'azure-client-secret' }
        ]
      }]
      scale: { minReplicas: 1, maxReplicas: 5 }
    }
  }
}
```


**4. Transport configuration**

The MCP server uses HTTP transport on port 8080. FastMCP binds to `0.0.0.0` for container compatibility. Clients connect via DNS (e.g., sowgen-mcp.region.azurecontainer.io). Use Azure load balancer or APIM for HTTPS termination.

---

## 📑 Flex: Integration Testing

**1. Test script**

```python
# tests/test_mcp_integration.py
import pytest
import os
from sowgen_mcp_server import generate_sow_document, check_document_status, get_document_files

os.environ['SOWGEN_API_URL'] = 'https://apim-sowgen-dev.azure-api.net/api/v1/integration'
os.environ['SOWGEN_API_KEY'] = 'test-api-key'

def test_generate_document():
    result = generate_sow_document(
        customer_name="Test Customer",
        customer_short_name="TestCo",
        project_name="Azure Migration Test",
        requirements="Migrate application to Azure with minimal downtime",
        document_ref_id="TEST-001",
        pricing_type="fp"
    )
    assert "document_id" in result
    assert result["status"] == "PENDING"
    return result["document_id"]

def test_check_status():
    document_id = test_generate_document()
    import time
    time.sleep(5)
    status = check_document_status(document_id)
    assert status["status"] in ["PENDING", "IN_PROGRESS", "COMPLETED", "FAILED"]

def test_get_files():
    document_id = "known-completed-doc-id"
    files = get_document_files(document_id)
    assert "files" in files
    assert len(files["files"]) > 0
    assert "download_url" in files["files"][0]
```


**2. Test execution**

Run with `pytest tests/test_mcp_integration.py -v`. Ensure dev environment is accessible. Use a completed document ID for `test_get_files` or skip if unavailable.

---

## 📑 Flex: Usage Examples

**1. DatacomChat integration**

```python
from sowgen_mcp_server import generate_sow_document, check_document_status, get_document_files

result = generate_sow_document(
    customer_name="Customer X",
    customer_short_name="CustX",
    project_name="AWS to Azure Migration",
    requirements="Migrate AWS app: 3 Lambda, DynamoDB, S3, CloudWatch. Timeline: 12 weeks.",
    document_ref_id="CHAT-2025-001",
    pricing_type="fp"
)

import time
while True:
    status = check_document_status(result["document_id"])
    if status["status"] == "COMPLETED":
        files = get_document_files(result["document_id"])
        print(f"✅ Document ready: {files['files'][0]['download_url']}")
        break
    elif status["status"] == "FAILED":
        print(f"❌ Failed: {status['error']}")
        break
    time.sleep(10)
```


**2. Automated pipeline integration**

```python
def create_proposal_for_opportunity(opportunity_id: str, requirements: str):
    opportunity = crm.get_opportunity(opportunity_id)
    result = generate_sow_document(
        customer_name=opportunity.customer_name,
        customer_short_name=opportunity.customer_code,
        project_name=opportunity.title,
        requirements=requirements,
        document_ref_id=opportunity_id,
        pricing_type="fp"
    )
    crm.update_opportunity(opportunity_id, {"sowgen_document_id": result["document_id"]})
    register_webhook(result["document_id"], f"https://crm.example.com/webhooks/document-complete/{opportunity_id}")
```

---

## 📑 Flex: Migration Checklist

**1. Configuration tasks**

- Update `SOWGEN_API_URL` to Azure API Management endpoint.
- Configure Azure AD authentication (Client ID, Secret, Tenant).
- Or configure API key authentication.
- Update all API endpoint paths (if changed).


**2. Validation and deployment tasks**

- Test authentication against Azure.
- Test all MCP tools (generate, status, files).
- Deploy MCP server to Azure Container Instances/Apps.
- Configure networking and DNS.


**3. Client and monitoring tasks**

- Update client applications with new MCP server URL.
- Monitor API usage in Azure API Management.

---

## 📑 Flex: Full API Definition (OpenAPI)

**1. Generate endpoint**

```yaml
paths:
  /api/v1/integration/generate:
    post:
      operationId: generate-document
      summary: Generate a new document
      security:
        - apiKey: []
        - oauth2: [api://sowgen/.default]
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/GenerateRequest"
      responses:
        200:
          description: Document generation initiated
        400:
          description: Invalid request
        401:
          description: Unauthorized
        429:
          description: Rate limit exceeded
```


**2. Document status and files endpoints**

```yaml
  /api/v1/integration/documents/{documentId}:
    get:
      operationId: get-document-status
      summary: Get document status
      parameters:
        - name: documentId
          in: path
          required: true
          schema:
            type: string
      security:
        - apiKey: []
        - oauth2: [api://sowgen/.default]
      responses:
        200:
          description: Document status retrieved
        404:
          description: Document not found

  /api/v1/integration/documents/{documentId}/files:
    get:
      operationId: list-document-files
      summary: List document files
      parameters:
        - name: documentId
          in: path
          required: true
          schema:
            type: string
      security:
        - apiKey: []
        - oauth2: [api://sowgen/.default]
      responses:
        200:
          description: File list retrieved

  /api/v1/integration/documents/{documentId}/download/{filename}:
    get:
      operationId: download-document-file
      summary: Get download URL for file
      parameters:
        - name: documentId
          in: path
          required: true
          schema:
            type: string
        - name: filename
          in: path
          required: true
          schema:
            type: string
      security:
        - apiKey: []
        - oauth2: [api://sowgen/.default]
      responses:
        200:
          description: Download URL generated

securitySchemes:
  apiKey:
    type: apiKey
    name: Ocp-Apim-Subscription-Key
    in: header
  oauth2:
    type: oauth2
    flows:
      clientCredentials:
        tokenUrl: https://login.microsoftonline.com/{tenant}/oauth2/v2.0/token
        scopes:
          api://sowgen/.default: Access SOWGen API
```

---

## 📑 Flex: Full APIM Policy (XML)

**1. Inbound policy**

```xml
<policies>
  <inbound>
    <rate-limit-by-key calls="1000" renewal-period="3600"
                       counter-key="@(context.Subscription.Id)" />
    <choose>
      <when condition="@(context.Request.Headers.GetValueOrDefault("Authorization","").StartsWith("Bearer "))">
        <validate-jwt header-name="Authorization" failed-validation-httpcode="401">
          <openid-config url="https://login.microsoftonline.com/{tenant}/v2.0/.well-known/openid-configuration" />
          <audiences>
            <audience>api://sowgen</audience>
          </audiences>
        </validate-jwt>
      </when>
      <otherwise>
        <!-- API Key validation (handled automatically by APIM) -->
      </otherwise>
    </choose>
    <validate-content unspecified-content-type-action="prevent" max-size="102400">
      <content type="application/json" validate-as="json" action="prevent" />
    </validate-content>
    <set-variable name="correlationId" value="@(Guid.NewGuid().ToString())" />
    <set-header name="X-Correlation-ID" exists-action="override">
      <value>@((string)context.Variables["correlationId"])</value>
    </set-header>
    <log-to-eventhub logger-id="sowgen-logger">
      @{
        return new JObject(
          new JProperty("timestamp", DateTime.UtcNow.ToString()),
          new JProperty("operation", context.Operation.Name),
          new JProperty("correlationId", context.Variables["correlationId"]),
          new JProperty("userId", context.Request.Headers.GetValueOrDefault("X-User-Id", "unknown"))
        ).ToString();
      }
    </log-to-eventhub>
  </inbound>
```


**2. Backend, outbound, and on-error policy**

```xml
  <backend>
    <forward-request timeout="300" />
  </backend>
  <outbound>
    <set-header name="X-Correlation-ID" exists-action="override">
      <value>@((string)context.Variables["correlationId"])</value>
    </set-header>
    <cache-store duration="60" />
  </outbound>
  <on-error>
    <set-body>@{
      return new JObject(
        new JProperty("error", true),
        new JProperty("message", context.LastError.Message),
        new JProperty("correlationId", context.Variables["correlationId"])
      ).ToString();
    }</set-body>
  </on-error>
</policies>
```

---

## 📑 Flex: Security Considerations

**1. Authentication**

Azure AD client credentials provide enterprise-grade identity. API key fallback supports simpler deployments. Never log or expose `AZURE_CLIENT_SECRET` or `SOWGEN_API_KEY`. Use Azure Key Vault or secure environment variables for production.


**2. Network security**

MCP server runs inside Azure; outbound calls to APIM use HTTPS. Consider VNet integration for private endpoints. DNS name label exposes the container; use Azure Front Door or APIM for additional protection.


**3. Request validation**

APIM enforces 100 KB max request size and JSON content validation. MCP tools validate parameters via FastMCP schema. Sanitise `requirements` and other user-provided fields before forwarding to SOWGen.


**4. Audit and correlation**

Every request receives a correlation ID. Event Hub logging captures timestamp, operation, correlationId, userId. Use correlation ID for end-to-end tracing across MCP server and SOWGen backend.

---

## 📑 Flex: MCP Resource Endpoints

**1. Tool vs resource distinction**

MCP defines tools (callable actions) and resources (readable data). The SOWGen server exposes only tools — no MCP resources. Tools invoke Azure REST APIs; resources would expose static or dynamic content (e.g., templates) without tool semantics.


**2. Future resource considerations**

If SOWGen adds template libraries or reference data, consider exposing them as MCP resources. Resources use URIs (e.g., `sowgen://templates/standard`) and support content types. Current design keeps the server tool-only for simplicity.

---

## 📑 Flex: Environment Variables Reference

**1. Required variables**

- `SOWGEN_API_URL` — Azure APIM base URL (e.g., https://apim-sowgen-prod.azure-api.net/api/v1/integration).
- One of: `SOWGEN_API_KEY` (API key auth) OR `AZURE_TENANT_ID`, `AZURE_CLIENT_ID`, `AZURE_CLIENT_SECRET` (Azure AD auth).


**2. Optional variables**

- `DATACOMCHAT_USER_ID` — User identifier for X-User-Id header (default: MCP-User). Used for audit and attribution in SOWGen.


**3. Production recommendations**

Store secrets in Azure Key Vault; reference via `@Microsoft.KeyVault(SecretUri=...)` in Container App or Function App settings. Rotate API keys and client secrets periodically. Use separate subscriptions for dev and prod.

---

📌 **Document Type:** Architecture Doc / Integration Guide
📅 **Last Updated:** 27 October 2025
🔗 **Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40283635932
