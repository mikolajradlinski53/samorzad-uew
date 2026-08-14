import { Outfit } from "next/font/google";
import { EconTicker } from "@/components/EconTicker";
import { HomeExperience } from "@/components/home/HomeExperience";

const outfit = Outfit({
  subsets: ["latin", "latin-ext"],
  variable: "--font-home",
  display: "swap",
});

export default function Home() {
  return (
    <main id="main-content" tabIndex={-1} className={outfit.variable}>
      <HomeExperience />
      <EconTicker />
    </main>
  );
}
