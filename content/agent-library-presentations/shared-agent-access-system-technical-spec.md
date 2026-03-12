# Shared Agent Access System — Technical Specification

> A detailed technical blueprint for redesigning the Agent Library's sharing model to introduce proper distinctions between owned, specifically shared, and globally accessible agents — with request-based access control and a unified admin workflow.

**Author:** [Dipesh Trikam](https://datacomgroup.atlassian.net/wiki/people/712020:06f04ec7-5f4c-4e03-a2a3-3e46b413e073)
**Date:** 26 August 2025
**Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40063139947

---

## 🎯 Context

This specification was authored by Dipesh Trikam for the Agent Library platform within Datacom's Insights & Analytics team. It addresses architectural shortcomings in the existing sharing system where personal and shared agents were indistinguishable in the UI. The solution spans database schema changes, API modifications, and new user interface components.

---

## 🔍 Problem

The current system clones shared agents directly into a user's personal agent list, making owned and shared agents visually identical. Global ("All Datacom") agents are automatically accessible within the Agent Library but not in DatacomChat, and there is no clear distinction between access types. This creates confusion, audit gaps, and inconsistent access patterns between specific-person and organisation-wide sharing.

---

## 📋 Observations

- **Dual database architecture** is maintained: MongoDB holds personal agents, user data, and ACL entries; Cosmos DB remains the source of truth for publicly shared agents — new fields are added to MongoDB without touching Cosmos DB.
- **Five agent access states** are defined: private (created), shared to specific individuals, approved for global discovery, rejected, and access-requested (for global agents).
- **New MongoDB fields** on the `agents` collection include `isSharedAccess`, `shareType`, `sharedBy`, `accessGrantedAt`, and `accessGrantedBy` to cleanly separate owned agents from access-granted copies.
- **`agent_requests` collection is enhanced** with `requestType`, `requestReason`, `businessJustification`, `reviewedBy`, and `adminNotes` — unifying both sharing approvals and global access requests into a single admin workflow.
- **New API endpoint `POST /api/agent-requests/global-access`** allows users to explicitly request tracked access to global agents; the enhanced `PUT /api/agent-requests/:id` handles clone creation, ACL entry, and email notification on approval.
- **Performance targets** include sub-1-second shared-with-me queries, directory filtering across 10,000+ agents, and 100+ concurrent admin approval requests.
- **Success criteria are defined with checklists** covering functional requirements, performance benchmarks, security validation, and UX standards — all currently unchecked (pre-implementation).

---

## 💡 Proposal

Extend the existing system with new database fields, enhanced API endpoints, and a new "Shared with Me" UI section rather than rebuilding from scratch. Global agents will continue automatic accessibility, but users can also make explicit access requests for audit tracking. All sharing and access events flow through a unified admin dashboard, preserving the existing approval workflow while adding global access request management alongside it.

---

## ⚠️ Risks

- **Data migration complexity** — existing cloned agents in users' "My Agents" must be migrated to the new `isSharedAccess` pattern without breaking existing access or workflows.
- **Race conditions** — concurrent approval and access requests against the same agent could create duplicate ACL entries or inconsistent database state; explicit prevention strategies are needed.
- **Cosmos DB ↔ MongoDB consistency** — the dual-database pattern introduces potential for reference drift if a Cosmos DB agent is deleted while MongoDB agent_requests still reference it.
- **All success criteria are currently unchecked** — the specification is a planning document; actual implementation status is unknown.
- **Performance at scale untested** — the 10,000+ agent directory filter target is aspirational; real-world indexing strategy for MongoDB queries needs validation.

---

## ✅ Next Steps

- Implement new MongoDB indexes (`isSharedAccess`, `shareType`, `publicAgentId`, `originalAgentId`) before beginning data migration.
- Build and test the new `POST /api/agent-requests/global-access` endpoint and enhanced approval flow.
- Develop the "Shared with Me" UI section and admin access request management dashboard.
- Design and execute a migration strategy for existing cloned agents to adopt the `isSharedAccess` flag.
- Validate all functional, performance, security, and UX success criteria through testing before deployment.

---

## 🔑 Close

This specification provides a comprehensive, extend-not-replace blueprint for resolving the Agent Library's agent access confusion — delivering a clean UX distinction between owned, shared, and global agents while maintaining full audit traceability and backward compatibility.

---

📌 **Document Type:** Technical Specification
📅 **Last Updated:** 26 August 2025
🔗 **Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40063139947
