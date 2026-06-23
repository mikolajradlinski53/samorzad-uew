"use client";

import { motion, useReducedMotion } from "motion/react";
import { ArrowSquareOut } from "@phosphor-icons/react";
import { ScrollReveal } from "../ScrollReveal";
import { PersonCard } from "../PersonCard";
import { russPhotos } from "@/lib/photos";

const competencies = [
  "Opiniowanie spraw dotyczących dydaktyki i świadczeń stypendialnych",
  "Zajmowanie stanowiska w sprawach dotyczących studentów uczelni",
  "Opiniowanie działalności jednostek i organów zajmujących się sprawami studenckimi",
  "Wybór Przewodniczącego, zatwierdzanie składu Zarządu i udzielanie absolutorium",
  "Nadzór nad działalnością organów Samorządu",
];

const members = [
  "Jarosław Bałut",
  "Martyna Bedlechowicz",
  "Jakub Buchta",
  "Bartosz Buczkowski",
  "Aleksandra Dauerman",
  "Oliwier Kaszewski",
  "Zuzanna Kordus",
  "Zuzanna Kuśmińska",
  "Zofia Palus",
  "Natalia Pietrzak",
  "Agata Rusak",
  "Karina Służyńska",
];

export function RUSSContent() {
  const reduce = useReducedMotion();

  return (
    <>
      {/* Intro + competencies */}
      <section className="section-padding" aria-labelledby="russ-intro-heading">
        <div className="mx-auto grid max-w-[1200px] gap-12 lg:grid-cols-[5fr_7fr]">
          <ScrollReveal>
            <h2
              id="russ-intro-heading"
              className="font-display text-[clamp(1.75rem,3.4vw,2.75rem)] font-semibold leading-[1.15] tracking-[-0.02em] text-ink-primary"
            >
              Głos studentów w jednym miejscu
            </h2>
            <p className="prose-constrained mt-4 text-[1.0625rem] leading-[1.75] text-ink-secondary">
              RUSS to organ uchwałodawczy i opiniodawczy Samorządu. 15 radnych
              wybieranych w wyborach powszechnych na roczną kadencję reprezentuje
              postulaty studentów podczas obrad i głosowań.
            </p>
            <a
              href="https://samorzad.ue.wroc.pl/rada-uczelniana-samorzadu-studentow"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex h-11 items-center gap-2 rounded-lg border border-border-medium px-6 text-[0.9375rem] font-medium text-ink-primary transition-colors hover:border-border-soft hover:bg-bg-elevated"
            >
              Uchwały, protokoły i kalendarz obrad
              <ArrowSquareOut size={16} weight="regular" aria-hidden="true" />
            </a>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <ul className="flex flex-col gap-3">
              {competencies.map((c, i) => (
                <li
                  key={c}
                  className="flex items-start gap-4 rounded-xl border border-border-subtle bg-bg-surface p-5"
                >
                  <span
                    aria-hidden="true"
                    className="font-mono text-[1.25rem] font-medium leading-none text-accent tabular-nums"
                  >
                    §{i + 1}
                  </span>
                  <p className="text-[0.9375rem] leading-[1.55] text-ink-secondary">{c}</p>
                </li>
              ))}
            </ul>
          </ScrollReveal>
        </div>
      </section>

      {/* Members assemble */}
      <section
        className="section-padding border-t border-border-subtle pt-16"
        aria-labelledby="russ-members-heading"
      >
        <div className="mx-auto max-w-[1200px]">
          <ScrollReveal>
            <p className="text-[0.75rem] font-medium uppercase tracking-[0.08em] text-accent">
              Kadencja 2025 / 2026
            </p>
            <h2
              id="russ-members-heading"
              className="mt-3 font-display text-[clamp(1.75rem,3.4vw,2.75rem)] font-semibold leading-[1.15] tracking-[-0.02em] text-ink-primary"
            >
              Skład Rady
            </h2>
          </ScrollReveal>

          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {members.map((name, i) => (
              <motion.li
                key={name}
                initial={reduce ? false : { opacity: 0, scale: 0.8 }}
                whileInView={reduce ? undefined : { opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={
                  reduce
                    ? undefined
                    : {
                        type: "spring",
                        stiffness: 320,
                        damping: 18,
                        delay: Math.min(i, 8) * 0.05,
                      }
                }
                className="h-full"
              >
                <PersonCard name={name} role="Rada Uczelniana" photo={russPhotos[i]} plain className="h-full" />
              </motion.li>
            ))}
          </ul>
          <p className="mt-6 text-[0.8125rem] text-ink-tertiary">
            Skład może ulegać zmianom w trakcie kadencji.
          </p>
        </div>
      </section>
    </>
  );
}
