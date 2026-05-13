# Coding Conventions

**Analysis Date:** 2026-05-13

## Naming Patterns

**Files:**
- HTML: kebab-case (e.g., `index.html`, `aktualnosci.html`, `strefa-studenta.html`)
- CSS: single file named `style.css`
- JavaScript: single file named `script.js`
- Images: snake_case or descriptive (e.g., `logo_2.png`)

**Functions:**
- camelCase (e.g., `initNavbar`, `applyLang`, `initScrollAnimations`, `animateCounter`)
- Descriptive verb-noun pattern (e.g., `initContactForm`, `updateWord`, `animateCounter`)

**Variables:**
- camelCase for general variables (e.g., `currentLang`, `wordIndex`, `cycleInterval`)
- SCREAMING_SNAKE_CASE is not used; constants are camelCase
- Data attributes use kebab-case in HTML (e.g., `data-i18n`, `data-counter`, `data-lang`)
- CSS custom properties use kebab-case (e.g., `--primary`, `--text-muted`, `--max-width`)

**Classes & IDs:**
- CSS classes use kebab-case (e.g., `.navbar`, `.hero-content`, `.card-grid-3`, `.form-group`)
- HTML IDs use camelCase or kebab-case (mixed: `id="navbar"`, `id="contactForm"`, `id="typewriter"`)

**CSS Variables:**
- Color variables: `--primary`, `--primary-dark`, `--primary-light`, `--text`, `--text-muted`, `--border`, `--error`, `--success-*`
- Layout variables: `--max-width`, `--radius`, `--radius-sm`
- Animation variables: `--transition`, `--shadow`, `--shadow-hover`
- Font: `--font`

## Code Style

**Formatting:**
- No specific formatter configured (ESLint/Prettier not present)
- HTML: attributes typically inline, closing tags present
- CSS: properties often on single lines, using shorthand where possible
- JavaScript: semicolons used throughout, arrow functions preferred for callbacks

**Spacing:**
- Single space after opening bracket: `function someFunc(` not `function someFunc(`
- No extra blank lines between function definitions (compact style)
- Single line for simple block statements: `if (condition) { doSomething(); }`

**Linting:**
- No linting configuration found

## Import Organization

**HTML:**
- DOCTYPE declaration first
- Meta tags (charset, viewport, description)
- Font imports from Google Fonts
- CSS link to `style.css`
- Inline styles in `<style>` tags for hero section
- Script tag at bottom: `<script src="script.js"></script>`

**JavaScript:**
- i18n translation object defined first (lines 2-195 in `script.js`)
- Global state variables declared next (e.g., `let currentLang`)
- Utility functions (e.g., `applyLang`, `animateCounter`)
- Initialization functions (e.g., `initNavbar`, `initScrollAnimations`)
- Event listeners at end in `DOMContentLoaded`

**No module imports/exports** - Pure vanilla JavaScript with global object scope

## HTML Structure Patterns

**Semantic sections:**
- `<nav class="navbar">` for navigation
- `<section class="section">` for content sections with proper ID anchors
- `<footer class="footer">` for footer
- `<article class="card">` for card-based content

**Common element patterns:**
- `.container` wrapper for max-width constraint
- `.section` with optional `.section-alt` for alternating backgrounds
- `.card-grid` with responsive classes: `.card-grid-2`, `.card-grid-3`, `.card-grid-4`
- `.fade-up` with `.delay-1`, `.delay-2`, etc. for scroll animations
- `data-i18n` attributes for translation keys on all user-facing text

## Error Handling

**Form validation (in `script.js` lines 353-398):**
- Required field checking: `if (!field.value.trim())`
- Email regex validation: `.match(/.+@.+\..+/)`
- Visual feedback: border color change to `#d32f2f` (error color)
- Error messages shown/hidden via `.form-error` class
- Success shown by hiding form and displaying `.form-success` message

**No try-catch blocks used** - Validation is defensive check-based

## Logging

**Framework:** `console` only (no logging library)

**Patterns:**
- No debug logging observed in codebase
- Production-ready code has logging removed
- Form submission uses simple `style.display` manipulation instead of logging

## Comments

**When to Comment:**
- Very minimal commenting in codebase
- Complex algorithms documented inline (e.g., `cubicEaseOut` easing function at line 308)
- Section headers used: `// i18n Translation Object`, `// Initialize Navbar`, etc.
- Block comments with "=====" separators in CSS for major sections

**JSDoc/TSDoc:**
- Not used - no JSDoc annotations found

## Function Design

**Size:** 
- Small, focused functions (typically 10-30 lines)
- Range from 5 lines (`updateWord`) to 40 lines (`initContactForm`)

**Parameters:** 
- Simple parameters, max 2-3 parameters per function
- Example: `animateCounter(el, target, duration = 1800)` - destructuring not used

**Return Values:** 
- Functions are side-effect based (DOM manipulation, event listeners)
- Few explicit returns; mostly early returns on validation checks
- Most functions return `undefined` implicitly

## Module Design

**Exports:** 
- No module system - all functions are global scope within script
- Functions defined at module level, callable from anywhere
- Initialization happens in `DOMContentLoaded` event

**Global State:**
- `i18n` object: translation dictionary
- `currentLang`: tracks active language
- `_typewriterInterval`: private variable (underscore prefix) for interval ID

**Initialization Pattern:**
```javascript
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollAnimations();
  initCounters();
  initContactForm();
  initTypewriter();
  applyLang(currentLang);
});
```

## CSS Conventions

**Selectors:**
- Class-based primarily (`.navbar`, `.card`, `.btn`)
- ID selectors for major layout blocks (`#navbar`, `#contactForm`)
- Attribute selectors for interactive states: `[data-lang]`, `[data-i18n]`
- Pseudo-classes for states: `:hover`, `:focus`, `:nth-child()`

**Property order:**
- No strict order observed; properties grouped logically within declarations

**Responsive:**
- Mobile-first approach implied by breakpoints at 1024px and 768px
- `clamp()` used for fluid typography: `font-size: clamp(2.2rem, 5vw, 3.8rem)`
- `auto-fit` and `minmax()` for responsive grids: `grid-template-columns: repeat(auto-fit, minmax(300px, 1fr))`

## I18n Pattern

**Implementation location:** `script.js` lines 2-195

**Structure:**
- Centralized translation object with language keys (`pl`, `en`)
- String keys map to translations: `i18n.pl.nav_home = 'Strona główna'`
- Data attributes connect HTML to keys: `<span data-i18n="nav_home">`
- Three attribute types supported:
  - `data-i18n`: textContent
  - `data-i18n-ph`: placeholder attributes
  - `data-i18n-href`: href attributes

**Language switching:**
- Buttons with `data-lang` attribute trigger language change
- Language persisted to localStorage: `localStorage.setItem('lang', lang)`
- On init: `let currentLang = localStorage.getItem('lang') || 'pl'`

---

*Convention analysis: 2026-05-13*
