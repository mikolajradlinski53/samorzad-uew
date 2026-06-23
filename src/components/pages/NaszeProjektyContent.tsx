"use client";

import { motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import { ScrollReveal } from "../ScrollReveal";
import { Tilt } from "../Tilt";

interface Project {
  key: string;
  name: string;
  socials: string[];
}

const projects: Project[] = [
  { key: "adapciak", name: "Adapciak", socials: ["Instagram", "Facebook"] },
  { key: "animalia", name: "Animalia", socials: ["Instagram", "Facebook", "TikTok"] },
  { key: "bal", name: "Bal UEW", socials: [] },
  { key: "dni", name: "Dni Adaptacyjne", socials: [] },
  { key: "graduetion", name: "Graduetion", socials: [] },
  { key: "mosty", name: "Mosty Ekonomiczne", socials: ["Instagram", "Facebook", "TikTok"] },
  { key: "test", name: "Test Wiedzy Ekonomicznej", socials: ["Facebook"] },
  { key: "tedx", name: "TEDxUEW", socials: ["Instagram", "Facebook", "LinkedIn", "TikTok"] },
  { key: "party", name: "UE Party", socials: ["Instagram", "Facebook", "TikTok"] },
];

export function NaszeProjektyContent() {
  const reduce = useReducedMotion();
  const t = useTranslations("naszeProjekty");

  return (
    <section className="section-padding" aria-labelledby="projekty-lista-heading">
      <div className="mx-auto max-w-[1200px]">
        <ScrollReveal>
          <h2
            id="projekty-lista-heading"
            className="font-display text-[clamp(1.75rem,3.4vw,2.75rem)] font-semibold leading-[1.15] tracking-[-0.02em] text-ink-primary"
          >
            {t("heading")}
          </h2>
        </ScrollReveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, i) => (
            <motion.div
              key={project.key}
              initial={reduce ? false : { opacity: 0, y: 20 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{
                duration: 0.5,
                delay: Math.min(i, 5) * 0.04,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <Tilt className="h-full">
                <article className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-border-subtle bg-bg-surface p-6 transition-colors duration-150 hover:border-border-soft hover:bg-bg-elevated">
                  {/* accent top line on hover */}
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 bg-accent transition-transform duration-300 group-hover:scale-x-100"
                  />
                  <span
                    aria-hidden="true"
                    className="font-display text-[1.75rem] font-semibold leading-none tracking-[-0.02em] text-accent tabular-nums"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-4 text-[1.25rem] font-semibold tracking-[-0.01em] text-ink-primary">
                    {project.name}
                  </h3>
                  <p className="mt-2 flex-1 text-[0.9375rem] leading-[1.65] text-ink-secondary">
                    {t(`projects.${project.key}.desc`)}
                  </p>
                  {project.socials.length > 0 && (
                    <ul className="mt-5 flex flex-wrap gap-2">
                      {project.socials.map((s) => (
                        <li
                          key={s}
                          className="rounded-full border border-border-subtle px-3 py-1 text-[0.6875rem] font-medium uppercase tracking-[0.06em] text-ink-tertiary"
                        >
                          {s}
                        </li>
                      ))}
                    </ul>
                  )}
                </article>
              </Tilt>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
