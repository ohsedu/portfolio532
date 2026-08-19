import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Infinite horizontal ticker.
 *
 * The track holds the children twice and slides by exactly -50%, so the second
 * copy is in the first copy's place at the moment the animation restarts — that
 * is what makes the loop seamless. Both copies are inside one `aria-hidden`
 * wrapper because a decorative ticker read out twice is worse than not at all;
 * pass `label` to expose the content as text for assistive tech.
 */
export function Marquee({
  children,
  className,
  reverse = false,
  /** Seconds for one full pass. Larger is slower. */
  duration = 40,
  label,
}: {
  children: ReactNode;
  className?: string;
  reverse?: boolean;
  duration?: number;
  label?: string;
}) {
  return (
    <div className={cn("group relative w-full overflow-hidden", className)}>
      {label ? <span className="sr-only">{label}</span> : null}
      <div
        aria-hidden
        className={cn(
          "flex w-max animate-[marquee_var(--marquee-duration)_linear_infinite] items-center",
          "group-hover:[animation-play-state:paused]",
          reverse && "[animation-direction:reverse]",
        )}
        style={{ "--marquee-duration": `${duration}s` } as React.CSSProperties}
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center">{children}</div>
      </div>
    </div>
  );
}
