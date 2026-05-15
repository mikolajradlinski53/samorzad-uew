---
phase: 02-next-js-foundation
plan: 01
subsystem: foundation
tags: [next.js, tailwind, typescript, fonts, static-export]
dependency_graph:
  requires: []
  provides: [next-js-foundation, tailwind-tokens, font-css-vars, static-export-build]
  affects: [02-02, 02-03, all-subsequent-phases]
tech_stack:
  added:
    - next@14.2.35
    - react@18.3.1
    - react-dom@18.3.1
    - typescript@6.0.3
    - tailwindcss@3.4.19
    - postcss@8.x
    - autoprefixer
    - motion@12.38.0
    - lenis@1.3.23
    - react-icons@5.6.0
    - lucide-react@1.16.0
    - clsx@2.1.1
  patterns:
    - Next.js App Router static export (output: export)
    - Tailwind CSS v3 with custom design tokens
    - next/font/google CSS variable pattern
    - cn() utility via clsx
key_files:
  created:
    - next.config.js
    - tsconfig.json
    - package.json
    - postcss.config.js
    - tailwind.config.js
    - app/globals.css
    - app/layout.tsx
    - app/page.tsx
    - lib/utils.ts
    - global.d.ts
    - .gitignore
    - public/assets/logos/logo.png
  modified:
    - tsconfig.json (target: ES5 -> ES2017, deviation)
decisions:
  - Next.js 14.2.35 pinned (not 15.x) per locked decision — React 18 compatibility
  - tailwindcss@^3 pinned (not latest v4) — v4 has breaking config API
  - types/react-dom pinned to 18.3.5 — v19 types conflict with React 18
  - tsconfig target changed ES5 -> ES2017 — TypeScript 6 deprecates ES5 target
  - global.d.ts added for CSS side-effect import type declarations
metrics:
  duration: ~10 minutes
  completed_date: "2026-05-15"
  tasks_completed: 3
  files_created: 12
---

# Phase 2 Plan 1: Next.js Foundation Bootstrap — Summary

**One-liner:** Next.js 14 + Tailwind v3 project bootstrapped inside existing vanilla repo with SSUEW design tokens, Inter/Plus Jakarta Sans fonts via CSS vars, and working static export producing `/out`.

## What Was Built

This plan bootstrapped the Next.js 14 foundation for the SSUEW website migration. Starting from a plain vanilla HTML/CSS/JS repo, it installs all required packages, creates all configuration files, and wires up the font/design token system — all building to a passing `npm run build` that produces `/out/index.html`.

**Package installation:** next@14.2.35, react@18.3.1, tailwindcss@3.4.19, motion, lenis, react-icons, lucide-react, clsx, TypeScript + types.

**Configuration files:** `next.config.js` (output: export, trailingSlash, unoptimized images), `tsconfig.json` (strict, bundler resolution, @/* paths), `postcss.config.js` (tailwindcss + autoprefixer).

**Design tokens in `tailwind.config.js`:** 12 color tokens ported from Phase 1 `style.css` CSS variables — primary (#3BAEFF), ssuew-black (#1A2340), ssuew-gray-100/200/600, error, success variants. Plus font families (Inter via CSS var, Plus Jakarta Sans for display), clamp()-based display font sizes, brand radii, shadows, and maxWidth.

**Root layout (`app/layout.tsx`):** Both Google Fonts loaded via `next/font/google` with `variable:` option so CSS vars `--font-inter` and `--font-jakarta` are injected on `<html>` and Tailwind `fontFamily.sans/display` can reference them.

**Project structure:** `app/`, `components/layout/`, `components/ui/`, `data/`, `lib/`, `public/assets/logos/`, `public/assets/people/`, `public/assets/partners/`, `public/docs/` — all scaffold directories created for Phase 3+ work.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] `@types/react-dom` latest version incompatible with `@types/react@18.3.28`**
- **Found during:** Task 1
- **Issue:** `npm install @types/react-dom` resolves to v19.2.3 which requires `@types/react@^19.2.0`, conflicting with pinned `@types/react@18.3.28` (required for React 18)
- **Fix:** Pinned `@types/react-dom@18.3.5` — compatible with React 18 types
- **Files modified:** package.json (devDependencies)
- **Commit:** 1a99645

**2. [Rule 3 - Blocking] Missing CSS module type declarations caused TypeScript build failure**
- **Found during:** Task 3
- **Issue:** TypeScript strict mode in `app/layout.tsx` rejected `import './globals.css'` and `import 'lenis/dist/lenis.css'` as side-effect imports with no type declarations: "Cannot find module or type declarations for side-effect import"
- **Fix:** Created `global.d.ts` with `declare module '*.css'` — standard pattern for CSS side-effect imports in strict TypeScript
- **Files modified:** global.d.ts (created)
- **Commit:** 2b50e86

**3. [Rule 1 - Bug] TypeScript 6 deprecates `target: "es5"` in tsconfig**
- **Found during:** Task 3 (second build attempt)
- **Issue:** The plan specified `"target": "es5"` but the installed TypeScript is v6.0.3 which deprecates ES5 target and throws a type error during `npm run build`
- **Fix:** Changed target to `"ES2017"` — minimum target supported by all modern browsers and not deprecated in TypeScript 6
- **Files modified:** tsconfig.json
- **Commit:** 2b50e86

## Known Stubs

- `app/page.tsx`: Placeholder content ("Strona Główna — treść wkrótce") — intentional, real homepage content is Phase 3-4 scope per plan design
- `components/layout/`: Directory scaffolded but empty — Navbar, Footer, LenisProvider are Plan 02-02 scope per plan note ("LenisProvider and Navbar/Footer are NOT wired here yet")

These stubs are intentional per plan specification. They do not prevent the plan's goal (working build + design token foundation) from being achieved.

## Self-Check

- [x] `out/index.html` exists
- [x] tailwind.config.js ssuew-black = #1A2340
- [x] tailwindcss version = 3.4.19 (v3, not v4)
- [x] next.config.js output = 'export'
- [x] app/layout.tsx has Plus_Jakarta_Sans and Inter with variable: option
- [x] lib/utils.ts exports cn()
- [x] Commits 1a99645, f853a15, 2b50e86 exist

## Self-Check: PASSED
