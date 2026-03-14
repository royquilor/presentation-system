# MongoDB Schema Changes — Production Approval Request

> A formal change-request document seeking approval to add optional fields to the shared DatacomChat MongoDB database to support the Datacom Agent Library's rating, duplication, approval, and sharing features.

**Author:** Dipesh Trikam
**Date:** 17 November 2025
**Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40411627578

---

## 🎯 Context

The Datacom Agent Library shares the existing **DatacomChat** MongoDB database (hosted on Azure Cosmos DB for MongoDB API) with the Conver chat application. The Agent Library team requires approval from the database/platform owner to introduce new optional fields and two new permission collections to support new product features. This document was submitted on 17 November 2025 and is pending production deployment approval. The purpose of these additions is around performance and fewer database requests.

---

## 🔍 Problem

The Agent Library has developed new features — agent ratings, duplication/install tracking, admin approval workflows, and fine-grained sharing controls — that require additional metadata fields on existing `agents`, `prompts`, `users`, and `files` collections. Because the database is shared with Conver, any schema changes require formal cross-team approval to ensure backward compatibility and zero regressions for the primary application.

---

## 📋 Observations

**1. Additive-only changes**

All proposed changes are additive only: no existing fields are deleted or renamed, no data migration is required, and all new fields are optional with defensive null-coalescing patterns throughout the codebase. There are 60+ optional chaining instances and zero breaking changes. Old documents work without modification.

**2. No new collections for core data**

No new collections are added for agents or prompts — the team uses existing `agents` and `prompts` collections. Only optional fields are added to existing documents. This approach is 100% backward compatible with existing data and requires no data migration.

**3. Zero breaking changes to Conver**

The changes introduce zero breaking changes to Conver functionality. Agent Library collections are isolated, shared collections only receive additive fields, and Conver ignores unknown fields (standard MongoDB behaviour). Conver integration was explicitly tested with no regressions observed.

**4. Four field groups on agents collection**

Four field groups are being added to the `agents` collection: rating system (`average`, `count`, `userRatings`), duplication tracking (`isDuplicate`, `originalAgentId`, etc.), approval workflow (`status`, `submittedBy`, `approvedAt`, etc.), and sharing controls (`sharing`, `specificIndividuals`, etc.).

**5. Two new isolated permission collections**

Two new isolated collections are requested: `aclentries` (785 documents, fine-grained ACL) and `permissions` (165 documents, user permission mappings). Neither has any impact on Conver. These are required for the ACL/sharing functionality.

**6. Field prevalence confirms recency**

Field prevalence analysis confirms recency of addition: rating fields appear in only 32% of agents, sharing in 11–23%, and status in 35%, consistent with being added after initial deployment. Fields present in less than 50% of documents were added after initial deployment, proving they are optional.

**7. Performance impact negligible**

Single agent fetch averages 12ms, agent list (50 items) averages 45ms, rating calculation averages 8ms, and ACL permission check averages 3ms. Storage growth is estimated at less than 5% (1,723 vs. 42,897 documents). Impact is negligible.

**8. Cost increase minimal**

Current cost is approximately $50/month (400 RU/s, 2.5 GB storage). After Agent Library deployment, cost is approximately $50–55/month (same RU/s, 2.55 GB storage). Cost increase is $0–5/month (0–10%).

**9. Testing status**

Completed: Agent CRUD with rating system, duplication workflow (404 agents, 39% are duplicates), approval workflow (submit/approve/reject), sharing system (public/private/individual), ACL permission checks (785 entries), Conver integration (no regressions), backward compatibility (old agents without new fields work). Remaining: load testing (100+ concurrent users), backup/restore validation, rollback procedure dry-run.

**10. Rollback plan exists**

Level 1: Disable Agent Library (5 minutes) — prevent people from logging into agent library; Conver continues working; no data loss. Level 2: Full rollback (30 minutes) — restore database from backup (last 24 hours), drop Agent Library collections (aclentries, permissions), redeploy previous version. Backup: automated daily via Azure Cosmos DB (30-day retention).

---

## 💡 Proposal

The team recommends **approving** all requested field additions and new collections, followed by an off-hours deployment. Deployment steps: take final backup, deploy Agent Library backend (Azure Functions), deploy Admin UI and Client UI (Static Web Apps), verify collections exist, run smoke tests, monitor for 24 hours. Go/No-Go: deploy if all tests passed, backup verified, and off-hours window; do not deploy if test failures, backup issues, or high-traffic period.

---

## ⚠️ Risks

**Conver impact** — Agent Library fields are isolated and Conver ignores them; risk is none.

**Data integrity** — Additive changes only with no deletions; risk is low.

**Performance** — Document increase is 4% (1,723 vs 42,897); risk is low.

**Backward compatibility** — Optional fields mean old documents work without modification; risk is none.

**Rollback complexity** — Disable Agent Library and Conver is unaffected; risk is low.

**Load testing gap** — Load testing for 100+ concurrent users has not yet been completed; this is a listed pre-production gap.

**Backup and rollback validation** — Backup/restore validation and a rollback procedure dry-run are pending; the rollback plan is untested.

**Shared users collection** — The shared `users` collection receives new fields (`firstName`, `lastName`, `preferences`, `isActive`); while low risk, any future Conver query that reads all user fields could surface unexpected data.

**Orphaned fields on decommission** — If the Agent Library is ever deprecated, the orphaned optional fields in shared collections (`agents`, `prompts`, `users`, `files`) would need a cleanup migration.

---

## ✅ Next Steps

1. **Complete outstanding tests** — Load testing (100+ concurrent users), backup/restore validation, and rollback dry-run.

2. **Obtain formal approval** — From the Conver team or database owner before scheduling deployment.

3. **Schedule deployment window** — Off-hours deployment and notify the Conver team for awareness.

4. **Execute deployment** — Follow the 5-step plan and monitor for 7 days before formal sign-off.

5. **Document cleanup procedure** — Field cleanup procedure to be followed if the Agent Library is ever decommissioned.

---

## 🔑 Close

> This is a low-risk, additive-only database change — the zero breaking-changes design and tested Conver compatibility make approval straightforward.

Completing the outstanding load test and rollback dry-run before deployment is essential due diligence. The recommendation is to approve field additions to the shared MongoDB database.

---

## 📊 Flex: Executive Summary

**1. Key points**

- No new collections added for agents/prompts (using existing collections)
- Only adding optional fields to existing documents
- Zero breaking changes to Conver functionality
- 100% backward compatible with existing data
- No data migration required

**2. Database context**

Database name: `DatacomChat`. Hosting: Azure Cosmos DB for MongoDB API. Shared by: Conver (chat/conversation system, primary application) and Agent Library (agent/prompt management, secondary application).

---

## 📦 Flex: Agents Collection — Rating System

**1. Purpose**

Allow users to rate agents (1–5 stars). Displayed in agent cards, used for sorting "top rated" agents.

**2. Schema**

```javascript
{
  rating: {
    average: number,      // Average rating (0-5)
    count: number,        // Total number of ratings
    userRatings: {        // Individual ratings by user
      "user@example.com": 5
    }
  }
}
```

---

## 📦 Flex: Agents Collection — Duplication Tracking

**1. Purpose**

Track when users copy or install shared agents. Enables users to install/copy agents from library and tracks provenance.

**2. Schema**

```javascript
{
  isDuplicate: boolean,           // Is this a duplicated copy?
  originalAgentId: string,        // Source agent ID
  originalOwner: string,          // Original creator's name
  originalOwnerId: ObjectId,      // Original creator's user ID
  duplicatedAt: Date,             // When the copy was made
  shareType: string,              // "individual" | "global"
  accessMethod: string            // How user gained access
}
```

---

## 📦 Flex: Agents Collection — Approval Workflow

**1. Purpose**

Admin approval process for public agent submissions. Powers Admin UI for reviewing and approving agent submissions.

**2. Schema**

```javascript
{
  status: string,                 // "pending" | "approved" | "rejected"
  submittedBy: string,            // Requester email
  submittedAt: Date,              // Submission timestamp
  approvedAt: Date,               // Approval timestamp
  approvedBy: string,             // Approver email
  adminApproved: boolean,         // Admin approval flag
  rejectedAt: Date,               // Rejection timestamp
  rejectedBy: string,             // Rejector email
  rejectionReason: string         // Why rejected
}
```

---

## 📦 Flex: Agents Collection — Sharing Enhancements

**1. Purpose**

Fine-grained sharing controls. Controls who can view or access agents and enables private sharing.

**2. Schema**

```javascript
{
  sharing: string,                // "public" | "private" | "restricted"
  specificIndividuals: [string],  // Array of user emails with access
  shared: boolean,                // Is currently shared?
  sharedAt: Date,                 // When sharing was enabled
  sharedBy: string,               // Who enabled sharing
  hasSharedDuplicate: boolean     // Has copies in circulation
}
```

---

## 📦 Flex: Agents Collection — Supporting Fields

**1. Purpose**

Enhanced metadata and configuration. Various prevalence across documents.

**2. Schema**

```javascript
{
  category: string,               // 45% - Agent category
  authorEmail: string,            // 40% - Contact info
  isCollaborative: boolean,       // 46% - Multi-user agent flag
  model_parameters: {},           // 41% - Model overrides
  support_contact: {},            // 38% - Support details
  is_promoted: boolean,           // 35% - Featured/promoted flag
  adminOwnerName: string          // 35% - Admin owner display name
}
```

---

## 📦 Flex: Prompts Collection — Field Additions

**1. Overview**

Similar fields added with lower prevalence than agents collection.

**2. Schema**

```javascript
{
  // Rating (11% of prompts)
  rating: { average, count, userRatings },

  // Duplication (15-16% of prompts)
  isDuplicate: boolean,
  originalPromptId: string,
  originalOwner: string,
  duplicatedAt: Date,

  // Approval (19% of prompts)
  status: string,
  submittedBy: string,
  submittedAt: Date,

  // Sharing (29-35% of prompts)
  sharing: string,
  specificIndividuals: [string],

  // Metadata
  category: string,
  authorName: string,
  authorContact: string
}
```

---

## 📦 Flex: Users Collection — Shared with Conver

**1. Agent Library additions**

Optional fields added to shared `users` collection. Risk: LOW — optional fields, does not affect Conver.

**2. Schema**

```javascript
{
  preferences: {
    theme: string,
    language: string,
    notifications: boolean
  },
  firstName: string,
  lastName: string,
  isActive: boolean
}
```

---

## 📦 Flex: Files Collection — Shared with Conver

**1. Agent Library additions**

Used only for agent file attachment duplication. Risk: LOW.

**2. Schema**

```javascript
{
  isDuplicate: boolean,       // File was duplicated with agent
  duplicatedAt: Date,         // When duplicated
  originalFileId: string      // Source file ID
}
```

---

## 📦 Flex: New Collections — aclentries

**1. Purpose**

Fine-grained access control (who can access which agents/prompts). Required for ACL/sharing functionality. Impact: none on Conver.

**2. Details**

- Document count: 785 documents
- Fields: `principalType`, `principalId`, `resourceType`, `resourceId`, `permBits`, `grantedBy`

---

## 📦 Flex: New Collections — permissions

**1. Purpose**

User permission mappings. Required for ACL/sharing functionality. Impact: none on Conver.

**2. Details**

- Document count: 165 documents
- Fields: `principalType`, `principalId`, `resourceType`, `resourceId`, `accessRoleId`

---

## 📦 Flex: Backward Compatibility — Code Pattern

**1. Defensive coding**

The codebase uses defensive patterns that work with both old and new documents. No migrations required.

**2. Example**

```javascript
// Defensive coding - works with old AND new documents:
const rating = agent.rating?.average || 0; // Safe if rating doesn't exist
const status = agent.status || "pending"; // Default if not present
const isDupe = agent.isDuplicate || false; // Assume not duplicate
```

**3. Statistics**

- Optional chaining instances: 60+
- Breaking changes: 0 (zero)
- Migrations required: 0 (zero)

---

## 📦 Flex: Field Prevalence — Low Prevalence Evidence

**1. Rating**

32% of agents — new feature, not all agents have been rated.

**2. Duplication**

39–40% of agents — not all agents are duplicates; only copied ones have these fields.

**3. Status**

35% of agents — only submitted agents have approval status.

**4. Sharing**

11–23% of agents — not all agents are shared; only shared ones have sharing metadata.

---

## 📦 Flex: Why Changes Are Safe

**1. Additive only**

- No fields deleted
- No fields renamed
- Only optional fields added
- Old documents work without migration

**2. No Conver impact**

- Agent Library collections are isolated
- Shared collections only have additive fields
- Conver ignores unknown fields (standard MongoDB behaviour)
- Tested: Conver functionality unchanged

---

## 📦 Flex: Performance Impact

**1. Query performance**

- Single agent fetch: 12ms average
- Agent list (50 items): 45ms average
- Rating calculation: 8ms average
- ACL permission check: 3ms average

**2. Overall impact**

Negligible (less than 5% increase in queries/storage).

---

## 📦 Flex: Deployment Plan

**1. Timeline**

Off-hours deployment (minimal traffic).

**2. Steps**

1. Take final backup
2. Deploy Agent Library backend (Azure Functions)
3. Deploy Admin UI and Client UI (Static Web Apps)
4. Verify collections exist
5. Run smoke tests
6. Monitor for 24 hours

**3. Go/No-Go**

- Deploy if: All tests passed, backup verified, off-hours window
- Do not deploy if: Test failures, backup issues, high-traffic period

---

## 📦 Flex: Approval Request — What We Are Asking

**1. Add optional fields to existing collections**

- Rating system fields (`average`, `count`, `userRatings`)
- Duplication tracking fields (`isDuplicate`, `originalAgentId`, etc.)
- Approval workflow fields (`status`, `submittedBy`, `approvedAt`, etc.)
- Sharing enhancement fields (`sharing`, `specificIndividuals`, etc.)
- Supporting fields (`category`, `authorEmail`, `model_parameters`, etc.)

**2. Add permission collections (isolated from Conver)**

- `aclentries` collection
- `permissions` collection

---

## 📦 Flex: Approval Request — What We Are NOT Doing

**1. Exclusions**

- NOT modifying Conver's collections or fields
- NOT deleting or renaming any existing fields
- NOT requiring data migration
- NOT creating separate database (staying in shared DatacomChat)

---

## 📦 Flex: Recommendation Rationale

**1. Five reasons to approve**

- Low risk (optional fields only, 100% backward compatible)
- Cost effective ($0–5/month increase)
- No Conver impact (tested and verified)
- Ready for production (extensively tested)
- Easy rollback (5–30 minutes if needed)

**2. Next steps after approval**

1. Schedule off-hours deployment window
2. Notify Conver team (awareness only)
3. Execute deployment
4. Monitor for 7 days
5. Sign-off after validation

---

## 📦 Flex: Before/After Document Comparison

**1. Agent document before changes**

Existing agent documents contain core fields only: `_id`, `name`, `description`, `ownerId`, `createdAt`, `updatedAt`, and any Conver-specific fields. No rating, duplication, approval, or sharing metadata.

**2. Agent document after changes**

Same document may now include optional `rating`, `isDuplicate`, `originalAgentId`, `status`, `submittedBy`, `sharing`, `specificIndividuals`, `category`, `authorEmail`, and other new fields. Old documents without these fields continue to work; code uses `agent.rating?.average || 0` and similar patterns.

**3. Migration scripts**

No migration scripts are required. Fields are added on write when new features are used. Existing documents are never modified in bulk. This is a key safety characteristic of the proposal.

---

📌 **Document Type:** Change Request / Schema Change Proposal
📅 **Last Updated:** 17 November 2025
🔗 **Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40411627578
