import { defineNuxtConfig } from "nuxt/config";

import untheme from "./config/untheme";

export default defineNuxtConfig({
  compatibilityDate: "2025-11-06",

  // Explicit imports only — no auto-import of components, composables, or Vue/Nuxt APIs.
  // Framework symbols are pulled from "#imports"; foundation-owned code via relative paths.
  // `scan: false` also skips registry-building over composables/ and utils/ — everything
  // "#imports" provides comes from framework/module presets, not the dir scan.
  imports: { autoImport: false, scan: false },
  components: false,

  modules: ["@vueuse/nuxt", "@untheme/nuxt"],

  untheme,

  typescript: {
    tsConfig: {
      // The generated tsconfig only includes app code — pull tests/ in so the
      // support layer (contract mocks especially) is typechecked, and teach TS
      // the #test alias (vitest resolves it via vitest.config).
      include: ["../tests/**/*"],
      compilerOptions: {
        paths: {
          "#test/*": ["../tests/*"],
        },
      },
    },
  },
});
