"use client";

import { useTranslations } from "next-intl";
import { SealCheck, UsersThree, Compass, Scales, type Icon } from "@phosphor-icons/react";
import { Impulse } from "./Impulse";
import { DURATION } from "@/lib/motion";

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
  { icon: Scales, key: "statutory" },
  { icon: UsersThree, key: "council" },
  { icon: Compass, key: "projects" },
];

export function TrustBar() {
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
      <ul className="mx-auto grid max-w-[1200px] grid-cols-1 gap-x-10 gap-y-4 px-6 py-5 min-[440px]:grid-cols-2 lg:grid-cols-4">
        {markers.map((m) => {
          const Glyph = m.icon;
          return (
            <li
              key={m.key}
              className="flex items-center gap-2.5 text-left text-[0.8125rem] font-medium leading-[1.45] text-ink-secondary"
            >
              <Glyph size={18} weight="regular" aria-hidden="true" className="shrink-0 text-accent" />
              {t(m.key)}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
