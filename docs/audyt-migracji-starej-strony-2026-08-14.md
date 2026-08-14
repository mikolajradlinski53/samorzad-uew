# Audyt migracji samorzad.ue.wroc.pl → nowa strona

Stan na: 14 sierpnia 2026

## Decyzja projektowa

Starej strony nie kopiujemy ekran po ekranie. Traktujemy ją jako archiwum treści,
zdjęć, dokumentów i funkcji. Nowa strona zachowuje swoją identyfikację oraz
architekturę usługową, ale odzyskuje wszystko, co na Wixie jest prawdziwe,
użyteczne albo stanowi dowód działalności Samorządu.

Zasada dla migracji:

1. treść źródłową przenosimy i redagujemy;
2. nazwiska, terminy, adresy i dokumenty weryfikujemy przed publikacją;
3. fotografie migrujemy jako pełnoprawną warstwę narracji, nie dekoracyjne miniatury;
4. PDF zostaje źródłem formalnym, lecz jego najważniejsza treść staje się żywym
   komponentem strony;
5. każda informacja zmienna otrzymuje datę aktualizacji i właściciela.

## Co już jest mocniejsze na nowej stronie

- „Dla studenta” prowadzi przez realne sytuacje, a nie tylko przez listę urzędowych
  kategorii.
- Osiem infopacków działa jako żywe przewodniki PL/EN.
- Dyplomowanie ma formę kokpitu procesu, a nie martwego pliku.
- Pomoc psychologiczna jest tematycznym środowiskiem, nadal należącym wizualnie do
  SSUEW.
- Kalendarz jest własną funkcją; nie przenosimy ze starej strony uszkodzonego
  placeholdera konektora Google Calendar.
- „Nasze projekty” otrzymały redakcyjny układ dziewięciu rozdziałów i kontrakt na
  27 fotografii. Brak zdjęcia nie jest maskowany stockiem.
- Wyszukiwarka, transparentność, wersja EN, dostępność i źródła są częścią systemu,
  a nie dopiskami.

## Braki funkcjonalne do odzyskania

| Priorytet | Obszar ze starej strony | Stan lokalny | Co robimy |
|---|---|---|---|
| P0 | Regulacje wewnętrzne | sześć slotów istnieje, ale wszystkie linki są puste | odzyskać PDF-y, nadać im daty/wersje i podłączyć do żywych omówień |
| P0 | RUSS: uchwały, sprawozdania i terminy posiedzeń | jest skład i opis kompetencji; brak dokumentów i kalendarza | podłączyć oficjalny folder, dodać najbliższe posiedzenie i archiwum uchwał |
| P0 | Filia Jelenia Góra | członek Zarządu jest w danych, brak osobnej podstrony | zbudować pełnoprawną stronę Filii, bez starego technicznego sluga „kopia-zarząd-1” |
| P0 | Partnerzy | mechanika strony i formularz istnieją, lista partnerów jest pusta | pozyskać aktualne logotypy, linki, kategorie i status partnerstwa |
| P0 | Stypendia | żywy poradnik istnieje, brakuje kompletu aktualnych załączników i komunikatów | zbudować indeks załączników z datą ważności i źródłem UEW |
| P1 | Komisja Rewizyjna | brak osobnej trasy i składu | dodać kompetencje, skład, kontakt i publikowane wyniki kontroli |
| P1 | Ankiety dydaktyczne | instrukcja jest częściowo w przewodniku USOS | dodać bezpośredni punkt wejścia z terminarzem i krótkim wyjaśnieniem wpływu |
| P1 | Rzecznik praw studenta | strona istnieje | uzupełnić portret, godziny/kanał kontaktu i jasny zakres spraw |
| P1 | Strefa działacza | trasa istnieje | odzyskać materiały operacyjne, wzory i ścieżkę zgłaszania projektu |
| P2 | Władze i struktura | trasy istnieją | dodać portrety, kadencję i źródło aktualności danych |
| P2 | Mapa kampusu | trasa istnieje | zweryfikować plik i rozwinąć ją w mapę z zadaniami: dziekanat, AED, cisza, dostępność |

Źródła audytu:

- [Nasze projekty](https://samorzad.ue.wroc.pl/nasze-projekty)
- [Struktura Samorządu](https://samorzad.ue.wroc.pl/struktura-samorzadu)
- [RUSS](https://samorzad.ue.wroc.pl/rada-uczelniana-samorzadu-studentow)
- [Regulacje wewnętrzne](https://samorzad.ue.wroc.pl/regulacje-wewnetrzne)
- [Partnerzy](https://samorzad.ue.wroc.pl/partnerzy)
- [Stypendia](https://samorzad.ue.wroc.pl/stypendia)
- [Filia Jelenia Góra — stary adres](https://samorzad.ue.wroc.pl/kopia-zarz%C4%85d-1)

## Najważniejszy konflikt danych

Stara strona podaje biuro przy ul. Kamiennej 43, budynek J, pokój 9. Nowa stopka
ma ul. Kamienną 44, budynek L, pokój 110. Nie wolno tego automatycznie kopiować.
Po potwierdzeniu prawidłowego adresu tworzymy jedno centralne źródło danych, z
którego korzystają stopka, kontakt, dane strukturalne i asystent.

## Fotografie: ile miejsca naprawdę potrzeba

Minimalny bank materiałów, który pozwoli stronie wyglądać jak dokument działalności,
a nie jak szablon:

| Obszar | Minimum | Charakter zdjęć |
|---|---:|---|
| Projekty | 27 | 3 kadry × 9 projektów: miejsce, emocja, rezultat |
| Zarząd i przewodniczący | 11 | spójne portrety + 2 zdjęcia robocze |
| RUSS | 16 | 15 portretów + jedno zdjęcie posiedzenia |
| Filia Jelenia Góra | 6 | kampus, zespół, projekt, kontakt |
| Partnerzy | 10–15 logotypów | oryginalne SVG/PNG, bez przerabiania znaków |
| Pomoc psychologiczna | 4 | bez pozowanych „smutnych stocków”; przestrzeń, spokój, dyskrecja |
| Infopacki | 24–32 | po 3–4 materiały właściwe dla tematu |
| Życie codzienne / kampus | 12 | biblioteka, dziekanat, akademiki, sale, organizacje |

Łącznie warto planować około 100 autentycznych materiałów, ale publikować je
falami. To nie oznacza galerii na każdej stronie — zdjęcie musi wyjaśniać miejsce,
człowieka, emocję albo etap procesu.

## Jak odgenericować każdy infopack

Wspólny szkielet informacyjny zostaje, lecz każdy przewodnik otrzymuje własny
„materiał główny” i jedną charakterystyczną interakcję.

| Infopack | Materiał główny | Charakterystyczna interakcja |
|---|---|---|
| Regulamin studiów | fragmenty dokumentu, komentarze na marginesach, wyróżnione paragrafy | „co to oznacza w mojej sytuacji?” prowadzące od zdarzenia do paragrafu |
| Podania | prawdziwy formularz i anatomia poprawnego uzasadnienia | składanie podania z elementów + kontrola kompletności |
| USOS | aktualne zrzuty ekranu | krok po kroku ze wskazaniem dokładnego miejsca kliknięcia |
| Zaliczenie semestru | kalendarz roku, zdjęcia sesji i kampusu | osobista oś terminów zależna od wybranego problemu |
| Sprawy studenckie | portrety i realne miejsca pomocy | routing: „z czym przychodzę” → właściwa osoba, pokój i dokument |
| Biblioteka | piętra, kabiny, półki, strefy ciszy | przestrzenny przewodnik „czego potrzebuję teraz?” |
| Życie studenckie | reportaż z organizacji i projektów | mapa energii: spokojnie / społecznie / projektowo / sportowo |
| Dyplomowanie | APD, promotor, obrona, GradUEtion | kokpit postępu z następnym krokiem i ryzykiem opóźnienia |

Wspólna kompozycja nie powinna oznaczać wspólnego wyglądu. Każdy infopack może
korzystać z czterech warstw:

1. wejście materiałowe: fotografia, ekran systemu albo dokument;
2. rdzeń zadaniowy: „co chcę zrobić?”;
3. przerwa redakcyjna: duży, autentyczny materiał z krótkim komentarzem;
4. formalne źródła: dokument, data aktualizacji, opiekun treści.

## Kolejność wdrażania

### Fala 1 — wiarygodność i kompletność

1. rozstrzygnąć adres biura;
2. odzyskać regulacje i dokumenty RUSS;
3. uruchomić stronę Filii;
4. uzupełnić realnych partnerów;
5. zweryfikować stypendia i ich załączniki.

### Fala 2 — prawdziwi ludzie i miejsca

1. sesja portretowa Zarządu i RUSS;
2. bank zdjęć projektów;
3. zdjęcia Filii, biura, biblioteki i kampusu;
4. migracja znaków partnerów.

### Fala 3 — infopacki jako osobne doświadczenia

Najpierw USOS, Podania i Regulamin studiów, ponieważ naturalnie korzystają z
ekranów i dokumentów. Następnie Biblioteka, Sprawy studenckie i Życie studenckie.
Dyplomowanie zachowuje obecny kokpit i dostaje materiały APD oraz reportaż z
obrony/GradUEtion.

## Definicja ukończenia migracji

Funkcja jest naprawdę przeniesiona dopiero wtedy, gdy:

- użytkownik może wykonać to samo zadanie albo łatwiej osiągnąć ten sam cel;
- treść ma aktualnego właściciela i datę sprawdzenia;
- dokument źródłowy jest dostępny;
- stare adresy mają przekierowania;
- wersja PL i EN nie rozjeżdżają się funkcjonalnie;
- brak zdjęcia lub danych daje uczciwy stan zastępczy, nie fałszywą treść.
