# API Guide

> A comprehensive RESTful API reference for the Datacom Agent Library's Azure Functions backend, covering all endpoints, authentication, data models, and integration patterns.

**Author:** Dipesh Trikam
**Date:** 13 September 2025
**Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40061796665

---

## 🎯 Context

The Datacom Agent Library provides a **high-performance RESTful API** built on Azure Functions, achieving **12ms response time** and serving as an **enterprise template**. The system achieves 8.5/10 WAF compliance and 99.9% uptime. The UAT environment is live at `datacom-agent-library-fa-uat.azurewebsites.net`. This guide covers all API endpoints, authentication, data models, and integration patterns for developers integrating with or extending the platform.

---

## 🔍 Problem

Without a clear, centralised API reference, integrating with or extending the Agent Library becomes error-prone. The JWT authentication requirement, role-based endpoint restrictions, and dual data source (MongoDB for personal data, CosmosDB for public directory) create complexity. Developers need a single document covering authentication setup, all endpoint signatures, data models, error codes, and integration patterns.

---

## 📋 Observations

**1. Performance and Availability**

The API achieves 12ms average response time (99.8% improvement from 5000ms+), 99.9% uptime with comprehensive health monitoring, and 8.5/10 WAF score (A- Grade) enterprise compliance. Production URL is `https://datacom-agent-library-fa-uat.azurewebsites.net/api`.

**2. Module Architecture**

Eight modules are exposed: Agents (`/api/agents`), Public Agents (`/api/public-agents`), Prompts (`/api/prompts`), Public Prompts (`/api/public-prompts`), Users (`/api/users`), Approvals (`/api/approvals`), Email (`/api/email`), and Health (`/api/health`). Each module follows consistent patterns for pagination, search, and filtering.

**3. Authentication Model**

All endpoints require a Bearer JWT token in the `Authorization` header. Tokens are obtained from Azure AD with the `access_as_user` scope. Three roles control access: `user` (read public content, manage personal content), `admin` (full system access), and `moderator` (content moderation, approval workflow).

**4. Pagination and Filtering**

All list endpoints support consistent pagination (`page`, `limit`), search (`search` string), filtering (by category, status, author), and sorting (field + order). Pagination response includes `page`, `limit`, `total`, `pages`, `hasNext`, and `hasPrev`.

**5. Error Handling**

Error responses follow a consistent schema: `{ success: false, error: { code, message, details } }` with well-defined error codes including `AUTHENTICATION_ERROR`, `AUTHORIZATION_ERROR`, `VALIDATION_ERROR`, `NOT_FOUND`, `CONFLICT`, and `INTERNAL_ERROR`.

**6. Rate Limiting**

Default limit is 100 requests per minute per user with a burst limit of 10 requests per second. Rate limit information is included in response headers. Public content uses CDN caching; health checks use a 30-second cache.

---

## 💡 Proposal

The API is designed around a **module-per-entity pattern** with clear role-based access boundaries. Users manage their own content via `/api/agents` and `/api/prompts`, discover approved content via `/api/public-agents` and `/api/public-prompts`, and admins/moderators manage the approval pipeline via `/api/approvals`. All integrations should use the provided TypeScript client pattern or import the OpenAPI spec from Swagger for test-driven integration.

---

## ⚠️ Risks

**Production URL TBD** Production URL is listed as TBD — integrations built against UAT endpoints will require a URL update at production launch, creating deployment risk if not managed via environment configuration.

**BYPASS_JWT_VALIDATION flag** The development flag means local development does not exercise the auth path — authentication bugs may not surface until UAT testing.

**Rate limit constraints** Rate limiting (100 req/min) may be insufficient for admin workflows involving bulk operations or reporting dashboards; the bulk-approve endpoint partially mitigates this but other bulk scenarios are not addressed.

**No API versioning** No versioning strategy is documented — breaking changes to endpoint contracts could affect existing integrations without a clear migration path.

---

## ✅ Next Steps

1. **Production URL** — Confirm and document the production base URL once the production environment is deployed.
2. **Postman workspace** — Import the OpenAPI spec from `/api/swagger` into the team's Postman workspace and share with all integration teams.
3. **API versioning** — Define an API versioning strategy (e.g., URL versioning `/api/v2/`) before the platform reaches wider adoption.
4. **Rate limit review** — Review rate limits against expected admin and reporting usage patterns and adjust if needed.

---

## 🔑 Close

> The Agent Library API is a high-performance, enterprise-compliant RESTful interface — its 12ms response time, consistent error schema, and Swagger documentation make it integration-ready.

Teams should lock in the production URL and establish a versioning policy before broader adoption. The module-per-entity design and role-based access provide a solid foundation for scaling the platform.

---

## 📡 API Endpoints

**1. Agents Module (`/api/agents`)**

Personal agent management. Base path: `/api/agents`.

- **GET /api/agents** — List all agents for the authenticated user. Query params: `page` (default 1), `limit` (default 20, max 100), `search`, `category`, `author`, `status` (draft, submitted, approved, rejected).
- **GET /api/agents/{id}** — Get a single agent by ID.
- **POST /api/agents** — Create a new agent. Request body: `name`, `description`, `category`, `instructions`, `provider`, `model`, `tags`, `metadata`.
- **PUT /api/agents/{id}** — Update an existing agent.
- **DELETE /api/agents/{id}** — Delete an agent.

**2. Public Agents Module (`/api/public-agents`)**

Public agent directory. Base path: `/api/public-agents`.

- **GET /api/public-agents** — List public (approved) agents. Query params: `page`, `limit`, `search`, `category`, `sort` (name, rating, createdAt), `order` (asc, desc).
- **POST /api/public-agents/{id}/submit** — Submit an agent for approval.
- **POST /api/public-agents/{id}/approve** — Approve an agent (admin/moderator). Request body: `comment`, `category`.
- **POST /api/public-agents/{id}/reject** — Reject an agent. Request body: `reason`, `comment`.

**3. Prompts Module (`/api/prompts`)**

Personal prompt management. Base path: `/api/prompts`.

- **GET /api/prompts** — List all prompts for the authenticated user.
- **GET /api/prompts/{id}** — Get a single prompt by ID.
- **POST /api/prompts** — Create a new prompt. Request body: `name`, `description`, `content`, `category`, `tags`, `metadata`.

**4. Public Prompts Module (`/api/public-prompts`)**

Public prompt directory. Base path: `/api/public-prompts`. Follows same patterns as Public Agents for discovery and approval workflow.

**5. Users Module (`/api/users`)**

User management. Base path: `/api/users`.

- **GET /api/users/me** — Get the current authenticated user's profile.
- **PUT /api/users/me** — Update the current user's profile. Request body: `name`, `preferences`.

**6. Approvals Module (`/api/approvals`)**

Approval workflow. Base path: `/api/approvals`.

- **GET /api/approvals** — List pending approvals. Query params: `type` (agent, prompt), `status` (pending, approved, rejected), `page`, `limit`.
- **GET /api/approvals/{id}** — Get a single approval by ID.
- **POST /api/approvals/{id}/approve** — Approve an item. Request body: `comment`, `category`.
- **POST /api/approvals/{id}/reject** — Reject an item. Request body: `reason`, `comment`.
- **POST /api/approvals/bulk-approve** — Bulk approve multiple items. Request body: `ids` (array), `comment`.

**7. Email Module (`/api/email`)**

Email notifications. Base path: `/api/email`.

- **POST /api/email/notify** — Send a notification. Request body: `template`, `recipients`, `data`.

**8. Health Module (`/api/health`)**

System health checks. Base path: `/api/health`.

- **GET /api/health** — Full system health check (MongoDB, CosmosDB, email).
- **GET /api/{module}/health** — Module-specific health check.

---

## 🔐 Authentication

**1. JWT Token Flow**

The API uses JWT authentication with Azure AD. Client requests access token from Azure AD, receives JWT, sends API requests with JWT in `Authorization: Bearer <token>`, API validates token and processes request.

**2. JWT Token Structure**

```json
{
  "header": {
    "alg": "RS256",
    "kid": "key-id",
    "typ": "JWT"
  },
  "payload": {
    "aud": "api://your-client-id/access_as_user",
    "iss": "https://login.microsoftonline.com/tenant-id/v2.0",
    "sub": "user-id",
    "oid": "object-id",
    "tid": "tenant-id",
    "exp": 1640995200,
    "iat": 1640908800,
    "roles": ["user", "admin"]
  }
}
```

**3. Authorization Header**

Include JWT token in the `Authorization` header:

```
Authorization: Bearer <jwt-token>
```

Example:

```
Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...
```

**4. Role-Based Access Control**

- **user** — Read public content, manage personal content. Endpoints: `/api/public-agents/*`, `/api/agents/*` (own).
- **admin** — Full system access, approval management. All endpoints.
- **moderator** — Content moderation, approval workflow. Endpoints: `/api/approvals/*`, `/api/public-agents/*`.

---

## 📡 Agents API — Full Reference

**1. GET /api/agents**

List all agents with pagination and filtering.

```bash
GET /api/agents?page=1&limit=20&search=ai&category=automation&status=approved
Authorization: Bearer <jwt-token>
```

**Query Parameters:** `page` (number, default 1), `limit` (number, default 20, max 100), `search` (string), `category` (string), `author` (string), `status` (string: draft, submitted, approved, rejected).

**Response:**

```json
{
  "success": true,
  "data": {
    "agents": [
      {
        "_id": "agent-id",
        "name": "Agent Name",
        "description": "Agent description",
        "author": "user-id",
        "authorName": "Author Name",
        "category": "category-id",
        "status": "approved",
        "rating": 4.5,
        "ratingCount": 10,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "pages": 5
    }
  }
}
```

**2. GET /api/agents/{id}**

Get a single agent by ID.

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "agent-id",
    "name": "Agent Name",
    "description": "Agent description",
    "author": "user-id",
    "authorName": "Author Name",
    "category": "category-id",
    "categoryName": "Category Name",
    "instructions": "Agent instructions",
    "provider": "openai",
    "model": "gpt-4",
    "status": "approved",
    "rating": 4.5,
    "ratingCount": 10,
    "tags": ["tag1", "tag2"],
    "metadata": {
      "version": "1.0.0",
      "compatibility": ["gpt-4", "gpt-3.5-turbo"]
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**3. POST /api/agents**

Create a new agent.

**Request Body:**

```json
{
  "name": "New Agent",
  "description": "Agent description",
  "category": "category-id",
  "instructions": "Agent instructions",
  "provider": "openai",
  "model": "gpt-4",
  "tags": ["tag1", "tag2"],
  "metadata": {
    "version": "1.0.0",
    "compatibility": ["gpt-4", "gpt-3.5-turbo"]
  }
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "new-agent-id",
    "name": "New Agent",
    "status": "draft",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**4. PUT /api/agents/{id}**

Update an existing agent.

**Request Body:**

```json
{
  "name": "Updated Agent Name",
  "description": "Updated description",
  "instructions": "Updated instructions"
}
```

**5. DELETE /api/agents/{id}**

Delete an agent.

---

## 📡 Public Agents API — Full Reference

**1. GET /api/public-agents**

List public (approved) agents. Query params: `page`, `limit`, `search`, `category`, `sort` (name, rating, createdAt), `order` (asc, desc).

**2. POST /api/public-agents/{id}/submit**

Submit an agent for approval.

**3. POST /api/public-agents/{id}/approve**

Approve an agent. Request body:

```json
{
  "comment": "Approval comment",
  "category": "category-id"
}
```

**4. POST /api/public-agents/{id}/reject**

Reject an agent. Request body:

```json
{
  "reason": "Rejection reason",
  "comment": "Detailed feedback"
}
```

---

## 📡 Prompts API — Full Reference

**1. GET /api/prompts** — List all prompts. **2. GET /api/prompts/{id}** — Get prompt by ID.

**3. POST /api/prompts**

Create a new prompt.

**Request Body:**

```json
{
  "name": "Prompt Name",
  "description": "Prompt description",
  "content": "Prompt content",
  "category": "category-id",
  "tags": ["tag1", "tag2"],
  "metadata": {
    "version": "1.0.0",
    "language": "en"
  }
}
```

---

## 📡 Users API — Full Reference

**1. GET /api/users/me**

Get current authenticated user.

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "user-id",
    "email": "user@datacom.com",
    "name": "User Name",
    "roles": ["user"],
    "preferences": {
      "theme": "light",
      "notifications": true
    },
    "stats": {
      "agentsCreated": 5,
      "promptsCreated": 3,
      "ratingsGiven": 12
    },
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**2. PUT /api/users/me**

Update user profile.

**Request Body:**

```json
{
  "name": "Updated Name",
  "preferences": {
    "theme": "dark",
    "notifications": false
  }
}
```

---

## 📡 Approvals API — Full Reference

**1. GET /api/approvals** — List pending approvals. Query params: `type` (agent, prompt), `status` (pending, approved, rejected), `page`, `limit`.

**2. GET /api/approvals/{id}** — Get approval by ID.

**3. POST /api/approvals/{id}/approve**

Request body:

```json
{
  "comment": "Approval comment",
  "category": "category-id"
}
```

**4. POST /api/approvals/{id}/reject**

Request body:

```json
{
  "reason": "Rejection reason",
  "comment": "Detailed feedback"
}
```

**5. POST /api/approvals/bulk-approve**

Request body:

```json
{
  "ids": ["id1", "id2", "id3"],
  "comment": "Bulk approval"
}
```

---

## 📡 Email API — Full Reference

**1. POST /api/email/notify**

Send a notification email.

**Request Body:**

```json
{
  "template": "approval-notification",
  "recipients": ["user@datacom.com"],
  "data": {
    "itemName": "Agent Name",
    "status": "approved",
    "comment": "Approval comment"
  }
}
```

---

## 📡 Health API — Full Reference

**1. GET /api/health**

System health check. Returns MongoDB and CosmosDB connectivity status.

**Response:**

```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2024-01-01T00:00:00.000Z",
    "version": "1.0.0",
    "services": {
      "database": "healthy",
      "cosmosdb": "healthy",
      "email": "healthy"
    },
    "uptime": 86400
  }
}
```

**2. GET /api/{module}/health** — Module-specific health check.

---

## 📊 Data Models — Agent

**Agent Interface**

```typescript
interface Agent {
  _id: string;
  name: string;
  description: string;
  author: string;
  authorName: string;
  category: string;
  categoryName?: string;
  instructions: string;
  provider: string;
  model: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  rating: number;
  ratingCount: number;
  tags: string[];
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 📊 Data Models — Prompt

**Prompt Interface**

```typescript
interface Prompt {
  _id: string;
  name: string;
  description: string;
  content: string;
  author: string;
  authorName: string;
  category: string;
  categoryName?: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  rating: number;
  ratingCount: number;
  tags: string[];
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 📊 Data Models — User

**User Interface**

```typescript
interface User {
  _id: string;
  email: string;
  name: string;
  roles: string[];
  preferences: {
    theme: 'light' | 'dark';
    notifications: boolean;
  };
  stats: {
    agentsCreated: number;
    promptsCreated: number;
    ratingsGiven: number;
  };
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 📊 Data Models — Approval

**Approval Interface**

```typescript
interface Approval {
  _id: string;
  itemId: string;
  itemType: 'agent' | 'prompt';
  itemName: string;
  author: string;
  authorName: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  reviewerName?: string;
  comment?: string;
  reason?: string;
  category?: string;
}
```

---

## 🔄 Error Handling

**1. Error Response Format**

All API responses follow a consistent error format:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "field": "name",
      "message": "Name is required"
    }
  }
}
```

**2. Common Error Codes**

- `AUTHENTICATION_ERROR` — Invalid or missing JWT token.
- `AUTHORIZATION_ERROR` — Insufficient permissions.
- `VALIDATION_ERROR` — Request validation failed.
- `NOT_FOUND` — Resource not found.
- `CONFLICT` — Resource conflict.
- `INTERNAL_ERROR` — Server error.

---

## 🔄 Pagination

**1. Pagination Response Structure**

All list endpoints return pagination metadata:

```json
{
  "success": true,
  "data": {
    "items": [...],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "pages": 5,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

---

## 🧪 Testing the API

**1. cURL — Get JWT Token**

```bash
curl -X POST "https://login.microsoftonline.com/tenant-id/oauth2/v2.0/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials&client_id=your-client-id&client_secret=your-client-secret&scope=api://your-client-id/access_as_user"
```

**2. cURL — Use Token in API Calls**

```bash
curl -X GET "http://localhost:7071/api/agents" \
  -H "Authorization: Bearer your-jwt-token" \
  -H "Content-Type: application/json"
```

**3. TypeScript API Client**

```typescript
class AgentLibraryAPI {
  private baseUrl: string;
  private token: string;

  constructor(baseUrl: string, token: string) {
    this.baseUrl = baseUrl;
    this.token = token;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'API request failed');
    }

    return data;
  }

  async getAgents(params?: any) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/agents?${queryString}`);
  }

  async createAgent(agentData: any) {
    return this.request('/agents', {
      method: 'POST',
      body: JSON.stringify(agentData),
    });
  }

  async updateAgent(id: string, agentData: any) {
    return this.request(`/agents/${id}`, {
      method: 'PUT',
      body: JSON.stringify(agentData),
    });
  }

  async deleteAgent(id: string) {
    return this.request(`/agents/${id}`, {
      method: 'DELETE',
    });
  }
}

// Usage
const api = new AgentLibraryAPI('http://localhost:7071/api', 'your-jwt-token');
const agents = await api.getAgents({ page: 1, limit: 20 });
const newAgent = await api.createAgent({
  name: 'My Agent',
  description: 'Agent description',
  category: 'category-id',
  instructions: 'Agent instructions',
  provider: 'openai',
  model: 'gpt-4',
});
```

---

## 📈 Performance and Security

**1. Environment URLs**

- **Local Development** — `http://localhost:7071/api` (development only).
- **Azure UAT (Current)** — `https://datacom-agent-library-fa-uat.azurewebsites.net/api` (12ms response).
- **Azure Production** — TBD, template ready (target: under 10ms).

**2. Swagger Documentation**

- Local: `http://localhost:7071/api/swagger`
- Azure: `https://your-function-app.azurewebsites.net/api/swagger`

**3. Rate Limiting**

- Default: 100 requests per minute per user.
- Burst: 10 requests per second.
- Headers: Rate limit information included in response headers.

**4. Caching**

- Public content: CDN caching for public agents and prompts.
- User data: No caching for user-specific data.
- Health checks: 30-second cache.

**5. Optimization Tips**

- Use pagination for large datasets.
- Apply filters early to reduce data transfer.
- Use bulk endpoints when available.
- Reuse HTTP connections.
- Enable gzip compression.

---

## 🆘 Common Issues

- **401 Unauthorized** — Check JWT token validity and expiration.
- **403 Forbidden** — Verify user has required permissions.
- **404 Not Found** — Check resource ID and endpoint URL.
- **422 Validation Error** — Review request body and validation rules.
- **500 Internal Error** — Check server logs and contact support.

---

📌 **Document Type:** API Reference
📅 **Last Updated:** 13 September 2025
🔗 **Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40061796665
