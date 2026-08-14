# Strona główna UEW — interfejs intencji

Data: 14.08.2026  
Status: autorski kierunek wdrożony jako prototyp produkcyjny

## 1. Decyzja projektowa

Nowa główna nie kopiuje architektury, kolejności sekcji, haseł ani sposobu opowiadania z dotychczasowej strony Samorządu. Stary serwis pozostaje wyłącznie źródłem faktów do osobnej weryfikacji.

Projekt nie jest „ładniejszą stroną instytucji”. Jest interfejsem, który zaczyna od sytuacji człowieka i dopiero potem ujawnia właściwe narzędzie, osobę albo część Samorządu.

Główna zasada:

> Student nie powinien wiedzieć, który organ, paragraf ani pokój odpowiada za jego problem. System powinien wiedzieć to za niego.

## 2. Design thinking

### Empatia

Student najczęściej nie przychodzi z nazwą jednostki organizacyjnej. Przychodzi z jednym z czterech stanów:

- coś utknęło;
- potrzebuję rozmowy;
- chcę coś uruchomić;
- chcę sprawdzić, jak to działa.

### Definicja problemu

Klasyczna strona wymaga, aby użytkownik najpierw zrozumiał strukturę uczelni, a dopiero potem znalazł pomoc. To odwrócona odpowiedzialność: system przerzuca własną złożoność na studenta.

### Idea

Główna działa jako cyfrowy punkt wejścia do UEW:

1. rozpoznaje intencję;
2. zmienia język i kadr;
3. pozwala opisać sytuację jednym zdaniem;
4. prowadzi do konkretnego następnego ruchu;
5. pokazuje Samorząd przez skutki i energię działań, nie przez katalog organów.

## 3. Narracja AIDA

### Attention — interaktywne archiwum

Pełnoekranowy hero używa kinetycznej typografii, zdjęcia wbudowanego w nagłówek i zmiennego kadru. Cztery przyciski nie są zakładkami nawigacji, lecz czterema sposobami rozpoczęcia rozmowy ze stroną.

Hasło:

> Nie szukaj zakładki. Zacznij od sytuacji.

### Interest — bezszwowa mapa sytuacji

Cztery ścieżki tworzą jeden gapless bento grid bez kart w kartach i bez pustych komórek. Najbardziej uniwersalna ścieżka otrzymuje skalę fotograficzną, pozostałe zachowują charakter typograficzny.

### Desire — przypięty manifest

Na desktopie kolejne słowa manifestu aktywują się wraz ze scrollem, a fotografia przesuwa się w przeciwnym tempie. Na telefonie nie występuje pinning: tekst i kadr układają się w naturalny, pionowy rozdział.

### Proof — żywe archiwum projektów

Adapciak, Bal UEW i Dni Adaptacyjne tworzą poziomy akordeon. Panel rozwija się na hover i focus, ale na telefonie staje się pełnoekranowym rozdziałem. Zdjęcia pozostają opisane jako kadry archiwalne do czasu jednoznacznego przypisania galerii.

### Action — wyszukiwanie sytuacyjne

Stronę zamyka zdanie:

> Jeśli nie znajdujesz swojej sprawy, to strona ma problem. Nie Ty.

Pole tekstowe prowadzi do istniejącego wyszukiwania, a link wtórny do bezpośredniego kontaktu.

## 4. Język wizualny

- Outfit jako osobny krój ekspozycyjny tylko dla głównej;
- głęboki granat, elektryczny niebieski, lodowa biel i pojedynczy żółty akcent;
- ogromna, szeroka typografia zamiast serii nagłówków w podobnych kartach;
- fotografie jako rozdziały i materiał dokumentalny, nie ozdobne miniatury;
- ostre granice, pełne płaszczyzny i brak przypadkowych zaokrągleń;
- małe podpisy techniczne w JetBrains Mono;
- brak wskaźników „sekcja 01”, badge’y i dekoracyjnych pigułek.

## 5. Ruch

Wdrożenie korzysta z GSAP i ScrollTrigger:

- parallax aktywnego kadru hero;
- pionowe odsłonięcie zdjęcia po zmianie intencji;
- pinned word reveal manifestu wyłącznie od 900 px;
- subtelny parallax zdjęć w akordeonie;
- rozwijanie panelu na hover i focus.

`prefers-reduced-motion` wyłącza pinning, parallax i czasowe transformacje. Treść pozostaje widoczna bez animacji i bez JavaScriptu.

## 6. Mobile nie jest pomniejszonym desktopem

- nagłówek ma zaplanowane trzy linie i oś centralną;
- fotografia staje się warstwą kontekstową pod tekstem;
- cztery intencje tworzą układ 2 × 2 bez poziomego przewijania;
- bento przechodzi w cztery pełne sceny;
- manifest nie zatrzymuje scrolla;
- akordeon przechodzi w pionowe rozdziały fotograficzne;
- formularze zmieniają się w układ jednokolumnowy z pełnym CTA.

## 7. Materiały do kolejnej warstwy „wow”

### Zdjęcia

Potrzebne są cztery jednoznaczne serie odpowiadające intencjom:

- sprawa — prawdziwa praca nad dokumentem lub rozmowa przy stole;
- wsparcie — spokojny, nieinscenizowany kadr miejsca albo rozmowy bez eksponowania osoby w kryzysie;
- pomysł — grupa podczas tworzenia, budowy albo próby;
- jawność — decyzja, spotkanie lub czytelny materiał z danymi.

Dla każdego motywu: poziom 16:9, pion 9:16 i detal pozwalający użyć zdjęcia wewnątrz jednego słowa. Wszystkie ujęcia powinny mieć zapas kadru i zgodę rozpoznawalnych osób.

### Higgsfield / wideo

Zamiast animowania logotypu rekomendowane są cztery krótkie, 4–6 sekundowe mikrosceny z identycznym ruchem kamery. Zmiana intencji może wtedy płynnie zmieniać jeden dokumentalny moment w drugi.

Wymagania:

- osobny master 16:9 i 9:16;
- nieruchoma pierwsza klatka zgodna z posterem strony;
- bez tekstu i logotypów generowanych przez AI;
- bez wymyślonych twarzy podszywających się pod studentów UEW;
- spokojny ruch kamery, bez efektu reklamowego teledysku;
- możliwość płynnego zapętlenia i eksport WebM/MP4.

## 8. Kryteria akceptacji

- brak poziomego overflow od 320 px;
- hero: dwie linie na desktopie, trzy na telefonie;
- aktywne elementy dostępne klawiaturą i widoczny focus;
- kontrast WCAG AA także przed załadowaniem fotografii;
- brak treści ujawnianej dopiero po animacji;
- brak pinningu poniżej 900 px;
- brak stocków udających konkretne wydarzenia UEW;
- jeden LCP-owy obraz hero, pozostałe ładowane dopiero na żądanie;
- polska i angielska wersja wszystkich nowych komunikatów.
