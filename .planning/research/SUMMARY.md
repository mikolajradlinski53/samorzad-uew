# Project Research Summary

**Project:** Samorząd Studentów UEW — Agency-Style Website Redesign
**Domain:** Polish university student council — static multi-page website
**Researched:** 2026-05-13
**Confidence:** HIGH

---

## Executive Summary

This is an evolutionary redesign of a working vanilla HTML/CSS/JS website, not a rewrite. The existing codebase already has the correct structural foundation — CSS custom properties, IntersectionObserver scroll animations, responsive breakpoints, a multi-page layout, and Netlify hosting. The redesign goal is to apply an agency/studio aesthetic on top of that foundation while closing three critical functional gaps: a contact form that silently fails, a missing Documents section that students actively search for, and incomplete organizational transparency (Komisje not represented as a navigable section). The recommended approach is phases ordered foundation-first — fix inline style debt and known bugs before touching visual design, then apply the new aesthetic systematically from highest-visibility components downward.

The stack requires zero new dependencies beyond AOS (scroll animation library, CDN drop-in replacing custom IntersectionObserver code), Lenis (smooth scroll for agency feel, CDN), and Plus Jakarta Sans (display font paired with Inter, Google Fonts). The most important architectural decision is implementing a data-include fetch-based HTML fragment loader for the shared navbar and footer — without this, any navigation change must be manually replicated across all 6 HTML files, which is the primary maintenance risk as pages are added.

The top risks are: (1) the Netlify Forms integration silently not working — the form currently fakes success without sending anything, and this is already live in production; (2) inline styles on every page overriding CSS redesign changes in invisible, hard-to-debug ways; (3) scroll performance degrading on mobile if new animations use layout-triggering properties instead of transform/opacity only. All three are preventable with discipline established at the start of the redesign, not retrofitted afterward.

---

## Key Findings

### Recommended Stack

The project must remain pure HTML/CSS/JS with CDN-only additions — no build tool, no npm, no framework. The three additions that provide the most aesthetic leverage for least complexity cost are AOS for scroll animation, Lenis for smooth scroll physics, and Plus Jakarta Sans as a display typeface for hero headings.

**Core technologies:**

| Technology | Purpose | CDN / Source |
|------------|---------|--------------|
| AOS v2.3.4 | Scroll-triggered reveal animations | cdn.jsdelivr.net/npm/aos@2.3.4/dist/aos.js + aos.css |
| Lenis v1.x | Smooth scroll with physics/inertia | cdn.jsdelivr.net/npm/lenis@latest/dist/lenis.min.js |
| Plus Jakarta Sans (700, 800) | Display font for h1/hero headings | Google Fonts: family=Plus+Jakarta+Sans:wght@700;800 |
| Inter (400-800, keep as-is) | Body and UI font | Google Fonts (already in head) |
| Netlify Forms | Contact form delivery, zero backend | data-netlify=true + AJAX fetch |
| CSS custom properties (extend) | Spacing scale, easing curves, gradient tokens | :root block in style.css |
| CSS Container Queries | Card-level responsiveness | Native — Baseline widely available Feb 2023 |
| prefers-reduced-motion | Accessibility for all animations | Native CSS media query |

CDN links (pin version before production):
- AOS CSS in head: https://cdn.jsdelivr.net/npm/aos@2.3.4/dist/aos.css
- AOS JS before body close: https://cdn.jsdelivr.net/npm/aos@2.3.4/dist/aos.js
- Lenis JS before body close: https://cdn.jsdelivr.net/npm/lenis@latest/dist/lenis.min.js
- Google Fonts combined: https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@700;800&display=swap

What not to add: GSAP (commercial license + overkill), jQuery (codebase correctly has zero), Bootstrap/Tailwind (naming conflicts with existing CSS), Typed.js (custom typewriter exists, needs a 5-line bug fix).

### Expected Features

**Must have — exists but broken/incomplete:**
- Contact form with real sending — currently fakes success (critical trust issue, live now)
- Subpage navigation links — #aktualnosci used on subpages instead of index.html#aktualnosci
- PL/EN language toggle — typewriter desync bug; html lang attribute not updated on switch
- Responsive mobile design — known nav, touch, and typography issues

**Must have — completely missing:**
- Documents / Uchwaly section — highest student demand; pure HTML + PDFs in /dokumenty/
- Komisje section — transparency requirement; text mention only, no structured section
- 404 error page — single file at repo root, Netlify auto-serves it

**Must have — exists, needs real content:**
- Board member photos (emoji placeholders currently)
- Partner logos (placeholder divs currently)
- Social media links (placeholder hrefs currently)
- Scholarship deadlines and USOS links in Strefa Studenta

**Should have (differentiators):**
- Category filter on Aktualnosci — ~20 lines vanilla JS with data-category attributes
- Komisje cards with chair contact per commission (student self-routing)
- Agency-style visual design applied consistently across all pages
- Netlify Forms with honeypot spam protection

**Defer to v2+:**
- Per-article news pages (unsustainable without templating at current scale)
- Search (not needed until 50+ content items)
- Dark mode (CSS vars make it feasible but not essential for v1)
- Social feed embeds (GDPR landmine, unreliable third-party iframes)
- Application forms beyond contact (requires backend for GDPR-compliant data handling)

### Architecture Approach

The correct model is evolutionary reskin. The 3-layer architecture (HTML/CSS/JS) is correct; the CSS needs internal reorganization into a 10-section single-file structure. Two structural decisions have the highest leverage: (1) implement data-include fetch-based HTML fragments for shared navbar/footer to eliminate 6-file manual sync, and (2) extract the hero inline style block from index.html into style.css before any visual redesign begins.

**Major components:**

| Component | Root Class | Key Decision |
|-----------|-----------|--------------|
| Navbar | .navbar | Add .navbar--always-glass for subpages |
| Mobile menu | .mobile-menu | Replace display toggle with transform: translateY() slide |
| Hero | .hero | Move all inline CSS out before redesigning |
| Section shell | .section | Add .section-dark variant for dark-bg sections |
| Card + Card grid | .card, .card-grid | Add container queries; .card--featured modifier |
| Split section | .split | New: two-column text/visual layout component |
| Document list | .doc-list | New: bordered list for PDF links by category |
| Komisje cards | reuse .card-grid-3 | New content in zarzad.html with #komisje anchor |
| Shared nav/footer | _nav.html, _footer.html | 20-line data-include fetch loader in script.js |

Data flow: All persistent state via localStorage (follows existing lang key pattern). No cross-page JS state. Component state lives in CSS classes toggled by JS. No new patterns needed.

### Critical Pitfalls

1. **Netlify Forms silent failure (C1 — CRITICAL, already live in production):** The form has no method=POST, no data-netlify=true, and JS fakes success. Fix: add method, data-netlify, name, hidden form-name input, honeypot field, rewrite JS submit handler using fetch() with URLSearchParams. Enable form detection in Netlify UI. Must be Phase 1.

2. **Inline styles blocking CSS redesign (C2 — CRITICAL):** The hero has a style block in head; style= attributes appear ~12 times across 6 HTML files. Any CSS change in style.css is silently overridden by inline specificity. Audit and extract all to named classes before writing new CSS.

3. **Font CLS shifting hero text (P1 — Performance):** Some subpages lack display=swap. Adding it fixes FOIT but introduces CLS from font metric differences on swap. Fix: consistent display=swap on all 6 files + size-adjust/ascent-override for system fallback to match Inter metrics.

4. **Scroll jank from unthrottled scroll listener (P2 — Performance):** Raw scroll listener for navbar has no requestAnimationFrame throttle. All new animated properties must be transform and opacity only — never height, top, left, margin in keyframes.

5. **Focus rings removed during redesign (M4 — Accessibility):** Agency designs suppress outline to eliminate default focus rings. Rule: never outline:none without immediate :focus-visible companion (outline: 2px solid var(--primary); outline-offset: 3px).

---

## Implications for Roadmap

Based on combined research, dependencies are clear: foundation cleanup must precede visual redesign, and visual redesign must precede content expansion. The Netlify Forms critical bug should be treated as a prerequisite, not a polish item.

### Phase 1: Foundation and Bug Fixes

**Rationale:** Three critical bugs are live in production. Inline style debt will silently block every CSS change in Phase 2. These are bounded, known fixes — do them first as a clean committed baseline.

**Delivers:** Working contact form (biggest trust signal), stable codebase with no hidden overrides ready for redesign.

**Addresses:** Contact form fix, subpage nav links, typewriter fix, html lang attribute, font display consistency.

**Avoids pitfalls:** C1, C2, P1, M3, m2

**Tasks:**
1. Fix Netlify Forms: method, data-netlify, honeypot, AJAX handler, enable in Netlify UI
2. Extract hero style block from index.html head into style.css
3. Extract all style= attributes to named CSS classes across all 6 HTML files
4. Fix subpage navbar links: #aktualnosci to index.html#aktualnosci
5. Fix typewriter: module-scoped interval ID, clearInterval + initTypewriter() in applyLang()
6. Fix lang attribute: document.documentElement.lang = lang in applyLang()
7. Add display=swap to Google Fonts link on all 6 HTML files
8. Add prefers-reduced-motion block to style.css
9. Add :focus-visible focus ring rules to style.css

**Research flag:** Standard patterns — all fixes bounded and documented. No research phase needed.

---

### Phase 2: CSS Design System and Component Library

**Rationale:** Establish consistent design tokens and shared component infrastructure before applying aesthetics page-by-page. Ensures every subsequent phase draws from one vocabulary.

**Delivers:** Extended CSS token set, _nav.html/_footer.html fragments with fetch loader, AOS and Plus Jakarta Sans integrated, new CSS component classes ready for use.

**Tasks:**
1. Extend :root tokens: spacing scale (--space-xs through --space-xl), easing curves (--ease-out-expo), duration scale, gradient tokens
2. Implement data-include loader in script.js (~20 lines); create _nav.html and _footer.html
3. Add AOS via CDN; migrate .fade-up to data-aos attributes; add .fade-left, .fade-right, .fade-scale
4. Add Plus Jakarta Sans to Google Fonts; set --font-display var; apply to h1 only
5. Add .section-dark, .split, .highlight-strip components to style.css
6. Add .navbar--always-glass modifier
7. Restructure style.css internal order (tokens, reset, base, typography, layout, animations, components, pages, utilities, responsive)

**Research flag:** Standard patterns. No research phase needed.

---

### Phase 3: Visual Redesign — Hero and Navbar

**Rationale:** First impression is set by hero and navbar. Once done, all subsequent work looks intentional. Per ARCHITECTURE.md, hero and navbar deliver the highest visual ROI per hour of work.

**Delivers:** Agency-feel first impression — glassmorphism navbar, bold hero typography with staggered entrance animations, smooth scroll physics, animated mobile menu.

**Tasks:**
1. Add Lenis via CDN; configure RAF loop; disable smoothTouch
2. Hero: Plus Jakarta Sans bold display type, staggered AOS delays (label, h1, subtitle, buttons)
3. Glassmorphism navbar refinement; .navbar--always-glass applied to all subpage navs
4. Mobile menu: transform: translateY() slide replaces display toggle
5. Hamburger to X CSS animation (JS toggles .hamburger.open class)
6. Scroll progress bar as progressive enhancement (animation-timeline: scroll() with @supports guard)
7. Mobile menu: passive scroll listener to close on scroll; event delegation for link clicks

**Research flag:** Lenis + AOS combined RAF loop needs browser verification before committing as architecture. 10-minute browser test, not a full research phase.

---

### Phase 4: Page-by-Page Application

**Rationale:** Design system established. Apply vocabulary to all content pages in traffic priority order. Each page is a contained unit — regressions are localized.

**Delivers:** Consistent agency aesthetic across all existing pages; category filter on Aktualnosci; Komisje cards in Zarzad; project status badges; improved Strefa Studenta.

**Page order (traffic priority):**
1. aktualnosci.html — data-category attributes on all cards + filter buttons (~20 lines JS)
2. zarzad.html — real avatar photos replacing emoji divs; Komisje cards section (#komisje anchor, 3-col grid, 6 cards)
3. projekty.html — project status badges (Aktywny/Zakonczony/Planowany)
4. strefa-studenta.html — real scholarship deadline content; USOS deeplinks; improved navigation
5. wydarzenia.html — past/upcoming split; improved event card design

**Research flag:** Standard patterns. Komisje content is a council data dependency, not a technical blocker.

---

### Phase 5: New Sections and Missing Features

**Rationale:** Documents section and Komisje section are the two biggest structural gaps. Both are pure HTML with no new JS dependency, gated on council providing real content.

**Delivers:** Documents/Uchwaly section with per-category grouping, 404 error page, real partner logos, Open Graph social sharing meta tags.

**Tasks:**
1. Create /dokumenty/ directory structure (uchwaly/, regulaminy/, protokoly/, sprawozdania/) with YYYY-MM-DD filename convention
2. Build dokumenty.html with .doc-list sections per category; PDF links open in new tab
3. Create 404.html at repo root (Netlify auto-serves it)
4. Swap partner logo placeholder divs with real img elements (grayscale to color on hover)
5. Add OG meta tags (og:title, og:description, og:image, og:url, og:locale=pl_PL) to all pages
6. Verify meta charset=UTF-8 is first in head on all pages

**Research flag:** Standard patterns. No research phase needed.

---

### Phase 6: Polish and Performance Audit

**Rationale:** Final sweep to catch accumulated accessibility failures, contrast issues, missing alt text, and i18n gaps from all prior phases.

**Delivers:** Lighthouse 90+ across all categories, full accessibility compliance, complete i18n coverage, confirmed mobile scroll performance.

**Tasks:**
1. Lighthouse audit on all pages — target 90+ performance, accessibility, SEO
2. Audit all label/input for-id associations; aria-describedby on error messages; role=alert on form success div
3. Check every --text-* color variable against background (4.5:1 body, 3:1 large text minimum)
4. Verify all images have meaningful alt text
5. Audit all data-i18n keys — every key must exist in both pl and en translation objects
6. Test Lenis on real mobile devices (iOS Safari + mid-range Android)
7. Verify will-change absent from static style.css rules

**Research flag:** Standard audit patterns. No research phase needed.

---

### Phase Ordering Rationale

- Phases 1 and 2 must precede all others: the silent form failure is live and eroding trust; inline style debt will silently block every CSS change in Phases 3+.
- Phase 3 before page application: establishes the aesthetic reference so pages are built consistently from the start.
- Phase 4 before Phase 5: card/grid components refined in Phase 4 are reused in Documents and Komisje sections of Phase 5.
- Phase 6 always last: audits the accumulated state of all prior phases.
- Content dependencies (real photos, komisja data, PDFs) gate Phases 4 and 5 partially — flag as council deliverables at project kickoff, not developer tasks.

### Research Flags

Needs browser verification (not a full research phase):
- Phase 3: Lenis + AOS combined RAF loop — test in browser before committing as architecture

Standard patterns (skip research-phase):
- Phase 1: All fixes bounded and confirmed against actual codebase
- Phase 2: CSS design systems and fetch-based includes are well-established
- Phase 4: Card components, category filter JS, avatar cards — standard static HTML patterns
- Phase 5: Documents section, 404 page, OG meta tags — fully documented patterns
- Phase 6: Lighthouse auditing, WCAG compliance — standard tooling

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | MEDIUM-HIGH | CSS specs HIGH via MDN; AOS/Lenis CDN versions MEDIUM — verify exact versions at deploy time |
| Features | HIGH | Direct codebase inspection + official Netlify docs; komisje domain knowledge MEDIUM |
| Architecture | HIGH | Direct codebase inspection; CSS/JS patterns well-established; data-include is standard web platform |
| Pitfalls | HIGH | Netlify from official docs; CSS/a11y from MDN; every bug confirmed via direct code inspection |

**Overall confidence:** HIGH

### Gaps to Address

- Lenis + AOS RAF integration: Verify combined loop in browser before committing as architecture in Phase 3.
- Font metric overrides for Inter fallback: size-adjust/ascent-override values must be generated from fontaine or Google Fonts CSS customizer — cannot be estimated from research alone.
- Real komisja data from council: Phase 4 Komisje section requires komisja names, chair names, chair emails, scope descriptions. Flag as council content dependency at project kickoff.
- Lenis version pin: lenis@latest for development; must pin specific version before production deploy. Check cdn.jsdelivr.net/npm/lenis/ at deploy time.
- Polish higher education law compliance: Confirm uchwaly publication scope and retention policy against UEW statute before deciding PDF structure.

---

## Sources

### Primary (HIGH confidence)
- Direct codebase inspection: index.html, aktualnosci.html, zarzad.html, script.js, style.css, .planning/codebase/CONCERNS.md, .planning/codebase/ARCHITECTURE.md
- Netlify Forms Setup: https://docs.netlify.com/forms/setup/
- Netlify Forms Spam Filters: https://docs.netlify.com/forms/spam-filters/
- MDN CSS clamp() — Baseline widely available July 2020
- MDN CSS Container Queries — Baseline widely available Feb 2023
- MDN @starting-style — Baseline 2024, August 2024
- MDN IntersectionObserver API — Baseline widely available March 2019
- MDN CSS Scroll-Driven Animations — Chrome 115+, Firefox 110+, Safari 17.2+
- MDN will-change — explicit do-not-use-as-premature-optimization guidance
- MDN prefers-reduced-motion — confirmed behavior and JS guard pattern
- MDN font-display — confirmed swap period behavior and CLS risk

### Secondary (MEDIUM confidence)
- AOS v2.3.4 CDN via jsDelivr — training knowledge; verify at deploy
- Lenis v1.x CDN via jsDelivr — training knowledge; pin version before production
- Plus Jakarta Sans as Inter pairing — design knowledge, not empirical A/B testing
- Polish university samorzad domain patterns — knowledge of Polish higher education norms; confirm against UEW statute

### Tertiary (LOW confidence — verify before using)
- Exact current Lenis patch version — check cdn.jsdelivr.net/npm/lenis/ at implementation time
- Font metric override values for Inter system fallback — must be generated from tool, not estimated

---
*Research completed: 2026-05-13*
*Ready for roadmap: yes*
