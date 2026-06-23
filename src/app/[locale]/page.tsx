import { Hero } from "@/components/Hero";
import { TrustBar } from "@/components/TrustBar";
import { EconTicker } from "@/components/EconTicker";
import { AudienceStrip } from "@/components/AudienceStrip";
import { About } from "@/components/About";
import { StudentLife } from "@/components/StudentLife";
import { Resources } from "@/components/Resources";
import { Projects } from "@/components/Projects";
import { NextEvent } from "@/components/NextEvent";
import { Board } from "@/components/Board";

export default function Home() {
  return (
    <>
      <Hero />
      <TrustBar />
      <EconTicker />
      <AudienceStrip />
      <About />
      <Resources />
      <Projects />
      <NextEvent />
      <StudentLife />
      <Board />
    </>
  );
}
