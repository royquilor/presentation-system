# Versioning System for Agents & Prompts

> Transform timestamp-based duplicate naming into a proper date-driven version management system for the Agent Library, leveraging existing patterns from DatacomChat.

**Author:** Dipesh Trikam
**Date:** 16 October 2025
**Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40255914017

**Confluence Path:** Insights & Analytics → AI Projects → Active → Agent Library → Agent/Prompt Versioning → Versioning System for Agents & Prompts

**Scope:** Agents and prompts in the Agent Library. Applies to both `api/shared/agent-duplication-service.js` and `api/shared/prompt-duplication-service.js`. Does not affect DatacomChat or other consumers of the version pattern.

**Dependencies:** No new npm packages. Relies on existing MongoDB collections, ACL structure, and approval workflow. Migration script runs as a one-off; no ongoing jobs.

---

## 🎯 Context

The Agent Library (Insights & Analytics) currently handles sharing agents and prompts by creating duplicates with timestamp suffixes in their names (e.g., `My Agent (2025-08-27 00:05)`). Each new submission or update generates another duplicate, leading to multiple copies per original. The platform already has a `versions` array and `updatedAt` field pattern used elsewhere (DatacomChat), which can be repurposed to track versions without schema duplication.

The goal is to maintain a single published duplicate per agent/prompt with date-based versioning from the existing `versions` array and `updatedAt` fields. This aligns the Agent Library with established patterns in the codebase and reduces technical debt.

---

## 🔍 Problem

The existing duplication approach creates multiple copies of an agent or prompt per original, resulting in cluttered naming and no clear "latest version" signal. Users have no way to know whether their installed copy is out of date, and there is no mechanism to upgrade without manually re-requesting access.

The system lacks a coherent versioning strategy and update detection. Submissions that update an existing agent create yet another duplicate instead of updating the published copy. This leads to database bloat, confusing admin views, and a poor user experience when trying to understand which version is current.

---

## 📋 Observations

**1. Minimal Schema Change Required**

Only one new field — `installedVersionDate` (Date) on ACL entries — needs to be added. This lets us compare the user's installed version against the latest `updatedAt` to show an update indicator. All other version tracking reuses existing `versions[]` and `updatedAt` fields.

**2. Existing Fields Already Support Versioning**

Version tracking uses the existing `versions` array with `updatedAt` as the version date. The top-level `updatedAt` indicates the current published version. `versions.length` gives the version count. The `originalAgentId`/`originalPromptId` field already exists and just needs to be set correctly.

**3. Single Duplicate Per Original**

Logic in the duplication service will check for an existing duplicate via `originalAgentId`/`originalPromptId` before creating a new one. If found, it pushes a new version entry and updates top-level fields instead of creating another duplicate. If new, it creates a duplicate with the original name (no timestamp suffix).

**4. Version Update Logic Follows DatacomChat Pattern**

The version update flow finds the existing duplicate, creates a new version entry with all agent/prompt fields, pushes it to the `versions` array, and updates top-level fields. The `createdAt` is preserved; `updatedAt` and `updatedBy` are refreshed.

**5. Two New API Endpoints Required**

`GET /api/agents/:agentId/version-info` returns version metadata (latestVersion, installedVersion, updateAvailable, versionCount, changelog). `POST /api/agents/:agentId/update` gets the latest duplicate, updates the user's ACL entry with `installedVersionDate`, and returns the updated agent data. Parallel endpoints needed for prompts.

**6. UI Changes Span Client and Admin**

Client app: version display using `updatedAt`, update-available badge, detail modal with version history and "Update to Latest Version" button. Admin portal: submissions view distinguishing "New" vs "Update", approval modal showing `versions.length` and timeline of version dates.

**7. Migration Script for Data Cleanup**

A one-time script will find all existing duplicates with timestamps in names, remove the " (YYYY-MM-DD HH:MM)" suffix, ensure `originalAgentId`/`originalPromptId` is set correctly, and add `installedVersionDate` to ACL entries using current `updatedAt`. No schema changes needed — just data cleanup.

**8. No Auto-Updates — User Control**

Users retain full control over when they upgrade to a newer published version. Manual updates only. Approval sets status to 'approved' and the duplicate's top-level `updatedAt` becomes the published version date.

**9. Before vs After**

Before: multiple duplicates per original (e.g., "My Agent (2025-08-27)", "My Agent (2025-10-15)"). After: single duplicate "My Agent" with `versions` array and `updatedAt` tracking. Before: no update signal. After: "Update Available" badge and one-click upgrade. Before: admin sees many similar submissions. After: admin sees "Update to [Name]" vs "New: [Name]".

---

## 💡 Proposal

Refactor the duplication services to maintain a single published duplicate per original, using the existing `versions` array to accumulate version history and `updatedAt` as the canonical version date. Add `installedVersionDate` to ACL entries for per-user update tracking, surfaced through new API endpoints and a React update banner component.

**1. Schema Updates (Minimal — Use Existing Patterns)**

Use existing fields for version tracking, latest version, and version count. Add `installedVersionDate` (Date) to ACL entries to track which version the user installed. The ACL entry structure becomes: `{ userId, agentId, installedVersionDate?, ... }`. When `installedVersionDate` is absent (legacy entries), treat as "no version info" — optionally show update badge if duplicate's `updatedAt` is newer than a reasonable default (e.g., entry creation date).

**2. Duplication Service Updates**

Modify `duplicateAgentForSharing()` in `api/shared/agent-duplication-service.js` to check if a duplicate already exists using `originalAgentId`. If exists: implement version update logic (similar to DatacomChat). If new: create duplicate with original name (no timestamp). Implement version management directly in the agent library. Apply the same pattern to `duplicatePromptForSharing()` in `api/shared/prompt-duplication-service.js`.

**3. Version Entry Structure**

Each entry in the `versions` array is a snapshot of the agent/prompt at that point in time. It includes: `name`, `description`, `instructions`, `provider`, `model`, `tools`, `agent_ids` (for chained agents), and all other configurable fields. It also stores `createdAt` (preserved from original), `updatedAt` (timestamp of this version), and `updatedBy` (user who published). The top-level document mirrors the latest version entry.

**4. Version Update Logic (Code)**

```javascript
// Find existing duplicate
const existingDuplicate = await agentsCollection.findOne({
  isDuplicate: true,
  originalAgentId: originalAgentId
});

if (existingDuplicate) {
  // Create new version entry (following DatacomChat pattern)
  const newVersionEntry = {
    name: originalAgent.name,
    description: originalAgent.description,
    instructions: originalAgent.instructions,
    provider: originalAgent.provider,
    model: originalAgent.model,
    tools: originalAgent.tools,
    agent_ids: duplicatedChainedAgentIds,
    // ... all other fields
    createdAt: existingDuplicate.createdAt,
    updatedAt: new Date(),
    updatedBy: new ObjectId(userId)
  };

  // Update the duplicate: push to versions array + update top-level fields
  await agentsCollection.updateOne(
    { _id: existingDuplicate._id },
    {
      $push: { versions: newVersionEntry },
      $set: {
        name: originalAgent.name,
        description: originalAgent.description,
        instructions: originalAgent.instructions,
        provider: originalAgent.provider,
        model: originalAgent.model,
        tools: originalAgent.tools,
        agent_ids: duplicatedChainedAgentIds,
        // ... all other fields
        updatedAt: new Date(),
        updatedBy: new ObjectId(userId)
      }
    }
  );
} else {
  // Create new duplicate with original name (no timestamp)
  await createNewDuplicate(originalAgent);
}
```

The prompt duplication service uses the same pattern: replace `agentsCollection` with prompts collection, `originalAgentId` with `originalPromptId`, and mirror the field structure for prompts (e.g., `content`, `variables` instead of `instructions`, `tools`).

**5. Version Info API Response**

```json
{
  "latestVersion": "2025-10-15T21:18:47.501Z",
  "installedVersion": "2025-08-27T00:05:14.407Z",
  "updateAvailable": true,
  "versionCount": 3,
  "changelog": "Latest update on Oct 15, 2024"
}
```

The `changelog` field can be derived from the most recent version entry (e.g., formatted `updatedAt`) or left as a generic message until a richer changelog mechanism is added.

**6. Agent/Prompt Card Component (Client App)**

Show version using `updatedAt` formatted as date. Compare ACL `installedVersionDate` with the agent's `updatedAt`. Display "Update Available" badge when dates differ. Cards should surface version info at a glance without requiring the user to open the detail modal.

**7. Detail Modal Updates**

In `admin-app/src/components/agent-detail-modal.tsx` and `prompt-detail-modal.tsx`: show "Version: Oct 15, 2024" (from `updatedAt`). If installed version is less than latest, show update banner. Add "Update to Latest Version" button. Show version history from the `versions` array — display dates and optionally a brief changelog if available.

**8. UI Component — Version Info Banner**

New component: `version-info-banner.tsx`. Renders when `updateAvailable` is true. Displays latest published date and user's installed date. Provides one-click "Update Now" button that calls the update endpoint and refreshes the agent/prompt data. UX: show loading state during update; on success, refresh the detail view and hide the banner; on error, show toast and keep banner visible.

```jsx
<Alert>
  <UpdateIcon />
  <AlertDescription>
    Update Available: Published {formatDate(latestUpdatedAt)}
    Your version: {formatDate(installedVersionDate)}
    <Button onClick={handleUpdate}>Update Now</Button>
  </AlertDescription>
</Alert>
```

**9. Version Info Endpoint Flow**

`GET /api/agents/:agentId/version-info` resolves the agent, checks ACL for `installedVersionDate`, fetches the duplicate's `updatedAt` and `versions.length`, compares dates, and returns the JSON payload. Same for prompts at `GET /api/prompts/:promptId/version-info`. Implementation in `api/agents/index.js` and `api/prompts/index.js`.

**10. Update Endpoint Flow**

`POST /api/agents/:agentId/update` validates user has access (must have ACL entry for this agent), fetches the latest duplicate (or resolves via `originalAgentId` if user has a reference to the duplicate), updates the user's ACL entry with `installedVersionDate` = duplicate's current `updatedAt`, and returns the updated agent data. Same for prompts at `POST /api/prompts/:promptId/update`. Ensures the user receives the latest published version. Auth: only the user who has access can call update.

**11. Approval Workflow Updates**

When approving in `api/approvals/index.js` (lines ~3200–3400): approval sets status to `approved`. The duplicate's top-level `updatedAt` becomes the published version date. Users compare their `installedVersionDate` against the duplicate's `updatedAt`. No auto-updates — users manually upgrade. The approval handler must correctly propagate `updatedAt` when processing agent/prompt approvals.

**12. Request-Access Flow**

When a user requests access to an agent or prompt, the system must set `installedVersionDate` on the ACL entry to the duplicate's current `updatedAt` at the time of approval. This establishes the baseline for future update detection.

**13. Admin Submissions View Logic**

In `admin-app/src/pages/PromptManagement.tsx`: check if `isDuplicate: true` and `originalAgentId`/`originalPromptId` exists. If yes: show "Update to [Agent Name]" instead of "New". Show previous version date from the `versions` array. If no: show "New: [Agent Name]". The approval modal displays `versions.length` as version number and shows a timeline of version dates from the `versions` array.

**14. Prompt Duplication Service**

Apply the same pattern to `api/shared/prompt-duplication-service.js`: find existing duplicate by `originalPromptId` and `isDuplicate: true`. Implement version push + field update logic. Keep original name, no timestamp suffix. Mirror the agent duplication structure for consistency.

**15. Migration Script Details**

New script: `api/scripts/migrate-to-version-system.js`. Find all existing duplicates with timestamps in names (regex for " (YYYY-MM-DD HH:MM)"). Remove suffix from names. Ensure `originalAgentId`/`originalPromptId` is set correctly on all duplicates. Add `installedVersionDate` to ACL entries — use the duplicate's current `updatedAt` as the initial value. Run in dry-run mode first. No schema changes — data cleanup only.

**Migration Script Pseudocode:**

```javascript
// 1. Find duplicates with timestamp in name
const duplicates = await agentsCollection.find({
  isDuplicate: true,
  name: { $regex: / \(\d{4}-\d{2}-\d{2} \d{2}:\d{2}\)$/ }
});

// 2. For each: strip suffix, ensure originalAgentId set
for (const doc of duplicates) {
  const newName = doc.name.replace(/ \(\d{4}-\d{2}-\d{2} \d{2}:\d{2}\)$/, '');
  await agentsCollection.updateOne(
    { _id: doc._id },
    { $set: { name: newName } }
  );
}

// 3. For each ACL entry referencing a duplicate: add installedVersionDate
// Use duplicate's updatedAt as initial value
```

**16. Key Files to Modify**

Backend: `api/shared/agent-duplication-service.js` (lines 198–666), `api/shared/prompt-duplication-service.js` (lines 117–577), `api/approvals/index.js` (lines 3142–3939), `api/agents/index.js`, `api/prompts/index.js`. Frontend: `admin-app/src/components/agent-detail-modal.tsx`, `admin-app/src/components/prompt-detail-modal.tsx`, `admin-app/src/pages/PromptManagement.tsx`, `shared/src/types/agents.ts`. Database: new migration script `api/scripts/migrate-to-version-system.js`.

**17. Benefits**

Follows existing patterns — uses DatacomChat's version system pattern. Clean naming — no timestamp suffixes. Single source — one published duplicate per agent/prompt. Date-based versions — use existing `updatedAt` fields. Manual updates — users control when they upgrade. Minimal schema changes — just add `installedVersionDate` to ACL. Independent implementation — version logic in agent library, no DatacomChat dependencies.

**18. Chained Agent Handling**

When duplicating an agent with `agent_ids` (chained agents), the version entry must include `duplicatedChainedAgentIds` — the IDs of the duplicated chained agents. Each version push must re-duplicate chained agents if they have changed, or reference the correct versions. This adds complexity to the duplication path and must be tested thoroughly.

**19. TypeScript Type Updates**

In `shared/src/types/agents.ts`, add `installedVersionDate?: Date` to the ACL entry type. Ensure the version info response type includes `latestVersion`, `installedVersion`, `updateAvailable`, `versionCount`, and `changelog`. Update prompt types similarly for consistency.

**20. Implementation Todos — Phase 1**

Modify `duplicateAgentForSharing()` to find existing duplicates by `originalAgentId`. Implement version management logic (push to versions array + update top-level fields). Remove timestamp suffix from duplicate name generation. Ensure `originalAgentId` is always set on duplicates. Apply the same to `duplicatePromptForSharing()` with `originalPromptId`.

**21. Implementation Todos — Phase 2**

Create `GET /version-info` endpoint comparing `installedVersionDate` with duplicate's `updatedAt`. Create `POST /update` endpoint to update user's ACL with new `installedVersionDate`. Modify approval workflow to handle updates correctly. Update request-access flow to set `installedVersionDate` when access is granted.

**22. Implementation Todos — Phase 3**

Add version display using `updatedAt` formatting on cards and detail modals. Create `version-info-banner.tsx` component. Update detail modals with version info, update button, and version history. Show "Update" vs "New" in admin submissions list. Display version timeline in approval modal.

**23. Implementation Todos — Phase 4**

Test full flow: submit → update existing → approve → user sees update available → user clicks update → ACL updated. Run migration script in dry-run, then production. Verify single duplicate per original agent. Test manual update functionality. Validate chained agent versioning.

---

## ⚠️ Risks

**Migration complexity** — Existing duplicates have timestamp-suffixed names; a one-time migration script must safely rename them and back-fill ACL data without data loss.

**Approval workflow coupling** — Approval logic in `api/approvals/index.js` (lines 3142–3939) must correctly set `updatedAt` as the published version date; incorrect handling could break version comparison.

**User confusion during transition** — Until migration runs, some users may see both old-style and new-style duplicates in their library.

**Chained agent versioning** — Duplicated chained agents (`agent_ids`) must also be updated correctly when a version is pushed, adding complexity to the duplication path.

**Dry-run requirement** — The migration script must support a dry-run mode to preview changes before applying them to production data. Without this, rollback becomes difficult if something goes wrong.

**Backward compatibility** — Legacy ACL entries without `installedVersionDate` should be handled gracefully. Options: treat as "unknown" (no badge), or infer from entry creation date. The version-info endpoint must not throw when the field is missing.

---

## ✅ Next Steps

1. **Phase 1: Core Duplication Logic** — Modify duplication services to find existing duplicates by `originalAgentId`/`originalPromptId`. Implement version management logic (push to versions array + update top-level fields). Remove timestamp suffix from duplicate name generation. Ensure `originalAgentId`/`originalPromptId` is always set on duplicates.

2. **Phase 2: API Endpoints** — Create `GET /version-info` endpoint comparing dates. Create `POST /update` endpoint to update user's installed version. Modify approval workflow to handle updates correctly. Update request-access to set `installedVersionDate`.

3. **Phase 3: UI Components** — Add version display using `updatedAt` formatting. Create `version-info-banner.tsx` component. Update detail modals with version info and update button. Show "Update" vs "New" in admin submissions list.

4. **Phase 4: Testing & Migration** — Test submission → update → approval → user upgrade flow. Run migration script to clean up names. Verify single duplicate per original agent. Test manual update functionality.

5. **Error handling** — Version-info endpoint: return 404 if agent not found; return sensible defaults if ACL has no `installedVersionDate`. Update endpoint: return 403 if user lacks access; return 404 if duplicate not found; ensure idempotency (calling update when already on latest is safe).

6. **Documentation** — Update API docs for new endpoints. Add JSDoc to duplication service functions. Document migration script usage (dry-run flag, rollback procedure). Update Confluence with implementation status.

7. **Confluence sync** — Keep the source Confluence page in sync as implementation progresses. Tag completed phases. Add "Implementation Status" section with Phase 1–4 checkboxes.

---

## 🔑 Close

> This design achieves clean, user-friendly versioning by leveraging existing data patterns with a single schema addition, giving users a clear update signal and one-click upgrade path without breaking the existing approval workflow.

The proposal follows DatacomChat's version system pattern, eliminates timestamp suffixes, maintains a single source per agent/prompt, uses date-based versions from existing fields, keeps updates manual, and requires minimal schema changes. Implementation is independent of DatacomChat — version logic lives entirely in the agent library.

**Summary flow:** Author submits → duplication service finds or creates single duplicate → approval sets `updatedAt` → user's ACL stores `installedVersionDate` → version-info endpoint compares dates → user sees update badge → user clicks update → ACL refreshed with latest `updatedAt`.

**Outcome:** One published duplicate per agent/prompt. Clean names. Clear update signal. User-controlled upgrades. Minimal schema change. Reusable pattern for future library features.

*Generated from Confluence source: agent-library-versioning-system-agents-and-prompts.md*

---

📌 **Document Type:** Architecture Doc / Technical Design
📅 **Last Updated:** 16 October 2025
🔗 **Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40255914017
📂 **Confluence Space:** Insights & Analytics (IA)
