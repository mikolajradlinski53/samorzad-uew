// Imports UEW study plans from the public e-sylabus JSON API into
// public/data/programs.json. Run: npm run import:sylabus
// Notes: responses are cp1250 + double-JSON-encoded; endpoints are POST.

import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { parsePlan, buildPrograms, levelLabel, cleanName, decodeResponse } from "./esylabus-parse.mjs";

const BASE = "https://ue.e-sylabus.pl/";
const UA = "Mozilla/5.0 (compatible; SSUEW-calculator-import)";
const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "data", "programs.json");

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
  const text = decodeResponse(buf);
  let v;
  try { v = JSON.parse(text); } catch { return null; }
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
    await new Promise((r) => setTimeout(r, 120));
  }

  const programs = buildPrograms(entries);
  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, JSON.stringify(programs) + "\n", "utf-8");

  const courseCount = entries.reduce((n, e) => n + e.courses.length, 0);
  console.log(`\nDONE. combos=${total} withData=${withData} skipped=${skipped}`);
  console.log(`programs=${programs.length} planEntries=${entries.length} courses=${courseCount}`);
  console.log(`wrote ${OUT}`);
}

main().catch((e) => { console.error("IMPORT FAILED:", e); process.exit(1); });
