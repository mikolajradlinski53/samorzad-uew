import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/PageHero";
import { PartnerzyContent } from "@/components/pages/PartnerzyContent";
import { Faq, type QA } from "@/components/Faq";
import { ogMeta } from "@/lib/og";
import { formsConfigured } from "@/app/actions/formularze";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "partnerzy" });
  return {
    title: t("metaTitle"),
    description: t("metaDesc"),
    ...ogMeta(t("metaTitle"), t("ogLabel")),
  };
}

const FAQ_KEYS = ["start", "forms", "reach", "tailored"] as const;

export default async function PartnerzyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const formsReady = await formsConfigured();
  const t = await getTranslations({ locale, namespace: "partnerzy" });
  const tc = await getTranslations({ locale, namespace: "common" });

  const faq: QA[] = FAQ_KEYS.map((k) => ({
    q: t(`faq.${k}.q`),
    a: t(`faq.${k}.a`),
  }));

  return (
    <>
      <PageHero
        eyebrow={t("heroEyebrow")}
        title={t("heroTitle")}
        lead={t("heroLead")}
        breadcrumbs={[
          { label: tc("home"), href: "/" },
          { label: t("heroTitle") },
        ]}
      />
      <PartnerzyContent formsReady={formsReady} />
      <Faq items={faq} heading={t("faqHeading")} />
    </>
  );
}
