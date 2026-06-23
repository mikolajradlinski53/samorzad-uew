"use client";

import { motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import { FilePdf, ArrowSquareOut } from "@phosphor-icons/react";
import { ScrollReveal } from "../ScrollReveal";

interface Pack {
  key: string;
  href: string;
}

const packs: Pack[] = [
  { key: "usos", href: "https://drive.google.com/file/d/1EmTBHP5GzLrHBA782SBg82rnelb4PD7i/view?usp=sharing" },
  { key: "studyReg", href: "https://drive.google.com/file/d/1QcyoxoV15SJGrvKKONtn0JGFutQ5gRZ1/view?usp=sharing" },
  { key: "semester", href: "https://drive.google.com/file/d/1R1mXDt8745vC98J_FBJ5UoKjwMbw4NYA/view?usp=sharing" },
  { key: "deanInfo", href: "https://drive.google.com/file/d/1NLQRVebkTqXDCxcsmY7tSwc7JHApDyw9/view?usp=sharing" },
  { key: "applications", href: "https://drive.google.com/file/d/1X5muhuWdgbxlOK1cgLz4fczzaKJwSFAC/view?usp=sharing" },
  { key: "library", href: "https://drive.google.com/file/d/1R_yZHW5UIIzWerNAlpYp5FOw8p6DHC9N/view?usp=sharing" },
  { key: "life", href: "https://drive.google.com/file/d/1GoMBj_CEFF6ri83ZbED4OocGOKzv8Uot/view?usp=sharing" },
  { key: "diploma", href: "https://drive.google.com/file/d/1QPCho3YZIPYvn3Nv9rmZBKd0GkC5Byhs/view?usp=sharing" },
];

export function InfopackiContent() {
  const reduce = useReducedMotion();
  const t = useTranslations("infopacki");

  return (
    <section className="section-padding" aria-labelledby="infopacki-heading">
      <div className="mx-auto max-w-[1200px]">
        <ScrollReveal>
          <p className="prose-constrained text-[1.0625rem] leading-[1.75] text-ink-secondary">
            {t("intro")}
          </p>
          <h2 id="infopacki-heading" className="sr-only">
            {t("srHeading")}
          </h2>
        </ScrollReveal>

        <ul
          className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          style={{ perspective: 1200 }}
        >
          {packs.map((pack, i) => (
            <motion.li
              key={pack.key}
              initial={reduce ? false : { opacity: 0, rotateX: -90 }}
              whileInView={reduce ? undefined : { opacity: 1, rotateX: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 0.6,
                delay: Math.min(i, 5) * 0.06,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{ transformOrigin: "top center" }}
            >
              <a
                href={pack.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full flex-col rounded-xl border border-border-subtle bg-bg-surface p-6 transition-all duration-150 hover:-translate-y-1.5 hover:border-border-soft hover:bg-bg-elevated"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent-glow text-accent">
                    <FilePdf size={24} weight="regular" aria-hidden="true" />
                  </span>
                  <span
                    aria-hidden="true"
                    className="font-display text-[1.25rem] text-ink-tertiary tabular-nums"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-5 flex-1 text-[1.0625rem] font-semibold leading-snug tracking-[-0.01em] text-ink-primary">
                  {t(`packs.${pack.key}`)}
                </h3>
                <span className="mt-5 inline-flex items-center gap-1.5 text-[0.875rem] font-medium text-accent">
                  {t("openPdf")}
                  <ArrowSquareOut
                    size={16}
                    weight="bold"
                    aria-hidden="true"
                    className="transition-transform duration-150 group-hover:translate-x-0.5"
                  />
                </span>
              </a>
            </motion.li>
          ))}
        </ul>

        <ScrollReveal>
          <p className="mt-10 text-[0.9375rem] text-ink-secondary">
            {t("notFoundText")}
            <a
              href="mailto:kontakt@samorzad.ue.wroc.pl"
              className="font-medium text-accent transition-colors hover:text-accent-dim"
            >
              {t("notFoundLink")}
            </a>
            .
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
