"use client";

import { motion, useReducedMotion } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { CalendarBlank } from "@phosphor-icons/react";
import { ScrollReveal } from "../ScrollReveal";
import { PersonCard } from "../PersonCard";
import { russPhotos } from "@/lib/photos";
import { russMembers as members, russMeetings as meetings } from "@/lib/people";

export function RUSSContent() {
  const reduce = useReducedMotion();
  const t = useTranslations("russ");
  const tc = useTranslations("common");
  const locale = useLocale();
  const competencies = t.raw("competencies") as string[];
  const fmtDate = (d: string) =>
    new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "pl-PL", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(`${d}T00:00:00`));

  return (
    <>
      {/* Intro + competencies */}
      <section className="section-padding" aria-labelledby="russ-intro-heading">
        <div className="mx-auto grid max-w-[1200px] gap-12 lg:grid-cols-[5fr_7fr]">
          <ScrollReveal>
            <h2
              id="russ-intro-heading"
              className="font-display text-[clamp(1.75rem,3.4vw,2.75rem)] font-semibold leading-[1.15] tracking-[-0.02em] text-ink-primary"
            >
              {t("introHeading")}
            </h2>
            <p className="prose-constrained mt-4 text-[1.0625rem] leading-[1.75] text-ink-secondary">
              {t("introBody")}
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <ul className="flex flex-col gap-3">
              {competencies.map((c, i) => (
                <li
                  key={c}
                  className="flex items-start gap-4 rounded-xl border border-border-subtle bg-bg-surface p-5"
                >
                  <span
                    aria-hidden="true"
                    className="font-mono text-[1.25rem] font-medium leading-none text-accent tabular-nums"
                  >
                    §{i + 1}
                  </span>
                  <p className="text-[0.9375rem] leading-[1.55] text-ink-secondary">{c}</p>
                </li>
              ))}
            </ul>
          </ScrollReveal>
        </div>
      </section>

      {/* Terminy posiedzeń */}
      <section
        className="section-padding border-t border-border-subtle pt-16"
        aria-labelledby="russ-terminy-heading"
      >
        <div className="mx-auto max-w-[1200px]">
          <ScrollReveal>
            <p className="text-[0.75rem] font-medium uppercase tracking-[0.08em] text-accent">
              {t("meetingsEyebrow")}
            </p>
            <h2
              id="russ-terminy-heading"
              className="mt-3 font-display text-[clamp(1.75rem,3.4vw,2.75rem)] font-semibold leading-[1.15] tracking-[-0.02em] text-ink-primary"
            >
              {t("meetingsHeading")}
            </h2>
          </ScrollReveal>

          {meetings.length > 0 ? (
            <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {meetings.map((m, i) => (
                <motion.li
                  key={m.date + i}
                  initial={reduce ? false : { opacity: 0, y: 16 }}
                  whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.45, delay: Math.min(i, 6) * 0.05, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-start gap-3 rounded-xl border border-border-subtle bg-bg-surface p-4"
                >
                  <CalendarBlank size={22} weight="regular" aria-hidden="true" className="mt-0.5 shrink-0 text-accent" />
                  <div className="min-w-0">
                    <p className="font-mono text-[0.9375rem] tracking-[-0.01em] text-ink-primary">
                      {fmtDate(m.date)}
                    </p>
                    {m.note && (
                      <p className="mt-0.5 text-[0.8125rem] leading-[1.5] text-ink-secondary">{m.note}</p>
                    )}
                  </div>
                </motion.li>
              ))}
            </ul>
          ) : (
            <div className="mt-8 flex flex-wrap items-center gap-3 rounded-xl border border-dashed border-border-medium bg-bg-surface p-6">
              <span className="rounded-full border border-border-subtle px-2.5 py-0.5 text-[0.6875rem] font-medium uppercase tracking-[0.06em] text-ink-tertiary">
                {tc("comingSoon")}
              </span>
              <p className="text-[0.9375rem] text-ink-secondary">{t("meetingsSoon")}</p>
            </div>
          )}
        </div>
      </section>

      {/* Members assemble */}
      <section
        className="section-padding border-t border-border-subtle pt-16"
        aria-labelledby="russ-members-heading"
      >
        <div className="mx-auto max-w-[1200px]">
          <ScrollReveal>
            <p className="text-[0.75rem] font-medium uppercase tracking-[0.08em] text-accent">
              {t("termEyebrow")}
            </p>
            <h2
              id="russ-members-heading"
              className="mt-3 font-display text-[clamp(1.75rem,3.4vw,2.75rem)] font-semibold leading-[1.15] tracking-[-0.02em] text-ink-primary"
            >
              {t("membersHeading")}
            </h2>
          </ScrollReveal>

          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {members.map((name, i) => (
              <motion.li
                key={name}
                initial={reduce ? false : { opacity: 0, scale: 0.8 }}
                whileInView={reduce ? undefined : { opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={
                  reduce
                    ? undefined
                    : {
                        type: "spring",
                        stiffness: 320,
                        damping: 18,
                        delay: Math.min(i, 8) * 0.05,
                      }
                }
                className="h-full"
              >
                <PersonCard name={name} role={t("memberRole")} photo={russPhotos[i]} plain className="h-full" />
              </motion.li>
            ))}
          </ul>
          <p className="mt-6 text-[0.8125rem] text-ink-tertiary">
            {t("footnote")}
          </p>
        </div>
      </section>
    </>
  );
}
