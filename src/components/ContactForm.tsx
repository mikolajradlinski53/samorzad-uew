"use client";

import { useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { CheckCircle } from "@phosphor-icons/react";
import { Link } from "@/i18n/navigation";
import { formspreeUrl, isConfigured } from "@/lib/forms";

export interface ContactFormField {
  /** Also used as the JSON body key submitted to Formspree. */
  key: string;
  type: "text" | "email" | "textarea";
  label: string;
  autoComplete?: string;
  /** Grid width in the 2-column layout. Defaults to 2 (full width). */
  colSpan?: 1 | 2;
  rows?: number;
  /** Returns an error message when invalid, or undefined when valid. */
  validate: (value: string) => string | undefined;
}

export interface ContactFormLabels {
  submitIdle: string;
  submitSending: string;
  successHeading: string;
  successBody: string;
  successAgain: string;
  errServer: string;
  rodoIntro: string;
  rodoLink: string;
  notConfiguredIntro: string;
}

export interface ContactFormProps {
  /** Formspree form id, or the FORMSPREE_PLACEHOLDER value from src/lib/forms.ts. */
  endpoint: string;
  fields: ContactFormField[];
  labels: ContactFormLabels;
  /** Contact e-mail shown as a mailto fallback while the endpoint is unconfigured. */
  contactEmail: string;
  /** Extra values sent alongside the form fields, e.g. { source: "rzecznik" }. */
  extraHiddenFields?: Record<string, string>;
  /** Optional sentence rendered above the RODO clause (e.g. rzecznik-specific note). */
  extraNote?: string;
}

type Values = Record<string, string>;
type Errors = Record<string, string | undefined>;

interface FormspreeErrorResponse {
  errors?: { message?: string }[];
  error?: string;
}

export function ContactForm({
  endpoint,
  fields,
  labels,
  contactEmail,
  extraHiddenFields,
  extraNote,
}: ContactFormProps) {
  const reduce = useReducedMotion();
  const formRef = useRef<HTMLFormElement>(null);
  const configured = isConfigured(endpoint);

  const empty: Values = Object.fromEntries(fields.map((f) => [f.key, ""]));

  const validateAll = (vals: Values): Errors => {
    const errs: Errors = {};
    for (const f of fields) {
      errs[f.key] = f.validate(vals[f.key] ?? "");
    }
    return errs;
  };

  const [values, setValues] = useState<Values>(empty);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [serverError, setServerError] = useState<string | null>(null);

  const update = (key: string) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const next = { ...values, [key]: e.target.value };
    setValues(next);
    if (touched[key]) {
      setErrors(validateAll(next));
    }
  };

  const blur = (key: string) => () => {
    setTouched((t) => ({ ...t, [key]: true }));
    setErrors(validateAll(values));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!configured) return;

    const found = validateAll(values);
    setErrors(found);
    setTouched(Object.fromEntries(fields.map((f) => [f.key, true])));
    if (Object.values(found).some(Boolean)) {
      const firstInvalid =
        formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]');
      firstInvalid?.focus();
      return;
    }

    setServerError(null);
    setStatus("sending");
    try {
      const res = await fetch(formspreeUrl(endpoint), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ ...values, ...extraHiddenFields }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as FormspreeErrorResponse | null;
        const message =
          data?.errors?.map((er) => er.message).filter(Boolean).join(" ") ??
          data?.error ??
          labels.errServer;
        throw new Error(message);
      }
      setStatus("success");
      setValues(empty);
      setTouched({});
    } catch (err) {
      setServerError(err instanceof Error ? err.message : labels.errServer);
      setStatus("error");
    }
  };

  const fieldClass = (key: string) =>
    `w-full rounded-lg border bg-bg-base px-4 py-3 text-[0.9375rem] text-ink-primary placeholder:text-ink-tertiary transition-colors focus:border-accent ${
      errors[key] && touched[key] ? "border-red-500" : "border-border-strong"
    }`;

  return (
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
            {labels.successHeading}
          </h3>
          <p className="max-w-[40ch] text-[0.9375rem] leading-[1.6] text-ink-secondary">
            {labels.successBody}
          </p>
          <button
            type="button"
            onClick={() => setStatus("idle")}
            className="mt-2 text-[0.9375rem] font-medium text-accent transition-colors hover:text-accent-dim"
          >
            {labels.successAgain}
          </button>
        </motion.div>
      ) : (
        <form ref={formRef} onSubmit={handleSubmit} noValidate>
          {!configured && (
            <p
              role="alert"
              className="mb-6 rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-[0.875rem] text-amber-700 dark:text-amber-400"
            >
              {labels.notConfiguredIntro}{" "}
              <a href={`mailto:${contactEmail}`} className="underline underline-offset-2">
                {contactEmail}
              </a>
              .
            </p>
          )}

          <div className="grid gap-5 sm:grid-cols-2">
            {fields.map((f) => {
              const errorId = `${f.key}-error`;
              const hasError = !!(errors[f.key] && touched[f.key]);
              const commonProps = {
                id: f.key,
                name: f.key,
                value: values[f.key] ?? "",
                onChange: update(f.key),
                onBlur: blur(f.key),
                "aria-required": "true" as const,
                "aria-invalid": hasError,
                "aria-describedby": hasError ? errorId : undefined,
              };
              return (
                <div key={f.key} className={f.colSpan === 1 ? "sm:col-span-1" : "sm:col-span-2"}>
                  <label htmlFor={f.key} className="mb-2 block text-[0.875rem] font-medium text-ink-primary">
                    {f.label} <span className="text-accent">*</span>
                  </label>
                  {f.type === "textarea" ? (
                    <textarea
                      {...commonProps}
                      rows={f.rows ?? 5}
                      className={`${fieldClass(f.key)} resize-y`}
                    />
                  ) : (
                    <input
                      {...commonProps}
                      type={f.type}
                      autoComplete={f.autoComplete}
                      className={fieldClass(f.key)}
                    />
                  )}
                  {hasError && (
                    <p id={errorId} role="alert" className="mt-1.5 text-[0.8125rem] text-red-600 dark:text-red-400">
                      {errors[f.key]}
                    </p>
                  )}
                </div>
              );
            })}
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
            disabled={status === "sending" || !configured}
            className="mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-accent px-7 text-base font-medium text-bg-base transition-all hover:bg-accent-dim active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === "sending" ? labels.submitSending : labels.submitIdle}
          </button>

          {extraNote && (
            <p className="mt-4 text-[0.75rem] leading-[1.6] text-ink-tertiary">{extraNote}</p>
          )}

          <p className="mt-4 text-[0.75rem] leading-[1.6] text-ink-tertiary">
            {labels.rodoIntro}{" "}
            <Link href="/prywatnosc" className="underline decoration-border-medium underline-offset-2 transition-colors hover:text-ink-secondary">
              {labels.rodoLink}
            </Link>
            .
          </p>
        </form>
      )}
    </div>
  );
}
