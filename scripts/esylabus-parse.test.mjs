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
    expect(r.map((c) => c.name)).toEqual(["Finanse", "Język obcy"]);
    expect(r[0].ects).toBe(4);
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
    expect(yearsArr.map((y) => y.year)).toEqual([1]);
    const terms = yearsArr[0].terms;
    expect(terms.map((t) => t.semester)).toEqual([1, 2]);
    expect(terms[0].courses[0].name).toBe("A");
  });
});
