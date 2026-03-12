# MongoDB Schema Changes — Production Approval Request

> A formal change-request document seeking approval to add optional fields to the shared DatacomChat MongoDB database to support the Datacom Agent Library's rating, duplication, approval, and sharing features.

**Author:** [Dipesh Trikam](https://datacomgroup.atlassian.net/wiki/people/712020:06f04ec7-5f4c-4e03-a2a3-3e46b413e073)
**Date:** 17 November 2025
**Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40411627578

---

## 🎯 Context

The Datacom Agent Library shares the existing **DatacomChat** MongoDB database (hosted on Azure Cosmos DB for MongoDB API) with the Conver chat application. The Agent Library team, led by Dipesh Trikam, requires approval from the database/platform owner to introduce new optional fields and two new permission collections to support new product features. This document was submitted on 17 November 2025 and is pending production deployment approval.

---

## 🔍 Problem

The Agent Library has developed new features — agent ratings, duplication/install tracking, admin approval workflows, and fine-grained sharing controls — that require additional metadata fields on existing `agents`, `prompts`, `users`, and `files` collections. Because the database is shared with Conver, any schema changes require formal cross-team approval to ensure backward compatibility and zero regressions for the primary application.

---

## 📋 Observations

- All proposed changes are **additive only**: no existing fields are deleted or renamed, no data migration is required, and all new fields are optional with defensive null-coalescing patterns throughout the codebase (60+ optional chaining instances, zero breaking changes).
- Four field groups are being added to the `agents` collection: rating system (`average`, `count`, `userRatings`), duplication tracking (`isDuplicate`, `originalAgentId`, etc.), approval workflow (`status`, `submittedBy`, `approvedAt`, etc.), and sharing controls (`sharing`, `specificIndividuals`, etc.).
- Two new isolated collections are requested: `aclentries` (785 documents, fine-grained ACL) and `permissions` (165 documents, user permission mappings) — neither has any impact on Conver.
- Field prevalence analysis confirms recency of addition: rating fields appear in only 32% of agents, sharing in 11–23%, and status in 35%, consistent with being added after initial deployment.
- Performance impact is negligible: single agent fetch averages 12ms, ACL permission checks average 3ms, and storage growth is estimated at <1% (1,723 vs. 42,897 documents).
- Estimated cost increase is $0–5/month (CosmosDB stays at 400 RU/s; storage grows from ~2.5 GB to ~2.55 GB).
- Conver integration was explicitly tested with no regressions observed; MongoDB natively ignores unknown fields in existing document reads.

---

## 💡 Proposal

The team recommends **approving** all requested field additions and new collections, followed by an off-hours deployment (backup → deploy Azure Functions → deploy Static Web Apps → smoke test → 24-hour monitoring). If any issues arise, a two-level rollback plan exists: Level 1 (disable Agent Library login, 5 minutes, Conver unaffected) and Level 2 (full database restore from automated daily backup, 30 minutes).

---

## ⚠️ Risks

- Load testing for 100+ concurrent users has not yet been completed — this is a listed pre-production gap.
- Backup/restore validation and a rollback procedure dry-run are also pending, meaning the rollback plan is untested.
- The shared `users` collection receives new fields (`firstName`, `lastName`, `preferences`, `isActive`) — while low risk, any future Conver query that reads all user fields could surface unexpected data.
- If the Agent Library is ever deprecated, the orphaned optional fields in shared collections (`agents`, `prompts`, `users`, `files`) would need a cleanup migration.

---

## ✅ Next Steps

- Complete the three outstanding test items: load testing (100+ concurrent users), backup/restore validation, and rollback dry-run.
- Obtain formal approval from the Conver team / database owner before scheduling deployment.
- Schedule the off-hours deployment window and notify the Conver team for awareness.
- Execute the 5-step deployment plan and monitor for 7 days before formal sign-off.
- Document a field cleanup procedure to be followed if the Agent Library is ever decommissioned.

---

## 🔑 Close

This is a low-risk, additive-only database change — the zero breaking-changes design and tested Conver compatibility make approval straightforward, but completing the outstanding load test and rollback dry-run before deployment is essential due diligence.

---

📌 **Document Type:** Change Request / Schema Change Proposal
📅 **Last Updated:** 17 November 2025
🔗 **Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40411627578
