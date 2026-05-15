---
phase: 04-samorz-d-projekty-partnerzy
verified: 2026-05-15T12:00:00Z
status: passed
score: 6/6 success criteria verified
re_verification: false
---

# Phase 4: Samorząd + Projekty + Partnerzy — Verification Report

**Phase Goal:** Wszystkie strony Samorządu z prawdziwymi danymi osobowymi, 9 projektów z opisami, regulacje z linkami PDF, strona współprac z logotypami partnerów
**Verified:** 2026-05-15
**Status:** passed
**Re-verification:** No — initial verification

---

## Goal Achievement

### Observable Truths (from ROADMAP.md Success Criteria)

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | /zarzad renders 9 MemberCard items (Radliński, Smereczniak, Stachowski, Tyrakowski, Vogel, Pytel, Woźniak, Hural, Stępień) | VERIFIED | `data/zarzad.ts` exports `zarzad` array with exactly 9 entries matching all 9 names; `zarzad/page.tsx` imports and renders via `<MemberGrid members={zarzad} />` |
| 2 | /rada-uczelniana renders 12 RUSS member cards + 3 GDrive links (Raporty, Uchwały, Zarządzenia) | VERIFIED | `data/zarzad.ts` exports `russ` array with 12 entries; `rada-uczelniana/page.tsx` imports `russ` and renders `<MemberGrid members={russ} columns={4} />`; 3 GDrive DocumentItem entries inline in page (lines 13-29) |
| 3 | /przewodniczacy-i-wiceprzewodniczacy renders Emilia Ćwiklińska + 3 Wiceprzewodniczących | VERIFIED | `data/zarzad.ts` exports `prezydium` array with exactly 4 entries (Ćwiklińska + Skoczylas, Szewczyk, Panas); page imports and renders `<MemberGrid members={prezydium} columns={2} />` |
| 4 | /nasze-projekty renders 9 project cards | VERIFIED | `data/projekty.ts` exports `projekty` array with exactly 9 items (ADAPCIAK, ANIMALIA, BAL UEW, DNI ADAPTACYJNE, GRADUETION, MOSTY EKONOMICZNE, TEST WIEDZY EKONOMICZNEJ, TEDxUEW, UE PARTY); page maps over array rendering `<ProjectCard>` for each |
| 5 | /regulacje-wewnetrzne renders 6 PDF document links via DocumentList | VERIFIED | `data/regulacje.ts` exports `regulacje` array with exactly 6 DocumentItem entries; all 6 hrefs use `samorzad.ue.wroc.pl/_files/ugd/3dec01_*` (Wix CDN); page renders `<DocumentList items={regulacje} />` |
| 6 | /wspolprace renders Karol Vogel MemberCard + disabled form + BNY strategic + 11 regular partners | VERIFIED | Page renders inline MemberCard with `name="Karol Vogel"` and `email="karol.vogel@samorzad.ue.wroc.pl"`; form button has `type="button" disabled aria-disabled="true"`; `partnerStrategiczny` = BNY; `partnerzy` array has 11 regular entries; both rendered via `<PartnerGrid>` |

**Score:** 6/6 truths verified

---

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `data/zarzad.ts` | prezydium (4) + zarzad (9) + russ (12) member arrays | VERIFIED | Exists, 41 lines, exports 3 typed arrays + Member interface |
| `data/projekty.ts` | 9 project cards | VERIFIED | Exists, 17 lines, exports `projekty` with 9 entries (title/tag/description) |
| `data/regulacje.ts` | 6 DocumentItem entries with Wix CDN hrefs | VERIFIED | Exists, 34 lines, exports `regulacje` with 6 items, all hrefs valid |
| `data/partnerzy.ts` | BNY strategic + 11 regular partners | VERIFIED | Exists, 25 lines, exports `partnerStrategiczny` (BNY) + `partnerzy` (11 entries) |
| `components/cards/ProjectCard.tsx` | Tag badge + display-lg title + description | VERIFIED | Exists, 25 lines, renders tag span, h3, p — no 'use client' |
| `components/sections/MemberGrid.tsx` | Responsive grid of MemberCard items | VERIFIED | Exists, 31 lines, accepts `columns={2|3|4}`, maps MemberCard |
| `components/sections/PartnerGrid.tsx` | Text-placeholder partner tiles | VERIFIED | Exists, 28 lines, renders name + strategic badge, TODO comment for future Image |
| `app/(public)/zarzad/page.tsx` | Zarząd page | VERIFIED | Exists, 49 lines, imports `zarzad` from data, renders MemberGrid |
| `app/(public)/rada-uczelniana/page.tsx` | RUSS page with 12 members + GDrive docs | VERIFIED | Exists, 95 lines, imports `russ` from data, inline GDrive DocumentList |
| `app/(public)/przewodniczacy-i-wiceprzewodniczacy/page.tsx` | Prezydium page (4 members) | VERIFIED | Exists, 50 lines, imports `prezydium`, renders MemberGrid |
| `app/(public)/nasze-projekty/page.tsx` | 9-project grid | VERIFIED | Exists, 41 lines, maps `projekty` over ProjectCard |
| `app/(public)/regulacje-wewnetrzne/page.tsx` | 6 PDF links | VERIFIED | Exists, 48 lines, renders DocumentList with `regulacje` |
| `app/(public)/wspolprace/page.tsx` | Contact + form + partners | VERIFIED | Exists, 146 lines, full implementation |
| `app/(public)/nasza-dzialalnosc/page.tsx` | Mission text page | VERIFIED | Exists, 55 lines, mission text present (not placeholder) |
| `app/(public)/struktura-samorzadu/page.tsx` | Organ navigation tiles | VERIFIED | Exists, 49 lines, 5 organy link tiles |
| `app/(public)/komisja-rewizyjna/page.tsx` | Placeholder stub | VERIFIED | Exists, 32 lines, "Treść tej strony jest w przygotowaniu" |
| `app/(public)/studencka-komisja-wyborcza/page.tsx` | Placeholder stub | VERIFIED | Exists, 32 lines, consistent placeholder pattern |
| `app/(public)/filia-jelenia-gora/page.tsx` | Placeholder stub | VERIFIED | Exists, 32 lines, consistent placeholder pattern |
| `app/(public)/nasi-partnerzy/page.tsx` | Placeholder stub | VERIFIED | Exists, 32 lines, consistent placeholder pattern |

---

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `data/zarzad.ts` | `zarzad/page.tsx` | `import { zarzad }` | WIRED | Line 5: `import { zarzad } from '@/data/zarzad'` |
| `data/zarzad.ts` | `rada-uczelniana/page.tsx` | `import { russ }` | WIRED | Line 6: `import { russ } from '@/data/zarzad'` |
| `data/zarzad.ts` | `przewodniczacy-i-wiceprzewodniczacy/page.tsx` | `import { prezydium }` | WIRED | Line 5: `import { prezydium } from '@/data/zarzad'` |
| `data/projekty.ts` | `nasze-projekty/page.tsx` | `import { projekty }` | WIRED | Line 4: `import { projekty } from '@/data/projekty'` |
| `data/regulacje.ts` | `regulacje-wewnetrzne/page.tsx` | `import { regulacje }` | WIRED | Line 5: `import { regulacje } from '@/data/regulacje'` |
| `data/partnerzy.ts` | `wspolprace/page.tsx` | `import { partnerStrategiczny, partnerzy }` | WIRED | Line 5: `import { partnerStrategiczny, partnerzy } from '@/data/partnerzy'` |
| `components/sections/MemberGrid.tsx` | `zarzad/page.tsx` | `import { MemberGrid }` | WIRED | Line 4: `import { MemberGrid } from '@/components/sections/MemberGrid'` |
| `components/cards/ProjectCard.tsx` | `nasze-projekty/page.tsx` | `import { ProjectCard }` | WIRED | Line 4: `import { ProjectCard } from '@/components/cards/ProjectCard'` |
| `components/sections/PartnerGrid.tsx` | `wspolprace/page.tsx` | `import { PartnerGrid }` | WIRED | Line 4: `import { PartnerGrid } from '@/components/sections/PartnerGrid'` |
| `components/sections/DocumentList.tsx` | `regulacje-wewnetrzne/page.tsx` | `import { DocumentList }` | WIRED | Line 4: `import { DocumentList } from '@/components/sections/DocumentList'` |

---

### Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
|----------|---------------|--------|--------------------|--------|
| `zarzad/page.tsx` | `zarzad` array | `data/zarzad.ts` static export | Yes — 9 typed member objects | FLOWING |
| `rada-uczelniana/page.tsx` | `russ` array + `dokumenty` | `data/zarzad.ts` + inline const | Yes — 12 members + 3 GDrive links | FLOWING |
| `przewodniczacy-i-wiceprzewodniczacy/page.tsx` | `prezydium` array | `data/zarzad.ts` static export | Yes — 4 typed member objects | FLOWING |
| `nasze-projekty/page.tsx` | `projekty` array | `data/projekty.ts` static export | Yes — 9 project objects | FLOWING |
| `regulacje-wewnetrzne/page.tsx` | `regulacje` array | `data/regulacje.ts` static export | Yes — 6 DocumentItem objects with real PDF URLs | FLOWING |
| `wspolprace/page.tsx` | `partnerStrategiczny`, `partnerzy` | `data/partnerzy.ts` static export | Yes — BNY + 11 named partners | FLOWING |

Note: All data sources are static TypeScript exports (no DB/API fetch). This is correct for a static Next.js site — data is embedded at build time.

---

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| TypeScript compiles without errors | `npx tsc --noEmit` (deferred — no runtime) | Build artifacts exist in `/out` | SKIP |
| data/zarzad.ts exports 3 arrays | Counted entries in file | prezydium=4, zarzad=9, russ=12 | PASS |
| data/projekty.ts has exactly 9 items | Counted entries in file | 9 project objects | PASS |
| data/regulacje.ts has 6 Wix CDN hrefs | Counted entries + verified href pattern | 6 items, all `samorzad.ue.wroc.pl/_files/ugd/3dec01_*` | PASS |
| data/partnerzy.ts has BNY + 11 regular | Counted entries in file | partnerStrategiczny=BNY, partnerzy.length=11 | PASS |
| wspolprace form submit is disabled | Checked button attributes | `type="button" disabled aria-disabled="true"` | PASS |

---

### Requirements Coverage

| Requirement | Source Plan(s) | Description | Status | Evidence |
|-------------|----------------|-------------|--------|----------|
| ORG-01 | 04-01, 04-02, 04-03 | Zarząd 9 members + Prezydium 4 members with real emails | SATISFIED | zarzad.ts verified; zarzad/page.tsx and przewodniczacy pages verified |
| ORG-02 | 04-01, 04-02, 04-04 | RUSS 12 members + GDrive document links | SATISFIED | russ array 12 entries; rada-uczelniana/page.tsx has 3 GDrive links |
| ORG-03 | 04-01, 04-03 | Prezydium page with Ćwiklińska + 3 Wiceprzewodniczących | SATISFIED | prezydium array 4 entries; page wired to MemberGrid |
| ORG-04 | 04-01, 04-06 | Współprace page with Vogel contact + form | SATISFIED | wspolprace/page.tsx has MemberCard(Vogel) + disabled form |
| ORG-05 | 04-07 | Nasza działalność mission page | SATISFIED | nasza-dzialalnosc/page.tsx has real mission text |
| ORG-06 | 04-07 | Struktura samorządu + stub pages (komisja, skw, filia, nasi-partnerzy) | SATISFIED | struktura-samorzadu/page.tsx has 5 organ links; 4 consistent stub pages exist |
| PROJ-01 | 04-01, 04-02, 04-05 | 9 project cards on /nasze-projekty | SATISFIED | projekty.ts 9 entries; nasze-projekty/page.tsx maps all 9 |
| PART-01 | 04-01, 04-02, 04-06 | Partner grid: BNY strategic + 11 regular | SATISFIED | partnerzy.ts verified; wspolprace renders PartnerGrid for both groups |
| DOC-01 | 04-01, 04-05 | 6 regulacje PDF links via DocumentList | SATISFIED | regulacje.ts 6 items with real Wix CDN hrefs; page wired |

**All 9 phase requirements satisfied.**

Note: ORG-xx/PROJ-xx/PART-xx/DOC-xx are internal phase requirement codes from the ROADMAP; they are distinct from the v1 REQUIREMENTS.md codes (BUG-xx, FOUND-xx, etc.) which are pre-existing vanilla site requirements. No orphaned requirements detected.

---

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `data/partnerzy.ts` | 4 | `TODO: replace with real logo path when files are available` | Info | Logo images are intentionally deferred; name text renders correctly; not a runtime blocker |
| `components/sections/PartnerGrid.tsx` | 17 | `{/* TODO: replace with <Image> when logos available */}` | Info | Same deferred logo concern; text placeholder is functional and expected per plan |
| `app/(public)/wspolprace/page.tsx` | 115 | `{/* TODO: Phase 5 — wire to POST /api/formularz */}` | Info | Intentional — form submit is disabled by design; Phase 5 will wire the POST handler |
| `app/(public)/komisja-rewizyjna/page.tsx` | 18 | Placeholder text "Treść tej strony jest w przygotowaniu" | Info | Intentional stub per plan 04-07; consistent across 4 stub pages |

No blocker or warning anti-patterns found. All TODOs are documented deferrals aligned with phase scope.

---

### Human Verification Required

#### 1. Partner logos visual appearance

**Test:** Open `/wspolprace` in a browser; verify the PartnerGrid renders text-name tiles for all 12 partners (BNY + 11 regular) with correct visual hierarchy (BNY labeled "Partner Strategiczny").
**Expected:** BNY tile has blue "Partner Strategiczny" badge; 11 regular tiles show company names only; layout is a responsive grid.
**Why human:** Tailwind class rendering and visual layout cannot be confirmed statically.

#### 2. MemberCard email mailto links functional

**Test:** On `/zarzad`, click any email address in a MemberCard.
**Expected:** Email client opens with correct `@samorzad.ue.wroc.pl` address pre-filled.
**Why human:** `mailto:` href behavior requires browser interaction.

#### 3. Wspolprace form disabled state UX

**Test:** Open `/wspolprace`, attempt to click the "Wyślij (wkrótce)" button.
**Expected:** Button is visually greyed out, cursor shows `not-allowed`, and no action occurs.
**Why human:** CSS cursor and visual disabled state require browser rendering.

#### 4. GDrive document links accessible

**Test:** On `/rada-uczelniana`, click each of the 3 GDrive folder links (Raporty, Uchwały, Zarządzenia).
**Expected:** Each link opens the correct Google Drive folder in a new tab.
**Why human:** External URL accessibility cannot be verified statically.

#### 5. PDF document links accessible

**Test:** On `/regulacje-wewnetrzne`, click each of the 6 PDF links.
**Expected:** Each link opens a PDF from samorzad.ue.wroc.pl in a new tab.
**Why human:** External URL availability requires live network request.

---

### Gaps Summary

No gaps found. All 6 ROADMAP success criteria are fully verified:

- Data layer (4 TypeScript files) exists with correct counts and real personal data
- All 6 page routes are implemented and wire to their respective data sources
- Reusable components (ProjectCard, MemberGrid, PartnerGrid) are substantive, not stubs
- Support pages (nasza-dzialalnosc, struktura-samorzadu) have real content
- 4 intentional stub pages use consistent "w przygotowaniu" placeholder as designed
- Cooperation form submit is correctly disabled pending Phase 5 API wiring

One minor discrepancy noted: Plan 04-06 truth mentions "Karol Vogel's MemberCard with correct email **and phone**" but MemberCard has no phone field in its interface. The rendered card shows name, role, and email only — no phone. This matches the actual MemberCard interface design and does not block any success criterion.

---

_Verified: 2026-05-15_
_Verifier: Claude (gsd-verifier)_
