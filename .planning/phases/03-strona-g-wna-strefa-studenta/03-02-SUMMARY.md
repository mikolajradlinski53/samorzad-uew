---
phase: 03-strona-g-wna-strefa-studenta
plan: 02
subsystem: components
tags: [accordion, document-list, member-card, counter, motion, animation]
dependency_graph:
  requires: []
  provides:
    - Accordion — expandable list with AnimatePresence height animation
    - DocumentList — labeled document links with external icon
    - MemberCard — initials avatar person card with mailto
    - Counter — RAF animated counter with useInView(once:true)
  affects:
    - Phase 3 plans 03-04 and 03-05 (consume these components)
tech_stack:
  added:
    - motion/react AnimatePresence + motion.div for accordion height animation
    - motion/react useInView for Counter viewport detection
  patterns:
    - 'use client' on stateful components (Accordion, Counter)
    - Server Components for display-only (DocumentList, MemberCard)
    - cubic ease-out via RAF (1 - Math.pow(1 - progress, 3))
key_files:
  created:
    - components/sections/Accordion.tsx
    - components/sections/DocumentList.tsx
    - components/cards/MemberCard.tsx
    - components/ui/Counter.tsx
  modified: []
decisions:
  - AnimatePresence with initial={false} prevents entry animation on mount
  - Counter uses RAF not Framer Motion whileInView callback — matches existing script.js pattern
  - DocumentList uses inline SVG (file icon) rather than lucide-react to avoid extra import
metrics:
  duration: ~5 min
  completed: 2026-05-15
  tasks_completed: 2
  files_created: 4
  files_modified: 0
---

# Phase 3 Plan 02: Shared Interactive Components Summary

**One-liner:** Four reusable components — Accordion (AnimatePresence height), DocumentList (server, external links), MemberCard (initials avatar, mailto), Counter (RAF + useInView once:true from motion/react).

## Tasks Completed

| # | Name | Commit | Files |
|---|------|--------|-------|
| 1 | Accordion + DocumentList | 9b8af94 | components/sections/Accordion.tsx, components/sections/DocumentList.tsx |
| 2 | MemberCard + Counter | 6e10de7 | components/cards/MemberCard.tsx, components/ui/Counter.tsx |

## Verification Results

- Accordion: 'use client' present, AnimatePresence from motion/react, height animation (0 -> auto)
- DocumentList: no 'use client' (Server Component), target="_blank" rel="noopener noreferrer"
- MemberCard: no 'use client' (Server Component), initials avatar (bg-primary rounded-full), mailto link
- Counter: 'use client' present, useInView from motion/react with once:true, RAF + cubic ease-out
- npx tsc --noEmit: PASSED (0 errors)

## Deviations from Plan

None — plan executed exactly as written.

## Known Stubs

None — all components are fully wired display/interactive components with no hardcoded empty values flowing to UI.

## Self-Check: PASSED
