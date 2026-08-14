"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Marquee } from "./Marquee";
import { heroPhotos } from "@/lib/photos";

/**
 * Pas przewijających się kadrów — animacja zdjęć z poprzedniej strony głównej,
 * wyjęta z dawnego hero i postawiona jako osobna sekcja.
 *
 * Dlaczego osobno: nowe hero ma własną kompozycję i nie było gdzie wpiąć
 * dawnych kolumn bez rozbicia jej. Pas poziomy działa tak samo dobrze na
 * telefonie, co pionowe kolumny na desktopie, a jest jedną trzecią kodu.
 *
 * `Marquee` sam wyłącza ruch przy `prefers-reduced-motion` i pokazuje wtedy
 * zdjęcia jako statyczną siatkę — nic nie znika.
 *
 * Zdjęcia są dekoracyjne: cały pas jest `aria-hidden`, a każdy obraz ma pusty
 * `alt`. Nie opisujemy ich jako dokumentacji konkretnych wydarzeń, bo to kadry
 * z archiwum, nie z podpisanego wydarzenia.
 */
export function PhotoBand() {
  const t = useTranslations("photoBand");

  return (
    <section className="border-y border-border-subtle bg-bg-surface/40 py-12" aria-labelledby="photoband-heading">
      <p
        id="photoband-heading"
        className="mx-auto mb-8 max-w-[1200px] px-6 font-mono text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-ink-tertiary"
      >
        {t("label")}
      </p>
      <div aria-hidden="true">
        <Marquee speed={46}>
          {heroPhotos.map((src, i) => (
            <div
              key={`${src}-${i}`}
              className="relative h-40 w-64 shrink-0 overflow-hidden rounded-xl border border-border-subtle bg-bg-elevated sm:h-52 sm:w-80"
            >
              <Image src={src} alt="" fill sizes="(max-width: 640px) 256px, 320px" className="object-cover" />
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
