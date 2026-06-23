import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { RegulacjeContent } from "@/components/pages/RegulacjeContent";

export const metadata: Metadata = {
  title: "Regulacje wewnętrzne",
  description:
    "Najważniejsze dokumenty, na podstawie których funkcjonuje Samorząd Studentów UEW — regulaminy, ordynacja wyborcza i identyfikacja wizualna.",
};

export default function RegulacjePage() {
  return (
    <>
      <PageHero
        eyebrow="Samorząd Studentów"
        title="Regulacje wewnętrzne"
        lead="Przejrzyście i w jednym miejscu — dokumenty, które porządkują działanie Samorządu."
        breadcrumbs={[
          { label: "Strona główna", href: "/" },
          { label: "Nasza działalność", href: "/nasza-dzialalnosc" },
          { label: "Regulacje wewnętrzne" },
        ]}
      />
      <RegulacjeContent />
    </>
  );
}
