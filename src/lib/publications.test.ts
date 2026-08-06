import { describe, expect, it } from "vitest";
import { formatCitation, type Publication } from "./publications";

describe("formatCitation", () => {
  it("formats a single-author publication without ISBN", () => {
    const p: Publication = {
      title: "Tytuł artykułu",
      authors: ["Kowalski, J."],
      year: 2024,
    };
    expect(formatCitation(p)).toBe(
      "Kowalski, J. (2024). Tytuł artykułu. Debiuty Studenckie. Wydawnictwo Uniwersytetu Ekonomicznego we Wrocławiu.",
    );
  });

  it("formats a multi-author publication without ISBN", () => {
    const p: Publication = {
      title: "Tytuł artykułu",
      authors: ["Kowalski, J.", "Nowak, A."],
      year: 2024,
    };
    expect(formatCitation(p)).toBe(
      "Kowalski, J., Nowak, A. (2024). Tytuł artykułu. Debiuty Studenckie. Wydawnictwo Uniwersytetu Ekonomicznego we Wrocławiu.",
    );
  });

  it("appends ISBN when present", () => {
    const p: Publication = {
      title: "Tytuł artykułu",
      authors: ["Kowalski, J."],
      year: 2024,
      isbn: "978-83-1234-567-8",
    };
    expect(formatCitation(p)).toBe(
      "Kowalski, J. (2024). Tytuł artykułu. Debiuty Studenckie. Wydawnictwo Uniwersytetu Ekonomicznego we Wrocławiu. ISBN 978-83-1234-567-8.",
    );
  });

  it("formats a three-author publication with ISBN", () => {
    const p: Publication = {
      title: "Inny tytuł",
      authors: ["Zielińska, M.", "Dąbrowski, P.", "Lewandowski, T."],
      year: 2023,
      isbn: "978-83-0000-000-0",
    };
    expect(formatCitation(p)).toBe(
      "Zielińska, M., Dąbrowski, P., Lewandowski, T. (2023). Inny tytuł. Debiuty Studenckie. Wydawnictwo Uniwersytetu Ekonomicznego we Wrocławiu. ISBN 978-83-0000-000-0.",
    );
  });
});
