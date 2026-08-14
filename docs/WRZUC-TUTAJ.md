# Wrzuć tutaj

Twoja skrzynka na klucze, identyfikatory i fakty, na które czeka kod.
**Zasada: wpisujesz wartość obok `→` i dajesz znać.** Ja przenoszę ją w odpowiednie
miejsce w kodzie, weryfikuję i wypycham.

Nie edytuj plików w `src/` — jeśli wpiszesz coś tutaj, nic się nie zepsuje.

Legenda: 🔴 blokuje działającą funkcję · 🟡 poprawia jakość · ⚪️ na przyszłość

---

## 🔴 Formularze — Google Apps Script (zamiast Formspree)

Trzy formularze (Kontakt, Rzecznik, Partnerzy) wysyłają teraz przez skrypt na
**Waszym koncie Google**. Zgłoszenie zapisuje się w arkuszu i przychodzi mailem.
Dane nie wychodzą poza konto Google Uczelni — to główny powód zmiany, obok
limitu 50 zgłoszeń miesięcznie w darmowym Formspree.

Dopóki nie ma zmiennych, formularze mówią wprost, że nie są uruchomione, i
podają adres e-mail — **nie udają, że wysyłają**.

### Krok po kroku

1. Na koncie Samorządu utwórz **nowy arkusz Google** (np. „Formularze — strona").
2. W arkuszu: **Rozszerzenia → Apps Script**.
3. Skasuj zawartość `Code.gs` i wklej całą treść pliku
   **`docs/apps-script/Code.gs`** z tego repozytorium.
4. Na górze skryptu, w `CONFIG`:
   - w `SEKRET` wpisz długi losowy ciąg (np. z `openssl rand -hex 32`);
   - sprawdź adresy w `ADRESACI` — zgłoszenia do Rzecznika idą na osobną
     skrzynkę i tak ma zostać.
5. **Wdróż → Nowe wdrożenie → typ: Aplikacja internetowa**:
   - *Wykonaj jako*: **ja** (konto Samorządu);
   - *Kto ma dostęp*: **Wszyscy** — to konieczne, żeby strona mogła wysłać
     zgłoszenie; bezpieczeństwa pilnuje sekret, nie ukrycie adresu.
6. Skopiuj adres wdrożenia — kończy się na **`/exec`**.
7. Przy pierwszym uruchomieniu Google poprosi o zgodę na wysyłkę maili —
   zaakceptuj.

### Co wklejasz do Vercela

Vercel → projekt → **Settings → Environment Variables** (Production i Preview):

| Zmienna | Wartość | Wklej |
|---|---|---|
| `APPS_SCRIPT_URL` | adres wdrożenia kończący się na `/exec` | → |
| `APPS_SCRIPT_SECRET` | **dokładnie ten sam** ciąg co `CONFIG.SEKRET` | → |

> Uwaga: w projekcie Dni Adaptacyjnych te dwie wartości są w `.env.example`
> zamienione miejscami (w `APPS_SCRIPT_URL` stoi identyfikator, a w
> `APPS_SCRIPT_SECRET` adres). Przy przepisywaniu łatwo to powielić — u nas
> `URL` to adres, `SECRET` to losowy ciąg.

Po wpisaniu obu zmiennych formularze ruszają same, bez zmian w kodzie.

### Czego już NIE trzeba

Umowa powierzenia z Formspree jest nieaktualna — nie korzystamy z tej usługi.
Podstawą pozostaje umowa, którą Uczelnia ma z Google dla Workspace.

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
| Liczba studentów | ok. 9 000 — oparte na jawnych danych, **do potwierdzenia**, patrz niżej | → |
| Rok założenia Samorządu | 1987 (podane przez Ciebie) | ✅ |

### Liczba studentów — dlaczego to pilne

Na stronie głównej ta liczba stoi w hero i w sekcji „O nas", czyli w miejscu,
które administracja uczelni zobaczy jako pierwsze. Tymczasem **dowody publiczne
mówią co innego niż nasza deklaracja**:

| Źródło | Liczba | Rok |
|---|---|---|
| Wikipedia (infobox, bez przypisu) | 8 941 | grudzień 2023 |
| Wikipedia (sekcja „Pracownicy i studenci") | 12 271 | 2015/2016 |
| Wcześniej podane przez Samorząd (wycofane) | 10 000+ | — |
| **Obecnie na stronie** | **ok. 9 000** | — |

Trend jest wyraźnie **spadkowy** (niż demograficzny), więc „10 000+" było
zawyżone. Strona podaje teraz **ok. 9 000** — najbliżej jawnych danych i bez
znaku „+", bo liczba raczej maleje niż rośnie. Uczelnia zna swoją prawdziwą
liczbę studentów; rozbieżność w górę kosztuje wiarygodność.

**Co zrobić:** poproś Dział Nauczania albo Biuro Rektora o aktualną liczbę
studentów na rok 2026/2027 (najlepiej z datą). Wtedy wpiszemy fakt z podaniem
stanu na dzień — zgodnie z zasadą „każda liczba ma źródło i datę".

| Co | Odpowiedź |
|---|---|
| Aktualna liczba studentów + data, na kiedy | → |

---

## 🟡 Infopacki „żywe dokumenty" — sprawdzenie numerów paragrafów

Podstrony infopacków (regulamin studiów, podania, USOS, zaliczenie semestru)
odsyłają do **konkretnych paragrafów** Uczelnianego Regulaminu Studiów, np.
„§ 18 · str. 16", z linkiem otwierającym PDF na danej stronie.

**Co zweryfikowałem maszynowo:** źródło jest prawdziwe — uchwała Senatu
R.0000.21.2025 z 27 marca 2025, obowiązuje od roku 2025/2026, opublikowana w
BIP UEW. PDF się pobiera, ma 33 strony, a wszystkie numery stron użyte w
linkach mieszczą się w tym zakresie. Treść opisów jest ostrożna — nie wymyśla
liczb ani terminów, mówi „regulamin określa…", zamiast podawać konkret.

**Czego NIE dało się sprawdzić:** czy dany paragraf faktycznie dotyczy
opisanego tematu. PDF używa własnego kodowania czcionki i znak `§` nie daje się
z niego wyciągnąć programowo.

**Prośba:** otwórz PDF i sprawdź wyrywkowo 2–3 pozycje (np. czy § 18 to
rzeczywiście nieobecności, a § 39–40 warunek i powtarzanie semestru). Jeśli
któryś numer nie pasuje — napisz który, poprawię.

| Sprawdzone? | Twoja odpowiedź |
|---|---|
| Numery paragrafów zgodne z regulaminem | → |

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
