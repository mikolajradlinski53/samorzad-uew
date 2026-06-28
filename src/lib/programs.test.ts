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
