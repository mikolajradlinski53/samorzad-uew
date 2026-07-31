# Audyt WCAG 2.1 AA + naprawy — design

> Data: 2026-07-30. Pierwszy tor z uzgodnionej kolejki (audyt WCAG → tracker spraw
> → command bar AI). Twarde wymaganie projektu: zgodność z WCAG (ustawa o
> dostępności cyfrowej — poziom 2.1 AA); istniejąca Deklaracja dostępności musi
> odzwierciedlać stan faktyczny.

## Cel

Zweryfikować i naprawić dostępność całej publicznej strony (~35 tras × PL/EN,
oba motywy, mobile 375px), zostawić **automatyczny test a11y** pilnujący regresji
i zaktualizować Deklarację dostępności zgodnie z wynikiem.

## Decyzje (zatwierdzone)

- **Tryb:** audyt + naprawy w jednym torze (nie raport-do-decyzji).
- **Standard:** WCAG 2.1 AA.
- **Narzędzia:** axe-core przez Playwright na zbudowanej aplikacji + ręczny
  przegląd kodu (to, czego automat nie łapie).

## Architektura

### 1. Skan automatyczny (nowe devDeps: `@playwright/test`, `@axe-core/playwright`)
- Skrypt/test `tests/a11y.spec.ts`: podnosi zbudowaną aplikację (`next start`),
  iteruje po WSZYSTKICH trasach z `src/lib/searchIndex.ts` (job źródła prawdy —
  to samo, co zasila sitemap) w wariantach: PL + EN, light + dark (przełączenie
  motywu), viewport desktop + 375px (przynajmniej PL×light×desktop pełne,
  reszta na reprezentatywnej próbie — pełna macierz tylko dla stron „ciężkich":
  home, stypendia-hub, kalkulator w hubie, kontakt, szukaj).
- Reguły: axe `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`. Wynik: fail przy
  jakimkolwiek violation (po naprawach test = zielony strażnik regresji).
- Nowy skrypt npm: `test:a11y` (osobno od `npm test` — wymaga builda).

### 2. Przegląd ręczny (kodu) — checklist tego, czego axe nie widzi
- Klawiatura: pełna nawigowalność (Nav dropdowny, SearchCommand ⌘K, HubNav,
  kalkulator, MapEmbed/VideoEmbed fasady, mobile menu focus-trap), widoczny
  focus na tokenach w OBU motywach, brak pułapek.
- Semantyka: hierarchia nagłówków per strona (jeden h1, bez przeskoków),
  landmarki, `aria-current`/`aria-expanded` w interakcjach, sensowne alt-y.
- Kontrast: przegląd par tokenów (ink-tertiary na bg-base/surface/elevated,
  accent na bg, placeholdery, disabled) w light i dark — obliczeniowo (skrypt
  liczący kontrasty z wartości w `globals.css`), nie na oko.
- Reduced-motion: każda animacja ma ścieżkę `reduce` (przegląd użyć motion/
  scrollIntoView/keyframes).
- Formularze: etykiety, opisy błędów (`aria-describedby`), `aria-live` statusów.
- Rozmiary celów dotykowych (min 24×24 / zalecane 44) na mobile.

### 3. Naprawy
- Wszystkie znalezione problemy naprawiamy w tym torze (małe commity per obszar).
- Wyjątki (jeśli coś wymaga treści/decyzji użytkownika, np. brakujące alt-y do
  przyszłych zdjęć) — trafiają do raportu jako „oczekuje treści", nie blokują.

### 4. Deliverables
- `docs/a11y/AUDIT-2026-07.md` — raport: metodologia, znaleziska (ranga:
  critical/serious/moderate/minor, WCAG-kryterium, plik), status napraw,
  pozycje „oczekuje treści", zalecenie sesji z prawdziwym czytnikiem ekranu.
- Naprawione komponenty/strony (commity tematyczne).
- `tests/a11y.spec.ts` + `npm run test:a11y` — zielony po naprawach.
- Zaktualizowana treść Deklaracji dostępności (`deklaracja` w messages PL/EN):
  data przeglądu, metoda (samoocena wsparta narzędziem), stan zgodności.

## Poza zakresem
- Sesja z prawdziwym czytnikiem ekranu (NVDA/VoiceOver) — rekomendacja w
  raporcie; wymaga człowieka.
- Dostępność przyszłych PDF-ów (dokumenty jeszcze nie wgrane) — nota w raporcie.
- CI/GitHub Actions (test odpalany lokalnie; wpięcie w CI = osobna decyzja).

## Ryzyka
- Playwright na Windows + Next 16: instalacja przeglądarek (~150 MB) i czas
  skanu ~35 tras × warianty (minuty, nie sekundy) — akceptowalne dla narzędzia
  uruchamianego na żądanie.
- Axe może flagować false-positives (np. kontrast na gradientach) — każdy
  finding weryfikowany, uzasadnione wyjątki dokumentowane w raporcie, nie
  wyciszane globalnie.
