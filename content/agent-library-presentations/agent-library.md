# Agent Library

> A reference page documenting the end-to-end lifecycle of AI agents in the Datacom Agent Library, from creation in Datacom Chat through sharing, review, and cloning.

**Author:** [Dipesh Trikam](https://datacomgroup.atlassian.net/wiki/people/712020:06f04ec7-5f4c-4e03-a2a3-3e46b413e073)
**Date:** 17 September 2025
**Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40043905712

---

## 🎯 Context

The Agent Library is an internal Datacom platform within the Insights & Analytics space, enabling teams to create, share, and reuse AI agents organisation-wide. Agents are authored in **Datacom Chat** (the source of truth via MongoDB) and governed through a structured approval workflow before appearing in the public directory. The page was last maintained by Dipesh Trikam and captures the core data model and flow as of mid-2025.

---

## 🔍 Problem

Without a governed sharing mechanism, AI agents created by individuals remain siloed and cannot be safely discovered or reused by other teams. There was a need to define a clear lifecycle — from private creation to approved, shareable artefact — with a data model that supports both personal and collaborative use.

---

## 📋 Observations

- Agents are created and stored in MongoDB via Datacom Chat; MongoDB is the single source of truth for agent data
- Sharing triggers a **Blob clone** of the agent as a review artefact with `status: "pending"`, keeping approval state separate from the live Mongo record
- Reviewers approve (→ `directory/approved/{agentId}.json`) or reject (→ `directory/rejected/{shareId}.json`) from the Pending page
- The **Request** action clones the agent in MongoDB with a new `_id` and adds the requester as an author — it does not bypass the approval flow for public listing
- The `Agent` schema includes rich metadata: category, type, provider, model, tools, tags, capabilities, versioning, and a `sharing` intent field (`"Private"` | `"Public"`)
- The `SharedAgent` schema extends `Agent` with `shareId`, `originalAgentId`, `status`, `statusHistory`, and `clonedBy`, enabling full audit history
- Both UAT apps (admin and client) are live on Azure Static Web Apps

---

## 💡 Proposal

The platform implements a **two-store architecture**: MongoDB holds all live agent data and personal copies, while Azure Blob Storage holds approval artefacts. This cleanly separates operational data from governance state, allowing the directory to show only approved content while preserving the full sharing history. Requesting an agent creates a personal copy rather than a direct reference, ensuring authorship and independent lifecycle management.

---

## ⚠️ Risks

- The page is marked **Archived**, suggesting the documented flow may have been superseded by a newer implementation
- The Blob-based approval store introduces a secondary source of state; consistency between MongoDB and Blob must be carefully maintained on failures
- "Request = personal copy" means popular agents can generate many near-identical Mongo documents, potentially creating storage and discovery clutter
- No mention of conflict resolution if the original agent is updated after a clone is requested

---

## ✅ Next Steps

- Confirm whether the archived flow has been replaced and update documentation accordingly
- Review Blob-Mongo consistency handling, particularly around failed approval state transitions
- Establish a clone de-duplication or lineage-tracking strategy to manage proliferating copies
- Ensure the `SharedAgent.statusHistory` audit trail is surfaced in the admin UI for compliance visibility

---

## 🔑 Close

The Agent Library's core insight is that **"Request" grants a personal Mongo copy** while **"Share" gates public visibility** via Blob-based approval — a clean separation of personal use from governed distribution.

---

📌 **Document Type:** Architecture / Workflow Reference (Archived)
📅 **Last Updated:** 17 September 2025
🔗 **Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40043905712
