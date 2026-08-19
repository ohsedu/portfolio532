import type { MetadataRoute } from "next";

import { caseStudySlugs } from "@/lib/data/projects";
import { locales } from "@/lib/i18n/config";
import { siteUrl } from "@/lib/site";

/*
 * Lives at `src/app/sitemap.ts`, NOT inside `[locale]/`. A metadata route
 * inside the locale segment would be served at `/ko/sitemap.xml`, which is not
 * where crawlers look.
 */

/**
 * Evaluated once when this module is first loaded, which for a prerendered
 * route is build time. Deliberately not called during render — `new Date()`
 * inside a prerendered component is not allowed.
 */
const lastModified = new Date();

/** Locale-less paths, each of which exists in every locale. */
const paths: { path: string; priority: number }[] = [
  { path: "", priority: 1 },
  { path: "/projects", priority: 0.8 },
  ...caseStudySlugs.map((slug) => ({
    path: `/projects/${slug}`,
    priority: 0.6,
  })),
];

export default function sitemap(): MetadataRoute.Sitemap {
  return locales.flatMap((locale) =>
    paths.map(({ path, priority }) => ({
      url: `${siteUrl}/${locale}${path}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority,
      /*
       * Every entry lists all of its language variants, which is how a crawler
       * learns that /ko/projects and /en/projects are the same page rather than
       * duplicate content.
       */
      alternates: {
        languages: Object.fromEntries(
          locales.map((other) => [other, `${siteUrl}/${other}${path}`]),
        ),
      },
    })),
  );
}
