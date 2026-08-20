import { ArrowDown, ArrowRight } from "lucide-react";
import Link from "next/link";

import { BrandIcon } from "@/components/icons/brand";
import { StatusDot } from "@/components/ui/badge";
import { buttonClasses } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { RotatingWord } from "@/components/ui/rotating-word";
import { Container } from "@/components/ui/section";
import { socials, stats } from "@/lib/data/profile";
import { getDictionary, type Locale } from "@/lib/i18n";
import { person } from "@/lib/site";

/**
 * The one section allowed to be expensive.
 *
 * Everything decorative is `aria-hidden` and sits behind a `-z-10` layer, so
 * the reading order is eyebrow → h1 → lede → actions → stats.
 */
export function Hero({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const home = `/${locale}`;

  const statItems = [
    { value: `${stats.years}+`, label: dict.hero.stats.years },
    { value: `${stats.projects}`, label: dict.hero.stats.projects },
    { value: stats.commits.toLocaleString(locale), label: dict.hero.stats.commits },
  ];

  return (
    <section
      id="hero"
      className="relative flex min-h-[calc(100dvh-4rem)] items-center overflow-hidden py-20"
    >
      {/* ── Backdrop ─────────────────────────────────────────────────────── */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        {/* Grid, faded out toward the bottom so it does not collide with About. */}
        <div className="bg-grid mask-fade-b absolute inset-0 opacity-[0.55] dark:opacity-30" />

        {/* Two offset blooms give the indigo some depth instead of one flat wash. */}
        <div className="bloom animate-float absolute -top-40 left-1/2 size-[38rem] -translate-x-1/2 opacity-70 dark:opacity-90" />
        <div
          className="bloom absolute top-1/3 -right-32 size-[26rem] opacity-40 dark:opacity-60"
          style={{ animationDelay: "-4s" }}
        />

        {/* Softens the whole thing into the page background at the edges. */}
        <div className="from-bg via-bg/0 to-bg absolute inset-0 bg-gradient-to-b" />
      </div>

      <Container>
        <div className="flex flex-col items-start gap-16 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl">
            <Reveal from="none">
              <p className="border-line bg-surface/70 text-fg-muted inline-flex items-center gap-2.5 rounded-full border px-3.5 py-1.5 text-xs backdrop-blur-sm">
                <StatusDot />
                {dict.hero.eyebrow}
              </p>
            </Reveal>

            <Reveal delay={0.08}>
              <h1 className="mt-7 text-4xl leading-[1.08] font-semibold tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
                <span className="text-fg-muted block text-lg font-normal tracking-normal sm:text-xl">
                  {person.name[locale]}
                </span>
                <span className="mt-3 block">
                  {dict.hero.headlinePrefix}{" "}
                  <RotatingWord words={dict.hero.headlineWords} />
                </span>
              </h1>
            </Reveal>

            <Reveal delay={0.16}>
              <p className="text-fg-muted mt-7 max-w-xl text-base leading-relaxed sm:text-lg">
                {dict.hero.lede}
              </p>
            </Reveal>

            <Reveal delay={0.24}>
              <div className="mt-10 flex flex-wrap items-center gap-3">
                <Link
                  href={`${home}#projects`}
                  className={buttonClasses({ size: "lg", className: "group" })}
                >
                  {dict.hero.ctaPrimary}
                  <ArrowRight
                    className="size-4 transition-transform group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </Link>

                <Link
                  href={`${home}#contact`}
                  className={buttonClasses({ variant: "secondary", size: "lg" })}
                >
                  {dict.hero.ctaSecondary}
                </Link>

                <ul className="ml-1 flex items-center gap-1.5">
                  {socials.map((social) => (
                    <li key={social.id}>
                      <a
                        href={social.href}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="text-fg-subtle hover:text-brand-accent hover:bg-surface-hover focus-visible:outline-ring grid size-10 place-items-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
                      >
                        <BrandIcon
                          name={social.icon}
                          title={social.label}
                          className="size-[1.05rem]"
                        />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>

          {/* ── Stats ──────────────────────────────────────────────────────── */}
          <Reveal delay={0.32} from="left" className="w-full lg:w-auto">
            <dl className="border-line bg-surface/60 ring-edge grid grid-cols-3 gap-px overflow-hidden rounded-2xl border backdrop-blur-sm lg:grid-cols-1 lg:gap-0">
              {statItems.map((item, index) => (
                <div
                  key={item.label}
                  className={
                    index > 0
                      ? "border-line border-l lg:border-l-0 lg:border-t"
                      : undefined
                  }
                >
                  <div className="px-5 py-5 lg:px-8 lg:py-6">
                    <dt className="text-fg-subtle label-xs">
                      {item.label}
                    </dt>
                    <dd className="text-brand-accent mt-1.5 font-mono text-2xl font-semibold tracking-tight lg:text-3xl">
                      {item.value}
                    </dd>
                  </div>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        {/* ── Scroll hint ─────────────────────────────────────────────────── */}
        <Reveal delay={0.45} className="mt-20 hidden sm:block">
          <a
            href="#about"
            className="text-fg-subtle hover:text-fg focus-visible:outline-ring group inline-flex items-center gap-2 rounded-full label-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-4"
          >
            <span className="border-line group-hover:border-brand grid size-8 place-items-center rounded-full border transition-colors">
              <ArrowDown
                className="size-3.5 transition-transform group-hover:translate-y-0.5"
                aria-hidden
              />
            </span>
            {dict.hero.scrollHint}
          </a>
        </Reveal>
      </Container>
    </section>
  );
}
