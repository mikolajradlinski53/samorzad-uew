# Roadmap: Samorząd Studentów UEW — Website Redesign

## Overview

An evolutionary redesign of a working vanilla HTML/CSS/JS website. The path runs in four phases ordered by dependency: fix the live production bugs and inline style debt that would silently block all CSS work, then establish a shared design system and apply the agency-style visual redesign across all pages, then build the missing content sections students actively search for, and finally audit the accumulated result for performance, accessibility, and polish. Every phase delivers a coherent, verifiable capability before the next begins.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Bug Fixes and CSS Foundation** - Repair three live production bugs and extract all inline styles, creating a clean baseline for redesign
- [ ] **Phase 2: Design System and Visual Redesign** - Establish design tokens, integrate AOS/Lenis/Plus Jakarta Sans, and apply agency-style aesthetic across all pages
- [ ] **Phase 3: New Content Sections and Aktualności** - Build dokumenty, komisje, 404, partnerzy, and full aktualności feature set
- [ ] **Phase 4: Quality and Performance Audit** - Achieve Lighthouse 90+, full accessibility compliance, and confirmed mobile performance

## Phase Details

### Phase 1: Bug Fixes and CSS Foundation
**Goal**: Production bugs are fixed and the codebase has no hidden inline-style overrides — the site works correctly and is ready for visual redesign
**Depends on**: Nothing (first phase)
**Requirements**: BUG-01, BUG-02, BUG-03, BUG-04, FOUND-01
**Success Criteria** (what must be TRUE):
  1. Submitting the contact form sends a real message via Netlify Forms and the user sees a dismissable success notice
  2. Clicking any navigation link from a subpage (e.g., zarząd, aktualności) lands on the correct section of index.html
  3. Switching the site language from PL to EN (or back) resets the typewriter animation correctly with no leftover characters
  4. No `style=` attributes remain in any HTML file and no `<style>` blocks exist outside of the linked stylesheet
**Plans**: 3 plans

Plans:
- [ ] 01-01-PLAN.md — Fix Netlify Forms integration, typewriter re-init on language switch, form success dismiss (BUG-01, BUG-03, BUG-04)
- [ ] 01-02-PLAN.md — Fix subpage navbar links to use index.html#section anchors (BUG-02)
- [ ] 01-03-PLAN.md — Extract all inline styles to style.css, remove hero style block from head (FOUND-01)

### Phase 2: Design System and Visual Redesign
**Goal**: A shared CSS design system and component library exists, and the agency-style aesthetic — glassmorphism navbar, bold hero, smooth scroll, animated mobile menu — is live across all pages
**Depends on**: Phase 1
**Requirements**: FOUND-02, FOUND-03, FOUND-04, DESIGN-01, DESIGN-02, DESIGN-03, DESIGN-04, QUAL-01, QUAL-04
**Success Criteria** (what must be TRUE):
  1. AOS scroll-reveal animations play on page load and on scroll; users with prefers-reduced-motion see no motion
  2. Lenis smooth scroll is active — scrolling the page feels continuous and physics-driven, not janky
  3. The hero section displays in Plus Jakarta Sans bold typography with staggered entrance animations
  4. The navbar shows consistent glassmorphism on all pages (index and all subpages) and the mobile hamburger animates to an X when the slide-down menu opens
  5. Cards, stats, footer, and section layouts match a unified visual vocabulary across all existing pages
**Plans**: TBD
**UI hint**: yes

### Phase 3: New Content Sections and Aktualności
**Goal**: All missing content sections that students actively search for are built and reachable, and the aktualności page has filtering, search, and pagination
**Depends on**: Phase 2
**Requirements**: PAGES-01, PAGES-02, PAGES-03, PAGES-04, NEWS-01, NEWS-02, NEWS-03, NEWS-04, QUAL-03
**Success Criteria** (what must be TRUE):
  1. A student can open dokumenty.html and download PDFs grouped by category (Uchwały, Regulaminy, Protokoły)
  2. A student can navigate to zarząd.html and see komisje tematyczne listed as cards with name, scope, and chair
  3. Visiting a broken URL on the site shows a branded 404 page with a working navigation link back to the homepage
  4. The aktualności page lets a student filter posts by category, search by keyword, and page through results six at a time
  5. All pages include Open Graph meta tags so sharing a link on social media shows a correct title, description, and image
**Plans**: TBD
**UI hint**: yes

### Phase 4: Quality and Performance Audit
**Goal**: The completed site passes Lighthouse 90+ on performance and accessibility, has no accessibility regressions from the redesign, and loads correctly on mobile
**Depends on**: Phase 3
**Requirements**: QUAL-02
**Success Criteria** (what must be TRUE):
  1. Running Lighthouse on every page shows a score of 90 or above for both Performance and Accessibility
  2. All interactive elements (links, buttons, form fields) have visible focus rings and correct ARIA labels
  3. Scrolling on an iOS Safari or mid-range Android device with Lenis active shows no visible jank or frame drops
**Plans**: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Bug Fixes and CSS Foundation | 0/3 | Not started | - |
| 2. Design System and Visual Redesign | 0/? | Not started | - |
| 3. New Content Sections and Aktualności | 0/? | Not started | - |
| 4. Quality and Performance Audit | 0/? | Not started | - |
