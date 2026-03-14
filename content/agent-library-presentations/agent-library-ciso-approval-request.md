# Agent Library — CISO Approval Request

> Security Assessment and Production Deployment Approval for the Datacom Agent Library internal web application.

**Author:** Jason Moss
**Date:** 9 December 2025
**Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40516616397

---

## 🎯 Context

The Agent Library is an internal-only web application for Datacom staff. It extends the existing Conver AI chat platform, which is already approved and in production. The problem it solves: staff can create useful AI agents in Conver, but currently have no way to share them with colleagues. Knowledge and productivity tools stay siloed with individuals.

The application allows staff to request to share their AI agents with specific colleagues or all of Datacom. All sharing requests go through a formal review and approval process. Agents relating to specific business functions (e.g., Comms, Legal, HR) are referred to those teams for vetting before release. It provides a searchable directory of approved agents for staff to discover and use.

Target go-live is early January 2026. The requestor is Jason Moss. The application is the Datacom Agent Library.

---

## 🔍 Problem

AI agents created by staff in Conver are siloed to individuals, preventing colleagues from discovering and benefiting from useful productivity tools. A new sharing layer is needed, but it must pass security assessment before being permitted into production.

Six residual security findings require formal CISO risk acceptance before deployment can proceed. The team seeks approval for production deployment and acceptance of these 6 findings (all MEDIUM or LOW severity) with documented rationale.

---

## 📋 Observations

**1. Penetration Testing Completed**

Black-box penetration testing was performed internally (Gary) across all API endpoints. All 4 HIGH severity findings identified during testing have been remediated. Penetration testers attempted to exploit the remaining code quality findings and could not demonstrate exploitation.

**2. Static Code Analysis Completed**

Full codebase scans were performed using Snyk and Aikido. OWASP Top 10 verification was checked against common vulnerabilities. Combined with penetration testing, 18 total findings were identified: 4 HIGH (all fixed), 5 MEDIUM (1 fixed, 4 for acceptance), 9 LOW (3 fixed, 6 for acceptance).

**3. No External Users or Sensitive Data**

The application is internal Datacom staff only. No PII is stored. No sensitive data is stored — metadata only (agent names, descriptions, categories, star ratings, approval workflow status). The actual AI agent content resides in the Conver database, which is already approved and in production.

**4. All HIGH Severity Findings Fixed**

Four HIGH severity issues were identified and remediated: unauthorised agent self-approval, unauthorised access to agent details, ReDoS attack vectors in agents search, and ReDoS attack vectors in prompts search. One hundred percent of HIGH findings have been fixed.

**5. Six Findings Proposed for Risk Acceptance**

All 6 residual findings are MEDIUM or LOW severity. None involve external access, PII exposure, or demonstrated exploitability. Each has documented rationale for acceptance. The findings relate to star ratings visibility in API data, API paths in error messages, HTTP request handling (false positive), user input in logs, input type checking gaps, and a vulnerable third-party documentation package.

**6. Azure Well-Architected Framework**

The application is built entirely on managed Azure services, minimising operational overhead and security patching responsibilities. The architecture follows Azure Well-Architected Framework principles across security, reliability, cost optimisation, operational excellence, and performance efficiency.

**7. Entra ID Authentication Only**

All access requires Microsoft Entra ID (Azure AD) authentication. There are no separate user accounts — staff use their existing Datacom credentials. Every API call validates a JWT token. Session management is handled by Azure and Entra ID.

**8. Governance and Content Approval Workflow**

No agent is shared organisation-wide without review. The workflow includes creation, share request, duplication, admin review, departmental vetting for business-function agents, decision, and ongoing management. Admins can disable or remove agents at any time if issues arise.

---

## 💡 Proposal

The team requests CISO approval to deploy the Agent Library to production and formally accept the 6 residual findings. Each accepted finding has been assessed as low real-world risk due to the internal-only audience, mandatory Entra ID authentication, and Azure infrastructure controls.

Post-approval actions include provisioning production Azure resources, configuring Cloudflare WAF, Application Insights monitoring, and alerting within two weeks of sign-off. Final security verification and production deployment will occur in Week 2 post-approval.

---

## ⚠️ Risks

**Star Ratings Visible in API Data** — Individual ratings (e.g., "John Smith gave this 4 stars") are visible in raw API responses via browser developer tools. The UI does not display this. Risk is minimal — not sensitive data, only for agents the user already has access to, and Entra ID login required.

**API Paths Listed in Error Messages** — Wrong URLs return error messages listing valid API paths. All endpoints require Entra ID login; knowing the URL does not grant access. Cloudflare WAF will add another protection layer post go-live. Real-world impact: none.

**Code Allows HTTP Requests (False Positive)** — Static analysis flagged that code could accept unencrypted HTTP. Azure infrastructure forces all traffic to HTTPS; HTTP is redirected before reaching application code. TLS 1.2+ enforced at infrastructure level. Real-world impact: none.

**User Input Written to Internal Logs** — Error logs include some user-provided data (search terms, IDs) for debugging. Logs stored in Azure Application Insights, not visible to end users. Only authorised Datacom staff can access logs. Sensitive data explicitly excluded. Real-world impact: none.

**Input Type Checking Gaps** — Some code assumes input type before explicit checking. All critical inputs (emails, IDs, ratings) are explicitly validated. Penetration testers attempted to exploit and could not. Real-world impact: none demonstrated.

**Vulnerable Third-Party Package (inflight)** — Used by Swagger documentation tool; has known vulnerability (resource exhaustion). No fix exists — package abandoned. Only used for developer documentation, not core functionality. Azure Functions has automatic timeouts and auto-scaling. Real-world impact: very low.

**Cloudflare WAF Not Yet Configured** — Additional DDoS and attack protection deferred to post-approval. Application relies solely on Azure infrastructure protections until go-live.

**Application Insights Alerting Not Yet Configured** — Monitoring gaps exist between approval and go-live, creating a brief window of reduced operational visibility.

---

## ✅ Next Steps

1. **CISO Review and Sign-Off** — Review the 6 risk acceptance items and production deployment decision; complete approval section with name, signature, and date.

2. **Provision Production Azure Resources** — Development team to provision production resources in Week 1 post-approval.

3. **Configure Cloudflare WAF** — Development team to configure WAF for additional DDoS and attack protection in Week 1 post-approval.

4. **Configure Application Insights Monitoring** — Development team to configure monitoring pre-go-live in Week 1 post-approval.

5. **Configure Alerting** — Development team to configure alerting alongside Application Insights in Week 1 post-approval.

6. **Final Security Verification** — Development team to complete final security verification in Week 2 post-approval.

7. **Production Deployment** — Development team to perform production deployment in Week 2 post-approval.

8. **Retain Supporting Documentation** — Attach and retain the Security Remediation Report and Agent Library Technical Documentation as supporting evidence.

---

## 🔑 Close

> All critical (HIGH) security findings have been fixed, no sensitive data is at risk, and the 6 residual findings are low real-world impact — this approval request represents a well-prepared, security-conscious push to production for an internal-only tool.

The application stores no PII, no customer data, and no sensitive business data. All 6 findings require authentication — an external attacker cannot exploit any of them. Penetration testers could not demonstrate exploitation of the code quality findings. The internal-only nature of the application significantly reduces the attack surface.

---

## 🛡️ Network Security

**1. Architecture and Hosting**

The application is built entirely on managed Azure services. The client app and admin app are React applications hosted on Azure Static Web Apps — no server to patch. The backend API is Node.js on Azure Functions (serverless), Azure-managed with auto-patching. Database uses MongoDB API on Azure Cosmos DB with private endpoints. File storage uses Azure Blob Storage with access controls. Secrets are stored in Azure Key Vault — no secrets in code.

**2. Private Endpoints and Traffic Flow**

Database traffic stays within the Azure network via private endpoints. Multi-VNet architecture with secure peering provides network isolation and controlled traffic flow. No VMs or OS patching required — Azure manages infrastructure security.

**3. CDN and WAF**

Cloudflare will be configured post-approval to provide additional DDoS and attack protection. This adds an extra protection layer beyond Azure infrastructure. Production URLs will be behind Cloudflare once configured.

**4. TLS and Encryption**

Azure infrastructure forces all traffic to HTTPS. Any HTTP request is automatically redirected to HTTPS before reaching application code. TLS 1.2+ is enforced at the infrastructure level. The static analysis finding regarding HTTP (2.3) is a false positive — the tool cannot see Azure configuration.

---

## 🛡️ Identity and Access Management

**1. Authentication**

All access requires Microsoft Entra ID (Azure AD) authentication. There are no separate user accounts — staff use their existing Datacom credentials. JWT tokens carry email and permissions. Token validation occurs on every API call. Session management is handled by Azure and Entra ID.

**2. User Roles**

- **User** — Browse agents, request access, rate agents, submit agents for sharing. Granted to all Datacom staff.
- **Admin** — Approve or reject submissions, manage users, view audit logs, disable agents. Granted to designated administrators only.

**3. Admin Access Control**

Admin access is controlled within the application itself. Only existing admins can grant admin access to others. No self-service admin provisioning. Full audit trail of admin actions is maintained.

**4. Audit Trail**

Access grants are logged. Approval and rejection decisions are logged. Admin actions are logged. Failed access attempts are logged. Audit logs correctly record who performed actions (remediated finding 1.5).

---

## 🛡️ Data Protection

**1. Data Stored**

The application stores metadata only: agent names, descriptions, categories, star ratings, and approval workflow status. No PII is stored. No customer data is stored. No confidential business data is stored. Data classification is Internal or Low sensitivity.

**2. Agent Content Location**

The actual AI agent content resides in the Conver database, which is already approved and in production. The Agent Library does not store or replicate agent content — it manages metadata and the sharing workflow.

**3. Data Residency**

No data residency concerns — internal metadata only. Azure Cosmos DB provides automatic backups and built-in redundancy. Data is stored within Azure-managed infrastructure.

**4. Logging and Sensitive Data**

Sensitive data (passwords, tokens) is explicitly excluded from logs. User input in logs (finding 2.4) is limited to search terms and IDs for debugging — no credentials or PII. Log access is restricted to authorised Datacom staff.

---

## 📋 Compliance Checklist

**1. Penetration Testing**

✅ Completed. Internal black-box testing of all API endpoints. All HIGH severity findings remediated.

**2. Static Code Analysis**

✅ Completed. Snyk and Aikido scans performed. OWASP Top 10 verification checked.

**3. HIGH Severity Findings**

✅ All 4 fixed (100 percent). None proposed for risk acceptance.

**4. External Users**

❌ None. Internal Datacom staff only.

**5. PII Stored**

❌ None.

**6. Sensitive Data**

❌ None. Metadata only.

**7. Authentication**

✅ Microsoft Entra ID SSO. No separate user accounts.

**8. Audit Logging**

✅ Access grants, approval decisions, admin actions, and failed attempts all logged.

**9. Governance Workflow**

✅ No agent shared without review. Departmental vetting for business-function agents.

**10. Operational Readiness**

✅ Azure-managed patching, backups, and disaster recovery. Application Insights and alerting to be configured pre-go-live.

---

## 📋 WAF Assessment

**1. Cloudflare WAF Status**

Cloudflare WAF is to be configured post-approval. The development team will configure it in Week 1 following CISO sign-off. This will add DDoS protection and attack mitigation as an additional layer beyond Azure.

**2. Current Protection**

Until Cloudflare is configured, the application relies on Azure infrastructure protections. Azure Static Web Apps, Azure Functions, and Azure Cosmos DB provide built-in security controls. All endpoints require Entra ID authentication regardless of WAF status.

**3. API Path Exposure**

Finding 1.7 notes that API paths may appear in error messages. Cloudflare WAF will add another protection layer post go-live. The risk is assessed as low — knowing URLs does not grant access without authentication.

**4. Post-Approval Configuration**

WAF configuration is explicitly listed in post-approval actions. Timeline: Week 1. Owner: Development Team.

---

## 📋 Penetration Test Results

**1. Testing Scope**

Penetration testing was performed internally by Gary. Scope: black-box testing of all API endpoints. Static code analysis was performed by Snyk (full codebase scan) and Aikido (security-focused review). OWASP Top 10 verification was checked against common vulnerabilities.

**2. Results Summary**

- **HIGH:** 4 found, 4 fixed (100 percent), 0 for risk acceptance.
- **MEDIUM:** 5 found, 1 fixed, 4 for risk acceptance.
- **LOW:** 9 found, 3 fixed, 6 for risk acceptance.
- **Total:** 18 found, 8 fixed, 10 for risk acceptance (6 proposed for acceptance in this request).

**3. Remediated Findings**

- 1.1 HIGH: Unauthorised Agent Self-Approval — Users can no longer approve their own submissions.
- 1.2 HIGH: Unauthorised Access to Agent Details — Users can no longer view agents they do not have access to.
- 2.1 HIGH: ReDoS Attack — Agents Search — Search input is now sanitised to prevent regex-based attacks.
- 2.2 HIGH: ReDoS Attack — Prompts Search — Search input is now sanitised to prevent regex-based attacks.
- 1.4 MEDIUM: Filename Enumeration — Users can no longer enumerate other users' files.
- 1.5 LOW: Incorrect Audit Logging — Audit logs now correctly record who performed actions.
- 1.6 LOW: Rating Private Resources — Users can no longer rate agents they do not have access to.
- 1.8 LOW: Publicly Accessible API Docs — Swagger documentation now requires authentication.

**4. Exploitation Attempts**

Penetration testers attempted to exploit input type checking gaps (finding 2.5) and could not demonstrate exploitation. This supports the risk acceptance recommendation for that finding.

---

## 📋 Risk Register

**1. Finding 1.3 — Star Ratings Visible in API Data**

- Severity: MEDIUM.
- Issue: Individual ratings visible in raw API response (e.g., "John Smith gave 4 stars").
- Real-world risk: Minimal — not sensitive data, only for agents user has access to.
- Recommendation: Accept.

**2. Finding 1.7 — API Paths in Error Messages**

- Severity: LOW.
- Issue: Wrong URLs return error messages listing valid API paths.
- Real-world risk: None — authentication still required.
- Recommendation: Accept.

**3. Finding 2.3 — Code Allows HTTP (False Positive)**

- Severity: MEDIUM.
- Issue: Static analysis flagged possible unencrypted HTTP.
- Real-world risk: None — Azure forces HTTPS.
- Recommendation: Accept (false positive).

**4. Finding 2.4 — User Input in Internal Logs**

- Severity: MEDIUM.
- Issue: User-provided data (search terms, IDs) in error logs.
- Real-world risk: None — logs not user-accessible.
- Recommendation: Accept.

**5. Finding 2.5 — Input Type Checking Gaps**

- Severity: LOW.
- Issue: Some code assumes input type before explicit checking.
- Real-world risk: None — not exploitable per pen test.
- Recommendation: Accept.

**6. Finding 3.1 — Vulnerable Documentation Package**

- Severity: MEDIUM.
- Issue: `inflight` package has known vulnerability; no fix available.
- Real-world risk: Very low — no fix available, limited use, Azure limits impact.
- Recommendation: Accept.

---

## 📋 Approval Criteria

**1. Production Deployment Decision**

CISO must indicate: Production Deployment Approved — Yes or No. Conditions (if any) may be specified.

**2. Risk Acceptance Decision**

For each of the 6 findings, CISO must indicate Accept Risk — Yes or No:

- 1.3 Star ratings visible in API data (MEDIUM)
- 1.7 API paths in error messages (LOW)
- 2.3 Code allows HTTP — false positive (MEDIUM)
- 2.4 User input in internal logs (MEDIUM)
- 2.5 Input type checking gaps (LOW)
- 3.1 Vulnerable documentation package (MEDIUM)

**3. Approval Section**

Approver: CISO. Name, Signature, and Date to be completed upon sign-off.

**4. Key Points for Approval**

- All 4 HIGH severity findings were fixed — none proposed for acceptance.
- No sensitive data (PII, credentials, business data) is exposed by any of the 6 issues.
- All require authentication — an external attacker cannot exploit any of them.
- Penetration testers could not demonstrate exploitation of the code quality findings.
- Internal-only application — no external or public user access.

---

## 📋 Technology Stack

**1. Client and Admin Applications**

- Component: Client App. Technology: React. Hosting: Azure Static Web Apps. Security notes: No server to patch.
- Component: Admin App. Technology: React. Hosting: Azure Static Web Apps. Security notes: No server to patch.

**2. Backend and Data**

- Component: Backend API. Technology: Node.js. Hosting: Azure Functions (Serverless). Security notes: Azure-managed, auto-patching.
- Component: Database. Technology: MongoDB API. Hosting: Azure Cosmos DB. Security notes: Azure-managed, private endpoints.
- Component: File Storage. Technology: Blob Storage. Hosting: Azure Storage Account. Security notes: Access controlled.

**3. Security and Delivery**

- Component: Secrets. Technology: Azure Key Vault. Security notes: No secrets in code.
- Component: CDN and WAF. Technology: Cloudflare. Hosting: To be configured post-approval. Security notes: Additional protection layer.

**4. Environment Details**

- Azure Subscription: Conver.
- Production URLs: TBC post-approval (will be behind Cloudflare).
- Monitoring: Application Insights (to be configured pre-go-live).
- Deployment: Automated via GitHub Actions CI/CD.

---

## 📋 Governance and Content Approval Workflow

**1. Stage 1 — Creation**

User creates an AI agent in Conver for their own use.

**2. Stage 2 — Share Request**

User submits request via Agent Library to share with individuals or all of Datacom.

**3. Stage 3 — Duplication**

System creates a duplicate — user keeps their original.

**4. Stage 4 — Admin Review**

Agent Library admin reviews the submission.

**5. Stage 5 — Departmental Vetting**

If the agent relates to a business function (e.g., Datacom Voice, legal advice, HR policies), it is referred to that department for approval.

**6. Stage 6 — Decision**

Admin approves (published to directory) or rejects (feedback sent to user).

**7. Stage 7 — Ongoing Management**

Admins can disable or remove agents at any time if issues arise.

**8. Why This Matters**

- Brand protection: Agents claiming to represent Datacom functions are vetted by the relevant team.
- Quality control: Low-quality or inappropriate agents are filtered out.
- Accountability: Full audit trail of who approved what and when.
- Reversibility: Admins can remove problematic agents post-publication.

---

## 📋 Operational Readiness

**1. Support Model**

No handover required. Fully managed Azure PaaS services.

**2. Patching**

Azure-managed. No VMs or OS patching required.

**3. Monitoring**

Application Insights. To be configured pre-go-live.

**4. Alerting**

To be configured alongside Application Insights.

**5. Backup**

Azure-managed. Cosmos DB automatic backups.

**6. Disaster Recovery**

Azure-managed. Cosmos DB built-in redundancy.

---

## 📋 Post-Approval Actions

**1. Week 1 — Provision and Configure**

- Provision production Azure resources. Owner: Development Team.
- Configure Cloudflare WAF. Owner: Development Team.
- Configure Application Insights monitoring. Owner: Development Team.
- Configure alerting. Owner: Development Team.

**2. Week 2 — Verify and Deploy**

- Final security verification. Owner: Development Team.
- Production deployment. Owner: Development Team.

---

## 📋 Key Security Design Decisions

**1. Azure Well-Architected Framework**

Architecture follows Microsoft's security, reliability, and operational excellence principles.

**2. Serverless and PaaS Only**

No VMs or OS patching required. Azure manages infrastructure security.

**3. Private Endpoints for Databases**

Database traffic stays within Azure network.

**4. Azure Key Vault for Secrets**

No credentials stored in code or config files.

**5. Cloudflare WAF**

Additional DDoS and attack protection (post go-live).

**6. Entra ID Authentication**

No separate user accounts — uses existing Datacom identity.

**7. Multi-VNet with Secure Peering**

Network isolation and controlled traffic flow.

---

## 📋 Detailed Risk Acceptance Rationale

**1. Finding 1.3 — Star Ratings (MEDIUM)**

Users can give agents a 1–5 star rating. The UI shows the average (e.g., "4.2 stars from 15 reviews"). If someone inspects the raw API response using browser developer tools, they can see individual ratings. The UI does not display this. This is just star ratings — not sensitive information. Users can only see ratings for agents they already have access to. Entra ID login required. The detailed data is needed for the rating system to work correctly. Real-world impact: minimal.

**2. Finding 1.7 — API Paths (LOW)**

If someone types a wrong URL (e.g., /api/blah), the error message lists valid API paths like /api/agents, /api/prompts. All endpoints require Entra ID login — knowing the URL does not grant access. This is standard behaviour for REST APIs. Cloudflare WAF will add another protection layer post go-live. Real-world impact: none. It is like knowing the address of a locked building — you still cannot get in without a key.

**3. Finding 2.3 — HTTP (MEDIUM, False Positive)**

The static analysis tool flagged that the code could accept unencrypted HTTP requests. Azure infrastructure forces all traffic to HTTPS — this setting is enabled. Any HTTP request is automatically redirected to HTTPS before reaching our code. TLS 1.2+ is enforced at the infrastructure level. This is a false positive — the tool cannot see the Azure configuration. Real-world impact: none.

**4. Finding 2.4 — User Input in Logs (MEDIUM)**

When errors occur, the system logs information including some user-provided data (e.g., search terms, IDs) for debugging. Logs are stored in Azure Application Insights — not visible to end users. Only authorised Datacom staff can access logs. Sensitive data (passwords, tokens) is explicitly excluded from logs. There is no code execution risk — this is not like SQL injection. This is standard practice for application monitoring. Real-world impact: none.

**5. Finding 2.5 — Input Type Checking (LOW)**

In some places, the code assumes input is a certain type (e.g., a number) before explicitly checking it. All critical inputs (emails, IDs, ratings) are explicitly validated. The penetration testers attempted to exploit this and could not. Azure Functions and the database provide additional safety layers. Fixing every instance would require significant refactoring for minimal benefit. Real-world impact: none demonstrated.

**6. Finding 3.1 — Vulnerable Package (MEDIUM)**

A small package called `inflight` (used by the API documentation tool) has a known vulnerability that could theoretically cause resource exhaustion. No fix exists — the package is abandoned and no patched version is available. It is only used for generating developer documentation (Swagger) — not core functionality. Only authenticated internal developers access the documentation. Azure Functions has automatic timeouts and auto-scaling that prevent resource exhaustion. Replacing the package would require significant rework for minimal security benefit. Real-world impact: very low.

---

## 📋 OWASP Top 10 Verification

**1. A01:2021 — Broken Access Control**

Verified. Unauthorised agent self-approval (1.1) and unauthorised access to agent details (1.2) were identified and remediated. Users can no longer approve their own submissions or view agents they do not have access to. Filename enumeration (1.4) was also fixed.

**2. A02:2021 — Cryptographic Failures**

Verified. Azure infrastructure forces HTTPS; TLS 1.2+ enforced. Finding 2.3 (HTTP) is a false positive — no unencrypted traffic is possible. Secrets stored in Azure Key Vault, not in code.

**3. A03:2021 — Injection**

Verified. ReDoS vulnerabilities in agents search (2.1) and prompts search (2.2) were identified and remediated. Search input is now sanitised. No SQL injection risk — Cosmos DB API used with parameterised queries.

**4. A04:2021 — Insecure Design**

Verified. Architecture follows Azure Well-Architected Framework. Multi-stage approval workflow prevents unauthorised sharing. Departmental vetting for business-function agents. No agent shared without review.

**5. A05:2021 — Security Misconfiguration**

Verified. Swagger documentation (1.8) now requires authentication. API paths in error messages (1.7) assessed as low risk — auth still required. Cloudflare WAF to be configured post-approval.

**6. A06:2021 — Vulnerable and Outdated Components**

Partially addressed. Finding 3.1 (`inflight` package) has no fix available; package abandoned. Used only for Swagger docs, not core functionality. Azure auto-scaling limits impact. Proposed for risk acceptance.

**7. A07:2021 — Identification and Authentication Failures**

Verified. Microsoft Entra ID SSO only. No separate user accounts. JWT validated on every API call. Failed access attempts logged. No credential storage in application.

**8. A08:2021 — Software and Data Integrity Failures**

Verified. Deployment via GitHub Actions CI/CD. No unsigned or untrusted dependencies in critical path. `inflight` is in documentation tooling only.

**9. A09:2021 — Security Logging and Monitoring Failures**

Addressed. Audit logs for access grants, approvals, admin actions, failed attempts. Finding 1.5 (incorrect audit logging) remediated. Application Insights to be configured pre-go-live. Alerting to be configured.

**10. A10:2021 — Server-Side Request Forgery (SSRF)**

Verified. Application does not make outbound requests to user-supplied URLs. No SSRF vector identified in testing.

---

## 📋 Security Testing Methodology

**1. Penetration Testing Approach**

Black-box testing was performed internally by Gary. Scope included all API endpoints exposed by the application. Testers attempted to bypass authentication, escalate privileges, access unauthorised resources, and exploit input validation gaps. No white-box or grey-box testing was performed.

**2. Static Code Analysis Tools**

Snyk was used for full codebase dependency and vulnerability scanning. Aikido was used for security-focused code review. Both tools identified findings that were cross-referenced with penetration test results. OWASP Top 10 was used as a verification checklist.

**3. Test Environment**

Testing was performed against a staging or pre-production environment that mirrored the production architecture. Azure resources, Entra ID integration, and database connectivity were configured to match production design.

**4. Remediation Verification**

All remediated findings were re-tested to confirm fixes. Penetration testers attempted to re-exploit fixed vulnerabilities and confirmed they were no longer exploitable. Static analysis was re-run after code changes.

**5. Residual Risk Assessment**

Each of the 6 findings proposed for acceptance was assessed for real-world exploitability, data exposure, authentication requirements, and business impact. All were determined to have low or minimal risk in the context of an internal-only application.

---

## 📋 Remediation Summary

**1. HIGH Severity — All Fixed**

- 1.1: Unauthorised Agent Self-Approval. Fix: Users can no longer approve their own submissions. Access control logic updated.
- 1.2: Unauthorised Access to Agent Details. Fix: Users can no longer view agents they do not have access to. Authorization checks added.
- 2.1: ReDoS Attack — Agents Search. Fix: Search input sanitised to prevent regex-based denial-of-service attacks.
- 2.2: ReDoS Attack — Prompts Search. Fix: Search input sanitised to prevent regex-based denial-of-service attacks.

**2. MEDIUM Severity — One Fixed**

- 1.4: Filename Enumeration. Fix: Users can no longer enumerate other users' files. Access controls tightened.

**3. LOW Severity — Three Fixed**

- 1.5: Incorrect Audit Logging. Fix: Audit logs now correctly record who performed actions. Logging logic corrected.
- 1.6: Rating Private Resources. Fix: Users can no longer rate agents they do not have access to. Authorization checks added.
- 1.8: Publicly Accessible API Docs. Fix: Swagger documentation now requires authentication. Access control applied.

**4. Total Remediation Count**

8 findings remediated (4 HIGH, 1 MEDIUM, 3 LOW). 6 findings proposed for risk acceptance (4 MEDIUM, 2 LOW). 4 findings were in the original 10 for acceptance but only 6 are proposed in this request — the discrepancy may reflect consolidation or reclassification during final review.

---

## 📋 API Security Controls

**1. Authentication**

Every API request must include a valid JWT token issued by Microsoft Entra ID. Tokens are validated on each request. Expired or invalid tokens result in 401 Unauthorized. No API endpoint is accessible without authentication.

**2. Authorization**

Role-based access control (User vs Admin) is enforced at the API layer. Users can only access agents they have been granted access to. Admins have elevated permissions for approval workflow and user management. Authorization checks occur after authentication.

**3. Input Validation**

Critical inputs (emails, IDs, ratings) are explicitly validated. Search inputs are sanitised to prevent ReDoS. Finding 2.5 (input type checking) identifies gaps in non-critical paths; pen testers could not exploit. Validation occurs before business logic execution.

**4. Rate Limiting**

Azure Functions and Azure Static Web Apps provide platform-level throttling. Cloudflare WAF (post go-live) will add additional rate limiting and DDoS protection. No application-level rate limiting documented.

**5. Error Handling**

Error messages do not expose stack traces or internal paths to end users in production. Finding 1.7 notes that invalid paths may return a list of valid API paths — assessed as low risk since auth is still required.

---

## 📋 Session and Token Management

**1. Token Issuance**

Tokens are issued by Microsoft Entra ID. The application does not manage token issuance or refresh — that is handled by the identity provider. No custom session store is maintained by the application.

**2. Token Validation**

JWT tokens are validated on every API call. Validation includes signature verification, expiration check, and audience/issuer validation. Invalid tokens are rejected immediately.

**3. Token Storage**

Client-side token storage is handled by the authentication library (e.g., MSAL). The application does not store tokens in localStorage or cookies beyond what the auth library requires. Server-side does not persist tokens.

**4. Session Timeout**

Session lifetime is controlled by Entra ID and Azure AD policies. The application does not implement its own session timeout. When the token expires, the user must re-authenticate.

---

## 📋 Third-Party Dependencies

**1. Core Dependencies**

The application uses standard Node.js and React dependencies. Backend runs on Azure Functions runtime. Database uses MongoDB API (Cosmos DB). No custom or obscure dependencies in the critical path.

**2. Vulnerable Package — inflight (Finding 3.1)**

The `inflight` package is a transitive dependency of the Swagger/OpenAPI documentation tooling. It has a known vulnerability (resource exhaustion). The package is abandoned — no maintainer, no patches available. It is not used in core application logic. Only authenticated internal developers access Swagger docs.

**3. Dependency Management**

Dependencies are managed via npm. Snyk and Aikido scans identify vulnerable packages. The `inflight` vulnerability cannot be fixed by upgrading — no fixed version exists. Replacing the documentation tool would require significant rework.

**4. Supply Chain**

Dependencies are sourced from the public npm registry. No private or internal packages in critical path. GitHub Actions CI/CD uses standard tooling. No evidence of supply chain compromise in testing.

---

## 📋 Incident Response Readiness

**1. Detection**

Application Insights will be configured pre-go-live for logging and monitoring. Alerting will be configured alongside. Failed authentication attempts are logged. Admin actions are audited. Detection capabilities will be in place before production traffic.

**2. Response**

No formal incident response runbook was documented in the source. The development team owns the application. Azure-managed services reduce operational burden. Escalation path would typically go through the Conver/Agent Library product owner.

**3. Recovery**

Azure Cosmos DB has automatic backups and built-in redundancy. No custom backup procedures required. Recovery would involve redeployment via GitHub Actions if needed. Data loss risk is low given metadata-only storage.

**4. Post-Incident**

Audit logs provide a trail for investigation. Admin actions, access grants, and approval decisions are all logged. Logs retained in Application Insights per Azure retention policies.

---

## 📋 Business Continuity

**1. High Availability**

Azure Functions and Cosmos DB are designed for high availability. Multi-region deployment options exist within Azure. No single point of failure in the application architecture.

**2. Disaster Recovery**

Cosmos DB provides automatic geo-redundancy options. Azure manages infrastructure-level DR. The application is internal-only — extended outage would impact productivity but not customer-facing services.

**3. Data Backup**

Cosmos DB automatic backups are Azure-managed. No custom backup scripts or procedures. Backup retention follows Azure defaults.

**4. Dependencies**

The Agent Library depends on Conver for agent content. Conver is already in production and approved. Agent Library stores only metadata — Conver outage would affect agent content access but not Agent Library metadata.

---

## 📋 Departmental Vetting Workflow

**1. Trigger**

When an agent submission relates to a specific business function (e.g., Datacom Voice, legal advice, HR policies, Comms), the Agent Library admin refers it to that department for approval before publishing.

**2. Referral Process**

The admin identifies the relevant department based on agent category, description, or intended use. The department is notified and asked to review the agent for accuracy, appropriateness, and brand alignment.

**3. Department Decision**

The department can approve, reject, or request changes. Their decision is communicated back to the Agent Library admin. The admin then proceeds with the final approval or rejection in the system.

**4. Audit**

The referral and department decision are part of the approval workflow. Full audit trail of who approved what and when is maintained. This protects Datacom brand and ensures agents representing business functions are vetted by the right team.

---

## 📋 Risk Scoring Methodology

**1. Severity Classification**

Findings were classified as HIGH, MEDIUM, or LOW based on exploitability, impact, and scope. HIGH findings could lead to unauthorised access, privilege escalation, or denial of service. MEDIUM and LOW have reduced impact or require specific conditions.

**2. Real-World Risk Assessment**

For each finding proposed for acceptance, the team assessed: Can an external attacker exploit this? (No — all require auth.) Is sensitive data exposed? (No.) Was exploitation demonstrated in pen testing? (No for 2.5.) What is the business impact? (Minimal or none.)

**3. Context Factors**

Internal-only application significantly reduces attack surface. No PII or sensitive data reduces impact of any breach. Entra ID authentication means no anonymous access. Azure infrastructure adds defence in depth.

**4. Acceptance Criteria**

A finding is proposed for acceptance when: remediation is impractical (e.g., no fix exists), cost of fix outweighs risk, or real-world risk is negligible in context. All 6 findings meet these criteria.

---

## 📋 Approval Decision Matrix

**1. Production Deployment**

CISO indicates Yes or No. If Yes, deployment proceeds per post-approval timeline. If No, reasons and conditions should be documented. Conditions (if any) can be specified in the approval section.

**2. Risk Acceptance — Per Finding**

For each of the 6 findings, CISO indicates Accept Risk — Yes or No. If any finding is rejected, remediation or alternative mitigation must be planned before deployment. The team has documented that remediation is impractical for some (e.g., 3.1) or unnecessary for others (e.g., 2.3 false positive).

**3. Conditional Approval**

CISO may approve with conditions — e.g., WAF must be configured before go-live, or monitoring must be in place. Such conditions would be documented in the Conditions field and would need to be satisfied before deployment.

**4. Rejection**

If deployment is rejected, the team would need to address concerns and resubmit. If specific risk acceptances are rejected, the team would need to remediate those findings or provide additional justification.

---

## 📋 Sign-Off Checklist

**1. CISO Review**

- Reviewed Executive Summary and Security Summary.
- Reviewed Architecture Summary and Technology Stack.
- Reviewed Data Handling and Access Control.
- Reviewed Governance and Content Approval Workflow.
- Reviewed Security Testing Performed and Results.
- Reviewed Remediated Findings (Section 7).
- Reviewed Findings Proposed for Risk Acceptance (Section 8).
- Reviewed Risk Acceptance Summary.
- Reviewed Operational Readiness and Post-Approval Actions.

**2. Risk Acceptance**

- Decision recorded for Finding 1.3 (Star ratings).
- Decision recorded for Finding 1.7 (API paths).
- Decision recorded for Finding 2.3 (HTTP false positive).
- Decision recorded for Finding 2.4 (User input in logs).
- Decision recorded for Finding 2.5 (Input type checking).
- Decision recorded for Finding 3.1 (Vulnerable package).

**3. Production Deployment**

- Production Deployment Approved — Yes or No.
- Conditions (if any) documented.

**4. Approval**

- Approver: CISO.
- Name completed.
- Signature completed.
- Date completed.

---

## 📋 Data Flow Summary

**1. User to Application**

User accesses the Agent Library via browser. Request goes to Azure Static Web Apps (client) or directly to Azure Functions (API). All traffic will be routed through Cloudflare post go-live. User must authenticate via Entra ID before any data is returned.

**2. Application to Conver**

The Agent Library does not store agent content. Agent content resides in the Conver database. When a user views an agent, the application may fetch metadata from its own database and display information; the actual agent prompts and configuration live in Conver. The Agent Library manages the sharing workflow and directory, not the agent content itself.

**3. Application to Database**

Azure Functions connect to Cosmos DB via private endpoints. Database traffic stays within the Azure network. No database credentials in code — Azure Key Vault and managed identity are used. Queries are parameterised; no raw user input concatenated into queries.

**4. Application to Storage**

File storage (e.g., agent icons or attachments if applicable) uses Azure Blob Storage. Access is controlled via Azure RBAC and application-level checks. Blob URLs are not publicly enumerable.

**5. Logging Flow**

Application logs (including errors with limited user context) flow to Azure Application Insights. Logs are not exposed to end users. Only authorised Datacom staff can access Application Insights. Sensitive data is excluded from log payloads.

---

## 📋 Application Security Controls

**1. Authentication Layer**

All routes require valid Entra ID authentication. Unauthenticated requests receive 401. The client uses MSAL or equivalent to obtain tokens. Tokens are sent in Authorization header. No fallback to weaker auth (e.g., API keys) for user-facing features.

**2. Authorization Layer**

After authentication, authorization checks enforce role (User vs Admin) and resource access (user can only see agents they have access to). Admin-only endpoints reject non-admin users. Agent-level access is checked before returning agent details.

**3. Input Validation Layer**

All user-supplied input is validated before processing. Emails, IDs, and ratings have explicit validation. Search inputs are sanitised to prevent ReDoS. Type checking exists for critical paths; finding 2.5 identifies gaps in non-critical paths.

**4. Output Encoding**

No evidence of XSS in the source — React's default escaping helps. API responses are JSON. No user-controlled data reflected without encoding in documented flows.

**5. Error Handling**

Errors do not expose stack traces or internal paths in production. Generic error messages to users. Detailed errors logged server-side for debugging. Finding 1.7 (API paths in errors) is an edge case for invalid paths.

---

## 📋 Infrastructure Security Controls

**1. Azure Subscription**

Application runs in the Conver Azure subscription. Subscription-level policies apply. Resource groups and naming follow organisational standards.

**2. Network**

Private endpoints for Cosmos DB keep database traffic off the public internet. Multi-VNet with secure peering provides network isolation. No VMs — serverless and PaaS reduce network attack surface.

**3. Identity**

Azure Managed Identity used where possible for service-to-service auth. No long-lived credentials in config. Entra ID for user authentication. Admin access to Azure resources follows Datacom policies.

**4. Encryption**

Data at rest: Cosmos DB and Blob Storage use Azure-managed encryption. Data in transit: TLS 1.2+ enforced. No custom crypto — Azure handles it.

**5. Patching**

Azure-managed services receive automatic security patches. No OS or VM patching required. Application dependencies (npm) are scanned by Snyk and Aikido; known vulnerabilities are tracked.

---

## 📋 Compliance and Regulatory Considerations

**1. Data Classification**

Application data is classified as Internal or Low sensitivity. No PII, no customer data, no confidential business data. Metadata only. No special regulatory requirements (e.g., HIPAA, PCI-DSS) apply to this data.

**2. Data Residency**

No specific data residency requirements documented for this application. Data stored in Azure — region would follow Conver subscription. Internal metadata only — no cross-border data transfer concerns for typical use.

**3. Audit and Accountability**

Full audit trail of admin actions, access grants, and approval decisions. Supports accountability and potential future compliance audits. Logs retained per Azure and organisational policies.

**4. Third-Party and Vendor**

Conver is an existing approved platform. Agent Library extends it. No new third-party vendors for core functionality. Cloudflare is used for WAF/CDN — standard enterprise tool.

---

## 📋 Executive Summary — What You Are Being Asked to Approve

**1. Production Deployment**

Approve the production deployment of the Datacom Agent Library application. Target go-live: early January 2026. The application is internal-only, extends the approved Conver platform, and stores no sensitive data.

**2. Risk Acceptance — Six Findings**

Accept the 6 residual security findings detailed in Section 8 and the Risk Register. All are MEDIUM or LOW severity. None involve external access, PII exposure, or demonstrated exploitability. Each has documented rationale. The findings are: star ratings in API data (1.3), API paths in errors (1.7), HTTP false positive (2.3), user input in logs (2.4), input type checking gaps (2.5), vulnerable documentation package (3.1).

**3. Security Posture**

All 4 HIGH severity findings have been remediated. Penetration testing and static code analysis are complete. The application follows Azure Well-Architected Framework principles. Entra ID authentication, private endpoints, Key Vault for secrets, and a governed approval workflow are in place.

**4. Post-Approval Commitment**

The team will provision production resources, configure Cloudflare WAF, configure Application Insights and alerting, perform final security verification, and deploy within two weeks of approval. Supporting documentation (Security Remediation Report, Technical Documentation) will be retained.

---

## 📋 Security Summary Table

**1. Penetration Testing**

✅ Completed. Internal black-box testing of all API endpoints. All HIGH severity findings remediated. Pen testers could not exploit remaining code quality findings.

**2. Static Code Analysis**

✅ Completed. Snyk (full codebase) and Aikido (security-focused) scans. OWASP Top 10 verification performed. 18 total findings; 8 remediated, 6 proposed for acceptance.

**3. HIGH Severity Findings**

✅ All 4 fixed (100 percent). Unauthorised self-approval, unauthorised access, two ReDoS vectors. None proposed for risk acceptance.

**4. Findings for Risk Acceptance**

6 total. 4 MEDIUM (1.3, 2.3, 2.4, 3.1), 2 LOW (1.7, 2.5). All have documented rationale. No sensitive data exposure. All require authentication.

**5. External Users**

❌ None. Internal Datacom staff only. No public or anonymous access.

**6. PII Stored**

❌ None. Application stores metadata only — agent names, descriptions, categories, ratings, workflow status.

**7. Sensitive Data**

❌ None. No customer data, no confidential business data. Agent content lives in Conver (already approved).

---

## 📋 Deployment Pipeline

**1. Source Control**

Code resides in GitHub. Branching and pull request workflow. No direct commits to production branch without review.

**2. CI/CD**

Deployment automated via GitHub Actions. Build, test, and deploy pipeline. No manual deployment steps for standard releases.

**3. Environments**

Staging or pre-production environment used for testing. Production environment provisioned post-approval. Environment parity maintained where possible.

**4. Secrets Management**

Secrets in Azure Key Vault. No secrets in code or config files. CI/CD retrieves secrets at deploy time. Managed identity used for Azure resource access.

---

## 📋 Summary of Key Security Design Decisions

**1. Azure Well-Architected Framework**

Architecture follows Microsoft's security, reliability, and operational excellence principles. Cost optimisation and performance efficiency also considered.

**2. Serverless and PaaS Only**

No VMs or OS patching required. Azure manages infrastructure security. Reduces operational burden and human error in patching.

**3. Private Endpoints for Databases**

Database traffic stays within Azure network. No database exposure to public internet. Reduces attack surface for data exfiltration.

**4. Azure Key Vault for Secrets**

No credentials stored in code or config files. Eliminates risk of credential leakage via source control or misconfiguration.

**5. Cloudflare WAF (Post Go-Live)**

Additional DDoS and attack protection. Defence in depth beyond Azure-native controls. Configured in Week 1 post-approval.

**6. Entra ID Authentication**

No separate user accounts. Uses existing Datacom identity. Single sign-on. Reduces credential sprawl and password-related risks.

**7. Multi-VNet with Secure Peering**

Network isolation and controlled traffic flow. Segments resources. Limits lateral movement in case of compromise.

---

## 📋 Attachments and Document Control

**1. Attachments**

- Security Remediation Report — Full technical details of all 18 findings and remediations.
- Agent Library Technical Documentation — Complete architecture and design documentation.

**2. Document Control**

- Version 1.0. Date: 9 December 2024. Author: Dipesh Trikam. Changes: Initial version for CISO approval.
- Last Updated: 9 December 2025 by Jason Moss.

**3. Confluence Metadata**

- Space: Insights and Analytics.
- Path: Insights and Analytics → AI Projects → Active → Agent Library → Agent Library - CISO Approval Request.
- Confluence URL: https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40516616397.

---

📌 **Document Type:** Security Assessment / CISO Approval Request
📅 **Last Updated:** 9 December 2025
🔗 **Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40516616397
