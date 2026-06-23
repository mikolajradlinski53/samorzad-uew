import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { InfopackiContent } from "@/components/pages/InfopackiContent";

export const metadata: Metadata = {
  title: "Infopacki dla studentów",
  description:
    "Praktyczne przewodniki dla studentów UEW: USOS, Regulamin Studiów, zaliczenie semestru, podania, biblioteka, dyplomowanie i więcej.",
};

export default function InfopackiPage() {
  return (
    <>
      <PageHero
        eyebrow="Strefa studenta"
        title="Infopacki"
        lead="Krótkie, konkretne przewodniki po najważniejszych sprawach studenckich — od USOS-a po proces dyplomowania."
        breadcrumbs={[
          { label: "Strona główna", href: "/" },
          { label: "Strefa studenta", href: "/dla-studenta" },
          { label: "Infopacki" },
        ]}
      />
      <InfopackiContent />
    </>
  );
}
