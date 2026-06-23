"use client";

import { motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
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

interface Source {
  key: string;
  href?: string;
  icon: Icon;
  comingSoon?: boolean;
}

// "act" links to the public ISAP government source; the remaining documents
// live on the old domain and are marked "coming soon" until migrated.
const sources: Source[] = [
  { key: "act", href: "https://isap.sejm.gov.pl/isap.nsf/download.xsp/WDU20180001668/U/D20181668Lj.pdf", icon: Gavel },
  { key: "statute", icon: Certificate, comingSoon: true },
  { key: "studyReg", icon: BookOpen, comingSoon: true },
  { key: "orders", icon: Stamp, comingSoon: true },
  { key: "deanLetters", icon: FileText, comingSoon: true },
  { key: "orgReg", icon: Buildings, comingSoon: true },
];

export function PrawoContent() {
  const reduce = useReducedMotion();
  const t = useTranslations("prawo");
  const tc = useTranslations("common");

  return (
    <section className="section-padding" aria-labelledby="prawo-heading">
      <div className="mx-auto max-w-[1200px]">
        <ScrollReveal>
          <p className="prose-constrained text-[1.0625rem] leading-[1.75] text-ink-secondary">
            {t("intro")}
          </p>
          <h2 id="prawo-heading" className="sr-only">
            {t("srHeading")}
          </h2>
        </ScrollReveal>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {sources.map((source, i) => {
            const Glyph = source.icon;
            const inner = (
              <>
                <div className="flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent-glow text-accent">
                    <Glyph size={24} weight="regular" aria-hidden="true" />
                  </span>
                  {source.comingSoon ? (
                    <span className="rounded-full border border-border-subtle px-2.5 py-0.5 text-[0.6875rem] font-medium uppercase tracking-[0.06em] text-ink-tertiary">
                      {tc("comingSoon")}
                    </span>
                  ) : (
                    <ArrowSquareOut
                      size={18}
                      weight="regular"
                      aria-hidden="true"
                      className="text-ink-tertiary transition-colors group-hover:text-accent"
                    />
                  )}
                </div>
                <p className="mt-5 text-[0.6875rem] font-medium uppercase tracking-[0.1em] text-accent">
                  {t(`sources.${source.key}.kind`)}
                </p>
                <h3 className="mt-1 text-[1.0625rem] font-semibold leading-snug tracking-[-0.01em] text-ink-primary">
                  {t(`sources.${source.key}.title`)}
                </h3>
              </>
            );
            return (
              <motion.div
                key={source.key}
                initial={reduce ? false : { opacity: 0, y: 20 }}
                whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: Math.min(i, 5) * 0.05, ease: [0.16, 1, 0.3, 1] }}
              >
                <Tilt className="h-full" max={6}>
                  {source.comingSoon ? (
                    <div className="flex h-full flex-col rounded-xl border border-border-subtle bg-bg-surface p-6">
                      {inner}
                    </div>
                  ) : (
                    <a
                      href={source.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex h-full flex-col rounded-xl border border-border-subtle bg-bg-surface p-6 transition-colors duration-150 hover:border-border-soft hover:bg-bg-elevated"
                    >
                      {inner}
                    </a>
                  )}
                </Tilt>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
