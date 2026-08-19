import { ImageResponse } from "next/og";

import { brand, person } from "@/lib/site";

/*
 * Apple touch icon. Rendered larger and with more padding than the favicon,
 * because iOS applies its own rounded mask and crops toward the edges.
 */

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage: `linear-gradient(135deg, ${brand.colorLight}, ${brand.colorDark})`,
          color: "#ffffff",
          fontSize: 84,
          fontWeight: 700,
          letterSpacing: "-0.06em",
        }}
      >
        {person.initials}
      </div>
    ),
    size,
  );
}
