# Prompt Architecture

> A reference document describing the prompting strategy, system prompt designs, voice interface states, and real-time output generation used across interview templates in the Adaptive Conversational Discovery Engine (ACDE).

**Author:** [Dipesh Trikam](https://datacomgroup.atlassian.net/wiki/people/712020:06f04ec7-5f4c-4e03-a2a3-3e46b413e073)
**Date:** 13 January 2026
**Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40634745263

---

## 🎯 Context

This document was authored by Dipesh Trikam for the Adaptive Conversational Discovery Engine project within the Insights & Analytics team at Datacom. The ACDE uses ElevenLabs Conversational AI voice agents to conduct structured discovery interviews with business users, generating live process maps and SIPOC tables from natural conversation.

---

## 🔍 Problem

Different discovery use cases (workflow mapping, AI readiness assessment, process improvement) require distinctly different questioning styles and data capture strategies. Without a documented prompting architecture, the correct agent behaviours, elicitation techniques, and output structures for each interview template cannot be consistently configured or maintained.

---

## 📋 Observations

- **Three interview templates** are defined: `workflow-discovery` (SIPOC-based process mapping), `ai-adoption` (AI readiness and opportunity assessment), and `process-improvement` (Lean/TIMWOODS waste identification).
- **Workflow discovery** elicits steps in chronological order, captures actors/roles, inputs/outputs, decision points, and handoffs — producing a complete SIPOC table and Mermaid.js flowchart.
- **AI adoption assessment** probes pain intensity, data readiness, automation potential, implementation effort, and business value — framed as a five-dimension scoring model.
- **Process improvement** applies Lean thinking to identify the 8 TIMWOODS wastes (Transportation, Inventory, Motion, Waiting, Overproduction, Overprocessing, Defects, Skills).
- **ElevenLabs agent configuration** uses `eleven_turbo_v2` model with stability 0.5, similarity_boost 0.75, style 0.4, and speaker boost enabled — tuned for clear, professional conversational voice.
- **Five voice interface states** are defined: `idle`, `connecting`, `listening`, `speaking`, and `processing` — each with a distinct visual (colour, animation) to communicate agent status to users.
- **Real-time outputs** include an auto-updating Mermaid.js process flowchart (colour-coded by actor) and a SIPOC table populated from conversation context, both exportable.

---

## 💡 Proposal

Each interview template is backed by a purpose-built system prompt that guides the ElevenLabs voice agent through structured elicitation with conversational, follow-up-oriented language. Prompt variables (`{template_id}`, `{session_id}`, `{user_name}`, `{company_context}`) are injected at runtime to personalise each session. Best practices emphasise natural, non-scripted language, periodic summarisation, and gentle redirection — prioritising the quality of the resulting process map over rigid script adherence.

---

## ⚠️ Risks

- **Voice AI quality dependency** — the accuracy of generated process maps and SIPOC tables is entirely dependent on how well users verbalise their processes; vague or incomplete answers will produce low-quality outputs.
- **No custom template creation yet** — the three built-in templates cover common use cases but cannot be tailored to client-specific methodologies without engineering involvement.
- **Multi-language support not implemented** — all templates are English-only; international Datacom engagements are not currently supported.
- **ElevenLabs vendor lock-in** — the voice agent configuration is tightly coupled to ElevenLabs' API and model names; changes to their platform could require rework.

---

## ✅ Next Steps

- Implement the planned **custom template creation** feature to allow practitioners to build domain-specific interview guides without engineering support.
- Develop an **industry-specific prompt library** to accelerate configuration for common client sectors.
- Add **multi-language support** to expand the ACDE's applicability to Datacom's international engagements.
- Explore **integration with process mining tools** to enrich auto-generated process diagrams with quantitative data from existing systems.
- Add **custom voice selection** to allow clients to choose a voice persona that aligns with their brand or engagement style.

---

## 🔑 Close

The ACDE's prompt architecture provides a solid foundation of three purpose-built interview templates with clear elicitation goals and real-time visual output — but its full potential depends on extending it with custom templates, multi-language support, and deeper process tooling integrations.

---

📌 **Document Type:** Architecture Doc / Prompt Engineering Reference
📅 **Last Updated:** 13 January 2026
🔗 **Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40634745263
