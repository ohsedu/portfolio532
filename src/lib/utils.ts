import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/*
 * `label-xs`, `label-sm` and `label-eyebrow` (see globals.css) each set a font
 * size, so they conflict with `text-*` — but tailwind-merge only knows the
 * classes Tailwind ships, and would keep both. Two font sizes on one element is
 * then settled by stylesheet order rather than by the order they were written,
 * which is the opposite of what `cn` promises: `buttonClasses({ size: "sm" })`
 * contributes `text-sm` and quietly won over a `label-xs` passed after it.
 *
 * Registering them in the `font-size` group makes the later class win, as it
 * does for every other utility here.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ label: ["xs", "sm", "eyebrow"] }],
    },
  },
});

/** Merge conditional class names, with later Tailwind utilities winning. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
