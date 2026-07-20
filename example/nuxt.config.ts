import { fileURLToPath } from "node:url";
import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  compatibilityDate: "2025-11-06",

  extends: [".."],

  css: ["~/assets/css/app.css", "~/assets/css/sidebar.css"],

  runtimeConfig: {
    // Absolute path so the SQLite file lands in example/.data regardless of
    // where the dev server is launched from.
    dbPath: fileURLToPath(new URL("./.data/example.sqlite", import.meta.url)),
  },

  nitro: {
    rollupConfig: {
      // node:sqlite is a prefix-only builtin that nitro's externals list does
      // not yet know about; mark it external to avoid a resolution warning.
      external: ["node:sqlite"],
    },
  },
});
