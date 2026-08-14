"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { ArrowRight, ArrowUpRight } from "@phosphor-icons/react";
import { Link } from "@/i18n/navigation";
import { projectPhotos } from "@/lib/photos";

const highlighted = [
  { key: "adapciak", name: "Adapciak", type: "start", layout: "md:col-span-7 md:row-span-2" },
  { key: "bal", name: "Bal UEW", type: "community", layout: "md:col-span-5" },
  { key: "dni", name: "Dni Adaptacyjne", type: "learning", layout: "md:col-span-5" },
] as const;

const projectIndex = [
  "Adapciak",
  "Animalia",
  "Bal UEW",
  "Dni Adaptacyjne",
  "GradUEtion",
  "Mosty Ekonomiczne",
  "Test Wiedzy Ekonomicznej",
  "TEDxUEW",
  "UE Party",
];

export function Projects() {
  const t = useTranslations("projects");
  const tp = useTranslations("naszeProjekty");

  return (
    <section id="projekty" aria-labelledby="projekty-heading" className="section-padding bg-[#091a3d] text-white">
      <div className="mx-auto max-w-[1200px]">
        <div className="grid gap-7 border-b border-white/18 pb-10 md:grid-cols-[minmax(0,1fr)_minmax(260px,0.45fr)] md:items-end md:gap-16">
          <div>
            <p className="font-mono text-[0.6875rem] font-semibold uppercase tracking-[0.13em] text-[#9fb1ff]">
              {t("eyebrow")}
            </p>
            <h2
              id="projekty-heading"
              className="mt-4 max-w-[17ch] text-balance font-display text-[clamp(2.4rem,5.4vw,5rem)] font-semibold leading-[0.94] tracking-[-0.04em] text-white"
            >
              {t("heading")}
            </h2>
          </div>
          <div>
            <p className="max-w-[46ch] text-pretty text-[0.9375rem] leading-[1.7] text-white/72">
              {t("intro")}
            </p>
            <Link
              href="/nasze-projekty"
              className="mt-5 inline-flex items-center gap-2 text-[0.875rem] font-semibold text-[#9fb1ff] transition-colors hover:text-white"
            >
              {t("all")}
              <ArrowUpRight size={18} weight="bold" aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div className="mt-10 grid gap-3 md:grid-cols-12 md:grid-rows-2">
          {highlighted.map((project, index) => {
            const image = projectPhotos(project.key)[0];
            return (
              <article key={project.key} className={`home-project group relative min-h-[340px] overflow-hidden bg-[#112754] ${project.layout} ${index === 0 ? "md:min-h-[720px]" : "md:min-h-[354px]"}`}>
                {image ? (
                  <Image
                    src={image}
                    alt={t("archiveAlt")}
                    fill
                    sizes={index === 0 ? "(max-width: 768px) 100vw, 58vw" : "(max-width: 768px) 100vw, 42vw"}
                    className={`home-project-image object-cover ${project.key === "dni" ? "object-[50%_42%]" : "object-center"}`}
                  />
                ) : null}
                <div className="home-project-shade absolute inset-0" aria-hidden="true" />
                <div className="relative z-10 flex h-full min-h-[340px] flex-col justify-between p-6 sm:p-8 md:min-h-[inherit]">
                  <div className="flex items-center justify-between gap-4 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-white/76">
                    <span>{tp(`types.${project.type}`)}</span>
                    <span>{String(index + 1).padStart(2, "0")} / 09</span>
                  </div>
                  <div>
                    <p className="max-w-[48ch] text-[0.8125rem] leading-[1.6] text-white/76">
                      {tp(`projects.${project.key}.signature`)}
                    </p>
                    <div className="mt-3 flex items-end justify-between gap-5 border-t border-white/28 pt-4">
                      <h3 className="max-w-[10ch] text-balance font-display text-[clamp(2rem,4.5vw,4.25rem)] font-semibold leading-[0.92] tracking-[-0.04em] text-white">
                        {project.name}
                      </h3>
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-white/45 text-white transition-colors group-hover:border-white group-hover:bg-white group-hover:text-[#091a3d]">
                        <ArrowRight size={19} weight="bold" aria-hidden="true" />
                      </span>
                    </div>
                  </div>
                </div>
                <Link
                  href={`/nasze-projekty#projekt-${project.key}`}
                  aria-label={t("explore", { project: project.name })}
                  className="absolute inset-0 z-20"
                />
              </article>
            );
          })}
        </div>

        <p className="mt-3 text-right font-mono text-[0.625rem] uppercase tracking-[0.11em] text-white/52">
          {t("archive")}
        </p>

        <div
          className="mt-12 overflow-x-auto border-y border-white/18 py-5"
          aria-label={t("indexLabel")}
          tabIndex={0}
        >
          <ol className="flex min-w-max items-center gap-5 pr-5 font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-white/66">
            {projectIndex.map((name, index) => (
              <li key={name} className="flex items-center gap-5">
                <span className="text-[#9fb1ff]">{String(index + 1).padStart(2, "0")}</span>
                <span>{name}</span>
                {index < projectIndex.length - 1 ? <span className="h-1 w-1 bg-white/38" aria-hidden="true" /> : null}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
