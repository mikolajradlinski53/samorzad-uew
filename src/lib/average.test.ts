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
