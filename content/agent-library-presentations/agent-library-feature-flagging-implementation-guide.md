# Feature Flagging Implementation Guide

> Enterprise best practices for serverless applications — architecture patterns, full implementation, lifecycle management, security, and operational guidelines for the Datacom Agent Library and similar projects.

**Author:** Dipesh Trikam
**Date:** 21 October 2025
**Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40269742249

---

## 🎯 Context

This guide targets Engineering Teams, Solution Architects, and DevOps Engineers working on the Datacom Agent Library and comparable serverless, cloud-native products in the Insights & Analytics space. It provides both conceptual grounding and production-ready code for adopting feature flags as a standard release engineering practice.

Feature flags (feature toggles) allow you to enable or disable features at runtime without deploying new code. Key benefits include deploying code independently of feature releases, testing in production with controlled rollouts, instant rollback without redeployment, A/B testing, gradual rollouts, and environment-specific control.

---

## 🔍 Problem

Teams deploying to serverless environments often couple feature releases tightly to code deployments. Without feature flags: a bug found requires an emergency hotfix and redeploy (30–60 minutes); all users see the bug; rollback requires full deployment; testing in production is risky. With feature flags: toggle OFF in under one minute; only targeted users affected; instant rollback via config; testing in production is controlled.

Traditional flow couples Develop → Test → Deploy → Release (high risk). With feature flags: Develop → Deploy (feature OFF) → Test in Prod → Release (feature ON) — low risk and fast rollback.

---

## 📋 Observations

**1. Four Flag Types**

Release Toggles (short-lived, days–weeks): enable/disable incomplete features in production, decouple deployment from release. Example: new chat interface in development.

Experiment Toggles (short-lived, weeks–months): A/B testing and experimentation, compare different implementations. Example: testing two prompt recommendation algorithms.

Ops Toggles (long-lived, permanent): circuit breakers and system controls, performance and load management. Example: disable expensive AI features during high load.

Permission Toggles (long-lived, permanent): role-based feature access, premium feature gating. Example: admin-only features, enterprise tier features.

**2. Three Architecture Patterns**

Centralised Configuration Service: single source of truth, consistent evaluation across services, centralised management and audit trail, real-time updates. Best for enterprise applications with multiple services and teams.

Distributed Configuration: each service manages its own flags, environment-based configuration, lightweight and serverless-friendly, no external dependencies. Best for serverless applications with independent deployment cycles (our project pattern).

Hybrid Approach (recommended): static flags for compile-time decisions, dynamic flags for runtime control, user targeting for experiments, layered evaluation with precedence rules. Best for complex enterprise applications requiring flexibility.

**3. Flag Service Implementation**

Loads flags from environment variables and CosmosDB. Merges with precedence: DB > Environment > Defaults. Caches for 5 minutes (TTL). Fails closed (returns `false`) on unknown flags or errors. Supports environment, user ID, user group, percentage rollout, and region targeting.

**4. Percentage Rollouts**

Uses deterministic MD5 hash of `userId:flagKey` to ensure consistent user assignment across evaluations — no random flip-flopping. User percentile derived from hash modulo 100.

**5. Frontend Integration**

React Context Provider (`FeatureFlagProvider`) with `useFeatureFlag(key)` hook and `<FeatureGate>` component for conditional rendering. Flags cached in `localStorage` as fallback. Refresh every 5 minutes.

**6. Flag Lifecycle Stages**

Development (Days 1–7): flag created, feature OFF in production, visible to developers only. Testing (Days 7–14): enabled in UAT, QA testing, internal dogfooding. Rolling Out (Days 14–21): 5% → 25% → 50% → 100%. Enabled (Days 21–35): fully rolled out, monitoring for issues. Cleanup (Day 35+): remove from code, archive flag definition.

**7. Flag Debt Thresholds**

Healthy: < 10 flags, < 30 days each. Warning: > 20 flags or > 60 days. Critical: > 50 flags or > 90 days. Monthly reviews and quarterly retirement sprints recommended.

**8. Security Rules**

Never use flags as an authorisation mechanism. Always evaluate flags server-side. Filter `backend-only` and `security`-tagged flags from client responses. Use pseudonymous user IDs (not PII) in targeting rules.

---

## 💡 Proposal

Adopt a hybrid feature flag architecture where static ops/permission flags load from environment variables and dynamic release/experiment flags are stored in CosmosDB. A singleton `FeatureFlagService` with 5-minute cache serves flags. Backend exposes `/api/feature-flags` (GET/POST/PUT, admin-only for writes). Frontend consumes via React context provider. Enables instant kill-switch rollbacks, gradual percentage rollouts, and environment- or group-targeted releases without code redeployment.

---

## ⚠️ Risks

**Flag debt accumulation** — Without disciplined lifecycle management and automated stale-flag alerts, the flag registry will grow uncontrolled, increasing cognitive and maintenance overhead.

**Cache staleness** — The 5-minute TTL means emergency flag changes may take up to 5 minutes to propagate; the emergency disable path bypasses cache but depends on cache invalidation broadcast working correctly.

**Security misuse** — Developers unfamiliar with guidelines may inadvertently use flags as access-control gates, bypassing proper authorisation checks.

**CosmosDB dependency** — If the database is unavailable during start-up, the service falls back to environment-variable defaults; features backed only by DB flags will silently disable.

**Testing complexity** — Every flagged feature path needs test coverage for both enabled and disabled states, doubling test surface area for each flagged feature.

---

## ✅ Next Steps

1. **Implement FeatureFlagService** — Add `api/shared/feature-flags.js` and create the `feature-flags` CosmosDB container.
2. **Add API endpoint** — Implement `/api/feature-flags` Azure Function with GET/POST/PUT handlers.
3. **Integrate frontend** — Wrap client app root with `FeatureFlagProvider` and replace conditional feature code with `useFeatureFlag` / `<FeatureGate>`.
4. **Build admin UI** — Create `FeatureFlagsManager` component with filter, toggle, and targeting rules display.
5. **Set up monitoring** — Configure automated stale-flag alerts (>60 days) and schedule the first quarterly flag retirement sprint.

---

## 🔑 Close

> Feature flags decouple deployment from release, compressing rollback time from 30–60 minutes to under one minute — but they only deliver value if the full lifecycle (creation, rollout, monitoring, cleanup) is followed with the same rigour as the implementation itself.

---

# Flex Sections

---

## Feature Flag Schema and Types

**1. Flag Schema Definition**

```typescript
// types/feature-flags.ts

export type FlagType = "release" | "experiment" | "ops" | "permission";

export type FlagStatus = "active" | "inactive" | "archived";

export interface FeatureFlag {
  id: string;
  key: string; // e.g., 'new-agent-builder'
  name: string; // e.g., 'New Agent Builder UI'
  description: string;
  type: FlagType;
  category: string; // e.g., 'frontend', 'backend', 'ai'
  status: FlagStatus;
  enabled: boolean;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;
  expiresAt?: Date; // For short-lived flags
  targeting?: {
    userIds?: string[];
    userGroups?: string[];
    percentage?: number; // 0-100 for gradual rollout
    environments?: ("dev" | "uat" | "prod")[];
    regions?: string[];
  };
  tags: string[];
  owner: string;
  jiraTicket?: string;
  documentationUrl?: string;
  evaluationCount?: number;
  lastEvaluated?: Date;
}

export interface FlagEvaluationContext {
  userId?: string;
  userEmail?: string;
  userGroups?: string[];
  environment: string;
  region?: string;
  timestamp: Date;
}

export interface FlagEvaluationResult {
  enabled: boolean;
  variant?: string; // For A/B testing
  reason?: string; // Why this value was returned
  evaluationId?: string; // For tracking
}
```

**2. Simple Usage Example**

```javascript
// Simple example
if (featureFlags.isEnabled("new-ai-agent-builder")) {
  return <NewAgentBuilder />;
} else {
  return <LegacyAgentBuilder />;
}
```

---

## When to Use Feature Flags

**1. Large Features Under Development**

Feature will take multiple sprints, multiple developers, risk of breaking existing functionality.

```javascript
if (flags.enabled("agent-marketplace-v2")) {
  // New marketplace with reviews, ratings, analytics
} else {
  // Current simple agent listing
}
```

**2. High-Risk Changes**

Database schema migrations, third-party API integrations, algorithm changes affecting core functionality.

```javascript
const agentRepository = flags.enabled("use-cosmosdb-agents")
  ? new CosmosAgentRepository()
  : new MongoAgentRepository();
```

**3. Staged Rollouts Required**

Testing with internal users first, beta testing with select customers, regional or phased launches.

```javascript
const aiModel = flags.getValue("ai-model-version", {
  userId: user.id,
  userTier: user.tier,
  region: user.region,
});
// Returns: 'gpt-4' for beta users, 'gpt-3.5-turbo' for others
```

**4. Temporary Operational Controls**

Load shedding during peak times, degraded mode during incidents, resource-intensive optional features.

```javascript
if (!flags.enabled("enable-real-time-collaboration")) {
  return { message: "Feature temporarily unavailable" };
}
```

**5. Don't Use Feature Flags When**

Simple bug fixes (just fix and deploy). Trivial UI tweaks (color changes, text updates). Internal refactoring where behavior doesn't change externally. Emergency security patches (deploy immediately). Static content changes (documentation, help text).

**6. Consider Alternatives When**

Configuration management would be simpler (e.g., API rate limits). Environment variables are sufficient (e.g., API keys). User preferences are more appropriate (e.g., theme selection).

---

## Backend Feature Flag Service

**1. FeatureFlagService Class**

```javascript
// api/shared/feature-flags.js

class FeatureFlagService {
  constructor() {
    this.cache = new Map();
    this.cacheTTL = 5 * 60 * 1000; // 5 minutes
    this.lastCacheRefresh = null;
  }

  async initialize() {
    try {
      const envFlags = this.loadEnvironmentFlags();
      const dbFlags = await this.loadDatabaseFlags();
      this.flags = { ...this.getDefaultFlags(), ...envFlags, ...dbFlags };
      this.lastCacheRefresh = Date.now();
      console.log(`[FeatureFlags] Initialized ${Object.keys(this.flags).length} flags`);
      return this.flags;
    } catch (error) {
      console.error("[FeatureFlags] Initialization failed:", error);
      return this.getDefaultFlags(); // Fail safe
    }
  }

  async isEnabled(flagKey, context = {}) {
    try {
      if (this.shouldRefreshCache()) {
        await this.initialize();
      }

      const flag = this.flags[flagKey];

      if (!flag) {
        console.warn(`[FeatureFlags] Unknown flag: ${flagKey}`);
        return { enabled: false, reason: "flag_not_found" };
      }

      if (flag.status !== "active") {
        return { enabled: false, reason: "flag_inactive" };
      }

      if (!flag.enabled) {
        return { enabled: false, reason: "flag_disabled" };
      }

      if (flag.targeting) {
        return this.evaluateTargeting(flag, context);
      }

      return { enabled: true, reason: "global_enabled" };
    } catch (error) {
      console.error(`[FeatureFlags] Error evaluating ${flagKey}:`, error);
      return { enabled: false, reason: "evaluation_error" };
    }
  }

  evaluateTargeting(flag, context) {
    const targeting = flag.targeting;

    if (targeting.environments?.length > 0) {
      const currentEnv = process.env.ENVIRONMENT || "dev";
      if (!targeting.environments.includes(currentEnv)) {
        return { enabled: false, reason: "environment_mismatch" };
      }
    }

    if (targeting.userIds?.length > 0 && context.userId) {
      if (targeting.userIds.includes(context.userId)) {
        return { enabled: true, reason: "user_targeted" };
      }
      return { enabled: false, reason: "user_not_targeted" };
    }

    if (targeting.userGroups?.length > 0 && context.userGroups?.length > 0) {
      const hasGroup = context.userGroups.some((g) =>
        targeting.userGroups.includes(g)
      );
      if (hasGroup) {
        return { enabled: true, reason: "group_targeted" };
      }
      return { enabled: false, reason: "group_not_targeted" };
    }

    if (targeting.percentage !== undefined && context.userId) {
      const userHash = this.hashUserId(context.userId, flag.key);
      const userPercentile = (userHash % 100) + 1;

      if (userPercentile <= targeting.percentage) {
        return {
          enabled: true,
          reason: "percentage_rollout",
          percentile: userPercentile,
        };
      }
      return {
        enabled: false,
        reason: "percentage_rollout_excluded",
        percentile: userPercentile,
      };
    }

    if (targeting.regions?.length > 0 && context.region) {
      if (targeting.regions.includes(context.region)) {
        return { enabled: true, reason: "region_targeted" };
      }
      return { enabled: false, reason: "region_not_targeted" };
    }

    return { enabled: true, reason: "targeting_passed" };
  }

  hashUserId(userId, flagKey) {
    const crypto = require("crypto");
    const hash = crypto
      .createHash("md5")
      .update(`${userId}:${flagKey}`)
      .digest("hex");
    return parseInt(hash.substring(0, 8), 16);
  }

  loadEnvironmentFlags() {
    const flags = {};
    const prefix = "FEATURE_FLAG_";

    Object.keys(process.env).forEach((key) => {
      if (key.startsWith(prefix)) {
        const flagKey = key
          .substring(prefix.length)
          .toLowerCase()
          .replace(/_/g, "-");

        flags[flagKey] = {
          key: flagKey,
          enabled: process.env[key] === "true",
          source: "environment",
          type: "ops",
        };
      }
    });

    return flags;
  }

  async loadDatabaseFlags() {
    try {
      const { getCosmosContainer } = require("./cosmosdb");
      const container = getCosmosContainer("feature-flags");

      const { resources } = await container.items
        .query({
          query: "SELECT * FROM c WHERE c.status = @status",
          parameters: [{ name: "@status", value: "active" }],
        })
        .fetchAll();

      const flags = {};
      resources.forEach((flag) => {
        flags[flag.key] = { ...flag, source: "database" };
      });

      return flags;
    } catch (error) {
      console.error("[FeatureFlags] Failed to load from database:", error);
      return {};
    }
  }

  getDefaultFlags() {
    return {
      "health-check-detailed": {
        key: "health-check-detailed",
        enabled: true,
        type: "ops",
        description: "Show detailed health check information",
      },
      "rate-limiting": {
        key: "rate-limiting",
        enabled: true,
        type: "ops",
        description: "Enable API rate limiting",
      },
      "feature-flags-enabled": {
        key: "feature-flags-enabled",
        enabled: true,
        type: "ops",
        description: "Master switch for feature flag system",
      },
    };
  }

  shouldRefreshCache() {
    if (!this.lastCacheRefresh) return true;
    return Date.now() - this.lastCacheRefresh > this.cacheTTL;
  }

  async getAllFlags() {
    if (this.shouldRefreshCache()) {
      await this.initialize();
    }
    return this.flags;
  }

  async updateFlag(flagKey, updates) {
    try {
      const { getCosmosContainer } = require("./cosmosdb");
      const container = getCosmosContainer("feature-flags");

      const flag = this.flags[flagKey];
      if (!flag) {
        throw new Error(`Flag ${flagKey} not found`);
      }

      const updatedFlag = {
        ...flag,
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      await container.items.upsert(updatedFlag);
      this.lastCacheRefresh = null;

      return updatedFlag;
    } catch (error) {
      console.error(`[FeatureFlags] Failed to update ${flagKey}:`, error);
      throw error;
    }
  }
}

let featureFlagService = null;

function getFeatureFlagService() {
  if (!featureFlagService) {
    featureFlagService = new FeatureFlagService();
  }
  return featureFlagService;
}

module.exports = {
  FeatureFlagService,
  getFeatureFlagService,
};
```

---

## Frontend React Hook

**1. FeatureFlagProvider and useFeatureFlag**

```typescript
// client-app/src/hooks/useFeatureFlag.ts

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

interface FeatureFlags {
  [key: string]: boolean;
}

interface FeatureFlagContextValue {
  flags: FeatureFlags;
  isEnabled: (flagKey: string) => boolean;
  isLoading: boolean;
  refresh: () => Promise<void>;
}

const FeatureFlagContext = createContext<FeatureFlagContextValue | undefined>(
  undefined
);

export function FeatureFlagProvider({ children }: { children: ReactNode }) {
  const [flags, setFlags] = useState<FeatureFlags>({});
  const [isLoading, setIsLoading] = useState(true);

  const fetchFlags = async () => {
    try {
      const response = await fetch("/api/feature-flags", {
        headers: {
          Authorisation: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setFlags(data.flags);
      }
    } catch (error) {
      console.error("Failed to fetch feature flags:", error);
      const cached = localStorage.getItem("feature-flags");
      if (cached) {
        setFlags(JSON.parse(cached));
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFlags();
    const interval = setInterval(fetchFlags, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (Object.keys(flags).length > 0) {
      localStorage.setItem("feature-flags", JSON.stringify(flags));
    }
  }, [flags]);

  const isEnabled = (flagKey: string): boolean => {
    return flags[flagKey] ?? false;
  };

  const refresh = async () => {
    setIsLoading(true);
    await fetchFlags();
  };

  return (
    <FeatureFlagContext.Provider
      value={{ flags, isEnabled, isLoading, refresh }}
    >
      {children}
    </FeatureFlagContext.Provider>
  );
}

export function useFeatureFlag(flagKey: string): boolean {
  const context = useContext(FeatureFlagContext);

  if (!context) {
    throw new Error("useFeatureFlag must be used within FeatureFlagProvider");
  }

  return context.isEnabled(flagKey);
}

export function useFeatureFlags() {
  const context = useContext(FeatureFlagContext);

  if (!context) {
    throw new Error("useFeatureFlags must be used within FeatureFlagProvider");
  }

  return context;
}

export function FeatureGate({
  flag,
  children,
  fallback = null,
}: {
  flag: string;
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const isEnabled = useFeatureFlag(flag);
  return isEnabled ? <>{children}</> : <>{fallback}</>;
}
```

---

## API Endpoint Implementation

**1. Feature Flags API Handler**

```javascript
// api/feature-flags/index.js

const { getFeatureFlagService } = require("../shared/feature-flags");
const { verifyToken } = require("../shared/auth");

module.exports = async function (context, req) {
  try {
    const user = await verifyToken(req);
    if (!user) {
      context.res = {
        status: 401,
        body: { error: "Unauthorized" },
      };
      return;
    }

    const method = req.method;
    const flagService = getFeatureFlagService();

    if (!flagService.flags) {
      await flagService.initialize();
    }

    switch (method) {
      case "GET":
        return await handleGet(context, req, user, flagService);

      case "POST":
        return await handlePost(context, req, user, flagService);

      case "PUT":
        return await handlePut(context, req, user, flagService);

      default:
        context.res = {
          status: 405,
          body: { error: "Method not allowed" },
        };
    }
  } catch (error) {
    context.log.error("[FeatureFlags] Error:", error);
    context.res = {
      status: 500,
      body: { error: "Internal server error" },
    };
  }
};

async function handleGet(context, req, user, flagService) {
  const { flagKey } = req.query;

  if (flagKey) {
    const result = await flagService.isEnabled(flagKey, {
      userId: user.id,
      userEmail: user.email,
      userGroups: user.groups || [],
      environment: process.env.ENVIRONMENT || "dev",
    });

    context.res = {
      status: 200,
      body: {
        flag: flagKey,
        ...result,
      },
    };
  } else {
    const allFlags = await flagService.getAllFlags();
    const evaluatedFlags = {};

    for (const [key, flag] of Object.entries(allFlags)) {
      const result = await flagService.isEnabled(key, {
        userId: user.id,
        userEmail: user.email,
        userGroups: user.groups || [],
        environment: process.env.ENVIRONMENT || "dev",
      });
      evaluatedFlags[key] = result.enabled;
    }

    context.res = {
      status: 200,
      body: {
        flags: evaluatedFlags,
        count: Object.keys(evaluatedFlags).length,
      },
    };
  }
}

async function handlePost(context, req, user, flagService) {
  if (!user.isAdmin) {
    context.res = {
      status: 403,
      body: { error: "Admin access required" },
    };
    return;
  }

  const flagData = req.body;

  if (!flagData.key || !flagData.name) {
    context.res = {
      status: 400,
      body: { error: "Missing required fields: key, name" },
    };
    return;
  }

  const { getCosmosContainer } = require("../shared/cosmosdb");
  const container = getCosmosContainer("feature-flags");

  const newFlag = {
    id: flagData.key,
    key: flagData.key,
    name: flagData.name,
    description: flagData.description || "",
    type: flagData.type || "release",
    status: "active",
    enabled: flagData.enabled ?? false,
    targeting: flagData.targeting || {},
    createdAt: new Date().toISOString(),
    createdBy: user.email,
    updatedAt: new Date().toISOString(),
    owner: flagData.owner || user.email,
    tags: flagData.tags || [],
  };

  await container.items.create(newFlag);
  flagService.lastCacheRefresh = null;

  context.res = {
    status: 201,
    body: {
      success: true,
      flag: newFlag,
    },
  };
}

async function handlePut(context, req, user, flagService) {
  if (!user.isAdmin) {
    context.res = {
      status: 403,
      body: { error: "Admin access required" },
    };
    return;
  }

  const { flagKey } = req.query;
  const updates = req.body;

  if (!flagKey) {
    context.res = {
      status: 400,
      body: { error: "Flag key required" },
    };
    return;
  }

  const updatedFlag = await flagService.updateFlag(flagKey, {
    ...updates,
    updatedBy: user.email,
  });

  context.res = {
    status: 200,
    body: {
      success: true,
      flag: updatedFlag,
    },
  };
}
```

---

## Admin UI Component

**1. FeatureFlagsManager**

```tsx
// admin-app/src/components/feature-flags-manager.tsx

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface FeatureFlag {
  key: string;
  name: string;
  description: string;
  type: "release" | "experiment" | "ops" | "permission";
  enabled: boolean;
  status: "active" | "inactive" | "archived";
  owner: string;
  createdAt: string;
  updatedAt: string;
  targeting?: {
    environments?: string[];
    percentage?: number;
    userGroups?: string[];
  };
}

export function FeatureFlagsManager() {
  const [flags, setFlags] = useState<FeatureFlag[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    fetchFlags();
  }, []);

  const fetchFlags = async () => {
    try {
      const response = await fetch("/api/admin/feature-flags", {
        headers: {
          Authorisation: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      setFlags(data.flags || []);
    } catch (error) {
      console.error("Failed to fetch flags:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFlag = async (flagKey: string, enabled: boolean) => {
    try {
      await fetch(`/api/admin/feature-flags/${flagKey}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorisation: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ enabled }),
      });

      setFlags(flags.map((f) => (f.key === flagKey ? { ...f, enabled } : f)));
    } catch (error) {
      console.error("Failed to toggle flag:", error);
    }
  };

  const filteredFlags = flags.filter((flag) => {
    if (filter === "all") return true;
    if (filter === "enabled") return flag.enabled;
    if (filter === "disabled") return !flag.enabled;
    return flag.type === filter;
  });

  const getFlagTypeBadge = (type: string) => {
    const colors = {
      release: "bg-blue-500",
      experiment: "bg-purple-500",
      ops: "bg-orange-500",
      permission: "bg-green-500",
    };
    return (
      <Badge className={colors[type as keyof typeof colors]}>{type}</Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Feature Flags</h2>
        <Button onClick={() => (window.location.href = "/admin/flags/new")}>
          Create Flag
        </Button>
      </div>

      <div className="flex gap-2">
        {[
          "all",
          "enabled",
          "disabled",
          "release",
          "experiment",
          "ops",
          "permission",
        ].map((f) => (
          <Button
            key={f}
            variant={filter === f ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </Button>
        ))}
      </div>

      <div className="grid gap-4">
        {filteredFlags.map((flag) => (
          <Card key={flag.key}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {flag.name}
                    {getFlagTypeBadge(flag.type)}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {flag.key}
                  </p>
                </div>
                <Switch
                  checked={flag.enabled}
                  onCheckedChange={(enabled) => toggleFlag(flag.key, enabled)}
                />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-4">{flag.description}</p>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Owner:</span>
                  <span className="ml-2">{flag.owner}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Updated:</span>
                  <span className="ml-2">
                    {new Date(flag.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {flag.targeting && (
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <p className="font-medium text-sm mb-2">Targeting Rules:</p>
                  <div className="space-y-1 text-sm">
                    {flag.targeting.environments && (
                      <p>
                        Environments: {flag.targeting.environments.join(", ")}
                      </p>
                    )}
                    {flag.targeting.percentage !== undefined && (
                      <p>Rollout: {flag.targeting.percentage}%</p>
                    )}
                    {flag.targeting.userGroups && (
                      <p>Groups: {flag.targeting.userGroups.join(", ")}</p>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
```

---

## Best Practices: Naming and Lifecycle

**1. Flag Naming Conventions**

```javascript
// ✅ Good flag names
"new-agent-builder"; // Feature name
"v2-prompt-engine"; // Version indicator
"enable-ai-recommendations"; // Clear action
"beta-collaboration-mode"; // Indicates stability

// ❌ Bad flag names
"flag1"; // Not descriptive
"temp"; // Unclear purpose
"johns-feature"; // Not meaningful
"test"; // Too generic
```

Rules: use kebab-case, be descriptive and specific, include context (feature area), indicate lifecycle (beta, v2, new), avoid abbreviations unless well-known.

**2. Flag Expiration**

```javascript
{
  key: 'new-agent-builder',
  type: 'release',
  enabled: true,
  createdAt: '2025-10-01',
  expiresAt: '2025-11-15', // 45 days max
  status: 'cleanup-required'
}
```

Set expiration dates on release toggles. Prevention strategies: automated alerts when flags are stale (>60 days), required expiration dates for release flags, monthly review of all active flags, flag retirement sprint every quarter, documentation in flag metadata (JIRA ticket, owner).

---

## Testing with Feature Flags

**1. Test Flag Behavior Explicitly**

```javascript
// ❌ Don't: Test both paths separately
describe("Agent Builder", () => {
  it("works with new builder", () => { /* Test new builder */ });
  it("works with old builder", () => { /* Test old builder */ });
});

// ✅ Do: Test flag behavior explicitly
describe("Agent Builder", () => {
  describe("when new-agent-builder is enabled", () => {
    beforeEach(() => {
      mockFeatureFlag("new-agent-builder", true);
    });

    it("renders new builder UI", () => {
      expect(screen.getByTestId("new-agent-builder")).toBeInTheDocument();
    });
  });

  describe("when new-agent-builder is disabled", () => {
    beforeEach(() => {
      mockFeatureFlag("new-agent-builder", false);
    });

    it("renders legacy builder UI", () => {
      expect(screen.getByTestId("legacy-agent-builder")).toBeInTheDocument();
    });
  });

  describe("when new-agent-builder is undefined", () => {
    beforeEach(() => {
      mockFeatureFlag("new-agent-builder", undefined);
    });

    it("defaults to legacy builder", () => {
      expect(screen.getByTestId("legacy-agent-builder")).toBeInTheDocument();
    });
  });
});
```

---

## Monitoring and Security

**1. Telemetry for Flag Evaluations**

```javascript
async function logFlagEvaluation(
  flagKey: string,
  result: FlagEvaluationResult,
  context: FlagEvaluationContext
) {
  telemetryClient.trackEvent({
    name: "FeatureFlagEvaluated",
    properties: {
      flag: flagKey,
      enabled: result.enabled,
      reason: result.reason,
      userId: context.userId,
      environment: context.environment,
    },
  });

  incrementCounter(`feature_flag.${flagKey}.evaluations`);
  if (result.enabled) {
    incrementCounter(`feature_flag.${flagKey}.enabled`);
  }
}
```

Key metrics: flag evaluation count (by flag, by user), flag toggle frequency, failed evaluations, cache hit rate, evaluation latency, flag age (stale flag detection).

**2. Filter Client-Safe Flags**

```javascript
// ❌ Don't: Expose sensitive flags to frontend
const flags = {
  "admin-debug-mode": true, // Security risk!
  "bypass-rate-limiting": false, // Security risk!
  "new-ui-design": true, // OK
};

// ✅ Do: Filter flags by sensitivity
function getFlagsForClient(userRole: string) {
  const allFlags = await flagService.getAllFlags();

  const clientFlags = Object.entries(allFlags)
    .filter(([key, flag]) => {
      if (flag.tags?.includes("backend-only")) return false;
      if (flag.tags?.includes("security")) return false;

      if (flag.type === "permission" && userRole !== "admin") {
        return false;
      }

      return true;
    })
    .reduce((acc, [key, flag]) => {
      acc[key] = flag.enabled;
      return acc;
    }, {});

  return clientFlags;
}
```

**3. Never Use Flags for Authorisation**

```javascript
// ❌ DANGEROUS: Using flags for access control
if (featureFlags.isEnabled("admin-access")) {
  return AdminPanel(); // Anyone can toggle this!
}

// ✅ CORRECT: Use proper Authorisation
if (user.role === "admin") {
  if (featureFlags.isEnabled("new-admin-panel")) {
    return NewAdminPanel();
  }
  return LegacyAdminPanel();
}
```

**4. Fail Secure by Default**

```javascript
// ❌ Fail open (insecure)
const allowExternalSharing = featureFlags.isEnabled("external-sharing");
// If flag service fails, this could be undefined (truthy in JS)

// ✅ Fail closed (secure)
const allowExternalSharing =
  featureFlags.isEnabled("external-sharing") === true;
// Explicitly check for true, defaults to false on error
```

---

## Rollout Strategy and Emergency Procedures

**1. Rollout Schedule**

- Day 1: 5% — Error rates, crashes, performance
- Day 2: 5% — User feedback, edge cases
- Day 3: 25% — Scaling issues, database load
- Day 4: 25% — Feature usage metrics
- Day 5: 50% — Business metrics, conversions
- Day 6–7: 50% — Comprehensive monitoring
- Day 8: 100% — Final validation
- Day 22+: 100% — Flag cleanup

**2. Emergency Disable Mechanism**

```javascript
class FeatureFlagEmergency {
  async emergencyDisable(flagKey: string, reason: string) {
    console.error(`[EMERGENCY] Disabling flag: ${flagKey}. Reason: ${reason}`);

    // 1. Disable immediately in cache
    this.cache.set(flagKey, { enabled: false, reason: "emergency" });

    // 2. Update database
    await this.updateFlag(flagKey, {
      enabled: false,
      status: "incident",
      incidentReason: reason,
      disabledAt: new Date(),
      disabledBy: "system",
    });

    // 3. Notify team
    await this.notifyTeam({
      severity: "critical",
      message: `Flag ${flagKey} emergency disabled: ${reason}`,
      channel: "#incidents",
    });

    // 4. Invalidate all caches
    await this.broadcastCacheInvalidation(flagKey);
  }
}
```

---

## Code Examples: Migration, A/B Testing, Circuit Breaker

**1. Gradual Database Migration**

```javascript
async function getAgentById(agentId: string) {
  const migrationPercentage = await flags.getValue(
    "cosmosdb-migration-percentage",
    { defaultValue: 0 }
  );

  const hash = hashString(agentId);
  const percentile = (hash % 100) + 1;

  if (percentile <= migrationPercentage) {
    console.log(`[Migration] Reading agent ${agentId} from CosmosDB`);
    return await cosmosAgentRepository.getById(agentId);
  } else {
    console.log(`[Migration] Reading agent ${agentId} from MongoDB`);
    return await mongoAgentRepository.getById(agentId);
  }
}

// Rollout schedule:
// Week 1: 10% CosmosDB, 90% MongoDB
// Week 2: 50% CosmosDB, 50% MongoDB
// Week 3: 100% CosmosDB, remove MongoDB code
```

**2. A/B Testing UI Variants**

```javascript
async function getRecommendedPrompts(userId: string) {
  const variant = await flags.getVariant("prompt-recommendations-test", {
    userId,
    variants: ["control", "ml-based", "popularity-based"],
    weights: [34, 33, 33], // Equal distribution
  });

  let prompts;

  switch (variant.value) {
    case "ml-based":
      prompts = await mlRecommendationEngine.getPrompts(userId);
      break;
    case "popularity-based":
      prompts = await getPopularPrompts(userId);
      break;
    default: // control
      prompts = await getRecentPrompts(userId);
  }

  await analytics.track("prompt_recommendations_shown", {
    userId,
    variant: variant.value,
    promptCount: prompts.length,
  });

  return { prompts, variant: variant.value };
}
```

**3. Circuit Breaker Pattern**

```javascript
class LoadMonitor {
  async checkSystemLoad() {
    const cpuUsage = await this.getCPUUsage();
    const memoryUsage = await this.getMemoryUsage();
    const requestRate = await this.getRequestRate();

    const isHighLoad = cpuUsage > 80 || memoryUsage > 85 || requestRate > 1000;

    if (isHighLoad) {
      await flags.updateFlag("enable-ai-analysis", {
        enabled: false,
        reason: "high_load_circuit_breaker",
      });

      await flags.updateFlag("enable-real-time-sync", {
        enabled: false,
        reason: "high_load_circuit_breaker",
      });
    } else {
      await flags.updateFlag("enable-ai-analysis", {
        enabled: true,
        reason: "load_normal",
      });

      await flags.updateFlag("enable-real-time-sync", {
        enabled: true,
        reason: "load_normal",
      });
    }
  }
}

async function analyzePrompt(req, res) {
  const aiAnalysisEnabled = await flags.isEnabled("enable-ai-analysis");

  if (!aiAnalysisEnabled.enabled) {
    return res.json({
      analysis: null,
      message: "AI analysis temporarily unavailable due to high load",
      reason: aiAnalysisEnabled.reason,
    });
  }

  const analysis = await aiService.analyzePrompt(req.body.prompt);
  return res.json({ analysis });
}
```

**4. Feature Deprecation**

```javascript
// api/agents-legacy/index.js
module.exports = async function (context, req) {
  const allowLegacyApi = await flags.isEnabled("allow-legacy-agents-api");

  if (!allowLegacyApi.enabled) {
    context.res = {
      status: 410, // Gone
      body: {
        error: "This API endpoint has been deprecated",
        message: "Please migrate to /api/agents/v2",
        documentationUrl: "https://docs.company.com/api-v2-migration",
        sunsetDate: "2025-12-31",
      },
    };
    return;
  }

  await analytics.track("legacy_api_used", {
    endpoint: "/api/agents",
    userId: req.user?.id,
    warningShown: true,
  });

  context.res = {
    headers: {
      "X-API-Deprecated": "true",
      "X-API-Sunset-Date": "2025-12-31",
      "X-API-Migration-Url": "https://docs.company.com/api-v2-migration",
    },
    body: await getLegacyAgents(req),
  };
};
```

---

## Tools and Decision Matrix

**1. Build Your Own (Recommended for This Project)**

Pros: full control, no external dependencies, cost-effective (uses existing infrastructure), customizable, no data leaves your infrastructure. Cons: more development effort, need to build admin UI, manual monitoring setup. Best for: projects with existing database infrastructure, serverless architectures, teams that value control.

**2. LaunchDarkly (SaaS)**

Pros: comprehensive feature set, excellent UI/UX, real-time updates, advanced targeting, experimentation platform. Cons: expensive ($$$), external dependency, data governance concerns. Pricing: ~$10/month (starter) to $500+/month (enterprise).

**3. Unleash (Open Source)**

Pros: free and open source, self-hosted option, good feature set, active community. Cons: need to host/maintain, additional infrastructure, learning curve. Best for: teams wanting SaaS-like features without the cost.

**4. Azure App Configuration (Azure Native)**

Pros: native Azure integration, built-in feature flags, reasonable pricing, managed service. Cons: Azure-specific, less flexible than custom, additional service to manage. Pricing: ~$1/day for basic tier.

**5. Recommendation**

Build your own using the patterns in this guide. Leverage existing CosmosDB infrastructure, use Azure Functions for API, build lightweight admin UI in React, integrate with Application Insights for monitoring. Total cost: $0 additional (uses existing resources).

**6. Quick Decision Matrix**

- New UI component (1 sprint): Yes — Release
- Bug fix: No — Deploy directly
- Database migration: Yes — Ops
- A/B test: Yes — Experiment
- Beta feature: Yes — Permission
- Config change: No — Use environment variables
- Seasonal feature: Yes — Release
- Emergency kill switch: Yes — Ops

---

## Documentation Requirements and Monitoring Dashboard

**1. Every Feature Flag MUST Have**

```javascript
{
  key: 'collaborative-editing',
  name: 'Collaborative Editing',
  description: 'Enable real-time collaborative editing of prompts',
  documentationUrl: 'https://wiki.company.com/features/collaborative-editing',
  jiraTicket: 'FEAT-1234',
  owner: 'engineering-team@company.com',
  technicalContact: 'jane.doe@company.com',
  createdAt: '2025-10-01',
  expiresAt: '2025-11-30',
  removalDate: '2025-12-15',
  dependencies: ['websocket-service', 'real-time-sync'],
  impactedServices: ['api', 'client-app'],
  successMetrics: [
    'users_collaborating',
    'edits_per_session',
    'conflict_resolution_rate'
  ],
  rolloutPlan: {
    phase1: { date: '2025-10-15', percentage: 5 },
    phase2: { date: '2025-10-17', percentage: 25 },
    phase3: { date: '2025-10-20', percentage: 100 }
  }
}
```

**2. Monitoring Dashboard Metrics**

Active Flags Count: by type (release, experiment, ops, permission), by age (< 30 days, 30–60 days, > 60 days), by status (enabled, disabled, archived).

Flag Evaluation Metrics: evaluations per second, cache hit rate, evaluation latency (p50, p95, p99), error rate.

Feature Usage: users affected by each flag, feature adoption rate, conversion metrics.

Technical Health: stale flags (> 60 days), flags without owners, flags without expiration, complex flag combinations (technical debt).

---

## Performance Optimization

**1. Cache Flag Evaluations**

```javascript
// ❌ Don't: Evaluate flags on every render
function AgentCard({ agent }) {
  const showNewDesign = useFeatureFlag("new-agent-card-design");
  return showNewDesign ? <NewCard /> : <OldCard />;
}

// ✅ Do: Cache flag evaluations
function AgentCard({ agent }) {
  const showNewDesign = useFeatureFlag("new-agent-card-design");
  return useMemo(
    () => (showNewDesign ? <NewCard /> : <OldCard />),
    [showNewDesign, agent]
  );
}

// ✅ Even better: Batch flag fetching
function FeatureFlagProvider({ children }) {
  useEffect(() => {
    const fetchAllFlags = async () => {
      const flags = await api.getFeatureFlags();
      setFlagsCache(flags);
    };

    fetchAllFlags();
    const interval = setInterval(fetchAllFlags, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return <Context.Provider value={flagsCache}>{children}</Context.Provider>;
}
```

Performance tips: cache flag evaluations (TTL: 5–10 minutes), batch flag fetching (single API call), lazy load flag evaluation service, use CDN for static flag configurations, implement circuit breaker for flag service failures.

---

## Appendix: Resources and Contact

**Further Reading**

- Feature Toggles (Martin Fowler): https://martinfowler.com/articles/feature-toggles.html
- Azure App Configuration Feature Flags: https://learn.microsoft.com/en-us/azure/azure-app-configuration/concept-feature-management
- LaunchDarkly Best Practices: https://docs.launchdarkly.com/guides/best-practices
- Feature Flag Best Practices (Atlassian): https://www.atlassian.com/continuous-delivery/principles/feature-flags

**Code Repositories**

- Example implementation: `api/shared/feature-flags.js`
- React hook: `client-app/src/hooks/useFeatureFlag.ts`
- Admin UI: `admin-app/src/components/feature-flags-manager.tsx`

**Contact**

For questions about feature flag implementation: Dipesh Trikam — dipesh.trikam@datacom.com

---

📌 **Document Type:** Architecture Doc / Implementation Guide
📅 **Last Updated:** 21 October 2025
🔗 **Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40269742249
