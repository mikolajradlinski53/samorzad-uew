"use client";

import { useId, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowSquareOut } from "@phosphor-icons/react";
import type { Publication } from "@/lib/publications";
import { formatCitation } from "@/lib/publications";
import { editionBySlug, pagesOf } from "@/lib/editions";
import { EditionReader } from "./wydawnictwo/EditionReader";

export interface SpineWallLabels {
  emptyTitle: string;
  emptyDesc: string;
  circleLabel: string;
  linkLabel: string;
  hint: string;
  readerOpen: string;
  readerClose: string;
  readerPrev: string;
  readerNext: string;
  readerFull: string;
  readerPageOf: string;
  readerLicense: string;
}

interface SpineWallProps {
  publications: Publication[];
  labels: SpineWallLabels;
}

/**
 * Barwy pola okładki, wzorowane na prawdziwych Debiutach Studenckich.
 *
 * Realny tom ma jasny pas z nazwą serii u góry i ciemne, stonowane pole pod
 * spodem — nie płaską plamę koloru firmowego. Stąd głębokie, przygaszone
 * odcienie zamiast poprzednich rozjaśnień akcentu; akcent zostaje w zestawie
 * jako jeden z nich, żeby okładki nie odkleiły się od reszty serwisu.
 *
 * Akcent w pełnej mocy (#2C4BFF) tu NIE występuje, choć przeszedłby kontrast:
 * pośród przygaszonych tonów wyskakiwał jak element innego zestawu i rozbijał
 * wrażenie serii. Zastępuje go przygaszony granat z tej samej rodziny.
 *
 * Każdy odcień sprawdzony z bielą tekstu (#F6F8FC), próg 4.5:1 dla tekstu
 * zwykłego — najsłabszy daje 8.41:1, najmocniejszy 12.88:1.
 */
const COVER_TONES = ["#4A3350", "#1E2A5A", "#14484C", "#2B3440", "#5A2733", "#2E3D9E"];

/** Kość słoniowa pasa serii i szarość napisu na nim — 5.31:1. */
const BAND_BG = "#EDEAE3";
const BAND_FG = "#5F5F5F";

/** Deterministic djb2 hash → stable tone per title (no Math.random). */
function hashString(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) {
    h = (h * 33) ^ s.charCodeAt(i);
  }
  return Math.abs(h);
}

function toneFor(title: string) {
  return COVER_TONES[hashString(title) % COVER_TONES.length];
}

function authorSurnames(authors: string[]): string {
  // "Kowalski, J." -> "Kowalski"; joins multiple authors with " · ".
  return authors.map((a) => a.split(",")[0].trim()).join(" · ");
}

export function SpineWall({ publications, labels }: SpineWallProps) {
  const reduce = useReducedMotion();
  const panelId = useId();
  const [selected, setSelected] = useState(0);
  const [readerOpen, setReaderOpen] = useState(false);
  // Czytnik da się otworzyć dwoma przyciskami — z panelu (desktop) i z karty
  // (telefon). Ref nie może więc wisieć na jednym z nich: zapisujemy ten,
  // którym faktycznie otwarto, żeby fokus miał dokąd wrócić na obu szerokościach.
  const openerRef = useRef<HTMLElement | null>(null);

  if (publications.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border-medium bg-bg-surface p-10 text-center">
        <p className="font-display text-[1.125rem] font-semibold text-ink-primary">{labels.emptyTitle}</p>
        <p className="mx-auto mt-2 max-w-[46ch] text-[0.9375rem] leading-[1.6] text-ink-secondary">
          {labels.emptyDesc}
        </p>
      </div>
    );
  }

  const active = publications[selected];
  const tone = toneFor(active.title);
  const edition = active.edition ? editionBySlug(active.edition) : undefined;
  const hasPages = edition ? pagesOf(edition.slug).length > 0 : false;

  return (
    <div>
      <p className="sr-only" id={`${panelId}-hint`}>
        {labels.hint}
      </p>

      {/* Desktop / tablet — book spines.
          `inert` gdy czytnik jest otwarty: to on jest wtedy jedyną treścią
          strony — grzbiety pod spodem muszą zniknąć z drzewa dostępności i z
          kolejności Tab, inaczej czytnik ekranu w trybie przeglądania (nie
          Tab) nadal je znajdzie mimo nakładki na wierzchu. */}
      <ul
        className="hidden md:grid md:grid-cols-[repeat(auto-fill,minmax(168px,1fr))] md:gap-5"
        inert={readerOpen || undefined}
      >
        {publications.map((p, i) => {
          const tone = toneFor(p.title);
          const isActive = i === selected;
          return (
            <li key={`${p.title}-${i}`} className="flex">
              <motion.button
                type="button"
                aria-expanded={isActive}
                aria-controls={panelId}
                aria-label={`${p.title} — ${p.authors.join(", ")}, ${p.year}`}
                onClick={() => setSelected(i)}
                /* Wybrany tom zostaje WYSUNIĘTY, nie tylko obrysowany. Sam
                   cienki obrys ginął wśród dziesięciu kart i nie było widać,
                   która pozycja jest otwarta w panelu poniżej. */
                animate={reduce ? undefined : { y: isActive ? -12 : 0 }}
                whileHover={reduce ? undefined : { y: isActive ? -12 : -6 }}
                whileFocus={reduce ? undefined : { y: isActive ? -12 : -6 }}
                transition={{ type: "spring", stiffness: 320, damping: 22 }}
                style={{
                  outlineColor: isActive ? "var(--accent)" : "transparent",
                  outlineWidth: isActive ? 3 : 0,
                }}
                /* Proporcja 0.706 to format prawdziwego tomu (798×1130 px skanu),
                   więc karta ma kształt okładki, a nie dowolnego kafla.
                   Zaznaczenie idzie przez `outline`, nie `border`: obramowanie
                   zjadałoby szerokość pola i pas serii przeskakiwałby o 2 px
                   przy każdym wyborze. */
                className={`group relative flex aspect-[0.706] w-full flex-col overflow-hidden rounded-[3px] text-left outline-offset-[3px] transition-shadow duration-150 focus-visible:outline-2 focus-visible:outline-accent ${
                  isActive
                    ? "shadow-[0_4px_8px_rgba(15,23,42,0.2),0_26px_44px_-16px_rgba(44,75,255,0.55)]"
                    : "shadow-[0_1px_2px_rgba(15,23,42,0.14),0_8px_18px_-10px_rgba(15,23,42,0.45)] hover:shadow-[0_2px_4px_rgba(15,23,42,0.16),0_16px_28px_-12px_rgba(15,23,42,0.5)]"
                }`}
              >
                {/* Pasek u dołu wybranej karty — drugi, niezależny od koloru
                    sygnał wyboru. Sam obrys w kolorze akcentu na granatowej
                    okładce byłby ledwie widoczny. */}
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 z-10 h-1.5 bg-accent"
                  />
                )}
                {/* Pas serii — jak na prawdziwej okładce: rozstrzelona nazwa
                    serii, rok wyrównany do prawej, pod spodem kreska. */}
                <span
                  aria-hidden="true"
                  style={{ backgroundColor: BAND_BG, color: BAND_FG }}
                  className="block shrink-0 px-3 pt-3 pb-2"
                >
                  <span className="font-mono block text-[0.5rem] leading-[1.1] tracking-[0.24em] uppercase">
                    Debiuty
                  </span>
                  <span className="font-mono mt-0.5 block text-[0.5rem] leading-[1.1] tracking-[0.24em] uppercase">
                    Studenckie
                  </span>
                  <span className="font-mono mt-1.5 block text-right text-[0.6875rem] leading-none tracking-[0.18em]">
                    {p.year}
                  </span>
                </span>
                <span aria-hidden="true" className="block h-[3px] shrink-0 bg-black/25" />

                {/* Pole tytułowe. */}
                <span
                  aria-hidden="true"
                  style={{ backgroundColor: tone, color: "#F6F8FC" }}
                  className="flex min-h-0 flex-1 flex-col justify-between p-3"
                >
                  <span className="font-display line-clamp-5 text-[0.8125rem] leading-[1.25] font-bold tracking-[-0.01em] uppercase">
                    {p.title}
                  </span>
                  <span className="font-mono mt-2 line-clamp-2 text-[0.5625rem] leading-[1.35] tracking-[0.04em] uppercase">
                    {authorSurnames(p.authors)}
                  </span>
                </span>
              </motion.button>
            </li>
          );
        })}
      </ul>

      {/* Mobile — vertical cards, same data (no hidden toggle: everything is
          already on the card, so no <button> disclosure is needed here). */}
      <ul className="flex flex-col gap-4 md:hidden" inert={readerOpen || undefined}>
        {publications.map((p, i) => {
          const t = toneFor(p.title);
          const cardEdition = p.edition ? editionBySlug(p.edition) : undefined;
          const cardHasPages = cardEdition ? pagesOf(cardEdition.slug).length > 0 : false;
          return (
            <li key={`${p.title}-m-${i}`} className="rounded-xl border border-border-subtle bg-bg-surface p-5">
              <span
                aria-hidden="true"
                style={{ backgroundColor: t, color: "#F6F8FC" }}
                className="inline-block rounded px-2 py-0.5 font-mono text-[0.6875rem] uppercase tracking-[0.06em]"
              >
                {p.year}
              </span>
              <h3 className="mt-3 font-display text-[1.0625rem] font-semibold leading-[1.3] text-ink-primary">
                {p.title}
              </h3>
              <p className="mt-1 font-mono text-[0.8125rem] text-ink-secondary">{p.authors.join(", ")}</p>
              {p.circle && (
                <p className="mt-2 text-[0.8125rem] text-ink-tertiary">
                  {labels.circleLabel}: {p.circle}
                </p>
              )}
              {p.abstract && (
                <p className="mt-3 text-[0.875rem] leading-[1.6] text-ink-secondary">{p.abstract}</p>
              )}
              <p className="mt-3 font-mono text-[0.75rem] leading-[1.6] text-ink-tertiary">{formatCitation(p)}</p>
              <div className="mt-4 flex flex-wrap items-center gap-4">
                {cardHasPages ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      openerRef.current = e.currentTarget;
                      // Czytnik bierze wydanie z `active`, więc karta musi
                      // najpierw stać się aktywna — inaczej otworzyłby tom
                      // wybrany wcześniej na grzbietach.
                      setSelected(i);
                      setReaderOpen(true);
                    }}
                    className="inline-flex min-h-12 items-center gap-2 rounded-lg bg-accent px-6 text-base font-medium text-bg-base transition-colors hover:bg-accent-dim"
                  >
                    {labels.readerOpen}
                  </button>
                ) : null}
                {p.url && (
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 py-1 text-[0.875rem] font-medium text-accent transition-colors hover:text-accent-dim"
                  >
                    {labels.linkLabel}
                    <ArrowSquareOut size={16} weight="regular" aria-hidden="true" />
                  </a>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      {/* Detail panel — shared by desktop spines; on mobile the cards already
          show everything, but this still holds the citation for consistency. */}
      <div
        id={panelId}
        role="region"
        aria-live="polite"
        style={{ borderColor: "var(--accent)" }}
        className="mt-8 hidden rounded-2xl border-l-4 bg-bg-surface p-6 md:block"
        inert={readerOpen || undefined}
      >
        <p
          aria-hidden="true"
          style={{ backgroundColor: tone, color: "#F6F8FC" }}
          className="inline-block rounded px-2 py-0.5 font-mono text-[0.6875rem] uppercase tracking-[0.06em]"
        >
          {active.year}
        </p>
        <h3 className="mt-3 font-display text-[1.375rem] font-semibold leading-[1.25] text-ink-primary">
          {active.title}
        </h3>
        <p className="mt-1 font-mono text-[0.875rem] text-ink-secondary">{active.authors.join(", ")}</p>
        {active.circle && (
          <p className="mt-2 text-[0.8125rem] text-ink-tertiary">
            {labels.circleLabel}: {active.circle}
          </p>
        )}
        {active.abstract && (
          <p className="prose-constrained mt-4 text-[0.9375rem] leading-[1.65] text-ink-secondary">
            {active.abstract}
          </p>
        )}
        <p className="mt-4 font-mono text-[0.75rem] leading-[1.6] text-ink-tertiary">{formatCitation(active)}</p>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          {hasPages && edition ? (
            <button
              type="button"
              onClick={(e) => {
                openerRef.current = e.currentTarget;
                setReaderOpen(true);
              }}
              className="inline-flex min-h-12 items-center gap-2 rounded-lg bg-accent px-6 text-base font-medium text-bg-base transition-colors hover:bg-accent-dim"
            >
              {labels.readerOpen}
            </button>
          ) : null}
          {active.url && (
            <a
              href={active.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[0.875rem] font-medium text-accent transition-colors hover:text-accent-dim"
            >
              {labels.linkLabel}
              <ArrowSquareOut size={16} weight="regular" aria-hidden="true" />
            </a>
          )}
        </div>
      </div>

      {readerOpen && edition ? (
        <EditionReader
          edition={edition}
          onClose={() => {
            setReaderOpen(false);
            // Fokus wraca tam, skąd otwarto — inaczej użytkownik klawiatury
            // ląduje na początku strony i musi przejść ją całą od nowa.
            requestAnimationFrame(() => openerRef.current?.focus());
          }}
          labels={{
            close: labels.readerClose,
            prev: labels.readerPrev,
            next: labels.readerNext,
            readFull: labels.readerFull,
            pageOf: labels.readerPageOf,
            licenseNote: labels.readerLicense,
          }}
        />
      ) : null}
    </div>
  );
}
