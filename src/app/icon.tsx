import { ImageResponse } from "next/og";

import { brand, person } from "@/lib/site";

/*
 * Generated favicon: the brand square with the initials knocked out of it.
 *
 * Generating it beats committing a binary — the mark follows `person.initials`
 * and `brand.color`, so changing either updates the tab icon too. The scaffold's
 * `favicon.ico` was deleted so this route is the one that serves `/favicon.ico`.
 *
 * Do NOT add `export const runtime = 'edge'` — 'edge' is deprecated in Next 16
 * and is incompatible with static generation of metadata routes.
 */

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: brand.color,
          color: "#ffffff",
          fontSize: 15,
          fontWeight: 700,
          letterSpacing: "-0.06em",
          borderRadius: 7,
        }}
      >
        {person.initials}
      </div>
    ),
    size,
  );
}
