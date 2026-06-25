"use client";

import { motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import {
  Coins,
  Trophy,
  Wheelchair,
  Lifebuoy,
  ArrowSquareOut,
  FileText,
  type Icon,
} from "@phosphor-icons/react";
import { ScrollReveal } from "../ScrollReveal";
import { documents as docManifest } from "@/lib/documents";

interface Kind {
  key: string;
  href: string;
  icon: Icon;
}

const kinds: Kind[] = [
  { key: "socjalne", href: "/stypendia-socjalne", icon: Coins },
  { key: "rektora", href: "/stypendia-rektora", icon: Trophy },
  { key: "niepelnosprawni", href: "/stypendia-dla-niepelnosprawnych", icon: Wheelchair },
  { key: "zapomoga", href: "/zapomoga", icon: Lifebuoy },
];

const officialLinks = [
  { key: "news", href: "https://uew.pl/kandydaci/wsparcie-finansowe-dla-studentow/" },
  { key: "infopack", href: "/wsparcie-materialne-i-swiadczenia" },
  { key: "regulamin", href: "https://drive.google.com/file/d/18eMIfTCKHe2VkeNhqpbcnE2_dnEfzpv8/view?usp=drive_link" },
];

export function StypendiaContent() {
  const reduce = useReducedMotion();
  const t = useTranslations("stypendia");
  const documents = t.raw("documents") as string[];

  return (
    <>
      {/* Intro + types */}
      <section className="section-padding" aria-labelledby="rodzaje-heading">
        <div className="mx-auto max-w-[1200px]">
          <ScrollReveal>
            <p className="prose-constrained text-[1.0625rem] leading-[1.75] text-ink-secondary">
              {t("intro")}
            </p>
            <h2
              id="rodzaje-heading"
              className="mt-12 font-display text-[clamp(1.75rem,3.4vw,2.75rem)] font-semibold leading-[1.15] tracking-[-0.02em] text-ink-primary"
            >
              {t("typesHeading")}
            </h2>
          </ScrollReveal>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {kinds.map((kind, i) => {
              const Glyph = kind.icon;
              return (
                <motion.a
                  key={kind.key}
                  href={kind.href}
                  initial={reduce ? false : { opacity: 0, y: 20 }}
                  whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                  whileHover={
                    reduce
                      ? undefined
                      : { y: -6, transition: { type: "spring", stiffness: 300, damping: 20 } }
                  }
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.5,
                    delay: i * 0.05,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="group flex flex-col rounded-xl border border-border-subtle bg-bg-surface p-6 transition-colors duration-150 hover:border-border-soft hover:bg-bg-elevated"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent-glow text-accent">
                    <Glyph size={24} weight="regular" aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 text-[1.0625rem] font-semibold tracking-[-0.01em] text-ink-primary">
                    {t(`kinds.${kind.key}.title`)}
                  </h3>
                  <p className="mt-2 text-[0.875rem] leading-[1.6] text-ink-secondary">
                    {t(`kinds.${kind.key}.desc`)}
                  </p>
                </motion.a>
              );
            })}
          </div>
        </div>
      </section>

      {/* Documents + official links */}
      <section
        className="section-padding pt-0"
        aria-labelledby="dokumenty-heading"
      >
        <div className="mx-auto grid max-w-[1200px] gap-12 lg:grid-cols-[7fr_5fr]">
          {/* Documents */}
          <ScrollReveal>
            <h2
              id="dokumenty-heading"
              className="font-display text-[clamp(1.75rem,3.4vw,2.75rem)] font-semibold leading-[1.15] tracking-[-0.02em] text-ink-primary"
            >
              {t("documentsHeading")}
            </h2>
            <ol className="mt-8 flex flex-col">
              {documents.map((doc, i) => (
                <li
                  key={i}
                  className="flex items-start gap-4 border-b border-border-subtle py-4 last:border-b-0"
                >
                  <span
                    aria-hidden="true"
                    className="mt-0.5 w-8 shrink-0 font-medium tabular-nums text-accent"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[0.9375rem] leading-[1.55] text-ink-secondary">
                    {doc}
                  </span>
                </li>
              ))}
            </ol>
            {docManifest.stypendiaAll.href && (
              <a
                href={docManifest.stypendiaAll.href}
                {...(docManifest.stypendiaAll.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : { download: true })}
                className="mt-6 inline-flex h-11 items-center gap-2 rounded-lg border border-border-medium px-6 text-[0.9375rem] font-medium text-ink-primary transition-colors hover:border-border-soft hover:bg-bg-elevated"
              >
                <FileText size={18} weight="regular" aria-hidden="true" />
                {t("downloadAll")}
              </a>
            )}
          </ScrollReveal>

          {/* Official links */}
          <ScrollReveal delay={0.1}>
            <h2 className="font-display text-[clamp(1.75rem,3.4vw,2.75rem)] font-semibold leading-[1.15] tracking-[-0.02em] text-ink-primary">
              {t("linksHeading")}
            </h2>
            <ul className="mt-8 flex flex-col gap-3">
              {officialLinks.map((link) => (
                <li key={link.key}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between gap-4 rounded-xl border border-border-subtle bg-bg-surface p-5 transition-colors duration-150 hover:border-border-soft hover:bg-bg-elevated"
                  >
                    <span className="text-[0.9375rem] font-medium text-ink-primary">
                      {t(`officialLinks.${link.key}`)}
                    </span>
                    <ArrowSquareOut
                      size={20}
                      weight="regular"
                      aria-hidden="true"
                      className="shrink-0 text-ink-tertiary transition-colors group-hover:text-accent"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
