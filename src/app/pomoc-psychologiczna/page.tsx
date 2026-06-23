import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { PomocPsychologicznaContent } from "@/components/pages/PomocPsychologicznaContent";

export const metadata: Metadata = {
  title: "Pomoc psychologiczna",
  description:
    "Potrzebujesz wsparcia? Zebraliśmy formy pomocy psychologicznej dostępne na UEW i we Wrocławiu oraz telefony zaufania. Nie musisz radzić sobie sam.",
};

export default function PomocPsychologicznaPage() {
  return (
    <>
      <PageHero
        eyebrow="Strefa studenta"
        title="Pomoc psychologiczna"
        lead="Twoje samopoczucie jest ważne. Zebraliśmy w jednym miejscu sprawdzone formy wsparcia — na uczelni i poza nią."
        breadcrumbs={[
          { label: "Strona główna", href: "/" },
          { label: "Strefa studenta", href: "/dla-studenta" },
          { label: "Pomoc psychologiczna" },
        ]}
      />
      <PomocPsychologicznaContent />
    </>
  );
}
