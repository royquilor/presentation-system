# Agent Library — CISO Approval Request

> A formal security assessment and production deployment approval request for the Datacom Agent Library, seeking CISO sign-off on 6 residual findings after full remediation of all HIGH severity vulnerabilities.

**Author:** [Jason Moss](https://datacomgroup.atlassian.net/wiki/people/712020:e3b93f18-af43-46e7-b6ad-c3dbd3ef3f4e)
**Date:** 9 December 2025
**Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40516616397

---

## 🎯 Context

The Agent Library is an internal-only Datacom web application that extends the existing Conver AI chat platform (already in production). It allows staff to share AI agents through a governed approval workflow, providing a searchable directory of vetted agents across the organisation. The request was prepared by Jason Moss and Dipesh Trikam with a target go-live of early January 2026.

---

## 🔍 Problem

AI agents created by staff in Conver are siloed to individuals, preventing colleagues from discovering and benefiting from useful productivity tools. A new sharing layer is needed, but it must pass security assessment before being permitted into production. Six residual security findings require formal CISO risk acceptance before deployment can proceed.

---

## 📋 Observations

- **All 4 HIGH severity findings have been remediated** — including self-approval bypass, unauthorised agent access, and two ReDoS vulnerabilities in search inputs.
- The application stores **no PII, no customer data, and no sensitive business data** — only internal metadata (names, descriptions, ratings, workflow status).
- Authentication is exclusively via **Microsoft Entra ID SSO**; no separate user accounts exist and every API call validates a JWT token.
- The entire stack runs on **managed Azure PaaS/serverless services** (Functions, Cosmos DB, Static Web Apps), eliminating VM/OS patching responsibilities.
- **6 residual findings** (4 MEDIUM, 2 LOW) are proposed for risk acceptance — none involve external access, PII exposure, or demonstrated exploitability in pen testing.
- Penetration testing (black-box) and static analysis (Snyk, Aikido) were both completed internally; pen testers could not exploit the remaining findings.
- The `inflight` npm package (finding 3.1, MEDIUM) has a known vulnerability with **no available fix** — it is only used by developer-facing Swagger docs.

---

## 💡 Proposal

The team requests CISO approval to deploy the Agent Library to production and formally accept the 6 residual findings. Each accepted finding has been assessed as low real-world risk due to the internal-only audience, mandatory Entra ID authentication, and Azure infrastructure controls. Post-approval actions include configuring Cloudflare WAF, Application Insights monitoring, and alerting within two weeks of sign-off.

---

## ⚠️ Risks

- **Vulnerable documentation package (inflight)** — no patch available; exploitable only by authenticated internal users and mitigated by Azure auto-scaling timeouts.
- **Individual star ratings visible in raw API responses** — not displayed in UI but accessible via browser developer tools to authenticated users.
- **User-supplied input logged to Application Insights** — log access is restricted to authorised Datacom staff; no sensitive data (passwords, tokens) is included.
- **Cloudflare WAF not yet configured** — additional DDoS and attack protection is deferred to post-approval; the application relies solely on Azure infrastructure protections until go-live.
- **Application Insights alerting not yet configured** — monitoring gaps exist between approval and go-live, creating a brief window of reduced operational visibility.

---

## ✅ Next Steps

- **CISO to review and sign off** on the 6 risk acceptance items and production deployment decision.
- Provision production Azure resources and configure Cloudflare WAF (Week 1 post-approval).
- Configure Application Insights monitoring and alerting (Week 1 post-approval).
- Complete final security verification and perform production deployment (Week 2 post-approval).
- Attach and retain the Security Remediation Report and Technical Documentation as supporting evidence.

---

## 🔑 Close

All critical (HIGH) security findings have been fixed, no sensitive data is at risk, and the 6 residual findings are low real-world impact — this approval request represents a well-prepared, security-conscious push to production for an internal-only tool.

---

📌 **Document Type:** Security Assessment / CISO Approval Request
📅 **Last Updated:** 9 December 2025
🔗 **Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40516616397
