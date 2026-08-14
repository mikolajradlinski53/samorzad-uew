"use client";

import { useTranslations } from "next-intl";
import { ArrowRight, ArrowSquareOut, BookOpen, FilePdf } from "@phosphor-icons/react";
import { Link } from "@/i18n/navigation";

interface Pack {
  key: string;
  href: string;
  living?: boolean;
}

const packs: Pack[] = [
  { key: "studyReg", href: "/infopacki/regulamin-studiow", living: true },
  { key: "usos", href: "/infopacki/usos", living: true },
  { key: "semester", href: "/infopacki/zaliczenie-semestru", living: true },
  { key: "deanInfo", href: "/infopacki/sprawy-studenckie", living: true },
  { key: "applications", href: "/infopacki/podania", living: true },
  { key: "library", href: "/infopacki/biblioteka", living: true },
  { key: "life", href: "/infopacki/zycie-studenckie", living: true },
  { key: "diploma", href: "/infopacki/dyplomowanie", living: true },
];

export function InfopackiContent() {
  const t = useTranslations("infopacki");
  const livingCount = packs.filter((pack) => pack.living).length;

  return (
    <section className="section-padding" aria-labelledby="infopacki-heading">
      <div className="mx-auto max-w-[1200px]">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(260px,0.5fr)] lg:items-end lg:gap-20">
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

          <div className="border-y border-border-medium py-5">
            <p className="font-mono text-[0.75rem] font-medium text-ink-primary tabular-nums">
              {t("migrationStatus", { living: livingCount, total: packs.length })}
            </p>
            <p className="mt-2 text-[0.75rem] leading-[1.55] text-ink-tertiary">
              {t("migrationNote")}
            </p>
          </div>
        </div>

        <ol className="mt-12 border-y border-border-medium">
          {packs.map((pack, index) => {
            const inner = (
              <>
                <span className="font-mono text-[0.6875rem] font-medium text-ink-tertiary tabular-nums" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span
                  className={`flex h-11 w-11 items-center justify-center rounded-full ${
                    pack.living ? "bg-accent text-white" : "bg-accent-glow text-accent"
                  }`}
                  aria-hidden="true"
                >
                  {pack.living ? <BookOpen size={21} weight="fill" /> : <FilePdf size={21} weight="duotone" />}
                </span>
                <span className="min-w-0">
                  <span className="block text-[0.9375rem] font-semibold leading-[1.5] text-ink-primary">
                    {t(`packs.${pack.key}`)}
                  </span>
                  <span className={`mt-1 block text-[0.75rem] font-medium ${pack.living ? "text-accent" : "text-ink-tertiary"}`}>
                    {pack.living ? t("livingLabel") : t("pdfLabel")}
                  </span>
                </span>
                <span className="hidden text-[0.75rem] font-semibold text-ink-secondary sm:block">
                  {pack.living ? t("openLiving") : t("openPdf")}
                </span>
                {pack.living ? (
                  <ArrowRight
                    size={20}
                    weight="bold"
                    className="text-accent transition-transform duration-200 group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                ) : (
                  <ArrowSquareOut
                    size={19}
                    weight="bold"
                    className="text-accent transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                )}
              </>
            );
            const rowClass =
              "infopack-row group grid min-h-[104px] grid-cols-[28px_44px_minmax(0,1fr)_22px] items-center gap-4 border-b border-border-subtle px-1 py-5 text-left transition-colors duration-150 last:border-b-0 hover:bg-bg-elevated sm:grid-cols-[32px_44px_minmax(0,1fr)_auto_24px] sm:px-5";

            return (
              <li key={pack.key}>
                {pack.living ? (
                  <Link href={pack.href} className={rowClass}>
                    {inner}
                  </Link>
                ) : (
                  <a href={pack.href} target="_blank" rel="noopener noreferrer" className={rowClass}>
                    {inner}
                    <span className="sr-only">{t("opensNew")}</span>
                  </a>
                )}
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
