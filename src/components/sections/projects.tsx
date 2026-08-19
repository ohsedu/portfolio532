import { ArrowRight } from "lucide-react";
import Link from "next/link";

import {
  ProjectsGrid,
  type FilterOption,
  type ResolvedProject,
} from "@/components/sections/projects-grid";
import { buttonClasses } from "@/components/ui/button";
import { Section, SectionHeader } from "@/components/ui/section";
import {
  formatYear,
  getUsedTags,
  projectTagLabels,
  projectsByRecency,
  type Project,
} from "@/lib/data/projects";
import { getDictionary, l, type Locale } from "@/lib/i18n";

/**
 * Flattens a project's `{ ko, en }` fields for the active locale so the client
 * grid receives plain serializable data — and so only one language's strings
 * cross into the client bundle.
 */
function resolve(project: Project, locale: Locale): ResolvedProject {
  return {
    slug: project.slug,
    title: project.title,
    tagline: l(project.tagline, locale),
    description: l(project.description, locale),
    yearLabel: formatYear(project.year, locale),
    role: l(project.role, locale),
    stack: project.stack,
    tags: project.tags,
    featured: project.featured,
    href: project.caseStudy ? `/${locale}/projects/${project.slug}` : null,
    live: project.links.live,
    source: project.links.source,
    accent: project.accent,
  };
}

export function Projects({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);

  /* Only the first six on the home page; the rest live on /projects. */
  const shown = projectsByRecency.slice(0, 6);

  const filters: FilterOption[] = getUsedTags().map((tag) => ({
    id: tag,
    label: l(projectTagLabels[tag], locale),
  }));

  return (
    <Section id="projects" className="bg-bg-subtle border-line border-y">
      <SectionHeader
        label={dict.projects.label}
        heading={dict.projects.heading}
        lede={dict.projects.lede}
      >
        <Link
          href={`/${locale}/projects`}
          className={buttonClasses({
            variant: "secondary",
            size: "sm",
            className: "group",
          })}
        >
          {dict.projects.indexHeading}
          <ArrowRight
            className="size-3.5 transition-transform group-hover:translate-x-0.5"
            aria-hidden
          />
        </Link>
      </SectionHeader>

      <ProjectsGrid
        projects={shown.map((project) => resolve(project, locale))}
        filters={filters}
      />
    </Section>
  );
}

/** Exported for the `/projects` index page, which shows every project. */
export { resolve as resolveProject };
