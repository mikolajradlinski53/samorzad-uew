"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { MagnifyingGlass, ArrowRight } from "@phosphor-icons/react";
import { searchPages, highlightSegments } from "@/lib/searchIndex";

interface SearchCommandProps {
  open: boolean;
  onClose: () => void;
}

export function SearchCommand({ open, onClose }: SearchCommandProps) {
  const router = useRouter();
  const reduce = useReducedMotion();
  const t = useTranslations("ui.search");
  const locale = useLocale();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const results = useMemo(() => searchPages(query, locale), [query, locale]);

  // Focus input + lock body scroll while open; restore focus on close.
  useEffect(() => {
    if (!open) return;
    const prevFocused = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => inputRef.current?.focus(), 0);
    return () => {
      clearTimeout(t);
      document.body.style.overflow = "";
      prevFocused?.focus();
    };
  }, [open]);

  // Reset state on close (query only changes via onChange, which also resets
  // active to 0 — so the active index never goes out of range).
  const close = () => {
    setQuery("");
    setActive(0);
    onClose();
  };

  const go = (href: string) => {
    close();
    router.push(href);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      close();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = results[active];
      if (item) go(item.href);
    }
  };

  // Keep the active option scrolled into view.
  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`#search-opt-${active}`);
    el?.scrollIntoView({ block: "nearest" });
  }, [active]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[12vh]"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          {/* Scrim */}
          <button
            type="button"
            aria-label={t("close")}
            onClick={close}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={t("dialog")}
            initial={reduce ? false : { opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            onKeyDown={onKeyDown}
            className="relative z-10 w-full max-w-[560px] overflow-hidden rounded-2xl border border-border-soft bg-bg-surface shadow-2xl shadow-black/20"
          >
            {/* Input row */}
            <div className="flex items-center gap-3 border-b border-border-subtle px-5">
              <MagnifyingGlass size={20} weight="regular" aria-hidden="true" className="shrink-0 text-ink-tertiary" />
              <input
                ref={inputRef}
                type="text"
                role="combobox"
                aria-expanded="true"
                aria-controls="search-listbox"
                aria-activedescendant={results[active] ? `search-opt-${active}` : undefined}
                aria-label={t("inputLabel")}
                placeholder={t("placeholder")}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActive(0);
                }}
                className="h-14 w-full bg-transparent text-[1rem] text-ink-primary placeholder:text-ink-tertiary focus:outline-none"
              />
              <kbd className="hidden shrink-0 rounded border border-border-medium px-1.5 py-0.5 text-[0.6875rem] font-medium text-ink-tertiary sm:block">
                ESC
              </kbd>
            </div>

            {/* Results */}
            {results.length === 0 ? (
              <p className="px-5 py-10 text-center text-[0.9375rem] text-ink-secondary">
                {t("noResults", { query })}
              </p>
            ) : (
              <ul
                ref={listRef}
                id="search-listbox"
                role="listbox"
                aria-label={t("resultsLabel")}
                className="max-h-[50vh] overflow-y-auto p-2"
              >
                {results.map((item, i) => {
                  const isActive = i === active;
                  const showGroup = i === 0 || results[i - 1].group !== item.group;
                  return (
                    <li key={item.href}>
                      {showGroup && (
                        <p className="px-3 pb-1 pt-3 text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-ink-tertiary">
                          {item.group}
                        </p>
                      )}
                      <button
                        type="button"
                        id={`search-opt-${i}`}
                        role="option"
                        aria-selected={isActive}
                        onClick={() => go(item.href)}
                        onMouseMove={() => setActive(i)}
                        className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${
                          isActive ? "bg-bg-elevated text-ink-primary" : "text-ink-secondary"
                        }`}
                      >
                        <span className="text-[0.9375rem]">
                          {highlightSegments(item.label, query).map((seg, k) =>
                            seg.hit ? (
                              <mark key={k} className="bg-transparent font-semibold text-accent">
                                {seg.text}
                              </mark>
                            ) : (
                              <span key={k}>{seg.text}</span>
                            ),
                          )}
                        </span>
                        <ArrowRight
                          size={16}
                          weight="bold"
                          aria-hidden="true"
                          className={`shrink-0 transition-opacity ${isActive ? "text-accent opacity-100" : "opacity-0"}`}
                        />
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}

            {query.trim() && results.length > 0 && (
              <button
                type="button"
                onClick={() => go(`/szukaj?q=${encodeURIComponent(query.trim())}`)}
                className="flex w-full items-center justify-center gap-1.5 border-t border-border-subtle px-5 py-3 text-[0.8125rem] font-medium text-ink-secondary transition-colors hover:bg-bg-elevated hover:text-accent"
              >
                {t("showAll", { query: query.trim() })}
                <ArrowRight size={14} weight="bold" aria-hidden="true" />
              </button>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
