# Operations Runbook

> Day-to-Day Operations & Maintenance for the enterprise-grade Datacom Agent Library achieving 8.5/10 WAF compliance.

**Author:** Dipesh Trikam
**Date:** 13 September 2025
**Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40062189618

---

## 🎯 Context

The Datacom Agent Library is an enterprise AI agent-sharing platform built on Azure, achieving an 8.5/10 Well-Architected Framework (WAF) compliance score. The system is operated by the Datacom EASA team (lead: Dipesh Trikam) and runs in a live UAT environment with 99.9% availability, 12ms average response time, and private endpoint connectivity. The runbook serves as the authoritative day-to-day operations guide for all on-call and support staff.

---

## 🔍 Problem

As the platform matures toward production, there was a need for a formalised, repeatable set of operational procedures to ensure consistent health monitoring, rapid incident response, and proactive maintenance. Without a structured runbook, operational knowledge was siloed and incidents risked longer resolution times.

---

## 📋 Observations

**1. System Performance (UAT)**

The system achieves 12ms average API response time (well under the <200ms target) via VNet peering and private endpoint architecture. Health endpoint: `https://datacom-agent-library-fa-uat.azurewebsites.net/api/health`. JWT validation completes in under 12ms.

**2. Daily Operations Cadence**

A structured three-times-daily checklist is defined: morning health checks at 9 AM, afternoon database maintenance at 2 PM, and an evening summary at 5 PM. Each phase has specific verification steps and tooling.

**3. Critical Alert Configuration**

Critical alerts are configured in Azure Monitor for HTTP 5xx rates >5% (immediate response) and >10% (service unavailable). Warning alerts trigger for response times >1,000ms and CPU >80%, with action groups for notification.

**4. KPI Targets**

Application KPIs: response time <200ms (95th percentile), error rate <1%, availability >99.9%. Infrastructure KPIs: CPU <80%, memory <85%. Business metrics include active users, content creation rate, and approval workflow timing.

**5. Incident Severity Matrix**

P0 (critical, system down): 15-minute response, immediate escalation. P1 (high): 1-hour response, 2-hour escalation. P2 (medium): 4-hour response, 8-hour escalation. P3 (low): 24-hour response, 48-hour escalation.

**6. Escalation Paths**

Primary On-Call (Operations Team) for 15-minute response. Secondary On-Call (Development Team) for 30-minute escalation. Manager and EAS Team Lead (Dipesh Trikam) for critical outages. Contact via ops@datacom.com, dev@datacom.com, and #incidents Slack channel.

**7. Backup Strategy**

MongoDB Atlas: daily backups, 7-day retention, point-in-time recovery. Cosmos DB: continuous backup, 7-day retention, geo-redundant. Manual backup procedures documented for both databases.

**8. Scaling Configuration**

Auto-scaling configured for Function App with min 1, max 10 instances. Scaling rules trigger on CPU >70% over 5 minutes. Manual scaling procedures documented for Function App plan and Cosmos DB throughput.

---

## 💡 Proposal

Operators follow a structured three-times-daily checklist using Azure CLI commands, Azure Portal dashboards, and Application Insights queries to maintain system health. All deployments are executed through GitHub Actions pipelines with mandatory smoke tests and automated rollback triggers if error rates spike post-deployment.

---

## ⚠️ Risks

**Placeholder values** Runbook references placeholder values (e.g., `your-subscription-id`, `api.yourdomain.com`) that must be replaced with live production values before use.

**Alert threshold tuning** Some automated alert thresholds (e.g., CPU >80%) may require tuning once real production traffic patterns are established.

**Access dependency** The runbook assumes Azure CLI access is available to on-call staff; role assignments and access provisioning are a prerequisite dependency.

**Manual check scalability** Daily manual checks may not scale if the platform grows significantly — automation of the health check cadence should be considered.

---

## ✅ Next Steps

1. **Replace placeholders** — Replace all placeholder environment values (subscription IDs, resource group names, domain URLs) with production-verified values.
2. **Validate action groups** — Provision and validate Azure Monitor action groups so alerts actually page the on-call team.
3. **Tabletop exercise** — Conduct a tabletop incident-response exercise using the P1/P2 runbook procedures to validate team readiness.
4. **Automate health checks** — Automate the daily health check script as a scheduled Azure Function or GitHub Actions cron job.
5. **Confirm contacts** — Review and confirm escalation contacts are current before go-live.

---

## 🔑 Close

> This runbook is the single source of truth for operating the Datacom Agent Library in production — teams must replace placeholder values and validate alert routing before relying on it in a live incident.

---

## 📡 System Monitoring

**1. Application Health Endpoints**

```bash
# Overall system health
curl -X GET "https://api.yourdomain.com/api/health"

# Individual service health
curl -X GET "https://api.yourdomain.com/api/agents/health"
curl -X GET "https://api.yourdomain.com/api/public-agents/health"
curl -X GET "https://api.yourdomain.com/api/email/health"
```

**2. Application Insights Dashboard**

Navigate to Azure Portal → Application Insights. Check Live Metrics for real-time performance. Review error rates and response times. Verify user activity levels.

**3. Azure Resource Status**

```bash
# Check Function App status
az functionapp show \
  --name "func-datacom-agent-library-prod" \
  --resource-group "rg-datacom-agent-library-prod"

# Check Static Web Apps status
az staticwebapp show \
  --name "swa-datacom-agent-library-client-prod" \
  --resource-group "rg-datacom-agent-library-prod"
```

**4. Performance Metrics**

Target: <200ms for 95% of requests. Check Application Insights → Performance. Review slowest operations. Identify performance bottlenecks. Target error rate: <1%. Review Application Insights → Failures.

---

## 🏥 Health Checks

**1. Morning Health Check (9:00 AM)**

System health verification: application health endpoints, Application Insights dashboard, database health (MongoDB Atlas cluster status, connection pool usage, slow query logs; Cosmos DB via `az cosmosdb show`), Azure resources status.

**2. Cosmos DB Health**

```bash
az cosmosdb show \
  --name "cosmos-datacom-agent-library-prod" \
  --resource-group "rg-datacom-agent-library-prod"
```

**3. Performance Metrics Review**

Response time analysis (target <200ms p95). Error rate monitoring (target <1%). User activity monitoring (active user count, peak usage times, feature usage patterns, engagement metrics).

**4. Afternoon Maintenance (2:00 PM)**

Database maintenance: MongoDB index usage, slow query optimization, storage monitoring, backup verification. Cosmos DB: throughput usage, partition key distribution, storage consumption.

---

## 🚨 Incident Response

**1. Incident Classification**

- P0: Critical — system down. Response: 15 minutes. Escalation: immediate.
- P1: High — major functionality affected. Response: 1 hour. Escalation: 2 hours.
- P2: Medium — minor functionality affected. Response: 4 hours. Escalation: 8 hours.
- P3: Low — cosmetic issues. Response: 24 hours. Escalation: 48 hours.

**2. P0 Critical Incident — Immediate Actions (0–15 min)**

```bash
# Check system status
curl -X GET "https://api.yourdomain.com/api/health"

# Check Azure resource status
az monitor activity-log list \
  --resource-group "rg-datacom-agent-library-prod" \
  --max-events 10
```

Acknowledge incident, assess impact, notify stakeholders, begin investigation.

**3. P0 Investigation — Get Detailed Logs**

```bash
az functionapp logs tail \
  --name "func-datacom-agent-library-prod" \
  --resource-group "rg-datacom-agent-library-prod" \
  --provider "Microsoft.Web/sites"
```

Review Application Insights, Function App logs, database connectivity, external dependencies.

**4. Database Connection Issues**

Symptoms: high error rates, timeout errors, connection pool exhaustion.

```bash
# 1. Check database status
az cosmosdb show \
  --name "cosmos-datacom-agent-library-prod" \
  --resource-group "rg-datacom-agent-library-prod"

# 2. Check connection strings
az functionapp config appsettings list \
  --name "func-datacom-agent-library-prod" \
  --resource-group "rg-datacom-agent-library-prod"

# 3. Restart Function App if needed
az functionapp restart \
  --name "func-datacom-agent-library-prod" \
  --resource-group "rg-datacom-agent-library-prod"
```

**5. Authentication Issues**

Symptoms: users unable to login, JWT validation errors, Azure AD connectivity issues. Check Azure status at https://status.azure.com/. Verify app registration: `az ad app show --id your-client-id`. Verify issuer and audience settings.

**6. Performance Degradation**

```bash
# Check resource utilization
az monitor metrics list \
  --resource "/subscriptions/your-subscription-id/resourceGroups/rg-datacom-agent-library-prod/providers/Microsoft.Web/sites/func-datacom-agent-library-prod" \
  --metric "CpuPercentage,MemoryPercentage" \
  --interval "PT5M"

# Scale up if needed
az functionapp plan update \
  --name "plan-datacom-agent-library-prod" \
  --resource-group "rg-datacom-agent-library-prod" \
  --sku "P2v3"
```

---

## 🗄️ Database Maintenance

**1. MongoDB Index Optimization**

```javascript
// Analyze index usage
db.collection.aggregate([
  { $indexStats: {} }
])

// Remove unused indexes
db.collection.dropIndex("unused_index_name")

// Create new indexes for slow queries
db.collection.createIndex({ "field": 1 })
```

**2. Cosmos DB Optimization**

Review partition key distribution. Optimize query patterns. Monitor RU consumption. Adjust throughput as needed.

**3. Weekly Maintenance**

MongoDB: check index usage, review slow queries, monitor storage, verify backup status. Cosmos DB: check throughput usage, review partition key distribution, monitor storage consumption, verify backup completion.

**4. Monthly Security Review**

Access control audit: review user permissions, check inactive accounts, verify role assignments, update security policies. Vulnerability assessment: run security scans, update dependencies, review security logs.

---

## 📈 Scaling Procedures

**1. Current Usage Analysis**

```bash
# Function App metrics
az monitor metrics list \
  --resource "/subscriptions/your-subscription-id/resourceGroups/rg-datacom-agent-library-prod/providers/Microsoft.Web/sites/func-datacom-agent-library-prod" \
  --metric "CpuPercentage,MemoryPercentage,HttpRequests" \
  --interval "PT1H"

# Database metrics
az cosmosdb sql database show \
  --account-name "cosmos-datacom-agent-library-prod" \
  --resource-group "rg-datacom-agent-library-prod" \
  --name "AgentLibrary"
```

**2. Auto-scaling Configuration**

```bash
# Configure auto-scaling for Function App
az monitor autoscale create \
  --resource-group "rg-datacom-agent-library-prod" \
  --resource "/subscriptions/your-subscription-id/resourceGroups/rg-datacom-agent-library-prod/providers/Microsoft.Web/serverfarms/plan-datacom-agent-library-prod" \
  --resource-type "Microsoft.Web/serverfarms" \
  --name "autoscale-functions" \
  --min-count 1 \
  --max-count 10 \
  --count 2

# Add scaling rule
az monitor autoscale rule create \
  --resource-group "rg-datacom-agent-library-prod" \
  --autoscale-name "autoscale-functions" \
  --condition "Percentage CPU > 70 avg 5m" \
  --scale out 1
```

**3. Manual Scaling**

```bash
# Scale up Function App plan
az functionapp plan update \
  --name "plan-datacom-agent-library-prod" \
  --resource-group "rg-datacom-agent-library-prod" \
  --sku "P2v3"

# Scale Cosmos DB throughput
az cosmosdb sql database throughput update \
  --account-name "cosmos-datacom-agent-library-prod" \
  --resource-group "rg-datacom-agent-library-prod" \
  --database-name "AgentLibrary" \
  --throughput 1000
```

---

## 🔄 Backup & Recovery

**1. Automated Backups**

MongoDB Atlas: daily frequency, 7-day retention, point-in-time recovery enabled. Cosmos DB: continuous backup, 7-day retention, geo-redundant. Application configuration: environment variables, Function App config, Static Web App config.

**2. Manual Backup — MongoDB**

```bash
mongodump --uri="mongodb://prod-connection-string" \
  --db=DatacomChat \
  --out=./backup/$(date +%Y%m%d)
```

**3. Manual Backup — Cosmos DB**

```bash
az cosmosdb sql database export \
  --account-name "cosmos-datacom-agent-library-prod" \
  --resource-group "rg-datacom-agent-library-prod" \
  --database-name "AgentLibrary" \
  --container-name "public-agents" \
  --storage-uri "https://storage-account.blob.core.windows.net/backup/"
```

**4. Database Recovery — MongoDB**

```bash
mongorestore --uri="mongodb://prod-connection-string" \
  --db=DatacomChat \
  ./backup/20240101/DatacomChat
```

**5. Database Recovery — Cosmos DB**

```bash
az cosmosdb sql database import \
  --account-name "cosmos-datacom-agent-library-prod" \
  --resource-group "rg-datacom-agent-library-prod" \
  --database-name "AgentLibrary" \
  --container-name "public-agents" \
  --storage-uri "https://storage-account.blob.core.windows.net/backup/"
```

**6. Application Recovery**

```bash
# Redeploy Function App
az functionapp deployment source config-zip \
  --resource-group "rg-datacom-agent-library-prod" \
  --name "func-datacom-agent-library-prod" \
  --src "function-app.zip"
```

Static Web Apps: use GitHub Actions or Azure CLI.

---

## 📊 Alerting

**1. Critical Alerts (Immediate Response)**

```bash
# High Error Rate Alert
az monitor metrics alert create \
  --name "Critical-High-Error-Rate" \
  --resource-group "rg-datacom-agent-library-prod" \
  --scopes "/subscriptions/your-subscription-id/resourceGroups/rg-datacom-agent-library-prod/providers/Microsoft.Web/sites/func-datacom-agent-library-prod" \
  --condition "avg Percentage Http5xx > 5" \
  --window-size "PT5M" \
  --evaluation-frequency "PT1M" \
  --severity "0" \
  --action "/subscriptions/your-subscription-id/resourceGroups/rg-datacom-agent-library-prod/providers/Microsoft.Insights/actionGroups/ag-datacom-agent-library-prod"

# Service Unavailable Alert
az monitor metrics alert create \
  --name "Critical-Service-Unavailable" \
  --resource-group "rg-datacom-agent-library-prod" \
  --scopes "/subscriptions/your-subscription-id/resourceGroups/rg-datacom-agent-library-prod/providers/Microsoft.Web/sites/func-datacom-agent-library-prod" \
  --condition "avg Percentage Http5xx > 10" \
  --window-size "PT2M" \
  --evaluation-frequency "PT1M" \
  --severity "0" \
  --action "/subscriptions/your-subscription-id/resourceGroups/rg-datacom-agent-library-prod/providers/Microsoft.Insights/actionGroups/ag-datacom-agent-library-prod"
```

**2. Warning Alerts (Monitor and Investigate)**

```bash
# High Response Time Alert
az monitor metrics alert create \
  --name "Warning-High-Response-Time" \
  --resource-group "rg-datacom-agent-library-prod" \
  --scopes "/subscriptions/your-subscription-id/resourceGroups/rg-datacom-agent-library-prod/providers/Microsoft.Web/sites/func-datacom-agent-library-prod" \
  --condition "avg ResponseTime > 1000" \
  --window-size "PT10M" \
  --evaluation-frequency "PT5M" \
  --severity "1" \
  --action "/subscriptions/your-subscription-id/resourceGroups/rg-datacom-agent-library-prod/providers/Microsoft.Insights/actionGroups/ag-datacom-agent-library-prod"

# High CPU Usage Alert
az monitor metrics alert create \
  --name "Warning-High-CPU-Usage" \
  --resource-group "rg-datacom-agent-library-prod" \
  --scopes "/subscriptions/your-subscription-id/resourceGroups/rg-datacom-agent-library-prod/providers/Microsoft.Web/sites/func-datacom-agent-library-prod" \
  --condition "avg CpuPercentage > 80" \
  --window-size "PT15M" \
  --evaluation-frequency "PT5M" \
  --severity "1" \
  --action "/subscriptions/your-subscription-id/resourceGroups/rg-datacom-agent-library-prod/providers/Microsoft.Insights/actionGroups/ag-datacom-agent-library-prod"
```

**3. Operations Dashboard Widgets**

System health overview (status, availability, error rate trend, response time trend). User activity (active users, session duration, feature usage, geographic distribution). Infrastructure metrics (CPU, memory, database performance, storage, network). Business metrics (content creation rate, approval workflow, engagement, popular content).

---

## 📝 Log Management

**1. Application Logs Review**

```bash
# Check Function App logs
az functionapp logs tail \
  --name "func-datacom-agent-library-prod" \
  --resource-group "rg-datacom-agent-library-prod"
```

Review Application Insights logs. Search for error patterns. Check for security events.

**2. Security Log Review**

Review authentication logs. Check for failed login attempts. Monitor API usage patterns. Verify access control compliance.

**3. Log Cleanup (Weekly)**

Configure log retention policies. Archive old logs. Clean up temporary files. Verify backup completion, test restoration, update documentation.

---

## 🚀 Deployment Procedures

**1. Function App Deployment**

```bash
az functionapp deployment source config-zip \
  --resource-group "rg-datacom-agent-library-prod" \
  --name "func-datacom-agent-library-prod" \
  --src "function-app.zip"
```

**2. Static Web Apps**

Use GitHub Actions or Azure CLI for deployment. Blue-green rollouts recommended for zero-downtime releases. Rollback capability to previous versions.

---

## 📞 Escalation & Communication

**1. Primary Contacts**

- Primary On-Call (Operations Team): ops@datacom.com, 15-minute response.
- Secondary On-Call (Development Team): dev@datacom.com, 30-minute escalation.
- Manager (IT Manager): manager@datacom.com, 1-hour escalation.
- Emergency (EAS Team Lead): dipesh.trikam@datacom.com, immediate.

**2. Escalation Matrix**

- P0: Primary On-Call → Manager at 30 minutes.
- P1: Primary On-Call → Secondary On-Call at 2 hours.
- P2: Primary On-Call → Manager at 8 hours.
- P3: Primary On-Call → Manager at 48 hours.

**3. Incident Communication**

Initial notification: email ops@datacom.com, Slack #incidents, phone on-call rotation. Status updates: every 30 minutes for P0, every 2 hours for P1, via #incidents. Resolution: email stakeholders, Slack #incidents, incident report documentation.

---

## 📚 Documentation & Training

**1. Runbook Maintenance**

Monthly reviews: update procedures, add new scenarios, remove outdated information, verify accuracy. Training updates: update materials, conduct team training, verify competency, document lessons learned.

**2. Quarterly Audits**

Compliance review: verify procedure compliance, review audit trails, update documentation, generate reports. Process improvement: identify opportunities, update procedures, implement automation, measure effectiveness.

**3. New Team Member Onboarding**

System overview: architecture, component relationships, data flow, security model. Operational procedures: daily health checks, monitoring, incident response, maintenance. Tools and access: Azure Portal, Application Insights, log analysis tools, communication channels.

---

## 🆘 Emergency Procedures

**1. System Down** — Follow P0 incident response procedures.

**2. Data Loss** — Initiate disaster recovery procedures (database restoration, application recovery).

**3. Security Breach** — Follow security incident response plan.

**4. Performance Crisis** — Implement emergency scaling procedures (scale up Function App plan, increase Cosmos DB throughput).

---

## 🔗 Related Documentation

- **01-overview.md** — System overview and purpose
- **02-architecture.md** — Technical architecture
- **03-getting-started.md** — Development setup
- **04-authentication.md** — Authentication configuration
- **05-api-guide.md** — API reference and integration
- **06-deployment-guide.md** — Production deployment
- **08-troubleshooting.md** — Common issues and solutions

---

📌 **Document Type:** Operations Guide / Runbook
📅 **Last Updated:** 13 September 2025
🔗 **Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40062189618
