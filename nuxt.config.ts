import { fileURLToPath } from "node:url";
import { defineNuxtConfig } from "nuxt/config";

import iconSheets from "./config/icon-sheets";
import untheme from "./config/untheme";

export default defineNuxtConfig({
  compatibilityDate: "2025-11-06",
  imports: { autoImport: false, scan: false },
  components: false,
  modules: ["@vueuse/nuxt", "@untheme/nuxt", "@icon-sheets/nuxt"],
  // Absolute path so the entry resolves from any consuming app, not just
  // when this layer is the project root.
  css: [fileURLToPath(new URL("./app/assets/css/reset.css", import.meta.url))],
  untheme,
  iconSheets,
  vite: {
    optimizeDeps: { exclude: ["@zoobzio/foundation"] },
  },
  typescript: {
    tsConfig: {
      include: ["../tests/**/*"],
      compilerOptions: {
        paths: {
          "#test/*": ["../tests/*"],
        },
      },
    },
  },
});
