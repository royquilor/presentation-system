# Feature Flagging Implementation Guide

> An enterprise-grade reference guide for implementing feature flags in serverless applications, covering architecture patterns, a full TypeScript/JavaScript implementation, lifecycle management, security considerations, and operational best practices — targeted at the Datacom Agent Library and similar projects.

**Author:** [Dipesh Trikam](https://datacomgroup.atlassian.net/wiki/people/712020:06f04ec7-5f4c-4e03-a2a3-3e46b413e073)
**Date:** 21 October 2025
**Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40269742249

---

## 🎯 Context

This guide was authored for Engineering Teams, Solution Architects, and DevOps Engineers working on the Datacom Agent Library and comparable serverless, cloud-native products (Insights & Analytics space). It provides both conceptual grounding and production-ready code for adopting feature flags as a standard release engineering practice.

---

## 🔍 Problem

Teams deploying to serverless environments often couple feature releases tightly to code deployments, making rollbacks slow, risky, and disruptive. Without runtime feature controls, a bug discovered after release requires a full redeploy (30–60 minutes), all users are affected simultaneously, and there is no mechanism for staged or targeted rollouts.

---

## 📋 Observations

- **Four flag types are defined:** Release (short-lived, days–weeks), Experiment (A/B testing, weeks–months), Ops (circuit breakers, permanent), and Permission (role/tier gating, permanent).
- **Three architecture patterns are compared:** Centralised Configuration Service (single source of truth, best for multi-service enterprise), Distributed Configuration (serverless-friendly, each service owns its flags), and Hybrid (recommended — static + dynamic + user targeting with layered precedence).
- **The flag service implementation** loads flags from environment variables and CosmosDB, merges with precedence `DB > Env > Defaults`, caches for 5 minutes (TTL), and fails closed (returns `false`) on unknown flags or errors.
- **Percentage rollouts** use a deterministic MD5 hash of `userId:flagKey` to ensure consistent user assignment across evaluations — no random flip-flopping.
- **Frontend integration** uses a React Context Provider (`FeatureFlagProvider`) with a `useFeatureFlag(key)` hook and a `<FeatureGate>` component for conditional rendering; flags are cached in `localStorage` as a fallback.
- **Flag lifecycle has five stages:** Development → Testing → Rolling Out (5%→25%→50%→100%) → Enabled → Cleanup (remove from code after 2+ stable weeks).
- **Flag debt thresholds:** Warning at >20 flags or >60 days active; critical at >50 flags or >90 days. Monthly reviews and quarterly retirement sprints are recommended.
- **Security rules:** Never use flags as an authorisation mechanism; always evaluate flags server-side; filter `backend-only` and `security`-tagged flags from client responses; use pseudonymous user IDs (not PII) in targeting rules.

---

## 💡 Proposal

Adopt a hybrid feature flag architecture where static ops/permission flags are loaded from environment variables and dynamic release/experiment flags are stored in CosmosDB and served via a singleton `FeatureFlagService` with a 5-minute cache. The backend exposes a `/api/feature-flags` endpoint (GET/POST/PUT, admin-only for writes), and the frontend consumes it through a React context provider — enabling instant kill-switch rollbacks, gradual percentage rollouts, and environment- or group-targeted releases without any code redeployment.

---

## ⚠️ Risks

- **Flag debt accumulation:** Without disciplined lifecycle management and automated stale-flag alerts, the flag registry will grow uncontrolled, increasing cognitive and maintenance overhead.
- **Cache staleness:** The 5-minute TTL means emergency flag changes may take up to 5 minutes to propagate to all running instances; the emergency disable path bypasses cache but depends on cache invalidation broadcast working correctly.
- **Security misuse:** Developers unfamiliar with the guidelines may inadvertently use flags as access-control gates, bypassing proper authorisation checks.
- **CosmosDB dependency:** If the database is unavailable during service start-up, the service falls back to environment-variable defaults — features backed only by DB flags will silently disable.
- **Testing complexity:** Every flagged feature path needs test coverage for both enabled and disabled states, doubling test surface area for each flagged feature.

---

## ✅ Next Steps

- Implement `api/shared/feature-flags.js` (FeatureFlagService singleton) and add the `feature-flags` CosmosDB container.
- Add the `/api/feature-flags` Azure Function endpoint with GET/POST/PUT handlers.
- Wrap the client app root with `FeatureFlagProvider` and replace any existing conditional feature code with `useFeatureFlag` / `<FeatureGate>`.
- Build the admin `FeatureFlagsManager` UI component (filter, toggle, targeting rules display).
- Set up automated stale-flag alerts (>60 days) and schedule the first quarterly flag retirement sprint.

---

## 🔑 Close

Feature flags decouple deployment from release, compressing rollback time from 30–60 minutes to under one minute — but they only deliver value if the full lifecycle (creation, rollout, monitoring, cleanup) is followed with the same rigour as the implementation itself.

---

📌 **Document Type:** Architecture Doc / Implementation Guide
📅 **Last Updated:** 21 October 2025
🔗 **Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40269742249
