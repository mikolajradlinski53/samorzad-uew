"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LockKey, ArrowRight, ArrowSquareOut } from "@phosphor-icons/react";
import { ScrollReveal } from "../ScrollReveal";
import { craUrl } from "@/lib/cra";

export function StrefaDzialaczaContent() {
  const t = useTranslations("strefaDzialacza");
  const tc = useTranslations("common");

  return (
    <section className="section-padding" aria-labelledby="strefa-heading">
      <div className="mx-auto max-w-[760px]">
        <ScrollReveal>
          <div className="rounded-2xl border border-border-subtle bg-bg-surface p-8 sm:p-10">
            <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent-glow text-accent">
              <LockKey size={26} weight="regular" aria-hidden="true" />
            </span>
            <h2
              id="strefa-heading"
              className="mt-6 font-display text-[clamp(1.5rem,2.6vw,2rem)] font-semibold leading-[1.2] tracking-[-0.02em] text-ink-primary"
            >
              {t("cardHeading")}
            </h2>
            <p className="mt-3 text-[1rem] leading-[1.7] text-ink-secondary">
              {t("cardBody")}
            </p>

            {craUrl ? (
              <a
                href={craUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-7 inline-flex h-12 items-center gap-2 rounded-lg bg-accent px-7 text-base font-medium text-bg-base transition-all hover:bg-accent-dim active:scale-[0.98]"
              >
                <LockKey size={20} weight="regular" aria-hidden="true" />
                {t("loginButton")}
                <ArrowSquareOut size={18} weight="regular" aria-hidden="true" />
              </a>
            ) : (
              <div className="mt-7 flex flex-wrap items-center gap-3 rounded-xl border border-dashed border-border-medium bg-bg-base p-5">
                <span className="rounded-full border border-border-subtle px-2.5 py-0.5 text-[0.6875rem] font-medium uppercase tracking-[0.06em] text-ink-tertiary">
                  {tc("comingSoon")}
                </span>
                <p className="text-[0.9375rem] text-ink-secondary">{t("soon")}</p>
              </div>
            )}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="mt-8 flex flex-col items-start gap-5 rounded-2xl border border-border-subtle bg-bg-surface p-8 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display text-[1.25rem] font-semibold tracking-[-0.01em] text-ink-primary">
                {t("noAccessHeading")}
              </h2>
              <p className="mt-1 text-[0.9375rem] leading-[1.6] text-ink-secondary">
                {t("noAccessBody")}
              </p>
            </div>
            <Link
              href="/rekrutacja"
              className="inline-flex h-11 shrink-0 items-center gap-2 rounded-lg border border-border-medium px-6 text-[0.9375rem] font-medium text-ink-primary transition-colors hover:border-border-soft hover:bg-bg-elevated"
            >
              {t("noAccessButton")}
              <ArrowRight size={18} weight="regular" aria-hidden="true" />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
