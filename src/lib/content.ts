import type { MDXContent } from "mdx/types";

import atlasEn from "@/content/projects/atlas-design-system.en.mdx";
import atlasKo from "@/content/projects/atlas-design-system.ko.mdx";
import chat532En from "@/content/projects/chat532.en.mdx";
import chat532Ko from "@/content/projects/chat532.ko.mdx";
import checkoutEn from "@/content/projects/checkout-rebuild.en.mdx";
import checkoutKo from "@/content/projects/checkout-rebuild.ko.mdx";
import pulseEn from "@/content/projects/pulse-analytics.en.mdx";
import pulseKo from "@/content/projects/pulse-analytics.ko.mdx";
import { defaultLocale, type Locale } from "@/lib/i18n/config";

/**
 * Registry of case-study bodies, keyed by project slug then locale.
 *
 * These are static imports rather than `await import(\`…/${slug}.mdx\`)` on
 * purpose. A template-literal specifier depends on the bundler resolving a
 * variable path, which is exactly the kind of thing that works until it quietly
 * does not; static imports are resolved and type-checked at build time, and a
 * renamed or missing file becomes a compile error instead of a 404 nobody
 * notices. The cost is two lines per project, which at this size is the better
 * trade.
 *
 * The MDX bodies are rendered on the server into static HTML, so listing them
 * all here does not put any of them in the client bundle.
 *
 * Adding a case study takes three steps:
 *   1. write `src/content/projects/<slug>.ko.mdx` and `<slug>.en.mdx`
 *   2. add the pair here under the same slug
 *   3. set `caseStudy: true` on that project in `src/lib/data/projects.ts`
 */
const caseStudies: Record<string, Partial<Record<Locale, MDXContent>>> = {
  chat532: { ko: chat532Ko, en: chat532En },
  "atlas-design-system": { ko: atlasKo, en: atlasEn },
  "pulse-analytics": { ko: pulseKo, en: pulseEn },
  "checkout-rebuild": { ko: checkoutKo, en: checkoutEn },
};

/**
 * Every translation of one project's body, or `null` if the slug has no write-up.
 *
 * This returns the *map* rather than a single component on purpose. Callers pick
 * their language with a property access:
 *
 * ```tsx
 * const bodies = getCaseStudyBodies(slug);
 * const Body = bodies?.[locale] ?? bodies?.[fallbackLocale];
 * ```
 *
 * A helper that returned the component directly would have the page binding a
 * capitalized name to a function *call*, which React's compiler lint reads as
 * creating a component during render. It is a false positive here — these are
 * module-level components from a static registry — but the shape above avoids
 * the argument entirely and keeps the lint honest for the cases where it is not
 * a false positive.
 */
export function getCaseStudyBodies(
  slug: string,
): Partial<Record<Locale, MDXContent>> | null {
  return caseStudies[slug] ?? null;
}

/** The language a case study falls back to when a translation is missing. */
export const fallbackLocale = defaultLocale;

/** Whether a body exists at all, in any language. */
export function hasCaseStudy(slug: string): boolean {
  return slug in caseStudies;
}
