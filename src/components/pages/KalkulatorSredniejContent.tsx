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

interface FormState {
  programId: string;
  level: DegreeLevel;
  year: number;
  grades: Record<string, number>; // courseKey -> grade
  manual: ManualRow[];
}

function courseKey(programId: string, level: string, year: number, index: number) {
  return `${programId}|${level}|${year}|${index}`;
}

const defaultProgram = programs[0];
const defaultDegree = defaultProgram?.degrees[0];
const initialState: FormState = {
  programId: defaultProgram?.id ?? "",
  level: defaultDegree?.level ?? "I",
  year: defaultDegree?.years[0]?.year ?? 1,
  grades: {},
  manual: [],
};

export function KalkulatorSredniejContent() {
  const t = useTranslations("kalkulator");

  // Single state object so hydration from localStorage is one setState call
  // (mirrors the pattern in AnalyticsConsent.tsx). Initial value is static and
  // identical on server + first client render, so there is no hydration
  // mismatch — localStorage is only read inside the effect, after mount.
  const [form, setForm] = useState<FormState>(initialState);
  const { programId, level, year, grades, manual } = form;

  const program = programs.find((p) => p.id === programId) ?? programs[0];
  const degree = program?.degrees.find((d) => d.level === level) ?? program?.degrees[0];

  // Hydrate from localStorage once on mount (client-only -> no SSR mismatch).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const p = JSON.parse(raw) as Partial<FormState>;
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-shot mount hydration from localStorage, merged into a single setState call
      setForm((prev) => ({
        programId: p.programId ?? prev.programId,
        level: p.level ?? prev.level,
        year: typeof p.year === "number" ? p.year : prev.year,
        grades: p.grades ?? prev.grades,
        manual: Array.isArray(p.manual) ? p.manual : prev.manual,
      }));
    } catch {
      /* ignore corrupt storage */
    }
  }, []);

  // Persist on change.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
    } catch {
      /* ignore quota / private mode */
    }
  }, [form]);

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

  // Changing program may invalidate the current level/year (they might not
  // exist on the new program) -> reclamp both to the new program's first valid
  // option so getCoursesFor never receives a stale combination.
  function selectProgram(id: string) {
    const p = programs.find((x) => x.id === id) ?? programs[0];
    const newLevel = p?.degrees[0]?.level ?? "I";
    const newYear = p?.degrees.find((d) => d.level === newLevel)?.years[0]?.year ?? 1;
    setForm((f) => ({ ...f, programId: id, level: newLevel, year: newYear }));
  }

  // Changing level may invalidate the current year -> reclamp to the level's
  // first valid year.
  function selectLevel(newLevel: DegreeLevel) {
    const d = program?.degrees.find((x) => x.level === newLevel) ?? program?.degrees[0];
    const newYear = d?.years[0]?.year ?? 1;
    setForm((f) => ({ ...f, level: newLevel, year: newYear }));
  }

  function setYear(y: number) {
    setForm((f) => ({ ...f, year: y }));
  }

  function setGrade(index: number, value: number | null) {
    const key = courseKey(programId, level, year, index);
    setForm((f) => {
      const next = { ...f.grades };
      if (value === null) delete next[key];
      else next[key] = value;
      return { ...f, grades: next };
    });
  }

  function setManual(updater: (rows: ManualRow[]) => ManualRow[]) {
    setForm((f) => ({ ...f, manual: updater(f.manual) }));
  }

  function reset() {
    setForm((f) => ({ ...f, grades: {}, manual: [] }));
  }

  return (
    <section className="section-padding" aria-labelledby="kalk-heading">
      <div className="mx-auto grid max-w-[1200px] gap-10 lg:grid-cols-[1.4fr_1fr]">
        {/* LEFT: pickers + table */}
        <div>
          <h2 id="kalk-heading" className="sr-only">
            {t("pickerHeading")}
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="flex flex-col gap-1.5 text-[0.8125rem] text-ink-secondary">
              {t("program")}
              <select
                value={programId}
                onChange={(e) => selectProgram(e.target.value)}
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
                onChange={(e) => selectLevel(e.target.value as DegreeLevel)}
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

                {manual.map((m) => (
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
