# Wyszukiwarka pełnotreściowa — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `⌘K` search the site's actual content (not just 31 page titles), returning the matching passage plus a link to its section — using the translations next-intl already loads client-side.

**Architecture:** Pure, unit-tested logic in `src/lib/knowledge.ts` (flatten translations → passages, diacritic-insensitive search, ranking). `SearchCommand.tsx` gains a "W treści" results section fed by those functions via `useMessages()`. No build step, no fetch, no new payload.

**Tech Stack:** next-intl (`useMessages`), Vitest, existing `SearchCommand` (client component). No new dependencies.

**Constraints:** Never touch/stage `src/lib/people.ts` (pre-existing user change). Branch `feat/content-search`.

---

## Task 1: `knowledge.ts` — passages + search (TDD)

**Files:** Create `src/lib/knowledge.ts`, `src/lib/knowledge.test.ts`

- [ ] **Step 1: Write the failing test** — `src/lib/knowledge.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { buildPassages, searchPassages, normalize, type Passage } from "./knowledge";

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
  const passages = buildPassages(messages, "pl");

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
  const passages = buildPassages(messages, "pl");

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
```

- [ ] **Step 2: Run and confirm FAIL** — `npm test -- knowledge` → cannot resolve `./knowledge`.

- [ ] **Step 3: Implement `src/lib/knowledge.ts`:**

```ts
/**
 * Wyszukiwanie po TREŚCI strony (nie tylko po tytułach). Korzysta z tłumaczeń,
 * które next-intl i tak ładuje do przeglądarki — bez pobierania indeksu.
 *
 * Ten moduł jest też fundamentem pod przyszłego asystenta AI: buduje korpus
 * i mapowanie fragment → źródłowa sekcja.
 */

export interface Passage {
  text: string;
  namespace: string;
  href: string;
  label: string;
}

export interface Hit {
  passage: Passage;
  score: number;
  /** Indeks pierwszego trafienia w znormalizowanym tekście (do podświetlenia). */
  index: number;
}

/** Namespace i18n → dokąd prowadzi jego treść. Bez wpisu = nie indeksujemy. */
const NAMESPACE_ROUTES: Record<string, { href: string; label: string }> = {
  stypendia: { href: "/stypendia", label: "Stypendia i wsparcie" },
  stypRektora: { href: "/stypendia#rektora", label: "Stypendium Rektora" },
  stypSocjalne: { href: "/stypendia#socjalne", label: "Stypendium socjalne" },
  stypNiepelnosprawni: { href: "/stypendia#niepelnosprawni", label: "Stypendium dla osób z niepełnosprawnością" },
  zapomoga: { href: "/stypendia#zapomoga", label: "Zapomoga" },
  wsparcie: { href: "/stypendia#wsparcie", label: "Wsparcie materialne" },
  kalkulator: { href: "/stypendia#kalkulator", label: "Kalkulator średniej" },
  prawaStudenta: { href: "/prawa-studenta", label: "Prawa studenta" },
  prawo: { href: "/prawo-dla-studenta", label: "Prawo dla studenta" },
  rzecznik: { href: "/rzecznik-praw-studenta", label: "Rzecznik Praw Studenta" },
  dlaStudenta: { href: "/dla-studenta", label: "Strefa studenta" },
  pomoc: { href: "/pomoc-psychologiczna", label: "Pomoc psychologiczna" },
  infopacki: { href: "/infopacki", label: "Infopacki" },
  mapa: { href: "/mapa-kampusu", label: "Mapa kampusu" },
  organizacje: { href: "/organizacje-studenckie", label: "Organizacje studenckie" },
  kalendarz: { href: "/kalendarz", label: "Kalendarz" },
  kontakt: { href: "/kontakt", label: "Kontakt" },
  naszaDzialalnosc: { href: "/nasza-dzialalnosc", label: "Nasza działalność" },
  struktura: { href: "/struktura-samorzadu", label: "Struktura Samorządu" },
  przewodniczacy: { href: "/przewodniczacy-i-wiceprzewodniczacy", label: "Przewodniczący" },
  russ: { href: "/rada-uczelniana-samorzadu-studentow", label: "RUSS" },
  skw: { href: "/studencka-komisja-wyborcza", label: "Komisja Wyborcza" },
  transparentnosc: { href: "/transparentnosc", label: "Transparentność" },
  regulacje: { href: "/regulacje-wewnetrzne", label: "Regulacje wewnętrzne" },
  zarzadzenia: { href: "/zarzadzenia-przewodniczacego", label: "Zarządzenia" },
  naszeProjekty: { href: "/nasze-projekty", label: "Nasze projekty" },
  rekrutacja: { href: "/rekrutacja", label: "Rekrutacja" },
  fuePsrp: { href: "/fue-i-psrp", label: "FUE i PSRP" },
  partnerzy: { href: "/partnerzy", label: "Partnerzy" },
  wspolpracuj: { href: "/wspolpracuj-z-nami", label: "Współpracuj z nami" },
  wladze: { href: "/wladze-rektorskie", label: "Władze rektorskie" },
  dziekani: { href: "/dziekan-i-prodziekani", label: "Dziekani" },
  prywatnosc: { href: "/prywatnosc", label: "Polityka prywatności" },
  deklaracja: { href: "/deklaracja-dostepnosci", label: "Deklaracja dostępności" },
};

/** Klucze techniczne — nie są treścią dla czytelnika. */
const SKIP_KEY = /^(meta|og|aria|crumb|hub|nav|label|submit|err|placeholder)/i;
const MIN_LENGTH = 40;

/** Bez ogonków, bez wielkości liter — żeby „srednia" znalazło „średnią". */
export function normalize(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/ł/gi, "l")
    .toLowerCase();
}

export function buildPassages(messages: unknown, _locale: string): Passage[] {
  const out: Passage[] = [];
  if (!messages || typeof messages !== "object") return out;

  for (const [namespace, value] of Object.entries(messages as Record<string, unknown>)) {
    const route = NAMESPACE_ROUTES[namespace];
    if (!route) continue;
    collect(value, namespace, route, out);
  }
  return out;
}

function collect(
  node: unknown,
  namespace: string,
  route: { href: string; label: string },
  out: Passage[],
  key = "",
): void {
  if (typeof node === "string") {
    if (node.length >= MIN_LENGTH && !SKIP_KEY.test(key)) {
      out.push({ text: node, namespace, href: route.href, label: route.label });
    }
    return;
  }
  if (Array.isArray(node)) {
    node.forEach((item) => collect(item, namespace, route, out, key));
    return;
  }
  if (node && typeof node === "object") {
    for (const [k, v] of Object.entries(node as Record<string, unknown>)) {
      collect(v, namespace, route, out, k);
    }
  }
}

export function searchPassages(passages: Passage[], query: string, limit = 6): Hit[] {
  const q = normalize(query.trim());
  if (q.length < 3) return [];
  const words = q.split(/\s+/).filter((w) => w.length >= 3);
  if (words.length === 0) return [];

  const hits: Hit[] = [];
  for (const passage of passages) {
    const hay = normalize(passage.text);
    const phraseAt = hay.indexOf(q);
    const matched = words.filter((w) => hay.includes(w));
    if (phraseAt === -1 && matched.length === 0) continue;

    // Fraza bije rozsypane słowa; więcej trafionych słów = wyżej.
    const score = (phraseAt >= 0 ? 100 : 0) + matched.length * 10 - passage.text.length / 1000;
    const index = phraseAt >= 0 ? phraseAt : hay.indexOf(matched[0]);
    hits.push({ passage, score, index });
  }

  return hits.sort((a, b) => b.score - a.score).slice(0, limit);
}

/** Wycinek ~160 znaków wokół trafienia, do pokazania w wynikach. */
export function excerpt(text: string, index: number, radius = 80): string {
  const start = Math.max(0, index - radius);
  const end = Math.min(text.length, index + radius);
  return (start > 0 ? "…" : "") + text.slice(start, end).trim() + (end < text.length ? "…" : "");
}
```

- [ ] **Step 4: Run tests** — `npm test -- knowledge` → PASS; then full `npm test` → all green.
- [ ] **Step 5: Verify** — `npx tsc --noEmit` clean, `npm run lint` clean.
- [ ] **Step 6: Commit**

```bash
git add src/lib/knowledge.ts src/lib/knowledge.test.ts
git commit -m "feat: content passages + diacritic-insensitive search over site copy"
```

---

## Task 2: Wire content results into `⌘K`

**Files:** Modify `src/components/SearchCommand.tsx`, `messages/pl.json`, `messages/en.json`

- [ ] **Step 1: Read `SearchCommand.tsx` fully first.** Note how it: gets the query state, filters `searchIndex` sources, renders grouped results, handles keyboard navigation (arrow keys / Enter) and the active-index state, and closes on select. The content section must join the SAME keyboard navigation list — do not create a second independent index.

- [ ] **Step 2: Add i18n labels** — in BOTH `messages/pl.json` and `messages/en.json`, inside the namespace `SearchCommand` uses (find it — likely `search` or `nav`), add:
  - PL: `"inContent": "W treści"`
  - EN: `"inContent": "In page content"`
  Keep PL/EN key sets identical.

- [ ] **Step 3: Compute content hits** — in `SearchCommand.tsx`:

```tsx
import { useMessages } from "next-intl";
import { buildPassages, searchPassages, excerpt } from "@/lib/knowledge";

// inside the component:
const messages = useMessages();
const locale = useLocale(); // if not already present
const passages = useMemo(() => buildPassages(messages, locale), [messages, locale]);
const contentHits = useMemo(() => searchPassages(passages, query, 5), [passages, query]);
```

- [ ] **Step 4: Render the section** — below the existing page results, when `contentHits.length > 0`, render a group headed by the `inContent` label. Each row: the excerpt (`excerpt(hit.passage.text, hit.index)`) as the primary line in `text-ink-secondary`, and `hit.passage.label` as a small mono/uppercase source line in `text-ink-tertiary`. Selecting a row navigates to `hit.passage.href` and closes the palette — mirror exactly how existing rows navigate (same `Link`/router call, same close handler).

- [ ] **Step 5: Keyboard navigation** — extend the existing flat list of selectable items so content hits come after page hits and share one active index. Verify by reading the current implementation: if it builds an array of results and tracks `activeIndex`, append content hits to that array rather than tracking a separate index.

- [ ] **Step 6: Verify** — JSON parity check (`node -e "const a=Object.keys(require('./messages/pl.json').<ns>).sort(),b=Object.keys(require('./messages/en.json').<ns>).sort();console.log(JSON.stringify(a)===JSON.stringify(b))"` → `true`); `npx tsc --noEmit` clean; `npm run lint` clean; `npm run build` succeeds.

- [ ] **Step 7: Commit**

```bash
git add src/components/SearchCommand.tsx messages/pl.json messages/en.json
git commit -m "feat: ⌘K searches page content, not just titles"
```

---

## Task 3: Verification

- [ ] `npm test` → all pass (previous suites + knowledge).
- [ ] `npm run lint` → only the known benign `exhaustive-deps` warning in the calculator.
- [ ] `npm run build` → clean.
- [ ] Manual checks to hand the user: open `⌘K`, type "stypendium rektora" / "srednia" (no diacritics) / "poprawa oceny" → content section appears with an excerpt and source; Enter navigates to the right section; arrow keys move through both sections; empty/short query shows no content section; works in `/en`.
- [ ] Commit any small fix.

---

## Self-Review notes

Spec coverage: passages + route mapping + skip rules (T1), diacritic-insensitive ranked search (T1), `⌘K` section with excerpt + source + shared keyboard nav (T2), verification (T3). Out of scope respected (no AI layer, no PDFs, no visual redesign). `NAMESPACE_ROUTES` intentionally explicit — unmapped namespaces are skipped rather than guessed, so a wrong link is impossible.
