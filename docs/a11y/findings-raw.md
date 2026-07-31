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

---
---

# Manual review (Task 3) — findings

**Method:** (A) a throwaway Node script (not committed) parsed the light/dark
token hex values out of `src/app/globals.css` and computed WCAG 2.1
relative-luminance contrast ratios for every realistic token pair, plus a
handful of pairs found by grepping actual utility-class usage. (B) a
component-by-component read of the keyboard/focus, heading, landmark/ARIA,
alt-text, reduced-motion, touch-target, and form-error checklist from the
audit plan. FINDINGS ONLY — nothing below has been fixed (Task 4).

## A. Contrast by computation

Full table (all pairs computed; "4.5:1" = normal text threshold, "3:1" =
large text / UI-component-boundary threshold):

| Mode  | Pair                                                        | Ratio   | 4.5:1 | 3:1  |
|-------|--------------------------------------------------------------|---------|-------|------|
| light | ink-primary on bg-base                                        | 17.47:1 | PASS  | PASS |
| light | ink-primary on bg-surface                                     | 18.58:1 | PASS  | PASS |
| light | ink-primary on bg-elevated                                    | 16.53:1 | PASS  | PASS |
| light | ink-secondary on bg-base                                      | 7.23:1  | PASS  | PASS |
| light | ink-secondary on bg-surface                                   | 7.69:1  | PASS  | PASS |
| light | ink-secondary on bg-elevated                                  | 6.84:1  | PASS  | PASS |
| light | ink-tertiary on bg-base                                       | 4.89:1  | PASS  | PASS |
| light | ink-tertiary on bg-surface                                    | 5.20:1  | PASS  | PASS |
| light | ink-tertiary on bg-elevated                                   | 4.63:1  | PASS  | PASS |
| light | accent on bg-base (text/link)                                 | 5.55:1  | PASS  | PASS |
| light | accent on bg-surface (text/link)                              | 5.90:1  | PASS  | PASS |
| light | accent-dim on bg-base (text/link)                             | 7.21:1  | PASS  | PASS |
| light | accent-dim on bg-surface (text/link)                          | 7.66:1  | PASS  | PASS |
| light | bg-base text on accent (button/skip-link)                     | 5.55:1  | PASS  | PASS |
| light | **border-medium on bg-surface (UI boundary)**                 | **1.41:1** | **FAIL** | **FAIL** |
| light | **border-medium on bg-base (UI boundary)**                    | **1.41:1** | **FAIL** | **FAIL** |
| light | border-strong on bg-surface (form-control boundary)           | 3.43:1  | FAIL  | PASS |
| light | border-strong on bg-base (form-control boundary)              | 3.22:1  | FAIL  | PASS |
| light | ink-secondary on bg-subtle                                    | 6.12:1  | PASS  | PASS |
| light | ink-tertiary on bg-subtle *(token unused in components)*     | 4.14:1  | FAIL  | PASS |
| light | bg-base text on accent-dim (button hover state)               | 7.21:1  | PASS  | PASS |
| light | border-red-500 (Tailwind, not a token) on bg-base (form error)| 3.54:1  | FAIL  | PASS |
| dark  | ink-primary on bg-base                                        | 17.30:1 | PASS  | PASS |
| dark  | ink-primary on bg-surface                                     | 16.07:1 | PASS  | PASS |
| dark  | ink-primary on bg-elevated                                    | 14.50:1 | PASS  | PASS |
| dark  | ink-secondary on bg-base                                      | 7.90:1  | PASS  | PASS |
| dark  | ink-secondary on bg-surface                                   | 7.34:1  | PASS  | PASS |
| dark  | ink-secondary on bg-elevated                                  | 6.62:1  | PASS  | PASS |
| dark  | ink-tertiary on bg-base                                       | 5.45:1  | PASS  | PASS |
| dark  | ink-tertiary on bg-surface                                    | 5.06:1  | PASS  | PASS |
| dark  | ink-tertiary on bg-elevated                                   | 4.57:1  | PASS  | PASS |
| dark  | accent on bg-base (text/link)                                 | 5.91:1  | PASS  | PASS |
| dark  | accent on bg-surface (text/link)                              | 5.49:1  | PASS  | PASS |
| dark  | **accent-dim on bg-base (text/link)**                         | **4.03:1** | **FAIL** | PASS |
| dark  | **accent-dim on bg-surface (text/link)**                      | **3.75:1** | **FAIL** | PASS |
| dark  | bg-base text on accent (button/skip-link)                     | 5.91:1  | PASS  | PASS |
| dark  | **border-medium on bg-surface (UI boundary)**                 | **1.62:1** | **FAIL** | **FAIL** |
| dark  | **border-medium on bg-base (UI boundary)**                    | **1.55:1** | **FAIL** | **FAIL** |
| dark  | border-strong on bg-surface (form-control boundary)           | 3.63:1  | FAIL  | PASS |
| dark  | border-strong on bg-base (form-control boundary)              | 3.91:1  | FAIL  | PASS |
| dark  | ink-secondary on bg-subtle                                    | 5.68:1  | PASS  | PASS |
| dark  | ink-tertiary on bg-subtle *(token unused in components)*     | 3.92:1  | FAIL  | PASS |
| dark  | **bg-base text on accent-dim (button hover state)**           | **4.03:1** | **FAIL** | PASS |
| dark  | border-red-500 (Tailwind, not a token) on bg-base (form error)| 5.16:1  | PASS  | PASS |

Rows failing the *correct* threshold for how the pair is actually used are
bolded and promoted to findings below. `border-strong` and `border-red-500`
fail the 4.5:1 *text* column but that's the wrong bar for a border/UI
boundary — 1.4.11 requires 3:1, which they pass, so those rows are **not**
findings (they're shown for completeness / as the correct reference
implementation for finding #1).

### Finding C1 — `border-medium` fails Non-text Contrast (1.4.11) on every interactive control that uses it as its sole visible border

- **Severity:** Serious
- **WCAG SC:** 1.4.11 Non-text Contrast (AA)
- **Measured:** 1.41:1 (light, on bg-surface/bg-base) / 1.55–1.62:1 (dark) —
  needs ≥3:1 for a UI-component boundary or meaningful graphical object.
  `border-medium` is `rgba(11,19,34,0.16)` / `rgba(255,255,255,0.16)` — a
  subtle-divider token being reused as an interactive-control border.
- **Where (grep `border-border-medium` / `bg-border-medium`):**
  - `src/components/pages/KalkulatorSredniejContent.tsx:167,266,289,299,308`
    — the calculator's `<select>`/`<input>` boundaries (functionally the
    most important instance — these are real form controls a low-vision
    user needs to locate).
  - `src/components/Nav.tsx:221,256,377` — desktop search button, "Zaloguj"
    CTA (desktop + mobile).
  - `src/components/ConsentBanner.tsx:43`, `src/components/LanguageSwitcher.tsx:18`,
    `src/components/SearchCommand.tsx:124` (⌘K/ESC `kbd` hint),
    `src/app/[locale]/szukaj/page.tsx:58` (search input border).
  - `src/components/HubNav.tsx:61,84` and `src/components/SectionRail.tsx:59`
    — the inactive-state fill of the scroll-spy nav-dot/pill indicators
    (`bg-border-medium`) — a graphical object conveying nav position, also
    covered by 1.4.11.
  - Plus ~15 more outline-button/pill/dashed-placeholder instances across
    `DlaStudentaContent.tsx`, `MapaKampusuContent.tsx`,
    `KomisjaWyborczaContent.tsx`, `KalendarzContent.tsx`, `PrawaStudentaContent.tsx`,
    `OrganizacjeContent.tsx`, `RUSSContent.tsx`, `RekrutacjaContent.tsx`,
    `StrefaDzialaczaContent.tsx`, `StrukturaContent.tsx`, `StypendiaContent.tsx`,
    `StypendiumDetailContent.tsx`, `ZarzadzeniaContent.tsx`,
    `PartnerzyContent.tsx:250` (dashed-placeholder card — lowest priority,
    arguably decorative-only).
- **Why it matters:** several of these are functional form controls
  (calculator selects/inputs, search input) or the sole visual affordance
  that a pill/button/badge has a boundary at all — at 1.4:1 the border is
  essentially invisible against the background for low-vision users.
- **Reference fix already in the codebase:** `border-strong` (`#838B9A` /
  `#667085`) is defined specifically "for form-control boundaries — WCAG
  1.4.11" (see `globals.css:25,47`) and measures 3.22–3.91:1 (passes 3:1).
  `src/components/pages/KontaktContent.tsx:111` already uses it correctly
  for the contact-form input borders. Suggested fix: swap
  `border-border-medium` → `border-border-strong` wherever the border is
  the sole boundary of an interactive control or a meaningful graphical
  indicator; genuinely decorative dividers can keep `border-medium`.

### Finding C2 — `accent-dim` fails 1.4.3 Contrast (Minimum) as hover text-color and as button-hover text-on-background, dark theme only

- **Severity:** Moderate
- **WCAG SC:** 1.4.3 Contrast (Minimum), normal text (AA)
- **Measured (dark mode only — light mode passes at 7.21–7.66:1):**
  `accent-dim` text on `bg-base` = 4.03:1, on `bg-surface` = 3.75:1; and
  `bg-base`-colored button label text against an `accent-dim` background
  (the `:hover` state of every primary CTA) = 4.03:1 — all below 4.5:1.
- **Where:** ~25 `text-accent … hover:text-accent-dim` link instances (e.g.
  `ConsentBanner.tsx:28`, `NextEvent.tsx:103`, `Resources.tsx:63`,
  `Projects.tsx:34`, `KontaktContent.tsx:186`, `MapaKampusuContent.tsx:87`,
  `PrawaStudentaContent.tsx:109`, `StypendiumDetailContent.tsx:162`) and
  ~20 `bg-accent … hover:bg-accent-dim` primary-button instances (e.g.
  `Hero.tsx:127`, `MapEmbed.tsx:46`, `DlaStudentaContent.tsx:178`,
  `KontaktContent.tsx:301`, `RzecznikContent.tsx:87`, `WsparcieContent.tsx:105`,
  `StrefaDzialaczaContent.tsx:124`, `PartnerzyContent.tsx:133,141,305`).
- **Why it matters:** the failure only manifests transiently, on `:hover`,
  in dark theme — but a hover state is still a rendered state a sighted
  low-vision mouse user can pause on and needs to read (no SC exemption for
  hover-only text).
- **Suggested fix:** nudge `--accent-dim` in the `.dark` block slightly
  lighter (or reuse `--accent`, already 5.91/5.49:1, for the hover
  text-color case specifically) so the hover state clears 4.5:1.

### Finding C3 (informational, not a live bug) — `ink-tertiary` on `bg-subtle` fails 4.5:1, but the token pairing is currently unused

- **Severity:** Info / latent risk
- **WCAG SC:** 1.4.3 (would apply if used for text)
- **Measured:** 4.14:1 (light) / 3.92:1 (dark) — fails 4.5:1, passes 3:1.
- Grepped `bg-subtle`/`bg-bg-subtle` across `src/`: the token is defined in
  `globals.css` (`--bg-subtle` / `--color-bg-subtle`) but the Tailwind
  utility it produces (`bg-bg-subtle`) has zero usages in any component —
  every `text-ink-tertiary` instance in the codebase sits on
  `bg-base`/`bg-surface`/`bg-elevated`, all of which pass (see table). Not
  appended as an actionable finding since nothing renders it today; flagged
  so it isn't accidentally combined with `ink-tertiary` text in future work
  without re-checking contrast.

---

## B. Code checklist review

### Finding B1 — `SearchCommand.tsx` (⌘K palette) claims `aria-modal="true"` but has no focus trap

- **Severity:** Serious
- **WCAG SC:** 2.4.3 Focus Order (A); WAI-ARIA APG Dialog (Modal) pattern
- **File:** `src/components/SearchCommand.tsx:94–197` — the dialog only
  handles `Escape` in its `onKeyDown` (lines 53–68); there is no `Tab`/
  `Shift+Tab` wrap-around, so keyboard focus can leave the visually-modal
  dialog into the (still-present, non-inert) page behind it.
- **Contrast with the rest of the codebase:** both
  `src/components/Nav.tsx:104–123` (mobile menu) and
  `src/components/pages/PartnerzyContent.tsx:57–83` (`PartnerModal`)
  implement the correct first/last-focusable Tab-loop pattern — `SearchCommand`
  is the one dialog in the codebase missing it.
- **Suggested fix:** port the same Tab-wrap `keydown` handler used in those
  two components into `SearchCommand`'s dialog `useEffect`/`onKeyDown`.

### Finding B2 — `SearchCommand.tsx` "no results" state is not announced to screen readers

- **Severity:** Minor
- **WCAG SC:** 4.1.3 Status Messages (AA)
- **File:** `src/components/SearchCommand.tsx:130–133` — the "no results"
  `<p>` has no `aria-live` region (and isn't `role="status"`/`alert`), so a
  screen-reader user who types a query with zero matches gets no
  announcement that the result set changed.
- **Suggested fix:** add `aria-live="polite"` (or `role="status"`) to the
  results container / the "no results" message.

### Finding B3 — Calculator "remove row" button is well under the 24×24px touch-target minimum

- **Severity:** Minor
- **WCAG SC:** 2.5.8 Target Size (Minimum) (AA, WCAG 2.2 — checked here as
  good practice per the audit plan)
- **File:** `src/components/pages/KalkulatorSredniejContent.tsx:317–324` —
  the `<button aria-label={t("removeRow")}>` wrapping the `<Trash size={18}>`
  icon has no size/padding classes at all (`className="text-ink-tertiary
  transition-colors hover:text-accent"`), so its hit area is the bare
  18×18px SVG.
- **Suggested fix:** add padding or fixed `h-8 w-8`/`min-h-8 min-w-8` with
  flex-centering, matching the pattern used elsewhere (e.g. the 44×44px
  icon buttons in `Nav.tsx`/`Footer.tsx`).

### Finding B4 — `EconTicker.tsx` currency rates are entirely hidden from assistive technology, with no accessible equivalent

- **Severity:** Serious
- **WCAG SC:** 1.3.1 Info and Relationships / 4.1.2 Name, Role, Value (A);
  also relevant: 2.2.2 Pause, Stop, Hide (A)
- **File:** `src/components/EconTicker.tsx:58–84` +
  `src/components/Marquee.tsx:16–37` — the scrolling track (and its
  duplicated children, used for the seamless loop) carries
  `aria-hidden="true"` (`Marquee.tsx:30`). The wrapping
  `<section aria-label="Kursy walut NBP">` (`EconTicker.tsx:59`) therefore
  exposes an *empty* region to screen readers: none of the EUR/USD/GBP/…
  rates are ever announced, and there is no accessible list/table
  duplicating the same data anywhere else on the page.
  Separately, the marquee auto-scrolls continuously (28s loop) and can only
  be paused via `group-hover:[animation-play-state:paused]`
  (`Marquee.tsx:28`) — a mouse-only affordance, not reachable by
  keyboard-only users.
- **Not a false positive / not to be confused with:** `Marquee` is also used
  decoratively (and safely) in `Hero.tsx:176` (photos, `alt=""`, wrapped in
  an outer `aria-hidden="true"` div — pure decoration) and in
  `PartnerzyContent.tsx:245` (logo wall — the same partner list is
  duplicated in a real, non-hidden, keyboard-focusable button grid right
  below at `PartnerzyContent.tsx:264–283`, so no info is actually lost
  there). Only `EconTicker` has no accessible fallback.
- **Suggested fix:** render a visually-hidden (`sr-only`, *not*
  `aria-hidden`) list of the same rates alongside the marquee, and/or add a
  visible, keyboard-operable pause control per 2.2.2.

### Finding B5 — `ScrollProgress.tsx` is the one animated component in the codebase that doesn't branch on `useReducedMotion`

- **Severity:** Minor (informational — SC 2.3.3 Animation from Interactions
  is AAA, not required for the AA target; flagged for consistency)
- **WCAG SC:** 2.3.3 Animation from Interactions (AAA, not blocking) —
  raised because the rest of the codebase (51 of 52 files using
  `motion.`/`animate()`) explicitly commits to honoring
  `prefers-reduced-motion` everywhere else.
- **File:** `src/components/ScrollProgress.tsx:1–20` — the fixed top
  progress bar drives `scaleX` through a `useSpring` (stiffness/damping/mass)
  on top of raw scroll position, with no `useReducedMotion` check, unlike
  every other spring/transition in the codebase.
- **Suggested fix:** when reduced motion is requested, bind `scaleX`
  directly to `scrollYProgress` (skip the spring) or hide the bar.

### Checked and CLEAN (for coverage — no findings)

1. **Focus-visible styles are global and correct.** `src/app/globals.css:179–189`
   sets a 3px accent outline on `:focus-visible` site-wide and only
   suppresses the native ring for non-keyboard triggers
   (`:focus:not(:focus-visible)`). Skip-link at `globals.css:193–211`.
2. **No positive `tabIndex`** anywhere in `src/` (grepped `tabIndex={[1-9]`
   — zero matches).
3. **No `onClick` on bare `<div>`/`<span>`** anywhere in `src/` except one
   deliberate, non-essential case: the modal backdrop/scrim in
   `PartnerzyContent.tsx:92–96` (`<div onClick={onClose} aria-hidden="true">`)
   — acceptable, since `Escape` and a real `<button>` close control both
   already provide keyboard equivalents for the same action. Every other
   click handler in the codebase sits on a real `<button>`/`<a>`/`<Link>`.
4. **Nav.tsx mobile menu** (`Nav.tsx:97–130`) implements a correct
   Tab-loop focus trap, Escape-to-close, and focus restoration.
   **NavDropdown.tsx** desktop dropdowns are keyboard-operable via native
   button semantics + `Escape`-to-close-and-refocus (`NavDropdown.tsx:38–57`),
   with correct `aria-haspopup`/`aria-expanded`/`aria-controls`.
   **PartnerzyContent.tsx`'s `PartnerModal`** (`:51–150`) also implements a
   correct Tab-loop trap and auto-focuses its close button on open — this
   is the reference implementation Finding B1 should match.
5. **Heading hierarchy** audited on `/stypendia` specifically (flagged in
   the plan as "now a big composed hub"): `PageHero` h1 →
   `StypendiaContent` h2/h3 → 4× `StypendiumDetailContent` h2/h3 →
   `KalkulatorSredniejContent` (`sr-only` h2) → `WsparcieContent` h2/h3 →
   conditional video h2 → `Faq` h2. Single h1, no skipped levels across the
   whole composed page.
6. **Landmarks/ARIA:** `aria-expanded` (`NavDropdown`, `Nav` mobile
   accordion), `aria-current="page"`/`"true"` (`Nav`, `HubNav`,
   `SectionRail`, `LanguageSwitcher`), `aria-haspopup`, `role="dialog"`
   + `aria-modal` (`SearchCommand`, `PartnerModal`), `role="listbox"`/
   `"option"`/`combobox` (`SearchCommand`) are all applied correctly and
   consistently.
7. **The `aria-label`-on-a-non-labellable-element anti-pattern from the
   automated `SplitFlap.tsx` finding is a one-off**, not a class of bugs:
   grepped every `aria-label` usage in `src/` (~40 occurrences) — every
   other one sits on a `<nav>`, `<section>`, `<button>`, `<a>`/`<Link>`,
   `<input>`, or `<select>`, all role-bearing/name-capable elements.
8. **Alt text:** `PersonCard.tsx:52,100` uses `alt="${name} — ${role}"`
   (meaningful); `InitialsAvatar.tsx:24–31` fallback is correctly
   `aria-hidden="true"` (the name is always present as adjacent visible
   text, so no accessible-name loss); `NaszeProjektyContent.tsx:70` and
   `PartnerzyContent.tsx:255,277` logo/photo `alt`s are meaningful
   (project/partner name); `VideoEmbed.tsx:37` poster thumbnail is
   `alt=""` + `aria-hidden` (correctly decorative — the play button already
   carries `aria-label={title}` at line 34).
9. **Reduced motion:** 51 of 52 files using `motion.`/`animate()` (or CSS
   `@keyframes`) branch on `useReducedMotion()`/`prefers-reduced-motion`;
   the sole exception is Finding B5. Every CSS `@keyframes` block in
   `globals.css` (orb drift, marquee, chevron-bob, hero-grid, split-flap,
   pc-holo, view-transitions) has a matching
   `@media (prefers-reduced-motion: reduce)` override.
10. **`KontaktContent.tsx` form** (`:192–313`): every field has a proper
    `htmlFor`/`id` label pair, `aria-required`, `aria-invalid`,
    `aria-describedby` pointing at the matching error `id`, and each error
    `<p>` carries `role="alert"`; the success state carries `role="status"`
    (`:174`); the server-error banner carries `role="alert"` (`:290`); on a
    failed submit, focus is programmatically moved to the first
    `[aria-invalid="true"]` field (`:80–84`). The RODO/privacy clause
    (`:306–312`) is a plain paragraph in normal document flow after the
    submit button — reachable and readable by AT, not hidden or
    orphaned. Default field border correctly uses `border-border-strong`
    (`:111`), the passing token — this is the reference the Finding C1 fix
    should match.
