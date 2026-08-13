"use client";

import { useTranslations } from "next-intl";
import { GraduationCap, UsersThree, CalendarCheck, type Icon } from "@phosphor-icons/react";
import { ScrollReveal } from "./ScrollReveal";
import { Impulse } from "./Impulse";
import { CountUp } from "./CountUp";
import { STAGGER } from "@/lib/motion";

type Stat = { label: string; icon: Icon } & (
  | { to: number; suffix: string }
  | { year: string }
);

const stats: Stat[] = [
  { to: 10000, suffix: "+", label: "statStudents", icon: GraduationCap },
  { to: 6, suffix: "", label: "statCommittees", icon: UsersThree },
  { year: "1987", label: "statFounded", icon: CalendarCheck },
];

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
            className="mt-3 max-w-[16ch] font-display text-[clamp(1.75rem,3vw,2.5rem)] font-semibold leading-[1.15] tracking-[-0.02em] text-ink-primary"
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
                  <div key={i}>
                    <Glyph
                      size={24}
                      weight="regular"
                      aria-hidden="true"
                      className="mb-3 text-accent"
                    />
                    {"year" in stat ? (
                      <span className="block font-display text-[clamp(2.5rem,5vw,4rem)] font-semibold leading-none tracking-[-0.02em] text-ink-primary">
                        {stat.year}
                      </span>
                    ) : (
                      <CountUp
                        to={stat.to}
                        suffix={stat.suffix}
                        className="block font-display text-[clamp(2.5rem,5vw,4rem)] font-semibold leading-none tracking-[-0.02em] text-ink-primary tabular-nums"
                      />
                    )}
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
              <blockquote className="mt-8 border-l-2 border-accent py-1 pl-6">
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
