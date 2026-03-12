# SPP Insights - Governance Summary
> Executive governance document for AI-powered analytics platform enabling natural language queries against employee timesheet and project data

**Author:** [Dipesh Trikam](https://datacomgroup.atlassian.net/wiki/people/557058:e9d25d3a-2620-4614-b9ff-ee3ec2eb3a1b)
**Date:** 4 February 2026
**Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40727839006

---

## 🎯 Context

**SPP Insights** is an AI-powered analytics platform that enables natural language queries against employee timesheet and project data. It provides a conversational interface, real-time analytics, AI-generated insights, and data visualisation for trend analysis. The document is Version 1.0, classified Internal - Confidential, prepared for CISO, Governance Team, and Security Review Board. All resources are hosted in Australia East.

---

## 🔍 Problem

SPP Insights exposes sensitive employee, project, and financial data through natural language queries. Without robust security controls, governance, and compliance measures, the platform risks unauthorised data access, SQL injection, credential exposure, and regulatory non-compliance. The document identifies six risks (R1–R6) and multiple P1 security gaps that block production go-live.

---

## 📋 Observations

**1. Data scope and volume**
Microsoft Fabric (Turbo Model) holds a semantic model with **28 tables** and **~200k rows** (Internal sensitivity). Azure SQL Database holds a synced relational copy. Data categories include Employee Information (PII), Project Data, Timesheet Entries, Customer Information (Confidential), and Financial Metrics (Confidential).

**2. Data retention and disposal**
| Data Type | Retention Period | Disposal Method |
|-----------|------------------|-----------------|
| Timesheet Data | 7 years | Automated purge |
| Audit Logs | 90 days (Log Analytics) | Azure lifecycle |
| Query History | 30 days | Automated purge |
| Sync Metadata | 1 year | Manual review |

**3. Six identified risks with mitigation status**
| Risk | Description | Likelihood | Impact | Mitigation | Status |
|------|-------------|------------|--------|------------|--------|
| R1 | Unauthorised data access via NL queries | Medium | High | RLS implementation | 🟡 In Progress |
| R2 | SQL injection via AI-generated queries | Low | Critical | Query validation layer | ✅ Implemented |
| R3 | Data exfiltration via bulk queries | Medium | High | Query result limits | 🟡 Planned |
| R4 | Credential exposure | Medium | Critical | Key Vault migration | 🔴 Not Started |
| R5 | Network-based attack | Low | High | Private endpoints | 🔴 Not Started |
| R6 | Insider threat - excessive access | Medium | High | Principle of least privilege | 🟡 In Progress |

**4. Business value capabilities**
| Capability | Business Benefit |
|------------|------------------|
| Billing Status Checks | Faster month-end close |
| Resource Utilization | Better capacity planning |
| Project Health Monitoring | Early risk identification |
| T&M Classification | Improved revenue recognition |

**5. P1 security gaps blocking production**
Pre-production checklist shows: Row-Level Security 🟡 In Progress; Managed Identity for SQL 🔴 Not Started; Key Vault for all secrets 🔴 Not Started; Private Endpoints enabled 🔴 Not Started; Public access disabled 🔴 Not Started. SQL auditing is 🟡 Partial; Log Analytics, alerting, DR plan, runbook, and Privacy impact assessment are all 🔴 Not Started.

**6. Go-live decision gates**
All five gates are blocked: Gate 1 (Security controls P1) 🔴 Blocked; Gate 2 (Penetration test) 🔴 Not Started; Gate 3 (Privacy impact assessment) 🔴 Not Started; Gate 4 (Operational readiness) 🔴 Not Started; Gate 5 (CISO sign-off) 🔴 Pending.

**7. Azure resources and compliance**
Resources include `spp-openair-conver-integration` (Azure AI Services), `spp-turbo-sql-dev` (Azure SQL Server), `db-turbo-model` (Azure SQL Database), `sppopenairdata` (Storage Account), `spp-conver-integration` (VM), and `spp-conver-integration-vnet` (Virtual Network)—all Australia East. Azure SQL inherits SOC 1/2/3, ISO 27001, HIPAA, PCI DSS; Azure AI Services SOC 2, ISO 27001; Azure Storage SOC 1/2/3, ISO 27001, HIPAA.

**8. Incident response and access review**
P1 Critical (data breach, service compromise): 15 minutes, CISO/Legal. P2 High: 1 hour, Security Lead. P3 Medium: 4 hours, On-call engineer. P4 Low: Next business day. User Access Review: Quarterly; Admin Access Review: Monthly (CISO); Service Account Review: Quarterly; Firewall Rule Review: Monthly.

---

## 💡 Proposal

Implement immediate P1 security controls before production go-live, then address P2 and P3 items.

- **P1 (Immediate):** Implement Row-Level Security; migrate to Managed Identity; deploy Key Vault for all secrets; enable Private Endpoints and disable public access
- **P2 (Short-term):** Configure Azure Monitor; implement data masking for PII; create operational runbooks; schedule penetration test
- **P3 (Long-term):** Azure Sentinel integration; automated compliance reporting; Zero Trust architecture

*Production is blocked until P1 security controls are implemented and CISO sign-off is obtained.*

---

## ⚠️ Risks

- **R1 — Unauthorised data access:** Medium likelihood, High impact; RLS not fully implemented.
- **R4 — Credential exposure:** Medium likelihood, Critical impact; Key Vault migration not started.
- **R5 — Network-based attack:** SQL and AI Services have public access enabled; Private Endpoints not deployed.
- **Compliance gap:** Privacy Act 2020 (NZ) and Australian Privacy Principles require review; Privacy impact assessment not started.

---

## ✅ Next Steps

1. **Implement Row-Level Security** — Data Platform to complete RLS for multi-tenant data access.
2. **Migrate to Managed Identity** — Cloud Platform to eliminate stored SQL credentials.
3. **Deploy Key Vault** — Cloud Platform to secure all secrets and API keys.
4. **Enable Private Endpoints** — Cloud Platform to remove public internet exposure.
5. **Complete Privacy impact assessment** — Legal/Privacy to obtain approval before Gate 3.
6. **Obtain CISO sign-off** — Security to complete Gate 5 after P1 controls are in place.

---

## 🔑 Close

> SPP Insights delivers significant business value (billing checks, resource utilisation, project health, T&M classification) but cannot go to production until P1 security controls—RLS, Managed Identity, Key Vault, and Private Endpoints—are implemented.

The platform is technically capable but governance-blocked. Four of six risks have mitigations not yet started or only partially complete. CISO sign-off and Privacy impact assessment are pending.
