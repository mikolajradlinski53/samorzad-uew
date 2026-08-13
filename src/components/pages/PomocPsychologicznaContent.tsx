"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  ArrowRight,
  Buildings,
  ChatCircleDots,
  Check,
  Copy,
  FilePdf,
  Heart,
  MapPin,
  Phone,
  ShieldCheck,
  type Icon,
} from "@phosphor-icons/react";
import { Breadcrumbs } from "../Breadcrumbs";

interface Item {
  key: string;
  icon: Icon;
}

const contains: Item[] = [
  { key: "places", icon: Buildings },
  { key: "institutions", icon: MapPin },
  { key: "contacts", icon: ChatCircleDots },
];

const helplines = [
  { number: "116 123", tel: "116123", descKey: "adults", metaKey: "adultsMeta" },
  { number: "800 70 2222", tel: "800702222", descKey: "crisis", metaKey: "crisisMeta" },
  { number: "116 111", tel: "116111", descKey: "youth", metaKey: "youthMeta" },
];

const INFOPACK =
  "https://drive.google.com/file/d/1qn2UQmuCBG1VYPP46opdvh6vMqQnBTAW/view?usp=sharing";
const CHAT = "https://116sos.pl/";
const HEALTH_MINISTRY =
  "https://www.gov.pl/web/zdrowie/gdzie-uzyskac-pomoc-psychologiczna-i-psychiatryczna";

export function PomocPsychologicznaContent() {
  const t = useTranslations("pomoc");
  const tc = useTranslations("common");
  const [copied, setCopied] = useState(false);

  async function copyOpeningSentence() {
    const sentence = t("openingSentence");

    try {
      await navigator.clipboard.writeText(sentence);
      setCopied(true);
    } catch {
      const fallback = document.createElement("textarea");
      fallback.value = sentence;
      fallback.setAttribute("readonly", "");
      fallback.style.position = "fixed";
      fallback.style.opacity = "0";
      document.body.appendChild(fallback);
      fallback.select();
      const didCopy = document.execCommand("copy");
      fallback.remove();
      setCopied(didCopy);
    }
  }

  return (
    <>
      <section
        className="relative overflow-hidden border-b border-border-subtle bg-bg-elevated"
        aria-labelledby="pomoc-title"
      >
        <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[48%] lg:block" aria-hidden="true">
          <span className="psychology-calm-ring absolute left-1/2 top-1/2 h-[180px] w-[180px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent/20" />
          <span className="psychology-calm-ring psychology-calm-ring-delayed absolute left-1/2 top-1/2 h-[340px] w-[340px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent/15" />
          <span className="psychology-calm-ring psychology-calm-ring-late absolute left-1/2 top-1/2 h-[510px] w-[510px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent/10" />
          <Heart
            size={70}
            weight="duotone"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-accent/20"
          />
        </div>

        <div className="relative mx-auto max-w-[1200px] px-6 pb-14 pt-[128px] md:pb-20 md:pt-[140px]">
          <Breadcrumbs
            items={[
              { label: tc("home"), href: "/" },
              { label: t("crumbStudent"), href: "/dla-studenta" },
              { label: t("heroTitle") },
            ]}
          />

          <div className="mt-9 grid items-end gap-10 lg:grid-cols-[minmax(0,1.18fr)_minmax(320px,0.82fr)] lg:gap-16">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-bg-surface px-4 py-2 text-[0.875rem] font-medium text-accent">
                <ShieldCheck size={18} weight="fill" aria-hidden="true" />
                {t("calmLabel")}
              </p>
              <h1
                id="pomoc-title"
                className="mt-6 max-w-[14ch] text-balance font-display text-[clamp(2.75rem,6vw,5.5rem)] font-semibold leading-[0.98] tracking-[-0.035em] text-ink-primary"
              >
                {t("heroTitle")}
              </h1>
              <p className="mt-6 max-w-[62ch] text-pretty text-[1.0625rem] leading-[1.75] text-ink-secondary sm:text-[1.125rem]">
                {t("heroLead")}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#pomoc-teraz"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3 text-center font-semibold text-bg-base transition-colors hover:bg-accent-dim"
                >
                  {t("needHelpNow")}
                  <ArrowRight size={19} weight="bold" aria-hidden="true" />
                </a>
                <a
                  href="#formy-wsparcia"
                  className="inline-flex min-h-12 items-center justify-center rounded-lg border border-border-strong bg-bg-surface px-6 py-3 text-center font-semibold text-ink-primary transition-colors hover:bg-bg-subtle"
                >
                  {t("browseSupport")}
                </a>
              </div>
            </div>

            <aside className="relative rounded-2xl bg-[#1837c9] p-6 text-white sm:p-8 dark:bg-[#1d348f]" aria-labelledby="emergency-heading">
              <p className="text-[0.875rem] font-semibold text-white/80">{t("emergencyLabel")}</p>
              <h2 id="emergency-heading" className="mt-3 text-balance font-display text-[1.5rem] font-semibold leading-[1.2] tracking-[-0.02em]">
                {t("emergencyHeading")}
              </h2>
              <p className="mt-3 text-[0.9375rem] leading-[1.65] text-white/85">
                {t("emergencyBody")}
              </p>
              <a
                href="tel:112"
                className="mt-6 inline-flex min-h-12 w-full items-center justify-between rounded-lg bg-white px-5 py-3 font-semibold text-[#10256f] transition-colors hover:bg-[#eef2ff]"
                aria-label={t("callEmergencyAria")}
              >
                <span className="flex items-center gap-3">
                  <Phone size={20} weight="fill" aria-hidden="true" />
                  {t("callEmergency")}
                </span>
                <span className="font-display text-[1.5rem] tabular-nums">112</span>
              </a>
            </aside>
          </div>
        </div>
      </section>

      <section
        id="pomoc-teraz"
        className="section-padding scroll-mt-24"
        aria-labelledby="telefony-heading"
      >
        <div className="mx-auto grid max-w-[1200px] gap-12 lg:grid-cols-[minmax(260px,0.72fr)_minmax(0,1.28fr)] lg:gap-20">
          <div>
            <h2
              id="telefony-heading"
              className="text-balance font-display text-[clamp(2rem,4vw,3.5rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-ink-primary"
            >
              {t("helpHeading")}
            </h2>
            <p className="mt-5 max-w-[42ch] text-pretty text-[1rem] leading-[1.7] text-ink-secondary">
              {t("helpLead")}
            </p>
            <a
              href={CHAT}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex min-h-12 items-center gap-3 rounded-lg border border-border-strong px-5 py-3 font-semibold text-ink-primary transition-colors hover:bg-bg-elevated"
            >
              <ChatCircleDots size={21} weight="fill" className="text-accent" aria-hidden="true" />
              {t("openChat")}
            </a>
            <p className="mt-3 text-[0.8125rem] leading-[1.55] text-ink-tertiary">
              {t("chatNote")}
            </p>
          </div>

          <div>
            <div className="border-y border-border-medium">
              {helplines.map((line) => (
                <a
                  key={line.descKey}
                  href={`tel:${line.tel}`}
                  className="group flex min-h-[132px] flex-col justify-between gap-5 border-b border-border-subtle py-6 transition-colors last:border-b-0 hover:bg-bg-elevated sm:flex-row sm:items-center sm:px-5"
                  aria-label={`${line.number} — ${t(`helplines.${line.descKey}`)}`}
                >
                  <p className="font-display text-[clamp(2rem,5vw,3.25rem)] font-semibold leading-none tracking-[-0.03em] text-ink-primary tabular-nums">
                    {line.number}
                  </p>
                  <div className="max-w-[340px] sm:text-right">
                    <p className="text-[0.9375rem] font-medium leading-[1.5] text-ink-primary">
                      {t(`helplines.${line.descKey}`)}
                    </p>
                    <p className="mt-2 text-[0.8125rem] leading-[1.45] text-ink-tertiary">
                      {t(`helplines.${line.metaKey}`)}
                    </p>
                  </div>
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent text-bg-base transition-transform group-hover:scale-105" aria-hidden="true">
                    <Phone size={20} weight="fill" />
                  </span>
                </a>
              ))}
            </div>

            <div className="mt-10 rounded-xl bg-bg-elevated p-6 sm:p-8">
              <h3 className="font-display text-[1.25rem] font-semibold leading-[1.3] tracking-[-0.015em] text-ink-primary">
                {t("openingHeading")}
              </h3>
              <p className="mt-2 text-[0.9375rem] leading-[1.65] text-ink-secondary">
                {t("openingBody")}
              </p>
              <blockquote className="mt-5 border-y border-border-medium py-5 text-pretty text-[1.0625rem] font-medium leading-[1.65] text-ink-primary">
                “{t("openingSentence")}”
              </blockquote>
              <button
                type="button"
                onClick={copyOpeningSentence}
                className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-lg border border-border-strong bg-bg-surface px-4 py-2.5 text-[0.875rem] font-semibold text-ink-primary transition-colors hover:bg-bg-subtle"
              >
                {copied ? <Check size={18} weight="bold" aria-hidden="true" /> : <Copy size={18} aria-hidden="true" />}
                <span aria-live="polite">{copied ? t("copied") : t("copySentence")}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <section
        id="formy-wsparcia"
        className="section-padding scroll-mt-24 border-t border-border-subtle bg-bg-surface"
        aria-labelledby="formy-heading"
      >
        <div className="mx-auto grid max-w-[1200px] gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:gap-20">
          <div>
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-glow text-accent">
              <Heart size={26} weight="fill" aria-hidden="true" />
            </span>
            <h2
              id="formy-heading"
              className="mt-6 max-w-[18ch] text-balance font-display text-[clamp(2rem,4vw,3.5rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-ink-primary"
            >
              {t("reassureHeading")}
            </h2>
            <p className="mt-5 max-w-[62ch] text-pretty text-[1rem] leading-[1.75] text-ink-secondary">
              {t("reassureBody")}
            </p>
            <a
              href={INFOPACK}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-lg bg-accent px-6 py-3 font-semibold text-bg-base transition-colors hover:bg-accent-dim"
            >
              <FilePdf size={20} aria-hidden="true" />
              {t("openInfopack")}
            </a>
          </div>

          <div className="border-y border-border-medium">
            {contains.map((item) => {
              const Glyph = item.icon;
              return (
                <div key={item.key} className="flex min-h-[116px] items-center gap-5 border-b border-border-subtle py-6 last:border-b-0">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent-glow text-accent">
                    <Glyph size={22} aria-hidden="true" />
                  </span>
                  <p className="text-[0.9375rem] font-medium leading-[1.6] text-ink-primary">
                    {t(`contains.${item.key}`)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mx-auto mt-14 flex max-w-[1200px] flex-col gap-2 border-t border-border-subtle pt-5 text-[0.8125rem] leading-[1.55] text-ink-tertiary sm:flex-row sm:items-center sm:justify-between">
          <p>{t("verifiedDate")}</p>
          <a
            href={HEALTH_MINISTRY}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-ink-secondary underline decoration-border-medium underline-offset-4 transition-colors hover:text-accent"
          >
            {t("officialSource")}
          </a>
        </div>
      </section>
    </>
  );
}
