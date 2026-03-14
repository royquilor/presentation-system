# Agent Library Approval Workflow

> Manual runbook for adding agent cards and approving sharing requests during the Agent Store MVP phase.

**Author:** Johnson Paku
**Date:** 8 August 2025
**Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40011694081

---

## 🎯 Context

This document lives in the Insights & Analytics space under AI Projects → Active → Datacom Chat → Datacom Chat - Agent Store MVP. It captures the manual, step-by-step process used by administrators to add new agent cards to the library and approve agent sharing requests before an automated approval system existed.

---

## 🔍 Problem

In the MVP phase, there was no automated pipeline to process new agent cards or approve sharing requests. Administrators needed a clear runbook to manually add agents to the library data and run the duplication script that provisions approved agents for recipients in the Conver platform.

---

## 📋 Observations

**1. New cards require ChatGPT-assisted JSON generation**

Email submissions are converted into a structured JSON format via ChatGPT. The output is then manually inserted into the source data file.

---

**2. Agent card JSON schema**

The card structure includes identity, metadata, sharing, compliance, and rating fields. Example:

```json
{
    "id": "Unassigned",
    "name": "aa",
    "type": "Agent",
    "category": "Productivity",
    "author": "Johnson Paku",
    "description": "aaa",
    "fullDescription": "Unprovided",
    "problemSolved": "aaa",
    "technicalRequirements": "Unprovided",
    "authorContact": "johnson.paku3@datacom.com",
    "sharing": "All Datacom",
    "specificIndividuals": [],
    "compliance": {
      "noCredentials": true,
      "noSensitiveData": true
    },
    "rating": {
      "average": null,
      "count": 0,
      "userRatings": {}
    },
    "createdAt": "2025-08-04"
}
```

---

**3. Add-card workflow is VM-based**

Steps: connect to the dev VM via SSH, navigate to `src/polymet/data/agents.ts`, add the ChatGPT output to the file, and save. No admin UI or API is involved.

---

**4. Approval uses AgentDuplicator script**

Approval requires cloning the `AgentDuplicator` repository from GitHub and running `agent_duplication_app.py`. The script prompts for the owner's email address and the requester's email address.

---

**5. Notification is out-of-band**

The final step is "Notify Submitter of Approval" but no automated mechanism is documented; it is assumed to be handled manually (e.g., via email).

---

## 💡 Proposal

**1. Add new card to Agent Library**

Ask ChatGPT to produce the JSON format from the email submission. Then:

1. Connect to the [dev VM](https://portal.azure.com/#@datacomunity.com/resource/subscriptions/8105323d-9d3e-4942-a3e0-8ca3c383adae/resourceGroups/dev-agent-library/providers/Microsoft.Compute/virtualMachines/dev-agent-library-vm-aus-east/connect) via SSH.
2. Go to `src/polymet/data/agents.ts`.
3. Add the ChatGPT output to the file and save.

---

**2. Approve agent request**

1. Clone [https://github.com/DatacomGroup/AgentDuplicator](https://github.com/DatacomGroup/AgentDuplicator).
2. Run `agent_duplication_app.py` and follow the prompts.
3. Requirements: owner's email address and requester's email address.
4. Notify the submitter of approval.

---

## ⚠️ Risks

**Direct VM file editing** Manually editing TypeScript source files on a VM bypasses code review, version control, and type safety checks.

**No audit trail** The process does not generate an automated log of who approved what and when; compliance relies on manual record-keeping.

**Single point of failure** The workflow depends on access to the Azure VM; if it is unavailable or access is revoked, approvals are blocked.

**Scalability ceiling** The manual process is unsuitable for meaningful submission volume and was intended only as a temporary MVP solution.

---

## ✅ Next Steps

1. **Retire runbook** — Decommission this runbook once the automated approval system is deployed.
2. **Verify AgentDuplicator** — Confirm `agent_duplication_app.py` still works and document its dependencies and configuration.
3. **Retrofit audit log** — Ensure historical approvals performed via this process are captured in the audit log system.
4. **Decommission VM** — Confirm the dev VM (`dev-agent-library-vm-aus-east`) is decommissioned or repurposed once the production admin UI is live.

---

## 🔑 Close

> This is a minimal MVP runbook representing the earliest approval process; it has since been superseded by the automated admin UI and API-driven approval workflow described in the broader Agent Library architecture documentation.

---

📌 **Document Type:** Operations Runbook (MVP / Archived)
📅 **Last Updated:** 8 August 2025
🔗 **Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40011694081
