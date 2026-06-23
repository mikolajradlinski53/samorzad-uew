import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { DlaStudentaContent } from "@/components/pages/DlaStudentaContent";
import { ogMeta } from "@/lib/og";

export const metadata: Metadata = {
  title: "Strefa studenta",
  description:
    "Wszystkie najważniejsze informacje przydatne w codziennym życiu na Uniwersytecie Ekonomicznym we Wrocławiu — prawa studenta, stypendia, mapa kampusu, pomoc i szybkie linki.",
  ...ogMeta("Strefa studenta", "Dla studenta"),
};

export default function DlaStudentaPage() {
  return (
    <>
      <PageHero
        eyebrow="Strefa studenta"
        title="Wszystko, co musisz wiedzieć"
        lead="W tym miejscu znajdziesz wszystkie najważniejsze informacje, jakie mogą Ci się przydać w codziennym życiu na UEW."
        breadcrumbs={[
          { label: "Strona główna", href: "/" },
          { label: "Strefa studenta" },
        ]}
      />
      <DlaStudentaContent />
    </>
  );
}
