# Strona Samorządu Studentów UEW

## What This Is

Strona internetowa Samorządu Studentów Uniwersytetu Ekonomicznego we Wrocławiu — wielostronicowy serwis w stylu nowoczesnej agencji z płynnymi animacjami, który robi wrażenie przy pierwszym wejściu i pozwala studentom szybko znaleźć to czego szukają. Budowana jako czyste HTML/CSS/JS, hostowana na Netlify z auto-deployem z GitHuba. Merytorycznie wzorowana na samorzad.ue.wroc.pl.

## Core Value

Student wchodzi na stronę, natychmiast widzi profesjonalizm samorządu i bez trudu znajduje to, czego potrzebuje — czy to aktualności, dokumenty do pobrania, czy kontakt.

## Requirements

### Validated

- ✓ Wielostronicowa struktura (index, aktualności, wydarzenia, zarząd, projekty, strefa studenta) — istniejący kod
- ✓ Responsywny design z CSS variables i breakpointami mobilnymi — istniejący kod
- ✓ Przełącznik języka PL/EN z localStorage — istniejący kod
- ✓ Animacje scroll (fade-up, IntersectionObserver) — istniejący kod
- ✓ Hero z efektem typewritera — istniejący kod
- ✓ Sekcja statystyk z animacją liczników — istniejący kod
- ✓ Logo Samorządu w navbarze i footerze — istniejący kod
- ✓ Deploy na Netlify via GitHub (branch main) — istniejący kod

### Active

- [ ] Redesign wizualny w stylu agencji/studia — smooth scrolling, efekty hover, animacje wejścia sekcji
- [ ] Poprawa wersji mobilnej — lepsza nawigacja, czytelność, touch-friendly elementy
- [ ] Sekcja Dokumentów / Uchwał — lista PDF-ów do pobrania, pogrupowanych po kategoriach
- [ ] Sekcja Komisji / Struktury organizacyjnej — schemat komisji tematycznych z opisami
- [ ] Rozbudowana strona Aktualności — filtrowanie po kategorii, paginacja, czytelne karty wpisów
- [ ] Formularz kontaktowy z realnym wysyłaniem — integracja Netlify Forms
- [ ] Sekcja Partnerów z prawdziwymi logotypami (zamiast placeholderów)
- [ ] Naprawa znanych bugów (typewriter po zmianie języka, linki w nawigacji podstron, formularz success message)

### Out of Scope

- Backend / CMS / baza danych — za duży nakład na statyczną stronę; treści zarządzane przez edycję HTML i Git
- System logowania / panel admina — zbędne, Netlify + GitHub to nasz "CMS"
- Framework JS (React/Vue/Next.js) — niepotrzebna komplikacja dla tej skali projektu
- System płatności / e-commerce — poza zakresem działalności samorządu

## Context

Istniejąca strona działa i jest deployowana na Netlify. Codebase to czyste HTML/CSS/JS bez bundlera. Zidentyfikowane problemy techniczne z codebase mapper:

- Inline style w HTML zamiast klas CSS (dług techniczny)
- Formularz kontaktowy nie wysyła danych (krytyczny bug — użytkownicy myślą że wysłali)
- Linki nawigacji na podstronach nie działają poprawnie (np. `#aktualnosci` zamiast `index.html#aktualnosci`)
- Typewriter nie synchronizuje się po zmianie języka
- Dane są hardcoded w HTML (treści wymagają edycji kodu)

Treści: częściowo realne (logo, część informacji), część wymaga uzupełnienia.
Referencja merytoryczna: samorzad.ue.wroc.pl

## Constraints

- **Stack**: HTML/CSS/JS vanilla — brak frameworków, brak buildu, brak backendu
- **Hosting**: Netlify (static) + GitHub (main branch auto-deploy)
- **Formularze**: Netlify Forms — jedyna dopuszczalna metoda wysyłania formularzy
- **Dokumenty**: Statyczne pliki PDF w repozytorium lub przez external link
- **Kompatybilność**: Nowoczesne przeglądarki (Chrome, Firefox, Safari, Edge) — bez IE

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Vanilla HTML/CSS/JS zamiast frameworka | Projekt już istnieje w tym stacku; brak buildu = prostszy deploy; wystarczający dla tej skali | — Pending |
| Netlify Forms dla formularza | Zero backendu, darmowy tier pokrywa potrzeby samorządu, natychmiastowa integracja | — Pending |
| Statyczne PDF-y w repo dla dokumentów | Proste, darmowe, wersjonowane; admin dodaje pliki przez Git | — Pending |
| Redesign ewolucyjny (nie rewrite) | Zachowujemy działającą strukturę, ulepszamy warstwę wizualną i uzupełniamy treść | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd:transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-05-13 after initialization*
