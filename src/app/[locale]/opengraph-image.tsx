import { readFileSync } from "node:fs";
import { join } from "node:path";

import { ImageResponse } from "next/og";

import { getDictionary, hasLocale, locales, type Locale } from "@/lib/i18n";
import { brand, person, siteUrl } from "@/lib/site";

/*
 * The logo, read off disk at build time and inlined as a data URI.
 *
 * It has to be inline. This route is prerendered, so at the moment the card is
 * drawn there is no origin to fetch `/icon.svg` from — and Satori resolves an
 * `<img>` data URI with no network request at all. Reading the very file the
 * favicon is built from keeps the share card and the browser tab on one mark.
 */
const logoDataUri = `data:image/svg+xml;base64,${readFileSync(
  join(process.cwd(), "src", "app", "icon.svg"),
).toString("base64")}`;

/*
 * The link-preview card for /ko and /en.
 *
 * A metadata file compiles to its own route and reads `generateStaticParams`
 * only from its own module — it does not inherit the layout's. Without the
 * export below, this image would be generated per request instead of at build.
 *
 * `runtime = 'edge'` is deliberately absent: 'edge' is deprecated in Next 16 and
 * is incompatible with generateStaticParams (error E502).
 */

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Portfolio";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

/*
 * The card is intentionally Latin-only.
 *
 * ImageResponse ships a Latin-only default face, and the whole route has to stay
 * under 500KB — a Korean font would blow that on its own. The Korean text still
 * reaches every share surface through `og:title` and `og:description`, which are
 * set from the dictionary in `buildMetadata`; only this artwork is Latin.
 *
 * To render Korean here instead: commit a subsetted Korean TTF, read it at
 * module scope with `await readFile(join(process.cwd(), ...))`, and pass it via
 * ImageResponse's `fonts` option (ttf/otf only — Satori cannot parse woff2).
 */
export default async function OpenGraphImage({
  params,
}: {
  /* Promise in Next 16 — awaiting this is not optional. */
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = hasLocale(raw) ? raw : "en";
  const domain = siteUrl.replace(/^https?:\/\//, "");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#08080f",
          /* Satori supports gradients but NOT `display: grid` — everything here
             is flexbox on purpose. */
          backgroundImage: `radial-gradient(1000px circle at 15% -10%, ${brand.colorLight}55, transparent 60%), radial-gradient(800px circle at 95% 110%, ${brand.color}44, transparent 55%)`,
          color: "#eeeef5",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {/* Satori has no next/image; a plain <img> is the only option here. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logoDataUri}
            alt=""
            width={68}
            height={68}
            style={{ borderRadius: 18 }}
          />

          <div
            style={{
              display: "flex",
              fontSize: 21,
              color: "#a1a1b5",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
            }}
          >
            {locale.toUpperCase()} · Portfolio
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div
            style={{
              display: "flex",
              fontSize: 104,
              fontWeight: 700,
              letterSpacing: "-0.045em",
              lineHeight: 1,
            }}
          >
            {person.name.en}
          </div>

          <div
            style={{
              display: "flex",
              fontSize: 42,
              color: brand.colorLight,
              fontWeight: 600,
              letterSpacing: "-0.02em",
            }}
          >
            {getDictionary("en").meta.role}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid #22223a",
            paddingTop: 28,
            fontSize: 24,
            color: "#71718a",
          }}
        >
          <div style={{ display: "flex" }}>{domain}</div>
          <div style={{ display: "flex", gap: 14 }}>
            {["React", "TypeScript", "Next.js"].map((tech) => (
              <div
                key={tech}
                style={{
                  display: "flex",
                  padding: "8px 18px",
                  borderRadius: 999,
                  border: "1px solid #2e2e4d",
                  color: "#a1a1b5",
                  fontSize: 21,
                }}
              >
                {tech}
              </div>
            ))}
          </div>
        </div>

      </div>
    ),
    size,
  );
}
