# Architecture Patterns: Agency-Style Static Website

**Domain:** Multi-page vanilla HTML/CSS/JS — agency/studio aesthetic redesign
**Researched:** 2026-05-13
**Overall confidence:** HIGH (strong domain knowledge, verified against actual codebase)

---

## Recommended Architecture

The existing project already follows a sound 3-layer architecture (HTML / CSS / JS). The redesign
does NOT require a structural rewrite. It requires:

1. A CSS layer reorganization (split monolith into ordered sections)
2. Expanded animation vocabulary (more variety, smoother timing)
3. Consistent multi-page shell (navbar + footer as stable components)
4. Progressive enhancement of agency-aesthetic patterns on top of existing markup

The correct model is **evolutionary reskin**, not a blank-slate rewrite.

---

## CSS Architecture: Layered Single-File Approach

### Decision: Keep `style.css` as a single file, restructure its internal order

Splitting into multiple CSS files requires a build tool or careful `<link>` ordering.
For a no-build project, a single well-ordered file with clear section comments is the
correct approach. The existing file already demonstrates this with `/* ===== VARIABLES ===== */`
section markers — extend this discipline.

**Recommended layer order inside `style.css`:**

```
/* 1. TOKENS — CSS custom properties */
/* 2. RESET — box-sizing, margin, padding normalization */
/* 3. BASE — html, body, img, a, ul, button defaults */
/* 4. TYPOGRAPHY — h1-h6, p, clamp() fluid sizing */
/* 5. LAYOUT — .container, .section, .section-alt */
/* 6. ANIMATIONS — keyframes, .fade-up, .slide-in, .reveal */
/* 7. COMPONENTS — navbar, hero, cards, buttons, forms, footer */
/*    (one block per component, separated by comments) */
/* 8. PAGES — page-specific overrides (e.g., .page-hero) */
/* 9. UTILITIES — .sr-only, .text-center, .mt-* */
/* 10. RESPONSIVE — max-width breakpoints at the bottom */
```

**What this project already has that is correct:**
- CSS custom properties on `:root` — HIGH confidence this is the right approach; extend the token
  set rather than hardcoding new values
- `clamp()` for fluid typography — keep and expand to spacing as well
- BEM-lite class naming (`.card-title`, `.card-footer`) — consistent, extend it

**What to add to the token set for agency aesthetic:**

```css
:root {
  /* Existing tokens kept as-is */

  /* New: gradient tokens */
  --gradient-primary: linear-gradient(135deg, #3BAEFF 0%, #1A8FE3 100%);
  --gradient-hero: linear-gradient(145deg, #EAF5FF 0%, #F7FBFF 50%, #fff 100%);
  --gradient-dark: linear-gradient(135deg, #0f172a 0%, #1A2340 100%);

  /* New: spacing scale */
  --space-xs: 0.5rem;
  --space-sm: 1rem;
  --space-md: 2rem;
  --space-lg: 4rem;
  --space-xl: 8rem;

  /* New: animation durations */
  --duration-fast: 0.2s;
  --duration-base: 0.4s;
  --duration-slow: 0.7s;
  --duration-slower: 1.1s;

  /* New: easing curves */
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Decision: Clean-slate for the hero section inline styles; keep everything else

The hero section in `index.html` has 30+ lines of `<style>` inside `<head>`. This is the biggest
CSS technical debt. Move it into `style.css` under a `/* HERO */` block. All other existing CSS
classes are already in `style.css` and are sound — do not remove them.

---

## Component Boundaries (Vanilla HTML/CSS)

In a no-framework project, "components" are enforced by CSS class contracts and HTML copy-paste
discipline. Each component below has a defined root class and a defined set of child classes.
Nothing outside the component's root element should override its internals.

### Component Map

| Component | Root Class | Variant Classes | Key Child Classes | Notes |
|-----------|-----------|-----------------|-------------------|-------|
| Navbar | `.navbar` | `.navbar.scrolled` | `.navbar-inner`, `.navbar-logo`, `.navbar-links`, `.navbar-actions` | Already well-defined; add glassmorphism tokens |
| Mobile menu | `.mobile-menu` | `.mobile-menu.open` | — | Keep as-is; add slide animation |
| Hero | `.hero` | — | `.hero-content`, `.hero-label`, `.hero-actions`, `.hero-scroll` | Move inline CSS into `style.css` |
| Section shell | `.section` | `.section-alt`, `.section-dark` | `.container`, `.section-header` | Add `.section-dark` for dark-bg sections |
| Section header | `.section-header` | — | `.label`, `h2`, `p` | Already defined; keep |
| Card | `.card` | `.avatar-card`, `.zone-card`, `.event-card` | `.card-badge`, `.card-title`, `.card-text`, `.card-footer`, `.card-link` | Already well-defined |
| Card grid | `.card-grid` | `.card-grid-2/3/4` | — | Already defined; keep |
| Stat card | `.stat-card` | — | `.stat-number`, `.stat-label` | Already defined |
| Button | `.btn` | `.btn-primary`, `.btn-outline`, `.btn-sm`, `.btn-ghost` | — | Add `.btn-ghost` for dark-bg contexts |
| Form | `.form-group` | — | `label`, `input`, `textarea`, `.form-error`, `.form-success` | Keep; fix submission |
| Footer | `.footer` | — | `.footer-grid`, `.footer-brand`, `.footer-col`, `.footer-bottom` | Already defined |
| Page hero | `.page-hero` | — | `h1`, `p` | Already defined for subpages |
| Partner grid | `.partners-grid` | — | `.partner-item` | Already defined |

**New components needed for agency aesthetic:**

| Component | Root Class | Purpose |
|-----------|-----------|---------|
| Highlight strip | `.highlight-strip` | Full-width bold color band between sections (agency signature) |
| Marquee | `.marquee` | Horizontally scrolling text/logos (CSS animation only, no JS) |
| Split section | `.split` | Two-column layout: text left, visual right |
| Number feature | `.feature-number` | Large decorative number in background of section |
| Tag/pill cluster | `.tag-cluster` | Group of small label badges (categories, keywords) |

---

## Data Flow for Agency Animations

### CSS-only animations (prefer these)

Use for: elements that are always visible on load, decorative motion, hover states, loops.

```
@keyframes float    — hero background circles (already implemented)
@keyframes bounce   — hero scroll arrow (already implemented)
@keyframes marquee  — NEW: horizontal scroll for partner logos or taglines
@keyframes shimmer  — NEW: loading/skeleton shimmer on cards
@keyframes pulse    — NEW: subtle scale pulse on CTA buttons
```

CSS-only approach is correct when the animation does not depend on scroll position.
No JS overhead, no layout thrash, works with reduced-motion media query trivially.

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

Add this block to `style.css` immediately. It costs nothing and is a hard requirement for
accessibility.

### IntersectionObserver animations (use for scroll reveals)

Use for: elements that should appear as user scrolls down. The existing `.fade-up` /
`.visible` pattern is the correct architecture. Expand the vocabulary rather than replacing it.

**Existing pattern (keep):**
```
.fade-up { opacity: 0; transform: translateY(30px); transition: ... }
.fade-up.visible { opacity: 1; transform: none; }
```

**New animation classes to add to this system:**

```css
/* Slide in from left — for section text columns */
.fade-left  { opacity: 0; transform: translateX(-40px); transition: opacity var(--duration-slow) var(--ease-out-expo), transform var(--duration-slow) var(--ease-out-expo); }
.fade-left.visible  { opacity: 1; transform: none; }

/* Slide in from right — for section image columns */
.fade-right { opacity: 0; transform: translateX(40px);  transition: opacity var(--duration-slow) var(--ease-out-expo), transform var(--duration-slow) var(--ease-out-expo); }
.fade-right.visible { opacity: 1; transform: none; }

/* Scale reveal — for stat cards */
.fade-scale { opacity: 0; transform: scale(0.92); transition: opacity var(--duration-slow) var(--ease-out-expo), transform var(--duration-slow) var(--ease-out-expo); }
.fade-scale.visible { opacity: 1; transform: none; }

/* Stagger delays — extend existing */
.delay-5 { transition-delay: 0.5s; }
.delay-6 { transition-delay: 0.6s; }
```

The IntersectionObserver in `script.js` already watches `.fade-up`. Extend `initScrollAnimations()`
to also watch `.fade-left, .fade-right, .fade-scale` — one selector, no new observer instances
needed.

```js
// In initScrollAnimations() — change selector from:
document.querySelectorAll('.fade-up')
// to:
document.querySelectorAll('.fade-up, .fade-left, .fade-right, .fade-scale')
```

### Scroll-driven parallax (use sparingly)

CSS `animation-timeline: scroll()` is supported in Chrome 115+, Firefox 110+, Safari 17.2+.
This covers the "modern browsers only" constraint stated in PROJECT.md.

Use only for the hero background — a gentle parallax on the decorative circles:

```css
@supports (animation-timeline: scroll()) {
  .hero-bg-circle {
    animation: float 6s ease-in-out infinite, parallax-up linear both;
    animation-timeline: auto, scroll();
    animation-range: entry 0% exit 100%;
  }
  @keyframes parallax-up { to { transform: translateY(-60px); } }
}
```

Wrap in `@supports` so browsers without support fall back to the existing `float` animation.
Confidence on cross-browser support: MEDIUM — verify in Safari before shipping.

---

## Navigation Architecture: Glassmorphism Navbar

The existing navbar already has the correct structure. The glassmorphism effect is already
implemented via `.navbar.scrolled`:

```css
.navbar.scrolled {
  background: rgba(255,255,255,0.95);
  backdrop-filter: blur(12px);
  box-shadow: 0 2px 20px rgba(0,0,0,0.08);
}
```

**Recommended enhancements (not replacements):**

1. Show glassmorphism from the start on subpages (`.page-hero` has a light background, transparent
   navbar looks broken). Add a `.navbar--always-glass` modifier class that subpage `<nav>` elements
   get:

```css
.navbar--always-glass {
  background: rgba(255,255,255,0.92);
  backdrop-filter: blur(12px);
  box-shadow: 0 2px 20px rgba(0,0,0,0.06);
}
```

2. Mobile menu: replace `display: none / display: flex` toggle with a CSS transform slide:

```css
.mobile-menu {
  display: flex;           /* always flex */
  flex-direction: column;
  transform: translateY(-110%);
  transition: transform 0.35s var(--ease-out-expo);
  /* remove display:none rule */
}
.mobile-menu.open {
  transform: translateY(0);
  /* remove display:flex rule */
}
```

This makes the open/close animate smoothly. The JS toggle still adds/removes `.open` — no JS
change needed.

3. Hamburger → X animation: add CSS transforms to the three spans when `.open`:

```css
.mobile-menu.open ~ .navbar .hamburger span:nth-child(1) { transform: rotate(45deg) translate(5px, 5px); }
.mobile-menu.open ~ .navbar .hamburger span:nth-child(2) { opacity: 0; }
.mobile-menu.open ~ .navbar .hamburger span:nth-child(3) { transform: rotate(-45deg) translate(5px, -5px); }
```

However, the current DOM order (`.mobile-menu` is a sibling of `<nav>`, not inside it) does not
support the CSS sibling combinator trick. The hamburger is inside `.navbar` but the state class
`.open` is on `.mobile-menu`. Use JS to also toggle a class on the hamburger button:

```js
hamburger.classList.toggle('open');  // add alongside mobile-menu toggle
```

---

## Multi-Page Consistency Without a Template Engine

### Problem

Each page duplicates `<nav>`, `<footer>`, and `<head>`. When the navbar changes, all 6 pages must
be updated manually. This is the primary maintenance risk for this project.

### Decision: HTML includes via `fetch()` — lightweight, no build tool required

The correct vanilla solution for repeated blocks is a small JS loader. It costs ~20 lines of JS
and requires no build step.

**Implementation pattern:**

1. Create `_nav.html` and `_footer.html` as HTML fragment files (no `<html>`, `<head>`, `<body>`).
2. In each page, replace the navbar block with a placeholder element:

```html
<div data-include="_nav.html"></div>
```

3. Add a tiny loader to `script.js` (runs before `DOMContentLoaded`):

```js
async function loadIncludes() {
  const elements = document.querySelectorAll('[data-include]');
  await Promise.all([...elements].map(async el => {
    const res = await fetch(el.dataset.include);
    const html = await res.text();
    el.outerHTML = html;
  }));
}
loadIncludes().then(() => {
  // existing DOMContentLoaded initialization moves here
});
```

**Trade-off:** fetch() requires HTTP (works on Netlify, works in local dev server, fails on
`file://`). For the Netlify deployment target this is correct. Developers need `npx serve .` or
VS Code Live Server for local dev — document this in README.

**Alternative if fetch() is rejected:** Use a consistent copy-paste discipline reinforced by a
`<!-- NAVBAR START -->` / `<!-- NAVBAR END -->` comment convention, and find-replace in editor
when updating. This is lower tech but creates drift risk at scale.

Recommendation: Use the `data-include` fetch pattern. It eliminates the most common source of
multi-page inconsistency at near-zero complexity cost.

---

## Mobile-First vs Desktop-First

### Decision: Mobile-first

**Rationale for this specific project:**

The existing `style.css` uses `@media (max-width: 768px)` — that is desktop-first (add mobile
overrides). This works but has a known problem: CSS specificity fights when mobile and desktop
share a class name. For the redesign, new components should be written mobile-first.

**Rule:** Existing components — keep desktop-first media queries to avoid regressions.
New components written during redesign — use mobile-first:

```css
/* Mobile-first new component */
.split {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}
@media (min-width: 768px) {
  .split {
    flex-direction: row;
    gap: var(--space-lg);
    align-items: center;
  }
}
```

**Breakpoints to standardize:**

```css
/* Already in use — keep these */
@media (max-width: 1024px) { ... }   /* tablet landscape */
@media (max-width: 768px)  { ... }   /* tablet portrait / mobile */

/* Add for mobile-first new components */
@media (min-width: 768px)  { ... }   /* tablet up */
@media (min-width: 1024px) { ... }   /* desktop up */
```

Do not introduce a third breakpoint scale. Two breakpoints is sufficient for this project's scope.

---

## Suggested Build Order: Incremental Redesign

This order minimizes regression risk and produces visible progress at each step.

### Phase 0 — Foundation (do before any visible redesign)

These changes are invisible to users but prevent bugs in every later step.

1. Move hero inline `<style>` block from `index.html` into `style.css`
2. Add `prefers-reduced-motion` media query to `style.css`
3. Extend CSS token set (gradients, spacing scale, animation durations, easings)
4. Extend `initScrollAnimations()` to watch `.fade-left, .fade-right, .fade-scale`
5. Create `_nav.html` and `_footer.html` fragments; implement `data-include` loader
6. Fix known bugs: navbar link hrefs on subpages, typewriter language sync

Outcome: Site looks identical, but architecture is now solid for the redesign.

### Phase 1 — Navbar + Hero (highest visibility, sets the aesthetic tone)

Reason: Users form first impressions from the first 2 seconds. Navbar and hero define the
agency feel. Once these two components are done, every subsequent section looks intentional.

1. Glassmorphism navbar: refine `.navbar.scrolled`, add `.navbar--always-glass` for subpages
2. Mobile menu slide animation (CSS transform approach above)
3. Hamburger → X animation
4. Hero section: bolder typography, improved button hierarchy, add a split layout with a visual
   element on the right (illustration, photo, or abstract shape)
5. Hero entrance animation: stagger `.fade-up` delays on label → h1 → subtitle → buttons

### Phase 2 — Section Layout System (structural, affects all pages)

1. Add `.section-dark` variant with dark background + inverted text colors
2. Add `.split` component for alternating text/visual sections
3. Add `.highlight-strip` full-width accent band
4. Apply `.fade-left` / `.fade-right` / `.fade-scale` to the first 2-3 sections on `index.html`
   as proof-of-concept before applying globally

### Phase 3 — Cards and Content Components

1. Upgrade card hover: add a subtle gradient overlay (::before pseudo-element) instead of just
   border color change
2. Add `.card--featured` modifier for prominently displayed items
3. Stat cards: add subtle background pattern or gradient, larger number with animated count-up
   already in place
4. Partner grid: real logos, grayscale → color on hover

### Phase 4 — Page-by-Page Application

Apply the new component vocabulary to each subpage in this order:
1. `aktualnosci.html` — highest traffic after index; add filter tags, improved card grid
2. `zarzad.html` — visual priority; avatar cards with real photos
3. `projekty.html` — showcase opportunity; featured project cards
4. `strefa-studenta.html` — utility page; improved tab/accordion navigation
5. `wydarzenia.html` — calendar view or improved event card design

### Phase 5 — Polish and Performance

1. Netlify Forms integration (fix the critical contact form bug)
2. Documents section (new page or section)
3. Partner logos with real assets
4. OG meta tags and favicon for social sharing
5. Audit: inline styles remaining, missing `alt` text, i18n key gaps

---

## Scalability Considerations

| Concern | Now (6 pages) | At 10 pages | At 20+ pages |
|---------|---------------|-------------|--------------|
| Multi-page consistency | Manual copy-paste risk | `data-include` pattern becomes critical | Consider Eleventy or Astro (static generators) |
| CSS size | 241 lines — fine | 600-800 lines — still fine | Split into modules, introduce build step |
| JS size | 450 lines — fine | 700-900 lines — still fine | Split into modules (native ES modules) |
| Content management | HTML editing | HTML editing + risk of divergence | CMS integration (Netlify CMS, Decap) |
| Images | Single logo PNG | Image directory, optimize on add | Image optimization pipeline |

The current scale (6 pages) does not justify adding build tools. The inflection point is ~15
pages or when the team grows beyond 2-3 contributors. Document this threshold in PROJECT.md.

---

## Component Dependency Graph

```
_nav.html
  └── Used by: index.html, aktualnosci.html, wydarzenia.html,
               zarzad.html, projekty.html, strefa-studenta.html

_footer.html
  └── Used by: all pages (same as above)

style.css
  └── Used by: all pages
  └── Depends on: Google Fonts (external CDN)

script.js
  └── Used by: all pages
  └── Depends on: DOM APIs (Intersection Observer, localStorage, requestAnimationFrame)
  └── Initializes: navbar, animations, counters, form, typewriter, i18n

index.html
  └── Unique sections: hero, stats, news-preview, events-preview,
                       board-preview, student-zone, projects-preview,
                       partners, contact

Subpages
  └── Shared: navbar, footer, page-hero, script.js, style.css
  └── Unique: page-specific content sections
```

No page has a JS dependency on any other page. State is isolated per-page except for localStorage
(`lang` key). This is the correct architecture for a static multi-page site.

---

## Anti-Patterns to Avoid

### Anti-Pattern 1: CSS framework import (Bootstrap, Tailwind CDN)
**What goes wrong:** Conflicts with existing custom classes; doubles CSS payload; creates naming
collisions with `.card`, `.container`, `.btn` (all used by existing code).
**Instead:** Extend the existing custom CSS system. It is already well-structured.

### Anti-Pattern 2: Scroll animation library (AOS, GSAP ScrollTrigger via CDN)
**What goes wrong:** Adds 30-60kb of JS for functionality already implemented in ~20 lines of
vanilla IntersectionObserver code. External library CDN = additional failure point.
**Instead:** Extend `initScrollAnimations()` with the new animation classes described above.
GSAP is justified only if you need path animation, morphing SVG, or physics — none of which are
required here.

### Anti-Pattern 3: Global JS variables for cross-page state
**What goes wrong:** Variables set on one page are undefined on the next (page reload clears JS
state). Any cross-page state must go through localStorage or URL params.
**Instead:** All persistent state lives in localStorage. New features should follow the `lang` key
pattern.

### Anti-Pattern 4: Inline styles added during redesign
**What goes wrong:** The existing codebase already has inline style debt (navbar logo, hero
section). Every inline style added during redesign makes future maintenance harder.
**Instead:** Every new visual property goes into `style.css` as a class or CSS variable.

### Anti-Pattern 5: Separate CSS file per page
**What goes wrong:** Without a build tool, the developer must manually link the right file on each
page. Files diverge. Shared utilities get duplicated.
**Instead:** Single `style.css` with page-specific sections clearly commented. At this scale, one
file loaded from cache is faster than multiple HTTP requests.

---

## Sources

- Codebase analysis: `style.css` (241 lines), `script.js` (450 lines), `index.html` (445 lines)
- Architecture analysis: `.planning/codebase/ARCHITECTURE.md`
- Project constraints: `.planning/PROJECT.md`
- CSS `animation-timeline` browser support: Chrome 115+, Firefox 110+, Safari 17.2+ (HIGH confidence — well-documented spec)
- `IntersectionObserver` browser support: all modern browsers (HIGH confidence)
- `backdrop-filter` browser support: all modern browsers except Firefox <103 (MEDIUM confidence — verify Firefox behavior)
- `data-include` fetch pattern: standard web platform, widely used (HIGH confidence)

---

*Architecture research: 2026-05-13*
