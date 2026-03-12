# Copilot Agent for Email, Detailed Assessment
> AI Agent (Automation & Intelligence). Automated email response and calendar coordination through Microsoft Copilot. Single-user testing.

**Author:** Insights & Analytics
**Date:** March 2026
**Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA

---

## 🎯 Context

A proof of concept for an automated agent built inside Microsoft Copilot. It responds to emails in a prescribed tone and within set parameters. It also coordinates meeting events by referencing the user's calendar, advising recipients of free/busy times, and booking meetings accordingly. Uses the Graph API to connect to Outlook and Calendar. Currently in single-user testing on existing Microsoft 365 licensing.

**Status:** POC
**Owner:** insights.analytics@datacom.com

---

## 🔍 Problem

Email response and meeting coordination consume significant time daily. Checking calendars, proposing times, confirming bookings. It scales linearly with team size and meeting volume. There is no governed automated solution for routine email replies and calendar coordination within Datacom's Microsoft 365 environment.

---

## 📋 Observations

**1. What it does**
Connects to Outlook and Calendar through Microsoft Copilot. Drafts email responses using configured tone guidelines and parameters. Reads the user's calendar for availability. Advises recipients of free/busy times. Books meeting events with subject, attendees, location, and agenda when confirmed. Runs on existing Microsoft 365 licensing with no additional infrastructure cost.

**2. Current status and limitations**
Single-user testing. Tone parameters require manual configuration. The agent does not yet handle complex multi-thread email chains or ambiguous meeting requests. No production metrics available. No user outcomes documented beyond the single-user test.

**3. Technical dependencies**
Graph API permissions required: Mail.ReadWrite, Calendars.ReadWrite, Mail.Send (send-on-behalf). Entra ID configuration for delegated access. The agent processes email content through Microsoft's AI infrastructure under existing M365 data processing agreements. These permissions and the associated privacy review represent the primary blockers for any expansion beyond single-user testing.

**4. What is not yet known**
Draft acceptance rates have not been measured across multiple users. Scheduling accuracy against actual calendar availability has not been benchmarked. Time savings have not been quantified. The privacy and security review for AI reading and responding to emails has not been initiated. Tone guideline configuration process has not been standardised. No evaluation criteria or success metrics have been defined.

*[These items need to be quantified and documented as testing progresses.]*

**5. Contact**
For more information or to discuss this capability, contact insights.analytics@datacom.com.

---

## 💡 Proposal

Recommended next step: initiate the privacy and security review to determine whether expansion beyond single-user testing is viable. Contact insights.analytics@datacom.com.

---

## 🔑 Close

> Automated email and calendar management via Copilot. Single-user testing. Privacy review is the critical dependency for any expansion.

**Owner:** insights.analytics@datacom.com

*POC. Assessment will be updated when measured outcomes and privacy review results are available.*
