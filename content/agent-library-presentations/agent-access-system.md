# Agent Access System

> A UX design and ACL implementation reference defining the correct patterns for distinguishing between owned, specifically shared, and globally accessible agents in the Datacom Agent Library.

**Author:** [Dipesh Trikam](https://datacomgroup.atlassian.net/wiki/people/712020:06f04ec7-5f4c-4e03-a2a3-3e46b413e073)
**Date:** 28 August 2025
**Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40070512927

---

## 🎯 Context

Authored by Dipesh Trikam for the Agent Library implementation team, this document complements the Shared Agent Access System Technical Specification by specifying the exact user experience tab structures and ACL entry schemas for each agent access type. It serves as the authoritative reference for how permissions are recorded, displayed, and attributed throughout the system.

---

## 🔍 Problem

Without a clear access model, users cannot tell whether they own an agent, received it via direct sharing, or accessed it as a globally available resource. This ambiguity also makes it difficult to enforce accountability and produce meaningful audit trails. The system needs a consistent ACL schema and UX taxonomy to express these distinctions clearly.

---

## 📋 Observations

- **Five distinct agent access types** are defined: Owned (personal), Admin-Owned Shared Duplicate (for distribution), Specifically Shared (from admin duplicates), Global Automatic (All Datacom), and Global Requested (explicitly tracked access).
- **Recommended UX: three-tab structure** — "My Agents" (owned + global access), "Shared with Me" (specifically shared + requested global), and "Directory" (browse all global agents).
- **ACL `permBits`** use a simple binary: 15 = owner (full permissions), 1 = shared/read-execute; access type is conveyed through `shareType` and `accessMethod` fields rather than permission bits alone.
- **`shareType` enum values**: `owner`, `admin_managed_duplicate`, `specific_individual`, `global_automatic`, `global_request` — each maps to a distinct badge and tab placement in the UI.
- **Global agents remain automatically accessible** — no request barrier is imposed; users accessing a global agent for the first time receive an auto-created ACL entry with `shareType: 'global_automatic'`.
- **Admin-owned duplicates are invisible to the original creator** — users always see their original agent; the admin-managed copy used for distribution is a system artefact not surfaced in the owner's UI.
- **ACL entries track `originalOwnerId`, `sharedDuplicateId`, and `sourceAgentId`** — enabling full provenance from shared access back to the original creator and the Cosmos DB public agent record.

---

## 💡 Proposal

Implement a three-tab client UI (My Agents / Shared with Me / Directory) backed by a unified, richly annotated ACL schema. Each access event — creation, duplication, direct share, global auto-access, and requested access — generates a corresponding ACL entry with consistent field structure. This approach provides clear user-facing attribution ("Shared by [name]", "Global Access" badges) while supporting compliance audit requirements without exposing internal system artefacts.

---

## ⚠️ Risks

- **ACL entry proliferation** — automatic global access ACL creation on first touch means high-traffic global agents could generate very large ACL collections, requiring index and query optimisation.
- **Admin duplicate invisibility** — the design decision to hide admin-owned duplicates from original creators relies on correct `isAdminDuplicate` flag handling; bugs here could surface unexpected entries in the creator's agent list.
- **Migration of existing shared agents** — pre-existing cloned agents lack the new `shareType` and `accessMethod` fields; migration must backfill these without data loss.
- **Two-tab vs. three-tab UX decision** — Option B (two-tab) is documented as an alternative; a final UX decision should be confirmed before implementation to avoid rework.

---

## ✅ Next Steps

- Confirm the three-tab UX structure with stakeholders and lock the design before beginning frontend implementation.
- Implement the enhanced ACL schema in MongoDB, including all new `shareType`, `accessMethod`, and provenance tracking fields.
- Build ACL creation triggers for all five access scenarios (creation, duplication, specific share, global auto, global request).
- Add database indexes to support efficient queries on `isSharedAccess`, `shareType`, and `principalId` for the "Shared with Me" and "My Agents" views.
- Develop and execute a migration script to backfill `shareType` and `accessMethod` on all existing ACL entries.

---

## 🔑 Close

A well-defined ACL schema with five distinct access types — anchored to a clear three-tab UX — is the foundation for making the Agent Library's sharing system both user-friendly and audit-ready.

---

📌 **Document Type:** Technical Specification / UX Design Reference
📅 **Last Updated:** 28 August 2025
🔗 **Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40070512927
