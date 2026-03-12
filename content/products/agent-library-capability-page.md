# Agent Library
> AI Asset (Reusable Component). 150+ pre-built AI capabilities you can browse, deploy, and reuse. $50/month to run.

**Author:** Dipesh Trikam & Jason Moss, Insights & Analytics
**Date:** March 2026
**Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40043905712/Agent+Library

---

## 🎯 Context

The Agent Library is a governed catalogue of pre-built AI agents. Browse, deploy, and reuse instead of building from scratch. It runs on serverless Azure infrastructure at $50/month total and serves 150+ features across 50+ API endpoints. Think of it as an internal app store for AI capabilities.

**Status:** Production
**Owner:** dipesh.trikam@datacom.com

---

## 🔍 Problem

Teams across Datacom keep building the same kinds of AI agents independently. Summarisation, extraction, Q&A. Nobody knows what already exists, so the same capability gets rebuilt multiple times with no governance, no audit trail, and no reuse. Every duplicate build wastes weeks of engineering time. The Agent Library costs $50/month to run, which means one avoided rebuild pays for the platform for years.

---

## 📋 Observations

**1. What you get**
A catalogue where each agent has a defined capability, documentation, examples, and integration instructions. Browse by capability, team, or status. Deploy via the API. Submit your own agents for the organisation to reuse. Admin panel with usage analytics, audit logs, and approval workflows where moderators review agents before they go live. Serverless, so it scales automatically and costs nothing when idle.

**2. Proof it works**
Built in a 34-day sprint from project initiation to complete documentation. 150+ features across 50+ API endpoints. API response time averages 12ms. Availability: 99.9%. That represents a 400x improvement over baseline performance. Scored 8.5 out of 10 on the Azure Well-Architected Framework assessment. Dipesh Trikam authored 23 of the 27 Confluence pages documenting it.

**3. Who it's for**
Developers integrate pre-approved agents into applications through the API. Business teams deploy capabilities from the catalogue without building anything themselves. Admins and governance leads manage access, review audit trails, and monitor usage patterns. If you've built something useful, submit it through the approval workflow for the whole organisation to use.

**4. Getting started**
Browse the catalogue and search by capability, team, or status. View an agent's detail page to see what it does, its inputs and outputs, examples, and integration guide. Request access or follow the deployment instructions. Authentication through Azure AD SSO with role-based access: user, admin, or moderator.

**5. Cost**
**$50/month** total database cost across MongoDB and CosmosDB. Adding the Agent Library to the existing stack costs an extra $0-5/month. That's 70% cheaper than traditional VM-based deployment. Serverless architecture means the marginal cost of adding another agent is close to zero.

**6. Security**
Full penetration test completed. 18 findings total: all 4 HIGH-severity issues fixed, 1 of 5 MEDIUM fixed with 4 accepted as risk, 3 of 9 LOW fixed with 6 accepted as risk. CISO approval submitted December 2025. The platform handles no PII and no sensitive data. Internal users only, with every access logged.

**7. What's next**
Resolve remaining QA defects and confirm CISO approval. Broader rollout across Datacom teams. Integration with Conver so agents are accessible directly from the chat interface. Expanded templates for common use cases, self-service submission workflow, and advanced analytics including performance benchmarking and cost-per-invocation tracking.

---

## 💡 Proposal

Browse the catalogue. Find an agent. Deploy it. Or submit your own. Contact dipesh.trikam@datacom.com for access.

---

## 🔑 Close

> 150+ capabilities. $50/month. 12ms response. 99.9% uptime. Build once, use everywhere.

**Owner:** dipesh.trikam@datacom.com

*Metrics current as of March 2026. Next quarterly refresh: June 2026.*
