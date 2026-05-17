# Visual Overhaul + Dark Mode — Design Spec

**Date:** 2026-05-16  
**Status:** Approved

---

## Decisions

| Area | Decision |
|------|----------|
| Default theme | Dark (`#1A2340` background) |
| Theme scope | Full site — all sections change with toggle |
| Toggle | 🌙/☀️ button in Navbar, next to PL/EN |
| Persistence | localStorage (`theme` key) |
| Hero background | Animated dot grid (moving dots, CSS-only) |
| Stats location | Embedded at bottom of Hero (not separate section) |

---

## 1. Theme System

### ThemeProvider (`lib/theme.tsx`)
- `'use client'` React context, mirrors `LangProvider` pattern
- `useState<'dark'|'light'>('dark')` — dark default
- `useEffect` reads `localStorage.getItem('theme')` on mount
- Applies `document.documentElement.setAttribute('data-theme', theme)`
- Exports: `ThemeProvider`, `useTheme`

### CSS Variables (`app/globals.css`)
```css
:root, [data-theme="dark"] {
  --bg-page:    #1A2340;
  --bg-section: #162035;
  --bg-alt:     #0f1829;
  --bg-card:    #1e2d4a;
  --text:       #ffffff;
  --text-muted: rgba(255,255,255,0.6);
  --border:     rgba(255,255,255,0.08);
}
[data-theme="light"] {
  --bg-page:    #ffffff;
  --bg-section: #F0F7FF;
  --bg-alt:     #EAF5FF;
  --bg-card:    #ffffff;
  --text:       #1A2340;
  --text-muted: #6B7A99;
  --border:     #D6E9FF;
}
```

### ThemeToggle (`components/ui/ThemeToggle.tsx`)
- `'use client'`, calls `useTheme()`
- Single button: shows 🌙 when dark, ☀️ when light
- Placed in Navbar right of LangToggle

---

## 2. Hero Section Redesign

### Background
- `background: var(--bg-page)` (dark by default)
- Animated dot grid overlay:
  ```css
  background-image: radial-gradient(var(--dot-color) 1px, transparent 1px);
  background-size: 28px 28px;
  animation: dots-drift 20s linear infinite;
  --dot-color: rgba(59,174,255,0.18);  /* dark */
  /* light: rgba(26,35,64,0.08) */
  @keyframes dots-drift { 0%{background-position:0 0} 100%{background-position:28px 28px} }
  ```
- Two radial gradient blobs (CSS, no JS):
  - Top-right: `radial-gradient(ellipse 60% 50% at 80% 20%, rgba(59,174,255,0.14), transparent)`
  - Bottom-left: `radial-gradient(ellipse 40% 40% at 10% 80%, rgba(59,174,255,0.08), transparent)`

### Content (top to bottom)
1. Eyebrow pill: `● SAMORZĄD STUDENTÓW UEW · WROCŁAW` — blue border, pulsing dot
2. H1: `Działamy dla Ciebie` — `clamp(36px,6vw,64px)`, bold, "Ciebie" in `#3BAEFF`
3. Subtitle: "Reprezentujemy 6000+ studentów..."
4. CTA buttons: primary (blue filled) + outline
5. Social icons row
6. Inline stats bar: `6000+ Studentów · 9 Projektów/rok · 30+ Lat · 15+ Partnerów`

---

## 3. Section Components — Dark/Light Support

All sections use CSS vars instead of hard-coded Tailwind colors:

| Section | bg class |
|---------|----------|
| StatsSection | REMOVED — stats moved into Hero |
| AboutSection | `bg-[var(--bg-section)]` |
| NewsSection | `bg-[var(--bg-alt)]` |
| ProjectsPreview | `bg-[var(--bg-section)]` |
| TeamPreview | `bg-[var(--bg-alt)]` |
| ContactSection | `bg-[var(--bg-section)]` |

Cards: `bg-[var(--bg-card)] border-[var(--border)]`  
Text: `text-[var(--text)]` / `text-[var(--text-muted)]`

### News cards — colored category badges
Each category gets a distinct color pair (bg/text):
- Wydarzenie: `rgba(59,174,255,0.12)` / `#3BAEFF`
- Projekt: `rgba(255,180,0,0.12)` / `#e6a800`
- Stypendia: `rgba(100,220,130,0.12)` / `#2e8b57`
- Ogłoszenie: `rgba(200,100,255,0.12)` / `#9b45d4`

---

## 4. Navbar Updates

Desktop right side (left → right):
```
[nav links]  [PL|EN]  [🌙]  [Strefa Działacza →]
```

Mobile drawer bottom:
```
[PL | EN]  [🌙/☀️]
```

---

## 5. Keys Setup (ENV vars)

Document in `DEPLOY.md`. Required for full functionality:

| Variable | Where to get |
|----------|-------------|
| `AUTH_SECRET` | `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"` |
| `AUTH_GOOGLE_ID` | console.cloud.google.com → APIs → OAuth 2.0 Client |
| `AUTH_GOOGLE_SECRET` | same |
| `RESEND_API_KEY` | resend.com → API Keys |
| `RESEND_FROM_EMAIL` | verified domain in Resend |
| `ANTHROPIC_API_KEY` | console.anthropic.com |

Set all in: **Vercel Dashboard → Project → Settings → Environment Variables**

---

## Files Changed

| File | Change |
|------|--------|
| `lib/theme.tsx` | NEW — ThemeProvider + useTheme |
| `components/ui/ThemeToggle.tsx` | NEW |
| `app/globals.css` | Add CSS custom properties |
| `app/layout.tsx` | Wrap with ThemeProvider |
| `components/layout/Navbar.tsx` | Add ThemeToggle |
| `components/sections/HeroSection.tsx` | Full redesign + stats + dot grid |
| `components/sections/StatsSection.tsx` | DELETE (merged into hero) |
| `components/sections/AboutSection.tsx` | CSS var colors |
| `components/sections/NewsSection.tsx` | CSS var colors + colored badges |
| `components/sections/ProjectsPreview.tsx` | CSS var colors |
| `components/sections/TeamPreview.tsx` | CSS var colors |
| `components/sections/ContactSection.tsx` | CSS var colors |
| `app/(public)/page.tsx` | Remove StatsSection import |
| `DEPLOY.md` | Add env vars setup section |

---

## Animation Level: 2 — Dynamic

Confirmed in brainstorming session. Effects to implement:

### Level 1 (base — included)
- Animated shimmer gradient on primary CTA button
- Staggered card entrance (scroll into view, 120ms delay between cards)
- Animated underline on section `h2` titles (width 0→100% when section enters viewport)
- Hover lift on cards (`translateY(-6px)` + `box-shadow`)

### Level 2 (additions)
- **Cursor spotlight** — radial gradient blob follows mouse inside HeroSection (CSS+JS, no library)
- **3D card tilt** — `rotateX/rotateY` perspective transform on mousemove, reset on mouseleave
- **Gradient border glow** — CSS `::before` pseudo-element with gradient border, opacity 0→1 on hover

### NOT included (Level 3)
- Film grain texture
- Number glow effect
- Typewriter cursor on title
