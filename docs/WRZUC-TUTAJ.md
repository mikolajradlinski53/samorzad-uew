# Wrzuć tutaj

Twoja skrzynka na klucze, identyfikatory i fakty, na które czeka kod.
**Zasada: wpisujesz wartość obok `→` i dajesz znać.** Ja przenoszę ją w odpowiednie
miejsce w kodzie, weryfikuję i wypycham.

Nie edytuj plików w `src/` — jeśli wpiszesz coś tutaj, nic się nie zepsuje.

Legenda: 🔴 blokuje działającą funkcję · 🟡 poprawia jakość · ⚪️ na przyszłość

---

## 🔴 Formspree — identyfikatory formularzy

Trzy formularze są zbudowane i czekają wyłącznie na ID. Dopóki go nie ma, pokazują
komunikat „formularz nie jest jeszcze skonfigurowany" i podają e-mail jako drogę
zastępczą — **nie udają, że wysyłają**.

**Skąd wziąć:** wejdź na [formspree.io](https://formspree.io), załóż darmowe konto,
kliknij **New Form** (trzy razy — po jednym na każdy formularz). Po utworzeniu
Formspree pokaże adres w postaci `https://formspree.io/f/abcdefgh`.
**Potrzebuję tylko ostatniego członu** — tego `abcdefgh`.

| Formularz | Gdzie na stronie | Wklej ID |
|---|---|---|
| Kontakt | `/kontakt` | → |
| Rzecznik Praw Studenta | `/rzecznik-praw-studenta` | → |
| Współpraca z partnerami | `/partnerzy` | → |

**Do zrobienia przy okazji (ważne prawnie):** w panelu Formspree zaakceptuj
**umowę powierzenia przetwarzania danych (DPA)**. Polityka prywatności już
deklaruje, że taka umowa obowiązuje — bez jej zawarcia ten zapis byłby nieprawdziwy.
Formspree udostępnia ją w ustawieniach konta.

**Uwaga na limit:** darmowy plan to 50 zgłoszeń miesięcznie **łącznie** ze wszystkich
formularzy. W sesji stypendialnej może to być za mało — warto obserwować licznik.

---

## 🔴 Asystent AI "Zapytaj Samorząd" — klucz Anthropic

Serwerowa część asystenta (`/api/asystent`) jest gotowa i odpowiada wyłącznie na
podstawie treści strony (z cytowaniami źródeł). Dopóki brakuje klucza, trasa
zwraca uczciwy komunikat „niedostępne" zamiast udawać, że działa.

**Skąd wziąć:** wejdź na [console.anthropic.com](https://console.anthropic.com),
załóż konto (albo użyj istniejącego), w sekcji **API Keys** kliknij **Create Key**.
Klucz zaczyna się od `sk-ant-...`.

**Gdzie wkleić — NIE do repozytorium.** Vercel → ustawienia projektu →
**Settings → Environment Variables** → dodaj `ANTHROPIC_API_KEY` z wklejonym
kluczem (środowisko: Production, ewentualnie też Preview). Do lokalnego
developmentu wklej ten sam klucz do `.env.local` (plik ten jest w `.gitignore`
— nigdy nie trafi do repo).

| Zmienna | Wklej wartość |
|---|---|
| `ANTHROPIC_API_KEY` | → |

**Koszt:** korpus strony jest cache'owany po stronie Anthropic (prompt caching),
więc typowe pytanie kosztuje ok. **8 groszy**. Przy tysiącu pytań miesięcznie to
ok. **80 zł/mc** — warto obserwować zużycie w konsoli Anthropic (Usage).

---

## 🟡 Fakty do potwierdzenia

Rzeczy, które są już na stronie, ale opierają się na niepewnym źródle.

| Co | Stan obecny | Twoja odpowiedź |
|---|---|---|
| Liczba projektów rocznie (chip w hero) | „9 projektów rocznie" — nigdy nie potwierdzone | → |
| Liczba studentów | 10 000+ — **wymaga pilnego rozstrzygnięcia**, patrz niżej | → |
| Rok założenia Samorządu | 1987 (podane przez Ciebie) | ✅ |

### Liczba studentów — dlaczego to pilne

Na stronie głównej ta liczba stoi w hero i w sekcji „O nas", czyli w miejscu,
które administracja uczelni zobaczy jako pierwsze. Tymczasem **dowody publiczne
mówią co innego niż nasza deklaracja**:

| Źródło | Liczba | Rok |
|---|---|---|
| Wikipedia (infobox, bez przypisu) | 8 941 | grudzień 2023 |
| Wikipedia (sekcja „Pracownicy i studenci") | 12 271 | 2015/2016 |
| Podane przez Samorząd | 10 000+ | — |

Trend jest wyraźnie **spadkowy** (niż demograficzny), więc „10 000+" jest dziś
najprawdopodobniej zawyżone, a każda liczba wyższa — tym bardziej. Uczelnia zna
swoją prawdziwą liczbę studentów; rozbieżność w tę stronę kosztuje wiarygodność.

**Co zrobić:** poproś Dział Nauczania albo Biuro Rektora o aktualną liczbę
studentów na rok 2026/2027 (najlepiej z datą). Wtedy wpiszemy fakt z podaniem
stanu na dzień — zgodnie z zasadą „każda liczba ma źródło i datę".

| Co | Odpowiedź |
|---|---|
| Aktualna liczba studentów + data, na kiedy | → |

---

## ⚪️ Treści i pliki

Osobna, szczegółowa lista jest w [MATERIALY.md](MATERIALY.md) — zdjęcia, dokumenty
PDF, składy osobowe, logotypy partnerów. Poniżej tylko te pozycje, które
odblokowują konkretną funkcję.

| Co | Co odblokuje | Gdzie wrzucić |
|---|---|---|
| Portrety Zarządu (4:5) | Zdjęcia zamiast inicjałów na `/zarzad` | `public/photos/zarzad/01.jpg …` |
| Portrety RUSS (4:5) | To samo na stronie RUSS | `public/photos/russ/01.jpg …` |
| Zdjęcia z wydarzeń | Prawdziwe kadry zamiast stockowych w „Życie studenckie" i „Projekty" | `public/photos/zycie/`, `public/photos/projekty/` |
| Regulaminy i statut (PDF) | Zdejmuje plakietki „Wkrótce"; **warunek konieczny dla asystenta AI** cytującego paragrafy | `public/dokumenty/` |
| ID filmu z YouTube | Sekcja wideo w hubie Stypendiów (dziś ukryta) | `src/lib/videos.ts` — albo wpisz tutaj → |

---

## 🟡 Wydawnictwo UEW — Debiuty Studenckie

Strona `/wydawnictwo` działa, ale **ściana grzbietów pokazuje trzy publikacje-atrapy**
(oznaczone w kodzie jako `PLACEHOLDER — DO WERYFIKACJI`). Wyglądają wiarygodnie,
więc trzeba je podmienić, zanim ktoś weźmie je za prawdziwe.

**Publikacje** — dla każdej: tytuł, autorzy, rok, koło naukowe, ISBN, link do
pełnego tekstu, krótki abstrakt. Wpisz poniżej albo prześlij listę, ja przeniosę
do `src/lib/publications.ts`.

→

**Szczegóły proceduralne z Wydawnictwa** — świadomie ich nie wymyśliłem, bo
uczelniane serwery blokowały pobieranie, a zmyślony termin albo procedura byłyby
gorsze niż ich brak. Potrzebuję:

| Co | Odpowiedź |
|---|---|
| Termin/terminy zgłaszania tekstów | → |
| Jak dokładnie wygląda zgłoszenie (formularz? mail? przez opiekuna koła?) | → |
| Osoba lub adres kontaktowy w Wydawnictwie | → |
| Wymogi formalne (objętość, format, przypisy) | → |
| Czy publikacja jest bezpłatna dla studenta | → |

Potwierdzone i już użyte na stronie: seria wydawana przez Wydawnictwo UEW
(działa od 1955, ponad 100 tytułów rocznie), autorami są studenci **I i II roku**,
adresat to **koła naukowe**, licencja **CC BY-SA 4.0**.

---

## Jak to działa po Twojej stronie

1. Wpisujesz wartość obok `→` w tabelce (albo wrzucasz plik we wskazane miejsce).
2. Piszesz mi jednym zdaniem, co doszło.
3. Ja przenoszę to do kodu, sprawdzam build i testy, wypycham na produkcję.

Jeśli czegoś nie wiesz albo nie masz — napisz „nie mam". To też jest odpowiedź:
wtedy albo zostawiam stan uczciwy (jak inicjały zamiast zdjęć), albo proponuję
rozwiązanie zastępcze.
