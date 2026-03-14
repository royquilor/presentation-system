# Agent Library Admin Panel – Mobile Responsiveness Test Plan

> A Tier 3 smoke test plan verifying that all four Agent Library admin management pages render and behave correctly across mobile, tablet, and desktop viewport breakpoints.

**Author:** Kieran Sinclair
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

**1. Test Environment Setup**

Chrome with Device Toolbar enabled (Dev Tools → Toggle Device Toolbar). Admin account with access to all 4 management pages. Ensure each page has existing data (agents, prompts, users, categories) so grids and tables display.

**2. Breakpoint Requirements — Mobile (375×667)**

Stat cards stack vertically (1 column). Icons display above text, centered. Grid layout shows 1 column. Table is horizontally scrollable (swipe left/right works). Buttons are touch-friendly. No horizontal page overflow except table. Dialogs display full-width and readable.

**3. Breakpoint Requirements — Tablet (768×1024)**

Stat cards display horizontally (row layout). Grid layout shows 2–3 columns. Icons positioned left of text. Table is full-width with minimal or no scrolling.

**4. Breakpoint Requirements — Desktop (1920×1080)**

Stat cards display horizontally. Grid layout shows 3–5 columns. Icons positioned left of text. Table is full-width with no scrolling.

**5. Mobile Defect — Navigation Truncation**

The bottom button (Settings) is cut off in mobile portrait because the menu buttons are not scrollable. This is a blocking defect for mobile sign-off.

**6. Mobile Design Consideration — Audit Logs**

Card-based layout for audit logs on mobile (vs. tabular on desktop) may not be the best option; worth design review.

**7. Tablet Defect — Audit Log Styling**

Action word placement and highlighting in the audit logs tab appears tatty at the 768px breakpoint.

**8. Page-Specific — Prompt Management**

"Withdrawn" stat card must be centered on all viewports (mobile, tablet, desktop).

**9. Page-Specific — User Management**

Only 3 stat cards display: Total Users, Administrators, Regular Users. "New This Week" card must NOT be present on any viewport.

**10. Orientation and Touch Tests**

Rotate device portrait to landscape — layout adapts without breaking. Tap "Add New Agent" — modal opens smoothly. Tap table row — selection works. Swipe table horizontally — scrolls smoothly.

---

## 💡 Proposal

Apply a structured smoke test (~10–15 minutes total) by cycling through all 4 management pages at each of 3 viewport sizes using Chrome DevTools. Tick off a checklist for stat cards, grid layout, table behaviour, and touch interactions. Page-specific edge cases (Withdrawn card centering, missing New This Week card) are verified as discrete checks. Orientation and touch tests are spot-checked on one representative page (e.g., Agent Management) to keep scope manageable.

---

## 📐 Flex: Breakpoints

**1. Mobile (375×667)**

Test: Resize to 375×667. Expected: Stat cards 1 column, grids 1 column, table scrollable, icons above text. Pass: layout matches. Fail: multi-column, overflow, or wrong icon placement.

**2. Tablet (768×1024)**

Test: Resize to 768×1024. Expected: Stat cards row, grids 2–3 columns, icons left of text, table full-width. Pass: layout matches. Fail: wrong column count, scroll required, or icons misaligned.

**3. Desktop (1920×1080)**

Test: Resize to 1920×1080. Expected: Stat cards row, grids 3–5 columns, table full-width. Pass: layout matches. Fail: cramped layout or misaligned elements.

---

## 📐 Flex: Touch Targets

**1. Button Size**

Test: Inspect primary actions (Add New Agent, etc.) on mobile. Expected: Buttons visually large enough to tap (~44px minimum). Pass: no tiny buttons. Fail: buttons under effective 44px.

**2. Table Row Selection**

Test: Tap a table row on mobile. Expected: Row selects. Pass: selection works. Fail: tap does nothing or wrong row selected.

**3. Table Horizontal Scroll**

Test: Swipe table horizontally on mobile. Expected: Smooth scroll. Pass: scroll works. Fail: no scroll or janky behaviour.

---

## 📐 Flex: Navigation

**1. Menu Visibility**

Test: Open navigation on mobile portrait. Expected: All items visible and reachable. Pass: Settings and others accessible. Fail: Settings cut off (current defect).

**2. Orientation Change**

Test: Rotate device portrait to landscape. Expected: Layout adapts without breaking. Pass: no content clipped. Fail: layout breaks or content cut off.

---

## 📐 Flex: Forms and Modals

**1. Add New Agent Modal**

Test: Tap "Add New Agent" on mobile. Expected: Modal opens, full-width, readable. Pass: modal displays correctly. Fail: modal clipped or illegible.

**2. Other Dialogs**

Test: Spot-check other dialogs (e.g., edit, delete confirm). Expected: Readable on mobile. Pass: content visible. Fail: overflow or unreadable text.

---

## 📐 Flex: Tables

**1. Mobile Table Scroll**

Test: View table on 375×667. Expected: Horizontal scroll works via swipe. Pass: swipe scrolls. Fail: no scroll or vertical overflow.

**2. Tablet/Desktop Table**

Test: View table on 768 and 1920. Expected: Full-width, no horizontal scroll. Pass: fits viewport. Fail: requires horizontal scroll.

---

## 📐 Flex: Stat Cards

**1. Mobile Stat Cards**

Test: View stat cards on mobile. Expected: Vertical stack, icons above text, centered. Pass: 1 column layout. Fail: side-by-side or icons wrong position.

**2. Tablet/Desktop Stat Cards**

Test: View stat cards on tablet and desktop. Expected: Horizontal row, icons left of text. Pass: row layout. Fail: stacked or misaligned.

---

## 📐 Flex: Page-Specific Checks

**1. Prompt Management — Withdrawn Card**

Test: View Prompt Management at all viewports. Expected: "Withdrawn" stat card centered. Pass: centered. Fail: left-aligned.

**2. User Management — Card Count**

Test: View User Management at all viewports. Expected: Exactly 3 cards (Total Users, Administrators, Regular Users). Pass: 3 cards, no "New This Week". Fail: 4 cards or wrong set.

---

## ⚠️ Risks

**Mobile menu truncation** Settings button cut off in portrait; menu not scrollable. Requires fix before mobile sign-off.

**Card-based audit log UX** May not be optimal on mobile; flagged for design review but not blocking.

**Chrome-only coverage** Safari on iOS (common real mobile browser) is untested.

**No deep accessibility** Colour contrast and screen reader behaviour are out of scope for Tier 3.

**Dialogs not exhaustively tested** Spot-check only; edge-case modal layouts may contain issues.

---

## ✅ Next Steps

1. **Fix mobile navigation** — Resolve menu truncation (Settings cut off) before next mobile-facing release.
2. **Design review — audit log format** — Evaluate card-based vs. tabular layout for mobile audit logs; update if warranted.
3. **Design review — tablet audit log** — Clean up action word placement and highlighting at 768px breakpoint.
4. **Browser coverage** — Add Safari/iOS test pass for Agent Management and User Management in a future cycle.
5. **Regression baseline** — Capture screenshots at all three breakpoints for each page as visual regression baseline.

---

## 🔑 Close

> The admin panel is largely responsive across the three tested viewports, with the mobile navigation truncation being the key blocking issue that must be resolved before the mobile experience can be signed off as production-ready.

---

📌 **Document Type:** Test Plan (Tier 3 Smoke Test)
📅 **Last Updated:** 25 February 2026
🔗 **Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40469135533
