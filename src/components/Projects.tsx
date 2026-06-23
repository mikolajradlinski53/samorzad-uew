"use client";

import { motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowUpRight } from "@phosphor-icons/react";
import { ScrollReveal } from "./ScrollReveal";
import { Spotlight } from "./Spotlight";

const projects = [{ key: "adaptacja" }, { key: "juwenalia" }, { key: "tarcza" }];

export function Projects() {
  const reduce = useReducedMotion();
  const t = useTranslations("projects");

  return (
    <section
      id="projekty"
      aria-labelledby="projekty-heading"
      className="section-padding"
    >
      <Spotlight />
      <div className="relative z-10 mx-auto max-w-[1200px]">
        <ScrollReveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2
              id="projekty-heading"
              className="font-display text-[clamp(2.5rem,5vw,4rem)] font-semibold leading-[1.1] tracking-[-0.02em] text-ink-primary"
            >
              {t("heading")}
            </h2>
            <Link
              href="/nasze-projekty"
              className="inline-flex items-center gap-1.5 text-[0.9375rem] font-medium text-accent transition-colors hover:text-accent-dim"
            >
              {t("all")}
              <ArrowUpRight size={18} weight="regular" aria-hidden="true" />
            </Link>
          </div>
        </ScrollReveal>

        {/* Irregular grid: NOT 3 equal columns */}
        <div className="mt-12 grid gap-6 md:grid-cols-12">
          {projects.map((project, i) => {
            // Asymmetric column spans: 7, 5, 6 offset
            const colClass =
              i === 0
                ? "md:col-span-7"
                : i === 1
                  ? "md:col-span-5"
                  : "md:col-span-6 md:col-start-4";

            return (
              <motion.article
                key={project.key}
                initial={reduce ? false : { opacity: 0, y: 20 }}
                whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                whileHover={
                  reduce
                    ? undefined
                    : {
                        y: -6,
                        transition: { type: "spring", stiffness: 300, damping: 20 },
                      }
                }
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.05,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={`group rounded-xl border border-border-subtle bg-bg-surface p-6 transition-all duration-150 hover:border-border-soft hover:bg-bg-elevated ${colClass}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="text-[0.75rem] font-medium uppercase tracking-[0.08em] text-accent">
                    {t(`items.${project.key}.commission`)}
                  </span>
                  <span className="shrink-0 rounded-full border border-border-subtle px-3 py-1 text-[0.75rem] font-medium text-ink-secondary">
                    {t(`items.${project.key}.status`)}
                  </span>
                </div>
                <div className="mt-5 flex items-baseline gap-3">
                  <span
                    aria-hidden="true"
                    className="text-[0.8125rem] font-medium tabular-nums tracking-[0.1em] text-accent"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-[1.125rem] font-semibold tracking-[-0.01em] text-ink-primary">
                    {t(`items.${project.key}.name`)}
                  </h3>
                </div>
                <p className="mt-2 text-[0.9375rem] leading-[1.7] text-ink-secondary">
                  {t(`items.${project.key}.description`)}
                </p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
