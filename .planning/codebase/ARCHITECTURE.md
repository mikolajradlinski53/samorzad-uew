# Architecture

**Analysis Date:** 2026-05-13

## Pattern Overview

**Overall:** Multi-page Static Website with Client-Side Interactivity

**Key Characteristics:**
- Server-rendered HTML pages with shared CSS and JavaScript
- Client-side DOM manipulation for state management and interactions
- No backend API or database dependencies
- Browser localStorage for persisting user preferences
- Semantic HTML with data attributes for configuration
- Progressive enhancement approach with vanilla JavaScript

## Layers

**Presentation Layer:**
- Purpose: Renders user interface across multiple HTML pages
- Location: `index.html`, `aktualnosci.html`, `strefa-studenta.html`, `wydarzenia.html`, `zarzad.html`, `projekty.html`
- Contains: Page structure, semantic markup, form elements, navigation components
- Depends on: Shared `style.css` and `script.js` across all pages
- Used by: Browser directly; initial page load renders content immediately

**Styling Layer:**
- Purpose: Visual presentation and responsive design
- Location: `style.css`
- Contains: CSS variables (color, spacing, typography), reusable component styles, layout utilities, animation definitions
- Depends on: Google Fonts (Inter) loaded externally
- Used by: All HTML pages via `<link rel="stylesheet">`

**Interactivity Layer:**
- Purpose: Client-side logic and DOM manipulation
- Location: `script.js`
- Contains: i18n translation management, navbar behavior, form handling, scroll animations, counter animations, typewriter effect, language switching
- Depends on: Browser DOM APIs, localStorage API, Intersection Observer API, requestAnimationFrame
- Used by: All pages via deferred `<script src="script.js"></script>` tag at end of body

**Data Layer:**
- Purpose: Content and configuration
- Location: Embedded in HTML (hardcoded content) and `script.js` (i18n object)
- Contains: Page text, news items, event listings, team members, navigation structure
- Depends on: None (static)
- Used by: Presentation and Interactivity layers

## Data Flow

**Page Load Flow:**

1. Browser fetches HTML file (e.g., `index.html`)
2. Head parses metadata, loads fonts, stylesheet, and language attribute
3. Body renders semantic HTML with data attributes (e.g., `data-i18n`, `data-counter`)
4. Script tag loads `script.js` asynchronously
5. JavaScript DOMContentLoaded event fires when DOM is ready
6. `applyLang()` initializes current language from localStorage and updates all `[data-i18n]` elements
7. Navbar, animations, counters, form, and typewriter effects initialize
8. Page becomes interactive

**Navigation Flow:**

1. User clicks internal link (e.g., `href="strefa-studenta.html"`)
2. Browser navigates to new page
3. New page loads with same JS and CSS files
4. Navbar scroll state resets; animations re-trigger
5. Language preference persists from localStorage

**Internationalization Flow:**

1. User clicks language toggle button (`[data-lang="en"]`)
2. `applyLang(lang)` called with new language
3. Language saved to localStorage
4. All elements with `[data-i18n]` attribute updated with text from `i18n[lang]` object
5. All elements with `[data-i18n-ph]` attribute updated with placeholder text
6. Typewriter effect reinitializes with new language word list
7. Form labels and placeholders update instantly

**Form Submission Flow:**

1. User fills contact form with name, email, subject, message
2. Form submit event fires
3. Validation checks: required fields, email format
4. If invalid: border colors change to red, error messages display
5. If valid: form hides, success message shows with i18n text, form resets
6. No backend submission (purely client-side)

**State Management:**

- Language preference: stored in localStorage under key `'lang'`, defaults to `'pl'`
- Navbar scroll state: tracked via window scroll event, adds/removes `.scrolled` class
- Mobile menu state: toggled via `.open` class on `.mobile-menu` element
- Scroll animations: tracked via Intersection Observer, elements get `.visible` class when in viewport
- Counter animations: tracked via Intersection Observer, animate on first intersection only
- Form state: visibility toggled with `display: none/block`

## Key Abstractions

**Card Components:**
- Purpose: Reusable content container with hover effects and optional badges
- Examples: News cards (`.card`), event cards (`.event-card`), team member cards (`.avatar-card`), student zone cards (`.zone-card`)
- Pattern: CSS class composition (`.card`, `.card-badge`, `.card-title`, `.card-text`, `.card-footer`, `.card-link`) with optional modifiers; structured with semantic elements

**Section Layout:**
- Purpose: Organize page into distinct content areas with consistent spacing and backgrounds
- Examples: Hero section, stats section, news section, events section, contact section
- Pattern: `.section` wrapper with `.container` for max-width constraint; `.section-alt` for alternating background colors; `.section-header` for title and description

**Grid Systems:**
- Purpose: Responsive multi-column layouts
- Examples: `.card-grid-2` (2 columns), `.card-grid-3` (3 columns), `.card-grid-4` (4 columns)
- Pattern: CSS Grid with `grid-template-columns: repeat(auto-fit, minmax(XXXpx, 1fr))` for responsive wrapping

**Animation Framework:**
- Purpose: Fade-in and movement effects as elements become visible
- Examples: `.fade-up`, `.delay-1`, `.delay-2`, `.delay-3` classes
- Pattern: Initial opacity 0 and translateY 30px; Intersection Observer detects viewport entry; `.visible` class applies transition to final state

**Form Components:**
- Purpose: Consistent input styling and validation feedback
- Examples: `.form-group`, `.form-error`, `.form-success`
- Pattern: Label with `[data-i18n]` attribute, input with `[data-i18n-ph]` for placeholder, error div shown conditionally, success message hidden until valid submission

**i18n System:**
- Purpose: Single-language string management with runtime switching
- Examples: `data-i18n="nav_news"`, `data-i18n-ph="contact_name"`
- Pattern: Attribute references key in `i18n.pl` or `i18n.en` object; `applyLang()` batch-updates all elements

## Entry Points

**Home Page:**
- Location: `index.html`
- Triggers: User visits domain root or opens file directly
- Responsibilities: Renders full landing page with hero section, stats, news preview, events preview, team preview, student zone navigation, projects preview, partners, contact form, and footer

**Subpages:**
- Locations: `aktualnosci.html`, `strefa-studenta.html`, `wydarzenia.html`, `zarzad.html`, `projekty.html`
- Triggers: User clicks navigation links or types URL directly
- Responsibilities: Each renders page-specific content with shared navbar, footer, and styling; inherits all JavaScript behaviors (i18n, navbar scroll, animations)

**Script Entry Point:**
- Location: `script.js` (bottom of each HTML page's body)
- Triggers: DOMContentLoaded event fires when DOM is parsed
- Responsibilities: Initializes all interactive features in sequence: navbar, scroll animations, counters, contact form, typewriter effect, applies language from localStorage

## Error Handling

**Strategy:** Client-side validation with user-friendly error messages; no error recovery mechanism (static site)

**Patterns:**

- **Form Validation:** Check required fields and email format; display red border and error text if invalid; silently accept submission if valid
- **Missing Translation Keys:** Condition checks before accessing nested `i18n[lang][key]` to prevent console errors if key missing
- **DOM Element Queries:** Early returns if queried elements don't exist (e.g., `if (!form) return` in `initContactForm()`)
- **Observer Patterns:** Intersection Observer and Mutation Observer used safely with early returns if no elements match selector

## Cross-Cutting Concerns

**Logging:** None (no logging framework; data collection limited to localStorage)

**Validation:** 
- Email: Regex match `/.+@.+\..+/` in contact form
- Required fields: Trim and check falsy values
- No server-side validation (static site)

**Authentication:** None (public website; no user accounts or protected content)

**Internationalization:**
- Mechanism: `data-i18n` attributes on elements, `applyLang()` function updates text content
- Scope: Navigation, hero section, all card content, section headers, form labels, error/success messages
- Supported languages: Polish (`pl`), English (`en`)
- Persistence: localStorage key `'lang'`

**Accessibility:**
- Semantic HTML: Proper heading hierarchy, alt text on images, form labels
- ARIA: `aria-label` on buttons (hamburger, social links)
- Focus states: Buttons and links styled with `:focus` pseudo-class
- Keyboard navigation: All interactive elements focusable; form validation accessible

**Performance:**
- Font loading: Preconnect to Google Fonts; Inter loaded with specific weights (400, 500, 600, 700, 800)
- CSS-in-JS: Minimal inline styles in hero section; most styles in external stylesheet
- JavaScript: No frameworks or heavy libraries; vanilla JS with native APIs (Intersection Observer, requestAnimationFrame)
- Animations: Offset delays (0.1s increments) prevent simultaneous transitions; CSS transitions use 0.3s standard duration

---

*Architecture analysis: 2026-05-13*
