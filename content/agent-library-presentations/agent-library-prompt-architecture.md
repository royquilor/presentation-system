# Prompt Architecture

> Prompting strategy, system prompt designs, voice interface states, real-time output generation, and technical architecture for the Adaptive Conversational Discovery Engine (ACDE).

**Author:** Dipesh Trikam
**Date:** 13 January 2026
**Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40634745263

---

## 🎯 Context

The ACDE uses ElevenLabs Conversational AI agents to conduct voice-based discovery interviews with business users. Each interview template has a specific focus and prompting style optimised for its use case. The system generates live process maps and SIPOC tables from natural conversation.


This document describes the prompting strategy, system prompts, voice interface states, and real-time output generation used across different interview templates and views in the Adaptive Conversational Discovery Engine. It sits within the Insights & Analytics space under AI Projects → Active → Adaptive Conversational Discovery Engine → Prompt Architecture.


**Confluence:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40634745263

---

## 🔍 Problem

Different discovery use cases require distinctly different questioning styles and data capture strategies. Without a documented prompting architecture, the correct agent behaviours, elicitation techniques, and output structures for each interview template cannot be consistently configured or maintained.


Workflow mapping, AI readiness assessment, and process improvement each demand purpose-built prompts. The system must support variable injection, voice state management, and real-time diagram generation while remaining maintainable as templates evolve.

---

## 📋 Observations

**1. Workflow Discovery template (`workflow-discovery`)**

Purpose-built for mapping business processes step by step through guided conversation. The system prompt elicits process steps in chronological order, identifies actors and roles at each step, captures inputs and outputs, documents decision points and branches, and notes handoffs between teams and systems. Produces a complete SIPOC table and Mermaid.js flowchart.


**2. AI Adoption Assessment template (`ai-adoption`)**

Evaluates an organisation's AI readiness and identifies opportunities. The prompt discovers pain points and inefficiencies, assesses data availability and quality, identifies repetitive or manual tasks, evaluates technical maturity, and finds quick wins for AI implementation. Assessment dimensions include pain intensity, data readiness, automation potential, implementation effort, and business value.


**3. Process Improvement template (`process-improvement`)**

Identifies bottlenecks, inefficiencies, and optimisation opportunities using Lean thinking. The prompt applies Lean principles, identifies the 8 TIMWOODS wastes (Transportation, Inventory, Motion, Waiting, Overproduction, Overprocessing, Defects, Skills), finds bottlenecks and constraints, discovers variation and quality issues, and captures improvement ideas from users.


**4. Voice interface states**

Five connection states define the user experience: `idle` (static blue orb, ready to start), `connecting` (pulsing amber, establishing connection), `listening` (breathing blue with particles, AI is listening), `speaking` (active green with sound waves, AI is responding), and `processing` (spinning amber, processing user input). Each state has a distinct visual to communicate agent status.


**5. Transcript and real-time mapping**

The interface shows current transcript (live speech-to-text), last response (most recent AI message when listening), and a toggle-able sidebar with full conversation history. During interviews, the system generates an auto-updating Mermaid.js flowchart (colour-coded by actor) and a SIPOC table populated from conversation context, both exportable to CSV or Excel.


**6. ElevenLabs agent configuration**

The agent uses `eleven_turbo_v2` model with stability 0.5, similarity_boost 0.75, style 0.4, and speaker boost enabled. Prompt variables injected at runtime include `{template_id}`, `{session_id}`, `{user_name}`, and `{company_context}` for session personalisation.


**7. Best practices for prompt engineering**

Keep prompts conversational and avoid robotic or scripted language. Use follow-up questions to build on previous answers. Summarise periodically to confirm understanding. Guide gently and redirect if conversation drifts. Prioritise quality of the resulting process map over rigid script adherence.

---

## 💡 Proposal

Each interview template is backed by a purpose-built system prompt that guides the ElevenLabs voice agent through structured elicitation with conversational, follow-up-oriented language. Prompt variables are injected at runtime to personalise each session.


Best practices emphasise natural, non-scripted language, periodic summarisation, and gentle redirection. The architecture supports three built-in templates today with a path to custom template creation, industry-specific prompt libraries, and multi-language support in future releases.

---

## ⚠️ Risks

**Voice AI quality dependency** — The accuracy of generated process maps and SIPOC tables is entirely dependent on how well users verbalise their processes. Vague or incomplete answers will produce low-quality outputs.


**No custom template creation yet** — The three built-in templates cover common use cases but cannot be tailored to client-specific methodologies without engineering involvement.


**Multi-language support not implemented** — All templates are English-only. International Datacom engagements are not currently supported.


**ElevenLabs vendor lock-in** — The voice agent configuration is tightly coupled to ElevenLabs' API and model names. Changes to their platform could require rework.


**Transcript and diagram fidelity** — Real-time mapping depends on accurate speech-to-text and structured extraction from conversation. Errors compound if the agent misinterprets user intent.

---

## ✅ Next Steps

1. **Custom template creation** — Implement the planned feature to allow practitioners to build domain-specific interview guides without engineering support.

2. **Industry-specific prompt library** — Develop prompt libraries for common client sectors to accelerate configuration and improve consistency.

3. **Multi-language support** — Add multi-language support to expand the ACDE's applicability to Datacom's international engagements.

4. **Process mining integration** — Explore integration with process mining tools to enrich auto-generated process diagrams with quantitative data from existing systems.

5. **Custom voice selection** — Add the ability for clients to choose a voice persona that aligns with their brand or engagement style.

6. **Prompt versioning** — Introduce version control for prompts to support A/B testing and rollback when changes degrade quality.

---

## 🔑 Close

> The ACDE's prompt architecture provides a solid foundation of three purpose-built interview templates with clear elicitation goals and real-time visual output.

The full potential depends on extending it with custom templates, multi-language support, and deeper process tooling integrations. Success factors include conversational prompt design, reliable variable injection, and consistent voice interface state management across all templates.

---

## 📐 Prompt Data Models

**1. Interview template model**

Each template is a document with `template_id` (e.g. `workflow-discovery`, `ai-adoption`, `process-improvement`), `name`, `purpose`, `system_prompt` (the full prompt text with placeholders), `elicitation_goals` (array of capture targets), and `output_schema` (structure for SIPOC, Mermaid, or assessment dimensions). Templates define what the agent asks and what it extracts.


**2. Session and variable model**

A session binds `session_id`, `template_id`, `user_name`, `company_context`, and optional metadata. At runtime, variables are injected into the system prompt: `{template_id}` identifies the template, `{session_id}` provides a unique session identifier, `{user_name}` is the authenticated user's display name, and `{company_context}` holds pre-configured company information. These enable personalisation without duplicating prompts.


**3. ElevenLabs agent config model**

The agent configuration is a JSON object with `voice_id`, `model` (e.g. `eleven_turbo_v2`), `stability`, `similarity_boost`, `style`, and `use_speaker_boost`. This model is shared across templates but can be overridden per template for voice or tone customisation in future.

---

## 🗄️ Storage Architecture

**1. Template storage**

Templates can be stored as configuration files (JSON or YAML) in the application repository, in a database collection (e.g. Cosmos DB or MongoDB), or in a CMS. The current design implies static configuration; custom template creation would require a database-backed store with CRUD operations and validation against the template schema.


**2. Session and transcript storage**

Sessions and transcripts are persisted for audit, replay, and export. Storage must support append-only transcript updates, retrieval by `session_id`, and export to CSV or Excel. Partitioning by `session_id` or `user_id` enables scalable query patterns for user history and compliance.


**3. Generated artefact storage**

Mermaid diagrams and SIPOC tables are derived from conversation context. They may be computed on-the-fly or cached. Export formats (CSV, Excel) suggest transient generation rather than long-term storage, unless audit requirements mandate retention of generated outputs.


**4. Real-time mapping pipeline**

The process diagram uses Mermaid.js flowchart syntax, auto-updates as steps are discovered, shows decision points and branches, and is colour-coded by actor or role. The SIPOC table is populated from conversation context, links to relevant process steps, and is exportable to CSV or Excel. Both outputs require a pipeline that extracts structured data from the transcript and maintains consistency as the conversation evolves.

---

## 🔌 API Endpoints

**1. Template endpoints**

`GET /templates` — List available interview templates. `GET /templates/:template_id` — Retrieve a single template with system prompt and configuration. `POST /templates` (future) — Create custom template. `PUT /templates/:template_id` (future) — Update template. `DELETE /templates/:template_id` (future) — Remove custom template. These support template discovery and, when custom creation is implemented, full lifecycle management.


**2. Session endpoints**

`POST /sessions` — Create a new interview session with `template_id`, `user_name`, `company_context`. Returns `session_id` and connection details for ElevenLabs. `GET /sessions/:session_id` — Retrieve session metadata and transcript. `GET /sessions/:session_id/export` — Export transcript, SIPOC, or Mermaid diagram in requested format. Supports audit and replay workflows.


**3. Voice and real-time endpoints**

WebSocket or streaming endpoints for real-time voice connection to ElevenLabs. The client establishes a connection with `session_id` and receives transcript updates, voice state changes, and incremental diagram or SIPOC updates as the conversation progresses. Health checks and reconnection logic are required for production reliability.


**4. Health and configuration endpoints**

`GET /health` — Liveness and readiness probes for load balancers and orchestration. `GET /config` — Retrieve client-side configuration (e.g. voice state visuals, feature flags). These support operational monitoring and environment-specific behaviour without redeployment.

---

## 📦 Versioning and Change Management

**1. Prompt versioning**

Prompts evolve as elicitation techniques improve. Versioning allows tracking changes, A/B testing variants, and rollback if a new prompt degrades output quality. A versioned prompt model would include `version`, `created_at`, `created_by`, and `is_active` to support gradual rollout and comparison.


**2. Template versioning**

When custom templates are supported, versioning prevents breaking changes for in-flight sessions. New versions can be drafted, tested in staging, and promoted. Old versions remain available for sessions that started before the change. Semantic versioning (e.g. `workflow-discovery@1.2.0`) supports clear communication of breaking vs. non-breaking updates.


**3. Configuration drift**

ElevenLabs agent settings (stability, similarity_boost, etc.) should be versioned alongside prompts. Changes to voice parameters can affect user experience; tracking these in configuration management or feature flags enables controlled rollout and quick rollback.


**4. Audit and compliance**

Prompt and template changes should be logged for audit. Who changed what, when, and why supports compliance reviews and incident investigation. Retention policies for prompt history align with broader audit log retention (e.g. one year for regulatory compliance).

---

## ⚙️ Configuration Reference

**1. ElevenLabs agent settings**

```json
{
  "voice_id": "recommended-professional-voice",
  "model": "eleven_turbo_v2",
  "stability": 0.5,
  "similarity_boost": 0.75,
  "style": 0.4,
  "use_speaker_boost": true
}
```


**2. Prompt variables**

- `{template_id}` — The selected interview template
- `{session_id}` — Unique session identifier
- `{user_name}` — Authenticated user's display name
- `{company_context}` — Pre-configured company information


**3. Sample agent behaviour (workflow-discovery)**

"Let's start by understanding the beginning of this process. What triggers it to start? Who is typically involved at that first step?" "Great, so after [step], what happens next? Who takes over from there?" "Are there any decision points here where the process might go in different directions?"


**4. Sample agent behaviour (ai-adoption)**

"Tell me about a task in your day that feels repetitive or time-consuming. What makes it tedious?" "Where do you spend most of your time on manual data entry or copying information between systems?" "If you could automate one thing tomorrow, what would have the biggest impact?"


**5. Sample agent behaviour (process-improvement)**

"Where in this process do things typically get stuck or delayed? What causes those delays?" "Are there steps where you have to redo work because of errors or missing information?" "What's something you wish worked differently about this process?"

---

## 📊 SIPOC and Lean Elements

**1. SIPOC elements captured (workflow-discovery)**

Suppliers: who provides inputs to each step. Inputs: data, materials, or information needed. Process: the workflow steps themselves. Outputs: results produced at each step. Customers: who receives the outputs. The SIPOC table is populated from conversation context and links to relevant process steps.


**2. Lean waste categories (process-improvement)**

Transportation: unnecessary movement of materials. Inventory: excess work in progress. Motion: unnecessary movement of people. Waiting: idle time and delays. Overproduction: doing more than needed. Overprocessing: unnecessary complexity. Defects: errors requiring rework. Skills: underutilised talent. The TIMWOODS framework guides the agent's questioning strategy.


**3. AI adoption assessment dimensions**

Pain intensity: how much does this issue affect productivity? Data readiness: is there structured data available? Automation potential: could AI realistically help here? Implementation effort: what would it take to implement? Business value: what is the ROI potential? These five dimensions structure the ai-adoption template's elicitation and scoring model.

---

## 👤 User and Prompt Best Practices

**1. For users**

Speak naturally — the AI understands conversational language. Be specific — detailed answers lead to better process maps. Mention names and roles — helps identify actors in the workflow. Describe exceptions — edge cases reveal important branches.


**2. For prompt engineering**

Keep it conversational — avoid robotic or scripted language. Use follow-up questions — build on previous answers. Summarise periodically — confirm understanding. Guide gently — redirect if conversation drifts. Prioritise quality of the resulting process map over rigid script adherence.


**3. Variable injection hygiene**

Ensure `{template_id}`, `{session_id}`, `{user_name}`, and `{company_context}` are always populated before prompt dispatch. Missing variables can produce broken or confusing agent behaviour. Validate variable presence at session creation and log warnings if optional context (e.g. `company_context`) is empty.

---

## 📋 Future Enhancements

- [ ] Custom template creation — allow practitioners to build domain-specific interview guides without engineering support
- [ ] Industry-specific prompt libraries — accelerate configuration for common client sectors (e.g. healthcare, finance)
- [ ] Multi-language support — expand applicability to Datacom's international engagements
- [ ] Integration with process mining tools — enrich auto-generated diagrams with quantitative system data
- [ ] Custom voice selection — let clients choose a voice persona aligned with brand or engagement style

---

## 📌 Summary

**1. Three templates, one architecture**

Workflow discovery, AI adoption assessment, and process improvement share a common prompting architecture: purpose-built system prompts, variable injection, ElevenLabs voice agents, and real-time Mermaid plus SIPOC output. Each template has distinct elicitation goals and sample behaviours.


**2. Technical foundations**

Prompt data models (template, session, config), storage for templates and transcripts, API endpoints for templates and sessions, and versioning for prompts and configuration form the technical backbone. Future custom template creation will require database-backed storage and full CRUD APIs.


**3. Quality and evolution**

Best practices emphasise conversational prompts, periodic summarisation, and gentle redirection. Versioning and audit logging support safe evolution. Success depends on user verbalisation quality, ElevenLabs reliability, and consistent variable injection.

---

📌 **Document Type:** Architecture Doc / Prompt Engineering Reference
📅 **Last Updated:** 13 January 2026
🔗 **Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40634745263
