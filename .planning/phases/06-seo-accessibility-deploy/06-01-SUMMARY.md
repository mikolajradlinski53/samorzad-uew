---
phase: 06-seo-accessibility-deploy
plan: 01
status: complete
---

# Plan 06-01 — SEO Infrastructure

## What Was Done

**Task 1 — Global metadata + OG image + sitemap + robots:**
- Updated `app/layout.tsx` with `title.template: '%s | SSUEW'`, `metadataBase`, full openGraph defaults, Twitter card, OG image reference
- Created `app/opengraph-image.tsx` — 1200×630 branded ImageResponse (edge runtime, SSUEW blue palette)
- Created `app/sitemap.ts` — 25 public routes mapped to `samorzad.ue.wroc.pl`
- Created `app/robots.ts` — allow all crawlers, reference sitemap URL

**Task 2 — Per-page openGraph + title format:**
- Shortened all 26 page titles (removed ` — SSUEW` suffix; template handles it)
- Added `openGraph: { title, description, url, type }` to all 26 public pages

## Verification Results

- `npx tsc --noEmit`: 0 errors
- `grep "template.*SSUEW" app/layout.tsx`: match
- OG image, sitemap, robots: all present
- openGraph fields across pages: 26 matches
- No page title still has ` — SSUEW` suffix
