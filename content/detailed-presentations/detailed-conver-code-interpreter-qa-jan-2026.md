# Conver Code Interpreter - QA testing Jan 2026 - Dataset Persistence & Integrity
> QA test plan verifying Code Interpreter retention, recall, and manipulation of datasets across multiple prompts within a single conversation

**Author:** [Kieran Sinclair](https://datacomgroup.atlassian.net/wiki/people/712020:0d1ab0fb-43a0-44b4-947a-76c59f0c531b)
**Date:** 29 January 2026
**Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40679800900

---

## 🎯 Context

The Conver Code Interpreter enables users to upload datasets, run code, conduct analysis, and generate files (e.g., Word, Excel) within chat. This QA test plan evaluates whether the tool can retain, accurately recall, and correctly manipulate datasets across multiple prompts. Testing used the SD tickets.xlsx file (25 rows, 10 columns) and GPT-5.2. Files were uploaded via "Upload for Code Interpreter" once the feature was enabled.

---

## 🔍 Problem

For analytical workflows, users must trust that the Code Interpreter retains uploaded data accurately across prompts, recalls specific values correctly, and does not fabricate or alter data. The testing revealed inconsistent one-shot analysis accuracy, multi-turn data drift after 2–3 prompts, and AI-generated data inconsistency when recalling mock datasets—raising concerns for analytical reliability where data accuracy is critical.

---

## 📋 Observations

**1. Short-term retention (single follow-up) — generally good**
| Test ID | Scenario | Expected Outcome | Test Result |
|---------|----------|------------------|-------------|
| 1.1 | Immediate Data Recall — ask "How many rows?" in next prompt | Exact row count without re-upload | **Good** |
| 1.2 | Immediate Visualization — "create a bar chart of Category column" | Chart using original data, values match source | **Good** |
| 1.3 | Immediate Export — "provide as downloadable Excel file" | Identical data to original | **Good — original and downloaded datasets identical** |
| 1.4 | Immediate Analysis — "Give me analysis of issues by department" | Accurate analysis | **Mixed:** First attempt contained fabrications; two subsequent tests with same prompt/data returned accurate breakdowns |

**2. One-shot analysis — inconsistent accuracy**
| Test ID | Scenario | Expected | Result |
|---------|----------|----------|--------|
| 1.4.1 | Simple aggregate: Total tickets, Resolved count | Total = 25, Resolved = 11 | **Good** |
| 1.4.2 | Filtered breakdown by Priority | Critical = 3, High = 7, Medium = 9, Low = 6 | **Good** |
| 1.4.3 | Cross-tab: Status by Department; most Open tickets | Marketing and Legal each have 3 Open (tied) | **Good first try; erroneous on second try** |
| 1.4.4 | Specific value: TKT-008 — submitter, priority, assignee | Chris Martinez, Critical, Lisa Park | **First try good; second produced erroneous response** (spreadsheet had correct data but tool read first row and produced incorrect output) |
| 1.4.5 | Calculated metric: avg days Created→Resolution for Resolved | TKT-005 (2 days), TKT-006 (1 day) only resolved >1 day | **Good** |
| 1.4.6 | Edge case: Sarah Mitchell assignments; Accounting department | Sarah Mitchell = Requester only, no assignments; Accounting = No tickets | **Good** |

**3. Multi-turn data integrity — fabrication and drift**
| Test ID | Scenario | Expected | Result |
|---------|----------|----------|--------|
| 2.1 | Sequential modifications over 3–4 prompts (add column, filter, export) | Each step builds correctly; export reflects all changes | **Good — no concerns** |
| 2.2 | After summary + visualization, "print first 10 rows of original data" | Printed rows match original exactly | **Fabrication in output data** (original set vs AI output differed) |
| 2.3 | After 2–3 analysis prompts, "What is assignee for TKT-001?" | Returns "John Smith" exactly | **Fabricated responses** to assignee and similar questions |
| 2.4 | Long conversation stress test (6+ prompts); export final state | Export reflects all changes, no fabricated entries | **(Test not completed)** |

**4. Generated dataset persistence — mock data recall failure**
| Test ID | Scenario | Expected | Result |
|---------|----------|----------|--------|
| 3.1 | Generate 20 mock tickets; next prompt "show me the dataset you just created" | Identical 20 rows displayed | **Dataset very different from original; contained fabrications.** Second dataset retained same ticket numbers and columns but different values. |
| 3.2 | Generate mock dataset; follow-up "export as CSV" then "as .xlsx" | Downloaded files match originally generated data | **Good** — same download URL for CSV; exact dataset in .xlsx |

**5. Intermittent file-not-found behaviour**
On some occasions, a one-shot prompt such as "give me some analysis of the issues here" resulted in the AI stating it could not find the file originally provided—despite multiple tool calls in the response. Example: https://datacomchat.datacom.com/share/0IC9m1zK97LtZjY9laMKJ

**6. Summary of strengths**
Successfully retained uploaded datasets for immediate follow-up tasks. Correctly recalled row counts, generated accurate visualizations, and exported identical copies of the original file within one prompt of upload.

**7. Summary of areas of concern**
- **Inconsistent one-shot analysis accuracy:** Single-prompt analysis produced mixed results—first attempt contained fabricated details referencing values not in the dataset; two subsequent tests with same prompt and data returned accurate breakdowns.
- **Multi-turn data drift:** After 2–3 analysis prompts, the model showed difficulty recalling specific values (e.g., incorrect assignees for ticket IDs) and introduced inaccurate data when asked to reproduce the original dataset.
- **AI-generated data consistency:** When asked to display previously created mock datasets, the model produced different values while retaining only ticket ID numbers.
- **Analytical reliability limitations:** The tool shows promise for retrieval and export tasks, but inconsistency—even in identical test conditions—suggests it may benefit from refinement before being relied upon for analytical tasks where data accuracy is critical.

**8. Test environment**
- **Model:** GPT-5.2
- **Test file:** SD tickets.xlsx — 25 rows, 10 columns
- **Method:** Upload via "Upload for Code Interpreter"; each sub-test run 2–3 times in separate fresh conversations to verify consistency

---

## 💡 Proposal

Use Code Interpreter for retrieval and export tasks where immediate follow-up is sufficient; treat analytical tasks requiring multi-turn or one-shot accuracy with caution until refinement.

- Use for: immediate data recall, visualization, export (single follow-up)
- Validate one-shot analysis results against source data before relying on them
- Avoid relying on multi-turn recall of specific values (e.g., assignees) without re-verification
- Run critical analytical sub-tests 2–3 times in fresh conversations to check consistency
- Consider refinement before production use for analytical workflows where data accuracy is critical

*The tool is validated for basic workflows but shows inconsistency in analytical reliability.*

---

## ⚠️ Risks

- **Data fabrication:** One-shot analysis and multi-turn recall can produce fabricated values not present in the source dataset.
- **Multi-turn drift:** After 2–3 analysis prompts, specific value recall (e.g., assignee for TKT-001) becomes unreliable.
- **Mock data inconsistency:** AI-generated datasets are not reliably recalled—same IDs/columns but different values.
- **File-not-found:** Intermittent failures where the AI cannot find the originally uploaded file.

---

## ✅ Next Steps

1. **Complete Test 2.4** — Run long conversation stress test (6+ prompts) and verify exported file accuracy.
2. **Re-test 1.4.3 and 1.4.4** — Document conditions causing erroneous vs correct results in cross-tabulation and specific value retrieval.
3. **Refinement before analytical reliance** — Address inconsistency in one-shot and multi-turn scenarios before promoting for analytical use cases.
4. **Document workarounds** — For users needing multi-turn analysis, recommend re-upload or re-query strategies.

---

## 🔑 Close

> Code Interpreter excels at immediate retention, visualization, and export but shows inconsistent accuracy in one-shot analysis and multi-turn data recall—refinement recommended before reliance on analytical tasks where data accuracy is critical.

The testing used GPT-5.2 with a 25-row, 10-column dataset. Strengths are clear for short-term tasks; concerns centre on fabrication, drift after 2–3 prompts, and mock data recall. Each sub-test should be run 2–3 times in separate fresh conversations to verify consistency.
