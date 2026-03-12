# Agent Library Admin Panel – Mobile Responsiveness Test Plan

> A Tier 3 smoke test plan verifying that all four Agent Library admin management pages render and behave correctly across mobile, tablet, and desktop viewport breakpoints.

**Author:** [Kieran Sinclair](https://datacomgroup.atlassian.net/wiki/people/712020:d27c0be8-1ddb-42c4-bb80-4fc81b65bb0d)
**Date:** 25 February 2026
**Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40469135533

---

## 🎯 Context

The Agent Library admin panel (Insights & Analytics, QA & Testing workstream) received UI and layout improvements across its four core management pages: Agent Management, Prompt Management, User Management, and Category Management. This plan, classified as Tier 3 (low-risk visual verification), was authored by Kieran Sinclair to confirm responsive behaviour before sign-off.

---

## 🔍 Problem

Internal admin tools are increasingly accessed on tablets and occasionally on mobile devices. Without structured responsiveness testing, layout regressions — such as overflowing content, inaccessible buttons, or illegible tables — may go unnoticed and degrade usability for admins working away from a desktop.

---

## 📋 Observations

- **Three test viewports:** Mobile 375×667 (iPhone SE), Tablet 768×1024 (iPad), Desktop 1920×1080 — tested in Chrome with DevTools Device Toolbar.
- **Mobile layout requirements:** Stat cards stack vertically (1 column), grids collapse to 1 column, tables become horizontally scrollable, buttons must be touch-friendly, and no unwanted horizontal page overflow.
- **Tablet layout requirements:** Stat cards display in a row, grids show 2–3 columns, icons sit left of text, and tables are full-width with minimal or no scrolling.
- **Known issue — mobile menu:** The bottom navigation button (Settings) is cut off in mobile portrait view because the menu is not scrollable; flagged as a defect during testing.
- **Known issue — mobile audit log format:** The card-based layout for audit logs on mobile (vs. tabular on desktop) was flagged as potentially suboptimal and worth design review.
- **Known issue — tablet audit log:** Action word placement and highlighting in the audit logs tab appears untidy at the 768px breakpoint.
- **Page-specific rules verified:** On Prompt Management, the "Withdrawn" stat card must be centred; on User Management, only 3 stat cards should appear ("New This Week" must be absent).
- **Orientation and touch tests** (landscape rotation, modal open, table swipe) were conducted on one representative page (Agent Management) and passed.

---

## 💡 Proposal

Apply a quick, structured smoke test (~10–15 minutes total) by cycling through all 4 management pages at each of the 3 viewport sizes using Chrome DevTools, ticking off a checklist for stat cards, grid layout, table behaviour, and touch interactions. Page-specific edge cases (Withdrawn card centering, missing New This Week card) are verified as discrete checks, and orientation change and touch interaction tests are spot-checked on one representative page to keep scope manageable.

---

## ⚠️ Risks

- **Mobile menu truncation** (Settings button cut off) is an identified defect that requires a fix before mobile use can be considered fully supported.
- **Card-based audit log UX on mobile** may not be the optimal pattern — this is flagged for design consideration but is not a blocking defect.
- **Chrome-only coverage:** No cross-browser testing was performed; Safari on iOS (the most common real mobile browser) is untested.
- **No deep accessibility testing:** Colour contrast and screen reader behaviour are explicitly out of scope for Tier 3.
- **Dialogs not exhaustively tested:** Only spot-check of modals was performed; edge-case modal layouts on smaller viewports may contain issues.

---

## ✅ Next Steps

- **Fix:** Resolve the mobile navigation menu truncation (Settings button cut off in portrait) before next mobile-facing release.
- **Design review:** Evaluate whether card-based vs. tabular layout for audit logs on mobile provides better usability — update the layout if warranted.
- **Design review:** Clean up action word placement and highlighting in the audit log tab at the tablet breakpoint.
- **Browser coverage:** Add a Safari/iOS test pass for the most critical pages (Agent Management, User Management) in a future test cycle.
- **Regression baseline:** Capture screenshots at all three breakpoints for each page as a visual regression baseline for future releases.

---

## 🔑 Close

The admin panel is largely responsive across the three tested viewports, with the mobile navigation truncation being the key blocking issue that must be resolved before the mobile experience can be signed off as production-ready.

---

📌 **Document Type:** Test Plan (Tier 3 Smoke Test)
📅 **Last Updated:** 25 February 2026
🔗 **Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40469135533
