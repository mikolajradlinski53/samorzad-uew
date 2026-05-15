# Roadmap: Samorząd Studentów UEW — Website (Next.js)

## Overview

Migracja z Wix na Next.js 14 + TypeScript + Tailwind CSS. Phase 1 (bug fixes + CSS cleanup) zakończona na vanilla prototype. Fazy 2-6 budują nową stronę w Next.js z pełną treścią z samorzad.ue.wroc.pl, animacjami Framer Motion, Lenis smooth scroll, oraz Strefą Działacza z Google OAuth.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Bug Fixes and CSS Foundation** - Vanilla prototype naprawiony, inline styles wyczyszczone
- [x] **Phase 2: Next.js Foundation** - Init Next.js 14, design system, Navbar/Footer z prawdziwymi danymi, Framer Motion + Lenis (completed 2026-05-15)
- [ ] **Phase 3: Strona Główna + Strefa Studenta** - Hero, statystyki, wszystkie podstrony studenckie z pełną treścią
- [ ] **Phase 4: Samorząd + Projekty + Partnerzy** - Zarząd, RUSS, Prezydium, 9 projektów, regulacje, partnerzy
- [ ] **Phase 5: Formularze + Strefa Działacza** - API routes, Google OAuth, lista obecności, AI chatbot, 404
- [ ] **Phase 6: SEO + Accessibility + Deploy** - Lighthouse 90+, OG meta, next export → hosting uczelniany

## Phase Details

### Phase 1: Bug Fixes and CSS Foundation
**Goal**: Production bugs are fixed and the codebase has no hidden inline-style overrides — the site works correctly and is ready for visual redesign
**Depends on**: Nothing (first phase)
**Requirements**: BUG-01, BUG-02, BUG-03, BUG-04, FOUND-01
**Success Criteria** (what must be TRUE):
  1. Submitting the contact form sends a real message via Netlify Forms and the user sees a dismissable success notice
  2. Clicking any navigation link from a subpage lands on the correct section of index.html
  3. Switching the site language from PL to EN resets the typewriter animation correctly
  4. No `style=` attributes remain in any HTML file outside of the linked stylesheet
**Plans**: 3 plans

Plans:
- [x] 01-01-PLAN.md — Fix Netlify Forms integration, typewriter re-init, form success dismiss (BUG-01, BUG-03, BUG-04)
- [x] 01-02-PLAN.md — Fix subpage navbar links to use index.html#section anchors (BUG-02)
- [x] 01-03-PLAN.md — Extract all inline styles to style.css (FOUND-01)

### Phase 2: Next.js Foundation
**Goal**: Next.js 14 project running with design system, core layouts (Navbar/Footer z prawdziwymi danymi), Framer Motion scroll animations, Lenis smooth scroll — gotowy do budowania wszystkich stron
**Depends on**: Phase 1
**Requirements**: NEXT-01, NEXT-02, NEXT-03, NAV-01, FOOT-01, ANIM-01, ANIM-02, ANIM-03
**Success Criteria** (what must be TRUE):
  1. `npm run build` i `npm run export` produkuje poprawny statyczny HTML w `/out` bez błędów
  2. Navbar wyświetla 2-poziomowy dropdown na desktop + animowany mobile drawer z pełną strukturą menu (Strefa Studenta, Samorząd, Współprace, Kontakt, Strefa Działacza)
  3. Footer wyświetla ul. Kamienna 43 / Budynek J pokój 9, linki social media (TikTok, FB, LI, IG) z prawdziwymi URL-ami, email kontakt@samorzad.ue.wroc.pl
  4. Framer Motion fade-in-up animacje działają przy scroll; prefers-reduced-motion je wyłącza
  5. Lenis smooth scroll aktywny — przewijanie ma physics feel
**Plans**: 3 plans

Plans:
- [x] 02-01-PLAN.md — Install packages, create config files, design tokens in Tailwind, fonts via next/font/google (NEXT-01, NEXT-02, NEXT-03)
- [ ] 02-02-PLAN.md — Data layer (navigation.ts, social.ts, contact.ts), Navbar component, Footer component (NAV-01, FOOT-01)
- [ ] 02-03-PLAN.md — LenisProvider, FadeUp animation component, Button component, wire root layout (ANIM-01, ANIM-02, ANIM-03)

### Phase 3: Strona Główna + Strefa Studenta
**Goal**: Strona główna z pełną treścią i animacjami + wszystkie podstrony Strefy Studenta z kompletną treścią z briefu i linkami GDrive
**Depends on**: Phase 2
**Requirements**: HOME-01, HOME-02, HOME-03, STU-01, STU-02, STU-03, STU-04, STU-05, STU-06, STU-07
**Success Criteria** (what must be TRUE):
  1. Hero wyświetla rotujące podtytuły Framer Motion: "Działamy na rzecz studentów" / "Wspieramy Was w walce o prawa studenckie" / "Inspirujemy do podejmowania nowych inicjatyw"
  2. Sekcja statystyk ma animowane liczniki (~6000 studentów, 9 projektów, ~30 lat, 15+ partnerów) uruchamiane przy scroll
  3. `/dla-studenta` wyświetla TileGrid z 10 kafelkami (ikony Lucide) + szybkie linki do USOS / Intranetu / Planu / Harmonogramu
  4. `/prawa-studenta` ma działający akordeon z 7 prawami studenta
  5. `/infopacki` wyświetla 8 linków GDrive z poprawnymi URL-ami z briefu
  6. `/rzecznik-praw-studenta` wyświetla kartę Jakuba Buchty (rps@samorzad.ue.wroc.pl) + działający formularz kontaktowy
  7. `/stypendia` wyświetla kafelki (Socjalne, Rektora, Niepełnosprawnych, Zapomogi) + tabelę 10 załączników z linkami GDrive
**Plans**: 6 plans
**UI hint**: yes

Plans:
- [ ] 03-01-PLAN.md — Data files (student-zone, infopacki, prawa-studenta, stypendia) + TileCard, TileGrid, QuickLinks (STU-01, STU-02, STU-03, STU-05, STU-07)
- [ ] 03-02-PLAN.md — Accordion, DocumentList, MemberCard, Counter components (STU-04, STU-06, STU-07)
- [ ] 03-03-PLAN.md — HeroSection, StatsSection, AboutSection (HOME-01, HOME-02, HOME-03)
- [ ] 03-04-PLAN.md — app/(public)/page.tsx, /dla-studenta, /prawa-studenta pages (HOME-01..03, STU-01, STU-02, STU-04)
- [ ] 03-05-PLAN.md — /infopacki, /rzecznik-praw-studenta, /stypendia pages (STU-03, STU-05, STU-06, STU-07)
- [ ] 03-06-PLAN.md — 6 stub pages (mapa-kampusu, wladze-rektorskie, dziekan-i-prodziekani, prawo-dla-studenta, pomoc-psychologiczna, ankiety-dydaktyczne) (STU-01, STU-02, STU-03)

### Phase 4: Samorząd + Projekty + Partnerzy
**Goal**: Wszystkie strony Samorządu z prawdziwymi danymi osobowymi, 9 projektów z opisami, regulacje z linkami PDF, strona współprac z logotypami partnerów
**Depends on**: Phase 3
**Requirements**: ORG-01, ORG-02, ORG-03, ORG-04, ORG-05, ORG-06, PROJ-01, PART-01, DOC-01
**Success Criteria** (what must be TRUE):
  1. `/zarzad` wyświetla 9 kart MemberCard z prawdziwymi danymi (Radliński, Smereczniak, Stachowski, Tyrakowski, Vogel, Pytel, Woźniak, Hural, Stępień)
  2. `/rada-uczelniana` wyświetla opis RUSS + 12 kart radnych + linki GDrive (Raporty, Uchwały 2025/2026)
  3. `/przewodniczacy-i-wiceprzewodniczacy` wyświetla Emilię Ćwiklińską + 3 Wiceprzewodniczących z emailami @samorzad.ue.wroc.pl
  4. `/nasze-projekty` wyświetla 9 kart projektów z opisami (ADAPCIAK, ANIMALIA, BAL UEW, Dni Adaptacyjne, GRADUETION, Mosty Ekonomiczne, Test Wiedzy, TEDxUEW, UE PARTY)
  5. `/regulacje-wewnetrzne` wyświetla 6 dokumentów PDF z działającymi linkami
  6. `/wspolprace` wyświetla kartę Karola Vogla (karol.vogel@) + formularz + loga partnerów (BNY jako Strategic, PwC, Pasibus, Phinance, Raben, Techland, Pyszne.pl, UPS, Bielenda, MU1, Slice of Heaven, UPM)
**Plans**: TBD
**UI hint**: yes

### Phase 5: Formularze + Strefa Działacza + 404
**Goal**: Wszystkie formularze przez API routes, Strefa Działacza z Google OAuth (@samorzad.ue.wroc.pl only), lista obecności, AI chatbot, własna strona 404
**Depends on**: Phase 4
**Requirements**: FORM-01, FORM-02, FORM-03, AUTH-01, AUTH-02, CRA-01, ATTEND-01, AI-01, PAGE-404
**Success Criteria** (what must be TRUE):
  1. Formularz kontaktowy (`/formularz`) POSTuje do `/api/formularz` i email dociera na kontakt@samorzad.ue.wroc.pl
  2. Formularz współpracy POSTuje do `/api/formularz` z routingiem do karol.vogel@samorzad.ue.wroc.pl
  3. `/strefa-dzialacza` przekierowuje niezalogowanych do strony logowania Google
  4. Logowanie kontami spoza @samorzad.ue.wroc.pl jest odrzucane z komunikatem błędu
  5. Po zalogowaniu widoczny link do CRA (cra-system.vercel.app) + moduł listy obecności
  6. AI chatbot na stronie publicznej odpowiada na pytania o SSUEW (FAQ-style)
  7. Wejście na nieistniejący URL pokazuje własną stronę 404 z nawigacją powrotną
**Plans**: TBD

### Phase 6: SEO + Accessibility + Deploy
**Goal**: Lighthouse 90+, OG meta tagi na wszystkich stronach, accessibility compliance, `next export` deployowany
**Depends on**: Phase 5
**Requirements**: SEO-01, A11Y-01, DEPLOY-01, DEPLOY-02
**Success Criteria** (what must be TRUE):
  1. Lighthouse Performance ≥ 90 i Accessibility ≥ 90 na każdej stronie
  2. Każda strona ma unikalne OG meta tagi (title, description, og:image)
  3. `next export` produkuje poprawny statyczny HTML — `npx serve out` działa bez błędów
  4. Wszystkie interaktywne elementy mają widoczne focus rings i poprawne ARIA labels
  5. Strona dostępna pod staging URL lub uczelniany hosting
**Plans**: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Bug Fixes and CSS Foundation | 3/3 | Complete | 2026-05-15 |
| 2. Next.js Foundation | 1/3 | Complete    | 2026-05-15 |
| 3. Strona Główna + Strefa Studenta | 0/6 | Not started | - |
| 4. Samorząd + Projekty + Partnerzy | 0/? | Not started | - |
| 5. Formularze + Strefa Działacza | 0/? | Not started | - |
| 6. SEO + Accessibility + Deploy | 0/? | Not started | - |
