import type { MetadataRoute } from "next";

import { siteUrl } from "@/lib/site";

/**
 * A portfolio wants to be indexed, so this is permissive by design.
 *
 * `/_next/` is disallowed only to keep build assets out of crawl reports — it
 * has no bearing on rendering, since crawlers fetch those regardless when
 * executing the page.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/_next/"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
