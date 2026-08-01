import { describe, expect, it } from "vitest";
import { buildPassages, searchPassages, normalize } from "./knowledge";

const messages = {
  stypendia: {
    metaTitle: "Stypendia",
    heroLead: "Wsparcie finansowe dla studentów Uniwersytetu Ekonomicznego we Wrocławiu.",
    sections: [
      { title: "Terminy", body: "Wniosek o stypendium rektora składasz do 15 października w USOSweb." },
    ],
  },
  stypRektora: {
    intro: "Stypendium Rektora przysługuje studentom z wysoką średnią ocen za poprzedni rok.",
  },
  nieznanyNamespace: {
    intro: "Ta treść nie ma przypisanej trasy, więc nie powinna trafić do indeksu wcale.",
  },
};

describe("normalize", () => {
  it("strips Polish diacritics and case", () => {
    expect(normalize("Stypendium Ą Ć Ę")).toBe(normalize("stypendium a c e"));
  });
});

describe("buildPassages", () => {
  const passages = buildPassages(messages);

  it("skips technical keys (meta*/og*/aria*)", () => {
    expect(passages.some((p) => p.text === "Stypendia")).toBe(false);
  });

  it("skips namespaces with no route mapping", () => {
    expect(passages.some((p) => p.namespace === "nieznanyNamespace")).toBe(false);
  });

  it("maps a namespace to its route and keeps long text", () => {
    const hit = passages.find((p) => p.text.includes("Wniosek o stypendium rektora"));
    expect(hit).toBeDefined();
    expect(hit!.href).toBe("/stypendia");
  });

  it("maps a section namespace to its anchor", () => {
    const hit = passages.find((p) => p.text.includes("wysoką średnią"));
    expect(hit!.href).toBe("/stypendia#rektora");
  });
});

describe("searchPassages", () => {
  const passages = buildPassages(messages);

  it("finds content when the query has no diacritics", () => {
    const hits = searchPassages(passages, "wniosek stypendium rektora", 5);
    expect(hits.length).toBeGreaterThan(0);
    expect(hits[0].passage.text).toContain("Wniosek o stypendium rektora");
  });

  it("ranks a full phrase above scattered words", () => {
    const hits = searchPassages(passages, "stypendium rektora", 5);
    expect(hits[0].passage.text).toContain("Wniosek o stypendium rektora");
  });

  it("returns [] for a query that matches nothing", () => {
    expect(searchPassages(passages, "zxqwv", 5)).toEqual([]);
  });

  it("respects the limit", () => {
    expect(searchPassages(passages, "stypendium", 1).length).toBeLessThanOrEqual(1);
  });
});
