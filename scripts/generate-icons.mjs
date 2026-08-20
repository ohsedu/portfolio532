/**
 * Builds every icon and logo the site needs from one vector drawing.
 *
 *   node scripts/generate-icons.mjs            # write the files
 *   node scripts/generate-icons.mjs --preview  # write, then draw them as text
 *
 * The drawing is the source; the PNGs and the React component are output. Change
 * the constants here and re-run (`npm run icons`) rather than editing an image.
 * Rasterizing is done by `sharp`, which Next already installs, so this adds no
 * dependency.
 *
 * ── Why the digits are drawn and not typeset ────────────────────────────────
 * 532 is built below out of stroked centre-lines rather than set in a font.
 * Three reasons, all of them the same reason:
 *
 *   · sharp rasterises SVG through a system font stack, so `<text>` would come
 *     out in whatever face the machine happens to have;
 *   · the OG card renders through Satori, which resolves fonts its own way; and
 *   · a drawn mark can be tuned to the box. A typeset one carries a font's side
 *     bearings and vertical metrics into a 512px square with no use for them.
 *
 * `stroke` is about a fifth of the cap height. That ratio is the whole
 * legibility story: at a quarter the counters of the 5 and the 3 close up into
 * blobs, and the digits stop being digits somewhere around a 32px tab.
 *
 * ── The three masks this has to survive ─────────────────────────────────────
 * All figures are in the 512 coordinate space.
 *
 *   Browser tabs        16–32px. Three digits at this size hold up where a word
 *                       would not, which is why they fill the plate rather than
 *                       sitting inside anything. `--preview` renders a 32px pass
 *                       so that claim can be checked rather than believed.
 *   iOS home screen     applies its own rounded mask, so the artwork is
 *                       full-bleed — a pre-rounded square would be cut twice and
 *                       show dark corners where the transparency was.
 *   Android maskable    guarantees only the middle 80% circle, i.e. radius 204.8
 *                       from the centre. A wide row of digits reaches past that,
 *                       so the maskable file gets its own scaled-down copy rather
 *                       than everything being shrunk to suit one platform.
 *
 * `measure()` prints the real numbers on every run, so changing a constant tells
 * you immediately whether it still fits.
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const APP = path.join(process.cwd(), "src", "app");
const PUBLIC = path.join(process.cwd(), "public");

/* ── Colour ──────────────────────────────────────────────────────────────── */

/** #4f46e5 — Tailwind indigo-600, and `--brand` in globals.css. */
const INDIGO = "#4f46e5";
const WHITE = "#f4f4f7";

/* ── Geometry (512 space) ────────────────────────────────────────────────── */

const round = (n) => Math.round(n * 100) / 100;

const SIZE = 512;

/**
 * Where the digits sit and how heavy they are. All four are measured on the
 * *ink*, so `glyph` × `cap` is the box a digit actually covers.
 *
 * `gap` is real space between one digit's ink and the next. Deriving it from the
 * stroke instead — insetting each cell by half a stroke — leaves exactly zero,
 * and the three digits run into each other.
 */
const LABEL = "532";
const DIGITS = { cx: 256, top: 176, cap: 160, glyph: 118, gap: 12, stroke: 32 };

/**
 * The four-point accent in the lower right, carried over from the reference.
 *
 * Kept just inside Android's guaranteed circle (radius 204.8 from the centre) on
 * purpose. Pushed all the way into the corner where a decorative mark wants to
 * sit, it is the first thing a maskable crop eats, and half a sparkle reads as a
 * rendering fault rather than as a crop.
 */
const SPARKLE = { cx: 398, cy: 398, r: 27, opacity: 0.22 };

/**
 * Glyph centre-lines, in their own box — x 13→60, y 13→84 — which `fitGlyph`
 * maps into whatever cell `DIGITS` asks for. Keeping the source coordinates
 * fixed means the shapes stay the ones that were checked by eye; only the box
 * moves.
 *
 * Cubic curves rather than arcs: an arc takes its bulge from the radius, so the
 * top of the 3 quietly overshot its box until it was drawn on screen. A cubic
 * puts the extreme point where it is written, which is how all three digits end
 * up with the same cap height.
 */
const GLYPH_BOX = { x0: 13, x1: 60, y0: 13, y1: 84 };

const GLYPHS = {
  5: "M58 13 H21 V41 H37 C50 41 60 50 60 62 C60 74 50 84 36 84 C26 84 18 80 13 73",
  3: "M15 25 C20 17 27 13 37 13 C49 13 58 20 58 31 C58 40 51 46 39 46 C52 46 61 54 61 65 C61 76 50 84 36 84 C26 84 18 80 13 73",
  2: "M13 31 C14 20 23 13 35 13 C47 13 57 20 57 32 C57 41 51 48 42 56 L13 84 H59",
};

/* ── SVG ─────────────────────────────────────────────────────────────────── */

/**
 * Rewrites a path's coordinates into a new box.
 *
 * Only the commands the glyphs above use are handled — M, L, H, V, C, all
 * absolute — because knowing which numbers are x and which are y is the whole
 * job. A relative or arc command would need its own rule, so this throws rather
 * than silently placing something in the wrong place.
 */
function fitGlyph(d, box) {
  const sx = (box.x1 - box.x0) / (GLYPH_BOX.x1 - GLYPH_BOX.x0);
  const sy = (box.y1 - box.y0) / (GLYPH_BOX.y1 - GLYPH_BOX.y0);
  const mapX = (v) => round(box.x0 + (v - GLYPH_BOX.x0) * sx);
  const mapY = (v) => round(box.y0 + (v - GLYPH_BOX.y0) * sy);

  return d
    .trim()
    .split(/(?=[A-Za-z])/)
    .map((chunk) => {
      const cmd = chunk[0];
      const nums = chunk
        .slice(1)
        .trim()
        .split(/[\s,]+/)
        .filter(Boolean)
        .map(Number);

      switch (cmd) {
        case "M":
        case "L":
          return cmd + pair(nums, mapX, mapY);
        case "H":
          return cmd + nums.map(mapX).join(" ");
        case "V":
          return cmd + nums.map(mapY).join(" ");
        case "C":
          return cmd + pair(nums, mapX, mapY);
        default:
          throw new Error(`fitGlyph: unsupported command "${cmd}"`);
      }
    })
    .join(" ");
}

function pair(nums, mapX, mapY) {
  const out = [];
  for (let i = 0; i < nums.length; i += 2) {
    out.push(mapX(nums[i]), mapY(nums[i + 1]));
  }
  return out.join(" ");
}

/** The digits' `d` attributes, placed in the square. */
function digitPaths() {
  const chars = [...LABEL];
  const advance = DIGITS.glyph + DIGITS.gap;
  const blockWidth =
    chars.length * DIGITS.glyph + (chars.length - 1) * DIGITS.gap;
  const left = DIGITS.cx - blockWidth / 2;

  /* A stroke straddles its centre-line, so the line has to sit half a width
     inside the ink box for the ink to land where `glyph` and `cap` say. */
  const inset = DIGITS.stroke / 2;

  return chars.map((char, i) => {
    const glyph = GLYPHS[char];
    if (!glyph) throw new Error(`no glyph for "${char}"`);

    const inkLeft = left + i * advance;
    return fitGlyph(glyph, {
      x0: inkLeft + inset,
      x1: inkLeft + DIGITS.glyph - inset,
      y0: DIGITS.top + inset,
      y1: DIGITS.top + DIGITS.cap - inset,
    });
  });
}

function digitsMarkup(indent = "    ") {
  return digitPaths()
    .map((d) => `<path d="${d}"/>`)
    .join(`\n${indent}`);
}

/**
 * The accent, as one closed path.
 *
 * Quadratic control points at `r * 0.2` from the centre pull each side inward,
 * which is what separates a sparkle from a diamond. The tips stay exactly on
 * ±r, so `SPARKLE.r` means what it says when the maskable maths reads it.
 */
function sparklePath() {
  const { cx, cy, r } = SPARKLE;
  const q = round(r * 0.2);
  return [
    `M${cx} ${cy - r}`,
    `Q${cx + q} ${cy - q} ${cx + r} ${cy}`,
    `Q${cx + q} ${cy + q} ${cx} ${cy + r}`,
    `Q${cx - q} ${cy + q} ${cx - r} ${cy}`,
    `Q${cx - q} ${cy - q} ${cx} ${cy - r}`,
    "Z",
  ].join(" ");
}

/**
 * @param {{ mark?: number, bg?: boolean, sparkle?: boolean }} opts
 *   mark    — scale applied to the whole mark about the centre. 1 is the drawing
 *             as designed; the maskable file passes less so the digits clear
 *             Android's circle.
 *   bg      — paint the plate. Off leaves just the white mark, which is what
 *             `measure()` needs in order to find the mark's real extent.
 *   sparkle — draw the accent. Off for `measure()`'s digits-only numbers.
 */
function svg({ mark = 1, bg = true, sparkle = true } = {}) {
  const background = bg
    ? `<rect width="${SIZE}" height="${SIZE}" fill="${INDIGO}"/>`
    : "";

  /* Scale about the centre rather than the origin, so the mark stays put. */
  const c = SIZE / 2;
  const open =
    mark === 1
      ? ""
      : `<g transform="translate(${c} ${c}) scale(${mark}) translate(${-c} ${-c})">`;
  const close = mark === 1 ? "" : "</g>";

  const accent = sparkle
    ? `<path d="${sparklePath()}" fill="${WHITE}" fill-opacity="${SPARKLE.opacity}"/>`
    : "";

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}">
  <title>${LABEL}</title>
  ${background}
  ${open}
  ${accent}
  <g fill="none" stroke="${WHITE}" stroke-width="${DIGITS.stroke}" stroke-linecap="butt" stroke-linejoin="round">
    ${digitsMarkup()}
  </g>
  ${close}
</svg>`;
}

/* ── Output ──────────────────────────────────────────────────────────────── */

/**
 * How far the mark has to shrink to clear Android's mask, with a little to
 * spare. Derived rather than typed in, so it stays right if the drawing changes.
 */
async function maskableScale() {
  const { maxRadius } = await measure();
  if (maxRadius <= 204.8) return 1;
  return Math.floor((204.8 / maxRadius) * 100) / 100;
}

async function render(svgText, size) {
  return sharp(Buffer.from(svgText))
    .resize(size, size, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png({ compressionLevel: 9 })
    .toBuffer();
}

/**
 * Puts PNGs inside an ICO container.
 *
 * ICO has carried PNG payloads since Vista, and having a real /favicon.ico
 * spares the log a 404 from clients that request it without reading the head.
 */
function ico(entries) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(entries.length, 4);

  const dir = Buffer.alloc(16 * entries.length);
  let offset = 6 + 16 * entries.length;

  entries.forEach(({ size, data }, i) => {
    const at = i * 16;
    /* 256 is written as 0 by the spec; only 16 and 32 are used here. */
    dir.writeUInt8(size >= 256 ? 0 : size, at);
    dir.writeUInt8(size >= 256 ? 0 : size, at + 1);
    dir.writeUInt16LE(1, at + 4);
    dir.writeUInt16LE(32, at + 6);
    dir.writeUInt32LE(data.length, at + 8);
    dir.writeUInt32LE(offset, at + 12);
    offset += data.length;
  });

  return Buffer.concat([header, dir, ...entries.map((e) => e.data)]);
}

/* ── Checks ──────────────────────────────────────────────────────────────── */

/** The mark's real extent, measured off the pixels rather than the maths. */
async function measure(mark = 1, sparkle = true) {
  const { data, info } = await sharp(
    Buffer.from(svg({ mark, bg: false, sparkle })),
  )
    .resize(SIZE, SIZE)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const c = SIZE / 2;
  let maxR = 0;
  const box = { minX: SIZE, maxX: 0, minY: SIZE, maxY: 0 };

  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      if (data[(y * info.width + x) * info.channels + 3] < 40) continue;
      maxR = Math.max(maxR, Math.hypot(x + 0.5 - c, y + 0.5 - c));
      box.minX = Math.min(box.minX, x);
      box.maxX = Math.max(box.maxX, x);
      box.minY = Math.min(box.minY, y);
      box.maxY = Math.max(box.maxY, y);
    }
  }

  return {
    maxRadius: Math.round(maxR),
    box: `${box.minX},${box.minY} → ${box.maxX},${box.maxY}`,
    faviconCircle: maxR <= 256 ? "ok" : "OVERFLOW",
    maskableSafe: maxR <= 204.8 ? "ok" : `over by ${Math.round(maxR - 204.8)}`,
  };
}

/**
 * Draws a rendered icon as text.
 *
 * The point is to be able to see whether the drawing holds up — a counter
 * filling in, digits touching, ink over the edge — without opening a file.
 */
async function preview(source, cols, band) {
  const buf = Buffer.isBuffer(source) ? source : Buffer.from(source);
  const { data, info } = await sharp(buf)
    .resize(cols, cols)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const at = (x, y) => {
    const i = (y * info.width + x) * info.channels;
    return { r: data[i], g: data[i + 1], b: data[i + 2], a: data[i + 3] };
  };

  const y0 = band ? Math.round((band[0] / SIZE) * cols) : 0;
  const y1 = band ? Math.round((band[1] / SIZE) * cols) : cols;
  const step = band ? 1 : 2;

  const rows = [];
  for (let y = y0; y < y1; y += step) {
    let row = "";
    for (let x = 0; x < info.width; x++) {
      const { r, g, b, a } = at(x, y);
      if (a < 40) row += " ";
      else if ((r + g + b) / 3 > 170) row += "#";
      else row += ".";
    }
    rows.push(row);
  }
  return rows.join("\n");
}

/* ── Run ─────────────────────────────────────────────────────────────────── */

const scale = await maskableScale();

/*
 * Two homes, for two different reasons.
 *
 * `src/app` — Next's file conventions. It finds `icon.svg`, `apple-icon.png` and
 *   `favicon.ico` on its own and writes the <link> tags, with a content hash on
 *   the URL. Nothing has to be declared in `metadata.icons`, and there is no way
 *   for the head and the files to drift apart.
 *
 * `public` — the sizes only `manifest.ts` names. Those need stable, unhashed
 *   paths, because the manifest is data rather than markup.
 */
const TARGETS = [
  { dir: APP, file: "apple-icon.png", size: 180, mark: 1 },
  { dir: PUBLIC, file: "icon-192.png", size: 192, mark: 1 },
  { dir: PUBLIC, file: "icon-512.png", size: 512, mark: 1 },
  { dir: PUBLIC, file: "icon-maskable-512.png", size: 512, mark: scale },
];

const written = [];
for (const t of TARGETS) {
  const buf = await render(svg({ mark: t.mark }), t.size);
  fs.writeFileSync(path.join(t.dir, t.file), buf);
  written.push({
    file: path.relative(process.cwd(), path.join(t.dir, t.file)),
    size: t.size,
    bytes: buf.length,
  });
}

/* The master. A vector favicon stays sharp at whatever size a browser picks. */
const master = svg() + "\n";
fs.writeFileSync(path.join(APP, "icon.svg"), master);
written.push({ file: "src/app/icon.svg", size: "vector", bytes: master.length });

/*
 * Rasterised at 16 and 32 rather than letting something shrink a larger file —
 * the shape survives better when the rasteriser is given the real size.
 * These two exist only inside the .ico, so they are never written out.
 */
const icoBuf = ico([
  { size: 16, data: await render(svg(), 16) },
  { size: 32, data: await render(svg(), 32) },
]);
fs.writeFileSync(path.join(APP, "favicon.ico"), icoBuf);
written.push({
  file: "src/app/favicon.ico",
  size: "16+32",
  bytes: icoBuf.length,
});

/**
 * The digits, re-indented to sit inside the component's <g>.
 *
 * Each line is trimmed first: `digitsMarkup` already carries the indentation the
 * SVG file wants, and adding to it rather than replacing it staircases the
 * second and third digit off to the right.
 */
function digitsJsx(indent) {
  return digitsMarkup()
    .split("\n")
    .map((line) => line.trim())
    .join("\n" + indent);
}

/*
 * The same drawing as a React component, for the header and footer lockups.
 *
 * Generated rather than hand-copied, so the logo on the page and the icon in the
 * browser tab cannot drift apart — a portfolio whose header and favicon disagree
 * looks like two sites stitched together.
 *
 * One difference from `icon.svg`: `rx`. The favicon is full-bleed because iOS
 * applies its own mask (see the note at the top), while in the page nothing
 * masks it, so the plate rounds its own corners. 128/512 is exactly Tailwind's
 * `rounded-lg` on the 32px box the header gives it.
 */
const PLATE_RADIUS = 128;

/*
 * No backticks anywhere in the string below: it is a template literal, and the
 * generated file is TSX, so a stray one would end the literal in the middle of
 * a component. Prose that wants to name a file names it without them.
 */
function componentSource() {
  return `/*
 * GENERATED FILE — do not edit.
 *
 * Written by scripts/generate-icons.mjs (npm run icons) from the same drawing
 * as src/app/icon.svg, so the logo in the header and the icon in the browser tab
 * cannot drift apart. Change the constants in that script and re-run it; edits
 * made here are overwritten.
 */
import type { SVGProps } from "react";

type LogoProps = Omit<SVGProps<SVGSVGElement>, "viewBox"> & {
  /** Accessible name. Omit it beside visible text, which names it already. */
  title?: string;
};

/**
 * The 532 mark: indigo plate, the digits drawn on it in white strokes.
 *
 * The colours are literal rather than currentColor. This is a brand plate, and
 * it is meant to look the same in both themes — the artwork the tab shows.
 */
export function Logo({ title, ...props }: LogoProps) {
  return (
    <svg
      viewBox="0 0 ${SIZE} ${SIZE}"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      {...props}
    >
      {title ? <title>{title}</title> : null}
      <rect width="${SIZE}" height="${SIZE}" rx="${PLATE_RADIUS}" fill="${INDIGO}" />
      <path
        d="${sparklePath()}"
        fill="${WHITE}"
        fillOpacity="${SPARKLE.opacity}"
      />
      <g
        fill="none"
        stroke="${WHITE}"
        strokeWidth="${DIGITS.stroke}"
        strokeLinecap="butt"
        strokeLinejoin="round"
      >
        ${digitsJsx("        ")}
      </g>
    </svg>
  );
}
`;
}

const component = componentSource();
const componentPath = path.join(
  process.cwd(),
  "src",
  "components",
  "icons",
  "logo.tsx",
);
fs.writeFileSync(componentPath, component);
written.push({
  file: "src/components/icons/logo.tsx",
  size: "component",
  bytes: component.length,
});

for (const { file, size, bytes } of written) {
  console.log(`  ${file.padEnd(34)} ${String(size).padEnd(7)} ${bytes}B`);
}

console.log("\nmark at 1.0 :", JSON.stringify(await measure(1)));
console.log("digits only :", JSON.stringify(await measure(1, false)));
console.log(
  `maskable    : scaled to ${scale}`,
  JSON.stringify(await measure(scale)),
);

if (process.argv.includes("--preview")) {
  console.log("\n── full icon ──\n" + (await preview(svg(), 78)));
  console.log(
    "\n── digits, close up ──\n" +
      (await preview(svg(), 132, [DIGITS.top - 20, DIGITS.top + DIGITS.cap + 20])),
  );
  console.log(
    "\n── 32px tab ──\n" + (await preview(await render(svg(), 32), 32)),
  );
}
