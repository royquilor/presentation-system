# TACO — Security Review & Production Architecture
> Group Security approved. 7 risks assessed. Azure East deployment with SQL Hyperscale, OpenAI, and enterprise monitoring

**Author:** Jason Moss — Insights & Analytics
**Date:** March 2025
**Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/39684473076

---

## 🎯 Context

TACO has been reviewed and approved for production by Group Security.
The platform runs in Azure Australia East under the TACOPROD resource group with SQL Server, Azure OpenAI, and enterprise-grade monitoring.

---

## 🔍 Problem

AI platforms handling employee timesheet and billing data must meet Datacom's security, compliance, and data sovereignty requirements.
Without formal security review, the platform cannot proceed to production or handle sensitive contractual information.

---

## 📋 Observations

**1. Security approval status**
Group Security has approved TACO for production deployment.
Comprehensive review covered: data handling, authentication, API security, infrastructure, compliance, AI-specific considerations.
All critical and high-risk findings addressed. Ongoing monitoring in place.

**2. R01 — Broad access to timesheet data (High)**
Risk: Power BI reports may expose data beyond authorised scope.
Mitigation: access controlled via approval. RBAC on backlog for V2.
SSO + MFA enforced. Only users who already receive timesheet data for billing.

**3. R02 — API authentication (High)**
Risk: weak auth could allow unauthorised access or injection.
Mitigation: strong OAuth-style auth, input validation, secure object IDs implemented.
Regular API security testing being conducted.

**4. R03–R04 — Output security & vulnerabilities (High)**
R03: unencrypted spreadsheet outputs match existing OpenAir/Power BI security levels.
R04: pen tests being developed. Application Security building end-to-end test including AI models.
Code reviews for each development phase. Secure coding integrated into lifecycle.

**5. R05–R06 — Client data & sovereignty (High)**
R05: customer restriction capability implemented. Only scope-of-support retrieved.
R06: data transfer prevention in place. Azure policy controls and reporting active.
Sensitive Customer Flag/Tag feature implemented for data residency management.

**6. R07 — Logging and monitoring (Medium)**
Group Security building Azure-specific security architecture recommendations.
Discussing ongoing monitoring solutions for the Azure environment.
Planning CDOC team coordination for periodic threat analysis.

**7. LLM security — OWASP aligned**
Prompt injection: not applicable — TACO does not allow user-submitted prompts.
Output handling: locked to valid Datacom IP addresses.
Training data: no proprietary models, no fine-tuning on customer data.
Human-in-the-loop: policy requires human oversight for all outputs.

**8. Production infrastructure**
Compute: VM Standard_D4s_v3 (4 vCPUs, 16 GB memory) with Defender for Endpoint.
Database: SQL Server Hyperscale (tacosql-prod) with production and draft databases.
AI: Azure OpenAI (tacoprodgpt, S0 SKU).
Web: Python 3.11 app with Application Insights.

**9. Networking & security infrastructure**
VNet: 10.0.0.0/16 with NSGs and DDoS protection.
Key Vault: tacokeyvault-prod for secrets management.
Recovery Services Vault for backup. Log Analytics Workspace for monitoring.
Metric alerts: CPU, memory, network I/O, disk IOPS, VM availability.

---

## 💡 Proposal

TACO is approved for production. Continue with V2 RBAC implementation, ongoing pen testing, and CDOC monitoring coordination.

---

## 🔑 Close

> Reviewed. Approved. Deployed. Monitored.

7 security risks assessed and addressed. Azure Australia East. SSO + MFA. Customer restrictions. DDoS protection. Group Security approved.
