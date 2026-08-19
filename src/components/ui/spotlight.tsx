"use client";

import { useCallback, useRef, type MouseEvent, type ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Card wrapper with a cursor-following glow.
 *
 * The pointer position is written straight to CSS custom properties rather than
 * to React state — a `setState` per `mousemove` would re-render the subtree on
 * every frame. The glow itself is a sibling div so it never intercepts clicks.
 */
export function Spotlight({
  children,
  className,
  radius = 380,
  /** Accepts any CSS color; defaults to the brand token. */
  color = "var(--brand)",
  strength = 0.13,
}: {
  children: ReactNode;
  className?: string;
  radius?: number;
  color?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const onMouseMove = useCallback((event: MouseEvent<HTMLDivElement>) => {
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    node.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
    node.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
  }, []);

  const onMouseLeave = useCallback(() => {
    ref.current?.style.setProperty("--spot-opacity", "0");
  }, []);

  const onMouseEnter = useCallback(() => {
    ref.current?.style.setProperty("--spot-opacity", "1");
  }, []);

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={cn("group/spot relative isolate overflow-hidden", className)}
      style={
        {
          "--spot-opacity": 0,
          "--spot-radius": `${radius}px`,
          "--spot-color": color,
          "--spot-strength": strength,
        } as React.CSSProperties
      }
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 transition-opacity duration-300"
        style={{
          opacity: "var(--spot-opacity)",
          background:
            "radial-gradient(var(--spot-radius) circle at var(--spot-x) var(--spot-y), color-mix(in oklab, var(--spot-color) calc(var(--spot-strength) * 100%), transparent), transparent 70%)",
        }}
      />
      {children}
    </div>
  );
}
