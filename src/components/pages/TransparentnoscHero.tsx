"use client";

import { ArrowDown, CheckCircle, Clock, Eye } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import { Breadcrumbs } from "../Breadcrumbs";

const trail = ["decision", "record", "proof", "effect"] as const;

export function TransparentnoscHero() {
  const t = useTranslations("transparentnosc");
  const tc = useTranslations("common");

  return (
    <section
      className="transparency-hero relative overflow-hidden border-b border-white/10 bg-[#091536] text-white"
      aria-labelledby="transparency-title"
    >
      <div className="transparency-grid pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="relative mx-auto max-w-[1200px] px-6 pb-16 pt-[128px] md:pb-20 md:pt-[140px]">
        <div className="transparency-enter transparency-enter-1 transparency-breadcrumbs">
          <Breadcrumbs
            items={[
              { label: tc("home"), href: "/" },
              { label: t("metaTitle") },
            ]}
          />
        </div>

        <div className="mt-10 grid items-end gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(390px,0.82fr)] lg:gap-20">
          <div>
            <p className="transparency-enter transparency-enter-2 inline-flex items-center gap-3 font-mono text-[0.75rem] font-medium uppercase tracking-[0.12em] text-[#9fb0ff]">
              <Eye size={18} weight="duotone" aria-hidden="true" />
              {t("heroSystemLabel")}
            </p>
            <h1
              id="transparency-title"
              className="transparency-enter transparency-enter-3 mt-6 max-w-[13ch] text-balance font-display text-[clamp(3rem,7vw,6.75rem)] font-semibold leading-[0.9] tracking-[-0.045em]"
            >
              {t("heroTitle")}
            </h1>
            <p className="transparency-enter transparency-enter-4 mt-7 max-w-[61ch] text-pretty text-[1.0625rem] leading-[1.75] text-white/75 sm:text-[1.125rem]">
              {t("heroLead")}
            </p>
            <div className="transparency-enter transparency-enter-5 mt-8 flex flex-wrap gap-3">
              <a
                href="#zywy-budzet"
                className="transparency-motion-control group inline-flex min-h-12 items-center gap-3 rounded-lg bg-white px-6 py-3 font-semibold text-[#0c1b46] transition-[background-color,transform] duration-150 hover:bg-[#e9edff] active:scale-[0.98]"
              >
                {t("heroCta")}
                <ArrowDown
                  size={19}
                  weight="bold"
                  className="transition-transform duration-200 group-hover:translate-y-1"
                  aria-hidden="true"
                />
              </a>
              <a
                href="#rejestr"
                className="transparency-motion-control inline-flex min-h-12 items-center rounded-lg border border-white/30 px-6 py-3 font-semibold text-white transition-colors duration-150 hover:border-white/60 hover:bg-white/10"
              >
                {t("heroRegistryCta")}
              </a>
            </div>
          </div>

          <aside
            className="transparency-console-enter relative border border-white/20 bg-[#0d1d49]/90 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.28)] sm:p-7"
            aria-labelledby="transparency-console-title"
          >
            <div className="flex items-center justify-between gap-4 border-b border-white/15 pb-4">
              <div>
                <p className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-white/55">
                  {t("heroConsole.kicker")}
                </p>
                <h2 id="transparency-console-title" className="mt-1 text-[0.9375rem] font-semibold">
                  {t("heroConsole.title")}
                </h2>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#f1c862]/40 bg-[#f1c862]/10 px-3 py-1.5 text-[0.6875rem] font-semibold text-[#f7d984]">
                <Clock size={14} weight="fill" aria-hidden="true" />
                {t("heroConsole.status")}
              </span>
            </div>

            <ol className="relative mt-7">
              <span className="absolute left-[17px] top-[18px] h-[calc(100%-36px)] w-px bg-white/20" aria-hidden="true">
                <span className="transparency-console-line block h-full origin-top bg-[#7990ff]" />
              </span>
              {trail.map((item, index) => (
                <li key={item} className="relative grid min-h-[70px] grid-cols-[36px_1fr] items-center gap-4">
                  <span
                    className={`transparency-console-node transparency-console-node-${index + 1} relative z-10 flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-[#0d1d49] font-mono text-[0.6875rem] text-[#b7c3ff]`}
                    aria-hidden="true"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="flex items-center justify-between gap-4 border-b border-white/10 py-4 last:border-0">
                    <div>
                      <p className="text-[0.875rem] font-semibold text-white">{t(`heroConsole.trail.${item}.title`)}</p>
                      <p className="mt-1 text-[0.75rem] leading-[1.5] text-white/55">{t(`heroConsole.trail.${item}.desc`)}</p>
                    </div>
                    {index < 2 ? (
                      <CheckCircle size={18} weight="fill" className="shrink-0 text-[#86a0ff]" aria-hidden="true" />
                    ) : (
                      <span className="h-2 w-2 shrink-0 rounded-full bg-white/25" aria-hidden="true" />
                    )}
                  </div>
                </li>
              ))}
            </ol>

            <div className="transparency-scan-line pointer-events-none absolute inset-x-0 h-px bg-[#8ca0ff] shadow-[0_0_14px_2px_rgba(140,160,255,0.7)]" aria-hidden="true" />
            <p className="mt-5 border-t border-white/15 pt-4 text-[0.75rem] leading-[1.55] text-white/55">
              {t("heroConsole.note")}
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
