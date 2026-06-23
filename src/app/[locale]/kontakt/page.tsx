import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { KontaktContent } from "@/components/pages/KontaktContent";
import { ogMeta } from "@/lib/og";

export const metadata: Metadata = {
  title: "Kontakt",
  description:
    "Skontaktuj się z Samorządem Studentów Uniwersytetu Ekonomicznego we Wrocławiu — formularz, e-mail, adres (ul. Kamienna 43) i media społecznościowe.",
  ...ogMeta("Kontakt", "Samorząd Studentów UEW"),
};

export default function KontaktPage() {
  return (
    <>
      <PageHero
        eyebrow="Kontakt"
        title="Napisz do nas"
        lead="Jesteśmy dla Was. Wybierz wygodną formę kontaktu — formularz, e-mail albo media społecznościowe."
        breadcrumbs={[
          { label: "Strona główna", href: "/" },
          { label: "Kontakt" },
        ]}
      />
      <KontaktContent />
    </>
  );
}
