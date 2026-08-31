import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { searchIndex } from "../src/lib/searchIndex";

// axe analizuje CAŁE drzewo strony w przeglądarce, a najcięższe trasy (strona
// główna z murem kilkunastu kadrów) przy równoległych procesach przekraczały
// domyślne 60 s — i to nie było naruszenie, tylko timeout samej analizy.
// Podnosimy limit, zamiast osłabiać skan albo wyłączać trasy z zestawu.
test.describe.configure({ timeout: 120_000 });

const TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"];

// Same route source sitemap.ts consumes. Fragment-only entries (e.g.
// "/stypendia#kalkulator") point at a section of an already-listed page, not a
// distinct document — skip them (mirrors sitemap.ts's own filter). All hrefs in
// searchIndex are internal (no external links live there), so no external-href
// filtering is needed beyond that.
const ROUTES = [...new Set(searchIndex.map((s) => s.href).filter((href) => !href.includes("#")))];

// FULL matrix pages (heavy/representative: home, high-traffic hubs, contact form, search).
const HEAVY = ["/", "/stypendia", "/dla-studenta", "/kontakt", "/szukaj"];

// next-themes default storageKey (ThemeProvider.tsx passes no `storageKey` prop,
// and next-themes defaults it to "theme"; attribute="class" toggles <html class="dark">).
const THEME_STORAGE_KEY = "theme";

function plPath(href: string): string {
  return `/pl${href === "/" ? "" : href}`;
}
function enPath(href: string): string {
  return `/en${href === "/" ? "" : href}`;
}

// Most components in this codebase gate their entrance/scroll animations behind
// `useReducedMotion` (see src/components/*.tsx). Without forcing reduced motion,
// axe can catch elements mid fade-in/transform — e.g. still-transparent text —
// and report transient, non-representative contrast violations, making scan
// results flaky across runs. Emulating reduced motion + waiting for network
// idle settles the DOM into its final state before each scan, so findings are
// deterministic and reflect the actual rendered page, not animation timing.
async function goto(page: import("@playwright/test").Page, path: string) {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(path);
  await page.waitForLoadState("networkidle");
}

async function scan(page: import("@playwright/test").Page) {
  const results = await new AxeBuilder({ page }).withTags(TAGS).analyze();
  expect(
    results.violations,
    results.violations.map((v) => `${v.id}: ${v.nodes.length}× — ${v.help}`).join("\n"),
  ).toEqual([]);
}

test.describe("a11y — PL / light / desktop (all routes)", () => {
  for (const href of ROUTES) {
    test(`PL light desktop: ${href}`, async ({ page }) => {
      await goto(page, plPath(href));
      await scan(page);
    });
  }
});

test.describe("a11y — EN / light / desktop (heavy routes)", () => {
  for (const href of HEAVY) {
    test(`EN light desktop: ${href}`, async ({ page }) => {
      await goto(page, enPath(href));
      await scan(page);
    });
  }
});

test.describe("a11y — PL / dark / desktop (heavy routes)", () => {
  for (const href of HEAVY) {
    test(`PL dark desktop: ${href}`, async ({ page }) => {
      await page.addInitScript(
        (key) => window.localStorage.setItem(key, "dark"),
        THEME_STORAGE_KEY,
      );
      await goto(page, plPath(href));
      await scan(page);
    });
  }
});

test.describe("a11y — PL / light / mobile 375x812 (heavy routes)", () => {
  for (const href of HEAVY) {
    test(`PL light mobile375: ${href}`, async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 });
      await goto(page, plPath(href));
      await scan(page);
    });
  }
});
