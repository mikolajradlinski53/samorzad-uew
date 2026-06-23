"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Link } from "@/i18n/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { CaretDown, ArrowSquareOut } from "@phosphor-icons/react";

export interface NavChild {
  label: string;
  href: string;
  external?: boolean;
}

interface NavDropdownProps {
  label: string;
  items: NavChild[];
  active: boolean;
}

export function NavDropdown({ label, items, active }: NavDropdownProps) {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const wrapRef = useRef<HTMLLIElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const panelId = useId();

  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  };

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        btnRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <li
      ref={wrapRef}
      className="relative"
      onMouseEnter={() => {
        cancelClose();
        setOpen(true);
      }}
      onMouseLeave={scheduleClose}
      onBlur={(e) => {
        if (!wrapRef.current?.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <button
        ref={btnRef}
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className={`inline-flex items-center gap-1 py-1 text-[0.75rem] font-medium uppercase tracking-[0.08em] transition-colors ${
          active ? "text-accent" : "text-ink-secondary hover:text-ink-primary"
        }`}
      >
        {label}
        <CaretDown
          size={12}
          weight="bold"
          aria-hidden="true"
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {active && (
        <span
          aria-hidden="true"
          className="absolute -bottom-1 left-0 right-4 h-[2px] rounded-full bg-accent"
        />
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            id={panelId}
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-0 top-full z-50 mt-3 w-64 rounded-xl border border-border-soft bg-bg-surface p-2 shadow-xl shadow-black/10"
          >
            <ul className="flex flex-col">
              {items.map((item) => (
                <li key={item.href}>
                  {item.external ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-[0.875rem] text-ink-secondary transition-colors hover:bg-bg-elevated hover:text-ink-primary"
                    >
                      {item.label}
                      <ArrowSquareOut
                        size={14}
                        weight="regular"
                        aria-hidden="true"
                        className="shrink-0 text-ink-tertiary"
                      />
                    </a>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="block rounded-lg px-3 py-2.5 text-[0.875rem] text-ink-secondary transition-colors hover:bg-bg-elevated hover:text-ink-primary"
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}
