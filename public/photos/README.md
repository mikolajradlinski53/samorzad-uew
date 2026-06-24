# Zdjęcia na stronę SSUEW

Wrzuć pliki wg poniższej listy, a następnie w `src/lib/photos.ts` w obiekcie
`USE_LOCAL` ustaw daną sekcję na `true` (każda sekcja niezależnie:
`hero` / `zycie` / `zarzad` / `russ`).

Format: **JPG** lub **WebP**, zoptymalizowane (każdy plik najlepiej < ~300 KB).
Kadr (proporcje) jest ważny — zdjęcia są przycinane do podanego kształtu.
Duże pliki nie szkodzą jakości, ale spowalniają repo — warto je najpierw
zmniejszyć (np. do ~800×1000 px dla kadrów 4:5).

> Hero jest już WŁĄCZONE (`hero: true`) na 5 zdjęciach. Dorzucisz kolejne —
> zmień `HERO_COUNT` w `photos.ts` na liczbę plików.

---

## 1. Hero (galeria na stronie głównej) → `public/photos/hero/`

8 zdjęć **pionowych**, kadr **4:5** (np. 800×1000 px). Najlepiej energetyczne
ujęcia z wydarzeń: ludzie, tłum, scena, uśmiechy.

```
hero/01.jpg
hero/02.jpg
hero/03.jpg
hero/04.jpg
hero/05.jpg
hero/06.jpg
hero/07.jpg
hero/08.jpg
```

## 2. Sekcja „Życie studenckie" → `public/photos/zycie/`

2 zdjęcia **poziome**, kadr **3:2** (np. 1600×1100 px), duże i wyraźne.

```
zycie/integracja.jpg   ← energia, wydarzenie, integracja (np. Adapciak, UE Party)
zycie/wsparcie.jpg     ← spokojniejsze, „pomocowe" (np. rozmowa, dyżur, wsparcie)
```

## 3. Zarząd → `public/photos/zarzad/`

5 zdjęć **portretowych**, kadr **4:5** (np. 800×1000 px), spójny styl (to samo
tło/światło dla wszystkich wygląda najlepiej). Kolejność = kolejność osób w sekcji „Zarząd".

```
zarzad/01.jpg
zarzad/02.jpg
zarzad/03.jpg
zarzad/04.jpg
zarzad/05.jpg
```

## 4. RUSS (Rada Uczelniana) → `public/photos/russ/`

12 zdjęć **portretowych**, kadr **4:5** (np. 800×1000 px), spójny styl.
Kolejność = kolejność osób w sekcji „Skład Rady".

```
russ/01.jpg
russ/02.jpg
russ/03.jpg
russ/04.jpg
russ/05.jpg
russ/06.jpg
russ/07.jpg
russ/08.jpg
russ/09.jpg
russ/10.jpg
russ/11.jpg
russ/12.jpg
```

---

Gdy wrzucisz pliki i ustawisz `USE_LOCAL_PHOTOS = true`, daj znać — sprawdzę,
czy wszystko się ładuje, i w razie potrzeby dostroję kadrowanie.
