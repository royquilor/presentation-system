# Versioning System for Agents & Prompts

> A technical design document describing how to replace timestamp-based duplicate naming with a proper date-driven version management system for agents and prompts in the Agent Library.

**Author:** [Dipesh Trikam](https://datacomgroup.atlassian.net/wiki/people/712020:06f04ec7-5f4c-4e03-a2a3-3e46b413e073)
**Date:** 16 October 2025
**Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40255914017

---

## 🎯 Context

The Agent Library (Insights & Analytics team) currently handles sharing agents and prompts by creating duplicates with timestamp suffixes in their names (e.g., `My Agent (2025-08-27 00:05)`). The platform already has a `versions` array and `updatedAt` field pattern used elsewhere (DatacomChat), which can be repurposed to track versions without schema duplication.

---

## 🔍 Problem

The existing duplication approach creates multiple copies of an agent or prompt per original, resulting in cluttered naming and no clear "latest version" signal. Users have no way to know whether their installed copy is out of date, and there is no mechanism to upgrade without manually re-requesting access.

---

## 📋 Observations

- **Minimal schema change required:** Only one new field — `installedVersionDate` on ACL entries — needs to be added; the rest reuses existing `versions[]` and `updatedAt` fields.
- **Single duplicate per original:** Logic in the duplication service will check for an existing duplicate via `originalAgentId`/`originalPromptId` before creating a new one; if found, it pushes a new version entry and updates top-level fields.
- **Version detection via date comparison:** An "Update Available" badge is shown when ACL `installedVersionDate` differs from the duplicate's current `updatedAt`.
- **Two new API endpoints:** `GET /api/agents/:agentId/version-info` returns version metadata and `POST /api/agents/:agentId/update` allows the user to manually upgrade their installed version.
- **UI changes include:** A `version-info-banner.tsx` component, updated detail modals showing version history, and an admin submissions view distinguishing "New" vs. "Update" submissions.
- **A migration script** will clean up existing duplicates by stripping timestamp suffixes from names and back-filling `installedVersionDate` on ACL entries.
- **No auto-updates:** Users retain full control over when they upgrade to a newer published version.

---

## 💡 Proposal

Refactor the duplication services (`agent-duplication-service.js` and `prompt-duplication-service.js`) to maintain a single published duplicate per original, using the existing `versions` array to accumulate version history and `updatedAt` as the canonical version date. A new `installedVersionDate` field in ACL entries enables per-user update tracking, surfaced through new API endpoints and a React update banner component in the client app.

---

## ⚠️ Risks

- **Migration complexity:** Existing duplicates have timestamp-suffixed names; a one-time migration script must safely rename them and back-fill ACL data without data loss.
- **Approval workflow coupling:** Approval logic in `api/approvals/index.js` (lines 3142–3939) must correctly set `updatedAt` as the published version date — incorrect handling could break version comparison.
- **User confusion during transition:** Until migration runs, some users may see both old-style and new-style duplicates in their library.
- **Chained agent versioning:** Duplicated chained agents (`agent_ids`) must also be updated correctly when a version is pushed, adding complexity to the duplication path.

---

## ✅ Next Steps

- **Phase 1:** Update `duplicateAgentForSharing()` and `duplicatePromptForSharing()` to find-or-update duplicates using `originalAgentId`/`originalPromptId`.
- **Phase 2:** Implement `GET /version-info` and `POST /update` endpoints in `api/agents/index.js` and `api/prompts/index.js`.
- **Phase 3:** Build the `version-info-banner.tsx` component and update detail modals and admin submissions list.
- **Phase 4:** Run the migration script to clean up existing duplicate names and back-fill `installedVersionDate`.
- **Phase 4:** End-to-end test the full flow: submit → approve → user update.

---

## 🔑 Close

This design achieves clean, user-friendly versioning by leveraging existing data patterns with a single schema addition, giving users a clear update signal and one-click upgrade path without breaking the existing approval workflow.

---

📌 **Document Type:** Architecture Doc / Technical Design
📅 **Last Updated:** 16 October 2025
🔗 **Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40255914017
