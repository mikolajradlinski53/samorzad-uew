"use client";

import { useTranslations } from "next-intl";
import { ScrollReveal } from "../ScrollReveal";

export function DeklaracjaContent() {
  const t = useTranslations("deklaracja");
  const sections = t.raw("sections") as { title: string; body: string }[];

  return (
    <section className="section-padding" aria-label={t("metaTitle")}>
      <div className="mx-auto flex max-w-[760px] flex-col gap-9">
        <ScrollReveal>
          <p className="text-[1.0625rem] leading-[1.75] text-ink-secondary">{t("intro")}</p>
          <p className="mt-4 font-mono text-[0.8125rem] leading-[1.6] text-ink-tertiary">
            {t("metaDate")}
          </p>
        </ScrollReveal>

        {sections.map((s, i) => (
          <ScrollReveal key={s.title} delay={Math.min(i, 5) * 0.04}>
            <h2 className="font-display text-[1.375rem] font-semibold tracking-[-0.01em] text-ink-primary">
              {s.title}
            </h2>
            <p className="mt-2 text-[1rem] leading-[1.75] text-ink-secondary">{s.body}</p>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
