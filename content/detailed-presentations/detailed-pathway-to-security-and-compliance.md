# Pathway to Security and Compliance for Conver

> White paper outlining Datacom's approach to align Conver with ISO 27001, SOC 2, and NZ/AU regional standards, leveraging Vanta for automation

**Author:** [Joe Thornley](https://datacomgroup.atlassian.net/wiki/people/62a65fd8188d08006fe06fc2)
**Date:** 6 October 2025
**Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40217313800

---

## 🎯 Context

Conver is Datacom's internal LLM-based chatbot and agent platform, designed to enhance operational efficiency and knowledge accessibility. Given its role in processing sensitive internal and potentially client-related data, Datacom recognises the necessity of embedding strong information security and privacy controls. The programme aims to achieve ISO 27001 and SOC 2 compliance, align with NZ/AU regulations, establish evidence-based security maturity, and leverage Vanta for automation.

---

## 🔍 Problem

Conver processes sensitive data and must meet formal security and compliance standards for internal and potentially client use. The programme must address international standards (ISO 27001, SOC 2), regional regulations (NZISM, NZ Privacy Act 2020, OAIC, IRAP), and AI-specific risks — while avoiding duplication by leveraging existing Datacom controls.

---

## 📋 Observations

**1. Programme objectives — four goals**
1. Achieve compliance with ISO 27001 and SOC 2
2. Ensure alignment with NZ and AU-specific regulations (NZISM, NZ Privacy Act 2020, OAIC guidelines, IRAP)
3. Establish transparent, evidence-based approach to demonstrating security maturity
4. Leverage Vanta to streamline evidence collection, control validation, and readiness for external audit

**2. ISO 27001:2022 requirements**
- Define scope (Conver system boundary)
- Conduct risk assessment, maintain risk register
- Implement controls from Annex A — **93 controls** in four themes: Organisational, People, Physical, Technological
- Document policies, processes, procedures
- Demonstrate continuous improvement via internal audits, management reviews, corrective actions
- Certification: Stage 1 (documentation/readiness) then Stage 2 (implementation/effectiveness)

**3. SOC 2 Trust Services Criteria**
- **Security** (mandatory)
- **Availability**
- **Confidentiality**
- **Processing Integrity**
- **Privacy**
Type 1 = design at a point in time; Type 2 = effectiveness over a period (typically 6–12 months). Reports are restricted-use, shared under NDA.

**4. Datacom's current compliance landscape**
- **ISO 27001:** Datacom data centres are ISO 27001-certified — inheritance for physical and infrastructure controls
- **SOC 2 Type 2:** Several Datacom facilities maintain SOC 2 reports
- **Datapay:** ISO 27001:2022 and ISAE 3402 Type II attestations — demonstrates scoped certification experience
- **NZISM:** Datacom security services align to NZISM baseline and government security expectations

**5. Regional regulatory context**
- **NZ:** NZ Privacy Act 2020 (collection, use, storage, security, transparency, data subject rights); NZISM (baseline for government data)
- **AU:** Privacy Act 1988 (Cth), OAIC (consent, security, cross-border disclosure); IRAP (government services, ASD Essential Eight)
Both jurisdictions compatible with ISO 27001 and SOC 2.

**6. 90-day action plan — three phases**
- **Phase 1 (Weeks 1–4):** Confirm scope and dependencies; risk assessment and risk register; draft Information Security Policy; map existing Datacom controls and inherited evidence
- **Phase 2 (Weeks 5–8):** Apply ISO Annex A and SOC 2 controls; configure Vanta monitoring; implement AI-specific controls and guardrails; begin evidence collection (Vanta + manual)
- **Phase 3 (Weeks 9–12):** Internal audit and management review; address gaps, finalise SoA; schedule Stage 1 ISO audit and SOC 2 readiness assessment

**7. Key policies required — 8 policies**
1. Information Security Policy & ISMS Manual
2. Access Control and Privileged Access Management
3. Secure Development Lifecycle (SDLC)
4. Incident Response and Monitoring Policy
5. Data Classification and Retention Policy
6. Supplier and Cloud Security Policy
7. Business Continuity and Disaster Recovery Policy
8. Privacy and Data Protection Policy (aligned to NZ Privacy Act 2020)

**8. Vanta integration benefits**
Vanta monitors cloud configurations, endpoints, access controls; collects evidence from Azure AD, AWS, GitHub, Jira, Slack; generates reports mapped to ISO 27001 and SOC 2. Integrating Conver reduces manual evidence collection, maintains continuous visibility, and supports faster auditor readiness.

**9. AI-specific controls (SoA overlay)**
Conver_ISO27001_SoA_Skeleton.xlsx created with mapping to SOC 2 and AI Overlay (OWASP LLM Top 10). Recommended controls: Prompt Injection Defences; Output Handling (sanitisation, redaction); Model Supply Chain Management; Sensitive Data Protection (prompt/log redaction); Human Oversight; LLM Incident Response playbooks.

---

## 💡 Proposal

Leverage Datacom's established ISO-certified infrastructure, existing ISMS, and Vanta automation to build a formal, auditable compliance framework for Conver.

- Define Conver scope (application, hosting, supporting services, users)
- Conduct risk assessment including AI-specific threats (data leakage, prompt injection, model supply chain)
- Implement and document controls (access, data protection, SDLC, incident response, vendor management, privacy)
- Operate and gather evidence (access tickets, audit logs, pen test, IR drills, training records)
- Proceed to external audit (ISO Stage 1/2, SOC 2 Type 1/2)

*By combining international standards with local regulations and AI-specific overlays, Conver operates securely, transparently, and in alignment with global best practices.*

---

## ⚠️ Risks

- **Scope definition:** Conver's dependencies (identity, logging, storage, AI model integrations) may expand scope; clear boundaries are critical.
- **Vanta coverage gaps:** Not all Conver-specific controls (e.g., LLM prompt redaction) may be automatable in Vanta; manual evidence will be required.
- **Audit timing:** 90-day plan is aggressive; Stage 1 ISO and SOC 2 readiness by Week 12 may slip if gaps are significant.

---

## ✅ Next Steps

1. **Define scope** — Application codebase, deployment environments, hosting, supporting services, users
2. **Conduct risk assessment** — Data leakage, prompt injection, model supply chain, unauthorised access, AI-specific risks
3. **Implement controls** — Access (MFA, least privilege), data protection, SDLC, incident response, vendor management, privacy
4. **Configure Vanta** — Integrate Conver into Vanta's control framework
5. **Phase 1 (Weeks 1–4)** — Confirm scope, risk register, draft policies, map inherited evidence

---

## 🔑 Close

> Leverage Datacom's ISO-certified infrastructure and Vanta to build a formal, auditable compliance framework — combine international standards, local regulations, and AI-specific overlays.

This white paper provides the foundation for team alignment, compliance planning, and stakeholder confidence as Datacom progresses towards external certification and formal security assurance for Conver.
