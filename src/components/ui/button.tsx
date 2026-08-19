import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "outline";
type Size = "sm" | "md" | "lg" | "icon";

const base =
  "relative inline-flex items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap transition-all duration-200 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]";

const variants: Record<Variant, string> = {
  primary:
    "bg-brand text-brand-fg shadow-[0_1px_2px_rgba(0,0,0,0.08),0_8px_24px_-12px_var(--brand)] hover:bg-brand-hover hover:shadow-[0_1px_2px_rgba(0,0,0,0.08),0_12px_32px_-10px_var(--brand)]",
  secondary:
    "bg-surface text-fg border border-line hover:border-line-strong hover:bg-surface-hover",
  outline:
    "border border-brand/40 text-brand-accent hover:border-brand hover:bg-brand-soft",
  ghost: "text-fg-muted hover:bg-surface-hover hover:text-fg",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-13 px-7 text-base",
  icon: "size-10 shrink-0",
};

/**
 * Returns only the class string.
 *
 * Deliberately not a polymorphic `<Button as={Link}>`: Next 16 generates types
 * for `Link`'s `href`, and funnelling links through a wrapper throws that
 * checking away. Anchors and `<Link>`s get `className={buttonClasses(...)}`
 * instead, and keep their own types.
 */
export function buttonClasses({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: Variant;
  size?: Size;
  className?: string;
} = {}) {
  return cn(base, variants[variant], sizes[size], className);
}

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClasses({ variant, size, className })}
      {...props}
    />
  );
}
