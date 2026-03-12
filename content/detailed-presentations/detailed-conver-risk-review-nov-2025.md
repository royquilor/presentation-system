# Conver Risk Review November 2025

> Security risk assessment for Datacom Chat (Conver) covering DLP, technical controls, and infrastructure vulnerabilities.

**Author:** [Joe Thornley](https://datacomgroup.atlassian.net/wiki/people/62a65fd8188d08006fe06fc2)
**Date:** 18 November 2025
**Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40415953243

---

## 🎯 Context

This document presents a security risk table for Conver (Datacom Chat), focusing on Data Loss Prevention (DLP) for LLM usage and technical controls. It identifies seven risks across infrastructure, access control, logging, and data handling. Several mitigations are blocked by coordination issues between Group Tech and CDOC, with ownership assigned to Group Tech (Stan Hichens) for implementation.

---

## 🔍 Problem

Conver faces multiple security risks: expired TLS certificates, publicly exposed Azure hosts bypassing Cloudflare, manual deployments without IaC, unactioned vulnerability alerts, lack of centralised logging, sensitive data storage concerns, and over-permissioned developer access to production. Several critical mitigations remain unimplemented due to organisational handover and policy alignment issues.

---

## 📋 Observations

**1. Expired TLS certificate between server and Cloudflare (Risk #1)**

Likelihood: **Medium**. Impact: **Medium/High**. Data in transit can be intercepted or modified via MITM. Mitigations: automate certificate issuance and renewal; monitor and alert on expiring certificates. **Current state: NOT IMPLEMENTED** — issue with Group Tech & CDOC. Group Tech (Stan Hichens) to implement. Existing policy: Certificate Management Standard, Change Control Policy.

**2. Azure host publicly exposed, bypassing Cloudflare (Risk #2)**

Likelihood: **Medium**. Impact: **High**. Origin server can be directly attacked, bypassing Cloudflare WAF and rate limiting. Mitigations: restrict Azure ingress to Cloudflare IP ranges only; enable WAF, rate limiting, bot filters; regular external attack-surface scanning. **Current state: NOT IMPLEMENTED** — related to Cloudflare setup. Group Tech (Stan Hichens) to implement. Existing policy: Network Boundary Policy, Deployment Architecture Standard.

**3. No Infrastructure-as-Code; manual deployments (Risk #3)**

Likelihood: **Medium**. Impact: **Low/Medium**. Configuration drift, inconsistent infra, untracked changes, insecure endpoints. Mitigated by vulnerability alerts. IaC is "direction of travel"; Datacom maturity is a key factor. Production environment to be fully controlled by Group Tech (limited Dev access). Existing policy: IaC Development Standard, CI/CD Enforcement Policy.

**4. Vulnerability alerts not actioned (Risk #4)**

Likelihood: **High**. Impact: **Low**. Unpatched vulnerabilities lead to compromise: RCE, privilege escalation, data theft. Jason Dev team has Aikido and is remediating code across codebase and IDE in real time. Some false positive alerting on legacy code. Existing policy: Vulnerability Management Policy, Secure Coding Guidelines.

**5. No centralised logging or monitoring (Risk #5)**

Likelihood: **High**. Impact: **High**. Breaches go undetected; no event correlation; no forensic trace. Mitigations: implement structured logging; capture audit logs for key actions; integrate with Sentinel/SIEM. **Current state: NOT IMPLEMENTED** — issue with Group Tech & CDOC. Group Tech (Stan Hichens) to implement. Existing policy: Logging & Monitoring Standard, Audit Logging Policy.

**6. Sensitive data stored without adequate controls (Risk #6)**

Likelihood: **Medium–High**. Impact: **High**. Breach leads to exposure of personal, customer, or secret data. Mitigations: encrypt at rest & transit; redact/tokenise PII in logs; store secrets in Key Vault; enforce retention & purge. **Current state:** All APIs stored in Key Vault with manual rotation; all APIs encrypted in transit. PII from input/output was a pre-pilot risk; database managed as if containing confidential information. Privileged access WIP (Group Tech handover). Trialling Calypso (and Defender) for PII redaction and real-time monitoring of inputs/outputs. Existing policy: Data Classification Policy, Data Handling Standard, Secrets Management Standard.

**7. Developer direct access and over-permissioned prod access (Risk #7)**

Likelihood: **Medium**. Impact: **High**. Compromised credentials or insider misuse can modify production or exfiltrate data. Mitigations: remove persistent prod access; use JIT access via PIM; use pipelines instead of direct access; enforce MFA & conditional access. **Current state: NOT IMPLEMENTED** — issue with Group Tech & CDOC. Group Tech (Stan Hichens) to implement. Privileged access WIP based on Group Tech handover. Existing policy: Least Privilege Access Policy, Privileged Access Procedure.

---

## 💡 Proposal

Address the seven identified risks through coordinated action between Group Tech and CDOC.

- **Group Tech (Stan Hichens)** to implement Risks #1, #2, #5, #7 (TLS, Azure exposure, logging, privileged access)
- **Dev team** to continue vulnerability remediation via Aikido and IDE tooling
- **Complete Group Tech handover** for privileged access and production control
- **Deploy PII redaction** (Calypso/Defender) for inputs and outputs
- **Progress IaC** as direction of travel, with production under Group Tech control

_Four of seven risks remain unimplemented and depend on Group Tech resolution. Vulnerability management is in progress; PII and secrets handling have partial controls._

---

## ⚠️ Risks

- **Delayed implementation:** Four critical risks (TLS, Azure exposure, logging, privileged access) are blocked by Group Tech & CDOC coordination
- **High-impact gaps:** Risks #2, #5, #6, #7 all have High impact; lack of centralised logging limits breach detection and forensics
- **PII exposure:** Database treated as confidential, but real-time PII redaction still in trial

---

## ✅ Next Steps

1. **Group Tech implementation** — Stan Hichens to implement TLS automation, Azure network lockdown, centralised logging, and privileged access controls
2. **CDOC alignment** — Resolve coordination issues blocking Risk #1, #2, #5, #7
3. **Calypso/Defender rollout** — Complete PII redaction and real-time monitoring for inputs/outputs
4. **Privileged access handover** — Finalise Group Tech handover for production access model
5. **IaC maturity** — Progress Infrastructure-as-Code with production under Group Tech control

---

## 🔑 Close

> Four of seven security risks remain unimplemented due to Group Tech and CDOC coordination issues. Group Tech (Stan Hichens) owns implementation for TLS, Azure exposure, centralised logging, and privileged access. Vulnerability remediation is underway; PII and secrets handling have partial controls in place.

Until these mitigations are implemented, Conver operates with elevated security risk, particularly around breach detection (no centralised logging) and direct production access. Resolving the handover and policy alignment is critical before scaling the platform.
