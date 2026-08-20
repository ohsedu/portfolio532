/*
 * GENERATED FILE — do not edit.
 *
 * Written by scripts/generate-icons.mjs (npm run icons) from the same drawing
 * as src/app/icon.svg, so the logo in the header and the icon in the browser tab
 * cannot drift apart. Change the constants in that script and re-run it; edits
 * made here are overwritten.
 */
import type { SVGProps } from "react";

type LogoProps = Omit<SVGProps<SVGSVGElement>, "viewBox"> & {
  /** Accessible name. Omit it beside visible text, which names it already. */
  title?: string;
};

/**
 * The 532 mark: indigo plate, the digits drawn on it in white strokes.
 *
 * The colours are literal rather than currentColor. This is a brand plate, and
 * it is meant to look the same in both themes — the artwork the tab shows.
 */
export function Logo({ title, ...props }: LogoProps) {
  return (
    <svg
      viewBox="0 0 512 512"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      {...props}
    >
      {title ? <title>{title}</title> : null}
      <rect width="512" height="512" rx="128" fill="#4f46e5" />
      <path
        d="M398 371 Q403.4 392.6 425 398 Q403.4 403.4 398 425 Q392.6 403.4 371 398 Q392.6 392.6 398 371 Z"
        fill="#f4f4f7"
        fillOpacity="0.22"
      />
      <g
        fill="none"
        stroke="#f4f4f7"
        strokeWidth="32"
        strokeLinecap="butt"
        strokeLinejoin="round"
      >
        <path d="M165.34 192 H97.64 V242.48 H126.91 C150.7 242.48 169 258.7 169 280.34 C169 301.97 150.7 320 125.09 320 C106.79 320 92.15 312.79 83 300.17"/>
        <path d="M216.66 213.63 C225.81 199.21 238.62 192 256.91 192 C278.87 192 295.34 204.62 295.34 224.45 C295.34 240.68 282.53 251.49 260.57 251.49 C284.36 251.49 300.83 265.92 300.83 285.75 C300.83 305.58 280.7 320 255.09 320 C236.79 320 222.15 312.79 213 300.17"/>
        <path d="M343 224.45 C344.83 204.62 361.3 192 383.26 192 C405.21 192 423.51 204.62 423.51 226.25 C423.51 242.48 412.53 255.1 396.06 269.52 L343 320 H427.17"/>
      </g>
    </svg>
  );
}
