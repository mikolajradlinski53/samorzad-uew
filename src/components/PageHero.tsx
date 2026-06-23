"use client";

import { motion, useReducedMotion } from "motion/react";
import { AuroraField } from "./AuroraField";
import { Breadcrumbs, type Crumb } from "./Breadcrumbs";

interface PageHeroProps {
  eyebrow: string;
  title: string;
  lead?: string;
  breadcrumbs: Crumb[];
}

export function PageHero({ eyebrow, title, lead, breadcrumbs }: PageHeroProps) {
  const reduce = useReducedMotion();

  const enter = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 16 },
    animate: reduce ? undefined : { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] as const },
  });

  return (
    <section aria-label="Nagłówek strony" className="relative overflow-hidden">
      {/* Ambient signature */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -inset-x-0 -top-[20%] h-[140%]">
          <AuroraField />
        </div>
        <div className="grain" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1200px] px-6 pb-16 pt-[140px] md:pb-20">
        <motion.div {...enter(0)}>
          <Breadcrumbs items={breadcrumbs} />
        </motion.div>

        <motion.p
          {...enter(0.06)}
          className="mt-8 flex items-center gap-3 text-[0.75rem] font-medium uppercase tracking-[0.18em] text-accent"
        >
          <span className="h-px w-8 shrink-0 bg-accent" aria-hidden="true" />
          {eyebrow}
        </motion.p>

        <motion.h1
          {...enter(0.12)}
          className="mt-4 max-w-[20ch] font-display text-[clamp(2.5rem,5.5vw,4.5rem)] font-semibold leading-[1.05] tracking-[-0.02em] text-ink-primary"
        >
          {title}
        </motion.h1>

        {lead && (
          <motion.p
            {...enter(0.2)}
            className="prose-constrained mt-6 text-[1.0625rem] leading-[1.75] text-ink-secondary"
          >
            {lead}
          </motion.p>
        )}
      </div>
    </section>
  );
}
