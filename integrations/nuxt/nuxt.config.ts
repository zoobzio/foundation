import { fileURLToPath } from "node:url";
import { defineNuxtConfig } from "nuxt/config";

import { prefix } from "@zoobzio/icons";
import icons from "@zoobzio/icons/config";
import { sets } from "@zoobzio/icons/sets";

export default defineNuxtConfig({
  compatibilityDate: "2025-11-06",

  modules: ["@icon-sheets/nuxt"],

  imports: { autoImport: false, scan: false },

  components: {
    dirs: [],
    transform: { exclude: [/./] },
  },

  // The foundation icon contract, as the default. An app's own `iconSheets`
  // merges over it, so its aliases join these and a redeclared alias
  // rebinds the foundation's.
  iconSheets: { ...icons, sets, prefix },

  css: [fileURLToPath(new URL("./app/assets/css/reset.css", import.meta.url))],

  build: {
    transpile: ["@zoobzio/vue"],
  },

  vite: {
    optimizeDeps: { exclude: ["@zoobzio/nuxt", "@zoobzio/vue"] },
  },
});
