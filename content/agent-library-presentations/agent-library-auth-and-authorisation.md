# Authentication and Authorisation

> A security configuration reference covering Azure AD integration, JWT validation, RBAC implementation, MSAL.js setup, and security best practices for the Datacom Agent Library.

**Author:** [Dipesh Trikam](https://datacomgroup.atlassian.net/wiki/people/712020:06f04ec7-5f4c-4e03-a2a3-3e46b413e073)
**Date:** 13 September 2025
**Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40061698297

---

## 🎯 Context

The Datacom Agent Library uses **Azure Active Directory (Azure AD)** as its identity provider, delivering enterprise SSO across the client and admin applications. The system achieved a **9/10 Security pillar score** under the Azure Well-Architected Framework — the highest-scoring pillar. This document is intended for developers implementing or maintaining authentication and authorisation logic, and covers both frontend (MSAL.js) and backend (JWT middleware) concerns.

---

## 🔍 Problem

An enterprise AI platform handling personal user data, approval workflows, and role-sensitive administrative functions requires robust, auditable authentication and fine-grained authorisation. Without a well-defined security model, the risk of privilege escalation, token misuse, or unauthorised content modification is significant. The system needed a consistent auth pattern across two separate frontend apps and a shared serverless API.

---

## 📋 Observations

- Authentication uses the **OAuth 2.0 authorisation code flow** via MSAL.js, exchanging an authorisation code for an access token (1-hour lifetime, memory-only) and a refresh token (14-day lifetime, secure storage)
- JWT tokens use **RS256** signing; the API fetches public keys from the Azure AD JWKS endpoint and validates `aud`, `iss`, and `kid` on every request
- Three roles are defined: `user` (personal content + public read), `admin` (full access), and `moderator` (approval and public content management)
- Authorisation uses two middleware functions: `requireRole(roles[])` for endpoint-level access, and `requireOwnership(resourceType)` for resource-level access (admins bypass ownership checks)
- Access tokens are stored in `sessionStorage` (not `localStorage`) per documented best practice; PII-containing log messages are explicitly suppressed in the MSAL logger config
- A `BYPASS_JWT_VALIDATION=true` flag exists for local development — bypasses auth and injects a mock admin user; must never be enabled in production
- Azure AD app registration requires `User.Read`, `User.ReadBasic.All` (Microsoft Graph), and `access_as_user` (custom API scope) permissions
- Authentication events (login success/failure, token refresh, logout) are logged with timestamp, userId, email, IP, and user agent for audit purposes

---

## 💡 Proposal

The security model is implemented as two reusable middleware modules (`auth.js` for JWT validation, `authorization.js` for RBAC), applied consistently to every Azure Functions route. The frontend uses a `useAuth` custom hook and a `ProtectedRoute` component to enforce authentication and role checks declaratively at the React router level. Secrets (client secret, CosmosDB key, MongoDB URI) are stored in Azure Key Vault and referenced via Key Vault references in Function App settings — never hardcoded or in environment files.

---

## ⚠️ Risks

- The `BYPASS_JWT_VALIDATION` development flag, if accidentally enabled in a staging or production deployment, would expose all endpoints without authentication
- Access token lifetime (1 hour) requires a robust silent token refresh path — failure to handle `InteractionRequiredAuthError` will result in users being silently logged out
- CORS configuration must be explicitly maintained as new deployment URLs are added; a misconfigured allowlist could block legitimate clients or open the API to unintended origins
- Client secret expiry is not tracked in this document; an unmonitored secret expiry would cause 100% authentication failure in production

---

## ✅ Next Steps

- Configure Azure Key Vault secret expiry alerts to avoid undetected client secret expiration
- Audit all deployment environments to confirm `BYPASS_JWT_VALIDATION` is `false` in non-local configurations
- Implement automated tests for authentication failure cases (missing token, expired token, wrong role) using the documented Postman and cURL patterns
- Review token refresh handling in `useAuth` hook to ensure `InteractionRequiredAuthError` triggers a graceful re-login prompt rather than a silent failure

---

## 🔑 Close

The authentication and authorisation system achieves enterprise-grade security (9/10 WAF score) through a combination of **Azure AD JWT validation, role-based and ownership-based middleware, and Key Vault secret management** — but the `BYPASS_JWT_VALIDATION` flag must be rigorously guarded against accidental production exposure.

---

📌 **Document Type:** Security Configuration Reference
📅 **Last Updated:** 13 September 2025
🔗 **Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40061698297
