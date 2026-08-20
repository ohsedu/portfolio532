import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";

/** The single source of truth for page gutters and max width. */
export function Container({
  children,
  className,
  size = "default",
}: {
  children: ReactNode;
  className?: string;
  size?: "default" | "narrow" | "wide";
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-5 sm:px-8",
        size === "narrow" && "max-w-3xl",
        size === "default" && "max-w-6xl",
        size === "wide" && "max-w-7xl",
        className,
      )}
    >
      {children}
    </div>
  );
}

/**
 * A page section with consistent vertical rhythm and a scroll anchor.
 *
 * `scroll-mt` compensates for the sticky header so anchor jumps do not hide
 * the heading underneath it.
 */
export function Section({
  id,
  children,
  className,
  containerSize = "default",
  bleed = false,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  containerSize?: "default" | "narrow" | "wide";
  /** Skip the container, for sections that need full-bleed content. */
  bleed?: boolean;
}) {
  return (
    <section
      id={id}
      className={cn(
        "relative scroll-mt-24 py-20 sm:py-28 lg:py-36",
        className,
      )}
    >
      {bleed ? children : <Container size={containerSize}>{children}</Container>}
    </section>
  );
}

/**
 * Eyebrow + heading + optional lede, animated as one unit.
 *
 * The eyebrow is decorative repetition of the nav label, so it is hidden from
 * assistive tech; the `<h2>` carries the real document outline.
 */
export function SectionHeader({
  label,
  heading,
  lede,
  className,
  align = "left",
  children,
}: {
  label: string;
  heading: string;
  lede?: string;
  className?: string;
  align?: "left" | "center";
  /** Extra controls rendered on the trailing edge, e.g. a "view all" link. */
  children?: ReactNode;
}) {
  return (
    <Reveal
      className={cn(
        "mb-12 sm:mb-16",
        align === "center" && "text-center",
        className,
      )}
    >
      <div
        className={cn(
          "flex flex-col gap-6",
          children &&
            "sm:flex-row sm:items-end sm:justify-between sm:gap-10",
        )}
      >
        <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
          <p
            aria-hidden
            className={cn(
              "label-eyebrow text-brand-accent mb-4 flex items-center gap-3",
              align === "center" && "justify-center",
            )}
          >
            <span className="bg-brand-accent/50 h-px w-8" />
            {label}
          </p>

          <h2 className="text-3xl leading-[1.1] font-semibold tracking-tight sm:text-4xl lg:text-5xl">
            {heading}
          </h2>

          {lede ? (
            <p className="text-fg-muted mt-5 text-base leading-relaxed sm:text-lg">
              {lede}
            </p>
          ) : null}
        </div>

        {children ? <div className="shrink-0">{children}</div> : null}
      </div>
    </Reveal>
  );
}
