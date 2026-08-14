# Zdjęcia projektów

Każdy projekt jest teraz dużym rozdziałem fotograficznym, dlatego potrzebuje
**trzech kadrów**, nie jednej miniatury:

- `cover.jpg` — główne zdjęcie poziome, najlepiej 3:2 lub 16:10, min. 1600 px szerokości;
- `detail-01.jpg` — detal / emocja / człowiek, kadr 4:5;
- `detail-02.jpg` — szeroki kontekst / tłum / przestrzeń, kadr 3:2.

Struktura folderów:

```text
projekty/
  adapciak/cover.jpg
  adapciak/detail-01.jpg
  adapciak/detail-02.jpg
  animalia/cover.jpg
  animalia/detail-01.jpg
  animalia/detail-02.jpg
  bal/...
  dni/...
  graduetion/...
  mosty/...
  test/...
  tedx/...
  party/...
```

Zdjęcia powinny pokazywać różne skale: jedno ujęcie ustanawiające miejsce,
jedno bliskie i emocjonalne, jedno dokumentujące rezultat lub pracę zespołu.
Nie wrzucaj trzech niemal identycznych zdjęć grupowych.

Po skompletowaniu **wszystkich 27 plików** ustaw `projekty: true` w
`src/lib/photos.ts`. Dopóki przełącznik jest wyłączony, strona wykorzystuje
kilka prawdziwych zdjęć SSUEW dostępnych już w hero, a przy pozostałych
projektach pokazuje celowy plakat typograficzny — bez stocków.
