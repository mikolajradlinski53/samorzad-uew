# Codebase Structure

**Analysis Date:** 2026-05-13

## Directory Layout

```
samorzad-uew/
├── index.html              # Home/landing page
├── aktualnosci.html        # News/announcements page
├── wydarzenia.html         # Events page
├── zarzad.html             # Board members page
├── projekty.html           # Projects page
├── strefa-studenta.html    # Student resources/guides page
├── style.css               # Global stylesheet
├── script.js               # Client-side JavaScript
├── logo_2.png              # Organization logo asset
└── .git/                   # Git repository metadata
```

## Directory Purposes

**Root Directory:**
- Purpose: Flat file structure for simple static website
- Contains: HTML pages (public pages), stylesheet, JavaScript, image assets
- Key files: `index.html` (entry point), `style.css` (all styling), `script.js` (all interactivity)

## Key File Locations

**Entry Points:**

- `index.html`: Main landing page; renders hero section with typewriter effect, statistics counter section, news preview cards (3), events preview cards (3), team member avatars (4), student zone cards (6), projects preview (3), partners grid (8), contact form with info, and footer
- `aktualnosci.html`: News/announcements archive; extends `index.html` layout with page hero and news card grid (6+ articles)
- `strefa-studenta.html`: Student resources hub; organized by tabs/sections: Prawa Studenta, Stypendia, Rzecznik, Prawo, Mapa, Władze
- `dogodki.html`: Events listing page
- `zarzad.html`: Board members and leadership page
- `projekty.html`: Projects and initiatives showcase page

**Configuration:**

- `script.js` (lines 2-195): i18n object with Polish and English translations for all user-facing strings
- `.planning/codebase/`: Documentation directory (generated, not committed initially)

**Core Logic:**

- `script.js` (lines 241-281): Navbar initialization with scroll detection and mobile menu toggle
- `script.js` (lines 284-301): Scroll animation system using Intersection Observer for fade-up effects
- `script.js` (lines 304-347): Counter animation system for statistics section
- `script.js` (lines 353-398): Contact form validation and success state handling
- `script.js` (lines 401-439): Typewriter effect cycling through words with language-specific word lists
- `script.js` (lines 442-449): DOMContentLoaded initialization orchestrator

**Testing:**

- No test files present in structure

## Naming Conventions

**Files:**

- HTML pages: `kebab-case.html` (e.g., `strefa-studenta.html`, `aktualnosci.html`)
- CSS: Single global file `style.css` (not split by component or feature)
- JavaScript: Single global file `script.js` (not modularized)
- Assets: Descriptive names with version hints (e.g., `logo_2.png` suggests iteration)

**CSS Classes:**

- Component-based: `.navbar`, `.navbar-inner`, `.navbar-logo`, `.navbar-links`, `.navbar-actions`
- BEM-lite (block__element without strict modifier syntax): `.card-grid`, `.card-badge`, `.card-title`, `.card-text`, `.card-footer`
- Utility/behavior: `.fade-up`, `.visible`, `.delay-1`, `.scrolled`, `.active`, `.open`
- Grid variant: `.card-grid-2`, `.card-grid-3`, `.card-grid-4` (responsive column counts)
- State: `.scrolled` (navbar), `.active` (language button, navigation link), `.open` (mobile menu), `.visible` (animated elements)
- Size: `.btn-sm` (small button variant)

**CSS Variables (`:root`):**

- Color tokens: `--primary`, `--primary-dark`, `--primary-light`, `--bg`, `--bg-alt`, `--text`, `--text-muted`, `--border`, `--error`, `--success-bg`, `--success-border`, `--success-text`
- Layout tokens: `--max-width`, `--radius`, `--radius-sm`, `--font`
- Effects tokens: `--shadow`, `--shadow-hover`, `--transition`

**JavaScript Functions:**

- camelCase: `applyLang()`, `initNavbar()`, `initScrollAnimations()`, `animateCounter()`, `initCounters()`, `initContactForm()`, `initTypewriter()`, `cubicEaseOut()`, `updateWord()`
- Global scope functions and data: `i18n` (object), `currentLang` (string), `_typewriterInterval` (interval ID)

**HTML Data Attributes:**

- Translation hooks: `[data-i18n="key"]` (text content), `[data-i18n-ph="key"]` (placeholder), `[data-i18n-href="key"]` (href value)
- Component configuration: `[data-counter="NUMBER"]` (animate to this value), `[data-lang="en|pl"]` (language button), `[data-delay="Ns"]` (not used, relies on class instead)
- Animation state: Classes instead of attributes (`.fade-up`, `.visible`, `.delay-N`)

## Where to Add New Code

**New Feature (Interactive Behavior):**
- Primary code: Add function to `script.js` and call from `DOMContentLoaded` listener (lines 442-449)
- HTML markup: Add elements to relevant page and use standard classes (`.card`, `.section`, etc.) or new BEM-lite classes
- Styling: Add CSS rules to `style.css` following existing variable usage pattern

**New Page:**
- Create new `.html` file in root directory with structure matching existing pages:
  - Copy `<head>` from `index.html` (title, meta, fonts, stylesheet)
  - Include `<nav>` and `.mobile-menu` blocks (copy from `aktualnosci.html`)
  - Add content sections with `.section` wrappers
  - Add `.footer` block (copy from `aktualnosci.html`)
  - Add `<script src="script.js"></script>` at end of body
- If page content needs i18n: Add translation keys to `i18n.pl` and `i18n.en` in `script.js`
- Ensure internal links in navbar/footer point to new page

**New Component/Module:**
- Cards: Use `.card` base with variant classes (`.avatar-card`, `.zone-card`, `.event-card`); define card structure in HTML, styling in `style.css`
- Sections: Wrap in `.section` or `.section-alt`; use `.section-header` for title/description
- Grid layouts: Use `.card-grid`, `.card-grid-2`, `.card-grid-3`, or `.card-grid-4` classes
- Forms: Follow pattern in contact form (`.form-group`, `.form-error`, `.form-success`)
- Animations: Apply `.fade-up` class and optional `.delay-N` class (0.1s, 0.2s, 0.3s increments)

**Utilities/Helpers:**
- Shared styling utilities: Add to `:root` as CSS variables if new color, spacing, or effect is needed
- Reusable functions: Add to `script.js` before `DOMContentLoaded` listener
- Translation strings: Add key-value pairs to both `i18n.pl` and `i18n.en` objects

**Internationalization Additions:**
- For new user-facing text: Add key to both language objects in `i18n` (lines 2-195 of `script.js`)
- In HTML: Use `[data-i18n="key"]` for text, `[data-i18n-ph="key"]` for placeholders
- For typewriter effect words: Update `wordLists` object in `initTypewriter()` (line 406-409)

## Special Directories

**`.git/`:**
- Purpose: Git version control metadata
- Generated: Yes (by git init)
- Committed: Yes (required for git operations)

**`.planning/codebase/`:**
- Purpose: Architecture and quality documentation (maps, guides, analysis)
- Generated: Yes (created during codebase mapping)
- Committed: Yes (useful for future development)

## File Size Reference

- `index.html`: 22,879 bytes (445 lines) — main landing page with all hero, stats, news, events, board, student zone, projects, partners, contact sections
- `script.js`: 17,091 bytes (450 lines) — i18n object (195 keys × 2 languages), initialization functions, animation logic
- `style.css`: 13,312 bytes (241 lines) — CSS variables, reset, typography, layout, components, responsive breakpoints
- `aktualnosci.html`: 5,134 bytes — simplified structure, news card grid only
- `strefa-studenta.html`: 7,414 bytes — section-based layout with collapsed cards
- Other pages: 4,434-5,209 bytes — minimal structure variations

## Static Assets

**Images:**
- `logo_2.png`: 169,421 bytes — organization logo used in navbar and footer across all pages

**External Assets (CDN-loaded):**
- Google Fonts: Inter font family (weights 400, 500, 600, 700, 800)
  - Preconnect URLs: `https://fonts.googleapis.com`, `https://fonts.gstatic.com`
  - Stylesheet URL: `https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap`

---

*Structure analysis: 2026-05-13*
