"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import { motion, useReducedMotion } from "motion/react";
import { CircleNotch, PaperPlaneRight, Sparkle } from "@phosphor-icons/react";
import { Link } from "@/i18n/navigation";
import {
  addCitation,
  runAssistant,
  type AssistantCitation,
  type AssistantStatus,
} from "@/lib/assistant-client";
import { DURATION, EASE } from "@/lib/motion";

/** Krótkie pytania startowe — pokazują, o co w ogóle można zapytać. */
const EXAMPLE_KEYS = ["stypendium", "odwolanie", "rzecznik", "kolo"] as const;

export function AsystentContent() {
  const t = useTranslations("asystent");
  const locale = useLocale();
  const reduce = useReducedMotion();

  const [question, setQuestion] = useState("");
  const [asked, setAsked] = useState("");
  const [answer, setAnswer] = useState("");
  const [citations, setCitations] = useState<AssistantCitation[]>([]);
  const [status, setStatus] = useState<AssistantStatus>("idle");
  const abortRef = useRef<AbortController | null>(null);
  const answerRef = useRef<HTMLDivElement>(null);

  useEffect(() => () => abortRef.current?.abort(), []);

  const ask = (raw: string) => {
    const q = raw.trim();
    if (q.length < 3) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setAsked(q);
    setAnswer("");
    setCitations([]);
    setStatus("streaming");

    void runAssistant({
      question: q,
      locale,
      signal: controller.signal,
      onStatus: setStatus,
      onEvent: (event) => {
        if (event.type === "text") setAnswer((prev) => prev + event.text);
        else if (event.type === "citation") setCitations((prev) => addCitation(prev, event));
        else if (event.type === "done") setStatus("done");
        else if (event.type === "refusal") setStatus("refusal");
        else if (event.type === "error") setStatus("error");
      },
    });
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    ask(question);
  };

  const busy = status === "streaming";
  const showAnswerPanel = status !== "idle";

  return (
    <section className="section-padding" aria-labelledby="asystent-heading">
      <div className="mx-auto max-w-[760px]">
        <h2
          id="asystent-heading"
          className="font-display text-[clamp(1.5rem,2.8vw,2.25rem)] font-semibold leading-[1.2] tracking-[-0.02em] text-ink-primary"
        >
          {t("heading")}
        </h2>
        <p className="prose-constrained mt-4 text-[1.0625rem] leading-[1.75] text-ink-secondary">
          {t("intro")}
        </p>

        {/* Pytanie */}
        <form onSubmit={onSubmit} className="mt-8">
          <label htmlFor="asystent-question" className="sr-only">
            {t("inputLabel")}
          </label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              id="asystent-question"
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={t("placeholder")}
              autoComplete="off"
              className="h-12 w-full min-w-0 rounded-lg border border-border-strong bg-bg-surface px-4 text-[1rem] text-ink-primary placeholder:text-ink-tertiary focus:border-accent focus:outline-none"
            />
            <button
              type="submit"
              disabled={busy || question.trim().length < 3}
              className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-lg bg-accent px-6 text-[0.9375rem] font-medium text-bg-base transition-all hover:bg-accent-dim active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busy ? t("asking") : t("askButton")}
              <PaperPlaneRight size={18} weight="regular" aria-hidden="true" />
            </button>
          </div>
        </form>

        {/* Przykładowe pytania — bez nich nikt nie wie, o co pytać. */}
        <div className="mt-5">
          <p className="text-[0.8125rem] font-medium uppercase tracking-[0.08em] text-ink-tertiary">
            {t("examplesLabel")}
          </p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {EXAMPLE_KEYS.map((key) => {
              const example = t(`examples.${key}`);
              return (
                <li key={key}>
                  <button
                    type="button"
                    onClick={() => {
                      setQuestion(example);
                      ask(example);
                    }}
                    className="rounded-full border border-border-subtle bg-bg-surface px-4 py-2 text-[0.875rem] text-ink-secondary transition-colors hover:border-border-soft hover:bg-bg-elevated hover:text-ink-primary"
                  >
                    {example}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Odpowiedź */}
        {showAnswerPanel && (
          <motion.div
            ref={answerRef}
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={reduce ? { duration: 0 } : { duration: DURATION.reveal, ease: EASE }}
            className="mt-10 rounded-2xl border border-border-subtle bg-bg-surface p-6"
          >
            <p className="flex items-start gap-2 text-[0.875rem] text-ink-tertiary">
              <Sparkle size={16} weight="fill" aria-hidden="true" className="mt-1 shrink-0 text-accent" />
              <span>{asked}</span>
            </p>

            {status === "not_configured" ? (
              <p role="status" className="mt-4 text-[0.9375rem] leading-[1.7] text-ink-secondary">
                {t.rich("notConfigured", {
                  link: (chunks) => (
                    <Link href="/kontakt" className="font-medium text-accent hover:text-accent-dim">
                      {chunks}
                    </Link>
                  ),
                })}
              </p>
            ) : status === "refusal" ? (
              <p role="status" className="mt-4 text-[0.9375rem] leading-[1.7] text-ink-secondary">
                {t("refusal")}
              </p>
            ) : status === "error" ? (
              <p role="status" className="mt-4 text-[0.9375rem] leading-[1.7] text-ink-secondary">
                {t("error")}
              </p>
            ) : (
              <>
                {answer && (
                  <p className="mt-4 whitespace-pre-wrap text-[1rem] leading-[1.75] text-ink-primary">
                    {answer}
                  </p>
                )}
                {busy && (
                  <p className="mt-4 flex items-center gap-2 text-[0.875rem] text-ink-tertiary">
                    <CircleNotch
                      size={16}
                      weight="bold"
                      aria-hidden="true"
                      className={reduce ? "" : "animate-spin"}
                    />
                    {t("thinking")}
                  </p>
                )}
                {citations.length > 0 && (
                  <div className="mt-6 border-t border-border-subtle pt-5">
                    <p className="text-[0.75rem] font-medium uppercase tracking-[0.08em] text-ink-tertiary">
                      {t("sourcesHeading")}
                    </p>
                    <ul className="mt-3 flex flex-col gap-3">
                      {citations.map((c, i) => (
                        <li key={`${c.context ?? c.title ?? i}`}>
                          {c.context ? (
                            <Link
                              href={c.context}
                              className="block rounded-lg border border-border-subtle p-3 transition-colors hover:border-border-soft hover:bg-bg-elevated"
                            >
                              <span className="block text-[0.875rem] font-medium text-accent">
                                {c.title ?? t("sourceFallback")}
                              </span>
                              <span className="mt-1 block text-[0.8125rem] leading-[1.6] text-ink-tertiary">
                                „{c.citedText}”
                              </span>
                            </Link>
                          ) : (
                            <div className="rounded-lg border border-border-subtle p-3">
                              <span className="block text-[0.875rem] font-medium text-ink-secondary">
                                {c.title ?? t("sourceFallback")}
                              </span>
                              <span className="mt-1 block text-[0.8125rem] leading-[1.6] text-ink-tertiary">
                                „{c.citedText}”
                              </span>
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {/* Pełna odpowiedź ogłaszana raz, po zakończeniu — czytnik ekranu
                    nie powtarza akapitu przy każdym tokenie. */}
                {status === "done" && (
                  <div role="status" aria-live="polite" className="sr-only">
                    {answer}
                  </div>
                )}
              </>
            )}

            <p className="mt-6 border-t border-border-subtle pt-4 text-[0.8125rem] leading-[1.6] text-ink-tertiary">
              {t("disclaimer")}
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
