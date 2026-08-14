"use client";

import { useTranslations } from "next-intl";
import { ArrowRight } from "@phosphor-icons/react";
import { Link } from "@/i18n/navigation";
import { InfopackCoverImage } from "../InfopackCover";

interface Pack {
  key: string;
  href: string;
  cover: string;
  layout: string;
}

const packs: Pack[] = [
  { key: "studyReg", href: "/infopacki/regulamin-studiow", cover: "/photos/infopacki/regulamin-cover.jpg", layout: "lg:col-span-7" },
  { key: "usos", href: "/infopacki/usos", cover: "/photos/infopacki/usos-cover.jpg", layout: "lg:col-span-5 lg:pt-24" },
  { key: "semester", href: "/infopacki/zaliczenie-semestru", cover: "/photos/infopacki/semestr-cover.jpg", layout: "lg:col-span-5" },
  { key: "deanInfo", href: "/infopacki/sprawy-studenckie", cover: "/photos/infopacki/sprawy-cover.jpg", layout: "lg:col-span-7 lg:pt-16" },
  { key: "applications", href: "/infopacki/podania", cover: "/photos/infopacki/podania-cover.jpg", layout: "lg:col-span-8" },
  { key: "library", href: "/infopacki/biblioteka", cover: "/photos/infopacki/biblioteka-cover.jpg", layout: "lg:col-span-4 lg:pt-28" },
  { key: "life", href: "/infopacki/zycie-studenckie", cover: "/photos/infopacki/zycie-cover.jpg", layout: "lg:col-span-5 lg:pt-16" },
  { key: "diploma", href: "/infopacki/dyplomowanie", cover: "/photos/infopacki/dyplomowanie-cover.jpg", layout: "lg:col-span-7" },
];

export function InfopackiContent() {
  const t = useTranslations("infopacki");

  return (
    <section className="section-padding" aria-labelledby="infopacki-heading">
      <div className="mx-auto max-w-[1200px]">
        <div>
            <h2
              id="infopacki-heading"
              className="max-w-[18ch] text-balance font-display text-[clamp(2.1rem,4.5vw,3.75rem)] font-semibold leading-[1.04] tracking-[-0.035em] text-ink-primary"
            >
              {t("libraryHeading")}
            </h2>
            <p className="mt-5 max-w-[68ch] text-pretty text-[1.0625rem] leading-[1.75] text-ink-secondary">
              {t("intro")}
            </p>
        </div>

        <ol className="mt-14 grid gap-x-8 gap-y-14 lg:grid-cols-12 lg:gap-x-12 lg:gap-y-20">
          {packs.map((pack, index) => {
            return (
              <li key={pack.key} className={pack.layout}>
                <Link href={pack.href} className="infopack-gallery-link group block">
                  <InfopackCoverImage
                    src={pack.cover}
                    priority={index < 2}
                    sizes="(max-width: 1024px) 92vw, 58vw"
                  />
                  <span className="mt-5 flex items-start justify-between gap-5 border-t border-border-medium pt-4">
                    <span>
                      <span className="block text-[1.05rem] font-semibold leading-[1.4] text-ink-primary">
                        {t(`packs.${pack.key}`)}
                      </span>
                      <span className="mt-1 block text-[0.75rem] font-medium text-accent">{t("openLiving")}</span>
                    </span>
                    <ArrowRight size={21} weight="bold" className="mt-1 shrink-0 text-accent transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>

        <p className="mt-10 text-[0.9375rem] text-ink-secondary">
          {t("notFoundText")}
          <a
            href="mailto:kontakt@samorzad.ue.wroc.pl"
            className="font-medium text-accent transition-colors hover:text-accent-dim"
          >
            {t("notFoundLink")}
          </a>
          .
        </p>
      </div>
    </section>
  );
}
