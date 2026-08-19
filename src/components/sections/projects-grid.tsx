"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowUpRight, ExternalLink, Code } from "lucide-react";

import { useDictionary } from "@/components/layout/dictionary-provider";
import { Badge } from "@/components/ui/badge";
import { Spotlight } from "@/components/ui/spotlight";
import { cn } from "@/lib/utils";

/**
 * A project with every `{ ko, en }` field already resolved to a string.
 *
 * The section is a Server Component and this grid is a Client Component, so the
 * boundary has to be crossed with plain serializable data. Resolving the
 * localized fields server-side also keeps the other language's strings out of
 * the client bundle.
 */
export type ResolvedProject = {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  yearLabel: string;
  role: string;
  stack: string[];
  tags: string[];
  featured: boolean;
  /** Case-study URL, or `null` when the project has no write-up. */
  href: string | null;
  live?: string;
  source?: string;
  accent: [string, string];
};

export type FilterOption = { id: string; label: string };

export function ProjectsGrid({
  projects,
  filters,
  className,
}: {
  projects: ResolvedProject[];
  /** Tag filters, excluding "all" — that one is prepended here. */
  filters: FilterOption[];
  className?: string;
}) {
  const dict = useDictionary();
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState<string>("all");

  const visible = useMemo(
    () =>
      active === "all"
        ? projects
        : projects.filter((project) => project.tags.includes(active)),
    [projects, active],
  );

  const options: FilterOption[] = [
    { id: "all", label: dict.projects.all },
    ...filters,
  ];

  return (
    <div className={className}>
      <div
        role="tablist"
        aria-label={dict.projects.label}
        className="mb-10 flex flex-wrap gap-2"
      >
        {options.map((option) => {
          const isActive = option.id === active;
          return (
            <button
              key={option.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(option.id)}
              className={cn(
                "focus-visible:outline-ring relative rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2",
                isActive
                  ? "border-brand/30 text-brand-soft-fg"
                  : "border-line text-fg-muted hover:text-fg hover:border-line-strong",
              )}
            >
              {isActive ? (
                <motion.span
                  layoutId="project-filter"
                  className="bg-brand-soft absolute inset-0 -z-10 rounded-full"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              ) : null}
              {option.label}
            </button>
          );
        })}
      </div>

      {visible.length === 0 ? (
        <p className="text-fg-muted border-line rounded-2xl border border-dashed px-6 py-16 text-center text-sm">
          {dict.projects.empty}
        </p>
      ) : (
        <motion.ul
          layout={!reduceMotion}
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {visible.map((project) => (
              <motion.li
                key={project.slug}
                layout={!reduceMotion}
                initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduceMotion ? undefined : { opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                /*
                 * `featured` projects take two columns on the widest layout, so
                 * the grid reads as an edit rather than a uniform wall.
                 */
                className={cn(project.featured && "lg:col-span-2")}
              >
                <ProjectCard project={project} />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      )}
    </div>
  );
}

function ProjectCard({ project }: { project: ResolvedProject }) {
  const dict = useDictionary();

  return (
    <Spotlight
      className={cn(
        "border-line bg-surface ring-edge hover:border-line-strong flex h-full flex-col rounded-2xl border transition-colors",
      )}
    >
      {/*
        No cover images are required for this to look finished: the plate is a
        gradient built from the project's own accent pair, with the initial
        knocked out of it.
      */}
      <div
        aria-hidden
        className="relative h-36 overflow-hidden rounded-t-2xl sm:h-40"
        style={{
          backgroundImage: `linear-gradient(135deg, ${project.accent[0]}, ${project.accent[1]})`,
        }}
      >
        <div className="bg-dots absolute inset-0 opacity-20 mix-blend-overlay" />
        <span className="absolute -bottom-6 left-4 font-mono text-8xl leading-none font-bold text-white/15 select-none">
          {project.title.slice(0, 2)}
        </span>
        <span className="absolute top-3.5 right-4 font-mono text-[11px] tracking-widest text-white/70">
          {project.yearLabel}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg leading-snug font-semibold tracking-tight">
            {project.href ? (
              <Link
                href={project.href}
                className="focus-visible:outline-ring rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4"
              >
                {/* Stretches the link over the whole card without nesting
                    interactive elements inside an <a>. */}
                <span className="absolute inset-0 z-10" aria-hidden />
                {project.title}
              </Link>
            ) : (
              project.title
            )}
          </h3>

          {project.featured ? (
            <Badge tone="brand" className="shrink-0">
              {dict.projects.featured}
            </Badge>
          ) : null}
        </div>

        <p className="text-brand-accent mt-1.5 text-sm font-medium">
          {project.tagline}
        </p>

        <p className="text-fg-muted mt-3 text-sm leading-relaxed">
          {project.description}
        </p>

        <dl className="mt-4 text-xs">
          <dt className="sr-only">{dict.projects.metaRole}</dt>
          <dd className="text-fg-subtle">{project.role}</dd>
        </dl>

        <ul className="mt-4 flex flex-wrap gap-1.5">
          {project.stack.map((tech) => (
            <li key={tech}>
              <Badge>{tech}</Badge>
            </li>
          ))}
        </ul>

        <div className="border-line mt-5 flex flex-wrap items-center gap-4 border-t pt-4">
          {project.href ? (
            <span className="text-fg group-hover/spot:text-brand-accent inline-flex items-center gap-1 text-xs font-medium transition-colors">
              {dict.projects.viewCase}
              <ArrowUpRight className="size-3.5" aria-hidden />
            </span>
          ) : null}

          {/* z-20 keeps these clickable above the stretched card link. */}
          {project.live ? (
            <a
              href={project.live}
              target="_blank"
              rel="noreferrer noopener"
              className="text-fg-muted hover:text-brand-accent focus-visible:outline-ring relative z-20 inline-flex items-center gap-1 text-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              <ExternalLink className="size-3.5" aria-hidden />
              {dict.projects.viewLive}
              <span className="sr-only"> — {project.title}</span>
            </a>
          ) : null}

          {project.source ? (
            <a
              href={project.source}
              target="_blank"
              rel="noreferrer noopener"
              className="text-fg-muted hover:text-brand-accent focus-visible:outline-ring relative z-20 inline-flex items-center gap-1 text-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              <Code className="size-3.5" aria-hidden />
              {dict.projects.viewSource}
              <span className="sr-only"> — {project.title}</span>
            </a>
          ) : null}
        </div>
      </div>
    </Spotlight>
  );
}
