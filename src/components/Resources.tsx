"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  ArrowRight,
  BookOpen,
  FirstAidKit,
  GraduationCap,
  HandCoins,
  MapTrifold,
  Megaphone,
  Package,
  Scales,
  type Icon,
} from "@phosphor-icons/react";

interface Resource {
  key: string;
  href: string;
  icon: Icon;
}

const resources: Resource[] = [
  { key: "prawa", href: "/prawa-studenta", icon: Scales },
  { key: "stypendia", href: "/stypendia", icon: GraduationCap },
  { key: "wsparcie", href: "/stypendia#wsparcie", icon: HandCoins },
  { key: "mapa", href: "/mapa-kampusu", icon: MapTrifold },
  { key: "infopacki", href: "/infopacki", icon: Package },
  { key: "pomoc", href: "/pomoc-psychologiczna", icon: FirstAidKit },
  { key: "rzecznik", href: "/rzecznik-praw-studenta", icon: Megaphone },
  { key: "prawo", href: "/prawo-dla-studenta", icon: BookOpen },
];

export function Resources() {
  const t = useTranslations("resources");

  return (
    <section id="dla-studenta" aria-labelledby="dla-studenta-heading" className="section-padding">
      <div className="mx-auto grid max-w-[1200px] gap-12 lg:grid-cols-[minmax(280px,0.72fr)_minmax(0,1.28fr)] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="font-mono text-[0.6875rem] font-semibold uppercase tracking-[0.13em] text-accent">
            {t("eyebrow")}
          </p>
          <h2
            id="dla-studenta-heading"
            className="mt-4 max-w-[12ch] text-balance font-display text-[clamp(2.35rem,5vw,4.75rem)] font-semibold leading-[0.96] tracking-[-0.04em] text-ink-primary"
          >
            {t("heading")}
          </h2>
          <p className="mt-6 max-w-[45ch] text-pretty text-[0.9375rem] leading-[1.7] text-ink-secondary">
            {t("intro")}
          </p>
          <Link
            href="/dla-studenta"
            className="group mt-7 inline-flex min-h-12 items-center gap-3 bg-accent px-5 py-3 text-[0.875rem] font-semibold text-bg-base transition-colors hover:bg-accent-dim"
          >
            {t("seeAll")}
            <ArrowRight size={18} weight="bold" aria-hidden="true" className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <ol className="border-b border-border-medium">
          {resources.map((item, index) => {
            const Glyph = item.icon;
            return (
              <li key={item.key} className="border-t border-border-medium">
                <Link
                  href={item.href}
                  className="group grid min-h-[128px] grid-cols-[40px_minmax(0,1fr)_auto] items-center gap-x-4 gap-y-2 py-5 sm:grid-cols-[48px_minmax(160px,0.65fr)_minmax(0,1fr)_auto] sm:gap-x-5"
                >
                  <span className="flex h-10 w-10 items-center justify-center text-accent">
                    <Glyph size={24} weight="regular" aria-hidden="true" />
                  </span>
                  <span className="font-display text-[1.15rem] font-semibold tracking-[-0.02em] text-ink-primary sm:text-[1.25rem]">
                    {t(`items.${item.key}.title`)}
                  </span>
                  <span className="col-start-2 max-w-[44ch] text-[0.8125rem] leading-[1.6] text-ink-secondary sm:col-start-auto sm:text-[0.875rem]">
                    {t(`items.${item.key}.desc`)}
                  </span>
                  <span className="row-span-2 flex items-center gap-2 font-mono text-[0.625rem] text-ink-tertiary sm:row-span-1">
                    {String(index + 1).padStart(2, "0")}
                    <ArrowRight size={17} weight="bold" aria-hidden="true" className="text-accent transition-transform group-hover:translate-x-1" />
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
