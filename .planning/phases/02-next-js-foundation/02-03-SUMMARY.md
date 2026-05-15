---
plan: 02-03
phase: 02-next-js-foundation
status: complete
self_check: PASSED
---

## Summary

Wired complete root layout with LenisProvider, Navbar, Footer. Added FadeUp and Button animation primitives.

## Tasks Completed

| Task | Status | Commit |
|------|--------|--------|
| Task 1: LenisProvider + FadeUp + Button | ✓ | 491fb4b |
| Task 2: Wire root layout + final build | ✓ | b60fb9d |

## Key Files Created/Modified

- `components/layout/LenisProvider.tsx` — ReactLenis root, duration:1.2, syncTouch:false
- `components/ui/FadeUp.tsx` — 'use client', motion/react whileInView, useReducedMotion passthrough
- `components/ui/Button.tsx` — primary/outline variants, default/sm sizes
- `app/layout.tsx` — LenisProvider > Navbar > main#main-content > Footer, lenis CSS import

## Verification

- `npx tsc --noEmit` → exits 0
- `npm run build` → exits 0, /out/index.html generated
- `grep "ReactLenis" LenisProvider.tsx` → match (lenis/react)
- `grep "useReducedMotion" FadeUp.tsx` → match
- `grep "once: true" FadeUp.tsx` → match
- `grep "LenisProvider|Navbar|Footer" layout.tsx` → all 3 present
- `grep "Kamienna" out/index.html` → Footer address in built HTML ✓
- `grep "tiktok.com" out/index.html` → social links in built HTML ✓

## Requirements Addressed

- ANIM-01: Framer Motion fade-in-up (FadeUp component) ✓
- ANIM-02: prefers-reduced-motion → static passthrough ✓
- ANIM-03: Lenis smooth scroll (ReactLenis root) ✓
