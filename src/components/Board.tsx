"use client";

import { motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import { ScrollReveal } from "./ScrollReveal";
import { boardPhotos } from "@/lib/photos";
import { PersonCard } from "./PersonCard";

const members = [
  { name: "Mikołaj Kowalski", roleKey: "chair", seed: "mikolaj" },
  { name: "Anna Nowak", roleKey: "vchair", seed: "anna" },
  { name: "Piotr Wiśniewski", roleKey: "secretary", seed: "piotr" },
  { name: "Katarzyna Lewandowska", roleKey: "treasurer", seed: "katarzyna" },
  { name: "Tomasz Wójcik", roleKey: "member", seed: "tomasz" },
];

export function Board() {
  const reduce = useReducedMotion();
  const t = useTranslations("board");

  return (
    <section
      id="zarzad"
      aria-labelledby="zarzad-heading"
      className="section-padding"
    >
      <div className="mx-auto max-w-[1200px]">
        {/* Eyebrow - one of max 2 on the entire page */}
        <ScrollReveal>
          <p className="text-[0.75rem] font-medium uppercase tracking-[0.08em] text-accent">
            {t("eyebrow")}
          </p>
          <h2
            id="zarzad-heading"
            className="mt-3 font-display text-[clamp(2.5rem,5vw,4rem)] font-semibold leading-[1.1] tracking-[-0.02em] text-ink-primary"
          >
            {t("heading")}
          </h2>
        </ScrollReveal>

        {/* Legitymacje Zarządu */}
        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {members.map((member, i) => (
            <motion.div
              key={member.name}
              initial={reduce ? false : { opacity: 0, y: 20 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.6, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="h-full"
            >
              <PersonCard
                name={member.name}
                role={t(`roles.${member.roleKey}`)}
                photo={boardPhotos[i]}
                no={i + 1}
                org={t("org")}
                className="h-full"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
