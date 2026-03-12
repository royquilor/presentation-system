# Conver Audit Phase B v1 (05-03-26)
> Structured audit framework for validating Conver model usage, billing accuracy, and scenario coverage across 13 models and 6 test scenarios

**Author:** [Harrison Bland](https://datacomgroup.atlassian.net/wiki/people/712020:f8283e50-5198-4bc0-b519-63b9e88649fd)
**Date:** 6 March 2026
**Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40850227234

---

## 🎯 Context

Conver Audit Phase B v1 establishes a systematic procedure for validating Conver's model invocation, usage tracking, and billing accuracy. The audit runs a defined matrix of models and scenarios, captures evidence from Audit Mode, and records provider usage, logged usage, balance delta, and variance to ensure Conver's usage metering aligns with hyperscaler billing.

---

## 🔍 Problem

Conver must accurately track and bill token consumption across multiple LLM providers and models. Without structured audit runs, discrepancies between provider usage, logged usage, and balance calculations could go undetected—leading to billing errors, cost overruns, or incorrect customer charges. The audit framework ensures repeatable, evidence-based validation.

---

## 📋 Observations

**1. Matrix scope: 13 models × 6 scenarios × 2 repeats = 156 planned runs**
The audit covers **13 models** across providers, **6 scenarios** (baseline, multi_turn, long_prompt, tool_call, streaming, abort), and **2 repeats** per combination. Total **156 planned runs** provide broad coverage of Conver's usage patterns and edge cases.

**2. Six scenario waves for comprehensive coverage**
Scenarios include: **baseline** (standard single-turn), **multi_turn** (conversation continuity), **long_prompt** (context length stress), **tool_call** (function-calling usage), **streaming** (incremental token delivery), and **abort** (cancelled requests). Each wave is summarised as pass/fail/blocked.

**3. Run procedure: Audit Mode metadata and evidence capture**
Each run configures Audit Mode metadata (`run_id`, `scenario`, `repeat`, optional group), executes the scenario fixture in the UI, fetches the summary from the Audit Mode panel, and records **provider usage**, **logged usage**, **balance delta**, and **variance**. Outcomes are marked as pass/fail/blocked.

**4. Sample evidence record: azureOpenAI gpt-5-nano baseline pass**
One documented run: `d52ad32b-79fc-48d8-8fc1-ebc7d6b9c3d8`, provider **azureOpenAI**, model **gpt-5-nano**, provider usage **565**, logged usage **565**, balance delta **-128.69999999925494**, outcome **pass**. Provider and logged usage match exactly; balance delta reflects cost deduction.

**5. Findings register structure**
Findings are tracked with: `finding_id`, `severity`, `affected_runs`, `symptom`, `root_cause_hypothesis`, `recommendation`. This enables prioritisation and traceability from symptom to remediation.

**6. Sign-off readiness checklist**
Audit completion requires: all runs completed or blocked with rationale; evidence captured for each run; findings prioritised by severity; recommendations drafted for implementation ticket.

**7. Execution context fields (to be populated)**
Each run records: Environment, Branch, Feature Flag, Test User, Start Balance, Date/Time Window. These provide reproducibility and audit trail.

**8. Evidence table and wave summary**
Evidence is captured in a structured table; wave summaries aggregate pass/fail/blocked counts per scenario type for quick health assessment.

---

## 💡 Proposal

Execute the full 156-run audit matrix to validate Conver's usage metering and billing accuracy.

- **Complete all planned runs** — Execute baseline, multi_turn, long_prompt, tool_call, streaming, and abort scenarios across all 13 models
- **Capture evidence for every run** — Record provider usage, logged usage, balance delta, variance, and outcome
- **Document findings in the register** — Log any discrepancies with severity, affected runs, and recommendations
- **Achieve sign-off readiness** — Ensure all checklist items are satisfied before closing Phase B

*The audit framework provides a repeatable, evidence-based validation path for Conver's usage tracking and billing integrity.*

---

## ⚠️ Risks

- **Incomplete runs:** If runs are blocked or skipped without rationale, audit coverage gaps may mask billing inaccuracies in untested scenarios.
- **Unprioritised findings:** Findings without severity or recommendations may delay remediation and leave known issues unaddressed.
- **Evidence gaps:** Missing evidence for individual runs undermines audit traceability and makes root-cause analysis difficult.

---

## ✅ Next Steps

1. **Populate execution context** — Set Environment, Branch, Feature Flag, Test User, Start Balance, and Date/Time Window for each audit session.
2. **Execute full matrix** — Run all 156 planned combinations; capture evidence and mark outcomes.
3. **Complete findings register** — Document any discrepancies; assign severity and draft recommendations.
4. **Create implementation tickets** — Convert recommendations into actionable development work.
5. **Obtain sign-off** — Confirm all readiness criteria met before closing Phase B.

---

## 🔑 Close

> 156 planned runs across 13 models and 6 scenarios provide structured validation of Conver's usage metering and billing accuracy.

Conver Audit Phase B v1 establishes a rigorous, repeatable framework for ensuring that provider usage, logged usage, and balance calculations align. The sample azureOpenAI gpt-5-nano run demonstrates exact alignment (565/565) with a documented balance delta. Full execution of the matrix and completion of the findings register will validate Conver's readiness for production billing.
