import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { StypendiaContent } from "@/components/pages/StypendiaContent";
import { Faq, type QA } from "@/components/Faq";
import { ogMeta } from "@/lib/og";

const faq: QA[] = [
  {
    q: "Gdzie złożę wniosek o stypendium?",
    a: "Wniosek o każde świadczenie wydrukujesz na swoim koncie studenta w systemie USOSweb. Podpisany wniosek wraz z wymaganą dokumentacją składasz w Dziale Obsługi Studenta.",
  },
  {
    q: "Kiedy zostanie wypłacone stypendium?",
    a: "Warunkiem wypłaty jest odebranie decyzji w systemie USOSweb. Powiadomienia o decyzji trafiają na Twój uczelniany adres e-mail.",
  },
  {
    q: "Czy mogę pobierać kilka świadczeń jednocześnie?",
    a: "Tak. Na przykład stypendium dla osób z niepełnosprawnością jest niezależne od dochodu i można je łączyć z innymi świadczeniami. Szczegóły określa regulamin świadczeń stypendialnych.",
  },
  {
    q: "Składam wniosek o stypendium socjalne po raz pierwszy — o czym pamiętać?",
    a: "Dołącz oświadczenie o dochodach oraz pełną dokumentację potwierdzającą dochody rodziny. Jeśli masz uczące się pełnoletnie rodzeństwo, dołącz aktualne zaświadczenie o kontynuacji nauki.",
  },
  {
    q: "Czym różni się zapomoga od stypendium socjalnego?",
    a: "Zapomoga to jednorazowa pomoc w nagłej, przejściowo trudnej sytuacji losowej, przyznawana niezależnie od stypendium socjalnego.",
  },
];

export const metadata: Metadata = {
  title: "Stypendia i wsparcie finansowe",
  description:
    "Stypendia socjalne, rektora, dla osób z niepełnosprawnością oraz zapomogi na Uniwersytecie Ekonomicznym we Wrocławiu. Dokumenty, terminy i odnośniki.",
  ...ogMeta("Stypendia i wsparcie finansowe", "Strefa studenta"),
};

export default function StypendiaPage() {
  return (
    <>
      <PageHero
        eyebrow="Strefa studenta"
        title="Stypendia i wsparcie finansowe"
        lead="Tu znajdziesz kluczowe informacje o stypendiach i świadczeniach oraz wszystkie niezbędne dokumenty — w jednym miejscu."
        breadcrumbs={[
          { label: "Strona główna", href: "/" },
          { label: "Strefa studenta", href: "/dla-studenta" },
          { label: "Stypendia" },
        ]}
      />
      <StypendiaContent />
      <Faq items={faq} heading="Stypendia — najczęstsze pytania" />
    </>
  );
}
