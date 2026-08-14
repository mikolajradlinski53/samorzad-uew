"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  ArrowRight,
  Eye,
  FirstAidKit,
  Megaphone,
  UsersThree,
  type Icon,
} from "@phosphor-icons/react";

interface PathItem {
  key: "matter" | "support" | "join" | "proof";
  href: string;
  icon: Icon;
}

const paths: PathItem[] = [
  { key: "matter", href: "/dla-studenta", icon: Megaphone },
  { key: "support", href: "/pomoc-psychologiczna", icon: FirstAidKit },
  { key: "join", href: "/rekrutacja", icon: UsersThree },
  { key: "proof", href: "/transparentnosc", icon: Eye },
];

export function AudienceStrip() {
  const t = useTranslations("audience");

  return (
    <section
      id="szybki-start"
      className="section-padding scroll-mt-20"
      aria-labelledby="audience-heading"
    >
      <div className="mx-auto max-w-[1200px]">
        <div className="grid gap-5 border-b border-border-medium pb-10 md:grid-cols-[minmax(0,1fr)_minmax(280px,0.55fr)] md:items-end md:gap-16">
          <div>
            <p className="font-mono text-[0.6875rem] font-semibold uppercase tracking-[0.13em] text-accent">
              {t("label")}
            </p>
            <h2
              id="audience-heading"
              className="mt-4 max-w-[18ch] text-balance font-display text-[clamp(2.25rem,5vw,4.75rem)] font-semibold leading-[0.96] tracking-[-0.04em] text-ink-primary"
            >
              {t("heading")}
            </h2>
          </div>
          <p className="max-w-[46ch] text-pretty text-[0.9375rem] leading-[1.7] text-ink-secondary">
            {t("intro")}
          </p>
        </div>

        <ol className="border-b border-border-medium">
          {paths.map((item, index) => {
            const Glyph = item.icon;
            return (
              <li key={item.key} className="border-t border-border-medium first:border-t-0">
                <Link
                  href={item.href}
                  className="home-path group grid min-h-[148px] grid-cols-[44px_minmax(0,1fr)_auto] items-center gap-x-3 gap-y-3 py-6 sm:grid-cols-[64px_minmax(180px,0.75fr)_minmax(0,1fr)_auto] sm:gap-x-6 sm:py-7"
                >
                  <span className="font-mono text-[0.6875rem] text-accent tabular-nums">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="flex items-center gap-4">
                    <Glyph size={25} weight="regular" aria-hidden="true" className="hidden shrink-0 text-accent md:block" />
                    <span className="text-balance font-display text-[1.3rem] font-semibold leading-[1.1] tracking-[-0.025em] text-ink-primary sm:text-[1.55rem]">
                      {t(`${item.key}.title`)}
                    </span>
                  </span>
                  <span className="col-start-2 max-w-[58ch] text-[0.875rem] leading-[1.65] text-ink-secondary sm:col-start-auto sm:text-[0.9375rem]">
                    {t(`${item.key}.desc`)}
                  </span>
                  <span className="row-span-2 flex h-11 w-11 items-center justify-center border border-border-medium text-accent transition-colors group-hover:border-accent group-hover:bg-accent group-hover:text-white sm:row-span-1">
                    <ArrowRight size={19} weight="bold" aria-hidden="true" className="transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
