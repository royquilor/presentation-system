# Quiz Research: Source Analysis and Question Generation Methodology

## Purpose

This document describes the systematic process for reading, understanding, and transforming Agent Library presentation markdown files into effective learning quizzes. Each quiz targets a specific learning focus area and draws from multiple source presentations to test cross-cutting knowledge.

---

## Source Material Inventory

### Week 1: OpenAPI Spec Syntax + Design-System Mapping

**Primary sources:**
- `agent-library-api-guide.md` -- All API endpoints, data models, authentication, pagination, error codes
- `agent-library-architecture.md` -- Module-per-entity pattern, dual database design, WAF compliance

**Key knowledge domains:**
- REST endpoint structure (GET/POST/PUT/DELETE patterns)
- JWT authentication flow (Azure AD, Bearer tokens, role-based access)
- Data model schemas (Agent, Prompt, User, Approval)
- Error response format and HTTP status code semantics
- Rate limiting and pagination patterns
- Module architecture (8 modules, their base paths)

**Why these sources:** The API Guide is the most endpoint-dense document in the library. Architecture provides the design rationale behind the API surface. Together they cover what an API spec would document.

---

### Week 2: Observability Basics + LLM Metric Definitions

**Primary sources:**
- `agent-library-application-insights.md` -- Telemetry architecture, KQL queries, sampling, dashboards
- `agent-library-operations-runbook.md` -- Health checks, alerting thresholds, incident response, SLOs
- `agent-library-troubleshooting.md` -- Diagnostic flows, error patterns, escalation

**Key knowledge domains:**
- Application Insights setup (frontend + backend instrumentation)
- KQL query patterns for common investigations
- Sampling strategies and their cost/accuracy tradeoffs
- Health endpoint hierarchy (/api/health, /api/agents/health, etc.)
- Alert thresholds (response time, error rate, CPU, memory)
- Incident severity levels (P0-P3) and response times
- Performance targets (p95 < 200ms, error rate < 1%, uptime > 99.9%)

**Why these sources:** Observability spans three concerns: what to measure (App Insights), how to respond (Operations), and how to diagnose (Troubleshooting). Testing across all three forces learners to connect metrics to actions.

---

### Week 3: Prompt Template Structure + Failure Modes

**Primary sources:**
- `agent-library-prompt-architecture.md` -- ACDE system prompts, voice states, template variables, real-time output
- `agent-library-feature-flagging-implementation-guide.md` -- Feature flag lifecycle, rollout patterns, fail-closed design
- `agent-library-troubleshooting.md` -- Authentication failures, connection errors, diagnostic procedures

**Key knowledge domains:**
- Three prompt templates (workflow-discovery, ai-adoption, process-improvement)
- Voice interface state machine (idle, connecting, listening, speaking, processing)
- SIPOC and TIMWOODS methodologies
- Prompt variable injection ({template_id}, {session_id}, {user_name}, {company_context})
- Feature flag types (release, experiment, ops, permission)
- Fail-closed principle and emergency disable procedures
- Common failure patterns and their resolution steps

**Why these sources:** Prompt architecture defines what the system does. Feature flags control how it rolls out. Troubleshooting covers what happens when things break. This combination tests both design understanding and operational resilience.

---

### Week 4: Integration Checkpoint -- Connect Spec to Metric to Prompt

**Primary sources:** All Week 1-3 sources plus:
- `agent-library-overview.md` -- System-wide architecture, ADRs, performance benchmarks
- `agent-library-auth-and-authorisation.md` -- JWT validation, MSAL.js, RBAC deep dive
- `agent-library-versioning-system-agents-and-prompts.md` -- Version lifecycle, ACL updates

**Key knowledge domains:**
- End-to-end request flow (browser to database and back)
- How API design decisions affect observability
- How prompt templates interact with the API layer
- Cross-system failure scenarios (auth failure affects all layers)
- Architecture decision records (ADR-001 through ADR-005)
- Version update flow and its API surface
- Connecting metrics to specific API endpoints

**Why these sources:** Integration testing requires synthesizing knowledge across all domains. Learners must trace a request from API spec through telemetry to prompt execution.

---

## Content Analysis Process

For each source file, the following extraction was performed:

### Step 1: Structural Scan
- Read all headings (##, ###) to map the document skeleton
- Identify the document type (reference, guide, architecture, test plan)
- Note the section structure (Context, Problem, Observations, Proposal, Flex sections)

### Step 2: Term Extraction
- Identify all **bold terms** as potential vocabulary questions
- Identify all `inline code` as technical identifiers to test
- Extract all numbers/statistics as factual recall targets
- Note all acronyms and their definitions

### Step 3: Process Mapping
- Identify all sequential workflows (auth flow, deployment pipeline, incident response)
- Map decision points (if-then patterns, role-based branching)
- Note all "never do this" warnings as true/false question candidates

### Step 4: Failure Mode Analysis
- Extract all error codes and their meanings
- Identify common misconfiguration scenarios
- Note escalation paths and timeout values
- Map diagnostic procedures to their triggering symptoms

### Step 5: Cross-Reference Verification
- Check that key numbers (12ms, 99.9%, 8.5/10) are consistent across documents
- Verify that process descriptions in different documents align
- Identify concepts that span multiple documents (JWT auth appears in API Guide, Architecture, Auth, Troubleshooting)

---

## Question Generation Rules

### Distribution per quiz
- **Easy (30%):** Direct recall of terms, definitions, exact numbers
- **Medium (50%):** Understanding relationships, choosing correct procedures, interpreting scenarios
- **Hard (20%):** Cross-document synthesis, failure analysis, architectural reasoning

### Type distribution per standard quiz (7 questions)
- 3 Multiple Choice (1 easy, 1 medium, 1 hard)
- 1 True/False (medium -- challenges a common assumption)
- 1 Scenario (medium-hard -- realistic decision)
- 1 Text Input (medium -- tests constructed knowledge)
- 1 Ordering (medium -- tests process understanding)

### Quality checks
- Every distractor is plausible (based on real misconceptions or partial truths)
- Every explanation teaches, not just confirms
- No "trick" questions -- difficulty comes from depth, not ambiguity
- Each question maps to a specific learning objective
- Questions are answerable from the source material alone

---

## File Naming Convention

Quiz files are stored alongside their source presentations:
- `agent-library-api-guide.quiz.json` -- Week 1 quiz
- `agent-library-application-insights.quiz.json` -- Week 2 quiz
- `agent-library-prompt-architecture.quiz.json` -- Week 3 quiz
- `agent-library-overview.quiz.json` -- Week 4 integration quiz
