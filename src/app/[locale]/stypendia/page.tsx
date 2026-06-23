import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/PageHero";
import { StypendiaContent } from "@/components/pages/StypendiaContent";
import { Faq, type QA } from "@/components/Faq";
import { ogMeta } from "@/lib/og";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "stypendia" });
  return {
    title: t("metaTitle"),
    description: t("metaDesc"),
    ...ogMeta(t("metaTitle"), t("ogLabel")),
  };
}

const FAQ_KEYS = ["where", "when", "multiple", "firstTime", "diff"] as const;

export default async function StypendiaPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "stypendia" });
  const tc = await getTranslations({ locale, namespace: "common" });

  const faq: QA[] = FAQ_KEYS.map((k) => ({ q: t(`faq.${k}.q`), a: t(`faq.${k}.a`) }));

  return (
    <>
      <PageHero
        eyebrow={t("heroEyebrow")}
        title={t("heroTitle")}
        lead={t("heroLead")}
        breadcrumbs={[
          { label: tc("home"), href: "/" },
          { label: t("crumbStudent"), href: "/dla-studenta" },
          { label: t("heroTitle") },
        ]}
      />
      <StypendiaContent />
      <Faq items={faq} heading={t("faqHeading")} />
    </>
  );
}
