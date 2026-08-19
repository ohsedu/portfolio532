import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";

/*
 * Element overrides for every MDX file in the project.
 *
 * This file is mandatory — App Router MDX will not compile without it — and in
 * Next 16 `useMDXComponents` takes NO arguments. Earlier versions accepted an
 * incoming `components` object and merged it; that signature is wrong here.
 *
 * Typography classes deliberately do NOT live here. `@tailwindcss/typography`
 * is applied once, on the wrapper in the case-study layout, so the prose rhythm
 * is set in one place and these overrides only handle what `prose` cannot: real
 * components, heading anchors, and internal-vs-external link behaviour.
 */

/** A heading that owns a clickable anchor, using the id from `rehype-slug`. */
function heading(level: 2 | 3 | 4) {
  const Tag = `h${level}` as "h2" | "h3" | "h4";

  return function Heading({
    id,
    children,
    className,
    ...props
  }: ComponentPropsWithoutRef<"h2">) {
    return (
      <Tag id={id} className={cn("group scroll-mt-28", className)} {...props}>
        {children}
        {id ? (
          <a
            href={`#${id}`}
            /*
             * Revealed on hover for pointer users and on focus for keyboard
             * users. `no-underline` overrides the `prose` anchor style.
             */
            className="text-brand-accent focus-visible:outline-ring ml-2 align-middle text-[0.8em] no-underline opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2"
            aria-label={
              typeof children === "string"
                ? `Permalink to ${children}`
                : "Permalink to this section"
            }
          >
            #
          </a>
        ) : null}
      </Tag>
    );
  };
}

const components: MDXComponents = {
  h2: heading(2),
  h3: heading(3),
  h4: heading(4),

  a: ({ href = "", children, ...props }: ComponentPropsWithoutRef<"a">) => {
    const isInternal = href.startsWith("/") || href.startsWith("#");

    if (isInternal) {
      return (
        <Link href={href} {...props}>
          {children}
        </Link>
      );
    }

    return (
      <a href={href} target="_blank" rel="noreferrer noopener" {...props}>
        {children}
        {/* Warn once, in text, that the link leaves the site. */}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    );
  },

  /*
   * `prose` styles `pre` well enough, but the horizontal scroll container has to
   * be explicit or a long line widens the whole page on mobile.
   */
  pre: ({ children, className, ...props }: ComponentPropsWithoutRef<"pre">) => (
    <pre
      className={cn(
        "border-line bg-bg-subtle overflow-x-auto rounded-xl border p-4 text-[13px] leading-relaxed",
        className,
      )}
      {...props}
    >
      {children}
    </pre>
  ),

  /* A table wide enough to overflow scrolls inside its own box, never the page. */
  table: ({ children, ...props }: ComponentPropsWithoutRef<"table">) => (
    <div className="border-line my-6 overflow-x-auto rounded-xl border">
      <table className="m-0 w-full text-sm" {...props}>
        {children}
      </table>
    </div>
  ),

  blockquote: ({
    children,
    className,
    ...props
  }: ComponentPropsWithoutRef<"blockquote">) => (
    <blockquote
      className={cn(
        "border-brand text-fg-muted border-l-2 pl-5 not-italic",
        className,
      )}
      {...props}
    >
      {children}
    </blockquote>
  ),
};

export function useMDXComponents(): MDXComponents {
  return components;
}
