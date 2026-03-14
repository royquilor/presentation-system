# Datacom Agent Library — Technical Architecture
> Enterprise-grade Azure Well-Architected Framework compliant system — 8.5/10 WAF score, 12ms response, multi-VNet, production template

**Author:** Dipesh Trikam — Insights & Analytics
**Date:** 17 September 2025
**Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40061796638

---

## 🎯 Context

The Datacom Agent Library is an enterprise-grade, Azure Well-Architected Framework compliant system achieving 8.5/10 (A-) WAF compliance. Built on Azure cloud services with 12ms response time, multi-VNet architecture with VNet peering, and private endpoint security. This system serves as a production template for enterprise AI agent management across the Datacom organization.

---

## 🔍 Problem

Enterprise AI agent catalogues require secure, scalable infrastructure that can handle variable workloads without always-on costs. Traditional VM-based deployments incur manual scaling, complex deployment, and fixed costs even when idle. A modern AI agent platform must deliver sub-second response times, zero-trust security, and consumption-based economics while supporting approval workflows, ratings, and multi-tenant access.

---

## 📋 Observations

**1. Enterprise status and WAF compliance**

WAF Score: 8.5/10 (A- Grade), up from 7.2/10. Performance: 12ms API response time with 99.8% improvement. Security: private endpoints, VNet peering, zero-trust architecture. Network: multi-VNet (172.21.0.0/16 ↔ 172.19.0.0/16). Template: ready for enterprise replication across Datacom.

**2. Three-tier application architecture**

Client App (Port 5174) for end users, Admin App (Port 3000) for administrators, Shared Package for UI components. Both apps use React/Vite, TypeScript, Tailwind CSS, MSAL.js. Azure Functions API (Port 7071) provides serverless backend with modular endpoints for agents, prompts, users, approvals, public-agents, public-prompts, email, health, and swagger.

**3. Enterprise data layer**

MongoDB in private VNet (172.19.0.0/16) for agents, prompts, users, approvals, ACL entries. Cosmos DB with private endpoint (172.21.0.0/16) for public agents, public prompts, categories, ratings, search index. Azure Blob Storage for file attachments, images, legacy approvals. 12ms access for Blob, under 5ms for Cosmos DB, VNet peering for MongoDB.

**4. External service integration**

Azure AD for authentication, JWT tokens, user directory, RBAC. Azure Communication Services for email notifications, SMS alerts, templates. App Insights for telemetry, performance monitoring, error tracking.

**5. Frontend technology stack**

React 18+ with Vite, TypeScript, Tailwind CSS, Radix UI primitives. MSAL.js for Azure AD, Axios for API communication. Component composition, custom hooks, context providers, error boundaries, lazy loading. Client App: agent directory, prompt library, submission workflow, rating system, sharing controls. Admin App: approval dashboard, user management, system monitoring, audit logging, content moderation.

**6. Backend module structure**

api/agents, api/prompts, api/users, api/approvals, api/public-agents, api/public-prompts, api/email, api/health, api/swagger, api/shared, api/config. Node.js 18+ with Azure Functions v4, MongoDB driver, JWT validation, Swagger/OpenAPI. RESTful CRUD, RBAC, Joi validation, rate limiting, CORS, health checks.

**7. Shared package architecture**

Reusable UI components and utilities: form components, layout components, feedback components, data display, interactive components. Radix UI primitives, Tailwind design tokens, Vite/Rollup build, Vitest testing. Compound components, render props, custom hooks, theme provider, TypeScript generics.

**8. Database collections and schema**

MongoDB: users, agents, prompts, promptgroups, approvals, aclentries, accessroles, categories, ratings, projects. Cosmos DB: public-agents, public-prompts, categories, ratings, search-index. Blob: attachments, images, legacy-approvals, exports, backups. Normalized structure, indexed queries, soft deletes, audit fields, version control.

**9. Security architecture**

Authentication: MSAL.js redirect to Azure AD, code exchange for access token, JWT validation. RBAC with resource-level permissions, inheritance, dynamic evaluation, audit logging. JWT validation, CORS, rate limiting, input validation, SQL injection prevention, XSS protection, CSRF protection.

**10. Performance and scalability**

Caching: CDN, API response, database query, session, template. Auto-scaling Azure Functions, load balancing, database sharding, read replicas, async processing. Database indexing, query optimization, connection pooling, lazy loading, code splitting.

---

## 💡 Proposal

The Datacom Agent Library architecture delivers enterprise-grade performance, security, and scalability at consumption-based cost. Continue investing in the platform as the foundation for AI agent sharing across Datacom. The architecture is ready for enterprise replication and serves as a production template for similar deployments.

---

## ⚠️ Risks

**Multi-database complexity** — Dual database (MongoDB + Cosmos DB) requires careful data synchronization and consistency management across collections.

**VNet peering dependencies** — Network connectivity between 172.21.0.0/16 and 172.19.0.0/16 creates coupling; changes to peering affect all services.

**Serverless cold starts** — Azure Functions consumption plan may incur cold start latency under sporadic traffic patterns.

**External service availability** — Azure AD, Communication Services, and App Insights are single points of dependency; outages affect the platform.

**Legacy data migration** — Blob storage contains legacy approvals and historical data; migration or schema changes require careful planning.

---

## ✅ Next Steps

1. **Development environment setup** — Follow 03-getting-started.md for local development with cloud services.

2. **Authentication configuration** — Configure MSAL.js and Azure AD per 04-authentication.md.

3. **API integration** — Reference 05-api-guide.md for API reference and integration patterns.

4. **Production deployment** — Execute 06-deployment-guide.md for staging and production deployment.

5. **Operations and maintenance** — Use 07-operations-runbook.md for ongoing operations.

6. **Troubleshooting** — Consult 08-troubleshooting.md for common issues and solutions.

---

## 🏗️ High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              DATACOM AGENT LIBRARY                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────────────┐  │
│  │   CLIENT APP    │    │   ADMIN APP     │    │     SHARED PACKAGE      │  │
│  │   (Port 5174)   │    │   (Port 3000)   │    │   (UI Components)      │  │
│  │                 │    │                 │    │                         │  │
│  │ • React/Vite    │    │ • React/Vite    │    │ • Radix UI Components  │  │
│  │ • TypeScript    │    │ • TypeScript    │    │ • Custom Hooks         │  │
│  │ • Tailwind CSS  │    │ • Tailwind CSS  │    │ • Utility Functions    │  │
│  │ • MSAL.js       │    │ • MSAL.js       │    │ • TypeScript Types     │  │
│  └─────────────────┘    └─────────────────┘    └─────────────────────────┘  │
│           │                       │                           │              │
│           └───────────────────────┼───────────────────────────┘              │
│                                   │                                          │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │                    AZURE FUNCTIONS API (Port 7071)                     │  │
│  │                                                                         │  │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐       │  │
│  │  │   AGENTS    │ │   PROMPTS   │ │   USERS     │ │  APPROVALS  │       │  │
│  │  │   MODULE    │ │   MODULE    │ │   MODULE    │ │   MODULE    │       │  │
│  │  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘       │  │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐       │  │
│  │  │   PUBLIC    │ │    EMAIL    │ │   HEALTH   │ │   SWAGGER   │       │  │
│  │  │   AGENTS    │ │   MODULE    │ │   MODULE   │ │   MODULE    │       │  │
│  │  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘       │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
│                                   │                                          │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │                         ENTERPRISE DATA LAYER                          │  │
│  │                   🏆 8.5/10 WAF Compliant Architecture                 │  │
│  │                                                                         │  │
│  │  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────────┐  │
│  │  │     MONGODB     │    │   COSMOS DB     │    │   AZURE BLOB        │  │
│  │  │ 🔒 Private VNet │    │🔒Private Endpoint│    │   STORAGE           │  │
│  │  │ 172.19.0.0/16   │    │ 172.21.0.0/16   │    │ (Legacy Data)       │  │
│  │  └─────────────────┘    └─────────────────┘    └─────────────────────┘  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
│                                   │                                          │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │                           EXTERNAL SERVICES                             │  │
│  │  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────────┐  │
│  │  │    AZURE AD     │    │   AZURE COMM    │    │   APP INSIGHTS      │  │
│  │  │ (Authentication)│    │   SERVICES      │    │   (Monitoring)      │  │
│  │  └─────────────────┘    └─────────────────┘    └─────────────────────┘  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 1. Client App Component Architecture

**Purpose:** Primary user-facing application for browsing, submitting, and managing AI agents and prompts.

**Technology Stack:** Framework: React 18+ with Vite build tool. Language: TypeScript for type safety. Styling: Tailwind CSS with custom design system. UI Components: Radix UI primitives with custom components. State Management: React Context + custom hooks. Authentication: MSAL.js for Azure AD integration. HTTP Client: Axios for API communication.

**Key Features:** Agent Directory: browse, search, filter approved agents. Prompt Library: access and manage AI prompts. Submission Workflow: create and submit new agents/prompts. Rating System: rate and review content with comments. Personal Management: manage personal agents and prompts. Sharing Controls: share resources with specific users or organization-wide. User Profiles: manage settings and view activity history.

**Architecture Patterns:** Component Composition: reusable components with composition over inheritance. Custom Hooks: business logic extracted into reusable hooks. Context Providers: global state management for user, theme, notifications. Error Boundaries: graceful error handling and recovery. Lazy Loading: code splitting for improved performance.

---

## 2. Admin App Component Architecture

**Purpose:** Administrative interface for managing approvals, users, and system monitoring.

**Technology Stack:** Framework: React 18+ with Vite build tool. Language: TypeScript for type safety. Styling: Tailwind CSS with admin-specific design system. UI Components: Radix UI primitives with admin components. State Management: React Context + custom hooks. Authentication: MSAL.js with role-based access control. HTTP Client: Axios for API communication.

**Key Features:** Approval Dashboard: streamlined approval process with bulk operations. User Management: manage user accounts, roles, and permissions. System Monitoring: real-time system status and health checks. Audit Logging: complete action tracking and history. Content Moderation: review and moderate submitted content. Analytics: view usage statistics and system metrics.

**Architecture Patterns:** Role-Based UI: conditional rendering based on user permissions. Bulk Operations: efficient handling of multiple items. Real-time Updates: WebSocket-like updates for live data. Audit Trail: complete tracking of administrative actions. Responsive Design: mobile-friendly admin interface.

---

## 3. Azure Functions API Module Structure

**Purpose:** Serverless backend providing RESTful APIs for all system operations.

**Module Structure:**

```
api/
├── agents/              # Agent management endpoints
├── prompts/             # Prompt management endpoints
├── users/               # User management endpoints
├── approvals/           # Approval workflow endpoints
├── public-agents/       # Public agent directory endpoints
├── public-prompts/      # Public prompt directory endpoints
├── email/               # Email notification endpoints
├── health/              # Health check endpoints
├── swagger/             # API documentation endpoints
├── shared/              # Shared utilities and middleware
└── config/              # Configuration management
```

**Key Features:** RESTful API: complete CRUD operations for all entities. Authentication: JWT validation with Azure AD integration. Authorization: role-based access control. Validation: request/response validation with Joi. Error Handling: comprehensive error handling and logging. Rate Limiting: API rate limiting and throttling. CORS Support: cross-origin resource sharing configuration. Health Checks: system health monitoring endpoints.

**Architecture Patterns:** Module Pattern: each entity has its own module with clear boundaries. Middleware Pattern: authentication, validation, and error handling middleware. Repository Pattern: data access abstraction layer. Service Pattern: business logic separation from HTTP handlers. Factory Pattern: object creation and configuration management.

---

## 4. MongoDB Data Architecture

**Purpose:** Store user data, personal agents, prompts, and system metadata.

**Collections:** users: user profiles, preferences, and settings. agents: personal and private agents with metadata. prompts: personal and private prompts with metadata. promptgroups: prompt group organization. approvals: approval workflow data and status. aclentries: access control list entries. accessroles: role definitions and permissions. categories: content categorization. ratings: user ratings and reviews. projects: project organization for content.

**Schema Design:** Normalized Structure: efficient data relationships. Indexed Queries: optimized for common access patterns. Soft Deletes: data preservation with logical deletion. Audit Fields: created/updated timestamps and user tracking. Version Control: document versioning for content changes.

---

## 5. Cosmos DB and Blob Storage Architecture

**Cosmos DB Purpose:** High-performance database for public agent and prompt directory.

**Containers:** public-agents: published agents available to all users. public-prompts: published prompts available to all users. categories: content categorization and metadata. ratings: public ratings and reviews. search-index: full-text search capabilities.

**Cosmos DB Features:** Global Distribution: multi-region deployment for performance. Automatic Scaling: dynamic throughput allocation. Consistency Levels: configurable consistency for different use cases. Change Feed: real-time data synchronization. SQL API: familiar query language for data access.

**Blob Storage Purpose:** Store file attachments, images, and legacy approval data.

**Containers:** attachments: file attachments for agents and prompts. images: profile pictures and content images. legacy-approvals: historical approval data. exports: data export files. backups: system backup files.

**Blob Features:** CDN Integration: global content delivery. Access Control: fine-grained access permissions. Versioning: file version control. Lifecycle Management: automatic file lifecycle policies. Encryption: at-rest encryption for all data.

---

## 🔐 Authentication and Authorization Flow

**Authentication Flow:** 1. User accesses application. 2. MSAL.js redirects to Azure AD. 3. User authenticates with Azure AD. 4. Azure AD returns authorization code. 5. MSAL.js exchanges code for access token. 6. Application stores token securely. 7. Token included in API requests. 8. Azure Functions validates JWT token. 9. Request processed with user context.

**Authorization Model:** Role-Based Access Control (RBAC): granular permissions based on user roles. Resource-Level Permissions: fine-grained access to specific resources. Inheritance: permission inheritance from groups and roles. Dynamic Permissions: runtime permission evaluation. Audit Logging: complete permission check logging.

**Security Features:** JWT Validation: token validation with issuer and audience verification. CORS Configuration: controlled cross-origin access. Rate Limiting: API rate limiting to prevent abuse. Input Validation: comprehensive input sanitization and validation. SQL Injection Prevention: parameterized queries and input validation. XSS Protection: Content Security Policy and input sanitization. CSRF Protection: cross-site request forgery prevention.

---

## 🔄 Agent Submission and Public Access Data Flows

**Agent Submission Flow:** 1. User creates agent in Client App. 2. Client App validates input data. 3. Client App sends POST to /api/agents. 4. Azure Functions validates JWT token. 5. Azure Functions validates request data. 6. Azure Functions saves to MongoDB. 7. Azure Functions sends email notification. 8. Admin receives notification in Admin App. 9. Admin reviews and approves/rejects. 10. System updates agent status. 11. User receives status notification.

**Public Agent Access Flow:** 1. User browses public agents in Client App. 2. Client App requests /api/public-agents. 3. Azure Functions validates JWT token. 4. Azure Functions queries Cosmos DB. 5. Azure Functions applies filters and pagination. 6. Azure Functions returns agent list. 7. Client App displays agents with search/filter. 8. User selects agent for details. 9. Client App requests /api/public-agents/:id. 10. Azure Functions returns detailed agent data. 11. Client App displays agent details.

**Rating and Review Flow:** 1. User rates agent in Client App. 2. Client App validates rating data. 3. Client App sends POST to /api/ratings. 4. Azure Functions validates JWT token. 5. Azure Functions validates rating data. 6. Azure Functions saves rating to database. 7. Azure Functions updates average rating. 8. Azure Functions sends notification to agent owner. 9. Agent owner receives notification. 10. System updates public rating display.

---

## 📧 Email and Health Monitoring Flows

**Email Notification Flow:** 1. System event triggers notification. 2. Azure Functions calls /api/email. 3. Email service validates template. 4. Email service retrieves user data. 5. Email service renders template. 6. Email service sends via Azure Communication Services. 7. Azure Communication Services delivers email. 8. System logs delivery status. 9. User receives email notification.

**Health Monitoring Flow:** 1. Monitoring system calls /api/health. 2. Health service checks all dependencies. 3. Health service validates database connections. 4. Health service checks external services. 5. Health service returns health status. 6. Monitoring system processes results. 7. Alerts triggered if health checks fail. 8. Operations team notified of issues.

---

## ⚡ Performance and Caching Strategy

**Caching Strategy:** CDN Caching: static assets cached globally. API Response Caching: frequently accessed data cached. Database Query Caching: query result caching. Session Caching: user session data caching. Template Caching: email template caching.

**Scalability Features:** Auto-scaling: Azure Functions automatically scale based on demand. Load Balancing: Azure Application Gateway for traffic distribution. Database Sharding: horizontal scaling for large datasets. Read Replicas: database read scaling. Async Processing: background job processing.

**Performance Optimization:** Database Indexing: optimized indexes for common queries. Query Optimization: efficient database queries. Connection Pooling: database connection management. Lazy Loading: on-demand data loading. Code Splitting: JavaScript bundle optimization.

---

## 📊 Monitoring and Observability

**Application Insights Integration:** Telemetry Collection: automatic collection of metrics and logs. Performance Monitoring: response time and throughput tracking. Error Tracking: automatic error detection and reporting. User Analytics: user behavior and usage patterns. Custom Metrics: business-specific metrics tracking.

**Health Monitoring:** Health Endpoints: comprehensive health check endpoints. Dependency Monitoring: external service health monitoring. Performance Alerts: automated performance alerting. Error Alerts: automated error alerting. Capacity Planning: resource usage monitoring.

**Logging Strategy:** Structured Logging: JSON-formatted logs for easy parsing. Log Levels: appropriate log levels for different environments. Log Aggregation: centralized log collection and analysis. Audit Logging: complete audit trail for compliance. Performance Logging: detailed performance metrics.

---

## 🔧 Development Architecture

**Development Workflow:** 1. Feature Development: create feature branch, implement changes, write tests, update documentation, submit pull request. 2. Code Review: automated testing, code review, security scan, approval process. 3. Deployment: merge to main, automated build, automated testing, staging deployment, production deployment.

**Testing Strategy:** Unit Testing: component and function testing. Integration Testing: API endpoint testing. End-to-End Testing: complete user journey testing. Performance Testing: load and stress testing. Security Testing: vulnerability and penetration testing.

**Quality Assurance:** Code Quality: ESLint and Prettier for code standards. Type Safety: TypeScript for compile-time error checking. Documentation: comprehensive API and code documentation. Accessibility: WCAG compliance testing. Security: regular security audits and scans.

---

## 🚀 Integration and Deployment Architecture

**External Service Integration:** Azure AD: authentication and user directory. Azure Communication Services: email and SMS notifications. Azure Application Insights: monitoring and analytics. Azure Key Vault: secret and key management. Azure Storage: file and blob storage.

**API Integration Patterns:** RESTful APIs: standard HTTP-based APIs. Webhook Integration: real-time event notifications. Batch Processing: bulk data processing. Async Processing: background job processing. Event-Driven Architecture: event-based system communication.

**Environment Strategy:** Development: local development with cloud services. Staging: pre-production environment for testing. Production: live environment with high availability. Disaster Recovery: backup and recovery procedures.

**Infrastructure as Code:** Azure Resource Manager: infrastructure deployment templates. GitHub Actions: automated CI/CD pipelines. Environment Configuration: environment-specific configuration management. Secret Management: secure secret and configuration management.

---

## 📚 Related Documentation

- **03-getting-started.md** — Development environment setup
- **04-authentication.md** — Authentication configuration
- **05-api-guide.md** — API reference and integration
- **06-deployment-guide.md** — Production deployment
- **07-operations-runbook.md** — Operations and maintenance
- **08-troubleshooting.md** — Common issues and solutions

---

## 🔑 Close

> 8.5/10 WAF. 12ms response. Multi-VNet. Private endpoints. Production template for enterprise AI agent management.

The Datacom Agent Library architecture delivers enterprise-grade performance, security, and scalability. Built on Azure Well-Architected Framework principles, the system serves as a production template for replication across the Datacom organization.

---

📌 **Document Type:** Technical Architecture Presentation
📅 **Last Updated:** 17 September 2025
🔗 **Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40061796638
