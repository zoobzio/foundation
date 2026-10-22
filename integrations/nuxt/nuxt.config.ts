import { fileURLToPath } from "node:url";
import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  compatibilityDate: "2025-11-06",

  imports: { autoImport: false, scan: false },

  components: {
    dirs: [],
    transform: { exclude: [/./] },
  },

  css: [fileURLToPath(new URL("./app/assets/css/reset.css", import.meta.url))],

  build: {
    transpile: ["@zoobzio/vue"],
  },

  vite: {
    optimizeDeps: { exclude: ["@zoobzio/nuxt", "@zoobzio/vue"] },
  },
});
