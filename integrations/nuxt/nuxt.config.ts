import { fileURLToPath } from "node:url";
import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  compatibilityDate: "2025-11-06",

  modules: ["@icon-sheets/nuxt", "@untheme/nuxt"],

  imports: { autoImport: false, scan: false },

  components: {
    dirs: [],
    transform: { exclude: [/./] },
  },

  iconSheets: { preset: "@zoobzio/icons" },

  untheme: { preset: "@zoobzio/theme" },

  css: [fileURLToPath(new URL("./app/assets/css/reset.css", import.meta.url))],

  build: {
    transpile: ["@zoobzio/vue"],
  },

  vite: {
    optimizeDeps: { exclude: ["@zoobzio/nuxt", "@zoobzio/vue"] },
  },
});
