# Deployment Guide (Production)

> A step-by-step production deployment guide for the Datacom Agent Library, covering Azure infrastructure provisioning, CI/CD pipeline configuration, security hardening, monitoring setup, and disaster recovery.

**Author:** [Dipesh Trikam](https://datacomgroup.atlassian.net/wiki/people/712020:06f04ec7-5f4c-4e03-a2a3-3e46b413e073)
**Date:** 13 September 2025
**Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40062255105

---

## 🎯 Context

This guide provides infrastructure engineers and DevOps teams with everything needed to deploy the Datacom Agent Library to production on Azure. It is based on the **proven UAT implementation** (8.5/10 WAF compliance, 12ms response time) and is designed as a repeatable, Infrastructure-as-Code template. The target environment is `rg-datacom-agent-library-prod` in Australia East, with separate resource groups for MongoDB and Function App networking. Maintained by Dipesh Trikam.

---

## 🔍 Problem

Deploying an enterprise-grade serverless application with multi-VNet networking, private endpoints, dual databases, and Azure AD integration requires many interdependent steps that, if performed out of order or incorrectly, result in security gaps, connectivity failures, or broken deployments. A structured, scripted guide eliminates ambiguity and enables repeatable, auditable production rollouts.

---

## 📋 Observations

- Infrastructure spans **six setup steps**: Resource Group → Key Vault (secrets) → Databases (CosmosDB + MongoDB Atlas M50+) → Azure Functions → Static Web Apps (client + admin) → Application Insights
- All secrets (MongoDB URI, CosmosDB key, Azure AD client secret) are stored in **Azure Key Vault** and referenced via `@Microsoft.KeyVault(SecretUri=...)` in Function App settings — never stored as plaintext
- The CI/CD pipeline uses **GitHub Actions**, triggered on pushes to `main`; it builds all four packages (shared, client-app, admin-app, api), deploys to Azure Functions and both Static Web Apps, runs smoke tests, and notifies Slack
- Security configuration includes Azure Firewall (HTTPS-only, port 443), Network Security Groups on the Function App subnet, custom domain SSL certificate binding via Key Vault, and CORS restricted to known production origins
- Backup strategy: MongoDB Atlas daily automated backups with 7-day retention and point-in-time recovery; CosmosDB continuous backup mode with 7-day retention and geo-redundant storage
- **Disaster Recovery**: RTO of 4 hours, RPO of 1 hour, with documented procedures for database restoration, application redeployment, DNS failover, and monitoring verification
- Post-deployment testing includes smoke tests (health check, auth test, public content), load tests, security scans (`npm audit`), and auth flow tests
- MongoDB Atlas production cluster tier: M50 or higher in Australia (Sydney) region

---

## 💡 Proposal

The deployment approach follows **Infrastructure as Code principles** using Azure CLI scripts, enabling any engineer with the correct permissions to provision a complete production environment from scratch. Secrets management via Key Vault, RBAC-based access, and automated CI/CD with smoke tests and Slack notifications ensure that deployments are both secure and observable. The guide is structured to be followed sequentially — each step produces outputs (resource names, keys) consumed by subsequent steps.

---

## ⚠️ Risks

- The guide requires **Azure Subscription Owner** and **Azure AD Global Administrator** permissions — in many organisations these are not held by the same person, requiring coordination between teams before deployment can begin
- MongoDB Atlas cluster provisioning (step 3) is not covered by Azure CLI and requires manual configuration in the Atlas portal, introducing a non-automated step in an otherwise scripted process
- The Slack webhook and GitHub secrets (`AZURE_FUNCTIONAPP_PUBLISH_PROFILE`, `AZURE_STATIC_WEB_APPS_API_TOKEN_*`) must be pre-configured before the first CI/CD run — missing secrets will cause silent deployment failures
- The disaster recovery RTO (4 hours) assumes a well-practised team following documented procedures; without regular DR drills, actual recovery time is likely to exceed the target

---

## ✅ Next Steps

- Provision the production resource group and Key Vault first, then obtain Key Vault secret URIs before configuring Function App settings
- Configure GitHub repository secrets for all CI/CD pipeline variables before merging to `main`
- Schedule a post-deployment load test to validate performance meets the 12ms response time target under production traffic
- Document and schedule regular DR drills to validate the 4-hour RTO is achievable in practice

---

## 🔑 Close

The production deployment guide provides a **complete, scripted path from zero to a WAF-compliant, production-ready system** — the most critical prerequisite is ensuring Azure Key Vault is provisioned and all secrets are stored before any other services are configured.

---

📌 **Document Type:** Deployment Guide / Operations Guide
📅 **Last Updated:** 13 September 2025
🔗 **Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40062255105
