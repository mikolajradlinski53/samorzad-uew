"use client";

import { useTranslations } from "next-intl";
import { ScrollReveal } from "../ScrollReveal";

export function PrywatnoscContent() {
  const t = useTranslations("prywatnosc");
  const sections = t.raw("sections") as { title: string; body: string }[];

  return (
    <section className="section-padding" aria-label={t("metaTitle")}>
      <div className="mx-auto flex max-w-[760px] flex-col gap-9">
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
