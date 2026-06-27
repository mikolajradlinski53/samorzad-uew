# E-sylabus import + kalkulator wielowymiarowy — design

> Data: 2026-06-27. Rozszerzenie kalkulatora średniej: zamiast ręcznie kurowanego
> `programs.ts` — dane generowane z oficjalnego e-sylabusa UEW. Feasibility
> potwierdzona spike'em (patrz `reference-esylabus-api` w pamięci).

## Cel

Kalkulator średniej działa na **realnych, oficjalnych danych** z `ue.e-sylabus.pl`:
prawdziwe kierunki, roczniki, przedmioty i ECTS — generowane skryptem-importerem,
nie wpisywane ręcznie. Student wybiera **kierunek → stopień → tryb → rocznik → rok**,
dostaje swoje przedmioty z ECTS i liczy średnią ważoną.

## Decyzje zakresowe (zatwierdzone)

- **Roczniki:** wybór rocznika w UI; import łapie **dynamicznie** wszystkie roczniki
  obecne w e-sylabusie (dodadzą nowy → kolejny import sam go uwzględni; zero hardcodu).
- **Tryb:** importujemy **stacjonarne i niestacjonarne** (osobne ECTS/semestry); tryb
  jako wybór w UI.
- **Pokrycie:** importujemy tylko kierunki z **opublikowanym** planem (reszta pomijana).

## Źródło danych (potwierdzone API)

Publiczne (bez logowania), JSON, **POST**, cp1250, **podwójnie zakodowany JSON**.
1. `GET /ForStudents` → ciasteczko sesji.
2. `POST Sylabus/GetYearsAndDepartments` (`loadCourses=false&loadAuthors=false`) →
   `YearList`, `DepartmentList[0].FieldOfStudyList`, `SpecjalizationList`
   (wiąże kierunek×rocznik×stopień; plan bazowy = spec z pustą `NazwaSpecjalizacji`).
3. `POST ForStudents/GetPlanOfStudies` (`fieldOfStudy, levelOfStudies, year,
   specjalization, speciality=, user=, unitName=, courseName=`) →
   `MandatoryCourseGroup` + `OptionalCourseGroup` → `ListaKursow[]`. Pusty plan = `""`.

Pola kursu: `NazwaPrzedmiotu`, `NazwaAngielska`, `ECTS`, `ECTSNiestacjonarne`,
`Semestr`/`SemestrNiestacjonarne` (rzymskie I..VII), `KodPrzedmiotu`,
`FormyZal`/`FormaZalID`, `TypName`.

## Architektura

### Importer (`scripts/import-esylabus.mjs`)
- Node ESM, tylko wbudowane API: globalne `fetch`, ręczny cookie jar (z `Set-Cookie`),
  `TextDecoder("windows-1250")` (Node ma pełne ICU), `JSON.parse(JSON.parse(...))`.
- Uruchamiany ręcznie/okresowo: `npm run import:sylabus`.
- Algorytm:
  1. Sesja → `GetYearsAndDepartments`.
  2. Z `SpecjalizationList` buduje unikalne trójki **(kierunek, stopień, rocznik)**;
     dla każdej wybiera spec bazową (pusta `NazwaSpecjalizacji`).
  3. `GetPlanOfStudies` dla każdej trójki; pomija puste (`""`).
  4. Z `ListaKursow` (mandatory+optional) wyciąga przedmioty. Dla **każdego trybu**:
     - stacjonarne: `ECTS`, `Semestr`; niestacjonarne: `ECTSNiestacjonarne`,
       `SemestrNiestacjonarne`. Przedmiot z `ECTS==0` w danym trybie → pomijany w tym trybie.
     - `year = ceil(rzymski(Semestr)/2)`; grupuje po roku→semestrze.
  5. Zapisuje `src/lib/programs.generated.json` (deterministyczna kolejność: sort po
     kierunku/stopniu/roczniku/semestrze/nazwie — żeby diff w gicie był czytelny).
- **Odporność:** błąd pojedynczego planu nie wywala całości (log + skip); na końcu
  raport: ile kierunków/planów/przedmiotów zaimportowano, ile pominięto.
- **`pass` (zal vs ocena):** domyślnie **wszystkie przedmioty są oceniane**
  (`pass` pomijane) — bo do średniej ważonej wchodzą przedmioty z oceną, a e-sylabus
  nie rozróżnia pewnie „zaliczenie" od „zaliczenie na ocenę". Zachowujemy `FormaZalID`
  jako metadane; ewentualne oznaczanie `zal` to późniejsze doprecyzowanie. (Student i
  tak zostawia pole puste, jeśli przedmiot był bez oceny.)

### Model danych (`src/lib/programs.ts` — typy + loader + selektor)
`programs.ts` przestaje trzymać dane na sztywno: importuje wygenerowany JSON i wystawia
typowane API. Rozszerzony kształt:

```ts
type DegreeLevel = "I" | "II" | "jednolite";
type StudyMode = "stacjonarne" | "niestacjonarne";
interface Course { name: string; nameEn?: string; ects: number; semester: number; code?: string; pass?: "ocena" | "zal"; }
interface Term { semester: number; courses: Course[]; }
interface Year { year: number; terms: Term[]; }
interface Track { mode: StudyMode; years: Year[]; }
interface Cohort { rocznik: string; tracks: Track[]; }      // np. "2024/2025"
interface Degree { level: DegreeLevel; cohorts: Cohort[]; }
interface Program { id: string; name: string; degrees: Degree[]; }
```

Selektory (czyste, testowalne):
- `listPrograms()`, i pochodne listy opcji (poziomy danego programu, tryby danego
  poziomu, roczniki danego trybu, lata danego rocznika) — sterują kaskadą selectów.
- `getCoursesFor(programId, level, mode, rocznik, year): Course[]` — spłaszcza semestry
  danego roku.

### UI (`KalkulatorSredniejContent.tsx`)
- Pięć selectów (kaskada): **kierunek → stopień → tryb → rocznik → rok**. Zmiana
  wyższego poziomu reclampuje niższe do pierwszej dostępnej wartości (rozszerzenie
  istniejącej logiki `selectProgram`/`selectLevel`).
- `gradeKey` rozszerzony o `mode` i `rocznik` (oceny per dokładny plan).
- EN: gdy `locale==="en"` i `course.nameEn` istnieje — pokazuje `nameEn`.
- Reszta (tabela, tryb ręczny, `AverageResult`, persystencja, a11y) bez zmian.

## Co zostaje bez zmian
`average.ts` (logika średniej ważonej) i `AverageResult.tsx` — nietknięte.

## Testy
- `average.ts` — bez zmian (już pokryte).
- Nowe selektory w `programs.ts` — testy jednostkowe na małym **fixture** (nie na
  żywym API): kaskada list opcji + `getCoursesFor` (spłaszczanie, nieznany wybór → `[]`).
- Parser importera — funkcja czysta `parsePlan(rawObj, mode)` wydzielona i przetestowana
  na zapisanej, prawdziwej próbce odpowiedzi (fixture w `scripts/__fixtures__/`), żeby
  nie zależeć od sieci w testach.
- Sam przebieg sieciowy importera — bez testów automatycznych (efekt zewnętrzny);
  weryfikacja przez realne uruchomienie + raport pokrycia.

## Ryzyka / uwagi (uczciwie)
- Scraping cudzego serwisu: zmiana ich pól/HTML może wymagać korekty importera. Parser
  wydzielony + fixture ułatwiają szybką naprawę.
- Rozmiar `programs.generated.json` (wszystkie kierunki×roczniki×2 tryby) może być spory
  — to statyczny import w bundlu klienta. Jeśli urośnie nadmiernie: rozważyć ładowanie
  per-wybór z API route (poza tym MVP — najpierw zmierzyć rozmiar).
- Poprawność `pass`/„zal" — patrz wyżej; świadomie upraszczamy.
- Dane cp1250 + podwójny JSON — obsłużone, ale to miejsca typowych błędów; parser ma to
  pokryte testem na fixture.

## Poza zakresem
- Specjalizacje/specjalności (bierzemy plan bazowy kierunku).
- Live-fetch per kliknięcie (świadomie: importer → statyczny zbiór).
- USOS (osobny, przyszły tor).
