# Stypendia hub — pilot konsolidacji — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Merge the 6-page stipend cluster + standalone calculator into one long-scroll `/stypendia` hub with a sticky scroll-spy index, an embedded grade calculator, and a click-to-load video slot; 308-redirect the old URLs.

**Architecture:** Two reusable client components — `HubNav` (floating/sticky labeled scroll-spy, mirroring the proven `SectionRail` IntersectionObserver pattern) and `VideoEmbed` (click-to-load YouTube, no network to YouTube before click). The `/stypendia` server page stacks the EXISTING content components (`StypendiaContent`, `StypendiumDetailContent` ×4 fed by their existing i18n namespaces, `WsparcieContent`, `KalkulatorSredniejContent`, `Faq`) inside `id`-anchored wrappers. Old page directories are deleted; `next.config.ts` redirects handle their URLs.

**Tech Stack:** Next.js 16 App Router + next-intl (locales pl/en, localePrefix default), Tailwind v4 tokens, motion, `@phosphor-icons/react`. No new test runner needed (UI verified via build + manual).

**Confirmed facts:**
- Stipend detail pages use `StypendiumDetailContent` (props `eyebrow, heading, intro, notes` + optional `steps/regulaminHref/extraLinks`) fed by namespaces: `stypRektora`, `stypSocjalne`, `stypNiepelnosprawni`, `zapomoga`. Overview = `StypendiaContent` (`stypendia`), material support = `WsparcieContent` (`wsparcie`).
- `StypendiumDetailContent` hardcodes `id="styp-heading"` and `aria-labelledby="styp-heading"` — used 4× on one page this duplicates the id; **must be parametrised** (Task 3).
- `SectionRail` (the `§` rail) stays untouched (legal-page signature); `HubNav` is a new sibling.
- `next.config.ts` has no redirects yet; `middleware.ts` matcher excludes paths with a dot. Next.js evaluates config `redirects()` before middleware.
- Calculator data is fetched client-side from `/data/programs.json` (unchanged by this work).

---

## File Structure

| File | Responsibility |
|------|----------------|
| `src/components/HubNav.tsx` (create) | Labeled scroll-spy index: floating left at `xl`, sticky top chip bar below. |
| `src/components/VideoEmbed.tsx` (create) | Click-to-load YouTube facade (youtube-nocookie). |
| `src/lib/videos.ts` (create) | Slot mapping `key → { youtubeId, titleKey }` (drop-in like `people.ts`). |
| `src/components/pages/StypendiumDetailContent.tsx` (modify) | Add optional `sectionId` prop → unique section/heading id + `scroll-mt`. |
| `src/app/[locale]/stypendia/page.tsx` (rewrite) | Compose the hub: hero + HubNav + stacked anchored sections. |
| `messages/pl.json`, `messages/en.json` (modify) | Hub section labels + relabel "Stypendia i wsparcie"; ytimg/video title key. |
| `next.config.ts` (modify) | 308 redirects for old URLs; add `i.ytimg.com` remote image pattern. |
| `src/app/[locale]/{stypendia-rektora,stypendia-socjalne,stypendia-dla-niepelnosprawnych,zapomoga,wsparcie-materialne-i-swiadczenia,kalkulator-sredniej}/` (delete) | Removed — content lives in the hub. |
| `src/components/Nav.tsx` (modify) | Relabel stypendia, drop separate "wsparcie" item. |
| `src/components/pages/DlaStudentaContent.tsx` (modify) | Calculator tile → `/stypendia#kalkulator`. |
| `src/lib/searchIndex.ts` (modify) | Collapse stipend entries into `/stypendia`; repoint calculator entry. |

---

## Task 1: `HubNav` component

**Files:** Create `src/components/HubNav.tsx`

- [ ] **Step 1: Create the component**

```tsx
"use client";

import { useEffect, useState } from "react";

/**
 * Etykietowany spis sekcji dla długich hubów (scroll-spy). Reużywa wzorca
 * IntersectionObserver z SectionRail, ale pokazuje etykiety zamiast §N i ma
 * wariant mobilny (przyklejony pasek chipów). SectionRail (§) zostaje osobno.
 */
export function HubNav({
  items,
  label,
}: {
  items: { id: string; label: string }[];
  label: string;
}) {
  const [active, setActive] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-30% 0px -55% 0px" },
    );
    items.forEach((it) => {
      const el = document.getElementById(it.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [items]);

  const go = (id: string) => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById(id)?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  };

  return (
    <>
      {/* Desktop (xl): floating sticky left index */}
      <nav
        aria-label={label}
        className="fixed left-6 top-1/2 z-30 hidden max-w-[200px] -translate-y-1/2 flex-col gap-1 xl:flex"
      >
        {items.map((it) => (
          <button
            key={it.id}
            type="button"
            onClick={() => go(it.id)}
            aria-current={active === it.id ? "true" : undefined}
            className={`group flex items-center gap-2.5 py-1 text-left font-mono text-[0.75rem] uppercase tracking-[0.06em] transition-colors ${
              active === it.id ? "text-accent" : "text-ink-tertiary hover:text-ink-secondary"
            }`}
          >
            <span
              aria-hidden="true"
              className={`h-px shrink-0 rounded-full transition-all duration-300 ${
                active === it.id ? "w-7 bg-accent" : "w-3.5 bg-border-medium group-hover:w-5"
              }`}
            />
            {it.label}
          </button>
        ))}
      </nav>

      {/* Mobile/tablet (< xl): sticky top chip bar, under the 72px header */}
      <nav
        aria-label={label}
        className="sticky top-[72px] z-30 -mx-6 mb-4 overflow-x-auto border-b border-border-subtle bg-bg-base/90 px-6 py-3 backdrop-blur xl:hidden"
      >
        <ul className="flex gap-2 whitespace-nowrap">
          {items.map((it) => (
            <li key={it.id}>
              <button
                type="button"
                onClick={() => go(it.id)}
                aria-current={active === it.id ? "true" : undefined}
                className={`rounded-full border px-3 py-1.5 text-[0.8125rem] font-medium transition-colors ${
                  active === it.id
                    ? "border-accent text-accent"
                    : "border-border-medium text-ink-secondary hover:text-ink-primary"
                }`}
              >
                {it.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
```

- [ ] **Step 2: Verify** `npx tsc --noEmit` clean, `npm run lint` clean.
- [ ] **Step 3: Commit**

```bash
git add src/components/HubNav.tsx
git commit -m "feat: HubNav labeled scroll-spy index (desktop rail + mobile chips)"
```

---

## Task 2: `VideoEmbed` + `videos.ts`

**Files:** Create `src/components/VideoEmbed.tsx`, `src/lib/videos.ts`; modify `next.config.ts` (remote image pattern only — redirects come in Task 5)

- [ ] **Step 1: Allow the YouTube thumbnail host** — in `next.config.ts` `images.remotePatterns`, add:

```ts
      { protocol: "https", hostname: "i.ytimg.com" },
```

- [ ] **Step 2: Create `src/lib/videos.ts`**

```ts
/**
 * Slot na filmy (drop-in jak people.ts). Klucz → film. Brak wpisu = sekcja
 * wideo się nie renderuje. `titleKey` to klucz i18n w namespace danej strony.
 *
 * TU wklejasz prawdziwe ID z YouTube, gdy będą gotowe.
 */
export interface VideoRef {
  youtubeId: string;
  titleKey: string;
}

export const videos: Record<string, VideoRef | undefined> = {
  // "stypendia-wniosek": { youtubeId: "XXXXXXXXXXX", titleKey: "hub.wideoTitle" },
};
```

- [ ] **Step 3: Create `src/components/VideoEmbed.tsx`**

```tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "@phosphor-icons/react";

/**
 * Click-to-load YouTube. Do kliknięcia pokazujemy tylko miniaturę (cookieless
 * i.ytimg.com) + przycisk — żaden śledzący skrypt/iframe YouTube nie ładuje się,
 * dopóki student sam nie kliknie. Wtedy montujemy youtube-nocookie z autoplay.
 */
export function VideoEmbed({ youtubeId, title }: { youtubeId: string; title: string }) {
  const [playing, setPlaying] = useState(false);
  const poster = `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`;

  if (playing) {
    return (
      <div className="relative aspect-video overflow-hidden rounded-xl border border-border-subtle bg-bg-elevated">
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      aria-label={title}
      className="group relative block aspect-video w-full overflow-hidden rounded-xl border border-border-subtle bg-bg-elevated"
    >
      <Image src={poster} alt="" aria-hidden fill sizes="(max-width: 768px) 100vw, 800px" className="object-cover" />
      <span aria-hidden className="absolute inset-0 bg-ink-primary/20 transition-colors group-hover:bg-ink-primary/30" />
      <span
        aria-hidden
        className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-accent text-bg-base transition-transform duration-200 group-hover:scale-105"
      >
        <Play size={28} weight="fill" />
      </span>
    </button>
  );
}
```

- [ ] **Step 4: Verify** `npx tsc --noEmit` + `npm run lint` clean. (No video plays without a real id — that's fine; the component is exercised by the hub only when `videos.ts` has an entry.)
- [ ] **Step 5: Commit**

```bash
git add src/components/VideoEmbed.tsx src/lib/videos.ts next.config.ts
git commit -m "feat: click-to-load VideoEmbed + videos.ts slot"
```

---

## Task 3: Parametrise `StypendiumDetailContent` section id

**Files:** Modify `src/components/pages/StypendiumDetailContent.tsx`

The component is rendered 4× on the hub; its hardcoded `id="styp-heading"` would duplicate. Add an optional `sectionId`.

- [ ] **Step 1: Add the prop** — in `StypendiumDetailProps` add:

```ts
  /** Unikalny id sekcji na hubie (kotwica + id nagłówka). Domyślnie pojedyncza strona. */
  sectionId?: string;
```

- [ ] **Step 2: Use it** — change the destructuring to include `sectionId`, and update the `<section>` + `<h2>`:

```tsx
  // in the function signature add `sectionId,` to the destructured props
```

Replace:
```tsx
    <section className="section-padding" aria-labelledby="styp-heading">
```
with:
```tsx
    <section
      id={sectionId}
      className={`section-padding${sectionId ? " scroll-mt-24" : ""}`}
      aria-labelledby={sectionId ? `${sectionId}-heading` : "styp-heading"}
    >
```

Replace the heading's `id="styp-heading"` with:
```tsx
            id={sectionId ? `${sectionId}-heading` : "styp-heading"}
```

- [ ] **Step 3: Verify** `npx tsc --noEmit` clean; existing stipend detail pages still type-check (they don't pass `sectionId` → default behavior unchanged).
- [ ] **Step 4: Commit**

```bash
git add src/components/pages/StypendiumDetailContent.tsx
git commit -m "refactor: StypendiumDetailContent accepts sectionId (unique anchor/heading)"
```

---

## Task 4: Build the `/stypendia` hub page + i18n

**Files:** Rewrite `src/app/[locale]/stypendia/page.tsx`; modify `messages/pl.json`, `messages/en.json`

- [ ] **Step 1: Add i18n hub keys** — in BOTH `messages/pl.json` and `messages/en.json`, inside the `stypendia` namespace, add a `hub` object (keep PL/EN key sets identical). Also change `stypendia.heroTitle` to the new label.

PL (`stypendia`):
```json
    "heroTitle": "Stypendia i wsparcie",
    "hub": {
      "nav": "Spis sekcji",
      "przeglad": "Przegląd",
      "rektora": "Rektora",
      "socjalne": "Socjalne",
      "niepelnosprawni": "Niepełnosprawni",
      "zapomoga": "Zapomoga",
      "wsparcie": "Wsparcie",
      "wideo": "Film",
      "faq": "FAQ",
      "wideoHeading": "Jak złożyć wniosek",
      "wideoTitle": "Jak złożyć wniosek o stypendium — instrukcja"
    }
```
EN (`stypendia`):
```json
    "heroTitle": "Scholarships & support",
    "hub": {
      "nav": "Sections",
      "przeglad": "Overview",
      "rektora": "Rector's",
      "socjalne": "Social",
      "niepelnosprawni": "Disability",
      "zapomoga": "Hardship",
      "wsparcie": "Support",
      "wideo": "Video",
      "faq": "FAQ",
      "wideoHeading": "How to apply",
      "wideoTitle": "How to apply for a scholarship — guide"
    }
```
> Keep the existing `stypendia.heroEyebrow`, `heroLead`, `faq.*`, `faqHeading`, `metaTitle`, etc. Only `heroTitle` changes value; `hub` is new.

- [ ] **Step 2: Rewrite the page** — `src/app/[locale]/stypendia/page.tsx`:

```tsx
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/PageHero";
import { HubNav } from "@/components/HubNav";
import { StypendiaContent } from "@/components/pages/StypendiaContent";
import { StypendiumDetailContent, type DetailNote } from "@/components/pages/StypendiumDetailContent";
import { WsparcieContent } from "@/components/pages/WsparcieContent";
import { KalkulatorSredniejContent } from "@/components/pages/KalkulatorSredniejContent";
import { VideoEmbed } from "@/components/VideoEmbed";
import { Faq, type QA } from "@/components/Faq";
import { videos } from "@/lib/videos";
import { ogMeta } from "@/lib/og";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "stypendia" });
  return {
    title: t("metaTitle"),
    description: t("metaDesc"),
    ...ogMeta(t("metaTitle"), t("ogLabel")),
  };
}

const FAQ_KEYS = ["where", "when", "multiple", "firstTime", "diff"] as const;

export default async function StypendiaPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "stypendia" });
  const tc = await getTranslations({ locale, namespace: "common" });
  const tr = await getTranslations({ locale, namespace: "stypRektora" });
  const ts = await getTranslations({ locale, namespace: "stypSocjalne" });
  const tn = await getTranslations({ locale, namespace: "stypNiepelnosprawni" });
  const tz = await getTranslations({ locale, namespace: "zapomoga" });

  const faq: QA[] = FAQ_KEYS.map((k) => ({ q: t(`faq.${k}.q`), a: t(`faq.${k}.a`) }));

  const video = videos["stypendia-wniosek"];

  const navItems = [
    { id: "przeglad", label: t("hub.przeglad") },
    { id: "rektora", label: t("hub.rektora") },
    { id: "socjalne", label: t("hub.socjalne") },
    { id: "niepelnosprawni", label: t("hub.niepelnosprawni") },
    { id: "zapomoga", label: t("hub.zapomoga") },
    { id: "wsparcie", label: t("hub.wsparcie") },
    ...(video ? [{ id: "wideo", label: t("hub.wideo") }] : []),
    { id: "faq", label: t("hub.faq") },
  ];

  return (
    <>
      <PageHero
        eyebrow={t("heroEyebrow")}
        title={t("heroTitle")}
        lead={t("heroLead")}
        breadcrumbs={[
          { label: tc("home"), href: "/" },
          { label: t("crumbStudent"), href: "/dla-studenta" },
          { label: t("heroTitle") },
        ]}
      />

      <HubNav items={navItems} label={t("hub.nav")} />

      <div id="przeglad" className="scroll-mt-24">
        <StypendiaContent />
      </div>

      <StypendiumDetailContent
        sectionId="rektora"
        eyebrow={tr("eyebrow")}
        heading={tr("heading")}
        intro={tr("intro")}
        notes={tr.raw("notes") as DetailNote[]}
      />

      <div id="kalkulator" className="scroll-mt-24">
        <KalkulatorSredniejContent />
      </div>

      <StypendiumDetailContent
        sectionId="socjalne"
        eyebrow={ts("eyebrow")}
        heading={ts("heading")}
        intro={ts("intro")}
        notes={ts.raw("notes") as DetailNote[]}
      />

      <StypendiumDetailContent
        sectionId="niepelnosprawni"
        eyebrow={tn("eyebrow")}
        heading={tn("heading")}
        intro={tn("intro")}
        notes={tn.raw("notes") as DetailNote[]}
      />

      <StypendiumDetailContent
        sectionId="zapomoga"
        eyebrow={tz("eyebrow")}
        heading={tz("heading")}
        intro={tz("intro")}
        notes={tz.raw("notes") as DetailNote[]}
      />

      <div id="wsparcie" className="scroll-mt-24">
        <WsparcieContent />
      </div>

      {video && (
        <section id="wideo" className="section-padding scroll-mt-24" aria-labelledby="wideo-heading">
          <div className="mx-auto max-w-[1200px]">
            <h2 id="wideo-heading" className="font-display text-[clamp(1.75rem,3.4vw,2.75rem)] font-semibold tracking-[-0.02em] text-ink-primary">
              {t("hub.wideoHeading")}
            </h2>
            <div className="mt-8 max-w-[800px]">
              <VideoEmbed youtubeId={video.youtubeId} title={t(video.titleKey)} />
            </div>
          </div>
        </section>
      )}

      <div id="faq" className="scroll-mt-24">
        <Faq items={faq} heading={t("faqHeading")} />
      </div>
    </>
  );
}
```

> Before finalizing: confirm `StypendiaContent` and `WsparcieContent` take no required props (they read their own namespaces). Confirm `stypSocjalne/stypNiepelnosprawni/zapomoga` each expose `eyebrow/heading/intro/notes` (they feed the same `StypendiumDetailContent` today — read one old page e.g. `stypendia-socjalne/page.tsx` to confirm the exact keys; adapt if a variant uses `steps/extraLinks`). If a variant passed extra props (e.g. `extraLinks`, custom `steps`), replicate them here.

- [ ] **Step 3: Verify** `node -e "require('./messages/pl.json');require('./messages/en.json');console.log('ok')"`; key parity for `stypendia.hub`; `npx tsc --noEmit` clean; `npm run lint` clean.
- [ ] **Step 4: Commit**

```bash
git add "src/app/[locale]/stypendia/page.tsx" messages/pl.json messages/en.json
git commit -m "feat: /stypendia consolidation hub (sections + embedded calculator + video slot)"
```

---

## Task 5: Redirects + delete old pages

**Files:** Modify `next.config.ts`; delete six page directories

- [ ] **Step 1: Add redirects** — in `next.config.ts`, add an async `redirects()` to `nextConfig`. Because next-intl uses `localePrefix: 'always'`, old URLs are locale-prefixed; redirect with a `:locale` param AND a bare fallback:

```ts
  async redirects() {
    const map: Record<string, string> = {
      "stypendia-rektora": "rektora",
      "stypendia-socjalne": "socjalne",
      "stypendia-dla-niepelnosprawnych": "niepelnosprawni",
      "zapomoga": "zapomoga",
      "wsparcie-materialne-i-swiadczenia": "wsparcie",
      "kalkulator-sredniej": "kalkulator",
    };
    const out = [];
    for (const [from, hash] of Object.entries(map)) {
      out.push({ source: `/:locale/${from}`, destination: `/:locale/stypendia#${hash}`, permanent: true });
      out.push({ source: `/${from}`, destination: `/stypendia#${hash}`, permanent: true });
    }
    return out;
  },
```

- [ ] **Step 2: Delete the old page directories**

```bash
git rm -r "src/app/[locale]/stypendia-rektora" "src/app/[locale]/stypendia-socjalne" "src/app/[locale]/stypendia-dla-niepelnosprawnych" "src/app/[locale]/zapomoga" "src/app/[locale]/wsparcie-materialne-i-swiadczenia" "src/app/[locale]/kalkulator-sredniej"
```
> Keep the i18n namespaces (`stypRektora` etc.) in `messages/*` — the hub still uses them.

- [ ] **Step 3: Verify** `npm run build` succeeds; the old routes no longer appear in the route table; `/[locale]/stypendia` present. Manually confirm a redirect resolves (dev server: visiting `/pl/zapomoga` lands on `/pl/stypendia#zapomoga`). If the `:locale` redirect doesn't fire as expected under this next-intl version, report it — fallback is a thin server page calling `permanentRedirect("/stypendia#zapomoga")`.

- [ ] **Step 4: Commit**

```bash
git add next.config.ts
git commit -m "feat: 308-redirect merged stipend/calculator URLs to /stypendia#; remove old pages"
```

---

## Task 6: Nav, tile, and search updates

**Files:** Modify `src/components/Nav.tsx`, `src/components/pages/DlaStudentaContent.tsx`, `src/lib/searchIndex.ts`, and the `navMenu` namespace in `messages/*`

- [ ] **Step 1: Nav** — in `src/components/Nav.tsx` `dlaStudenta` array: remove the `{ label: tm("wsparcie"), href: "/wsparcie-materialne-i-swiadczenia" }` line. Update the `navMenu.stypendia` value in BOTH `messages/*` to "Stypendia i wsparcie" / "Scholarships & support". (Leave `navMenu.wsparcie` key in place or remove it — if removed, ensure no other reference.)

- [ ] **Step 2: Tile** — in `src/components/pages/DlaStudentaContent.tsx`, change the `kalkulator` tile `href` from `/kalkulator-sredniej` to `/stypendia#kalkulator`. (A `#hash` href works with the i18n `Link`; if the typed `Link` rejects a hash, use a plain `<a href={...}>` for that internal anchor or `/stypendia` with a hash via `{ pathname: "/stypendia", hash: "kalkulator" }` per next-intl — verify and adapt.)

- [ ] **Step 3: Search index** — in `src/lib/searchIndex.ts`: remove the individual entries for `/stypendia-rektora`, `/stypendia-socjalne`, `/stypendia-dla-niepelnosprawnych`, `/zapomoga`, `/wsparcie-materialne-i-swiadczenia`. Merge their keywords into the existing `/stypendia` entry's `keywords` (so searches for "rektora", "socjalne", "zapomoga", "niepełnosprawność" still find the hub). Repoint the `/kalkulator-sredniej` entry's `href` to `/stypendia#kalkulator` (keep its label/keywords).

- [ ] **Step 4: Verify** JSON valid + `navMenu` parity; `npx tsc --noEmit` + `npm run lint` clean; `npm run build` succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/components/Nav.tsx src/components/pages/DlaStudentaContent.tsx src/lib/searchIndex.ts messages/pl.json messages/en.json
git commit -m "chore: point nav/tile/search at the consolidated /stypendia hub"
```

---

## Task 7: Final verification

**Files:** none (verification only)

- [ ] **Step 1:** `npm test` → existing suites still pass (21).
- [ ] **Step 2:** `npm run lint` → only the known benign `exhaustive-deps` warning in the calculator.
- [ ] **Step 3:** `npm run build` → success; `/[locale]/stypendia` present; the six removed routes absent; no type errors.
- [ ] **Step 4: Manual (dev server)** — list what the user should click through:
  - `/pl/stypendia` shows all sections; HubNav highlights the active section on scroll; clicking an item scrolls to it.
  - The embedded calculator at `#kalkulator` works (loads `/data/programs.json`, computes average).
  - Old URLs redirect: `/pl/stypendia-rektora` → `/pl/stypendia#rektora`, `/pl/kalkulator-sredniej` → `/pl/stypendia#kalkulator`, etc.
  - Mobile 375px: the sticky chip bar works; no overlap with the header.
  - Reduced-motion: anchor jumps are instant. Dark/light both fine.
  - (Video section is hidden until a real id is added to `videos.ts`.)
- [ ] **Step 5:** If a small fix was needed, commit it.

---

## Self-Review notes (author)

- **Spec coverage:** HubNav (T1), VideoEmbed+slot (T2), sectionId fix (T3), hub composition with embedded calculator + conditional video + FAQ (T4), redirects + page deletion (T5), nav/tile/search (T6), verification (T7). The "merge only structurally-thin/tight" rule is honored — only the stipend cluster is touched; rest of map deferred.
- **Deviation from spec:** HubNav is implemented as a floating/sticky index (mirroring the proven `SectionRail`), not a literal grid column — this preserves the existing full-width section components untouched and reuses a battle-tested pattern. Same UX intent (sticky labeled scroll-spy). Flagged here intentionally.
- **Type consistency:** `sectionId` optional everywhere; `videos` map returns `VideoRef | undefined`; hub reads namespaces `stypRektora/stypSocjalne/stypNiepelnosprawni/zapomoga/wsparcie/stypendia` confirmed from existing pages.
- **Open/deferred:** real YouTube id (slot hidden until provided); exact `extraLinks/steps` per stipend variant (replicate from old pages if present); the `#kalkulator` is reachable via redirect + tile, not a separate HubNav item (by design).
