"use client";

import { useId, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowSquareOut } from "@phosphor-icons/react";
import type { Publication } from "@/lib/publications";
import { formatCitation } from "@/lib/publications";

export interface SpineWallLabels {
  emptyTitle: string;
  emptyDesc: string;
  circleLabel: string;
  linkLabel: string;
  hint: string;
}

interface SpineWallProps {
  publications: Publication[];
  labels: SpineWallLabels;
}

/**
 * Small, on-brand set of "spine tones" — graduated tints/shades of
 * --accent plus the ink/elevated neutrals already in the palette. No new
 * hues: DESIGN.md reserves --accent for identity moments, so most tones
 * here are *derived* from it (color-mix) rather than used at full strength.
 */
const SPINE_TONES = [
  { bg: "var(--accent)", fg: "var(--bg-base)", border: "transparent" },
  { bg: "var(--ink-primary)", fg: "var(--bg-base)", border: "transparent" },
  { bg: "color-mix(in srgb, var(--accent) 32%, var(--bg-elevated))", fg: "var(--ink-primary)", border: "transparent" },
  { bg: "var(--accent-dim)", fg: "var(--bg-base)", border: "transparent" },
  { bg: "var(--bg-elevated)", fg: "var(--ink-primary)", border: "var(--border-medium)" },
];

/** Deterministic djb2 hash → stable tone per title (no Math.random). */
function hashString(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) {
    h = (h * 33) ^ s.charCodeAt(i);
  }
  return Math.abs(h);
}

function toneFor(title: string) {
  return SPINE_TONES[hashString(title) % SPINE_TONES.length];
}

function authorSurnames(authors: string[]): string {
  // "Kowalski, J." -> "Kowalski"; joins multiple authors with " · ".
  return authors.map((a) => a.split(",")[0].trim()).join(" · ");
}

export function SpineWall({ publications, labels }: SpineWallProps) {
  const reduce = useReducedMotion();
  const panelId = useId();
  const [selected, setSelected] = useState(0);

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

  return (
    <div>
      <p className="sr-only" id={`${panelId}-hint`}>
        {labels.hint}
      </p>

      {/* Desktop / tablet — book spines */}
      <ul className="hidden md:flex md:flex-wrap md:items-end md:gap-4">
        {publications.map((p, i) => {
          const t = toneFor(p.title);
          const isActive = i === selected;
          return (
            <li key={`${p.title}-${i}`} className="flex">
              <motion.button
              type="button"
              aria-expanded={isActive}
              aria-controls={panelId}
              aria-label={`${p.title} — ${p.authors.join(", ")}, ${p.year}`}
              onClick={() => setSelected(i)}
              whileHover={reduce ? undefined : { y: -10 }}
              whileFocus={reduce ? undefined : { y: -10 }}
              transition={{ type: "spring", stiffness: 320, damping: 22 }}
              style={{
                backgroundColor: t.bg,
                color: t.fg,
                borderColor: isActive ? "var(--accent)" : t.border,
              }}
              className="group relative flex h-[360px] w-[64px] shrink-0 flex-col justify-between overflow-hidden rounded-md border-2 p-3 text-left shadow-none outline-none transition-colors duration-150 focus-visible:border-accent"
            >
              <span
                aria-hidden="true"
                style={{
                  writingMode: "vertical-rl",
                  textOrientation: "mixed",
                  whiteSpace: "nowrap",
                }}
                className="font-display block flex-1 overflow-hidden text-[0.9375rem] font-semibold leading-tight tracking-[-0.01em] text-ellipsis"
              >
                {p.title}
              </span>
              <span
                aria-hidden="true"
                style={{ writingMode: "vertical-rl", textOrientation: "mixed", whiteSpace: "nowrap" }}
                className="font-mono mt-2 block max-h-[88px] shrink-0 overflow-hidden text-[0.6875rem] uppercase tracking-[0.06em] opacity-80"
              >
                {authorSurnames(p.authors)} · {p.year}
              </span>
            </motion.button>
            </li>
          );
        })}
      </ul>

      {/* Mobile — vertical cards, same data (no hidden toggle: everything is
          already on the card, so no <button> disclosure is needed here). */}
      <ul className="flex flex-col gap-4 md:hidden">
        {publications.map((p, i) => {
          const t = toneFor(p.title);
          return (
            <li key={`${p.title}-m-${i}`} className="rounded-xl border border-border-subtle bg-bg-surface p-5">
              <span
                aria-hidden="true"
                style={{ backgroundColor: t.bg, color: t.fg }}
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
              {p.url && (
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 py-1 text-[0.875rem] font-medium text-accent transition-colors hover:text-accent-dim"
                >
                  {labels.linkLabel}
                  <ArrowSquareOut size={16} weight="regular" aria-hidden="true" />
                </a>
              )}
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
      >
        <p
          aria-hidden="true"
          style={{ backgroundColor: tone.bg, color: tone.fg }}
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
        {active.url && (
          <a
            href={active.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 text-[0.875rem] font-medium text-accent transition-colors hover:text-accent-dim"
          >
            {labels.linkLabel}
            <ArrowSquareOut size={16} weight="regular" aria-hidden="true" />
          </a>
        )}
      </div>
    </div>
  );
}
