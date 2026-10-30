/**
 * Generates the foundation palette as DTCG JSON. The script writes one token
 * document, `src/foundation.json`, with the name, the description, and the
 * eight ramps of the theme. The ramps come from the generator of aurora, so
 * they share its lightness ladder and its chroma curve, and every stop sits
 * where aurora's does. The palette rebinds the `ramps` set of aurora, and
 * every role of aurora resolves from it.
 *
 * To change a color, edit its seed and run `pnpm generate && pnpm format`.
 */
import { writeFile } from "node:fs/promises";

import { palette } from "@untheme/aurora/ramp";

/**
 * The foundation palette: cobalt, amber, and teal on stone greys. The
 * `error`, `success`, and `warning` seeds are those of aurora.
 */
const FOUNDATION = {
  name: "Foundation",
  description:
    "Cobalt, amber, and teal on stone greys: the default palette of the foundation design system",
  seeds: {
    primary: "#2f6fed",
    secondary: "#e08a1e",
    tertiary: "#1b9e8a",
    error: "#dc4a5e",
    success: "#57a53c",
    warning: "#c08a1f",
    neutral: "#77787a",
    "neutral-variant": "#747a86",
  },
};

await writeFile(
  new URL("../src/foundation.json", import.meta.url),
  `${JSON.stringify(palette(FOUNDATION), null, 2)}\n`,
);

console.log("generated src/foundation.json");
