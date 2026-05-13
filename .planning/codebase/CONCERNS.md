# Codebase Concerns

**Analysis Date:** 2026-05-13

## Tech Debt

**Inline CSS in HTML:**
- Issue: Heavy use of inline `style` attributes directly in HTML tags rather than CSS classes
- Files: `index.html`, `aktualnosci.html`, `zarzad.html`, `projekty.html`, `strefa-studenta.html`, `wydarzenia.html`
- Examples: Lines 12-15 in `index.html` (hero section), lines 43, 101-102 in `aktualnosci.html`
- Impact: Violates separation of concerns, makes styling difficult to maintain and refactor, prevents consistent style changes
- Fix approach: Extract all inline styles to CSS classes in `style.css`, use semantic class names like `.logo-icon-container`, `.link-button-ghost`

**Hardcoded Translation Keys Without Fallback:**
- Issue: Translation system in `script.js` assumes all keys exist; missing keys fail silently
- Files: `script.js` (lines 209-230), all HTML pages
- Pattern: `if (i18n[lang] && i18n[lang][key]) { ... }` has no fallback value or console warning
- Impact: If translation keys are missing, UI shows blank text rather than default language
- Fix approach: Add fallback logic to display English or Polish default when translation missing; log missing keys to console in development

**No Error Handling in Contact Form:**
- Issue: Contact form in `index.html` (lines 339-398) has no backend service integration
- Files: `index.html` (form), `script.js` (lines 353-398)
- Impact: Form submission just hides form and shows success message without sending data anywhere; users believe their message was sent when it wasn't
- Fix approach: Implement backend endpoint to receive form data, send emails, and proper error handling for network failures

**Hardcoded Data Instead of Dynamic Content:**
- Issue: All content (news, events, board members, projects) is hardcoded in HTML
- Files: `aktualnosci.html`, `zarzad.html`, `projekty.html`, `strefa-studenta.html`, `wydarzenia.html`
- Examples: News cards (lines 47-83 in `aktualnosci.html`), board members (lines 48-51 in `zarzad.html`)
- Impact: Any content update requires manual HTML editing and redeployment; no version control for content changes; no CMS capability
- Fix approach: Migrate to JSON data files or headless CMS; load content dynamically with JavaScript

**Placeholder Partner Logos:**
- Issue: Partner section has generic placeholder text instead of actual logos
- Files: `index.html` (lines 316-326)
- Impact: Unprofessional appearance; no way to upload or manage partner images
- Fix approach: Create partner management system or at minimum use image placeholders and documented image placement guide

## Known Bugs

**Typewriter Effect Language Mismatch:**
- Symptoms: Typewriter effect doesn't sync with language toggle correctly on first load
- Files: `script.js` (lines 400-439)
- Trigger: Change language while on homepage hero section
- Code issue: `applyLang()` (line 201) updates i18n but doesn't trigger `initTypewriter()` to reinitialize with new language words
- Workaround: Reload page after language change
- Fix approach: Call `initTypewriter()` after language change in `applyLang()` function, clear existing interval first

**Navigation to Same Page on Subpages:**
- Symptoms: Links in navbar/footer on subpages link to sections that don't exist (e.g., `aktualnosci.html#aktualnosci`)
- Files: `aktualnosci.html` line 14, `zarzad.html` line 16, `projekty.html` line 18, etc.
- Impact: Navigation links don't work as expected from subpages
- Fix approach: Update subpage navbar links to use `index.html#section-id` format or handle same-page navigation

**Form Success Message Never Clears:**
- Symptoms: Once contact form is submitted, success message stays visible permanently
- Files: `script.js` (lines 389-396)
- Trigger: Submit contact form
- Impact: Users can't refill the form or know that form was reset
- Fix approach: Reset form and make success message dismissible with timeout to re-show form after 3-5 seconds

**Counter Animation Triggers Multiple Times:**
- Symptoms: Stat counters may animate multiple times if intersection observer is not properly unobserved
- Files: `script.js` (lines 328-347)
- Code: `observer.unobserve()` called after counter animation, but timing may cause double triggers
- Fix approach: Test on slow networks; add flag to prevent re-animation if already triggered

**Mobile Menu Doesn't Close on Scroll:**
- Symptoms: Mobile hamburger menu stays open when user scrolls the page
- Files: `script.js` (lines 241-281) and `style.css` (lines 117-124)
- Impact: Poor UX on mobile; menu blocks content after scroll
- Fix approach: Add `window.addEventListener('scroll', () => { mobileMenu.classList.remove('open'); })` to `initNavbar()`

## Security Considerations

**No CORS/Content Security Policy Headers:**
- Risk: External font loading from googleapis.com without CSP could be vulnerable to injection attacks
- Files: All HTML files load fonts from `https://fonts.googleapis.com` and `https://fonts.gstatic.com`
- Current mitigation: None detected
- Recommendations: Add CSP headers on server: `Content-Security-Policy: font-src https://fonts.googleapis.com https://fonts.gstatic.com`

**Contact Form Email Not Validated Server-Side:**
- Risk: Email format validated only with client-side regex `.+@.+\..+` (line 375 in `script.js`)
- Files: `script.js` (line 375), `index.html` (line 347)
- Current mitigation: Client-side validation exists
- Recommendations: Implement server-side email validation, rate limiting on contact form submissions, CAPTCHA or honeypot field

**No Input Sanitization:**
- Risk: Contact form textarea could accept malicious content if backend processes it
- Files: `index.html` (line 357 - contact message textarea)
- Current mitigation: None (frontend only)
- Recommendations: Add HTML sanitization library if displaying user content; server-side validation and sanitization required

**Hardcoded Contact Email Exposed:**
- Risk: Email address `kontakt@samorzad.ue.wroc.pl` (line 377 in `index.html`) visible in HTML source
- Files: `index.html` (line 377)
- Impact: Email harvested by bots for spam
- Recommendations: Obfuscate email in source (show contact form instead), use `mailto:` with JavaScript decoding

**No SSL/HTTPS Enforcement:**
- Risk: Site loaded without SSL serves data over unencrypted connection
- Files: All pages
- Current mitigation: External Google Fonts use HTTPS, but no site-level enforcement visible
- Recommendations: Enforce HTTPS with server headers (`Strict-Transport-Security`), use HTTPS for all links

## Performance Bottlenecks

**Unoptimized Google Fonts Loading:**
- Problem: Two separate Google Fonts requests (lines 8-9, 6 in `aktualnosci.html`) load same font family without font-display optimization
- Files: `index.html`, all subpages
- Cause: No `&display=swap` parameter on older subpage font links (checked subpages)
- Impact: FOIT (Flash of Invisible Text) - text invisible for 3s while fonts load
- Improvement path: Add `&display=swap` to all font links, consider system font as fallback, consolidate to single font request if possible

**Multiple Scroll Event Listeners:**
- Problem: Navbar scroll listener (line 250 in `script.js`) fires on every scroll pixel
- Files: `script.js` (line 250)
- Cause: No throttling or debouncing on scroll events
- Impact: Performance degradation on low-end devices, battery drain on mobile
- Improvement path: Implement throttle function (e.g., max fire every 100ms) using `requestAnimationFrame`

**Intersection Observer Threshold Too Low:**
- Problem: `.fade-up` animation observer has `threshold: 0.12` (line 296 in `script.js`)
- Files: `script.js` (line 296), `style.css` (lines 145-149)
- Impact: Animations trigger when element 12% visible, creating jittery perceived performance
- Improvement path: Increase threshold to 0.5 for smoother animation start behavior

**No Image Optimization:**
- Problem: `logo_2.png` referenced in multiple places with inline size attributes
- Files: All HTML files (e.g., lines 43, 403)
- Cause: PNG format not optimized, no srcset for responsive images
- Impact: Large file size unnecessarily increases page weight
- Improvement path: Convert to SVG for logo, use WebP with PNG fallback, add responsive images

**Animation Duration Hardcoded:**
- Problem: Counter animation duration hardcoded to 1800ms (line 304 in `script.js`)
- Files: `script.js` (line 304)
- Impact: Slow on high-speed networks, jarring on mobile data
- Improvement path: Calculate duration based on viewport or network speed using `navigator.connection`

## Fragile Areas

**Translation System Not Scalable:**
- Files: `script.js` (lines 2-195)
- Why fragile: 194 lines of inline JSON; adding new language requires editing massive object; no validation of key completeness
- Safe modification: Use external JSON files for translations, import with module system, create TypeScript types for translation keys
- Test coverage: No tests for missing keys, no integration tests for language switching
- Risk: Missing translations discovered only in production when user switches language

**Global Language State Using localStorage:**
- Files: `script.js` (line 198)
- Why fragile: Direct localStorage mutation without versioning; if format changes, users get stuck with old format
- Safe modification: Add migration logic when localStorage is accessed, validate stored value
- Test coverage: No tests for localStorage edge cases (quota exceeded, private browsing)
- Risk: Language setting could break permanently for users if localStorage schema changes

**Navbar Scroll State Not Synchronized:**
- Files: `script.js` (lines 241-281), `style.css` (lines 90-94)
- Why fragile: `.scrolled` class added/removed but not cleared on page reload; inconsistent state between pages
- Safe modification: Check navbar scroll state on DOMContentLoaded, sync with actual scroll position
- Test coverage: No tests for navbar state on different page navigations
- Risk: Navbar appears unstyled (no background) on page load if user already scrolled

**Hard-Coded Delay Values Scattered:**
- Files: `script.js` (lines 296 cycleInterval=2800, line 304 duration=1800, line 342 threshold=0.5)
- Why fragile: Magic numbers make code hard to understand and refactor consistently
- Safe modification: Create `const CONFIG = { ... }` object at top of file with all timing values
- Test coverage: No tests for animation timing
- Risk: Changing animation behavior requires hunting through code for all timing values

**Mobile Menu Click Handler Memory Leak:**
- Files: `script.js` (lines 266-270)
- Why fragile: `querySelectorAll` inside `initNavbar()` gets old references if HTML reloads or content changes
- Safe modification: Use event delegation: single click handler on `.mobile-menu` parent instead of individual link handlers
- Test coverage: No tests for mobile menu behavior
- Risk: Reopened menu links don't work; memory builds up on dynamic content updates

## Scaling Limits

**Single HTML Files for Each Page:**
- Current capacity: 6 main pages (index, aktualnosci, zarzad, projekty, strefa-studenta, wydarzenia)
- Limit: Adding new pages requires new HTML file, duplicating navbar/footer code 6 times
- Scaling path: Implement templating engine (EJS, Handlebars, 11ty) or component-based framework (React, Vue) to generate pages from templates

**All Content Hardcoded in HTML:**
- Current capacity: ~50 content items (news, events, board members, projects, sections)
- Limit: Adding 100+ items makes HTML files unmaintainable (10KB+ files)
- Scaling path: Move content to JSON/database, implement pagination/filters, create admin interface

**No Admin Interface:**
- Current capacity: Manual edits by developers only
- Limit: Non-technical staff can't update content, news, or events
- Scaling path: Create headless CMS integration (Strapi, Contentful) or simple Node.js admin panel

**Storage for Partner Logos:**
- Current capacity: 8 placeholder partners
- Limit: No image upload system; adding real logos requires manual HTML editing
- Scaling path: Implement file upload system with cloud storage (AWS S3, Cloudinary) or static asset management

## Dependencies at Risk

**Google Fonts CDN Dependency:**
- Risk: Entire site typography fails if fonts.googleapis.com is inaccessible or rate-limited
- Impact: Text renders in system font, breaking design; increased page load time if Google is slow
- Migration plan: Host fonts locally with `@font-face`, use system font stack as fallback

**No Build Tool or Package Manager:**
- Risk: Difficult to upgrade dependencies or add new libraries (jQuery, Bootstrap would require manual download)
- Impact: Can't easily manage versions, security patches, or minify assets
- Migration plan: Add npm with build tool (Vite, Webpack, esbuild) for asset bundling and minification

**localStorage Availability Assumption:**
- Risk: Site doesn't work in private browsing mode or when localStorage is disabled
- Impact: Language preference resets on each session for private-mode users
- Migration plan: Add sessionStorage or URL parameter fallback for language preference

## Missing Critical Features

**No Backend Service:**
- Problem: Contact form doesn't send emails; no database for dynamic content
- Blocks: Actual customer inquiries can't be received; real-time content updates impossible
- Priority: High - impacts business operations

**No Analytics or Monitoring:**
- Problem: No way to track page views, user behavior, or errors in production
- Blocks: Can't measure success of website, identify broken pages, or understand user journeys
- Priority: High - prevents data-driven decisions

**No 404 Error Page:**
- Problem: Typos in URLs or deleted pages just show blank page
- Blocks: Users have no guidance when landing on non-existent pages
- Priority: Medium

**No Search Functionality:**
- Problem: Users must manually browse all pages to find content
- Blocks: Finding specific news or events becomes tedious as content grows
- Priority: Medium - becomes critical when content exceeds 20-30 items

**No Dark Mode:**
- Problem: No dark theme option
- Impact: Accessibility concern for users who prefer dark mode; battery drain on mobile
- Priority: Low - nice-to-have feature

## Test Coverage Gaps

**No Automated Tests:**
- What's not tested: Language switching, form validation, counter animations, scroll animations, mobile menu, navbar state
- Files: All JavaScript in `script.js`, all HTML interactivity
- Risk: Regression bugs on every code change; no confidence in refactoring
- Priority: High - should have unit tests for all JavaScript functions and integration tests for page interactions

**No E2E Testing:**
- What's not tested: Full user journeys (navigate pages, switch language, fill form, submit)
- Risk: Frontend-breaking changes only discovered after deployment or manual testing
- Priority: High - add Playwright or Cypress for critical workflows

**No Visual Regression Testing:**
- What's not tested: CSS changes don't break responsive design or cross-browser appearance
- Risk: CSS refactors silently break layouts on certain screen sizes or browsers
- Priority: Medium - use Percy or similar screenshot diffing tool

**No Accessibility Testing:**
- What's not tested: Color contrast, keyboard navigation, screen reader compatibility, form labels
- Risk: Site inaccessible to users with disabilities; fails WCAG 2.1 Level AA compliance
- Priority: High - legal and ethical concern; use axe-core or Lighthouse audits

**No Load Testing:**
- What's not tested: Performance under high traffic, analytics data handling
- Risk: Unknown behavior when many users visit simultaneously
- Priority: Medium - use k6 or Apache JMeter for baseline performance metrics

---

*Concerns audit: 2026-05-13*
