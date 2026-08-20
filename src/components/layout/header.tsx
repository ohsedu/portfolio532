"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

import { Logo } from "@/components/icons/logo";
import { useDictionary, useLocale } from "@/components/layout/dictionary-provider";
import { LocaleToggle } from "@/components/layout/locale-toggle";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { buttonClasses } from "@/components/ui/button";
import { navSections, person } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * Highlights the nav item for whichever section is currently on screen.
 *
 * Uses one IntersectionObserver over all sections rather than a scroll handler,
 * so there is no per-frame layout read. The band is narrowed with `rootMargin`
 * to roughly the middle of the viewport, which keeps the highlight from flipping
 * while a heading is only just entering.
 */
function useActiveSection(ids: readonly string[], enabled: boolean) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 1] },
    );

    for (const el of elements) observer.observe(el);
    return () => observer.disconnect();
  }, [ids, enabled]);

  /* Derived rather than reset in the effect: off the home page there are no
     section anchors, so nothing should ever read as active. */
  return enabled ? active : null;
}

export function Header() {
  const dict = useDictionary();
  const locale = useLocale();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const home = `/${locale}`;
  /* Section anchors only exist on the home page. */
  const onHome = pathname === home || pathname === `${home}/`;
  const active = useActiveSection(navSections, onHome);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /*
   * Close the drawer whenever the route changes. Adjusting state during render
   * (rather than in an effect) is what React recommends for resetting state in
   * response to a changed value, and it avoids a frame with a stale open menu.
   */
  const [menuPath, setMenuPath] = useState(pathname);
  if (menuPath !== pathname) {
    setMenuPath(pathname);
    setMenuOpen(false);
  }

  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-all duration-300",
        scrolled
          ? "border-line bg-bg/80 border-b backdrop-blur-xl"
          : "border-b border-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
        <Link
          href={home}
          className="focus-visible:outline-ring group flex items-center gap-2.5 rounded-full focus-visible:outline-2 focus-visible:outline-offset-4"
        >
          <Logo className="size-8 shrink-0 transition-transform group-hover:scale-105" />
          <span className="text-sm font-semibold tracking-tight">
            {person.name[locale]}
          </span>
        </Link>

        <nav
          aria-label={dict.nav.home}
          className="hidden items-center gap-1 md:flex"
        >
          {navSections.map((section) => {
            const isActive = active === section;
            return (
              <Link
                key={section}
                href={`${home}#${section}`}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "focus-visible:outline-ring relative rounded-full px-3 py-2 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2",
                  isActive
                    ? "text-fg"
                    : "text-fg-muted hover:text-fg",
                )}
              >
                {dict.nav[section]}
                {isActive ? (
                  <motion.span
                    layoutId="nav-active"
                    className="bg-brand-soft absolute inset-0 -z-10 rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <LocaleToggle className="hidden sm:inline-flex" />
          <ThemeToggle className="hidden sm:inline-flex" />

          <Link
            href={`${home}#contact`}
            className={buttonClasses({
              size: "sm",
              className: "hidden lg:inline-flex",
            })}
          >
            {dict.nav.contact}
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? dict.nav.closeMenu : dict.nav.openMenu}
            className="border-line bg-surface text-fg focus-visible:outline-ring grid size-9 place-items-center rounded-full border focus-visible:outline-2 focus-visible:outline-offset-2 md:hidden"
          >
            {menuOpen ? (
              <X className="size-4" aria-hidden />
            ) : (
              <Menu className="size-4" aria-hidden />
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            id="mobile-nav"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="border-line bg-bg/95 border-b backdrop-blur-xl md:hidden"
          >
            <nav className="mx-auto max-w-6xl px-5 pb-6 sm:px-8">
              <ul className="flex flex-col">
                {navSections.map((section) => (
                  <li key={section}>
                    <Link
                      href={`${home}#${section}`}
                      onClick={() => setMenuOpen(false)}
                      className="border-line/60 text-fg-muted hover:text-fg flex items-center justify-between border-b py-3.5 text-base transition-colors"
                    >
                      {dict.nav[section]}
                      <span
                        aria-hidden
                        className="text-brand-accent font-mono text-xs"
                      >
                        {String(navSections.indexOf(section) + 1).padStart(
                          2,
                          "0",
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>

              {/* `labelled`: there is no hover on a phone, so the theme
                  options name themselves here instead of in a tooltip. */}
              <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                <LocaleToggle />
                <ThemeToggle labelled />
              </div>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
