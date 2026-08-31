/**
 * Wydania serii „Debiuty Studenckie".
 *
 * Metadane redakcyjne pisane ręcznie; STRONY są osobno, w generowanym
 * `edition-pages.ts`. Rozdzielenie jest celowe — ręcznych danych nie chcemy
 * nadpisywać przy każdym przebiegu skryptu.
 */
import { editionPages, type EditionPage } from "./edition-pages";

export interface Edition {
  slug: string;
  title: string;
  subtitle?: string;
  editors: string[];
  year: number;
  isbn: string;
  doi: string;
  /** Pełny tekst w otwartym dostępie — hostowany przez nas. */
  pdf: string;
  license: string;
  licenseUrl: string;
}

export const editions: Edition[] = [
  {
    slug: "new-trends-2026",
    title: "New Trends in Business Management",
    subtitle: "Culture, Strategy, Engagement",
    editors: ["Joanna Radomska", "Anna Witek-Crabb"],
    year: 2026,
    isbn: "978-83-68699-35-7",
    doi: "10.15611/2026.35.7",
    pdf: "/wydawnictwo/new-trends-2026.pdf",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/deed.pl",
  },
];

export const editionBySlug = (slug: string): Edition | undefined =>
  editions.find((e) => e.slug === slug);

/** Strony wydania. Pusta tablica = wydanie bez zdigitalizowanych stron. */
export const pagesOf = (slug: string): EditionPage[] => editionPages[slug] ?? [];
