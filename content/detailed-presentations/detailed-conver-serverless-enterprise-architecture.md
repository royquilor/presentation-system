# Conver Serverless Enterprise Architecture and Development Strategy

> Enterprise architecture and development strategy for AI workloads — trunk-based development, feature flags, and CI/CD to eliminate merge hell and enable safe deployments

**Author:** [Dipesh Trikam](https://datacomgroup.atlassian.net/wiki/people/557058:e9d25d3a-2620-4614-b9ff-ee3ec2eb3a1b)
**Date:** 3 December 2025
**Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40486469753

---

## 🎯 Context

Recent production incidents have occurred due to the current branching strategy. This documentation provides the path to eliminate long-lived branches, ship safely with feature flags, automate deployments with proper gates, and enable fast rollback. The strategy targets Azure Container Apps for AI workloads and is marked as Priority — Implementation for End of Year.

---

## 🔍 Problem

The current branching strategy causes merge conflicts, broken builds, accidental releases, slow rollbacks, and no visibility into feature state. Long-lived branches diverge, causing painful merges. Features can accidentally reach production before ready. Rebuilding for each environment causes binary divergence. Rollbacks require reverting code and rebuilding.

---

## 📋 Observations

**1. Implementation Timeline — 5-week phased rollout**
| Week | Focus | Key Deliverable |
|------|-------|-----------------|
| 1 | Foundation | Feature flag system, vertical slicing training |
| 2 | CI/CD | Automated tests on PRs, branch protection |
| 3 | Cleanup | Delete old branches, enforce daily merges |
| 4 | Rollout | Auto-deploy to prod, PO flag training |
| 5+ | Improve | Metrics review, continuous improvement |

**2. Key Success Metrics (exact targets)**
| Metric | Target |
|--------|--------|
| PR Merge Time | < 24 hours |
| Long-lived Branches | Zero |
| Flag Cleanup Time | < 8 weeks after feature completion |
| Deployment Frequency | Daily |
| Change Failure Rate | < 5% |

**3. Feature flag rollback times**
- Feature bug: Toggle flag OFF — **< 1 minute**
- Code bug: Redeploy previous image — **< 5 minutes**

**4. Feature flag implementation — local, no third-party tools**
Uses a local implementation (no Unleash or similar). Code pattern: `if (featureFlags.isEnabled(ConverFlags.AgentChaining)) { return <NewFeature />; } return <LegacyFeature />;` — chosen for no procurement delays, full control, no external dependencies, and immediate operation.

**5. Document conventions**
- Code examples in **TypeScript**
- Branch names: `feature/DAAAT-{ticket}-{description}`
- Flag names: `FEATURE_{CATEGORY}_{NAME}`

**6. Five key concerns addressed with solutions**
- **Accidental Releases:** All new features wrapped in feature flags; code deploys but features stay hidden until explicitly enabled
- **Merge Conflicts:** Daily merges to main, small PRs, vertical slicing of features
- **"Works in UAT, Fails in Prod":** Build once, promote the same Docker image through all environments
- **Slow Rollbacks:** Feature flag toggle or redeploy previous image (see Observation 3)
- **No Visibility:** Feature Flag Registry in Confluence with owners, dates, and status

**7. Core documentation set**
Includes Trunk-Based Development Strategy, Feature Flags Best Practices, Feature Flag Registry, Artifact Promotion Strategy, Serverless Architecture Proposal, Environment Strategy, Configuration Management (Azure App Configuration and Key Vault), and Governance and Compliance (RBAC, data sovereignty, audit).

**8. Version and status**
Version 1.0.0, Last Updated 3 December 2025, Status: Priority — Implementation for End of Year.

---

## 💡 Proposal

Implement trunk-based development with feature flags and CI/CD to eliminate merge hell and enable safe, frequent deployments.

- Eliminate long-lived branches — no more merge hell
- Ship safely with feature flags — deploy without releasing
- Automate deployments — CI/CD with proper gates
- Enable fast rollback — minutes, not hours

*The strategy provides a complete path from foundation through rollout, with explicit success metrics and a local feature-flag approach that avoids procurement delays.*

---

## ⚠️ Risks

- **TBD Implementation Checklist not yet defined:** The document references a "TBD Implementation Checklist" as the start point for step-by-step rollout addressing recent production incidents — this may delay execution if not finalised.
- **Adoption resistance:** Enforcing daily merges and deleting old branches may face pushback from teams accustomed to long-lived branches.
- **Flag cleanup discipline:** The < 8 weeks flag cleanup target requires ongoing discipline; flags may accumulate if not enforced.

---

## ✅ Next Steps

1. **TBD Implementation Checklist** — Finalise and publish the step-by-step rollout plan addressing recent production incidents
2. **Week 1 Foundation** — Implement feature flag system and conduct vertical slicing training
3. **Week 2 CI/CD** — Enable automated tests on PRs and configure branch protection
4. **Week 3 Cleanup** — Delete old branches and enforce daily merges
5. **Week 4 Rollout** — Enable auto-deploy to prod and conduct PO flag training

---

## 🔑 Close

> Eliminate long-lived branches, ship safely with feature flags, and enable rollback in minutes — not hours.

The documentation provides a complete enterprise architecture and development strategy for Conver's AI workloads, with explicit success metrics (PR merge < 24 hours, zero long-lived branches, daily deployments, < 5% change failure rate) and a phased 5-week implementation timeline. The local feature-flag approach avoids procurement delays while maintaining full control.
