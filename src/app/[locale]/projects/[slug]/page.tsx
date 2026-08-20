import { ArrowLeft, ArrowRight, Code, ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { buttonClasses } from "@/components/ui/button";
import { Container } from "@/components/ui/section";
import { fallbackLocale, getCaseStudyBodies } from "@/lib/content";
import {
  caseStudySlugs,
  formatYear,
  getProject,
  getProjectNeighbours,
} from "@/lib/data/projects";
import { getDictionary, hasLocale, l, locales } from "@/lib/i18n";
import { buildMetadata, notFoundMetadata } from "@/lib/metadata";

/**
 * Prerenders every locale × case-study pair. The slugs come from
 * `caseStudySlugs`, which is derived from the same `caseStudy` flag that decides
 * whether a card links here at all — so a card can never point at a 404.
 */
export function generateStaticParams() {
  return locales.flatMap((locale) =>
    caseStudySlugs.map((slug) => ({ locale, slug })),
  );
}

/** Unknown slugs are refused at the router — see the note in `[locale]/layout.tsx`. */
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/projects/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  /* Not `notFound()` — see the note on `notFoundMetadata`. */
  if (!hasLocale(locale)) return notFoundMetadata();

  const project = getProject(slug);
  if (!project) return notFoundMetadata();

  return buildMetadata({
    locale,
    path: `/projects/${slug}`,
    title: project.title,
    description: l(project.description, locale),
  });
}

export default async function CaseStudyPage({
  params,
}: PageProps<"/[locale]/projects/[slug]">) {
  const { locale, slug } = await params;
  if (!hasLocale(locale)) notFound();

  const project = getProject(slug);

  /* Property access, not a call — see the note on `getCaseStudyBodies`. */
  const bodies = getCaseStudyBodies(slug);
  const Body = bodies?.[locale] ?? bodies?.[fallbackLocale];

  if (!project || !Body) notFound();

  const dict = getDictionary(locale);
  const { prev, next } = getProjectNeighbours(slug);

  const facts = [
    { term: dict.projects.metaYear, detail: formatYear(project.year, locale) },
    { term: dict.projects.metaRole, detail: l(project.role, locale) },
    { term: dict.projects.metaTeam, detail: l(project.team, locale) },
  ];

  return (
    <article>
      {/* ── Masthead ─────────────────────────────────────────────────────── */}
      <header className="border-line relative overflow-hidden border-b">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 opacity-[0.14]"
          style={{
            backgroundImage: `linear-gradient(135deg, ${project.accent[0]}, ${project.accent[1]})`,
          }}
        />

        <Container className="pt-14 pb-16">
          <Link
            href={`/${locale}/projects`}
            className="text-fg-muted hover:text-fg focus-visible:outline-ring group inline-flex items-center gap-1.5 rounded-full text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            <ArrowLeft
              className="size-3.5 transition-transform group-hover:-translate-x-0.5"
              aria-hidden
            />
            {dict.projects.backToProjects}
          </Link>

          <h1 className="mt-8 text-4xl leading-[1.05] font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            {project.title}
          </h1>

          <p className="text-brand-accent mt-4 max-w-2xl text-lg font-medium sm:text-xl">
            {l(project.tagline, locale)}
          </p>

          <dl className="mt-10 flex flex-wrap gap-x-12 gap-y-6">
            {facts.map((fact) => (
              <div key={fact.term}>
                <dt className="text-fg-subtle label-xs">
                  {fact.term}
                </dt>
                <dd className="mt-1.5 text-sm font-medium">{fact.detail}</dd>
              </div>
            ))}

            <div className="min-w-0">
              <dt className="text-fg-subtle label-xs">
                {dict.projects.metaStack}
              </dt>
              <dd className="mt-2">
                <ul role="list" className="flex flex-wrap gap-1.5">
                  {project.stack.map((tech) => (
                    <li key={tech}>
                      <Badge>{tech}</Badge>
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          </dl>

          {project.links.live || project.links.source ? (
            <div className="mt-10 flex flex-wrap gap-3">
              {project.links.live ? (
                <a
                  href={project.links.live}
                  target="_blank"
                  rel="noreferrer noopener"
                  className={buttonClasses({ size: "sm" })}
                >
                  <ExternalLink className="size-3.5" aria-hidden />
                  {dict.projects.viewLive}
                </a>
              ) : null}

              {project.links.source ? (
                <a
                  href={project.links.source}
                  target="_blank"
                  rel="noreferrer noopener"
                  className={buttonClasses({ variant: "secondary", size: "sm" })}
                >
                  <Code className="size-3.5" aria-hidden />
                  {dict.projects.viewSource}
                </a>
              ) : null}
            </div>
          ) : null}
        </Container>
      </header>

      {/* ── Body ─────────────────────────────────────────────────────────── */}
      <Container size="narrow" className="py-16 sm:py-20">
        {/*
          `prose-portfolio` rebinds typography's colours to the design tokens, so
          no `dark:prose-invert` is needed — see globals.css.
        */}
        <div className="prose prose-portfolio prose-headings:font-semibold prose-headings:tracking-tight prose-a:decoration-brand/40 hover:prose-a:decoration-brand prose-code:before:content-none prose-code:after:content-none max-w-none">
          <Body />
        </div>
      </Container>

      {/* ── Previous / next ──────────────────────────────────────────────── */}
      <nav
        aria-label={dict.projects.label}
        className="border-line bg-bg-subtle border-t"
      >
        <Container className="grid gap-px py-10 sm:grid-cols-2">
          {prev ? (
            <Link
              href={`/${locale}/projects/${prev.slug}`}
              rel="prev"
              className="group focus-visible:outline-ring rounded-xl p-5 transition-colors hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              <span className="text-fg-subtle flex items-center gap-1.5 label-xs">
                <ArrowLeft className="size-3" aria-hidden />
                {dict.projects.prevProject}
              </span>
              <span className="group-hover:text-brand-accent mt-2 block font-medium transition-colors">
                {prev.title}
              </span>
            </Link>
          ) : (
            <span />
          )}

          {next ? (
            <Link
              href={`/${locale}/projects/${next.slug}`}
              rel="next"
              className="group focus-visible:outline-ring rounded-xl p-5 text-right transition-colors hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 sm:justify-self-end"
            >
              <span className="text-fg-subtle flex items-center justify-end gap-1.5 label-xs">
                {dict.projects.nextProject}
                <ArrowRight className="size-3" aria-hidden />
              </span>
              <span className="group-hover:text-brand-accent mt-2 block font-medium transition-colors">
                {next.title}
              </span>
            </Link>
          ) : null}
        </Container>
      </nav>
    </article>
  );
}
