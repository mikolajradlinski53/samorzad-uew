"use client";

import type { RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Choreografia przewijania strony głównej — WYŁĄCZNIE dla dużych ekranów.
 *
 * Dlaczego osobny plik: `gsap` razem z `ScrollTrigger` to ok. 128 KB kodu.
 * Dopóki siedziały w `HomeExperience`, pobierał je każdy telefon — mimo że
 * te efekty i tak włączają się dopiero od 900 px. Zmierzone: strona główna
 * ważyła na telefonie prawie tyle samo co na desktopie.
 *
 * Teraz `HomeExperience` ładuje ten moduł dynamicznie i dopiero wtedy, gdy
 * ekran naprawdę spełnia warunek. Na telefonie ten kod nie jest pobierany
 * w ogóle, a efekty na desktopie zostają bez zmian.
 *
 * Animacje jednorazowe (odsłonięcie kadru w hero, przejście między
 * sytuacjami) NIE są tutaj — działają na każdym ekranie, więc zrobiliśmy je
 * w CSS, żeby nie ciągnąć biblioteki dla dwóch tweenów.
 */
export default function HomeMotion({ scope }: { scope: RefObject<HTMLDivElement | null> }) {
  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add("(min-width: 900px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.to("[data-hero-media]", {
          yPercent: 4,
          scale: 1.03,
          ease: "none",
          scrollTrigger: {
            trigger: "[data-hero]",
            start: "top top",
            end: "bottom top",
            scrub: 0.8,
          },
        });

        const words = gsap.utils.toArray<HTMLElement>("[data-manifest-word]");
        gsap.set(words, { color: "#9aa8bc" });
        gsap.to(words, {
          color: "#102743",
          stagger: 0.12,
          ease: "none",
          scrollTrigger: {
            trigger: "[data-manifest]",
            start: "top top+=72",
            end: "+=115%",
            pin: true,
            scrub: 0.7,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        gsap.to("[data-manifest-media]", {
          yPercent: -4,
          scale: 1.04,
          ease: "none",
          scrollTrigger: {
            trigger: "[data-manifest]",
            start: "top top+=72",
            end: "+=115%",
            scrub: 0.9,
          },
        });

        gsap.utils.toArray<HTMLElement>("[data-archive-panel]").forEach((panel) => {
          const image = panel.querySelector<HTMLElement>("[data-archive-media]");
          if (!image) return;
          gsap.fromTo(
            image,
            { yPercent: -7, scale: 1.08 },
            {
              yPercent: 7,
              scale: 1.08,
              ease: "none",
              scrollTrigger: {
                trigger: panel,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.8,
              },
            },
          );
        });
      });

      return () => media.revert();
    },
    { scope },
  );

  return null;
}
