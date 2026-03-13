# Conver Audit Phase B — Test Matrix
> 13 models, 6 scenarios, 156 planned runs — the structured audit framework for validating Conver billing accuracy and provider usage tracking

**Author:** Jason Moss — Insights & Analytics
**Date:** March 2026
**Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40301527151

---

## 🎯 Context

Phase B of the Conver audit builds on prior audit phases to systematically validate billing accuracy across the platform's full model catalogue.
The audit uses a structured matrix approach — every model is tested against every scenario type, with repeat runs — to ensure provider usage, logged usage, and balance deltas are consistent and accurate.

---

## 🔍 Problem

Billing accuracy in an AI platform with 13 models and multiple interaction patterns (streaming, multi-turn, tool calls, aborts) requires systematic verification.
Without a structured audit, discrepancies between provider-reported usage and platform-logged usage could go undetected, leading to revenue leakage or overbilling.

---

## 📋 Observations

**1. Matrix scope — 156 planned runs**
13 models tested across 6 scenarios (baseline, multi-turn, long prompt, tool call, streaming, abort) with 2 repeats each. This produces 156 total runs covering the full combinatorial space of model-scenario interactions.

**2. Run procedure — 5-step evidence capture**
Each run follows a defined procedure: configure Audit Mode metadata (run_id, scenario, repeat, optional group), execute the scenario fixture in the UI, fetch the summary from the Audit Mode panel, record provider usage vs logged usage vs balance delta vs variance, and mark the outcome as pass, fail, or blocked.

**3. Six audit waves**
Runs are organised into six waves by scenario type: baseline, streaming, multi-turn, long prompt, tool call, and abort. Each wave is independently assessed as pass, fail, or blocked, enabling targeted investigation of specific interaction patterns.

**4. Sign-off readiness criteria**
Four conditions must be met before sign-off: all runs completed or blocked with rationale, evidence captured for each run, findings prioritised by severity, and recommendations drafted for implementation tickets. The findings register tracks finding ID, severity, affected runs, symptoms, root cause hypothesis, and recommendation.

---

## 💡 Proposal

Complete all 156 runs across the six audit waves, capture evidence for each run, and produce the findings register with prioritised recommendations.

- Execute each wave sequentially: baseline first, then streaming, multi-turn, long prompt, tool call, and abort
- Record variance between provider usage and logged usage for every run
- Prioritise any findings by severity and draft implementation tickets for remediation
- Present sign-off readiness assessment once all four criteria are met

*Systematic coverage across all 13 models and 6 scenario types ensures no billing discrepancy goes undetected.*

---

## ⚠️ Risks

**Blocked runs:** Some model-scenario combinations may be blocked by environment, feature flag, or configuration issues. Blocked runs must be documented with rationale rather than skipped silently.

**Variance thresholds:** The audit needs defined acceptable variance thresholds. Without them, minor floating-point differences could generate false positives in the findings register.

**Environment drift:** If the environment changes during the audit window (deployments, config updates), results may not be comparable across waves.

---

## ✅ Next Steps

1. **Configure execution context** — Confirm environment, branch, feature flags, test user, and start balance for the audit window
2. **Execute baseline wave** — Run all 13 models against the baseline scenario with 2 repeats each
3. **Complete remaining waves** — Streaming, multi-turn, long prompt, tool call, and abort waves in sequence
4. **Compile findings register** — Document all pass/fail/blocked outcomes with evidence and root cause analysis
5. **Draft sign-off assessment** — Confirm all four readiness criteria are met and present for approval

---

## 🔑 Close

> 13 models. 6 scenarios. 156 runs. A structured audit framework to validate Conver billing accuracy end-to-end.

The audit framework is defined and ready for execution. Systematic wave-by-wave coverage ensures every model-scenario combination is tested with repeatable, evidence-backed results.
