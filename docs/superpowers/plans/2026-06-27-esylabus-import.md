# E-sylabus import + kalkulator wielowymiarowy — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the hand-written pilot `programs.ts` with real UEW study-plan data imported from the public `ue.e-sylabus.pl` JSON API, and extend the calculator to pick **kierunek → stopień → tryb → rocznik → rok**.

**Architecture:** A standalone Node importer script walks the e-sylabus API and writes `src/lib/programs.generated.json`. Pure parsing/aggregation logic lives in a separate module tested on synthetic fixtures (no network in tests). `src/lib/programs.ts` becomes types + JSON loader + pure selectors (tested on a fixture). The calculator UI gains two cascading selects (tryb, rocznik) and uses English course names in the `en` locale. `average.ts` and `AverageResult.tsx` are untouched.

**Tech Stack:** Node ESM (global `fetch`, `TextDecoder("windows-1250")`), Vitest, Next.js 16 / next-intl / Tailwind v4 / motion / phosphor. `tsconfig` already has `resolveJsonModule: true` and `strict: true`.

**Proven API facts (from spike — see `reference-esylabus-api`):**
- Public, no login. `GET /ForStudents` sets a session cookie. Endpoints are **POST**, responses are **cp1250** and **double-JSON-encoded** (`JSON.parse(JSON.parse(text))`). Empty plan = body `""`.
- `POST Sylabus/GetYearsAndDepartments` body `loadCourses=false&loadAuthors=false` → `{ YearList:[{NazwaRocznika,Ids}], DepartmentList:[{FieldOfStudyList:[{NazwaKierunku,Ids,KodKierunku,StudiaJednolite}]}], SpecjalizationList:[{FieldOfStudyIds,RocznikIds,StopienStudiow,Recruitment,Ids,NazwaSpecjalizacji}] }`.
- `POST ForStudents/GetPlanOfStudies` body `fieldOfStudy=<FieldOfStudyIds>&levelOfStudies=<1|2>&year=<RocznikIds>&specjalization=<spec.Ids>&speciality=&user=&unitName=&courseName=` → `{ MandatoryCourseGroup:[{ListaKursow:[course...]}], OptionalCourseGroup:[...] }`. Course fields: `NazwaPrzedmiotu`, `NazwaAngielska`, `ECTS`, `ECTSNiestacjonarne`, `Semestr`, `SemestrNiestacjonarne` (roman), `KodPrzedmiotu`.

---

## File Structure

| File | Responsibility |
|------|----------------|
| `vitest.config.mts` (modify) | Also include `scripts/**/*.test.mjs`. |
| `scripts/esylabus-parse.mjs` (create) | PURE helpers: roman→int, level label, clean name, `parsePlan(plan, mode)`, `buildPrograms(entries)`. No network. |
| `scripts/esylabus-parse.test.mjs` (create) | Vitest unit tests for the pure helpers (synthetic fixtures). |
| `scripts/import-esylabus.mjs` (create) | Network orchestration: session, fetch tree, fetch plans, build, write JSON, print report. |
| `package.json` (modify) | Add `"import:sylabus": "node scripts/import-esylabus.mjs"`. |
| `src/lib/programs.generated.json` (generated) | Real dataset, produced by the importer. Committed. |
| `src/lib/programs.ts` (rewrite) | Types + load generated JSON (cast) + pure selectors. |
| `src/lib/programs.test.ts` (rewrite) | Selector tests on a small fixture. |
| `src/components/pages/KalkulatorSredniejContent.tsx` (modify) | 5-dim cascade, gradeKey with mode+rocznik, EN names. |
| `messages/pl.json`, `messages/en.json` (modify) | Add `mode`/`rocznik` labels + the two mode names. |

---

## Task 1: Extend Vitest to cover script tests

**Files:** Modify `vitest.config.mts`

- [ ] **Step 1: Update include globs**

Replace the `include` line so both src TS tests and script mjs tests run:

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["src/**/*.test.ts", "scripts/**/*.test.mjs"],
    environment: "node",
  },
});
```

- [ ] **Step 2: Verify config still loads**

Run: `npm test`
Expected: existing `average` + `programs` tests still run and pass (no scripts tests exist yet).

- [ ] **Step 3: Commit**

```bash
git add vitest.config.mts
git commit -m "chore: vitest include scripts/**/*.test.mjs"
```

---

## Task 2: Pure parse/aggregate module (TDD)

**Files:** Create `scripts/esylabus-parse.mjs`, `scripts/esylabus-parse.test.mjs`

- [ ] **Step 1: Write the failing test** — `scripts/esylabus-parse.test.mjs`:

```js
import { describe, expect, it } from "vitest";
import { romanToInt, yearFromSemester, levelLabel, cleanName, parsePlan, buildPrograms } from "./esylabus-parse.mjs";

describe("romanToInt", () => {
  it("maps roman semesters", () => {
    expect(romanToInt("I")).toBe(1);
    expect(romanToInt(" iv ")).toBe(4);
    expect(romanToInt("VII")).toBe(7);
  });
  it("returns null for junk", () => {
    expect(romanToInt("")).toBeNull();
    expect(romanToInt(null)).toBeNull();
    expect(romanToInt("XYZ")).toBeNull();
  });
});

describe("yearFromSemester", () => {
  it("pairs semesters into years", () => {
    expect(yearFromSemester(1)).toBe(1);
    expect(yearFromSemester(2)).toBe(1);
    expect(yearFromSemester(3)).toBe(2);
    expect(yearFromSemester(7)).toBe(4);
  });
});

describe("levelLabel", () => {
  it("uses jednolite flag, else maps stopien", () => {
    expect(levelLabel(1, false)).toBe("I");
    expect(levelLabel(2, false)).toBe("II");
    expect(levelLabel(1, true)).toBe("jednolite");
  });
});

describe("cleanName", () => {
  it("strips leading bracket code and trims", () => {
    expect(cleanName("[KWO] Informatyka")).toBe("Informatyka");
    expect(cleanName("  Ekonomia ")).toBe("Ekonomia");
  });
});

const samplePlan = {
  MandatoryCourseGroup: [
    {
      ListaKursow: [
        { NazwaPrzedmiotu: "Finanse", NazwaAngielska: "Finance", ECTS: 3, ECTSNiestacjonarne: 4, Semestr: "II", SemestrNiestacjonarne: "II", KodPrzedmiotu: "FIN1" },
        { NazwaPrzedmiotu: "Matematyka", NazwaAngielska: "Mathematics", ECTS: 6, ECTSNiestacjonarne: 0, Semestr: "I", SemestrNiestacjonarne: "I", KodPrzedmiotu: "MAT1" },
      ],
    },
  ],
  OptionalCourseGroup: [
    { ListaKursow: [ { NazwaPrzedmiotu: "  Język obcy  ", ECTS: 2, ECTSNiestacjonarne: 2, Semestr: "III", SemestrNiestacjonarne: "III" } ] },
  ],
};

describe("parsePlan", () => {
  it("extracts stationary courses with name/ects/semester/nameEn/code", () => {
    const r = parsePlan(samplePlan, "stacjonarne");
    expect(r).toHaveLength(3);
    expect(r[0]).toEqual({ name: "Finanse", ects: 3, semester: 2, nameEn: "Finance", code: "FIN1" });
    expect(r[2]).toEqual({ name: "Język obcy", ects: 2, semester: 3 });
  });

  it("skips courses with 0 ECTS in the chosen mode", () => {
    const r = parsePlan(samplePlan, "niestacjonarne");
    // Matematyka has 0 ECTS niestacjonarne → skipped
    expect(r.map((c) => c.name)).toEqual(["Finanse", "Język obcy"]);
    expect(r[0].ects).toBe(4); // niestacjonarne ECTS
  });
});

describe("buildPrograms", () => {
  it("nests program→degree→cohort→track→year→term→courses and sorts", () => {
    const entries = [
      { programId: "eko", programName: "Ekonomia", level: "I", mode: "stacjonarne", rocznik: "2024/2025",
        courses: [ { name: "B", ects: 4, semester: 2 }, { name: "A", ects: 6, semester: 1 } ] },
    ];
    const progs = buildPrograms(entries);
    expect(progs).toHaveLength(1);
    const yearsArr = progs[0].degrees[0].cohorts[0].tracks[0].years;
    expect(yearsArr.map((y) => y.year)).toEqual([1]); // sem 1 and 2 → year 1
    const terms = yearsArr[0].terms;
    expect(terms.map((t) => t.semester)).toEqual([1, 2]);
    expect(terms[0].courses[0].name).toBe("A");
  });
});
```

- [ ] **Step 2: Run, confirm FAIL**

Run: `npm test -- esylabus-parse`
Expected: FAIL (cannot resolve `./esylabus-parse.mjs`).

- [ ] **Step 3: Implement** — `scripts/esylabus-parse.mjs`:

```js
// Pure helpers for the e-sylabus importer. No network, no fs — unit-testable.

const ROMAN = { I: 1, II: 2, III: 3, IV: 4, V: 5, VI: 6, VII: 7, VIII: 8, IX: 9, X: 10 };

export function romanToInt(s) {
  if (!s) return null;
  return ROMAN[String(s).trim().toUpperCase()] ?? null;
}

export function yearFromSemester(semInt) {
  return Math.ceil(semInt / 2);
}

export function levelLabel(stopien, studiaJednolite) {
  if (studiaJednolite) return "jednolite";
  return Number(stopien) === 2 ? "II" : "I";
}

/** "[KWO] Informatyka" → "Informatyka"; also trims. */
export function cleanName(name) {
  return String(name || "").replace(/^\s*\[[^\]]*\]\s*/, "").trim();
}

/** Flatten a GetPlanOfStudies object into courses for one study mode. */
export function parsePlan(plan, mode) {
  const groups = [
    ...((plan && plan.MandatoryCourseGroup) || []),
    ...((plan && plan.OptionalCourseGroup) || []),
  ];
  const out = [];
  for (const g of groups) {
    for (const c of (g && g.ListaKursow) || []) {
      const name = String(c.NazwaPrzedmiotu || "").trim();
      if (!name) continue;
      const ects = Number(mode === "niestacjonarne" ? c.ECTSNiestacjonarne : c.ECTS);
      const semInt = romanToInt(mode === "niestacjonarne" ? c.SemestrNiestacjonarne : c.Semestr);
      if (!ects || ects <= 0 || !semInt) continue; // not offered in this mode
      const course = { name, ects, semester: semInt };
      const en = String(c.NazwaAngielska || "").trim();
      if (en) course.nameEn = en;
      const code = String(c.KodPrzedmiotu || "").trim();
      if (code) course.code = code;
      out.push(course);
    }
  }
  return out;
}

/**
 * entries: [{ programId, programName, level, mode, rocznik, courses:[{name,ects,semester,nameEn?,code?}] }]
 * → Program[] nested + deterministically sorted.
 */
export function buildPrograms(entries) {
  const progMap = new Map();
  for (const e of entries) {
    let p = progMap.get(e.programId);
    if (!p) { p = { id: e.programId, name: e.programName, degrees: [] }; progMap.set(e.programId, p); }
    let d = p.degrees.find((x) => x.level === e.level);
    if (!d) { d = { level: e.level, cohorts: [] }; p.degrees.push(d); }
    let co = d.cohorts.find((x) => x.rocznik === e.rocznik);
    if (!co) { co = { rocznik: e.rocznik, tracks: [] }; d.cohorts.push(co); }
    let tr = co.tracks.find((x) => x.mode === e.mode);
    if (!tr) { tr = { mode: e.mode, years: [] }; co.tracks.push(tr); }
    for (const c of e.courses) {
      const y = yearFromSemester(c.semester);
      let yr = tr.years.find((x) => x.year === y);
      if (!yr) { yr = { year: y, terms: [] }; tr.years.push(yr); }
      let t = yr.terms.find((x) => x.semester === c.semester);
      if (!t) { t = { semester: c.semester, courses: [] }; yr.terms.push(t); }
      const course = { name: c.name, ects: c.ects, semester: c.semester };
      if (c.nameEn) course.nameEn = c.nameEn;
      if (c.code) course.code = c.code;
      t.courses.push(course);
    }
  }
  const pl = (a, b) => String(a).localeCompare(String(b), "pl");
  const progs = [...progMap.values()].sort((a, b) => pl(a.name, b.name));
  for (const p of progs) {
    p.degrees.sort((a, b) => pl(a.level, b.level));
    for (const d of p.degrees) {
      d.cohorts.sort((a, b) => pl(a.rocznik, b.rocznik));
      for (const co of d.cohorts) {
        co.tracks.sort((a, b) => pl(a.mode, b.mode));
        for (const tr of co.tracks) {
          tr.years.sort((a, b) => a.year - b.year);
          for (const yr of tr.years) {
            yr.terms.sort((a, b) => a.semester - b.semester);
            for (const t of yr.terms) t.courses.sort((a, b) => pl(a.name, b.name));
          }
        }
      }
    }
  }
  return progs;
}
```

- [ ] **Step 4: Run, confirm PASS**

Run: `npm test -- esylabus-parse`
Expected: all tests pass.

- [ ] **Step 5: Commit**

```bash
git add scripts/esylabus-parse.mjs scripts/esylabus-parse.test.mjs
git commit -m "feat: pure e-sylabus parse/aggregate helpers + tests"
```

---

## Task 3: Importer script (network)

**Files:** Create `scripts/import-esylabus.mjs`; modify `package.json`

This has no unit test (it performs network I/O); it is validated by a real run in Task 4. It must be resilient: a single failing/empty plan must not abort the whole run.

- [ ] **Step 1: Implement** — `scripts/import-esylabus.mjs`:

```js
// Imports UEW study plans from the public e-sylabus JSON API into
// src/lib/programs.generated.json. Run: npm run import:sylabus
// Notes: responses are cp1250 + double-JSON-encoded; endpoints are POST.

import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { parsePlan, buildPrograms, levelLabel, cleanName } from "./esylabus-parse.mjs";

const BASE = "https://ue.e-sylabus.pl/";
const UA = "Mozilla/5.0 (compatible; SSUEW-calculator-import)";
const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "src", "lib", "programs.generated.json");

let cookie = "";

async function login() {
  const r = await fetch(BASE + "ForStudents", { headers: { "User-Agent": UA } });
  const set = typeof r.headers.getSetCookie === "function" ? r.headers.getSetCookie() : [];
  cookie = set.map((c) => c.split(";")[0]).join("; ");
}

async function api(path, params) {
  const res = await fetch(BASE + path, {
    method: "POST",
    headers: {
      "User-Agent": UA,
      "X-Requested-With": "XMLHttpRequest",
      "Content-Type": "application/x-www-form-urlencoded",
      Cookie: cookie,
    },
    body: new URLSearchParams(params).toString(),
  });
  const buf = Buffer.from(await res.arrayBuffer());
  const text = new TextDecoder("windows-1250").decode(buf);
  let v;
  try { v = JSON.parse(text); } catch { return null; }   // HTML error page etc.
  if (v === "" || v === null) return null;
  if (typeof v === "string") { try { v = JSON.parse(v); } catch { return null; } }
  return v;
}

const slug = (s) => cleanName(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

async function main() {
  await login();
  const tree = await api("Sylabus/GetYearsAndDepartments", { loadCourses: "false", loadAuthors: "false" });
  if (!tree) throw new Error("GetYearsAndDepartments returned nothing");

  const yearName = new Map((tree.YearList || []).map((y) => [y.Ids, y.NazwaRocznika]));
  const fields = new Map();
  for (const dep of tree.DepartmentList || [])
    for (const f of dep.FieldOfStudyList || []) fields.set(f.Ids, f);

  // Unique (field, level, rocznik) combos; pick the base spec (empty NazwaSpecjalizacji).
  const combos = new Map();
  for (const s of tree.SpecjalizationList || []) {
    if (!s.FieldOfStudyIds || !s.RocznikIds) continue;
    const key = `${s.FieldOfStudyIds}|${s.StopienStudiow}|${s.RocznikIds}`;
    const isBase = !String(s.NazwaSpecjalizacji || "").trim();
    if (!combos.has(key) || isBase) combos.set(key, s);
  }

  const entries = [];
  const modes = ["stacjonarne", "niestacjonarne"];
  let done = 0, withData = 0, skipped = 0;
  const total = combos.size;

  for (const s of combos.values()) {
    done++;
    const field = fields.get(s.FieldOfStudyIds);
    if (!field) { skipped++; continue; }
    const plan = await api("ForStudents/GetPlanOfStudies", {
      fieldOfStudy: s.FieldOfStudyIds, levelOfStudies: s.StopienStudiow, year: s.RocznikIds,
      specjalization: s.Ids, speciality: "", user: "", unitName: "", courseName: "",
    });
    if (!plan) { skipped++; }
    else {
      const programName = cleanName(field.NazwaKierunku);
      const programId = (field.KodKierunku && String(field.KodKierunku).trim()) || slug(field.NazwaKierunku);
      const level = levelLabel(s.StopienStudiow, field.StudiaJednolite);
      const rocznik = yearName.get(s.RocznikIds) || "—";
      let any = false;
      for (const mode of modes) {
        const courses = parsePlan(plan, mode);
        if (courses.length) { entries.push({ programId, programName, level, mode, rocznik, courses }); any = true; }
      }
      if (any) withData++;
    }
    if (done % 25 === 0) console.log(`  ...${done}/${total} combos (${withData} with data)`);
    await new Promise((r) => setTimeout(r, 120)); // be polite
  }

  const programs = buildPrograms(entries);
  writeFileSync(OUT, JSON.stringify(programs, null, 2) + "\n", "utf-8");

  const courseCount = entries.reduce((n, e) => n + e.courses.length, 0);
  console.log(`\nDONE. combos=${total} withData=${withData} skipped=${skipped}`);
  console.log(`programs=${programs.length} planEntries=${entries.length} courses=${courseCount}`);
  console.log(`wrote ${OUT}`);
}

main().catch((e) => { console.error("IMPORT FAILED:", e); process.exit(1); });
```

- [ ] **Step 2: Add npm script** — in `package.json` `"scripts"`:

```json
    "import:sylabus": "node scripts/import-esylabus.mjs"
```

- [ ] **Step 3: Lint the script for obvious errors (no run yet)**

Run: `node --check scripts/import-esylabus.mjs`
Expected: no syntax errors.

- [ ] **Step 4: Commit**

```bash
git add scripts/import-esylabus.mjs package.json
git commit -m "feat: e-sylabus importer script + npm run import:sylabus"
```

---

## Task 4: Run the importer → generate dataset

**Files:** generates `src/lib/programs.generated.json`

- [ ] **Step 1: Run the importer**

Run: `npm run import:sylabus`
Expected: progress logs; a final report `programs=<n> ... courses=<n>`; the file `src/lib/programs.generated.json` is created. This may take a few minutes (hundreds of POSTs with a 120ms delay). If it fails partway due to a transient network error, re-run.

- [ ] **Step 2: Sanity-check the output**

Run:
```bash
node -e "const d=require('./src/lib/programs.generated.json'); console.log('programs',d.length); const p=d.find(x=>/zarz.*in.ynieria/i.test(x.name))||d[0]; console.log('sample program:',p.name,'levels',p.degrees.map(g=>g.level)); const t=p.degrees[0].cohorts[0].tracks[0]; console.log('cohort',p.degrees[0].cohorts[0].rocznik,'mode',t.mode,'years',t.years.map(y=>y.year)); const courses=t.years.flatMap(y=>y.terms.flatMap(s=>s.courses)); console.log('courses in track',courses.length,'sumECTS',courses.reduce((a,c)=>a+c.ects,0)); console.log(courses.slice(0,4));"
```
Expected: a plausible program count (dozens), real Polish course names, ECTS values, and a per-track ECTS sum in a sane range (e.g. ~180–210 per full programme). Confirm `nameEn` appears on at least some courses.

- [ ] **Step 3: Measure bundle size of the dataset**

Run: `node -e "console.log('json KB', (require('fs').statSync('src/lib/programs.generated.json').size/1024).toFixed(0))"`
Record the size. If it is **> ~800 KB**, STOP and report it as a concern (we will likely move the JSON to `public/` and fetch it client-side in a fast-follow rather than bundling it). If ≤ ~800 KB, proceed (importing it into the route chunk is acceptable for now).

- [ ] **Step 4: Commit the generated dataset**

```bash
git add src/lib/programs.generated.json
git commit -m "data: generated UEW study plans from e-sylabus"
```

---

## Task 5: Rewrite `programs.ts` as loader + selectors (TDD)

**Files:** Rewrite `src/lib/programs.ts`; rewrite `src/lib/programs.test.ts`

- [ ] **Step 1: Write the failing test** — replace `src/lib/programs.test.ts` with:

```ts
import { describe, expect, it } from "vitest";
import {
  type Program,
  listPrograms,
  listLevels,
  listModes,
  listCohorts,
  listYears,
  getCoursesFor,
} from "./programs";

const fixture: Program[] = [
  {
    id: "eko",
    name: "Ekonomia",
    degrees: [
      {
        level: "I",
        cohorts: [
          {
            rocznik: "2024/2025",
            tracks: [
              {
                mode: "stacjonarne",
                years: [
                  { year: 1, terms: [
                    { semester: 1, courses: [{ name: "A", ects: 6, semester: 1 }] },
                    { semester: 2, courses: [{ name: "B", ects: 4, semester: 2 }] },
                  ] },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];

describe("selectors", () => {
  it("lists levels/modes/cohorts/years for a selection", () => {
    expect(listLevels(fixture, "eko")).toEqual(["I"]);
    expect(listModes(fixture, "eko", "I")).toEqual(["stacjonarne"]);
    expect(listCohorts(fixture, "eko", "I", "stacjonarne")).toEqual(["2024/2025"]);
    expect(listYears(fixture, "eko", "I", "stacjonarne", "2024/2025")).toEqual([1]);
  });

  it("flattens a year's terms into courses", () => {
    const cs = getCoursesFor(fixture, "eko", "I", "stacjonarne", "2024/2025", 1);
    expect(cs.map((c) => c.name)).toEqual(["A", "B"]);
  });

  it("returns [] for an unknown selection", () => {
    expect(getCoursesFor(fixture, "nope", "I", "stacjonarne", "2024/2025", 9)).toEqual([]);
  });

  it("listPrograms returns id+name pairs", () => {
    expect(listPrograms(fixture)).toEqual([{ id: "eko", name: "Ekonomia" }]);
  });
});
```

- [ ] **Step 2: Run, confirm FAIL**

Run: `npm test -- programs`
Expected: FAIL (new selectors not exported / signatures changed).

- [ ] **Step 3: Rewrite** — replace the entire `src/lib/programs.ts` with:

```ts
/**
 * Dane kierunków generowane z e-sylabusa UEW (NIE edytować ręcznie — odśwież
 * skryptem `npm run import:sylabus`, który nadpisuje `programs.generated.json`).
 *
 * Ten plik wystawia typy, dane (z castem na typ — unikamy gigantycznej inferencji
 * TS z dużego JSON-a) oraz czyste selektory sterujące kaskadą wyboru w kalkulatorze.
 */
import generated from "./programs.generated.json";

export type DegreeLevel = "I" | "II" | "jednolite";
export type StudyMode = "stacjonarne" | "niestacjonarne";

export interface Course {
  name: string;
  nameEn?: string;
  ects: number;
  semester: number;
  code?: string;
  /** "zal" = bez oceny (liczy się do ECTS, nie do średniej). Domyślnie oceniany. */
  pass?: "ocena" | "zal";
}
export interface Term { semester: number; courses: Course[]; }
export interface Year { year: number; terms: Term[]; }
export interface Track { mode: StudyMode; years: Year[]; }
export interface Cohort { rocznik: string; tracks: Track[]; }
export interface Degree { level: DegreeLevel; cohorts: Cohort[]; }
export interface Program { id: string; name: string; degrees: Degree[]; }

export const programs = generated as unknown as Program[];

export function listPrograms(data: Program[] = programs): { id: string; name: string }[] {
  return data.map((p) => ({ id: p.id, name: p.name }));
}
export function listLevels(data: Program[], programId: string): DegreeLevel[] {
  return data.find((p) => p.id === programId)?.degrees.map((d) => d.level) ?? [];
}
export function listModes(data: Program[], programId: string, level: DegreeLevel): StudyMode[] {
  const degree = data.find((p) => p.id === programId)?.degrees.find((d) => d.level === level);
  // modes are nested under cohorts; collect the distinct set across cohorts
  const set = new Set<StudyMode>();
  for (const c of degree?.cohorts ?? []) for (const t of c.tracks) set.add(t.mode);
  return [...set];
}
export function listCohorts(data: Program[], programId: string, level: DegreeLevel, mode: StudyMode): string[] {
  const degree = data.find((p) => p.id === programId)?.degrees.find((d) => d.level === level);
  return (degree?.cohorts ?? []).filter((c) => c.tracks.some((t) => t.mode === mode)).map((c) => c.rocznik);
}
export function listYears(data: Program[], programId: string, level: DegreeLevel, mode: StudyMode, rocznik: string): number[] {
  const track = findTrack(data, programId, level, mode, rocznik);
  return (track?.years ?? []).map((y) => y.year);
}
export function getCoursesFor(data: Program[], programId: string, level: DegreeLevel, mode: StudyMode, rocznik: string, year: number): Course[] {
  const track = findTrack(data, programId, level, mode, rocznik);
  const yearEntry = track?.years.find((y) => y.year === year);
  if (!yearEntry) return [];
  return yearEntry.terms.flatMap((t) => t.courses);
}

function findTrack(data: Program[], programId: string, level: DegreeLevel, mode: StudyMode, rocznik: string): Track | undefined {
  return data
    .find((p) => p.id === programId)
    ?.degrees.find((d) => d.level === level)
    ?.cohorts.find((c) => c.rocznik === rocznik)
    ?.tracks.find((t) => t.mode === mode);
}
```

> Note: selectors take `data` as the first arg (so tests pass a fixture). The UI passes the exported `programs`. `listPrograms` defaults to `programs` for convenience.

- [ ] **Step 4: Run tests + type-check**

Run: `npm test -- programs` (expect pass) and `npx tsc --noEmit` (expect clean — the generated JSON must already exist from Task 4).

- [ ] **Step 5: Commit**

```bash
git add src/lib/programs.ts src/lib/programs.test.ts
git commit -m "refactor: programs.ts loads generated data + multi-dim selectors"
```

---

## Task 6: Calculator UI — 5-dimension cascade + EN names

**Files:** Modify `src/components/pages/KalkulatorSredniejContent.tsx`

The component currently has program/level/year. Extend to program → level → **mode** → **rocznik** → year, using the new selectors. Keep the existing single-`FormState` pattern, the localStorage hydration (with its scoped `eslint-disable`), the manual rows, reset, and `AverageResult` wiring. Do NOT introduce new effects (avoids `react-hooks/set-state-in-effect`).

- [ ] **Step 1: Update imports + state**

Replace the programs import and `FormState` to include `mode` and `rocznik`:

```tsx
import { useLocale, useTranslations } from "next-intl";
import {
  programs, listLevels, listModes, listCohorts, listYears, getCoursesFor,
  type DegreeLevel, type StudyMode,
} from "@/lib/programs";
```

`FormState` gains `mode: StudyMode` and `rocznik: string`. Compute the static initial state from the first program's first level/mode/cohort/year (mirror the existing `initialState` derivation), e.g.:

```tsx
function firstOf<T>(arr: T[], fallback: T): T { return arr.length ? arr[0] : fallback; }

const p0 = programs[0];
const level0 = (p0?.degrees[0]?.level ?? "I") as DegreeLevel;
const mode0 = firstOf(listModes(programs, p0?.id ?? "", level0), "stacjonarne" as StudyMode);
const rocznik0 = firstOf(listCohorts(programs, p0?.id ?? "", level0, mode0), "");
const year0 = firstOf(listYears(programs, p0?.id ?? "", level0, mode0, rocznik0), 1);
// initialState: { programId: p0?.id ?? "", level: level0, mode: mode0, rocznik: rocznik0, year: year0, grades: {}, manual: [] }
```

- [ ] **Step 2: Reclamp handlers for the full cascade**

Replace `selectProgram`/`selectLevel` and add `selectMode`/`selectRocznik`. Each resets everything downstream to the first available value:

```tsx
function clampFrom(programId: string, level: DegreeLevel, mode?: StudyMode, rocznik?: string) {
  const lv = listLevels(programs, programId).includes(level) ? level : firstOf(listLevels(programs, programId), "I" as DegreeLevel);
  const md = mode && listModes(programs, programId, lv).includes(mode) ? mode : firstOf(listModes(programs, programId, lv), "stacjonarne" as StudyMode);
  const rk = rocznik && listCohorts(programs, programId, lv, md).includes(rocznik) ? rocznik : firstOf(listCohorts(programs, programId, lv, md), "");
  const yr = firstOf(listYears(programs, programId, lv, md, rk), 1);
  return { level: lv, mode: md, rocznik: rk, year: yr };
}

function selectProgram(programId: string) { setForm((f) => ({ ...f, programId, ...clampFrom(programId, f.level) })); }
function selectLevel(level: DegreeLevel) { setForm((f) => ({ ...f, ...clampFrom(f.programId, level) })); }
function selectMode(mode: StudyMode) { setForm((f) => ({ ...f, ...clampFrom(f.programId, f.level, mode) })); }
function selectRocznik(rocznik: string) { setForm((f) => ({ ...f, ...clampFrom(f.programId, f.level, f.mode, rocznik) })); }
function selectYear(year: number) { setForm((f) => ({ ...f, year })); }
```

- [ ] **Step 3: Render the 5 selects**

Use the existing select styling. Program options from `programs`; then level/mode/rocznik/year from the list selectors using the current form values. Labels via `t`:
- level: `t("level" + lvl)`
- mode: `t("mode_" + md)` (md is "stacjonarne"/"niestacjonarne")
- rocznik: the raw `rocznik` string (e.g. "2024/2025")
- year: `t("yearLabel", { n })`

Wire `onChange` to the handlers above. Put the 5 selects in a responsive grid (e.g. `sm:grid-cols-2 lg:grid-cols-3` or 5 columns at xl).

- [ ] **Step 4: Courses + gradeKey with mode + rocznik**

```tsx
const { programId, level, mode, rocznik, year } = form;
const courses = getCoursesFor(programs, programId, level, mode, rocznik, year);
```

Extend `gradeKey` to include mode + rocznik so grades are scoped to the exact plan, and key by COURSE NAME (matching the Task in the calculator feature):

```tsx
function gradeKey(programId: string, level: DegreeLevel, mode: StudyMode, rocznik: string, year: number, courseName: string) {
  return `${programId}|${level}|${mode}|${rocznik}|${year}|${courseName}`;
}
```

Update the three program-course call sites (`inputs` memo lookup, grade `<select value>`, `setGrade`) to pass `mode`, `rocznik`, and `c.name`. The `inputs` memo deps array must include `mode` and `rocznik`. Keep the React row `key` unique (include `mode`/`rocznik`/`i`/`c.name`).

- [ ] **Step 5: English course names**

```tsx
const locale = useLocale();
// when rendering a course name cell:
const displayName = locale === "en" && c.nameEn ? c.nameEn : c.name;
```
Use `displayName` for the visible cell and inside the grade select `aria-label`.

- [ ] **Step 6: Verify**

Run: `npx tsc --noEmit` (clean), `npm run lint` (clean).

- [ ] **Step 7: Commit**

```bash
git add src/components/pages/KalkulatorSredniejContent.tsx
git commit -m "feat: calculator 5-dim cascade (mode+rocznik) + EN course names"
```

---

## Task 7: i18n — mode + rocznik labels

**Files:** Modify `messages/pl.json`, `messages/en.json`

- [ ] **Step 1: Add keys to the `kalkulator` namespace in BOTH files** (keep PL/EN key sets identical):

PL:
```json
    "mode": "Tryb studiów",
    "mode_stacjonarne": "Stacjonarne",
    "mode_niestacjonarne": "Niestacjonarne",
    "rocznik": "Rocznik"
```
EN:
```json
    "mode": "Study mode",
    "mode_stacjonarne": "Full-time",
    "mode_niestacjonarne": "Part-time",
    "rocznik": "Cohort"
```

- [ ] **Step 2: Verify JSON + parity**

Run: `node -e "const a=Object.keys(require('./messages/pl.json').kalkulator).sort(),b=Object.keys(require('./messages/en.json').kalkulator).sort();console.log(a.length,b.length,JSON.stringify(a)===JSON.stringify(b))"`
Expected: equal counts and `true`.

- [ ] **Step 3: Commit**

```bash
git add messages/pl.json messages/en.json
git commit -m "i18n: add study-mode + rocznik labels to kalkulator"
```

---

## Task 8: Final verification

**Files:** none (verification only)

- [ ] **Step 1: Tests** — `npm test` → all pass (esylabus-parse + programs + average).
- [ ] **Step 2: Lint** — `npm run lint` → clean.
- [ ] **Step 3: Build** — `npm run build` → succeeds; `/[locale]/kalkulator-sredniej` present; no type errors. Note the route chunk size for the calculator page (the generated JSON is imported there). If the build flags an unusually large chunk, report it.
- [ ] **Step 4: Manual checks deferred to user** (browser): cascade selects (changing program/level/mode/rocznik reloads courses), grades + weighted average, EN locale shows English course names, reload persistence, keyboard nav, reduced-motion, dark/light.
- [ ] **Step 5:** If any small fix was needed, commit it; otherwise no commit.

---

## Self-Review notes (author)

- **Spec coverage:** importer pulls all published programmes/cohorts/both modes dynamically (Tasks 3–4); generated dataset (Task 4); loader+selectors (Task 5); 5-dim cascade + EN names (Task 6); i18n (Task 7); pure parser tested on fixtures, selectors tested on fixture, no network in tests (Tasks 2,5). `pass`/"zal" simplification honored (all courses gradeable — no auto "zal"). Bundle-size risk has an explicit measure+threshold gate (Task 4 Step 3 / Task 8 Step 3).
- **Type consistency:** `Program/Degree/Cohort/Track/Year/Term/Course`, `DegreeLevel`, `StudyMode` are identical across `programs.ts`, the parser output shape, and the UI. Selectors uniformly take `(data, ...)`.
- **Deferred:** specializations/specialities (base plan only); live per-request fetch; USOS.
