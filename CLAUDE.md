<!-- GSD:project-start source:PROJECT.md -->
## Project

**Strona Samorządu Studentów UEW**

Strona internetowa Samorządu Studentów Uniwersytetu Ekonomicznego we Wrocławiu — wielostronicowy serwis w stylu nowoczesnej agencji z płynnymi animacjami, który robi wrażenie przy pierwszym wejściu i pozwala studentom szybko znaleźć to czego szukają. Budowana jako czyste HTML/CSS/JS, hostowana na Netlify z auto-deployem z GitHuba. Merytorycznie wzorowana na samorzad.ue.wroc.pl.

**Core Value:** Student wchodzi na stronę, natychmiast widzi profesjonalizm samorządu i bez trudu znajduje to, czego potrzebuje — czy to aktualności, dokumenty do pobrania, czy kontakt.

### Constraints

- **Stack**: HTML/CSS/JS vanilla — brak frameworków, brak buildu, brak backendu
- **Hosting**: Netlify (static) + GitHub (main branch auto-deploy)
- **Formularze**: Netlify Forms — jedyna dopuszczalna metoda wysyłania formularzy
- **Dokumenty**: Statyczne pliki PDF w repozytorium lub przez external link
- **Kompatybilność**: Nowoczesne przeglądarki (Chrome, Firefox, Safari, Edge) — bez IE
<!-- GSD:project-end -->

<!-- GSD:stack-start source:codebase/STACK.md -->
## Technology Stack

## Languages
- HTML5 - Markup for all pages (index.html, aktualnosci.html, wydarzenia.html, zarzad.html, strefa-studenta.html, projekty.html)
- CSS3 - Styling with CSS variables and media queries (`style.css`)
- JavaScript (ES6+) - Client-side interactivity (`script.js`)
## Runtime
- Browser-based (vanilla JavaScript, no build transpilation required)
- No server-side runtime
- None - No npm, yarn, or pip configuration detected
- No package.json file present
- No external package management system
## Frameworks
- Vanilla HTML/CSS/JavaScript - No framework dependencies (React, Vue, Angular, etc.)
- Google Fonts - Inter font family (weights: 400, 500, 600, 700, 800)
- None detected - Static HTML files served directly
## Key Dependencies
- Google Fonts API - Web font delivery (essential for typography in `style.css`)
- None - No external JavaScript libraries, CDNs, or dependencies detected
## Configuration
- No environment variables or configuration files detected
- No `.env` file present
- Application uses hardcoded values for contact information and organizational details
- No build configuration files (webpack, vite, rollup, tsconfig, etc.)
- Static files served as-is from directory root
## Platform Requirements
- Text editor (VS Code, etc.)
- Git for version control (repository exists at `.git/`)
- No build tools required
- Static hosting capable of serving HTML, CSS, and JavaScript files
- HTTP/HTTPS web server (nginx, Apache, GitHub Pages, Vercel, Netlify, etc.)
- Browser support: Modern browsers (Chrome, Firefox, Safari, Edge)
## Architecture Pattern
- Multi-page static website (MPA - Multi-Page Application)
- No API backend
- Client-side form handling (validation only, no submission)
- Client-side i18n with localStorage for language persistence
## Code Organization
- `index.html` - Landing page with hero, stats, news, events, board, student zone, projects, partners, contact form
- `aktualnosci.html` - News/announcements page
- `evenimente.html` - Events page
- `zarzad.html` - Board members page
- `strefa-studenta.html` - Student information hub
- `projekty.html` - Projects showcase page
- `style.css` - Global styles (CSS variables, responsive design, animations)
- `script.js` - JavaScript functionality (i18n, form handling, animations, scroll effects)
- `logo_2.png` - Organization logo/branding
## Browser APIs Used
- `localStorage` - Language preference persistence (line 198 `script.js`)
- `IntersectionObserver` - Scroll animations for fade-up effects (line 289 `script.js`)
- `requestAnimationFrame` - Counter animations (line 304 `script.js`)
- `DOM APIs` - Standard DOM manipulation (querySelector, addEventListener, etc.)
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

## Naming Patterns
- HTML: kebab-case (e.g., `index.html`, `aktualnosci.html`, `strefa-studenta.html`)
- CSS: single file named `style.css`
- JavaScript: single file named `script.js`
- Images: snake_case or descriptive (e.g., `logo_2.png`)
- camelCase (e.g., `initNavbar`, `applyLang`, `initScrollAnimations`, `animateCounter`)
- Descriptive verb-noun pattern (e.g., `initContactForm`, `updateWord`, `animateCounter`)
- camelCase for general variables (e.g., `currentLang`, `wordIndex`, `cycleInterval`)
- SCREAMING_SNAKE_CASE is not used; constants are camelCase
- Data attributes use kebab-case in HTML (e.g., `data-i18n`, `data-counter`, `data-lang`)
- CSS custom properties use kebab-case (e.g., `--primary`, `--text-muted`, `--max-width`)
- CSS classes use kebab-case (e.g., `.navbar`, `.hero-content`, `.card-grid-3`, `.form-group`)
- HTML IDs use camelCase or kebab-case (mixed: `id="navbar"`, `id="contactForm"`, `id="typewriter"`)
- Color variables: `--primary`, `--primary-dark`, `--primary-light`, `--text`, `--text-muted`, `--border`, `--error`, `--success-*`
- Layout variables: `--max-width`, `--radius`, `--radius-sm`
- Animation variables: `--transition`, `--shadow`, `--shadow-hover`
- Font: `--font`
## Code Style
- No specific formatter configured (ESLint/Prettier not present)
- HTML: attributes typically inline, closing tags present
- CSS: properties often on single lines, using shorthand where possible
- JavaScript: semicolons used throughout, arrow functions preferred for callbacks
- Single space after opening bracket: `function someFunc(` not `function someFunc(`
- No extra blank lines between function definitions (compact style)
- Single line for simple block statements: `if (condition) { doSomething(); }`
- No linting configuration found
## Import Organization
- DOCTYPE declaration first
- Meta tags (charset, viewport, description)
- Font imports from Google Fonts
- CSS link to `style.css`
- Inline styles in `<style>` tags for hero section
- Script tag at bottom: `<script src="script.js"></script>`
- i18n translation object defined first (lines 2-195 in `script.js`)
- Global state variables declared next (e.g., `let currentLang`)
- Utility functions (e.g., `applyLang`, `animateCounter`)
- Initialization functions (e.g., `initNavbar`, `initScrollAnimations`)
- Event listeners at end in `DOMContentLoaded`
## HTML Structure Patterns
- `<nav class="navbar">` for navigation
- `<section class="section">` for content sections with proper ID anchors
- `<footer class="footer">` for footer
- `<article class="card">` for card-based content
- `.container` wrapper for max-width constraint
- `.section` with optional `.section-alt` for alternating backgrounds
- `.card-grid` with responsive classes: `.card-grid-2`, `.card-grid-3`, `.card-grid-4`
- `.fade-up` with `.delay-1`, `.delay-2`, etc. for scroll animations
- `data-i18n` attributes for translation keys on all user-facing text
## Error Handling
- Required field checking: `if (!field.value.trim())`
- Email regex validation: `.match(/.+@.+\..+/)`
- Visual feedback: border color change to `#d32f2f` (error color)
- Error messages shown/hidden via `.form-error` class
- Success shown by hiding form and displaying `.form-success` message
## Logging
- No debug logging observed in codebase
- Production-ready code has logging removed
- Form submission uses simple `style.display` manipulation instead of logging
## Comments
- Very minimal commenting in codebase
- Complex algorithms documented inline (e.g., `cubicEaseOut` easing function at line 308)
- Section headers used: `// i18n Translation Object`, `// Initialize Navbar`, etc.
- Block comments with "=====" separators in CSS for major sections
- Not used - no JSDoc annotations found
## Function Design
- Small, focused functions (typically 10-30 lines)
- Range from 5 lines (`updateWord`) to 40 lines (`initContactForm`)
- Simple parameters, max 2-3 parameters per function
- Example: `animateCounter(el, target, duration = 1800)` - destructuring not used
- Functions are side-effect based (DOM manipulation, event listeners)
- Few explicit returns; mostly early returns on validation checks
- Most functions return `undefined` implicitly
## Module Design
- No module system - all functions are global scope within script
- Functions defined at module level, callable from anywhere
- Initialization happens in `DOMContentLoaded` event
- `i18n` object: translation dictionary
- `currentLang`: tracks active language
- `_typewriterInterval`: private variable (underscore prefix) for interval ID
## CSS Conventions
- Class-based primarily (`.navbar`, `.card`, `.btn`)
- ID selectors for major layout blocks (`#navbar`, `#contactForm`)
- Attribute selectors for interactive states: `[data-lang]`, `[data-i18n]`
- Pseudo-classes for states: `:hover`, `:focus`, `:nth-child()`
- No strict order observed; properties grouped logically within declarations
- Mobile-first approach implied by breakpoints at 1024px and 768px
- `clamp()` used for fluid typography: `font-size: clamp(2.2rem, 5vw, 3.8rem)`
- `auto-fit` and `minmax()` for responsive grids: `grid-template-columns: repeat(auto-fit, minmax(300px, 1fr))`
## I18n Pattern
- Centralized translation object with language keys (`pl`, `en`)
- String keys map to translations: `i18n.pl.nav_home = 'Strona główna'`
- Data attributes connect HTML to keys: `<span data-i18n="nav_home">`
- Three attribute types supported:
- Buttons with `data-lang` attribute trigger language change
- Language persisted to localStorage: `localStorage.setItem('lang', lang)`
- On init: `let currentLang = localStorage.getItem('lang') || 'pl'`
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

## Pattern Overview
- Server-rendered HTML pages with shared CSS and JavaScript
- Client-side DOM manipulation for state management and interactions
- No backend API or database dependencies
- Browser localStorage for persisting user preferences
- Semantic HTML with data attributes for configuration
- Progressive enhancement approach with vanilla JavaScript
## Layers
- Purpose: Renders user interface across multiple HTML pages
- Location: `index.html`, `aktualnosci.html`, `strefa-studenta.html`, `wydarzenia.html`, `zarzad.html`, `projekty.html`
- Contains: Page structure, semantic markup, form elements, navigation components
- Depends on: Shared `style.css` and `script.js` across all pages
- Used by: Browser directly; initial page load renders content immediately
- Purpose: Visual presentation and responsive design
- Location: `style.css`
- Contains: CSS variables (color, spacing, typography), reusable component styles, layout utilities, animation definitions
- Depends on: Google Fonts (Inter) loaded externally
- Used by: All HTML pages via `<link rel="stylesheet">`
- Purpose: Client-side logic and DOM manipulation
- Location: `script.js`
- Contains: i18n translation management, navbar behavior, form handling, scroll animations, counter animations, typewriter effect, language switching
- Depends on: Browser DOM APIs, localStorage API, Intersection Observer API, requestAnimationFrame
- Used by: All pages via deferred `<script src="script.js"></script>` tag at end of body
- Purpose: Content and configuration
- Location: Embedded in HTML (hardcoded content) and `script.js` (i18n object)
- Contains: Page text, news items, event listings, team members, navigation structure
- Depends on: None (static)
- Used by: Presentation and Interactivity layers
## Data Flow
- Language preference: stored in localStorage under key `'lang'`, defaults to `'pl'`
- Navbar scroll state: tracked via window scroll event, adds/removes `.scrolled` class
- Mobile menu state: toggled via `.open` class on `.mobile-menu` element
- Scroll animations: tracked via Intersection Observer, elements get `.visible` class when in viewport
- Counter animations: tracked via Intersection Observer, animate on first intersection only
- Form state: visibility toggled with `display: none/block`
## Key Abstractions
- Purpose: Reusable content container with hover effects and optional badges
- Examples: News cards (`.card`), event cards (`.event-card`), team member cards (`.avatar-card`), student zone cards (`.zone-card`)
- Pattern: CSS class composition (`.card`, `.card-badge`, `.card-title`, `.card-text`, `.card-footer`, `.card-link`) with optional modifiers; structured with semantic elements
- Purpose: Organize page into distinct content areas with consistent spacing and backgrounds
- Examples: Hero section, stats section, news section, events section, contact section
- Pattern: `.section` wrapper with `.container` for max-width constraint; `.section-alt` for alternating background colors; `.section-header` for title and description
- Purpose: Responsive multi-column layouts
- Examples: `.card-grid-2` (2 columns), `.card-grid-3` (3 columns), `.card-grid-4` (4 columns)
- Pattern: CSS Grid with `grid-template-columns: repeat(auto-fit, minmax(XXXpx, 1fr))` for responsive wrapping
- Purpose: Fade-in and movement effects as elements become visible
- Examples: `.fade-up`, `.delay-1`, `.delay-2`, `.delay-3` classes
- Pattern: Initial opacity 0 and translateY 30px; Intersection Observer detects viewport entry; `.visible` class applies transition to final state
- Purpose: Consistent input styling and validation feedback
- Examples: `.form-group`, `.form-error`, `.form-success`
- Pattern: Label with `[data-i18n]` attribute, input with `[data-i18n-ph]` for placeholder, error div shown conditionally, success message hidden until valid submission
- Purpose: Single-language string management with runtime switching
- Examples: `data-i18n="nav_news"`, `data-i18n-ph="contact_name"`
- Pattern: Attribute references key in `i18n.pl` or `i18n.en` object; `applyLang()` batch-updates all elements
## Entry Points
- Location: `index.html`
- Triggers: User visits domain root or opens file directly
- Responsibilities: Renders full landing page with hero section, stats, news preview, events preview, team preview, student zone navigation, projects preview, partners, contact form, and footer
- Locations: `aktualnosci.html`, `strefa-studenta.html`, `wydarzenia.html`, `zarzad.html`, `projekty.html`
- Triggers: User clicks navigation links or types URL directly
- Responsibilities: Each renders page-specific content with shared navbar, footer, and styling; inherits all JavaScript behaviors (i18n, navbar scroll, animations)
- Location: `script.js` (bottom of each HTML page's body)
- Triggers: DOMContentLoaded event fires when DOM is parsed
- Responsibilities: Initializes all interactive features in sequence: navbar, scroll animations, counters, contact form, typewriter effect, applies language from localStorage
## Error Handling
- **Form Validation:** Check required fields and email format; display red border and error text if invalid; silently accept submission if valid
- **Missing Translation Keys:** Condition checks before accessing nested `i18n[lang][key]` to prevent console errors if key missing
- **DOM Element Queries:** Early returns if queried elements don't exist (e.g., `if (!form) return` in `initContactForm()`)
- **Observer Patterns:** Intersection Observer and Mutation Observer used safely with early returns if no elements match selector
## Cross-Cutting Concerns
- Email: Regex match `/.+@.+\..+/` in contact form
- Required fields: Trim and check falsy values
- No server-side validation (static site)
- Mechanism: `data-i18n` attributes on elements, `applyLang()` function updates text content
- Scope: Navigation, hero section, all card content, section headers, form labels, error/success messages
- Supported languages: Polish (`pl`), English (`en`)
- Persistence: localStorage key `'lang'`
- Semantic HTML: Proper heading hierarchy, alt text on images, form labels
- ARIA: `aria-label` on buttons (hamburger, social links)
- Focus states: Buttons and links styled with `:focus` pseudo-class
- Keyboard navigation: All interactive elements focusable; form validation accessible
- Font loading: Preconnect to Google Fonts; Inter loaded with specific weights (400, 500, 600, 700, 800)
- CSS-in-JS: Minimal inline styles in hero section; most styles in external stylesheet
- JavaScript: No frameworks or heavy libraries; vanilla JS with native APIs (Intersection Observer, requestAnimationFrame)
- Animations: Offset delays (0.1s increments) prevent simultaneous transitions; CSS transitions use 0.3s standard duration
<!-- GSD:architecture-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd:quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd:debug` for investigation and bug fixing
- `/gsd:execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->



<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd:profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
