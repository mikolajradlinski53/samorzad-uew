# Konsolidacja podstron — pilot „Stypendia i wsparcie" — design

> Data: 2026-06-28. Pilot konsolidacji architektury informacji: scalamy klaster
> stypendialny w jeden hub i ustalamy dwa wielokrotne wzorce (`HubNav` długi-scroll
> + `VideoEmbed`). Po pilocie decydujemy o pozostałych hubach osobno.

## Cel

Zlikwidować rozdrobnienie: zamiast 6 cienkich stron stypendialnych + osobnej strony
kalkulatora — **jeden bogaty hub `/stypendia`** z przyklejonym spisem (scroll-spy),
wbudowanym kalkulatorem średniej i slotem na film instruktażowy. Stare URL-e robią
redirect 308 do `#sekcji`.

## Zasada przewodnia (ustalona z użytkownikiem)

Scalamy **tylko** strony, które są **strukturalnie cienkie** (na zawsze pozostaną
jednym narzędziem/listą) albo **ciasno** tematycznie powiązane — NIE strony cienkie
tylko dlatego, że czekają na treść. Klaster stypendialny spełnia oba kryteria.
Pozostała mapa konsolidacji (O Samorządzie, Życie na kampusie, Władze uczelni…) jest
**poza zakresem tego specu** — ocenimy każdy hub osobno po pilocie.

## Zakres

W zakresie:
- Wzorzec `HubNav` (przyklejony, etykietowany scroll-spy) — wielokrotny.
- `VideoEmbed` (click-to-load YouTube, bez ciasteczek do kliknięcia) — wielokrotny.
- Hub `/stypendia` „Stypendia i wsparcie": sekcje scalone z dzisiejszych podstron +
  wbudowany kalkulator + sekcja wideo (slot) + FAQ.
- Redirecty 308 starych URL-i → `/stypendia#…` (w tym `/kalkulator-sredniej`).
- Minimalna aktualizacja nawigacji/linków/wyszukiwarki.

Poza zakresem:
- Pozostałe huby z mapy (osobne specy/plany).
- Zmiany w samej logice kalkulatora (`KalkulatorSredniejContent` osadzamy bez zmian).
- Nowe treści stypendialne (przenosimy istniejące 1:1).

## Wzorzec 1 — `HubNav` (przyklejony spis, scroll-spy)

Nowy komponent kliencki `src/components/HubNav.tsx` (NIE ruszamy `SectionRail` — to
sygnatura `§` stron prawnych). Reużywa wzorca IntersectionObserver z `SectionRail`,
ale:
- **lewa, przyklejona (`sticky`) kolumna** w siatce treści (nie pływający rail),
  z **etykietami** sekcji (np. „Rektora", „Socjalne") zamiast `§N`.
- Aktywna sekcja podświetlana; klik → `scrollIntoView` (smooth; `auto` przy
  `prefers-reduced-motion`). Pełna obsługa klawiatury (lista `<button>`/linków).
- Mobile (< lg): spis zwija się w **poziomy pasek chipów przyklejony pod nagłówkiem**
  (przewijalny), z tą samą logiką aktywności.
- API: `items: { id: string; label: string }[]`, `label` (aria-label nawigacji).

Układ huba (`HubLayout` lekki wrapper albo bezpośrednio w stronie): siatka
`lg:grid-cols-[220px_1fr]` — lewa kolumna `HubNav` (sticky `top-24`), prawa stos
sekcji `<section id>` z editorial-rytmem.

## Wzorzec 2 — `VideoEmbed` (click-to-load)

`src/components/VideoEmbed.tsx` (kliencki). Props: `youtubeId: string`, `title: string`,
opcjonalnie `poster?: string`.
- Domyślnie renderuje **miniaturę** (poster lub `https://i.ytimg.com/vi/<id>/hqdefault.jpg`)
  + przycisk play (phosphor `Play`), w ramce 16:9 (tokeny, `rounded-xl`, border).
- Po kliknięciu (lub Enter/Spacja) podmienia na `<iframe>` z
  `https://www.youtube-nocookie.com/embed/<id>?autoplay=1` + `title`, `allow`,
  `allowfullscreen`. **Żadnego żądania do YouTube przed kliknięciem.**
- a11y: przycisk z `aria-label` = `title`, focus-visible, klawiatura. Reduced-motion:
  bez animacji wejścia. Brak autoplay-bez-interakcji.
- Slot treści: ID-ki filmów w `src/lib/videos.ts` (jak `people.ts`) — mapowanie
  `klucz → { youtubeId, titleKey }`. Gdy brak ID dla danego miejsca, sekcja wideo
  **chowa się** (nie renderuje pustki).

## Hub `/stypendia` — kompozycja

`src/app/[locale]/stypendia/page.tsx` (server) składa hub z sekcji. Każda sekcja to
istniejący moduł treści zasilany swoim namespace i18n (bez przepisywania treści):

| #id | Sekcja | Źródło treści (dzisiejsze) |
|-----|--------|----------------------------|
| `przeglad` | Wstęp / przegląd wsparcia | `StypendiaContent` (namespace `stypendia`) |
| `rektora` | Stypendium Rektora **+ kalkulator** | `StypendiumDetailContent` (`stypRektora`) + `KalkulatorSredniejContent` |
| `socjalne` | Stypendium socjalne | `StypendiumDetailContent` (`stypSocjalne`) |
| `niepelnosprawni` | Dla osób z niepełnosprawnością | `StypendiumDetailContent` (`stypNiepelnosprawni`) |
| `zapomoga` | Zapomoga | `StypendiumDetailContent` (`zapomoga`) |
| `wsparcie` | Wsparcie materialne i świadczenia | `WsparcieContent` (`wsparcie`) |
| `kalkulator` | (kotwica wewnątrz `rektora`) | `KalkulatorSredniejContent` |
| `wideo` | „Jak złożyć wniosek" | `VideoEmbed` z `videos.ts` (slot) |
| `faq` | Najczęstsze pytania | `Faq` (`stypendia.faq`) |

- `HubNav` items = sekcje powyżej (bez `kalkulator`, który jest kotwicą w `rektora`).
- Kalkulator osadzony przez `<section id="kalkulator">` wewnątrz sekcji `rektora`
  (kontekst: średnia → próg Rektora). Nagłówek sekcji wyjaśnia powiązanie.
- Sekcja `wideo` renderuje się tylko, gdy w `videos.ts` jest ID dla `stypendia-wniosek`.
- Dokładne klucze namespace (`stypNiepelnosprawni` itd.) potwierdzić przy implementacji
  z `messages/pl.json` (mogą mieć inne nazwy) — to mapowanie, nie nowa treść.

## Redirecty (308)

W `next.config.ts` (`redirects()`), locale-aware (z parametrem `:locale`):
- `/stypendia-rektora` → `/stypendia#rektora`
- `/stypendia-socjalne` → `/stypendia#socjalne`
- `/stypendia-dla-niepelnosprawnych` → `/stypendia#niepelnosprawni`
- `/zapomoga` → `/stypendia#zapomoga`
- `/wsparcie-materialne-i-swiadczenia` → `/stypendia#wsparcie`
- `/kalkulator-sredniej` → `/stypendia#kalkulator`

Stare katalogi stron (`src/app/[locale]/stypendia-rektora/` itd. oraz
`kalkulator-sredniej/`) **usuwamy** — treść żyje w hubie. Dokładny wzorzec `:locale`
zweryfikować względem `localePrefix` next-intl przy implementacji (obsłużyć wariant
prefiksowany i nieprefiksowany).

## Nawigacja, linki, wyszukiwarka (minimalnie)

- `Nav.tsx` (dropdown „Dla studenta"): pozycja „Stypendia" → label „Stypendia i wsparcie";
  usunąć osobny wpis „Wsparcie materialne" (scalony).
- `DlaStudentaContent.tsx`: kafelek „kalkulator" → `href="/stypendia#kalkulator"`
  (zamiast `/kalkulator-sredniej`).
- `searchIndex.ts`: usunąć wpisy scalonych podstron (rektora/socjalne/niepełnosprawni/
  zapomoga/wsparcie) jako osobne; zostaje jeden wpis `/stypendia` (+ słowa kluczowe z
  scalonych) oraz przekierowany `/kalkulator-sredniej` → wpis celuje w `/stypendia#kalkulator`.
- i18n: label „Stypendia i wsparcie" + etykiety sekcji huba (`hubNav.*`) w `kalkulator`/
  `stypendia` namespace (PL+EN, parytet).

## Dostępność i testy

- `HubNav`: klawiatura, `aria-current` na aktywnej, `prefers-reduced-motion` (brak smooth),
  poprawny landmark `nav` z aria-label. Kotwice fokusowalne.
- `VideoEmbed`: brak żądań sieciowych do YouTube przed kliknięciem (weryfikacja ręczna w
  Network), klawiatura, `title` na iframe.
- Redirecty: 308 stary→`/stypendia#…` (build + ręczny check), brak 404.
- Kalkulator działa identycznie po osadzeniu (fetch `/data/programs.json`, średnia).
- Build/lint/tsc czysto; pilot 375px mobile.
- Testów jednostkowych brak nowych dla UI (zgodnie z konwencją repo) — `VideoEmbed`
  „nie-ładuje-przed-klikiem" weryfikowane ręcznie; logika huba prosta.

## Otwarte (nieblokujące)

- Realny `youtubeId` filmu „jak złożyć wniosek" — wrzucisz do `videos.ts` później;
  do tego czasu sekcja wideo ukryta.
- Czy kalkulator pokazywać też nad sekcją `rektora` jako CTA — do dopieszczenia w UI.
- Dokładne progi stypendium Rektora w `ScholarshipHint` — istniejący slot, poza pilotem.
