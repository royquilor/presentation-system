# Technical Operations and Security Guide

> AutoDOCX Azure security architecture for DOCX template rendering — Conver UI → Azure Functions → Blob Storage

**Author:** [Johnson Paku](https://datacomgroup.atlassian.net/wiki/people/712020:b33ff689-852b-4bd8-9b93-4e3a96a16c4f)
**Date:** 26 February 2026
**Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40777154594

---

## 🎯 Context

AutoDOCX is an Azure solution for DOCX template variable extraction and rendering, serving the Datacom Chat feature. The pipeline flows from Conver UI through Azure Functions to Blob Storage. Security posture increases progressively across DEV → UAT → PROD environments, with production requiring private endpoints, WAF, and mandatory Key Vault integration.

---

## 🔍 Problem

Production deployment of AutoDOCX requires clear, repeatable provisioning and operational procedures to avoid security gaps, misconfiguration, and compliance risk. Without a structured guide, teams may miss critical steps such as private endpoint approval, WAF configuration, or blob lifecycle management — exposing sensitive documents or leaving attack surface open.

---

## 📋 Observations

**1. Environment summary — three tiers**

| Feature | DEV | UAT | PROD |
|---------|-----|-----|------|
| Function App | autodocx | autodocx-uat | (To be defined) |
| Storage Account | jdev91e2 | autodocxuatuatst | (To be defined) |
| Auth Level | Anonymous/Keys | Function Key | Managed Identity / OAuth2 |
| Networking | Public Disabled | IP Restricted | Private Endpoints + WAF |
| Secrets | App Settings | Key Vault Refs | Key Vault (Mandatory) |

**2. Security architecture — three trust boundaries**

- **Conver → Azure Function:** Entra ID OAuth2 (PROD) or Function Keys (UAT/DEV)
- **Azure Function → Storage:** System-assigned Managed Identity, RBAC (Storage Blob Data Contributor)
- **Key Vault:** Centralized secrets via Managed Identity

**3. Provision script output — seven resource types**

The `provision.sh` / `provision_copy.sh` script creates: VNet and subnets, storage (public access off after PEs), Function App + managed identity + RBAC, private endpoints + Private DNS, VNet integration, Application Gateway (WAF) with public IP.

**4. Post-provision manual steps — six verification points**

1. Approve private endpoints (**pe-st-blob**, **pe-func-site**) — set Connection state to Approved
2. Verify Private DNS zones: `privatelink.blob.core.windows.net`, `privatelink.azurewebsites.net` — confirm VNet links and A records
3. Storage: Public network access = Disabled; blob private endpoint Approved
4. Function App: Public access = Disabled; function private endpoint Approved; VNet integration = Function subnet
5. App Gateway backend health — backend (function FQDN) must be Healthy (requires `/api/health`)
6. WAF: OWASP managed rules enabled; Mode = Prevention (or Detection)

**5. Blob lifecycle management — 1-day retention**

Storage account must be configured to automatically delete blobs after **24 hours**. Rule: `DeleteBlobsAfter24Hours`, condition = Created, value = 1 day, action = Delete. Policy runs once daily; first execution may be delayed up to 24 hours.

**6. Logging guidelines — explicit redaction**

- **Do not log:** Template bodies, connection strings, Bearer tokens
- **OK to log:** UserId, file_id, duration, status codes (redact URL signatures)

**7. DNS troubleshooting — fallback resolution**

Symptom: ENOTFOUND or connectivity errors → Private Link DNS resolution issue. Check: `nslookup <hostname> 8.8.8.8`. Fix (Linux): Add 8.8.8.8 as fallback DNS in systemd-resolved if required.

**8. Optional hardening — three controls**

- NSGs on subnets (Function, App Gateway, Private link): restrict to required traffic
- Diagnostic settings on App Gateway: access logs, WAF logs, metrics → Log Analytics or storage
- Key Vault: Store secrets in Key Vault; reference from Function App (mandatory for PROD)

---

## 💡 Proposal

Follow the provision script and post-provision checklist to ensure consistent, secure deployment across environments.

- Run `provision.sh` or `provision_copy.sh` with correct variables (PROJECT_NAME, ENVIRONMENT, TARGET_SUBSCRIPTION, TARGET_RESOURCE_GROUP, LOCATION)
- Approve **pe-st-blob** and **pe-func-site** private endpoints in Azure Portal
- Verify Private DNS zones and A records for storage and function
- Confirm storage and Function App public access **Disabled**
- Confirm VNet integration on Function App
- Ensure App Gateway backend **Healthy**
- Configure WAF: OWASP enabled, mode **Prevention**
- Configure Key Vault and secret references (mandatory for PROD)
- Enable Blob Lifecycle Management with 1-day deletion rule

*By adhering to this guide, AutoDOCX deployments meet security expectations for production workloads while maintaining operational clarity.*

---

## ⚠️ Risks

- **Private endpoint approval delay:** Pending endpoints block traffic; manual approval in Portal is required post-provision.
- **DNS resolution failure:** Private Link DNS can fail in some environments; ENOTFOUND errors require fallback DNS configuration.
- **Blob retention:** Without lifecycle management, sensitive DOCX output may persist indefinitely in storage.
- **Logging exposure:** Template bodies, tokens, or connection strings in logs create data leakage risk.

---

## ✅ Next Steps

1. **Clone repo and run provision** — `https://github.com/DatacomGroup/Autodocx`; set `MSYS_NO_PATHCONV=1` for Git Bash
2. **Approve private endpoints** — pe-st-blob and pe-func-site in resource group
3. **Verify Private DNS** — privatelink zones and A records for storage and function
4. **Confirm networking** — Storage and Function App public access Disabled; VNet integration set
5. **Validate App Gateway** — Backend health Healthy; WAF OWASP enabled, mode Prevention
6. **Configure Key Vault** — Store secrets; reference from Function App (PROD mandatory)
7. **Enable Blob Lifecycle** — DeleteBlobsAfter24Hours rule in Storage Account

---

## 🔑 Close

> Security increases across DEV → UAT → PROD — follow the provision script, approve endpoints, verify DNS, and enforce WAF and Key Vault for production.

This guide provides the operational foundation for secure AutoDOCX deployment, ensuring consistent configuration and reducing the risk of misconfiguration or compliance gaps.
