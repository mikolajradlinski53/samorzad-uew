# Phase 6: SEO + Accessibility + Deploy — Context

**Gathered:** 2026-05-15
**Status:** Ready for planning
**Source:** Brief + project state

<domain>
## Phase Boundary

Ostatnia faza projektu. Trzy obszary:

1. **SEO** — OG meta tagi na wszystkich stronach (Next.js 14 Metadata API), sitemap.xml, robots.txt
2. **Accessibility** — focus rings widoczne, ARIA labels poprawne, prefers-reduced-motion, kontrast
3. **Deploy** — Vercel (primary, już działa via GitHub) + instrukcje SFTP static export (hosting uczelniany)

</domain>

<decisions>
## Implementation Decisions

### SEO — Next.js 14 Metadata API

Każda strona już ma `export const metadata: Metadata` z tytułem i opisem.
Do dodania: `openGraph` i `twitter` pola.

**Globalne metadata w app/layout.tsx:**
```typescript
export const metadata: Metadata = {
  title: { default: 'Samorząd Studentów UEW', template: '%s | SSUEW' },
  description: 'Samorząd Studentów Uniwersytetu Ekonomicznego we Wrocławiu.',
  openGraph: {
    siteName: 'SSUEW',
    locale: 'pl_PL',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image' },
}
```

**OG Image:** Tworzymy prosty `/public/og-image.png` (1200×630) — placeholder z logo i nazwą. Alternatywnie: Next.js `opengraph-image.tsx` z ImageResponse.

**sitemap.xml + robots.txt:** Next.js App Router konwencje:
- `app/sitemap.ts` → eksportuje `MetadataRoute.Sitemap`
- `app/robots.ts` → eksportuje `MetadataRoute.Robots`

### Accessibility

**Focus rings:** Tailwind ma `focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2` — sprawdzić wszystkie interaktywne elementy (linki, przyciski, inputy). Uzupełnić brakujące.

**ARIA labels:**
- Hamburger button: już ma `aria-label`
- Social icons: już mają `aria-label`
- ChatWidget button: już ma `aria-label`
- Skip link: już w Navbar (`href="#main-content"`)
- Sprawdzić `<main id="main-content">` — jest w layout.tsx

**Kontrast:** Primary `#3BAEFF` na białym — sprawdzić WCAG AA (4.5:1 dla tekstu normalnego).

**prefers-reduced-motion:** FadeUp już obsługuje przez `useReducedMotion()`. HeroSection rotating text — sprawdzić i dodać.

### Deploy

**Vercel (primary — już działa):**
- Połączony z GitHub main branch auto-deploy
- API routes działają automatycznie
- Środowiskowe zmienne ustawić w Vercel Dashboard → Settings → Environment Variables

**SFTP static export (hosting uczelniany):**
```bash
NEXT_STATIC_EXPORT=true npm run build
# generuje /out/ — statyczny HTML bez API routes
# wgraj zawartość /out/ przez SFTP na hosting uczelniany
```

Ograniczenia static export:
- API routes (`/api/*`) nie działają → formularze, chat, auth NIE działają
- Strony dynamiczne (Strefa Działacza) renderują się bez auth

**vercel.json** (dla poprawnych rewrites i nagłówków):
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" }
      ]
    }
  ]
}
```

### Lighthouse — optymalizacje
Potencjalne problemy do sprawdzenia:
- Google Fonts — preconnect już jest (Phase 2 `next/font/google`)
- Lenis CSS import — sprawdzić czy nie blokuje renderowania
- Images — `unoptimized: true` w next.config.js (wymagane dla static export)
- ChatWidget — 'use client' z useChat ładuje AI SDK — może wpłynąć na LCP

### Claude's Discretion
- Dokładna treść og-image (placeholder PNG vs ImageResponse)
- Szczegóły sitemap (które URL-e, changefreq, priority)
- Kolejność sprawdzania ARIA (można skupić na najważniejszych stronach)

</decisions>

<canonical_refs>
## Canonical References

- `.planning/PROJECT.md`
- `.planning/ROADMAP.md`
- `CLAUDE.md`
- `app/layout.tsx` (globalne metadata)
- `tailwind.config.js`
- `next.config.js`

</canonical_refs>

<specifics>
## Specific Implementation Notes

**Next.js sitemap.ts pattern:**
```typescript
// app/sitemap.ts
import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://samorzad.ue.wroc.pl'
  const routes = ['/', '/dla-studenta', '/prawa-studenta', '/infopacki',
    '/rzecznik-praw-studenta', '/stypendia', '/nasza-dzialalnosc', '/zarzad',
    '/rada-uczelniana', '/regulacje-wewnetrzne', '/nasze-projekty', '/wspolprace',
    '/formularz', '/kontakt']
  return routes.map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '/' ? 1 : 0.8,
  }))
}
```

**OG image — prosta opcja (plik statyczny):**
Wrzucamy `public/og-image.png` — może być screenshot strony lub prosta grafika z logo.

**Kluczowy test deploy:**
```bash
# Test static export
NEXT_STATIC_EXPORT=true npm run build && npx serve out
# Otwórz http://localhost:3000 i sprawdź podstawowe strony
```

</specifics>

<deferred>
## Deferred

- Pełny audit WCAG AAA (tylko AA w scope)
- Performance budget CI/CD (nie w tej fazie)
- Automatyczne monitorowanie Lighthouse w CI
- CDN konfiguracja na hostingu uczelniamy

</deferred>

---

*Phase: 06-seo-accessibility-deploy*
*Context gathered: 2026-05-15 via project state*
