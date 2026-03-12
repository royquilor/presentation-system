# Troubleshooting Guide — Common Issues & Solutions

> A structured diagnostic and resolution reference for the most frequent operational problems encountered in the Datacom Agent Library, based on real UAT experience.

**Author:** [Dipesh Trikam](https://datacomgroup.atlassian.net/wiki/people/712020:06f04ec7-5f4c-4e03-a2a3-3e46b413e073)
**Date:** 13 September 2025
**Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40062222342

---

## 🎯 Context

The Datacom Agent Library is an enterprise-grade AI agent platform (8.5/10 WAF compliant) hosted on Azure Functions, with MongoDB Atlas and CosmosDB backends connected via VNet peering. This guide was produced by Dipesh Trikam from the Datacom EASA team following real issues surfaced during UAT, and is targeted at support engineers and on-call operators.

---

## 🔍 Problem

During UAT, the team encountered a range of recurring issues spanning authentication failures, database connectivity, API performance degradation, frontend outages, and email delivery failures. A consolidated, searchable troubleshooting guide was needed to reduce mean time to resolution and avoid repeated diagnosis of the same root causes.

---

## 📋 Observations

- Authentication failures are most commonly caused by expired Azure AD client secrets or misconfigured JWT issuer/audience settings; the fix is to rotate credentials and update Function App app settings.
- MongoDB connection timeouts were the root cause of the original 5,000ms+ response times; resolution involved adding Azure Functions outbound IPs to the MongoDB Atlas network allowlist and implementing VNet peering.
- CosmosDB performance issues (throttling, high RU consumption) are diagnosed via Azure Monitor metrics and resolved by scaling throughput or optimising partition key strategies.
- Frontend issues (blank client app, admin access denied) are typically resolved by redeploying via GitHub Actions or correcting Azure AD app role assignments.
- Email notification failures trace back to stale Azure Communication Services connection strings or unverified sending domains.
- A structured escalation matrix exists: Development Team for code bugs, Infrastructure Team for Azure/network issues, Management for critical outages or security breaches.
- Emergency contacts are documented: `easaiteam@datacom.com` (primary on-call) and `dipesh.trikam@datacom.com` (emergency).

---

## 💡 Proposal

The guide provides a tiered diagnostic approach: start with the quick health-check script to triage the system, then follow issue-specific procedures (authentication → database → API performance → frontend → email) with paired Azure CLI commands and portal navigation steps. Preventive maintenance procedures (daily health checks, performance alerts) are included to catch issues before users report them.

---

## ⚠️ Risks

- Several diagnostic commands contain placeholder values (`your-client-id`, `your-subscription-id`) that will fail if copied verbatim without substitution.
- Enabling the `BYPASS_JWT_VALIDATION=true` flag (listed as a fix option) in non-development environments would completely remove API authentication — this must never be applied to UAT or production.
- MongoDB recovery via `mongorestore` overwrites existing data; operators must confirm backup currency before executing database recovery steps.
- The guide does not cover multi-region failover scenarios — if the primary Azure region becomes unavailable, additional runbook content is required.

---

## ✅ Next Steps

- Populate all placeholder values with verified production resource names and IDs.
- Add a note explicitly prohibiting the use of `BYPASS_JWT_VALIDATION` outside of local development.
- Extend the guide to cover multi-region failover and disaster recovery scenarios.
- Schedule quarterly reviews to keep diagnostic commands aligned with any infrastructure changes.
- Integrate the health-check script into the CI/CD pipeline as a post-deployment smoke test.

---

## 🔑 Close

The most impactful lesson from UAT is that nearly all performance and connectivity issues traced back to network/VNet misconfiguration — ensuring VNet peering and private endpoint connectivity are verified first saves significant troubleshooting time.

---

📌 **Document Type:** Troubleshooting Guide
📅 **Last Updated:** 13 September 2025
🔗 **Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40062222342
