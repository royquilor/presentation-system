# Security Remediation Report — Agent Library API

> A post-penetration-test remediation report documenting 18 security findings from the Datacom Agent Library API, with detailed fix status, code changes, and risk acceptance rationale for each finding.

**Author:** [Dipesh Trikam](https://datacomgroup.atlassian.net/wiki/people/712020:06f04ec7-5f4c-4e03-a2a3-3e46b413e073)
**Date:** 14 November 2025
**Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40398848336

---

## 🎯 Context

The Datacom Agent Library API underwent formal penetration testing and static code analysis between October and November 2025, commissioned by the Datacom EASA team. The testing was conducted against the live API and identified 18 findings ranging from HIGH to LOW severity. This report, authored by Dipesh Trikam, documents all findings, the remediation actions taken, and where risks were accepted rather than fixed.

---

## 🔍 Problem

Prior to this assessment, the API had several access control gaps that allowed authenticated but unauthorised users to exploit the approval workflow, enumerate other users' files, and view agent details outside their permission scope. Additionally, audit logging used user-supplied values rather than server-derived identity, creating a falsifiable audit trail. These issues needed structured remediation before production go-live.

---

## 📋 Observations

- **18 total findings**: 8 remediated (44%), 10 accepted risk (56%); all 4 critical/HIGH severity issues were fully fixed.
- **Finding 1.1 (HIGH — Fixed):** Users could self-approve agents by bypassing the approval workflow; resolved by adding `requireAdminAccess()` checks in `api/approval/index.js` — non-admins now receive HTTP 403.
- **Finding 1.2 (HIGH — Fixed):** `GET /api/approval/agents` exposed all agent details to regular users; resolved by enforcing admin-only access at the endpoint level.
- **Finding 1.4 (MEDIUM — Fixed):** File enumeration vulnerability in `GET /api/files/user/{email}` allowed users to list any user's files; resolved by verifying the authenticated user's email from the JWT against the requested email, with an admin bypass.
- **Finding 1.5 (LOW — Fixed):** Approval/rejection audit logs recorded user-supplied `approvedBy`/`rejectedBy` values; resolved by deriving the actioner exclusively from the validated JWT in both `api/approvals/index.js` and `api/public-prompts/index.js`.
- **Finding 1.3 (MEDIUM — Accepted Risk):** Detailed `userRatings` object is exposed in API responses; accepted because the data is required for rating update functionality, no sensitive PII is exposed, and Azure AD authentication gates all access.
- All code fixes were implemented with zero breaking changes to existing functionality, validated with targeted test cases confirming 403 responses for unauthorised access attempts.

---

## 💡 Proposal

The remediation strategy prioritised fixing all HIGH and access-control MEDIUM findings immediately, while formally accepting risk for lower-severity information disclosure issues where mitigating controls (JWT authentication, rate limiting, access control) adequately reduce the residual risk. Each fix was applied with a minimal, surgical code change and validated with specific test assertions.

---

## ⚠️ Risks

- 10 findings (56%) remain as accepted risk — the full list of accepted items beyond 1.3 is referenced in an attached PDF report (`Datacom - Conver - Agent Library Penetration Test Report V1.0.pdf`) but not fully enumerated in the Confluence page body.
- The accepted-risk items need formal sign-off from a security or risk owner; it is unclear from the document whether that sign-off has been obtained.
- The `BYPASS_JWT_VALIDATION` app setting mentioned elsewhere in the documentation would nullify all of these access control fixes if accidentally enabled in production.
- Re-testing of the remediated findings by the original penetration tester is not confirmed as completed in this document.

---

## ✅ Next Steps

- Obtain formal written sign-off from a security/risk owner for the 10 accepted-risk findings.
- Arrange re-test with the penetration testing team to validate all 8 remediated findings are closed.
- Review the remaining accepted-risk items in the attached PDF and determine if any require compensating controls before production go-live.
- Add a monitoring alert in Application Insights for repeated HTTP 403 responses on the approval and file endpoints to detect future exploitation attempts.
- Ensure `BYPASS_JWT_VALIDATION` is explicitly blocked from being set in UAT and production environments via deployment pipeline guardrails.

---

## 🔑 Close

All four HIGH severity vulnerabilities — including the critical agent self-approval bypass and unauthorised file enumeration — have been fully remediated, making the API safe for production deployment, provided the accepted-risk findings receive formal stakeholder sign-off.

---

📌 **Document Type:** Security Remediation Report / Penetration Test Response
📅 **Last Updated:** 14 November 2025
🔗 **Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40398848336
