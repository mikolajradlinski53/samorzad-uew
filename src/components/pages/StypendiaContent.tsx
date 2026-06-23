"use client";

import { motion, useReducedMotion } from "motion/react";
import {
  Coins,
  Trophy,
  Wheelchair,
  Lifebuoy,
  FileText,
  ArrowSquareOut,
  type Icon,
} from "@phosphor-icons/react";
import { ScrollReveal } from "../ScrollReveal";

interface Kind {
  title: string;
  desc: string;
  href: string;
  icon: Icon;
}

const kinds: Kind[] = [
  {
    title: "Socjalne",
    desc: "Dla studentów znajdujących się w trudniejszej sytuacji materialnej.",
    href: "/stypendia-socjalne",
    icon: Coins,
  },
  {
    title: "Rektora",
    desc: "Za bardzo dobre wyniki w nauce oraz osiągnięcia naukowe, sportowe lub artystyczne.",
    href: "/stypendia-rektora",
    icon: Trophy,
  },
  {
    title: "Dla osób z niepełnosprawnością",
    desc: "Wsparcie dla studentów z orzeczoną niepełnosprawnością.",
    href: "/stypendia-dla-niepelnosprawnych",
    icon: Wheelchair,
  },
  {
    title: "Zapomoga",
    desc: "Jednorazowa pomoc w nagłej, przejściowo trudnej sytuacji życiowej.",
    href: "/zapomoga",
    icon: Lifebuoy,
  },
];

const documents = [
  "Wykaz dokumentacji przy ubieganiu się o stypendium socjalne",
  "Zasady obliczania dochodu w rodzinie studenta",
  "Zasady oceny osiągnięć naukowych, artystycznych i sportowych",
  "Dane do wyznaczania stypendiów i zapomóg",
  "Oświadczenia do stypendium socjalnego",
  "Kwestionariusz studenta z orzeczoną niepełnosprawnością",
  "Zasady zakwaterowania w domach studenckich",
  "Oświadczenie o braku zmiany sytuacji materialnej",
  "Oświadczenie o nieprowadzeniu wspólnego gospodarstwa z rodzicami",
  "Wzór zgody i klauzuli informacyjnej",
];

const officialLinks = [
  {
    label: "Aktualności dotyczące stypendiów",
    href: "https://uew.pl/kandydaci/wsparcie-finansowe-dla-studentow/",
  },
  {
    label: "Infopack: świadczenia i pomoc materialna",
    href: "/wsparcie-materialne-i-swiadczenia",
  },
  {
    label: "Regulamin świadczeń stypendialnych (PDF)",
    href: "https://drive.google.com/file/d/18eMIfTCKHe2VkeNhqpbcnE2_dnEfzpv8/view?usp=drive_link",
  },
];

export function StypendiaContent() {
  const reduce = useReducedMotion();

  return (
    <>
      {/* Intro + types */}
      <section className="section-padding" aria-labelledby="rodzaje-heading">
        <div className="mx-auto max-w-[1200px]">
          <ScrollReveal>
            <p className="prose-constrained text-[1.0625rem] leading-[1.75] text-ink-secondary">
              Podczas studiów możesz skorzystać z różnych form wsparcia
              finansowego oferowanych przez uczelnię — zarówno świadczeń dla osób
              w trudniejszej sytuacji materialnej, jak i stypendiów za bardzo
              dobre wyniki w nauce oraz osiągnięcia naukowe, sportowe i
              artystyczne.
            </p>
            <h2
              id="rodzaje-heading"
              className="mt-12 font-display text-[clamp(1.75rem,3.4vw,2.75rem)] font-semibold leading-[1.15] tracking-[-0.02em] text-ink-primary"
            >
              Rodzaje wsparcia
            </h2>
          </ScrollReveal>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {kinds.map((kind, i) => {
              const Glyph = kind.icon;
              return (
                <motion.a
                  key={kind.title}
                  href={kind.href}
                  initial={reduce ? false : { opacity: 0, y: 20 }}
                  whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                  whileHover={
                    reduce
                      ? undefined
                      : { y: -6, transition: { type: "spring", stiffness: 300, damping: 20 } }
                  }
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.5,
                    delay: i * 0.05,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="group flex flex-col rounded-xl border border-border-subtle bg-bg-surface p-6 transition-colors duration-150 hover:border-border-soft hover:bg-bg-elevated"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent-glow text-accent">
                    <Glyph size={24} weight="regular" aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 text-[1.0625rem] font-semibold tracking-[-0.01em] text-ink-primary">
                    {kind.title}
                  </h3>
                  <p className="mt-2 text-[0.875rem] leading-[1.6] text-ink-secondary">
                    {kind.desc}
                  </p>
                </motion.a>
              );
            })}
          </div>
        </div>
      </section>

      {/* Documents + official links */}
      <section
        className="section-padding pt-0"
        aria-labelledby="dokumenty-heading"
      >
        <div className="mx-auto grid max-w-[1200px] gap-12 lg:grid-cols-[7fr_5fr]">
          {/* Documents */}
          <ScrollReveal>
            <h2
              id="dokumenty-heading"
              className="font-display text-[clamp(1.75rem,3.4vw,2.75rem)] font-semibold leading-[1.15] tracking-[-0.02em] text-ink-primary"
            >
              Dokumenty i załączniki
            </h2>
            <ol className="mt-8 flex flex-col">
              {documents.map((doc, i) => (
                <li
                  key={doc}
                  className="flex items-start gap-4 border-b border-border-subtle py-4 last:border-b-0"
                >
                  <span
                    aria-hidden="true"
                    className="mt-0.5 w-8 shrink-0 font-medium tabular-nums text-accent"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[0.9375rem] leading-[1.55] text-ink-secondary">
                    {doc}
                  </span>
                </li>
              ))}
            </ol>
            <a
              href="https://samorzad.ue.wroc.pl/stypendia"
              className="mt-6 inline-flex h-11 items-center gap-2 rounded-lg border border-border-medium px-6 text-[0.9375rem] font-medium text-ink-primary transition-colors hover:border-border-soft hover:bg-bg-elevated"
            >
              <FileText size={18} weight="regular" aria-hidden="true" />
              Pobierz wszystkie dokumenty
            </a>
          </ScrollReveal>

          {/* Official links */}
          <ScrollReveal delay={0.1}>
            <h2 className="font-display text-[clamp(1.75rem,3.4vw,2.75rem)] font-semibold leading-[1.15] tracking-[-0.02em] text-ink-primary">
              Ważne odnośniki
            </h2>
            <ul className="mt-8 flex flex-col gap-3">
              {officialLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between gap-4 rounded-xl border border-border-subtle bg-bg-surface p-5 transition-colors duration-150 hover:border-border-soft hover:bg-bg-elevated"
                  >
                    <span className="text-[0.9375rem] font-medium text-ink-primary">
                      {link.label}
                    </span>
                    <ArrowSquareOut
                      size={20}
                      weight="regular"
                      aria-hidden="true"
                      className="shrink-0 text-ink-tertiary transition-colors group-hover:text-accent"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
