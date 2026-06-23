# Klaster 1 — „Wow" animacje — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Dodać dwa frontendowe efekty „wow" — interaktywne karty osób (`PersonCard`) i premium, wymienialny system animacji partnerów — bez nowej infrastruktury.

**Architecture:** Jeden komponent `PersonCard` z dwoma trybami wybieranymi po obecności zdjęcia (foto → tilt + podpis; brak → flip 3D na inicjałach). System partnerów rozwiązuje efekt w kolejności `frames` (przyszłość) → szablon kategorii → domyślny; „dedykowanie" kolorem marki partnera. Wszystko `transform`/`opacity`, `prefers-reduced-motion`-safe, na `motion/react` + CSS (tokeny z `globals.css`).

**Tech Stack:** Next.js 16 (App Router), React 19, Tailwind v4, `motion/react`, `@phosphor-icons/react`. Bez nowych zależności.

---

## Konwencje weryfikacji (ważne — czytaj przed startem)

Ten projekt **nie ma frameworku testowego** ani **nie jest repozytorium git**. Dlatego:

- **Zamiast testów jednostkowych i commitów** każdy task kończy się **bramką weryfikacji**:
  ```bash
  npx tsc --noEmit && npx eslint src && npx next build
  ```
  Oczekiwane: wszystko zielone (build kończy się listą tras bez błędów).
- **Weryfikacja manualna** (gdzie wskazano): `npm run dev`, otwórz stronę, sprawdź hover + focus klawiaturą, włącz „reduce motion" w systemie i sprawdź brak ruchu, sprawdź 375px (DevTools).
- Logika czysta (np. `resolvePartnerEffect`) jest na tyle prosta, że weryfikujemy ją przez `tsc` + jedno ręczne sprawdzenie w UI; nie wprowadzamy runnera testów (YAGNI).
- Jeśli użytkownik później zainicjuje git, można dodać commity per task — na teraz pomijamy.

Konwencje kodu (z istniejącego kodu): tokeny `text-ink-primary`, `bg-bg-surface`, `border-border-subtle/soft/medium`, `bg-accent`, `text-accent`, `bg-accent-glow`; easing `[0.16, 1, 0.3, 1]`; guard `const reduce = useReducedMotion()`; ikony `@phosphor-icons/react` (`weight="regular"`, `aria-hidden`).

---

## File Structure

| Plik | Odpowiedzialność | Akcja |
|------|------------------|-------|
| `src/components/PersonCard.tsx` | Karta osoby, dwa tryby (foto B / flip A) | Create |
| `src/components/partners/partnerEffects.ts` | Typy `Partner`/`FrameAsset`, rejestr kategorii, `resolvePartnerEffect` | Create |
| `src/components/partners/PartnerEffect.tsx` | Wizualny efekt grany w modalu (aviation line-draw + domyślny) | Create |
| `src/app/globals.css` | Keyframes efektów partnera | Modify |
| `src/components/Board.tsx` | Zarząd → `PersonCard` (tryb foto) | Modify |
| `src/components/pages/WladzeRektorskieContent.tsx` | Władze → `PersonCard` (flip) | Modify |
| `src/components/pages/DziekaniContent.tsx` | Dziekani → `PersonCard` (flip + meta) | Modify |
| `src/components/pages/PrzewodniczacyContent.tsx` | Kierownictwo → `PersonCard` | Modify |
| `src/components/pages/RUSSContent.tsx` | Członkowie RUSS → `PersonCard` | Modify |
| `src/components/pages/KomisjaWyborczaContent.tsx` | Członkowie SKW → `PersonCard` | Modify |
| `src/components/pages/PartnerzyContent.tsx` | Ściana partnerów + modal z efektem | Modify |

`src/lib/photos.ts` — **bez zmian**: `boardPhotos` już zasila Zarząd; pozostałe osoby dostają zdjęcia w przyszłości przez prop `photo` (brak → tryb flip). Spec §2.4 spełniony bez kodu teraz.

---

## Task 1: Komponent `PersonCard`

**Files:**
- Create: `src/components/PersonCard.tsx`

- [ ] **Step 1: Utwórz `src/components/PersonCard.tsx` z pełnym kodem**

```tsx
"use client";

import Image from "next/image";
import { useReducedMotion } from "motion/react";
import { EnvelopeSimple } from "@phosphor-icons/react";
import { InitialsAvatar } from "./InitialsAvatar";

export interface PersonCardProps {
  name: string;
  role: string;
  /** Brak zdjęcia → tryb inicjałów (flip 3D). */
  photo?: string;
  email?: string;
  /** Dodatkowe wiersze na tyle karty (np. kierunki prodziekana). */
  meta?: string[];
  /** Większy wariant (np. Rektor, Przewodnicząca). */
  featured?: boolean;
  className?: string;
}

export function PersonCard(props: PersonCardProps) {
  return props.photo ? <PhotoCard {...props} /> : <FlipCard {...props} />;
}

/* ── Tryb foto (B): tilt + przyciemnienie + e-mail na hover ── */
function PhotoCard({ name, role, photo, email, className }: PersonCardProps) {
  return (
    <div
      className={`group relative overflow-hidden rounded-xl border border-border-subtle bg-bg-elevated transition-[transform,border-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-border-soft hover:-rotate-1 hover:scale-[1.02] focus-within:-rotate-1 focus-within:scale-[1.02] motion-reduce:transform-none motion-reduce:hover:transform-none ${className ?? ""}`}
    >
      <div className="relative aspect-[4/5] w-full">
        <Image
          src={photo!}
          alt={`${name} — ${role}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
        />
        {/* Stały delikatny gradient (czytelność podpisu) + pogłębienie na hover */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-[#0b1322]/85 via-[#0b1322]/15 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-100"
        />
        <div className="absolute inset-x-0 bottom-0 p-5">
          <h3 className="font-display text-[1.25rem] leading-tight tracking-[-0.01em] text-white">
            {name}
          </h3>
          <p className="mt-1 text-[0.8125rem] uppercase tracking-[0.06em] text-white/80">
            {role}
          </p>
          {email && (
            <a
              href={`mailto:${email}`}
              className="mt-2 inline-flex translate-y-2 items-center gap-1.5 text-[0.8125rem] text-white/85 opacity-0 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-white group-hover:translate-y-0 group-hover:opacity-100 focus:translate-y-0 focus:opacity-100 motion-reduce:translate-y-0 motion-reduce:opacity-100"
            >
              <EnvelopeSimple size={15} weight="regular" aria-hidden="true" />
              {email}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Tryb inicjałów (A): flip 3D; front = inicjały + nazwisko, tył = szczegóły ── */
function FlipCard({ name, role, email, meta, featured, className }: PersonCardProps) {
  const reduce = useReducedMotion();
  const size = featured ? 88 : 56;

  if (reduce) {
    // Reduced-motion: bez obrotu — pokazujemy wszystko statycznie.
    return (
      <div className={`flex items-center gap-4 rounded-xl border border-border-subtle bg-bg-surface p-6 ${className ?? ""}`}>
        <InitialsAvatar name={name} size={size} />
        <div>
          <h3 className="text-[1.0625rem] font-semibold tracking-[-0.01em] text-ink-primary">{name}</h3>
          <p className="mt-1 text-[0.875rem] leading-[1.5] text-ink-secondary">{role}</p>
          {email && <p className="mt-1 text-[0.8125rem] text-ink-secondary">{email}</p>}
          {meta && <ul className="mt-2 flex flex-col gap-0.5">{meta.map((m) => <li key={m} className="text-[0.8125rem] text-ink-secondary">{m}</li>)}</ul>}
        </div>
      </div>
    );
  }

  return (
    <div className={`group h-full [perspective:1000px] ${className ?? ""}`} tabIndex={0}>
      <div className="relative h-full min-h-[160px] w-full rounded-xl transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] group-focus:[transform:rotateY(180deg)]">
        {/* Front */}
        <div className="absolute inset-0 flex items-center gap-4 rounded-xl border border-border-subtle bg-bg-surface p-6 [backface-visibility:hidden]">
          <InitialsAvatar name={name} size={size} />
          <div>
            <h3 className="text-[1.0625rem] font-semibold tracking-[-0.01em] text-ink-primary">{name}</h3>
            <p className="mt-1 text-[0.875rem] leading-[1.5] text-ink-secondary">{role}</p>
          </div>
        </div>
        {/* Back */}
        <div className="absolute inset-0 flex flex-col justify-center gap-1.5 overflow-auto rounded-xl border border-accent/40 bg-bg-elevated p-6 [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <h3 className="text-[1rem] font-semibold tracking-[-0.01em] text-ink-primary">{name}</h3>
          <p className="text-[0.8125rem] uppercase tracking-[0.06em] text-accent">{role}</p>
          {email && (
            <a href={`mailto:${email}`} className="mt-1 inline-flex items-center gap-1.5 text-[0.8125rem] text-ink-secondary transition-colors hover:text-accent">
              <EnvelopeSimple size={14} weight="regular" aria-hidden="true" />
              {email}
            </a>
          )}
          {meta && <ul className="mt-1 flex flex-col gap-0.5">{meta.map((m) => <li key={m} className="text-[0.8125rem] leading-[1.4] text-ink-secondary">{m}</li>)}</ul>}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Bramka weryfikacji**

Run: `npx tsc --noEmit && npx eslint src`
Expected: brak błędów (komponent nieużywany jeszcze — to OK; eslint nie zgłasza unused export).

---

## Task 2: Keyframes efektów partnera w `globals.css`

**Files:**
- Modify: `src/app/globals.css` (dopisać na końcu, przy istniejących `@keyframes`)

- [ ] **Step 1: Dopisz na końcu `src/app/globals.css`**

```css
/* ── Partner effect: aviation „line-draw + start" ── */
@keyframes plane-draw {
  to { stroke-dashoffset: 0; }
}
@keyframes plane-takeoff {
  0%, 38% { transform: translate(0, 0) rotate(-12deg); opacity: 1; }
  100% { transform: translate(150px, -78px) rotate(-12deg); opacity: 0; }
}
@keyframes plane-trail {
  0% { width: 0; opacity: 0; }
  30% { opacity: 0.7; }
  100% { width: 150px; opacity: 0; }
}
/* ── Partner effect: domyślny sweep ── */
@keyframes partner-sweep {
  0% { transform: translateX(-160%) skewX(-16deg); opacity: 0; }
  30% { opacity: 0.9; }
  100% { transform: translateX(230%) skewX(-16deg); opacity: 0; }
}

@media (prefers-reduced-motion: reduce) {
  .pe-plane, .pe-trail, .pe-sweep { animation: none !important; }
}
```

- [ ] **Step 2: Bramka weryfikacji**

Run: `npx next build`
Expected: zielony build (CSS kompiluje się).

---

## Task 3: `partnerEffects.ts` — typy, rejestr, resolver

**Files:**
- Create: `src/components/partners/partnerEffects.ts`

- [ ] **Step 1: Utwórz `src/components/partners/partnerEffects.ts`**

```ts
/**
 * Rejestr i rozwiązywanie efektu animacji partnera.
 * Kolejność priorytetu: frames (przyszłe pliki klatkowe) → kategoria → domyślny.
 */

export interface FrameAsset {
  /** URL sprite-sheetu / sekwencji / Lottie / wideo. Format dograny przy wdrożeniu assetów. */
  src: string;
  kind: "sprite" | "sequence" | "lottie" | "video";
}

export interface Partner {
  name: string;
  logo?: string;
  /** Kolor marki — tinta efektu; brak → akcent UEW. */
  color?: string;
  /** Klucz szablonu efektu (patrz CATEGORY_EFFECTS). */
  category?: string;
  /** Przyszłe pliki klatkowe — mają priorytet nad szablonem. */
  frames?: FrameAsset;
}

export type PartnerEffectId = "frames" | "aviation" | "default";

/** Kategorie z gotowym szablonem CSS/motion. Dokładać tu kolejne. */
export const CATEGORY_EFFECTS: Record<string, Exclude<PartnerEffectId, "frames" | "default">> = {
  aviation: "aviation",
};

export function resolvePartnerEffect(partner: Partner): PartnerEffectId {
  if (partner.frames) return "frames";
  if (partner.category && CATEGORY_EFFECTS[partner.category]) {
    return CATEGORY_EFFECTS[partner.category];
  }
  return "default";
}
```

- [ ] **Step 2: Bramka weryfikacji**

Run: `npx tsc --noEmit && npx eslint src`
Expected: brak błędów.

---

## Task 4: `PartnerEffect.tsx` — komponent wizualny

**Files:**
- Create: `src/components/partners/PartnerEffect.tsx`

- [ ] **Step 1: Utwórz `src/components/partners/PartnerEffect.tsx`**

```tsx
"use client";

import { resolvePartnerEffect, type Partner } from "./partnerEffects";

/**
 * Gra raz przy zamontowaniu (otwarciu modala partnera). Tinta = color partnera.
 * `frames` jest slotem na przyszłość — dziś renderuje fallback domyślny.
 */
export function PartnerEffect({ partner }: { partner: Partner }) {
  const effect = resolvePartnerEffect(partner);
  const color = partner.color ?? "var(--accent)";

  if (effect === "aviation") {
    return (
      <div className="relative mx-auto h-24 w-24" aria-hidden="true">
        <span
          className="pe-trail absolute left-[42px] top-[58px] h-[2px] origin-left rotate-[-25deg] rounded-full blur-[0.6px]"
          style={{ background: `linear-gradient(90deg, ${color}, transparent)`, animation: "plane-trail 1.1s cubic-bezier(0.5,0,0.2,1) 1s forwards" }}
        />
        <svg
          className="pe-plane absolute left-[34px] top-[34px]"
          width="30" height="30" viewBox="0 0 24 24" fill="none"
          stroke={color} strokeWidth="1.3" strokeLinejoin="round" strokeLinecap="round"
          style={{ animation: "plane-takeoff 1.1s cubic-bezier(0.5,0,0.2,1) 1s forwards" }}
        >
          <path
            pathLength={100}
            d="M2 21l21-9L2 3v7l15 2-15 2v7z"
            style={{ strokeDasharray: 100, strokeDashoffset: 100, animation: "plane-draw 1s ease forwards" }}
          />
        </svg>
      </div>
    );
  }

  // default — elegancki sweep za logo
  return (
    <div className="relative mx-auto h-24 w-24 overflow-hidden rounded-2xl" aria-hidden="true"
         style={{ background: "var(--accent-glow)" }}>
      <span
        className="pe-sweep absolute inset-y-0 w-1/2"
        style={{ background: "linear-gradient(100deg, transparent, rgba(255,255,255,0.85), transparent)", animation: "partner-sweep 1.4s cubic-bezier(0.16,1,0.3,1) forwards" }}
      />
    </div>
  );
}
```

- [ ] **Step 2: Bramka weryfikacji**

Run: `npx tsc --noEmit && npx eslint src && npx next build`
Expected: zielony build.

---

## Task 5: Zarząd (`Board.tsx`) → `PersonCard` tryb foto

**Files:**
- Modify: `src/components/Board.tsx`

- [ ] **Step 1: Zamień import `next/image` na `PersonCard` i podmień renderowaną kartę**

W `src/components/Board.tsx`:
- Usuń `import Image from "next/image";`
- Dodaj `import { PersonCard } from "./PersonCard";`
- Zamień cały blok `<motion.div ...>...</motion.div>` w `members.map` na poniższy (zachowując `colClass`, animację wejścia i `key`):

```tsx
return (
  <motion.div
    key={member.name}
    initial={reduce ? false : { opacity: 0, y: 20 }}
    whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.15 }}
    transition={{ duration: 0.6, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
    className={colClass}
  >
    <PersonCard name={member.name} role={member.role} photo={boardPhotos[i]} />
  </motion.div>
);
```

(Hover-lift przenosi się do `PersonCard`; usuwamy `whileHover` z `motion.div`, bo karta ma własny tilt.)

- [ ] **Step 2: Bramka weryfikacji + manualna**

Run: `npx tsc --noEmit && npx eslint src && npx next build`
Manualnie (`npm run dev`, `/`): sekcja „Zarząd" pokazuje zdjęcia z podpisem; hover → lekki tilt + przyciemnienie; reduce-motion → bez tiltu, podpis czytelny.

---

## Task 6: Władze (`WladzeRektorskieContent.tsx`) → `PersonCard` flip

**Files:**
- Modify: `src/components/pages/WladzeRektorskieContent.tsx`

- [ ] **Step 1: Zastąp ręczne karty `InitialsAvatar` komponentem `PersonCard`**

- Dodaj `import { PersonCard } from "../PersonCard";`
- Rektora (sekcja „featured") zostaw jako jest LUB zamień na `<PersonCard name={rektor.name} role={rektor.role} featured />` w miejsce ręcznej karty.
- Listę `prorektorzy.map(...)` zamień, by każdy element renderował:

```tsx
<motion.div
  key={p.name}
  initial={reduce ? false : { opacity: 0, y: 20, scale: 0.97 }}
  whileInView={reduce ? undefined : { opacity: 1, y: 0, scale: 1 }}
  viewport={{ once: true, amount: 0.2 }}
  transition={{ duration: 0.5, delay: Math.min(i, 4) * 0.08, ease: [0.16, 1, 0.3, 1] }}
>
  <PersonCard name={p.name} role={p.role} />
</motion.div>
```

(Brak `photo` → flip 3D na inicjałach. `InitialsAvatar` używany jest teraz wewnątrz `PersonCard`; jeśli po zmianie nie ma już bezpośredniego użycia `InitialsAvatar` w pliku, usuń jego import, by eslint nie zgłaszał unused.)

- [ ] **Step 2: Bramka weryfikacji + manualna**

Run: `npx tsc --noEmit && npx eslint src && npx next build`
Manualnie (`/wladze-rektorskie`): karty prorektorów obracają się na hover/focus (front inicjały → tył dane); reduce-motion → statycznie.

---

## Task 7: Dziekani (`DziekaniContent.tsx`) → `PersonCard` flip + meta

**Files:**
- Modify: `src/components/pages/DziekaniContent.tsx`

- [ ] **Step 1: Zastąp karty prodziekanów `PersonCard` z `meta` = lista kierunków**

- Dodaj `import { PersonCard } from "../PersonCard";`
- W `prodziekani.map(...)` renderuj kartę przez `PersonCard`, przekazując kierunki jako `meta`:

```tsx
<motion.div
  key={p.name}
  initial={reduce ? false : { opacity: 0, y: 24 }}
  whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
  viewport={{ once: true, amount: 0.15 }}
  transition={{ duration: 0.5, delay: Math.min(i, 4) * 0.08, ease: [0.16, 1, 0.3, 1] }}
>
  <PersonCard name={p.name} role="Prodziekan ds. Studenckich" meta={p.kierunki} className="h-full" />
</motion.div>
```

- Dziekana („featured") zostaw bez zmian lub `<PersonCard name={dziekan.name} role={dziekan.role} featured />`.
- Usuń bezpośredni import `InitialsAvatar`, jeśli nie jest już używany w pliku.

- [ ] **Step 2: Bramka weryfikacji + manualna**

Run: `npx tsc --noEmit && npx eslint src && npx next build`
Manualnie (`/dziekan-i-prodziekani`): tył karty pokazuje listę kierunków; jeśli lista długa — `overflow-auto` na tyle (już w `PersonCard`).

---

## Task 8: Pozostałe strony osób → `PersonCard` (ten sam wzorzec)

**Files:**
- Modify: `src/components/pages/PrzewodniczacyContent.tsx`
- Modify: `src/components/pages/RUSSContent.tsx`
- Modify: `src/components/pages/KomisjaWyborczaContent.tsx`

Dla każdej z tych stron: dodaj `import { PersonCard } from "../PersonCard";`, a w mapowaniu osób zamień ręczną kartę z `InitialsAvatar` na `<PersonCard ... />` z dokładnie tymi propsami:

- [ ] **Step 1: `PrzewodniczacyContent.tsx`**
  - Przewodnicząca (featured): `<PersonCard name="Emilia Ćwiklińska" role="Przewodnicząca Samorządu Studentów" email="emilia.cwiklinska@samorzad.ue.wroc.pl" featured />` (opis pod kartą zostaw bez zmian).
  - Każdy wiceprzewodniczący w `wice.map`: `<PersonCard name={w.name} role={w.role} email={w.email} className="h-full" />`.

- [ ] **Step 2: `RUSSContent.tsx`**
  - Dla każdego członka renderowanego z `InitialsAvatar`: `<PersonCard name={<imię>} role={<rola lub "Członek RUSS">} className="h-full" />` (zachowaj istniejącą animację wejścia w `motion.div` wokół).

- [ ] **Step 3: `KomisjaWyborczaContent.tsx`**
  - W `czlonkowie.map`: `<PersonCard name={c.name} role={c.role} className="h-full" />`.

- [ ] **Step 4: Po każdej zmianie usuń nieużywany import `InitialsAvatar` z danego pliku (jeśli zniknęło bezpośrednie użycie).**

- [ ] **Step 5: Bramka weryfikacji + manualna**

Run: `npx tsc --noEmit && npx eslint src && npx next build`
Manualnie: `/przewodniczacy-i-wiceprzewodniczacy`, `/rada-uczelniana-samorzadu-studentow`, `/studencka-komisja-wyborcza` — karty flip działają, brak błędów eslint o nieużywanych importach.

---

## Task 9: System partnera w `PartnerzyContent.tsx`

**Files:**
- Modify: `src/components/pages/PartnerzyContent.tsx`

- [ ] **Step 1: Wprowadź typ `Partner` i dane (z demonstracyjnym tagiem kategorii)**

Na górze pliku dodaj importy:
```tsx
import { PartnerEffect } from "../partners/PartnerEffect";
import type { Partner } from "../partners/partnerEffects";
```
Zamień `const slots = [...]` na:
```tsx
// Sloty placeholderowe. category/color = przykłady do podmiany na realnych partnerów.
const slots: Partner[] = [
  { name: "Twoja marka" },
  { name: "Partner", category: "aviation", color: "#1D4ED8" },
  { name: "Sponsor" },
  { name: "Współpraca" },
  { name: "Patron" },
  { name: "Mecenas" },
];
```

- [ ] **Step 2: Zmień stan `selected` na `Partner` i podłącz ścianę**

- Zmień `const [selected, setSelected] = useState<string | null>(null);` → `useState<Partner | null>(null);`
- `open(label)` → `open(partner: Partner)`; w ścianie: `onClick={() => open(p)}` i iteruj `slots.map((p) => ...)`, używając `p.name` jako etykiety i `key`.
- Marquee i druga lista iterują po `slots` — używaj `s.name` zamiast `s`.

- [ ] **Step 3: Przekaż partnera i efekt do modala**

- `{selected && <PartnerModal partner={selected} onClose={close} />}`
- W `PartnerModal` zmień sygnaturę na `{ partner, onClose }: { partner: Partner; onClose: () => void }` i `aria-labelledby` użyj `partner.name`.
- Zastąp blok „Animated logo entrance" (`<motion.div ...><Buildings/></motion.div>`) komponentem:
```tsx
<div className="mx-auto flex h-24 w-24 items-center justify-center">
  <PartnerEffect partner={partner} />
</div>
```
- Tytuł modala: `{partner.name}`. Usuń nieużywany import `Buildings`, jeśli zniknął.

- [ ] **Step 4: Bramka weryfikacji + manualna**

Run: `npx tsc --noEmit && npx eslint src && npx next build`
Manualnie (`/partnerzy`): klik w slot „Partner" (kategoria aviation) → modal odgrywa samolot (line-draw + start) w kolorze marki; klik w slot bez kategorii → domyślny sweep; reduce-motion → bez ruchu. Focus trap i Esc działają jak wcześniej.

---

## Final Verification

- [ ] `npx tsc --noEmit` — zielone
- [ ] `npx eslint src` — zielone (brak unused `InitialsAvatar`/`Buildings`/`Image`)
- [ ] `npx next build` — zielone, lista tras bez błędów
- [ ] Manualnie: Zarząd (foto B), Władze/Dziekani/RUSS/SKW/Przewodniczący (flip A), Partnerzy (modal + efekt) — hover, focus klawiaturą, reduce-motion, 375px
- [ ] Zaktualizuj `MEMORY.md`/`project-ssuew-website.md` notką, że Klaster 1 wdrożony (PersonCard + system partnera, frames-slot na przyszłość)
