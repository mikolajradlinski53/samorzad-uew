import { Hero } from "@/components/Hero";
import { TrustBar } from "@/components/TrustBar";
import { EconTicker } from "@/components/EconTicker";
import { AudienceStrip } from "@/components/AudienceStrip";
import { About } from "@/components/About";
import { StudentLife } from "@/components/StudentLife";
import { Resources } from "@/components/Resources";
import { Projects } from "@/components/Projects";
import { NextEvent } from "@/components/NextEvent";

export default function Home() {
  return (
    <>
      {/*
        Kolejność opowiada historię: kim jesteśmy → dokąd Cię skierować →
        skąd się wzięliśmy → co robimy → co się dzieje →
        z czego skorzystasz → jak to wygląda. Ticker NBP zamyka stronę jako
        sygnaturowy pasek (uczelnia ekonomiczna), zamiast otwierać ją gadżetem.
        Zarząd (Prezydium + Członkowie) ma teraz osobną stronę /zarzad —
        nie duplikujemy go na stronie głównej.
      */}
      <Hero />
      <TrustBar />
      <AudienceStrip />
      <About />
      <Projects />
      <NextEvent />
      <Resources />
      <StudentLife />
      <EconTicker />
    </>
  );
}
