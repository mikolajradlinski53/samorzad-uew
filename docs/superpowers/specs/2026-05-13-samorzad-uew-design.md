# Samorząd Studentów UEW — Redesign Spec
Date: 2026-05-13

## Overview
A redesigned, hosting-ready static website for the Student Government of the University of Economics in Wrocław (Samorząd Studentów UEW). Replaces the existing site at samorzad.ue.wroc.pl. No backend required — pure HTML/CSS/JS, deployable to any static host.

## Design Decisions

### Color Palette
| Role | Value |
|---|---|
| Background | `#FFFFFF` white |
| Primary | `#3BAEFF` light blue |
| Primary dark | `#1A8FE3` (hover, accents) |
| Text main | `#1A2340` dark navy |
| Text secondary | `#6B7A99` |
| Card/section bg | `#F0F7FF` very light blue |
| Hero gradient | `#EAF5FF → #FFFFFF` |

### Typography
- Headings: Inter or Poppins (Google Fonts), bold weights
- Body: Inter, 400/500
- Sizes: fluid responsive (clamp)

### Animation Philosophy
- **Hero**: rich — animated typewriter headline, floating background shapes
- **Stats counters**: animated on scroll (IntersectionObserver)
- **Cards**: fade-in + slide-up on scroll
- **Hover effects**: card lift shadow, button scale
- **Navbar**: smooth scroll, sticky with backdrop blur

### Language
Bilingual PL/EN with a toggle button in the navbar. Implemented via `data-i18n` attributes and a JS translation object — no server needed.

## File Architecture
```
index.html              ← main page (all sections, shortened)
aktualnosci.html        ← full news listing
wydarzenia.html         ← full events calendar
zarzad.html             ← full board / structure page
projekty.html           ← full projects portfolio
strefa-studenta.html    ← full student zone
style.css               ← shared styles (CSS variables, components)
script.js               ← shared JS (i18n, animations, scroll, form)
```

## Page Sections — index.html

1. **Navbar** — Logo, anchor links, PL/EN switcher, mobile hamburger
2. **Hero** — Animated typewriter headline, subtitle, 2 CTA buttons, floating decorative circles
3. **Stats** — 4 animated counters: students (~5000), projects (~15), years active (~30), partners (~20)
4. **News** — 3 latest news cards + "See all" link → aktualnosci.html
5. **Events** — 3 upcoming event cards with date badge + "See all" link → wydarzenia.html
6. **Board** — 4 avatar cards (name, role) + "Meet the team" link → zarzad.html
7. **Student Zone** — 6 icon-cards: Rights, Scholarships, Ombudsman, Law, Campus Map, Admin Contacts
8. **Projects** — 3 project cards + "All projects" link → projekty.html
9. **Partners** — Logo grid (placeholder logos)
10. **Contact** — Contact form (name, email, subject, message) + address + email + social links
11. **Footer** — Navigation links, social icons (TikTok, Facebook, Instagram, LinkedIn), copyright

## Subpages
Each subpage shares the same navbar/footer and extends the corresponding index section with full content.

## Accessibility & UX
- Semantic HTML5 (header, nav, main, section, footer, article)
- ARIA labels on interactive elements
- Keyboard navigable
- Mobile-first responsive (breakpoints: 768px, 1024px)
- Smooth scroll behavior
- Form validation (client-side)

## Constraints
- Zero external JS frameworks (vanilla JS only)
- Google Fonts CDN allowed
- No backend / no build step required
- Works offline after first load (relative paths)
