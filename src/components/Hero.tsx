"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { ArrowDown, ArrowRight } from "@phosphor-icons/react";
import { Link } from "@/i18n/navigation";
import { heroPhotos } from "@/lib/photos";

/**
 * Strona główna zaczyna się od jednego prawdziwego kadru, nie od karuzeli.
 * Dzięki temu telefon dostaje własną, pionową kompozycję, a przeglądarka ma
 * tylko jeden kandydat LCP. Warstwa „bramy” jest czysto progresywna: bez CSS,
 * JavaScriptu lub przy reduced motion treść i zdjęcie od razu są widoczne.
 */
export function Hero() {
  const t = useTranslations("hero");
  const facts = t.raw("stats") as string[];

  return (
    <section
      aria-labelledby="home-hero-heading"
      className="home-hero relative isolate min-h-[100svh] overflow-hidden bg-[#071630] pt-[72px] text-white"
    >
      <div className="absolute inset-0" aria-hidden="true">
        <Image
          src={heroPhotos[0]}
          alt=""
          fill
          preload
          sizes="100vw"
          className="home-hero-photo object-cover object-[50%_48%]"
        />
        <div className="home-hero-shade absolute inset-0" />
        <div className="home-hero-gate home-hero-gate-left absolute inset-y-0 left-0 w-1/2 bg-[#2448f5]" />
        <div className="home-hero-gate home-hero-gate-right absolute inset-y-0 right-0 w-1/2 bg-[#2448f5]" />
        <div className="grain" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[calc(100svh-72px)] w-full max-w-[1280px] flex-col items-center justify-center px-5 pb-40 pt-14 text-center sm:px-8 sm:pb-36 lg:pt-10">
        <p className="home-hero-kicker max-w-[56ch] text-balance text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-white/82 sm:text-[0.75rem]">
          {t("eyebrow")}
        </p>

        <h1
          id="home-hero-heading"
          className="mt-6 max-w-[12ch] text-balance font-display text-[clamp(3.15rem,8.2vw,6rem)] font-extrabold leading-[0.9] tracking-[-0.04em] text-white [text-shadow:0_8px_35px_rgba(0,0,0,0.32)]"
        >
          <span className="block">{t("line1")}</span>
          <span className="block text-[#9fb1ff]">{t("line2")}</span>
        </h1>

        <p className="mt-7 max-w-[62ch] text-pretty text-[1rem] leading-[1.65] text-white/88 sm:text-[1.125rem] sm:leading-[1.7]">
          {t("lead")}
        </p>

        <div className="mt-9 flex w-full max-w-[520px] flex-col items-stretch justify-center gap-3 sm:w-auto sm:max-w-none sm:flex-row sm:items-center">
          <Link
            href="/dla-studenta"
            className="home-hero-cta group inline-flex min-h-12 items-center justify-center gap-3 bg-white px-6 py-3 text-[0.9375rem] font-semibold text-[#0b1735]"
          >
            {t("cta2")}
            <ArrowRight size={19} weight="bold" aria-hidden="true" className="transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/rekrutacja"
            className="home-hero-cta group inline-flex min-h-12 items-center justify-center gap-3 border border-white/55 px-6 py-3 text-[0.9375rem] font-semibold text-white hover:bg-white hover:text-[#0b1735]"
          >
            {t("cta1")}
            <ArrowRight size={19} weight="bold" aria-hidden="true" className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      <div className="home-hero-rail absolute inset-x-0 bottom-0 z-10 border-t border-white/20 bg-[#06112a]/92">
        <div className="mx-auto grid max-w-[1280px] grid-cols-3 divide-x divide-white/14 px-2 sm:px-6">
          {facts.map((fact, index) => (
            <p
              key={fact}
              className="flex min-h-[76px] items-center justify-center px-2 text-center text-[0.625rem] font-medium leading-[1.45] text-white/78 sm:min-h-[84px] sm:px-6 sm:text-[0.75rem]"
            >
              <span className="mr-2 hidden font-mono text-[0.625rem] text-[#9fb1ff] sm:inline">
                0{index + 1}
              </span>
              {fact}
            </p>
          ))}
        </div>
      </div>

      <a
        href="#szybki-start"
        aria-label={t("scroll")}
        className="absolute bottom-[98px] left-1/2 z-10 hidden -translate-x-1/2 items-center gap-2 text-[0.6875rem] font-medium uppercase tracking-[0.12em] text-white/72 transition-colors hover:text-white lg:flex"
      >
        <ArrowDown size={16} weight="bold" aria-hidden="true" className="home-hero-arrow" />
      </a>
    </section>
  );
}
