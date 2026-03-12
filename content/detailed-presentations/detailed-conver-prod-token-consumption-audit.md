# (DAAAT-485) Conver PROD Token Consumption Audit

> Investigation and documentation of discrepancies in token consumption calculations where users experience unexpectedly high token burn rates relative to selected models.

**Author:** [Harrison Bland](https://datacomgroup.atlassian.net/wiki/people/712020:f8283e50-5198-4bc0-b519-63b9e88649fd)
**Date:** 4 March 2026
**Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40842133509

---

## 🎯 Context

This document defines the scope, methodology, and deliverables for an audit of Conver production token consumption. Users report unexpectedly high token burn rates. The phase is **investigation and documentation only** — no fixes are implemented. The audit covers 13 models across 6 scenarios with 2 repeats each, for a total of **156 planned runs**.

---

## 🔍 Problem

Reports indicate potential issues in: token counting methodology inconsistencies between models/providers; incorrect token calculation formulas; missing or incorrect model rate mappings; tracking/logging errors; and double-counting or input/output misallocation. Users are experiencing unexpectedly high token burn rates relative to selected models, affecting cost predictability and user limits.

---

## 📋 Observations

**1. Audit scope is investigation-only — no implementation**

Included: audit token consumption logic, verify counting methodology consistency, audit model-specific token rate configuration, compare API usage vs logged records, validate prompt/completion/total and cumulative tracking, identify discrepancies and root causes, produce prioritized findings and recommendations. **Excluded:** implementing fixes, changing calculation logic/configuration, token limit/quota policy changes, UI changes, historical correction backfill.

**2. Test environment uses local/offline dev branch**

Environment: Local/offline deployment (dev branch), intended parity baseline for QA. Purpose: controlled reproduction of token accounting behaviour before QA rollout. Balance policy: 20M token-style account behaviour validated through transaction/balance deltas. Data isolation: dedicated audit user/account(s) for clean measurement. Configuration: `librechat.yaml` + `.env`; `azureAssistants` excluded.

**3. In-scope model set covers 13 models across four groups**

Model groups: Quick & Simple (Default), Balanced Performance (Everyday), Advanced & Powerful, Legacy. **13 models:** `azureOpenAI`: gpt-5-nano, gpt-5-mini, gpt-5.1-chat, gpt-5.1, gpt-5-pro, gpt-5, gpt-5-chat; `google`: gemini-2.5-flash-lite, gemini-2.5-flash, gemini-2.5-pro; `anthropic`: claude-opus-4-5; `bedrock`: us.anthropic.claude-3-7-sonnet-20250219-v1:0, us.anthropic.claude-sonnet-4-20250514-v1:0.

**4. Full factorial test matrix: 156 planned runs**

**Models:** 13. **Scenarios per model:** 6 (baseline, multi_turn, long_prompt, tool_call, streaming, abort). **Repeats:** 2 (option to expand to 3 if variance appears). **Total planned runs: 156.** Execution rules: fixed prompts/fixtures per scenario; fixed settings per model run; per-run capture of provider usage + application logged usage + transaction/balance effects; blocked runs recorded as blocked, not failed.

**5. Evidence collection standard per run**

Run metadata: run_id, timestamp, endpoint, model, scenario, repeat. Provider usage: prompt/input tokens, completion/output tokens, total tokens, reasoning/cache fields if returned. Application-side: logged prompt/completion/total, transaction records (prompt, completion, structured), balance before/after + delta. Variance: absolute variance, variance %. Outcome: pass / fail / blocked, notes + hypothesis.

**6. Pass/fail criteria are clearly defined**

**Pass:** Logged token values align with provider-reported usage; no duplicate spending for one logical response step; balance delta matches transaction totals/rate application. **Fail:** Missing/misparsed provider usage fields; prompt/completion inversion or total mismatch; double counting (especially tool/stream/abort paths); incorrect rate fallback/default where model-specific mapping should exist; cumulative drift across repeated runs without explainable cause. **Blocked:** Model unavailable or unresolved; upstream provider usage field absent.

**7. Severity framework for prioritisation**

**Critical:** Severe overcharging/double-counting or major cumulative drift affecting user limits. **High:** Systematic per-model inaccuracies with significant burn impact. **Medium:** Intermittent or scenario-specific mismatches, non-catastrophic but material. **Low:** Minor discrepancies, documentation gaps, low-impact inconsistencies.

**8. Six investigation areas mapped to JIRA**

(1) Token counting methods (provider usage vs tokenizer/fallback behaviour); (2) Model-specific pricing/rate application and default fallback behaviour; (3) API usage parsing completeness and streaming handling; (4) Tracking implementation (transactions, cumulative updates, potential race/double count); (5) Configuration correctness for model IDs/endpoints/rates; (6) Edge cases: empty input/output, long prompts, multi-turn, tool calls, aborts, streaming.

**9. Phase B appendix lists all 156 run IDs**

Each run follows pattern: `{model_short}-{scenario}-r{repeat}` (e.g. g5n-baseline-r1, g5n-baseline-r2). All 156 runs are marked **planned** in the appendix. Examples: g5n-baseline-r1/r2 through g5n-abort-r1/r2 (gpt-5-nano); g5m-* (gpt-5-mini); g25fl-* (gemini-2.5-flash-lite); g51c-*, g51-* (gpt-5.1-chat, gpt-5.1); g25f-* (gemini-2.5-flash); g5p-* (gpt-5-pro); g25p-* (gemini-2.5-pro); c45o-* (claude-opus-4-5); g5-*, g5c-* (gpt-5, gpt-5-chat); b37s-*, b4s-* (bedrock Claude models).

**10. Future phases: QA replication and pre-prod confidence**

**Phase C (Post-local):** Replicate matrix in QA with same fixtures and pass/fail criteria; compare local vs QA behaviour for environment-specific divergence; expand repeats to 3 for unstable variance. **Phase D (Pre-prod confidence):** Test with example user chats that experienced token limit issues; compare results against Phase B & C auditing.

---

## 💡 Proposal

Execute a structured audit to document token consumption discrepancies and produce actionable recommendations.

- **Complete 156 planned runs** (or mark blocked with rationale)
- **Capture evidence for every run** per the evidence standard
- **Produce findings list** with severity and root cause hypotheses
- **Complete model-by-model consistency assessment**
- **Document recommendations** with effort/risk and testing requirements
- **Deliver:** Executive Summary, Current State Analysis, Findings Register, Accuracy Comparison, Recommendations

*This phase is investigation-only. Implementation of fixes will follow in a separate ticket based on audit outcomes.*

---

## ⚠️ Risks

- **Scope creep:** Fixing issues during audit could invalidate findings; strict investigation-only scope must be maintained
- **Environment divergence:** Local vs QA vs PROD behaviour may differ; Phase C/D are critical for validation
- **Blocked runs:** Model unavailability or missing provider fields could reduce effective coverage

---

## ✅ Next Steps

1. **Execute Phase B** — Run all 156 planned runs, capture evidence, document findings
2. **Sign-off checklist** — Confirm all runs executed or blocked; findings complete; recommendations documented
3. **Phase C** — Replicate in QA, compare local vs QA behaviour
4. **Phase D** — Test with real user chats that experienced token limit issues
5. **Implementation ticket** — Create follow-up ticket for fixes based on audit recommendations

---

## 🔑 Close

> The audit is a documentation-only investigation of token consumption discrepancies across 13 models and 6 scenarios (156 runs). No fixes are implemented in this phase. Deliverables include a Findings Register, Accuracy Comparison, and prioritized recommendations for a subsequent implementation ticket.

Users experiencing unexpectedly high token burn rates will benefit from evidence-based root cause analysis and a clear fix backlog. Phases C and D will validate findings in QA and with real user data before changes are applied.
