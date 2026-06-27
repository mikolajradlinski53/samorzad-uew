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
