"use client";

import { motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function ConsentBanner({
  onAccept,
  onReject,
}: {
  onAccept: () => void;
  onReject: () => void;
}) {
  const t = useTranslations("consent");
  const reduce = useReducedMotion();

  return (
    <motion.div
      role="dialog"
      aria-label={t("aria")}
      initial={reduce ? false : { opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-4 bottom-4 z-[90] mx-auto max-w-[620px] rounded-2xl border border-border-soft bg-bg-surface p-5 shadow-xl shadow-black/15 sm:left-1/2 sm:right-auto sm:-translate-x-1/2"
    >
      <p className="text-[0.875rem] leading-[1.6] text-ink-secondary">
        {t("message")}{" "}
        <Link href="/prywatnosc" className="font-medium text-accent transition-colors hover:text-accent-dim">
          {t("more")}
        </Link>
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onAccept}
          className="inline-flex h-11 items-center rounded-lg bg-accent px-6 text-[0.875rem] font-medium text-bg-base transition-all hover:bg-accent-dim active:scale-[0.98]"
        >
          {t("accept")}
        </button>
        <button
          type="button"
          onClick={onReject}
          className="inline-flex h-11 items-center rounded-lg border border-border-medium px-6 text-[0.875rem] font-medium text-ink-primary transition-colors hover:border-border-soft hover:bg-bg-elevated"
        >
          {t("reject")}
        </button>
      </div>
    </motion.div>
  );
}
