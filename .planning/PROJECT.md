# Strona Samorządu Studentów UEW (SSUEW)

## What This Is

Kompletna strona internetowa Samorządu Studentów Uniwersytetu Ekonomicznego we Wrocławiu — migracja z Wix na Next.js 14 + TypeScript + Tailwind CSS. Serwis dla studentów UEW z pełną treścią z samorzad.ue.wroc.pl, animacjami w stylu agencji (Framer Motion, Lenis), oraz chronioną Strefą Działacza z Google OAuth dla członków samorządu. Część publiczna exportowana statycznie na hosting uczelniany; API routes na Vercel.

## Core Value

Student wchodzi na stronę, natychmiast widzi profesjonalizm samorządu i bez trudu znajduje to, czego potrzebuje — czy to aktualności, dokumenty do pobrania, czy kontakt.

## Requirements

### Validated

- ✓ Wielostronicowa struktura HTML — istniejący kod (vanilla)
- ✓ Responsywny design z CSS variables — istniejący kod
- ✓ Hero z typewritera, scroll animacje, liczniki statystyk — istniejący kod
- ✓ Logo Samorządu w navbarze i footerze — istniejący kod
- ✓ Formularz kontaktowy przez Netlify Forms — Phase 1
- ✓ Linki nawigacyjne na podstronach naprawione — Phase 1
- ✓ Typewriter reinicjalizuje się po zmianie języka — Phase 1
- ✓ Form success message z dismiss button — Phase 1
- ✓ Brak inline styles w HTML — Phase 1

### Active

**Foundation Next.js:**
- [ ] Next.js 14 App Router + TypeScript + Tailwind zainicjalizowany, `next export` działa
- [ ] Navbar 2-poziomowy (dropdown) z pełną strukturą menu z briefu, glassmorphism, mobile drawer
- [ ] Footer z prawdziwymi danymi (adres, social media linki, email)
- [ ] Design tokens z Phase 1 (style.css) przeportowane do Tailwind config + Framer Motion scroll animations
- [ ] Lenis smooth scroll + prefers-reduced-motion

**Treści publiczne — Strefa Studenta:**
- [ ] Strona `/dla-studenta` — hub z kafelkami TileGrid + szybkie linki (USOS, Intranet, Plan)
- [ ] `/prawa-studenta` — akordeon z 7 prawami studenta
- [ ] `/infopacki` — lista 8 infopacków z linkami Google Drive
- [ ] `/rzecznik-praw-studenta` — karta Jakuba Buchty + formularz z routingiem do rps@
- [ ] `/stypendia` — hub z kafelkami + tabela 10 załączników z linkami GDrive
- [ ] `/mapa-kampusu`, `/wladze-rektorskie`, `/dziekan-i-prodziekani` — strony z treścią
- [ ] `/prawo-dla-studenta`, `/pomoc-psychologiczna`, `/ankiety-dydaktyczne`

**Treści publiczne — Samorząd:**
- [ ] `/nasza-dzialalnosc` — misja SSUEW
- [ ] `/struktura-samorzadu` — kafelki do organów
- [ ] `/przewodniczacy-i-wiceprzewodniczacy` — Emilia Ćwiklińska + 3 Wiceprzewodniczących (karty MemberCard)
- [ ] `/zarzad` — 9 kart MemberCard (prawdziwe dane z briefu)
- [ ] `/rada-uczelniana` — opis RUSS + 12 kart radnych + linki do GDrive (Raporty, Uchwały)
- [ ] `/komisja-rewizyjna`, `/studencka-komisja-wyborcza` — strony organów
- [ ] `/regulacje-wewnetrzne` — lista 6 PDF-ów (pobrane z Wix → repo)
- [ ] `/nasze-projekty` — 9 kart projektów z opisami i galerią (ADAPCIAK, ANIMALIA, BAL UEW, Dni Adaptacyjne, GRADUETION, Mosty Ekonomiczne, Test Wiedzy, TEDxUEW, UE PARTY)
- [ ] `/filia-jelenia-gora`

**Treści publiczne — Reszta:**
- [ ] Strona główna (`/`) — hero z Morphing Text, O nas, statystyki (animowane liczniki), Kalendarz wydarzeń
- [ ] `/wspolprace` (dawne /partnerzy) — karta Karola Vogla + "Dlaczego warto?" + formularz + loga partnerów
- [ ] `/kontakt`, `/formularz`, `/wspolpracuj-z-nami`
- [ ] `404.html` — własna strona błędu
- [ ] Aktualności — filtrowanie po kategorii, lepszy układ, paginacja, search
- [ ] OG meta tagi na wszystkich stronach

**Strefa Działacza:**
- [ ] Google OAuth restrykcja do @samorzad.ue.wroc.pl
- [ ] Chronione routes `/strefa-dzialacza/**`
- [ ] Przekierowanie do CRA (cra-system.vercel.app) po zalogowaniu
- [ ] Lista obecności na spotkaniach
- [ ] AI chatbot dla studentów na stronie publicznej

### Out of Scope

- Vanilla HTML/CSS/JS jako docelowy stack — zastąpiony przez Next.js
- Wix hosting — migracja z Wixa na hosting uczelniany + Vercel
- System płatności / e-commerce — poza zakresem działalności samorządu
- Własny backend CMS — treści w JSON + GDrive + GitHub

## Context

**Phase 1 zakończona (2026-05-15):** Vanilla prototype z naprawionymi bugami (Netlify Forms, nav linki, typewriter, form dismiss) i wyczyszczonymi inline styles. Stanowi punkt odniesienia dla nowego projektu Next.js.

**Zmiana stacku (2026-05-15):** Po dostarczeniu pełnego briefu z researchu samorzad.ue.wroc.pl zdecydowano o migracji do Next.js 14 + TypeScript + Tailwind. Vanilla prototype pozostaje w repo jako reference, nowa strona budowana od początku w tym samym repozytorium (nowy katalog lub przekształcenie struktury).

**Prawdziwe dane dostępne z research:** Pełna lista osób (Zarząd, RUSS, Prezydium), treści wszystkich podstron, linki GDrive do infopacków i dokumentów, linki social media, dane kontaktowe.

**Zdjęcia osób:** Na razie placeholdery — wgranie zdjęć w późniejszej fazie.

**PDFy regulaminów:** Aktualnie na Wix CDN — wymagają pobrania i wgrania do `/public/docs/` przed deployem.

## Constraints

- **Stack**: Next.js 14+ (App Router) + TypeScript + Tailwind CSS
- **Build**: `next export` (static HTML) dla części publicznej → SFTP na hosting uczelniany
- **API routes**: Vercel (serverless) — formularz kontaktowy, Google OAuth, lista obecności, AI chatbot
- **Animacje**: Framer Motion + Lenis smooth scroll
- **Formularze**: /api/formularz (serverless) → email routing
- **Dokumenty**: Pliki PDF w `/public/docs/` lub linki GDrive
- **Autoryzacja**: NextAuth.js v5 + Google OAuth, restricja do @samorzad.ue.wroc.pl

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Vanilla HTML → Next.js | Brief dostarcza pełen scope i potrzeby które vanilla nie spełnia (OAuth, API, TypeScript) | — Pending |
| next export + Vercel API split | Hosting uczelniany nie wspiera Node.js; API routes na Vercel serverless | — Pending |
| Netlify Forms → /api/formularz | Formularz wymaga routingu do różnych emaili (rps@, kontakt@) | — Pending |
| Treści w JSON files | Zarząd/RUSS często się zmienia; edycja JSON bez znajomości TS/HTML | — Pending |
| Google OAuth (nie własna auth) | UEW używa Google Workspace; @samorzad.ue.wroc.pl to subdomena tej domeny | — Pending |

## Evolution

**After each phase transition:**
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions

**After each milestone:**
1. Full review of all sections
2. Core Value check — still the right priority?
3. Update Context with current state

---
*Last updated: 2026-05-15 after stack pivot to Next.js following full brief delivery*
