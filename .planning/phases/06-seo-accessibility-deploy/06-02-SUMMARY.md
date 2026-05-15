---
phase: 06-seo-accessibility-deploy
plan: 02
status: complete
---

# Plan 06-02 — Accessibility Fixes + Deploy Artifacts

## What Was Done

**Task 1 — Accessibility fixes:**
- `components/sections/HeroSection.tsx`: added `useReducedMotion()` from `motion/react`; rotating subtitle interval is skipped when user prefers reduced motion
- `components/forms/ContactForm.tsx`: added `htmlFor`/`id` associations on all three forms (KontaktForm, WspolpraceForm, RzecznikForm — 13 field-control pairs total); added `focus-visible:ring-2` to submit buttons via `btnClass`
- `components/layout/Navbar.tsx`: added `focus-visible:ring-2 focus-visible:ring-primary` to desktop and mobile nav links (7 instances)
- `components/chatbot/ChatWidget.tsx`: added `focus-visible:ring-2` to submit button and close button

**Task 2 — Deploy artifacts:**
- `vercel.json`: 5 security headers (X-Content-Type-Options, X-Frame-Options, X-XSS-Protection, Referrer-Policy, Permissions-Policy) applied to all routes
- `DEPLOY.md`: full deployment guide — env vars table, Vercel auto-deploy instructions, Google OAuth setup, static export command (`npm run build:static`), SFTP upload instructions, limitations table
- `scripts/build-static.ps1`: PowerShell script for Windows that temporarily hides `app/api/`, `strefa-dzialacza` pages, and `middleware.ts` (incompatible with `output: export`); restores in `finally` using `.NET Directory/File.Move` for Unicode path safety
- `package.json`: added `build:static` script
- `app/api/formularz/route.ts`: moved `new Resend(...)` inside handler (lazy init) to prevent build-time throw when `RESEND_API_KEY` absent

**Task 3 — Static export smoke test:**
- `npm run build:static` exits 0
- `/out` directory produced with 33 pages including `index.html`

## Verification Results

- `npx tsc --noEmit`: 0 errors
- `grep "useReducedMotion" HeroSection.tsx`: present
- `htmlFor` count in ContactForm.tsx: 8 lines (13 field-control associations)
- Navbar `focus-visible:ring-2` count: 7
- ChatWidget focus rings: 2
- `grep "X-Frame-Options" vercel.json`: match
- `npm run build:static`: exits 0, `/out/index.html` present

## Human Verification Step

Run Chrome DevTools Lighthouse or `npx lighthouse https://samorzad.ue.wroc.pl` on the deployed Vercel site to verify Performance ≥ 90 and Accessibility ≥ 90.
