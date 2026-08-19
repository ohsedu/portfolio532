import { ArrowUp } from "lucide-react";
import Link from "next/link";

import { BrandIcon } from "@/components/icons/brand";
import { Container } from "@/components/ui/section";
import { socials } from "@/lib/data/profile";
import { getDictionary, type Locale } from "@/lib/i18n";
import { navSections, person, repoUrl } from "@/lib/site";

/**
 * Server-rendered: nothing here is interactive apart from links, so it stays
 * out of the client bundle. The year is read at build time, which is fine for a
 * statically prerendered page — and avoids `new Date()` during render, which is
 * disallowed on prerendered routes.
 */
const buildYear = new Date().getFullYear();

export function Footer({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const home = `/${locale}`;

  return (
    <footer className="border-line bg-bg-subtle border-t">
      <Container className="py-14">
        <div className="flex flex-col gap-10 lg:flex-row lg:justify-between">
          <div className="max-w-xs">
            <Link
              href={home}
              className="focus-visible:outline-ring inline-flex items-center gap-2.5 rounded-full focus-visible:outline-2 focus-visible:outline-offset-4"
            >
              <span className="bg-brand text-brand-fg grid size-8 place-items-center rounded-lg font-mono text-xs font-bold tracking-tighter">
                {person.initials}
              </span>
              <span className="text-sm font-semibold tracking-tight">
                {person.name[locale]}
              </span>
            </Link>

            <p className="text-fg-muted mt-4 text-sm leading-relaxed">
              {dict.meta.description}
            </p>

            <ul className="mt-5 flex items-center gap-2">
              {socials.map((social) => (
                <li key={social.id}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="border-line bg-surface text-fg-muted hover:text-brand-accent hover:border-brand/40 focus-visible:outline-ring grid size-9 place-items-center rounded-full border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
                  >
                    <BrandIcon
                      name={social.icon}
                      title={social.label}
                      className="size-4"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-x-10 gap-y-8 sm:grid-cols-3">
            <nav aria-labelledby="footer-nav-sections">
              <h2
                id="footer-nav-sections"
                className="text-fg-subtle mb-3 font-mono text-[11px] tracking-[0.18em] uppercase"
              >
                {dict.nav.home}
              </h2>
              <ul className="space-y-2.5">
                {navSections.map((section) => (
                  <li key={section}>
                    <Link
                      href={`${home}#${section}`}
                      className="text-fg-muted hover:text-fg text-sm transition-colors"
                    >
                      {dict.nav[section]}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <nav aria-labelledby="footer-nav-projects">
              <h2
                id="footer-nav-projects"
                className="text-fg-subtle mb-3 font-mono text-[11px] tracking-[0.18em] uppercase"
              >
                {dict.projects.label}
              </h2>
              <ul className="space-y-2.5">
                <li>
                  <Link
                    href={`${home}/projects`}
                    className="text-fg-muted hover:text-fg text-sm transition-colors"
                  >
                    {dict.projects.indexHeading}
                  </Link>
                </li>
                {repoUrl ? (
                  <li>
                    <a
                      href={repoUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="text-fg-muted hover:text-fg text-sm transition-colors"
                    >
                      {dict.footer.sourceCode}
                    </a>
                  </li>
                ) : null}
              </ul>
            </nav>

            <div>
              <h2 className="text-fg-subtle mb-3 font-mono text-[11px] tracking-[0.18em] uppercase">
                {dict.contact.label}
              </h2>
              <ul className="space-y-2.5">
                <li>
                  <a
                    href={`mailto:${person.email}`}
                    className="text-fg-muted hover:text-brand-accent text-sm break-all transition-colors"
                  >
                    {person.email}
                  </a>
                </li>
                <li className="text-fg-subtle text-sm">
                  {person.location[locale]}
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-line mt-12 flex flex-col-reverse items-start justify-between gap-4 border-t pt-6 sm:flex-row sm:items-center">
          <p className="text-fg-subtle text-xs">
            © {buildYear} {person.name[locale]}. {dict.footer.rights}.
            <span className="mx-2 opacity-40">·</span>
            {dict.footer.builtWith}
          </p>

          <a
            href="#top"
            className="text-fg-muted hover:text-fg focus-visible:outline-ring inline-flex items-center gap-1.5 rounded-full text-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            {dict.footer.backToTop}
            <ArrowUp className="size-3.5" aria-hidden />
          </a>
        </div>
      </Container>
    </footer>
  );
}
