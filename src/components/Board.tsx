"use client";

import { motion, useReducedMotion } from "motion/react";
import { ScrollReveal } from "./ScrollReveal";
import { boardPhotos } from "@/lib/photos";
import { PersonCard } from "./PersonCard";

const members = [
  { name: "Mikołaj Kowalski", role: "Przewodniczący", seed: "mikolaj" },
  { name: "Anna Nowak", role: "Wiceprzewodnicząca", seed: "anna" },
  { name: "Piotr Wiśniewski", role: "Sekretarz", seed: "piotr" },
  { name: "Katarzyna Lewandowska", role: "Skarbnik", seed: "katarzyna" },
  { name: "Tomasz Wójcik", role: "Członek Zarządu", seed: "tomasz" },
];

export function Board() {
  const reduce = useReducedMotion();

  return (
    <section
      id="zarzad"
      aria-labelledby="zarzad-heading"
      className="section-padding"
    >
      <div className="mx-auto max-w-[1200px]">
        {/* Eyebrow - one of max 2 on the entire page */}
        <ScrollReveal>
          <p className="text-[0.75rem] font-medium uppercase tracking-[0.08em] text-accent">
            Zarząd Samorządu
          </p>
          <h2
            id="zarzad-heading"
            className="mt-3 font-display text-[clamp(2.5rem,5vw,4rem)] font-semibold leading-[1.1] tracking-[-0.02em] text-ink-primary"
          >
            Poznaj nasz zespół
          </h2>
        </ScrollReveal>

        {/* Legitymacje Zarządu */}
        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {members.map((member, i) => (
            <motion.div
              key={member.name}
              initial={reduce ? false : { opacity: 0, y: 20 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.6, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="h-full"
            >
              <PersonCard
                name={member.name}
                role={member.role}
                photo={boardPhotos[i]}
                no={i + 1}
                org="Zarząd Samorządu"
                className="h-full"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
