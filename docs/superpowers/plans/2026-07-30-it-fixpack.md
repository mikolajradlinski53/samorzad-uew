# Pre-IT Fix-pack — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close the audit gaps before the IT-department demo: GDPR info clause under the contact form, click-to-load Google Maps (no Google requests before interaction), zero `metadataBase` build warnings, and migrate the deprecated `middleware` convention to `proxy` (Next 16).

**Architecture:** Four independent surgical fixes on branch `feat/it-fixpack`. The map facade (`MapEmbed`) mirrors the click-to-load pattern already designed for `VideoEmbed` (button placeholder → iframe on click). The RODO clause is pure i18n + one JSX block. Warnings are diagnosed at their actual source (root-level metadata routes), not papered over.

**Tech Stack:** Next.js 16 App Router, next-intl 4.13 (`src/middleware.ts` re-exports `createMiddleware`), Tailwind v4 tokens, `@phosphor-icons/react`, motion. No new deps.

**Verified context:**
- `src/components/pages/KontaktContent.tsx`: form ends with the submit `<button>` (~line 296–302); the Google Maps `<iframe>` sits below in a `ScrollReveal` block (~lines 309–320), `src="https://www.google.com/maps?q=ul.+Kamienna+43,+53-307+Wroc%C5%82aw&output=embed"`, `title={t("mapTitle")}`, class `block h-[360px] w-full border-0`.
- Root-level metadata files exist OUTSIDE `[locale]`: `src/app/opengraph-image.tsx`, `src/app/manifest.ts`, `src/app/robots.ts`, `src/app/sitemap.ts`. `metadataBase` is set only in `src/app/[locale]/layout.tsx` (`SITE_URL = "https://samorzad.ue.wroc.pl"`).
- Next 16 local doc for the new convention: `node_modules/next/dist/docs/01-app/01-getting-started/16-proxy.md` (AGENTS.md requires reading local docs before coding).
- Known-benign lint warning: `react-hooks/exhaustive-deps` in `KalkulatorSredniejContent.tsx` — ignore.
- Pre-existing unstaged `src/lib/people.ts` change is UNRELATED — never stage/commit it.

---

## File Structure

| File | Responsibility |
|------|----------------|
| `messages/pl.json`, `messages/en.json` (modify) | `kontakt.rodo*` clause keys + `kontakt.map*` facade labels. |
| `src/components/pages/KontaktContent.tsx` (modify) | Insert clause under submit; swap iframe → `<MapEmbed/>`. |
| `src/components/MapEmbed.tsx` (create) | Click-to-load Google Maps facade. |
| `src/app/opengraph-image.tsx` / `manifest.ts` / `robots.ts` / `sitemap.ts` (diagnose, modify as needed) | Kill `metadataBase` warnings at the source. |
| `src/middleware.ts` → `src/proxy.ts` (rename/adapt) | Next 16 proxy convention. |

---

## Task 1: RODO info clause under the contact form

**Files:** `messages/pl.json`, `messages/en.json`, `src/components/pages/KontaktContent.tsx`

- [ ] **Step 1: Read the privacy policy wording** — open `messages/pl.json`, namespace `prywatnosc` (key `sections`), and note the exact administrator wording used there (the data-controller name). Use the SAME entity name in the clause below (replace `Samorząd Studentów Uniwersytetu Ekonomicznego we Wrocławiu` only if the policy names a different administrator, e.g. the university).

- [ ] **Step 2: Add i18n keys** — in BOTH `messages/pl.json` and `messages/en.json`, inside the `kontakt` namespace add (keep PL/EN key sets identical):

PL:
```json
    "rodoIntro": "Administratorem danych osobowych podanych w formularzu jest Samorząd Studentów Uniwersytetu Ekonomicznego we Wrocławiu. Dane przetwarzamy wyłącznie w celu odpowiedzi na Twoją wiadomość (art. 6 ust. 1 lit. f RODO — prawnie uzasadniony interes). Masz prawo dostępu do danych, ich sprostowania i usunięcia. Szczegóły w",
    "rodoLink": "Polityce prywatności"
```
EN:
```json
    "rodoIntro": "The controller of the personal data submitted in this form is the Students' Union of Wroclaw University of Economics and Business. We process the data solely to reply to your message (Art. 6(1)(f) GDPR — legitimate interest). You have the right to access, rectify and erase your data. Details in the",
    "rodoLink": "Privacy Policy"
```

- [ ] **Step 3: Insert the clause** — in `KontaktContent.tsx`, add `import { Link } from "@/i18n/navigation";` (if not already imported) and place directly AFTER the closing `</button>` of the submit button (still inside the `<form>`):

```tsx
                <p className="mt-4 text-[0.75rem] leading-[1.6] text-ink-tertiary">
                  {t("rodoIntro")}{" "}
                  <Link href="/prywatnosc" className="underline decoration-border-medium underline-offset-2 transition-colors hover:text-ink-secondary">
                    {t("rodoLink")}
                  </Link>
                  .
                </p>
```

- [ ] **Step 4: Verify** — `node -e "const a=Object.keys(require('./messages/pl.json').kontakt).sort(),b=Object.keys(require('./messages/en.json').kontakt).sort();console.log(a.length,b.length,JSON.stringify(a)===JSON.stringify(b))"` → equal + `true`; `npx tsc --noEmit` + `npm run lint` clean.

- [ ] **Step 5: Commit**

```bash
git add messages/pl.json messages/en.json src/components/pages/KontaktContent.tsx
git commit -m "feat: GDPR info clause under contact form (PL/EN, links privacy policy)"
```

---

## Task 2: `MapEmbed` click-to-load facade

**Files:** create `src/components/MapEmbed.tsx`; modify `src/components/pages/KontaktContent.tsx`, `messages/pl.json`, `messages/en.json`

- [ ] **Step 1: i18n labels** — add to `kontakt` namespace in BOTH message files:

PL:
```json
    "mapLoad": "Pokaż mapę Google",
    "mapConsent": "Kliknięcie załaduje mapę od Google (Google może ustawić pliki cookie)."
```
EN:
```json
    "mapLoad": "Show Google Map",
    "mapConsent": "Clicking loads the map from Google (Google may set cookies)."
```

- [ ] **Step 2: Create `src/components/MapEmbed.tsx`**

```tsx
"use client";

import { useState } from "react";
import { MapPin } from "@phosphor-icons/react";

/**
 * Click-to-load dla Google Maps (ePrivacy): do kliknięcia zero żądań do Google —
 * tylko na-brand placeholder z adresem. Lustrzany wzorzec do VideoEmbed.
 */
export function MapEmbed({
  src,
  title,
  address,
  loadLabel,
  consentNote,
}: {
  src: string;
  title: string;
  address: string;
  loadLabel: string;
  consentNote: string;
}) {
  const [loaded, setLoaded] = useState(false);

  if (loaded) {
    return (
      <iframe
        title={title}
        src={src}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="block h-[360px] w-full border-0"
      />
    );
  }

  return (
    <div className="flex h-[360px] w-full flex-col items-center justify-center gap-4 bg-bg-elevated px-6 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-glow text-accent">
        <MapPin size={26} weight="regular" aria-hidden="true" />
      </span>
      <p className="text-[0.9375rem] font-medium text-ink-primary">{address}</p>
      <button
        type="button"
        onClick={() => setLoaded(true)}
        className="inline-flex h-11 items-center rounded-lg bg-accent px-6 text-[0.9375rem] font-medium text-bg-base transition-all hover:bg-accent-dim active:scale-[0.98]"
      >
        {loadLabel}
      </button>
      <p className="max-w-[40ch] text-[0.75rem] leading-[1.5] text-ink-tertiary">{consentNote}</p>
    </div>
  );
}
```

- [ ] **Step 3: Swap in `KontaktContent.tsx`** — import `{ MapEmbed } from "../MapEmbed";` and replace the `<iframe ... />` inside the map `ScrollReveal` block (keep the outer rounded/border wrapper `div`) with:

```tsx
          <MapEmbed
            src="https://www.google.com/maps?q=ul.+Kamienna+43,+53-307+Wroc%C5%82aw&output=embed"
            title={t("mapTitle")}
            address={`${t("addr1")}, ${t("addr2")}`}
            loadLabel={t("mapLoad")}
            consentNote={t("mapConsent")}
          />
```

- [ ] **Step 4: Verify** — i18n parity check (as Task 1); `npx tsc --noEmit` + lint clean; `grep -n "google.com/maps" src/components/pages/KontaktContent.tsx src/components/MapEmbed.tsx` shows the URL only as the `src` prop / iframe target (rendered only after click).

- [ ] **Step 5: Commit**

```bash
git add src/components/MapEmbed.tsx src/components/pages/KontaktContent.tsx messages/pl.json messages/en.json
git commit -m "feat: click-to-load Google Maps facade (no Google requests before click)"
```

---

## Task 3: Eliminate `metadataBase` warnings (+ verify root OG)

**Files:** diagnose `src/app/opengraph-image.tsx`, `src/app/manifest.ts`, `src/app/robots.ts`, `src/app/sitemap.ts`; modify whichever emits the warning

- [ ] **Step 1: Reproduce + attribute** — run `npm run build 2>&1 | grep -i metadatabase -B2 -A2` and identify WHICH routes emit the ×4 warnings (they print near the route being generated). Candidates: root-level metadata routes (outside `[locale]`, so the `[locale]/layout.tsx` `metadataBase` does not apply to them).

- [ ] **Step 2: Fix at the source** — the standard fix for root-level routes: export metadata with `metadataBase` from a root layout or set absolute URLs directly in those files. Choose the minimal correct fix for what Step 1 shows, e.g. if the warnings come from `opengraph-image.tsx`-adjacent metadata resolution, add the absolute `SITE_URL` where relative URLs are produced (`https://samorzad.ue.wroc.pl`, already the constant in `[locale]/layout.tsx` — extract it to `src/lib/site.ts` as `export const SITE_URL = "https://samorzad.ue.wroc.pl";` and import it in both places if that avoids duplication). Do NOT create a root `layout.tsx` unless the build proves it is required (it can conflict with the `[locale]` root layout).

- [ ] **Step 3: Verify OG** — after the fix, `npm run build 2>&1 | grep -ic metadatabase` → `0`. Confirm `opengraph-image` still appears in the build output for the root, and (from the built output/headers) resolves to an absolute `https://samorzad.ue.wroc.pl/...` URL.

- [ ] **Step 4: Commit**

```bash
git add -A -- src/app src/lib
git commit -m "fix: resolve metadataBase warnings at root metadata routes"
```
(Ensure `src/lib/people.ts` is NOT included — `git status` first; stage files explicitly if needed.)

---

## Task 4: Migrate `middleware` → `proxy` (Next 16)

**Files:** `src/middleware.ts` → `src/proxy.ts` (per docs)

- [ ] **Step 1: READ THE LOCAL DOC FIRST** — `node_modules/next/dist/docs/01-app/01-getting-started/16-proxy.md` (and search `node_modules/next/dist/docs` for "proxy" convention details: file name, export name, matcher config). AGENTS.md mandates this. Note exactly: expected filename/location, whether the export is default function named differently, and how `config.matcher` carries over.

- [ ] **Step 2: Check next-intl compatibility** — the current `src/middleware.ts` is:

```ts
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
```

The migration should be mechanical (same function, new convention). If the doc reveals the proxy convention needs a different signature that `createMiddleware`'s return doesn't satisfy, or the build/i18n breaks and can't be fixed within this task → **STOP, report BLOCKED** (we consciously keep the deprecation warning until next-intl catches up). Do not hack.

- [ ] **Step 3: Migrate** — per the doc (typically: rename to `src/proxy.ts`, keep the default export and `config`). `git rm src/middleware.ts` + add the new file, adjusting only what the doc requires.

- [ ] **Step 4: Verify** — `npm run build 2>&1 | grep -i -c "middleware.*deprecat"` → `0`; build succeeds; then `npm run dev` briefly (background) + `curl -sI http://localhost:3000/` → expect a redirect/rewrite to `/pl` (i18n routing alive), and `curl -s http://localhost:3000/pl/ | head -c 200` returns HTML. Kill the dev server after.

- [ ] **Step 5: Commit**

```bash
git add src/proxy.ts
git rm --cached src/middleware.ts 2>/dev/null; git add -u src
git commit -m "chore: migrate middleware to Next 16 proxy convention"
```

---

## Task 5: Final verification

- [ ] **Step 1:** `npm test` → 21/21.
- [ ] **Step 2:** `npm run lint` → clean except known `exhaustive-deps` warning.
- [ ] **Step 3:** `npm run build` → success; **zero** `metadataBase` warnings; **zero** middleware deprecation warnings (or documented BLOCKED from Task 4); route count unchanged (~88).
- [ ] **Step 4:** Manual checks deferred to user (browser): RODO clause renders PL+EN and the privacy link navigates; map shows placeholder, no google.com requests in Network until click, then loads; keyboard operability of the map button.
- [ ] **Step 5:** Commit any small fixes.

---

## Self-Review notes (author)

- **Spec coverage:** clause (T1), MapEmbed facade (T2), metadataBase + OG verify (T3), middleware→proxy with STOP condition (T4), acceptance criteria (T5). Out-of-scope items untouched.
- **No placeholders:** all code blocks complete; T3 is a diagnose-then-fix task by nature — the diagnostic command and fix options are explicit, with a guardrail against creating a conflicting root layout.
- **Type consistency:** `MapEmbed` props used in T2 Step 3 match the component definition; i18n keys `rodoIntro/rodoLink/mapLoad/mapConsent` consistent across steps.
