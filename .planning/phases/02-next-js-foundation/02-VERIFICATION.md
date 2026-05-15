---
phase: 02-next-js-foundation
verified: 2026-05-15T12:00:00Z
status: human_needed
score: 14/15 must-haves verified
human_verification:
  - test: "Open the site in a browser, scroll down — observe smooth inertia/physics scrolling (not browser-native instant scroll)"
    expected: "Scroll feels weighted and decelerates smoothly, controlled by Lenis duration 1.2s"
    why_human: "Cannot test scroll physics programmatically from static HTML; requires browser interaction"
  - test: "Resize to mobile viewport (<768px), click hamburger — verify drawer slides down with animation; click a dropdown item — verify accordion expands"
    expected: "Drawer slides in with height 0→auto animation; accordion submenus expand inline; Escape key closes menu"
    why_human: "AnimatePresence/motion.div behavior requires JavaScript execution in real browser"
  - test: "Enable prefers-reduced-motion in browser/OS settings; add a <FadeUp> to any page and view it"
    expected: "Content renders as a plain div without any opacity/translate animation"
    why_human: "FadeUp is tree-shaken (not used on any page yet); reduced-motion bypass needs visual confirmation once a content page uses it"
---

# Phase 2: Next.js Foundation Verification Report

**Phase Goal:** Next.js 14 project running with design system, core layouts (Navbar/Footer with real data), Framer Motion scroll animations, Lenis smooth scroll — ready for building all content pages
**Verified:** 2026-05-15
**Status:** human_needed — all automated checks passed; 3 behavioral items need browser confirmation
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | `npm run build` completes without errors and produces `/out` directory | VERIFIED | `out/index.html`, `out/_next/static/css/27248abc749ef993.css`, BUILD_ID `f-dc0hdFjWIWWMMI22h-W` confirmed in `.next/BUILD_ID` |
| 2 | Tailwind CSS v3 installed — tailwind.config.js exists and is parsed | VERIFIED | `tailwind.config.js` present; `package.json` has `tailwindcss@^3.4.19`; `postcss.config.js` present |
| 3 | Both Inter and Plus Jakarta Sans load via next/font/google with CSS variable mode | VERIFIED | `app/layout.tsx` lines 1–13 use `Inter` and `Plus_Jakarta_Sans` with `variable:` option; CSS vars `--font-inter` and `--font-jakarta` applied to `<html>` element in built HTML |
| 4 | All SSUEW design tokens in tailwind.config.js | VERIFIED | `ssuew-black: #1A2340`, primary, ssuew-white, ssuew-gray-*, error, success-*, brand radii/shadows/maxWidth all present in `tailwind.config.js` |
| 5 | Path aliases `@/*` resolve correctly | VERIFIED | `tsconfig.json` has `"@/*": ["./*"]`; all components use `@/components/...`, `@/data/...`, `@/lib/utils` without errors (build succeeds) |
| 6 | Navbar renders full 2-level menu (5 top-level + highlight button) | VERIFIED | `data/navigation.ts` exports 6 items: Strona Główna, Strefa Studenta (8 children), Samorząd Studentów (6 children), Współprace (2 children), Kontakt (2 children), Strefa Działacza (highlight). All rendered in `out/index.html` |
| 7 | Desktop dropdowns appear on hover for 4 items | VERIFIED | `Navbar.tsx` uses `group-hover:opacity-100` CSS pattern for 4 dropdown items; ChevronDown icon with `group-hover:rotate-180`; confirmed in built HTML |
| 8 | Mobile hamburger opens animated drawer with accordion submenus | VERIFIED (source) / HUMAN NEEDED (runtime) | `motion.div` with `initial={{ height: 0, opacity: 0 }}`, `animate={{ height: 'auto', opacity: 1 }}`, `AnimatePresence`; accordion via `AnimatePresence` + `motion.div` per submenu. Behavior requires browser to confirm |
| 9 | Navbar is sticky/fixed, transitions to glassmorphism after 20px scroll | VERIFIED (source) | `position: fixed`, scroll listener `window.scrollY > 20` sets `scrolled` state, `backdrop-blur-md bg-white/80` class applied when scrolled |
| 10 | Footer shows exact address, 4 social icons, email | VERIFIED | Built HTML confirms: `ul. Kamienna 43`, `53-307 Wrocław`, `Budynek J, pokój 9`; TikTok/Facebook/LinkedIn/Instagram with exact hrefs; `kontakt@samorzad.ue.wroc.pl` |
| 11 | Footer uses ssuew-black background | VERIFIED | `footer className="bg-ssuew-black text-white py-16"` — class confirmed in built HTML |
| 12 | Lenis smooth scroll active | VERIFIED (source) / HUMAN NEEDED (feel) | `LenisProvider.tsx` uses `ReactLenis root` from `lenis/react` with `duration: 1.2`; wired in `app/layout.tsx` wrapping entire body; Lenis present in built JS chunks |
| 13 | FadeUp animates opacity 0→1 + y 30→0 on viewport entry (once: true) | VERIFIED (source) | `FadeUp.tsx` uses `motion.div` with `initial={{ opacity: 0, y: 30 }}`, `whileInView={{ opacity: 1, y: 0 }}`, `viewport={{ once: true, margin: '-80px' }}` |
| 14 | prefers-reduced-motion: FadeUp renders static div — no animation | VERIFIED (source) | `useReducedMotion()` from `motion/react` (which re-exports from framer-motion via `export * from 'framer-motion'`); when `shouldReduce` is true, returns plain `<div>` — no motion.div rendered |
| 15 | Navbar and Footer appear on every page via root layout | VERIFIED | `app/layout.tsx` renders `<LenisProvider><Navbar /><main>{children}</main><Footer /></LenisProvider>` — both confirmed in built `out/index.html` |

**Score:** 14/15 truths verified (1 requires browser confirmation — FadeUp whileInView behavior, as component is tree-shaken from current build because no content page uses it yet)

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `package.json` | next@^14, react@^18, tailwindcss@^3, lenis@^1, motion@^12 | VERIFIED | All present: next@^14.2.35, react@^18.3.1, tailwindcss@^3.4.19, lenis@^1.3.23, motion@^12.38.0 |
| `next.config.js` | `output: 'export'`, `trailingSlash: true`, `images.unoptimized: true` | VERIFIED | All 3 options confirmed in file |
| `tailwind.config.js` | Full SSUEW token set | VERIFIED | Colors (ssuew-black #1A2340, primary #3BAEFF, etc.), fonts, fontSize, borderRadius, boxShadow, maxWidth all present |
| `app/globals.css` | @tailwind directives, no scroll-behavior: smooth | VERIFIED | 3 @tailwind directives only; comment explicitly explains Lenis handles scroll |
| `app/layout.tsx` | Root layout with fonts as CSS vars, LenisProvider, Navbar, Footer wired | VERIFIED | All 4 imports and wiring confirmed |
| `lib/utils.ts` | cn() helper via clsx | VERIFIED | 4-line file, exports `cn()` using `clsx` |
| `data/navigation.ts` | Typed NavItem[] with 6 top-level items | VERIFIED | 58 lines, complete type definitions, 6 items with full child arrays |
| `data/social.ts` | 4 social links with exact URLs | VERIFIED | TikTok, Facebook, LinkedIn, Instagram with correct production hrefs |
| `data/contact.ts` | Address lines + email | VERIFIED | `addressLines: ['ul. Kamienna 43', '53-307 Wrocław', 'Budynek J, pokój 9']`, `email: 'kontakt@samorzad.ue.wroc.pl'` |
| `components/layout/Navbar.tsx` | Full desktop + mobile client component | VERIFIED | 217 lines, 'use client', motion/react, usePathname, complete desktop/mobile implementation |
| `components/layout/Footer.tsx` | Server component, real data from imports | VERIFIED | Imports from data/contact and data/social, renders all 3 columns with real data |
| `components/layout/LenisProvider.tsx` | ReactLenis root wrapper | VERIFIED | 20 lines, ReactLenis from lenis/react, root prop, duration 1.2 |
| `components/ui/FadeUp.tsx` | motion.div whileInView + useReducedMotion | VERIFIED | 29 lines, correct implementation — but ORPHANED (no page imports it yet) |
| `components/ui/Button.tsx` | Primary/outline/sm variants | VERIFIED | 35 lines, 2 variants, 2 sizes, cn() composition |
| `out/index.html` | Valid static HTML with Navbar + Footer rendered | VERIFIED | Full SSR HTML with all nav items, footer content, font variables, CSS/JS references |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `app/layout.tsx` | `tailwind.config.js` | CSS vars `--font-inter`, `--font-jakarta` on html element | VERIFIED | `className={${inter.variable} ${jakarta.variable}}` on `<html>` in layout.tsx |
| `tailwind.config.js` | `app/globals.css` | content scan includes app/ and components/ | VERIFIED | `content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}', './data/**/*.{js,ts,jsx,tsx,mdx}']` |
| `components/layout/Navbar.tsx` | `data/navigation.ts` | navItems drives menu rendering | VERIFIED | `import { navItems } from '@/data/navigation'`; used in both desktop and mobile render loops |
| `components/layout/Footer.tsx` | `data/social.ts` | socialLinks drives icon links | VERIFIED | `import { socialLinks } from '@/data/social'`; mapped to icon anchor elements |
| `components/layout/Navbar.tsx` | `next/navigation` | usePathname() for active detection | VERIFIED | `import { usePathname } from 'next/navigation'`; used in `isActive()` function |
| `app/layout.tsx` | `LenisProvider` | wraps body for smooth scroll | VERIFIED | `<LenisProvider>` is outermost wrapper in body |
| `app/layout.tsx` | `Navbar` | rendered on every page | VERIFIED | `<Navbar />` before `<main>` in layout |
| `components/ui/FadeUp.tsx` | `motion/react` | whileInView + useReducedMotion | VERIFIED | `import { motion, useReducedMotion } from 'motion/react'`; both used in component logic |

### Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
|----------|--------------|--------|--------------------|--------|
| `Footer.tsx` | `contactInfo.addressLines` | `data/contact.ts` (static const) | Yes — hardcoded real address data | FLOWING |
| `Footer.tsx` | `socialLinks` | `data/social.ts` (static const) | Yes — hardcoded real URLs | FLOWING |
| `Footer.tsx` | `contactInfo.email` | `data/contact.ts` (static const) | Yes — real email | FLOWING |
| `Navbar.tsx` | `navItems` | `data/navigation.ts` (static const) | Yes — full menu tree | FLOWING |

Note: All data is static constants (appropriate for a vanilla static site with no backend). No API/DB calls needed or expected.

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| Build produces static HTML | `ls out/index.html` + BUILD_ID check | `out/index.html` exists, BUILD_ID `f-dc0hdFjWIWWMMI22h-W` | PASS |
| Footer address in built output | grep `ul. Kamienna 43` in `out/index.html` | Found | PASS |
| Footer email in built output | grep `kontakt@samorzad.ue.wroc.pl` in `out/index.html` | Found | PASS |
| All 4 social URLs in built output | grep TikTok/FB/LI/IG hrefs | All 4 found | PASS |
| nav items rendered in HTML | grep all 6 top-level labels | All found | PASS |
| CSS bundle exists | `ls out/_next/static/css/` | `27248abc749ef993.css` found | PASS |
| JS chunks exist | `ls out/_next/static/chunks/` | 9 chunk files including webpack, main-app, layout | PASS |
| Lenis in built JS | grep `Lenis` in chunks | Found in `243-5dfd9427703dc633.js` and layout chunk | PASS |
| `motion/react` exports `useReducedMotion` | check `framer-motion/dist/cjs/index.js` + `motion/dist/es/react.mjs` | `exports.useReducedMotion` confirmed; ESM does `export * from 'framer-motion'` | PASS |
| FadeUp whileInView + prefers-reduced-motion | runtime behavior | SKIP — FadeUp tree-shaken (not imported by any page yet) | SKIP |
| Lenis scroll physics | browser behavior | SKIP — requires browser interaction | SKIP |

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|------------|-------------|--------|----------|
| NEXT-01 | 02-01 | Next.js 14 project bootstrapped with static export config | SATISFIED | `next@^14.2.35`, `output: 'export'`, `trailingSlash: true`, `images.unoptimized: true` |
| NEXT-02 | 02-01 | Tailwind CSS v3 design system with SSUEW tokens | SATISFIED | `tailwindcss@^3.4.19`, all tokens in `tailwind.config.js` including `ssuew-black: #1A2340` |
| NEXT-03 | 02-01 | Google Fonts (Inter, Plus Jakarta Sans) via next/font with CSS variables | SATISFIED | Both fonts configured in `app/layout.tsx` with variable mode |
| NAV-01 | 02-02 | Sticky navbar with 2-level dropdown desktop menu and animated mobile drawer | SATISFIED | `Navbar.tsx` implements full spec; confirmed in built HTML |
| FOOT-01 | 02-02 | Footer with real address, email, 4 social links on ssuew-black background | SATISFIED | All data confirmed in `data/contact.ts`, `data/social.ts`, rendered in built HTML |
| ANIM-01 | 02-03 | Lenis smooth scroll via ReactLenis root in layout | SATISFIED | `LenisProvider.tsx` wired in `app/layout.tsx` |
| ANIM-02 | 02-03 | FadeUp component with whileInView animation | SATISFIED (source) | Implementation verified; runtime behavior pending content page usage |
| ANIM-03 | 02-03 | prefers-reduced-motion support in FadeUp | SATISFIED (source) | `useReducedMotion()` hook from `motion/react` returns static div when true |

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `app/page.tsx` | 3 | "treść wkrótce" placeholder text | Info | Expected — content pages are Phase 3+. Does not block foundation goal. |

No TODO/FIXME/HACK/PLACEHOLDER comments found in any Phase 2 component files. No empty handlers. No return null stubs. FadeUp being tree-shaken from the build is not an anti-pattern — it is unused because no content page exists yet.

### Human Verification Required

#### 1. Lenis Smooth Scroll Physics

**Test:** Open `out/index.html` via a local server (e.g. `npx serve out`), scroll the page
**Expected:** Scroll has a weighted, physics-based deceleration feel — not the browser's native instant scroll. Duration should feel approximately 1.2 seconds of easing.
**Why human:** Scroll physics cannot be verified programmatically from static file inspection; requires a real browser and subjective perception of scroll smoothness.

#### 2. Mobile Drawer Animation

**Test:** Open in browser, resize to < 768px viewport, click the hamburger button
**Expected:** The navigation drawer slides down smoothly (`height: 0 → auto` with `opacity: 0 → 1` over 300ms). Click "Strefa Studenta" — the accordion expands with `height: auto` animation. Press Escape — drawer closes.
**Why human:** `AnimatePresence` + `motion.div` conditional rendering requires JavaScript execution; static HTML has `aria-expanded="false"` and no drawer content (correct SSR behavior).

#### 3. FadeUp prefers-reduced-motion

**Test:** In browser OS/settings, enable "Reduce motion". Add `<FadeUp>` to any page, load it.
**Expected:** Content renders as a plain `<div>` with no animation — no opacity transition, no translateY movement.
**Why human:** FadeUp is tree-shaken from the current build (no page imports it). Once a content page uses FadeUp, this should be the first visual test run. The source implementation is correct but cannot be exercised yet.

### Gaps Summary

No blocking gaps. All Phase 2 artifacts are substantive, wired, and produce real data. The one ORPHANED artifact (FadeUp) is correct for a foundation phase — it is ready for content pages to use but has not been exercised yet. The phase goal "ready for building all content pages" is achieved.

---

_Verified: 2026-05-15_
_Verifier: Claude (gsd-verifier)_
