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
                // Uwaga: przedmioty 0 ECTS (np. WF) pomijamy — nie liczą się do ECTS ani do średniej.
                courses: [
                  { name: "Mikroekonomia", ects: 6 },
                  { name: "Matematyka", ects: 5 },
                  { name: "Podstawy zarządzania", ects: 4 },
                  { name: "Wprowadzenie do prawa", ects: 3 },
                  { name: "Technologie informacyjne", ects: 3, pass: "zal" },
                ],
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
