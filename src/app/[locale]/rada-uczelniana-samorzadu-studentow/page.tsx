import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { RUSSContent } from "@/components/pages/RUSSContent";

export const metadata: Metadata = {
  title: "Rada Uczelniana Samorządu Studentów",
  description:
    "RUSS — organ uchwałodawczy i opiniodawczy Samorządu Studentów UEW. 15 radnych reprezentuje postulaty studentów. Poznaj kompetencje i skład Rady.",
};

export default function RUSSPage() {
  return (
    <>
      <PageHero
        eyebrow="Samorząd Studentów"
        title="Rada Uczelniana Samorządu Studentów"
        lead="Uchwałodawczy głos studentów — RUSS opiniuje, decyduje i czuwa nad działaniem Samorządu."
        breadcrumbs={[
          { label: "Strona główna", href: "/" },
          { label: "Nasza działalność", href: "/nasza-dzialalnosc" },
          { label: "Rada Uczelniana (RUSS)" },
        ]}
      />
      <RUSSContent />
    </>
  );
}
