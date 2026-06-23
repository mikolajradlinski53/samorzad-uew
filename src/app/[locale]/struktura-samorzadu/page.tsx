import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { StrukturaContent } from "@/components/pages/StrukturaContent";

export const metadata: Metadata = {
  title: "Struktura Samorządu",
  description:
    "Jak zbudowany jest Samorząd Studentów UEW — Przewodniczący, Zarząd, Rada Uczelniana, Komisja Rewizyjna i Studencka Komisja Wyborcza.",
};

export default function StrukturaPage() {
  return (
    <>
      <PageHero
        eyebrow="Samorząd Studentów"
        title="Struktura Samorządu"
        lead="Poznaj organy Samorządu i to, kto za co odpowiada — od strategii po nadzór nad wyborami."
        breadcrumbs={[
          { label: "Strona główna", href: "/" },
          { label: "Nasza działalność", href: "/nasza-dzialalnosc" },
          { label: "Struktura Samorządu" },
        ]}
      />
      <StrukturaContent />
    </>
  );
}
