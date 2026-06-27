# Kalkulator średniej + sylabus — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build `/kalkulator-sredniej` — a browser-only tool where a student picks kierunek → stopień → rok, gets the term's courses (with ECTS) auto-loaded, enters grades, and sees the ECTS-weighted average with a mechanically "settling" result and ECTS context.

**Architecture:** Pure calculation logic (`src/lib/average.ts`) and curated data (`src/lib/programs.ts`) are framework-free and unit-tested with Vitest. UI is a single client `*Content` component (matching the project's `src/components/pages/*Content.tsx` pattern) plus a small animated `AverageResult` component. The page route mirrors existing pages (`PageHero` + `*Content` + next-intl namespace). No backend; state persists in `localStorage`.

**Tech Stack:** Next.js 16 (App Router, `[locale]`), next-intl, Tailwind v4 tokens, `motion/react`, `@phosphor-icons/react`, Vitest (newly added, pure-logic only).

**Conventions confirmed from the codebase:**
- Page: `src/app/[locale]/<slug>/page.tsx` → `generateMetadata` via `getTranslations` + `ogMeta`, body = `PageHero` + `<XContent />`.
- Content components live in `src/components/pages/`, are `"use client"`, use `useTranslations("namespace")`, `motion/react` with `useReducedMotion`, and Tailwind token classes (`text-ink-primary`, `bg-bg-surface`, `border-border-subtle`, `text-accent`, `bg-accent-glow`, `font-display`, `font-mono`, `section-padding`).
- i18n strings: per-page namespace in `messages/pl.json` and `messages/en.json`.
- Internal links use `import { Link } from "@/i18n/navigation"`.
- Mono font utility is `font-mono` (maps to `--font-jbm`).

---

## File Structure

| File | Responsibility |
|------|----------------|
| `vitest.config.mts` (create) | Minimal Vitest config (node env, `src/**/*.test.ts`). |
| `package.json` (modify) | Add `"test": "vitest run"` + `"test:watch": "vitest"` + devDep `vitest`. |
| `src/lib/average.ts` (create) | Pure ECTS-weighted average + ECTS totals. Zero deps. |
| `src/lib/average.test.ts` (create) | Unit tests for `computeAverage`. |
| `src/lib/programs.ts` (create) | Curated data "socket": program → degree → year → term → courses; selector `getCoursesFor`. |
| `src/lib/programs.test.ts` (create) | Data-shape validation + `getCoursesFor`. |
| `src/components/pages/kalkulator/AverageResult.tsx` (create) | Presentational animated result (digit "settle", `aria-live`). |
| `src/components/pages/KalkulatorSredniejContent.tsx` (create) | Orchestrator: pickers, grade table, manual rows, `localStorage`, ECTS hint. |
| `messages/pl.json` (modify) | Add `kalkulator` namespace (PL). |
| `messages/en.json` (modify) | Add `kalkulator` namespace (EN). |
| `src/app/[locale]/kalkulator-sredniej/page.tsx` (create) | Route + metadata. |
| `src/components/pages/DlaStudentaContent.tsx` (modify) | Add tool tile linking to the calculator. |
| `src/lib/searchIndex.ts` (modify) | Add the page to site search. |

---

## Task 1: Add Vitest (pure-logic only)

**Files:**
- Modify: `package.json`
- Create: `vitest.config.mts`

> Reference (read first): `node_modules/next/dist/docs/01-app/02-guides/testing/vitest.md`. We install **only** `vitest` (no jsdom/RTL) because Task 1–3 test pure functions; tests are co-located and import via relative paths, so `vite-tsconfig-paths` is unnecessary.

- [ ] **Step 1: Install Vitest**

Run: `npm install -D vitest`
Expected: `vitest` appears in `devDependencies`, install exits 0.

- [ ] **Step 2: Create `vitest.config.mts`**

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["src/**/*.test.ts"],
    environment: "node",
  },
});
```

- [ ] **Step 3: Add test scripts to `package.json`**

In the `"scripts"` block add:

```json
    "test": "vitest run",
    "test:watch": "vitest"
```

- [ ] **Step 4: Verify the runner works (no tests yet)**

Run: `npm test`
Expected: Vitest runs and reports "No test files found" (exit code may be non-zero for "no tests" — that is fine at this point; the next task adds tests).

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json vitest.config.mts
git commit -m "chore: add Vitest for pure-logic unit tests"
```

---

## Task 2: Pure logic — `computeAverage` (TDD)

**Files:**
- Create: `src/lib/average.ts`
- Test: `src/lib/average.test.ts`

API: `computeAverage(courses)` takes courses with `ects` and `grade` (number or `null` when not graded / "zal."). Returns the ECTS-weighted average over graded courses only, plus `gradedEcts` (denominator) and `totalEcts` (all rows).

- [ ] **Step 1: Write the failing test**

`src/lib/average.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { computeAverage, type CourseInput } from "./average";

describe("computeAverage", () => {
  it("returns nulls/zeros for an empty list", () => {
    expect(computeAverage([])).toEqual({ average: null, gradedEcts: 0, totalEcts: 0 });
  });

  it("counts ungraded courses in totalEcts but not in the average", () => {
    const courses: CourseInput[] = [
      { ects: 5, grade: null },
      { ects: 3, grade: null },
    ];
    expect(computeAverage(courses)).toEqual({ average: null, gradedEcts: 0, totalEcts: 8 });
  });

  it("computes a single-course average", () => {
    const r = computeAverage([{ ects: 5, grade: 4 }]);
    expect(r.average).toBeCloseTo(4, 5);
    expect(r.gradedEcts).toBe(5);
    expect(r.totalEcts).toBe(5);
  });

  it("weights grades by ECTS", () => {
    // (3*5 + 5*1) / (5 + 1) = 20 / 6 = 3.3333…
    const r = computeAverage([
      { ects: 5, grade: 3 },
      { ects: 1, grade: 5 },
    ]);
    expect(r.average).toBeCloseTo(3.3333, 3);
    expect(r.gradedEcts).toBe(6);
    expect(r.totalEcts).toBe(6);
  });

  it("mixes graded and ungraded rows correctly", () => {
    // graded: (4*4 + 5*2)/(4+2) = 26/6 = 4.3333; total includes the 3-ECTS ungraded row
    const r = computeAverage([
      { ects: 4, grade: 4 },
      { ects: 2, grade: 5 },
      { ects: 3, grade: null },
    ]);
    expect(r.average).toBeCloseTo(4.3333, 3);
    expect(r.gradedEcts).toBe(6);
    expect(r.totalEcts).toBe(9);
  });

  it("never returns NaN when only ungraded rows have ECTS", () => {
    const r = computeAverage([{ ects: 0, grade: 4 }, { ects: 4, grade: null }]);
    // graded ECTS = 0 → average must be null, not NaN
    expect(r.average).toBeNull();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- average`
Expected: FAIL — cannot resolve `./average` / `computeAverage is not a function`.

- [ ] **Step 3: Write minimal implementation**

`src/lib/average.ts`:

```ts
/**
 * Czysta logika kalkulatora średniej. Bez zależności, bez UI — testowalna w izolacji.
 *
 * Średnia jest WAŻONA punktami ECTS (decyzja: opcja A), liczona wyłącznie po
 * przedmiotach z wpisaną oceną liczbową. Przedmioty bez oceny (w tym „zal.")
 * mają `grade: null` — wchodzą do `totalEcts`, ale nie do średniej.
 */

/** Dopuszczalne oceny w skali UEW. */
export const GRADES = [2, 3, 3.5, 4, 4.5, 5] as const;
export type Grade = (typeof GRADES)[number];

export interface CourseInput {
  ects: number;
  /** Ocena liczbowa lub `null` (nie wpisano / „zal."). */
  grade: number | null;
}

export interface AverageSummary {
  /** Średnia ważona ECTS lub `null`, gdy brak ocenionych przedmiotów. */
  average: number | null;
  /** Suma ECTS przedmiotów z wpisaną oceną (mianownik średniej). */
  gradedEcts: number;
  /** Suma ECTS wszystkich przedmiotów na liście. */
  totalEcts: number;
}

export function computeAverage(courses: CourseInput[]): AverageSummary {
  let weightedSum = 0;
  let gradedEcts = 0;
  let totalEcts = 0;

  for (const c of courses) {
    totalEcts += c.ects;
    if (c.grade !== null) {
      weightedSum += c.grade * c.ects;
      gradedEcts += c.ects;
    }
  }

  return {
    average: gradedEcts > 0 ? weightedSum / gradedEcts : null,
    gradedEcts,
    totalEcts,
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- average`
Expected: PASS (6 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/average.ts src/lib/average.test.ts
git commit -m "feat: ECTS-weighted average pure logic + tests"
```

---

## Task 3: Curated data + selector — `programs.ts` (TDD for the selector)

**Files:**
- Create: `src/lib/programs.ts`
- Test: `src/lib/programs.test.ts`

> The pilot dataset below is illustrative scaffolding. ECTS/course names **must be verified** against the official UEW sylabus before launch — see the `VERIFY` comment. Mikołaj fills the rest later; this is the "socket".

- [ ] **Step 1: Write the failing test**

`src/lib/programs.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { getCoursesFor, programs } from "./programs";

describe("programs data", () => {
  it("has at least one pilot program", () => {
    expect(programs.length).toBeGreaterThanOrEqual(1);
  });

  it("every course has a positive ECTS value", () => {
    for (const p of programs) {
      for (const d of p.degrees) {
        for (const y of d.years) {
          for (const term of y.terms) {
            for (const course of term.courses) {
              expect(course.ects).toBeGreaterThan(0);
              expect(course.name.length).toBeGreaterThan(0);
            }
          }
        }
      }
    }
  });
});

describe("getCoursesFor", () => {
  const first = programs[0];
  const level = first.degrees[0].level;
  const year = first.degrees[0].years[0].year;

  it("flattens all terms of a year into one course list", () => {
    const courses = getCoursesFor(first.id, level, year);
    const expected = first.degrees[0].years[0].terms.flatMap((t) => t.courses);
    expect(courses).toHaveLength(expected.length);
  });

  it("returns an empty array for an unknown selection", () => {
    expect(getCoursesFor("__nope__", "I", 99)).toEqual([]);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- programs`
Expected: FAIL — cannot resolve `./programs`.

- [ ] **Step 3: Write minimal implementation**

`src/lib/programs.ts`:

```ts
/**
 * Kurowane dane kierunków („gniazdo", jak `people.ts`).
 *
 * Struktura: program → stopień → rok → semestr → przedmioty (nazwa + ECTS).
 * Kalkulator wczytuje przedmioty wybranego roku, student wpisuje oceny.
 *
 * TU dosypujesz kolejne kierunki. Kierunki nieobecne tutaj → kalkulator
 * proponuje tryb ręczny.
 *
 * VERIFY: poniższy pilotaż to szkielet z przykładowymi wartościami — przed
 * startem zweryfikuj nazwy przedmiotów i ECTS z oficjalnym sylabusem UEW.
 */

export type DegreeLevel = "I" | "II" | "jednolite";

export interface Course {
  name: string;
  ects: number;
  /** "zal" = zaliczenie bez oceny (liczy się do ECTS, nie do średniej). Domyślnie "ocena". */
  pass?: "ocena" | "zal";
}

export interface Term {
  semester: number;
  courses: Course[];
}

export interface Year {
  year: number;
  terms: Term[];
}

export interface Degree {
  level: DegreeLevel;
  years: Year[];
}

export interface Program {
  id: string;
  name: string;
  degrees: Degree[];
}

export const programs: Program[] = [
  {
    id: "ekonomia",
    name: "Ekonomia",
    degrees: [
      {
        level: "I",
        years: [
          {
            year: 1,
            terms: [
              {
                semester: 1,
                courses: [
                  { name: "Mikroekonomia", ects: 6 },
                  { name: "Matematyka", ects: 5 },
                  { name: "Podstawy zarządzania", ects: 4 },
                  { name: "Wprowadzenie do prawa", ects: 3 },
                  { name: "Technologie informacyjne", ects: 3, pass: "zal" },
                  { name: "Wychowanie fizyczne", ects: 0, pass: "zal" },
                ].filter((c) => c.ects > 0), // WF 0 ECTS pominięty — placeholder reguły
              },
              {
                semester: 2,
                courses: [
                  { name: "Makroekonomia", ects: 6 },
                  { name: "Statystyka opisowa", ects: 5 },
                  { name: "Rachunkowość", ects: 5 },
                  { name: "Mikroekonomia II", ects: 4 },
                  { name: "Język obcy", ects: 2, pass: "zal" },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];

/** Spłaszcza wszystkie semestry danego roku do jednej listy przedmiotów. */
export function getCoursesFor(programId: string, level: DegreeLevel, year: number): Course[] {
  const program = programs.find((p) => p.id === programId);
  const degree = program?.degrees.find((d) => d.level === level);
  const yearEntry = degree?.years.find((y) => y.year === year);
  if (!yearEntry) return [];
  return yearEntry.terms.flatMap((t) => t.courses);
}
```

> Note: the WF `.filter` line documents the "0-ECTS course" rule decision (excluded). Keep it; it makes the rule explicit for future data entry.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- programs`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/programs.ts src/lib/programs.test.ts
git commit -m "feat: curated programs data socket + getCoursesFor selector"
```

---

## Task 4: i18n strings — `kalkulator` namespace

**Files:**
- Modify: `messages/pl.json`
- Modify: `messages/en.json`

- [ ] **Step 1: Add the PL namespace**

Add this top-level key to `messages/pl.json` (alongside the other namespaces; mind the trailing comma on the preceding entry):

```json
  "kalkulator": {
    "metaTitle": "Kalkulator średniej",
    "metaDesc": "Policz średnią ważoną ECTS — wybierz kierunek, rok i stopień, wpisz oceny. Liczone lokalnie, nic nie wysyłamy.",
    "ogLabel": "Narzędzie",
    "eyebrow": "Narzędzie studenckie",
    "title": "Kalkulator średniej",
    "lead": "Wybierz kierunek, stopień i rok — przedmioty z ECTS wczytają się same. Wpisz oceny, a średnia ważona policzy się na bieżąco.",
    "crumbStudent": "Dla studenta",
    "pickerHeading": "Twój program",
    "program": "Kierunek",
    "level": "Stopień",
    "year": "Rok",
    "levelI": "I stopień",
    "levelII": "II stopień",
    "leveljednolite": "Jednolite",
    "yearLabel": "Rok {n}",
    "manualPrompt": "Nie ma Twojego kierunku? Policz w trybie ręcznym.",
    "manualToggle": "Tryb ręczny",
    "tableHeading": "Przedmioty i oceny",
    "colCourse": "Przedmiot",
    "colEcts": "ECTS",
    "colGrade": "Ocena",
    "gradeNone": "—",
    "passLabel": "zal.",
    "addRow": "Dodaj przedmiot",
    "removeRow": "Usuń przedmiot",
    "courseNamePlaceholder": "Nazwa przedmiotu",
    "resultHeading": "Twoja średnia",
    "resultAverage": "Średnia ważona",
    "resultEmpty": "Wpisz oceny, aby zobaczyć średnią",
    "resultEcts": "ECTS z ocenami: {graded} z {total}",
    "announce": "Średnia ważona wynosi {value}",
    "privacy": "Liczone lokalnie w Twojej przeglądarce — żadne dane nie są wysyłane.",
    "reset": "Wyczyść",
    "scholarshipNote": "To narzędzie pomocnicze. Wiążące zasady liczenia średniej i progi stypendialne określa Regulamin studiów UEW."
  }
```

- [ ] **Step 2: Add the EN namespace**

Add the matching key to `messages/en.json`:

```json
  "kalkulator": {
    "metaTitle": "Grade average calculator",
    "metaDesc": "Compute your ECTS-weighted average — pick your programme, level and year, enter grades. Calculated locally, nothing is sent.",
    "ogLabel": "Tool",
    "eyebrow": "Student tool",
    "title": "Grade average calculator",
    "lead": "Pick your programme, level and year — courses with ECTS load automatically. Enter grades and the weighted average updates instantly.",
    "crumbStudent": "For students",
    "pickerHeading": "Your programme",
    "program": "Programme",
    "level": "Level",
    "year": "Year",
    "levelI": "Bachelor",
    "levelII": "Master",
    "leveljednolite": "Long-cycle",
    "yearLabel": "Year {n}",
    "manualPrompt": "Programme not listed? Calculate manually.",
    "manualToggle": "Manual mode",
    "tableHeading": "Courses and grades",
    "colCourse": "Course",
    "colEcts": "ECTS",
    "colGrade": "Grade",
    "gradeNone": "—",
    "passLabel": "pass",
    "addRow": "Add course",
    "removeRow": "Remove course",
    "courseNamePlaceholder": "Course name",
    "resultHeading": "Your average",
    "resultAverage": "Weighted average",
    "resultEmpty": "Enter grades to see your average",
    "resultEcts": "ECTS with grades: {graded} of {total}",
    "announce": "Your weighted average is {value}",
    "privacy": "Calculated locally in your browser — no data is sent anywhere.",
    "reset": "Clear",
    "scholarshipNote": "A helper tool. The binding average rules and scholarship thresholds are set by the UEW Study Regulations."
  }
```

- [ ] **Step 3: Verify JSON validity**

Run: `node -e "require('./messages/pl.json'); require('./messages/en.json'); console.log('ok')"`
Expected: prints `ok` (no JSON parse error).

- [ ] **Step 4: Commit**

```bash
git add messages/pl.json messages/en.json
git commit -m "i18n: add kalkulator namespace (PL/EN)"
```

---

## Task 5: Animated result component — `AverageResult.tsx`

**Files:**
- Create: `src/components/pages/kalkulator/AverageResult.tsx`

Presentational only. Animates the number "settling" to its value (the one piece of motion — triggered by grade input, per the per-page-soul rule). Respects reduced motion. Announces the settled value via `aria-live` while hiding the rolling digits from screen readers.

- [ ] **Step 1: Create the component**

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useReducedMotion } from "motion/react";

interface Props {
  /** Weighted average, or null when nothing is graded yet. */
  average: number | null;
  gradedEcts: number;
  totalEcts: number;
  labels: {
    heading: string;
    average: string;
    empty: string;
    ects: string; // contains {graded} and {total}
    announce: string; // contains {value}
  };
}

function formatPl(n: number): string {
  return n.toLocaleString("pl-PL", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function AverageResult({ average, gradedEcts, totalEcts, labels }: Props) {
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(0);
  const prev = useRef(0);

  useEffect(() => {
    if (average === null) {
      setDisplay(0);
      prev.current = 0;
      return;
    }
    if (reduce) {
      setDisplay(average);
      prev.current = average;
      return;
    }
    const controls = animate(prev.current, average, {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(v),
    });
    prev.current = average;
    return () => controls.stop();
  }, [average, reduce]);

  const ectsText = labels.ects
    .replace("{graded}", String(gradedEcts))
    .replace("{total}", String(totalEcts));

  return (
    <div className="rounded-2xl border border-border-subtle bg-bg-surface p-8">
      <p className="text-[0.75rem] font-medium uppercase tracking-[0.08em] text-accent">
        {labels.heading}
      </p>

      {average === null ? (
        <p className="mt-4 text-[0.9375rem] leading-[1.6] text-ink-secondary">{labels.empty}</p>
      ) : (
        <>
          <div className="mt-3 flex items-baseline gap-3">
            <span
              aria-hidden="true"
              className="font-mono text-[clamp(2.5rem,7vw,4rem)] font-semibold tabular-nums tracking-[-0.02em] text-ink-primary"
            >
              {formatPl(display)}
            </span>
            <span className="text-[0.8125rem] text-ink-tertiary">{labels.average}</span>
          </div>
          <p className="mt-2 font-mono text-[0.8125rem] text-ink-secondary">{ectsText}</p>
          <p className="sr-only" aria-live="polite">
            {labels.announce.replace("{value}", formatPl(average))}
          </p>
        </>
      )}
    </div>
  );
}
```

> `tabular-nums` keeps digit width fixed while rolling. `sr-only` must exist in the project's CSS; if not, use Tailwind's built-in `sr-only` utility (it ships with Tailwind v4).

- [ ] **Step 2: Verify it type-checks via build later** (no unit test — pure presentational; covered by Task 8 build). Mark done after Step 1.

- [ ] **Step 3: Commit**

```bash
git add src/components/pages/kalkulator/AverageResult.tsx
git commit -m "feat: animated AverageResult component"
```

---

## Task 6: Orchestrator — `KalkulatorSredniejContent.tsx`

**Files:**
- Create: `src/components/pages/KalkulatorSredniejContent.tsx`

Holds all state: selected program/level/year, a grades map keyed by stable course key, manual rows, and `localStorage` hydration. Builds `CourseInput[]` and feeds `computeAverage` + `AverageResult`.

- [ ] **Step 1: Create the component**

```tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Plus, Trash, ArrowCounterClockwise } from "@phosphor-icons/react";
import { computeAverage, GRADES, type CourseInput } from "@/lib/average";
import { getCoursesFor, programs, type DegreeLevel } from "@/lib/programs";
import { AverageResult } from "./kalkulator/AverageResult";

const STORAGE_KEY = "ssuew:kalkulator";

interface ManualRow {
  id: string;
  name: string;
  ects: number;
  grade: number | null;
}

interface Persisted {
  programId: string;
  level: DegreeLevel;
  year: number;
  grades: Record<string, number>; // courseKey -> grade
  manual: ManualRow[];
}

function courseKey(programId: string, level: string, year: number, index: number) {
  return `${programId}|${level}|${year}|${index}`;
}

export function KalkulatorSredniejContent() {
  const t = useTranslations("kalkulator");

  const [programId, setProgramId] = useState(programs[0]?.id ?? "");
  const program = programs.find((p) => p.id === programId) ?? programs[0];
  const [level, setLevel] = useState<DegreeLevel>(program?.degrees[0]?.level ?? "I");
  const degree = program?.degrees.find((d) => d.level === level) ?? program?.degrees[0];
  const [year, setYear] = useState<number>(degree?.years[0]?.year ?? 1);

  const [grades, setGrades] = useState<Record<string, number>>({});
  const [manual, setManual] = useState<ManualRow[]>([]);

  // Hydrate from localStorage once on mount (client-only → no SSR mismatch).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const p = JSON.parse(raw) as Partial<Persisted>;
      if (p.programId) setProgramId(p.programId);
      if (p.level) setLevel(p.level);
      if (typeof p.year === "number") setYear(p.year);
      if (p.grades) setGrades(p.grades);
      if (Array.isArray(p.manual)) setManual(p.manual);
    } catch {
      /* ignore corrupt storage */
    }
  }, []);

  // Persist on change.
  useEffect(() => {
    const data: Persisted = { programId, level, year, grades, manual };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      /* ignore quota / private mode */
    }
  }, [programId, level, year, grades, manual]);

  const courses = getCoursesFor(programId, level, year);

  const inputs: CourseInput[] = useMemo(() => {
    const fromProgram: CourseInput[] = courses.map((c, i) => ({
      ects: c.ects,
      grade: c.pass === "zal" ? null : (grades[courseKey(programId, level, year, i)] ?? null),
    }));
    const fromManual: CourseInput[] = manual.map((m) => ({ ects: m.ects, grade: m.grade }));
    return [...fromProgram, ...fromManual];
  }, [courses, grades, manual, programId, level, year]);

  const summary = computeAverage(inputs);

  function setGrade(index: number, value: number | null) {
    const key = courseKey(programId, level, year, index);
    setGrades((g) => {
      const next = { ...g };
      if (value === null) delete next[key];
      else next[key] = value;
      return next;
    });
  }

  function reset() {
    setGrades({});
    setManual([]);
  }

  return (
    <section className="section-padding" aria-labelledby="kalk-heading">
      <div className="mx-auto grid max-w-[1200px] gap-10 lg:grid-cols-[1.4fr_1fr]">
        {/* LEFT: pickers + table */}
        <div>
          {/* Pickers */}
          <h2 id="kalk-heading" className="sr-only">
            {t("pickerHeading")}
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="flex flex-col gap-1.5 text-[0.8125rem] text-ink-secondary">
              {t("program")}
              <select
                value={programId}
                onChange={(e) => setProgramId(e.target.value)}
                className="h-10 rounded-md border border-border-medium bg-bg-surface px-3 text-[0.9375rem] text-ink-primary"
              >
                {programs.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1.5 text-[0.8125rem] text-ink-secondary">
              {t("level")}
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as DegreeLevel)}
                className="h-10 rounded-md border border-border-medium bg-bg-surface px-3 text-[0.9375rem] text-ink-primary"
              >
                {program?.degrees.map((d) => (
                  <option key={d.level} value={d.level}>
                    {t(`level${d.level}`)}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1.5 text-[0.8125rem] text-ink-secondary">
              {t("year")}
              <select
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="h-10 rounded-md border border-border-medium bg-bg-surface px-3 text-[0.9375rem] text-ink-primary"
              >
                {degree?.years.map((y) => (
                  <option key={y.year} value={y.year}>
                    {t("yearLabel", { n: y.year })}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {/* Course table */}
          <h3 className="mt-10 font-display text-[1.125rem] font-semibold text-ink-primary">
            {t("tableHeading")}
          </h3>
          <div className="mt-4 overflow-hidden rounded-xl border border-border-subtle">
            <table className="w-full text-left text-[0.875rem]">
              <thead className="bg-bg-elevated text-[0.75rem] uppercase tracking-[0.06em] text-ink-tertiary">
                <tr>
                  <th className="px-4 py-3 font-medium">{t("colCourse")}</th>
                  <th className="w-20 px-4 py-3 font-medium">{t("colEcts")}</th>
                  <th className="w-40 px-4 py-3 font-medium">{t("colGrade")}</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((c, i) => (
                  <tr key={courseKey(programId, level, year, i)} className="border-t border-border-subtle">
                    <td className="px-4 py-3 text-ink-primary">{c.name}</td>
                    <td className="px-4 py-3 font-mono text-ink-secondary">{c.ects}</td>
                    <td className="px-4 py-3">
                      {c.pass === "zal" ? (
                        <span className="font-mono text-[0.8125rem] text-ink-tertiary">
                          {t("passLabel")}
                        </span>
                      ) : (
                        <select
                          aria-label={`${t("colGrade")}: ${c.name}`}
                          value={grades[courseKey(programId, level, year, i)] ?? ""}
                          onChange={(e) =>
                            setGrade(i, e.target.value === "" ? null : Number(e.target.value))
                          }
                          className="h-9 w-full rounded-md border border-border-medium bg-bg-surface px-2 text-ink-primary"
                        >
                          <option value="">{t("gradeNone")}</option>
                          {GRADES.map((g) => (
                            <option key={g} value={g}>
                              {g.toLocaleString("pl-PL", { minimumFractionDigits: 1 })}
                            </option>
                          ))}
                        </select>
                      )}
                    </td>
                  </tr>
                ))}

                {/* Manual rows */}
                {manual.map((m, mi) => (
                  <tr key={m.id} className="border-t border-border-subtle">
                    <td className="px-4 py-3">
                      <input
                        aria-label={t("courseNamePlaceholder")}
                        value={m.name}
                        placeholder={t("courseNamePlaceholder")}
                        onChange={(e) =>
                          setManual((rows) =>
                            rows.map((r) => (r.id === m.id ? { ...r, name: e.target.value } : r)),
                          )
                        }
                        className="w-full rounded-md border border-border-medium bg-bg-surface px-2 py-1.5 text-ink-primary"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        min={1}
                        aria-label={t("colEcts")}
                        value={m.ects || ""}
                        onChange={(e) =>
                          setManual((rows) =>
                            rows.map((r) =>
                              r.id === m.id ? { ...r, ects: Number(e.target.value) || 0 } : r,
                            ),
                          )
                        }
                        className="w-16 rounded-md border border-border-medium bg-bg-surface px-2 py-1.5 font-mono text-ink-primary"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <select
                          aria-label={t("colGrade")}
                          value={m.grade ?? ""}
                          onChange={(e) =>
                            setManual((rows) =>
                              rows.map((r) =>
                                r.id === m.id
                                  ? { ...r, grade: e.target.value === "" ? null : Number(e.target.value) }
                                  : r,
                              ),
                            )
                          }
                          className="h-9 flex-1 rounded-md border border-border-medium bg-bg-surface px-2 text-ink-primary"
                        >
                          <option value="">{t("gradeNone")}</option>
                          {GRADES.map((g) => (
                            <option key={g} value={g}>
                              {g.toLocaleString("pl-PL", { minimumFractionDigits: 1 })}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          aria-label={t("removeRow")}
                          onClick={() => setManual((rows) => rows.filter((r) => r.id !== m.id))}
                          className="text-ink-tertiary transition-colors hover:text-accent"
                        >
                          <Trash size={18} aria-hidden="true" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Row actions */}
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() =>
                setManual((rows) => [
                  ...rows,
                  { id: crypto.randomUUID(), name: "", ects: 0, grade: null },
                ])
              }
              className="inline-flex items-center gap-2 rounded-full border border-border-medium px-4 py-2 text-[0.875rem] font-medium text-ink-primary transition-colors hover:border-accent hover:text-accent"
            >
              <Plus size={16} aria-hidden="true" />
              {t("addRow")}
            </button>
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-[0.875rem] font-medium text-ink-secondary transition-colors hover:text-ink-primary"
            >
              <ArrowCounterClockwise size={16} aria-hidden="true" />
              {t("reset")}
            </button>
          </div>
        </div>

        {/* RIGHT: result + notes */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <AverageResult
            average={summary.average}
            gradedEcts={summary.gradedEcts}
            totalEcts={summary.totalEcts}
            labels={{
              heading: t("resultHeading"),
              average: t("resultAverage"),
              empty: t("resultEmpty"),
              ects: t("resultEcts"),
              announce: t("announce"),
            }}
          />
          <p className="mt-4 text-[0.8125rem] leading-[1.6] text-ink-tertiary">{t("privacy")}</p>
          <p className="mt-3 text-[0.8125rem] leading-[1.6] text-ink-tertiary">
            {t("scholarshipNote")}
          </p>
        </aside>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/pages/KalkulatorSredniejContent.tsx
git commit -m "feat: kalkulator orchestrator (pickers, table, manual mode, persistence)"
```

---

## Task 7: Page route + navigation links

**Files:**
- Create: `src/app/[locale]/kalkulator-sredniej/page.tsx`
- Modify: `src/components/pages/DlaStudentaContent.tsx`
- Modify: `src/lib/searchIndex.ts`

- [ ] **Step 1: Create the page route**

`src/app/[locale]/kalkulator-sredniej/page.tsx`:

```tsx
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/PageHero";
import { KalkulatorSredniejContent } from "@/components/pages/KalkulatorSredniejContent";
import { ogMeta } from "@/lib/og";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "kalkulator" });
  return {
    title: t("metaTitle"),
    description: t("metaDesc"),
    ...ogMeta(t("metaTitle"), t("ogLabel")),
  };
}

export default async function KalkulatorSredniejPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "kalkulator" });
  const tc = await getTranslations({ locale, namespace: "common" });

  return (
    <>
      <PageHero
        eyebrow={t("eyebrow")}
        title={t("title")}
        lead={t("lead")}
        breadcrumbs={[
          { label: tc("home"), href: "/" },
          { label: t("crumbStudent"), href: "/dla-studenta" },
          { label: t("title") },
        ]}
      />
      <KalkulatorSredniejContent />
    </>
  );
}
```

> Verify `common` has a `home` key (it is used by existing pages like `stypendia/page.tsx`, so it exists). `crumbStudent` is defined in the `kalkulator` namespace (Task 4).

- [ ] **Step 2: Add a tile in `DlaStudentaContent.tsx`**

In `src/components/pages/DlaStudentaContent.tsx`, add an import for a calculator icon and a tile entry:

In the phosphor import block, add `Calculator,`:

```tsx
  Calculator,
```

In the `tiles` array, add (e.g. after the `stypendia` entry):

```tsx
  { key: "kalkulator", href: "/kalkulator-sredniej", icon: Calculator, internal: true },
```

Then add the tile's strings to the `dlaStudenta` namespace in **both** `messages/pl.json` and `messages/en.json`, inside the existing `tiles` object:

PL:
```json
        "kalkulator": { "title": "Kalkulator średniej", "desc": "Policz średnią ważoną ECTS dla swojego kierunku i roku." }
```
EN:
```json
        "kalkulator": { "title": "Grade calculator", "desc": "Compute your ECTS-weighted average for your programme and year." }
```

> Open `messages/pl.json` and find `dlaStudenta.tiles` to place these exactly; mind commas.

- [ ] **Step 3: Add the page to site search**

In `src/lib/searchIndex.ts`, add this entry to the `sources` array inside the "Strefa studenta" group (e.g. right after the `/stypendia` line). It matches the existing `SearchSource` shape (`href`, `group`, `label`, `keywords`, all bilingual; group `G.student`):

```ts
  { href: "/kalkulator-sredniej", group: G.student, label: { pl: "Kalkulator średniej", en: "Grade average calculator" }, keywords: { pl: "średnia ważona ects oceny punkty stypendium policz", en: "weighted average ects grades points scholarship compute" } },
```

- [ ] **Step 4: Verify JSON + commit**

Run: `node -e "require('./messages/pl.json'); require('./messages/en.json'); console.log('ok')"`
Expected: `ok`.

```bash
git add src/app/[locale]/kalkulator-sredniej/page.tsx src/components/pages/DlaStudentaContent.tsx src/lib/searchIndex.ts messages/pl.json messages/en.json
git commit -m "feat: kalkulator page route + nav/search links"
```

---

## Task 8: Final verification (build, lint, tests, a11y)

**Files:** none (verification only)

- [ ] **Step 1: Run unit tests**

Run: `npm test`
Expected: PASS — all `average` + `programs` tests green.

- [ ] **Step 2: Lint**

Run: `npm run lint`
Expected: no errors for the new files.

- [ ] **Step 3: Production build**

Run: `npm run build`
Expected: build succeeds; `/[locale]/kalkulator-sredniej` appears in the route list; no type errors.

- [ ] **Step 4: Manual smoke + a11y check** (dev server: `npm run dev`)

Confirm each:
- Picking program/level/year loads that term's courses.
- Entering grades updates the average; the number animates to its value.
- "zal." rows show the pass label and are excluded from the average but counted in `totalEcts`.
- Manual mode: add a row, type name/ECTS/grade → average updates; remove row works.
- Reload page → selections + grades restored from `localStorage`.
- Keyboard: every select/input/button reachable and operable via Tab/arrows/Enter.
- OS "reduce motion" on → the number sets instantly (no roll).
- Light & dark mode both legible (token classes only).

- [ ] **Step 5: Final commit (if any fixes were needed)**

```bash
git add -A
git commit -m "fix: kalkulator verification pass (build/lint/a11y)"
```

---

## Self-Review notes (author)

- **Spec coverage:** picker→auto-load (Task 3+6), weighted average opt-A (Task 2), manual fallback (Task 6), localStorage + privacy copy (Task 6/4), a11y aria-live + keyboard + reduced-motion (Tasks 5/6/8), "soul" = settling number only (Task 5), links from `/dla-studenta` (Task 7). Scholarship hint shipped as informational `scholarshipNote` (Task 4/6) — full threshold values deferred per spec "Otwarte".
- **Deferred per spec:** USOS, PDF parsing, exact Rektor thresholds — intentionally out of scope.
- **Data caveat:** pilot `programs.ts` values are scaffolding marked `VERIFY` — must be checked against the official UEW sylabus before launch (Mikołaj's content track).
