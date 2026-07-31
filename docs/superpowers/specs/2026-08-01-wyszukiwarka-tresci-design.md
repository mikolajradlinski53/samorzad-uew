# Wyszukiwarka pełnotreściowa (M2a) — design

> Data: 2026-08-01. Etap M2a z kamienia milowego „Asystent". Domyka realną lukę:
> `⌘K` indeksuje dziś tylko 31 tytułów stron + ręczne słowa kluczowe, a ~50 tys.
> znaków treści jest niewyszukiwalne. Zero kosztów, zero kluczy, zero RODO.

## Cel

Student wpisuje w `⌘K` pytanie („do kiedy wniosek o stypendium", „poprawa oceny")
i dostaje **fragment treści z odpowiedzią** plus link do konkretnej sekcji — zamiast
pustych wyników.

## Kluczowa obserwacja

`NextIntlClientProvider` już ładuje **wszystkie** tłumaczenia do przeglądarki.
Indeks budujemy z tego, co jest w pamięci — **bez pliku do pobrania, bez kroku
budowania, bez transferu**.

## Architektura

### `src/lib/knowledge.ts` (czyste funkcje, testowane)
- `buildPassages(messages, locale): Passage[]` — spłaszcza drzewo tłumaczeń do
  fragmentów. `Passage = { text, namespace, href, label }`. Pomija krótkie/techniczne
  wartości (< 40 znaków, klucze `meta*`/`og*`/`aria*`), bo to nie jest treść.
- `NAMESPACE_ROUTES` — mapa namespace → `{ href, label }` (np. `stypRektora` →
  `/stypendia#rektora`). Namespace bez wpisu jest pomijany (nie zgadujemy URL-i).
- `searchPassages(passages, query, limit): Hit[]` — dopasowanie **odporne na polskie
  znaki** (normalizacja NFD, „stypendium" = „stypendjum" = „STYPENDIUM"), ranking:
  trafienie frazy > wszystkie słowa > część słów. `Hit` niesie fragment z podświetleniem
  (offsety trafień, nie HTML).

### `SearchCommand.tsx` (rozszerzenie)
Pod istniejącymi wynikami stron dochodzi sekcja **„W treści"**: fragment (~160 znaków
wokół trafienia, z podświetleniem) + etykieta źródła. Klik → nawigacja do `href`.
Nawigacja klawiaturą obejmuje obie sekcje (jedna lista fokusa). Bez zmian w wyglądzie
palety; sekcja znika, gdy brak trafień.

## Poza zakresem
- Warstwa AI (M2b — po wgraniu PDF-ów regulaminów i zapewnieniu budżetu).
- Wyszukiwanie w PDF-ach i danych kalkulatora.
- Zmiana wyglądu palety `⌘K`.

## Testy
`knowledge.ts` w Vitest: budowa fragmentów (pomijanie meta/krótkich), mapowanie
namespace→href, wyszukiwanie bez ogonków, ranking (fraza przed pojedynczym słowem),
brak trafień → `[]`. UI weryfikowany buildem + ręcznie.
