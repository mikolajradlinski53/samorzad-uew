# Phase 2: Next.js Foundation — Context

**Gathered:** 2026-05-15
**Status:** Ready for planning
**Source:** Brief + PROJECT.md

<domain>
## Phase Boundary

Inicjalizacja projektu Next.js 14 (App Router) + TypeScript + Tailwind CSS w istniejącym repo. Migracja design tokenów z Phase 1 (style.css) do Tailwind config. Budowa core layouts: Navbar (2-poziomowy dropdown + mobile drawer) i Footer z prawdziwymi danymi. Integracja Framer Motion (scroll animacje) i Lenis (smooth scroll). Faza kończy się gdy `npm run build && next export` działa i core layouts są gotowe dla wszystkich kolejnych stron.

**Nie wchodzi w scope Phase 2:**
- Żadne strony content (to Phase 3-4)
- Google OAuth / Strefa Działacza (to Phase 5)
- next export deploy na hosting uczelniany (to Phase 6)

</domain>

<decisions>
## Implementation Decisions

### Stack
- **Framework:** Next.js 14 z App Router (nie Pages Router)
- **TypeScript:** strict mode, `tsconfig.json` z path aliases (`@/components`, `@/lib`, `@/data`)
- **CSS:** Tailwind CSS v3, bez CSS Modules ani styled-components
- **Package manager:** npm (nie yarn/pnpm — repo nie ma lockfile)
- **Export:** `output: 'export'` w `next.config.js` dla statycznego HTML; `trailingSlash: true`

### Design Tokens (Tailwind config)
Kolory z Identity Visual SSUEW + Phase 1 CSS variables:
```js
colors: {
  'ssuew-black': '#1a1a1a',  // --text
  'ssuew-white': '#ffffff',
  'ssuew-gray-100': '#f0f7ff', // --bg-alt
  'ssuew-gray-200': '#d6e9ff', // --border
  'ssuew-gray-600': '#6B7A99', // --text-muted
  'primary': '#3BAEFF',        // --primary
  'primary-dark': '#1A8FE3',   // --primary-dark
  'primary-light': '#EAF5FF',  // --primary-light
}
```
Typografia: Inter (Google Fonts) jako body, Plus Jakarta Sans jako display (nagłówki)

### Animacje
- **Framer Motion** — scroll-triggered fade-in-up na sekcjach (`whileInView`, `once: true`)
- **Lenis** — smooth scroll, inicjalizowany w root layout przez custom hook `useLenis()`
- **prefers-reduced-motion** — `useReducedMotion()` hook z Framer Motion wyłącza animacje

### Navbar
Struktura menu (dokładna, z briefu):
```
STRONA GŁÓWNA                    → /
STREFA STUDENTA                  → /dla-studenta
  ├─ Prawa Studenta              → /prawa-studenta
  ├─ Infopacki                   → /infopacki
  ├─ Rzecznik Praw Studenta      → /rzecznik-praw-studenta
  ├─ Prawo dla Studenta          → /prawo-dla-studenta
  ├─ Stypendia                   → /stypendia
  ├─ Mapa Kampusu                → /mapa-kampusu
  ├─ Władze Rektorskie           → /wladze-rektorskie
  └─ Władze Dziekańskie          → /dziekan-i-prodziekani
SAMORZĄD STUDENTÓW               → /nasza-dzialalnosc
  ├─ Nasza Misja                 → /nasza-dzialalnosc
  ├─ Struktura Samorządu         → /struktura-samorzadu
  ├─ Rada Uczelniana (RUSS)      → /rada-uczelniana
  ├─ Regulacje Wewnętrzne        → /regulacje-wewnetrzne
  ├─ Nasze Projekty              → /nasze-projekty
  └─ Filia w Jeleniej Górze      → /filia-jelenia-gora
WSPÓŁPRACE                       → /wspolprace
  ├─ Nasi Partnerzy              → /nasi-partnerzy
  └─ Kontakt                     → /kontakt
KONTAKT                          → /kontakt
  ├─ Formularz Kontaktowy        → /formularz
  └─ Współpracuj z Nami          → /wspolpracuj-z-nami
STREFA DZIAŁACZA                 → /strefa-dzialacza  [wyróżniony przycisk]
```

Desktop: sticky navbar z `backdrop-blur-md bg-white/80` po scrollu, dropdown na hover.
Mobile: hamburger button → slide-down drawer z animacją, pełna lista linków z akordeonem dla submenu.

### Footer
Trzy kolumny:
```
Kolumna 1 — Adres:
ul. Kamienna 43
53-307 Wrocław
Budynek J, pokój 9

Kolumna 2 — Social media (ikony + linki):
TikTok:    https://www.tiktok.com/@samorzaduew
Facebook:  https://www.facebook.com/samorzad.ue/
LinkedIn:  https://www.linkedin.com/company/samorząd-studentów-...
Instagram: https://www.instagram.com/samorzad.ue/

Kolumna 3 — Kontakt:
kontakt@samorzad.ue.wroc.pl (mailto link)

Copyright: © 2026 Samorząd Studentów UEW
```

### Struktura katalogów Next.js
```
app/
  layout.tsx          # Root layout: Navbar + Footer + Lenis provider
  page.tsx            # Strona główna (placeholder w Phase 2)
  (public)/           # Wszystkie publiczne strony (Phase 3-4)
  strefa-dzialacza/   # Chroniona strefa (Phase 5)
components/
  layout/
    Navbar.tsx
    Footer.tsx
    LenisProvider.tsx
  ui/                 # Shadcn-style base components (Button, etc.)
data/
  navigation.ts       # Menu structure (typed)
  social.ts           # Social media links
  contact.ts          # Contact info
lib/
  utils.ts            # cn() helper, etc.
public/
  assets/logos/       # Logo SSUEW
  assets/people/      # Zdjęcia osób (placeholder w Phase 2)
  assets/partners/    # Loga partnerów (placeholder w Phase 2)
  docs/               # PDFy regulaminów
```

### Claude's Discretion
- Wybór konkretnej wersji pakietów (używaj latest stable)
- Implementacja szczegółów animacji Framer Motion (easing, duration)
- Dokładna implementacja Lenis hook (useEffect + rafDriver lub standardowy)
- Shadcn/ui vs custom components dla UI elements
- Sposób obsługi active state w Navbar (usePathname)

</decisions>

<canonical_refs>
## Canonical References

### Project context
- `.planning/PROJECT.md` — stack, constraints, decisions
- `.planning/ROADMAP.md` — phase goals and success criteria
- `CLAUDE.md` — project-specific guidelines

### Phase 1 output (reference dla design tokenów)
- `style.css` — obecne CSS variables (do przeniesienia do Tailwind config)
- `index.html` — obecna struktura navbar/footer (reference dla treści)

</canonical_refs>

<specifics>
## Specific Implementation Notes

**Logo:** Plik `logo_2.png` już jest w repo root. Skopiować do `public/assets/logos/logo.png`.

**Social icons:** Użyć react-icons (`npm install react-icons`) lub Lucide React — ikony FaTiktok, FaFacebook, FaLinkedin, FaInstagram.

**Lenis + Next.js App Router:** Lenis wymaga `'use client'` i musi być zainicjalizowany po mount. Wzorzec:
```tsx
// components/layout/LenisProvider.tsx
'use client'
import { useEffect } from 'react'
import Lenis from '@studio-freight/lenis'

export function LenisProvider({ children }) {
  useEffect(() => {
    const lenis = new Lenis()
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf) }
    requestAnimationFrame(raf)
    return () => lenis.destroy()
  }, [])
  return <>{children}</>
}
```

**next.config.js krytyczne:**
```js
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },  // wymagane dla static export
}
```

**Tailwind font config:**
```js
fontFamily: {
  sans: ['Inter', 'system-ui', 'sans-serif'],
  display: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
}
```

</specifics>

<deferred>
## Deferred Ideas

- Shadcn/ui full setup — Phase 2 dodaje tylko bazowe komponenty, nie cały system
- Dark mode — nie w scope tego projektu
- i18n (PL/EN toggle z Phase 1) — do przemyślenia przy Phase 3, nie w Phase 2
- Google Fonts self-hosting (performance) — Phase 6
</deferred>

---

*Phase: 02-next-js-foundation*
*Context gathered: 2026-05-15 via Brief*
