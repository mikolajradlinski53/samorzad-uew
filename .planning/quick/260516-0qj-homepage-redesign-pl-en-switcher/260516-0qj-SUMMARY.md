---
phase: quick
plan: 260516-0qj
subsystem: homepage, i18n
tags: [homepage, i18n, sections, navbar, react-context]
dependency_graph:
  requires: []
  provides: [LangProvider, useT, LangToggle, NewsSection, ProjectsPreview, TeamPreview, ContactSection]
  affects: [app/layout.tsx, components/layout/Navbar.tsx, app/(public)/page.tsx]
tech_stack:
  added: [lib/i18n.tsx, lib/translations/pl.ts, lib/translations/en.ts, LangToggle]
  patterns: [React Context for i18n with localStorage persistence, Server component sections with FadeUp client boundary]
key_files:
  created:
    - lib/i18n.tsx
    - lib/translations/pl.ts
    - lib/translations/en.ts
    - components/layout/LangToggle.tsx
    - components/sections/NewsSection.tsx
    - components/sections/ProjectsPreview.tsx
    - components/sections/TeamPreview.tsx
    - components/sections/ContactSection.tsx
  modified:
    - app/(public)/page.tsx
    - app/layout.tsx
    - components/layout/Navbar.tsx
decisions:
  - "i18n uses React context with useEffect localStorage init to avoid SSR mismatch — state initialises to 'pl', then hydrates from localStorage after mount"
  - "NewsSection and section titles are hardcoded Polish (server components) — useT() reserved for components that need runtime switching"
  - "LangToggle placed as last item in desktop nav gap-6 flex, and below nav items in mobile drawer with pt-2 border-t separator"
metrics:
  duration: ~20 min
  completed: 2026-05-15
  tasks: 2
  files: 11
---

# Phase quick Plan 260516-0qj: Homepage Redesign + PL/EN Switcher Summary

**One-liner:** React context i18n with localStorage persistence plus 4 new homepage sections (News, Projects Preview, Team Preview, Contact).

## Tasks Completed

| # | Task | Commit | Files |
|---|------|--------|-------|
| 1 | Create i18n system (context + translations + LangToggle) | aae22b5 | lib/i18n.tsx, lib/translations/pl.ts, lib/translations/en.ts, components/layout/LangToggle.tsx |
| 2 | Build 4 homepage sections + update page.tsx, layout.tsx, Navbar | 8b56655 | 7 files (4 new sections, page.tsx, layout.tsx, Navbar.tsx) |

## What Was Built

**i18n system:**
- `lib/i18n.tsx` — `LangProvider` (React context) + `useT()` hook. State initialises to `'pl'`, reads localStorage in `useEffect` to avoid SSR hydration mismatch. `setLang` writes to localStorage on every change.
- `lib/translations/pl.ts` + `lib/translations/en.ts` — 20+ keys covering nav, news, projects, team, and contact sections.
- `components/layout/LangToggle.tsx` — compact PL/EN buttons, active lang gets `text-primary font-bold`, inactive gets `text-ssuew-gray-600 hover:text-primary`.

**Homepage sections (server components):**
- `NewsSection` — 4 static news cards in `sm:grid-cols-2` grid, `bg-ssuew-gray-100`, tag badge + date + title + excerpt + "Czytaj więcej" link.
- `ProjectsPreview` — first 4 from `data/projekty.ts` via `ProjectCard` wrapped in `FadeUp`, `bg-white`.
- `TeamPreview` — all 4 `prezydium` members via `MemberCard` wrapped in `FadeUp`, `bg-ssuew-gray-100`.
- `ContactSection` — two-column layout: address block + email on left, primary-light CTA card with Link to `/formularz` on right, `bg-white`.

**Integrations:**
- `app/layout.tsx` — `LangProvider` wraps `LenisProvider` (outermost, so all client components have access).
- `Navbar.tsx` — `LangToggle` added to desktop nav (`hidden md:flex` row) and mobile drawer (bottom with `border-t` separator).
- `app/(public)/page.tsx` — 7 sections rendered in order: Hero, Stats, About, News, Projects, Team, Contact.

## Deviations from Plan

None — plan executed exactly as written.

## Known Stubs

| File | Lines | Stub | Reason |
|------|-------|------|--------|
| components/sections/NewsSection.tsx | 57, 65 | `href="#"` on news card links and "Wszystkie aktualności →" | No Next.js `/aktualnosci` route exists yet. Stubs are intentional; will be resolved when the news route is built in a future plan. |

The stubs do not prevent the plan's goal from being achieved — news cards are visible, styled, and navigable (they remain on the same page). Content goal is met.

## Verification

- `npx tsc --noEmit` — passes with zero errors
- `npx next build` — completed successfully, all 7 homepage sections in output
- Auto-approved checkpoint: all 7 sections built, PL/EN toggle in Navbar desktop and mobile, localStorage persistence wired

## Self-Check: PASSED

All 8 created files confirmed present on disk. Both task commits (aae22b5, 8b56655) confirmed in git log.
