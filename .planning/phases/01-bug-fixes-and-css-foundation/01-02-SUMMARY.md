---
phase: 01-bug-fixes-and-css-foundation
plan: "02"
subsystem: navigation
tags: [bug-fix, navbar, subpage, links, mobile-menu]
dependency_graph:
  requires: []
  provides: [correct-subpage-nav-links]
  affects: [aktualnosci.html, wydarzenia.html, zarzad.html, projekty.html, strefa-studenta.html]
tech_stack:
  added: []
  patterns: [index.html#section-id anchor links]
key_files:
  created: []
  modified:
    - aktualnosci.html
    - wydarzenia.html
    - zarzad.html
    - projekty.html
    - strefa-studenta.html
decisions:
  - "Use index.html#section-id for all 5 section-targeted nav links instead of bare page filenames — ensures users always land on the correct homepage section regardless of which subpage they navigate from"
metrics:
  duration: 2 minutes
  completed: "2026-05-15T07:49:10Z"
  tasks_completed: 1
  tasks_total: 1
  files_changed: 5
---

# Phase 1 Plan 2: Subpage Navigation Link Fix Summary

**One-liner:** Fixed all 5 subpage navbar and mobile-menu links to use `index.html#section-id` anchors instead of bare page filenames, ensuring correct section-targeted navigation from any subpage.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Update nav links in all 5 subpages to use index.html#section anchors | d81a58b | aktualnosci.html, wydarzenia.html, zarzad.html, projekty.html, strefa-studenta.html |

## What Was Done

All 5 subpage HTML files had identical broken navbar patterns where section-targeted links used bare page filenames (`aktualnosci.html`, `wydarzenia.html`, etc.) instead of `index.html#section-id` anchors. This caused users navigating from any subpage to be sent to the top of the target subpage rather than to the correct section on the homepage.

Both the desktop `.navbar-links` `<ul>` block and the `.mobile-menu` `<div>` block were updated in each file.

**Replacements applied (per file, both nav blocks):**

| Old href | New href |
|----------|----------|
| `aktualnosci.html` | `index.html#aktualnosci` |
| `wydarzenia.html` | `index.html#wydarzenia` |
| `zarzad.html` | `index.html#zarzad` |
| `strefa-studenta.html` | `index.html#strefa` |
| `projekty.html` | `index.html#projekty` |
| `index.html#kontakt` | unchanged (already correct) |

The `.navbar-logo` `href="index.html"` link was not touched.

## Verification Results

- `grep -c 'index.html#aktualnosci|...' aktualnosci.html` — returned 10 (5 sections x 2 nav blocks)
- Each per-file anchor check returned exactly 2 results (one desktop, one mobile)
- Overall cross-file check for bare page hrefs in nav elements returned 0 results (PASS)

## Deviations from Plan

None — plan executed exactly as written.

## Known Stubs

None — this plan only modifies href attributes in navigation elements.

## Self-Check

- [x] All 5 modified files exist and were committed
- [x] Commit d81a58b exists in git log
- [x] No bare page hrefs remain in nav elements across all 5 subpages
