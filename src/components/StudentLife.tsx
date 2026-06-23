"use client";

import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react";
import { TextParallaxContent } from "./TextParallax";
import { studentLifePhotos } from "@/lib/photos";

interface PanelCopy {
  lead: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
}

function PanelBody({ lead, body, ctaLabel, ctaHref }: PanelCopy) {
  return (
    <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-8 px-6 pb-20 pt-12 md:grid-cols-12">
      <h3 className="col-span-1 font-display text-[clamp(1.5rem,2.6vw,2.25rem)] font-semibold leading-[1.2] tracking-[-0.02em] text-ink-primary md:col-span-4">
        {lead}
      </h3>
      <div className="col-span-1 md:col-span-8">
        <p className="text-[1.0625rem] leading-[1.75] text-ink-secondary md:text-[1.25rem]">
          {body}
        </p>
        <Link
          href={ctaHref}
          className="mt-8 inline-flex h-12 items-center gap-2 rounded-lg bg-accent px-7 text-base font-medium text-bg-base transition-all hover:bg-accent-dim active:scale-[0.98]"
        >
          {ctaLabel}
          <ArrowUpRight size={20} weight="regular" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}

export function StudentLife() {
  return (
    <section aria-label="Życie studenckie">
      <TextParallaxContent
        imgUrl={studentLifePhotos.integracja}
        subheading="Integracja"
        heading="Tworzymy studencką społeczność"
      >
        <PanelBody
          lead="Studia to ludzie, których spotykasz."
          body="Od Adapciaka i Dni Adaptacyjnych po Bal UEW, TEDxUEW i UE Party — przez cały rok tworzymy wydarzenia, które łączą studentów, rozwijają i zostają w pamięci na lata."
          ctaLabel="Poznaj nasze projekty"
          ctaHref="/nasze-projekty"
        />
      </TextParallaxContent>

      <TextParallaxContent
        imgUrl={studentLifePhotos.wsparcie}
        subheading="Wsparcie"
        heading="Stoimy po Twojej stronie"
      >
        <PanelBody
          lead="Gdy potrzebujesz pomocy, jesteśmy obok."
          body="Prawa studenta, stypendia, pomoc psychologiczna, Rzecznik Praw Studenta — w Strefie studenta zebraliśmy wszystko, co przyda Ci się w codziennym życiu na uczelni."
          ctaLabel="Zobacz Strefę studenta"
          ctaHref="/dla-studenta"
        />
      </TextParallaxContent>
    </section>
  );
}
