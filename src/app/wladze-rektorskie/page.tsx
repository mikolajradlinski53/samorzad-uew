import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { WladzeRektorskieContent } from "@/components/pages/WladzeRektorskieContent";

export const metadata: Metadata = {
  title: "Władze rektorskie",
  description:
    "Rektor i prorektorzy Uniwersytetu Ekonomicznego we Wrocławiu — kto kieruje Uczelnią i odpowiada za sprawy studenckie, kształcenie, naukę i finanse.",
};

export default function WladzeRektorskiePage() {
  return (
    <>
      <PageHero
        eyebrow="Strefa studenta"
        title="Władze rektorskie"
        lead="Rektor i prorektorzy Uniwersytetu Ekonomicznego we Wrocławiu — osoby kierujące Uczelnią i odpowiadające za najważniejsze obszary jej działania."
        breadcrumbs={[
          { label: "Strona główna", href: "/" },
          { label: "Strefa studenta", href: "/dla-studenta" },
          { label: "Władze rektorskie" },
        ]}
      />
      <WladzeRektorskieContent />
    </>
  );
}
