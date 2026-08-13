"use client";

import { motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import { AuroraField } from "./AuroraField";
import { Breadcrumbs, type Crumb } from "./Breadcrumbs";
import { DURATION, EASE } from "@/lib/motion";

interface PageHeroProps {
  eyebrow: string;
  title: string;
  lead?: string;
  breadcrumbs: Crumb[];
}

export function PageHero({ eyebrow, title, lead, breadcrumbs }: PageHeroProps) {
  const reduce = useReducedMotion();
  const t = useTranslations("ui.aria");

  const instant = { duration: 0 };

  return (
    <section aria-label={t("pageHeader")} className="relative overflow-hidden">
      {/* Ambient signature */}
      <motion.div
        initial={reduce ? false : { opacity: 0, scale: 1.025 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={reduce ? instant : { duration: DURATION.trace, ease: EASE }}
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
      >
        <div className="absolute -inset-x-0 -top-[20%] h-[140%]">
          <AuroraField />
        </div>
        <div className="grain" />
      </motion.div>

      <div className="relative z-10 mx-auto max-w-[1200px] px-6 pb-16 pt-[140px] md:pb-20">
        <motion.div
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={reduce ? instant : { duration: DURATION.reveal, ease: EASE }}
        >
          <Breadcrumbs items={breadcrumbs} />
        </motion.div>

        <motion.p
          className="mt-8 flex items-center gap-3 text-[0.75rem] font-medium uppercase tracking-[0.18em] text-accent"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={
            reduce ? instant : { duration: DURATION.reveal, delay: 0.08, ease: EASE }
          }
        >
          <motion.span
            className="h-px w-8 shrink-0 origin-left bg-accent"
            aria-hidden="true"
            initial={reduce ? false : { scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={
              reduce ? instant : { duration: DURATION.draw, delay: 0.12, ease: EASE }
            }
          />
          {eyebrow}
        </motion.p>

        <div className="mt-4 overflow-hidden pb-[0.08em]">
          <motion.h1
            initial={reduce ? false : { y: "108%" }}
            animate={{ y: "0%" }}
            transition={
              reduce ? instant : { duration: DURATION.draw, delay: 0.1, ease: EASE }
            }
            className="max-w-[20ch] text-balance font-display text-[clamp(2.5rem,5.5vw,4.5rem)] font-semibold leading-[1.05] tracking-[-0.02em] text-ink-primary"
          >
            {title}
          </motion.h1>
        </div>

        {lead && (
          <motion.p
            className="prose-constrained mt-6 text-[1.0625rem] leading-[1.75] text-ink-secondary"
            initial={reduce ? false : { opacity: 0, filter: "blur(4px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={
              reduce ? instant : { duration: 0.55, delay: 0.34, ease: EASE }
            }
          >
            {lead}
          </motion.p>
        )}
      </div>
    </section>
  );
}
