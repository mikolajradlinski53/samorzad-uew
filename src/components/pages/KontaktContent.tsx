"use client";

import { useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import {
  MapPin,
  EnvelopeSimple,
  CheckCircle,
  TiktokLogo,
  FacebookLogo,
  InstagramLogo,
  LinkedinLogo,
} from "@phosphor-icons/react";
import { ScrollReveal } from "../ScrollReveal";

interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

type Errors = Partial<Record<keyof FormState, string>>;

const empty: FormState = { name: "", email: "", subject: "", message: "" };

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
  const reduce = useReducedMotion();
  const t = useTranslations("kontakt");
  const formRef = useRef<HTMLFormElement>(null);

  const validate = (vals: FormState): Errors => {
    const errs: Errors = {};
    if (vals.name.trim().length < 2) errs.name = t("errName");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(vals.email)) errs.email = t("errEmail");
    if (vals.subject.trim().length < 2) errs.subject = t("errSubject");
    if (vals.message.trim().length < 10) errs.message = t("errMessage");
    return errs;
  };

  const [values, setValues] = useState<FormState>(empty);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormState, boolean>>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [serverError, setServerError] = useState<string | null>(null);

  const update = (field: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setValues((v) => ({ ...v, [field]: e.target.value }));
    if (touched[field]) {
      setErrors(validate({ ...values, [field]: e.target.value }));
    }
  };

  const blur = (field: keyof FormState) => () => {
    setTouched((t) => ({ ...t, [field]: true }));
    setErrors(validate(values));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    setTouched({ name: true, email: true, subject: true, message: true });
    if (Object.keys(found).length > 0) {
      const firstInvalid =
        formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]');
      firstInvalid?.focus();
      return;
    }
    setServerError(null);
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error ?? t("errServer"));
      }
      setStatus("success");
      setValues(empty);
      setTouched({});
    } catch (err) {
      setServerError(err instanceof Error ? err.message : t("errServer"));
      setStatus("error");
    }
  };

  const fieldClass = (field: keyof FormState) =>
    `w-full rounded-lg border bg-bg-base px-4 py-3 text-[0.9375rem] text-ink-primary placeholder:text-ink-tertiary transition-colors focus:border-accent ${
      errors[field] && touched[field]
        ? "border-red-500"
        : "border-border-medium"
    }`;

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
              className="flex items-center gap-3 text-[0.9375rem] text-ink-secondary transition-colors hover:text-ink-primary"
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
          <div className="rounded-2xl border border-border-subtle bg-bg-surface p-6 sm:p-8">
            {status === "success" ? (
              <motion.div
                initial={reduce ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center gap-4 py-12 text-center"
                role="status"
              >
                <CheckCircle size={56} weight="fill" className="text-accent" aria-hidden="true" />
                <h3 className="font-display text-[1.5rem] text-ink-primary">
                  {t("successHeading")}
                </h3>
                <p className="max-w-[40ch] text-[0.9375rem] leading-[1.6] text-ink-secondary">
                  {t("successBody")}
                </p>
                <button
                  type="button"
                  onClick={() => setStatus("idle")}
                  className="mt-2 text-[0.9375rem] font-medium text-accent transition-colors hover:text-accent-dim"
                >
                  {t("successAgain")}
                </button>
              </motion.div>
            ) : (
              <form ref={formRef} onSubmit={handleSubmit} noValidate>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-1">
                    <label htmlFor="name" className="mb-2 block text-[0.875rem] font-medium text-ink-primary">
                      {t("labelName")} <span className="text-accent">*</span>
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      value={values.name}
                      onChange={update("name")}
                      onBlur={blur("name")}
                      aria-required="true"
                      aria-invalid={!!(errors.name && touched.name)}
                      aria-describedby={errors.name && touched.name ? "name-error" : undefined}
                      className={fieldClass("name")}
                    />
                    {errors.name && touched.name && (
                      <p id="name-error" role="alert" className="mt-1.5 text-[0.8125rem] text-red-500">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div className="sm:col-span-1">
                    <label htmlFor="email" className="mb-2 block text-[0.875rem] font-medium text-ink-primary">
                      {t("labelEmail")} <span className="text-accent">*</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={values.email}
                      onChange={update("email")}
                      onBlur={blur("email")}
                      aria-required="true"
                      aria-invalid={!!(errors.email && touched.email)}
                      aria-describedby={errors.email && touched.email ? "email-error" : undefined}
                      className={fieldClass("email")}
                    />
                    {errors.email && touched.email && (
                      <p id="email-error" role="alert" className="mt-1.5 text-[0.8125rem] text-red-500">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="subject" className="mb-2 block text-[0.875rem] font-medium text-ink-primary">
                      {t("labelSubject")} <span className="text-accent">*</span>
                    </label>
                    <input
                      id="subject"
                      name="subject"
                      type="text"
                      value={values.subject}
                      onChange={update("subject")}
                      onBlur={blur("subject")}
                      aria-required="true"
                      aria-invalid={!!(errors.subject && touched.subject)}
                      aria-describedby={errors.subject && touched.subject ? "subject-error" : undefined}
                      className={fieldClass("subject")}
                    />
                    {errors.subject && touched.subject && (
                      <p id="subject-error" role="alert" className="mt-1.5 text-[0.8125rem] text-red-500">
                        {errors.subject}
                      </p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="message" className="mb-2 block text-[0.875rem] font-medium text-ink-primary">
                      {t("labelMessage")} <span className="text-accent">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      value={values.message}
                      onChange={update("message")}
                      onBlur={blur("message")}
                      aria-required="true"
                      aria-invalid={!!(errors.message && touched.message)}
                      aria-describedby={errors.message && touched.message ? "message-error" : undefined}
                      className={`${fieldClass("message")} resize-y`}
                    />
                    {errors.message && touched.message && (
                      <p id="message-error" role="alert" className="mt-1.5 text-[0.8125rem] text-red-500">
                        {errors.message}
                      </p>
                    )}
                  </div>
                </div>

                {status === "error" && serverError && (
                  <p
                    role="alert"
                    className="mt-6 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-[0.875rem] text-red-600 dark:text-red-400"
                  >
                    {serverError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-accent px-7 text-base font-medium text-bg-base transition-all hover:bg-accent-dim active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {status === "sending" ? t("submitSending") : t("submitIdle")}
                </button>
              </form>
            )}
          </div>
        </ScrollReveal>
      </div>

      {/* Map */}
      <ScrollReveal>
        <div className="mx-auto mt-12 max-w-[1200px] overflow-hidden rounded-2xl border border-border-subtle">
          <iframe
            title={t("mapTitle")}
            src="https://www.google.com/maps?q=ul.+Kamienna+43,+53-307+Wroc%C5%82aw&output=embed"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="block h-[360px] w-full border-0"
          />
        </div>
      </ScrollReveal>
    </section>
  );
}
