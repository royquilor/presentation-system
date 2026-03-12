# Conver Playbook for Certification

> Practical playbook for achieving ISO 27001 certification and SOC 2 Type 2 report for Conver, leveraging Datacom's existing certified infrastructure

**Author:** [Joe Thornley](https://datacomgroup.atlassian.net/wiki/people/62a65fd8188d08006fe06fc2)
**Date:** 6 October 2025
**Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40217739335

---

## 🎯 Context

Conver must achieve ISO 27001 certification and SOC 2 Type 2 assurance for its system boundary and unique risks (LLM prompts, logs, connectors, data flows). Datacom already has ISO 27001-certified data centres, facility-level SOC 2 Type 2, and Datapay with ISO 27001:2022 and ISAE 3402 Type II — providing strong inheritance for physical/infrastructure controls. This playbook provides one workstream to deliver both certifications.

---

## 🔍 Problem

ISO 27001 and SOC 2 must be scoped to Conver's system boundary and its unique risks. Conver cannot rely solely on inherited controls; it needs its own ISMS scope, risk register, policies, and audit trail. AI-specific risks (prompt injection, data leakage, plug-in supply chain) require explicit treatment beyond standard controls.

---

## 📋 Observations

**1. ISO 27001:2022 structure**
ISO 27001:2022 has **93 controls** grouped into four themes: Organisational, People, Physical, Technological. Certification requires: define scope, risk management, policies & procedures, implement controls with Statement of Applicability (SoA), evidence, internal audit & management review, then Stage 1/Stage 2 certification.

**2. SOC 2 Trust Services Criteria**
- **Security** (mandatory)
- **Availability** and **Confidentiality** (typically relevant for chat)
- **Privacy** (if Conver processes PII)
SOC 2 reports are **restricted-use**, shared under NDA, not posted publicly. Type 1 = design at a point in time; Type 2 = operating effectiveness over a period.

**3. Datacom inheritance — what Conver can leverage**
- **Data centres:** ISO 27001-certified; several locations list SOC 2 Type 2 at facility level — physical security, environmental, platform controls
- **Datapay:** ISO 27001:2022 certification, ISAE 3402 Type II — useful patterns and artefacts for Conver's ISMS
- **Security services:** Reference operating under ISO 27001, NZISM alignment — internal expertise for uplift

**4. Minimal policy set — 9 policies required**
1. Information Security Policy & ISMS Manual (scope includes Conver)
2. Access Control & Privileged Access Standard
3. Secure Development & Change Management (LLM/prompt engineering included)
4. Logging/Monitoring & Incident Response (with AI misuse playbooks)
5. Vendor/SaaS/AI-provider Risk Management
6. Data Classification, Retention & Deletion (prompts, embeddings, logs)
7. Cryptography & Key Management
8. Business Continuity/DR for Conver
9. Privacy Policy/Notices + DPIA template (if PII) aligned to Privacy Act 2020

**5. Information needed to scope Conver — 13-point checklist**
Purpose & users; data types (PII, client confidential, source code); architecture (hosting, regions, VPC/VNet); LLM stack (models, finetuning/RAG, embeddings, prompt/response logging); integrations (Jira, M365, Datapay); access model (SSO, RBAC); secrets management; ops (SIEM, EDR, DR, RTO/RPO); SDLC; third parties; privacy (DPIA, masking); training; existing evidence.

**6. AI-specific risks to call out**
- **Prompt injection & sensitive-data leakage** → input/output filters, allow-lists, retrieval scoping, content moderation
- **Plug-in / tool abuse** → least privilege scopes, consent prompts, pre-prod approvals
- **Model/embedding store supply chain** → third-party attestations (ISO/SOC), SBOM for models/plug-ins, provenance checks
- **Over-reliance on answers** → UX warnings, "show sources", human-in-the-loop for sensitive tasks
Reference: OWASP Top 10 for LLM Apps, ISO/IEC 23894 (AI risk management)

**7. Four-phase playbook**
- **Phase A — Define & plan:** Confirm scope, pick SOC 2 TSC, stand up ISMS, create evidence repository
- **Phase B — Risk & controls:** Risk assessment (include LLM threats), SoA, implement priority controls (identity, data safeguards, secure SDLC for prompts, content safety, monitoring, incident response, supplier due diligence, privacy)
- **Phase C — Operate & evidence:** Run habits (change control, access recerts, vulnerability mgmt, DR tests), internal audit & management review
- **Phase D — External assurance:** ISO 27001 Stage 1 then Stage 2; SOC 2 Type 1 then Type 2 (reports under NDA)

**8. Using Conver to accelerate the work**
Knowledge pack (policies, SoA, runbooks, NZ Privacy Act, ISO control summaries in RAG); guardrails (PII/secrets redaction, restrict compliance workspace, short log retention); workflows (access reviews, change approvals, IR simulations); OWASP LLM Top-10 advisories; assurance trail (ticket/artifact per Conva-driven task).

---

## 💡 Proposal

Run one workstream to achieve ISO 27001 certification for Conver's scope and a SOC 2 Type 2 report the following cycle, leveraging Datacom's certified facilities and Datapay ISMS patterns.

- Extend existing ISMS scope to include Conver, or create Conver-specific scope
- Run SOC 2 Type 1 (design) then Type 2 cycle — Security + Availability + Confidentiality; add Privacy if PII
- Implement AI-specific controls (OWASP LLM Top 10, ISO/IEC 23894)
- Align with NZ Privacy Act 2020 if Conver processes personal information

*Deliverables: ISMS charter/scope; Risk register; SoA; Policy set; Runbooks; Training records; Pen test report; IR/DR test reports; Internal audit; Management review minutes; ISO cert + audit report; SOC 2 report.*

---

## ⚠️ Risks

- **Scope creep:** Conver's integrations (Jira, M365, Datapay, internal wikis) expand the system boundary; scope must be clearly defined to avoid audit scope inflation.
- **AI-specific control gaps:** OWASP LLM Top 10 and ISO 23894 are evolving; auditors may have varying expectations for AI risk controls.
- **NDA distribution:** SOC 2 reports cannot be freely shared; customer/prospect requests for assurance may require controlled distribution processes.

---

## ✅ Next Steps

1. **Confirm scope** — Conver components, data types, hosting (Datacom DCs vs public cloud), sub-service orgs
2. **Pick SOC 2 TSC** — Security + Availability + Confidentiality; add Privacy if PII
3. **Stand up ISMS** — Name ISMS owner, approve Security Policy and risk methodology
4. **Create evidence repository** — Confluence/SharePoint + ticketing tags, naming conventions
5. **Risk assessment** — Include LLM threats (prompt injection, data leakage, model supply chain)
6. **SoA** — Select ISO 27001:2022 controls; map to SOC 2 points of focus

---

## 🔑 Close

> One workstream: ISO 27001 certification + SOC 2 Type 2 — leverage Datacom's certified facilities and Datapay ISMS patterns, but scope and run the ISMS around Conver's unique risks.

Datacom's public materials evidence strong building blocks. To issue Conver-specific certificates/reports, Conver needs a defined system scope, a running ISMS, and completed audits. SOC 2 reports are shared under NDA, not public-facing.
