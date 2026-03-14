# Agent Library — High-Level Architecture

> A comprehensive architecture reference covering system design decisions, component structure, security model, deployment strategy, and compliance framework for the Datacom Agent Library platform.

**Author:** Dipesh Trikam / Datacom Development Team
**Date:** 21 August 2025
**Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40045674637

---

## 📑 Table of Contents

1. Context — Overview and business requirements
2. Problem — Architecture challenges and constraints
3. Observations — Key architectural decisions and findings
4. Proposal — Recommended solution approach
5. Risks — Identified risks and mitigations
6. Next Steps — Action items and priorities
7. Close — Summary and key takeaways
8. Presentation Tier — Client and admin applications
9. API Tier — Azure Functions and API Management
10. Data Tier — Cosmos DB and data models
11. Network Architecture — System flow and layers
12. Security Architecture — Authentication and security
13. Architecture Decision Records — ADR summaries
14. Project Structure — Repository organisation
15. Performance and Scaling — Optimisation and targets
16. Monitoring and Observability — Logging and alerting
17. Deployment Strategy — Environments and CI/CD
18. Disaster Recovery — Backup and recovery
19. Compliance and Governance — Data protection
20. Production Readiness — Infrastructure and QA
21. Appendix — Cost estimates and future work

---

## 🎯 Context

The Agent Library is an internal-facing application that enables Datacom employees to discover, share, and manage AI agents. The system provides a secure, scalable platform for agent lifecycle management with role-based access control and comprehensive audit capabilities.


The architecture was designed by the Datacom development team and follows the Azure Well-Architected Framework. The system serves all Datacom employees and is managed by designated administrators responsible for the agent approval workflow.


Key business requirements: Internal access only restricted to Datacom employees. Agent discovery for browsing and searching available agents. Agent management for creating, updating, and deleting agents. Approval workflows with admin approval for agent submissions. Access control with role-based permissions (User and Admin). Complete audit trail for compliance and governance.


**Space:** Insights & Analytics | **Path:** Insights & Analytics → AI Projects → Active → Agent Library → Implementation Docs [Archived] → High-Level Architecture

---

## 🔍 Problem

The platform required a secure, scalable, and maintainable architecture that supports role-based access control, comprehensive audit logging, and multi-application independence.


Key business requirements included internal access only (restricted to Datacom employees), agent discovery (browse and search available agents), agent management (create, update, delete), approval workflows (admin approval for agent submissions), access control (role-based permissions for User and Admin roles), and a complete audit trail for compliance.


All of this needed to be achieved while avoiding the complexity of monorepo structures and self-managed infrastructure.

---

## 📋 Observations

**1. Non-monorepo architecture (ADR-001)**

Separate repositories for client app, admin app, and API enable independent deployment, team autonomy, and technology flexibility. Each application can be deployed separately and different teams can work independently. The trade-off is some code duplication, mitigated by shared packages, and multiple repositories to manage.


**2. Vite for frontend (ADR-002)**

Vite was chosen over Next.js for both client and admin applications. No SSR is needed for internal applications; Vite provides faster development cycles, simpler deployment, and the team already has existing expertise. The consequence is no server-side rendering (not needed) and manual code splitting (can be added later if needed).


**3. Azure Functions backend (ADR-003)**

Serverless model provides automatic scaling, pay-per-use pricing, and native Azure AD integration. Cold starts are mitigated via the premium plan. The stateless nature requires external state management. Alternatives considered included Next.js API routes, Express.js on Azure App Service, and Azure Container Instances.


**4. Azure Cosmos DB for data (ADR-004)**

Cosmos DB NoSQL API is the primary data store. Better suited for document-based agent data with built-in multi-region capabilities and seamless scaling of throughput and storage. Introduces different query patterns than SQL and a learning curve for NoSQL patterns. Alternatives considered: Azure SQL Database, Azure Blob Storage, MongoDB Atlas.


**5. Azure API Management (ADR-005)**

Centralised API gateway provides single point of control, built-in authentication and rate limiting, comprehensive API analytics, and policy enforcement. Trade-offs include additional complexity and cost, plus an additional latency layer. Alternatives: Azure Application Gateway, direct Azure Functions access, custom API gateway.


**6. Security layers**

Entra ID SSO, JWT validation on every API call, Azure Key Vault for secrets, multi-VNet peering for network isolation. Security includes MFA for admin accounts, RBAC, encryption at rest (AES-256) and in transit (TLS 1.3), and audit logging for all access.


**7. Compliance targets**

GDPR data minimisation, ISO 27001 information security management, SOC 2, quarterly access reviews with just-in-time admin access, and complete audit trail for regulatory compliance.

---

## 💡 Proposal

The architecture adopts a cloud-native, fully managed Azure PaaS approach: two React SPAs (client and admin) hosted on Azure Static Web Apps, a Node.js Azure Functions API, Cosmos DB for data persistence, and Azure Key Vault for credential management.


This design eliminates all VM/OS patching burdens, provides automatic scaling, and enforces security at every layer through Azure-native controls and Entra ID identity. The system prioritises security, performance, and operational excellence while maintaining simplicity and developer productivity.

---

## ⚠️ Risks

**Cold start latency** Azure Functions serverless model introduces cold start delays; mitigated by the premium plan but not fully eliminated. Start with Basic Plan for Dev, upgrade to Premium for production.


**NoSQL learning curve** Cosmos DB introduces different query patterns and consistency trade-offs compared to relational databases. Team may need training and documentation.


**Multiple repository overhead** The non-monorepo decision requires managing separate CI/CD pipelines and dependency updates across repos. Some code duplication is expected.


**Additional latency from APIM** The API Management gateway adds a network hop; may require tuning for latency-sensitive operations. Consider caching and compression policies.


**Microservices and multi-region not yet implemented** Identified as future considerations; current single-region deployment may not meet future global distribution needs. Plan for migration path.

---

## ✅ Next Steps

1. **Configure Cloudflare WAF** — Implement Web Application Firewall and Application Insights monitoring prior to production go-live.
2. **Establish performance baselines** — Evaluate under production load, particularly for cold start behaviour and API response times.
3. **Implement access reviews** — Quarterly access reviews as part of the governance framework with just-in-time admin access.
4. **Plan for scale** — Consider microservices migration and multi-region deployment as the platform scales beyond its initial Datacom audience.
5. **Finalise IaC** — Complete infrastructure-as-code for all Azure resources to support repeatable environment provisioning.
6. **Backup testing** — Monthly backup restoration testing for disaster recovery validation.
7. **Documentation** — Ensure comprehensive API documentation and developer portal in APIM.

---

## 🔑 Close

> This architecture provides a secure, scalable, and maintainable foundation for the Agent Library application. The design prioritises security, performance, and operational excellence while maintaining simplicity and developer productivity.

Key success factors: Security first with comprehensive measures at all layers; cloud-native architecture for automatic scaling; complete monitoring and logging capabilities; automated deployment and monitoring for operational excellence; built-in compliance and governance features. Future considerations include microservices migration, multi-region deployment, advanced analytics, event-driven architecture, and GraphQL API enhancements.


**Summary of architecture layers**

Presentation: Client and Admin React SPAs on Static Web Apps. Authentication: Entra ID with SSO, MFA, RBAC. API Gateway: APIM with validation, rate limiting, monitoring. Backend: Azure Functions with business logic. Data: Cosmos DB with six collections. Each layer has clear responsibilities and can scale independently. Security enforced at every layer. Full observability for operations and compliance.

---

## 🖥️ Presentation Tier

**1. Client Application (Vite)**

Internal user interface for agent discovery and management. Technology: React + TypeScript + Vite. Deployment: Azure Static Web Apps. Key features: agent directory browsing, agent detail views, agent submission forms, user profile management, search and filtering. Pages include AgentDirectory, AgentDetail, SubmitAgent, MyAgents, RequestAccess, Profile, and Login.


**1a. Client app technology stack**

React for UI components and state management. TypeScript for type safety. Vite for fast development and builds. Tailwind CSS for styling. React Router for navigation. MSAL or similar for Entra ID authentication. Axios or fetch for API calls. Jest and React Testing Library for testing.


**1b. Static Web Apps deployment**

Azure Static Web Apps for both client and admin. Automatic build from GitHub repository. Custom domain and SSL certificate. Staging environments for pull requests. Production deployment from main branch. Global CDN for static asset delivery. API proxy to APIM if needed. Environment-specific configuration at build time.


**2. Admin Application (Vite)**

Administrative interface for system management. Technology: React + TypeScript + Vite. Deployment: Azure Static Web Apps. Key features: approval workflow management, user administration, system reports and analytics, audit log viewing, configuration management. Pages include Dashboard, Approvals, Users, Agents, Reports, Settings, Audit, and Login.


**2a. Admin app access control**

Admin routes protected by AdminRoute component. AdminProvider wraps admin-specific context. Only users with admin role or admin email list can access. Redirect to login or access denied for unauthorized users. Separate admin API endpoints with additional authorization checks. Audit log all admin actions for compliance.


**3. Component organisation**

Client app components: auth (AuthProvider, ProtectedRoute, LoginButton, UserProfile), agents (AgentCard, AgentList, AgentDetail, AgentForm, AgentFilters, AgentSearch), ui (Button, Card, Modal, Form, Loading, ErrorBoundary, Toast), layout (Header, Sidebar, Footer, Navigation). Admin components: admin (AdminProvider, AdminRoute, ApprovalTable, UserTable, AgentTable, ReportChart, AuditLog), ui, layout. Feature-based grouping for related components with consistent naming conventions.


**3a. Client hooks usage**

useAuth: current user, login, logout, token. useAgents: fetch agents, filter, search, pagination. useApi: base API client with auth headers. useLocalStorage: persist user preferences. useDebounce: debounce search input. Admin hooks: useAdmin, useApprovals, useUsers, useReports, useAudit for admin-specific data fetching.


**4. Full client app directory tree**

```
client-app/
├── src/
│   ├── pages/
│   │   ├── AgentDirectory.tsx
│   │   ├── AgentDetail.tsx
│   │   ├── SubmitAgent.tsx
│   │   ├── MyAgents.tsx
│   │   ├── RequestAccess.tsx
│   │   ├── Profile.tsx
│   │   └── Login.tsx
│   ├── components/
│   │   ├── auth/
│   │   │   ├── AuthProvider.tsx
│   │   │   ├── ProtectedRoute.tsx
│   │   │   ├── LoginButton.tsx
│   │   │   └── UserProfile.tsx
│   │   ├── agents/
│   │   │   ├── AgentCard.tsx
│   │   │   ├── AgentList.tsx
│   │   │   ├── AgentDetail.tsx
│   │   │   ├── AgentForm.tsx
│   │   │   ├── AgentFilters.tsx
│   │   │   └── AgentSearch.tsx
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Form.tsx
│   │   │   ├── Loading.tsx
│   │   │   ├── ErrorBoundary.tsx
│   │   │   └── Toast.tsx
│   │   └── layout/
│   │       ├── Header.tsx
│   │       ├── Sidebar.tsx
│   │       ├── Footer.tsx
│   │       └── Navigation.tsx
│   ├── lib/
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   ├── utils.ts
│   │   ├── types.ts
│   │   └── constants.ts
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useAgents.ts
│   │   ├── useApi.ts
│   │   ├── useLocalStorage.ts
│   │   └── useDebounce.ts
│   ├── styles/
│   │   ├── globals.css
│   │   ├── components.css
│   │   └── variables.css
│   ├── assets/
│   │   ├── images/
│   │   ├── icons/
│   │   └── fonts/
│   ├── App.tsx
│   ├── main.tsx
│   └── vite-env.d.ts
├── public/
│   ├── favicon.ico
│   ├── robots.txt
│   └── assets/
├── tests/
│   ├── unit/
│   ├── integration/
│   ├── e2e/
│   └── setup/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
├── .env.local
├── .env.example
├── .eslintrc.js
├── .prettierrc
├── jest.config.js
└── README.md
```


**5. Full admin app directory tree**

```
admin-app/
├── src/
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── Approvals.tsx
│   │   ├── Users.tsx
│   │   ├── Agents.tsx
│   │   ├── Reports.tsx
│   │   ├── Settings.tsx
│   │   ├── Audit.tsx
│   │   └── Login.tsx
│   ├── components/
│   │   ├── admin/
│   │   │   ├── AdminProvider.tsx
│   │   │   ├── AdminRoute.tsx
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── ApprovalTable.tsx
│   │   │   ├── UserTable.tsx
│   │   │   ├── AgentTable.tsx
│   │   │   ├── ReportChart.tsx
│   │   │   └── AuditLog.tsx
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Table.tsx
│   │   │   ├── Chart.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Form.tsx
│   │   │   ├── Loading.tsx
│   │   │   └── Toast.tsx
│   │   └── layout/
│   │       ├── AdminHeader.tsx
│   │       ├── AdminSidebar.tsx
│   │       ├── AdminLayout.tsx
│   │       └── Navigation.tsx
│   ├── lib/
│   │   ├── api.ts
│   │   ├── admin.ts
│   │   ├── utils.ts
│   │   ├── types.ts
│   │   └── constants.ts
│   ├── hooks/
│   │   ├── useAdmin.ts
│   │   ├── useApprovals.ts
│   │   ├── useUsers.ts
│   │   ├── useReports.ts
│   │   └── useAudit.ts
│   ├── styles/
│   │   ├── globals.css
│   │   ├── admin.css
│   │   └── variables.css
│   ├── assets/
│   │   ├── images/
│   │   ├── icons/
│   │   └── charts/
│   ├── App.tsx
│   ├── main.tsx
│   └── vite-env.d.ts
├── public/
├── tests/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
└── config files
```

---

## 🔌 API Tier

**1. Azure Functions backend**

Serverless API for business logic and data access. Technology: Node.js + Azure Functions. Key features: RESTful API endpoints, JWT token validation, business logic implementation, database operations, external service integration. Function groups: agents (CRUD), approval (workflow), email (notifications), users (management), admin (operations), health (checks).


**1a. Function configuration**

Each function has `function.json` for trigger and binding configuration. HTTP triggers for REST API. Cosmos DB input and output bindings where appropriate. Shared code in `shared/` directory. Environment variables from `local.settings.json` (dev) or App Settings (prod). `host.json` for global function host configuration.


**1b. Function deployment**

Deploy via Azure Functions Core Tools or GitHub Actions. Application settings from Key Vault references. Slot deployment for staging before production swap. Deployment slots for blue-green if using Premium plan. Monitor deployment in Application Insights. Verify health endpoint after deployment.


**2. Azure API Management**

Centralised API management and security. Features: authentication and authorization, rate limiting and throttling, request/response transformation, API documentation, analytics and monitoring. Single point of control for all APIs with consistent policies across endpoints.


**2a. API endpoint groups**

Agents API: GET list, GET by id, POST create, PUT update, DELETE. Approval API: GET pending, POST approve, POST reject. Users API: GET profile, PUT update, GET list (admin). Email API: POST send notification. Admin API: GET dashboard, GET reports, PUT config. Health API: GET status for load balancer and monitoring.


**2b. Shared module responsibilities**

auth.js: JWT validation, token extraction, user context. config.js: environment configuration, feature flags. mongodb.js: Cosmos DB connection, client setup. services.js: business logic, agent validation, approval workflow. utils.js: helpers, formatting, validation. security.js: input sanitization, rate limiting helpers. audit.js: audit log creation, event formatting. rate-limiter.js: in-memory or Redis rate limiting. encryption.js: data encryption for sensitive fields.


**3. API structure**

```
api/
├── agents/          # Agent CRUD operations
├── approval/        # Approval workflow
├── email/           # Email notifications
├── users/           # User management
├── admin/           # Admin operations
├── health/          # Health checks
└── shared/          # auth, config, mongodb, services, utils, security, audit, rate-limiter, encryption
```


**4. Full backend API directory tree**

```
api/
├── agents/
│   ├── function.json
│   └── index.js
├── approval/
│   ├── function.json
│   └── index.js
├── email/
│   ├── function.json
│   └── index.js
├── users/
│   ├── function.json
│   └── index.js
├── admin/
│   ├── function.json
│   └── index.js
├── health/
│   ├── function.json
│   └── index.js
├── shared/
│   ├── auth.js
│   ├── config.js
│   ├── mongodb.js
│   ├── services.js
│   ├── utils.js
│   ├── security.js
│   ├── audit.js
│   ├── rate-limiter.js
│   └── encryption.js
├── tests/
│   ├── unit/
│   ├── integration/
│   └── load/
├── host.json
├── local.settings.json
├── package.json
├── package-lock.json
├── .env
├── .env.example
├── .eslintrc.js
├── jest.config.js
└── README.md
```

---

## 🗄️ Data Tier

**1. Azure Cosmos DB (NoSQL)**

Primary data store for application data. Collections: users (profiles and auth data), agents (metadata and configuration), approvals (workflow data), audit_logs (system audit trail), requests (access request data), configurations (system configuration). Flexible schema for document-based agent data with automatic scaling and global distribution.


**1b. Query patterns**

Agents: query by status (approved), category, tags, author. Users: lookup by email for auth, list for admin. Approvals: filter by status (pending), agent_id, requester_id. Audit logs: query by user_id, action, date range, resource_type. Indexes required for filter and sort fields. Avoid cross-partition queries for performance.


**1a. Cosmos DB configuration**

NoSQL API for document storage. Partition key strategy per collection for scalability. Indexing policy for query performance. Consistency level configurable (strong, bounded staleness, session, eventual). Throughput (RU/s) provisioned per container. Private endpoint for secure access from Azure network only. Continuous backup with point-in-time restore.


**2. Users collection model**

```json
{
  "_id": ObjectId,
  "email": String,
  "name": String,
  "role": String,
  "department": String,
  "created_at": Date,
  "updated_at": Date,
  "last_login": Date,
  "is_active": Boolean
}
```


**3. Agents collection model**

```json
{
  "_id": ObjectId,
  "name": String,
  "description": String,
  "category": String,
  "type": String,
  "author_id": ObjectId,
  "author_contact": String,
  "instructions": String,
  "provider": String,
  "model": String,
  "tools": Array,
  "agent_ids": Array,
  "sharing": String,
  "specific_individuals": Array,
  "tags": Array,
  "capabilities": Array,
  "version": String,
  "status": String,
  "created_at": Date,
  "updated_at": Date,
  "approved_at": Date,
  "approved_by": ObjectId
}
```


**4. Approvals collection model**

```json
{
  "_id": ObjectId,
  "agent_id": ObjectId,
  "requester_id": ObjectId,
  "status": String,
  "requested_at": Date,
  "reviewed_at": Date,
  "reviewed_by": ObjectId,
  "comments": String,
  "admin_notes": String
}
```


**5. Audit logs collection model**

```json
{
  "_id": ObjectId,
  "user_id": ObjectId,
  "action": String,
  "resource_type": String,
  "resource_id": ObjectId,
  "details": Object,
  "ip_address": String,
  "user_agent": String,
  "timestamp": Date
}
```


**6. Agent status values**

Status field in agents: draft (work in progress), pending (awaiting admin approval), approved (published and discoverable), rejected (denied with admin notes). Sharing field: public (all employees), private (author only), restricted (specific individuals list).


**7. Agent lifecycle workflow**

Author creates agent in draft status. Author submits for approval, status becomes pending. Admin reviews in Approvals page. Admin approves or rejects with comments. If approved: status becomes approved, agent appears in directory. If rejected: status becomes rejected, author notified with admin_notes. Audit log records each state transition.


**7a. Approval workflow steps**

Step 1: Author submits agent, status changes to pending. Step 2: Email notification sent to admin list. Step 3: Admin views in Approvals queue. Step 4: Admin approves or rejects with required comments. Step 5: If approved, agent appears in directory. Step 6: If rejected, author can edit and resubmit. Step 7: All actions logged in audit_logs. Step 8: Approval record stored with timestamps.

---

## 🌐 Network Architecture

**1. High-level flow**

User Interface Layer (Client App + Admin App on Azure Static Web Apps) → Authentication Layer (Microsoft Entra ID with SSO, MFA, RBAC) → API Gateway Layer (Azure API Management with auth, rate limiting, transformation, analytics) → Backend API Layer (Azure Functions: Agents, Users, Approval, Email, Admin, Health) → Data Layer (Azure Cosmos DB: users, agents, approvals, audit_logs, requests, configurations).


**2. Architecture diagram (ASCII)**

```
┌─────────────────────────────────────────────────────────────────┐
│                        User Interface Layer                     │
├─────────────────────────────────────────────────────────────────┤
│  Client App (Vite)     │     Admin App (Vite)                  │
│  - Agent Directory     │     - Dashboard                        │
│  - Agent Details       │     - Approvals                        │
│  - Submit Agents       │     - User Management                  │
│  - My Agents           │     - Reports                          │
│  [Azure Static Web Apps]│     [Azure Static Web Apps]           │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Authentication Layer                       │
├─────────────────────────────────────────────────────────────────┤
│                    Microsoft Entra ID                           │
│  - Single Sign-On (SSO)                                        │
│  - Multi-Factor Authentication (MFA)                           │
│  - Role-Based Access Control (RBAC)                            │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                        API Gateway Layer                        │
├─────────────────────────────────────────────────────────────────┤
│                    Azure API Management                         │
│  - Authentication & Authorization                              │
│  - Rate Limiting & Throttling                                  │
│  - Request/Response Transformation                             │
│  - API Analytics & Monitoring                                  │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Backend API Layer                        │
├─────────────────────────────────────────────────────────────────┤
│                    Azure Functions                              │
│  - Agents API          │     - Approval API                     │
│  - Users API           │     - Email API                        │
│  - Admin API           │     - Health API                       │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Data Layer                               │
├─────────────────────────────────────────────────────────────────┤
│                    Azure Cosmos DB                              │
│  - Users Collection    │     - Agents Collection                │
│  - Approvals Collection│     - Audit Logs Collection            │
│  - Requests Collection │     - Configurations Collection        │
└─────────────────────────────────────────────────────────────────┘
```


**3. Network security**

Azure Virtual Network isolation, Network Security Groups (NSGs), private endpoints for Cosmos DB access, DDoS protection. All database traffic kept within Azure network via private endpoints.


**4. Request flow**

User request from browser to Static Web App. Static Web App serves SPA or proxies to API. User authenticated via Entra ID before accessing app. API requests include JWT in Authorization header. Request hits APIM first for validation and rate limiting. APIM forwards to Azure Functions. Functions validate JWT and check RBAC. Functions query Cosmos DB via private endpoint. Response flows back through APIM to client. Audit log entry created for sensitive operations.


**5. Layer responsibilities**

User Interface: render UI, handle user input, call API. Authentication: verify identity, issue tokens, enforce MFA. API Gateway: validate tokens, rate limit, transform, monitor. Backend API: business logic, data access, external integrations. Data Layer: persist and retrieve data, ensure consistency.


**6. Network topology**

Client and admin apps served from Static Web Apps (public). APIM in Azure with public endpoint. Functions in Azure with APIM as only ingress. Cosmos DB with private endpoint (no public access). Key Vault with private endpoint. All backend traffic within Azure backbone. Optional: VNet integration for Functions to reach private resources.

---

## 🔒 Security Architecture

**1. Authentication and authorization**

Microsoft Entra ID integration: Single Sign-On (SSO), Multi-Factor Authentication (MFA) for admin accounts, Role-Based Access Control (RBAC), token-based authentication with JWT for API access. Security layers: Network (VNet isolation, NSGs, private endpoints, DDoS), Application (JWT validation, input validation, NoSQL injection prevention, XSS and CSRF protection), Data (encryption at rest AES-256, in transit TLS 1.3, Key Vault for secrets), Access Control (role-based permissions, resource-level control, audit logging, session management).


**1a. Authentication flow**

User redirects to Entra ID login. User authenticates with corporate credentials. MFA required for admin accounts. Entra ID issues JWT access token. Client stores token and includes in API requests. APIM validates JWT before forwarding. Functions validate JWT and extract user claims. User role checked for admin-only endpoints. Token refresh handled by MSAL before expiry. Session timeout and re-authentication for inactive users.


**2. JWT token validation**

```javascript
// Azure Functions JWT validation
const validateJwt = async (authHeader) => {
  const token = authHeader.substring("Bearer ".length);
  const decoded = jwt.verify(token, getKey, {
    audience: config.auth.azureAd.audience,
    issuer: config.auth.azureAd.issuer,
    algorithms: ["RS256"],
  });
  return decoded;
};
```


**3. Role-based access control**

```javascript
// Admin access validation
export const isAdminEmail = (email: string): boolean => {
  const config = getAdminConfig();
  return config.adminEmails.includes(email.toLowerCase());
};

export const isAdminRole = (role: string): boolean => {
  const config = getAdminConfig();
  return config.adminRoles.some((adminRole) =>
    role.toLowerCase().includes(adminRole.toLowerCase())
  );
};
```


**4. Input validation**

```javascript
// Agent data validation
export const validateAgentData = (data: any): ValidatedAgentData => {
  const schema = z.object({
    name: z.string().min(1).max(100),
    description: z.string().max(500),
    category: z.string().min(1),
    authorContact: z.string().email(),
  });

  return schema.parse(data);
};
```


**5. Security mechanisms summary**

JWT validation on every API request. Role-based access with User and Admin roles. Input validation with Zod schema. Rate limiting: 100 calls per 60 seconds, 1000 per day. CORS restricted to known Static Web Apps origins. NoSQL injection prevention in database queries. XSS protection in frontend rendering. CSRF protection for state-changing operations.


**6. APIM security policies**

```xml
<!-- Rate limiting policy -->
<rate-limit calls="100" renewal-period="60" />
<quota calls="1000" renewal-period="86400" />

<!-- JWT validation policy -->
<validate-jwt header-name="Authorization" failed-validation-httpcode="401" failed-validation-error-message="Invalid token">
    <openid-config url="https://login.microsoftonline.com/{tenant-id}/v2.0/.well-known/openid_configuration" />
    <required-claims>
        <claim name="aud" match="all" />
        <claim name="iss" match="all" />
    </required-claims>
</validate-jwt>

<!-- CORS policy -->
<cors>
    <allowed-origins>
        <origin>https://your-client-app.azurestaticapps.net</origin>
        <origin>https://your-admin-app.azurestaticapps.net</origin>
    </allowed-origins>
    <allowed-methods>
        <method>GET</method>
        <method>POST</method>
        <method>PUT</method>
        <method>DELETE</method>
    </allowed-methods>
    <allowed-headers>
        <header>Content-Type</header>
        <header>Authorization</header>
    </allowed-headers>
</cors>
```

---

## 📐 Architecture Decision Records

**1. ADR-001: Non-monorepo**

Decision: Use separate repositories/applications instead of monorepo. Rationale: simplicity, independent deployment, team autonomy, technology flexibility, reduced complexity. Alternatives: monorepo with Turborepo/Nx, single application with route-based separation. Consequences: easier onboarding, independent scaling, reduced build complexity; some code duplication, multiple repos to manage.


**2. ADR-002: Vite for frontend**

Decision: Use Vite for both client and admin applications. Rationale: internal-facing (no SEO), fast hot reload, existing expertise, modern build tooling, simplicity. Alternatives: Next.js for SSR/SSG, Create React App. Consequences: faster development, simpler deployment, better DX; no SSR (not needed), manual code splitting.


**3. ADR-003: Azure Functions**

Decision: Use Azure Functions as primary backend API. Rationale: serverless automatic scaling, Azure integration, existing implementation, built-in security, reduced operational overhead. Alternatives: Next.js API routes, Express on App Service, Container Instances. Consequences: automatic scaling, pay-per-use, built-in security; cold start latency, stateless nature.


**4. ADR-004: Cosmos DB**

Decision: Use Azure Cosmos DB for NoSQL API as primary data store. Rationale: NoSQL flexibility for document data, global distribution, automatic scaling, Azure integration, low latency. Alternatives: Azure SQL, Blob Storage, MongoDB Atlas. Consequences: flexible schema, automatic scaling, global distribution; NoSQL learning curve, different query patterns.


**5. ADR-005: API Management**

Decision: Use Azure API Management as API gateway. Rationale: centralised management, built-in security and rate limiting, comprehensive monitoring, API documentation, policy enforcement. Alternatives: Application Gateway, direct Functions access, custom gateway. Consequences: centralised management, enhanced security, better monitoring; additional complexity and cost, additional latency.


**6. ADR consequences summary**

ADR-001 positives: easier onboarding, independent scaling, reduced build complexity. Negatives: code duplication, multiple repos. ADR-002 positives: faster development, simpler deployment, better DX. Negatives: no SSR, manual code splitting. ADR-003 positives: automatic scaling, pay-per-use, built-in security. Negatives: cold starts, stateless. ADR-004 positives: flexible schema, automatic scaling, global distribution. Negatives: NoSQL learning curve. ADR-005 positives: centralised management, enhanced security, better monitoring. Negatives: additional complexity, latency.


**7. Technology stack summary**

Frontend: React, TypeScript, Vite, Tailwind CSS. Backend: Node.js, Azure Functions. Database: Azure Cosmos DB NoSQL API. API Gateway: Azure API Management. Identity: Microsoft Entra ID. Hosting: Azure Static Web Apps. Infrastructure: Terraform, Bicep, ARM. Monitoring: Application Insights. Secrets: Azure Key Vault.

---

## 📁 Project Structure

**1. Repository organisation**

Non-monorepo with separate repos: client-app (client-facing), admin-app (admin), api (Azure Functions backend), infrastructure (IaC), docs (documentation), shared (optional shared utilities). Clear boundaries, independent deployment, shared utilities extracted to avoid duplication.


**1a. Root project structure**

```
agent-library/
├── client-app/           # Client-facing application
├── admin-app/            # Admin application
├── api/                   # Azure Functions backend
├── infrastructure/        # Infrastructure as Code
├── docs/                  # Documentation
└── shared/                # Shared utilities (optional)
```

Promotes independence, clear separation of concerns, and simplified deployment pipelines. Each application can be developed and deployed by different teams.


**2. Client app structure**

```
client-app/
├── src/
│   ├── pages/           # AgentDirectory, AgentDetail, SubmitAgent, MyAgents, RequestAccess, Profile, Login
│   ├── components/     # auth, agents, ui, layout
│   ├── lib/            # api, auth, utils, types, constants
│   ├── hooks/          # useAuth, useAgents, useApi, useLocalStorage, useDebounce
│   ├── styles/
│   ├── assets/
│   ├── App.tsx, main.tsx, vite-env.d.ts
├── public/
├── tests/              # unit, integration, e2e, setup
├── index.html, package.json, vite.config.ts, tsconfig.json, tailwind.config.js
└── .env.local, .env.example, .eslintrc.js, .prettierrc, jest.config.js
```


**3. Admin app structure**

```
admin-app/
├── src/
│   ├── pages/           # Dashboard, Approvals, Users, Agents, Reports, Settings, Audit, Login
│   ├── components/     # admin, ui, layout
│   ├── lib/            # api, admin, utils, types, constants
│   ├── hooks/          # useAdmin, useApprovals, useUsers, useReports, useAudit
│   ├── styles/, assets/
│   ├── App.tsx, main.tsx, vite-env.d.ts
├── public/, tests/
└── config files
```


**4. API structure**

```
api/
├── agents/             # function.json, index.js
├── approval/
├── email/
├── users/
├── admin/
├── health/
├── shared/              # auth, config, mongodb, services, utils, security, audit, rate-limiter, encryption
├── tests/               # unit, integration, load
├── host.json, local.settings.json, package.json
└── .env, .env.example
```


**5. Infrastructure structure**

```
infrastructure/
├── terraform/
│   ├── main.tf, variables.tf, outputs.tf, providers.tf
│   ├── modules/         # azure-ad, key-vault, functions, static-web-apps, api-management, cosmos-db, monitoring
│   ├── environments/   # dev, staging, prod
│   └── scripts/        # init, plan, apply, destroy
├── azure/              # bicep, arm templates
└── scripts/            # deploy, backup, security-scan, monitoring
```


**5a. Full Terraform modules structure**

```
infrastructure/terraform/
├── main.tf
├── variables.tf
├── outputs.tf
├── providers.tf
├── modules/
│   ├── azure-ad/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── outputs.tf
│   ├── key-vault/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── outputs.tf
│   ├── functions/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── outputs.tf
│   ├── static-web-apps/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── outputs.tf
│   ├── api-management/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── outputs.tf
│   ├── cosmos-db/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── outputs.tf
│   └── monitoring/
│       ├── main.tf
│       ├── variables.tf
│       └── outputs.tf
├── environments/
│   ├── dev/
│   │   ├── main.tf
│   │   ├── terraform.tfvars
│   │   └── backend.tf
│   ├── staging/
│   │   ├── main.tf
│   │   ├── terraform.tfvars
│   │   └── backend.tf
│   └── prod/
│       ├── main.tf
│       ├── terraform.tfvars
│       └── backend.tf
└── scripts/
    ├── init.sh
    ├── plan.sh
    ├── apply.sh
    └── destroy.sh
```


**6. File naming conventions**

```text
# React Components
ComponentName.tsx                    # PascalCase for components
component-name.module.css            # kebab-case for CSS modules

# Utilities and Services
apiClient.ts                         # camelCase for utilities
authService.ts                       # camelCase for services

# Configuration Files
vite.config.ts                       # camelCase for config files
tailwind.config.js                   # camelCase for config files

# Environment Files
.env.local                           # dotenv format
.env.example                         # dotenv format
```


**7. Import organisation**

```javascript
// 1. External libraries
import React from "react";
import { useState, useEffect } from "react";

// 2. Internal utilities
import { apiClient } from "../lib/api";
import { useAuth } from "../hooks/useAuth";

// 3. Components
import { Button } from "../components/ui/Button";
import { AgentCard } from "../components/agents/AgentCard";

// 4. Types
import type { Agent } from "../lib/types";
```


**8. Testing structure**

```
tests/
├── unit/
│   ├── components/
│   ├── hooks/
│   ├── utils/
│   └── services/
├── integration/
│   ├── api/
│   ├── auth/
│   └── database/
├── e2e/
│   ├── user-flows/
│   ├── admin-flows/
│   └── critical-paths/
└── setup/
    ├── test-utils.ts
    ├── mock-data.ts
    └── test-helpers.ts
```


**9. Shared resources strategy**

Shared components library: separate package with Button, Card, Modal. Shared utilities: npm package or copied (formatDate, validateEmail, apiClient, useLocalStorage). Design system: tokens (colors, typography, spacing), components, Storybook documentation.


**10. Shared components library structure**

```
shared-components/
├── src/
│   ├── components/
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.test.tsx
│   │   │   └── index.ts
│   │   ├── Card/
│   │   └── Modal/
│   ├── hooks/
│   ├── utils/
│   └── types/
├── package.json
├── tsconfig.json
└── README.md
```


**11. Shared utilities export pattern**

```javascript
// shared-utils package
export { formatDate } from "./date";
export { validateEmail } from "./validation";
export { apiClient } from "./api";
export { useLocalStorage } from "./hooks";
```


**12. Design system structure**

```
design-system/
├── tokens/
│   ├── colors.json
│   ├── typography.json
│   └── spacing.json
├── components/
├── documentation/
└── assets/
```


**13. Documentation structure**

```
docs/
├── ARCHITECTURE.md
├── SECURITY.md
├── DEPLOYMENT.md
├── API.md
├── DEVELOPMENT.md
├── COMPLIANCE.md
├── TROUBLESHOOTING.md
├── USER_GUIDE.md
├── ADMIN_GUIDE.md
├── API_REFERENCE.md
├── DATABASE_SCHEMA.md
├── MONITORING.md
├── DISASTER_RECOVERY.md
├── PERFORMANCE.md
├── TESTING.md
├── CONTRIBUTING.md
├── CHANGELOG.md
├── ROADMAP.md
└── assets/
    ├── images/
    ├── diagrams/
    └── examples/
```


**14. Local development setup**

```bash
# Clone repositories
git clone <client-app-repo>
git clone <admin-app-repo>
git clone <api-repo>

# Install dependencies
cd client-app && npm install
cd ../admin-app && npm install
cd ../api && npm install

# Start development servers
cd client-app && npm run dev
cd ../admin-app && npm run dev
cd ../api && npm run start
```


**15. Code organisation principles**

Single Responsibility: each file has one clear purpose. DRY (Don't Repeat Yourself): extract common code to utilities. KISS (Keep It Simple, Stupid): avoid over-engineering. Consistency: follow established patterns and conventions across all applications.


**16. Version control strategy**

Feature branches for new development. Pull requests for code review. Semantic versioning for releases. Conventional commits for commit messages. Environment promotion path: Dev to Staging to Production.


**17. Environment configuration**

Development: `.env.local` for local variables, `.env.development` for dev environment. Staging: `.env.staging` for staging variables. Production: `.env.production` for production variables. Template: `.env.example` for documenting required variables.

---

## ⚡ Performance and Scaling

**1. Frontend performance**

Code splitting with lazy loading of components and routes. Bundle optimisation: tree shaking and minification. Caching strategy for static assets. Image optimisation: WebP format and responsive images.


**2. Backend performance**

Database indexing with optimised Cosmos DB indexes. Connection pooling for efficient database connections. Redis caching for frequently accessed data. Async operations with non-blocking I/O.


**3. Azure Functions optimisation**

Premium Plan eliminates cold start latency (start with Basic for Dev). Optimised memory and timeout settings. Minimal dependencies for faster startup. Connection reuse where possible.


**4. APIM optimisation**

Response caching for frequently accessed data. Response compression to reduce bandwidth. Automatic load distribution. Circuit breaker for fault tolerance.


**5. Scaling strategy**

Horizontal: Azure Functions automatic scaling, Cosmos DB automatic scaling, Static Web Apps global CDN, APIM automatic scaling. Vertical: adjustable function memory, scalable database resources, configurable application limits. Load balancing: APIM traffic distribution, health checks for failover, multi-region deployment.


**5a. Azure Functions scaling**

Consumption plan: scale to zero when idle, scale out on demand. Premium plan: pre-warmed instances to avoid cold starts. Scale out based on queue length or HTTP trigger load. Instance count configurable per function app. Memory allocation per instance: 1.5GB to 3.5GB. Timeout limits: 5 minutes consumption, 30 minutes premium. Consider dedicated plan for predictable workloads.


**5b. Cosmos DB scaling**

Throughput: provisioned RU/s or autoscale. Autoscale: min and max RU/s range. Storage: scales automatically with data. Partition key: critical for even distribution. Cross-partition queries: higher RU cost. Consider partition strategy for agents (e.g. by category or status).


**6. Performance targets**

API response time: less than 200ms for 95% of requests. Page load time: less than 2 seconds for initial load. Database query time: less than 100ms for 95% of queries. Availability: 99.9% uptime.


**7. Key performance metrics**

Response time for API endpoints. Throughput measured as requests per second. Error rate as percentage of failed requests. Resource utilisation: CPU, memory, and storage usage. Cosmos DB RU consumption for throughput planning. Function execution duration and cold start frequency.


**8. Performance monitoring approach**

Establish baselines during staging with production-like load. Set up Application Insights custom metrics for business KPIs. Configure alerts for response time degradation above 500ms. Track database query performance with Cosmos DB metrics. Monitor APIM latency and throughput at the gateway layer.

---

## 📊 Monitoring and Observability

**1. Application Insights**

Performance monitoring: response times and throughput. Error tracking: exception monitoring and alerting. User analytics: behaviour and usage patterns. Dependency monitoring: external service dependencies.


**1a. Application Insights capabilities**

Distributed tracing across services. Custom metrics and dimensions. Live metrics stream for real-time monitoring. Log analytics integration. Performance profiling for slow requests. Failure analysis and exception grouping. Availability tests for uptime monitoring. Smart detection for anomaly alerting.


**2. Custom metrics**

Business: agent submissions, approvals, usage. Security: failed login attempts, suspicious activity. Performance: database query times, API response times. Operational: system health, resource utilisation.


**3. Logging best practices**

Structured JSON format for machine parsing. Include correlation IDs for request tracing. Log levels: debug, info, warn, error. Include user context (without PII where possible). Include request/response metadata. Avoid logging sensitive data (passwords, tokens). Consistent field names across services. Timestamp in ISO 8601 format.


**4. Structured logging**

```javascript
// Azure Functions logging
context.log("Agent created", {
  agentId: agent.id,
  authorId: agent.authorId,
  timestamp: new Date().toISOString(),
  userId: user.email,
  action: "CREATE_AGENT",
});
```


**5. Log aggregation**

Centralised logging with all logs in one place. Retention: 90 days operational, 1 year audit logs. Automated log analysis and alerting. Compliance: log retention for regulatory requirements.


**6. Alerting strategy**

Critical: system down, high error rate greater than 5%, security breach, performance degradation (response time greater than 500ms). Warning: high resource usage (CPU/memory greater than 80%), Cosmos DB RU consumption greater than 80%, function failures, APIM performance degradation.


**6a. Alert response procedures**

Critical alerts: immediate notification to on-call team. Page or escalate if not acknowledged. Runbook for common failure scenarios. Incident response process documented. Post-incident review for root cause. Warning alerts: review during business hours. Create ticket for remediation. Track trends and patterns. Escalate if warning persists or worsens.


**6. Log retention policy**

Operational logs: 90 days retention for debugging and troubleshooting. Audit logs: 1 year retention for compliance and regulatory requirements. Automated log analysis with alerting on anomalous patterns. Centralised log aggregation for correlation across services.


**7. Monitoring integration**

Azure Application Insights as primary monitoring platform. APIM analytics for API-level metrics and usage patterns. Cosmos DB metrics for database performance and throughput. Custom dashboards for business metrics (agent submissions, approvals, usage). Integration with existing Datacom monitoring and alerting systems.

---

## 🚀 Deployment Strategy

**1. Environment strategy**

Development: feature development and testing, minimal resources, synthetic test data, dev team only. Staging: pre-production testing, production-like configuration, anonymised production data, QA and stakeholders. Production: live application, full resources, real data, end users and administrators.


**1b. Environment promotion**

Code flows from dev to staging to production. Staging must pass before production deployment. Database migrations tested in staging first. Feature flags for production rollout control. Canary deployment for high-risk changes. Rollback plan documented for each release.


**1a. Environment comparison**

Dev: minimal cost, fast iteration, synthetic data, dev team access. Staging: production-like resources, anonymised data, QA validation, stakeholder review. Prod: full resources, real data, all users, strict change control. Each environment has separate Terraform state and configuration. Environment variables differ per environment. Database and storage isolated per environment.


**2. CI/CD pipeline**

GitHub Actions: security scanning, unit/integration/E2E tests, automated build, deployment to environments, post-deployment health checks. Blue-green deployment for zero-downtime. Feature flags for gradual rollouts. Rollback capability. Environment promotion: Dev to Staging to Production.


**3. Pre-deployment checks**

Security scan with automated vulnerability scanning. All automated tests must pass. Pull request approval required. Terraform plan validation for infrastructure.


**3a. Security scan checklist**

Dependency vulnerability scanning (npm audit, Snyk). Static code analysis for security issues. Secret scanning to prevent credential leakage. Container image scanning if applicable. Infrastructure as Code scanning for misconfigurations. OWASP dependency check. License compliance verification.


**4. Deployment steps**

Database backup. Terraform apply for infrastructure. Azure Functions deployment. APIM configuration update. Static Web Apps deployment. Post-deployment health check. Enable enhanced monitoring.


**5. Rollback process**

Automated rollback to previous version. Point-in-time database recovery. Infrastructure configuration rollback. Stakeholder notification.


**6. Deployment order**

Backup database before any deployment. Deploy infrastructure via Terraform apply. Deploy backend Azure Functions. Update APIM configuration. Deploy frontend Static Web Apps. Run post-deployment health checks. Enable enhanced monitoring for new release.


**7. Quality gates**

All automated tests must pass before deployment. Security scan must complete without critical vulnerabilities. Code review approval required for all changes. Infrastructure Terraform plan must be validated. Database migration scripts tested in staging first.

---

## 🔄 Disaster Recovery

**1. Backup strategy**

Database: Cosmos DB continuous backup, 30-day point-in-time recovery, multi-region replication, monthly backup restoration testing. Configuration: Terraform state backup, APIM configuration backup, environment variables backup.


**1a. Terraform state management**

Remote state in Azure Storage or Terraform Cloud. State locking to prevent concurrent modifications. Separate state per environment (dev, staging, prod). State backup before apply operations. Sensitive values in state encrypted. Never commit state files to source control.


**2. Recovery objectives**

RTO: critical systems less than 1 hour, non-critical less than 4 hours, full system less than 8 hours. RPO: database less than 1 minute (continuous backup), configuration less than 1 hour, application less than 15 minutes.


**3. Disaster recovery plan**

Incident detection via automated monitoring and alerting. Impact assessment and communication. Automated and manual recovery procedures. System validation and testing. Stakeholder updates and status reporting.


**3a. Incident response steps**

Detect: monitoring alerts and user reports. Assess: determine scope and impact. Communicate: notify stakeholders and users. Contain: prevent further damage. Eradicate: fix root cause. Recover: restore service. Review: post-incident analysis and improvements. Document: update runbooks and procedures.


**4. Backup verification**

Monthly backup restoration testing to validate recovery procedures. Document recovery time for each component. Test point-in-time recovery for Cosmos DB. Verify Terraform state backup integrity. Validate APIM configuration backup and restore.


**5. Geographic replication**

Cosmos DB multi-region replication for data resilience. Consider Static Web Apps multi-region for global users. APIM supports multi-region deployment for high availability. Document failover procedures for each Azure service.

---

## 📜 Compliance and Governance

**1. Data classification**

Public: agent names, descriptions, categories. Internal: user profiles, usage statistics. Confidential: admin notes, audit logs. Restricted: authentication tokens, encryption keys.


**2. Data handling**

Data minimisation: only collect necessary data. Automated data lifecycle management for retention. Encryption at rest and in transit. Role-based data access controls.


**2a. Data lifecycle**

Collection: only collect data required for agent management and compliance. Storage: encrypted in Cosmos DB with appropriate retention. Processing: access controlled by role and resource. Retention: operational data 90 days, audit data 1 year. Deletion: automated purge of expired data, manual deletion for data subject requests. Backup: continuous backup with 30-day point-in-time recovery.


**3. Regulatory compliance**

Privacy: GDPR data protection and privacy rights, data subject rights (access, rectification, deletion), consent management, data breach notification procedures. Security: ISO 27001 information security management, SOC 2, Azure compliance certifications, internal company policies.


**3a. Data breach response**

Procedures for detecting and containing breaches. Notification to data protection authority within 72 hours. User notification for affected individuals. Document incident timeline and response. Post-incident review and remediation. Update procedures based on lessons learned. Maintain breach register for compliance.


**4. Governance framework**

Access governance: quarterly access reviews, just-in-time access for admin functions, separation of duties, complete audit logging. Change management: formal change control, structured release process, configuration management, comprehensive documentation.


**4a. Access review process**

Quarterly review of all user access. Admin role verification against current employees. Remove access for departed employees. Document approval for new admin access. Review access to sensitive data (audit logs, config). Track access review completion in audit log. Escalate overdue access reviews.


**5. Data subject rights**

GDPR access rights: users can request copy of their data. Rectification: users can correct inaccurate data. Deletion: right to be forgotten with documented procedures. Portability: data export in machine-readable format. Consent management: track and document user consent for data processing.


**6. Security certifications**

ISO 27001: information security management system alignment. SOC 2: security, availability, and confidentiality controls. Azure compliance: leverage built-in Azure certifications (ISO, SOC, GDPR). Internal policies: align with Datacom company security standards and requirements.

---

## 🏗️ Production Readiness

**1. Infrastructure as Code**

All Azure resources defined in Terraform. Environment separation: dev, staging, production. Version control for infrastructure changes. CI/CD pipeline for infrastructure updates.


**2a. Key Azure resources**

Resource Groups for logical grouping. Azure Functions for serverless API. Azure Static Web Apps for client and admin frontends. Azure API Management for API gateway. Azure Cosmos DB for NoSQL API as primary data store. Azure Key Vault for secrets and credentials. Application Insights for monitoring and observability. Virtual Networks for network isolation. Network Security Groups for traffic filtering. Azure AD for identity and access management.


**2. Quality assurance**

Testing: unit (components, functions), integration (API endpoints), E2E (user workflows), security (vulnerability scanning), performance (load and stress). Code quality: ESLint and Prettier, TypeScript strict mode, mandatory PR reviews, comprehensive documentation.


**2a. Testing coverage**

Unit tests: component and function testing with Jest. Integration tests: API endpoint testing with mocked dependencies. E2E tests: user workflow testing for critical paths. Security tests: automated vulnerability scanning in CI pipeline. Performance tests: load and stress testing before production deployment. Test setup: shared test utilities, mock data, and test helpers.


**2b. Code quality gates**

ESLint for code style and potential issues. Prettier for consistent formatting. TypeScript strict mode for type safety. Mandatory pull request reviews before merge. Code review checklist for security and architecture. Documentation requirements for public APIs and components.


**3. Development workflow**

Local setup: clone repos, npm install, npm run dev for each app. Code organisation: single responsibility, DRY, KISS, consistency. Version control: feature branches, pull requests, semantic versioning, conventional commits.


**3a. Conventional commits format**

feat: new feature. fix: bug fix. docs: documentation only. style: formatting, no code change. refactor: code change without feature change. test: adding tests. chore: maintenance tasks. Format: type(scope): description. Example: feat(agents): add category filter to directory. Enables automated changelog generation.


**4. Separation of concerns**

Clear boundaries between client, admin, and API applications. Each application has independent deployment capabilities. Shared utilities extracted to dedicated packages to avoid duplication. Client app handles user-facing agent discovery and submission. Admin app handles approval workflow and system management. API handles business logic and data access only.


**5. GitHub Actions workflow**

Security scanning as first step in pipeline. Run unit tests, then integration tests, then E2E tests. Build and package each application. Deploy to appropriate environment (dev, staging, prod). Post-deployment health checks. Notify team on failure or success. Store deployment artifacts for rollback.


**6. Blue-green deployment**

Maintain two identical production environments. Deploy new version to inactive environment. Run smoke tests on new environment. Switch traffic to new environment. Keep previous environment for quick rollback. Zero-downtime deployments for user experience.


**7. Feature flags**

Gradual feature rollouts to subset of users. A/B testing capability for new features. Quick disable of problematic features without redeployment. Configuration-based feature toggles. Environment-specific feature availability.

---

## 📎 Appendix

**1. Cost estimates**

Azure dev costs documented in Confluence attachment: Agent Library Cost Estimates.xlsx. Reference: https://datacomgroup.atlassian.net/wiki/wiki/download/attachments/40045674637/Agent%20Library%20Cost%20Estimates.xlsx


**2. Future considerations**

Microservices migration for potential architecture evolution. Multi-region deployment for geographic distribution to global users. Advanced analytics with machine learning and predictive capabilities. Event-driven architecture for real-time event processing. GraphQL API for enhanced API capabilities.


**3. Confluence reference**

Space: Insights and Analytics. Path: Insights and Analytics to AI Projects to Active to Agent Library to Implementation Docs (Archived) to High-Level Architecture. Confluence URL: https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40045674637. Last updated: 21 August 2025. Version: 2.0. Author: Datacom Development Team.


**4. Key success factors**

Security first: comprehensive security measures at all layers. Scalability: cloud-native architecture for automatic scaling. Observability: complete monitoring and logging capabilities. Operational excellence: automated deployment and monitoring. Compliance: built-in compliance and governance features. Developer productivity: simple architecture and clear documentation.


**5. Error handling patterns**

API returns standard HTTP status codes (200, 201, 400, 401, 403, 404, 500). Error response format with error, code, and details fields. Validation errors return 400 with field-level details. Authentication errors return 401. Authorization errors return 403. Frontend: ErrorBoundary for React errors, toast notifications for user-facing errors. Retry logic for transient failures.


**6. Related documentation**

ARCHITECTURE.md, SECURITY.md, DEPLOYMENT.md, API.md, DEVELOPMENT.md, COMPLIANCE.md, TROUBLESHOOTING.md, MONITORING.md, DISASTER_RECOVERY.md, PERFORMANCE.md, TESTING.md for comprehensive system documentation.


**7. Audit log events**

CREATE_AGENT, UPDATE_AGENT, DELETE_AGENT for agent changes. APPROVE_AGENT, REJECT_AGENT for approval actions. LOGIN, LOGOUT for authentication. ACCESS_DENIED for failed authorization. CONFIG_CHANGE for admin configuration updates. Each event includes user_id, action, resource_type, resource_id, details, ip_address, user_agent, timestamp. Retention: 1 year for compliance. Query patterns for security investigations and compliance audits.


**8. Health check endpoints**

Health API provides liveness and readiness probes. Liveness: basic process check. Readiness: database connectivity, Key Vault access. Used by load balancers and orchestration. Return 200 when healthy, 503 when degraded. Include version and build info in response. Minimal dependencies for fast response.


**9. Configuration management**

Environment variables for environment-specific config. Key Vault for secrets (connection strings, API keys). Terraform for infrastructure configuration. APIM policies for API-level configuration. Feature flags for gradual rollouts. No secrets in source code or Terraform state. Rotation procedures for credentials.


**10. Troubleshooting guide**

High latency: check APIM metrics, function cold starts, Cosmos DB RU. Auth failures: verify Entra ID config, token expiry, audience/issuer. Deployment failures: check Terraform state, pipeline logs, resource quotas. Data issues: verify partition keys, query patterns, consistency level. Use Application Insights for distributed tracing. Check audit logs for user action history.


**11. API client implementation**

Base URL from environment variable. Attach JWT to Authorization header. Handle 401 with token refresh or redirect to login. Handle 403 with user-friendly access denied message. Retry with exponential backoff for 5xx errors. Request timeout configuration. Response interceptors for error handling. TypeScript types for request/response payloads.


**12. Build and release**

Client and admin: `npm run build` produces static assets. API: `func azure functionapp publish` or Azure DevOps task. Infrastructure: `terraform apply` with approved plan. Version tagging in Git for releases. Changelog updated with each release. Release notes for stakeholders. Semantic versioning: major.minor.patch.


**13. Dependency management**

npm for Node.js packages. Lock files for reproducible builds. Regular dependency updates for security. Audit for known vulnerabilities. Consider Dependabot or Renovate. Pin major versions for stability. Document any peer dependency requirements. Shared packages versioned independently.


**14. Documentation standards**

README in each repository with setup instructions. API documentation in APIM developer portal. Architecture decisions in ADR format. Code comments for complex logic. JSDoc for public functions. Storybook for component documentation. Runbooks for operational procedures. Keep documentation close to code.


**15. Security checklist**

Entra ID configured with correct redirect URIs. JWT validation with correct audience and issuer. Admin emails/roles configured in Key Vault. CORS restricted to known origins. Rate limiting enabled in APIM. No secrets in source code. Private endpoints for Cosmos DB and Key Vault. TLS 1.3 for all connections. Input validation on all API endpoints. Audit logging for sensitive operations.


**16. Performance checklist**

Cosmos DB indexes for common queries. Partition key strategy documented. APIM response caching where appropriate. Function Premium plan for production. Static assets with cache headers. Lazy loading for routes. Bundle size monitoring. Core Web Vitals targets.


**17. Onboarding checklist**

Clone all repositories. Install Node.js and npm. Run local.settings.json setup for API. Configure Entra ID app registration for local dev. Add .env.local with API URL. Run npm install in each repo. Start dev servers. Verify login flow. Run test suite. Read DEVELOPMENT.md. Access Confluence for architecture docs.


**18. Production go-live checklist**

All tests passing. Security scan complete. Performance baselines established. Monitoring and alerting configured. Runbooks documented. Access reviews completed. Backup restoration tested. Rollback procedure validated. Stakeholder sign-off. Communication plan for launch. Support team briefed. Documentation published.


**19. Maintenance schedule**

Weekly: review alerts and metrics. Monthly: backup restoration test, dependency updates. Quarterly: access reviews, security assessment. Annually: disaster recovery drill, compliance review. Ad-hoc: incident post-mortems, architecture reviews.


**20. Glossary and acronyms**

ADR: Architecture Decision Record. APIM: Azure API Management. Cosmos DB: Azure Cosmos Database. IaC: Infrastructure as Code. JWT: JSON Web Token. MFA: Multi-Factor Authentication. RBAC: Role-Based Access Control. RPO: Recovery Point Objective. RTO: Recovery Time Objective. RU: Request Unit. SSO: Single Sign-On. TLS: Transport Layer Security. VNet: Virtual Network.


**21. Build and tooling**

Vite: entry index.html, output dist/, chunk splitting, VITE_ env vars. Tailwind: utility-first, design tokens, purge unused. TypeScript: strict mode, path aliases, ES2020 target. Jest: unit tests, React Testing Library, MSW for mocks. E2E: Playwright or Cypress for critical paths.


**22. Key metrics to track**

Agent submissions per week. Approval cycle time (submit to approve). Active users and sessions. API latency percentiles (p50, p95, p99). Error rate by endpoint. Cosmos DB RU consumption. Function execution count and duration. Cache hit rate if using Redis.


**23. Success criteria**

Users can discover and use agents within 5 minutes. Admin approval within 24 hours. System availability 99.9%. API response under 200ms for 95% of requests. Zero critical security vulnerabilities. All compliance requirements met. Documentation complete and current.


**24. Version history**

Version 2.0: August 2025, comprehensive architecture update. Version 1.0: initial architecture document. Changes tracked in Confluence page history. Major updates documented in CHANGELOG.md.

---

📌 **Document Type:** Architecture Presentation
📅 **Last Updated:** 21 August 2025
🔗 **Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40045674637
