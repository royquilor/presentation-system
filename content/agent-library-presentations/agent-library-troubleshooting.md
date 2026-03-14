# Agent Library Troubleshooting Guide

> A structured diagnostic and resolution reference for the most frequent operational problems encountered in the Datacom Agent Library, based on real UAT experience and VNet peering implementation.

**Author:** Dipesh Trikam
**Date:** 13 September 2025
**Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40062222342

---

## 🎯 Context

The Datacom Agent Library is an enterprise-grade AI agent platform (8.5/10 WAF compliant) hosted on Azure Functions, with MongoDB Atlas and CosmosDB backends connected via VNet peering. This guide was produced by Dipesh Trikam from the Datacom EASA team following real issues surfaced during UAT. All procedures validated with 12ms response time architecture. Target audience: support engineers and on-call operators.

---

## 🔍 Problem

During UAT, the team encountered a range of recurring issues spanning authentication failures, database connectivity, API performance degradation, frontend outages, and email delivery failures. A consolidated, searchable troubleshooting guide was needed to reduce mean time to resolution and avoid repeated diagnosis of the same root causes.

---

## 📋 Observations

**1. System Health Status**

UAT environment achieves 12ms average response time (99.8% improvement). Health check endpoint: `https://datacom-agent-library-fa-uat.azurewebsites.net/api/health`. VNet peering (172.21.0.0/16 ↔ 172.19.0.0/16) operational. MongoDB and CosmosDB private connectivity working. 99.9% uptime with comprehensive monitoring.

**2. Authentication Root Causes**

Authentication failures are most commonly caused by expired Azure AD client secrets or misconfigured JWT issuer/audience settings. The fix is to rotate credentials and update Function App app settings. Redirect URI mismatches and token expiration also contribute.

**3. Database Connectivity**

MongoDB connection timeouts were the root cause of the original 5,000ms+ response times. Resolution involved adding Azure Functions outbound IPs to the MongoDB Atlas network allowlist and implementing VNet peering. CosmosDB performance issues (throttling, high RU consumption) are diagnosed via Azure Monitor metrics.

**4. Frontend and Email**

Frontend issues (blank client app, admin access denied) are typically resolved by redeploying via GitHub Actions or correcting Azure AD app role assignments. Email notification failures trace back to stale Azure Communication Services connection strings or unverified sending domains.

**5. Escalation Matrix**

A structured escalation matrix exists: Development Team for code bugs, Infrastructure Team for Azure/network issues, Management for critical outages or security breaches. Emergency contacts: `easaiteam@datacom.com` (primary on-call) and `dipesh.trikam@datacom.com` (emergency).

---

## 💡 Proposal

The guide provides a tiered diagnostic approach: start with the quick health-check script to triage the system, then follow issue-specific procedures (authentication → database → API performance → frontend → email) with paired Azure CLI commands and portal navigation steps. Preventive maintenance procedures (daily health checks, performance alerts) are included to catch issues before users report them.

---

## ⚠️ Risks

**Placeholder values** Several diagnostic commands contain placeholder values (`your-client-id`, `your-subscription-id`) that will fail if copied verbatim without substitution.

**JWT bypass** Enabling the `BYPASS_JWT_VALIDATION=true` flag (listed as a fix option) in non-development environments would completely remove API authentication — this must never be applied to UAT or production.

**Database recovery** MongoDB recovery via `mongorestore` overwrites existing data; operators must confirm backup currency before executing database recovery steps.

**Multi-region gap** The guide does not cover multi-region failover scenarios — if the primary Azure region becomes unavailable, additional runbook content is required.

---

## ✅ Next Steps

1. **Populate placeholders** — Replace all placeholder values with verified production resource names and IDs.
2. **JWT bypass warning** — Add a note explicitly prohibiting the use of `BYPASS_JWT_VALIDATION` outside of local development.
3. **Failover coverage** — Extend the guide to cover multi-region failover and disaster recovery scenarios.
4. **Quarterly reviews** — Schedule quarterly reviews to keep diagnostic commands aligned with any infrastructure changes.
5. **CI/CD integration** — Integrate the health-check script into the CI/CD pipeline as a post-deployment smoke test.

---

## 🔧 Diagnostic Procedures

**1. Quick Health Assessment**

Run these curl commands to assess overall system health. Replace `api.yourdomain.com` with the actual API base URL.

```bash
# 1. Overall system health
curl -X GET "https://api.yourdomain.com/api/health"

# 2. Individual service health
curl -X GET "https://api.yourdomain.com/api/agents/health"
curl -X GET "https://api.yourdomain.com/api/public-agents/health"
curl -X GET "https://api.yourdomain.com/api/email/health"

# 3. Database connectivity
curl -X GET "https://api.yourdomain.com/api/health/database"

# 4. External service connectivity
curl -X GET "https://api.yourdomain.com/api/health/external"
```

**2. Detailed Health Check Script**

Use this bash script for comprehensive health assessment. Captures HTTP status codes, response times, and Azure resource state.

```bash
#!/bin/bash
# health-check.sh

echo "=== Datacom Agent Library Health Check ==="
echo "Timestamp: $(date)"
echo ""

# Check API endpoints
echo "1. API Health Check"
curl -s -o /dev/null -w "Status: %{http_code}, Time: %{time_total}s\n" \
  "https://api.yourdomain.com/api/health"

# Check frontend applications
echo ""
echo "2. Frontend Applications"
curl -s -o /dev/null -w "Client App: %{http_code}\n" \
  "https://your-client-app.azurewebsites.net"
curl -s -o /dev/null -w "Admin App: %{http_code}\n" \
  "https://your-admin-app.azurewebsites.net"

# Check Azure resources
echo ""
echo "3. Azure Resources"
az functionapp show \
  --name "func-datacom-agent-library-prod" \
  --resource-group "rg-datacom-agent-library-prod" \
  --query "state" \
  --output tsv

# Check database connectivity
echo ""
echo "4. Database Connectivity"
# Add database connectivity checks
```

**3. Application Log Analysis**

Function App logs and Application Insights provide the primary diagnostic data. Use KQL queries for aggregation.

```bash
# Function App logs
az functionapp logs tail \
  --name "func-datacom-agent-library-prod" \
  --resource-group "rg-datacom-agent-library-prod" \
  --provider "Microsoft.Web/sites"
```

Application Insights KQL examples:
- `Requests | where timestamp > ago(1h) | summarize count() by bin(timestamp, 5m)`
- `Exceptions | where timestamp > ago(1h) | summarize count() by type`
- `Dependencies | where timestamp > ago(1h) | summarize avg(duration) by target`

**4. Database Log Analysis**

MongoDB Atlas logs: check for connection errors, slow queries, authentication failures. Cosmos DB: use Azure Monitor activity log filtered by resource.

```bash
# Cosmos DB logs
az monitor activity-log list \
  --resource-group "rg-datacom-agent-library-prod" \
  --max-events 50 \
  --query "[?contains(resourceId, 'cosmos')]"
```

---

## 🔐 Authentication Issues

**1. Users Cannot Login**

Symptoms: login page loads but authentication fails; "Invalid credentials" errors; redirect loops.

Diagnostic steps: Check Azure AD app registration with `az ad app show --id your-client-id`. Verify redirect URIs with `az app update`. Check client secret expiration with `az ad app credential list`. Verify API permissions with `az ad app permission list`.

Solutions: Update client secret if expired using `az ad app credential reset --id your-client-id --append`. Update environment variables: `az functionapp config appsettings set --name "func-datacom-agent-library-prod" --resource-group "rg-datacom-agent-library-prod" --settings AZURE_AD_CLIENT_SECRET="new-secret"`. Restart Function App with `az functionapp restart`.

**2. JWT Token Validation Errors**

Symptoms: 401 Unauthorized errors; "Invalid token" messages; token expiration issues.

Diagnostic steps: Check JWT configuration with `az functionapp config appsettings list` filtered by JWT or AZURE_AD. Verify token structure using jwt.io to decode and verify token. Confirm issuer matches `https://login.microsoftonline.com/{tenant-id}/v2.0` and audience matches API scope.

Solutions: Update JWT configuration with correct issuer and audience. Enable JWT bypass for development only (never in UAT/production): `BYPASS_JWT_VALIDATION="true"`. Ensure token expiry is sufficient for user sessions; default is often 1 hour.

```bash
# Update JWT configuration
az functionapp config appsettings set \
  --name "func-datacom-agent-library-prod" \
  --resource-group "rg-datacom-agent-library-prod" \
  --settings \
    JWT_ISSUER="https://login.microsoftonline.com/your-tenant-id/v2.0" \
    JWT_AUDIENCE="api://your-client-id/access_as_user"
```

**3. Redirect URI Mismatch**

Symptoms: "AADSTS50011: The reply URL specified in the request does not match" — user redirected to error page after login.

Fix: Add exact redirect URI to Azure AD app registration Reply URLs. Include trailing slash or not consistently. For SPA, use `https://your-app.azurewebsites.net` and `https://your-app.azurewebsites.net/` if both are used. Update via Azure Portal or `az ad app update --reply-urls`.

**4. Consent Required**

Symptoms: "AADSTS65001: The user or administrator has not consented" — first-time users cannot access app.

Fix: Admin must grant consent for the application in Azure AD. Navigate to Azure AD → Enterprise applications → [App] → Permissions → Grant admin consent. Or use consent URL with `prompt=admin_consent` for admin consent flow.

---

## 🗄️ Database Issues

**1. MongoDB Connection Failures**

Symptoms: database connection timeouts; "Connection refused" errors; high error rates on database operations.

Diagnostic steps: Check MongoDB Atlas cluster status in dashboard. Test connection string: `mongosh "mongodb://connection-string" --eval "db.runCommand('ping')"`. Check network connectivity with telnet. Verify IP whitelist in MongoDB Atlas Network Access.

Solutions: Update connection string in Function App settings. Add Azure Functions outbound IPs to MongoDB whitelist (retrieve with `az functionapp show --query "outboundIpAddresses"`). Restart Function App after changes.

```bash
# Update connection string
az functionapp config appsettings set \
  --name "func-datacom-agent-library-prod" \
  --resource-group "rg-datacom-agent-library-prod" \
  --settings MONGODB_URI="new-connection-string"

# Get Azure Functions outbound IPs for whitelist
az functionapp show \
  --name "func-datacom-agent-library-prod" \
  --resource-group "rg-datacom-agent-library-prod" \
  --query "outboundIpAddresses"
```

**2. Cosmos DB Performance Issues**

Symptoms: slow query responses; high RU consumption; throttling errors.

Diagnostic steps: Check Cosmos DB metrics (TotalRequests, DataUsage) via Azure Monitor. Check partition key distribution in Data Explorer. Review query performance in Application Insights Dependencies. Use `EnableCrossPartitionQuery` sparingly — cross-partition queries consume more RUs.

Solutions: Scale up throughput. Optimize partition key strategy (choose high-cardinality key to distribute load). Add caching layer (e.g. Redis) for frequently accessed data. Use point reads (`readItem`) instead of query when document ID is known — point reads cost fewer RUs.

```bash
# Scale up throughput
az cosmosdb sql database throughput update \
  --account-name "cosmos-datacom-agent-library-prod" \
  --resource-group "rg-datacom-agent-library-prod" \
  --database-name "AgentLibrary" \
  --throughput 1000
```

**3. MongoDB Slow Queries**

Symptoms: specific endpoints slow; database operations taking seconds.

Diagnostic steps: Enable profiling with `db.setProfilingLevel(1, { slowms: 100 })`. Query `db.system.profile` for slow operations. Use `explain("executionStats")` to analyze query plans. Check for missing indexes.

Solutions: Add compound indexes for frequently queried fields. Avoid full collection scans. Use projection to limit returned fields. Consider aggregation pipeline optimization.

---

## ⚡ API Performance Issues

**1. High Response Times**

Symptoms: API responses taking greater than 2 seconds; user complaints about slow performance; timeout errors.

Diagnostic steps: Check Function App performance metrics (ResponseTime, HttpRequests). Check Application Insights Performance for slowest operations, database query performance, external dependency calls. Check resource utilization (CpuPercentage, MemoryPercentage).

Solutions: Scale up Function App plan (e.g. P2v3). Enable auto-scaling with min-count 1, max-count 10. Optimize database queries, add indexes, implement query caching.

```bash
# Scale up Function App plan
az functionapp plan update \
  --name "plan-datacom-agent-library-prod" \
  --resource-group "rg-datacom-agent-library-prod" \
  --sku "P2v3"

# Enable auto-scaling
az monitor autoscale create \
  --resource-group "rg-datacom-agent-library-prod" \
  --resource "/subscriptions/your-subscription-id/resourceGroups/rg-datacom-agent-library-prod/providers/Microsoft.Web/serverfarms/plan-datacom-agent-library-prod" \
  --resource-type "Microsoft.Web/serverfarms" \
  --name "autoscale-functions" \
  --min-count 1 \
  --max-count 10 \
  --count 2
```

**2. High Error Rates**

Symptoms: 5xx error rates greater than 1%; application crashes; user reports of errors.

Diagnostic steps: Check error logs with `az functionapp logs tail`. Check Application Insights Failures for exception types, error patterns, affected operations. Verify external dependencies (Azure AD, MongoDB, Cosmos DB) status.

Solutions: Fix code issues, update error handling, add retry logic. Restart Function App. Rollback to previous version if needed using `az functionapp deployment source show`.

---

## 🌐 Frontend Issues

**1. Client App Not Loading**

Symptoms: blank page or loading spinner; console errors; network request failures.

Diagnostic steps: Check Static Web App status with `az staticwebapp show`. Check build status in Azure Portal. Check environment variables with `az staticwebapp appsettings list`.

Solutions: Redeploy application via GitHub Actions. Update environment variables (e.g. `VITE_BACKEND_URL`). Check CORS configuration on Function App with `az functionapp cors show`.

```bash
# Update environment variables
az staticwebapp appsettings set \
  --name "swa-datacom-agent-library-client-prod" \
  --resource-group "rg-datacom-agent-library-prod" \
  --setting-names \
    VITE_BACKEND_URL="https://func-datacom-agent-library-prod.azurewebsites.net"
```

**2. Admin App Access Denied**

Symptoms: "Access Denied" errors; users cannot access admin features; role-based access issues.

Diagnostic steps: Check user roles in Azure AD with `az ad user show`. Verify app roles with `az ad app show --query "appRoles"`. Check role assignments with `az ad app permission list`.

Solutions: Assign admin role to user. Update user roles in database via admin script. Verify role configuration in Azure AD app registration App roles.

---

## 📧 Email Service Issues

**1. Email Notifications Not Sending**

Symptoms: users not receiving notifications; email service errors; approval workflow delays.

Diagnostic steps: Check Azure Communication Services with `az communication list`. Verify connection string in Function App settings (filter by COMMUNICATION). Test email endpoint with curl POST.

```bash
# Test email endpoint
curl -X POST "https://api.yourdomain.com/api/email/test" \
  -H "Authorization: Bearer your-token" \
  -H "Content-Type: application/json" \
  -d '{"to": "test@datacom.com", "subject": "Test", "body": "Test email"}'
```

Solutions: Update Azure Communication Services connection string. Verify domain verification in Azure Communication Services Domains. Test email template configuration.

```bash
# Update connection string
az functionapp config appsettings set \
  --name "func-datacom-agent-library-prod" \
  --resource-group "rg-datacom-agent-library-prod" \
  --settings AZURE_COMMUNICATION_SERVICES_CONNECTION_STRING="new-connection-string"
```

---

## 🔧 Advanced Troubleshooting

**1. Database Query Optimization**

MongoDB slow query analysis: enable profiling, inspect slow queries, analyze execution stats.

```javascript
// MongoDB slow query analysis
db.setProfilingLevel(1, { slowms: 100 })

// Check slow queries
db.system.profile.find({ millis: { $gt: 100 } }).sort({ ts: -1 })

// Analyze query performance
db.collection.explain("executionStats").find({ query: "criteria" })
```

**2. Application Performance Analysis**

Enable detailed logging and buffer logs. Monitor real-time performance with `az functionapp logs tail --follow`.

```bash
# Enable detailed logging
az functionapp config appsettings set \
  --name "func-datacom-agent-library-prod" \
  --resource-group "rg-datacom-agent-library-prod" \
  --settings \
    WEBSITE_ENABLE_APP_SERVICE_STORAGE=true \
    WEBSITE_LOG_BUFFERING_ENABLED=true
```

**3. Security Audit**

Run `npm audit` for vulnerabilities. Review access logs with Azure Monitor activity log filtered by Delete or Update operations. Check Azure AD sign-in logs.

**4. Network Security**

Check NSG rules and firewall rules to verify network isolation and allowlist configuration.

```bash
# Check network security groups
az network nsg rule list \
  --resource-group "rg-datacom-agent-library-prod" \
  --nsg-name "nsg-functions-prod"

# Verify firewall rules
az network firewall rule list \
  --resource-group "rg-datacom-agent-library-prod" \
  --firewall-name "fw-datacom-agent-library-prod"
```

---

## 🛠️ Maintenance Procedures

**1. Preventive Maintenance — Daily Health Checks**

Run health-check script, check disk space (`df -h`), memory usage (`free -h`), running processes (`ps aux | grep node`), and error logs (`tail -n 100 /var/log/application.log`).

**2. Performance Monitoring Alerts**

Create Azure Monitor metrics alert for ResponseTime greater than 1000ms over 10-minute window, evaluated every 5 minutes.

```bash
az monitor metrics alert create \
  --name "Performance-Alert" \
  --resource-group "rg-datacom-agent-library-prod" \
  --scopes "/subscriptions/your-subscription-id/resourceGroups/rg-datacom-agent-library-prod/providers/Microsoft.Web/sites/func-datacom-agent-library-prod" \
  --condition "avg ResponseTime > 1000" \
  --window-size "PT10M" \
  --evaluation-frequency "PT5M"
```

**3. Application Recovery**

Restart Function App. Redeploy via zip: `az functionapp deployment source config-zip`. Rollback using `az functionapp deployment source show`.

**4. Database Recovery**

MongoDB: `mongorestore --uri="mongodb://connection-string" --db=DatacomChat ./backup/DatacomChat`. Cosmos DB: use `az cosmosdb sql database import` with storage URI pointing to backup blob. Always verify backup timestamp and integrity before restore. Consider point-in-time restore for Cosmos DB if configured.

**5. Daily Health Check Script**

Automate daily checks with cron or Azure Automation. Script should: run health-check.sh, capture output to log, send alert if any check fails. Retain logs for 30 days for trend analysis.

```bash
#!/bin/bash
# daily-health-check.sh
./health-check.sh
df -h
free -h
ps aux | grep node
tail -n 100 /var/log/application.log
```

---

## ⚠️ Common False Positives and Non-Issues

**1. "Slow" first request after idle**

Azure Functions consumption plan scales to zero; first request after idle incurs cold start (often 5–15 seconds). This is expected. Use Premium plan with pre-warmed instances if unacceptable.

**2. Intermittent 502 during deployment**

Brief 502 errors during slot swap or deployment are normal. Retry after 1–2 minutes. If persistent, rollback deployment.

**3. Application Insights sampling**

High-volume apps may use sampling; not every request is logged. Adjust sampling rate in Application Insights if needed for debugging. Sampling does not affect metrics aggregation.

**4. User reports "not working" with no error**

Often browser cache, incorrect URL, or user error. Ask user to hard refresh (Ctrl+Shift+R), clear cache, try incognito. Verify they are on correct environment (UAT vs prod).

**5. MongoDB "connection pool exhausted"**

Under high load, connection pool may fill. Tune `maxPoolSize` in connection string. Ensure connections are released properly; check for connection leaks in code.

---

## 🐛 Network and Deployment Issues

**1. VNet Peering Connectivity**

If MongoDB or CosmosDB connectivity fails after deployment, verify VNet peering between 172.21.0.0/16 and 172.19.0.0/16. Check private endpoints and DNS resolution. Ensure Function App is deployed in the correct VNet-integrated subnet.

**2. CORS and Cross-Origin Errors**

Frontend requests blocked by CORS: add client and admin app URLs to Function App CORS allowlist. Use `az functionapp cors add` to add origins. Verify `Access-Control-Allow-Origin` headers in response.

**3. Deployment Failures**

GitHub Actions build failures: check build logs, verify Node.js version, ensure environment secrets are set. Static Web App deployment: verify `staticwebapp.config.json` and routing rules. Function App: check deployment slot configuration and startup commands.

**4. Cold Start and Timeout**

Azure Functions cold start causing timeouts: consider Premium plan with pre-warmed instances, or increase timeout in host.json. For long-running operations, implement async patterns or queue-based processing.

---

## 🚨 Specific Error Messages and Solutions

**1. "MongoServerSelectionError: connection refused"**

MongoDB Atlas is rejecting the connection. Causes: IP not whitelisted, wrong connection string, cluster paused. Fix: add Azure Functions outbound IPs to MongoDB Atlas Network Access, verify connection string includes correct cluster host and credentials, ensure cluster is running.

**2. "429 Too Many Requests" or "Request rate is large"**

Cosmos DB throttling due to RU exhaustion. Fix: scale up throughput temporarily, optimize queries to reduce RU consumption, add retry logic with exponential backoff, consider partitioning strategy to distribute load.

**3. "401 Unauthorized" or "Invalid token"**

JWT validation failure. Causes: expired token, wrong issuer/audience, clock skew. Fix: verify `JWT_ISSUER` and `JWT_AUDIENCE` match Azure AD app registration, ensure client refreshes token before expiry, check server clock synchronization.

**4. "ECONNREFUSED" or "ETIMEDOUT"**

Network connectivity failure. Causes: firewall blocking, wrong host/port, VNet misconfiguration. Fix: verify NSG rules allow outbound traffic to MongoDB/Cosmos DB ports, check VNet integration, validate DNS resolution for private endpoints.

**5. "CORS policy: No 'Access-Control-Allow-Origin' header"**

Browser blocking cross-origin requests. Fix: add frontend origin to Function App CORS allowlist, ensure preflight OPTIONS requests return correct headers, verify backend URL in frontend environment variables.

**6. "Application Error" or blank React app**

Frontend build or runtime failure. Causes: missing env vars, API URL misconfigured, JavaScript errors. Fix: check browser console for stack traces, verify `VITE_BACKEND_URL` or equivalent, redeploy Static Web App, validate build output.

**7. "Failed to fetch" or "Network Error"**

Frontend cannot reach backend. Causes: wrong API URL, CORS, backend down, SSL certificate issues. Fix: verify backend health endpoint, check CORS configuration, ensure HTTPS and valid certificates.

**8. "Connection string is invalid" (Azure Communication Services)**

Email service cannot connect. Fix: regenerate connection string in Azure Portal, update Function App app settings, restart Function App. Verify domain is verified for sending.

**9. "Insufficient privileges" or "Access Denied"**

User lacks required Azure AD app role. Fix: assign correct app role in Azure AD app registration, ensure user has accepted consent, verify role claims in token.

**10. "Function host is not running"**

Azure Functions runtime not started. Causes: deployment failure, configuration error, resource exhaustion. Fix: check deployment logs, verify `WEBSITE_RUN_FROM_PACKAGE` or deployment source, restart Function App, scale up if memory/CPU constrained.

**11. "The resource is locked"**

Azure resource lock preventing changes. Fix: remove lock with `az lock delete` or request lock removal from resource owner. Identify lock with `az lock list --resource-group rg-datacom-agent-library-prod`.

**12. "Subscription quota exceeded"**

Azure subscription limits reached (e.g. vCPU, storage). Fix: request quota increase via Azure Portal Support, or scale down non-critical resources. Check usage in Cost Management + Billing.

---

## ☁️ Azure Platform Issues

**1. Function App Stuck in "Starting" or "Stopped"**

Causes: deployment in progress, configuration error, platform incident. Fix: wait 5 minutes for deployment; check Activity Log for errors; restart via Portal or CLI; check Azure status page for outages.

**2. Outbound IP Changes**

Azure Functions outbound IPs can change when scaling or redeploying. If MongoDB/Cosmos DB uses IP allowlist, consider: using VNet integration with static outbound IP, or Azure NAT Gateway, or switching to service endpoint / private link for stable connectivity.

**3. App Service Plan Scaling Limits**

Consumption plan has concurrency limits. Premium/Dedicated plans have instance limits. If scaling fails, check plan quota. Use `az appservice plan list` to verify SKU and capacity.

**4. Storage Account Throttling**

Function App uses Azure Storage for triggers and state. If storage throttles, functions may fail. Fix: use Premium storage, or separate storage account for high-throughput scenarios. Check storage metrics for throttling errors.

---

## 📊 Logging and Monitoring

**1. Application Insights Queries**

Use these KQL queries for common diagnostics. Replace time range as needed.

```kusto
// Failed requests in last hour
requests
| where timestamp > ago(1h) and success == false
| project timestamp, name, resultCode, duration, url
| order by timestamp desc

// Exceptions by type
exceptions
| where timestamp > ago(24h)
| summarize count() by type, outerMessage
| order by count_ desc

// Slow dependencies
dependencies
| where timestamp > ago(1h) and duration > 1000
| project timestamp, name, target, duration, resultCode
| order by duration desc

// Request rate by endpoint
requests
| where timestamp > ago(1h)
| summarize count() by bin(timestamp, 5m), name
| render timechart
```

**2. Function App Log Levels**

Set log level via app settings for verbose debugging. Use `WEBSITE_HTTPLOGGING_RETENTION_DAYS` to control log retention. For production, avoid `Debug` level due to performance impact.

```bash
az functionapp config appsettings set \
  --name "func-datacom-agent-library-prod" \
  --resource-group "rg-datacom-agent-library-prod" \
  --settings LOGGING_LOGLEVEL_DEFAULT="Information"
```

**3. Custom Metrics and Alerts**

Create custom metrics for business KPIs (e.g. agent invocation count, approval latency). Use Application Insights TrackMetric or TrackEvent. Configure alerts for threshold breaches.

---

## 🌍 Environment-Specific Issues

**1. UAT vs Production Differences**

UAT uses `datacom-agent-library-fa-uat.azurewebsites.net`; production uses different hostname. Ensure environment variables, connection strings, and Azure AD app registrations are configured per environment. Never mix UAT and production credentials.

**2. Local Development**

Local development may require `BYPASS_JWT_VALIDATION=true` or mock auth. Use `func start` with correct `local.settings.json`. Ensure MongoDB/Cosmos DB connection strings point to dev instances or emulators. CORS must include `http://localhost:*` for local frontend.

**3. Staging Slots**

Azure Functions deployment slots allow blue-green deployments. Verify slot-specific app settings (e.g. different MongoDB database name). Test slot swap before production. Slot-specific connection strings prevent accidental production data access from staging.

---

## 🔒 Security Troubleshooting

**1. Certificate and SSL Issues**

"Certificate has expired" or "SSL handshake failed": renew App Service certificate, verify custom domain binding, ensure TLS 1.2 minimum. Check Azure Key Vault references if using managed certificates.

**2. Secret Rotation**

When rotating Azure AD client secret, Cosmos DB key, or MongoDB password: update all consumers simultaneously or use overlapping validity. Function App picks up app setting changes on next cold start; consider restart to force immediate reload.

**3. Unauthorized Access Attempts**

Review Azure AD sign-in logs for failed attempts. Check Application Insights for 401/403 patterns. Verify IP restrictions if configured. Ensure no sensitive data in logs (redact tokens, PII).

---

## 📦 Dependency and Package Issues

**1. npm Audit Vulnerabilities**

Run `npm audit` and `npm audit fix` before deployment. Critical/high vulnerabilities may block production deployment per policy. Update dependencies regularly; pin versions in `package-lock.json` for reproducibility.

**2. Node.js Version Mismatch**

Azure Functions uses Node 18 or 20 LTS. Ensure `engines.node` in package.json matches. Local Node 22 may cause subtle runtime differences. Use `.nvmrc` or `.node-version` for team consistency.

**3. Missing Environment Variables**

Function fails with "undefined" or "Cannot read property of undefined": check that all required env vars are set in Function App configuration. Use `local.settings.json` for local dev (excluded from git). Validate required vars at startup.

---

## 🔄 Retry and Resilience

**1. Transient Failures**

Implement retry with exponential backoff for MongoDB, Cosmos DB, and external API calls. Use `@azure/cosmos` retry options. For MongoDB, enable `retryWrites=true` in connection string. Log retry attempts for monitoring.

**2. Circuit Breaker Pattern**

For repeatedly failing dependencies, consider circuit breaker to avoid cascading failures. Open circuit after N consecutive failures; half-open after cooldown to test recovery. Integrate with Application Insights for visibility.

**3. Graceful Degradation**

When email service is down, queue notifications for later. When Cosmos DB is throttled, return cached or partial data if acceptable. Document fallback behavior in API contracts.

---

## 📞 Support Escalation

**Escalate to Development Team:** Code-related bugs, performance optimization, feature requests, architecture changes.

**Escalate to Infrastructure Team:** Azure resource issues, network connectivity problems, security incidents, capacity planning.

**Escalate to Management:** Critical system outages, security breaches, compliance issues, resource allocation.

**Escalation procedure:** Document the issue (description, impact, steps taken). Contact appropriate team per escalation matrix. Provide context (logs, error messages, diagnostic information). Follow up and track resolution progress.

```bash
# Document the issue
echo "Issue: $ISSUE_DESCRIPTION" > incident-report.txt
echo "Impact: $IMPACT_LEVEL" >> incident-report.txt
echo "Steps taken: $STEPS_TAKEN" >> incident-report.txt
```

---

## 🆘 Getting Help

**Self-service:** Documentation, Application Insights, Azure Portal, Function App logs, health-check scripts.

**Contact:** Operations Team (immediate issues), Development Team (code problems), Infrastructure Team (Azure/network), Management (critical incidents).

**Emergency contacts:** Primary on-call `easaiteam@datacom.com`, Emergency `dipesh.trikam@datacom.com`.

---

## 🗺️ Troubleshooting Decision Flow

**Step 1: Health check** — Run `curl https://datacom-agent-library-fa-uat.azurewebsites.net/api/health`. If 200 OK, proceed to symptom-specific flow. If 5xx, check Function App state and logs.

**Step 2: Auth vs data vs frontend** — 401/403 → authentication section. 500/502/503 → API or database section. Blank page / CORS → frontend section.

**Step 3: Database vs API** — If health/database endpoint fails → MongoDB/Cosmos DB section. If health OK but specific endpoints slow/failing → API performance or dependency section.

**Step 4: Logs** — Application Insights for exceptions and dependencies. Function App logs for startup and runtime errors. MongoDB Atlas / Cosmos DB metrics for backend health.

**Step 5: Escalate** — If unresolved after 30 minutes of diagnosis, document and escalate per matrix. Include: symptom, steps taken, error messages, timestamp, affected users.

---

## 📋 Quick Reference — Resource Names

- **Function App (Prod):** `func-datacom-agent-library-prod`
- **Function App (UAT):** `datacom-agent-library-fa-uat`
- **Resource Group:** `rg-datacom-agent-library-prod`
- **Cosmos DB Account:** `cosmos-datacom-agent-library-prod`
- **Static Web App (Client):** `swa-datacom-agent-library-client-prod`
- **App Service Plan:** `plan-datacom-agent-library-prod`
- **VNet CIDRs:** 172.21.0.0/16, 172.19.0.0/16

---

## 🔗 Related Documentation

- **01-overview.md** — System overview and purpose
- **02-architecture.md** — Technical architecture
- **03-getting-started.md** — Development setup
- **04-authentication.md** — Authentication configuration
- **05-api-guide.md** — API reference and integration
- **06-deployment-guide.md** — Production deployment
- **07-operations-runbook.md** — Operations and maintenance

---

## 🔑 Close

> The most impactful lesson from UAT is that nearly all performance and connectivity issues traced back to network/VNet misconfiguration — ensuring VNet peering and private endpoint connectivity are verified first saves significant troubleshooting time.

Verify network and VNet configuration before diving into application-level diagnostics. The 12ms response time was achieved only after resolving MongoDB whitelist and VNet peering; similar issues will recur if new deployments or regions are added without updating network allowlists.

---

📌 **Document Type:** Troubleshooting Guide
📅 **Last Updated:** 13 September 2025
🔗 **Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40062222342
