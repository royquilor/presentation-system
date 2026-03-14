# `/p` Page Alignment Notes

Updated `components/presentation-gallery.tsx` to improve layout alignment on `localhost/p`.

## What changed

- Centered the category/tag filter row:
  - `mb-10 flex flex-wrap items-center justify-center gap-2`
- Centered the cards as fixed-width rows:
  - Cards container: `grid gap-3 justify-items-center`
  - Card link: `w-full max-w-4xl ...`
- Left-aligned the summary text to the same left edge as cards:
  - `mx-auto mb-6 w-full max-w-4xl text-left text-sm text-foreground/40`

## Why

This keeps the page header visually centered while ensuring card rows are centered consistently and the summary line aligns exactly with the card content edge.
