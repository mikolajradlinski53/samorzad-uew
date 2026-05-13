# Domain Pitfalls

**Domain:** Agency-style student council website — static HTML/CSS/JS redesign
**Project:** Samorząd Studentów UEW
**Researched:** 2026-05-13
**Confidence:** HIGH (Netlify Forms from official docs; CSS/animation/a11y from MDN; HTML specifics from codebase direct inspection)

---

## Critical Pitfalls

Mistakes that cause rewrites, data loss, or features that silently never work.

---

### Pitfall C1: Netlify Forms — Form Not Detected at Build Time

**What goes wrong:** The contact form gets the `data-netlify="true"` attribute added, but Netlify never registers it. Submissions go nowhere and no error is shown. The form "works" locally but silently fails in production.

**Why it happens:** Netlify's build bot parses your HTML statically at deploy time to detect forms. If the `<form>` tag is not present in the HTML at build time — or if form detection is not enabled in the Netlify UI — the form is simply not registered. Since the current form has no backend integration at all (`id="contactForm"` with JS intercepting submit), the entire integration must be rebuilt, not just patched.

**Specific to this codebase:** `index.html` line 339 — the form has `id="contactForm"` and no `method`, no `action`, no `data-netlify`. The JS in `script.js` intercepts `submit` and fakes success. The `method="POST"` and `data-netlify="true"` attributes are absent. Netlify Forms will not detect it.

**Consequences:**
- Users submit the form and see "Dziękujemy! Odpiszemy wkrótce." — but nothing was sent.
- No submissions appear in Netlify dashboard.
- No notification emails are sent to the council.
- This is already happening in production today.

**Prevention:**
1. Enable form detection in Netlify UI: Site settings > Forms > Enable form detection.
2. Add `method="POST"` and `data-netlify="true"` to the `<form>` tag.
3. Add `name="contact"` attribute to the `<form>` tag (unique name required).
4. Add hidden input: `<input type="hidden" name="form-name" value="contact" />`.
5. Add honeypot field: `netlify-honeypot="bot-field"` on the form + hidden input named `bot-field`.
6. Remove the JavaScript that intercepts submission and fakes success. Either use standard form POST (redirect to `action="/success.html"`) or rewrite as AJAX with `fetch()` sending URL-encoded body (not JSON).
7. If using AJAX: encode with `URLSearchParams`, set `Content-Type: application/x-www-form-urlencoded`, include `form-name` field in body.

**Warning signs:**
- No submissions appear in Netlify dashboard after testing
- Form has no `method` attribute
- Form has no `data-netlify="true"` or `netlify` attribute
- JavaScript calls `e.preventDefault()` and manually shows success without making a real HTTP request

**Phase:** Bug-fix phase / Form integration phase (first priority, blocks trust in the site)

---

### Pitfall C2: Inline Styles Making Redesign Non-Atomic — Visual Regressions

**What goes wrong:** During redesign, some styles are updated in `style.css` but the inline `style=""` attributes on HTML elements override them silently. The redesign appears broken in places for no obvious reason. Developers keep finding exceptions they have to patch one by one.

**Why it happens:** CSS specificity. An inline style has specificity `(1,0,0,0)` — higher than any class or element rule. Any rule in `style.css` targeting `.logo-icon`, `.footer-logo img`, etc. will be silently overridden by the inline style. The codebase has this pattern on at least every instance of `logo_2.png` (lines 43, 403 in index.html, and equivalent in all 6 HTML files) as well as social links, contact items, and the hero section.

**Specific to this codebase:** The hero section's entire layout is defined in a `<style>` block inside `<head>` (index.html lines 12–35) rather than in `style.css`. This block will conflict with any redesign stylesheet additions. The `style=""` on logo `<img>` tags appears at least 12 times across 6 HTML files — each must be found and removed individually.

**Consequences:**
- Redesign changes in `style.css` don't visually take effect — appears as if the stylesheet is wrong.
- Every visual regression requires hunting through HTML files, not just CSS.
- Six HTML files must all be updated consistently — missing one creates inconsistency.

**Prevention:**
1. Before touching design, audit all inline styles: `grep -n 'style="' *.html` — produces the full list.
2. Move the hero `<style>` block from `index.html` `<head>` into `style.css` before any redesign work.
3. Extract each inline style to a named CSS class. Do this as a dedicated commit before redesign changes begin.
4. Use a linting pass (even manual review) to confirm no `style=""` attributes remain after extraction.

**Warning signs:**
- CSS change doesn't visually change the element
- DevTools shows the rule is overridden by `element.style`
- Multiple HTML files need to be edited for a single visual change

**Phase:** Foundation / Tech debt cleanup phase — must precede visual redesign

---

### Pitfall C3: Subpage Navigation Links Break After Structural Changes

**What goes wrong:** Navbar links on subpages stop working after any file rename, directory restructuring, or section ID change. Currently `aktualnosci.html` uses `href="aktualnosci.html"` as the "Aktualności" link in its own navbar (self-link), and `href="index.html#kontakt"` for the contact section. Any section ID renamed during redesign silently breaks these cross-page hash links.

**Why it happens:** Hash fragment navigation (`page.html#section-id`) requires the target element to have that exact `id` on the destination page. If a section's `id` is changed during redesign — e.g., `id="aktualnosci"` renamed to `id="news"` for the English version — all 6 HTML files' navbar links must also be updated. There's no build step to catch broken links.

**Specific to this codebase (confirmed):** `index.html` navbar uses `href="#aktualnosci"` (hash-only, works on homepage). `aktualnosci.html` navbar uses `href="aktualnosci.html"` — this will scroll to top, not jump to section. Subpages do NOT universally point back to `index.html#section`. The inconsistency is already present.

**Consequences:**
- Clicking "Kontakt" from a subpage works, but clicking "Aktualności" from `aktualnosci.html` just reloads the same page without section focus.
- During redesign, if section IDs are renamed, silent breakage across all files.
- No 404 error — links just land on wrong place.

**Prevention:**
1. Establish a single navigation convention before redesign: subpage navbars always use `index.html#section-id` for sections, and page names (`aktualnosci.html`) for page links.
2. Never rename a section `id` without doing a global find-and-replace across all HTML files.
3. Keep a map of `id` → page in a comment block or the ARCHITECTURE doc.
4. Consider a `netlify.toml` redirect rule for the future to handle any URL changes.

**Warning signs:**
- Clicking a nav link from a subpage reloads current page
- `href` starts with `#` in a subpage navbar (should start with `index.html#`)
- Section IDs differ between index.html and the nav links pointing to them

**Phase:** Foundation phase — fix before any structural work

---

## Critical Pitfalls (Performance)

---

### Pitfall P1: Animation-Triggered Layout Shifts (CLS) from Font Swap

**What goes wrong:** Adding `&display=swap` to Google Fonts (the correct fix for FOIT) introduces a different problem: when Inter loads, it replaces the system fallback font. If the fallback has different line metrics, every text block reflowed, causing measurable CLS (Cumulative Layout Shift). On a hero section with large type and animated counters, this shift is visible and jarring.

**Why it happens:** `font-display: swap` has an "infinite swap period" — the font can arrive late and swap at any point. System fonts (Arial, Helvetica, system-ui) have different character widths and line heights than Inter. Text reflows on swap, shifting all content below it.

**Specific to this codebase:** `aktualnosci.html` line 6 — the font link has no `&display=swap` (confirmed in CONCERNS.md). So those subpages have FOIT (text invisible for up to 3s). The fix is adding `display=swap`, but then CLS must also be addressed.

**Consequences:**
- Without `display=swap`: FOIT — text invisible for 3 seconds (bad UX, bad LCP score).
- With `display=swap` but no fallback metrics tuning: CLS — content visually shifts when font loads (bad Core Web Vitals, unprofessional agency-style impression).

**Prevention:**
1. Add `&display=swap` to all font links (required on all 6 HTML files).
2. Add `size-adjust`, `ascent-override`, `descent-override` to the fallback font in `@font-face` declarations to match Inter's metrics. Use tools like `fontaine` or the Google Fonts CSS customizer to generate the overrides.
3. Alternatively, self-host Inter with `@font-face` pointing to local WOFF2 files — eliminates CDN latency and gives full control over `font-display`.
4. Consolidate all 6 HTML files to use one consistent font link — currently inconsistent (CONCERNS.md confirms subpages may differ).

**Warning signs:**
- Lighthouse CLS score above 0.1
- Text visually jumps when page loads on a slow connection
- `font-display` not present in the font link URL
- Subpages have different `<link>` tags for fonts than the homepage

**Phase:** Foundation / Performance pass — fix font loading before visual redesign adds more text-heavy layouts

---

### Pitfall P2: Scroll-Based Animations Causing Jank on Mobile

**What goes wrong:** The existing scroll event listener fires on every pixel of scroll with no throttling. Adding more agency-style scroll animations (parallax, sticky elements, reveal effects) on top of this pattern creates 100+ function calls per second on mobile scroll, dropping below 60fps.

**Why it happens:** `scroll` events are synchronous with the main thread. Without throttling via `requestAnimationFrame` or debouncing, and without using IntersectionObserver for reveal effects, every scroll pixel triggers layout reads (`scrollY`, `getBoundingClientRect`) which force style recalculation.

**Specific to this codebase:** `script.js` line 250 — raw scroll listener for navbar. CONCERNS.md confirms "No throttling or debouncing on scroll events." The `.fade-up` threshold is `0.12` (12% visible) — animations trigger when barely on screen, which means fast scroll users see them flicker in.

**Safe animation properties (compositor-only, GPU-accelerated, confirmed MDN):**
- `transform` (translate, scale, rotate) — safe
- `opacity` — safe
- Everything else (`width`, `height`, `top`, `left`, `margin`, `padding`, `background`) — triggers layout/paint, causes jank

**Prevention:**
1. All scroll-triggered effects must use `transform` and `opacity` only — no `height`, `top`, `left`, `margin` changes in animations.
2. Replace raw scroll listener for navbar with a throttled version using `requestAnimationFrame`.
3. Increase IntersectionObserver threshold from `0.12` to `0.25`–`0.5` so animations trigger when element is meaningfully visible.
4. Never use CSS `left`/`top` for parallax — use `transform: translateY()` instead.
5. Add `will-change: transform` dynamically (via JS on `mouseenter`/`animationstart`) only for elements actively animating — not statically in CSS for all elements.

**Warning signs:**
- DevTools Performance panel shows long tasks during scroll
- Animations stutter on mid-range Android devices
- CSS rules use `top`, `left`, `margin-top` inside `@keyframes`
- `will-change: transform` appears in stylesheet on many elements (overuse)

**Phase:** Visual redesign phase — enforce before adding any new scroll effects

---

### Pitfall P3: Overusing `will-change` During Redesign

**What goes wrong:** Developers add `will-change: transform` to cards, sections, and animated elements across the stylesheet as a performance "optimization." On a page with 20+ cards, this allocates 20+ GPU layers simultaneously, consuming more memory than it saves and slowing down the page.

**Why it happens:** `will-change` is commonly misunderstood as a universal performance booster. The MDN spec is explicit: "Don't apply will-change to elements to perform premature optimization."

**Prevention:**
1. Do not add `will-change` to any element in `style.css` statically.
2. Apply dynamically in JS only: set `will-change: transform` on `mouseenter`, remove on `animationend` or `mouseleave`.
3. If using it statically, restrict to no more than 2–3 elements that are continuously animating (e.g., the hero background circles).

**Warning signs:**
- `will-change` appears 5+ times in `style.css`
- Applied to card grids or list items
- Applied via `.fade-up` class that's used on every section

**Phase:** Visual redesign phase — review when adding new animated components

---

## Moderate Pitfalls

---

### Pitfall M1: Mobile Menu Stays Open — Touch UX Failure

**What goes wrong:** The hamburger menu opens but doesn't close when the user scrolls or taps a link that navigates to a section on the same page (index.html hash links). On mobile, users tap a nav link, the page jumps to the section, but the menu overlay stays open and covers half the screen.

**Specific to this codebase:** CONCERNS.md confirms this bug explicitly — "Mobile hamburger menu stays open when user scrolls." The mobile menu uses click handlers set on each link element via `querySelectorAll` inside `initNavbar()` — this pattern leaks memory on content updates and may not reliably fire on touch.

**Prevention:**
1. Add `window.addEventListener('scroll', () => mobileMenu.classList.remove('open'), { passive: true })`.
2. Use event delegation: one click handler on the `.mobile-menu` container, not individual links.
3. Close menu on hash-link click: detect `href.startsWith('#')` or `href.includes('#')` and close before navigation.
4. Test on actual iOS Safari — mobile Chrome and iOS Safari handle touch events differently for scroll detection.

**Warning signs:**
- Menu overlay visible after tapping a nav link
- JavaScript uses `querySelectorAll('.mobile-menu a').forEach` to attach click handlers
- No `passive: true` on scroll listeners (performance hint)

**Phase:** Mobile UX pass — treat as part of the known bugs milestone

---

### Pitfall M2: Touch Targets Too Small for Agency-Style Designs

**What goes wrong:** Redesigns inspired by agency portfolios feature small, spaced-out UI elements optimized for mouse hover. On mobile (touch targets < 44×44px per WCAG 2.5.5), users repeatedly mis-tap — hitting the wrong link, missing buttons, or triggering adjacent elements.

**Why it happens:** Agency designs are often designed desktop-first on high-DPI retina screens where everything looks large. A `24px` icon looks fine at 2× DPI but has only a `12px` physical tap area.

**Prevention:**
1. All interactive elements (buttons, links, hamburger icon) must have a minimum `44×44px` tappable area — use `min-height: 44px; min-width: 44px` or padding to achieve this without changing visual size.
2. Language toggle buttons (`PL`/`EN`) are a specific risk — currently small, must be checked.
3. Social link icons in footer (currently `f`, `ig`, `tt`, `in` text as links) are likely too small.

**Warning signs:**
- Lighthouse mobile audit flags "Tap targets too small"
- Buttons or links have `height < 44px` without compensating padding
- Social icons are bare `<a>` tags with minimal padding

**Phase:** Mobile UX pass / visual redesign

---

### Pitfall M3: Typewriter Effect Breaks After Language Switch

**What goes wrong:** Switching language while the typewriter is mid-cycle leaves a partial word from the previous language visible, then either freezes or continues cycling wrong words.

**Specific to this codebase:** CONCERNS.md is precise — `applyLang()` updates i18n but does not call `initTypewriter()`. The old interval keeps running with the old words array. The fix is: in `applyLang()`, clear the existing typewriter interval (store it in a module-scoped variable), then call `initTypewriter()` with the new language's words.

**Risk during redesign:** If the typewriter is redesigned (new animation library, CSS animation instead of JS, new HTML structure), the language-switch sync must be re-verified. It is easy to re-introduce this bug when the animation system changes.

**Prevention:**
1. Store the typewriter interval ID in a module-scoped variable (e.g., `let typewriterInterval = null`).
2. In `applyLang()`: `clearInterval(typewriterInterval); initTypewriter();`.
3. Write the fix before redesigning the hero, not after — so the redesign can be built on the correct behavior.
4. Test the fix manually: change language while typewriter is mid-word, verify it restarts cleanly.

**Warning signs:**
- Language switch shows partial word from previous language
- `initTypewriter` is not called inside `applyLang`
- Typewriter interval stored only in function scope (cannot be cleared externally)

**Phase:** Bug fix phase — fix before redesigning hero section

---

### Pitfall M4: Accessibility — Focus States Removed by CSS Reset

**What goes wrong:** During redesign, a CSS reset or `* { outline: none; }` rule is added to eliminate browser default focus rings (which look ugly on agency designs). This removes all visible keyboard focus indicators, making the site completely unusable for keyboard-only users and failing WCAG 2.1 SC 2.4.7 (Focus Visible).

**Why it happens:** Default browser focus rings are visually inconsistent across browsers and look wrong on custom designs. Designers suppress them without providing replacements. This is one of the single most common accessibility failures in redesigns.

**Prevention:**
1. Never use `outline: none` or `outline: 0` without an immediate `outline` replacement.
2. Use `:focus-visible` instead of `:focus` for custom styling — this only shows the ring for keyboard users, not mouse users: `a:focus-visible, button:focus-visible { outline: 2px solid var(--primary); outline-offset: 3px; }`.
3. The correct pattern for removing default ring while preserving accessibility: `:focus { outline: none; } :focus-visible { outline: 2px solid var(--primary); outline-offset: 3px; }`.
4. Run Lighthouse accessibility audit and axe browser extension after every major CSS change.

**Warning signs:**
- `outline: none` anywhere in `style.css` without a `:focus-visible` companion rule
- Tabbing through the page shows no visible indicator of current focus
- Lighthouse accessibility score drops after a redesign commit

**Phase:** Visual redesign phase — enforce as a rule from the start, not as a retrofit

---

### Pitfall M5: Form Labels Not Associated with Inputs

**What goes wrong:** The contact form uses `<label>` elements but they are not properly associated with their `<input>` elements via `for`/`id` pairing or wrapping. Screen readers cannot connect the label to the field, so users hear "edit text" instead of "Imię i nazwisko, edit text."

**Specific to this codebase:** `index.html` lines 341–358 — `<label data-i18n="contact_name">` has no `for` attribute. The `<input>` has no `id`. They are visually adjacent but not programmatically associated. This fails WCAG 2.1 SC 1.3.1 (Info and Relationships) and SC 4.1.2 (Name, Role, Value).

**Prevention:**
1. Every `<label>` must have `for="field-id"` that matches the `id` of its `<input>` or `<textarea>`.
2. Or: wrap the input inside the label (`<label>Name <input type="text" /></label>`).
3. Form error messages (`.form-error` divs) must be linked to their input via `aria-describedby`.
4. The success message (`#formSuccess`) must have `role="alert"` or `aria-live="polite"` so screen readers announce it on appearance.

**Warning signs:**
- `<label>` elements have no `for` attribute
- `<input>` elements have no `id` attribute
- Clicking a label doesn't focus the corresponding input (easy manual test)

**Phase:** Bug fix phase / form integration — fix at the same time as Netlify Forms integration

---

### Pitfall M6: Color Contrast Failures on Muted Text and Hover States

**What goes wrong:** Agency-style designs favor light gray text on white backgrounds for secondary content (captions, labels, timestamps). During redesign, new color variables are introduced and text using `var(--text-muted)` or similar may fall below the 4.5:1 contrast ratio required by WCAG 2.1 SC 1.4.3 (Contrast Minimum).

**Prevention:**
1. Run every new text color through a contrast checker (WebAIM Contrast Checker or browser DevTools accessibility panel) before committing.
2. For body text: minimum 4.5:1 against its background.
3. For large text (18pt / 24px or 14pt bold / ~18px bold): minimum 3:1.
4. Check hover states — if a button changes text color on hover to something lighter, that hover state must also pass contrast.
5. Set up a CSS custom property convention: `--text-primary` for body text (always high contrast), `--text-secondary` for secondary (verify), `--text-disabled` for disabled states only (exempt from contrast requirement).

**Warning signs:**
- Light gray text on white (e.g., `color: #999; background: #fff` = ~2.85:1 — fails)
- Placeholder text styled with low opacity (`opacity: 0.5`)
- Hover states that lighten text color

**Phase:** Visual redesign phase — check every new color value as it is introduced

---

## Minor Pitfalls

---

### Pitfall m1: Polish Diacritics — Charset Must Be First in `<head>`

**What goes wrong:** If `<meta charset="UTF-8">` is placed after other tags (CSS links, scripts, other meta) in `<head>`, browsers may have already begun character interpretation using a default encoding before encountering the charset declaration. Polish characters (ą, ć, ę, ł, ń, ó, ś, ź, ż) render as garbled sequences (`Ä…`, `Ä‡`, etc.).

**Specific to this codebase:** `index.html` line 4 has `<meta charset="UTF-8">` as the first tag in `<head>` — correct. `aktualnosci.html` line 4 compresses it to `<meta charset="UTF-8"><meta name="viewport"...>` on one line — still correct. The spec requires it within the first 1024 bytes of the document. Currently compliant; must stay that way during any HTML restructuring.

**Prevention:**
1. `<meta charset="UTF-8">` must always be the very first tag inside `<head>`, before any `<link>`, `<script>`, or other `<meta>` tags.
2. Ensure all HTML files are saved as UTF-8 in the editor. In VS Code: bottom-right corner shows encoding; set to "UTF-8" not "UTF-8 with BOM."
3. Server must send `Content-Type: text/html; charset=utf-8` header. On Netlify, this is automatic for `.html` files — no action needed.

**Warning signs:**
- Polish characters appear as `Ã³`, `Ä™`, etc. in the browser
- Text editor shows "UTF-8 with BOM" or "Windows-1250" encoding
- Charset declaration is not the first element in `<head>`

**Phase:** Foundation — verify once, enforce as a code review checklist item

---

### Pitfall m2: HTML `lang` Attribute Missing or Wrong on Subpages

**What goes wrong:** Screen readers use the `<html lang="pl">` attribute to select the correct pronunciation dictionary. If the language attribute is `lang="en"` on a Polish page (or absent), screen readers read Polish text with English phonetics, making it incomprehensible for blind users using screen readers with Polish TTS.

**Specific to this codebase:** `index.html` line 2 has `<html lang="pl">` — correct. Language switching is done via JavaScript but does NOT update the `<html lang="">` attribute. When a user switches to English, `lang="pl"` remains, and screen readers still announce English text in Polish.

**Prevention:**
1. In `applyLang()`, add: `document.documentElement.lang = lang;` — updates `<html lang="">` dynamically.
2. All HTML files must have `<html lang="pl">` to start.
3. When new pages are created during redesign, template the `lang` attribute in from the beginning.

**Warning signs:**
- Language toggle works visually but `document.documentElement.lang` doesn't change
- Subpage HTML files have no `lang` attribute or have `lang="en"` by default

**Phase:** Bug fix phase / accessibility pass

---

### Pitfall m3: Hardcoded Polish Text in `<meta>` Descriptions Not Updated During Language Switch

**What goes wrong:** `<meta name="description">` is hardcoded in Polish on all pages. This is fine for SEO (target audience is Polish students). However, if the redesign introduces server-side routing or generates separate English URLs in the future, meta descriptions must also be translated. More immediately: Open Graph tags (`og:title`, `og:description`) are likely absent entirely, meaning social media shares show raw title text.

**Prevention:**
1. For now: keep meta description in Polish — acceptable for a Polish student council site.
2. Add Open Graph meta tags to all pages during redesign: `og:title`, `og:description`, `og:image`, `og:url`, `og:locale` (use `pl_PL`).
3. Do not add `og:locale:alternate` for English unless separate English URLs are created.

**Warning signs:**
- Links shared to Facebook/WhatsApp show no preview image or description
- `og:image` not present in `<head>` on any page

**Phase:** SEO / meta pass — low priority but quick win during redesign

---

### Pitfall m4: `netlify.toml` Redirect Rules Must Be Set Before Going Live

**What goes wrong:** If any existing URLs are bookmarked or indexed by search engines (even the current basic site), changing filenames during redesign without redirect rules breaks those URLs permanently. Netlify serves 404 with no guidance.

**Specific to this codebase:** The site currently has `aktualnosci.html`, `zarzad.html`, `projekty.html`, `strefa-studenta.html`, `wydarzenia.html`. If the redesign renames any of these (e.g., to English equivalents or cleaner slugs), those old URLs break.

**Prevention:**
1. Maintain all existing filenames. Do not rename HTML files during the redesign.
2. If a rename is necessary, add a redirect in `netlify.toml`:
   ```toml
   [[redirects]]
     from = "/old-name.html"
     to = "/new-name.html"
     status = 301
   ```
3. Add a `404.html` page to handle any broken links gracefully.

**Warning signs:**
- Renamed HTML file without a corresponding redirect rule
- No `netlify.toml` or no `[[redirects]]` section
- No `404.html` in the repository root

**Phase:** Foundation — establish redirect policy before touching filenames

---

### Pitfall m5: `prefers-reduced-motion` Not Respected

**What goes wrong:** The site has multiple continuous animations — hero background circles (`float` keyframe), scroll reveal (`fade-up`), counter animation, typewriter effect, bounce indicator. Users with vestibular motion disorders (affecting ~35% of adults over 40) who have enabled "Reduce Motion" in their OS settings experience all of these animations regardless, potentially causing dizziness or nausea.

**Prevention:**
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```
This single rule disables all animations globally for affected users. Add it to `style.css`. The typewriter effect (JS-driven) also needs a guard: check `window.matchMedia('(prefers-reduced-motion: reduce)').matches` and skip animation if true.

**Warning signs:**
- No `prefers-reduced-motion` media query anywhere in `style.css`
- Typewriter and counter JS animations run without checking media query
- Hero section has continuous looping animations

**Phase:** Visual redesign phase — add as a global rule when adding new animations

---

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|----------------|------------|
| Tech debt / inline style cleanup | C2: Specificity conflicts — CSS changes don't apply | Extract all inline styles to classes before writing any new CSS |
| Netlify Forms integration | C1: Form not detected, silent failure | Read official docs setup flow in full; test with real deploy, not localhost |
| Hero section redesign | P1: Font CLS shifts hero text | Fix font-display + metric override before styling hero |
| Adding scroll animations | P2: Scroll jank on mobile | Use only `transform`/`opacity`; throttle scroll listeners |
| Mobile nav redesign | M1: Menu stays open on scroll | Add passive scroll listener to close menu; use event delegation |
| Form redesign | M5: Labels not associated | Add `for`/`id` pairs; `role="alert"` on success message |
| Any new CSS additions | M4: Focus rings removed | Never use `outline: none` without `:focus-visible` replacement |
| Adding new color palette | M6: Contrast failures | Check every `--text-*` variable with contrast tool before committing |
| Any HTML file restructuring | m1: Charset position | Keep `<meta charset>` as first element in `<head>` |
| Language system | m2: `lang` attribute not updated | `document.documentElement.lang = lang` in `applyLang()` |
| Adding new animations | m5: Reduced motion ignored | Add `prefers-reduced-motion` block once, covers all animations |
| File renames | m4: URLs break with no redirect | Maintain all filenames; use `netlify.toml` redirects if rename needed |

---

## Sources

- Netlify Forms Setup: https://docs.netlify.com/forms/setup/ (OFFICIAL — HIGH confidence)
- Netlify Forms Spam Filters: https://docs.netlify.com/forms/spam-filters/ (OFFICIAL — HIGH confidence)
- MDN: CSS Animations Performance: https://developer.mozilla.org/en-US/docs/Web/Performance/CSS_JavaScript_animation_performance (HIGH confidence)
- MDN: `will-change`: https://developer.mozilla.org/en-US/docs/Web/CSS/will-change (HIGH confidence)
- MDN: `font-display`: https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-display (HIGH confidence)
- MDN: `prefers-reduced-motion`: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion (HIGH confidence)
- MDN: Keyboard Accessibility / Focus States: https://developer.mozilla.org/en-US/docs/Web/Accessibility/Understanding_WCAG/Keyboard (HIGH confidence)
- MDN: ARIA Form Role: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/form_role (HIGH confidence)
- MDN: Anchor href pitfalls: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a (HIGH confidence)
- MDN: Meta charset: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta (HIGH confidence)
- Direct codebase inspection: index.html, aktualnosci.html, script.js, style.css, .planning/codebase/CONCERNS.md (HIGH confidence — primary source)
