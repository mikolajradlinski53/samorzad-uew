"use client";

import { useRef, type ReactNode } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";

const IMG_PADDING = 12;

/**
 * Zdjęcia idą przez `next/image`, a nie przez CSS `background-image`.
 *
 * Powód nie jest wyłącznie wydajnościowy. Tło CSS pobiera plik w oryginalnym
 * rozmiarze (te kadry mają 2400–2560 px szerokości — na telefonie 375 px to
 * było 774 KB zamiast kilkudziesięciu) i robi to **bezpośrednio z serwera
 * zewnętrznego**, więc adres IP każdego odwiedzającego trafiał do dostawcy
 * zdjęć. Przez `next/image` plik pobiera nasz serwer, przeglądarka studenta
 * łączy się tylko z nami, a obraz dostaje rozmiar i format pod konkretny ekran.
 *
 * `sizes="100vw"`, bo kadr jest pełnoekranowy.
 */

interface TextParallaxContentProps {
  imgUrl: string;
  subheading: string;
  heading: string;
  children: ReactNode;
}

export function TextParallaxContent({
  imgUrl,
  subheading,
  heading,
  children,
}: TextParallaxContentProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    // Static, accessible fallback — no sticky/parallax.
    return (
      <div style={{ paddingLeft: IMG_PADDING, paddingRight: IMG_PADDING }}>
        <div className="relative flex min-h-[60vh] items-center justify-center overflow-hidden rounded-3xl text-center text-white">
          <Image
            src={imgUrl}
            alt=""
            aria-hidden="true"
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[#05070C]/65" aria-hidden="true" />
          <div className="relative z-10 px-6">
            <p className="mb-2 text-xl md:text-2xl">{subheading}</p>
            <p className="font-display text-4xl font-semibold tracking-[-0.02em] md:text-6xl">
              {heading}
            </p>
          </div>
        </div>
        {children}
      </div>
    );
  }

  return (
    <div style={{ paddingLeft: IMG_PADDING, paddingRight: IMG_PADDING }}>
      <div className="relative h-[150vh]">
        <StickyImage imgUrl={imgUrl} />
        <OverlayCopy heading={heading} subheading={subheading} />
      </div>
      {children}
    </div>
  );
}

function StickyImage({ imgUrl }: { imgUrl: string }) {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["end end", "end start"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.85]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <motion.div
      ref={targetRef}
      style={{
        height: `calc(100vh - ${IMG_PADDING * 2}px)`,
        top: IMG_PADDING,
        scale,
      }}
      className="sticky z-0 overflow-hidden rounded-3xl"
    >
      <Image src={imgUrl} alt="" aria-hidden="true" fill sizes="100vw" className="object-cover" />
      <motion.div className="absolute inset-0 bg-[#05070C]/70" style={{ opacity }} />
    </motion.div>
  );
}

function OverlayCopy({
  subheading,
  heading,
}: {
  subheading: string;
  heading: string;
}) {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [250, -250]);
  const opacity = useTransform(scrollYProgress, [0.25, 0.5, 0.75], [0, 1, 0]);

  return (
    <motion.div
      ref={targetRef}
      style={{ y, opacity }}
      className="absolute left-0 top-0 flex h-screen w-full flex-col items-center justify-center px-6 text-white"
    >
      <p className="mb-3 text-center text-[0.75rem] font-medium uppercase tracking-[0.18em] text-blue-300">
        {subheading}
      </p>
      <p className="sm:max-w-[20ch] text-center font-display text-[clamp(2.5rem,6vw,5rem)] font-semibold leading-[1.05] tracking-[-0.02em]">
        {heading}
      </p>
    </motion.div>
  );
}
