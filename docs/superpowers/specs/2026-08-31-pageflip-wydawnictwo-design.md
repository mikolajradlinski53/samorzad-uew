# Pageflip — przewracana publikacja na podstronie Wydawnictwo

Data: 2026-08-31
Status: ustalenia domknięte — §11 rozstrzygnięty

## 1. Problem

Podstrona `/wydawnictwo` pokazuje serię „Debiuty Studenckie" jako mur grzbietów
(`SpineWall`) — płaskie prostokąty CSS z tytułem i nazwiskami. Kliknięcie
rozwija metadane obok. Jest to czytelne, ale nie oddaje tego, że seria wydaje
PRAWDZIWE książki z ISBN, DOI i recenzją naukową.

Do tego dochodził problem poważniejszy: wszystkie trzy wpisy w
`src/lib/publications.ts` były **placeholderami z wymyślonymi nazwiskami**
(„Kowalski, J.", „Nowak, A.", „Zielińska, M.") i fikcyjnymi numerami ISBN
(`978-83-XXXX-XXX-X`). Na oficjalnym serwisie uczelni oznaczało to
prezentowanie zmyślonego dorobku. Ten problem znika razem z tym wdrożeniem —
patrz §3.

## 2. Decyzje zamawiającego

Ustalone w rozmowie, w tej kolejności:

1. **Treść stron: prawdziwe skany/PDF od Wydawnictwa.** Nie skład z naszych
   danych, nie fotografie. Materiał dostarczony — patrz §3.
2. **Umiejscowienie: nałożona scena pełnoekranowa.** Mur grzbietów zostaje
   spisem; kliknięcie otwiera książkę na całym ekranie, Escape zamyka. Jedna
   scena 3D obsługuje wszystkie publikacje.
3. **Scena: ciemna pracownia, niezależnie od motywu strony.** Grafitowe tło
   i ciepła plama światła. To NIE jest powtórka błędu z ciemnym hero: tu
   ciemność trwa tyle, co czytanie, i zamyka się Escape'em.
4. **Realizacja: pełna scena 3D (`three`), wariant A.** Prawdziwa bryła
   książki, mapa cieni, kartka deformowana wokół walca.

## 3. Materiał źródłowy

Wydawnictwo UEW dostarczyło komplet:

- `DS_Radomska Witek_New Trends_INTERNET_okl_fin.pdf` — **130 stron**,
  MediaBox 476,22 × 674,65 pt (format B5, proporcja 0,706).
  Uwaga: `okl` w nazwie sugeruje samą okładkę, ale plik zawiera CAŁY tom —
  sprawdzone przez zliczenie obiektów `/Type /Page`.
- `DS_Radomska_Witek-Crab_New Trend_2026_internet.jpg` — okładka 662 × 938 px

Publikacja:

> Radomska, J., Witek-Crabb, A. (Eds.) (2026). *New Trends in Business
> Management. Culture, Strategy, Engagement.* Debiuty Studenckie. Publishing
> House of Wroclaw University of Economics and Business.
> ISBN 978-83-68699-34-0 (druk) / 978-83-68699-35-7 (elektroniczna).
> DOI: 10.15611/2026.35.7

**Licencja: CC BY-SA 4.0** — publikacja stron w serwisie jest dozwolona pod
warunkiem podania autorstwa i zachowania licencji. Oba warunki spełniamy
jawnie w interfejsie czytnika (§7).

### 3.1. Koniec placeholderów

`publications.ts` dostaje dziesięć PRAWDZIWYCH rozdziałów z tomu, z autorami,
zakresami stron i DOI. Wymyślone wpisy znikają. Struktura `Publication`
rozszerza się o `doi`, `pages` i `volume`, bo tom jest pracą zbiorową i
pojedynczy rozdział trzeba umieć zacytować osobno.

| # | Autor | Rozdział | s. | DOI |
|---|---|---|---|---|
| 1 | Daria Dorosh | The Role of Branding in the Success of Startups – Case of Airbnb | 5–16 | …7.01 |
| 2 | Krzysztof Kulig | Strategy Implementation Challenges: The Strategy-as-Practice Perspective | 17–28 | …7.02 |
| 3 | Weronika Lasota | Gamification as an Element of Building Employee Engagement in the Onboarding Process | 29–40 | …7.03 |
| 4 | Marta Narajewska | The Impact of Organisational Culture on Job Satisfaction | 41–51 | …7.04 |
| 5 | Leslie Tawanda Nyatanga | Intergenerational Drivers of Consumption Behaviour | 52–64 | …7.05 |
| 6 | Kinga Sikora | Motivation and Engagement in a Student Non-Profit Organisation (NZS) | 65–74 | …7.06 |
| 7 | Wawrzyniec Sioła | Crafting a Successful Marketing Strategy in the Video Game Industry | 75–86 | …7.07 |
| 8 | Wiktoria Skalska | Managing Cultural Differences in International Organisations | 87–102 | …7.08 |
| 9 | Wiktoria Wilk | The Role of Agile Project Management in a Pandemic Business Environment | 103–115 | …7.09 |
| 10 | Mikołaj Zapotoczny | Modern ISO Audit in a Medium-Sized Automotive Enterprise | 116–128 | …7.10 |

Prefiks DOI: `10.15611/2026.35`. Wszystkie rozdziały CC BY-SA 4.0.

## 4. Czym ta książka JEST, a czym nie jest

To rozstrzygnięcie rządzi resztą specyfikacji.

Strona w rozkładówce ma na ekranie ok. 400–500 px szerokości. Tekst naukowy
złożony na B5 jest w tej skali **nieczytelny i będzie nieczytelny zawsze** —
niezależnie od rozdzielczości tekstury. Wynika z tego twardy wniosek:

> **Pageflip jest PODGLĄDEM PRZEDMIOTU, nie czytnikiem.** Pokazuje, że seria
> wydaje prawdziwe książki, i zachęca do sięgnięcia po tekst. Czytanie odbywa
> się w pełnym PDF-ie w otwartym dostępie.

Dlatego odnośnik „Czytaj pełny tekst" jest elementem OBOWIĄZKOWYM czytnika,
a nie dodatkiem, i stoi w nim na równi z samą książką.

## 5. Architektura

| Moduł | Odpowiedzialność | Zależy od |
|---|---|---|
| `scripts/build-edition.mjs` | PDF → strony WebP + manifest + kopia PDF-a do `public/` | sharp (dev) |
| `src/lib/editions.ts` | **generowany** manifest: wydanie → lista stron | — |
| `src/lib/publications.ts` | metadane rozdziałów (prawdziwe) | — |
| `src/components/wydawnictwo/EditionReader.tsx` | nakładka: Escape, pułapka fokusu, odwrót statyczny | React, editions |
| `src/components/wydawnictwo/editionScene.ts` | scena `three`: kamera, światła, bryła, kartka | three |
| `src/components/wydawnictwo/bakePage.ts` | wypalanie strony na płótnie (papier, cieniowanie przy grzbiecie) | — |
| `SpineWall` (istniejący) | spis; dokłada przycisk „Przejrzyj" gdy wydanie ma strony | editions |

`editionScene.ts` **nie zawiera Reacta** — eksportuje `createScene(canvas, opts)`
zwracające `{ goTo, dispose }`. Dzięki temu logikę 3D da się testować i wymieniać
bez dotykania warstwy widoku, a React nie renderuje 60 razy na sekundę.

### 5.1. Przepływ danych

```
publications.ts (metadane)  ─┐
                             ├─→ SpineWall → przycisk „Przejrzyj" (tylko gdy są strony)
editions.ts (strony+wymiary) ─┘        │
                                       ▼
                        EditionReader (nakładka, a11y, fallback)
                                       │  dynamic import („three" dopiero tutaj)
                                       ▼
                              editionScene (WebGL)
```

`three` ładuje się **wyłącznie po otwarciu czytnika**. Kto nie kliknie
w grzbiet, nie pobiera ani kilobajta silnika.

### 5.2. Strony

**Decyzja: cały tom, 130 stron.** WebP, dłuższa krawędź 1130 px (proporcja
0,706 z MediaBox). Szacunkowo 60–100 KB na stronę tekstową, ok. 10 MB
w repozytorium. Wariant zapasowy (wybór ~15 stron) w §11.2.

Ładowane **oknem wokół bieżącej rozkładówki** (bieżąca ± 2 arkusze), reszta
`loading="lazy"`. Manifest zawiera wymiary każdej strony, żeby scena nie
czekała na plik, zanim ustawi geometrię.

## 6. Mechanika przewracania

Jeden arkusz w ruchu naraz (klasyczna sztuczka flipbooka).

- Siatka 48 × 18, deformowana co klatkę dla postępu `tv ∈ [0,1]`
- `theta = tv · π` wokół grzbietu; `bend = sin(tv · π) · BEND_MAX` — zwinięcie
  narasta do połowy obrotu i opada, więc kartka wygląda na sprężystą
- Wierzchołek w odległości `s` od grzbietu owija walec o promieniu `ρ = PW / bend`
- Lekki skręt wierszowy `LEAD · (z / PH)` — róg prowadzi obrót po przekątnej
- `computeVertexNormals()` po deformacji, inaczej zwinięcie oświetla się płasko
  i cień jest nieprawdziwy
- Jeden `MeshStandardMaterial`, dwie różne strony przez gałąź na
  `gl_FrontFacing` w `onBeforeCompile` (rewers próbkuje `vec2(1−u, v)`, żeby nie
  był lustrzany) — jedna siatka, brak migotania Z

**Stan książki:** `o` = liczba arkuszy leżących po lewej. Rozkładówka spoczynkowa
pokazuje `verso(2o−1) | recto(2o)`. Obrót arkusza `base` kadruje kartkę między
statycznymi `verso(2·base−1) | recto(2·base+2)` i obraca `recto(2·base)` →
`verso(2·base+1)`, po czym zatwierdza `o = base + round(target)`. Lądująca kartka
i nowa strona statyczna próbkują tę samą teksturę, więc nie ma przeskoku.

**Sterowanie:** przeciąganie (raycast na płaszczyznę, `tv = acos(x/PW)/π`, więc
czubek kartki idzie za palcem), klik w krawędź, kółko myszy, **strzałki
i Page Up/Down** (dodane wobec wzorca — bez klawiatury czytnik jest niedostępny).

## 7. Dostępność

Twardy wymóg projektu. Trzy rzeczy, bez których to nie wchodzi na produkcję:

1. **Płótno WebGL jest dla czytnika ekranu puste**, więc musi istnieć inna
   droga do treści. Ta droga to PDF — i tu jest dobra wiadomość, sprawdzona
   w pliku, a nie założona:

   | Cecha źródłowego PDF-a | Wynik |
   |---|---|
   | Warstwa tekstowa | **JEST** — 387 operatorów `Tj/TJ` w pierwszych 40 strumieniach. To nie jest skan. |
   | Otagowany (`/StructTreeRoot`, `/MarkInfo`) | **TAK** |
   | Zadeklarowany język | `pl` — **BŁĄD ŹRÓDŁA**, tom jest po angielsku (§7.4) |

   PDF jest więc pełnoprawnym, dostępnym dokumentem: czytnik ekranu odczyta go
   ze strukturą nagłówków. **Serwis Samorządu staje się jego hostem** —
   `public/wydawnictwo/<slug>.pdf`, odnośnik z czytnika. Licencja CC BY-SA 4.0
   wprost na to pozwala, a poza Google Scholarem tomu nie ma dziś nigdzie.

   To zamienia dawną blokadę w usługę: **rosnąca półka otwartego dostępu**
   prowadzona przez Samorząd, zasilana kolejnymi tomami od Wydawnictwa.
2. **Klawiatura i fokus.** Nakładka to `role="dialog" aria-modal="true"` z
   pułapką fokusu, Escape zamyka i przywraca fokus na grzbiet, z którego
   otwarto. Strzałki przewracają strony. Płótno dostaje `role="img"` z etykietą
   podającą tytuł i numery widocznych stron, aktualizowaną przez `aria-live`.
3. **Ograniczony ruch.** Przy `prefers-reduced-motion` — jedna nieruchoma
   otwarta rozkładówka, przewracanie natychmiastowe, bez animacji i bez
   samoczynnego kartkowania.

4. **Do zgłoszenia Wydawnictwu (defekt źródła, nie nasz).** PDF deklaruje
   `/Lang (pl)`, a tom jest po angielsku. Czytnik ekranu przeczyta angielski
   tekst polską wymową — to naruszenie WCAG 3.1.1 po ich stronie. Nie
   poprawiamy cudzego pliku samodzielnie; podajemy im to jako drobną poprawkę
   przy eksporcie, która pomoże każdemu czytelnikowi, nie tylko naszemu.

Atrybucja CC BY-SA (autorzy, redaktorki, wydawca, licencja) jest w czytniku
tekstem, nie tylko na skanie.

## 8. Tryby awarii

| Sytuacja | Zachowanie |
|---|---|
| Wydanie bez stron w manifeście | brak przycisku „Przejrzyj"; mur grzbietów jak dziś |
| Brak WebGL / utrata kontekstu | statyczna rozkładówka z dwóch obrazów, dalej czytelna, odnośnik do PDF działa |
| `prefers-reduced-motion` | j.w., bez animacji |
| Słabe urządzenie (< 900 px lub mało pamięci) | cienie wyłączone, mapa cieni mniejsza, geometria 24 × 9 |
| Pojedyncza strona nie wczytana | pusta kartka papierowa, reszta działa |

## 9. Testy

**Jednostkowe** (`vitest`) — logika indeksów jest tu najbardziej podatna na błędy:
- `spreadFor(o)` → poprawna para verso/recto na granicach (0, 1, ostatni arkusz)
- `framesFor(base)` → statyczne sąsiadki i para w ruchu
- zatwierdzanie `o` po obrocie w przód i w tył
- manifest: każda ścieżka istnieje, wymiary dodatnie

**Przeglądarkowe** (`playwright`):
- otwarcie z grzbietu, Escape zamyka, fokus wraca na grzbiet
- strzałki przewracają; licznik stron się zgadza
- `prefers-reduced-motion` → rozkładówka widoczna, zero animacji
- axe na otwartej nakładce → 0 naruszeń
- brak poziomego rozpychania na 375 px
- odnośnik do pełnego tekstu obecny i wskazuje realny adres

## 10. Poza zakresem

- Tryb `?card` ze wzorca (samoczynne kartkowanie w kafelku galerii) — to element
  galerii Kexsio, u nas nie ma czego obsługiwać
- Wyszukiwanie w treści tomu, zaznaczanie, cytowanie fragmentów
- Osobne podstrony per publikacja (`/wydawnictwo/<tytuł>`) — rozważone i odłożone;
  wartościowe dla indeksacji, ale to osobny szablon i osobny zakres

## 11. Czego potrzeba od zamawiającego

1. ~~Adres pełnego tekstu~~ — **ROZSTRZYGNIĘTE.** Taka strona nie istnieje;
   poza Google Scholarem tomu nie ma nigdzie. Hostem zostaje serwis Samorządu
   (§7.1). PDF wchodzi do `public/wydawnictwo/` obok stron.
2. ~~Weto na wagę~~ — **ROZSTRZYGNIĘTE: pełny tom, 130 stron.**
3. **Zgłoszenie do Wydawnictwa:** `/Lang (pl)` w angielskim tomie (§7.4).
4. Kolejne tomy serii w tym samym formacie — Wydawnictwo przysyła je odtąd na
   bieżąco, więc `scripts/build-edition.mjs` musi być powtarzalny i przyjmować
   sam PDF jako jedyne wejście.
