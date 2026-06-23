"use client";

import { motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import { SealCheck, Clock, GraduationCap, Scales, type Icon } from "@phosphor-icons/react";

interface Marker {
  icon: Icon;
  key: string;
}

/**
 * Pasek zaufania — sygnały AUTORYTETU tuż pod hero (zasada pierwszeństwa:
 * wiarygodność zanim poprosimy o jakąkolwiek akcję). Świadomie NIE powtarza
 * liczb z hero — niesie inną dźwignię: oficjalność, staż, umocowanie ustawowe,
 * przynależność do Uczelni. Wszystkie markery to fakty.
 */
const markers: Marker[] = [
  { icon: SealCheck, key: "official" },
  { icon: Clock, key: "since" },
  { icon: Scales, key: "statutory" },
  { icon: GraduationCap, key: "unit" },
];

export function TrustBar() {
  const reduce = useReducedMotion();
  const t = useTranslations("trustbar");

  return (
    <section
      aria-label="Wiarygodność"
      className="relative border-y border-border-subtle bg-bg-surface/60"
    >
      {/* Draw-on accent hairline — signature, restrained */}
      <motion.span
        aria-hidden="true"
        initial={reduce ? false : { scaleX: 0 }}
        whileInView={reduce ? undefined : { scaleX: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-x-0 top-0 h-px origin-left bg-accent/50"
      />
      <ul className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-center gap-x-10 gap-y-4 px-6 py-5 sm:justify-between">
        {markers.map((m, i) => {
          const Glyph = m.icon;
          return (
            <motion.li
              key={m.key}
              initial={reduce ? false : { opacity: 0, y: 10 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.5, delay: Math.min(i, 4) * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-2.5 text-[0.8125rem] font-medium text-ink-secondary"
            >
              <Glyph size={18} weight="regular" aria-hidden="true" className="shrink-0 text-accent" />
              {t(m.key)}
            </motion.li>
          );
        })}
      </ul>
    </section>
  );
}
