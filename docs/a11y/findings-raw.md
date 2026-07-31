# Raw automated a11y findings (axe scan)

**Source:** `npm run build && npm run test:a11y` (Playwright + `@axe-core/playwright`, tags
`wcag2a wcag2aa wcag21a wcag21aa`), run against the production build (`next start`).

**Matrix:** 45 scans total — all 30 internal routes at PL / light theme / desktop
(1280×720 default), plus the 5 "heavy" routes (`/`, `/stypendia`, `/dla-studenta`,
`/kontakt`, `/szukaj`) additionally scanned at EN / light / desktop, PL / dark /
desktop, and PL / light / mobile (375×812) — 15 extra scans, 45 total.

**Result:** 41 passed, 4 failed. Stable across 3 consecutive full runs (identical
pass/fail set and identical violation payload each time) — see "Methodology note
on flakiness" below for why that stability took a harness fix to achieve.

---

## Findings (grouped by rule, most severe first)

### 1. `aria-prohibited-attr` — Elements must only use permitted ARIA attributes

- **WCAG criterion:** 4.1.2 Name, Role, Value (Level A)
- **Impact:** serious
- **Axe rule doc:** https://dequeuniversity.com/rules/axe/4.12/aria-prohibited-attr
- **Occurrences:** 1 distinct element, hit in 4/4 variants of the `/` route
  (PL light desktop, EN light desktop, PL dark desktop, PL light mobile 375×812).
  Every "PL light desktop: /" run and every heavy-route variant of `/` fails
  identically — the element is unconditionally rendered on the homepage.
- **Element:** `<span class="inline-flex flex-wrap gap-[3px]" aria-label="ADAPCIAK 2026">`
  (selector `.gap-\[3px\]`)
- **Source:** `src/components/SplitFlap.tsx:27` — the outer `<span>` wrapping the
  split-flap character cells carries `aria-label={text}` but has no explicit
  `role`. Per the ARIA spec, `aria-label` is only permitted on elements with an
  ARIA role that supports naming (or on elements with an implicit role that
  supports naming); a bare `<span>` has no role, so the label is dropped by
  assistive tech and axe flags it as prohibited. Rendered on `/` via
  `src/components/NextEvent.tsx:87` (`<SplitFlap text={ev.name.toUpperCase()} .../>`,
  the "next event" countdown block on the homepage).
- **Verified real:** yes — inspected `SplitFlap.tsx` source directly. Each
  character is rendered as its own `aria-hidden="true"` cell purely for visual
  effect; the outer span is the only accessible-name carrier for the string,
  and it needs a role (e.g. `role="img"` or `role="text"`) for that label to
  be exposed correctly. Not a false positive.
- **Not fixed in this task** (Task 2 is findings-only per plan; fix deferred to
  Task 4).

No other axe rule was violated anywhere in the 45-scan matrix.

---

## Suspected false positives

None in the final, stable harness output (see methodology note below for a
class of false positives that appeared *before* the harness was hardened, and
which no longer occur).

---

## Methodology note on flakiness (and why the harness forces reduced motion)

Early runs of the suite (before `tests/a11y.spec.ts` forced
`page.emulateMedia({ reducedMotion: "reduce" })` + `page.waitForLoadState("networkidle")`
before each scan) reported a much larger and *inconsistent* set of `color-contrast`
violations — different routes failed on different runs (e.g. `/kontakt`,
`/infopacki`, `/rzecznik-praw-studenta`, `/`, ~20 distinct failures on one run,
8 different ones on another).

Root cause: most content sections on this site are wrapped in
`ScrollReveal` (`src/components/ScrollReveal.tsx`), which uses
`motion.div` with `initial={{ opacity: 0, y: 20 }}` / `whileInView={{ opacity: 1, y: 0 }}`.
Axe was sometimes scanning the DOM while a section's entrance animation was
mid-flight or not yet triggered (e.g. below the fold, or the `whileInView`
IntersectionObserver hadn't fired yet in headless Chromium), so it measured
color contrast against a still-transparent (opacity < 1) foreground — a
transient rendering artifact, not a real contrast bug. This is a known class
of false positive when running axe against sites with scroll- or
mount-triggered animation.

`ScrollReveal` (and effectively every animated component in this codebase —
51 files call `useReducedMotion`) explicitly special-cases
`prefers-reduced-motion: reduce`: `initial={reduce ? false : {...}}`, i.e. with
reduced motion the element renders directly in its final, settled state with
no fade/transform and no viewport-gating. Forcing that media feature in the
harness (plus waiting for network idle) makes every scan observe the same
final DOM the animation would have produced, eliminating the timing
dependency. Three consecutive full-matrix runs after this fix produced byte-
identical pass/fail results and violation payloads, which is why the harness
keeps this as a permanent behavior (see `tests/a11y.spec.ts`, the `goto()`
helper) rather than a one-off workaround.

This does mean the harness cannot catch bugs that exist *only* during an
in-progress animation (e.g., contrast failing solely at 50% opacity by
design) — that class of issue is out of scope for an axe-based regression
guard and would need manual/visual review if ever suspected.

---

## Next steps (out of scope for this task)

- Task 3 (manual review): computed-contrast pass over `globals.css` tokens,
  keyboard/focus audit, heading hierarchy, landmarks, alt text, touch targets,
  form error associations.
- Task 4: fix `aria-prohibited-attr` in `SplitFlap.tsx` (add an appropriate
  `role` to the labelled wrapper) plus anything Task 3 turns up, then re-run
  `npm run test:a11y` to green.
