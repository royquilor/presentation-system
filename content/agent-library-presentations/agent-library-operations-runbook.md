# Operations Runbook — Day-to-Day Operations & Maintenance

> A comprehensive reference for the daily operations, monitoring, alerting, deployment, and incident response procedures for the Datacom Agent Library production environment.

**Author:** [Dipesh Trikam](https://datacomgroup.atlassian.net/wiki/people/712020:06f04ec7-5f4c-4e03-a2a3-3e46b413e073)
**Date:** 13 September 2025
**Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40062189618

---

## 🎯 Context

The Datacom Agent Library is an enterprise AI agent-sharing platform built on Azure, achieving an 8.5/10 Well-Architected Framework (WAF) compliance score. The system is operated by the Datacom EASA team (lead: Dipesh Trikam) and is currently running in a live UAT environment with 99.9% availability. The runbook serves as the authoritative day-to-day operations guide for all on-call and support staff.

---

## 🔍 Problem

As the platform matures toward production, there was a need for a formalised, repeatable set of operational procedures to ensure consistent health monitoring, rapid incident response, and proactive maintenance. Without a structured runbook, operational knowledge was siloed and incidents risked longer resolution times.

---

## 📋 Observations

- The system achieves a 12ms average API response time (well under the <200ms target) via VNet peering and private endpoint architecture.
- A structured daily cadence is defined: morning health checks at 9 AM, afternoon database maintenance at 2 PM, and an evening summary at 5 PM.
- Critical alerts are configured in Azure Monitor for HTTP 5xx rates >5% (immediate) and response times >1,000ms (warning), with action groups for notification.
- KPIs tracked include: response time (<200ms p95), error rate (<1%), availability (>99.9%), CPU (<80%), and memory (<85%).
- Deployment procedures cover blue-green rollouts via GitHub Actions for zero-downtime releases, with rollback capability to previous versions.
- Incident response follows a defined severity matrix: P1 (critical, <15 min response) through P4 (low, next business day).
- Escalation paths are documented: Development Team for code issues, Infrastructure Team for Azure/network issues, Management for critical outages or compliance events.

---

## 💡 Proposal

Operators follow a structured three-times-daily checklist using Azure CLI commands, Azure Portal dashboards, and Application Insights queries to maintain system health. All deployments are executed through GitHub Actions pipelines with mandatory smoke tests and automated rollback triggers if error rates spike post-deployment.

---

## ⚠️ Risks

- Runbook references placeholder values (e.g., `your-subscription-id`, `api.yourdomain.com`) that must be replaced with live production values before use.
- Some automated alert thresholds (e.g., CPU >80%) may require tuning once real production traffic patterns are established.
- The runbook assumes Azure CLI access is available to on-call staff; role assignments and access provisioning are a prerequisite dependency.
- Daily manual checks may not scale if the platform grows significantly — automation of the health check cadence should be considered.

---

## ✅ Next Steps

- Replace all placeholder environment values (subscription IDs, resource group names, domain URLs) with production-verified values.
- Provision and validate Azure Monitor action groups so alerts actually page the on-call team.
- Conduct a tabletop incident-response exercise using the P1/P2 runbook procedures to validate team readiness.
- Automate the daily health check script (`health-check.sh`) as a scheduled Azure Function or GitHub Actions cron job.
- Review and confirm escalation contacts are current before go-live.

---

## 🔑 Close

This runbook is the single source of truth for operating the Datacom Agent Library in production — teams must replace placeholder values and validate alert routing before relying on it in a live incident.

---

📌 **Document Type:** Operations Guide / Runbook
📅 **Last Updated:** 13 September 2025
🔗 **Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40062189618
