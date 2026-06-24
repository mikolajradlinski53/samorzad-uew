# Dokumenty do pobrania

Wrzuć tu pliki PDF, a następnie wpisz ich ścieżkę w `src/lib/documents.ts`
(pole `href`, np. `/dokumenty/regulamin-samorzadu.pdf`). Wtedy plakietka
„Wkrótce" na stronie **automatycznie** zmieni się w działające pobieranie.

Sugerowana organizacja (dowolna — liczy się ścieżka w `href`):

```
dokumenty/
  regulacje/   ← 6 regulaminów wewnętrznych
  prawo/       ← statut, regulamin studiów, regulamin organizacyjny
  zarzadzenia/ ← komplet zarządzeń (lub podaj link do folderu)
  stypendia/   ← komplet wniosków/dokumentów
  mapa/        ← mapa kampusu (PDF/PNG)
```

Stare adresy plików (z Wixa) są zachowane w komentarzach w
`src/lib/documents.ts` — to źródło do pobrania i migracji.
