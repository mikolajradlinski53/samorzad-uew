import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { NaszaDzialalnoscContent } from "@/components/pages/NaszaDzialalnoscContent";
import { ogMeta } from "@/lib/og";

export const metadata: Metadata = {
  title: "Nasza działalność",
  description:
    "Działamy na rzecz studentów, wspieramy w walce o prawa studenckie i inspirujemy do nowych inicjatyw. Poznaj misję Samorządu Studentów UEW.",
  ...ogMeta("Nasza działalność", "Samorząd"),
};

export default function NaszaDzialalnoscPage() {
  return (
    <>
      <PageHero
        eyebrow="Samorząd Studentów"
        title="Nasza działalność"
        lead="Działamy na rzecz studentów, wspieramy Was w walce o prawa studenckie oraz inspirujemy do podejmowania nowych inicjatyw."
        breadcrumbs={[
          { label: "Strona główna", href: "/" },
          { label: "Nasza działalność" },
        ]}
      />
      <NaszaDzialalnoscContent />
    </>
  );
}
