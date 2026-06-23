"use client";

import { motion, useReducedMotion } from "motion/react";
import { Link } from "@/i18n/navigation";
import {
  Scales,
  GraduationCap,
  HandCoins,
  MapTrifold,
  Package,
  FirstAidKit,
  Megaphone,
  BookOpen,
  ArrowUpRight,
  ArrowSquareOut,
  type Icon,
} from "@phosphor-icons/react";
import { ScrollReveal } from "./ScrollReveal";

interface Resource {
  title: string;
  description: string;
  href: string;
  icon: Icon;
  internal?: boolean;
}

const BASE = "https://samorzad.ue.wroc.pl";

const resources: Resource[] = [
  {
    title: "Prawa studenta",
    description: "Twoje prawa na uczelni i jak ich dochodzić.",
    href: "/prawa-studenta",
    icon: Scales,
    internal: true,
  },
  {
    title: "Stypendia",
    description: "Rektorskie, socjalne i dla osób z niepełnosprawnością.",
    href: "/stypendia",
    icon: GraduationCap,
    internal: true,
  },
  {
    title: "Wsparcie i zapomogi",
    description: "Świadczenia materialne i pomoc w trudnej sytuacji.",
    href: "/wsparcie-materialne-i-swiadczenia",
    icon: HandCoins,
    internal: true,
  },
  {
    title: "Mapa kampusu",
    description: "Budynki, sale i najważniejsze punkty na uczelni.",
    href: `${BASE}/mapa-kampusu`,
    icon: MapTrifold,
  },
  {
    title: "Infopacki",
    description: "Praktyczne pakiety informacji dla studentów.",
    href: `${BASE}/infopacki`,
    icon: Package,
  },
  {
    title: "Pomoc psychologiczna",
    description: "Gdzie i jak uzyskać wsparcie, gdy go potrzebujesz.",
    href: `${BASE}/pomoc-psychologiczna`,
    icon: FirstAidKit,
  },
  {
    title: "Rzecznik Praw Studenta",
    description: "Stoi po Twojej stronie w sporach z uczelnią.",
    href: `${BASE}/rzecznik-praw-studenta`,
    icon: Megaphone,
  },
  {
    title: "Prawo dla studenta",
    description: "Regulaminy i przepisy w przystępnej formie.",
    href: `${BASE}/prawo-dla-studenta`,
    icon: BookOpen,
  },
];

export function Resources() {
  const reduce = useReducedMotion();

  return (
    <section
      id="dla-studenta"
      aria-labelledby="dla-studenta-heading"
      className="section-padding"
    >
      <div className="mx-auto max-w-[1200px]">
        <ScrollReveal>
          <p className="text-[0.75rem] font-medium uppercase tracking-[0.08em] text-accent">
            Strefa studenta
          </p>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
            <h2
              id="dla-studenta-heading"
              className="max-w-[18ch] font-display text-[clamp(2.5rem,5vw,4rem)] font-semibold leading-[1.1] tracking-[-0.02em] text-ink-primary"
            >
              Wszystko, czego potrzebujesz
            </h2>
            <Link
              href="/dla-studenta"
              className="inline-flex items-center gap-1.5 text-[0.9375rem] font-medium text-accent transition-colors hover:text-accent-dim"
            >
              Zobacz całą strefę
              <ArrowUpRight size={18} weight="regular" aria-hidden="true" />
            </Link>
          </div>
        </ScrollReveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {resources.map((item, i) => {
            const Glyph = item.icon;
            const OutIcon = item.internal ? ArrowUpRight : ArrowSquareOut;
            return (
              <motion.div
                key={item.title}
                initial={reduce ? false : { opacity: 0, y: 20 }}
                whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                whileHover={
                  reduce
                    ? undefined
                    : { y: -6, transition: { type: "spring", stiffness: 300, damping: 20 } }
                }
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  duration: 0.5,
                  delay: Math.min(i, 4) * 0.05,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="group relative flex flex-col rounded-xl border border-border-subtle bg-bg-surface p-6 transition-colors duration-150 hover:border-border-soft hover:bg-bg-elevated"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent-glow text-accent">
                  <Glyph size={24} weight="regular" aria-hidden="true" />
                </span>
                <h3 className="mt-5 flex items-center gap-1.5 text-[1.0625rem] font-semibold tracking-[-0.01em] text-ink-primary">
                  {item.title}
                  <OutIcon
                    size={16}
                    weight="bold"
                    aria-hidden="true"
                    className="text-ink-tertiary transition-all duration-150 group-hover:translate-x-0.5 group-hover:text-accent"
                  />
                </h3>
                <p className="mt-2 text-[0.875rem] leading-[1.6] text-ink-secondary">
                  {item.description}
                </p>
                {item.internal ? (
                  <Link
                    href={item.href}
                    aria-label={item.title}
                    className="absolute inset-0 rounded-xl"
                  />
                ) : (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${item.title} (otwiera się w nowej karcie)`}
                    className="absolute inset-0 rounded-xl"
                  />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
