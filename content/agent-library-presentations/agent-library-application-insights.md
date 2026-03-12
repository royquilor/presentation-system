# Application Insights Implementation

> A technical specification and implementation guide for the comprehensive Azure Application Insights telemetry layer added to the Datacom Agent Library's frontend and backend components.

**Author:** [Dipesh Trikam](https://datacomgroup.atlassian.net/wiki/people/712020:06f04ec7-5f4c-4e03-a2a3-3e46b413e073)
**Date:** 25 November 2025
**Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40450850911

---

## 🎯 Context

The Datacom Agent Library consists of two React frontends (Admin App and Client App) and an Azure Functions backend API. The EASA team (Dipesh Trikam) implemented Application Insights telemetry across all three tiers to provide real-time observability, error tracking, performance analytics, and user behaviour insights ahead of the production launch in November 2025. The implementation covers all four environments: local, develop, UAT, and production.

---

## 🔍 Problem

Without structured telemetry, the team had limited visibility into how users were interacting with the platform, which errors were occurring in production, and whether API performance targets were being sustained over time. A monitoring blind spot at this stage of the project would make it difficult to diagnose incidents, track adoption, or detect regressions after deployments.

---

## 📋 Observations

- **Core infrastructure is production-ready**: automatic telemetry for page views, exceptions, traces, HTTP requests, and API dependencies is fully active across both frontend apps and the Azure Functions backend.
- Frontend integration uses `@microsoft/applicationinsights-web` and `@microsoft/applicationinsights-react-js`; user context is automatically populated from Azure AD authentication, and React Router handles automatic page view tracking.
- Backend exceptions and all HTTP request/response pairs are automatically captured via `api/host.json` configuration; a shared `api/shared/telemetry.js` helper module is ready for custom event tracking.
- A catalogue of **planned custom events** is defined (but not yet implemented) covering 30+ business events: `AgentApproved`, `AgentRejected`, `AgentSubmitted`, `AgentRated`, `UserRoleChanged`, etc., across both frontend apps and the API.
- Sampling is configured at **10% for events** (cost control) and **100% for exceptions** (no errors missed); this provides statistically valid trend data while reducing ingestion costs by ~90%.
- Over 20 ready-to-run KQL queries are documented for answering common questions: slowest API endpoints, daily unique users, error trends, bounce rates, authentication success rates, and performance regressions.
- All 6 GitHub Actions deployment workflows were updated to pass per-environment `VITE_APPINSIGHTS_CONNECTION_STRING` variables, ensuring telemetry is active from day one in every environment.

---

## 💡 Proposal

The implementation adopts a two-phase approach: ship the automatic instrumentation layer first (zero code changes required in feature code), then incrementally add custom business events to individual pages and API endpoints as a lower-priority enhancement. This allows the team to gain immediate observability value without blocking any feature work, with the custom event catalogue serving as a prioritised backlog for future sprints.

---

## ⚠️ Risks

- The 30+ planned custom events are not yet implemented — without them, key business metrics (e.g., how many agents were approved this week, which categories are most popular) cannot be tracked in Application Insights.
- At 10% event sampling, absolute event counts in dashboards will appear 10× lower than actual traffic — this must be communicated to any stakeholder interpreting the data.
- No Application Insights alerts or dashboards have been configured yet; the data is being collected but there are no automated notifications for anomalies or threshold breaches.
- The telemetry helper module (`api/shared/telemetry.js`) is ready but not yet called from any API endpoint — backend custom events will not appear until wired in.

---

## ✅ Next Steps

- Implement the highest-priority custom events first: `AgentApproved`, `AgentRejected`, `UserRoleChanged` in the admin app and `AgentSubmitted`, `AgentSearch` in the client app.
- Configure Application Insights dashboards and alerts (e.g., error rate spike, p95 response time regression) to operationalise the telemetry data.
- Wire the backend `telemetry.js` helper into the key API endpoints (`/api/approval`, `/api/agents`, `/api/users`) for server-side business event tracking.
- Document the 10% sampling caveat in any operational or stakeholder reporting that references Application Insights event counts.
- Add `DatabaseQueryTime` custom metrics to CosmosDB query paths so slow database operations can be tracked independently of overall API response time.

---

## 🔑 Close

The automatic telemetry foundation is fully operational and provides immediate value for error monitoring and performance tracking — but the platform will not achieve full business observability until the planned custom events backlog is implemented and dashboard alerts are configured.

---

📌 **Document Type:** Technical Implementation Guide / Monitoring Specification
📅 **Last Updated:** 25 November 2025
🔗 **Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40450850911
