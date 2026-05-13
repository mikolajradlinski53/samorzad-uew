# Technology Stack Research

**Project:** Samorząd Studentów UEW — Agency-Style Redesign
**Researched:** 2026-05-13
**Overall confidence:** MEDIUM-HIGH (CSS specs HIGH via MDN; library versions LOW — CDN access blocked, using training knowledge flagged below)

---

## Context: What We Are Building On

The existing codebase is already well-structured vanilla HTML/CSS/JS with no build tools. It uses:
- Inter font (Google Fonts, weights 400–800)
- CSS custom properties (`--primary`, `--font`, `--transition`, etc.)
- `clamp()` for fluid typography (already in production in `style.css`)
- `IntersectionObserver` for `.fade-up` scroll animations
- `requestAnimationFrame` for counter animations
- `localStorage` for i18n

The redesign is **evolutionary, not a rewrite**. Stack decisions must be CDN-drop-in or pure CSS/JS — no npm, no bundler.

---

## Recommended Stack

### Core (keep as-is)

| Technology | Current Use | Action |
|------------|-------------|--------|
| HTML5 | All pages | Keep. No change needed. |
| CSS3 with custom properties | `style.css` | Extend. Add new patterns below. |
| Vanilla ES6+ JS | `script.js` | Extend. Do not introduce modules or bundling. |
| Google Fonts — Inter | Typography | Supplement with second typeface (see Fonts section). |
| Netlify | Hosting + Forms | Keep. |

### Scroll Animation Library

**Recommendation: AOS (Animate On Scroll) v2.3.4 via jsDelivr CDN**

AOS is a purpose-built, zero-dependency library that adds `data-aos` attributes to HTML and handles the IntersectionObserver lifecycle for you. It is a direct upgrade of the existing `.fade-up` / `IntersectionObserver` pattern — minimal migration cost.

```html
<!-- In <head> -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/aos@2.3.4/dist/aos.css" />

<!-- Before </body> -->
<script src="https://cdn.jsdelivr.net/npm/aos@2.3.4/dist/aos.js"></script>
<script>
  AOS.init({
    duration: 700,
    easing: 'ease-out-cubic',
    once: true,        // animate only once — better performance, matches existing behaviour
    offset: 80,        // px from bottom of viewport to trigger
    delay: 0
  });
</script>
```

Usage on any element:
```html
<div data-aos="fade-up">...</div>
<div data-aos="fade-up" data-aos-delay="150">...</div>
<div data-aos="fade-left" data-aos-duration="900">...</div>
```

**Why AOS over alternatives:**
- Existing codebase already has `.fade-up` + `IntersectionObserver` — AOS replaces this with 0 custom JS
- File size: ~13 KB JS + ~3 KB CSS (jsDelivr, gzipped ~6 KB total)
- `data-*` attribute API keeps animation logic out of JS
- `once: true` matches current `observer.unobserve()` pattern
- Well-maintained, used on tens of thousands of sites

**Confidence:** MEDIUM (version 2.3.4 confirmed in training; CDN URL structure verified by pattern; last commit activity LOW confidence — library has been stable since 2018 with minimal churn)

### Smooth Scroll Library

**Recommendation: Lenis v1.x via jsDelivr or unpkg CDN**

Lenis provides buttery smooth scroll with momentum/inertia. It is the current industry standard for "agency feel" smooth scrolling, replacing older ScrollSmoother (GSAP-dependent) and virtual-scroll approaches.

```html
<!-- Before </body> -->
<script src="https://cdn.jsdelivr.net/npm/lenis@1.1.14/dist/lenis.min.js"></script>
<script>
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    smoothWheel: true,
    touchMultiplier: 2
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
</script>
```

**Important:** If using both Lenis and AOS together, you must tick Lenis inside the RAF loop AND also drive AOS updates:
```javascript
function raf(time) {
  lenis.raf(time);
  AOS.refresh();  // only needed if content changes dynamically; otherwise omit
  requestAnimationFrame(raf);
}
```

**Mobile consideration:** Smooth scroll can feel unnatural on touch devices. Disable on mobile:
```javascript
const lenis = new Lenis({
  smoothWheel: true,
  smoothTouch: false   // default false — leave it off
});
```

**Confidence:** MEDIUM (Lenis v1.x CDN patterns confirmed in training; exact latest patch version uncertain — use `lenis@latest` or check https://cdn.jsdelivr.net/npm/lenis/)

**Alternative if Lenis causes issues:** CSS `scroll-behavior: smooth` is already in `style.css` (`html { scroll-behavior: smooth; }`). It provides native smooth anchor scrolling at zero cost, but no momentum/inertia. Sufficient for anchor nav links; Lenis is only needed if the "physics scroll" aesthetic is required site-wide.

---

## CSS Techniques

### 1. CSS Custom Properties — Extend the Existing System

The existing `:root` block is solid. Add these for agency aesthetic:

```css
:root {
  /* Existing vars kept as-is */

  /* Add: spacing scale */
  --space-xs:  0.5rem;
  --space-sm:  1rem;
  --space-md:  2rem;
  --space-lg:  4rem;
  --space-xl:  8rem;

  /* Add: easing curves */
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in-out-quart: cubic-bezier(0.76, 0, 0.24, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);  /* slight overshoot */

  /* Add: motion duration scale */
  --duration-fast:   150ms;
  --duration-base:   300ms;
  --duration-slow:   600ms;
  --duration-slower: 900ms;
}
```

Replace the current `--transition: 0.3s ease` with `--transition: var(--duration-base) var(--ease-out-expo)` for a more premium feel.

### 2. CSS clamp() — Already in Use, Extend It

`clamp()` has **Baseline Widely Available** status (supported since July 2020 across all modern browsers). The project already uses it for typography — extend to spacing:

```css
/* Fluid section padding — no media queries needed */
.section {
  padding: clamp(3rem, 8vw, 6rem) 0;
}

/* Fluid hero padding */
.hero {
  padding: clamp(6rem, 15vw, 12rem) 0 clamp(4rem, 10vw, 8rem);
}

/* Fluid container padding */
.container {
  padding: 0 clamp(1rem, 4vw, 2rem);
}
```

**Accessibility note (verified via MDN):** When using `clamp()` for font sizes, the max should be at least 2× the min to support 200% browser zoom. The existing `h1: clamp(2.2rem, 5vw, 3.8rem)` violates this slightly — consider `clamp(1.8rem, 5vw, 3.8rem)` for better zoom support.

### 3. CSS Scroll-Driven Animations (Native)

**Status:** Supported in Chrome 115+, Edge 115+, Opera 101+. Firefox support landed in Firefox 110 (partial) with full support in Firefox 132+ (late 2024). Safari support is the gap — Safari 18.2+ (Dec 2024) added partial support.

**Confidence:** HIGH for Chrome/Edge/Opera. MEDIUM for Firefox/Safari (newer versions required).

**Verdict for this project:** Use CSS scroll-driven animations as **progressive enhancement** for non-critical visual effects only (e.g. progress bars, parallax overlays). Fall back gracefully — they degrade invisibly if unsupported.

**Progress indicator (pure CSS, no JS):**
```css
/* Scroll progress bar at top of page */
@keyframes grow-progress {
  from { transform: scaleX(0); }
  to   { transform: scaleX(1); }
}

.scroll-progress {
  position: fixed;
  top: 0; left: 0;
  height: 3px;
  width: 100%;
  background: var(--primary);
  transform-origin: left;
  animation: grow-progress linear;
  animation-timeline: scroll(root block);
  z-index: 9999;
}
```

**Reveal animation via `view()` timeline (no JS, progressive enhancement):**
```css
@keyframes reveal-up {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Only apply where browser supports it — AOS handles the rest */
@supports (animation-timeline: view()) {
  .section-header {
    animation: reveal-up linear both;
    animation-timeline: view();
    animation-range: entry 0% entry 40%;
  }
}
```

**Note:** Do NOT use CSS scroll-driven animations as the primary animation engine for this project. AOS + IntersectionObserver has near-universal support and is already proven. CSS scroll-driven animations are a bonus layer.

### 4. CSS Container Queries

**Status:** Baseline — widely available (supported in all modern browsers since February 2023 per MDN). **Confidence: HIGH.**

Use for component-level responsiveness. Key use case: cards that reflow based on their container, not the viewport. This matters for the news grid, board member cards, and events list.

```css
/* Make a card grid container-aware */
.card-grid {
  container-type: inline-size;
}

/* Card responds to container width, not viewport */
@container (min-width: 600px) {
  .card {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 1.25rem;
    align-items: start;
  }
}
```

**When to prefer over media queries:** When the same component appears in different layout contexts (e.g. a news card in a 3-column grid vs. a sidebar). Use `@container` for the card itself, `@media` for the page layout.

### 5. @starting-style for Modal/Overlay Entry Animations

**Status:** Baseline 2024 — Newly available (August 2024). Works in latest Chrome, Edge, Firefox, Safari. **Confidence: MEDIUM** (newer feature, some older browser versions may miss it).

Use for mobile menu, contact form overlays, any element that toggles `display: none`:

```css
/* Mobile menu entry animation */
.mobile-menu {
  transition:
    opacity var(--duration-base) var(--ease-out-expo),
    transform var(--duration-base) var(--ease-out-expo);
}

.mobile-menu.open {
  opacity: 1;
  transform: translateY(0);
}

@starting-style {
  .mobile-menu.open {
    opacity: 0;
    transform: translateY(-12px);
  }
}
```

### 6. CSS Architecture Pattern: BEM-Lite with Utility Layer

The existing codebase uses a loose component pattern (`.card`, `.btn`, `.section-header`). For the redesign, formalise this into three layers with no build tool:

```
Layer 1 — Base/Reset:       *, html, body, img, a, ul, button
Layer 2 — Design Tokens:    :root { --* } 
Layer 3 — Layout:           .container, .section, .grid-*, .flex-*
Layer 4 — Components:       .card, .btn, .navbar, .hero, .stat-card
Layer 5 — Utilities:        .text-center, .sr-only, .visually-hidden, mt-* (sparingly)
Layer 6 — Page-specific:    Scoped to .page-* wrapper or per-page <style> block
```

**Recommendation:** Add a `@layer` declaration to enforce cascade ordering (Chrome 99+, Firefox 97+, Safari 15.4+ — all modern browsers):

```css
@layer base, tokens, layout, components, utilities, overrides;

@layer base {
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  /* ... */
}

@layer tokens {
  :root {
    --primary: #3BAEFF;
    /* ... */
  }
}
```

**For a single-file CSS project**, `@layer` may be overkill — the existing section-comment pattern (`/* ===== NAVBAR ===== */`) is sufficient. Only add `@layer` if the file grows beyond ~1500 lines or conflicts emerge.

---

## Fonts

### Current: Inter (keep)

Inter is a strong choice — no change needed. It is purpose-built for screens, has excellent legibility at small sizes, and reads as modern-professional without being cold.

**Extend the weight loading** — currently loading 400/500/600/700/800. This is correct. No change.

### Recommendation: Add a Display Font Pairing

For agency/studio aesthetic, pair Inter (body) with a more expressive display typeface for hero headlines and large section titles only.

**Primary recommendation: Plus Jakarta Sans**

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@700;800&display=swap" rel="stylesheet">
```

```css
:root {
  --font: 'Inter', sans-serif;
  --font-display: 'Plus Jakarta Sans', sans-serif;
}

h1 {
  font-family: var(--font-display);
  font-weight: 800;
}
```

**Why Plus Jakarta Sans:** Modern geometric sans with personality — slightly wider letterforms than Inter give headlines more visual weight. Used extensively by agency/startup sites. Weights 700/800 are the only ones needed (display use only). Pairs seamlessly with Inter.

**Confidence:** MEDIUM (plus-jakarta-sans is a well-established Google Font; pairing rationale based on design knowledge, not empirical testing)

**Alternative options (if Plus Jakarta Sans feels too similar to Inter):**

| Font | Character | Best For | Google Fonts URL |
|------|-----------|----------|-----------------|
| DM Sans | Geometric, clean, slightly quirky | Hero title, section titles | `family=DM+Sans:wght@700;800` |
| Sora | Modern, technical, confident | Tech-forward institutions | `family=Sora:wght@700;800` |
| Manrope | Approachable, rounded, warm | Friendly organisations | `family=Manrope:wght@700;800` |
| Space Grotesk | Distinctive, editorial | Bold agency aesthetic | `family=Space+Grotesk:wght@700` |

**Fonts to avoid for this project:**

| Font | Why Avoid |
|------|-----------|
| Roboto | Too generic — associated with Google Material, not premium |
| Open Sans | Feels dated (2010s corporate web) |
| Montserrat | Overused on student/nonprofit sites — no differentiation |
| Raleway | Elegant but too delicate for bold agency sections |
| Poppins | Common but acceptable fallback — lacks distinctiveness |
| Any serif (Playfair, Merriweather) | Wrong register — too academic/editorial for student council |

**Performance note:** Loading two Google Fonts families adds ~200–400 ms on first load (cached after). Use `display=swap` (already in URL pattern) and `preconnect` to mitigate. Load only the weights actually used — do not load all variants.

---

## What NOT to Use

### GSAP (GreenSock)
**Why not:** GSAP is a commercial library requiring a paid license for commercial use (the free tier has restrictions). More importantly, it is massive overkill — GSAP is designed for complex sequence animations and SVG manipulation. Our use case (fade-in on scroll, smooth scroll, basic hover transitions) is fully covered by AOS + Lenis + CSS transitions. GSAP would add ~100 KB+ dependency for no benefit.

**Confidence: HIGH** — this is a clear technical decision.

### ScrollMagic
**Why not:** Unmaintained (last major release 2020, minimal activity since). Relies on jQuery or GSAP as peer dependencies. Replaced in the ecosystem by Lenis + CSS scroll-driven animations.

### Animate.css (standalone, without scroll trigger)
**Why not:** Animate.css defines keyframe animations but does NOT handle scroll triggering. You would still need IntersectionObserver JS. Use AOS instead — it bundles the animation CSS and the scroll trigger logic together.

### jQuery
**Why not:** The existing codebase correctly uses zero jQuery. Do not add it. All required DOM operations are achievable with vanilla `querySelector`, `classList`, `addEventListener`. jQuery adds ~87 KB for no capability gain.

### Any CSS Framework (Bootstrap, Tailwind CDN)
**Why not:** The existing `style.css` is a well-designed custom system. Adding Bootstrap or Tailwind CDN would conflict with existing custom properties and introduce specificity battles. The project is too far along in custom CSS for a framework to help.

### Typed.js / Typewriter Libraries
**Why not:** The existing codebase already has a custom typewriter implementation in `script.js`. It has a known bug (desync after language change). Fix the existing implementation rather than adding a dependency. The fix is a 5-line change: clear the interval before re-initialising on language change.

### Motion One / Framer Motion
**Why not:** Both require ES modules and a build step. Incompatible with the no-bundler constraint.

---

## Complete CDN Reference

All links use jsDelivr (fast, reliable, privacy-respecting CDN — no personal data collected per their policy):

```html
<!-- AOS — Animate on Scroll -->
<!-- CSS: in <head> -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/aos@2.3.4/dist/aos.css">
<!-- JS: before </body> -->
<script src="https://cdn.jsdelivr.net/npm/aos@2.3.4/dist/aos.js"></script>

<!-- Lenis — Smooth Scroll (before </body>, after AOS) -->
<script src="https://cdn.jsdelivr.net/npm/lenis@latest/dist/lenis.min.js"></script>

<!-- Font Awesome 6 (if icon library needed — optional) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.1/css/all.min.css">
```

**Note on `@latest` tag:** Using `lenis@latest` in CDN URLs always pulls the newest release. This can break if a major version introduces breaking changes. For production stability, pin to a specific version (e.g. `lenis@1.1.14`). Verify the current latest at https://cdn.jsdelivr.net/npm/lenis/ before committing the version pin.

---

## Alternatives Considered

| Category | Recommended | Alternative | Why Not Chosen |
|----------|-------------|-------------|----------------|
| Scroll animations | AOS 2.3.4 | Sal.js, ScrollReveal | AOS has broader community, more animation types, direct upgrade path from existing code |
| Smooth scroll | Lenis | Native `scroll-behavior: smooth` | Lenis provides inertia/physics feel; native smooth is adequate fallback |
| Smooth scroll | Lenis | ScrollSmoother (GSAP) | Requires paid GSAP Club license for commercial use |
| Display font | Plus Jakarta Sans | Space Grotesk, DM Sans | Jakarta Sans blends with Inter most naturally |
| Animation approach | AOS + CSS | CSS scroll-driven only | CSS scroll-driven lacks Firefox/Safari coverage for entry animations |
| CSS architecture | Layer comments + BEM-lite | @layer | @layer is optional for single-file; adds complexity without clear benefit at current scale |

---

## Implementation Priority Order

1. **Install AOS via CDN** — replaces existing custom IntersectionObserver animation system; immediate visual upgrade with minimal code change
2. **Add Plus Jakarta Sans** — update Google Fonts link, set `--font-display`, apply to `h1` only; 30-minute change
3. **Extend CSS custom properties** — add easing vars, spacing scale; improves consistency across all animations
4. **Add Lenis** — smooth scroll for agency feel; test on mobile before committing (disable `smoothTouch`)
5. **CSS scroll progress bar** — one CSS keyframe + `animation-timeline: scroll()` as progressive enhancement
6. **Container queries on card grids** — progressive enhancement for better responsive behaviour
7. **@starting-style for mobile menu** — improves mobile menu entry animation quality

---

## Sources

- MDN Web Docs — `clamp()`: https://developer.mozilla.org/en-US/docs/Web/CSS/clamp (VERIFIED — Baseline widely available July 2020)
- MDN Web Docs — CSS Scroll-Driven Animations: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_scroll-driven_animations (VERIFIED — current, includes browser support detection snippet)
- MDN Web Docs — CSS Container Queries: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_container_queries (VERIFIED — page last updated March 2026, baseline widely available)
- MDN Web Docs — `@starting-style`: https://developer.mozilla.org/en-US/docs/Web/CSS/@starting-style (VERIFIED — Baseline 2024, newly available August 2024)
- MDN Web Docs — IntersectionObserver API: https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API (VERIFIED — Baseline widely available March 2019)
- AOS library CDN URL pattern — MEDIUM confidence (training knowledge, CDN URL structure standard)
- Lenis library CDN URL pattern — MEDIUM confidence (training knowledge, version number uncertain)
- Font pairing recommendations — MEDIUM confidence (design knowledge, not empirical A/B testing)
