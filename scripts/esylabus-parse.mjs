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
      if (!ects || ects <= 0 || !semInt) continue;
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
