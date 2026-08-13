"use client";

import { useLocale } from "next-intl";

interface CountUpProps {
  to: number;
  suffix?: string;
  className?: string;
}

export function CountUp({
  to,
  suffix = "",
  className,
}: CountUpProps) {
  const locale = useLocale();
  const formatter = new Intl.NumberFormat(locale === "en" ? "en-GB" : "pl-PL");

  return (
    <span className={className}>
      {formatter.format(to)}
      {suffix}
    </span>
  );
}
