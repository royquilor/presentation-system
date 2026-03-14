# The Complete Guide to Building Skills for Claude
> Teach Claude once, benefit every time — from planning and structure to testing and distribution

**Author:** Anthropic
**Date:** January 2026
**Source:** https://resources.anthropic.com/hubfs/The-Complete-Guide-to-Building-Skill-for-Claude.pdf

---

## 🎯 Context

What is a skill?

A skill is a set of instructions — packaged as a simple folder — that teaches Claude how to handle specific tasks or workflows. Instead of re-explaining your preferences, processes, and domain expertise in every conversation, skills let you teach Claude once and benefit every time.

Skills use a three-level progressive disclosure system. First level: YAML frontmatter is always loaded in Claude's system prompt, providing just enough information for Claude to know when each skill should be used. Second level: the SKILL.md body is loaded when Claude thinks the skill is relevant. Third level: linked reference files are discovered only as needed. This minimises token usage while maintaining specialised expertise.

Skills are powerful for repeatable workflows: generating frontend designs from specs, conducting research with consistent methodology, creating documents that follow your team's style guide, or orchestrating multi-step processes. They work across Claude.ai, Claude Code, and API without modification.

---

## 🔍 Problem

Without skills, every conversation starts from scratch

Without skills, users connect an MCP integration but don't know what to do next. Support tickets pile up asking "how do I do X with your integration." Each conversation starts from scratch, results are inconsistent because users prompt differently each time, and users blame the connector when the real issue is workflow guidance.

With skills, pre-built workflows activate automatically when needed. Tool usage becomes consistent and reliable. Best practices are embedded in every interaction. The learning curve drops dramatically and results are reproducible across sessions and users.

---

## 🔌 Skills + MCP

Think of it like a professional kitchen. MCP provides the kitchen: access to tools, ingredients, and equipment. Skills provide the recipes: step-by-step instructions on how to create something valuable. Together, they enable users to accomplish complex tasks without needing to figure out every step themselves.

MCP provides connectivity — it connects Claude to your service (Notion, Asana, Linear), provides real-time data access and tool invocation. Skills provide knowledge — they teach Claude how to use your service effectively, capture workflows and best practices. MCP is what Claude can do. Skills are how Claude should do it.

For MCP builders, skills are the knowledge layer on top of tool access. Users who have both a working MCP server and well-crafted skills see dramatically better outcomes than those with either alone.

---

## 📋 Observations

**1. Category 1 — Document and Asset Creation**
Creating consistent, high-quality output including documents, presentations, apps, designs, and code. The frontend-design skill is a real example: "Create distinctive, production-grade frontend interfaces with high design quality." Key techniques include embedded style guides and brand standards, template structures for consistent output, and quality checklists before finalising. No external tools required — these skills use Claude's built-in capabilities.

**2. Category 2 — Workflow Automation**
Multi-step processes that benefit from consistent methodology, including coordination across multiple MCP servers. The skill-creator skill is a real example: "Interactive guide for creating new skills. Walks the user through use case definition, frontmatter generation, instruction writing, and validation." Key techniques include step-by-step workflows with validation gates, templates for common structures, built-in review suggestions, and iterative refinement loops.

**3. Category 3 — MCP Enhancement**
Workflow guidance to enhance the tool access an MCP server provides. The sentry-code-review skill from Sentry is a real example: "Automatically analyses and fixes detected bugs in GitHub Pull Requests using Sentry's error monitoring data." Key techniques include coordinating multiple MCP calls in sequence, embedding domain expertise, providing context users would otherwise need to specify, and error handling for common MCP issues.

---

## 📝 Technical Requirements

A skill is a folder containing SKILL.md (required), plus optional directories for scripts, references, and assets. The folder must use kebab-case naming — no spaces, underscores, or capitals. SKILL.md must be exactly that name, case-sensitive. Do not include a README.md inside the skill folder.

YAML frontmatter is the most important part — it determines whether Claude loads the skill. The name field must be kebab-case and match the folder name. The description field must include both what the skill does and when to use it, with specific trigger phrases. Keep it under 1024 characters with no XML angle brackets. Skills with "claude" or "anthropic" in the name are reserved.

A good description follows the pattern: what it does, plus when to use it, plus key capabilities. For example: "Analyses Figma design files and generates developer handoff documentation. Use when user uploads .fig files, asks for design specs, component documentation, or design-to-code handoff." A bad description is vague ("Helps with projects") or missing triggers.

---

## ✍️ Writing Effective Skills

After the frontmatter, write instructions in Markdown following a recommended structure: numbered steps with clear explanations, example commands with expected output, concrete usage examples showing user input and expected actions, and a troubleshooting section for common errors.

Be specific and actionable. Instead of "Validate the data before proceeding," write: "Run python scripts/validate.py --input filename to check data format. If validation fails, common issues include missing required fields and invalid date formats." Include error handling with specific messages, causes, and solutions.

Reference bundled resources clearly — tell Claude to consult specific reference files before performing actions. Use progressive disclosure: keep SKILL.md focused on core instructions and move detailed documentation to a references directory. For critical validations, bundle a script that performs checks programmatically rather than relying on language instructions alone. Code is deterministic; language interpretation is not.

---

## 🧪 Testing and Iteration

Effective skills testing covers three areas. Triggering tests ensure the skill loads at the right times — test that it triggers on obvious tasks and paraphrased requests, but does not trigger on unrelated topics. Functional tests verify correct outputs: valid data generated, API calls succeed, error handling works, edge cases covered. Performance comparison proves the skill improves results versus baseline by measuring tool calls, token consumption, and retry rates.

The skill-creator skill — available in Claude.ai and Claude Code — helps build and iterate on skills. It generates properly formatted SKILL.md files, suggests trigger phrases, flags common issues like vague descriptions or missing triggers, and identifies potential over- or under-triggering risks. If you have an MCP server and know your top 2-3 workflows, you can build and test a functional skill in 15-30 minutes.

Skills are living documents. Watch for under-triggering signals (skill doesn't load when it should, users manually enabling it) and over-triggering signals (skill loads for irrelevant queries, users disabling it). Adjust the description field to add more specificity or negative triggers as needed.

---

## 📦 Distribution and Sharing

Individual users install skills by downloading the folder, zipping it, and uploading to Claude.ai via Settings or placing it in the Claude Code skills directory. Organisation admins can deploy skills workspace-wide with automatic updates and centralised management. Skills are published as an open standard — portable across tools and platforms, not locked to any single vendor.

For programmatic use, the API provides direct control via the /v1/skills endpoint. Skills can be added to Messages API requests and managed through the Claude Console. This works with the Claude Agent SDK for building custom agents and automated pipelines. The API requires the Code Execution Tool beta for the secure environment skills need to run.

When positioning your skill, focus on outcomes rather than features. Instead of "a folder containing YAML frontmatter and Markdown instructions that calls our MCP server tools," say "enables teams to set up complete project workspaces in seconds instead of spending 30 minutes on manual setup." Highlight the MCP-plus-skills story: "Our MCP server gives Claude access. Our skills teach Claude your workflow. Together, they enable AI-powered project management."

---

## 🛠️ Patterns

**1. Sequential Workflow Orchestration**
Use when users need multi-step processes in a specific order. Define explicit step ordering with dependencies between steps, validation at each stage, and rollback instructions for failures. Example: customer onboarding that creates an account, sets up payment, creates a subscription, and sends a welcome email — each step depending on the previous one.

**2. Multi-MCP Coordination**
Use when workflows span multiple services. Separate the workflow into clear phases — design export from Figma, asset storage in Drive, task creation in Linear, notification in Slack. Each phase produces data the next phase consumes. Validate before moving to the next phase and centralise error handling so a failure in any service doesn't leave the workflow in an inconsistent state.

**3. Iterative Refinement**
Use when output quality improves with iteration. Generate an initial draft, run validation scripts to identify issues (missing sections, inconsistent formatting, data errors), address each issue and regenerate affected sections, then re-validate. Repeat until a quality threshold is met. Key: define explicit quality criteria and know when to stop iterating.

**4. Context-Aware Tool Selection**
Use when the same outcome requires different tools depending on context. Build a decision tree: large files go to cloud storage, collaborative documents to Notion, code files to GitHub, temporary files to local storage. Execute the appropriate MCP call based on the decision, apply service-specific metadata, and explain the choice to the user for transparency.

**5. Domain-Specific Intelligence**
Use when the skill adds specialised knowledge beyond tool access. Example: payment processing with compliance checks. Before processing, apply compliance rules (sanctions lists, jurisdiction allowances, risk assessment), document the decision, then process only if compliance passes. Maintain a comprehensive audit trail. Domain expertise embedded in logic is the key differentiator.

---

## ⚠️ Risks

- **Skill upload failures:** SKILL.md must be named exactly right (case-sensitive), YAML frontmatter needs proper --- delimiters and closed quotes, and the skill name must be kebab-case. Any deviation causes silent failure.
- **Triggering problems:** A vague description like "Helps with projects" will never trigger automatically. Missing trigger phrases mean users must manually enable the skill every time. Too-broad descriptions cause the skill to load for irrelevant queries, annoying users.
- **MCP connection issues:** If the MCP server is disconnected, authentication has expired, or tool names are incorrect, the skill loads but all MCP calls fail. Always test MCP independently first before debugging the skill.
- **Instructions not followed:** Verbose or buried instructions get ignored. Ambiguous language like "validate things properly" produces inconsistent results. For critical validations, use scripts rather than natural language. Keep instructions concise, use bullet points, and put critical steps at the top.

---

## ✅ Next Steps

1. **Read the Best Practices Guide** — Start with Anthropic's official documentation and the public skills repository at github.com/anthropics/skills for production-ready examples.
2. **Use the skill-creator** — Ask Claude "Help me build a skill using skill-creator" to generate your first draft in 15-30 minutes, then iterate from there.
3. **Test with three query types** — Run triggering tests (should trigger, should not trigger, paraphrased requests) before functional testing to catch description issues early.
4. **Host on GitHub and document** — Create a public repo with clear README, example usage, and screenshots. Link to the skill from your MCP documentation with a quick-start guide.

---

## 🔑 Close

> Build a functional skill in a single sitting. Expect 15-30 minutes to build and test your first working skill.

A skill is a folder, a SKILL.md file, and clear instructions. The progressive disclosure system means Claude loads only what it needs, when it needs it. Start with your top 2-3 use cases, write specific trigger phrases, test against paraphrased queries, and iterate based on real usage. The quick checklist: folder in kebab-case, SKILL.md with frontmatter, description includes what and when, instructions are specific and actionable, error handling included, and examples provided.

https://resources.anthropic.com/hubfs/The-Complete-Guide-to-Building-Skill-for-Claude.pdf
