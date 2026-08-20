import type { MetadataRoute } from "next";

import { defaultLocale, getDictionary } from "@/lib/i18n";
import { brand, person } from "@/lib/site";

/**
 * Web app manifest, so the site installs sensibly when added to a home screen.
 *
 * There is one manifest for the whole site rather than one per locale — the
 * manifest format is not locale-aware, so it uses the default language and
 * points at that locale's start URL.
 *
 * The icons come from `scripts/generate-icons.mjs` (`npm run icons`) — edit the
 * constants there, not the images.
 *
 * These are the `public/` copies rather than the hashed URLs Next gives the
 * `src/app` icon files. A manifest is data, not markup: it needs paths that stay
 * the same between builds so an already-installed home-screen app keeps
 * resolving them.
 *
 * `maskable` is a separate file. Android may crop to a circle, and it guarantees
 * only the middle 80% — the drawing at full size reaches past that, so the
 * generator writes a scaled-down copy instead of shrinking every icon to suit
 * one platform.
 */
export default function manifest(): MetadataRoute.Manifest {
  const dict = getDictionary(defaultLocale);

  return {
    name: `${person.name[defaultLocale]} — ${dict.meta.role}`,
    short_name: person.name[defaultLocale],
    description: dict.meta.description,
    start_url: `/${defaultLocale}`,
    scope: "/",
    display: "standalone",
    background_color: "#08080f",
    theme_color: brand.color,
    lang: defaultLocale,
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      {
        src: "/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
