"use client";

import { useEffect, useState } from "react";

/**
 * Etykietowany spis sekcji dla długich hubów (scroll-spy). Reużywa wzorca
 * IntersectionObserver z SectionRail, ale pokazuje etykiety zamiast §N i ma
 * wariant mobilny (przyklejony pasek chipów). SectionRail (§) zostaje osobno.
 */
export function HubNav({
  items,
  label,
}: {
  items: { id: string; label: string }[];
  label: string;
}) {
  const [active, setActive] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-30% 0px -55% 0px" },
    );
    items.forEach((it) => {
      const el = document.getElementById(it.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [items]);

  const go = (id: string) => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById(id)?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  };

  return (
    <>
      {/* Desktop (xl): floating sticky left index */}
      <nav
        aria-label={label}
        className="fixed left-6 top-1/2 z-30 hidden max-w-[200px] -translate-y-1/2 flex-col gap-1 xl:flex"
      >
        {items.map((it) => (
          <button
            key={it.id}
            type="button"
            onClick={() => go(it.id)}
            aria-current={active === it.id ? "true" : undefined}
            className={`group flex items-center gap-2.5 py-1 text-left font-mono text-[0.75rem] uppercase tracking-[0.06em] transition-colors ${
              active === it.id ? "text-accent" : "text-ink-tertiary hover:text-ink-secondary"
            }`}
          >
            <span
              aria-hidden="true"
              className={`h-px shrink-0 rounded-full transition-all duration-300 ${
                active === it.id ? "w-7 bg-accent" : "w-3.5 bg-border-medium group-hover:w-5"
              }`}
            />
            {it.label}
          </button>
        ))}
      </nav>

      {/* Mobile/tablet (< xl): sticky top chip bar, under the 72px header */}
      <nav
        aria-label={label}
        className="sticky top-[72px] z-30 -mx-6 mb-4 overflow-x-auto border-b border-border-subtle bg-bg-base/90 px-6 py-3 backdrop-blur xl:hidden"
      >
        <ul className="flex gap-2 whitespace-nowrap">
          {items.map((it) => (
            <li key={it.id}>
              <button
                type="button"
                onClick={() => go(it.id)}
                aria-current={active === it.id ? "true" : undefined}
                className={`rounded-full border px-3 py-1.5 text-[0.8125rem] font-medium transition-colors ${
                  active === it.id
                    ? "border-accent text-accent"
                    : "border-border-medium text-ink-secondary hover:text-ink-primary"
                }`}
              >
                {it.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
