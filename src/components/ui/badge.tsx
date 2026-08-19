import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type Tone = "neutral" | "brand" | "outline";

const tones: Record<Tone, string> = {
  neutral: "bg-surface-hover text-fg-muted border-line",
  brand: "bg-brand-soft text-brand-soft-fg border-brand/20",
  outline: "text-fg-subtle border-line bg-transparent",
};

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[11px] leading-none font-medium tracking-wide",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/** A small pulsing dot, for "available for work" style status lines. */
export function StatusDot({ className }: { className?: string }) {
  return (
    <span className={cn("relative flex size-2", className)}>
      <span className="bg-brand-accent absolute inset-0 animate-ping rounded-full opacity-60" />
      <span className="bg-brand-accent relative size-2 rounded-full" />
    </span>
  );
}
