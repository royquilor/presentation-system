# Approval Workflow

> An early operational runbook documenting the manual steps required to add a new agent card to the Agent Library and approve an agent sharing request during the MVP phase.

**Author:** [Johnson Paku](https://datacomgroup.atlassian.net/wiki/people/712020:1b15186f-f1c3-4b59-9e73-7c94b21e6ede)
**Date:** 8 August 2025
**Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40011694081

---

## 🎯 Context

This document was authored by Johnson Paku for the Datacom Chat — Agent Store MVP project within the Insights & Analytics space. It captures the manual, script-driven process used by administrators during the early development phase to manage agent submissions before a fully automated approval system was in place.

---

## 🔍 Problem

In the MVP phase, there was no automated pipeline to process new agent cards or approve sharing requests. Administrators needed a step-by-step guide to manually add agents to the library and run the duplication script that provisions approved agents for recipients in the Conver platform.

---

## 📋 Observations

- **Adding a new agent card** requires SSH-ing into an Azure VM (`dev-agent-library-vm-aus-east`), navigating to a TypeScript data file (`src/polymet/data/agents.ts`), and manually inserting a JSON object.
- **The JSON structure for a new card** includes fields for `id`, `name`, `type`, `category`, `author`, `description`, `problemSolved`, `sharing`, `specificIndividuals`, `compliance` flags, and `rating` — mirroring the later database schema.
- **Agent card JSON was generated via ChatGPT** from email submission content, indicating a semi-automated but not integrated intake process.
- **Approving an agent** requires cloning the `AgentDuplicator` GitHub repository and running `agent_duplication_app.py`, which takes the owner's and requester's email addresses as inputs.
- **The entire workflow is manual and VM-dependent** — no API, no admin UI, and no automated notifications at this stage.
- **Only two pieces of information are required to approve**: the original owner's email and the requester's email.

---

## 💡 Proposal

This document describes the manual MVP workaround: admins SSH into a dev VM to edit source data files for new cards and run a Python duplication script for approvals. The process relies on access to the Azure VM, the GitHub repository, and valid email addresses for both parties. The "Notify Submitter of Approval" step is listed but not detailed, suggesting it was handled out-of-band (e.g., via email).

---

## ⚠️ Risks

- **Direct VM file editing is error-prone** — manually editing TypeScript source files on a VM bypasses code review, version control practices, and type safety checks.
- **No audit trail** — this process generates no automated log of who approved what and when; compliance and accountability rely entirely on human record-keeping.
- **Single point of failure** — the workflow depends on access to a specific Azure VM; if the VM is unavailable or access is revoked, approvals are blocked entirely.
- **Scalability ceiling** — the manual process is unsuitable for any meaningful volume of submissions and was clearly intended only as a temporary MVP solution.

---

## ✅ Next Steps

- This runbook should be retired once the automated approval system (documented in the Technical Specification and Agent Access System docs) is deployed.
- Verify the `AgentDuplicator` Python script still functions correctly and document its dependencies and configuration requirements.
- Ensure all historical approvals performed via this process are retroactively captured in the audit log system introduced in later architecture iterations.
- Confirm the dev VM (`dev-agent-library-vm-aus-east`) is decommissioned or repurposed once the production admin UI is live.

---

## 🔑 Close

This is a minimal MVP runbook representing the earliest approval process; it has since been superseded by the automated admin UI and API-driven approval workflow described in the broader Agent Library architecture documentation.

---

📌 **Document Type:** Operations Runbook (MVP / Archived)
📅 **Last Updated:** 8 August 2025
🔗 **Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40011694081
