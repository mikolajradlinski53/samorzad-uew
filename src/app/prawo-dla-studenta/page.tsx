import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { PrawoContent } from "@/components/pages/PrawoContent";

export const metadata: Metadata = {
  title: "Prawo dla studenta",
  description:
    "Najważniejsze przepisy prawne UEW w jednym miejscu — ustawa, statut, regulamin studiów, zarządzenia i regulacje uczelniane.",
};

export default function PrawoPage() {
  return (
    <>
      <PageHero
        eyebrow="Strefa studenta"
        title="Prawo dla studenta"
        lead="Przepisy bywają zawiłe — zebraliśmy najważniejsze akty prawne, które obowiązują na UEW, w jednym miejscu."
        breadcrumbs={[
          { label: "Strona główna", href: "/" },
          { label: "Strefa studenta", href: "/dla-studenta" },
          { label: "Prawo dla studenta" },
        ]}
      />
      <PrawoContent />
    </>
  );
}
