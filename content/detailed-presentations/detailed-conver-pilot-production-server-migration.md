# Conver Pilot and Production Server Migration Procedure
> Comprehensive migration procedure for Conver servers: Pilot and Production upgrades, data migration, and validation

**Author:** [Jing Ling](https://datacomgroup.atlassian.net/wiki/people/712020:9162bb60-f2eb-46e4-af8a-d5e3071bc7af)
**Date:** 8 September 2025
**Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40087617783

---

## 🎯 Context

This document outlines the migration procedure for Conver servers across Pilot and Production environments. The process encompasses code upgrades, database schema updates, data transfer from Pilot to Production, and validation testing. A detailed plan for Monday, 8 September 2025 specifies preparation, execution, communication, verification, and a Go/No-Go decision point, with a full rollback plan.

---

## 🔍 Problem

Conver requires coordinated upgrades of Pilot and Production servers, integration of new models (e.g. GPT5), and migration of Pilot data to Production. Without a structured procedure, upgrades could cause extended downtime, data loss, or unrecoverable failures. The migration must minimise service disruption, preserve data integrity, and provide clear rollback criteria.

---

## 📋 Observations

**1. Five-phase migration sequence**
Migration follows: (1) **Conver Pilot Server Upgrade** — application code + MongoDB schema during scheduled maintenance; (2) **Pilot Server Validation** — testing with designated users; (3) **Conver Production Server Upgrade** — same procedures as UAT; (4) **Data Migration** — MongoDB + VectorDB from Pilot to Production; (5) **Production Server Validation** — testing with internal users.

**2. Detailed plan for 8 September 2025: Pre-upgrade preparation**
Before start of business: Confirm change window and communicate to stakeholders; ensure pre-requisites (backups, resources, approval, readiness gates) are met; perform **full backup** of Pilot environment including databases, application configurations, stored assets/chats, and agent model states.

**3. Execution: Deploy, integrate GPT5, smoke test**
Deploy latest version to Pilot; confirm deployment success (health endpoints, container/orchestration). Integrate **GPT5 models**; verify previous models still available for side-by-side testing; update configuration and environment variables. Smoke Test 1: Application login, chats/assets accessible, model selection UI accommodates GPT5 and legacy models.

**4. Communication to Pilot users**
Send consolidated communication covering: deployment completion, GPT5 integration and planned decommission of earlier models, feature changes and migration info, instructions to upgrade agent models.

**5. Verification: Functional testing, data integrity, monitoring**
Functional testing: Core regression for new chat/asset creation, model invocation (GPT5 and legacy), user and admin actions. Data integrity: Sample check on migrated chats, assets, model links; review for missing or corrupted data. Monitoring: Continuous monitoring (performance, error rate, application logs) for **at least 2 hours** after upgrade.

**6. Go/No-Go decision point**
If all functional, data, and monitoring checks pass: **Sign-off upgrade**. If critical failures found: proceed to rollback.

**7. Rollback criteria and procedure**
Criteria: Major functionality unavailable (login, chat, model access, asset retrieval); data missing or corrupted; upgrade unrecoverably fails within change window. Actions: Notify stakeholders; restore from pre-upgrade backup (databases, config, binaries); redeploy previous stable version; validate restoration; communicate rollback and estimated restoration time; schedule remediation and retry with lessons learned.

**8. Key notes: Maintenance windows, backups, testing**
Pilot upgrades should occur during **scheduled maintenance windows** to minimise disruption. **Comprehensive backup procedures** must be implemented before Pilot upgrade or migration. Testing must include functional validation and performance verification. All issues discovered must be documented and resolved before proceeding to subsequent steps.

---

## 💡 Proposal

Execute the five-phase migration following the 8 September 2025 plan, with strict adherence to preparation, verification, and rollback procedures.

- **Complete pre-upgrade backups** — Full backup of Pilot including databases, configs, assets/chats, agent model states
- **Deploy and integrate GPT5** — Deploy latest code; integrate GPT5 while retaining legacy models for side-by-side testing
- **Validate before Production** — Pilot validation with designated users; resolve all issues before Production upgrade
- **Migrate data with documentation** — Transfer MongoDB and VectorDB from Pilot to Production; document process and issues
- **Monitor and decide** — At least 2 hours post-upgrade monitoring; Go/No-Go based on functional, data, and monitoring checks

*Migration success depends on backups, staged validation, and clear rollback criteria.*

---

## ⚠️ Risks

- **Insufficient backups:** Without full pre-upgrade backup, rollback may be impossible or result in data loss.
- **Skipping Pilot validation:** Proceeding to Production before Pilot issues are resolved risks propagating defects.
- **Inadequate monitoring window:** Less than 2 hours may miss latent failures (memory leaks, gradual degradation).
- **Unclear rollback trigger:** Ambiguous "critical failure" criteria may delay rollback decisions and extend outage.

---

## ✅ Next Steps

1. **Confirm change window** — Communicate maintenance schedule to all stakeholders and Pilot users.
2. **Execute full backup** — Databases, configs, assets/chats, agent model states.
3. **Deploy to Pilot** — Latest application code; MongoDB schema upgrade.
4. **Integrate GPT5** — Add GPT5 models; retain legacy for testing.
5. **Run Pilot validation** — Smoke test, functional regression, designated user testing.
6. **Communicate to Pilot users** — Deployment completion, GPT5 info, upgrade instructions.
7. **Monitor 2+ hours** — Performance, errors, logs.
8. **Go/No-Go** — Sign-off or rollback based on verification results.
9. **Production upgrade** — Repeat procedures; migrate data; validate with internal users.

---

## 🔑 Close

> Five-phase migration with backups, staged validation, and a defined rollback plan ensures Conver Pilot and Production upgrades proceed safely.

The migration procedure provides a repeatable path from Pilot upgrade through data migration to Production validation. The 8 September 2025 plan adds concrete steps: full backup, GPT5 integration, 2-hour monitoring, and explicit Go/No-Go criteria. Following the rollback plan when critical failures occur minimises extended outage and data loss risk.
