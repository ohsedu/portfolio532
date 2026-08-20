import { ArrowUpRight, Download, MapPin } from "lucide-react";

import { Badge, StatusDot } from "@/components/ui/badge";
import { buttonClasses } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { Section, SectionHeader } from "@/components/ui/section";
import { Spotlight } from "@/components/ui/spotlight";
import { experience } from "@/lib/data/profile";
import { getDictionary, l, localeHtmlLang, type Locale } from "@/lib/i18n";
import { person } from "@/lib/site";

/** `YYYY-MM` → a UTC-anchored `Date`, so no local offset can shift the month. */
function monthToDate(month: string) {
  return new Date(`${month}-01T00:00:00Z`);
}

/**
 * `2022-03` → `2022.03` (ko) or `Mar 2022` (en).
 *
 * Korean résumés use the dotted numeric form, which `ko-KR` renders as
 * `2022. 3.`, so that locale is assembled from the formatted parts instead —
 * still going through `Intl` for the numbering system, but with the separator
 * and the zero padding under our control.
 */
function formatMonth(month: string, locale: Locale) {
  const date = monthToDate(month);

  if (locale === "ko") {
    const parts = new Intl.DateTimeFormat(localeHtmlLang.ko, {
      year: "numeric",
      month: "2-digit",
      timeZone: "UTC",
    }).formatToParts(date);
    const year = parts.find((part) => part.type === "year")?.value ?? "";
    const monthPart = parts.find((part) => part.type === "month")?.value ?? "";
    return `${year}.${monthPart.padStart(2, "0")}`;
  }

  return new Intl.DateTimeFormat(localeHtmlLang.en, {
    year: "numeric",
    month: "short",
    timeZone: "UTC",
  }).format(date);
}

/** `4 years, 6 months` / `4년 6개월`. Both halves come from `Intl`, so neither
 * the unit names nor the way they are joined has to be translated by hand. */
/**
 * Human-readable length of a role.
 *
 * A role that is still running needs *some* "as of" month, and `new Date()` is
 * not an option: the page is prerendered, so a clock read would bake a stale
 * number into the HTML and then disagree with the client on hydration.
 * `person.asOf` keeps the render deterministic and shares the value site-wide.
 */
function formatDuration(start: string, end: string | null, locale: Locale) {
  const from = monthToDate(start);
  const to = monthToDate(end ?? person.asOf);

  // Both endpoint months count, which is how a résumé date range is read.
  const total =
    (to.getUTCFullYear() - from.getUTCFullYear()) * 12 +
    (to.getUTCMonth() - from.getUTCMonth()) +
    1;

  const tag = localeHtmlLang[locale];
  const unit = (value: number, name: "year" | "month") =>
    new Intl.NumberFormat(tag, {
      style: "unit",
      unit: name,
      unitDisplay: "long",
    }).format(value);

  const years = Math.floor(total / 12);
  const months = total % 12;

  const parts: string[] = [];
  if (years > 0) parts.push(unit(years, "year"));
  // Keep the months term for sub-year stints, and drop it on exact years.
  if (months > 0 || years === 0) parts.push(unit(months, "month"));

  return new Intl.ListFormat(tag, { style: "short", type: "unit" }).format(parts);
}

/**
 * Reverse-chronological timeline.
 *
 * `experience` is already newest-first, so the array order is the render order.
 * The rail and its nodes are drawn outside the reveal on purpose: the scaffold
 * is there the moment the section scrolls in, and only the cards fade up.
 */
export function Experience({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);

  return (
    <Section id="experience">
      <SectionHeader
        label={dict.experience.label}
        heading={dict.experience.heading}
        lede={dict.experience.lede}
      />

      {/* Positioning context for the rail — an `<ol>` may only contain `<li>`. */}
      <div className="relative">
        <span
          aria-hidden
          className="from-line via-line absolute top-8 bottom-6 left-2 w-px -translate-x-1/2 bg-gradient-to-b to-transparent"
        />

        <ol className="space-y-6 sm:space-y-8">
          {experience.map((job, index) => {
            const isCurrent = job.end === null;

            return (
              <li key={job.id} className="relative pl-10 sm:pl-14">
                {/* Node. Centred on the rail via the same `left-2` offset. */}
                <span
                  aria-hidden
                  className="bg-bg border-line-strong absolute top-8 left-2 grid size-4 -translate-x-1/2 place-items-center rounded-full border"
                >
                  {isCurrent ? (
                    <StatusDot />
                  ) : (
                    <span className="bg-line-strong size-2 rounded-full" />
                  )}
                </span>

                <Reveal delay={index * 0.08}>
                  <Spotlight
                    className={
                      isCurrent
                        ? "border-brand/25 bg-surface/70 ring-edge rounded-2xl border backdrop-blur-sm"
                        : "border-line bg-surface/60 hover:border-line-strong rounded-2xl border transition-colors"
                    }
                  >
                    <div className="p-6 sm:p-8">
                      {/* Dates lead the card, matching the eyebrow rhythm of
                          `SectionHeader`. Current roles say so in words, not
                          just with the pulsing node. */}
                      <p className="text-fg-subtle flex flex-wrap items-center gap-x-3 gap-y-2 label-sm">
                        <span>
                          <time dateTime={job.start}>
                            {formatMonth(job.start, locale)}
                          </time>
                          <span className="mx-1.5">–</span>
                          {job.end ? (
                            <time dateTime={job.end}>
                              {formatMonth(job.end, locale)}
                            </time>
                          ) : (
                            <span className="text-brand-accent">
                              {dict.experience.present}
                            </span>
                          )}
                        </span>

                        <Badge
                          tone="outline"
                          className="normal-case tracking-normal"
                        >
                          {formatDuration(job.start, job.end, locale)}
                        </Badge>
                      </p>

                      <h3 className="mt-3 text-xl font-semibold tracking-tight sm:text-2xl">
                        {l(job.role, locale)}
                      </h3>

                      <p className="text-fg-muted mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                        {job.companyUrl ? (
                          <a
                            href={job.companyUrl}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="hover:text-brand-accent focus-visible:outline-ring group inline-flex items-center gap-1 font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
                          >
                            {job.company}
                            <ArrowUpRight
                              className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                              aria-hidden
                            />
                          </a>
                        ) : (
                          <span className="font-medium">{job.company}</span>
                        )}

                        <span className="text-fg-subtle inline-flex items-center gap-1.5">
                          <MapPin className="size-3.5" aria-hidden />
                          {l(job.location, locale)}
                        </span>
                      </p>

                      <p className="text-fg-muted mt-5 leading-relaxed">
                        {l(job.summary, locale)}
                      </p>

                      <div className="mt-6">
                        <h4 className="text-fg-subtle label-xs">
                          {dict.experience.highlightsLabel}
                        </h4>
                        <ul className="text-fg-muted marker:text-brand-accent/70 mt-3 list-disc space-y-2.5 pl-5 text-sm leading-relaxed">
                          {job.highlights.map((highlight) => (
                            <li key={highlight.en}>{l(highlight, locale)}</li>
                          ))}
                        </ul>
                      </div>

                      {/*
                        `role="list"` is not redundant here: Tailwind's Preflight
                        sets `list-style: none`, which drops the implicit list
                        role in Safari/VoiceOver — and with it the `aria-label`
                        that is the only thing naming these chips.
                      */}
                      <ul
                        role="list"
                        aria-label={dict.experience.stackLabel}
                        className="mt-6 flex flex-wrap gap-1.5"
                      >
                        {job.stack.map((tech) => (
                          <li key={tech}>
                            {/* The current role's stack is what I work in
                                today, so it gets the brand tone. */}
                            <Badge tone={isCurrent ? "brand" : "neutral"}>
                              {tech}
                            </Badge>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Spotlight>
                </Reveal>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Rendered only once `resumePath` points at a real file, so the page
          never ships a download button that 404s. */}
      {person.resumePath ? (
        <Reveal delay={0.1} className="mt-12 pl-10 sm:mt-14 sm:pl-14">
          <a
            href={person.resumePath}
            download
            type="application/pdf"
            className={buttonClasses({
              variant: "secondary",
              size: "lg",
              className: "group",
            })}
          >
            <Download
              className="size-4 transition-transform group-hover:translate-y-0.5"
              aria-hidden
            />
            {dict.experience.downloadResume}
            {/* The link leaves the page as a file, so say which kind. */}
            <span className="sr-only"> (PDF)</span>
          </a>
        </Reveal>
      ) : null}
    </Section>
  );
}
