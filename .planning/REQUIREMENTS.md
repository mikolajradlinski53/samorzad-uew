# Requirements: Samorząd Studentów UEW

**Defined:** 2026-05-13
**Core Value:** Student wchodzi na stronę, natychmiast widzi profesjonalizm samorządu i bez trudu znajduje to, czego potrzebuje.

## v1 Requirements

### Bug Fixes (produkcja)

- [x] **BUG-01**: Formularz kontaktowy wysyła dane przez Netlify Forms (integracja `data-netlify`, `method="POST"`, AJAX, spam-protection honeypot)
- [x] **BUG-02**: Linki nawigacyjne na podstronach wskazują na `index.html#section` zamiast bare `#section`
- [x] **BUG-03**: Efekt typewritera reinicjalizuje się poprawnie po zmianie języka PL/EN
- [x] **BUG-04**: Po wysłaniu formularza komunikat sukcesu można zamknąć i wysłać kolejną wiadomość

### Foundation (CSS / architektura)

- [x] **FOUND-01**: Wszystkie inline style wyciągnięte z HTML do `style.css` (hero `<style>` block, atrybuty `style=` na elementach logo)
- [ ] **FOUND-02**: AOS (Animate On Scroll) zintegrowany przez CDN — zamienia ręczny IntersectionObserver na `data-aos` atrybuty
- [ ] **FOUND-03**: Lenis smooth scroll zintegrowany przez CDN — płynne przewijanie w stylu agencji
- [ ] **FOUND-04**: Plus Jakarta Sans dodany jako font display dla nagłówków (obok Inter dla body)

### Visual Redesign

- [ ] **DESIGN-01**: Hero section przeprojektowany w stylu agencji — bold typografia, animowane elementy tła, silne CTA
- [ ] **DESIGN-02**: Navbar z glassmorphism poprawiony i konsekwentny na wszystkich podstronach (`.navbar--always-glass`)
- [ ] **DESIGN-03**: Nowe komponenty kart i sekcji — highlight strips, większe liczby statystyk, modernizacja card-grid
- [ ] **DESIGN-04**: Footer przeprojektowany — bardziej strukturalny, wyraźniejsze kolumny, social linki z ikonami

### New Pages & Sections

- [ ] **PAGES-01**: Strona `dokumenty.html` — lista PDF-ów pogrupowana po kategorii (Uchwały, Regulaminy, Protokoły), każdy z datą i linkiem do pobrania
- [ ] **PAGES-02**: Sekcja Komisje w `zarzad.html` — karty komisji tematycznych z nazwą, zakresem działania i przewodniczącym
- [ ] **PAGES-03**: Strona `404.html` — własna strona błędu z nawigacją powrotną (Netlify automatycznie ją serwuje)
- [ ] **PAGES-04**: Sekcja Partnerzy z prawdziwymi logotypami — zastąpienie placeholderów obrazkami z `alt` tekstem

### Aktualności

- [ ] **NEWS-01**: Filtrowanie aktualności po kategorii (Ogłoszenie, Kampus, Raport, Wydarzenie) — vanilla JS z `data-category` atrybutami
- [ ] **NEWS-02**: Ulepszony układ strony aktualności — wyróżniony najnowszy post na górze + grid mniejszych kart
- [ ] **NEWS-03**: Paginacja na stronie aktualności — client-side JS, widoczność po 6 artykułów
- [ ] **NEWS-04**: Wyszukiwanie na stronie aktualności — client-side, filtrowanie po tytule i treści

### Quality & Performance

- [ ] **QUAL-01**: Nawigacja mobilna poprawiona — hamburger z animacją X, slide menu z góry, touch-friendly
- [ ] **QUAL-02**: Lighthouse score ≥ 90 w kategoriach Performance i Accessibility
- [ ] **QUAL-03**: Open Graph meta tagi na wszystkich stronach — tytuł, opis, obraz dla social media preview
- [ ] **QUAL-04**: `prefers-reduced-motion` obsługiwany — animacje wyłączone dla użytkowników wrażliwych na ruch

## v2 Requirements

### Content Management

- **CMS-01**: System zarządzania treścią (headless CMS) dla aktualności bez edycji HTML
- **CMS-02**: System komentarzy pod aktualnościami

### Advanced Features

- **ADV-01**: Kalendarz wydarzeń z filtrowaniem po miesiącu
- **ADV-02**: Newsletter / zapis na mailing list
- **ADV-03**: Galeria zdjęć z wydarzeń
- **ADV-04**: Wersja PDF biuletynów do pobrania

## Out of Scope

| Feature | Reason |
|---------|--------|
| Backend / serwer aplikacyjny | Stack vanilla + Netlify wystarczy; dodanie backendu = nowa infrastruktura |
| System logowania / panel admina | Treści zarządzane przez Git — prostszy workflow dla samorządu |
| Framework JS (React/Vue/Next.js) | Niepotrzebna komplikacja; projekt już działa w vanilla |
| Embedded social media feeds | Problemy GDPR, wolne iframy — link do profili zamiast embeddowania |
| reCAPTCHA na formularzu | Netlify honeypot wystarczy na wolumen studencki |
| Per-article osobne HTML pages | Nietrwałe bez systemu szablonów; pełny tekst w kartach + link do social |
| System płatności | Poza zakresem działalności samorządu |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| BUG-01 | Phase 1 | Complete |
| BUG-02 | Phase 1 | Complete |
| BUG-03 | Phase 1 | Complete |
| BUG-04 | Phase 1 | Complete |
| FOUND-01 | Phase 1 | Complete |
| FOUND-02 | Phase 2 | Pending |
| FOUND-03 | Phase 2 | Pending |
| FOUND-04 | Phase 2 | Pending |
| DESIGN-01 | Phase 2 | Pending |
| DESIGN-02 | Phase 2 | Pending |
| DESIGN-03 | Phase 2 | Pending |
| DESIGN-04 | Phase 2 | Pending |
| QUAL-01 | Phase 2 | Pending |
| QUAL-04 | Phase 2 | Pending |
| PAGES-01 | Phase 3 | Pending |
| PAGES-02 | Phase 3 | Pending |
| PAGES-03 | Phase 3 | Pending |
| PAGES-04 | Phase 3 | Pending |
| NEWS-01 | Phase 3 | Pending |
| NEWS-02 | Phase 3 | Pending |
| NEWS-03 | Phase 3 | Pending |
| NEWS-04 | Phase 3 | Pending |
| QUAL-03 | Phase 3 | Pending |
| QUAL-02 | Phase 4 | Pending |

**Coverage:**
- v1 requirements: 24 total
- Mapped to phases: 24
- Unmapped: 0 ✓

---
*Requirements defined: 2026-05-13*
*Last updated: 2026-05-13 after roadmap creation — traceability updated to 4-phase structure*
