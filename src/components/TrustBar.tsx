"use client";

import { motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import { SealCheck, Clock, GraduationCap, Scales, type Icon } from "@phosphor-icons/react";
import { Impulse } from "./Impulse";
import { DURATION, EASE, STAGGER } from "@/lib/motion";

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
  const ta = useTranslations("ui.aria");

  return (
    <section
      aria-label={ta("trust")}
      className="relative border-y border-border-subtle bg-bg-surface/60"
    >
      {/* Draw-on accent hairline — signature, restrained */}
      <Impulse
        duration={DURATION.trace}
        className="absolute inset-x-0 top-0 h-px bg-accent/50"
      />
      <ul className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-center gap-x-10 gap-y-4 px-6 py-5 sm:justify-between">
        {markers.map((m, i) => {
          const Glyph = m.icon;
          return (
            <motion.li
              key={m.key}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={
                reduce
                  ? { duration: 0 }
                  : { duration: DURATION.reveal, delay: Math.min(i, 4) * STAGGER, ease: EASE }
              }
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
