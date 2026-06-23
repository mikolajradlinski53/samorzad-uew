"use client";

import { motion, useReducedMotion } from "motion/react";
import {
  Gavel,
  Certificate,
  BookOpen,
  Stamp,
  FileText,
  Buildings,
  ArrowSquareOut,
  type Icon,
} from "@phosphor-icons/react";
import { ScrollReveal } from "../ScrollReveal";
import { Tilt } from "../Tilt";

const LIVE = "https://samorzad.ue.wroc.pl/prawo-dla-studenta";

interface Source {
  kind: string;
  title: string;
  href: string;
  icon: Icon;
}

const sources: Source[] = [
  {
    kind: "Ustawa",
    title: "Prawo o szkolnictwie wyższym i nauce",
    href: "https://isap.sejm.gov.pl/isap.nsf/download.xsp/WDU20180001668/U/D20181668Lj.pdf",
    icon: Gavel,
  },
  { kind: "Statut", title: "Statut Uniwersytetu Ekonomicznego we Wrocławiu", href: LIVE, icon: Certificate },
  { kind: "Uczelniany", title: "Regulamin Studiów", href: LIVE, icon: BookOpen },
  { kind: "Zarządzenia", title: "Rektora i Prorektorów", href: LIVE, icon: Stamp },
  { kind: "Pisma", title: "Dziekana", href: LIVE, icon: FileText },
  { kind: "Regulamin", title: "Organizacyjny UEW", href: LIVE, icon: Buildings },
];

export function PrawoContent() {
  const reduce = useReducedMotion();

  return (
    <section className="section-padding" aria-labelledby="prawo-heading">
      <div className="mx-auto max-w-[1200px]">
        <ScrollReveal>
          <p className="prose-constrained text-[1.0625rem] leading-[1.75] text-ink-secondary">
            Tu znajdziesz najważniejsze przepisy, na podstawie których funkcjonuje
            nasza Uczelnia — od ustaw po wewnętrzne regulacje uczelniane.
          </p>
          <h2 id="prawo-heading" className="sr-only">
            Akty prawne
          </h2>
        </ScrollReveal>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {sources.map((source, i) => {
            const Glyph = source.icon;
            return (
              <motion.div
                key={source.title}
                initial={reduce ? false : { opacity: 0, y: 20 }}
                whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: Math.min(i, 5) * 0.05, ease: [0.16, 1, 0.3, 1] }}
              >
                <Tilt className="h-full" max={6}>
                  <a
                    href={source.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex h-full flex-col rounded-xl border border-border-subtle bg-bg-surface p-6 transition-colors duration-150 hover:border-border-soft hover:bg-bg-elevated"
                  >
                    <div className="flex items-center justify-between">
                      <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent-glow text-accent">
                        <Glyph size={24} weight="regular" aria-hidden="true" />
                      </span>
                      <ArrowSquareOut
                        size={18}
                        weight="regular"
                        aria-hidden="true"
                        className="text-ink-tertiary transition-colors group-hover:text-accent"
                      />
                    </div>
                    <p className="mt-5 text-[0.6875rem] font-medium uppercase tracking-[0.1em] text-accent">
                      {source.kind}
                    </p>
                    <h3 className="mt-1 text-[1.0625rem] font-semibold leading-snug tracking-[-0.01em] text-ink-primary">
                      {source.title}
                    </h3>
                  </a>
                </Tilt>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
