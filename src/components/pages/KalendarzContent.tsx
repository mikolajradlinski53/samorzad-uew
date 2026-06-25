"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "@phosphor-icons/react";
import { ScrollReveal } from "../ScrollReveal";
import { universityCalendarEmbedUrl } from "@/lib/calendar";

export function KalendarzContent() {
  const t = useTranslations("kalendarz");
  const tc = useTranslations("common");

  return (
    <section className="section-padding" aria-labelledby="kalendarz-heading">
      <div className="mx-auto max-w-[1200px]">
        <h2 id="kalendarz-heading" className="sr-only">
          {t("frameTitle")}
        </h2>
        {universityCalendarEmbedUrl ? (
          <ScrollReveal>
            <div className="overflow-hidden rounded-2xl border border-border-subtle bg-bg-surface">
              <iframe
                src={universityCalendarEmbedUrl}
                title={t("frameTitle")}
                loading="lazy"
                className="block h-[680px] w-full border-0"
              />
            </div>
          </ScrollReveal>
        ) : (
          <ScrollReveal>
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border-medium bg-bg-surface p-12 text-center">
              <span className="rounded-full border border-border-subtle px-2.5 py-0.5 text-[0.6875rem] font-medium uppercase tracking-[0.06em] text-ink-tertiary">
                {tc("comingSoon")}
              </span>
              <p className="max-w-[44ch] text-[0.9375rem] leading-[1.6] text-ink-secondary">
                {t("soon")}
              </p>
            </div>
          </ScrollReveal>
        )}

        <ScrollReveal delay={0.1}>
          <p className="mt-8 flex flex-wrap items-center gap-2 text-[0.9375rem] text-ink-secondary">
            {t("ourEvents")}
            <Link
              href="/"
              className="inline-flex items-center gap-1 font-medium text-accent transition-colors hover:text-accent-dim"
            >
              {t("ourEventsLink")}
              <ArrowRight size={16} weight="regular" aria-hidden="true" />
            </Link>
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
