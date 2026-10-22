import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  compatibilityDate: "2025-11-06",

  imports: { autoImport: false, scan: false },

  components: {
    dirs: [],
    transform: { exclude: [/./] },
  },

  build: {
    transpile: ["@zoobzio/vue"],
  },

  vite: {
    optimizeDeps: { exclude: ["@zoobzio/nuxt", "@zoobzio/vue"] },
  },
});
