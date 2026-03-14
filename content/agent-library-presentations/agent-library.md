# Agent Library
> End-to-end overview: Create, Share, Review, and Request/Clone — MongoDB as source of truth, Blob for shared artifacts

**Author:** Dipesh Trikam — Insights & Analytics
**Date:** 17 September 2025
**Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40043905712

---

## 🎯 Context

The Agent Library lives in the Insights & Analytics space under AI Projects → Active.
UAT environments are available for testing the full flow: admin app for governance, client app for discovery and request.

UAT admin app: [https://zealous-mushroom-03700c50f.2.azurestaticapps.net/](https://zealous-mushroom-03700c50f.2.azurestaticapps.net/)

UAT client app: [https://gentle-wave-0ea31450f.2.azurestaticapps.net/](https://gentle-wave-0ea31450f.2.azurestaticapps.net/)

---

## 🔍 Problem

Teams need a governed way to author, share, review, and consume AI agents across the organisation.
Without a clear flow, agents stay siloed. Without approval gates, unvetted agents proliferate.
The system must separate personal ownership (MongoDB) from shared discovery (Blob) and enforce review before listing.

---

## 📋 Observations

**1. Create (Datacom Chat)**

Agents are authored in **Datacom Chat**.
Datacom Chat writes and updates the **MongoDB** `agents` **collection** as the source of truth.
All agent metadata, instructions, tools, and configuration live in the Mongo document.

**2. Share (from Agent Library → My Agents)**

My Agents reads from MongoDB.
When a user clicks **Share**, the backend **clones** a snapshot to **Blob** as a **review artifact** with `status: "pending"`.
The Pending page lists all pending artifacts from Blob for reviewer action.

**3. Review (Pending page)**

Reviewer **Approves** → artifact moved to `directory/approved/{agentId}.json`.
Reviewer **Rejects** → artifact moved to `directory/rejected/{shareId}.json`.
**My Agents** decorates each Mongo card with status from Blob: Approved, Pending, or Not shared.

**4. Request / Clone (from Agent Directory or My Agents)**

When a user clicks **Request** (e.g., from **Agent Directory** or **My Agents**):
Backend **clones the agent in MongoDB**, generating a **new** `_id`.
The **requester's user ID** is added to authorship (see schema below).
The clone is **private** by default (not in Blob). It appears in the **requester's My Agents**.
If the requester wants it listed for others, they must **Share** that clone (which goes through the same Pending → Review flow).

**5. Source of truth split**

MongoDB holds the canonical agent data created by Datacom Chat.
Blob holds shared artifacts with pending, approved, or rejected status.
My Agents and Agent Directory reconcile both sources to show the correct status per agent.

**6. Request semantics**

**Request** = personal copy in Mongo with the requester as an author.
**Sharing** still goes through Blob and approval — a requested clone does not automatically appear in the directory.

---

## 💡 Proposal

Treat MongoDB as the single source of truth for agent definitions.
Use Blob as a staging layer for review and approval before agents appear in the shared directory.
Request creates a personal copy; Share creates a reviewable artifact. Both flows are explicit and auditable.

---

## 📊 Data Models

**MongoDB — Agent (created by Datacom Chat)**

```typescript
export interface Agent {
  _id: string;
  name: string;
  description: string;
  category: string; // e.g. "Utilities"
  type: string; // e.g. "Agent", "Retriever"
  instructions: string;
  provider?: string; // e.g. "OpenAI"
  model?: string; // e.g. "gpt-4o-mini"
  tools: string[];
  tags: string[];
  capabilities: string[];
  author: string; // from Datacom Chat
  authorContact?: string;
  version: string; // e.g. "v1.0"
  createdAt: string; // ISO
  updatedAt?: string; // ISO
  source: {
    provider: "datacom-chat";
    externalId?: string; // id in Datacom Chat, if any
  };
  sharing: "Private" | "Public"; // author intent; directory still needs approval
}
```

**Blob — SharedAgent (review artifact)**

```typescript
export interface SharedAgent extends Agent {
  shareId: string;
  originalAgentId: string; // Mongo _id
  status: "pending" | "approved" | "rejected" | "disabled";
  statusHistory: Array<{
    status: SharedAgent["status"];
    at: string;
    by: string;
    notes?: string;
  }>;
  clonedAt: string;
  clonedBy: string; // user id/email from MSAL
  createdVia: "datacom-chat";
}
```

---

## ⚠️ Risks

**Dual storage consistency** MongoDB and Blob must stay in sync for status display. If Blob is slow or misconfigured, My Agents may show stale or incorrect status.

**Clone proliferation** Each Request creates a new Mongo document. Users may accumulate many clones over time; consider lifecycle or archival policies.

**Review bottleneck** All shared agents go through the Pending page. A single reviewer could become a bottleneck if volume grows.

**Author intent vs approval** The `sharing` field reflects author intent (Private/Public), but directory approval is separate. Authors may expect Public to mean immediately visible; it does not.

---

## ✅ Next Steps

1. **Validate UAT** — Exercise the full Create → Share → Review → Request flow in both UAT apps.
2. **Audit status sync** — Confirm My Agents correctly decorates cards from Blob status.
3. **Document Request vs Share** — Ensure user-facing copy clearly explains that Request = personal copy, Share = submit for review.
4. **Review capacity** — Assess reviewer workload and consider multiple moderators or automated checks.

---

## 🔑 Close

> **Request** = personal copy in Mongo with the requester as an author. **Sharing** still goes through Blob and approval.

MongoDB is the source of truth. Blob is the approval layer. Create in Datacom Chat, Share for review, Request for a personal copy.
The flow is explicit, auditable, and separates ownership from discovery.

---

📌 **Document Type:** Presentation — Agent Library End-to-End Overview
📅 **Last Updated:** 17 September 2025
🔗 **Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40043905712
