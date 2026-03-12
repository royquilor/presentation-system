# Presentation Markdown Cheat Sheet

Write markdown files that convert into Datacom-branded interactive presentations.
Drop your `.md` file into `content/presentations/` and it appears at `/p/your-file-name`.

---

## Template

```markdown
# Your Presentation Title
> One-line subtitle describing the topic

**Date:** March 2026
**Source:** https://link-to-original-document

---

## 🎯 Context

Background paragraph explaining the situation. Keep to 2-3 sentences.
This becomes one full-screen slide.

---

## 🔍 Problem

Describe the core problem in 2-3 sentences. This also becomes
one full-screen slide.

---

## 📋 Observations

**1. First observation title**
Body text for the first observation. Each numbered observation
becomes its own slide.

**2. Second observation title**
Body text. Keep observations to one paragraph each.

**3. Third observation title**
More body text. Aim for 3-8 observations.

---

## 💡 Proposal

Opening paragraph of the proposal.

- First key action or recommendation
- Second key action
- Third key action

*Summary statement in italics becomes the slide footer.*

---

## ⚠️ Risks

- **Risk title one:** Description of the risk and mitigation.
- **Risk title two:** Another risk with its context.
- **Risk title three:** Keep to 3-5 risks.

---

## ✅ Next Steps

1. **Step label** — Description of what this step involves.
2. **Second step** — Keep descriptions to one sentence.
3. **Third step** — Aim for 3-5 steps.

---

## 🔑 Close

> The key takeaway statement. This is the closing observation.

Final paragraph providing context for what comes next.
```

---

## Rules

| Rule | Detail |
|---|---|
| **Title** | `# Title` on line 1 — becomes the H1 on the title slide |
| **Subtitle** | `> Subtitle` immediately after — shown below the title |
| **Date** | `**Date:** value` — shown on the title slide |
| **Source** | `**Source:** URL` — becomes the "Full report" link on the close slide |
| **Section headers** | Must use `## ` + emoji prefix (🎯, 🔍, 📋, 💡, ⚠️, ✅, 🔑) |
| **Observations** | Each starts with `**N. Title**` on its own line |
| **Proposal bullets** | Start lines with `- ` or `* ` |
| **Proposal summary** | Wrap in `*italics*` — shown as footer text |
| **Risks** | Start with `- **Title:** Body` or `**Title**` + body on next line |
| **Next steps** | Start with `N. **Label** — Description` |
| **Closer quote** | Start with `> ` — becomes the closing heading |
| **Separators** | Use `---` between sections (optional but recommended) |

---

## How many slides does each section produce?

| Section | Slides |
|---|---|
| Title | 1 (always) |
| Context | 1 |
| Problem | 1 |
| Observations | 1 per observation (3-8 recommended) |
| Proposal | 1 |
| Risks | 1 |
| Next Steps | 1 |
| Close | 1 (always) |
| **Total** | **~10-14 slides typical** |

---

## Datacom Brand Typography Reference

Per the Endeavour Design System:

| Style | Size | Weight | Line Height | Spacing |
|---|---|---|---|---|
| **H1** | 64px | 700 | 80px | -0.5px |
| **H2** | 48px | 700 | 64px | -0.5px |
| **H3** | 40px | 700 | 48px | -0.5px |
| **H4** | 32px | 700 | 40px | -0.5px |
| **H5** | 24px | 600 | 32px | -0.5px |
| **H6** | 14px | 700 | 24px | -0.2px |
| **Body** | 16px | 400 | 24px | -0.2px |

Mobile breakpoint (≤500px):

| Style | Size | Weight | Line Height |
|---|---|---|---|
| **H1** | 40px | 700 | 48px |
| **H2** | 32px | 700 | 40px |
| **H3** | 28px | 700 | 36px |
| **H4** | 24px | 700 | 32px |
| **H5** | 20px | 600 | 28px |

Font: **Montserrat** (weights 300, 400, 500, 600, 700)

---

## Datacom Brand Colours

| Token | Hex | Usage |
|---|---|---|
| Electric Blue | `#002BFE` | Primary / interactive |
| Admiral Blue | `#00167F` | Headers / dark accents |
| Midnight Blue | `#000A14` | Dark backgrounds |
| Candy Pink | `#FF0070` | Accent |
| White | `#FFFFFF` | Light backgrounds / dark text inverse |
| Light Blue | `#80A0F8` | Dark mode primary |
| Grey 100 | `#F0F0F0` | Muted backgrounds |
| Grey 200 | `#DADADA` | Borders |
| Grey 300 | `#999999` | Muted text |
| Grey 400 | `#666666` | Secondary text |
| Grey 500 | `#333333` | Body text |
| Error | `#C80000` | Error states |
| Warning | `#785816` | Warning states |
| Success | `#33913A` | Success states |
| Info | `#0022CB` | Info states |

---

## Spacing Scale (8px grid)

| Token | Value |
|---|---|
| `--dc-padding-01` | 4px |
| `--dc-padding-02` | 8px |
| `--dc-padding-03` | 12px |
| `--dc-padding-04` | 16px |
| `--dc-padding-05` | 24px |
| `--dc-padding-06` | 32px |
| `--dc-padding-07` | 40px |

---

## Accessibility

Per Endeavour Design System:
- All text meets WCAG 2.1 AA contrast (4.5:1 standard, 3:1 large)
- Keyboard navigation: arrow keys for slides, tab for interactive elements
- Focus indicators on all interactive elements
- Never use colour alone to convey information
- Icons: 24px interface, 80px display (desktop); 20px / 64px (mobile)
- Icon style: light outline, rounded edges, stroke weight 2pt at 24px

---

## Quick Example

A minimal working presentation:

```markdown
# Quarterly Review
> Q1 2026 performance summary

**Date:** March 2026

---

## 🎯 Context

We set three goals for Q1: increase adoption, reduce costs, improve reliability.

---

## 🔍 Problem

Adoption plateaued at 45% in February despite training investment.

---

## 📋 Observations

**1. Power users drive most of the value**
The top 20% of users account for 80% of productivity gains.

**2. Onboarding friction is the primary barrier**
New users report the first 15 minutes as confusing.

**3. Mobile access is limited**
35% of staff primarily work from mobile devices.

---

## 💡 Proposal

Redesign the onboarding flow and launch a mobile-first experience.

- Simplify first-run experience to under 5 minutes
- Launch responsive mobile interface by end of Q2
- Create role-specific quick-start guides

*Targeting 70% adoption by end of Q2.*

---

## ⚠️ Risks

- **Development capacity:** Mobile work competes with security backlog.
- **Adoption fatigue:** Too many changes may frustrate existing users.

---

## ✅ Next Steps

1. **User research sprint** — Interview 20 users across 4 teams this week.
2. **Mobile prototype** — Ship clickable prototype by April 15.
3. **Onboarding redesign** — A/B test new flow with pilot group.

---

## 🔑 Close

> The biggest lever for ROI is getting more people using what we've already built.

Focus Q2 on adoption — not features.
```

This produces a ~12-slide presentation with Datacom branding, keyboard navigation, and light/dark mode.
