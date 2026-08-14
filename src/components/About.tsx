"use client";

import { useTranslations } from "next-intl";
import { ArrowSquareOut, Compass, GraduationCap, UsersThree, type Icon } from "@phosphor-icons/react";
import { ScrollReveal } from "./ScrollReveal";
import { Impulse } from "./Impulse";
import { STAGGER } from "@/lib/motion";

interface Stat {
  value: string;
  label: string;
  icon: Icon;
}

const stats: Stat[] = [
  // Oficjalny Plan Równości Płci UEW 2025–2028, stan na 20.10.2024.
  { value: "9 674", label: "statStudents", icon: GraduationCap },
  // RUSS składa się z 15 osób wybieranych w wyborach powszechnych.
  { value: "15", label: "statCouncil", icon: UsersThree },
  // Aktualny katalog „Nasze projekty” opisuje dziewięć stałych inicjatyw.
  { value: "09", label: "statProjects", icon: Compass },
];

const studentCountSource =
  "https://uew.pl/wp-content/uploads/2025/11/UEW-Plan-Rownosci-Plci-UEW-na-lata-2025-2028-PL.pdf";

export function About() {
  const t = useTranslations("about");

  return (
    <section id="o-nas" aria-labelledby="o-nas-heading" className="section-padding">
      <div className="mx-auto max-w-[1200px]">
        <ScrollReveal>
          <p className="text-[0.75rem] font-medium uppercase tracking-[0.08em] text-accent">
            {t("eyebrow")}
          </p>
          <h2
            id="o-nas-heading"
            className="mt-3 sm:max-w-[16ch] text-balance font-display text-[clamp(1.75rem,3vw,2.5rem)] font-semibold leading-[1.15] tracking-[-0.02em] text-ink-primary"
          >
            {t("heading")}
          </h2>
        </ScrollReveal>

        <div className="mt-12 grid gap-16 md:grid-cols-[5fr_7fr]">
          {/* Stats column */}
          <ScrollReveal>
            <div className="flex flex-col gap-12">
              {stats.map((stat, i) => {
                const Glyph = stat.icon;
                return (
                  <div key={stat.label}>
                    <Glyph
                      size={24}
                      weight="regular"
                      aria-hidden="true"
                      className="mb-3 text-accent"
                    />
                    <span className="block font-display text-[clamp(2.5rem,5vw,4rem)] font-semibold leading-none tracking-[-0.04em] text-ink-primary tabular-nums">
                      {stat.value}
                    </span>
                    {/* Signature draw-on underline */}
                    <Impulse
                      delay={0.15 + Math.min(i, 4) * STAGGER}
                      className="mt-3 h-[3px] w-14 rounded-full bg-accent"
                    />
                    <p className="mt-3 text-[0.8125rem] font-medium uppercase tracking-[0.08em] text-ink-secondary">
                      {t(stat.label)}
                    </p>
                  </div>
                );
              })}
              <a
                href={studentCountSource}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex max-w-max items-center gap-2 text-[0.6875rem] font-medium leading-[1.5] text-ink-tertiary underline decoration-border-medium underline-offset-4 transition-colors hover:text-accent"
              >
                {t("source")}
                <ArrowSquareOut size={14} weight="bold" aria-hidden="true" />
              </a>
            </div>
          </ScrollReveal>

          {/* Description column */}
          <ScrollReveal delay={0.1}>
            <div className="flex flex-col justify-center">
              <p className="prose-constrained text-[1.0625rem] leading-[1.75] text-ink-secondary">
                {t("p1")}
              </p>
              <p className="prose-constrained mt-4 text-[1.0625rem] leading-[1.75] text-ink-secondary">
                {t("p2")}
              </p>

              {/* Pull quote */}
              <blockquote className="mt-10 border-t border-border-medium pt-6">
                <p className="font-display text-[clamp(1.75rem,3vw,2.5rem)] font-semibold leading-[1.2] tracking-[-0.02em] text-ink-primary">
                  &ldquo;{t("quote")}&rdquo;
                </p>
              </blockquote>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
