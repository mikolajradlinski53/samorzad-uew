# WCAG 2.1 AA Audit + Fixes — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Audit the whole public site against WCAG 2.1 AA (axe scan + manual code review), fix everything fixable in code, keep an `npm run test:a11y` regression guard, and update the accessibility declaration.

**Architecture:** Instrument (Playwright + axe on the built app) → scan → manual review (keyboard/semantics/contrast-by-computation) → fix in thematic batches until the scan is green → report + declaration update. Findings drive Tasks 4–5, so those are procedural rather than pre-coded.

**Tech Stack:** `@playwright/test`, `@axe-core/playwright` (devDeps; chromium only), existing Vitest untouched. Route list = the same exported source `src/app/sitemap.ts` consumes from `src/lib/searchIndex.ts` (read both to get the exact export name). Theme toggling via next-themes localStorage key (verify the key in `ThemeProvider`).

**Constraints:** Never touch/stage `src/lib/people.ts` (pre-existing user change). Branch `feat/wcag-audit`. Windows: playwright browser install ~150 MB — chromium only (`npx playwright install chromium`).

---

## Task 1: Tooling — Playwright + axe + a11y spec

**Files:** `package.json`, create `playwright.config.ts`, create `tests/a11y.spec.ts`, `.gitignore`

- [ ] **Step 1:** `npm i -D @playwright/test @axe-core/playwright` then `npx playwright install chromium`.
- [ ] **Step 2:** Create `playwright.config.ts`:

```ts
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  timeout: 60_000,
  fullyParallel: true,
  use: { baseURL: "http://localhost:3000" },
  webServer: {
    command: "npm run start",
    url: "http://localhost:3000/pl",
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
```

- [ ] **Step 3:** Create `tests/a11y.spec.ts`. Read `src/lib/searchIndex.ts` + `src/app/sitemap.ts` first and import the exported route list (same source sitemap uses; skip external hrefs and `#`-fragment entries). Structure:

```ts
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
// import { <the exported list> } from "../src/lib/searchIndex";

const TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"];
// FULL matrix pages (heavy/representative):
const HEAVY = ["/", "/stypendia", "/dla-studenta", "/kontakt", "/szukaj"];

async function scan(page: import("@playwright/test").Page) {
  const results = await new AxeBuilder({ page }).withTags(TAGS).analyze();
  expect(
    results.violations,
    results.violations.map((v) => `${v.id}: ${v.nodes.length}× — ${v.help}`).join("\n"),
  ).toEqual([]);
}
```

Generate tests: every internal route → PL/light/desktop scan; for HEAVY routes additionally: EN (`/en...`), dark theme (before `goto`: `page.addInitScript` setting the next-themes localStorage key to `"dark"` — verify key name in `src/components/ThemeProvider.tsx`), and mobile viewport (`page.setViewportSize({ width: 375, height: 812 })`). Name tests so failures identify route+variant.

- [ ] **Step 4:** Add scripts to `package.json`: `"test:a11y": "playwright test tests/a11y.spec.ts"` (document in the script name/comment that `npm run build` must run first). Add `playwright-report/` and `test-results/` to `.gitignore`.
- [ ] **Step 5:** `npm run build` then `npm run test:a11y` — the suite MUST run end-to-end (failures are EXPECTED findings, not task failure; a crash/timeout is task failure). Commit:

```bash
git add package.json package-lock.json playwright.config.ts tests/a11y.spec.ts .gitignore
git commit -m "feat: a11y scan harness (Playwright + axe, all routes, theme/viewport matrix)"
```

## Task 2: Automated scan → raw findings

- [ ] Run the full suite; collect every distinct violation (rule id, WCAG criterion, impact, affected routes/selectors) into `docs/a11y/findings-raw.md`, grouped by rule, ranked critical→minor. Do NOT fix anything yet. Verify each finding is real (open the page HTML if unsure); mark suspected false-positives with justification. Commit the findings file.

## Task 3: Manual review → additional findings

- [ ] **Contrast by computation:** write a throwaway Node script (scratch, not committed) that parses the token hex values from `src/app/globals.css` (light + dark blocks) and computes WCAG contrast ratios for the realistic pairs (ink-primary/secondary/tertiary × bg-base/surface/elevated; accent on bg-base/surface; bg-base text on accent). Append failures (<4.5:1 normal text, <3:1 large/UI) to findings.
- [ ] **Code checklist review** (read components; append findings with file:line): keyboard operability + visible focus (Nav dropdowns, SearchCommand, HubNav, calculator selects/inputs, MapEmbed/VideoEmbed facades, mobile menu trap), heading hierarchy per page (one h1, no level skips), landmarks, `aria-expanded/current/live` correctness, alt texts, reduced-motion coverage (grep `useReducedMotion` vs all `motion.` usages + CSS animations), touch target sizes (<24px controls), form error associations.
- [ ] Commit updated `docs/a11y/findings-raw.md`.

## Task 4: Fixes (batched, until green)

- [ ] Fix all code-fixable findings in thematic commits (e.g. `fix(a11y): contrast tokens`, `fix(a11y): heading hierarchy`, `fix(a11y): keyboard/focus`). Rules: minimal diffs; token changes must respect DESIGN.md (if a brand color pair fails contrast, adjust the token's shade minimally and note it in the report — do NOT redesign); findings needing user content (e.g. future photos' alts) are deferred, listed in the report. After each batch re-run `npm run test:a11y`. End state: **suite green** (any axe rule consciously disabled must have a written justification in the report — avoid unless truly false-positive).

## Task 5: Report + declaration + final verification

- [ ] Write `docs/a11y/AUDIT-2026-07.md`: methodology, findings table (rule, WCAG SC, impact, status fixed/deferred/false-positive+why), the contrast computation results, deferred-content list, recommendation for a real screen-reader session (NVDA) as follow-up.
- [ ] Update the accessibility declaration content (`deklaracja` namespace in `messages/pl.json` + `en.json`): review date (2026-07-30), method (self-assessment supported by automated tooling), compliance status consistent with the audit outcome. Keep PL/EN parity.
- [ ] Final: `npm test` (21/21), `npm run lint` (only known benign warning), `npm run build` clean, `npm run test:a11y` green. Commit report + declaration.

---

## Self-Review notes

Spec coverage: harness+matrix (T1), scan (T2), manual incl. computed contrast (T3), fixes-until-green with brand guardrail (T4), report+declaration+guard (T5). Out of scope honored (screen reader, PDFs, CI wiring). Findings-driven tasks are procedural by necessity; tooling code is concrete.
