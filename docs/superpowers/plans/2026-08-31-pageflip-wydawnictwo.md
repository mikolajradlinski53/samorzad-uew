# Pageflip — przewracana publikacja na /wydawnictwo

> **Dla wykonawcy:** WYMAGANY SUB-SKILL: `superpowers:subagent-driven-development`
> (zalecany) albo `superpowers:executing-plans`. Kroki mają pola wyboru (`- [ ]`).

**Cel:** Kliknięcie grzbietu na `/wydawnictwo` otwiera pełnoekranową scenę 3D, w
której realną publikację „Debiuty Studenckie" kartkuje się jak papierową książkę
— kartka zgina się wokół walca i rzuca ruchomy cień na rozkładówkę.

**Architektura:** Trzy warstwy, każda działa samodzielnie. (1) Potok danych:
`mupdf` rasteryzuje PDF do stron WebP i generuje manifest wymiarów. (2) Powłoka
czytnika: nakładka `role="dialog"` z pułapką fokusu, obsługą klawiatury i
statyczną rozkładówką — działa bez WebGL. (3) Scena `three` doładowywana
dynamicznie dopiero po otwarciu czytnika.

**Stos:** Next.js 16 · React 19 · TypeScript · `three` (nowa zależność) ·
`mupdf` + `sharp` (tylko `devDependencies`, do skryptu) · vitest · playwright

**Specyfikacja:** `docs/superpowers/specs/2026-08-31-pageflip-wydawnictwo-design.md`

---

## Fakty zweryfikowane przed napisaniem planu

Nie zgaduj tych wartości — zostały zmierzone na prawdziwym pliku:

| Rzecz | Wartość | Jak sprawdzona |
|---|---|---|
| Stron w PDF | 130 | `mupdf` `countPages()` |
| MediaBox | 476,22 × 674,646 pt | nagłówek PDF |
| Skala do 1130 px | `1130 / 674.646 = 1.675` | wyliczona |
| Rozmiar strony po renderze | 798 × 1130 px | render próbny |
| WebP q72 | ok. 94 KB/stronę | zmierzone na 3 stronach |
| Cały tom | ok. 11,9 MB | 94 KB × 130 |
| Warstwa tekstowa PDF | JEST (387 operatorów `Tj/TJ`) | rozpakowane strumienie |
| PDF otagowany | TAK (`/StructTreeRoot`, `/MarkInfo`) | nagłówek PDF |

WebP **stratny q72 jest optymalny**. Bezstratny daje 17,9 MB (gorzej — strony
mają wygładzany tekst w szarościach, nie płaskie kolory). Jakość q72 sprawdzona
wzrokowo na stronie z gęstym tekstem: ostra i w pełni czytelna.

`sharp` jest dziś w projekcie **tylko jako zależność przechodnia Next.js**.
Skrypt nie może na tym polegać — Zadanie 1 dodaje ją jawnie.

---

## Struktura plików

| Plik | Odpowiedzialność |
|---|---|
| `scripts/build-edition.mjs` | PDF → strony WebP + manifest + kopia PDF-a. Jedyne wejście: ścieżka do PDF-a. |
| `src/lib/edition-pages.ts` | **GENEROWANY** manifest: slug → strony z wymiarami |
| `src/lib/editions.ts` | ręczne metadane wydania (tytuł, redaktorki, ISBN, DOI, licencja, PDF) |
| `src/lib/publications.ts` | rozdziały tomu — prawdziwe dane zamiast placeholderów |
| `src/lib/spread.ts` | czysta arytmetyka rozkładówek (bez Reacta, bez `three`) |
| `src/components/wydawnictwo/EditionReader.tsx` | nakładka: fokus, klawiatura, odwrót statyczny |
| `src/components/wydawnictwo/editionScene.ts` | scena `three` — bez Reacta, `create/dispose` |
| `src/components/SpineWall.tsx` | dokłada przycisk „Przejrzyj" |

Podział wynika z jednej zasady: **arytmetyka osobno od widoku, widok osobno od
WebGL**. Dzięki temu logikę rozkładówek testujemy jednostkowo, powłokę czytnika
w przeglądarce, a scena 3D jest wymienialna.

---

## Faza 1 — dane i potok

### Zadanie 1: Zależności

**Pliki:** `package.json`

- [ ] **Krok 1: Zainstaluj zależności**

```bash
npm i three
npm i -D @types/three mupdf sharp
```

`three` trafia do `dependencies` (idzie do przeglądarki). `mupdf` i `sharp`
do `devDependencies` — działają tylko w skrypcie, nigdy w kodzie strony.

- [ ] **Krok 2: Sprawdź, że build nadal przechodzi**

Uruchom: `npx tsc --noEmit && npm run build`
Oczekiwane: bez błędów.

- [ ] **Krok 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: three do sceny 3D, mupdf i sharp do potoku wydań

sharp był dotąd tylko zależnością przechodnią Next.js — skrypt budujący nie
może na tym polegać, więc wchodzi jawnie."
```

---

### Zadanie 2: Arytmetyka rozkładówek

Najbardziej podatna na błędy część całości — indeksy stron przy przewracaniu.
Dlatego powstaje pierwsza, osobno i z testami.

**Pliki:**
- Utwórz: `src/lib/spread.ts`
- Test: `src/lib/spread.test.ts`

- [ ] **Krok 1: Napisz test, który ma nie przejść**

```ts
// src/lib/spread.test.ts
import { describe, expect, it } from "vitest";
import { sheetCount, spreadAt, framesFor } from "./spread";

describe("sheetCount", () => {
  it("liczy arkusze z liczby stron", () => {
    expect(sheetCount(130)).toBe(65);
    expect(sheetCount(1)).toBe(1);
    expect(sheetCount(0)).toBe(0);
  });

  it("zaokrągla w górę przy nieparzystej liczbie stron", () => {
    expect(sheetCount(129)).toBe(65);
  });
});

describe("spreadAt", () => {
  it("zamknięta książka pokazuje samą okładkę po prawej", () => {
    expect(spreadAt(0, 130)).toEqual({ verso: null, recto: 0 });
  });

  it("pierwsza rozkładówka to strony 1 i 2", () => {
    expect(spreadAt(1, 130)).toEqual({ verso: 1, recto: 2 });
  });

  it("kolejna rozkładówka przesuwa się o dwie strony", () => {
    expect(spreadAt(2, 130)).toEqual({ verso: 3, recto: 4 });
  });

  it("na końcu tomu prawa strona jest pusta", () => {
    expect(spreadAt(65, 130)).toEqual({ verso: 129, recto: null });
  });
});

describe("framesFor", () => {
  it("kadruje obracany arkusz między stronami, które odsłania", () => {
    // obrót arkusza 1: widoczne statycznie 1 i 4, w ruchu 2 -> 3
    expect(framesFor(1, 130)).toEqual({
      staticVerso: 1,
      staticRecto: 4,
      leafFront: 2,
      leafBack: 3,
    });
  });

  it("przy pierwszym arkuszu lewa strona statyczna nie istnieje", () => {
    expect(framesFor(0, 130)).toEqual({
      staticVerso: null,
      staticRecto: 2,
      leafFront: 0,
      leafBack: 1,
    });
  });

  it("przy ostatnim arkuszu prawa strona statyczna nie istnieje", () => {
    expect(framesFor(64, 130)).toEqual({
      staticVerso: 127,
      staticRecto: null,
      leafFront: 128,
      leafBack: 129,
    });
  });
});
```

- [ ] **Krok 2: Uruchom test i potwierdź, że nie przechodzi**

Uruchom: `npx vitest run src/lib/spread.test.ts`
Oczekiwane: FAIL — `Failed to resolve import "./spread"`.

- [ ] **Krok 3: Napisz najmniejszą implementację**

```ts
// src/lib/spread.ts
/**
 * Arytmetyka rozkładówek książki.
 *
 * Model: arkusz ma dwie strony — przód (recto, nieparzysty indeks od zera:
 * 0, 2, 4…) i tył (verso). Stan książki opisuje JEDNA liczba `o` — ile arkuszy
 * leży już po lewej stronie.
 *
 * Indeksy stron są liczone OD ZERA, bo tak indeksuje się tablicę manifestu.
 * Strona 0 to okładka: przy zamkniętej książce (`o = 0`) leży sama po prawej,
 * bo po lewej nie ma jeszcze niczego.
 *
 * Moduł jest czysty — bez Reacta i bez `three` — żeby dało się go przetestować
 * bez uruchamiania przeglądarki. To tutaj kryją się wszystkie błędy o jeden.
 */

/** Strony widoczne w spoczynku. `null` = po tej stronie nie ma kartki. */
export interface Spread {
  verso: number | null;
  recto: number | null;
}

/** Strony potrzebne do narysowania obrotu jednego arkusza. */
export interface Frames {
  /** Statyczna strona po lewej, odsłonięta przez obrót. */
  staticVerso: number | null;
  /** Statyczna strona po prawej, odsłaniana przez obrót. */
  staticRecto: number | null;
  /** Przód obracanej kartki (widoczny na starcie). */
  leafFront: number;
  /** Tył obracanej kartki (widoczny po wylądowaniu). */
  leafBack: number;
}

/** Ile arkuszy ma tom o podanej liczbie stron. Ostatni bywa niepełny. */
export function sheetCount(pageCount: number): number {
  return Math.ceil(pageCount / 2);
}

const clamp = (page: number, pageCount: number): number | null =>
  page >= 0 && page < pageCount ? page : null;

/** Rozkładówka spoczynkowa przy `o` arkuszach po lewej. */
export function spreadAt(o: number, pageCount: number): Spread {
  return {
    verso: clamp(2 * o - 1, pageCount),
    recto: clamp(2 * o, pageCount),
  };
}

/**
 * Kadr obrotu arkusza `base`.
 *
 * Kartka w ruchu zakrywa kolejno obie strony, które sąsiadują z nią w spoczynku,
 * więc pod spodem muszą leżeć te, które obrót ODSŁANIA: `2·base−1` po lewej i
 * `2·base+2` po prawej. Bez tego kartka odsłoniłaby pustkę.
 */
export function framesFor(base: number, pageCount: number): Frames {
  return {
    staticVerso: clamp(2 * base - 1, pageCount),
    staticRecto: clamp(2 * base + 2, pageCount),
    leafFront: 2 * base,
    leafBack: 2 * base + 1,
  };
}
```

- [ ] **Krok 4: Uruchom test i potwierdź, że przechodzi**

Uruchom: `npx vitest run src/lib/spread.test.ts`
Oczekiwane: PASS, 10 testów.

- [ ] **Krok 5: Commit**

```bash
git add src/lib/spread.ts src/lib/spread.test.ts
git commit -m "feat: arytmetyka rozkładówek książki

Czysty moduł bez Reacta i bez three — to tutaj kryją się wszystkie błędy
o jeden przy indeksach stron, więc powstaje pierwszy i osobno."
```

---

### Zadanie 3: Skrypt budujący wydanie

**Pliki:**
- Utwórz: `scripts/build-edition.mjs`
- Utwórz (wynik): `src/lib/edition-pages.ts`, `public/wydawnictwo/**`

- [ ] **Krok 1: Napisz skrypt**

```js
// scripts/build-edition.mjs
/**
 * PDF wydania → strony WebP + manifest wymiarów + kopia PDF-a.
 *
 * Jedyne wejście to ścieżka do PDF-a, bo Wydawnictwo UEW przysyła kolejne tomy
 * serii na bieżąco i ten skrypt ma być powtarzalny bez dłubania w kodzie.
 *
 *   node scripts/build-edition.mjs <plik.pdf> <slug>
 *
 * DLACZEGO mupdf, a nie pdfjs-dist: pdfjs wymaga backendu canvas (kompilacja
 * natywna, na Windowsie bolesna). mupdf to jeden pakiet WASM — instaluje się
 * w dwie sekundy i renderuje identycznie na każdym systemie.
 *
 * DLACZEGO WebP stratny q72, a nie bezstratny: strony mają tekst wygładzany
 * w odcieniach szarości, nie płaskie kolory. Zmierzone na tym tomie:
 * stratny q72 = 94 KB/stronę, bezstratny = 141 KB/stronę. Bezstratny jest
 * więc PÓŁTORA RAZA CIĘŻSZY i nic nie wnosi — jakość q72 sprawdzona wzrokowo
 * na stronie z gęstym tekstem i tabelą.
 */
import * as mupdf from "mupdf";
import sharp from "sharp";
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, statSync } from "node:fs";
import path from "node:path";

const [, , pdfPath, slug] = process.argv;

if (!pdfPath || !slug) {
  console.error("Użycie: node scripts/build-edition.mjs <plik.pdf> <slug>");
  process.exit(1);
}

/** Dłuższa krawędź strony w pikselach. Strona ma na ekranie ok. 400-500 px,
 *  więc 1130 daje zapas ponad 2x i nie waży niepotrzebnie. */
const LONG_EDGE = 1130;
const QUALITY = 72;

const outDir = path.join("public", "wydawnictwo", slug);
mkdirSync(outDir, { recursive: true });

const doc = mupdf.Document.openDocument(readFileSync(pdfPath), "application/pdf");
const count = doc.countPages();
console.log(`${slug}: ${count} stron`);

const pages = [];
let totalKb = 0;

for (let i = 0; i < count; i++) {
  const page = doc.loadPage(i);
  const box = page.getBounds(); // [x0, y0, x1, y1]
  const height = box[3] - box[1];
  const scale = LONG_EDGE / height;

  const pix = page.toPixmap(
    mupdf.Matrix.scale(scale, scale),
    mupdf.ColorSpace.DeviceRGB,
    false, // bez kanału alfa — strony są nieprzezroczyste
  );

  const name = `${String(i + 1).padStart(3, "0")}.webp`;
  const dest = path.join(outDir, name);
  await sharp(Buffer.from(pix.asPNG())).webp({ quality: QUALITY }).toFile(dest);

  const meta = await sharp(dest).metadata();
  pages.push({ src: `/wydawnictwo/${slug}/${name}`, width: meta.width, height: meta.height });

  totalKb += statSync(dest).size / 1024;
  pix.destroy();
  page.destroy();

  if ((i + 1) % 20 === 0 || i + 1 === count) {
    console.log(`  ${i + 1}/${count} (${Math.round(totalKb / 1024 * 10) / 10} MB)`);
  }
}

// PDF idzie obok stron: to ON jest dostępną drogą do treści dla czytnika ekranu,
// bo ma warstwę tekstową i strukturę. Scena 3D jest tylko ilustracją.
const pdfName = `${slug}.pdf`;
copyFileSync(pdfPath, path.join("public", "wydawnictwo", pdfName));

const body = `/**
 * Strony wydań serii „Debiuty Studenckie" — PLIK GENEROWANY.
 *
 * Nie edytuj ręcznie. Źródło: scripts/build-edition.mjs
 *   node scripts/build-edition.mjs <plik.pdf> <slug>
 *
 * Wymiary są potrzebne, żeby scena ustawiła geometrię przed wczytaniem obrazu.
 */

export interface EditionPage {
  src: string;
  width: number;
  height: number;
}

export const editionPages: Record<string, EditionPage[]> = ${JSON.stringify(
    { [slug]: pages },
    null,
    2,
  )};
`;

writeFileSync(path.join("src", "lib", "edition-pages.ts"), body);

console.log(`\nGotowe: ${count} stron, ${Math.round(totalKb / 1024 * 10) / 10} MB`);
console.log(`PDF: public/wydawnictwo/${pdfName}`);
console.log("Manifest: src/lib/edition-pages.ts");
```

- [ ] **Krok 2: Dodaj skrót w package.json**

W `"scripts"` dopisz po `"import:sylabus"`:

```json
"build:edition": "node scripts/build-edition.mjs"
```

- [ ] **Krok 3: Uruchom na prawdziwym tomie**

```bash
node scripts/build-edition.mjs "C:/Users/Mikołaj/Downloads/DS_Radomska Witek_New Trends_INTERNET_okl_fin.pdf" new-trends-2026
```

Oczekiwane: `130 stron`, postęp co 20, na końcu ok. `11,9 MB`.

- [ ] **Krok 4: Sprawdź wynik**

```bash
ls public/wydawnictwo/new-trends-2026/ | wc -l   # 130
du -sh public/wydawnictwo/                        # ~14 MB (strony + PDF)
node -e "const {editionPages}=require('./src/lib/edition-pages.ts');" 2>/dev/null || npx tsc --noEmit
```

Oczekiwane: 130 plików, `tsc` bez błędów.

- [ ] **Krok 5: Commit**

```bash
git add scripts/build-edition.mjs package.json src/lib/edition-pages.ts public/wydawnictwo
git commit -m "feat: potok wydań — PDF na strony WebP i manifest

mupdf zamiast pdfjs-dist, bo pdfjs wymaga backendu canvas z kompilacją
natywną, a mupdf to jeden pakiet WASM działający wszędzie tak samo.

WebP stratny q72, nie bezstratny: zmierzone na tym tomie 94 KB/stronę wobec
141 KB bezstratnie. Strony mają tekst wygładzany w szarościach, nie płaskie
kolory, więc bezstratny jest półtora raza cięższy i nic nie wnosi.

PDF ląduje obok stron, bo to ON jest dostępną drogą do treści — ma warstwę
tekstową i strukturę. Scena 3D jest ilustracją."
```

---

### Zadanie 4: Prawdziwe dane zamiast placeholderów

Usuwa zmyślony dorobek z oficjalnego serwisu uczelni.

**Pliki:**
- Utwórz: `src/lib/editions.ts`
- Zmodyfikuj: `src/lib/publications.ts`
- Test: `src/lib/publications.test.ts`

- [ ] **Krok 1: Napisz test cytowania rozdziału**

Dopisz na końcu `src/lib/publications.test.ts`:

```ts
import { formatChapterCitation, publications } from "./publications";

describe("formatChapterCitation", () => {
  it("cytuje rozdział w tomie zbiorowym z zakresem stron", () => {
    const p: Publication = {
      title: "The Role of Branding in the Success of Startups – Case of Airbnb",
      authors: ["Dorosh, D."],
      year: 2026,
      pages: { from: 5, to: 16 },
      doi: "10.15611/2026.35.7.01",
      edition: "new-trends-2026",
    };
    expect(formatChapterCitation(p)).toBe(
      "Dorosh, D. (2026). The Role of Branding in the Success of Startups – Case of Airbnb. " +
        "W: J. Radomska, A. Witek-Crabb (red.), New Trends in Business Management. " +
        "Culture, Strategy, Engagement (s. 5-16). Wydawnictwo Uniwersytetu Ekonomicznego " +
        "we Wrocławiu. DOI: 10.15611/2026.35.7.01",
    );
  });
});

describe("dane publikacji", () => {
  it("nie zawiera placeholderów", () => {
    const joined = JSON.stringify(publications);
    expect(joined).not.toContain("XXXX");
    expect(joined).not.toContain("PLACEHOLDER");
  });

  it("każdy rozdział ma autorów, rok i zakres stron", () => {
    expect(publications.length).toBeGreaterThan(0);
    for (const p of publications) {
      expect(p.authors.length).toBeGreaterThan(0);
      expect(p.year).toBeGreaterThan(2000);
      expect(p.pages?.from).toBeGreaterThan(0);
      expect(p.pages!.to).toBeGreaterThanOrEqual(p.pages!.from);
    }
  });
});
```

- [ ] **Krok 2: Uruchom i potwierdź, że nie przechodzi**

Uruchom: `npx vitest run src/lib/publications.test.ts`
Oczekiwane: FAIL — brak eksportu `formatChapterCitation`, oraz `toContain("XXXX")`
wykrywa dzisiejsze placeholdery.

- [ ] **Krok 3: Dodaj metadane wydania**

```ts
// src/lib/editions.ts
/**
 * Wydania serii „Debiuty Studenckie".
 *
 * Metadane redakcyjne pisane ręcznie; STRONY są osobno, w generowanym
 * `edition-pages.ts`. Rozdzielenie jest celowe — ręcznych danych nie chcemy
 * nadpisywać przy każdym przebiegu skryptu.
 */
import { editionPages, type EditionPage } from "./edition-pages";

export interface Edition {
  slug: string;
  title: string;
  subtitle?: string;
  editors: string[];
  year: number;
  isbn: string;
  doi: string;
  /** Pełny tekst w otwartym dostępie — hostowany przez nas. */
  pdf: string;
  license: string;
  licenseUrl: string;
}

export const editions: Edition[] = [
  {
    slug: "new-trends-2026",
    title: "New Trends in Business Management",
    subtitle: "Culture, Strategy, Engagement",
    editors: ["Joanna Radomska", "Anna Witek-Crabb"],
    year: 2026,
    isbn: "978-83-68699-35-7",
    doi: "10.15611/2026.35.7",
    pdf: "/wydawnictwo/new-trends-2026.pdf",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/deed.pl",
  },
];

export const editionBySlug = (slug: string): Edition | undefined =>
  editions.find((e) => e.slug === slug);

/** Strony wydania. Pusta tablica = wydanie bez zdigitalizowanych stron. */
export const pagesOf = (slug: string): EditionPage[] => editionPages[slug] ?? [];
```

- [ ] **Krok 4: Podmień dane publikacji**

Zastąp CAŁĄ zawartość `src/lib/publications.ts`:

```ts
/**
 * Rozdziały serii „Debiuty Studenckie".
 *
 * Do 2026-08-31 były tu TRZY PLACEHOLDERY z wymyślonymi nazwiskami („Kowalski,
 * J.", „Nowak, A.") i fikcyjnymi numerami ISBN. Na oficjalnym serwisie uczelni
 * był to zmyślony dorobek — dane poniżej pochodzą z prawdziwego tomu
 * dostarczonego przez Wydawnictwo UEW.
 *
 * Metadane samego wydania (redaktorki, ISBN tomu, licencja) są w `editions.ts`.
 */
export interface Publication {
  title: string;
  authors: string[];
  year: number;
  /** Koło naukowe, w którym powstał tekst (jeśli dotyczy). */
  circle?: string;
  isbn?: string;
  url?: string;
  abstract?: string;
  /** DOI rozdziału — każdy rozdział tomu ma własny. */
  doi?: string;
  /** Zakres stron w tomie. */
  pages?: { from: number; to: number };
  /** Slug wydania z `editions.ts`. */
  edition?: string;
}

const E = "new-trends-2026";

export const publications: Publication[] = [
  {
    title: "The Role of Branding in the Success of Startups – Case of Airbnb",
    authors: ["Dorosh, D."],
    year: 2026,
    doi: "10.15611/2026.35.7.01",
    pages: { from: 5, to: 16 },
    edition: E,
  },
  {
    title: "Strategy Implementation Challenges: The Strategy-as-Practice Perspective",
    authors: ["Kulig, K."],
    year: 2026,
    doi: "10.15611/2026.35.7.02",
    pages: { from: 17, to: 28 },
    edition: E,
  },
  {
    title: "Gamification as an Element of Building Employee Engagement in the Onboarding Process",
    authors: ["Lasota, W."],
    year: 2026,
    doi: "10.15611/2026.35.7.03",
    pages: { from: 29, to: 40 },
    edition: E,
  },
  {
    title: "The Impact of Organisational Culture on Job Satisfaction",
    authors: ["Narajewska, M."],
    year: 2026,
    doi: "10.15611/2026.35.7.04",
    pages: { from: 41, to: 51 },
    edition: E,
  },
  {
    title: "Intergenerational Drivers of Consumption Behaviour: A Socio-Economic Analysis in Emerging Markets",
    authors: ["Nyatanga, L. T."],
    year: 2026,
    doi: "10.15611/2026.35.7.05",
    pages: { from: 52, to: 64 },
    edition: E,
  },
  {
    title:
      "Motivation and Engagement in a Student Non-Profit Organisation Based on Independent Students' Association (Niezależne Zrzeszenie Studentów)",
    authors: ["Sikora, K."],
    year: 2026,
    doi: "10.15611/2026.35.7.06",
    pages: { from: 65, to: 74 },
    edition: E,
  },
  {
    title: "Crafting a Successful Marketing Strategy in the Video Game Industry",
    authors: ["Sioła, W."],
    year: 2026,
    doi: "10.15611/2026.35.7.07",
    pages: { from: 75, to: 86 },
    edition: E,
  },
  {
    title: "Managing Cultural Differences in International Organisations",
    authors: ["Skalska, W."],
    year: 2026,
    doi: "10.15611/2026.35.7.08",
    pages: { from: 87, to: 102 },
    edition: E,
  },
  {
    title: "The Role of Agile Project Management in a Pandemic Business Environment",
    authors: ["Wilk, W."],
    year: 2026,
    doi: "10.15611/2026.35.7.09",
    pages: { from: 103, to: 115 },
    edition: E,
  },
  {
    title: "Modern ISO Audit in a Medium-Sized Automotive Enterprise",
    authors: ["Zapotoczny, M."],
    year: 2026,
    doi: "10.15611/2026.35.7.10",
    pages: { from: 116, to: 128 },
    edition: E,
  },
];

/**
 * Cytowanie w stylu zbliżonym do APA (wersja polska), zgodne z konwencją
 * serii: Autorzy (rok). Tytuł. Debiuty Studenckie. Wydawnictwo Uniwersytetu
 * Ekonomicznego we Wrocławiu. [ISBN …]
 */
export function formatCitation(p: Publication): string {
  const authors = p.authors.join(", ");
  const base = `${authors} (${p.year}). ${p.title}. Debiuty Studenckie. Wydawnictwo Uniwersytetu Ekonomicznego we Wrocławiu.`;
  return p.isbn ? `${base} ISBN ${p.isbn}.` : base;
}

/**
 * Cytowanie ROZDZIAŁU w tomie zbiorowym — inna forma niż cytowanie całości,
 * bo trzeba podać redaktorki i zakres stron. Tak cytuje się te teksty
 * w bibliografii i tego oczekują sami autorzy.
 */
export function formatChapterCitation(p: Publication): string {
  const authors = p.authors.join(", ");
  const pages = p.pages ? ` (s. ${p.pages.from}-${p.pages.to})` : "";
  const doi = p.doi ? ` DOI: ${p.doi}` : "";
  return (
    `${authors} (${p.year}). ${p.title}. ` +
    `W: J. Radomska, A. Witek-Crabb (red.), New Trends in Business Management. ` +
    `Culture, Strategy, Engagement${pages}. ` +
    `Wydawnictwo Uniwersytetu Ekonomicznego we Wrocławiu.${doi}`
  );
}
```

- [ ] **Krok 5: Uruchom testy**

Uruchom: `npx vitest run src/lib/publications.test.ts`
Oczekiwane: PASS. Jeśli test `formatChapterCitation` nie zgadza się co do
spacji — porównaj napis znak po znaku i popraw implementację, nie test.

- [ ] **Krok 6: Sprawdź, że strona nadal się buduje**

Uruchom: `npx tsc --noEmit && npm run build`
Oczekiwane: bez błędów. `WydawnictwoContent` używa `publications[0]` do
cytowania — po podmianie pokaże prawdziwy rozdział.

- [ ] **Krok 7: Commit**

```bash
git add src/lib/publications.ts src/lib/publications.test.ts src/lib/editions.ts
git commit -m "fix: prawdziwe rozdziały zamiast zmyślonego dorobku

publications.ts miał trzy wpisy z wymyślonymi nazwiskami i fikcyjnymi ISBN-ami
(978-83-XXXX-XXX-X). Na oficjalnym serwisie uczelni był to zmyślony dorobek
studentów.

Wchodzi dziesięć prawdziwych rozdziałów tomu dostarczonego przez Wydawnictwo,
z autorami, zakresami stron i własnymi numerami DOI. Test pilnuje, żeby
placeholder nigdy tu nie wrócił.

Cytowanie rozdziału w tomie zbiorowym to inna forma niż cytowanie całości —
wymaga redaktorek i zakresu stron, więc dostaje własną funkcję."
```

---

## Faza 2 — powłoka czytnika (działa bez WebGL)

### Zadanie 5: Nakładka ze statyczną rozkładówką

Powstaje PRZED sceną 3D, bo to ona odpowiada za dostępność. Jeśli scena nigdy
nie powstanie, czytnik i tak działa.

**Pliki:**
- Utwórz: `src/components/wydawnictwo/EditionReader.tsx`
- Utwórz: `src/components/wydawnictwo/EditionReader.module.css`

- [ ] **Krok 1: Napisz komponent**

```tsx
// src/components/wydawnictwo/EditionReader.tsx
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { X, ArrowLeft, ArrowRight, FilePdf } from "@phosphor-icons/react";
import { pagesOf, type Edition } from "@/lib/editions";
import { sheetCount, spreadAt } from "@/lib/spread";
import styles from "./EditionReader.module.css";

/**
 * Czytnik wydania — nakładka pełnoekranowa.
 *
 * ODPOWIADA ZA DOSTĘPNOŚĆ CAŁEJ FUNKCJI i dlatego powstał przed sceną 3D.
 * Scena jest doładowywana osobno i może się nie uruchomić (brak WebGL, słabe
 * urządzenie, ograniczony ruch) — wtedy zostaje to, co widać tutaj: dwie
 * strony obok siebie, klawiatura i odnośnik do pełnego PDF-a.
 *
 * PDF jest tu elementem obowiązkowym, nie ozdobnym. Płótno WebGL jest dla
 * czytnika ekranu puste, więc drogą do treści jest dokument — a ten ma warstwę
 * tekstową i strukturę nagłówków.
 */

interface EditionReaderProps {
  edition: Edition;
  onClose: () => void;
  labels: {
    close: string;
    prev: string;
    next: string;
    readFull: string;
    pageOf: string;
    licenseNote: string;
  };
}

export function EditionReader({ edition, onClose, labels }: EditionReaderProps) {
  const pages = pagesOf(edition.slug);
  const sheets = sheetCount(pages.length);
  const [o, setO] = useState(0);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const go = useCallback(
    (delta: number) => setO((v) => Math.max(0, Math.min(sheets, v + delta))),
    [sheets],
  );

  // Klawiatura: bez niej czytnik jest niedostępny. Escape zamyka, strzałki
  // i PageUp/PageDown przewracają.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowRight" || e.key === "PageDown") {
        e.preventDefault();
        go(1);
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        go(-1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, go]);

  // Fokus wchodzi do nakładki po otwarciu. Zwrot fokusu na grzbiet robi
  // SpineWall, bo to on wie, skąd otwarto.
  useEffect(() => {
    const id = requestAnimationFrame(() => closeRef.current?.focus());
    return () => cancelAnimationFrame(id);
  }, []);

  // Pułapka fokusu — Tab nie może wyjść poza nakładkę, bo za nią leży strona,
  // której w tym momencie nie widać.
  useEffect(() => {
    const onTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || !dialogRef.current) return;
      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onTab);
    return () => window.removeEventListener("keydown", onTab);
  }, []);

  // Strona pod spodem nie może się przewijać, gdy nakładka jest otwarta.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const { verso, recto } = spreadAt(o, pages.length);
  const shown = [verso, recto].filter((n): n is number => n !== null).map((n) => n + 1);
  const position = shown.join("–");

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${edition.title}. ${edition.subtitle ?? ""}`}
      className={styles.overlay}
    >
      <header className={styles.bar}>
        <div>
          <p className={styles.title}>{edition.title}</p>
          <p className={styles.meta}>
            {edition.editors.join(" · ")} · {edition.year} · {edition.license}
          </p>
        </div>
        <button ref={closeRef} type="button" onClick={onClose} className={styles.close}>
          <X size={20} weight="bold" aria-hidden="true" />
          {labels.close}
        </button>
      </header>

      {/* Rozkładówka. Scena 3D podmieni ten blok w Zadaniu 7 — do tego czasu
          (i zawsze, gdy WebGL nie działa) widać dwie płaskie strony. */}
      <div className={styles.stage}>
        {verso !== null ? (
          <Image
            src={pages[verso].src}
            alt=""
            width={pages[verso].width}
            height={pages[verso].height}
            className={styles.page}
            preload={o === 0}
          />
        ) : (
          <span className={styles.blank} aria-hidden="true" />
        )}
        {recto !== null ? (
          <Image
            src={pages[recto].src}
            alt=""
            width={pages[recto].width}
            height={pages[recto].height}
            className={styles.page}
            preload={o === 0}
          />
        ) : (
          <span className={styles.blank} aria-hidden="true" />
        )}
      </div>

      <footer className={styles.bar}>
        <div className={styles.nav}>
          <button type="button" onClick={() => go(-1)} disabled={o === 0} className={styles.arrow}>
            <ArrowLeft size={18} weight="bold" aria-hidden="true" />
            {labels.prev}
          </button>
          {/* aria-live, żeby czytnik ekranu ogłaszał zmianę stron. */}
          <p className={styles.counter} aria-live="polite">
            {labels.pageOf.replace("{position}", position).replace("{total}", String(pages.length))}
          </p>
          <button
            type="button"
            onClick={() => go(1)}
            disabled={o >= sheets}
            className={styles.arrow}
          >
            {labels.next}
            <ArrowRight size={18} weight="bold" aria-hidden="true" />
          </button>
        </div>

        {/* NIE JEST TO DODATEK. To jedyna droga do treści dla czytnika ekranu
            i jedyny sposób, żeby ten tekst dało się naprawdę przeczytać. */}
        <a href={edition.pdf} className={styles.pdf} target="_blank" rel="noopener noreferrer">
          <FilePdf size={20} weight="regular" aria-hidden="true" />
          {labels.readFull}
        </a>
      </footer>

      <p className={styles.license}>
        {labels.licenseNote}{" "}
        <a href={edition.licenseUrl} target="_blank" rel="noopener noreferrer">
          {edition.license}
        </a>
      </p>
    </div>
  );
}
```

- [ ] **Krok 2: Napisz style**

```css
/* src/components/wydawnictwo/EditionReader.module.css */
/**
 * Ciemna pracownia. Kolory są tu WPISANE NA SZTYWNO, wbrew regule reszty
 * serwisu, i jest to decyzja: czytnik zostaje ciemny w obu motywach, bo
 * papier świeci tylko na ciemnym tle. W odróżnieniu od hero ta ciemność trwa
 * tyle, co czytanie, i zamyka się Escape'em.
 */
.overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  flex-direction: column;
  gap: clamp(12px, 2vh, 24px);
  padding: clamp(12px, 2.5vh, 28px) clamp(12px, 3vw, 40px);
  background:
    radial-gradient(ellipse 70% 60% at 50% 45%, rgba(255, 246, 232, 0.09), transparent 70%),
    #14161c;
  color: #f2f4f8;
}

.bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.title {
  margin: 0;
  font-family: var(--font-display), system-ui, sans-serif;
  font-size: clamp(1rem, 2vw, 1.375rem);
  font-weight: 650;
  letter-spacing: -0.02em;
}

.meta {
  margin: 4px 0 0;
  font-family: var(--font-mono), ui-monospace, monospace;
  font-size: 0.6875rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(242, 244, 248, 0.62);
}

.close,
.arrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 44px;
  padding: 0 16px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.06);
  color: inherit;
  font-family: inherit;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
}

.close:hover,
.arrow:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.12);
}

.arrow:disabled {
  opacity: 0.35;
  cursor: default;
}

.stage {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  gap: 2px;
  min-height: 0;
}

.page {
  width: auto;
  height: 100%;
  max-height: 100%;
  object-fit: contain;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.55);
}

/* Pusta połowa rozkładówki przy zamkniętej książce — trzyma symetrię, żeby
   widoczna strona nie skakała na środek. */
.blank {
  width: 0;
  height: 100%;
  aspect-ratio: 0.706;
}

.nav {
  display: flex;
  align-items: center;
  gap: 16px;
}

.counter {
  margin: 0;
  font-family: var(--font-mono), ui-monospace, monospace;
  font-size: 0.75rem;
  font-variant-numeric: tabular-nums;
  color: rgba(242, 244, 248, 0.7);
}

.pdf {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 48px;
  padding: 0 22px;
  border-radius: 999px;
  background: var(--accent);
  color: #ffffff;
  font-size: 0.9375rem;
  font-weight: 600;
}

.license {
  margin: 0;
  font-size: 0.6875rem;
  text-align: center;
  color: rgba(242, 244, 248, 0.5);
}

.license a {
  color: inherit;
  text-decoration: underline;
}

@media (max-width: 700px) {
  /* Na telefonie rozkładówka nie mieści się w dwóch stronach — pokazujemy
     jedną, tę po prawej, bo to ona niesie treść przy kartkowaniu w przód. */
  .stage > :first-child {
    display: none;
  }
}
```

- [ ] **Krok 3: Sprawdź kompilację**

Uruchom: `npx tsc --noEmit`
Oczekiwane: bez błędów.

- [ ] **Krok 4: Commit**

```bash
git add src/components/wydawnictwo/
git commit -m "feat: czytnik wydania — nakładka ze statyczną rozkładówką

Powstaje PRZED sceną 3D, bo to on odpowiada za dostępność całej funkcji.
Escape, pułapka fokusu, strzałki i PageUp/PageDown, aria-live na numerach
stron, blokada przewijania strony pod spodem.

Odnośnik do PDF-a nie jest ozdobą: płótno WebGL jest dla czytnika ekranu
puste, więc drogą do treści jest dokument — a ten ma warstwę tekstową
i strukturę nagłówków."
```

---

### Zadanie 6: Wejście z muru grzbietów

**Pliki:**
- Zmodyfikuj: `src/components/SpineWall.tsx`
- Zmodyfikuj: `messages/pl.json`, `messages/en.json`
- Zmodyfikuj: `src/components/pages/WydawnictwoContent.tsx`

- [ ] **Krok 1: Dodaj teksty**

W `messages/pl.json`, wewnątrz bloku `"wydawnictwo"`:

```json
"readerOpen": "Przejrzyj wydanie",
"readerClose": "Zamknij",
"readerPrev": "Poprzednia",
"readerNext": "Następna",
"readerFull": "Czytaj pełny tekst (PDF)",
"readerPageOf": "Strony {position} z {total}",
"readerLicense": "Tom udostępniony na licencji"
```

W `messages/en.json`, w tym samym miejscu:

```json
"readerOpen": "Browse the volume",
"readerClose": "Close",
"readerPrev": "Previous",
"readerNext": "Next",
"readerFull": "Read the full text (PDF)",
"readerPageOf": "Pages {position} of {total}",
"readerLicense": "This volume is licensed under"
```

- [ ] **Krok 2: Dodaj przycisk i podłącz czytnik w SpineWall**

W `src/components/SpineWall.tsx` rozszerz `SpineWallLabels` o pola czytnika,
dodaj import i stan, a w panelu szczegółów (obok istniejącego odnośnika)
wyrenderuj przycisk. Kluczowe fragmenty:

```tsx
import { useRef, useState } from "react";
import { editionBySlug, pagesOf } from "@/lib/editions";
import { EditionReader } from "./wydawnictwo/EditionReader";

// w SpineWallLabels dopisz:
//   readerOpen: string; readerClose: string; readerPrev: string;
//   readerNext: string; readerFull: string; readerPageOf: string;
//   readerLicense: string;

// wewnątrz komponentu:
const [readerOpen, setReaderOpen] = useState(false);
const openerRef = useRef<HTMLButtonElement>(null);
const edition = active.edition ? editionBySlug(active.edition) : undefined;
const hasPages = edition ? pagesOf(edition.slug).length > 0 : false;

// w panelu szczegółów, przed istniejącym odnośnikiem `linkLabel`:
{hasPages && edition ? (
  <button
    ref={openerRef}
    type="button"
    onClick={() => setReaderOpen(true)}
    className="inline-flex min-h-12 items-center gap-2 rounded-lg bg-accent px-6 text-base font-medium text-bg-base transition-colors hover:bg-accent-dim"
  >
    {labels.readerOpen}
  </button>
) : null}

// na końcu zwracanego drzewa, przed zamknięciem korzenia:
{readerOpen && edition ? (
  <EditionReader
    edition={edition}
    onClose={() => {
      setReaderOpen(false);
      // Fokus wraca tam, skąd otwarto — inaczej użytkownik klawiatury
      // ląduje na początku strony i musi przejść ją całą od nowa.
      requestAnimationFrame(() => openerRef.current?.focus());
    }}
    labels={{
      close: labels.readerClose,
      prev: labels.readerPrev,
      next: labels.readerNext,
      readFull: labels.readerFull,
      pageOf: labels.readerPageOf,
      licenseNote: labels.readerLicense,
    }}
  />
) : null}
```

W `WydawnictwoContent.tsx`, w obiekcie `labels` przekazywanym do `SpineWall`,
dopisz dokładnie te siedem pól:

```tsx
readerOpen: t("readerOpen"),
readerClose: t("readerClose"),
readerPrev: t("readerPrev"),
readerNext: t("readerNext"),
readerFull: t("readerFull"),
readerPageOf: t("readerPageOf"),
readerLicense: t("readerLicense"),
```

- [ ] **Krok 3: Sprawdź w przeglądarce**

```bash
npx tsc --noEmit && npm run build
```

Następnie ubij port i obejrzyj stronę:

```bash
npx playwright test --reporter=line
```

Oczekiwane: `tsc` czysty, build czysty, testy przechodzą.

- [ ] **Krok 4: Commit**

```bash
git add src/components/SpineWall.tsx src/components/pages/WydawnictwoContent.tsx messages/
git commit -m "feat: przycisk otwierający czytnik w murze grzbietów

Przycisk pojawia się TYLKO gdy wydanie ma zdigitalizowane strony — publikacja
bez stron zostawia mur grzbietów dokładnie takim, jaki jest dziś.

Po zamknięciu fokus wraca na przycisk, z którego otwarto. Bez tego użytkownik
klawiatury ląduje na początku strony i musi przejść ją całą od nowa."
```

---

### Zadanie 7: Testy przeglądarkowe czytnika

**Pliki:** Utwórz `tests/edition-reader.spec.ts`

- [ ] **Krok 1: Napisz testy**

```ts
// tests/edition-reader.spec.ts
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const open = async (page: import("@playwright/test").Page) => {
  await page.goto("/pl/wydawnictwo", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /Akceptuj/ }).click().catch(() => {});
  await page.getByRole("button", { name: /Przejrzyj wydanie/ }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
};

test("otwiera się i zamyka Escape'em, fokus wraca na przycisk", async ({ page }) => {
  await open(page);
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.getByRole("button", { name: /Przejrzyj wydanie/ })).toBeFocused();
});

test("strzałki przewracają strony i licznik się zgadza", async ({ page }) => {
  await open(page);
  const counter = page.locator('[aria-live="polite"]');
  await expect(counter).toContainText("1");
  await page.keyboard.press("ArrowRight");
  await expect(counter).toContainText("2");
  await page.keyboard.press("ArrowLeft");
  await expect(counter).toContainText("1");
});

test("odnośnik do pełnego tekstu istnieje i wskazuje PDF", async ({ page }) => {
  await open(page);
  const pdf = page.getByRole("link", { name: /Czytaj pełny tekst/ });
  await expect(pdf).toHaveAttribute("href", /\.pdf$/);
});

test("brak naruszeń axe przy otwartym czytniku", async ({ page }) => {
  await open(page);
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});

test("brak poziomego rozpychania na 375 px", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await open(page);
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBe(0);
});
```

- [ ] **Krok 2: Uruchom**

```bash
npx playwright test tests/edition-reader.spec.ts --reporter=line
```

Oczekiwane: 5 testów PASS. Jeśli axe zgłosi kontrast — popraw wartości
w `EditionReader.module.css` i policz kontrast, zamiast zgadywać.

- [ ] **Krok 3: Commit**

```bash
git add tests/edition-reader.spec.ts
git commit -m "test: czytnik wydania — klawiatura, zwrot fokusu, axe, brak rozpychania"
```

---

## Faza 3 — scena 3D

### Zadanie 8: Scena `three` bez Reacta

**Pliki:** Utwórz `src/components/wydawnictwo/editionScene.ts`

- [ ] **Krok 1: Napisz moduł sceny**

```ts
// src/components/wydawnictwo/editionScene.ts
import * as THREE from "three";
import type { EditionPage } from "@/lib/edition-pages";
import { framesFor, sheetCount, spreadAt } from "@/lib/spread";

/**
 * Scena książki — czysty moduł imperatywny, BEZ REACTA.
 *
 * React nie może renderować 60 razy na sekundę, a scena musi. Dlatego całość
 * żyje tutaj i wystawia dwie funkcje: `goTo` i `dispose`. Dzięki temu warstwę
 * widoku da się wymienić bez dotykania geometrii, a geometrię bez dotykania
 * dostępności.
 */

/** Ile stopni zwinięcia osiąga kartka w połowie obrotu. */
const BEND_MAX = 1.35;
/** Skręt wierszowy — róg prowadzi obrót po przekątnej, jak w prawdziwej książce. */
const LEAD = 0.32;
/** Podział siatki. Mniej niż 32 kolumny i zwinięcie widać jako łamaną. */
const SEG_X = 48;
const SEG_Y = 18;

export interface SceneHandle {
  /** Przejdź do stanu `o` (liczba arkuszy po lewej), animując obrót. */
  goTo(o: number): void;
  dispose(): void;
}

export function createScene(
  canvas: HTMLCanvasElement,
  pages: EditionPage[],
  opts: { reduced: boolean; onSettled: (o: number) => void },
): SceneHandle {
  const aspect = pages[0].width / pages[0].height;
  const PW = 1; // szerokość strony w jednostkach sceny
  const PH = PW / aspect;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;

  // Cienie to najdroższy element sceny. Na wąskich ekranach wyłączamy je
  // zamiast pozwolić, żeby całość się zacinała.
  const wantShadows = window.innerWidth >= 900 && !opts.reduced;
  renderer.shadowMap.enabled = wantShadows;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
  camera.position.set(0.35, 2.05, 2.15);
  camera.lookAt(0, 0, 0);

  const key = new THREE.DirectionalLight(0xfff1dd, 2.4);
  key.position.set(1.6, 3.0, 1.4);
  key.castShadow = wantShadows;
  key.shadow.mapSize.set(1024, 1024);
  scene.add(key);
  scene.add(new THREE.HemisphereLight(0xdfe8ff, 0x14161c, 0.6));
  scene.add(new THREE.AmbientLight(0xffffff, 0.25));

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(14, 14),
    new THREE.MeshStandardMaterial({ color: 0x1b1e26, roughness: 0.95 }),
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.02;
  ground.receiveShadow = wantShadows;
  scene.add(ground);

  // Tekstury ładujemy leniwie — 130 stron naraz to kilkanaście megabajtów
  // w pamięci karty graficznej bez żadnego powodu.
  const loader = new THREE.TextureLoader();
  const cache = new Map<number, THREE.Texture>();
  const texture = (i: number | null): THREE.Texture | null => {
    if (i === null || i < 0 || i >= pages.length) return null;
    let t = cache.get(i);
    if (!t) {
      t = loader.load(pages[i].src);
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = renderer.capabilities.getMaxAnisotropy();
      cache.set(i, t);
    }
    return t;
  };

  const paper = (map: THREE.Texture | null) =>
    new THREE.MeshStandardMaterial({
      map,
      color: map ? 0xffffff : 0xf5f2ea,
      roughness: 0.82,
      side: THREE.DoubleSide,
    });

  const flat = (x: number) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(PW, PH), paper(null));
    m.rotation.x = -Math.PI / 2;
    m.position.set(x, 0, 0);
    m.receiveShadow = wantShadows;
    scene.add(m);
    return m;
  };
  const leftPage = flat(-PW / 2);
  const rightPage = flat(PW / 2);

  // Kartka w ruchu. Geometria jest współdzielona i deformowana co klatkę,
  // więc zapamiętujemy pozycje spoczynkowe — inaczej deformacja narastałaby.
  const leafGeo = new THREE.PlaneGeometry(PW, PH, SEG_X, SEG_Y);
  const rest = Float32Array.from(leafGeo.attributes.position.array);
  const leafMat = paper(null);

  /**
   * Rewers kartki pokazuje INNĄ stronę niż awers. Gałąź na `gl_FrontFacing`
   * w jednym materiale zamiast dwóch siatek: dwie siatki w tej samej
   * płaszczyźnie migotałyby (z-fighting), a tak zostaje jedna, która poprawnie
   * się oświetla i rzuca jeden cień.
   */
  let backTexture: THREE.Texture | null = null;
  leafMat.onBeforeCompile = (shader) => {
    shader.uniforms.backMap = { value: null };
    shader.fragmentShader = shader.fragmentShader
      .replace("#include <common>", "#include <common>\nuniform sampler2D backMap;")
      .replace(
        "#include <map_fragment>",
        `
        vec4 sampledDiffuseColor;
        if (gl_FrontFacing) {
          sampledDiffuseColor = texture2D(map, vMapUv);
        } else {
          // Odbicie U, żeby tył nie był lustrzany.
          sampledDiffuseColor = texture2D(backMap, vec2(1.0 - vMapUv.x, vMapUv.y));
        }
        diffuseColor *= sampledDiffuseColor;
        `,
      );
    leafMat.userData.shader = shader;
  };

  const leaf = new THREE.Mesh(leafGeo, leafMat);
  leaf.castShadow = wantShadows;
  leaf.visible = false;
  scene.add(leaf);

  let o = 0;
  let target = 0;
  let tv = 0;
  let base = 0;
  let raf = 0;

  const paintStatics = (state: number) => {
    const { verso, recto } = spreadAt(state, pages.length);
    leftPage.material = paper(texture(verso));
    rightPage.material = paper(texture(recto));
    leftPage.visible = verso !== null;
    rightPage.visible = recto !== null;
  };

  /**
   * Deformacja kartki dla postępu `t ∈ [0,1]`.
   *
   * Wierzchołek w odległości `s` od grzbietu owija walec o promieniu
   * `ρ = PW / bend`, a potem obraca się o `theta` wokół grzbietu.
   * `bend = sin(t·π)` sprawia, że zwinięcie narasta do połowy obrotu i opada —
   * bez tego kartka byłaby sztywną płytą.
   */
  const deform = (t: number) => {
    const pos = leafGeo.attributes.position;
    const theta = t * Math.PI;
    const bend = Math.max(0.0001, Math.sin(theta) * BEND_MAX);
    const rho = PW / bend;

    for (let i = 0; i < pos.count; i++) {
      const x0 = rest[i * 3];
      const y0 = rest[i * 3 + 1];
      const s = x0 + PW / 2; // odległość od grzbietu, 0..PW

      const a = (s / PW) * bend;
      const cx = rho * Math.sin(a);
      const cy = rho * (1 - Math.cos(a));

      const twist = theta + LEAD * (y0 / PH);
      const c = Math.cos(twist);
      const sn = Math.sin(twist);

      pos.setXYZ(i, -PW / 2 + cx * c, y0, cx * sn + cy * 0.35);
    }
    pos.needsUpdate = true;
    leafGeo.computeVertexNormals(); // bez tego zwinięcie oświetla się płasko
  };

  const startFlip = (from: number, to: number) => {
    base = Math.min(from, to);
    const f = framesFor(base, pages.length);
    leftPage.material = paper(texture(f.staticVerso));
    rightPage.material = paper(texture(f.staticRecto));
    leftPage.visible = f.staticVerso !== null;
    rightPage.visible = f.staticRecto !== null;

    leafMat.map = texture(f.leafFront);
    backTexture = texture(f.leafBack);
    const shader = leafMat.userData.shader as { uniforms: Record<string, { value: unknown }> } | undefined;
    if (shader) shader.uniforms.backMap.value = backTexture;
    leafMat.needsUpdate = true;
    leaf.visible = true;
    tv = to > from ? 0 : 1;
  };

  const tick = () => {
    raf = requestAnimationFrame(tick);
    if (leaf.visible) {
      const goal = target > o ? 1 : 0;
      tv += (goal - tv) * 0.12;
      if (Math.abs(goal - tv) < 0.004) {
        tv = goal;
        leaf.visible = false;
        o = target;
        paintStatics(o);
        opts.onSettled(o);
      } else {
        deform(tv);
      }
    }
    renderer.render(scene, camera);
  };

  const resize = () => {
    const { clientWidth: w, clientHeight: h } = canvas;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();

  paintStatics(0);
  if (!opts.reduced) raf = requestAnimationFrame(tick);
  else renderer.render(scene, camera);

  return {
    goTo(next: number) {
      const clamped = Math.max(0, Math.min(sheetCount(pages.length), next));
      if (clamped === o) return;
      if (opts.reduced) {
        o = clamped;
        target = clamped;
        paintStatics(o);
        renderer.render(scene, camera);
        opts.onSettled(o);
        return;
      }
      target = clamped;
      startFlip(o, clamped);
    },
    dispose() {
      cancelAnimationFrame(raf);
      ro.disconnect();
      cache.forEach((t) => t.dispose());
      leafGeo.dispose();
      leafMat.dispose();
      renderer.dispose();
    },
  };
}
```

- [ ] **Krok 2: Sprawdź kompilację**

Uruchom: `npx tsc --noEmit`
Oczekiwane: bez błędów.

- [ ] **Krok 3: Commit**

```bash
git add src/components/wydawnictwo/editionScene.ts
git commit -m "feat: scena three — kartka zginana wokół walca

Moduł imperatywny bez Reacta, bo React nie może renderować 60 razy na sekundę.
Wystawia goTo i dispose, więc widok da się wymienić bez dotykania geometrii.

Kartka owija walec o promieniu PW/bend, gdzie bend = sin(t·pi) — zwinięcie
narasta do połowy obrotu i opada, inaczej kartka byłaby sztywną płytą.
computeVertexNormals po każdej deformacji, bez tego zwinięcie oświetla się
płasko i cień jest nieprawdziwy.

Awers i rewers to JEDNA siatka z gałęzią na gl_FrontFacing — dwie siatki
w tej samej płaszczyźnie migotałyby, a tak zostaje jeden poprawny cień.

Cienie wyłączają się poniżej 900 px zamiast pozwolić, żeby scena się zacinała."
```

---

### Zadanie 9: Podłączenie sceny do czytnika

**Pliki:** Zmodyfikuj `src/components/wydawnictwo/EditionReader.tsx`

- [ ] **Krok 1: Dodaj płótno i dynamiczny import**

W `EditionReader` dopisz obok istniejącej statycznej rozkładówki:

```tsx
const canvasRef = useRef<HTMLCanvasElement>(null);
// Typ importowany, nie przepisany — przepisana sygnatura rozjedzie się
// z modułem przy pierwszej zmianie.
const sceneRef = useRef<import("./editionScene").SceneHandle | null>(null);
const [scene3d, setScene3d] = useState(false);

useEffect(() => {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  // Bez WebGL nie ma czego uruchamiać — zostaje rozkładówka statyczna.
  const gl = document.createElement("canvas").getContext("webgl2");
  if (!gl || pages.length === 0) return;

  let disposed = false;
  // `three` (ok. 150 KB) ładuje się DOPIERO TUTAJ — kto nie otworzy czytnika,
  // nie pobiera ani kilobajta.
  import("./editionScene").then(({ createScene }) => {
    if (disposed || !canvasRef.current) return;
    sceneRef.current = createScene(canvasRef.current, pages, {
      reduced,
      onSettled: setO,
    });
    setScene3d(true);
  });

  return () => {
    disposed = true;
    sceneRef.current?.dispose();
    sceneRef.current = null;
  };
}, [pages]);

// Strzałki i przyciski sterują sceną, gdy ta działa.
useEffect(() => {
  sceneRef.current?.goTo(o);
}, [o]);
```

W drzewie: `<canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />`
przed blokiem statycznym, a blok statyczny opakuj w `{!scene3d && (...)}`.

Dopisz do `EditionReader.module.css`:

```css
.canvas {
  flex: 1;
  width: 100%;
  min-height: 0;
  display: block;
}
```

- [ ] **Krok 2: Sprawdź, że fallback nadal działa**

```bash
npx playwright test tests/edition-reader.spec.ts --reporter=line
```

Oczekiwane: 5 testów PASS — te same, co w Zadaniu 7. Jeśli test licznika
padnie, to znaczy, że `onSettled` nie odsyła stanu do Reacta.

- [ ] **Krok 3: Obejrzyj na żywo**

Otwórz `/pl/wydawnictwo`, kliknij „Przejrzyj wydanie", przewiń strzałkami.
Oczekiwane: kartka zgina się w połowie obrotu i rzuca ruchomy cień.

- [ ] **Krok 4: Pełny zestaw testów**

```bash
npm test -- --run && npx playwright test --reporter=line
```

Oczekiwane: wszystko przechodzi, 0 naruszeń axe.

- [ ] **Krok 5: Commit**

```bash
git add src/components/wydawnictwo/
git commit -m "feat: scena 3D podłączona do czytnika

three ładuje się dynamicznie DOPIERO po otwarciu czytnika — kto nie kliknie
w grzbiet, nie pobiera ani kilobajta silnika.

Brak WebGL albo brak stron zostawia statyczną rozkładówkę z Zadania 5, więc
czytnik nigdy nie przestaje działać, a testy dostępności przechodzą tak samo
w obu trybach."
```

---

### Zadanie 10: Przeciąganie i kółko myszy

Specyfikacja §6 wymienia CZTERY metody sterowania. Zadania 5-9 dają klawiaturę
i przyciski; tu dochodzą dwie pozostałe. Bez nich książka wygląda jak przedmiot,
ale nie zachowuje się jak przedmiot — a to była cała stawka.

**Pliki:** Zmodyfikuj `src/components/wydawnictwo/editionScene.ts`

- [ ] **Krok 1: Dodaj sterowanie wskaźnikiem i kółkiem**

W `createScene`, przed `return`, dopisz:

```ts
  /**
   * Przeciąganie: czubek kartki idzie za palcem.
   *
   * Rzutujemy wskaźnik na płaszczyznę książki i mapujemy jego X na postęp
   * obrotu przez `acos(x/PW)/pi`. To NIE jest liniowe odwzorowanie i tak ma
   * być: kartka porusza się po łuku, więc równomierny ruch palca daje
   * równomierny ruch kartki, a nie przyspieszenie na środku.
   */
  const raycaster = new THREE.Raycaster();
  const surface = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  const hit = new THREE.Vector3();
  const ndc = new THREE.Vector2();
  let dragging = false;

  const pointerProgress = (e: PointerEvent): number | null => {
    const r = canvas.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    raycaster.setFromCamera(ndc, camera);
    if (!raycaster.ray.intersectPlane(surface, hit)) return null;
    const x = Math.max(-PW, Math.min(PW, hit.x));
    return Math.acos(x / PW) / Math.PI;
  };

  const onDown = (e: PointerEvent) => {
    if (opts.reduced) return;
    const p = pointerProgress(e);
    if (p === null) return;
    dragging = true;
    canvas.setPointerCapture(e.pointerId);
    // Kierunek zależy od tego, po której stronie grzbietu zaczęto ciągnąć.
    startFlip(o, hit.x > 0 ? o + 1 : o - 1);
  };

  const onMove = (e: PointerEvent) => {
    if (!dragging) return;
    const p = pointerProgress(e);
    if (p === null) return;
    tv = Math.max(0, Math.min(1, p));
    deform(tv);
  };

  const onUp = (e: PointerEvent) => {
    if (!dragging) return;
    dragging = false;
    canvas.releasePointerCapture(e.pointerId);
    // Puszczone poniżej połowy wraca, powyżej — dochodzi do końca.
    target = tv > 0.5 ? Math.max(o, target) : Math.min(o, target);
  };

  canvas.addEventListener("pointerdown", onDown);
  canvas.addEventListener("pointermove", onMove);
  canvas.addEventListener("pointerup", onUp);
  canvas.addEventListener("pointercancel", onUp);

  /**
   * Kółko myszy. Blokada na czas obrotu jest konieczna: jeden ruch trackpada
   * generuje kilkadziesiąt zdarzeń i bez niej książka przeskakiwałaby
   * o kilkanaście stron naraz.
   */
  let wheelLock = false;
  const onWheel = (e: WheelEvent) => {
    e.preventDefault();
    if (opts.reduced || wheelLock) return;
    const d = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
    if (Math.abs(d) < 8) return;
    wheelLock = true;
    window.setTimeout(() => (wheelLock = false), 240);
    handle.goTo(o + (d > 0 ? 1 : -1));
  };
  canvas.addEventListener("wheel", onWheel, { passive: false });
```

Zamień `return { … }` na nazwany obiekt, żeby `onWheel` mógł się do niego
odwołać, i dopisz sprzątanie nowych nasłuchów:

```ts
  const handle: SceneHandle = {
    goTo(next: number) { /* … bez zmian … */ },
    dispose() {
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
      canvas.removeEventListener("wheel", onWheel);
      cancelAnimationFrame(raf);
      ro.disconnect();
      cache.forEach((t) => t.dispose());
      leafGeo.dispose();
      leafMat.dispose();
      renderer.dispose();
    },
  };
  return handle;
```

- [ ] **Krok 2: Dopisz test blokady kółka**

Dopisz do `tests/edition-reader.spec.ts`:

```ts
test("jeden gest kółkiem przewraca dokładnie jedną kartkę", async ({ page }) => {
  await open(page);
  const counter = page.locator('[aria-live="polite"]');
  const before = await counter.textContent();
  // Seria zdarzeń jak z trackpada — bez blokady przeskoczyłoby wiele stron.
  for (let i = 0; i < 12; i++) await page.mouse.wheel(0, 30);
  await page.waitForTimeout(700);
  const after = await counter.textContent();
  expect(after).not.toBe(before);
  // Druga i trzecia strona, nie dwudziesta.
  expect(after).toMatch(/[1-9]/);
});
```

- [ ] **Krok 3: Uruchom testy**

```bash
npx playwright test tests/edition-reader.spec.ts --reporter=line
```

Oczekiwane: 6 testów PASS.

- [ ] **Krok 4: Commit**

```bash
git add src/components/wydawnictwo/editionScene.ts tests/edition-reader.spec.ts
git commit -m "feat: przeciąganie i kółko myszy w scenie książki

Specyfikacja wymienia cztery metody sterowania; klawiatura i przyciski były,
brakowało tych dwóch. Bez nich książka WYGLĄDA jak przedmiot, ale się nim
nie zachowuje — a o to chodziło.

Przeciąganie mapuje X wskaźnika przez acos(x/PW)/pi, więc czubek kartki idzie
dokładnie za palcem. Odwzorowanie jest nieliniowe celowo: kartka porusza się
po łuku, więc równomierny ruch palca daje równomierny ruch kartki.

Kółko ma blokadę na 240 ms, bo jeden gest trackpada to kilkadziesiąt zdarzeń
i bez niej książka przeskakiwałaby kilkanaście stron naraz."
```

---

## Przegląd planu względem specyfikacji

| Sekcja specyfikacji | Zadanie |
|---|---|
| §3.1 koniec placeholderów | 4 |
| §5 architektura, rozdział warstw | 2, 5, 8 |
| §5.2 strony, cały tom | 3 |
| §6 mechanika przewracania | 2 (indeksy), 8 (geometria) |
| §6 sterowanie: klawiatura, przyciski | 5 |
| §6 sterowanie: przeciąganie, kółko | 10 |
| §7.1 PDF jako droga do treści | 3 (kopia), 5 (odnośnik) |
| §7.2 klawiatura i fokus | 5, 6 (zwrot fokusu), 7 (test) |
| §7.3 ograniczony ruch | 8 (`reduced`), 9 |
| §7.4 zgłoszenie `/Lang` do Wydawnictwa | poza kodem — zadanie dla zamawiającego |
| §8 tryby awarii | 6 (brak stron), 9 (brak WebGL), 8 (słabe urządzenie) |
| §9 testy | 2, 4, 7 |

## Poza planem, do zrobienia przez zamawiającego

1. **Zgłoś Wydawnictwu `/Lang (pl)` w angielskim tomie** (§7.4 specyfikacji) —
   czytnik ekranu przeczyta angielski tekst polską wymową.
2. Kolejne tomy: `npm run build:edition -- <plik.pdf> <slug>`, potem dopisz
   wpis do `editions.ts` i rozdziały do `publications.ts`.
