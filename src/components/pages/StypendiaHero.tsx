"use client";

import { ArrowDown } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import { Breadcrumbs } from "../Breadcrumbs";

const steps = ["situation", "support", "application"] as const;

export function StypendiaHero() {
  const t = useTranslations("stypendia");
  const tc = useTranslations("common");

  return (
    <section
      className="relative overflow-hidden border-b border-border-subtle bg-bg-elevated"
      aria-labelledby="stypendia-title"
    >
      <div className="scholarship-ledger-grid pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="relative mx-auto max-w-[1200px] px-6 pb-16 pt-[128px] md:pb-20 md:pt-[140px]">
        <div className="scholarship-hero-enter scholarship-hero-enter-1">
          <Breadcrumbs
            items={[
              { label: tc("home"), href: "/" },
              { label: t("crumbStudent"), href: "/dla-studenta" },
              { label: t("heroTitle") },
            ]}
          />
        </div>

        <div className="mt-10 grid items-end gap-12 lg:grid-cols-[minmax(0,1.12fr)_minmax(340px,0.88fr)] lg:gap-20">
          <div>
            <p className="scholarship-hero-enter scholarship-hero-enter-2 inline-flex items-center gap-3 text-[0.875rem] font-semibold text-accent">
              <span className="h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
              {t("heroSystemLabel")}
            </p>
            <h1
              id="stypendia-title"
              className="scholarship-hero-enter scholarship-hero-enter-3 mt-6 max-w-[15ch] text-balance font-display text-[clamp(2.75rem,6vw,5.5rem)] font-semibold leading-[0.98] tracking-[-0.035em] text-ink-primary"
            >
              {t("heroTitle")}
            </h1>
            <p className="scholarship-hero-enter scholarship-hero-enter-4 mt-6 max-w-[62ch] text-pretty text-[1.0625rem] leading-[1.75] text-ink-secondary sm:text-[1.125rem]">
              {t("heroLead")}
            </p>
            <a
              href="#przeglad"
              className="scholarship-motion-control scholarship-hero-enter scholarship-hero-enter-5 group mt-8 inline-flex min-h-12 items-center gap-3 rounded-lg bg-accent px-6 py-3 font-semibold text-bg-base transition-[background-color,transform] duration-150 hover:bg-accent-dim active:scale-[0.98]"
            >
              {t("heroCta")}
              <ArrowDown
                size={19}
                weight="bold"
                aria-hidden="true"
                className="transition-transform duration-200 group-hover:translate-y-1"
              />
            </a>
          </div>

          <aside
            className="scholarship-route-enter border-y border-border-medium bg-bg-surface/80 py-7 backdrop-blur-[2px]"
            aria-labelledby="scholarship-route-heading"
          >
            <h2 id="scholarship-route-heading" className="px-6 text-[0.875rem] font-semibold text-ink-secondary sm:px-8">
              {t("heroPathLabel")}
            </h2>
            <ol className="relative mt-6 px-6 sm:px-8">
              <span className="absolute bottom-6 left-[43px] top-6 w-px bg-border-medium sm:left-[51px]" aria-hidden="true">
                <span className="scholarship-route-line block h-full origin-top bg-accent" />
              </span>
              {steps.map((step, index) => (
                <li
                  key={step}
                  className="relative grid min-h-[76px] grid-cols-[40px_1fr] items-center gap-5"
                >
                  <span
                    className={`scholarship-route-node scholarship-route-node-${index + 1} relative z-10 flex h-10 w-10 items-center justify-center rounded-full border border-border-medium bg-bg-surface font-mono text-[0.75rem] font-medium text-accent tabular-nums`}
                    aria-hidden="true"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="font-semibold text-ink-primary">{t(`heroPath.${step}.title`)}</p>
                    <p className="mt-1 text-[0.8125rem] leading-[1.5] text-ink-tertiary">
                      {t(`heroPath.${step}.desc`)}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="mx-6 mt-5 border-t border-border-subtle pt-5 text-[0.75rem] leading-[1.55] text-ink-tertiary sm:mx-8">
              {t("heroPathNote")}
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
