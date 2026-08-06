# Audyt mobilny (375×812) — sierpień 2026

> **AKTUALIZACJA (2026-08-06) — po pierwszej turze napraw.**
> Poziome przewijanie: **0 tras** (było 2 — `/zarzad` i `/stypendia`).
> Cele dotykowe < 24 px: **178** (było 688 — spadek o 74%).
> Naprawione: niełamliwe adresy e-mail rozpychające kartę osoby (`break-all`),
> brak `min-w-0` na elementach siatki (karta rosła ponad swój tor), ujemny
> margines paska chipów `HubNav` na pełnej szerokości, oraz zbyt niskie pole
> dotyku linków w stopce (`py-1` → 24 px). Liczby poniżej pochodzą z
> pierwszego przebiegu i pokazują stan wyjściowy.


**Data:** 5 sierpnia 2026
**Zakres:** cały serwis (30 tras wewnętrznych), wariant PL, viewport 375×812 (iPhone SE/mini — najwęższy powszechny punkt odniesienia)
**Charakter:** audyt diagnostyczny — **tylko pomiary, bez poprawek**. Samorząd traktuje mobile jako główną grupę odbiorców, więc ten raport jest punktem wyjścia do osobnego fix-passu.

---

## 1. Podsumowanie

Zmierzono **30/30 tras** (0 błędów wykonania) z `tests/mobile.spec.ts` na
zbudowanej produkcyjnie aplikacji (`next build` + `next start`), przy użyciu
Playwrighta w widoku 375×812, z `prefers-reduced-motion: reduce` i po
`networkidle` (ten sam fix determinizmu co w `tests/a11y.spec.ts`). Surowe
dane: `docs/mobile/findings.json`. Zrzuty ekranu (niedołączone do repo):
`docs/mobile/shots/<slug>.png`.

Wynik w skrócie:

| Kategoria | Wynik |
|---|---|
| Poziomy scroll (overflow) | **2/30 tras** (`/stypendia` +24px, `/zarzad` +71px) |
| **Odkryty ręcznie: przycisk hamburgera poza ekranem** | **30/30 tras** — najpoważniejsze znalezisko audytu |
| Cele dotykowe < 24×24px | **30/30 tras**, **697 instancji** łącznie |
| Tekst < 12px | **30/30 tras**, **133+ instancji** (licznik ucięty na 30/trasę) |
| Elementy szersze niż viewport (poza ww.) | ślady tych samych dwóch przyczyn co overflow |

Najpoważniejszy wniosek audytu **nie pochodzi wprost z automatycznego
skanu overflow** (bo winowajca jest w `position: fixed`, więc nie powiększa
`document.documentElement.scrollWidth`) — wypłynął z pomiaru kategorii 4
(„elementy szersze niż viewport”) i ręcznej weryfikacji: **przycisk
otwierający menu mobilne w nagłówku renderuje się całkowicie poza ekranem
(lewa krawędź w x≈384px przy viewport 375px) na wszystkich 30 trasach.**
Zobacz punkt B1 niżej — to prawdopodobnie łamie nawigację mobilną na
większości realnych telefonów, nie tylko w testowym 375px.

---

## 2. Metodyka

**Automatyczna (Playwright, `tests/mobile.spec.ts`).** Lista tras pochodzi z
`searchIndex` (to samo źródło co sitemapa i `tests/a11y.spec.ts`), z
pominięciem wpisów `#fragment`. Dla każdej trasy — osobny test (crash na
jednej stronie nie przerywa reszty; każdy pomiar w `try/catch`) — mierzone
w widoku 375×812, locale `pl`:

1. **Poziomy overflow** — `document.documentElement.scrollWidth > innerWidth + 1`; przy overflow dodatkowo lista elementów, których `getBoundingClientRect().right` wykracza poza viewport (do 15, posortowane malejąco wg przekroczenia).
2. **Cele dotykowe** — każdy widoczny `a`, `button`, `[role=button]`, `select`, `input`; próg 24×24px (WCAG 2.5.8 minimum; 44×44 to komfortowy cel wg 2.5.5).
3. **Czytelność tekstu** — węzły tekstowe o obliczonym `font-size` < 12px.
4. **Szerokość treści** — elementy szersze niż viewport, z pominięciem świadomie przewijalnych kontenerów (`overflow-x: auto/scroll`).

Determinizm: `page.emulateMedia({ reducedMotion: "reduce" })` przed
`page.goto()` + `page.waitForLoadState("networkidle")` — dokładnie ten sam
fix co w `tests/a11y.spec.ts`, bo komponenty tego kodu bramkują animacje
wejścia (`ScrollReveal`, `motion.li` z `whileInView`) przez
`useReducedMotion`.

**Uwaga metodologiczna (1 przypadek).** Na `/infopacki` jeden cel dotykowy
(karta „05” — infopack „Jak, gdzie i kiedy składać uczelniane podania?”)
zmierzono z wysokością 1.44px zamiast pełnej karty. Karta ta (`InfopackiContent.tsx`,
`motion.li` z `whileInView`/`rotateX: -90`, próg `amount: 0.3`) leży poniżej
pierwszego ekranu (y≈1567px) i — mimo wymuszonego `reduced-motion` — w
momencie pomiaru wyglądała jak w stanie „przed animacją”. Pojedynczy
przypadek na 697 trafień, nie ekstrapolowany na inne trasy — potraktowany
jako osobna, drobna pozycja (patrz D2), a nie połączony ze strukturalnymi
problemami celów dotykowych.

**Ręczna weryfikacja.** Po automatycznym przebiegu, dla znalezisk o
niejasnej przyczynie (overflow na `/stypendia` i `/zarzad`, elementy
szersze niż viewport na 27/30 tras) prześledzono kod źródłowy
(`src/components/*.tsx`) i zweryfikowano dodatkowym skryptem Playwright na
żywym `next start`, żeby potwierdzić przyczynę zamiast zgadywać z samej
klasy CSS.

---

## 3. Znaleziska

### 🔴 Blokujące

#### B1. Przycisk menu mobilnego renderuje się poza ekranem — **30/30 tras**

**Pomiar:** `header button[aria-controls="mobile-menu"]` — lewa krawędź
`x≈384.4px`, prawa `x≈428.4px`, przy `window.innerWidth = 375px`.
Przycisk jest **w całości poza widocznym obszarem** — niedostępny dla
dotyku na żadnej z 30 stron (zweryfikowano bezpośrednio na `/`, `/kontakt`,
`/zarzad`; komponent `Nav.tsx` renderuje się z layoutu `[locale]/layout.tsx`,
więc dotyczy każdej trasy).

**Przyczyna:** `src/components/Nav.tsx`, wiersz nagłówka (`<nav className="mx-auto
flex h-[72px] max-w-[1200px] items-center justify-between px-6">`, linie
168–276). Na mobile widoczne są: logo (`w-40` = 160px, `shrink-0`, linia 175)
+ klaster prawy (`<div className="flex items-center gap-3">`, linia 218) z
czterema kontrolkami: przycisk szukania mobile (44px, linia 228–234),
przełącznik motywu (44px, linia 236–250), `LanguageSwitcher` (~76px, linia
252), hamburger (44px, linia 261–274) — razem **~244px + 3×gap-3(12px) =
~280px**. Suma z logo: **160 + 280 = 440px**, a dostępna szerokość
`<nav>` po `px-6` przy 375px viewport to tylko **327px** — brakuje **~113px**.
Ponieważ flex-row nie zawija (`flex-wrap` nie ustawiony), a `<nav>` nie ma
`overflow-hidden`, przeglądarka po prostu wypycha ostatni element (hamburger)
poza prawą krawędź — bez scrollbara, bo `<header>` jest `position: fixed`
(fixed-y elementy nie powiększają `document.documentElement.scrollWidth`,
dlatego automatyczny skan overflow tego nie złapał; złapała go dopiero
kategoria „szerokość treści” + ręczna weryfikacja).

**Próg pęknięcia:** przy `px-6` (24px z każdej strony) i obecnym zestawie
kontrolek próg to viewport ≥ **452px CSS px**. To **szersze niż niemal
każdy telefon w orientacji pionowej** (iPhone SE/mini 375, iPhone 14/15 390,
Pixel 6/7 412, Samsung Galaxy S21 360, iPhone 14 Pro Max 430) — więc bug
najpewniej dotyczy realnych telefonów, nie tylko testowego 375px.

**Sugerowana poprawka (do decyzji, nie wykonana w tym audycie):**
- Najprościej: przenieść przełącznik motywu i/lub `LanguageSwitcher` z
  paska nagłówka do wnętrza szuflady `#mobile-menu` na `< md`, zostawiając
  w pasku tylko szukanie + hamburger (100px zamiast 280px — mieści się z
  dużym zapasem nawet z logo 160px).
- Alternatywnie: zmniejszyć logo na mobile (`w-40` → `w-28` z `sm:w-40`) i/lub
  zredukować `gap-3` → `gap-1`/`gap-2` między kontrolkami — daje mniej
  marginesu, ale nie usuwa problemu strukturalnie przy 4 kontrolkach.
  Kombinacja obu podejść jest najbezpieczniejsza.

---

#### B2. Poziomy scroll na `/stypendia` — pasek chipów w `HubNav`

**Pomiar:** `document.documentElement.scrollWidth = 399px` vs
`innerWidth = 375px` → **+24px** overflow całej strony.

**Przyczyna:** `src/components/HubNav.tsx`, wariant mobilny (linie 70–92):
`<nav className="sticky top-[72px] z-30 -mx-6 mb-4 overflow-x-auto ... px-6 ... xl:hidden">`.
Klasa `-mx-6 px-6` to typowy trik „bleed do krawędzi ekranu” — zakłada, że
rodzic ma własny `px-6`, który `-mx-6` znosi, po czym `px-6` na tym samym
elemencie odtwarza wizualny margines. Tu jednak `<HubNav />` jest
renderowany jako bezpośredni element potomny strony
(`src/app/[locale]/stypendia/page.tsx`, linia 66) **bez** takiego
opakowania — więc `-mx-6` odejmuje 24px od krawędzi, której nic wcześniej
nie „dodało”, i pasek (a wraz z nim `document.documentElement`) wystaje
24px poza prawą krawędź viewportu.

**Sugerowana poprawka:** albo owinąć `<HubNav />` w kontener z pasującym
`px-6` (spójne z resztą strony), albo usunąć `-mx-6 px-6` z `HubNav.tsx` i
pozwolić paskowi żyć w normalnym marginesie strony (traci się efekt
„do krawędzi”, ale znika overflow) — do wyboru zależnie od zamierzonego
efektu wizualnego.

---

#### B3. Poziomy scroll na `/zarzad` — „grid blowout” w `PersonCard`

**Pomiar:** `scrollWidth = 446px` vs `innerWidth = 375px` → **+71px**.
Wszystkie karty Prezydium/Zarządu (`<article>` w `PersonCard.tsx`, wariant
pełny — nie `plain`) mają **identyczną** szerokość 422.22px niezależnie od
długości imienia/maila danej osoby — silny sygnał, że przyczyna nie leży w
treści (np. długi e-mail), tylko w strukturze.

**Przyczyna:** `src/components/pages/ZarzadContent.tsx`, linie 66 i 101:
`<div className="mt-8 grid gap-5 sm:grid-cols-2">` — na mobile (`< sm`)
brak jawnych kolumn, więc grid działa jak pojedyncza kolumna, ale bez
`grid-template-columns` jawnie ustawionego na `minmax(0, 1fr)` domyślna
`min-width` ścieżki gridu to `auto`, czyli **maksymalna treść dziecka**,
a nie dostępna szerokość. Winowajcą treści jest prawdopodobnie
`src/components/PersonCard.tsx`, linia 152–154 — „pasek-kod” na dole karty:
`||||·||·|||·|··||·· UEW·WROC·§` — jeden ciągły string bez spacji (więc
nie może się zawinąć), identyczny na każdej karcie, co tłumaczy identyczną
szerokość 422px na każdej instancji. `overflow-hidden` na `<article>`
(linia 88) nie pomaga — chroni przed przycięciem treści *wewnątrz* karty,
nie przed tym, że sam **box karty** został przez grid rozciągnięty szerzej
niż dostępne miejsce.

**Sugerowana poprawka:** dodać `min-w-0` do wrappera karty w
`ZarzadContent.tsx` (`<div className="h-full">` → `min-w-0 h-full`, linie
76 i ~111) i/lub do `<article>` w `PersonCard.tsx` — to pozwoli ścieżce
gridu skurczyć się poniżej intrinsic-width treści. Dodatkowo warto rozważyć
`break-all`/mniejszy `tracking` na pasku-kodzie (`PersonCard.tsx`, linia
152), żeby sam ten element miał mniejszą minimalną szerokość niezależnie od
poprawki na gridzie.

---

### 🟠 Ważne

#### W1. Setki linków tekstowych bez paddingu = cele dotykowe 15–22.5px wysokości — dotyczy praktycznie każdej strony

**Pomiar:** 697 instancji `< 24×24px` łącznie na 30 trasach (22–33 na
trasę). Trzy współdzielone komponenty odpowiadają za zdecydowaną
większość:

| Źródło | Plik | Wysokość zmierzona | Tras dotkniętych |
|---|---|---|---|
| Linki w kolumnach stopki (`FooterLink`) | `src/components/Footer.tsx:61–73` | 16px | 30/30 |
| Linki w dolnym pasku stopki (RODO/dostępność) | `src/components/Footer.tsx:166–179` | 19.5px | 30/30 |
| Okruszki (breadcrumbs) | `src/components/Breadcrumbs.tsx:38–43` | 19.5px | ~29/30 (wszystkie poza `/`) |
| Linki `mailto:` w `PersonCard` | `src/components/PersonCard.tsx:122–130` | 19.5px | `/zarzad` (8 instancji) |

Żaden z tych linków nie ma minimalnej wysokości/paddingu pionowego —
zbudowane jako czysty inline-text (`text-[…]` + `transition-colors`, bez
`py-*`/`min-h-*`). Wizualnie wyglądają dobrze na desktopie (kursor myszy
jest precyzyjny), ale na dotyku 15–19.5px to poniżej nawet minimum WCAG
2.5.8 (24px), nie mówiąc o komfortowych 44px.

**Sugerowana poprawka:** dodać `inline-flex items-center` + `py-1.5`
(lub `min-h-6`) do klasy w `FooterLink` (`Footer.tsx:63`), do linków w
dolnym pasku (`Footer.tsx:169,175`), do `<Link>`/`<span>` w
`Breadcrumbs.tsx:38–43` oraz do `<a>` w `PersonCard.tsx:123–129`. To
podniesie wysokość klikalnego obszaru bez zmiany typografii — sam tekst
zostaje 15px/13px, rośnie tylko „touch box” wokół niego.

#### W2. Przełącznik języka PL/EN — tekst 11px na każdej stronie

**Pomiar:** `text-[0.6875rem]` = 11px, poniżej progu 12px. **30/30 tras**
(60 instancji — po jednej na przycisk „pl”/„en”). Cel dotykowy sam w sobie
jest OK (`min-h-11` = 44px), problem dotyczy wyłącznie czytelności tekstu.

**Plik:** `src/components/LanguageSwitcher.tsx:18`.

**Sugerowana poprawka:** `text-[0.6875rem]` → `text-[0.75rem]` (12px) —
mieści się bez trudu w istniejącym `min-h-11 px-3`.

#### W3. Drobne etykiety/plakietki w 10–11px — rozproszone po całym serwisie

**Pomiar:** 12 odrębnych wzorców, ~70 pozostałych instancji poza W2 —
m.in. plakietki „Wkrótce”/technologie (`text-[0.6875rem]`, rounded-full
pill), eyebrow-label „Ustawa” (`PrawoContent.tsx`, `text-[0.6875rem]
uppercase`), numer legitymacji „Nº” i pasek-kod w `PersonCard.tsx`
(`text-[11px]`/`text-[10px]` font-mono), etykiety społecznościowe w
`NaszeProjektyContent.tsx` (`text-[0.6875rem]`).

**Sugerowana poprawka:** nie każdy z tych przypadków wymaga zmiany —
część to celowo dekoracyjne, bardzo krótkie etykiety (np. „Nº”, rok
„2025/2026”) gdzie 10–11px może być świadomym wyborem stylistycznym
karty-legitymacji. Warto jednak przejrzeć punkt po punkcie i podnieść do
12px wszystko, co niesie realną informację do przeczytania (np. „Wkrótce”,
eyebrow-labels typu „Ustawa”), zostawiając mono-dekorację (pasek-kod,
„Nº”) jak jest, skoro pełni funkcję ozdobną, a nie informacyjną.

---

### 🟡 Drobne

#### D1. Elementy szersze niż viewport przy overflow całej strony (`/zarzad`, `/stypendia`)

Konsekwencja B2/B3 — te same elementy (karty PersonCard, chipy HubNav) trafiają też do kategorii „szerokość treści”. Naprawa B2/B3 usuwa też te wpisy — brak osobnej akcji.

#### D2. Karta „05” na `/infopacki` zmierzona jako 1.44px wysoka (prawdopodobny artefakt pomiaru)

Zobacz uwagę metodologiczną w §2. Pojedynczy przypadek, poniżej pierwszego
ekranu, karta z animacją `whileInView`/`rotateX`
(`src/components/pages/InfopackiContent.tsx:44–86`). Warto sprawdzić
ręcznie (przewijając realny telefon) czy karty poniżej pierwszego ekranu
faktycznie „doskakują” do pełnego rozmiaru przy prawdziwym
`prefers-reduced-motion`, czy to tylko artefakt jednorazowego zrzutu stanu
bez przewijania w tym teście — nie stwierdzam tego jako potwierdzony bug,
tylko jako coś do ręcznej weryfikacji przy następnym audycie/fix-passie.

---

## 4. Co naprawiamy najpierw

1. **B1 — hamburger poza ekranem** (`Nav.tsx`). Zero-dyskusyjny priorytet:
   bez tego menu mobilne jest niedostępne dotykiem na praktycznie każdym
   telefonie, na każdej z 30 tras. Odciążyć pasek nagłówka na mobile
   (przenieść LanguageSwitcher/theme-toggle do szuflady menu).
2. **B3 — grid blowout na `/zarzad`** (`PersonCard.tsx` + `ZarzadContent.tsx`).
   `min-w-0` na wrapperze karty — jednolinijkowa poprawka, usuwa 71px
   overflow na stronie prezentującej zarząd (wysoka ranga w nawigacji).
3. **B2 — overflow na `/stypendia`** (`HubNav.tsx`). Najbardziej ruchliwa
   strona hubowa w serwisie (stypendia); poprawić `-mx-6`/kontener.
4. **W1 — cele dotykowe stopki/okruszków/mailto** (`Footer.tsx`,
   `Breadcrumbs.tsx`, `PersonCard.tsx`). Dotyczy wszystkich 30 tras;
   jedna wspólna poprawka wzorca (`py-1.5`/`min-h-6` na inline-linkach)
   naprawia większość z 697 instancji za jednym zamachem.
5. **W2 — LanguageSwitcher 11px → 12px**. Trywialna zmiana jednej klasy,
   widoczna na każdej stronie.
6. **W3 — przegląd plakietek 10–11px** i D2 — niższy priorytet, do
   ręcznego przeglądu przy okazji kolejnego passu.
