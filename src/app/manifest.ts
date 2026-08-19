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
 * The icons are the generated `icon.tsx` / `apple-icon.tsx` routes, declared at
 * their true sizes. That covers the browser tab and a basic install prompt; a
 * store-grade PWA would additionally want real 192px and 512px PNGs committed
 * to `public/` and listed here.
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
      { src: "/icon", sizes: "32x32", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
