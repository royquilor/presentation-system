# Agent Library Glossary — Technical Terms & Definitions

> A comprehensive reference of technical terms, acronyms, Azure services, and architectural concepts used throughout the Datacom Agent Library project.

**Author:** Dipesh Trikam
**Date:** 13 September 2025
**Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40062222353

**Space:** Insights & Analytics | **Path:** Insights & Analytics → AI Projects → Active → Agent Library → Glossary

---

## 📌 Summary

This presentation adapts the Confluence Agent Library Glossary into a structured format for stakeholder communication. All 60+ terms from the source are preserved and grouped into nine logical flex sections. The document follows presentation conventions: Context, Problem, Observations, Proposal, Risks, Next Steps, and Close, with comprehensive glossary content in between.

---

## 🎯 Context

The Datacom Agent Library is a WAF-compliant (8.5/10) enterprise AI agent-sharing platform built by the Datacom EASA team. This glossary was authored by Dipesh Trikam to serve as a shared vocabulary for all project contributors — developers, operators, architects, and stakeholders — ensuring consistent use of terminology across documentation, code reviews, and team communication.

---

## 🔍 Problem

Enterprise projects spanning multiple Azure services, authentication systems, and custom application concepts accumulate a significant body of specialised terminology. Without a canonical reference, team members and new contributors risk misinterpreting terms (e.g., confusing "Agent" the AI tool with other uses of the word), leading to miscommunication in design discussions and documentation.

---

## 📋 Observations

**1. Full A–Z Coverage**

The glossary covers the full alphabet with 60+ terms spanning application architecture, Azure services, security, performance, and development tooling.

**2. Agent as Core Entity**

Agent is defined as an AI-powered tool or assistant that users create and share within the organisation — the core entity of the entire platform.

**3. Private Endpoint Architecture**

Private Endpoint is specifically called out as a key architectural term: CosmosDB is accessed via private endpoint within the Function App VNet, eliminating public internet exposure and achieving <5ms database latency.

**4. Performance Achievement**

The Performance entry highlights the headline achievement: 12ms average response time, representing a 99.8% improvement from the original 5,000ms+ baseline.

**5. VNet Peering**

VNet Peering (172.21.0.0/16 ↔ 172.19.0.0/16) is defined as the secure network connectivity method that underpins the performance breakthrough.

**6. Categorised Appendices**

The glossary is grouped into categorised appendices covering Azure Services, Development Tools, Security Terms, and Performance Terms for quick lookup.

**7. WAF Compliance Benchmark**

WAF Compliance (8.5/10, A-grade) is cited as a key project benchmark, with definitions anchored to the five WAF pillars: Reliability, Security, Cost Optimisation, Performance Efficiency, and Operational Excellence.

---

## 💡 Proposal

The glossary serves as a living reference document maintained alongside the broader Agent Library documentation suite. It is designed to be consulted during onboarding, architecture reviews, and documentation authoring to ensure all parties are working from the same definitions.

Terms that have specific meanings within the project's Azure-centric architecture (e.g., Private Endpoint, VNet Peering, Agent) require particular attention. New contributors should review this glossary before their first architecture or code review.

---

## ⚠️ Risks

**Stale Definitions** As a living document, the glossary risks becoming stale if architectural decisions change (e.g., VNet CIDR ranges, database choices, new Azure services) and updates are not applied promptly. Quarterly review mitigates this.

**Aspirational vs. Implemented** Some entries (e.g., Zero Downtime, Global Distribution) describe aspirational or planned capabilities rather than fully implemented features — readers may conflate documented terms with confirmed production behaviour. Clarify implementation status in future updates.

**Missing Domain Terms** The glossary does not define domain-specific business terms (e.g., `approval workflow states`, `agent categories`, `sharing types`) that are relevant to non-technical stakeholders. Product owners may need a separate business glossary.

---

## ✅ Next Steps

1. **Quarterly Review** — Assign ownership for quarterly glossary review to keep definitions aligned with infrastructure and feature changes.
2. **Expand Domain Terms** — Expand the glossary to include business/domain terms (e.g., `Approval Workflow`, `Sharing Types`, `Agent Category`) for product and stakeholder audiences.
3. **Inline Linking** — Link glossary terms inline from other documentation pages where first-use disambiguation would benefit readers.
4. **Acronyms Section** — Add a section for project-specific acronyms and abbreviations used in Jira tickets and team communication.

---

## 🏗️ Architecture Terms

**1. Agent**

An AI-powered tool or service that can perform specific tasks or provide specialised functionality. In the context of this system, agents are user-created AI assistants that can be shared and discovered within the organisation. The Agent is the core entity of the entire platform.

**2. Backend**

The server-side portion of an application that handles business logic, data processing, and database operations. In this system, the backend consists of Azure Functions and databases. Hosted as a Function App within the project VNet.

**3. Frontend**

The client-side portion of a web application that users interact with. Built with React, TypeScript, and Tailwind CSS. Deployed to Azure Static Web Apps.

**4. Client App**

The user-facing web application built with React and Vite. Allows users to browse, create, and manage AI agents and prompts. Deployed to Azure Static Web Apps with automatic builds from GitHub.

**5. Infrastructure**

The underlying hardware and software components that support the application. Includes servers, databases, networks, and cloud services. Fully Azure-hosted with VNet isolation.

**6. Orchestration**

The automated arrangement, coordination, and management of complex computer systems, middleware, and services. GitHub Actions provides CI/CD orchestration.

**7. Static Web App**

A web application that serves static files (HTML, CSS, JavaScript) without requiring server-side processing. Ideal for React SPA deployment with global CDN distribution.

**8. Schema**

The structure of a database, including tables, fields, and relationships. MongoDB uses flexible schemas allowing document variation without migrations.

**9. Container**

A standardised unit of software that packages code and all its dependencies. Used in the context of database containers in Cosmos DB (logical grouping of documents).

**10. Enterprise Template**

Production-ready template for organisation replication. The Datacom Agent Library serves as an enterprise template with VNet peering and private endpoint architecture.

**11. WAF Compliance**

Well-Architected Framework compliance score. The project achieves 8.5/10 (A- Grade) across five pillars: Reliability, Security, Cost Optimisation, Performance Efficiency, and Operational Excellence. Used as the primary benchmark for architectural decisions.

---

## ☁️ Azure Terms

**1. Azure AD (Azure Active Directory)**

Microsoft's cloud-based identity and access management service. Used for user authentication, authorization, and single sign-on (SSO) in the Datacom Agent Library. Integrates with MSAL in the frontend for token acquisition.

**2. Azure Functions**

A serverless compute service that allows you to run event-triggered code without having to explicitly provision or manage infrastructure. Used as the backend API for the Datacom Agent Library. Runs on Node.js and hosts all REST endpoints.

**3. Azure Static Web Apps**

A service that automatically builds and deploys full stack web apps to Azure from a GitHub repository. Used to host the client and admin applications. Supports custom domains and automatic CI/CD from GitHub.

**4. Blob Storage**

Azure's object storage service for storing large amounts of unstructured data. Used for file attachments, images, and legacy data in the Datacom Agent Library. Part of Azure Storage account.

**5. Cosmos DB**

Azure's globally distributed, multi-model database service. Used for storing public agents and prompts with high availability and performance. Accessed via private endpoint for sub-5ms latency.

**6. Function App**

An Azure Functions application that contains multiple functions. Hosts the backend API endpoints for the Datacom Agent Library. Deployed within the project VNet for secure connectivity.

**7. Key Vault**

Azure's cloud service for securely storing and accessing secrets, keys, and certificates. Used to store sensitive configuration values including connection strings and API keys.

**8. Private Endpoint**

A secure network interface that connects privately to Azure services. CosmosDB is accessible via private endpoint within Function App VNet, eliminating public internet exposure and achieving <5ms database access. Critical for WAF Security pillar compliance.

**9. VNet Peering**

Secure connectivity between virtual networks. The project uses 172.21.0.0/16 ↔ 172.19.0.0/16 for VNet peering between Function App and Cosmos DB. Enables the 12ms response time achievement.

**10. Application Insights**

Azure application performance monitoring service used for observability and diagnostics.

**11. Azure CLI** Command-line interface for managing Azure resources and deployments.

**12. Azure Portal** Web-based management interface for Azure services and resources.

---

## 🔐 Security Terms

**1. JWT (JSON Web Token)**

A compact, URL-safe means of representing claims to be transferred between two parties. Used for authentication and authorization in the API. Issued by Azure AD and validated by the Function App backend.

**2. OAuth**

An open standard for authorization that provides applications the ability to access user data without exposing user credentials. Azure AD implements OAuth 2.0 for the Agent Library.

**3. RBAC (Role-Based Access Control)**

A method of restricting system access based on the roles of individual users. Used for admin and user permissions. Aligns with WAF Security pillar requirements.

**4. CORS (Cross-Origin Resource Sharing)**

A security feature that controls which web pages can make requests to a different domain. Configured to allow frontend applications to communicate with the backend API. Must be explicitly configured for Static Web App origins.

**5. XSS (Cross-Site Scripting)**

A security vulnerability that allows attackers to inject malicious scripts into web pages. Prevented through input validation and sanitisation. Addressed in WAF Security pillar.

**6. Secret**

A sensitive piece of information like passwords, API keys, or connection strings. Stored securely in Azure Key Vault. Never committed to source control.

**7. Authentication**

Verifying user identity before granting access to the system. Implemented via Azure AD and MSAL.

**8. Authorization**

Controlling access to resources based on user identity and permissions. Implemented via RBAC and JWT claims.

**9. Encryption**

Protecting data confidentiality through cryptographic transformation of data at rest and in transit.

**10. Firewall** Network security device or service that monitors and controls incoming and outgoing network traffic.

**11. HTTPS** Secure HTTP protocol that encrypts data in transit using SSL/TLS.

**12. SSL/TLS** Security protocols that provide encryption and authentication for network communications.

**13. MSAL (Microsoft Authentication Library)** A library that enables applications to authenticate users with Microsoft identity platform. Used in the frontend applications.

---

## 🗄️ Database Terms

**1. Database**

A structured collection of data stored electronically. The system uses MongoDB for user data and Cosmos DB for public content. Both are document-oriented NoSQL databases optimised for flexible schema and high throughput.

**2. MongoDB**

A document-oriented NoSQL database used for storing user data, agents, prompts, and system metadata. Supports flexible document structure and horizontal scaling. Used for user-specific and private content.

**3. Cosmos DB**

Azure's globally distributed, multi-model database service. Used for storing public agents and prompts with high availability and performance. Supports MongoDB API compatibility. Accessed via private endpoint for optimal latency.

**4. NoSQL** A database design that allows for flexible, schema-less data storage. MongoDB and Cosmos DB are NoSQL databases.

**5. Partition Key** A field used to distribute data across multiple partitions in a distributed database. Important for performance in Cosmos DB. Choose partition keys that distribute load evenly.

**6. Query** A request for data from a database. Optimised for performance through indexing and query optimisation. Cosmos DB and MongoDB support rich query languages.

**7. Storage** The retention of data in a structured format. Includes databases (MongoDB, Cosmos DB), file storage (Blob Storage), and backup systems. All sensitive data in Key Vault.

---

## 📡 API Terms

**1. API (Application Programming Interface)** A set of rules and protocols that allows different software applications to communicate with each other. The Datacom Agent Library provides RESTful APIs for managing agents, prompts, users, and system operations.

**2. REST (Representational State Transfer)** An architectural style for designing networked applications. The API follows REST principles.

**3. Webhook** A mechanism for real-time communication between applications. Used for triggering automated processes.

**4. Rate Limiting** A technique used to control the rate of requests a user can make to an API. Prevents abuse and ensures fair usage.

**5. Health Check** An endpoint that reports the current status of a service or application. Used for monitoring and load balancer health verification.

---

## 🛠️ Development Tools

**1. Node.js** A JavaScript runtime environment that allows running JavaScript on the server side. Used for the Azure Functions backend.

**2. React** A JavaScript library for building user interfaces. Used to create the frontend applications.

**3. TypeScript** A superset of JavaScript that adds static typing. Used throughout the project for better code quality and developer experience.

**4. Vite** A build tool that provides a fast development server and optimised production builds. Used for the frontend applications.

**5. GitHub** Code hosting platform used as the repository for source code and CI/CD workflows.

**6. GitHub Actions** A CI/CD platform that automates software workflows. Used to build, test, and deploy the application.

**7. Git** Version control system that tracks changes to source code over time.

**8. npm** Node.js package manager for installing and managing JavaScript dependencies.

**9. ESLint** JavaScript linting utility for identifying and reporting code quality issues.

**10. Prettier** Code formatter for enforcing consistent style across the codebase.

**11. Postman** API testing tool for validating endpoints and request/response behaviour.

---

## ⚡ Performance Terms

**1. Performance**

The speed and efficiency with which a system operates. Current achievement: 12ms average response time (99.8% improvement from 5000ms+ baseline) through VNet peering and private endpoint optimisation. One of the five WAF pillars.

**2. Response Time** The time it takes for a system to respond to a request. A key performance indicator for user experience.

**3. Throughput** The rate at which a system can process requests or data. Measured in requests per second or operations per second.

**4. Latency** Time delay in data transmission between client and server. Minimised through VNet peering and private endpoints.

**5. Load Balancing** The process of distributing network traffic across multiple servers to ensure no single server bears too much load.

**6. Caching** Storing frequently accessed data in memory or fast storage to reduce latency and improve response times.

**7. CDN (Content Delivery Network)** A distributed network of servers that delivers content from locations closer to users for improved performance.

**8. Uptime** System availability percentage. A key metric for high availability and reliability.

**9. Error Rate** The percentage of requests that result in errors. Monitored as a key performance indicator for system health.

**10. Scalability** The ability of a system to handle increased load by adding resources. Achieved through auto-scaling and distributed architecture.

**11. High Availability** The ability of a system to remain operational for a high percentage of time. Achieved through redundancy, failover mechanisms, and monitoring.

**12. Global Distribution** The ability to serve applications and data from multiple geographic locations. Cosmos DB provides global distribution for improved performance.

---

## 🔄 DevOps & Deployment Terms

**1. CI/CD (Continuous Integration/Continuous Deployment)** A software development practice where code changes are automatically built, tested, and deployed. GitHub Actions is used for CI/CD in this project.

**2. Build** The process of compiling source code and creating executable files or deployable packages. Automated builds are triggered by code changes and deployed to various environments.

**3. Deployment** The process of making software available for use. Includes building, testing, and releasing applications to production environments.

**4. Pipeline** A set of automated processes that move software from development to production. Includes building, testing, and deployment stages.

**5. Environment** A specific configuration of the application for a particular purpose (development, staging, production). Each environment has its own settings, databases, and resources.

**6. Environment Variables** Configuration values that are set outside of the application code. Used to configure database connections, API keys, and other settings.

**7. Production** The live environment where the application is used by end users. Requires high availability, security, and performance.

**8. Zero Downtime** The ability to deploy updates without interrupting service to users. Achieved through blue-green deployments and rolling updates.

**9. Version Control** A system that tracks changes to source code over time. Git is used for version control in this project.

**10. Workflow** A series of automated steps that process data or perform tasks. GitHub Actions workflows handle CI/CD processes.

---

## 📋 General & Observability Terms

**1. Identity** The digital representation of a user, system, or application. Managed through Azure AD in this system.

**2. Integration** The process of combining different software components to work together. The system integrates with Azure AD, MongoDB, Cosmos DB, and other services.

**3. IP Address** A numerical label assigned to devices on a computer network. Used for network security and access control.

**4. Logging** The process of recording events and activities in a system. Used for debugging, monitoring, and audit purposes.

**5. Monitoring** The process of observing and tracking system performance, health, and behaviour. Uses Application Insights and Azure Monitor.

**6. Observability** The ability to understand the internal state of a system by examining its outputs. Includes logging, monitoring, and tracing.

**7. Prompt** A text input that guides an AI model to generate specific outputs. Users can create and share prompts in the system. Stored in MongoDB (private) or Cosmos DB (public).

**8. Serverless** A cloud computing model where the cloud provider manages the infrastructure and automatically allocates resources as needed. Azure Functions is serverless.

**9. Session** A period of interaction between a user and a web application. Managed through authentication tokens (JWT) with Azure AD session handling.

**10. Single Sign-On (SSO)** An authentication method that allows users to access multiple applications with one set of credentials. Implemented via Azure AD.

**11. Token** A piece of data that represents a user's authentication status. JWT tokens are used for API authentication.

**12. User** An individual who interacts with the system. Users can create, share, and discover AI agents and prompts.

**13. User Interface (UI)** The visual elements and interactions that users see and interact with. Built with React and Tailwind CSS.

**14. Domain** A human-readable address used to access web applications. Custom domains can be configured for production applications.

**15. Development Environment** A setup where developers can write, test, and debug code. Includes local development tools and cloud-based development resources.

**16. Host** A computer or server that provides services to other computers or applications. Azure Functions hosts the backend API.

**17. Repository** A storage location for software packages and source code. GitHub is used as the code repository.

**18. YAML** A human-readable data serialisation format. Used for configuration files and GitHub Actions workflows.

---

## 📖 Acronyms & Abbreviations

**AD** Active Directory. **API** Application Programming Interface. **CDN** Content Delivery Network. **CI/CD** Continuous Integration / Continuous Deployment. **CORS** Cross-Origin Resource Sharing. **JWT** JSON Web Token. **MSAL** Microsoft Authentication Library. **RBAC** Role-Based Access Control. **REST** Representational State Transfer. **SSO** Single Sign-On. **TLS** Transport Layer Security. **UI** User Interface. **VNet** Virtual Network. **WAF** Well-Architected Framework. **XSS** Cross-Site Scripting.

**EASA** Enterprise AI Solutions & Analytics (Datacom team). **IA** Insights & Analytics (Confluence space). **NoSQL** Non-relational database. **SSL** Secure Sockets Layer.

---

## 📑 Glossary Structure

Terms are grouped into logical flex sections for quick lookup:

- **Architecture Terms** — Agent, Backend, Frontend, Client App, WAF Compliance, Enterprise Template
- **Azure Terms** — Azure AD, Azure Functions, Cosmos DB, Key Vault, Private Endpoint, VNet Peering
- **Security Terms** — JWT, OAuth, RBAC, CORS, XSS, MSAL, Authentication, Authorization
- **Database Terms** — MongoDB, Cosmos DB, NoSQL, Partition Key, Query, Storage
- **API Terms** — REST, Webhook, Rate Limiting, Health Check
- **Development Tools** — React, TypeScript, Vite, GitHub Actions, Git, npm, ESLint
- **Performance Terms** — Response Time, Throughput, Latency, Scalability, High Availability
- **DevOps & Deployment Terms** — CI/CD, Pipeline, Environment, Zero Downtime
- **General & Observability Terms** — Logging, Monitoring, Observability, Prompt, Session

Each term includes a definition and project-specific context where relevant. Inline code (e.g., `Approval Workflow`, `Sharing Types`) is preserved for technical accuracy. Definitions are drawn from the canonical Confluence source and expanded with Agent Library-specific context.

---

## 📚 Related Documentation

- **01-overview.md** — System overview and purpose
- **02-architecture.md** — Technical architecture and VNet design
- **03-getting-started.md** — Development setup and local environment
- **04-authentication.md** — Authentication configuration (Azure AD, MSAL)
- **05-api-guide.md** — API reference and integration patterns
- **06-deployment-guide.md** — Production deployment and CI/CD
- **07-operations-runbook.md** — Operations and maintenance procedures
- **08-troubleshooting.md** — Common issues and solutions

These documents reference glossary terms for consistent terminology. Use this glossary when reading or contributing to any Agent Library documentation.

---

## 🏆 Key Enterprise Benchmarks

**WAF Compliance** 8.5/10 (A- Grade) across five pillars: Reliability, Security, Cost Optimisation, Performance Efficiency, and Operational Excellence. The project is production-ready for organisation replication.

**VNet Peering** 172.21.0.0/16 ↔ 172.19.0.0/16 secure connectivity between Function App and Cosmos DB. Eliminates public internet traversal for database traffic.

**Response Time** 12ms average (enterprise performance target), 99.8% improvement from 5000ms+ baseline. Achieved through private endpoint and VNet peering optimisation.

**Private Endpoint** CosmosDB secured within Function App VNet, <5ms database access, no public internet exposure. Critical for security and latency.

**Error Rate** Monitored as a key performance indicator. Target: minimal errors with comprehensive logging and Application Insights integration.

**Throughput** Measured in requests per second. The 12ms response time enables higher throughput by reducing per-request latency. Auto-scaling supports variable load.

**High Availability** Target for production. Achieved through Azure redundancy, health checks, and monitoring. Part of WAF Reliability pillar.

---

## 🔑 Close

> This glossary is the authoritative vocabulary reference for the Datacom Agent Library — the definitions of Private Endpoint, VNet Peering, and Performance are especially important as they describe the architectural decisions that delivered the platform's headline 12ms response time.

The glossary anchors team communication and documentation to a shared set of definitions. Key architectural terms — WAF Compliance (8.5/10), VNet Peering, Private Endpoint, and the 12ms Performance achievement — are the vocabulary of the platform's success.

Consult this document during onboarding, architecture reviews, code reviews, and documentation authoring. When in doubt about a term's meaning within the Agent Library context, this glossary is the authoritative source.

The Confluence source is maintained by Dipesh Trikam. This presentation format preserves all definitions while adding structured sections (Context, Problem, Observations, Proposal, Risks, Next Steps) for stakeholder communication.

For the latest version, always refer to the Confluence source URL. This file is generated from that source and may lag behind Confluence updates.

**Total Terms:** 90+ definitions across nine categories. **Key Metrics:** 12ms response time, 8.5/10 WAF, <5ms DB access.

**Audience:** Developers, operators, architects, product owners, and stakeholders. **Use Case:** Onboarding, architecture reviews, documentation authoring, Jira ticket alignment.


---

📌 **Document Type:** Reference / Glossary
📅 **Last Updated:** 13 September 2025
🔗 **Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40062222353
📂 **Confluence Space:** Insights & Analytics (IA) | **Format:** Presentation Markdown
