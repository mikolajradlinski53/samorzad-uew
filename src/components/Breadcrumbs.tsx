import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { CaretRight } from "@phosphor-icons/react";

const SITE_URL = "https://samorzad.ue.wroc.pl";

export interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const t = useTranslations("ui.aria");
  // BreadcrumbList structured data → breadcrumb rich result in Google.
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      ...(c.href ? { item: `${SITE_URL}${c.href === "/" ? "" : c.href}` } : {}),
    })),
  };

  return (
    <nav aria-label={t("breadcrumb")}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <ol className="flex flex-wrap items-center gap-2 text-[0.8125rem] text-ink-secondary">
        {items.map((c, i) => {
          const last = i === items.length - 1;
          return (
            <li key={`${c.label}-${i}`} className="flex items-center gap-2">
              {c.href && !last ? (
                <Link
                  href={c.href}
                  className="transition-colors hover:text-ink-primary"
                >
                  {c.label}
                </Link>
              ) : (
                <span
                  aria-current={last ? "page" : undefined}
                  className={last ? "text-ink-primary" : undefined}
                >
                  {c.label}
                </span>
              )}
              {!last && (
                <CaretRight
                  size={13}
                  weight="bold"
                  aria-hidden="true"
                  className="text-ink-tertiary"
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
