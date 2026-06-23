import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { ZarzadzeniaContent } from "@/components/pages/ZarzadzeniaContent";

export const metadata: Metadata = {
  title: "Zarządzenia Przewodniczącej",
  description:
    "Zarządzenia Przewodniczącej Samorządu Studentów UEW — akty wykonawcze z aktualnej kadencji oraz dostęp do dokumentów archiwalnych.",
};

export default function ZarzadzeniaPage() {
  return (
    <>
      <PageHero
        eyebrow="Samorząd"
        title="Zarządzenia Przewodniczącej"
        lead="Akty wykonawcze porządkujące bieżącą działalność Samorządu Studentów. Tutaj znajdziesz komplet zarządzeń z aktualnej kadencji."
        breadcrumbs={[
          { label: "Strona główna", href: "/" },
          { label: "Samorząd", href: "/nasza-dzialalnosc" },
          { label: "Zarządzenia Przewodniczącej" },
        ]}
      />
      <ZarzadzeniaContent />
    </>
  );
}
