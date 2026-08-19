import type { LocalizedString } from "./i18n/config";

/* ────────────────────────────────────────────────────────────────────────────
 *  ⚠️  EDIT ME FIRST
 *  Everything that identifies you lives in this file. Change it here and it
 *  updates the header, footer, metadata, sitemap, JSON-LD and OG images.
 * ──────────────────────────────────────────────────────────────────────────── */

export const person = {
  /** Displayed in the header, footer, page titles and structured data. */
  name: {
    ko: "오세두",
    en: "SeDu Oh",
  } satisfies LocalizedString,

  /** Two or three letters for the logo mark. */
  initials: "SD",

  email: "aaa31235663@gmail.com",

  /** Used for the "Location" fact and JSON-LD. */
  location: {
    ko: "서울, 대한민국",
    en: "Seoul, South Korea",
  } satisfies LocalizedString,

  /**
   * Path to a résumé PDF in `public/`.
   *
   * `null` by default and both sections that offer a download check for it, so
   * the site never ships a button that 404s. Drop the file in `public/` and set
   * this to `"/resume.pdf"` to turn the download links on.
   */
  resumePath: null as string | null,

  /**
   * Reference month for "how long have I been in my current role", as `YYYY-MM`.
   *
   * A prerendered page may not call `new Date()`, so the open-ended duration in
   * the Experience timeline is measured against this constant instead of the
   * clock. Bump it when you refresh the site.
   */
  asOf: "2026-08",
};

/** Brand identity — keep in sync with the palette in `globals.css`. */
export const brand = {
  /** #4f46e5 — Tailwind's indigo-600. */
  color: "#4f46e5",
  colorDark: "#4338ca",
  colorLight: "#6366f1",
};

/**
 * Absolute origin, needed for `metadataBase`, canonical URLs, sitemap and OG
 * images. Resolution order:
 *   1. `NEXT_PUBLIC_SITE_URL` — set this to your real domain in production.
 *   2. `VERCEL_PROJECT_PRODUCTION_URL` — the stable production domain Vercel
 *      injects (unlike `VERCEL_URL`, this does not change per deployment).
 *   3. localhost, for `next dev`.
 */
export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return stripTrailingSlash(explicit);

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${stripTrailingSlash(vercel)}`;

  return "http://localhost:3000";
}

function stripTrailingSlash(value: string) {
  const withProtocol = value.startsWith("http") ? value : `https://${value}`;
  return withProtocol.replace(/\/+$/, "");
}

export const siteUrl = getSiteUrl();

/**
 * Optional POST endpoint for the contact form (Formspree, Resend via a
 * serverless function, Basin, etc.). Leave unset and the form gracefully
 * degrades to a prefilled `mailto:` link — no backend required.
 */
export const contactEndpoint = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT ?? null;

/** Repository link shown in the footer. Set to `null` to hide it. */
export const repoUrl: string | null = "https://github.com/ohsedu/portfolio";

/** Anchors rendered in the header nav, in order. */
export const navSections = [
  "about",
  "skills",
  "projects",
  "experience",
  "contact",
] as const;

export type NavSection = (typeof navSections)[number];
