"use client";

import { motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import { EnvelopeSimple } from "@phosphor-icons/react";
import { InitialsAvatar } from "../InitialsAvatar";
import { PersonCard } from "../PersonCard";
import { ScrollReveal } from "../ScrollReveal";

const przewodniczaca = {
  name: "Emilia Ćwiklińska",
  email: "emilia.cwiklinska@samorzad.ue.wroc.pl",
};

const wice = [
  { name: "Magdalena Skoczylas", roleKey: "strategy", email: "magdalena.skoczylas@samorzad.ue.wroc.pl" },
  { name: "Daria Szewczyk", roleKey: "projects", email: "daria.szewczyk@samorzad.ue.wroc.pl" },
  { name: "Jakub Panas", roleKey: "pr", email: "jakub.panas@samorzad.ue.wroc.pl" },
];

export function PrzewodniczacyContent() {
  const reduce = useReducedMotion();
  const t = useTranslations("przewodniczacy");

  return (
    <section className="section-padding" aria-labelledby="przew-heading">
      <div className="mx-auto max-w-[1200px]">
        <ScrollReveal>
          <p className="text-[0.75rem] font-medium uppercase tracking-[0.08em] text-accent">
            {t("eyebrow")}
          </p>
          <h2
            id="przew-heading"
            className="mt-3 max-w-[24ch] font-display text-[clamp(1.75rem,3.4vw,2.75rem)] font-semibold leading-[1.15] tracking-[-0.02em] text-ink-primary"
          >
            {t("heading")}
          </h2>
        </ScrollReveal>

        {/* Przewodnicząca — featured */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20, scale: 0.97 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 rounded-2xl border border-accent/40 bg-bg-surface p-8"
        >
          <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
            <InitialsAvatar name={przewodniczaca.name} size={88} />
            <div>
              <h3 className="font-display text-[clamp(1.5rem,2.6vw,2rem)] font-semibold tracking-[-0.02em] text-ink-primary">
                {przewodniczaca.name}
              </h3>
              <p className="mt-2 text-[0.9375rem] font-medium uppercase tracking-[0.06em] text-accent">
                {t("chairRole")}
              </p>
              <a
                href={`mailto:${przewodniczaca.email}`}
                className="mt-3 inline-flex items-center gap-2 text-[0.9375rem] text-ink-secondary transition-colors hover:text-accent"
              >
                <EnvelopeSimple size={18} weight="regular" aria-hidden="true" />
                {przewodniczaca.email}
              </a>
            </div>
          </div>
          <p className="prose-constrained mt-6 border-t border-border-subtle pt-6 text-[0.9375rem] leading-[1.7] text-ink-secondary">
            {t("chairDesc")}
          </p>
        </motion.div>

        {/* Wiceprzewodniczący */}
        <ScrollReveal>
          <p className="mt-12 text-[0.9375rem] leading-[1.7] text-ink-secondary">
            {t("wiceIntro")}
          </p>
        </ScrollReveal>

        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {wice.map((w, i) => (
            <motion.div
              key={w.name}
              initial={reduce ? false : { opacity: 0, y: 24 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.5, delay: Math.min(i, 4) * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="h-full"
            >
              <PersonCard name={w.name} role={t(`roles.${w.roleKey}`)} email={w.email} className="h-full" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
