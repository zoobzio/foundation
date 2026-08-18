import { defineNuxtConfig } from "nuxt/config";

import iconSheets from "./config/icon-sheets";
import untheme from "./config/untheme";

export default defineNuxtConfig({
  compatibilityDate: "2025-11-06",
  imports: { autoImport: false, scan: false },
  components: false,
  modules: ["@vueuse/nuxt", "@untheme/nuxt", "@icon-sheets/nuxt"],
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
