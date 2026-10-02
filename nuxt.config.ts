import { fileURLToPath } from "node:url";
import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  compatibilityDate: "2025-11-06",

  imports: { autoImport: false, scan: false },

  components: false,

  modules: ["@vueuse/nuxt"],

  css: [fileURLToPath(new URL("./app/assets/css/reset.css", import.meta.url))],

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
