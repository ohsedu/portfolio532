import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /*
   * Still the mechanism in Next 16. `js`/`jsx`/`ts`/`tsx` have to stay in the
   * list or every existing route stops being recognised.
   */
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],

  experimental: {
    /*
     * Enables `src/app/global-not-found.tsx`.
     *
     * Needed because this app has no root layout above its dynamic `[locale]`
     * segment, which the Next docs name as one of the two cases where a 404
     * cannot be composed from `layout.tsx` + `not-found.tsx`. Without it an
     * unmatched URL falls through to the framework default, which ignores the
     * app theme and carries none of the site design.
     */
    globalNotFound: true,
  },

  /*
   * Deliberately absent:
   *   - `output: 'export'` — static export cannot run `src/proxy.ts`, and would
   *     also cost next/image optimization.
   *   - a `webpack` block — Turbopack is the default bundler in 16 and a webpack
   *     config makes the build fail.
   *   - `cacheComponents` — off by default in 16.3.1; enabling it switches the
   *     rendering model and removes the `dynamicParams` segment config this app
   *     relies on.
   */
};

const withMDX = createMDX({
  options: {
    /*
     * Plugins are named as STRINGS, not imported functions. Turbopack hands the
     * MDX pipeline to Rust, which cannot receive a JS function — an imported
     * plugin object silently fails there. Options must be JSON-serializable for
     * the same reason.
     */
    remarkPlugins: ["remark-gfm"],
    rehypePlugins: [
      "rehype-slug",
      /*
       * Dual-theme highlighting. Shiki emits both palettes as CSS custom
       * properties on every token, and `globals.css` picks one with the `.dark`
       * class — so switching theme needs no re-highlight and no second bundle.
       *
       * Every option here is a plain string for the Turbopack reason above.
       */
      [
        "@shikijs/rehype",
        {
          themes: { light: "github-light", dark: "github-dark-default" },
          defaultColor: false,
          cssVariablePrefix: "--shiki-",
        },
      ],
    ],
  },
});

export default withMDX(nextConfig);
