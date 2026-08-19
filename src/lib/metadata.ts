import type { Metadata } from "next";

import { socials } from "@/lib/data/profile";
import {
  defaultLocale,
  getDictionary,
  localeOgLocale,
  locales,
  type Locale,
} from "@/lib/i18n";
import { person, siteUrl } from "@/lib/site";

/** `Sohee Doh — Frontend Engineer`, the title used when no page overrides it. */
export function siteTitle(locale: Locale): string {
  return `${person.name[locale]} — ${getDictionary(locale).meta.role}`;
}

/** `About · Sohee Doh`, for a subpage. */
export function pageTitle(locale: Locale, title: string): string {
  return `${title} · ${person.name[locale]}`;
}

/**
 * Builds the metadata for one page in one locale.
 *
 * `path` is the locale-less part of the route (`""` for home,
 * `"/projects"`, `"/projects/atlas"`). Every locale variant of that path is
 * emitted under `alternates.languages` so search engines can pair them, plus an
 * `x-default` pointing at the fallback language.
 *
 * All URLs here are relative on purpose — `metadataBase` in the root layout
 * resolves them, so the same code works on localhost, a Vercel preview and the
 * production domain without a rebuild.
 */
export function buildMetadata({
  locale,
  path = "",
  title,
  description,
  images,
  noIndex = false,
}: {
  locale: Locale;
  path?: string;
  /** Omit for the site-level default title. */
  title?: string;
  description?: string;
  /**
   * Usually omit this: a route with an `opengraph-image.tsx` gets its image
   * attached automatically. Pass a URL only to point at a different one.
   */
  images?: string;
  noIndex?: boolean;
}): Metadata {
  const dict = getDictionary(locale);
  const resolvedTitle = title ? pageTitle(locale, title) : siteTitle(locale);
  const resolvedDescription = description ?? dict.meta.description;
  const canonical = `/${locale}${path}`;

  const languages = Object.fromEntries([
    ...locales.map((other) => [other, `/${other}${path}`]),
    ["x-default", `/${defaultLocale}${path}`],
  ]);

  return {
    title: resolvedTitle,
    description: resolvedDescription,
    keywords: dict.meta.keywords,
    alternates: { canonical, languages },
    openGraph: {
      type: "website",
      siteName: person.name[locale],
      title: resolvedTitle,
      description: resolvedDescription,
      url: canonical,
      locale: localeOgLocale[locale],
      alternateLocale: locales
        .filter((other) => other !== locale)
        .map((other) => localeOgLocale[other]),
      ...(images ? { images } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description: resolvedDescription,
      ...(images ? { images } : {}),
    },
    ...(noIndex ? { robots: { index: false, follow: false } } : {}),
  };
}

/**
 * Metadata for a URL that is about to 404.
 *
 * `generateMetadata` must NOT call `notFound()`. Metadata renders in its own
 * boundary that sits ABOVE the route's layout, so a 404 thrown there escalates
 * past `[locale]/not-found.tsx` and lands on the framework's root fallback —
 * the page then renders as Next's unstyled default 404 even though the correct
 * one exists. Returning this instead keeps the throw in the page component,
 * where the segment's own boundary can catch it.
 */
export function notFoundMetadata(): Metadata {
  return {
    title: "404",
    robots: { index: false, follow: true },
  };
}

/**
 * `Person` structured data, so search engines can attach the name, role and
 * social profiles to one entity. Injected as a JSON-LD script tag rather than
 * through the Metadata API, which has no field for it.
 */
export function personJsonLd(locale: Locale) {
  const dict = getDictionary(locale);

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: person.name[locale],
    alternateName: person.name[locale === "ko" ? "en" : "ko"],
    jobTitle: dict.meta.role,
    description: dict.meta.description,
    email: `mailto:${person.email}`,
    url: `${siteUrl}/${locale}`,
    image: `${siteUrl}/${locale}/opengraph-image`,
    address: {
      "@type": "PostalAddress",
      addressLocality: person.location[locale],
    },
    sameAs: socials.map((social) => social.href),
    knowsLanguage: locales.map((other) => other),
  };
}
