"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import { GraduationCap, SealCheck, UsersThree, Copy, CheckCircle, WarningCircle, type Icon } from "@phosphor-icons/react";
import { ScrollReveal } from "../ScrollReveal";
import { SpineWall } from "../SpineWall";
import { publications, formatCitation } from "@/lib/publications";

const factKeys = ["years", "license", "circles"] as const;
const factIcons: Record<(typeof factKeys)[number], Icon> = {
  years: GraduationCap,
  license: SealCheck,
  circles: UsersThree,
};

const pathKeys = ["draft", "mentor", "submit", "review", "layout", "publish"] as const;

type CopyState = "idle" | "copied" | "error";

export function WydawnictwoContent() {
  const reduce = useReducedMotion();
  const t = useTranslations("wydawnictwo");

  const [copyState, setCopyState] = useState<CopyState>("idle");

  useEffect(() => {
    if (copyState === "idle") return;
    const id = setTimeout(() => setCopyState("idle"), 4000);
    return () => clearTimeout(id);
  }, [copyState]);

  const citation = publications.length > 0 ? formatCitation(publications[0]) : null;

  const handleCopy = async () => {
    if (!citation) return;
    try {
      await navigator.clipboard.writeText(citation);
      setCopyState("copied");
    } catch {
      setCopyState("error");
    }
  };

  return (
    <>
      {/* a) Czym są Debiuty Studenckie */}
      <section className="section-padding" aria-labelledby="wydawnictwo-o-heading">
        <div className="mx-auto max-w-[1200px]">
          <ScrollReveal>
            <p className="text-[0.75rem] font-medium uppercase tracking-[0.08em] text-accent">
              {t("aboutEyebrow")}
            </p>
            <h2
              id="wydawnictwo-o-heading"
              className="mt-3 max-w-[24ch] font-display text-[clamp(1.75rem,3.4vw,2.75rem)] font-semibold leading-[1.15] tracking-[-0.02em] text-ink-primary"
            >
              {t("aboutHeading")}
            </h2>
            <p className="prose-constrained mt-4 text-[1.0625rem] leading-[1.75] text-ink-secondary">
              {t("aboutIntro")}
            </p>
          </ScrollReveal>

          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {factKeys.map((key, i) => {
              const Glyph = factIcons[key];
              return (
                <motion.div
                  key={key}
                  initial={reduce ? false : { opacity: 0, y: 20 }}
                  whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col rounded-xl border border-border-subtle bg-bg-surface p-6"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent-glow text-accent">
                    <Glyph size={24} weight="regular" aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 text-[1.0625rem] font-semibold tracking-[-0.01em] text-ink-primary">
                    {t(`facts.${key}.title`)}
                  </h3>
                  <p className="mt-2 text-[0.875rem] leading-[1.6] text-ink-secondary">
                    {t(`facts.${key}.desc`)}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* b) Ścieżka publikacji */}
      <section className="section-padding pt-0" aria-labelledby="wydawnictwo-sciezka-heading">
        <div className="mx-auto max-w-[1200px]">
          <ScrollReveal>
            <p className="text-[0.75rem] font-medium uppercase tracking-[0.08em] text-accent">
              {t("pathEyebrow")}
            </p>
            <h2
              id="wydawnictwo-sciezka-heading"
              className="mt-3 max-w-[24ch] font-display text-[clamp(1.75rem,3.4vw,2.75rem)] font-semibold leading-[1.15] tracking-[-0.02em] text-ink-primary"
            >
              {t("pathHeading")}
            </h2>
            <p className="prose-constrained mt-4 text-[1.0625rem] leading-[1.75] text-ink-secondary">
              {t("pathIntro")}
            </p>
          </ScrollReveal>

          <ol className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {pathKeys.map((key, i) => (
              <motion.li
                key={key}
                initial={reduce ? false : { opacity: 0, y: 20 }}
                whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: Math.min(i, 4) * 0.05, ease: [0.16, 1, 0.3, 1] }}
                className="flex gap-4 rounded-xl border border-border-subtle bg-bg-surface p-6"
              >
                <span
                  aria-hidden="true"
                  className="font-mono text-[1.5rem] font-medium leading-none text-accent tabular-nums"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-[1rem] font-semibold tracking-[-0.01em] text-ink-primary">
                    {t(`path.${key}.title`)}
                  </h3>
                  <p className="mt-2 text-[0.875rem] leading-[1.6] text-ink-secondary">
                    {t(`path.${key}.desc`)}
                  </p>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>

      {/* c) SpineWall */}
      <section className="section-padding pt-0" aria-labelledby="wydawnictwo-mur-heading">
        <div className="mx-auto max-w-[1200px]">
          <ScrollReveal>
            <p className="text-[0.75rem] font-medium uppercase tracking-[0.08em] text-accent">
              {t("wallEyebrow")}
            </p>
            <h2
              id="wydawnictwo-mur-heading"
              className="mt-3 max-w-[24ch] font-display text-[clamp(1.75rem,3.4vw,2.75rem)] font-semibold leading-[1.15] tracking-[-0.02em] text-ink-primary"
            >
              {t("wallHeading")}
            </h2>
            <p className="prose-constrained mt-4 text-[1.0625rem] leading-[1.75] text-ink-secondary">
              {t("wallIntro")}
            </p>
          </ScrollReveal>

          <div className="mt-10">
            <SpineWall
              publications={publications}
              labels={{
                emptyTitle: t("spineLabels.emptyTitle"),
                emptyDesc: t("spineLabels.emptyDesc"),
                circleLabel: t("spineLabels.circleLabel"),
                linkLabel: t("spineLabels.linkLabel"),
                hint: t("spineLabels.hint"),
              }}
            />
          </div>
        </div>
      </section>

      {/* d) Jak cytować */}
      <section className="section-padding pt-0" aria-labelledby="wydawnictwo-cytowanie-heading">
        <div className="mx-auto max-w-[1200px]">
          <ScrollReveal>
            <h2
              id="wydawnictwo-cytowanie-heading"
              className="font-display text-[clamp(1.75rem,3.4vw,2.75rem)] font-semibold leading-[1.15] tracking-[-0.02em] text-ink-primary"
            >
              {t("citeHeading")}
            </h2>
            <p className="prose-constrained mt-4 text-[1.0625rem] leading-[1.75] text-ink-secondary">
              {t("citeIntro")}
            </p>

            {citation ? (
              <div className="mt-8 max-w-[720px] rounded-xl border border-border-subtle bg-bg-surface p-6">
                <p className="font-mono text-[0.875rem] leading-[1.7] text-ink-secondary">{citation}</p>
                <div className="mt-5 flex flex-wrap items-center gap-4">
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="inline-flex h-11 items-center gap-2 rounded-lg border border-border-strong px-6 text-[0.9375rem] font-medium text-ink-primary transition-colors hover:border-border-soft hover:bg-bg-elevated"
                  >
                    {copyState === "copied" ? (
                      <CheckCircle size={18} weight="regular" aria-hidden="true" className="text-accent" />
                    ) : copyState === "error" ? (
                      <WarningCircle size={18} weight="regular" aria-hidden="true" className="text-red-500" />
                    ) : (
                      <Copy size={18} weight="regular" aria-hidden="true" />
                    )}
                    {t("copyButton")}
                  </button>
                  <p aria-live="polite" className="text-[0.8125rem] text-ink-tertiary">
                    {copyState === "copied" && t("copiedConfirm")}
                    {copyState === "error" && (
                      <span className="text-red-600 dark:text-red-400">{t("copyError")}</span>
                    )}
                  </p>
                </div>
              </div>
            ) : (
              <p className="mt-8 text-[0.9375rem] text-ink-tertiary">{t("citeEmpty")}</p>
            )}
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
