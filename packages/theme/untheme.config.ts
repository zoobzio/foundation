import { defineConfig } from "@untheme/kit";

/**
 * The foundation theme. The source is aurora, a preset: its resolver document
 * and its themes as layers. The config extends aurora twice. The `ramps` set
 * takes the foundation palette, so every role, every context, and every theme
 * of aurora follows it. The `roles` set takes `src/roles.json`, the color
 * roles the Nuxt layer's shell reads (`loading-indicator`, …), each a
 * reference to a role of aurora so it follows the scheme and the theme with
 * no bindings of its own. The build writes to `.output/`, and the package
 * exports the modules, the layer files, and its own preset manifest, so a
 * downstream theme names this package as its source and an app names it as
 * its preset.
 */
export default defineConfig({
  source: "npm:/@untheme/aurora",
  id: "foundation",
  name: "Foundation",
  extend: {
    description:
      "Cobalt, amber, and teal on stone greys: the default palette of the foundation design system",
    sets: {
      ramps: { sources: [{ $ref: "./src/foundation.json" }] },
      roles: { sources: [{ $ref: "./src/roles.json" }] },
    },
  },
  outDir: ".output",
});
