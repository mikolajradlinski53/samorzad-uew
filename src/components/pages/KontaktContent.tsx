"use client";

import { useTranslations } from "next-intl";
import {
  MapPin,
  EnvelopeSimple,
  TiktokLogo,
  FacebookLogo,
  InstagramLogo,
  LinkedinLogo,
} from "@phosphor-icons/react";
import { ScrollReveal } from "../ScrollReveal";
import { MapEmbed } from "../MapEmbed";
import { ContactForm, type ContactFormField } from "../ContactForm";
import { formspree } from "@/lib/forms";

const CONTACT_EMAIL = "kontakt@samorzad.ue.wroc.pl";

const socials = [
  { icon: TiktokLogo, label: "TikTok", href: "https://www.tiktok.com/@samorzaduew" },
  { icon: FacebookLogo, label: "Facebook", href: "https://www.facebook.com/samorzad.ue" },
  { icon: InstagramLogo, label: "Instagram", href: "https://www.instagram.com/samorzad.ue" },
  {
    icon: LinkedinLogo,
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/samorząd-studentów-uniwersytetu-ekonomicznego-we-wrocławiu/",
  },
];

export function KontaktContent() {
  const t = useTranslations("kontakt");

  const fields: ContactFormField[] = [
    {
      key: "name",
      type: "text",
      label: t("labelName"),
      autoComplete: "name",
      colSpan: 1,
      validate: (v) => (v.trim().length < 2 ? t("errName") : undefined),
    },
    {
      key: "email",
      type: "email",
      label: t("labelEmail"),
      autoComplete: "email",
      colSpan: 1,
      validate: (v) => (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? t("errEmail") : undefined),
    },
    {
      key: "subject",
      type: "text",
      label: t("labelSubject"),
      colSpan: 2,
      validate: (v) => (v.trim().length < 2 ? t("errSubject") : undefined),
    },
    {
      key: "message",
      type: "textarea",
      label: t("labelMessage"),
      colSpan: 2,
      validate: (v) => (v.trim().length < 10 ? t("errMessage") : undefined),
    },
  ];

  const labels = {
    submitIdle: t("submitIdle"),
    submitSending: t("submitSending"),
    successHeading: t("successHeading"),
    successBody: t("successBody"),
    successAgain: t("successAgain"),
    errServer: t("errServer"),
    rodoIntro: t("rodoIntro"),
    rodoLink: t("rodoLink"),
    notConfiguredIntro: t("formNotConfiguredIntro"),
  };

  return (
    <section className="section-padding" aria-labelledby="kontakt-form-heading">
      <div className="mx-auto grid max-w-[1200px] gap-12 lg:grid-cols-[5fr_7fr]">
        {/* Details */}
        <ScrollReveal>
          <h2
            id="kontakt-form-heading"
            className="font-display text-[clamp(1.75rem,3.4vw,2.75rem)] font-semibold leading-[1.15] tracking-[-0.02em] text-ink-primary"
          >
            {t("detailsHeading")}
          </h2>
          <p className="prose-constrained mt-4 text-[1.0625rem] leading-[1.75] text-ink-secondary">
            {t("detailsLead")}
          </p>

          <address className="mt-8 flex flex-col gap-4 not-italic">
            <div className="flex items-start gap-3 text-ink-secondary">
              <MapPin size={20} weight="regular" aria-hidden="true" className="mt-0.5 shrink-0" />
              <p className="text-[0.9375rem] leading-[1.7]">
                {t("addr1")}
                <br />
                {t("addr2")}
                <br />
                {t("addr3")}
              </p>
            </div>
            <a
              href="mailto:kontakt@samorzad.ue.wroc.pl"
              className="flex items-center gap-3 py-1 text-[0.9375rem] text-ink-secondary transition-colors hover:text-ink-primary"
            >
              <EnvelopeSimple size={20} weight="regular" aria-hidden="true" className="shrink-0" />
              kontakt@samorzad.ue.wroc.pl
            </a>
          </address>

          <ul className="mt-6 flex list-none gap-3">
            {socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="flex h-11 w-11 items-center justify-center rounded-lg text-ink-secondary transition-colors hover:bg-bg-elevated hover:text-accent"
                >
                  <s.icon size={22} weight="regular" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </ScrollReveal>

        {/* Form */}
        <ScrollReveal delay={0.1}>
          <ContactForm
            endpoint={formspree.kontakt}
            fields={fields}
            labels={labels}
            contactEmail={CONTACT_EMAIL}
          />
        </ScrollReveal>
      </div>

      {/* Map */}
      <ScrollReveal>
        <div className="mx-auto mt-12 max-w-[1200px] overflow-hidden rounded-2xl border border-border-subtle">
          <MapEmbed
            src="https://www.google.com/maps?q=ul.+Kamienna+44,+53-307+Wroc%C5%82aw&output=embed"
            title={t("mapTitle")}
            address={`${t("addr1")}, ${t("addr2")}`}
            loadLabel={t("mapLoad")}
            consentNote={t("mapConsent")}
          />
        </div>
      </ScrollReveal>
    </section>
  );
}
