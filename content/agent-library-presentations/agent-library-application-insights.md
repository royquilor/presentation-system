# Application Insights Implementation

> Comprehensive Azure Application Insights telemetry across the Datacom Agent Library — real-time monitoring, error tracking, performance analytics, and user behaviour insights.

**Author:** Dipesh Trikam
**Date:** 25 November 2025
**Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40450850911

---

## 🎯 Context

The Datacom Agent Library consists of two React frontends (Admin App and Client App) and an Azure Functions backend API. The EASA team implemented Application Insights telemetry across all three tiers to provide real-time observability, error tracking, performance analytics, and user behaviour insights ahead of the production launch in November 2025. The implementation covers all four environments: local, develop, UAT, and production. Core infrastructure is production-ready with automatic telemetry fully active.

---

## 🔍 Problem

Without structured telemetry, the team had limited visibility into how users were interacting with the platform, which errors were occurring in production, and whether API performance targets were being sustained over time. A monitoring blind spot at this stage of the project would make it difficult to diagnose incidents, track adoption, or detect regressions after deployments. The platform needed a comprehensive observability layer before go-live.

---

## 📋 Observations

**1. Production-ready core infrastructure**

Automatic telemetry for page views, exceptions, traces, HTTP requests, and API dependencies is fully active across both frontend apps and the Azure Functions backend. No feature code changes were required for the core instrumentation layer.

**2. Frontend integration stack**

Uses `@microsoft/applicationinsights-web` and `@microsoft/applicationinsights-react-js`. User context is automatically populated from Azure AD authentication. React Router handles automatic page view tracking via `useAppInsights` hook. ErrorBoundary and Logger send exceptions and traces to Application Insights.

**3. Backend integration**

Exceptions and all HTTP request/response pairs are automatically captured via `api/host.json` configuration. A shared `api/shared/telemetry.js` helper module is ready for custom event tracking. All endpoints benefit from automatic request/dependency tracking.

**4. Planned custom events catalogue**

Over 30 business events are defined (infrastructure ready, not yet implemented): `AgentApproved`, `AgentRejected`, `AgentSubmitted`, `AgentRated`, `UserRoleChanged`, `PromptApproved`, `CategoryCreated`, and more across Admin App, Client App, and API endpoints.

**5. Sampling configuration**

10% for events (page views, custom events, traces) for cost control; 100% for exceptions so no errors are missed. Provides statistically valid trend data while reducing ingestion costs by approximately 90%.

**6. Ready-to-run KQL queries**

Over 20 documented queries answer common questions: slowest API endpoints, daily unique users, error trends, bounce rates, authentication success rates, performance regressions, dependency failures, and system health snapshots.

**7. Environment configuration**

All 6 GitHub Actions deployment workflows were updated to pass per-environment `VITE_APPINSIGHTS_CONNECTION_STRING` variables. Telemetry is active from day one in local, develop, UAT, and production.

**8. No dashboards or alerts yet**

Data is being collected but no Application Insights dashboards or automated alerts have been configured. Operationalisation of the telemetry data remains a next step.

---

## 💡 Proposal

The implementation adopts a two-phase approach: ship the automatic instrumentation layer first (zero code changes required in feature code), then incrementally add custom business events to individual pages and API endpoints as a lower-priority enhancement. This allows the team to gain immediate observability value without blocking any feature work, with the custom event catalogue serving as a prioritised backlog for future sprints.

---

## ⚠️ Risks

**Custom events not implemented** — The 30+ planned custom events are not yet implemented. Without them, key business metrics (e.g., how many agents were approved this week, which categories are most popular) cannot be tracked in Application Insights.

**Sampling caveat** — At 10% event sampling, absolute event counts in dashboards will appear 10× lower than actual traffic. This must be communicated to any stakeholder interpreting the data.

**No alerts or dashboards** — No Application Insights alerts or dashboards have been configured yet. The data is being collected but there are no automated notifications for anomalies or threshold breaches.

**Backend helper not wired** — The telemetry helper module (`api/shared/telemetry.js`) is ready but not yet called from any API endpoint. Backend custom events will not appear until wired in.

**Cost monitoring** — Application Insights ingestion costs should be monitored in Azure Portal; sampling helps but high traffic may still incur significant cost.

---

## ✅ Next Steps

1. **Implement high-priority custom events** — Add `AgentApproved`, `AgentRejected`, `UserRoleChanged` in the admin app and `AgentSubmitted`, `AgentSearch` in the client app.

2. **Configure dashboards and alerts** — Set up Application Insights dashboards and alerts (e.g., error rate spike, p95 response time regression) to operationalise the telemetry data.

3. **Wire backend telemetry** — Integrate the `telemetry.js` helper into key API endpoints (`/api/approval`, `/api/agents`, `/api/users`) for server-side business event tracking.

4. **Document sampling caveat** — Add the 10% sampling caveat to any operational or stakeholder reporting that references Application Insights event counts.

5. **Add DatabaseQueryTime metrics** — Instrument Cosmos DB query paths with `DatabaseQueryTime` custom metrics so slow database operations can be tracked independently of overall API response time.

6. **Set up recommended dashboards** — Create dashboards for user engagement, error trends, performance, and system health using the documented KQL queries.

7. **Configure alert rules** — Define alert rules for critical errors, performance regressions, and dependency failures.

---

## 🔑 Close

> The automatic telemetry foundation is fully operational and provides immediate value for error monitoring and performance tracking — but the platform will not achieve full business observability until the planned custom events backlog is implemented and dashboard alerts are configured.

---

## 📊 Active Telemetry (Currently Tracked)

**1. Page Views**

- **Source:** Admin App & Client App
- **Properties:** `pageName`, `userEmail`, `isAuthenticated`, `appType`, `environment`
- **Status:** Active

**2. Exceptions — Frontend ErrorBoundary**

- **Source:** React ErrorBoundary
- **Properties:** `errorMessage`, `errorStack`, `componentName`, `route`, `appType`
- **Status:** Active

**3. Exceptions — Frontend Logger**

- **Source:** Logger utility
- **Properties:** `source`, `data`, `severityLevel`, `appType`
- **Status:** Active

**4. Exceptions — Backend Azure Functions**

- **Source:** Azure Functions runtime
- **Properties:** `error.message`, `error.stack`, `endpoint`, `properties`
- **Status:** Active

**5. Traces — Frontend Logger**

- **Source:** Logger utility
- **Properties:** `message`, `severityLevel`, `source`, `appType`
- **Status:** Active

**6. Requests — Backend Azure Functions**

- **Source:** Azure Functions HTTP triggers
- **Properties:** `method`, `url`, `statusCode`, `duration`, `responseTime`
- **Status:** Active

**7. Dependencies — Frontend API Calls**

- **Source:** Axios/fetch interceptors
- **Properties:** `name`, `type`, `data`, `duration`, `success`
- **Status:** Active

---

## 📋 Planned Custom Events — Admin App

**1. AgentApproved** — AgentManagement.tsx — `agentId`, `agentName`, `category`, `adminUser`, `timestamp` — High

**2. AgentRejected** — AgentManagement.tsx — `agentId`, `agentName`, `category`, `adminUser`, `reason`, `timestamp` — High

**3. PromptApproved** — PromptManagement.tsx — `promptId`, `promptName`, `category`, `adminUser`, `timestamp` — High

**4. PromptRejected** — PromptManagement.tsx — `promptId`, `promptName`, `category`, `adminUser`, `reason`, `timestamp` — High

**5. UserRoleChanged** — UserManagement.tsx — `userId`, `oldRole`, `newRole`, `changedBy`, `timestamp` — High

**6. CategoryCreated** — CategoryManagement.tsx — `categoryValue`, `categoryLabel`, `adminUser`, `timestamp` — Medium

**7. CategoryDeleted** — CategoryManagement.tsx — `categoryValue`, `categoryLabel`, `adminUser`, `timestamp` — Medium

**8. CategoryApproved** — CategoryManagement.tsx — `categoryValue`, `categoryLabel`, `adminUser`, `timestamp` — Medium

**9. AuditLogExported** — AuditDashboard.tsx — `format`, `filterCount`, `dateRange`, `adminUser`, `timestamp` — Medium

**10. FilterApplied** — Multiple Pages — `filterType`, `filterValue`, `pageName`, `userEmail` — Low

---

## 📋 Planned Custom Events — Client App

**1. AgentSearch** — agent-directory.tsx — `searchQuery`, `categoryFilter`, `resultsCount`, `pageName`, `userEmail` — High

**2. AgentSubmitted** — agent-submission.tsx — `agentId`, `category`, `sharingType`, `hasInstructions`, `userEmail`, `timestamp` — High

**3. PromptSubmitted** — agent-submission.tsx — `promptId`, `category`, `sharingType`, `userEmail`, `timestamp` — High

**4. AgentSharingChanged** — my-agents.tsx — `agentId`, `oldSharing`, `newSharing`, `userEmail`, `timestamp` — Medium

**5. AgentRated** — agent-directory.tsx — `agentId`, `rating`, `previousRating`, `userEmail`, `timestamp` — Medium

**6. CategoryFilterApplied** — Multiple Pages — `category`, `resultsCount`, `pageName`, `userEmail` — Low

**7. AgentViewed** — agent-directory.tsx — `agentId`, `agentName`, `category`, `userEmail`, `timestamp` — Low

**8. AgentCopied** — agent-directory.tsx — `agentId`, `agentName`, `category`, `userEmail`, `timestamp` — Low

---

## 📋 Planned Custom Events — Backend API

**1. AgentApproved** — `/api/approval` — `agentId`, `adminUser`, `category`, `reason` — High

**2. AgentRejected** — `/api/approval` — `agentId`, `adminUser`, `category`, `reason` — High

**3. PromptApproved** — `/api/approval` — `promptId`, `adminUser`, `reason` — High

**4. PromptRejected** — `/api/approval` — `promptId`, `adminUser`, `reason` — High

**5. UserRoleChanged** — `/api/users/:id` — `userId`, `oldRole`, `newRole`, `changedBy` — High

**6. UserCreated** — `/api/users` — `email`, `role` — Medium

**7. AgentSubmitted** — `/api/agents` — `agentId`, `category`, `sharingType`, `userEmail` — Medium

**8. PromptSubmitted** — `/api/prompts` — `promptId`, `category`, `sharingType`, `userEmail` — Medium

**9. CategoryCreated** — `/api/categories` — `categoryValue`, `categoryLabel`, `adminUser` — Medium

**10. CategoryDeleted** — `/api/categories/:id` — `categoryValue`, `categoryLabel`, `adminUser` — Medium

**11. CategoryApproved** — `/api/categories/:id/approve` — `categoryValue`, `categoryLabel`, `adminUser` — Medium

---

## 📋 Planned Performance Metrics

**1. ApiResponseTime** — All API Endpoints — Response time in milliseconds — High

**2. DatabaseQueryTime** — Cosmos DB Operations — Query execution time in milliseconds — High

**3. PageLoadTime** — Frontend Pages — Page load time in milliseconds — Medium

**4. SearchQueryTime** — Search Endpoints — Search execution time in milliseconds — Medium

---

## 🔍 KQL Queries — User Engagement

**1. Which pages are most visited?**

```kql
pageViews
| where timestamp > ago(7d)
| summarize count() by name
| order by count_ desc
| take 10
```

**How to use:** Go to Application Insights → Logs → Run query → Shows top 10 pages by visit count.

**2. How many unique users per day/week/month?**

```kql
pageViews
| where timestamp > ago(30d)
| summarize uniqueUsers = dcount(user_AuthenticatedId) by bin(timestamp, 1d)
| render timechart
```

**How to use:** Shows daily unique user count over the last 30 days as a chart.

**3. What is the average session duration?**

```kql
pageViews
| where timestamp > ago(7d)
| summarize avgDuration = avg(duration), maxDuration = max(duration), minDuration = min(duration)
```

**How to use:** Shows average, max, and min session durations.

**4. Which routes have the highest bounce rate?**

```kql
pageViews
| where timestamp > ago(7d)
| summarize totalViews = count(), singlePageViews = countif(duration < 10s)
| extend bounceRate = (singlePageViews * 100.0) / totalViews
| order by bounceRate desc
| take 10
```

**How to use:** Identifies pages where users leave quickly (bounce rate).

**5. What is the user authentication success rate?**

```kql
pageViews
| where timestamp > ago(7d)
| summarize total = count(), authenticated = countif(customDimensions.isAuthenticated == "true")
| extend authRate = (authenticated * 100.0) / total
```

**How to use:** Shows percentage of page views from authenticated users.

---

## 🔍 KQL Queries — Error Monitoring

**1. What errors are occurring and how frequently?**

```kql
exceptions
| where timestamp > ago(24h)
| summarize count() by type, outerMessage
| order by count_ desc
| take 20
```

**How to use:** Lists top 20 errors by frequency with error type and message.

**2. Which pages/components have the most errors?**

```kql
exceptions
| where timestamp > ago(7d)
| extend pageName = tostring(customDimensions.route)
| summarize count() by pageName
| order by count_ desc
| take 10
```

**How to use:** Identifies which pages/components are experiencing the most errors.

**3. What are the error patterns over time?**

```kql
exceptions
| where timestamp > ago(7d)
| summarize errorCount = count() by bin(timestamp, 1h)
| render timechart
```

**How to use:** Shows error trends over time as a line chart.

**4. Are errors increasing or decreasing?**

```kql
exceptions
| where timestamp > ago(14d)
| summarize errorCount = count() by bin(timestamp, 1d)
| extend dayOfWeek = dayofweek(timestamp)
| summarize avgErrors = avg(errorCount), recentAvg = avgif(errorCount, timestamp > ago(7d)), previousAvg = avgif(errorCount, timestamp between (ago(14d) .. ago(7d)))
| extend trend = recentAvg - previousAvg
```

**How to use:** Compares recent 7-day average with previous 7-day average to identify trends.

**5. Which users are experiencing errors?**

```kql
exceptions
| where timestamp > ago(7d)
| extend userEmail = tostring(customDimensions.userEmail)
| summarize errorCount = count() by userEmail
| order by errorCount desc
| take 20
```

**How to use:** Identifies users experiencing the most errors (for support follow-up).

---

## 🔍 KQL Queries — Performance

**1. What are the slowest API endpoints?**

```kql
requests
| where timestamp > ago(24h)
| where success == true
| summarize avgDuration = avg(duration), maxDuration = max(duration), count() by name
| order by avgDuration desc
| take 20
```

**How to use:** Lists API endpoints sorted by average response time.

**2. What is the average API response time?**

```kql
requests
| where timestamp > ago(24h)
| summarize avgResponseTime = avg(duration), p95ResponseTime = percentile(duration, 95), p99ResponseTime = percentile(duration, 99)
```

**How to use:** Shows overall API performance metrics (average, 95th percentile, 99th percentile).

**3. Which pages load the slowest?**

```kql
pageViews
| where timestamp > ago(7d)
| summarize avgLoadTime = avg(duration), maxLoadTime = max(duration), count() by name
| order by avgLoadTime desc
| take 10
```

**How to use:** Identifies slow-loading pages for optimization.

**4. Are there performance regressions?**

```kql
requests
| where timestamp > ago(14d)
| summarize avgDuration = avg(duration) by bin(timestamp, 1d), name
| extend dayOfWeek = dayofweek(timestamp)
| summarize recentAvg = avgif(avgDuration, timestamp > ago(7d)), previousAvg = avgif(avgDuration, timestamp between (ago(14d) .. ago(7d))) by name
| extend regression = recentAvg - previousAvg
| where regression > 100
| order by regression desc
```

**How to use:** Identifies endpoints that have slowed down by more than 100ms.

**5. What is the API success/failure rate?**

```kql
requests
| where timestamp > ago(24h)
| summarize total = count(), success = countif(success == true), failed = countif(success == false)
| extend successRate = (success * 100.0) / total, failureRate = (failed * 100.0) / total
```

**How to use:** Shows overall API reliability metrics.

---

## 🔍 KQL Queries — System Health

**1. What is the overall system health?**

```kql
requests
| where timestamp > ago(1h)
| summarize
    totalRequests = count(),
    successRate = (countif(success == true) * 100.0) / count(),
    avgResponseTime = avg(duration),
    errorRate = (countif(success == false) * 100.0) / count()
```

**How to use:** Provides a quick health check snapshot.

**2. Are there any dependency failures?**

```kql
dependencies
| where timestamp > ago(24h)
| where success == false
| summarize count() by name, type
| order by count_ desc
```

**How to use:** Identifies external dependencies (APIs, databases) that are failing.

**3. What is the uptime/downtime?**

```kql
requests
| where timestamp > ago(7d)
| summarize
    totalRequests = count(),
    successfulRequests = countif(success == true),
    failedRequests = countif(success == false)
| extend uptimePercentage = (successfulRequests * 100.0) / totalRequests
```

**How to use:** Calculates system uptime percentage.

**4. Are there any anomalies in traffic patterns?**

```kql
pageViews
| where timestamp > ago(30d)
| summarize requestCount = count() by bin(timestamp, 1h)
| render timechart
```

**How to use:** Visualizes traffic patterns to identify unusual spikes or drops.

---

## 🔍 KQL Queries — Additional Useful Queries

**1. Find errors by user email**

```kql
exceptions
| where timestamp > ago(7d)
| extend userEmail = tostring(customDimensions.userEmail)
| where userEmail == "user@example.com"
| order by timestamp desc
```

**2. Track specific page performance**

```kql
pageViews
| where name == "/agents"
| where timestamp > ago(7d)
| summarize avgLoadTime = avg(duration), count() by bin(timestamp, 1d)
| render timechart
```

**3. Monitor API endpoint health**

```kql
requests
| where name == "/api/agents"
| where timestamp > ago(24h)
| summarize
    count = count(),
    avgDuration = avg(duration),
    successRate = (countif(success == true) * 100.0) / count()
    by bin(timestamp, 1h)
| render timechart
```

**4. Find slow database queries (once DatabaseQueryTime metric is added)**

```kql
customMetrics
| where name == "DatabaseQueryTime"
| where timestamp > ago(24h)
| where value > 1000
| summarize count(), avg(value), max(value) by tostring(customDimensions.collection)
| order by avg_value desc
```

**5. Track custom business events (once added)**

```kql
customEvents
| where name == "AgentApproved"
| where timestamp > ago(7d)
| summarize count() by bin(timestamp, 1d), tostring(customDimensions.adminUser)
| render timechart
```

---

## 🔍 KQL Queries — Quick Reference

**View Page Views**

```kql
pageViews
| where timestamp > ago(24h)
| summarize count() by name
| order by count_ desc
```

**View Exceptions**

```kql
exceptions
| where timestamp > ago(24h)
| summarize count() by type, outerMessage
| order by count_ desc
```

**View Custom Events (once added)**

```kql
customEvents
| where name == "AgentApproved"
| where timestamp > ago(24h)
| summarize count() by tostring(customDimensions.adminUser)
| order by count_ desc
```

**View Performance Metrics**

```kql
requests
| where timestamp > ago(24h)
| summarize avg(duration), max(duration), count() by name
| order by avg_duration desc
```

---

## 🏗️ Architecture — Frontend Integration

**1. SDK packages**

- `@microsoft/applicationinsights-web`
- `@microsoft/applicationinsights-react-js`

**2. Configuration**

- File: `src/config/appInsights.ts`
- Initializes on app startup

**3. React Router**

- Automatic page view tracking via `useAppInsights` hook

**4. ErrorBoundary**

- Tracks React component errors with full stack trace and route context

**5. Logger**

- Sends warnings and errors to Application Insights with severity levels

**6. User context**

- Automatically set from Azure AD authentication (`user_AuthenticatedId`, `userEmail`)

---

## 🏗️ Architecture — Backend Integration

**1. Automatic integration**

- Configured via `api/host.json`
- No code changes required for request/exception tracking

**2. Helper module**

- `api/shared/telemetry.js` provides `trackBusinessEvent` for custom event tracking

**3. Automatic tracking**

- All exceptions automatically tracked
- All HTTP requests/responses automatically tracked (method, url, statusCode, duration)

---

## ⚙️ Configuration — Environment Variables

- **Local:** `VITE_APPINSIGHTS_CONNECTION_STRING` — Configured in `.env` files
- **Develop:** `VITE_APPINSIGHTS_CONNECTION_STRING_DEVELOP` — Set in GitHub variables
- **UAT:** `VITE_APPINSIGHTS_CONNECTION_STRING_UAT` — Set in GitHub variables
- **Production:** `VITE_APPINSIGHTS_CONNECTION_STRING_PROD` — Set in GitHub variables

**Connection string format:** `InstrumentationKey=xxx;IngestionEndpoint=https://xxx.in.applicationinsights.azure.com/`

**Where to get:** Azure Portal → Application Insights resource → Overview → Connection String

---

## 💻 Code Examples — Adding Custom Events

**1. Frontend Example**

```typescript
import { telemetryService } from "@/services/telemetryService";

// Track a custom event
telemetryService.trackEvent("AgentApproved", {
  agentId: "123",
  agentName: "My Agent",
  category: "general",
  adminUser: "admin@example.com",
});
```

**2. Backend Example**

```javascript
const { trackBusinessEvent } = require("../shared/telemetry");

// Track a business event
trackBusinessEvent(context, "AgentApproved", {
  agentId: agent.id,
  agentName: agent.name,
  category: agent.category,
  adminUser: context.bindings.user.email,
});
```

---

## ✅ Implementation Checklist — Completed

- Application Insights SDKs installed in both apps
- Configuration modules created (`appInsights.ts`)
- React Router integration (automatic page view tracking)
- ErrorBoundary integration (exception tracking)
- Logger integration (warnings/errors to Application Insights)
- User context tracking (automatic from authentication)
- Backend telemetry helper module created
- Environment variables configured (local + GitHub)
- GitHub Actions workflows updated (all 6 workflows)
- Documentation created

---

## ⚠️ Implementation Checklist — Optional Enhancements

- Add custom business events to admin app pages
- Add custom user behaviour events to client app pages
- Add custom events to API endpoints
- Add performance metrics to slow endpoints
- Set up Application Insights dashboards
- Configure alerts for critical errors

---

## 📁 Files Created/Modified

**New Files**

- `admin-app/src/config/appInsights.ts`
- `client-app/src/config/appInsights.ts`
- `admin-app/src/hooks/useAppInsights.ts`
- `client-app/src/hooks/useAppInsights.ts`
- `admin-app/src/services/telemetryService.ts`
- `client-app/src/services/telemetryService.ts`
- `api/shared/telemetry.js`
- `client-app/src/components/ErrorBoundary.tsx`

**Modified Files**

- `admin-app/src/App.tsx` — Added Application Insights initialization
- `client-app/src/App.tsx` — Added Application Insights initialization
- `admin-app/src/components/ErrorBoundary.tsx` — Added exception tracking
- `admin-app/src/utils/logger.ts` — Added Application Insights integration
- `client-app/src/utils/logger.ts` — Added Application Insights integration
- All environment example files — Added connection string
- All 6 GitHub Actions workflow files — Added connection string variables

---

## 📊 Sampling Configuration

**1. What is sampling?**

Sampling is a technique used to reduce the volume of telemetry data sent to Application Insights, which helps control costs while still maintaining statistical accuracy for analysis.

**2. Current configuration**

- **10% for events** (page views, custom events, traces): Only 1 out of every 10 events is sent. If 100 page views occur, only 10 are tracked. Acceptable for high-volume events where trends matter more than every occurrence.
- **100% for errors** (exceptions): ALL errors are tracked. No errors are missed — critical for debugging and monitoring system health.

**3. Why this matters**

- **Cost control:** Reduces Application Insights ingestion costs by ~90% for events
- **Performance:** Less network traffic and processing overhead
- **Error coverage:** Critical errors are never missed (100% sampling)
- **Statistical accuracy:** 10% sampling is sufficient for trend analysis and user behaviour insights

**4. When to adjust**

- **Increase sampling** (e.g., 5%) if costs are too high
- **Decrease sampling** (e.g., 25–50%) if you need more granular event data
- **Never reduce error sampling** below 100% — errors are critical

**5. How sampling works**

Application Insights uses adaptive sampling: events are randomly sampled at the SDK level before being sent; the sampling decision is consistent (same user/session will have same sampling rate); error events bypass sampling entirely (always sent).

---

## 📝 Additional Notes

**Privacy** — No PII is tracked in event properties (user context is separate).

**Performance** — Telemetry is non-blocking and will not impact app performance.

**Cost** — Monitor Application Insights ingestion costs in Azure Portal.

**Related documentation** — Azure Functions Application Insights (configured via `api/host.json`); React Plugin (integrated via `useAppInsights` hook); Error Tracking (automatic via ErrorBoundary and Logger).

---

## 🎯 Production Readiness Summary

**Ready for production.** The core infrastructure provides:

- Comprehensive error monitoring (frontend + backend)
- Complete page view analytics
- Automatic performance monitoring
- User engagement tracking
- System health monitoring

Custom business events can be added incrementally as needed without any infrastructure changes.

---

## 📈 Recommended Dashboards

**1. User Engagement Dashboard**

- Tile: Top 10 pages by visit count (KQL: `pageViews | where timestamp > ago(7d) | summarize count() by name | order by count_ desc | take 10`)
- Tile: Daily unique users timechart (KQL: `pageViews | where timestamp > ago(30d) | summarize uniqueUsers = dcount(user_AuthenticatedId) by bin(timestamp, 1d) | render timechart`)
- Tile: Average session duration (KQL: `pageViews | where timestamp > ago(7d) | summarize avgDuration = avg(duration)`)
- Tile: Authentication success rate (KQL: `pageViews | where timestamp > ago(7d) | summarize total = count(), authenticated = countif(customDimensions.isAuthenticated == "true") | extend authRate = (authenticated * 100.0) / total`)

**2. Error Monitoring Dashboard**

- Tile: Top 20 errors by frequency (KQL: `exceptions | where timestamp > ago(24h) | summarize count() by type, outerMessage | order by count_ desc | take 20`)
- Tile: Error trends over time (KQL: `exceptions | where timestamp > ago(7d) | summarize errorCount = count() by bin(timestamp, 1h) | render timechart`)
- Tile: Pages with most errors (KQL: `exceptions | where timestamp > ago(7d) | extend pageName = tostring(customDimensions.route) | summarize count() by pageName | order by count_ desc | take 10`)
- Tile: Users experiencing errors (KQL: `exceptions | where timestamp > ago(7d) | extend userEmail = tostring(customDimensions.userEmail) | summarize errorCount = count() by userEmail | order by errorCount desc | take 20`)

**3. Performance Dashboard**

- Tile: Slowest API endpoints (KQL: `requests | where timestamp > ago(24h) | where success == true | summarize avgDuration = avg(duration), count() by name | order by avgDuration desc | take 20`)
- Tile: API response time percentiles (KQL: `requests | where timestamp > ago(24h) | summarize avgResponseTime = avg(duration), p95 = percentile(duration, 95), p99 = percentile(duration, 99)`)
- Tile: Slowest pages (KQL: `pageViews | where timestamp > ago(7d) | summarize avgLoadTime = avg(duration), count() by name | order by avgLoadTime desc | take 10`)
- Tile: API success/failure rate (KQL: `requests | where timestamp > ago(24h) | summarize total = count(), success = countif(success == true) | extend successRate = (success * 100.0) / total`)

**4. System Health Dashboard**

- Tile: Overall health snapshot (KQL: `requests | where timestamp > ago(1h) | summarize totalRequests = count(), successRate = (countif(success == true) * 100.0) / count(), avgResponseTime = avg(duration), errorRate = (countif(success == false) * 100.0) / count()`)
- Tile: Dependency failures (KQL: `dependencies | where timestamp > ago(24h) | where success == false | summarize count() by name, type | order by count_ desc`)
- Tile: Uptime percentage (KQL: `requests | where timestamp > ago(7d) | summarize total = count(), successful = countif(success == true) | extend uptimePercentage = (successful * 100.0) / total`)
- Tile: Traffic patterns (KQL: `pageViews | where timestamp > ago(30d) | summarize requestCount = count() by bin(timestamp, 1h) | render timechart`)

---

## 🚨 Recommended Alert Rules

**1. Critical Error Rate Spike**

- **Condition:** Exception count > threshold (e.g., 50 in 5 minutes) or exception rate > 5% of requests
- **Action:** Send email/SMS to on-call team; create P1 incident
- **KQL for alert:** `exceptions | where timestamp > ago(5m) | summarize count()`

**2. API Failure Rate Threshold**

- **Condition:** Request success rate < 95% over 15 minutes
- **Action:** Send alert to operations; escalate if sustained
- **KQL for alert:** `requests | where timestamp > ago(15m) | summarize total = count(), failed = countif(success == false) | extend failureRate = (failed * 100.0) / total | where failureRate > 5`

**3. Performance Regression**

- **Condition:** p95 response time > 500ms for key endpoints over 30 minutes
- **Action:** Notify development team for investigation
- **KQL for alert:** `requests | where timestamp > ago(30m) | where name in ("/api/agents", "/api/prompts", "/api/approval") | summarize p95 = percentile(duration, 95) by name | where p95 > 500`

**4. Dependency Failures**

- **Condition:** Dependency failure count > 10 in 10 minutes
- **Action:** Alert on-call; check external service status
- **KQL for alert:** `dependencies | where timestamp > ago(10m) | where success == false | summarize count()`

**5. Traffic Anomaly (Optional)**

- **Condition:** Page view count deviates significantly from baseline (e.g., >50% drop or >200% spike)
- **Action:** Investigate; may indicate outage or viral traffic

---

## 📊 Performance Tracking — Key Metrics

**1. API response time targets**

- **Target:** <200ms for 95th percentile
- **Track:** `requests | summarize p95 = percentile(duration, 95) by name`
- **Alert:** When p95 exceeds 500ms for critical endpoints

**2. Page load time targets**

- **Target:** <3 seconds for initial load
- **Track:** `pageViews | summarize avgLoadTime = avg(duration), p95 = percentile(duration, 95) by name`
- **Optimise:** Pages with p95 > 5 seconds

**3. Error rate targets**

- **Target:** <1% of requests
- **Track:** `requests | summarize total = count(), failed = countif(success == false) | extend errorRate = (failed * 100.0) / total`
- **Alert:** When error rate exceeds 5%

**4. Availability target**

- **Target:** >99.9% uptime
- **Track:** `requests | summarize successful = countif(success == true), total = count() | extend uptime = (successful * 100.0) / total`

---

## 🔧 Custom Telemetry — Implementation Guide

**1. Frontend — Add event to a page**

Import `telemetryService` from `@/services/telemetryService`. Call `telemetryService.trackEvent(eventName, properties)` at the appropriate user action. Ensure properties match the planned event schema (no PII in custom dimensions).

**2. Backend — Add event to an endpoint**

Require `trackBusinessEvent` from `api/shared/telemetry.js`. Call `trackBusinessEvent(context, eventName, properties)` after the business operation completes. Pass the Azure Functions `context` for correlation.

**3. Performance metrics — Add custom metric**

Use `appInsights.trackMetric({ name: "DatabaseQueryTime", average: durationMs })` for timing operations. Add `customDimensions` for context (e.g., collection name, operation type).

**4. Correlation**

Application Insights automatically correlates frontend requests with backend dependencies. Ensure `traceparent` headers are propagated for distributed tracing across services.

---

## 📋 Quick Reference — Where to Run Queries

- **Azure Portal:** Application Insights resource → Logs (or Monitor → Logs)
- **Query scope:** Select the Application Insights resource for the target environment (develop, UAT, production)
- **Time range:** Use `ago(7d)`, `ago(24h)`, `ago(1h)` in KQL or set time picker in UI
- **Export:** Results can be exported to CSV or pinned to dashboards

---

## 🔔 Alert Action Group Setup

**1. Create action group**

In Azure Portal: Monitor → Alerts → Action groups → Create. Name: `ag-agent-library-ops`. Add email and/or SMS for on-call team.

**2. Link to alert rules**

When creating each alert rule (error rate, performance, dependency failures), select the action group for notifications.

**3. Severity levels**

- **Sev 1 (Critical):** Error rate >10%, system down — immediate page
- **Sev 2 (Warning):** Error rate >5%, p95 >500ms — email within 15 min
- **Sev 3 (Informational):** Dependency failures, traffic anomaly — daily digest

**4. Test alerts**

After configuration, trigger a test alert (e.g., temporarily raise threshold) to verify notifications are received.

---

## 📅 Operational Workflow — Daily Monitoring

**Morning (9:00 AM):** Run system health KQL query. Check error rate and top errors. Review slowest endpoints. Verify no dependency failures.

**After deployment:** Run performance regression query. Compare p95 before/after. Check error rate for 30 minutes post-deploy.

**Weekly review:** Run user engagement queries (unique users, top pages, bounce rate). Run business event queries (once custom events are added). Export key metrics for stakeholder reporting.

**Incident investigation:** Start with exceptions query filtered by time range. Correlate with requests and dependencies. Use user email filter to trace specific user issues.

---

📌 **Document Type:** Technical Implementation Guide / Monitoring Specification
📅 **Last Updated:** 25 November 2025
🔗 **Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40450850911
