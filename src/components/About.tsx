"use client";

import { motion, useReducedMotion } from "motion/react";
import { GraduationCap, UsersThree, CalendarCheck, type Icon } from "@phosphor-icons/react";
import { ScrollReveal } from "./ScrollReveal";
import { CountUp } from "./CountUp";

type Stat = { label: string; icon: Icon } & (
  | { to: number; suffix: string }
  | { year: string }
);

const stats: Stat[] = [
  { to: 11000, suffix: "+", label: "studentów", icon: GraduationCap },
  { to: 12, suffix: "", label: "komisji", icon: UsersThree },
  { year: "1981", label: "rok założenia", icon: CalendarCheck },
];

export function About() {
  const reduce = useReducedMotion();

  return (
    <section id="o-nas" aria-labelledby="o-nas-heading" className="section-padding">
      <div className="mx-auto max-w-[1200px]">
        <ScrollReveal>
          <p className="text-[0.75rem] font-medium uppercase tracking-[0.08em] text-accent">
            O nas
          </p>
          <h2
            id="o-nas-heading"
            className="mt-3 max-w-[16ch] font-display text-[clamp(1.75rem,3vw,2.5rem)] font-semibold leading-[1.15] tracking-[-0.02em] text-ink-primary"
          >
            Organizacja, która działa od ponad 40 lat
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
                    <motion.span
                      aria-hidden="true"
                      initial={reduce ? false : { scaleX: 0 }}
                      whileInView={reduce ? undefined : { scaleX: 1 }}
                      viewport={{ once: true, amount: 0.6 }}
                      transition={{
                        duration: 0.7,
                        delay: 0.15 + Math.min(i, 4) * 0.12,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="mt-3 block h-[3px] w-14 origin-left rounded-full bg-accent"
                    />
                    <p className="mt-3 text-[0.8125rem] font-medium uppercase tracking-[0.08em] text-ink-secondary">
                      {stat.label}
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
                Samorząd Studentów Uniwersytetu Ekonomicznego we Wrocławiu to
                organizacja, która od ponad 40 lat
                reprezentuje interesy studentów wobec władz uczelni, miasta i
                ogólnopolskich instytucji. Prowadzimy projekty, organizujemy
                wydarzenia i dbamy o to, żeby głos studentów był słyszany.
              </p>
              <p className="prose-constrained mt-4 text-[1.0625rem] leading-[1.75] text-ink-secondary">
                Łączymy ludzi, którym zależy. Każdy z Was może dołączyć do
                naszego zespołu i współtworzyć społeczność akademicką UEW.
              </p>

              {/* Pull quote */}
              <blockquote className="mt-8 border-l-2 border-accent py-1 pl-6">
                <p className="font-display text-[clamp(1.75rem,3vw,2.5rem)] font-semibold leading-[1.2] tracking-[-0.02em] text-ink-primary">
                  &ldquo;Nie czekamy na zmiany. Tworzymy je.&rdquo;
                </p>
              </blockquote>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
