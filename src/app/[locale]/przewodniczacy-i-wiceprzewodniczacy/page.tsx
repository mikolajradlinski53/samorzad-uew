import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { PrzewodniczacyContent } from "@/components/pages/PrzewodniczacyContent";

export const metadata: Metadata = {
  title: "Przewodniczący i Wiceprzewodniczący",
  description:
    "Kierownictwo Samorządu Studentów UEW — Przewodnicząca i Wiceprzewodniczący, ich obszary odpowiedzialności i kontakt.",
};

export default function PrzewodniczacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Samorząd"
        title="Przewodniczący i Wiceprzewodniczący"
        lead="Kierownictwo Samorządu Studentów — osoby, które tworzą strategię, podejmują najważniejsze decyzje i reprezentują studentów wobec Uczelni."
        breadcrumbs={[
          { label: "Strona główna", href: "/" },
          { label: "Samorząd", href: "/nasza-dzialalnosc" },
          { label: "Struktura", href: "/struktura-samorzadu" },
          { label: "Przewodniczący i Wiceprzewodniczący" },
        ]}
      />
      <PrzewodniczacyContent />
    </>
  );
}
