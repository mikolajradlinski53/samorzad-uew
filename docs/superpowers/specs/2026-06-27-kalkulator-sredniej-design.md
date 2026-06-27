# Kalkulator średniej + sylabus — design

> Data: 2026-06-27. Pierwszy tor z burzy mózgów „narzędzia studenckie". Realizuje
> zasadę „per-page soul" z `DESIGN.md` §3: ruch i widget wynikają z funkcji strony.

## Cel

Narzędzie, w którym student wybiera **kierunek → stopień → rok**, dostaje
**automatycznie wczytaną listę przedmiotów z ECTS** (z kurowanego zbioru danych),
wpisuje oceny i widzi **średnią ważoną ECTS-ami** oraz kontekst (zebrane ECTS,
orientacyjny próg stypendium Rektora). Działa w całości w przeglądarce — bez
backendu i bez wysyłania danych.

Wartość: realna użyteczność (powód, by wracać), wzmocnienie mandatu Samorządu,
„wow przez substancję" zamiast dekoracji.

## Zakres / poza zakresem

W zakresie:
- Wybór programu z kurowanego `programs.ts` + automatyczne wczytanie przedmiotów.
- Tryb ręczny (fallback) dla programów jeszcze nieuzupełnionych.
- Średnia **ważona ECTS-ami** (decyzja zatwierdzona: opcja A).
- Zapis w `localStorage`, pełna dostępność, animacja „domykania" wyniku.

Poza zakresem (osobne tory / przyszłość):
- Integracja z USOS (zaciąganie realnych ocen) — Faza 4, docelowa nakładka.
- Upload i parsowanie PDF sylabusa — odrzucone (kruche).
- Backend / konta / synchronizacja między urządzeniami.

## Źródło danych (opcja A — zatwierdzona)

Kurowany plik `src/lib/programs.ts` pełniący rolę „gniazda" (jak `people.ts`):

```ts
type Course = { name: string; ects: number; pass?: "ocena" | "zal" };
type Term   = { semester: number; courses: Course[] };
type Year   = { year: number; terms: Term[] };
type Degree = { level: "I" | "II" | "jednolite"; years: Year[] };
type Program = { id: string; name: string; degrees: Degree[] };
export const programs: Program[] = [ /* … */ ];
```

- Claude scaffolduje strukturę + **1–2 kierunki pilotażowo** (z sylabusów UEW).
- Mikołaj z czasem dosypuje kolejne kierunki (tor treści).
- Programy nieobecne w pliku → UI proponuje **tryb ręczny**.

## Reguła liczenia

**Średnia ważona ECTS-ami**, liczona tylko po przedmiotach z wpisaną oceną liczbową:

```
średnia = Σ(ocena_i × ects_i) / Σ(ects_i)
```

- Skala ocen: `2.0, 3.0, 3.5, 4.0, 4.5, 5.0`.
- `pass: "zal"` (zaliczenie bez oceny) — **liczy się do sumy ECTS, nie do średniej**.
- Przedmioty bez wpisanej oceny pomijane w liczniku i mianowniku średniej.
- Zasady poprawek/ocen niedostatecznych (czy 2.0 wchodzi do średniej): domyślnie
  liczymy każdą **wpisaną** ocenę; subtelności regulaminowe zostają jako przyszła
  opcja konfiguracyjna (nie blokują MVP).

## Architektura (małe, izolowane jednostki)

- `src/lib/programs.ts` — dane (gniazdo).
- `src/lib/average.ts` — czysta funkcja licząca średnią ważoną + sumę ECTS
  (testowalna w izolacji, bez UI).
- `ProgramPicker` — 3 selecty; klucze czytane z `programs.ts`.
- `CourseGradeTable` — wiersze `przedmiot · ECTS · input oceny`; obsługa trybu
  ręcznego (dodaj/usuń własny wiersz).
- `AverageResult` — wywołuje `average.ts`, animuje „domykanie" wyniku, ogłasza
  zmianę przez `aria-live`.
- `ScholarshipHint` — kontekst (zebrane ECTS vs wymagane, orientacyjny próg
  Rektora); treść statyczna, łatwa do edycji, opisana jako *informacja, nie
  obietnica*.
- Strona: `/kalkulator-sredniej`, linkowana z `/dla-studenta` i `/stypendia`.

## Dane i prywatność

- Liczenie **w przeglądarce**; oceny w `localStorage` (przeżywają odświeżenie).
- **Żadne dane nie opuszczają urządzenia** — zero backendu, zero RODO.
- UI komunikuje wprost: „liczone lokalnie, nic nie wysyłamy".

## Dostępność (WCAG 2.1 AA — od początku)

- Pełna obsługa klawiaturą; każdy input z etykietą.
- Wynik w regionie `aria-live` (ogłaszany przy zmianie).
- `prefers-reduced-motion: reduce` → wynik pojawia się bez rolowania cyfr.
- Selecty i tabela poprawnie zsemantyzowane; kontrast wg tokenów.

## „Dusza" strony

Jedyny ruch: **mechaniczne domknięcie wyniku** po akcji studenta (cyfry
JetBrains Mono rolują do wartości). Spójne z technical-editorial. Brak ozdób.

## Testy

- `average.ts`: przypadki — sama ważona, mieszanka ocena/„zal", puste oceny,
  pojedynczy przedmiot, brak danych (dzielenie przez zero → wynik pusty, nie NaN).
- `programs.ts`: walidacja kształtu danych (każdy Course ma `ects > 0`).
- Dostępność: nawigacja klawiaturą + ogłaszanie `aria-live` (ręczny check).

## Otwarte (nieblokujące)

- Dokładne wartości/treść progów stypendium Rektora — dopniemy przy `ScholarshipHint`.
- Które 1–2 kierunki na pilotaż (Mikołaj wskaże; domyślnie najliczniejsze).
