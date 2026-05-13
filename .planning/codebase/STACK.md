# Technology Stack

**Analysis Date:** 2026-05-13

## Languages

**Primary:**
- HTML5 - Markup for all pages (index.html, aktualnosci.html, wydarzenia.html, zarzad.html, strefa-studenta.html, projekty.html)
- CSS3 - Styling with CSS variables and media queries (`style.css`)
- JavaScript (ES6+) - Client-side interactivity (`script.js`)

## Runtime

**Environment:**
- Browser-based (vanilla JavaScript, no build transpilation required)
- No server-side runtime

**Package Manager:**
- None - No npm, yarn, or pip configuration detected
- No package.json file present
- No external package management system

## Frameworks

**Core:**
- Vanilla HTML/CSS/JavaScript - No framework dependencies (React, Vue, Angular, etc.)

**Fonts:**
- Google Fonts - Inter font family (weights: 400, 500, 600, 700, 800)
  - Link: `https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap`
  - Used in `index.html` line 10 and other pages

**Build/Dev:**
- None detected - Static HTML files served directly

## Key Dependencies

**Critical:**
- Google Fonts API - Web font delivery (essential for typography in `style.css`)

**External Resources:**
- None - No external JavaScript libraries, CDNs, or dependencies detected

## Configuration

**Environment:**
- No environment variables or configuration files detected
- No `.env` file present
- Application uses hardcoded values for contact information and organizational details

**Build:**
- No build configuration files (webpack, vite, rollup, tsconfig, etc.)
- Static files served as-is from directory root

## Platform Requirements

**Development:**
- Text editor (VS Code, etc.)
- Git for version control (repository exists at `.git/`)
- No build tools required

**Production:**
- Static hosting capable of serving HTML, CSS, and JavaScript files
- HTTP/HTTPS web server (nginx, Apache, GitHub Pages, Vercel, Netlify, etc.)
- Browser support: Modern browsers (Chrome, Firefox, Safari, Edge)

## Architecture Pattern

**Static Site:**
- Multi-page static website (MPA - Multi-Page Application)
- No API backend
- Client-side form handling (validation only, no submission)
- Client-side i18n with localStorage for language persistence

## Code Organization

**Pages:**
- `index.html` - Landing page with hero, stats, news, events, board, student zone, projects, partners, contact form
- `aktualnosci.html` - News/announcements page
- `evenimente.html` - Events page
- `zarzad.html` - Board members page
- `strefa-studenta.html` - Student information hub
- `projekty.html` - Projects showcase page

**Resources:**
- `style.css` - Global styles (CSS variables, responsive design, animations)
- `script.js` - JavaScript functionality (i18n, form handling, animations, scroll effects)
- `logo_2.png` - Organization logo/branding

## Browser APIs Used

- `localStorage` - Language preference persistence (line 198 `script.js`)
- `IntersectionObserver` - Scroll animations for fade-up effects (line 289 `script.js`)
- `requestAnimationFrame` - Counter animations (line 304 `script.js`)
- `DOM APIs` - Standard DOM manipulation (querySelector, addEventListener, etc.)

---

*Stack analysis: 2026-05-13*
